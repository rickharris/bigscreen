@Bigscreen ||= {}

class Bigscreen.PlayButton
  constructor: (@video) ->
    @video.addEventListener 'play', @wasPlayed
    @video.addEventListener 'pause', @wasPaused
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-play-button', @onClick)

  wasPlayed: (event) =>
    Bigscreen.Utils.ClassList.add('is-playing', @getElement())

  wasPaused: (event) =>
    Bigscreen.Utils.ClassList.remove('is-playing', @getElement())

  onClick: (event) =>
    @video.play() if @video.paused

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-play-button')

  render: ->
    JST['bigscreen/templates/play_button']()
