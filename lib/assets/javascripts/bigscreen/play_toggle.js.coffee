@Bigscreen ||= {}

class Bigscreen.PlayToggle
  constructor: (@video) ->
    @video.addEventListener('play', @onPlay)
    @el = document.createElement('a')
    @el.addEventListener('click', @toggle)

  onPlay: =>

  toggle: =>
    if @video.paused
      @video.play()
    else
      @video.pause()
