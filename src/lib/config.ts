import nconf from 'nconf';

nconf.env().defaults({
  PORT: 3000,
  nhtsaUrl: 'https://vpic.nhtsa.dot.gov/api',
  maxDepreciationAge: 120,
  ageDepreciationMultiplier: 0.005,
  maxDepreciationMileage: 150000,
  mileageDepreciationMultiplier: 0.002,
  ownersPenaltyThreshold: 2,
  ownersPenaltyAmount: 0.25,
  ownersBonusAmount: 0.1,
  maxCollisions: 5,
  collisionsPenalty: 0.02,
});

export default nconf.get();
