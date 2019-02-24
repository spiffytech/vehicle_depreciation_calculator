const libVehicleValue = require('./vehicleValue');

describe('ageDepreciation', () => {
  test('returns the original value if the vehicle is new', () => {
    const originalValue = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(0, originalValue);
    expect(depreciatedValue).toBe(originalValue);
  });

  test('depreciates by .005 after 1 month', () => {
    const originalValue = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(1, originalValue);
    expect(depreciatedValue).toBe(0.995);
  });

  test('depreciates by a multiple, not a constant value', () => {
    const originalValue = 10000;
    const depreciatedValue = libVehicleValue.ageDepreciation(1, originalValue);
    expect(depreciatedValue).toBe(originalValue - (originalValue * .005));
  });

  test('calculates a 10-year depreciation for ages > 10 years', () => {
    const originalValue = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(121, originalValue);
    expect(depreciatedValue).toBe(originalValue - (.005 * 120));
  });
});

describe('mileageDepreciation', () => {
  test('returns the original value if the vehicle has no mileas on it', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.milageageDepreciation(0, originalValue);
    expect(depreciatedValue).toBe(originalValue);
  });

  test('depreciates by .002 after 1000 miles', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.milageageDepreciation(1000, originalValue);
    expect(depreciatedValue).toBe(0.998);
  });

  test('depreciates by a multiple, not a constant value', () => {
    const originalValue = 10000;
    const depreciatedValue =
      libVehicleValue.milageageDepreciation(1000, originalValue);
    expect(depreciatedValue).toBe(originalValue - (originalValue * 0.002));
  });

  test('calculates a 150k-mile depreciation for mileages > 150k miles', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.milageageDepreciation(151000, originalValue);
    const depreciationAmount = .002 * 150;
    const expectedValue = originalValue - (originalValue * depreciationAmount);
    expect(depreciatedValue).toBe(expectedValue)
  });
});