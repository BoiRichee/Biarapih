'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require("../helpers/bcrypt")
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(models.Profiles, {foreignKey: "userId"})
      Users.hasMany(models.Products, {foreignKey: "userId"})    }
  }
  Users.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        // Prevention If Email Already Exists
        args: true,
        message: "Email Already Exist"
      },
      validate: {
        // Validation if Email is Null, Empty, or Wrong Formatted
        notNull: {
          message: "Email is Required!"
        },
        notEmpty: {
          message: "Email is Required!"
        },
        isEmail: {
          message: "Email Format is Wrong!"
        }
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Validate Password Not Empty || Not Null
        notNull: {msg: "Password is required"},
        notEmpty: {msg: "Password is required"},
        // Validate Password Length Must Be At Least 6 Characters
        len: {
          args: [8],
          msg: "Password must be at least 8 characters!"
        }
      }
    },
    admin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  Users.beforeCreate((user) =>{
    user.password = hashPassword(user.password)
  })
  return Users;
};