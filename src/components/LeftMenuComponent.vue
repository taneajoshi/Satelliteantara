<template>
  <aside
    :class="[
      'offcanvas offcanvas-start bg-dark py-4 sidebar-width border-0',
      isSidebarOpen ? 'show' : '',
    ]"
    :data-bs-backdrop="!isSidebarOpen"
    tabindex="-1"
    id="offcanvasNavbar"
    aria-labelledby="offcanvasNavbarLabel"
  >
    <div class="offcanvas-header d-block px-4 py-0">
      <!-- App Logo -->
      <div class="d-flex justify-content-between align-items-center">
        <div class="logo">
          <router-link to="/dashboard">
            <img
              src="../assets/images/app-logo.png"
              class="w-100"
              alt="app logo"
            />
          </router-link>
        </div>
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
      <ul class="'list-unstyled mt-4 mb-0 overflow-x-auto d-flex flex-column',">
        <li data-bs-dismiss="offcanvas">
          <RouterLink
            to="/jobs"
            class="text-decoration-none py-3 px-4 d-flex align-items-center text-muted"
          >
            <span class="icon-wrapper me-2 fs-6">
              <font-awesome-icon icon="fa-solid fa-briefcase" />
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Jobs</span>
          </RouterLink>
        </li>
        <li data-bs-dismiss="offcanvas">
          <RouterLink
            to="/profile"
            class="text-decoration-none py-3 px-4 d-flex align-items-center text-muted"
          >
            <span class="icon-wrapper me-2 fs-6">
              <font-awesome-icon icon="fa-solid fa-user" />
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Profile</span>
          </RouterLink>
        </li>
        <li data-bs-dismiss="offcanvas">
          <RouterLink
            to="/settings"
            class="text-decoration-none py-3 px-4 d-flex align-items-center text-muted"
          >
            <span class="icon-wrapper me-2 fs-6">
              <font-awesome-icon icon="fa-solid fa-gear" />
            </span>
            <span class="h3 mb-0 lh-1 fw-medium">Settings</span>
          </RouterLink>
        </li>

        <li class="mt-auto d-flex align-items-center py-3 px-4">
          <small
            class="avatar me-2 rounded-5 h4 mb-0 fw-normal bg-primary text-white d-flex justify-content-center align-items-center"
          >
            {{ initials }}
          </small>
          <h3 class="text-muted text-break fw-medium text-capitalize mb-0">
            User Name
          </h3>
        </li>

        <!-- Logout -->
        <li data-bs-dismiss="offcanvas">
          <button
            class="btn border-0 w-100 py-3 px-4 d-flex align-items-center"
          >
            <span class="icon-wrapper me-2 fs-5 logout-icon">
              <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
            </span>
            <span class="h3 text-secondary mb-0 lh-1 fw-medium"> Logout </span>
          </button>
        </li>
        <!-- /Logout -->
      </ul>
    </nav>
    <!-- /Nav Items -->
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const authUser = ref(null);
const isSidebarOpen = ref(true);

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

const initials = computed<string>(() => {
  const name = authUser.value?.profile.name;
  const initialsMatch = name?.match(/\b(\w)/g);
  return initialsMatch?.slice(0, 2).join("").toUpperCase() || "";
});

const handleResize = () => {
  if (window.matchMedia("(max-width: 1199px)").matches) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
};
</script>

<style scoped lang="scss">
@import "../theme/variables";

.sidebar-width {
  width: $sidebar-width;
}

.profile-progress-bar {
  height: 8px;
}

.avatar {
  height: 25px;
  min-width: 25px;
  width: 25px;
}

.icon-wrapper {
  width: 20px;

  svg {
    color: $text-muted;
  }

  &.logout-icon {
    width: 25px;

    svg {
      color: $secondary;
    }
  }
}

nav {
  a,
  button {
    transition: 300ms ease !important;

    &.router-link-active {
      background-color: $secondary;
      color: #fff !important;

      .icon-wrapper > svg {
        filter: brightness(5);
      }
    }

    &:hover:not(.router-link-active) {
      background-color: #7c3a2d1b;
    }
  }

  ul {
    height: calc(100vh - var(--app-left-menu-height, 95px));

    &.candidate-menu-list {
      --app-left-menu-height: 170px;
    }
  }
}

.logo {
  max-height: 40px;
  max-width: 80px;
}

.offcanvas {
  transition: all 0.3s linear;
}
</style>
