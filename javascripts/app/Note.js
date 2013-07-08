/*****************************************************************************
*  Note
*****************************************************************************/

Module("App.Note", function (Note) {

  Note.fn.initialize = function (notation) {
    this.isPause = false;
    this.parseNote(notation);
  };

  // Maps an bemol accidental to its sustain (or flat) counterpart
  Note.accidentalsMap = {
    "Ab" : "G#",
    "Bb" : "A#",
    "Cb" : "B",
    "Db" : "C#",
    "Eb" : "D#",
    "Fb" : "E",
    "Gb" : "F#"
  };

  // Parses the a note into frequency and value
  Note.fn.parseNote = function (notation) {
    var data = notation.split(".")
      , note
    ;

    if (data.length !== 2) { throw "Invalid note/value format :" + notation; }

    this.key = this.normalizeKey(data[0]);
    this.value = this.normalizeValue(data[1]);

    if (data[0] === "-") {
      this.isPause = true;
      return this;
    }
  };

  // Normalizes a key notation
  //
  // A note may be:
  //
  // - Flat, no octave:           "A"
  // - Flat, w/ octave:           "A2"
  // - Flat, accident:            "A#"
  // - Flat, accident, w/ octave: "A#2"
  Note.fn.normalizeKey = function (note) {
    var data = note.split("")
      , normalizedNote = []
      , defaultOctave = 4
      , key
    ;

    if (data[1] && ["#", "B", "b"].indexOf(data[1]) !== -1) {
      // If there's an accidental, normalize it and
      // convert it to sharp
      key = data[0].toUpperCase() + data[1].toLowerCase();
      normalizedNote.push(Note.accidentalsMap[key] || key);
      // If there's an octave, add it, otherwise,
      // use 1 as default
      normalizedNote.push(data[2] || defaultOctave);
    } else {
      // No accidental, so just normalize the note and add the octave
      normalizedNote.push(data[0].toUpperCase());
      normalizedNote.push(data[1] || defaultOctave);
    }

    return normalizedNote.join("");
  };

  // Normalizes a value notation
  //
  // A value may be:
  //
  // - The denominator of a fraction of a full note
  //   (semibreve, which has four 'beats' on a 4/4 bar).
  //   If the value is 4, for example, its value is 1/4 of a semibreve,
  //   which is a quarter note.
  // - TODO: A Tuplet (http://en.wikipedia.org/wiki/Tuplet). The notation is
  //   the value of a note, followed by "T", and the number of subdivisions.
  //   For example, "8T3" means that three 1/8 (minim) notes have the same
  //   value as a 1/4 (crochet) note.
  Note.fn.normalizeValue = function (value) {
    var parts = value.split("");

    // If there's only the pure value part, return it as an integer
    if (parts.length === 1) {
      return parseInt(value, 10);
    }

    this.belongsToTuplet = true;
    this.tupletValue = parseInt(parts[2], 10);

    return parseInt(parts[0], 10);
  };

});
