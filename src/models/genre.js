"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   
    }
  }
  genre.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "genre",
      timestamps: false,
    }
  );

  genre.beforeValidate("validateData", (genre, options) => {
    if (!genre.name)
      throw new Error(
        JSON.stringify({
          code: "genre:create:missing-name",
          status: 428,
        })
      );

    if (!genre.code)
      throw new Error(
        JSON.stringify({
          code: "genre:create:missing-code",
          status: 428,
        })
      );
  });
  return genre;
};
