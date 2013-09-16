# RetroJS - a Web Audio API experiment

## Loading the songs

For now, the song loading won't work if you just open the `index.html`
document, as the browser will complain about cross-browser AJAX requests.

To solve this, I use Python's SimpleHTTPServer. If you have it, just run:

```
python -m SimpleHTTPServer
```

Then open `locahost:8000`.

I'll solve this issue ASAP.
