/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */



 var $albumList;
 var allAlbums = [];



/* hard-coded data! */
// var sampleAlbums = [];
// sampleAlbums.push({
//              artistName: 'Ladyhawke',
//              name: 'Ladyhawke',
//              releaseDate: '2008, November 18',
//              genres: [ 'new wave', 'indie rock', 'synth pop' ]
//            });
// sampleAlbums.push({
//              artistName: 'The Knife',
//              name: 'Silent Shout',
//              releaseDate: '2006, February 17',
//              genres: [ 'synth pop', 'electronica', 'experimental' ]
//            });
// sampleAlbums.push({
//              artistName: 'Juno Reactor',
//              name: 'Shango',
//              releaseDate: '2000, October 9',
//              genres: [ 'electronic', 'goa trance', 'tribal house' ]
//            });
// sampleAlbums.push({
//              artistName: 'Philip Wesley',
//              name: 'Dark Night of the Soul',
//              releaseDate: '2008, September 12',
//              genres: [ 'piano' ]
//            });
/* end of hard-coded data */




// $(document).ready(function() {
//   console.log('app.js loaded!');
//   for (let i = 0; i < sampleAlbums.length; i++) {
//     renderAlbum(sampleAlbums[i]);
//   }
// });


$(document).ready(function(){

  $albumList = $('#albums');

  $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: handleSuccess,
    error: handleError
  });

  $('#addNewAlbum').on('submit', (e) => {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/albums',
      data: {
        name: e.currentTarget["1"].value,
        artistName: e.currentTarget["2"].value,
        releaseDate: e.currentTarget["3"].value,
        genres: e.currentTarget["4"].value.split(',')
      },
      success: newAlbumSuccess,
      error: newAlbumError
    });
  });

  //adds event listener to "Add Song" buttons
  $(document).on('click', '.add-song', function(e) {
      //retrieves album id associated with the add song button that was clicked
      var currentAlbumId = $(this).parents('.album').data('album-id');
      //adds album id as a data attribute to the song modal so it can be passed into the ajax call later
      $('#songModal').attr('data-album-id', currentAlbumId);
  });


  $('#saveSong').click((e) => {
    //checks to see that both text fields have data in them before running the handleNewSongSubmit function
    if (e.target.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[3].childNodes[3].childNodes[1].value !== "" && e.target.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[7].childNodes[3].childNodes[1].value !== "") {
      handleNewSongSubmit(e);
    }
  });

  $(document).on('click', '.delete', (e) => {
    handleDeleteButton(e);
  })
});

const handleNewSongSubmit = (e) => {
  e.preventDefault();
  let targetAlbumId = e.target.parentElement.parentNode.parentNode.parentNode.dataset.albumId;
  let url = '/api/albums/' + targetAlbumId + '/songs';
  $.ajax({
    method: 'POST',
    url: url,
    data: {
      song: {
        name: e.target.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[3].childNodes[3].childNodes[1].value,
        trackNumber: e.target.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[7].childNodes[3].childNodes[1].value
      },
      album_id: targetAlbumId
    },
    success: newSongSuccess,
    error: newSongError
  })
}

const handleDeleteButton = (e) => {
  e.preventDefault();
  let targetAlbumId = e.target.parentElement.parentNode.parentNode.parentNode.dataset.albumId;
  let url = '/api/albums/' + targetAlbumId;
  $.ajax({
    method: 'DELETE',
    url: url,
    success: deleteAlbumSuccess,
    error: deleteAlbumError
  })
}

const deleteAlbumSuccess = (json) => {
  for (let i = 0; i < allAlbums.length; i++) {
    if (json._id === allAlbums[i]._id) {
      allAlbums.splice(i, 1);
    }
  }
  render();
}

const deleteAlbumError = () => {
  console.log('delete album error!');
}


function getSongHtml(song) {
  let currentSongHtml =
  "<li class='list-group-item'>" +
   song.trackNumber + " - " + song.name +
  "</li>";
  return currentSongHtml;
}

function buildSongsHtml(songs) {
 let songList = songs.map(getSongHtml).join("");
 let songsHtml =
 "<ul>" +
 "<h4 class='inline-header'>Songs:</h4>" +
 songList +
 "</ul>"
 return songsHtml;
}


function getAlbumHtml(album) {
  let currentAlbumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
  buildSongsHtml(album.songs) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "<button type='button' class='btn btn-primary add-song' data-toggle='modal' data-target='#songModal'>Add Song</button>" +
  "<button type='button' class='btn btn-danger delete'>Delete</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";
  return currentAlbumHtml;
}

function getAllAlbumsHtml(albums) {
  return albums.map(getAlbumHtml).join("");
}


function render () {
  // empty existing posts from view
  $albumList.empty();
  // pass `allAlbums` into the template function
  var albumsHtml = getAllAlbumsHtml(allAlbums);
  // append html to the view
  $albumList.append(albumsHtml);
};

function newAlbumSuccess(json) {
  $("input[type=text], textarea").val("");
  allAlbums.push(json);
  render();
}

function newAlbumError() {
  console.log('new album error!');
}

function newSongSuccess(json) {
  //clear fields in add new song modal
  $("#songName").val("");
  $("#trackNumber").val("");
  //find updated album id and replace album with updated version
  for (let i = 0; i < allAlbums.length; i++) {
    if (json._id === allAlbums[i]._id) {
      allAlbums.splice(i, 1, json);
    }
  }
  render();
}

function newSongError() {
  console.log('new song error!');
}

function handleSuccess(json) {
  allAlbums = json;
  render();
}

function handleError(e) {
  console.log('uh oh');
  $('#albums').text('Failed to load albums, is the server working?');
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + "HARDCODED ALBUM ID" + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + "HARDCODED ALBUM NAME" + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + "HARDCODED ARTIST NAME" + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + "HARDCODED RELEASE DATE" + "</span>" +
  "                      </li>" +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
    $('#albums').prepend(albumHtml);
}
