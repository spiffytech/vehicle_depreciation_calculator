const express = require('express');
const Joi = require('joi');

const config = require('./lib/config');
const nhtsa = require('./lib/nhtsa');

const app = express();
const port = parseInt(config.EXPRESS_PORT);

app.get('/value', async (req, res) => {
  try {
    const schema = Joi.object().keys({
      make: Joi.string().required(),
      model: Joi.string().required(),
    });
    const validation = Joi.validate(
      {
        make: req.query.make,
        model: req.query.model,
      },
      schema,
    );

    if (validation.error) {
      res.statusCode = 400;
      res.send({error: 'Invalid parameters'});
      return;
    }

    const models = await nhtsa.getModelsForMake(validation.value.make);
    console.log(models);

    res.send('Hello World!')
  } catch (ex) {
    if (ex.code === 404) {
      res.statusCode = 404;
      res.send({error: 'Vehicle make not found'});
      return;
    } else {
      res.statusCode = 500;
      res.send({error: 'An unknown error occurred'});
      return;
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));