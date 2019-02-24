const express = require('express')

const config = require('./lib/config');

const app = express()
const port = parseInt(config.EXPRESS_PORT);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))