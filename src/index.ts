import { Hono } from 'hono';
import zod from 'zod';

import config from './lib/config.js';
import * as nhtsa from './lib/nhtsa.js';
import * as libVehicleValue from './lib/vehicleValue.js';

import type { Context as HonoContext } from 'hono';

const app = new Hono();
const port = parseInt(config.EXPRESS_PORT);

import type { SearchInput } from './lib/nhtsa.js';

export interface HttpErrorCause {
  status: Parameters<HonoContext['status']>[0];
  message: string;
}

const isHttpErrorCauseSchema = (cause: unknown): cause is HttpErrorCause => {
  if (!cause) return false;
  return (
    typeof (cause as HttpErrorCause).status === 'number' &&
    typeof (cause as HttpErrorCause).message === 'string'
  );
};

/**
 * Given details about a vehicle's history, determine the depreciated value
 * of the vehicle
 */
app.get('/value', async (ctx) => {
  try {
    const searchInputSchema = zod.object({
      basePrice: zod.coerce.number().min(0),
      make: zod
        .string()
        .regex(/^[a-zA-Z0-9 ]+$/)
        .transform((s) => s.toLowerCase()),
      model: zod
        .string()
        .regex(/^[a-zA-Z0-9 ]+$/)
        .transform((s) => s.toLowerCase()),
      age: zod.coerce.number().int().min(0),
      owners: zod.coerce.number().min(0).int(),

      mileage: zod.coerce.number().min(0).nullable(),
      collisions: zod.coerce.number().min(0).int().nullable(),
    });
    const queryParams = ctx.req.query();
    const validation = searchInputSchema.safeParse(queryParams);

    if (validation.success === false) {
      console.error('Search input validation error:', validation.error);
      ctx.status(400);
      return ctx.json({
        error: validation.error.format(),
      });
    }

    const searchInput: SearchInput = validation.data;

    const models = await nhtsa.getModelsForMake(searchInput.make);
    if (models.indexOf(searchInput.model) === -1) {
      ctx.status(404);
      return ctx.json({ error: 'Vehicle model not found' });
    }

    const { basePrice, age, mileage, owners, collisions } = searchInput;
    const value = libVehicleValue.calcValue({
      basePrice,
      age,
      mileage,
      owners,
      collisions,
    });

    return ctx.json({ value });
  } catch (ex) {
    if (ex instanceof Error) {
      const cause = ex.cause;
      if (isHttpErrorCauseSchema(cause)) {
        ctx.status(cause.status);
        return ctx.json({ error: cause.message });
      }
    }

    console.error(ex);
    ctx.status(500);
    return ctx.text('An unknown error occurred');
  }
});

// eslint-disable-next-line no-console
Bun.serve({
  fetch: app.fetch,
  port,
});
console.log(`Example app listening on port ${port}!`);
