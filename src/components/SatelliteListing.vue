<template>
  <section>
    <div class="mb-4 h4"><small>Took 1.2 ms</small></div>
    <div class="d-flex flex-wrap">
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
          <p>Name: {{ data.name }}</p>
          <p>Norad Cat Id: {{ data.noradCatId }}</p>
          <p>Orbit Code: {{ data.orbitCode ?? "Not available" }}</p>
          <p>Object Type: {{ data.objectType }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { SatelliteInterface } from "../interfaces/SatelliteInterface";
import { SatelliteImages } from "../assets/data/satellitesImage.json";

const satelliteData = ref<SatelliteInterface[] | null>([]);
const shuffledImageUrls = ref<string[]>([]);

onMounted(() => {
  shuffleImages();
});

const props = defineProps<{
  filteredData: any;
}>();

function shuffleImages() {
  shuffledImageUrls.value = SatelliteImages.sort(() => 0.5 - Math.random());
}

watch(props, () => {
  satelliteData.value = props.filteredData;
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
</style>
