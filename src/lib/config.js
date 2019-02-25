const nconf = require('nconf');

nconf.
  env().
  argv().
  defaults({
    EXPRESS_PORT: 3000,
    NHTSA_URL: 'https://vpic.nhtsa.dot.gov/api',
    MAX_DEPRECIATION_AGE: 120,
    AGE_DEPRECIATION_MULTIPLIER: 0.005,
    MAX_DEPRECIATION_MILEAGE: 150000,
    MILEAGE_DEPRECIATION_MULTIPLIER: 0.002,
    OWNERS_PENALTY_THRESHOLD: 2,
    OWNERS_PENALTY_AMOUNT: .25,
    OWNERS_BONUS_AMOUNT: .1,
    MAX_COLLISIONS: 5,
    COLLISIONS_PENALTY: .02,
  });

module.exports = nconf.get();