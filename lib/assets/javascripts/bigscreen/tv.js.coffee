@Bigscreen ||= {}

class Bigscreen.Tv
  constructor: (@video) ->
    Bigscreen.Utils.ClassList.add('bigscreen-is-paused', @video.parentNode)

    @features =
      playButton: new Bigscreen.PlayButton(video)
      pauseButton: new Bigscreen.PauseButton(video)
      playbackRateControl: (if Bigscreen.Utils.FeatureDetects.playbackRate then new Bigscreen.PlaybackRateControl(video) else null)
      captionControl: new Bigscreen.CaptionControl(video)
      captionLayer: new Bigscreen.CaptionLayer(video)
      progressControl: new Bigscreen.ProgressControl(video)
      fullscreenControl: new Bigscreen.FullscreenControl(video)
    @render(@features)

  render: (features) ->
    featureWrapper = document.createElement('div')
    featureWrapper.className = "bigscreen-features"
    featureWrapper.innerHTML = JST['bigscreen/templates/tv'](features)
    @video.parentNode.appendChild(featureWrapper)
