'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes');
const foodModel = require('./food');
const Collection = require('./data-collection.js');
const { db: sequelize } = require('../auth/models');

// const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

// const sequelize = new Sequelize(DATABASE_URL);
const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
};
