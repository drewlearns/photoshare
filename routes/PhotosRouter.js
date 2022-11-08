const express = require("express");
const PhotosRouter = express.Router();
const db = require("../models");
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
const upload = multer({ storage: fileStorageEngine });

PhotosRouter.route("/").get((request, response) => {
  db.photo
    .findAll()
    .then((photos) => {
      console.log("GET IMAGES");
      response.send(photos);
    })
    .catch((error) => {
      response.send(error);
    });
});

PhotosRouter.route("/")
  .post(upload.single("photo"), (request, response) => {
    const title = request.body.title;
    const mediaLocation = request.file.filename;
    var ext = mediaLocation.slice(-4);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== "jpeg") {
      response.send("Only photos are allowed, press go back to try again")
    } else {
      db.photo
        .create({ title: title, mediaLocation: mediaLocation })
        .then((photo) => {
          console.log("POST IMAGES");
          // response.send(photo);
          response.redirect("/");
        })
        .catch((error) => {
          response.send(error);
        });
    }
  })

  .put((request, response) => {
    console.log("PUT IMAGES");
    response.send("PUT IMAGES");
  })
  .delete((request, response) => {
    console.log("DELETE IMAGES");
    response.send("DELETE IMAGES");
  });

PhotosRouter.route("/:id") // for removing photos
  .delete((request, response) => {
    const id = request.params.id;
    db.photo
      .destroy({ where: { id: id } })
      .then((photo) => {
        response.send("Deleted");
      })
      .catch((error) => {
        response.send(error);
      });
  });

module.exports = PhotosRouter;
