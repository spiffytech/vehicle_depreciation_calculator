This project was a work sample task requested by a job I interviewed for. I have
occasionally updated it to reflect changes in my skillset.

Objective: given details about a vehicle's history, return the depreciated value
of the vehicle.

# Configuring
Configuration happens via environment variables. See `src/lib/config.js` for default configuration values.

# Running

`npm start`

# Testing

`npm test`

# Using

`curl 'http://localhost:3000/value?owners=1&collisions=2&mileage=65000&age=36&make=honda&model=GOLDWING&basePrice=10000'`

Requires the following parameters:

- basePrice [the project spec suggests this should be optional, but the NHTSA
  does not support requesting vehicle base prices]
- age
- make
- model
- owners

Optional fields:

- mileage
- collisions

_Note: the project spec does not indicate where the vehicle MSRP data should
come from. As the NHTSA does not supply that data, I made elected to have it be
supplied by the user._

# Original Spec

You are tasked with writing a nodejs REST server which exposes an endpoint for /value
This endpoint takes in data about a vehicle, then returns the value of a used car.

Given the following data:

MAKE & MODEL:

Verify that the make and model are known to the U.S. DEPARTMENT OF TRANSPORTATION.
If the vehicle make is not listed, return an HTTP error.

We recommend that you check against this free API: 

https://vpic.nhtsa.dot.gov/api/

Hint: /getmodelsformake/{make} looks like a useful endpoint

AGE:

Given the number of months of how old the car is, reduce its value one-half (0.5) percent. 

After 10 years, it's value cannot be reduced further by age. This is not cumulative.

MILEAGE:

Given the vehicle’s mileage, reduce its value by one-fifth of a percent (0.2) for every 1,000 miles.
After 150,000 miles, it's value cannot be reduced further by miles.  Do not consider any remaining miles.

OWNERS:

If the car has had more than 2 previous owners, reduce its value by twenty-five (25) percent.

If the car has had no previous owners, add ten (10) percent to the FINAL car value at the end.

COLLISIONS:

For every reported collision the car has been in, remove two (2) percent of its value, up to five (5) collisions.

Caveats:

    MAKE, MODEL, AGE, and OWNERS are mandatory fields – all other fields are optional.  The service should calculate a value based on present data; omitted data should not affect the calculation.
    As stated above, the order of value adjustments should be applied differently if the OWNERS had a positive effect.
    Each value affecting factor should apply to the total cumulative value.
    No authentication or authorization is required.
    No data persistence is required.
    Demonstrate an understanding of best practices for REST, service development, code organization, testing, and formatting.