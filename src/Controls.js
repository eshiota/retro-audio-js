/*****************************************************************************
*  Controls
*****************************************************************************/

Module("Retro.Controls", function (Controls) {

  // Turns Controls into an event emmiter
  SH.extend(Controls.fn, Retro.Events);

  Controls.fn.initialize = function () {
    this.element = document.querySelector("[data-player-controls]");
    this.songControls = this.element.querySelector("[data-song-controls]");
    this.playbackControls = this.element.querySelector("[data-playback-controls]");
    this.songInfo = this.element.querySelector("[data-song-info]");

    this._attachEvents();
  };

  Controls.fn.updateSongInfo = function (title) {
    this.songInfo.querySelector("[data-current-song]").textContent = "Current song: " + title;
  };

  Controls.fn.switchToPlayStatus = function () {
    this.playbackControls.querySelector("[data-play]").style.display = "none";
    this.playbackControls.querySelector("[data-pause]").style.display = "block";
    this.playbackControls.querySelector("[data-stop]").style.display = "block";
  };

  Controls.fn.switchToStopStatus = function () {
    this.playbackControls.querySelector("[data-play]").style.display = "block";
    this.playbackControls.querySelector("[data-pause]").style.display = "none";
    this.playbackControls.querySelector("[data-stop]").style.display = "block";
  };

  // Private
  // -------

  Controls.fn._attachEvents = function () {
    this.playbackControls.querySelector("[data-play]").addEventListener("click", this._onPlayClick.bind(this));
    this.playbackControls.querySelector("[data-stop]").addEventListener("click", this._onStopClick.bind(this));
    this.playbackControls.querySelector("[data-pause]").addEventListener("click", this._onPauseClick.bind(this));
    this.songControls.querySelector("[data-song-load]").addEventListener("click", this._onLoadClick.bind(this));
  };

  // Callbacks
  // ---------

  Controls.fn._onPlayClick = function (event) {
    this.switchToPlayStatus();
    this.trigger("play-click");
  };

  Controls.fn._onStopClick = function (event) {
    this.switchToStopStatus();
    this.trigger("stop-click");
  };

  Controls.fn._onPauseClick = function (event) {
    this.switchToStopStatus();
    this.trigger("pause-click");
  };

  Controls.fn._onLoadClick = function (event) {
    var song = this.songControls.querySelector("[data-song-select]").value;

    this.switchToStopStatus();
    this.trigger("load-click", song);
  };

});
