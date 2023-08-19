"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Audiovisual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Audiovisual.belongsToMany(models.Character, {
        through: models.CharacterAudiovisual,
        as: "characters",
        foreignKey: { name: "audiovisualId", allowNull: false },
      });
      Audiovisual.belongsTo(models.genre, {
        as: "genres",
        foreignKey: { name: "genreId", allowNull: false },
      });
      Audiovisual.belongsTo(models.AudiovisualType, {
        as: "type",
        foreignKey: { name: "typeId", allowNull: false },
      });
    }
  }
  Audiovisual.init(
    {
      image: DataTypes.STRING,
      title: { type: DataTypes.STRING, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Audiovisual",
      paranoid: true,
    }
  );

  Audiovisual.beforeValidate("validateData", (audiovisual, options) => {
    if (!audiovisual.title)
      throw new Error(
        JSON.stringify({
          code: "audiovisual:create:missing-title",
          status: 428,
        })
      );
    if (!audiovisual.rating)
      throw new Error(
        JSON.stringify({
          code: "audiovisual:create:missing-rating",
          status: 428,
        })
      );
  });
  return Audiovisual;
};
