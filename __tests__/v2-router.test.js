'use strict';

process.env.SECRET = 'TEST_SECRET';

const supertest = require('supertest');
const { db } = require('../src/models');
const { server } = require('../src/server');
const { users } = require('../src/auth/models');

const mockRequest = supertest(server);

let userData = {
  testUser: { username: 'admin', password: 'pass', role: 'admin' },
};

beforeAll(async () => {
  await db.sync();
  await users.create(userData.testUser);
});
afterAll(async () => {
  await db.drop();
});

const testFood = {
  name: 'salmon',
  calories: 5000,
  type: 'protein',
};

const testFood2 = {
  name: 'grapes',
  calories: 100,
  type: 'fruit',
};

const testUpdate = {
  name: 'salmon',
  calories: 500,
  type: 'protein',
};

describe('v2 Router', () => {
  let token;
  
  it('Can create a new food item', async () => {
    const signinResponse = await mockRequest.post('/signin').auth('admin', 'pass');
    token = signinResponse.body.token;

    const response = await mockRequest.post('/api/v2/food')
      .send(testFood)
      .set('Authorization', `bearer ${token}`);

    const foodObject = response.body;

    expect(response.status).toEqual(201);
    expect(foodObject.id).toBeDefined();
    expect(foodObject.name).toEqual(testFood.name);
  });
  
  it('returns a list of food items', async () => {
    await mockRequest.post('/api/v2/food')
      .send(testFood2)
      .set('Authorization', `bearer ${token}`);

    const response = await mockRequest.get('/api/v2/food')
      .set('Authorization', `bearer ${token}`);

    const foodObjects = response.body;
    console.log(foodObjects);

    expect(response.status).toEqual(200);
    expect(foodObjects.length).toEqual(2);
    expect(foodObjects[1].name).toEqual(testFood2.name);
  });
  
  it('returns a single food by id', async () => {
    const response = await mockRequest.get('/api/v2/food/2')
      .set('Authorization', `bearer ${token}`);

    console.log(response.body);

    const foodObject = response.body;

    expect(response.status).toEqual(200);
    expect(foodObject.id).toEqual(2);
    expect(foodObject.name).toEqual(testFood2.name);
  });
  
  it('Can update a food item', async () => {
    const response = await mockRequest.put('/api/v2/food')
      .send(testFood)
      .set('Authorization', `bearer ${token}`);

    const foodObject = response.body;
    console.log('🚀 ~ file: v2-router.test.js:95 ~ it ~ foodObject', foodObject);

    expect(response.status).toEqual(201);
    expect(foodObject.id).toBeDefined();
    expect(foodObject.name).toEqual(testUpdate.name);
  });
  
  it('Can delete a food item', async () => {
    const response = await mockRequest.delete('/api/v2/food/1')
      .set('Authorization', `bearer ${token}`);

    const foodObject = response.body;
    console.log('🚀 ~ file: v2-router.test.js:108 ~ it ~ foodObject', foodObject);

    const response2 = await mockRequest.get('/api/v2/food/1')
      .set('Authorization', `bearer ${token}`);

    console.log('---------', response2.body);

    

    expect(response.status).toEqual(200);
    expect(foodObject).toEqual(1);

    expect(response2.status).toEqual(200);
    expect(response2.body).toBeNull();
  });

});