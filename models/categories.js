'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categories.hasMany(models.Products, {foreignKey: "categoryId"})
    }
  }
  Categories.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Name is required"},
        notEmpty: {msg: "Name is required"},
      }
    }
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};