"use client";

import Image from "next/image";
import type * as React from "react";
import { forwardRef, useCallback } from "react";
import PhoneInputLib, { type Country } from "react-phone-number-input";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FLAG_BASE = "https://purecatamphetamine.github.io/country-flag-icons/3x2";

interface CountrySelectProps {
  id?: string;
  value?: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

function CountrySelect({
  id,
  value,
  onChange,
  disabled,
  invalid,
  className,
}: CountrySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as Country)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        aria-label="Country calling code"
        className={cn("w-fit shrink-0 px-2", className)}
      >
        <SelectValue>
          {value ? (
            <Image
              src={`${FLAG_BASE}/${value}.svg`}
              alt={en[value] ?? value}
              width={20}
              height={14}
              className="h-3.5 w-5 rounded-xs object-cover"
            />
          ) : null}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="w-full">
        {getCountries().map((country) => (
          <SelectItem key={country} value={country}>
            <span className="flex items-center gap-2">
              <Image
                src={`${FLAG_BASE}/${country}.svg`}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-xs object-cover"
                loading="lazy"
              />
              <span>{en[country]}</span>
              <span className="ml-auto pl-3 text-muted-foreground tabular-nums">
                +{getCountryCallingCode(country)}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...rest }, ref) => (
  <Input ref={ref} {...rest} className={cn("flex-1", className)} />
));
PhoneNumberInput.displayName = "PhoneNumberInput";

export interface PhoneInputProps {
  id?: string;
  /** E.164 string, e.g. "+447700900123". */
  value?: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  name?: string;
  /** Seeds the country before anything is typed. */
  defaultCountry?: Country;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  selectClassName?: string;
}

export function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  name,
  defaultCountry = "AU",
  disabled,
  invalid,
  className,
  selectClassName,
}: PhoneInputProps) {
  const countrySelect = useCallback(
    (props: {
      value?: Country;
      onChange: (country: Country) => void;
      disabled?: boolean;
    }) => (
      <CountrySelect
        {...props}
        id={id}
        invalid={invalid}
        className={selectClassName}
      />
    ),
    [id, invalid, selectClassName],
  );

  return (
    <PhoneInputLib
      international
      countryCallingCodeEditable={false}
      defaultCountry={defaultCountry}
      value={value}
      onChange={(next) => onChange?.(next as string | undefined)}
      onBlur={onBlur}
      name={name}
      disabled={disabled}
      aria-invalid={invalid}
      className={cn("flex gap-2", className)}
      inputComponent={PhoneNumberInput}
      countrySelectComponent={countrySelect}
    />
  );
}

export default PhoneInput;
