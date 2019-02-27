const express = require('express');
const Joi = require('joi');

const config = require('./lib/config');
const nhtsa = require('./lib/nhtsa');
const libVehicleValue = require('./lib/vehicleValue');

const app = express();
const port = parseInt(config.EXPRESS_PORT);

/**
 * Given details about a vehicle's history, determine the depreciated value
 * of the vehicle
 */
app.get('/value', async (req, res) => {
  try {
    const schema = Joi.object().keys({
      make: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).lowercase().required(),
      model: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).lowercase().required(),

      basePrice: Joi.number().min(0).required(),

      age: Joi.number().integer().min(0).required(),
      mileage: Joi.number().min(0),
      owners: Joi.number().min(0).integer().required(),
      collisions: Joi.number().min(0).integer(),
    });
    const validation = Joi.validate(req.query, schema);

    if (validation.error) {
      res.statusCode = 400;
      res.send({ error: validation.error.details.map((detail) => detail.message) });
      return;
    }

    const models = await nhtsa.getModelsForMake(validation.value.make);
    if (models.indexOf(validation.value.model) === -1) {
      res.statusCode = 404;
      res.send({ error: 'Vehicle model not found' });
      return;
    }

    const { basePrice, age, mileage, owners, collisions } = validation.value;
    const value = libVehicleValue.calcValue(
      basePrice,
      { age, mileage, owners, collisions }
    );

    res.send({ value });
  } catch (ex) {
    if (ex.code === 404) {
      res.statusCode = 404;
      res.send({ error: 'Vehicle make not found' });
      return;
    } else {
      res.statusCode = 500;
      res.send({ error: 'An unknown error occurred' });
      return;
    }
  }
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));