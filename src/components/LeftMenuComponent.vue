<template>
  <aside
    :class="[
      'offcanvas offcanvas-start bg-dark py-4 sidebar-width border-0',
      isSidebarOpen ? 'show' : '',
    ]"
    :data-bs-backdrop="!isSidebarOpen"
    id="offcanvasNavbar"
    aria-labelledby="offcanvasNavbarLabel"
    :data-bs-scroll="isSidebarOpen"
  >
    <div class="offcanvas-header d-block px-4 py-0">
      <!-- App Logo -->
      <div class="d-flex justify-content-between align-items-center">
        <LogoComponent />
        <!-- Close Button -->
        <button
          v-if="!isSidebarOpen"
          type="button"
          data-bs-dismiss="offcanvas"
          class="btn border-0 p-0 fs-5 text-primary"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
      <!-- /App Logo -->
    </div>

    <!-- Nav Items -->
    <nav>
      <ul class="list-unstyled mt-4 mb-0 overflow-x-auto d-flex flex-column">
        <li :data-bs-dismiss="dismiss">
          <RouterLink
            to="/dashboard"
            class="text-decoration-none py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 text-secondary fs-6">
              <i class="bi bi-cpu"></i>
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Dashboard</span>
          </RouterLink>
        </li>
        <li :data-bs-dismiss="dismiss">
          <RouterLink
            to="/analytics"
            class="text-decoration-none py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 fs-6">
              <i class="bi bi-bar-chart text-secondary"></i>
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Analytics</span>
          </RouterLink>
        </li>
        <li :data-bs-dismiss="dismiss">
          <RouterLink
            to="/star-ship"
            class="text-decoration-none py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 fs-6">
              <i class="bi bi-rocket-fill text-secondary"></i>
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Starship</span>
          </RouterLink>
        </li>
        <li :data-bs-dismiss="dismiss">
          <RouterLink
            to="/astronauts"
            class="text-decoration-none py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 fs-6">
              <font-awesome-icon
                icon="fa-solid fa-user-astronaut"
                class="text-secondary"
              />
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Astronauts</span>
          </RouterLink>
        </li>

        <!-- Logout -->
        <li :data-bs-dismiss="dismiss" class="mt-auto">
          <router-link
            to="/"
            class="btn border-0 w-100 py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 logout-icon">
              <font-awesome-icon
                icon="fa-solid fa-arrow-right-from-bracket"
                class="text-secondary fs-6"
              />
            </span>
            <span class="text-secondary mb-0 lh-1 fw-semibold"> Logout </span>
          </router-link>
        </li>
        <!-- /Logout -->
      </ul>
    </nav>
    <!-- /Nav Items -->
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import LogoComponent from "./LogoComponent.vue";

const isSidebarOpen = ref(true);
const dismiss = ref("none");

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.matchMedia("(max-width: 1199px)").matches) {
    isSidebarOpen.value = false;
    dismiss.value = "offcanvas";
  } else {
    isSidebarOpen.value = true;
    dismiss.value = "none";
  }
};
</script>

<style scoped lang="scss">
@import "../theme/variables";

.sidebar-width {
  width: $sidebar-width;
}

.icon-wrapper {
  width: 20px;
}

nav {
  li {
    span {
      color: $text-muted;
    }
  }

  a,
  button {
    transition: 300ms ease !important;

    &.router-link-active {
      background-color: $secondary;
      box-shadow: 0 0 15px $secondary, inset 0 0 15px $secondary;

      span {
        color: $primary !important;
      }

      .icon-wrapper > i {
        color: $primary !important;
      }
    }

    &:hover:not(.router-link-active) {
      background-color: #69edd020;
    }
  }

  ul {
    height: calc(100vh - var(--app-left-menu-height, 95px));

    &.candidate-menu-list {
      --app-left-menu-height: 170px;
    }
  }
}

.offcanvas {
  transition: all 0.3s linear;
}
</style>
