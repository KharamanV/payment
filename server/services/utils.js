async function runFixtures(fixtures) {
  for (let i = 0; i < fixtures.length; i++) {
    await fixtures[i]();
  }
}

module.exports = { runFixtures };
