@Bigscreen ||= {}

class Bigscreen.PlayButton
  constructor: (@video) ->
    @video.addEventListener 'play', @wasPlayed
    @video.addEventListener 'pause', @wasPaused
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-play-button', @onClick)

  wasPlayed: (event) =>
    Bigscreen.Utils.ClassList.add('bigscreen-is-playing', @video.parentNode)

  wasPaused: (event) =>
    Bigscreen.Utils.ClassList.remove('bigscreen-is-playing', @video.parentNode)

  onClick: (event) =>
    @video.play() if @video.paused

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-play-button')

  render: ->
    JST['bigscreen/templates/play_button']()
