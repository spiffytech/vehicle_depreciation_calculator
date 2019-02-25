const jsc = require('jsverify');

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

  test('always returns a positive value', () => {
    jsc.assertForall(jsc.nat(300), jsc.nat(60000), (age, value) => {
      return libVehicleValue.ageDepreciation(age, value) >= 0;
    });
  });

  test('never returns more than the original value', () => {
    jsc.assertForall(jsc.nat(300), jsc.nat(60000), (age, value) => {
      return libVehicleValue.ageDepreciation(age, value) <= value;
    });
  });

  test('never removes more than 60% of the car\'s value', () => {
    jsc.assertForall(jsc.nat(300), jsc.nat(60000), (age, value) => {
      return libVehicleValue.ageDepreciation(age, value) >= value * 0.4;
    });
  });
});

describe('mileageDepreciation', () => {
  test('returns the original value if the vehicle has no mileas on it', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.mileageDepreciation(0, originalValue);
    expect(depreciatedValue).toBe(originalValue);
  });

  test('depreciates by .002 after 1000 miles', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.mileageDepreciation(1000, originalValue);
    expect(depreciatedValue).toBe(0.998);
  });

  test('depreciates by a multiple, not a constant value', () => {
    const originalValue = 10000;
    const depreciatedValue =
      libVehicleValue.mileageDepreciation(1000, originalValue);
    expect(depreciatedValue).toBe(originalValue - (originalValue * 0.002));
  });

  test('calculates a 150k-mile depreciation for mileages > 150k miles', () => {
    const originalValue = 1;
    const depreciatedValue =
      libVehicleValue.mileageDepreciation(151000, originalValue);
    const depreciationAmount = .002 * 150;
    const expectedValue = originalValue - (originalValue * depreciationAmount);
    expect(depreciatedValue).toBe(expectedValue);
  });

  test('always returns a positive value', () => {
    jsc.assertForall(jsc.nat(1000000), jsc.nat(60000), (mileage, value) => {
      return libVehicleValue.mileageDepreciation(mileage, value) >= 0;
    });
  });

  test('never returns more than the original value', () => {
    jsc.assertForall(jsc.nat(1000000), jsc.nat(60000), (mileage, value) => {
      return libVehicleValue.mileageDepreciation(mileage, value) <= value;
    });
  });

  test('never removes more than 30% of the car\'s value', () => {
    jsc.assertForall(jsc.nat(1000000), jsc.nat(60000), (mileage, value) => {
      return libVehicleValue.mileageDepreciation(mileage, value) >= value * 0.7;
    });
  });
});

describe('ownersPenalty', () => {
  test('doesn\'t penalize if the vehicle has had < 2 owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersPenalty(1, originalValue)).toBe(originalValue);
  });

  test('penalizes the value if the vehicle has had >= 2 owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersPenalty(2, originalValue)).toBe(0.75);
  });

  test('only ever returns the original value or 75% of the original value', () => {
    jsc.assertForall(jsc.nat, jsc.nat(60000), (owners, value) => {
      const newValue = libVehicleValue.ownersPenalty(owners, value);
      return newValue === value || newValue === value * 0.75;
    });
  });
});

describe('ownersBonus', () => {
  test('issues a bonus if the vehicle has had no owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersBonus(0, originalValue)).toBe(1.10);
  });

  test('does nothing if the vehicle has had any owners', () => {
    const originalValue = 1;
    expect(libVehicleValue.ownersBonus(1, originalValue)).toBe(originalValue);
  });

  test('only ever returns the original value or 110% of the original value', () => {
    jsc.assertForall(jsc.nat, jsc.nat(60000), (owners, value) => {
      const newValue = libVehicleValue.ownersBonus(owners, value);
      return newValue === value || newValue === value * 1.1;
    });
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

  test('always returns a positive value', () => {
    jsc.assertForall(jsc.nat, jsc.nat(60000), (collisions, value) => {
      return libVehicleValue.collisionsPenalty(collisions, value) >= 0;
    });
  });

  test('never returns more than the original value', () => {
    jsc.assertForall(jsc.nat, jsc.nat(60000), (collisions, value) => {
      return libVehicleValue.collisionsPenalty(collisions, value) <= value;
    });
  });

  test('never removes more than 10% of the car\'s value', () => {
    jsc.assertForall(jsc.nat, jsc.nat(60000), (collisions, value) => {
      // Floating point arithmetic is "fun"
      return (value * 0.9) - libVehicleValue.collisionsPenalty(collisions, value) < 0.00001;
    });
  });
});

describe('calcValue', () => {
  test('returns the original value if the vehicle is brand new, first owner', () => {
    const originalValue = 10000;
    const actualValue = libVehicleValue.calcValue(
      originalValue,
      { age: 0, mileage: 0, owners: 1, collisions: 0 },
    );

    expect(actualValue).toBe(originalValue);
  });

  test('issues the vehicle a bonus if it\'s had no owners', () => {
    const originalValue = 10000;
    const actualValue = libVehicleValue.calcValue(
      originalValue,
      { age: 0, mileage: 0, owners: 0, collisions: 0 },
    );

    expect(actualValue).toBe(11000);
  });

  test('ignores mileage and collisions if they aren\'t specified', () => {
    const originalValue = 10000;
    const actualValue = libVehicleValue.calcValue(
      originalValue,
      { age: 0, owners: 1 },
    );

    expect(actualValue).toBe(originalValue);
  });

  test('applies calculations for all factors', () => {
    const age = 24;
    const mileage = 65000;
    const owners = 2;
    const collisions = 2;
    const originalValue = 10000;
    const expectedValue =
      originalValue *
      (1 - (.005 * age)) *
      (1 - ((mileage / 1000) * .002)) *
      (1 - .25) *  // owners
      (1 - (collisions * .02));

    expect(libVehicleValue.calcValue(
      originalValue,
      { age, mileage, owners, collisions },
    )).toBe(expectedValue);
  });

  test('always returns a positive number', () => {
    jsc.assertForall(
      jsc.nat, jsc.nat(300000), jsc.nat, jsc.nat, jsc.nat(60000),
      (age, mileage, owners, collisions, originalValue) => {
        const value = libVehicleValue.calcValue(
          originalValue, {age, mileage, owners, collisions}
        );
        return value > 0;
      }
    );
  });

  test('never returns more than the original value + owner bonus', () => {
    jsc.assertForall(
      jsc.nat, jsc.nat(300000), jsc.nat, jsc.nat, jsc.nat(60000),
      (age, mileage, owners, collisions, originalValue) => {
        const value = libVehicleValue.calcValue(
          originalValue, {age, mileage, owners, collisions}
        );
        return value <= originalValue * 1.10;
      }
    );
  });

  test('never deducts more than the maximum penalty + depreciation', () => {
    jsc.assertForall(
      jsc.nat, jsc.nat(300000), jsc.nat, jsc.nat, jsc.nat(60000),
      (age, mileage, owners, collisions, originalValue) => {
        const value = libVehicleValue.calcValue(
          originalValue, {age, mileage, owners, collisions}
        );
        const maxPenalty =
          0.6 *  // age
          0.3 *  // mileage
          0.25 *  // owners
          0.1; // collisions
        return value >= (value * maxPenalty);
      }
    );
  });
});