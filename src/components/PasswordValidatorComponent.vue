<template>
  <ul v-if="!hasValidChecks" class="list-unstyled mt-3 p-3">
    <li
      v-for="item in passwordRequirements"
      :key="item.key"
      class="d-flex align-items-center mb-2 h3"
    >
      <font-awesome-icon
        :icon="item.isValid ? ['fas', 'circle-check'] : ['fas', 'circle-xmark']"
        :class="['me-2 h4 mb-0', item.isValid ? 'text-success' : 'text-danger']"
      />
      <small :class="[item.isValid ? 'text-success' : 'text-danger']">{{
        item.label
      }}</small>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { AbstractControl, FormControl } from "universal-reactive-forms";
import { Subscription } from "rxjs";

interface PasswordItem {
  key: string;
  label: string;
  isValid: boolean;
}

interface Props {
  formControl: AbstractControl | FormControl;
}

const props = defineProps<Props>();

const passwordRequirements = ref<PasswordItem[]>([]);

const updatePasswordItems = () => {
  const value = props.formControl.value;

  passwordRequirements.value = [
    {
      key: "smallChar",
      label: "Password must contain at least one Small Letter.",
      isValid: /[a-z]/.test(value),
    },
    {
      key: "capitalChar",
      label: "Password must contain at least one Capital Letter.",
      isValid: /[A-Z]/.test(value),
    },
    {
      key: "numericValue",
      label: "Password must contain at least one Numeric.",
      isValid: /[0-9]/.test(value),
    },
    {
      key: "specialChar",
      label: "Password must contain at least one Special character (!@#$&*).",
      isValid: /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
    },
    {
      key: "noSpace",
      label: "Password must not contain spaces.",
      isValid: !/\s/.test(value),
    },
    {
      key: "minLength",
      label: "The field must have a minimum length of 8.",
      isValid: value.length >= 8,
    },
  ];
};

let valueChangesSubscription: Subscription | null = null;

const hasValidChecks = computed(() => {
  return passwordRequirements.value.every(
    (requirement: PasswordItem) => requirement.isValid
  );
});

onMounted(() => {
  updatePasswordItems();
  valueChangesSubscription = (
    props.formControl as FormControl
  ).valueChanges.subscribe(updatePasswordItems) as any;
});

onUnmounted(() => {
  valueChangesSubscription?.unsubscribe();
});
</script>

<style lang="scss" scoped>
ul {
  background-color: #dc354615;

  li:last-child {
    margin-bottom: 0 !important;
  }
}
</style>
