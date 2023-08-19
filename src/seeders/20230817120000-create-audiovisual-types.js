"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "AudiovisualTypes",
      [
        {
          name: "Movie",
          code: "MOV",
        },
        {
          name: "Series",
          code: "SER",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("AudiovisualTypes", null, {});
  },
};
