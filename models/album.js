var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Song = require("./song");

var albumSchema = new Schema ( {
  artistName: String,
  name: String,
  releaseDate: String,
  genres: Array,
  song: [Song.Schema]
});

var Album = mongoose.model('Album', albumSchema);




module.exports = Album;
