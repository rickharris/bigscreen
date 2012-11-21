@Bigscreen ||= {}

class Bigscreen.PlayToggle
  constructor: (@video) ->
    @video.addEventListener('play', @onPlay)
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-play-toggle', @toggle)

  onPlay: =>

  toggle: =>
    if @video.paused
      @video.play()
    else
      @video.pause()

  render: =>
    JST['bigscreen/templates/play_toggle']()
