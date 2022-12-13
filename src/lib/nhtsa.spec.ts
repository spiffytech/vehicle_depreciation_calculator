import * as nhtsa from './nhtsa';

import type { HttpErrorCause } from '../index';

const originalFetch = fetch;
beforeEach(() => {
  globalThis.fetch = originalFetch;
});

describe('getModelsForMake', () => {
  test.concurrent('calls fetch with the right URL', async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        Results: [{ Model_Name: 'SUPERHAWK' }],
      }),
    })) as jest.Mock;
    globalThis.fetch = fetchMock;

    await nhtsa.getModelsForMake('honda', {
      nhtsaUrl: 'http://example.com',
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://example.com/vehicles/getmodelsformake/honda?format=json',
    );
  });

  test.concurrent('returns names from the API response array', async () => {
    globalThis.fetch = jest.fn(() => ({
      json: async () => ({
        Results: [
          // This data is a copy/pasted response from the NHTSA API
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3509,
            Model_Name: 'SUPERHAWK',
          },
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3515,
            Model_Name: 'CB600F',
          },
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3520,
            Model_Name: 'NIGHTHAWK 750',
          },
        ],
      }),
    })) as jest.Mock;
    const models = await nhtsa.getModelsForMake('honda');

    expect(models).toEqual(['superhawk', 'cb600f', 'nighthawk 750']);
  });

  test.concurrent(
    'throws an exception when querying an invalid vehicle make',
    async () => {
      globalThis.fetch = jest.fn(() => ({
        json: async () => ({
          Results: [],
        }),
      })) as jest.Mock;
      return expect(nhtsa.getModelsForMake('hondaaaaaa')).rejects.toThrow();
    },
  );

  test.concurrent('throws errors that include an error code', async () => {
    globalThis.fetch = jest.fn(() => ({
      json: async () => ({ Results: [] }),
    })) as jest.Mock;
    try {
      await nhtsa.getModelsForMake('hondaaaaa');
      expect(true).toBe(false);
    } catch (ex) {
      expect(((ex as Error).cause as HttpErrorCause).status).toBe(404);
    }
  });
});
