# RetroJS - a Web Audio API experimental player

The RetroJS is a music parser and player that uses the Web Audio API. Created
as an experiment (and for lots of fun), it parses a custom musical notation input,
and outputs the sound through the browser.

Demo: http://eshiota.github.io/retro-audio-js/

## Usage

Create a `Player` instance:

```javascript
var player = new Player();
```

Load songs either through the `load` method, passing the JSON song as parameter;
or load it through the `loadUrl` method, passing an URL that serves the JSON song.

```javascript
// load a locally defined JSON song
var mysong = {
  "title" : "Test song",
  "tempo" : 60,
  "time_signature" : "4/4",
  "score" : [
    {
      "instrument" : "oscillator-sine",
      "volume" : 0.5,
      "sheet" : [ "C.4", "D.4", "E.4", "F.4", "G.4", "A.4", "B.4", "C5.4" ]
    }
  ]
};

player.load(mysong);

// or load an URL serving the JSON song
player.loadUrl("http://www.foo.com/mysong.json");
```

## Musical notation

**WARNING:** This musical notation will change as needed, and I'll try to keep
backwards compatibility whenever possible. But whenever that's not possible,
please be patient, and sorry. =)

Every song is a JSON object with a title, tempo, time signature, and the score itself.
The tempo always refer to how many quarter notes (crochets) are played per second.

Please check the provided examples on `/src/songs/`.

```javascript
{
  "title" : "Test song",
  "tempo" : 60,
  "time_signature" : "4/4",
  "score" : []
};
```

### The score and tracks

The score is an array of tracks. A track is an object with an instrument
(identified by a string), volume (a float from 0 to 1), and a sheet. A sheet
is an array of notes or chords. All instruments must share a common way of writing a note's
value and key, and some may have their own properties (a drumkit has no keys, for example).

```javascript
{
  "instrument" : "oscillator-sine",
  "volume" : 0.5,
  "sheet" : [ "C.4", "D.4", "E.4", "F.4", "G.4", "A.4", "B.4", "C5.4" ]
}
```

### The notes

A note is a string with the following format:

`[key/rest/sample information].[duration information]`

The information to the left of the dot tells either the note's key (C, D, E...),
or if the note is a rest, or if any other information for a specific instrument.

The information to the right tells the note's value—given the song's tempo, it
tells what's the duration of the note.

#### Keys and rests

A key is a letter from A to G, plus an option accidental, plus an optional
octave information. Some examples:

* `A`: "A" key (La), on the 4th octave. Whenever octave information is not provided,
the application assumes the 4th.
* `C5`: "C" key (Do), on the 5th octave.
* `C#5`: "C" key (Do), with sharp accidental, on the 5th octave.
* `Db5`: "D" key (Re), with flat accidental, on the 5th octave. Represents the same
note as above.

A rest is always represented as a dash `-`. If a track has a period of silence,
always use a rest. Every empty space must be filled so that the parser calculates
the correct cycle position for each note.

#### Values

The note's value represents the length of a note. The final duration will be
a product of the length of the note, times the tempo of the song.

More information: http://en.wikipedia.org/wiki/Note_value

The notation is always related to the fraction of a whole note (semibreve), which
has a value of `1`. So:

* `1`: Semibreve - 1/1 (duration of four quarter notes)
* `2`: Minim - 1/2 (duration two quarter notes)
* `4`: Crochet - 1/4 (quarter note—value used as base for calculating the song's tempo)
* `8`: Quaver - 1/8 (half of a quarter note)
* `16`: Semiquaver - 1/16 (one-fourth of a quarter note)
* `32`: Demisemiquaver - 1/32 (one-eigth of a quarter note)
* `64`: Hemidemisemiquaver - 1/64 (one-sixteenth of a quarter note)

The notation also supports a few modifiers:

* `4D`: Dot. Whenever a value ends with "D", the note has the value before the character,
   plus half of it. In this case, the note has the duration of a quarter-note,
   plus half of a quarter-note.
* `8T3`: Tuplet. Whenever a value is followed by a "T" with a number, it's part
  of a tuplet. A tuplet is a number of notes (the one after the "T") that are
  played during the duration of a higher value. In this case, three notes with
  `8T3` duration are played during the duration of a quarter note ("4").

Whenever a parser finds a tuplet note, the following "n-1" notes are considered
part of it, being "n" the tuplet value. So `["C.8T3", "C.8T3", "C.8T3"]` is the
same as `["C.8T3", "C.8", "C.8"]`.

### Chords

Chords are array of notes inside a sheet.

```javascript
"sheet" : [ ["C.4", "E.4", "G.4"], "D.4", "E.4" ]
```

In the example above, the `C.4`, `E.4`, `G.4` notes are played together,
followed by `D.4` and `E.4`.

The parser always assume that the chord has the duration of the longest note
inside the array. If any of the notes is indicated as part of a tuplet, the
whole chord is considered as part of it.

## Instruments

Currently, these are the supported instruments:

* "oscillator-sine": Oscillator, with the sine wave
* "oscillator-square": Oscillator, with the square wave

## Controls

The RetroJS player may be controlled through DOM nodes using the `Controls` class.
It uses the following data attributes to bind them to the player:

*   `data-player-controls`: contains all controls
    *   `data-song-controls`: contains controls for loading and selecting songs
        *   `data-song-select`: `<select>` with URLs for JSON songs
        *   `data-song-load`: button that loads the selected song
    *   `data-playback-controls` contains all controls for playback
        *   `data-play`: plays the loaded song
        *   `data-pause`: pauses the playing song
        *   `data-stop`: stops the playing song and resets position
    *   `data-song-info` contains controls that displays song information
        *   `data-current-song`: displays the current song name

Here's a sample markup:

```html
<div data-player-controls>
    <div data-song-controls>
      <select data-song-select>
        <option value="src/songs/test.json">Test</option>
      </select>

      <button type="button" data-song-load>Load</button>
    </div>

    <div data-playback-controls>
      <button type="button" data-play>Play</button>
      <button type="button" data-pause>Pause</button>
      <button type="button" data-stop>Stop</button>
    </div>

    <div data-song-info>
      <p data-current-song>Please load a song</p>
    </div>
  </div>
</div>
```

## Current limitations

These are the player's limitations that have no priority to be fixed:

* There are a few notations and edge cases missing from the parser, like more
  exotic tuplets or double/trippled dots.
* The player loop uses 1/64 as a base to calculate cycles, so it currently
  does not support notes shorter than that.
* The number of tracks and notes is limited to the browser/device's performance.
  I haven't tested how far it goes yet.
* Chords have a very simple logic in order to calculate the correct cycles,
  so there's no way to have a note on it with longer duration. This can be
  achieved through multiple tracks, though.
* There's no way to have a note longer than a semibreve.

## Contributing

Always check the project's issues to see whether what's left to be fixed,
and what's already been done or dismissed.

1. Fork the project
2. Create a topic branch - git checkout -b my_branch
3. Push to your branch - git push origin my_branch
4. Create an Issue with a link to your branch
5. That's it!

Respect the project's code standards, and the JSHint options.

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
