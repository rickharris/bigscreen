# Bigscreen
> A big boy Javascript video player that will still fit in your treehouse.

## Development

### Do:
- Edit files in `lib/assets`.
- Run `script/server` to compile assets and run a local server for opening the
  spec runner in the browser (`localhost:{PORT}/spec/SpecRunner.html`).
- Write specs.

### Don't:
- Edit files in `dist`.
- Write new features without specs.
- Run specs in PhantomJS. At the time of this writing, the video element is on
  their list of "irrelevant" features and we can't really test the video API.

You will need to have NPM & Node installed. All you need to do for setup is to
run `npm install` and you're good to go.

