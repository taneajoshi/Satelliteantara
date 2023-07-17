import { Directive, DirectiveBinding } from "vue";
import { fromEvent, Subscription } from "rxjs";
import { FormControl } from "universal-reactive-forms";

type BoundElement = HTMLElement & {
  subscription?: Subscription | null;
  blurSubscription: Subscription | null;
};

function updateValidityState(
  binding: DirectiveBinding<
    FormControl | { ele: string; control: FormControl }
  >,
  el: BoundElement
) {
  const control =
    binding.value instanceof FormControl
      ? binding.value
      : binding.value.control;

  const element =
    binding.value instanceof FormControl
      ? el
      : el.querySelector(binding.value.ele);

  if (!element) {
    throw new Error(
      `Element not found inside main element with value ${
        (binding.value as any).ele
      }`
    );
  }

  element.classList.remove("is-touched");
  if (control.touched) {
    element.classList.add("is-touched");
  }

  if (control.invalid) {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    return;
  }

  element.classList.add("is-valid");
  element.classList.remove("is-invalid");
}

export const InputValidity: Directive = {
  created(
    el: BoundElement,
    binding: DirectiveBinding<
      FormControl | { ele: string; control: FormControl }
    >
  ) {
    const control =
      binding.value instanceof FormControl
        ? binding.value
        : binding.value.control;
    const element =
      binding.value instanceof FormControl
        ? el
        : el.querySelector(binding.value.ele);

    if (!element) {
      throw new Error(
        `Element not found inside main element with value ${
          (binding.value as any).ele
        }`
      );
    }

    updateValidityState(binding, el);
    el.subscription = control.valueChanges.subscribe({
      next: () => updateValidityState(binding, el),
    }) as any;
    el.blurSubscription = fromEvent(element, "blur").subscribe({
      next: () => {
        control.markAsTouched();
        control.validate();
        updateValidityState(binding, el);
      },
    });
  },
  beforeUnmount(el: BoundElement) {
    el.subscription?.unsubscribe();
    el.blurSubscription?.unsubscribe();
  },
};
