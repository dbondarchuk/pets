import React from 'react';
import { Mask, MaskedInput } from './masked-input';
import countries from 'countries-phone-masks';

import './css/flags.css';
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
  InputGroupInputClasses
} from './input-group';
import { Combobox } from './combobox';

export type PhoneInputProps = {
  label: string;
  defaultCountry?: string;
  value?: string;
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  disabled,
  label,
  className,
  defaultCountry = 'US',
  ...props
}) => {
  const [mask, setMask] = React.useState<Mask | undefined>(undefined);
  const [maskPlaceholder, setMaskPlaceholder] = React.useState<
    string | undefined
  >(undefined);

  const onCountryChange = (iso: string) => {
    const country = countries.find((c) => c.iso === iso);
    const countryMask =
      country?.mask && Array.isArray(country?.mask)
        ? country?.mask[0]
        : (country?.mask as string);

    const maskPlaceholder = countryMask
      ? `${country?.code} ${countryMask?.replaceAll('#', '_')}`
      : '';
    const mask = countryMask
      ? `${country?.code} ${countryMask}`
          .split('')
          .map((c) => (c === '#' ? /[0-9]/ : c))
      : undefined;

    setMask(mask);
    setMaskPlaceholder(maskPlaceholder);
  };

  React.useEffect(() => onCountryChange(defaultCountry), [defaultCountry]);

  const countryTransform = (country: (typeof countries)[number]) => ({
    value: country.iso,
    shortLabel: (
      <div title={country.name} className='flex'>
        <label className='sr-only'>{country.name}</label>
        <div
          className={`flag mr-2 self-center ${country.iso.toLocaleLowerCase()}`}
        ></div>
        <div>{country.code}</div>
      </div>
    ),
    label: (
      <div title={country.name} className='flex w-full justify-between'>
        <div className='flex'>
          <div
            className={`flag mr-2 self-center ${country.iso.toLocaleLowerCase()}`}
          ></div>
          <label>{country.name}</label>
        </div>
        <div>{country.code}</div>
      </div>
    )
  });

  const countryList = React.useMemo(() => countries.map(countryTransform), []);

  return (
    <InputGroup className={className}>
      <InputSuffix className='rounded-r-none border-r-0'>
        <label htmlFor='countryCode' className='sr-only'>
          {label}
        </label>
        <Combobox
          disabled={disabled}
          className='min-w-fit *:rounded-r-none *:border-r-0 focus:ring-0'
          value={defaultCountry}
          onItemSelect={(value: string) => onCountryChange(value)}
          values={countryList}
          listClassName='w-[400px]'
          searchLabel={label}
          customSearch={(search) => {
            const lowerSearch = search.toLocaleLowerCase();
            return countries
              .filter(
                (c) =>
                  c.name.toLocaleLowerCase().indexOf(lowerSearch) >= 0 ||
                  c.iso.toLocaleLowerCase().indexOf(lowerSearch) >= 0 ||
                  c.code.toLocaleLowerCase().indexOf(lowerSearch) >= 0
              )
              .map(countryTransform);
          }}
        />
      </InputSuffix>
      <InputGroupInput>
        <MaskedInput
          {...props}
          disabled={disabled}
          mask={mask}
          className={InputGroupInputClasses({ variant: 'prefix' })}
          placeholder={maskPlaceholder}
        />
      </InputGroupInput>
    </InputGroup>
  );
};
