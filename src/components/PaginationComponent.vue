<script setup lang="ts">
import { PaginatedInterface } from "../interfaces/paginatedInterface";
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  pagination: PaginatedInterface<any>;
}>();

const route = useRoute();

const hasNext = computed(
  () => props.pagination.page < props.pagination.totalPages
);

const urlForPage = (page: number): string => {
  const currentPath = route.path;
  const searchParams = new URLSearchParams(route.query as any);
  searchParams.set("page", page.toString());
  return `${currentPath}?${searchParams.toString()}`;
};

interface PageCounter {
  page: number;
  isActive: boolean;
}

const paginationCounter = computed<PageCounter[]>(() => {
  const pages: PageCounter[] = [];

  if (props.pagination.page !== 1) {
    pages.push({
      isActive: false,
      page: props.pagination.page - 1,
    });
  }

  pages.push({
    isActive: true,
    page: props.pagination.page,
  });

  if (props.pagination.page < props.pagination.totalPages) {
    pages.push({
      isActive: false,
      page: props.pagination.page + 1,
    });
  }

  return pages;
});

const hasPrevious = computed(() => props.pagination.page > 1);
</script>

<template>
  <nav aria-label="page navigation" class="mt-4 mt-md-5">
    <ul class="pagination justify-content-between mb-0 position-relative">
      <li class="page-item prev">
        <router-link
          :to="urlForPage(props.pagination.page - 1)"
          class="page-link border-0 rounded-0 cursor-pointer flex-center"
          v-if="hasPrevious"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-left" class="me-2" />
          Previous
        </router-link>
      </li>
      <li>
        <ul
          class="pagination position-absolute start-50 top-50 translate-middle"
        >
          <li
            class="page-item mx-2"
            :class="{ active: pageCount.isActive }"
            v-for="(pageCount, pageIndex) in paginationCounter"
            :key="pageIndex"
          >
            <router-link
              :to="urlForPage(pageCount.page)"
              class="page-link cursor-pointer rounded-1"
              >{{ pageCount.page }}</router-link
            >
          </li>
        </ul>
      </li>
      <li class="page-item next">
        <router-link
          :to="urlForPage(props.pagination.page + 1)"
          class="page-link border-0 rounded-0 cursor-pointer flex-center"
          v-if="hasNext"
        >
          Next
          <font-awesome-icon icon="fa-solid fa-arrow-right" class="ms-2" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.pagination {
  min-height: 36px;
}
</style>
