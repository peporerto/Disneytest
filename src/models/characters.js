"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Character.belongsToMany(models.Audiovisual, {
        through: models.CharacterAudiovisual,
        as: "audiovisual",
        foreignKey: { name: "characterId", allowNull: false },
      });
    }
  }
  Character.init(
    {
      name: {type: DataTypes.STRING,allowNull: false},
      image: DataTypes.STRING,
      age: {type: DataTypes.INTEGER,allowNull: false},
      weight: {type: DataTypes.STRING,allowNull: false},
      story:{type: DataTypes.TEXT,allowNull: false},
      status: {type: DataTypes.INTEGER,allowNull: false},
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Character",
      paranoid: true,
      timestamps: true,
    }
  );

  Character.beforeValidate("validateData", (characters, options) => {
    if (!characters.name)
      throw new Error(
        JSON.stringify({
          code: "characters:create:missing-name",
          status: 428,
        })
      );
    if (!characters.age || isNaN(characters.age))
      throw new Error(
        JSON.stringify({
          code: "characters:create:missing-age",
          status: 428,
        })
      );
    if (!characters.weight || isNaN(characters.weight))
      throw new Error(
        JSON.stringify({
          code: "characters:create:missing-weight",
          status: 428,
        })
      );
    if (!characters.story)
      throw new Error(
        JSON.stringify({
          code: "characters:create:missing-story",
          status: 428,
        })
      );
  
  });
  return Character;
};
