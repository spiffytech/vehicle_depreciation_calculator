const nconf = require('nconf');

nconf.env().argv().defaults({EXPRESS_PORT: 3000, NHTSA_URL: 'https://vpic.nhtsa.dot.gov/api'});

module.exports = nconf.get();