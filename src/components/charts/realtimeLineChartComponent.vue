<template>
  <div>
    <apexchart
      ref="chart"
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const lastDate = ref(new Date().getTime());
    const data = ref<any>([]);
    const dataLimit = 30; // Limit the number of data points to 30

    // Function to generate random data
    function getRandomNumber(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateChart() {
      const newTime = lastDate.value + 1000;
      data.value.push({
        x: newTime,
        y: getRandomNumber(10, 90),
      });

      // Limit the number of data points
      if (data.value.length > dataLimit) {
        data.value.shift(); // Remove the oldest data point
      }

      lastDate.value = newTime;

      // Update the series data with the new data array
      series.value[0].data = data.value;

      // Update the chart with the new series data
      chart.value?.updateSeries(series.value);

      // Update the x-axis range to show the last 12 seconds of data
      chartOptions.value.xaxis.range.min = lastDate.value - 12000;
      chartOptions.value.xaxis.range.max = lastDate.value;
    }

    // Data
    const series = ref([
      {
        name: "Dynamic Data",
        data: data.value,
      },
    ]);

    // Chart options
    const chartOptions = ref({
      chart: {
        id: "realtime",
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Dynamic Updating Chart",
        align: "left",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        range: 12000, // Show the last 12 seconds of data initially
      },
      yaxis: {
        max: 100,
      },
      legend: {
        show: false,
      },
    });

    const chart = ref<any>(null);

    onMounted(() => {
      // Render the chart and save the chart reference
      chart.value = new ApexCharts(
        document.querySelector("#chart"),
        chartOptions.value
      );
      chart.value.render();

      // Update the chart every 1 second
      setInterval(updateChart, 1000);
    });

    return {
      series,
      chartOptions,
    };
  },
};
</script>
