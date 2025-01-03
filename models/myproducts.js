'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MyProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MyProducts.belongsToMany(models.Products, {foreignKey: "productId"})
    }
  }
  MyProducts.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        async isUnique(value) {
          const product = await MyProducts.findOne({where: {productId: value}})
          if (product) {
            throw new Error("Not your products")
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        async isUnique(value) {
          const prodUser = await MyProducts.findOne({where: {userId: value}})
          if (prodUser) {
            throw new Error("Product belongs to another user")
          }
        }
      }
    },
    stock: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'MyProducts',
  });
  return MyProducts;
};