@Bigscreen ||= {}

class Bigscreen.Tv
  constructor: (@video) ->
    features =
      playToggle: new Bigscreen.PlayToggle(video)
    @render(features)

  render: (features) ->
    featureWrapper = document.createElement('div')
    featureWrapper.className = "bigscreen-features"
    featureWrapper.innerHTML = JST['bigscreen/templates/tv'](features)
    @video.parentNode.appendChild(featureWrapper)
