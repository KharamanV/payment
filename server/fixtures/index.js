#!/bin/env node

require('../services/mongo');

const { runFixtures } = require('../services/utils');

runFixtures([]).then(process.exit);
