process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const should = require('chai').should();
const supertest = require('supertest');
const app = require('../');
const request = supertest(app);

module.exports = {
  should,
  request,
  loadFixtures,
  clearFixtures,
  auth,
  mongoose,
};

function loadFixtures(fixtures) {
  return Promise.all(
    Object.entries(fixtures)
      .map(([model, data]) => {
        const Model = mongoose.model(model);

        return Promise.all(data.map(data => new Model(data).save()));
      })
  );
}

function clearFixtures(fixtures) {
  return Promise.all(Object.keys(fixtures).map(model => mongoose.model(model).remove()));
}

function auth(username, password) {
  return request.post('/api/auth')
    .send({ username, password })
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => res.body.token.should.be.a('string') && res.body.token);
}
