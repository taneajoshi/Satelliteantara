import { Directive, DirectiveBinding } from "vue";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

export const PasswordToggle: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const input = el.previousElementSibling as HTMLInputElement;
    const eyeIcon = el as HTMLElement;

    const handlePasswordToggle = () => {
      const inputType = input.getAttribute("type");
      input.setAttribute(
        "type",
        inputType === "password" ? "text" : "password"
      );

      eyeIcon.setAttribute(
        "changeIcon",
        inputType === "password" ? "true" : "false"
      );
    };

    const clickEvent$ = fromEvent(el, "click").pipe(
      filter(() => !binding.value)
    );

    clickEvent$.subscribe(handlePasswordToggle);
  },
};
