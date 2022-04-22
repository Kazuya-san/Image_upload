const express = require("express");
const multer = require("multer");
const mongoos = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

const Title = require("./models/Title");

dotenv.config();

const app = express();

//connect to mongodb
mongoos
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//configure multer to upload images check extension and size
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    //check file extension
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|webg|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, file.originalname);
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/getall", (req, res) => {
  Title.find()
    .then((titles) => {
      if (titles.length > 0) {
        res.status(200).json(titles);
      } else {
        res.status(404).json({ message: "No titles found" });
      }
    })
    .catch((err) => {
      res.status(404).json({ "Not found": "No titles found" });
    });
});

//get single title
app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  Title.findById(id)
    .then((title) => {
      if (title) {
        res.status(200).json(title);
      } else {
        res.status(404).json({ message: "No title found" });
      }
    })
    .catch((err) => {
      res.status(404).json({ "Not found": "No title found" });
    });
});

app.post(
  "/upload",
  multer({ storage: storage }).single("image"),
  (req, res) => {
    const title = new Title({
      title: req.body.title,
      image: req.file.path,
    });
    title
      .save()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ "Server Error": "Can't upload" });
      });
  }
);

//put request also unlink the image from the server
//The name inside the single has to be the same as the name in the form
app.put(
  "/update/:id",
  multer({ storage: storage }).single("image"),
  (req, res) => {
    Title.findById(req.params.id)
      .then((title) => {
        title.image = req.file.path;

        title.title = req.body.title;
        title
          .save()
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            res.status(500).json({ "Server Error": "Can't update" });
          });
      })
      .catch((err) => {
        res.status(404).json({ "Not found": "No title found" });
      });
  }
);

app.delete("/deleteall", (req, res) => {
  Title.deleteMany()
    .then(() => {
      //delete all images from the server
      fs.readdir("./uploads/", (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink("./uploads/" + file, (err) => {
            if (err) throw err;
          });
        }
      });

      res.status(200).json({ message: "All titles deleted" });
    })
    .catch((err) => {
      res.status(500).json({ "Server Error": "Can't delete" });
    });
});

// app.put(
//     "/update/:id",
//     multer({ storage: storage }).single("image"),
//     (req, res) => {
//       Title.findById(req.params.id)
//         .then((title) => {
//           title.title = req.body.title;
//           title.image = req.file.path;
//           title
//             .save()
//             .then((data) => {
//               res.status(200).json(data);
//             })
//             .catch((err) => {
//               res.status(500).json({ "Server Error": "Can't update" });
//             });
//         })
//         .catch((err) => {
//           res.status(404).json({ "Not found": "No title found" });
//         });
//     }
//   );

//host the uploads folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
