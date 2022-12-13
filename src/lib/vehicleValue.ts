/**
 * This module contains functions for calculating a vehicle's age based on
 * various properties of the vehicle
 */

import config from './config';

import { SearchInput } from './nhtsa';

/**
 * Given the current value of the vehicle and its age, return a new depreciated
 * value based on the age. Depreciation is only applied up to 120 months.
 * @param age In months
 * @param value The unmodified value of the vehicle, to which the age muliplier
 * will be applied
 */
export const ageDepreciation = (age: SearchInput['age'], value: number) => {
  const applicableMonths = Math.min(age, config.maxDepreciationAge);
  const multiplier = config.ageDepreciationMultiplier * applicableMonths;
  return value * (1 - multiplier);
};

/**
 * Given the vehicle's value and mileage, returns a mileage-adjusted value. Only
 * considers the first 150,000 miles on the odometer.
 * @param mileage The number of miles on the vehicle's odometer
 * @param value The unmodified value of the vehicle
 */
export const mileageDepreciation = (
  mileage: NonNullable<SearchInput['mileage']>,
  value: number,
) => {
  const applicableMileage = Math.min(mileage, config.maxDepreciationMileage);
  const depreciationMultiplier =
    config.mileageDepreciationMultiplier *
    Math.floor(applicableMileage / 1_000);
  return value - value * depreciationMultiplier;
};

/**
 * Given the number of previous owners and the vehicle's current value, penalize
 * the value if the vehicle has had "too many" owners
 * @param owners The number of owners the vehicle has had
 * @param value The current value of the vehicle
 */
export const ownersPenalty = (owners: SearchInput['owners'], value: number) => {
  if (owners >= config.ownersPenaltyThreshold) {
    return value * (1 - config.ownersPenaltyAmount);
  }
  return value;
};

/**
 * If the vehicle has had no owners, reward it with bonus value. This should be
 * applied after all other depreciation calculations.
 * @param owners The number of owners the vehicle has had
 * @param value  The current value of the vehicle
 */
export const ownersBonus = (owners: SearchInput['owners'], value: number) => {
  if (owners === 0) return value * (1 + config.ownersBonusAmount);
  return value;
};

/**
 * Penalizes the vehicle for being in collisions
 * @param collisions How many collisions the vehicle has had
 * @param value The current value of the vehicle
 */
export const collisionsPenalty = (
  collisions: NonNullable<SearchInput['collisions']>,
  value: number,
) => {
  const applicableCollisions = Math.min(collisions, config.maxCollisions);
  const penalty = applicableCollisions * config.collisionsPenalty;
  return value - value * penalty;
};

/**
 * Calculates the vehicle's total value based on a number of factors
 * @param searchInput Details about the car you want to appraise
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
