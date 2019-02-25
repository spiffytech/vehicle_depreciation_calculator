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

describe('ownersPenalty', () => {
  test('doesn\'t penalize if the vehicle has had < 2 owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownnersPenalty(1, originalValue)).toBe(originalValue);
  });

  test('penalizes the value if the vehicle has had >= 2 owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownnersPenalty(2, originalValue)).toBe(0.75);
  });
});

describe('ownersBonus', () => {
  test('issues a bonus if the vehicle has had no owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersBonus(0, originalValue)).toBe(1.10);
  });

  test('does nothing f the vehicle has had any owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersBonus(1, originalValue)).toBe(originalValue);
  });
});

describe('collisionsPenalty', () => {
  test('applies no penalty if there hae been no collisions', () => {
    const originalValue = 1;
    expect(libVehicleValue.collisionsPenalty(0, originalValue)).toBe(originalValue);
  });

  test('applies a 2% penalty if the vehicle has been in one collision', () => {
    const originalValue = 1;
    expect(libVehicleValue.collisionsPenalty(1, originalValue)).toBe(0.98);
  });

  test('only applies up to 5 collisions', () => {
    const originalValue = 1;
    expect(libVehicleValue.collisionsPenalty(6, originalValue)).
      toBe(originalValue - (originalValue * (.02 * 5)));
  });
});