const jwt = require("jsonwebtoken");
const { Users, sequelize } = require("../models");
const sendEmail = require('../utils/email');

const createUsers = async (req, res, next) => {
  try {
    const { username,email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      throw new Error("El cuerpo de la solicitud está vacío");
    }

    await sequelize.transaction(async (transaction) => {
      return Users.create(
        { username, email,password, status: 2 },
        {
          transaction,
          logging: (sql, queryObject) => {
            console.log(sql);
            console.log(queryObject["bind"]);
          },
        }
      );
    });
    // Enviar correo de confirmación
  const subject = 'Confirmación de registro';
  const message = '¡Gracias por registrarte en nuestro sitio!';

  sendEmail(email, subject, message)

    // Create a Token
    const token = jwt.sign({ id: Users.id }, process.env.SECRET, {
      expiresIn: 60 * 60 * 24, // expires in 24 hours
    });

    return res.send({ message: "create user", token });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res) => {
  const user = await Users.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    return res.status(404).send("The username doesn't exists");
  }
  const validPassword = await user.comparePassword(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    return res.status(401).send({ auth: false, token: null });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24,
  });
  res.status(200).json({ auth: true, token });
};

const logout = async (req, res) => {
  res.status(200).send({ auth: false, token: null });
};

module.exports = {
  createUsers,
  signin,
  logout,
};
