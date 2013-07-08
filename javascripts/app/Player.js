/*****************************************************************************
*  Player
*****************************************************************************/

Module("App.Player", function (Player) {

  Player.fn.initialize = function () {
    // Holds the universal audio context
    // TODO: adapter for cross-browser implementation
    this.context = new webkitAudioContext();
  };

  // Loads a song from an URL
  Player.fn.loadUrl = function (url) {
    var request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.overrideMimeType("application/json");

    request.onload = (function () {
      this.load(JSON.parse(request.response));
    }).bind(this);

    request.send();
  };

  // Loads a song into the player
  Player.fn.load = function (song) {
    this.song = new App.Song(song, this.context);
  };

  // Plays the song from the current position
  Player.fn.play = function () {
    if (!this.song) {
      throw "You have to load a song first.";
    }

    this.song.start();
  };

  // Stops the song and resets the position
  Player.fn.stop = function () {};

  // Stops the song and stores the position
  Player.fn.pause = function () {};

});
