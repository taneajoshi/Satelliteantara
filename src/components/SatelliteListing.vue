<template>
  <section>
    <!-- Filters -->
    <div class="filters mb-4 p-1">
      <form
        @keydown.enter.prevent="getFilteredSatellites"
        v-form-validity="filterForm"
      >
        <!-- Search -->
        <ErrorComponent :form-control="filterForm.get('search')">
          <div class="input-group position-relative">
            <input
              ref="searchInput"
              class="form-control rounded-3"
              type="text"
              placeholder="Search"
              aria-label="Search"
              v-model="filterForm.get('search').value"
              v-input-validity="filterForm.get('search')"
              @input="debouncedSearch"
            />
            <span
              class="input-group-text position-absolute text-secondary translate-middle-y top-50"
            >
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            </span>
          </div>
        </ErrorComponent>
        <!-- /Search -->

        <div class="d-flex gap-3 flex-wrap mt-3">
          <!-- Country Code -->
          <div class="form-group flex-grow-1">
            <ErrorComponent :form-control="filterForm.get('countryCode')">
              <select
                class="form-select"
                v-model="filterForm.get('countryCode').value"
                @change="getFilteredSatellites"
              >
                <option value="">Country</option>
                <option
                  v-for="country in countries"
                  :key="country.code"
                  :value="country.code"
                >
                  {{ country.name }}
                </option>
              </select>
            </ErrorComponent>
          </div>
          <!-- /Country Code -->

          <!-- Orbit -->
          <div class="form-group flex-grow-1">
            <ErrorComponent :form-control="filterForm.get('orbitCode')">
              <select
                class="form-select"
                v-model="filterForm.get('orbitCode').value"
                @change="getFilteredSatellites"
              >
                <option value="">Orbit</option>
                <option
                  v-for="orbit in orbits"
                  :key="orbit.code"
                  :value="orbit.code"
                >
                  {{ orbit.name }}
                </option>
              </select>
            </ErrorComponent>
          </div>
          <!-- /Orbit -->

          <!-- Object Type-->
          <div class="form-group flex-grow-1">
            <ErrorComponent :form-control="filterForm.get('objectType')">
              <select
                class="form-select"
                v-model="filterForm.get('objectType').value"
                @change="getFilteredSatellites"
              >
                <option value="">ObjectType</option>
                <option
                  v-for="type in objectTypes"
                  :key="type.code"
                  :value="type.code"
                >
                  {{ type.name }}
                </option>
              </select>
            </ErrorComponent>
          </div>
          <!-- /Object Type -->
        </div>
      </form>
    </div>
    <!-- /Filters -->

    <div class="mb-4 h4">
      <small>Took {{ loadingTime }} ms</small>
    </div>

    <div class="d-flex flex-wrap" v-if="satelliteData.length > 1">
      <div
        class="satellite-card d-flex gap-4 align-items-center mb-5"
        v-for="(data, index) in satelliteData"
        :key="data.noradCatId"
      >
        <div class="img-wrapper border-secondary highlight me-2">
          <img
            :src="shuffledImageUrls[index]"
            class="h-100 w-100"
            alt="satellite image"
          />
        </div>
        <div class="details h3 fw-light mb-0">
          <p>Name: {{ data.name ?? "Not available" }}</p>
          <p>Norad Cat Id: {{ data.noradCatId ?? "Not available" }}</p>
          <p>Orbit Code: {{ data.orbitCode ?? "Not available" }}</p>
          <p>Object Type: {{ data.objectType ?? "Not available" }}</p>
          <p>Country: {{ data.countryCode ?? "Not available" }}</p>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="h4 mb-0 text-center p-5 min-vh-45 flex-center">
        No matching satellite with such data in current page.
      </div>
    </template>
  </section>

  <div class="d-flex align-items-center justify-content-between mt-4">
    <button
      class="btn btn-outline-secondary"
      @click="goToPreviousPage"
      :disabled="!hasPrevious"
    >
      Previous
    </button>
    <div class="current-page text-secondary h4 mb-0">
      Page: {{ currentPage }}
    </div>
    <button
      class="btn btn-outline-secondary"
      @click="goToNextPage"
      :disabled="!hasNext"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { BehaviorSubject, debounceTime, finalize, switchMap } from "rxjs";
import { onMounted, ref, watch } from "vue";
import { applicationContainer } from "../container/container";
import { SatelliteInterface } from "../interfaces/SatelliteInterface";
import { LoadingService } from "../services/loading.service";
import { SatelliteService } from "../services/satellite.service";
import { ToastService } from "../services/toast.service";
import { SatelliteImages } from "../assets/data/satellitesImage.json";
import { useRoute, useRouter } from "vue-router";
import { FormControl, FormGroup } from "universal-reactive-forms";
import { noWhiteSpaceValidation } from "../utils/validations";
import { PaginationQuery } from "../interfaces/paginatedInterface";
import { FilterInterface } from "../interfaces/filterInterface";
import ErrorComponent from "./ErrorComponent.vue";
import { InputValidity as vInputValidity } from "../directives/input-validity";
import { FormValidity as vFormValidity } from "../directives/form-validity";

// Dependency Injections
const satelliteService = applicationContainer.resolve(SatelliteService);
const loadingService = applicationContainer.resolve(LoadingService);
const toastService = applicationContainer.resolve(ToastService);

