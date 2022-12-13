import fc from 'fast-check';

import * as libVehicleValue from './vehicleValue';

describe('ageDepreciation', () => {
  test('returns the base price if the vehicle is new', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(0, basePrice);
    expect(depreciatedValue).toBe(basePrice);
  });

  test('depreciates by .005 after 1 month', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(1, basePrice);
    expect(depreciatedValue).toBe(0.995);
  });

  test('depreciates by a multiple, not a constant value', () => {
    const basePrice = 10_000;
    const depreciatedValue = libVehicleValue.ageDepreciation(1, basePrice);
    expect(depreciatedValue).toBe(basePrice - basePrice * 0.005);
  });

  test('calculates a 10-year depreciation for ages > 10 years', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.ageDepreciation(121, basePrice);
    expect(depreciatedValue).toBe(basePrice - 0.005 * 120);
  });

  test('always returns a positive value', () => {
    fc.assert(
      fc.property(
        fc.nat(300),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (age, value) => {
          return libVehicleValue.ageDepreciation(age, value) >= 0;
        },
      ),
    );
  });

  test('never returns more than the base price', () => {
    fc.assert(
      fc.property(
        fc.nat(300),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (age, value) => {
          return libVehicleValue.ageDepreciation(age, value) <= value;
        },
      ),
    );
  });

  test("never removes more than 60% of the car's value", () => {
    fc.assert(
      fc.property(
        fc.nat(300),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (age, value) => {
          return libVehicleValue.ageDepreciation(age, value) >= value * 0.4;
        },
      ),
    );
  });
});

describe('mileageDepreciation', () => {
  test('returns the base price if the vehicle has no mileas on it', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.mileageDepreciation(0, basePrice);
    expect(depreciatedValue).toBe(basePrice);
  });

  test('depreciates by .002 after 1000 miles', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.mileageDepreciation(
      1_000,
      basePrice,
    );
    expect(depreciatedValue).toBe(0.998);
  });

  test('depreciates by a multiple, not a constant value', () => {
    const basePrice = 10_000;
    const depreciatedValue = libVehicleValue.mileageDepreciation(
      1000,
      basePrice,
    );
    expect(depreciatedValue).toBe(basePrice - basePrice * 0.002);
  });

  test('calculates a 150k-mile depreciation for mileages exceeding 150k miles', () => {
    const basePrice = 1;
    const depreciatedValue = libVehicleValue.mileageDepreciation(
      151_000,
      basePrice,
    );
    const depreciationAmount = 0.002 * 150;
    const expectedValue = basePrice - basePrice * depreciationAmount;
    expect(depreciatedValue).toBe(expectedValue);
  });

  test('always returns a positive value', () => {
    fc.assert(
      fc.property(
        fc.nat(1_000_000),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (mileage, value) => {
          return libVehicleValue.mileageDepreciation(mileage, value) >= 0;
        },
      ),
    );
  });

  test('never returns more than the base price', () => {
    fc.assert(
      fc.property(
        fc.nat(1_000_000),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (mileage, value) => {
          return libVehicleValue.mileageDepreciation(mileage, value) <= value;
        },
      ),
    );
  });

  test("never removes more than 30% of the car's value", () => {
    fc.assert(
      fc.property(
        fc.nat(1_000_000),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (mileage, value) => {
          return (
            libVehicleValue.mileageDepreciation(mileage, value) >= value * 0.7
          );
        },
      ),
    );
  });
});

describe('ownersPenalty', () => {
  test("doesn't penalize if the vehicle has had < 2 owners", () => {
    const basePrice = 1;
    expect(libVehicleValue.ownersPenalty(1, basePrice)).toBe(basePrice);
  });

  test('penalizes the value if the vehicle has had >= 2 owners', () => {
    const basePrice = 1;
    expect(libVehicleValue.ownersPenalty(2, basePrice)).toBe(0.75);
  });

  test('only ever returns the base price or 75% of the abose price', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (owners, value) => {
          const newValue = libVehicleValue.ownersPenalty(owners, value);
          return newValue === value || newValue === value * 0.75;
        },
      ),
    );
  });
});

