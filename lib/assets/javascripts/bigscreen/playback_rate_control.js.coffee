@Bigscreen ||= {}

class Bigscreen.PlaybackRateControl
  constructor: (@video) ->
    @video.addEventListener('ratechange', @rateWasChanged)
    Bigscreen.Utils.Events.delegate('change', @video.parentNode,
      '.bigscreen-playback-rate-control input', @onOptionChange)

  rateWasChanged: =>
    current =
      @getElement().querySelector("li[data-playback-rate='#{@video.playbackRate}']")

    if current
      current.querySelector('input[type=radio]').checked = true
    else
      @getElement().querySelector('input[type=radio][checked]').checked = false

  onOptionChange: (event) =>
    @video.playbackRate = event.target.value

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-playback-rate-control')

  render: ->
    JST['bigscreen/templates/playback_rate_control']()
