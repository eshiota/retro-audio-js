/*****************************************************************************
*  Chord
*****************************************************************************/

Module("App.Chord", function (Chord) {

  Chord.fn.initialize = function (notes) {
    this.notes = notes.map(function (value) {
      return new App.Note(value);
    });

    this.value = this.getValue(this.notes);
  };

  // Gets the longest value (lowest value) among the notes
  Chord.fn.getValue = function (notes) {
    var tupletNotes = notes.filter(function (note) { return note.belongsToTuplet; })
      , dottedNotes = notes.filter(function (note) { return note.isDotted; })
    ;

    // Assume that if one of the notes is a Tuplet, the entire chord is.
    // Deal with it. B-)
    if (tupletNotes.length > 0) {
      this.belongsToTuplet = true;
      this.tupletValue = tupletNotes[0].tupletValue;
      return tupletNotes[0].value;
    }

    if (dottedNotes.length > 0) {
      this.isDotted = true;
      return dottedNotes[0].value;
    }

    return notes.reduce(function (previous, current) {
      var previousDuration = typeof previous === "number" ? previous : previous.value;

      return Math.min(previousDuration, current.value);
    });
  };

});
