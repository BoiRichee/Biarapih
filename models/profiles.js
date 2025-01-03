'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profiles.belongsTo(models.Users, {foreignKey: "userId"})
    }
    get age(){
      return new Date().getFullYear() - new Date(this.dob).getFullYear()
    }
  }
  Profiles.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        async isUnique(value) {
          const profile = await Profiles.findOne({where: {userId: value}})
          if (profile) {
            throw new Error("Author already has a profile")
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Name is required"},
        notEmpty: {msg: "Name is required"},
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Photo is required"},
        notEmpty: {msg: "Photo is required"},
      }
    },
    bod: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {msg: "Date of Birth is required"},
        notEmpty: {msg: "Date of Birth is required"},
        isOlderThan18(value) {
          const age = new Date().getFullYear() - new Date(value).getFullYear()
          if (age < 18) {
            throw new Error("You must be at least 18 years old")
          }
        }
      }
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};