@Bigscreen ||= {}

class Bigscreen.PlayToggle
  constructor: (@video) ->
    @video.addEventListener('play', @onPlay)
    @video.addEventListener('pause', @onPause)
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-play-toggle', @toggle)

  onPlay: =>
    @getElement().classList.add('bigscreen-is-playing')
    @getElement().classList.remove('bigscreen-is-paused')

  onPause: =>
    @getElement().classList.add('bigscreen-is-paused')
    @getElement().classList.remove('bigscreen-is-playing')

  toggle: =>
    if @video.paused
      @video.play()
    else
      @video.pause()

  getElement: ->
    @element ||= @video.parentNode.querySelector('.bigscreen-play-toggle')

  render: =>
    JST['bigscreen/templates/play_toggle']()
