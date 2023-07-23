<template>
  <div>
    <apexchart
      ref="chart"
      type="pie"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    // Dummy Data
    const series = ref([44, 55, 13, 43, 22]);

    // Chart options
    const chartOptions = ref({
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    });

    return {
      series,
      chartOptions,
    };
  },
};
</script>
