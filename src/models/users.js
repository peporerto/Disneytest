"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt"); // Asegúrate de importar el módulo bcrypt

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Aquí puedes definir asociaciones si es necesario
    }
    async comparePassword(candidatePassword) {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    }

    // Método para encriptar la contraseña
    async encryptPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }
  }

  Users.init(
    {
      username:{type: DataTypes.STRING,allowNull: false},
      password: {type: DataTypes.STRING,allowNull: false},
      email: {type: DataTypes.STRING,allowNull: false},
      status: {type: DataTypes.INTEGER,allowNull: false},
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  // Hooks beforeValidate
  Users.beforeValidate(async (user, options) => {
    if (!user.username) {
      throw new Error(
        JSON.stringify({
          code: "user:create:missing-username",
          status: 428,
        })
      );
    }

    if (!user.password) {
      throw new Error(
        JSON.stringify({
          code: "user:create:missing-password",
          status: 428,
        })
      );
    }

    // Encriptar la contraseña antes de validar
    user.password = await user.encryptPassword(user.password);
  });

  return Users;
};
