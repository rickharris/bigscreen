@Bigscreen ||= {}

class Bigscreen.Tv
  constructor: (@video) ->
    @features =
      playButton: new Bigscreen.PlayButton(video)
      pauseButton: new Bigscreen.PauseButton(video)
      playbackRateControl: new Bigscreen.PlaybackRateControl(video)
    @render(@features)

  render: (features) ->
    featureWrapper = document.createElement('div')
    featureWrapper.className = "bigscreen-features"
    featureWrapper.innerHTML = JST['bigscreen/templates/tv'](features)
    @video.parentNode.appendChild(featureWrapper)
