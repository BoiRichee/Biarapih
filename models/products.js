'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsTo(models.Users, {foreignKey: "userId"})
      Products.hasMany(models.MyProducts, {foreignKey: "productId"})
    }
  }
  Products.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Name is required"},
        notEmpty: {msg: "Name is required"},
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Description is required"},
        notEmpty: {msg: "Description is required"},
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        // Validasi agar harga lebih besar dari 0
        min: {
          args: [1],
          msg: "Harga harus lebih besar dari 0"
        },
        // Validasi agar harga tidak bernilai negatif
        isPositive(value) {
          if (value < 0) {
            throw new Error("Harga tidak boleh negatif");
          }
        }
      }
    },
    stock: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        async isUnique(value) {
          const prodCat = await Products.findOne({where: {categoryId: value}})
          if (prodCat) {
            throw new Error("Product already has a category")
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
          const prodUser = await Products.findOne({where: {userId: value}})
          if (prodUser) {
            throw new Error("Product already has an author")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};