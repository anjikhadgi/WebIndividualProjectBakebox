const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Cred = sequelize.define('Cred', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cred;
