/*****************************************************************************
*  Player
*****************************************************************************/

Module("Retro.Player", function (Player) {

  Player.fn.initialize = function () {
    // Holds the universal audio context
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();

    this.controls = new Retro.Controls();
    this.isPlaying = false;

    this._registerInterests();
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
    if (this.song) { this.stop(); }

    this.song = new Retro.Song(song, this.context);
    this.controls.updateSongInfo(song.title);
  };

  // Plays the song from the current position.
  // If a cycle is given, plays the song starting on that cycle.
  Player.fn.play = function (cycle) {
    if (!this.song) { return; }
    if (this.isPlaying) { return; }

    this.song.play(cycle);
    this.isPlaying = true;
  };

  // Stops the song and resets the position
  Player.fn.stop = function () {
    if (!this.song) { return; }

    this.song.stop();
    this.isPlaying = false;
  };

  // Stops the song and stores the position
  Player.fn.pause = function () {
    if (!this.song) { return; }
    if (!this.isPlaying) { return; }

    this.song.pause();
    this.isPlaying = false;
  };

  // Private
  // -------

  Player.fn._registerInterests = function () {
    this.controls.on("load-click", this.loadUrl, this);
    this.controls.on("stop-click", this.stop, this);
    this.controls.on("pause-click", this.pause, this);
    this.controls.on("play-click", this.play, this);
  };

});
