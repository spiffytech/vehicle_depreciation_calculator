import nconf from 'nconf';
interface Config {
  PORT: number;
  nhtsaUrl: string;
  maxDepreciationAge: number;
  ageDepreciationMultiplier: number;
  maxDepreciationMileage: number;
  mileageDepreciationMultiplier: number;
  ownersPenaltyThreshold: number;
  ownersPenaltyAmount: number;
  ownersBonusAmount: number;
  maxCollisions: number;
  collisionsPenalty: number;
}

nconf.env({ parsedValues: true }).defaults({
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
} as Config);

export default nconf.get() as Config;
