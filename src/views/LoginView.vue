<template>
  <div
    class="min-vh-100 d-flex justify-content-center login-wrapper mx-auto p-3 p-md-5 flex-column"
  >
    <div class="mb-3">
      <LogoComponent />
    </div>
    <h1 class="w-75 mb-3">New-age Space Cartographers</h1>
    <form
      @submit.prevent="login"
      @keypress.enter.prevent="login"
      v-form-validity="loginForm"
    >
      <div class="form-group mb-3">
        <ErrorComponent :form-control="loginForm.get('name')">
          <input
            type="text"
            placeholder="Enter your name"
            class="form-control"
            v-model="loginForm.get('name').value"
            v-input-validity="loginForm.get('name')"
          />
        </ErrorComponent>
      </div>

      <div class="form-group mb-3">
        <ErrorComponent :form-control="loginForm.get('password')">
          <div class="position-relative password-wrapper">
            <input
              @input="showPasswordValidations = true"
              type="password"
              class="form-control fw-medium"
              placeholder="Create a password"
              v-model="loginForm.get('password').value"
              v-input-validity="loginForm.get('password')"
            />
            <font-awesome-icon
              :icon="changePasswordIcon ? ['far', 'eye'] : ['far', 'eye-slash']"
              class="h3 text-muted position-absolute cursor-pointer translate-middle-y top-50"
              @click="changePasswordIcon = !changePasswordIcon"
              v-password-toggle
            />
          </div>
        </ErrorComponent>
        <PasswordValidatorComponent
          v-if="showPasswordValidations"
          :formControl="passwordFormControl"
        />
      </div>

      <div class="form-group mb-3">
        <ErrorComponent :form-control="loginForm.get('confirmPassword')">
          <div class="position-relative password-wrapper">
            <input
              type="password"
              name="confirmPassword"
              class="form-control"
              placeholder="Confirm new password"
              v-model="loginForm.get('confirmPassword').value"
              v-input-validity="loginForm.get('confirmPassword')"
            />
            <font-awesome-icon
              :icon="
                changeConfirmPasswordIcon
                  ? ['far', 'eye']
                  : ['far', 'eye-slash']
              "
              class="h3 text-muted position-absolute cursor-pointer translate-middle-y top-50"
              @click="changeConfirmPasswordIcon = !changeConfirmPasswordIcon"
              v-password-toggle
            />
          </div>
        </ErrorComponent>
      </div>

      <button type="submit" class="btn btn-primary login">Login</button>
    </form>
  </div>
  <LoginBgComponent />
</template>

<script setup lang="ts">
import { FormControl, FormGroup } from "universal-reactive-forms";
import LoginBgComponent from "../components/LoginBgComponent.vue";
import LogoComponent from "../components/LogoComponent.vue";
import {
  ConfirmPasswordValidator,
  Required,
  strongPasswordValidation,
} from "../utils/validations";
import { FormValidity as vFormValidity } from "../directives/form-validity";
import { InputValidity as vInputValidity } from "../directives/input-validity";
import { PasswordToggle as vPasswordToggle } from "../directives/password-toggle";
import ErrorComponent from "../components/ErrorComponent.vue";
import PasswordValidatorComponent from "../components/PasswordValidatorComponent.vue";
import { ref } from "vue";
import { MaxLength } from "../utils/validations";
import { applicationContainer } from "../container/container";
import { LoadingService } from "../services/loading.service";
import { ToastService } from "../services/toast.service";
import { StorageKeys, StorageService } from "../services/storage.service";
import { finalize, switchMap } from "rxjs";
import { useRouter } from "vue-router";

//Variables
const showPasswordValidations = ref(false);
const changeConfirmPasswordIcon = ref(false);
const changePasswordIcon = ref(false);
const router = useRouter();

//Dependency Injections
const loadingService = applicationContainer.resolve(LoadingService);
const toastService = applicationContainer.resolve(ToastService);
const storageService = applicationContainer.resolve(StorageService);

const createLoginForm = () => {
  const form = new FormGroup({
    name: new FormControl("", [Required]),
    password: new FormControl("", [
      Required,
      MaxLength(16),
      strongPasswordValidation(),
    ]),
    confirmPassword: new FormControl("", [Required]),
  });

  //Set Confirm password validation after form is set to send the controls to verify
  form
    .get("confirmPassword")
    .setValidators([
      Required,
      ConfirmPasswordValidator(
        form.get("password") as FormControl,
        form.get("confirmPassword") as FormControl
      ),
    ]);

  return form;
};

const loginForm = createLoginForm();

const passwordFormControl = loginForm.get("password") as FormControl;

function login() {
  loadingService
    .show()
    .pipe(
      switchMap(() =>
        storageService.set(StorageKeys.User, loginForm.getRawValue().name)
      ),
      finalize(() => loadingService.hide().subscribe())
    )
    .subscribe({
      next: () => {
        toastService.success("Login Successful").subscribe();
        router.replace("/dashboard");
      },
      error: () => {
        toastService.danger("Unable to login!").subscribe();
      },
    });
}
</script>

<style lang="scss" scoped>
@import "../theme/font";

h1 {
  font-family: "Termina Light", sans-serif;
  font-size: 36px;
  line-height: 64px;
}

.logo {
  max-width: 14rem;
}

.login-wrapper {
  max-width: 900px;
}

.btn.login {
  min-width: 150px;
}
</style>
