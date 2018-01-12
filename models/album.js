var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var albumSchema = new Schema ( {
  artistName: String,
  name: String,
  releaseDate: String,
  genres: Array
});

var Album = mongoose.model('Album', albumSchema);

module.exports = Album;
