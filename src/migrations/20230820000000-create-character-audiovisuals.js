'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CharacterAudiovisuals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      characterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Characters",
          key: 'id'
        }
      },
      audiovisualId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Audiovisuals",
          key: 'id'
        }
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CharacterAudiovisuals');
  }
};