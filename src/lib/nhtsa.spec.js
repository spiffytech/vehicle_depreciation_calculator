const nhtsa = require('./nhtsa');

describe('getModelsForMake', () => {
  test('calls axios with the right URL', async () => {
    const mock = jest.fn(() => ({ data: { Results: [{Model_Name: 'SUPERHAWK'}] } }));
    await nhtsa.getModelsForMake(
      'honda',
      { get: mock },
      { NHTSA_URL: 'http://example.com' },
    );
    expect(
      mock.mock.calls[0][0]
    ).toBe('http://example.com/vehicles/getmodelsformake/honda?format=json');
  });

  test('returns names from the API response array', async () => {
    const mock = jest.fn(() => ({
      data: {
        Results: [
          // Real data from a real API response
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3509,
            Model_Name: 'SUPERHAWK'
          },
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3515,
            Model_Name: 'CB600F'
          },
          {
            Make_ID: 474,
            Make_Name: 'Honda',
            Model_ID: 3520,
            Model_Name: 'NIGHTHAWK 750'
          },
        ]
      }
    }));
    const models = await nhtsa.getModelsForMake(
      'honda',
      { get: mock },
    );

    expect(models).toEqual(['SUPERHAWK', 'CB600F', 'NIGHTHAWK 750']);
  });

  test('throws an exception when querying an invalid vehicle make', async () => {
    const mock = jest.fn(() => ({data: {Results: []}}));
    return expect(
      nhtsa.getModelsForMake('hondaaaaaa', {get: mock})
    ).rejects.toThrow();
  });

  test('throws errors that include an error code', async () => {
    const mock = jest.fn(() => ({data: {Results: []}}));
    try {
      await nhtsa.getModelsForMake('hondaaaaa', {get: mock});
      expect(true).toBe(false);
    } catch (ex) {
      expect(ex.code).toBe(404);
    }
  });
});