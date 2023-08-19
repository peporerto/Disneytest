"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AudiovisualType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  AudiovisualType.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "AudiovisualType",
      timestamps: false,
    }
  );

  AudiovisualType.beforeValidate("validateData", (audiovisualType, options) => {
    if (!audiovisualType.name)
      throw new Error(
        JSON.stringify({
          code: "audiovisualType:create:missing-name",
          status: 428,
        })
      );

    if (!audiovisualType.code)
      throw new Error(
        JSON.stringify({
          code: "audiovisualType:create:missing-code",
          status: 428,
        })
      );
    if (!audiovisualType.status)
      throw new Error(
        JSON.stringify({
          code: "audiovisualType:create:missing-status",
          status: 428,
        })
      );
  });
  return AudiovisualType;
};
