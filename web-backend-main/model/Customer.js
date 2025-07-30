const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: "Customers", 
  timestamps: false, 
});

module.exports = Customer;
