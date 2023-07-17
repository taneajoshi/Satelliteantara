import { FormControl, SyncValidator } from "universal-reactive-forms";
export enum ErrorKeys {
  Min = "min",
  Required = "required",
  Password = "password",
  Email = "email",
  Max = "max",
  MaxLength = "maxLength",
  MinLength = "minLength",
  StrongPassword = "strongPassword",
  MatchConfirmPassword = "matchConfirmPassword",
}

/**
 * Returns valid when the value is not null|undefined|empty string or when array is not empty
 * @param value
 * @constructor
 */
export const Required: SyncValidator = (value) => {
  if (value instanceof Array) {
    return value.length === 0 ? { required: "true" } : null;
  }

  if (value === null || value === "" || value === undefined) {
    return { [ErrorKeys.Required]: "true" };
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return { [ErrorKeys.Required]: "true" };
  }

  return null;
};

/**
 * Returns true if the value is valid number
 * @param value
 * @constructor
 */
export const IsNumber: SyncValidator = (value) => {
  return isNaN(parseFloat(value)) ? { number: "true" } : null;
};

export const Min =
  (minValue: number): SyncValidator =>
  (value) => {
    const error = {
      [ErrorKeys.Min]: `${minValue}`,
    };
    if (IsNumber(value) !== null) {
      return error;
    }
    return parseFloat(value) < minValue ? error : null;
  };

export const Max =
  (minValue: number): SyncValidator =>
  (value) => {
    const error = {
      [ErrorKeys.Max]: `${minValue}`,
    };
    if (IsNumber(value) !== null) {
      return error;
    }
    return parseFloat(value) > minValue ? error : null;
  };

export const MinLength =
  (minLengthValue: number): SyncValidator =>
  (value) => {
    const error = {
      [ErrorKeys.MinLength]: `${minLengthValue}`,
    };
    if (typeof value !== "string") {
      return error;
    }

    return value.trim().length < minLengthValue ? error : null;
  };

export const MaxLength =
  (maxLengthValue: number): SyncValidator =>
  (value) => {
    const error = {
      [ErrorKeys.MaxLength]: `${maxLengthValue}`,
    };
    if (typeof value !== "string") {
      return error;
    }

    return value.length > maxLengthValue ? error : null;
  };

const EmailRegex = new RegExp(
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
);

/**
 * Validates email structure
 * @param value
 * @constructor
 */
export const Email: SyncValidator = (value: any) => {
  const defaultError = {
    [ErrorKeys.Email]: "true",
  };
  if (typeof value !== "string") {
    return defaultError;
  }

  return EmailRegex.test(value) ? null : defaultError;
};

const StrongPasswordRegex = new RegExp(
  /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
);

export function strongPasswordValidation(): SyncValidator {
  return (value: string) =>
    StrongPasswordRegex.test(value) &&
    value.trim().length >= 8 &&
    !/\s/.test(value)
      ? null
      : { [ErrorKeys.Password]: "true" };
}

export const ConfirmPasswordValidator: (
  passwordControl: FormControl,
  confirmPasswordControl: FormControl
) => SyncValidator = (passwordControl, confirmPasswordControl) => {
  passwordControl.valueChanges.subscribe(() => {
    confirmPasswordControl.value || confirmPasswordControl.touched
      ? confirmPasswordControl.validate()
      : null;
  });

  return (value: any) => {
    const passwordValue = passwordControl.value;
    const confirmPasswordValue = value;

    if (passwordValue === confirmPasswordValue) {
      return null;
    }

    return { [ErrorKeys.MatchConfirmPassword]: "true" };
  };
};
