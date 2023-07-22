<template>
  <PageComponent>
    <template #pageTitle> Dashboard </template>
    <div class="container-xxl p-0">
      <FilterComponent @applyFilter="handleFilter"></FilterComponent>
      <SatellitesListing
        :filteredData="filteredSatelliteData"
      ></SatellitesListing>
      <!-- <PaginationComponent :pagination="pagination" /> -->
    </div>
  </PageComponent>
</template>

<script setup lang="ts">
import PageComponent from "../components/PageComponent.vue";
import FilterComponent from "../components/FilterComponent.vue";
import SatellitesListing from "../components/SatelliteListing.vue";
import { SatelliteInterface } from "../interfaces/SatelliteInterface";
import { FilterInterface } from "../interfaces/filterInterface";
import { onMounted, ref } from "vue";
import { SatelliteService } from "../services/satellite.service";
import { LoadingService } from "../services/loading.service";
import { ToastService } from "../services/toast.service";
import { applicationContainer } from "../container/container";
import { finalize, switchMap } from "rxjs";

// Dependency Injections
const satelliteService = applicationContainer.resolve(SatelliteService);
const loadingService = applicationContainer.resolve(LoadingService);
const toastService = applicationContainer.resolve(ToastService);

const originalSatelliteData = ref<SatelliteInterface[] | null>([]);
const filteredSatelliteData = ref<SatelliteInterface[] | null>([]);

// Load the original data on mount
onMounted(() => {
  loadSatellitesData();
});

function handleFilter(filterData: FilterInterface) {
  console.log("handle filter", filterData);
  filteredSatelliteData.value = applyFilters(
    originalSatelliteData.value as any,
    filterData
  );
}

function loadSatellitesData() {
  const pagination = {
    page: 1,
    pageSize: 10,
  };
  loadingService
    .show()
    .pipe(switchMap(() => satelliteService.listPaginated(pagination)))
    .pipe(finalize(() => loadingService.hide().subscribe()))
    .subscribe({
      next: (result) => {
        originalSatelliteData.value = result;
        filteredSatelliteData.value = result;
      },
      error: () => {
        toastService.danger("Unable to load satellites.").subscribe();
      },
    });
}

// Function to apply filters to the data
function applyFilters(
  data: SatelliteInterface[],
  filters: FilterInterface
): SatelliteInterface[] {
  console.log("apply", data, filters);
  // ... Implement the logic to filter the data based on the applied filters ...

  const { search } = filters;
  if (search) {
    return data.filter(
      (satellite) =>
        satellite.name.toLowerCase().includes(search.toLowerCase()) ||
        satellite.noradCatId.includes(search)
    );
  }

  return data;
}
</script>
