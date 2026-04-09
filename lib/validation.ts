import * as React from 'react';
import { useFormikContext } from 'formik';
import { ConfigrLocalizationContext } from './ConfigrLocalizations';

export type ConfigrValidationResult = boolean | string;
export type ConfigrValidation<T> = (value: T) => ConfigrValidationResult;
export type ConfigrErrorMessageGetter = (
  data: Record<string, unknown>,
) => string | undefined;

export const RequiredMessageContext = React.createContext(true);
export const ActiveFieldPathContext = React.createContext<string | undefined>(undefined);

export function getFieldPathFromEventTarget(
  target: EventTarget | null,
): string | undefined {
  if (!(target instanceof HTMLElement)) {
    return undefined;
  }

  const namedElement = target.closest('[name]');
  if (!(namedElement instanceof HTMLElement)) {
    return undefined;
  }

  return namedElement.getAttribute('name') ?? undefined;
}

function isValueMissing(value: unknown) {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

function normalizeValidationResult(
  result: ConfigrValidationResult | undefined,
  invalidValueMessage: string,
): string | undefined {
  if (result === undefined || result === true) {
    return undefined;
  }
  if (typeof result === 'string') {
    return result;
  }
  return invalidValueMessage;
}

type ValidationMessageProps<T> = {
  path: string;
  value: T;
  disabled?: boolean;
  required?: boolean;
  validation?: ConfigrValidation<T>;
  getErrorMessage?: ConfigrErrorMessageGetter;
};

export function useValidationMessage<T>(
  props: ValidationMessageProps<T>,
): string | undefined {
  const { values } = useFormikContext<Record<string, unknown>>();
  const showRequiredMessage = React.useContext(RequiredMessageContext);
  const activeFieldPath = React.useContext(ActiveFieldPathContext);
  const localizations = React.useContext(ConfigrLocalizationContext);

  if (props.disabled || activeFieldPath === props.path || isValueMissing(props.value)) {
    return undefined;
  }

  const customValidation = normalizeValidationResult(
    props.validation?.(props.value),
    localizations.invalidValueMessage,
  );
  if (customValidation) {
    return customValidation;
  }

  const legacyValidationMessage = props.getErrorMessage?.(values);
  if (legacyValidationMessage) {
    return legacyValidationMessage;
  }

  if (props.required && showRequiredMessage && isValueMissing(props.value)) {
    return localizations.fieldRequiredMessage;
  }

  return undefined;
}

type ValidationConfig<T> = Omit<ValidationMessageProps<T>, 'value' | 'disabled'> & {
  disabled?: boolean;
};

export function useValidationMessageForValue<T>(
  config: ValidationConfig<T>,
  value: T,
  disabled = config.disabled,
): string | undefined {
  return useValidationMessage({
    ...config,
    value,
    disabled,
  });
}
