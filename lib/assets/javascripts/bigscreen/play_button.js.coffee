@Bigscreen ||= {}

class Bigscreen.PlayButton
  constructor: (@video) ->
    @video.addEventListener 'play', @wasPlayed
    @video.addEventListener 'pause', @wasPaused
    Bigscreen.Utils.Events.delegate('click',
      @video.parentNode, '.bigscreen-play-button', @onClick)

  wasPlayed: (event) =>
    @getElement().classList.add('is-playing')

  wasPaused: (event) =>
    @getElement().classList.remove('is-playing')

  onClick: (event) =>
    @video.play() if @video.paused

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-play-button')

  render: ->
    JST['bigscreen/templates/play_button']()
