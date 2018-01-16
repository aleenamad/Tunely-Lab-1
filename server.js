// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// serve static files from public folder
app.use(express.static(__dirname + '/public'));
// const albumsRoute = require('./routes/albums');

const db = require('./models');

/************
 * DATABASE *
 ************/

/* hard-coded data */



/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', (request, response) => {
  db.Album.find((err, albums) => {
    response.json(albums);
  });
});

app.get('/api/albums/:id', (request, response) => {
  db.Album.findById(request.params.id, (err, album) => {
    response.json(album);
  })
})

app.get('/api/albums/:album_id/songs', (request, response) => {
  db.Album.findById(request.params.album_id, (err, album) => {
    if (err) {
        response.status(500).send(err);
    }
    response.json(album.songs);
  })
})

app.post('/api/albums', (request, response) => {
  let album = new db.Album(request.body);
  album.save((err, createdAlbumObject) => {
    if (err) {
        response.status(500).send(err);
    }
    response.status(200).send(createdAlbumObject);
  });
})

app.post('/api/albums/:album_id/songs', (request, response) => {
  db.Album.findByIdAndUpdate(
    request.body.album_id,
    {$push: {songs: request.body.song}},
    {safe: true, upsert: true, new: true},
    function(err, model) {
      if (err) {
        response.status(500).send(err);
      }
      response.status(200).send(model);
    }
  );
})

app.put('/api/albums/:album_id', (request, response) => {
  db.Album.findByIdAndUpdate(
    request.params.album_id,
    {
      name: request.body.name,
      artistName: request.body.artistName,
      releaseDate: request.body.releaseDate
    },
    {new: true},
    function(err, model) {
      console.log(model);
      if (err) {
        response.status(500).send(err);
      }
      response.status(200).send(model);
    }
  );
})


app.delete('/api/albums/:album_id', (request, response) => {
  db.Album.findByIdAndRemove(request.params.album_id, (err, todo) => {
    if (err) {
      response.status(500).send(err);
    }
    response.status(200).send(todo);
  })
})

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
