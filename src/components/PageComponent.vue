<template>
  <LeftMenuComponent />
  <main class="d-flex flex-column min-vh-100">
    <HeaderComponent><slot name="pageTitle"></slot></HeaderComponent>
    <div class="content d-grid flex-grow-1 px-3 py-3 px-md-5 w-100">
      <slot></slot>
    </div>
    <FooterComponent />
  </main>
</template>

<script lang="ts" setup>
import HeaderComponent from "./HeaderComponent.vue";
import LeftMenuComponent from "./LeftMenuComponent.vue";
import FooterComponent from "./FooterComponent.vue";
</script>

<style lang="scss" scoped>
@import "../theme/variables";

.content {
  max-width: 1920px;
  margin-inline: auto;
}
</style>