//Variables
const satelliteData = ref<SatelliteInterface[]>([]);
const shuffledImageUrls = ref<string[]>([]);
const route = useRoute();
const router = useRouter();
const filterOptions = ref<Filter>({});
const searchParams = new URLSearchParams(route.query as any);
const searchInputRef = ref<HTMLInputElement | null>(null);
const loadingTime = ref(0);
const currentPage = ref<number>(1);
const hasPrevious = ref<boolean>(false);
const hasNext = ref<boolean>(false);
const searchInputValue$ = new BehaviorSubject<string>("");

interface Filter {
  [key: string]: string | undefined;
}

onMounted(() => {
  loadSatellitesData();
  initFiltersFromRouteParams(route.query);
});

/**
 * Filter Form
 **/
const filterForm = new FormGroup({
  search: new FormControl("", [noWhiteSpaceValidation]),
  countryCode: new FormControl(""),
  orbitCode: new FormControl(""),
  objectType: new FormControl(""),
});

/**
 * Initialize the filters depending on query params on url
 **/
function initFiltersFromRouteParams(query: any) {
  const filterValues = filterForm.getRawValue();

  Object.entries(filterValues).forEach(([key]) => {
    filterOptions.value[key] = query[key] ? query[key]?.toString() : "";
    filterForm.get(key.toString()).value = query[key] || "";
  });

  currentPage.value = Number(route.query.page) || 1;
}

// Define the lists of countries, orbits, and object types here.
const countries = ref([
  { code: "US", name: "United States of America" },
  { code: "PRC", name: "People's Republic of China" },
  { code: "INDO", name: "Indonesia" },
  { code: "TBD", name: "To be decided" },
]);

const orbits = ref([
  { code: "LEO", name: "Leo" },
  { code: "HEO", name: "Heo" },
  { code: "CIS", name: "Commonwealth of Independent States " },
  { code: "GEO", name: "Geo" },
]);

const objectTypes = ref([
  { code: "DEBRIS", name: "Debris" },
  { code: "PAYLOAD", name: "Payload" },
]);

/**
 * Shuffle dummy images to use as satellite image.
 **/
function shuffleImages() {
  shuffledImageUrls.value = SatelliteImages.sort(() => 0.5 - Math.random());
}

const debouncedSearch = () => {
  const inputValue = searchInputRef.value?.value || "";
  searchInputValue$.next(inputValue);
};

/**
 * Load Filtered and paginated Satellite data
 **/
function loadSatellitesData(
  pagination: PaginationQuery = { page: 1, pageSize: 10 }
) {
  const paginationOption: Required<PaginationQuery> = {
    page: pagination.page || 1,
    pageSize: pagination.pageSize || 10,
  };

  // Record the start time
  const startTime = performance.now();

  loadingService
    .show()
    .pipe(
      switchMap(() =>
        satelliteService.listPaginated(
          paginationOption,
          filterOptions.value as FilterInterface
        )
      )
    )
    .pipe(
      finalize(() => {
        const endTime = performance.now();
        loadingTime.value = +(endTime - startTime).toFixed(2);
        loadingService.hide().subscribe();
      })
    )
    .subscribe({
      next: (result) => {
        shuffleImages();
        satelliteData.value = result;
      },
      error: () => {
        toastService.danger("Unable to load satellites.").subscribe();
      },
    });
}

/**
 * Fetch filtered jobs.
 **/
function getFilteredSatellites() {
  const filterValues = filterForm.getRawValue();
  console.log("get filtered", filterValues);
  const currentPath = route.path;

  Object.entries(filterValues).forEach(([control, value]) => {
    searchParams.set(control, value);
    filterOptions.value[control] = value;
  });

  router.push(`${currentPath}?${searchParams.toString()}`);
}

/**
 * Subscribe to search input once input is ready
 **/
searchInputValue$.pipe(debounceTime(300)).subscribe(() => {
  const filterValues = filterForm.getRawValue();
  console.log("get filtered", filterValues);
  const currentPath = route.path;

  Object.entries(filterValues).forEach(([control, value]) => {
    searchParams.set(control, value);
    filterOptions.value[control] = value;
  });

  router.push(`${currentPath}?${searchParams.toString()}`);
});

currentPage.value = Number(route.query.page) || 1;

// Function to navigate to the next page
function goToNextPage() {
  if (hasNext.value) {
    currentPage.value++;
    updateQueryParams();
  }
}

// Function to navigate to the previous page
function goToPreviousPage() {
  if (hasPrevious.value) {
    currentPage.value--;
    updateQueryParams();
  }
}

// Function to update the query parameters with the current page value
function updateQueryParams() {
  const currentPath = route.path;
  searchParams.set("page", currentPage.value.toString());
  router.push(`${currentPath}?${searchParams.toString()}`);
}

// Watch for changes in satelliteData to update pagination status
watch(satelliteData, () => {
  const totalPages = Math.ceil(27000 / 10); // Assuming page size is 10

  // Update pagination status
  hasPrevious.value = currentPage.value > 1;
  hasNext.value = currentPage.value < totalPages;
});

/**
 * Watch for route/params to change and then call the load filters
 **/
watch(route, () => loadSatellitesData(route.query), {
  immediate: true,
  deep: true,
});

watch(route, () => initFiltersFromRouteParams(route.query), {
  immediate: true,
  deep: true,
});
</script>

<style lang="scss" scoped>
@import "../theme/variables";

.satellite-card {
  width: calc(50% - 0.75rem);
}

.highlight {
  box-shadow: $neon-shadow;

  --neon-glow: #69edd0;
}

.img-wrapper {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.input-group {
  input.is-touched {
    padding-right: 50px;

    & + span {
      right: 30px;
    }
  }
}

.min-vh-45 {
  min-height: 45vh;
}
</style>
