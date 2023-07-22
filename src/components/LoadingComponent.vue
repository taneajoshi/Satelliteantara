<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface MessageProps {
  message?: string;
}

defineProps<MessageProps>();
</script>

<template>
  <div class="modal-dialog">
    <div class="modal-content p-4 bg-transparent">
      <div class="modal-body p-0">
        <p class="h2 mb-0 flex-center">
          {{ message }}
          <font-awesome-icon
            class="text-white"
            icon="fa-solid fa-circle-notch"
            :spin="true"
            size="2x"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-dialog {
  top: 50%;
}

body.modal-open {
  overflow: hidden;
  padding-right: 15px; // Adjust as needed for your layout
}

.modal-dialog,
.modal.show {
  .modal-dialog {
    transform: translateY(-50%);
  }
}
</style>
