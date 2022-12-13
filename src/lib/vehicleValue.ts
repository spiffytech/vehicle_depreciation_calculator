import config from './config';

import { SearchInput } from './nhtsa';

/**
 * This module contains functions for calculating a vehicle's age based on
 * various properties of the vehicle
 */

/**
 * Given the current value of the vehicle and its age, return a new depreciated
 * value based on the age. Depreciation is only applied up to 120 months.
 * @param {number} age In months
 * @param {number} value The unmodified value of the vehicle, to which the age
 * muliplier will be applied
 */
export const ageDepreciation = (age: SearchInput['age'], value: number) => {
  const applicableMonths = Math.min(age, parseInt(config.maxDepreciationAge));
  const multiplier =
    parseFloat(config.ageDepreciationMultiplier) * applicableMonths;
  return value * (1 - multiplier);
};

/**
 * Given the vehicle's value and mileage, returns a mileage-adjusted value. Only
 * consuders the first 150000 miles on the odometer.
 * @param {number} mileage The number of miles on the vehicle's odometer
 * @param {number} value The unmodified value of the vehicle
 */
export const mileageDepreciation = (
  mileage: NonNullable<SearchInput['mileage']>,
  value: number,
) => {
  const applicableMileage = Math.min(mileage, config.maxDepreciationMileage);
  const depreciationMultiplier =
    parseFloat(config.mileageDepreciationMultiplier) *
    Math.floor(applicableMileage / 1000);
  return value - value * depreciationMultiplier;
};

/**
 * Given the number of previous owners and the vehicle's current value, penalize
 * the value if the vehicle has had "too many" owners
 * @param {number} owners The number of owners the vehicle has had
 * @param {number} value The current value of the vehicle
 */
export const ownersPenalty = (owners: SearchInput['owners'], value: number) => {
  if (owners >= parseInt(config.ownersPenaltyThreshold)) {
    return value * (1 - config.ownersPenaltyAmount);
  }
  return value;
};

/**
 * If the vehicle has had no owners, reward it with bonus value. This should be
 * applied after all other depreciation calculations.
 * @param {number} owners The number of owners the vehicle has had
 * @param {number} value  The current value of the vehicle
 */
export const ownersBonus = (owners: SearchInput['owners'], value: number) => {
  if (owners === 0) return value * (1 + parseFloat(config.ownersBonusAmount));
  return value;
};

/**
 * Penalizes the vehicle for being in collisions
 * @param {number} collisions How many collisions the vehicle has had
 * @param {number} value The current value of the vehicle
 */
export const collisionsPenalty = (
  collisions: NonNullable<SearchInput['collisions']>,
  value: number,
) => {
  const applicableCollisions = Math.min(
    collisions,
    parseInt(config.maxCollisions),
  );
  const penalty = applicableCollisions * parseFloat(config.collisionsPenalty);
  return value - value * penalty;
};

/**
 * Calculates the vehicle's total value based on a number of factors
 * @param {number} basePrice
 * @param {{age: number, mileage?: number, owners: number, collisions?: number}} param1
 */
export const calcValue = ({
  basePrice,
  age,
  mileage,
  owners,
  collisions,
}: Pick<
  SearchInput,
  'basePrice' | 'age' | 'mileage' | 'owners' | 'collisions'
>) => {
  let value = basePrice;
  value = ageDepreciation(age, value);

  value = mileage ? mileageDepreciation(mileage, value) : value;

  value = ownersPenalty(owners, value);

  value = collisions ? collisionsPenalty(collisions, value) : value;

  value = ownersBonus(owners, value);

  return value;
};
