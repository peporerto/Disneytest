const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    const id = uuidv4();
    req.body.imageId = `${id}.jpg`;
    let filename = `${id}.jpg`;
    if (path.extname(file.originalname) !== ".jpg") {
      filename = `${id}.jpg`;
    }

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  dest: path.join(__dirname, "public/uploads"),
}).single("image");

module.exports = { upload };
