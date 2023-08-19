const {
  Character,
  Audiovisual,
  genre,
  AudiovisualType,
  CharacterAudiovisual,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const getAllCharacters = async (req, res, next) => {
  try {
    const characters = await Character.findAll({
      attributes: ["image", "name"],
      where: { status: 2 },
      include: [
        {
          required: false,
          model: Audiovisual,
          as: "audiovisual",
          include:[
            {
              model: genre,
              as: "genres",
              required: false,
              attributes: ["name"],
            },
            {
              model: AudiovisualType,
              as: "type",
              required: false,
              attributes: ["name"],
            },
          ],
          attributes: ["title", "rating", "image"],
          where: { status: 2 },
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).json(characters);
  } catch (error) {
    console.error(error);
  }
};
const getCharacterByfilter = async (req, res, next) => {
  const { filter } = req.params;
  try {
    const character = await Character.findOne({
      attributes: ["name", "image", "age", "weight", "story"],
      where: {
        [Op.and]: [
          { status: 2 },
          {
            [Op.or]: {
              name: { [Op.like]: `%${filter}%` },
              age: { [Op.regexp]: `%${filter}%` },
              weight: { [Op.regexp]: `(${filter})` },
            },
          },
        ],
      },
      include: [
        {
          model: Audiovisual,
          as: "audiovisual",
          attributes: ["title", "rate", "image"],
          where: { status: 2 },

          through: {
            attributes: [],
          },
          required: false,
          include: [
            {
              model: genre,
              as: "genre",
              required: false,
              attributes: ["name"],
            },
            {
              model: AudiovisualType,
              as: "type",
              required: false,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.status(200).json(character);
  } catch (error) {
    console.error(error);
  }
};

const updatedCharacter = async (req, res, next) => {
  const { characterId } = req.params;
  const { name, age, weight, story } = req.body;

  try {
    const character = await Character.findOne({
      where: {
        id: characterId,
        status: 2,
      },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    await character.update({
      name,
      age,
      weight,
      story,
    });

    res.status(200).json({ message: "Character updated successfully" });
  } catch (error) {
    console.error(error);
  }
};
const deleteCharacter = async (req, res, next) => {
  const { characterId } = req.params;

  try {
    const character = await Character.findOne({
      where: {
        id: characterId,
        status: 2, 
      },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Marcar el personaje como eliminado (eliminación suave)
    await character.destroy();

    res.status(200).json({ message: "Character deleted successfully" });
  } catch (error) {
    console.error(error);
  }
};

const createCharacter = async (req, res, next) => {
  const { imageId, name, age, weight, story, audiovisualId } = req.body;
  console.log(name);
  try {
    const createdCharacter = await sequelize.transaction(
      async (transaction) => {
        const character = await Character.create(
          {
            name,
            age,
            image: imageId,
            weight,
            story,
            status: 2,
          },
          {
            transaction,
            logging: (sql, queryObject) => {
              console.log(sql);
              console.log(queryObject["bind"]);
            },
          }
        );

        await CharacterAudiovisual.create(
          {
            characterId: character.id,
            audiovisualId: audiovisualId,
            status: 2,
          },
          {
            transaction,
            logging: (sql, queryObject) => {
              console.log(sql);
              console.log(queryObject["bind"]);
            },
          }
        );

        return character;
      }
    );

    res.status(201).json({
      message: "Character created successfully",
      character: createdCharacter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCharacters,
  updatedCharacter,
  deleteCharacter,
  createCharacter,
  getCharacterByfilter,
};
