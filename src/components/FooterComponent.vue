<template>
  <footer class="text-center p-3">
    <small class="text-muted mb-0 h4 fw-normal">
      &copy; {{ currentYear }} Satellantara. All Rights Reserved.
    </small>
  </footer>
</template>

<script lang="ts">
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>
