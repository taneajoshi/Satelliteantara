<template>
  <header>
    <div class="d-flex justify-content-between py-3 py-md-4 px-3 px-md-5 h-100">
      <h1 class="lh-base mb-0">
        <slot></slot>
      </h1>
      <div class="app-logo">
        <router-link to="/">
          <img
            src="../assets/images/app-logo.png"
            class="h-100 w-100 object-fit-contain"
            alt="app logo"
          />
        </router-link>
      </div>

      <div class="d-flex flex-end ms-auto align-items-center">
        <button
          v-if="showSidebarToggler"
          class="navbar-toggler ms-4 flex-center flex-column"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon bg-primary rounded-4 mb-1"></span>
          <span class="navbar-toggler-icon bg-primary rounded-4 mb-1"></span>
          <span class="navbar-toggler-icon bg-primary rounded-4 mb-1"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showSidebarToggler = ref(false);

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.matchMedia("(max-width: 1199px)").matches) {
    showSidebarToggler.value = true;
  } else {
    showSidebarToggler.value = false;
  }
};
</script>

<style scoped lang="scss">
.app-logo {
  max-height: 40px;
  max-width: 80px;
}

header {
  min-height: 74px;

  @media (width >= 768px) {
    min-height: 90px;
  }
}

.navbar-toggler-icon {
  height: 3px;
  width: 26px;
}
</style>
