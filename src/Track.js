/*****************************************************************************
*  Track
*****************************************************************************/

Module("App.Track", function (Track) {

  Track.fn.initialize = function (track, audioContext) {
    this.instrument = new App.Instrument(track.instrument, track.volume, audioContext);
    this.sheet = Track.parseTrack(track.sheet);
  };

  // Parses a track of notes
  Track.parseTrack = function (track) {
    var parsedTrack = {}
      , currentCycle = 0
      , element
      , elementCycles // how many cycles does an element lasts
      , tupletCycle // stores the tuplet cycle in relation to the current cycle
    ;

    for (var i = 0, l = track.length; i < l; i++) {
      element = Track.parseTrackElement(track[i]);

      if (element.belongsToTuplet) {
        // If element is part of a tuplet, we have to put it into the
        // correct cycles.

        // The tuplet lasts for these cycles in total
        elementCycles = Math.floor(64 / (element.value / 2));

        // The tuplet starts at the current cycle
        tupletCycle = currentCycle;
        parsedTrack[tupletCycle + ""] = element;
        tupletCycle = tupletCycle + Math.ceil(elementCycles / element.tupletValue);

        // We iterate through the tuplet notes outside the main
        // loop, and then continue with the parsing.
        for (var j = 1; j < element.tupletValue; j++) {
          i++;
          parsedTrack[tupletCycle + ""] = Track.parseTrackElement(track[i]);

          tupletCycle = tupletCycle + Math.ceil(elementCycles / element.tupletValue);
        }
      } else {
        parsedTrack[currentCycle + ""] = element;

        elementCycles = Math.floor(64 / element.value);
      }

      if (element.isDotted) {
        elementCycles = elementCycles + Math.floor((64 / element.value) / 2);
      }

      currentCycle = currentCycle + elementCycles;
    }
    return parsedTrack;
  };

  // Parses a note/chord of a track
  Track.parseTrackElement = function (element) {
    if (Array.isArray(element)) {
      return new App.Chord(element);
    }

    return new App.Note(element);
  };

  // Gets a note for a given cycle. If the cycle has no note,
  // do nothing.
  //
  // * `cycle`: The cycle of the music
  // * `cycleDuration`: How many milliseconds a cycle lasts
  Track.fn.playNote = function (cycle, cycleDuration) {
    var note = this.sheet[cycle]
      , duration
    ;

    if (note && !note.isPause) {
      // The duration of a note is actually a fraction. So the higher the
      // value, the shorter the note.
      // A whole note (semibreve) has 64 cycles. So a note is
      // (whole note / note fraction) * cycle duration.
      if (note.belongsToTuplet) {
        duration = Math.ceil(((64 / (note.value / 2)) * cycleDuration) / note.tupletValue);
      } else {
        duration = ((64 / note.value) * cycleDuration);
      }

      if (note.isDotted) {
        duration = duration + (duration / 2);
      }

      // This is actually a chord
      if (note.notes) {
        note.notes.forEach(function (note) {
          this.instrument.play(note, duration);
        }, this);

        return true;
      }

      this.instrument.play(note, duration);
    }
  };

});
