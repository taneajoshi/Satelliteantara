<template>
  <PageComponent>
    <template #pageTitle> Dashboard </template>
    <div class="container-xxl p-0">
      <SatellitesListing></SatellitesListing>
      <!-- <PaginationComponent :pagination="pagination" /> -->
    </div>
  </PageComponent>
</template>

<script setup lang="ts">
import PageComponent from "../components/PageComponent.vue";
import SatellitesListing from "../components/SatelliteListing.vue";
</script>
