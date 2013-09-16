/*****************************************************************************
*  Instrument
*
*  TODO: implement better strategy for different types of instruments
*****************************************************************************/

Module("App.Instrument", function (Instrument) {

  Instrument.fn.initialize = function (instrument, volume, audioContext) {
    this.context = audioContext;
    this.volume = volume;
    this.init(instrument);
  };

  // Inits the instrument instance.
  Instrument.fn.init = function (instrument) {
    this.masterVolume = this.context.createGain() || this.context.createGainNode();
    this.masterVolume.gain.value = this.volume;
    this.masterVolume.connect(this.context.destination);

    if (instrument === "oscillator-sine") {
      this.instrumentVariation = new App.instruments.Oscillator(this.context, this.masterVolume, 0);
    }

    if (instrument === "oscillator-square") {
      this.instrumentVariation = new App.instruments.Oscillator(this.context, this.masterVolume, 1);
    }
  };

  // Plays the instrument at a given frequency for duration in milliseconds
  Instrument.fn.play = function (note, duration) {
    this.instrumentVariation.play(note, duration);
  };

});
