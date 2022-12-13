/**
 * This library retrieves vehicle data from the National Highway Traffic Safety
 * Administration API.
 */

import config from './config';

import type { HttpErrorCause } from '../index';

export interface SearchInput {
  basePrice: number;
  make: string;
  model: string;
  age: number;
  owners: number;

  collisions: number | null;
  mileage: number | null;
}

/**
 * Retrieves all of the model names for the supplied vehicle make. Throws an
 * exception if the make isn't found in the NHTSA database.
 * @param make The vehicle make to look up in the NHTSA database
 * @param config An object containing config values such as the NHTSA API base
 * URL
 */
export const getModelsForMake = async (
  make: SearchInput['make'],
  { nhtsaUrl }: Partial<typeof config> = {},
) => {
  nhtsaUrl ??= config.nhtsaUrl;

  const response = await fetch(
    `${nhtsaUrl}/vehicles/getmodelsformake/${encodeURIComponent(
      make.toLowerCase(),
    )}?format=json`,
  );
  const { Results: results } = await response.json<{
    Results: { Model_Name: string }[];
  }>();

  // Rather than 404ing on unknown makes, the API returns an empty array
  if (results.length === 0) {
    const err = /** @type {Error & {code: number}} */ new Error(
      'Vehicle make not found',
      {
        cause: {
          status: 404,
          message: 'Vehicle make not found',
        } as HttpErrorCause,
      },
    );
    throw err;
  }

  return results.map(({ Model_Name }) => Model_Name.toLowerCase());
};
