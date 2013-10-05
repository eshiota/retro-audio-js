/*****************************************************************************
*  Instrument - Oscillator
*****************************************************************************/

Module("App.instruments.Oscillator", function (Oscillator) {

  Oscillator.fn.initialize = function (audioContext, node, type) {
    this.type = Oscillator.getWaveType(type || "sine", audioContext);
    this.context = audioContext;
    this.node = node;
  };

  // Returns the wave type based on the available API
  Oscillator.getWaveType = function (type, context) {
    // Creates an oscillator just to get the wave type on older implementations
    var o = context.createOscillator();

    return o[type.toUpperCase()] || type;
  };

  // https://gist.github.com/stuartmemo/3766449
  // Takes string of Note + Octave
  // Example:
  // var frequency = Oscillator.getFrequency('C3');
  Oscillator.getFrequency = function (note) {
    var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
      , octave
      , keyNumber
    ;

    if (note.length === 3) {
      octave = note.charAt(2);
    } else {
      octave = note.charAt(1);
    }

    keyNumber = notes.indexOf(note.slice(0, -1));

    if (keyNumber < 3) {
      keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
    } else {
      keyNumber = keyNumber + ((octave - 1) * 12) + 1;
    }

    // Return frequency of note
    return Math.floor(440 * Math.pow(2, (keyNumber - 49) / 12));
  };

  Oscillator.fn.play = function (note, duration) {
    var frequency = Oscillator.getFrequency(note.key)
      , oscillator = this.context.createOscillator()
      , startMethod = oscillator.start || oscillator.noteOn
      , stopMethod = oscillator.stop || oscillator.noteOff
    ;

    oscillator.type = this.type;
    oscillator.frequency.value = frequency;
    oscillator.connect(this.node);
    startMethod.call(oscillator, 0);
    stopMethod.call(oscillator, this.context.currentTime + (duration / 1000));
  };

});
