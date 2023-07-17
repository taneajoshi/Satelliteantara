import { Directive, DirectiveBinding } from "vue";
import { FormControl, FormGroup } from "universal-reactive-forms";
import { filter, fromEvent, merge } from "rxjs";

export const FormValidity: Directive = {
  created(
    el: HTMLFormElement,
    binding: DirectiveBinding<FormGroup | FormControl>
  ) {
    const handleFormValidityCheck = ($event: Event) => {
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      binding.value.markAllAsTouched();
      binding.value.validate();
    };

    const submitEvent$ = fromEvent<SubmitEvent>(el, "submit").pipe(
      filter(() => binding.value.invalid)
    );
    const keydownEvent$ = fromEvent<KeyboardEvent>(el, "keydown").pipe(
      filter((event) => event.key === "Enter" && binding.value.invalid)
    );

    const mergedEvents = merge(submitEvent$, keydownEvent$);
    mergedEvents.subscribe(handleFormValidityCheck);
  },
};
