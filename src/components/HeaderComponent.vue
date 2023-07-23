<template>
  <header>
    <div class="d-flex justify-content-between py-3 px-3 px-md-5 h-100">
      <h1 class="lh-base mb-0 d-flex flex-center">
        <slot></slot>
      </h1>

      <div class="d-flex flex-center flex-end ms-auto">
        <small
          class="avatar me-2 rounded-5 h4 mb-0 fw-normal bg-primary text-white d-flex justify-content-center align-items-center"
        >
          {{ initials || "A" }}
        </small>
        <h3 class="text-muted text-break fw-medium text-capitalize mb-0">
          Hi! {{ userName || "There" }}
        </h3>
      </div>

      <div class="d-flex align-items-center">
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
import { ref, onMounted, computed } from "vue";
import { StorageKeys, StorageService } from "../services/storage.service";
import { applicationContainer } from "../container/container";

//Dependencies
const storageService = applicationContainer.resolve(StorageService);

//Variables
const userName = ref("");
const showSidebarToggler = ref(false);

onMounted(() => {
  getUserName();
  handleResize();
  window.addEventListener("resize", handleResize);
});

// Fetch user name from the local storage.
function getUserName() {
  storageService.get(StorageKeys.User).subscribe((result) => {
    userName.value = result as string;
  });
}

/** Handle Sidebar dynamic properties on resize **/
const handleResize = () => {
  if (window.matchMedia("(max-width: 1199px)").matches) {
    showSidebarToggler.value = true;
  } else {
    showSidebarToggler.value = false;
  }
};

/** Compute user initials based on name provided on login. **/
const initials = computed<string>(() => {
  const name = userName.value;
  const initialsMatch = name?.match(/\b(\w)/g);
  return initialsMatch?.slice(0, 2).join("").toUpperCase() || "";
});
</script>

<style scoped lang="scss">
@import "../theme/variables";

.app-logo {
  max-height: 40px;
  max-width: 100px;
}

header {
  min-height: 65px;
}

.avatar {
  height: 25px;
  min-width: 25px;
  width: 25px;
}

.navbar-toggler-icon {
  height: 3px;
  width: 26px;
}
</style>
