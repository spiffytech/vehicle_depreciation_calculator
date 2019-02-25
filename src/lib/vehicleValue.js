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
function mileageDepreciation(mileage, value) {
  const applicableMileage = Math.min(mileage, config.MAX_DEPRECIATION_MILEAGE);
  const depreciationMultiplier =
    parseFloat(config.MILEAGE_DEPRECIATION_MULTIPLIER) * Math.floor(applicableMileage / 1000);
  return value - (value * depreciationMultiplier);
}
module.exports.mileageDepreciation = mileageDepreciation;

/**
 * Given the number of previous owners and the vehicle's current value, penalize
 * the value if the vehicle has had "too many" owners
 * @param {number} owners The number of owners the vehicle has had
 * @param {number} value The current value of the vehicle
 */
function ownersPenalty(owners, value) {
  if (owners >= parseInt(config.OWNERS_PENALTY_THRESHOLD)) {
    return value * (1 - config.OWNERS_PENALTY_AMOUNT);
  }
  return value;
}
module.exports.ownersPenalty = ownersPenalty;

/**
 * If the vehicle has had no owners, reward it with bonus value. This should be
 * applied after all other depreciation calculations.
 * @param {number} owners The number of owners the vehicle has had
 * @param {number} value  The current value of the vehicle
 */
function ownersBonus(owners, value) {
  if (owners === 0) return value * (1 + parseFloat(config.OWNERS_BONUS_AMOUNT));
  return value;
}
module.exports.ownersBonus = ownersBonus;

/**
 * Penalizes the vehicle for being in collisions
 * @param {number} collisions How many collisions the vehicle has had
 * @param {number} value The current value of the vehicle
 */
function collisionsPenalty(collisions, value) {
  const applicableCollisions = Math.min(collisions, parseInt(config.MAX_COLLISIONS));
  const penalty = applicableCollisions * parseFloat(config.COLLISIONS_PENALTY);
  return value - (value * penalty);
}
module.exports.collisionsPenalty = collisionsPenalty;

/**
 * Calculates the vehicle's total value based on a number of factors
 * @param {number} value 
 * @param {{age: number, mileage?: number, owners: number, collisions?: number}} param1 
 */
function calcValue(value, { age, mileage, owners, collisions }) {
  const ageDepreciated = ageDepreciation(age, value);
  const mileageDepreciated =
    mileage ? mileageDepreciation(mileage, ageDepreciated) : ageDepreciated;
  const ownersPenalized = ownersPenalty(owners, mileageDepreciated);
  const collisionsPenalized =
    collisions ? collisionsPenalty(collisions, ownersPenalized) : ownersPenalized;
  const ownersBonused = ownersBonus(owners, collisionsPenalized);
  return ownersBonused;
}
module.exports.calcValue = calcValue;