@Bigscreen ||= {}

class Bigscreen.FullscreenControl
  constructor: (@video) ->
    @isFullscreen = false

    Bigscreen.Utils.Events.delegate('click', @video.parentNode,
      '.bigscreen-fullscreen-control', @onClick)

  onClick: =>
    if @isFullscreen == true
      @exitFullscreen()
    else
      @enterFullscreen()

  enterFullscreen: ->
    Bigscreen.Utils.ClassList.add('is-fullscreen', @video.parentNode)
    @isFullscreen = true

  exitFullscreen: ->
    Bigscreen.Utils.ClassList.remove('is-fullscreen', @video.parentNode)
    @isFullscreen = false

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-fullscreen-control')

  render: ->
    JST['bigscreen/templates/fullscreen_control']()
