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
  });

module.exports = nconf.get();