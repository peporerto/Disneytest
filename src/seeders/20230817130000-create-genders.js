"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Genders",
      [
        {
          name: "Action",
          code: "ACT",
        },
        {
          name: "Comedy",
          code: "COM",
        },
        {
          name: "Drama",
          code: "DRM",
        },
        {
          name: "Adventure",
          code: "ADV",
        },
        // Agrega más géneros si es necesario
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Genders", null, {});
  },
};
