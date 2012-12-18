@Bigscreen ||= {}

class Bigscreen.PauseButton
  constructor: (@video) ->
    @video.addEventListener 'pause', @wasPaused
    @video.addEventListener 'play', @wasPlayed
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-pause-button', @onClick)

  wasPaused: =>
    Bigscreen.Utils.ClassList.add('is-paused', @getElement())

  wasPlayed: =>
    Bigscreen.Utils.ClassList.remove('is-paused', @getElement())

  onClick: =>
    @video.pause() unless @video.paused

  render: ->
    JST['bigscreen/templates/pause_button']()

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-pause-button')
