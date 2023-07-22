<template>
  <div class="filters mb-4 p-1">
    <!-- Filters -->
    <form
      @keydown.enter.prevent="getFilteredSatellites"
      v-form-validity="filterForm"
    >
      <!-- Search -->
      <ErrorComponent :form-control="filterForm.get('search')">
        <div class="input-group position-relative">
          <input
            class="form-control rounded-3"
            type="text"
            placeholder="Search"
            aria-label="Search"
            v-model="filterForm.get('search').value"
            v-input-validity="filterForm.get('search')"
            @input="triggerSearch"
          />
          <span
            class="input-group-text position-absolute text-secondary translate-middle-y top-50"
          >
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </span>
        </div>
      </ErrorComponent>
      <!-- /Search -->

      <div class="d-flex gap-3 flex-wrap mt-4">
        <!-- Country Code -->
        <div class="form-group flex-grow-1">
          <ErrorComponent :form-control="filterForm.get('countryCode')">
            <select
              class="form-select"
              v-model="filterForm.get('countryCode').value"
              @change="triggerSearch"
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
              @change="triggerSearch"
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
              @change="triggerSearch"
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
    <!-- /Filters -->
  </div>
</template>

<script setup lang="ts">
import { FormControl, FormGroup } from "universal-reactive-forms";
import ErrorComponent from "./ErrorComponent.vue";
import { InputValidity as vInputValidity } from "../directives/input-validity";
import { FormValidity as vFormValidity } from "../directives/form-validity";
import { noWhiteSpaceValidation } from "../utils/validations";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";

interface Filter {
  [key: string]: string | undefined;
}

const emit = getCurrentInstance()?.emit as any;

const route = useRoute();
const router = useRouter();
const filterOptions = ref<Filter>({});
const searchParams = new URLSearchParams(route.query as any);
const searchSubject = new Subject<any>();
const filterChangeSubject = new Subject<any>();

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

onMounted(() => {
  initFiltersFromRouteParams(route.query);
});

function initFiltersFromRouteParams(query: any) {
  const filterValues = filterForm.getRawValue();

  Object.entries(filterValues).forEach(([key]) => {
    filterOptions.value[key] = query[key] ? query[key]?.toString() : "";
    filterForm.get(key.toString()).value = query[key] || "";
  });

  triggerSearch();
}

const filterForm = new FormGroup({
  search: new FormControl("", [noWhiteSpaceValidation]),
  countryCode: new FormControl(""),
  orbitCode: new FormControl(""),
  objectType: new FormControl(""),
});

function triggerSearch() {
  emit("applyFilter", filterForm.getRawValue());
}

searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
  getFilteredSatellites();
});

filterChangeSubject
  .pipe(debounceTime(400), distinctUntilChanged())
  .subscribe((formData) => {
    getFilteredSatellites(formData);
  });

/**
 * Fetch filtered jobs.
 * **/
function getFilteredSatellites(formData: FormData) {
  console.log("get filtered");
  const filterValues = formData as FormData;
  const currentPath = route.path;

  Object.entries(filterValues).forEach(([control, value]) => {
    searchParams.set(control, value);
    filterOptions.value[control] = value;
  });

  router.push(`${currentPath}?${searchParams.toString()}`);

  triggerSearch();
}

watch(route, () => initFiltersFromRouteParams(route.query), {
  immediate: true,
  deep: true,
});

watch(
  () => filterForm.getRawValue(),
  (formData) => {
    searchSubject.next(formData);
  },
  { deep: true, immediate: true }
);

watch(
  () => filterForm.getRawValue(),
  (formData) => {
    filterChangeSubject.next(formData);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.input-group {
  input.is-touched {
    padding-right: 50px;

    & + span {
      right: 30px;
    }
  }
}
</style>
