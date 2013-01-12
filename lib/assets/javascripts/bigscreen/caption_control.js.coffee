@Bigscreen ||= {}

class Bigscreen.CaptionControl
  constructor: (@video) ->

  captionsData: ->
    tracks = @video.parentNode.querySelectorAll('track[kind=subtitles]')
    @trackData(track) for track in tracks

  trackData: (track) ->
    {
      language: track.getAttribute('srclang')
      title: track.title || track.getAttribute('srclang')
    }

  render: ->
    captionsData = @captionsData()
    JST['bigscreen/templates/caption_control']({captionsData})
