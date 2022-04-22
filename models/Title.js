const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const TitleSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  image: {
    type: String,
  },
});

module.exports = mongoose.model("Tags", TitleSchema);
