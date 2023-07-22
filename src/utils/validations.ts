import { SyncValidator } from "universal-reactive-forms";
export enum ErrorKeys {
  Min = "min",
  Required = "required",
  Password = "password",
  Email = "email",
  Max = "max",
  MaxLength = "maxLength",
  MinLength = "minLength",
  NoWhiteSpace = "noWhiteSpace",
}

// Common Validations

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

export const noWhiteSpaceValidation: SyncValidator = (value) => {
  const isWhitespace = value.length > 1 && value.toString().trim().length === 0;
  return isWhitespace ? { [ErrorKeys.NoWhiteSpace]: "true" } : null;
};
