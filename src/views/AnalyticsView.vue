<template>
  <PageComponent>
    <template #pageTitle> Analytics </template>
    <div class="container-xxl p-0 overflow-hidden">
      <radialChartComponent />
      <candleCharComponent />
      <columnChartComponent />
      <realtimeLineChartComponent />
      <pieChartComponent />
    </div>
  </PageComponent>
</template>

<script setup lang="ts">
import PageComponent from "../components/PageComponent.vue";
import radialChartComponent from "../components/charts/radialChartComponent.vue";
import candleCharComponent from "../components/charts/candleCharComponent.vue";
import columnChartComponent from "../components/charts/columnChartComponent.vue";
import realtimeLineChartComponent from "../components/charts/realtimeLineChartComponent.vue";
import pieChartComponent from "../components/charts/pieChartComponent.vue";
</script>