describe('ownersBonus', () => {
  test('issues a bonus if the vehicle has had no owners', () => {
    const basePrice = 1;
    expect(libVehicleValue.ownersBonus(0, basePrice)).toBe(1.1);
  });

  test('does nothing if the vehicle has had any owners', () => {
    const basePrice = 1;
    expect(libVehicleValue.ownersBonus(1, basePrice)).toBe(basePrice);
  });

  test('only ever returns the base price or 110% of the base price', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (owners, value) => {
          const newValue = libVehicleValue.ownersBonus(owners, value);
          return newValue === value || newValue === value * 1.1;
        },
      ),
    );
  });
});

describe('collisionsPenalty', () => {
  test('applies no penalty if there hae been no collisions', () => {
    const basePrice = 1;
    expect(libVehicleValue.collisionsPenalty(0, basePrice)).toBe(basePrice);
  });

  test('applies a 2% penalty if the vehicle has been in one collision', () => {
    const basePrice = 1;
    expect(libVehicleValue.collisionsPenalty(1, basePrice)).toBe(0.98);
  });

  test('only applies up to 5 collisions', () => {
    const basePrice = 1;
    expect(libVehicleValue.collisionsPenalty(6, basePrice)).toBe(
      basePrice - basePrice * (0.02 * 5),
    );
  });

  test('always returns a positive value', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (collisions, value) => {
          return libVehicleValue.collisionsPenalty(collisions, value) >= 0;
        },
      ),
    );
  });

  test('never returns more than the base price', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (collisions, value) => {
          return libVehicleValue.collisionsPenalty(collisions, value) <= value;
        },
      ),
    );
  });

  test("never removes more than 10% of the car's value", () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (collisions, value) => {
          // Floating point arithmetic is "fun"
          return (
            value * 0.9 - libVehicleValue.collisionsPenalty(collisions, value) <
            0.00001
          );
        },
      ),
    );
  });
});

describe('calcValue', () => {
  test('returns the base price if the vehicle is brand new, first owner', () => {
    const basePrice = 10_000;
    const actualValue = libVehicleValue.calcValue({
      basePrice,
      age: 0,
      mileage: 0,
      owners: 1,
      collisions: 0,
    });

    expect(actualValue).toBe(basePrice);
  });

  test("issues the vehicle a bonus if it's had no owners", () => {
    const basePrice = 10_000;
    const actualValue = libVehicleValue.calcValue({
      basePrice,
      age: 0,
      mileage: 0,
      owners: 0,
      collisions: 0,
    });

    expect(actualValue).toBe(11_000);
  });

  test("ignores mileage and collisions if they aren't specified", () => {
    const basePrice = 10_000;
    const actualValue = libVehicleValue.calcValue({
      basePrice,
      age: 0,
      owners: 1,
      collisions: null,
      mileage: null,
    });

    expect(actualValue).toBe(basePrice);
  });

  test('applies calculations for all factors', () => {
    const age = 24;
    const mileage = 65000;
    const owners = 2;
    const collisions = 2;
    const basePrice = 10_000;
    const expectedValue =
      basePrice *
      (1 - 0.005 * age) *
      (1 - (mileage / 1000) * 0.002) *
      (1 - 0.25) * // owners
      (1 - collisions * 0.02);

    expect(
      libVehicleValue.calcValue({
        basePrice,
        age,
        mileage,
        owners,
        collisions,
      }),
    ).toBe(expectedValue);
  });

  test('always returns a positive number', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1 }),
        fc.nat(),
        fc.nat(300_000),
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (basePrice, age, mileage, owners, collisions) => {
          const value = libVehicleValue.calcValue({
            basePrice,
            age,
            mileage,
            owners,
            collisions,
          });
          return value > 0;
        },
      ),
    );
  });

  test('never returns more than the base price + owner bonus', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.nat(300_000),
        fc.nat(),
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (age, mileage, owners, collisions, basePrice) => {
          const value = libVehicleValue.calcValue({
            basePrice,
            age,
            mileage,
            owners,
            collisions,
          });
          return value <= basePrice * 1.1;
        },
      ),
    );
  });

  test('never deducts more than the maximum penalty + depreciation', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.nat(300_000),
        fc.nat(),
        fc.nat(),
        fc.float({ min: 0, max: 60_000, noNaN: true }),
        (age, mileage, owners, collisions, basePrice) => {
          const value = libVehicleValue.calcValue({
            basePrice,
            age,
            mileage,
            owners,
            collisions,
          });
          const maxPenalty =
            0.6 * // age
            0.3 * // mileage
            0.25 * // owners
            0.1; // collisions
          return value >= value * maxPenalty;
        },
      ),
    );
  });
});
