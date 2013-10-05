/*****************************************************************************
*  Song
*****************************************************************************/

Module("App.Song", function (Song) {

  Song.fn.initialize = function (song, audioContext) {
    var signature = song.time_signature.split("/");

    this.title = song.title;
    this.tempo = song.tempo;
    this.beatsPerBar = signature[0];
    this.beatDuration = signature[1];
    this.tracks = [];
    this.currentCycle = 0;
    this.playing = false;

    this.cycleDuration = Song.calculateCycle(this.tempo);

    // Loads all tracks from a song
    for (var i = 0, l = song.score.length; i < l; i++) {
      this.tracks.push(new App.Track(song.score[i], audioContext));
    }
  };

  // Calculates the cycle used to play the notes. The cycle is the minimum
  // possible duration for a note, which will serve as base for playing
  // the beats.
  //
  // The cycle is the duration of a Hemidemisemiquaver (OMG) note,
  // which is 1/64 the duration of a whole note (semibreve).
  //
  // Tried using a Demisemihemidemisemiquaver (OMFG)—a 1/256 note–but that
  // didn't work quite well.
  Song.calculateCycle = function (tempo) {
    var cycleDuration = 60000 / (tempo * 16);

    return cycleDuration;
  };

  // Starts the cycle that plays the note
  Song.fn.play = function (cycle) {
    if (this.playing) { return; }

    if (cycle) {
      this.currentCycle = cycle;
    }

    this.playing = true;
    this._renderCycle();
  };

  // Stops the cycle rendering
  Song.fn.pause = function () {
    this.playing = false;
  };

  // Stops the cycle rendering and reset position to zero
  Song.fn.stop = function () {
    this.playing = false;
    this.currentCycle = 0;
  };

  // Loops the animation, calling itself according to the fps
  Song.fn._renderCycle = function () {
    if (!this.playing) { return true; }

    for (var i = 0, l = this.tracks.length; i < l; i++) {
      this.tracks[i].playNote(this.currentCycle, this.cycleDuration);
    }

    this.currentCycle = this.currentCycle + 1;

    setTimeout(this._renderCycle.bind(this), this.cycleDuration);
  };

});
