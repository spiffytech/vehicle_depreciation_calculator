const config = require('./config');

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
function ageDepreciation(age, value) {
  const applicableMonths = Math.min(age, parseInt(config.MAX_DEPRECIATION_AGE));
  const multiplier =
    parseFloat(config.AGE_DEPRECIATION_MULTIPLIER) * applicableMonths;
  return value * (1 - multiplier);
}
module.exports.ageDepreciation = ageDepreciation;

/**
 * Given the vehicle's value and mileage, returns a mileage-adjusted value. Only
 * consuders the first 150000 miles on the odometer.
 * @param {number} mileage The number of miles on the vehicle's odometer
 * @param {number} value The unmodified value of the vehicle
 */
function milageageDepreciation(mileage, value) {
  const applicableMileage = Math.min(mileage, config.MAX_DEPRECIATION_MILEAGE)
  const depreciationMultiplier =
    parseFloat(config.MILEAGE_DEPRECIATION_MULTIPLIER) * Math.floor(applicableMileage / 1000)
  return value - (value * depreciationMultiplier);
}
module.exports.milageageDepreciation = milageageDepreciation;