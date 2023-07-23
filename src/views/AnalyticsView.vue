<template>
  <PageComponent>
    <template #pageTitle> Analytics </template>
    <div class="charts-grid container-xxl p-0 overflow-hidden">
      <candleCharComponent />
      <columnChartComponent />
      <pieChartComponent />
    </div>
  </PageComponent>
</template>

<script setup lang="ts">
import PageComponent from "../components/PageComponent.vue";
import candleCharComponent from "../components/charts/candleCharComponent.vue";
import columnChartComponent from "../components/charts/columnChartComponent.vue";
import pieChartComponent from "../components/charts/pieChartComponent.vue";
</script>

<style lang="scss">
.container-xxl {
  max-width: 1400px; /* Adjust as needed */
  margin: 0 auto;
}

/* Define the grid layout */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  overflow: visible;

  & > div {
    background: #0a2a3e84;
    padding: 60px;
  }
}
</style>
