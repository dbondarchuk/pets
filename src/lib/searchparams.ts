import { allergySeverities, animals } from '@/types/pet';
import {
  createLoader,
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';

export const baseSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString
};

export const petSearchParams = {
  ...baseSearchParams,
  type: parseAsStringEnum([...animals]),
  ownerId: parseAsString
};

export const petSearchParamsCache = createSearchParamsCache(petSearchParams);
export const petSearchSerialize = createSerializer(petSearchParams);

export const perSearhParamsLoader = createLoader(petSearchParams);

export const allergySearchParams = {
  ...baseSearchParams,
  severity: parseAsStringEnum([...allergySeverities])
};

export const allergySearchParamsCache =
  createSearchParamsCache(allergySearchParams);
export const allergySearchSerialize = createSerializer(allergySearchParams);

export const allergySearhParamsLoader = createLoader(allergySearchParams);

export const vaccinationSearchParams = {
  ...baseSearchParams,
  start: parseAsIsoDateTime,
  end: parseAsIsoDateTime
};

export const vaccinationSearchParamsCache = createSearchParamsCache(
  vaccinationSearchParams
);
export const vaccinationSearchSerialize = createSerializer(
  vaccinationSearchParams
);

export const vaccinationSearhParamsLoader = createLoader(
  vaccinationSearchParams
);
