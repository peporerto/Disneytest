const {
  Character,
  Audiovisual,
  genre,
  CharacterAudiovisual,
  AudiovisualType,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const getAllAudiovisual = async (req, res, next) => {
  try {
    const audiovisuals = await Audiovisual.findAll({
      attributes: ["title", "rating", "image"],
      where: { status: 2 },
      include: [
        {
          required: false,
          model: Character,
          as: "characters",
          attributes: ["name", "image"],
          through: {
            attributes: [],
          },
        },
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
    });

    res.status(200).json(audiovisuals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAudiovisualByFilter = async (req, res, next) => {
  const { title, genres } = req.query;
  console.log(title, genres);

  try {
    const audiovisuals = await Audiovisual.findAll({
      where: {
        status: 2,
        title: {
          [Op.like]: `%${title || ""}%`,
        },
      },
      attributes: ["title", "rating", "image", "createdAt"],
      include: [
        {
          model: Character,
          as: "characters",
          attributes: ["name", "image"],
          through: {
            attributes: [],
          },
        },
        {
          model: genre,
          as: "genres",
          attributes: ["name"],
          where: {
            name: {
              [Op.like]: `%${genres || ""}%`,
            },
          },
          required: genres ? true : false,
        },
        {
          model: AudiovisualType,
          as: "type",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(audiovisuals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateAudiovisual = async (req, res, next) => {
  const { audiovisualId } = req.params;
  const { title, rating, image } = req.body;

  try {
    const audiovisual = await Audiovisual.findOne({
      where: {
        id: audiovisualId,
        status: 2,
      },
    });

    if (!audiovisual) {
      return res.status(404).json({ message: "Audiovisual content not found" });
    }

    await audiovisual.update({
      title,
      rating,
      image,
    });

    res
      .status(200)
      .json({ message: "Audiovisual content updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAudiovisual = async (req, res, next) => {
  const { audiovisualId } = req.params;

  try {
    const audiovisual = await Audiovisual.findOne({
      where: {
        id: audiovisualId,
        status: 2,
      },
    });

    if (!audiovisual) {
      return res.status(404).json({ message: "Audiovisual content not found" });
    }

    // Marcar el contenido audiovisual como eliminado (eliminación suave)
    await audiovisual.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAudiovisual = async (req, res, next) => {
  const { imageId, title, rating, genreId, typeId, characters } = req.body;

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const audiovisual = await Audiovisual.create(
        {
          title,
          rating,
          image: imageId,
          genreId,
          status: 2,
          typeId,
        },
        {
          transaction,
          logging: (sql, queryObject) => {
            console.log(sql);
            console.log(queryObject["bind"]);
          },
        }
      );
      const characterAll = characters.map(async (element) => {
        const { name, age, weight, story } = element;

        const character = await Character.create(
          {
            name,
            age,
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
            audiovisualId: audiovisual.id,
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
      });

      await Promise.all(characterAll);
    });

    res.status(201).json({
      message: "Audiovisual content created successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllAudiovisual,
  getAudiovisualByFilter,
  updateAudiovisual,
  deleteAudiovisual,
  createAudiovisual,
};
