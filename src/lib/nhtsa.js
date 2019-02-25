/**
 * This library interfaces with the National Highway Traffic Safety
 * Administration API to retrieve vehicle data.
 */

const axios = require('axios');
const urlJoin = require('url-join');

const config = require('./config');

/**
 * Retrieves all of the model names for the supplied vehicle make. Throws an
 * exception if the make isn't found in the NHTSA database.
 * @param {string} make The vehicle make to look up in the NHTSA database
 * @param {*} fetcher an HTTP fetching library conforming to the Axios API
 * @param {{NHTSA_URL: string}} config An object containing config values such
 * as the NHTSA API base URL
 * @returns {Promise<string[]>}
 */
async function getModelsForMake(make, fetcher = axios, { NHTSA_URL } = config) {
  const response = await fetcher.get(urlJoin(
    NHTSA_URL,
    `vehicles/getmodelsformake/${encodeURIComponent(make.toLowerCase())}?format=json`
  ));

  // Rather than 404ing on unknown makes, the API returns an empty array
  if (response.data.Results.length === 0) {
    const err = /** @type {Error & {code: number}} */(new Error('Invalid vehicle make'));
    err.code = 404;
    throw err;
  }

  return response.data.Results.map((/** @type any */make) => make.Model_Name);
}
module.exports.getModelsForMake = getModelsForMake;