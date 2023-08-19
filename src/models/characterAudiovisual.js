"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CharacterAudiovisual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CharacterAudiovisual.init(
    {
      characterId: { type: DataTypes.INTEGER, allowNull: false },
      audiovisualId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "CharacterAudiovisual",
      timestamps: false,
    }
  );

  CharacterAudiovisual.beforeValidate(
    "validateData",
    (characterAudiovisual, options) => {
      if (!characterAudiovisual.characterId)
        throw new Error(
          JSON.stringify({
            code: "characterAudiovisual:create:missing-characterId",
            status: 428,
          })
        );

      if (!characterAudiovisual.audiovisualId)
        throw new Error(
          JSON.stringify({
            code: "characterAudiovisual:create:missing-audiovisualId",
            status: 428,
          })
        );
      if (!characterAudiovisual.status)
        throw new Error(
          JSON.stringify({
            code: "characterAudiovisual:create:missing-status",
            status: 428,
          })
        );
    }
  );
  return CharacterAudiovisual;
};
