/**
 * This module contains functions for calculating a vehicle's age based on
 * various properties of the vehicle
 */

/**
 * Given the current value of the vehicle and its age, return a new depreciated
 * value based on the age. Depreciation is only applied up to 120 months.
 * @param {number} age In months
 * @param {number} value The current value of the vehicle, to which the age
 * muliplier will be applied
 */
function ageDepreciation(age, value) {
  const applicableMonths = Math.min(age, 120);
  const multiplier = .005 * applicableMonths;
  return value * (1 - multiplier);
}
module.exports.ageDepreciation = ageDepreciation;
