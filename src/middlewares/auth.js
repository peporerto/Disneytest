const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  // Get the token from the headers
  const grossToken = req.headers["authorization"];

  // if does not exists a token
  if (!grossToken) {
    return res.status(401).send({ auth: false, message: "No Token Provided" });
  }

  const token = grossToken.replace("Bearer ", "");
  // decode the token
  const decoded = await jwt.verify(token, process.env.SECRET);

  // save the token on request object to using on routes
  req.userId = decoded.id;

  // continue with the next function
  next();
}

module.exports = {
  verifyToken,
};
