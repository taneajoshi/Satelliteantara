<template>
  <div class="flex-center flex-column p-3 text-center min-vh-100">
    <h1 class="text-secondary">404</h1>
    <h2 class="fs-2">Page not found.</h2>
    <h3 class="fw-normal">
      I think you are lost. Don't worry, it happens even to the best
      interstellar travelers.
    </h3>
    <h3>Feel free to stargaze at our dashboard.</h3>
    <router-link to="/dashboard" class="btn btn-primary text-capitalize mt-4">
      Go to Dashboard
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 6rem;
  opacity: 0.8;
}

h2 {
  font-size: 1.2rem !important;
}

h3 {
  font-size: 14px !important;
}
</style>
