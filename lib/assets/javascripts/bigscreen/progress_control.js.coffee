@Bigscreen ||= {}

class Bigscreen.ProgressControl
  constructor: (@video) ->
    @video.addEventListener 'timeupdate', @onTimeUpdate
    @video.addEventListener 'loadedmetadata', @setDuration
    Bigscreen.Utils.Events.delegate('click', @video.parentNode,
      '.bigscreen-progress-bar', @onClick)
    Bigscreen.Utils.Events.delegate('mouseover', @video.parentNode,
      '.bigscreen-progress-bar', @onMouseOver)
    Bigscreen.Utils.Events.delegate('mouseout', @video.parentNode,
      '.bigscreen-progress-bar', @onMouseOut)

  onTimeUpdate: =>
    @updateCurrentTime()
    @updateProgressBar()

  setDuration: =>
    durationLabel = @getElement('.bigscreen-duration-label')
    durationLabel.textContent = @secondsToTimeLabel(@video.duration)

  updateCurrentTime: ->
    currentTimeLabel =
      @getElement('.bigscreen-current-time-label')
    currentTimeLabel.textContent = @secondsToTimeLabel(@video.currentTime)

  updateProgressBar: ->
    percentComplete = @video.currentTime / @video.duration * 100
    @getElement('.bigscreen-progress')
      .setAttribute('style', "width: #{percentComplete}%")

  onClick: (event) =>
    el = @getElement('.bigscreen-progress-bar')
    progressPercentage = @relativeXOffset(event.pageX, el) / el.clientWidth
    @video.currentTime = @video.duration * progressPercentage

  onMouseOver: (event) =>
    @getElement('.bigscreen-progress-bar').addEventListener('mousemove', @onMouseMove)
    @getElement('.bigscreen-progress-tooltip').setAttribute('style', 'display: block')

  onMouseOut: (event) =>
    @getElement('.bigscreen-progress-bar').removeEventListener('mousemove', @onMouseMove)
    @getElement('.bigscreen-progress-tooltip').setAttribute('style', 'display: none')

  onMouseMove: (event) =>
    progressBar = @getElement('.bigscreen-progress-bar')
    progressPercentage = @relativeXOffset(event.pageX, progressBar) / progressBar.clientWidth
    tooltip = @getElement('.bigscreen-progress-tooltip')
    tooltip.textContent = @secondsToTimeLabel(@video.duration * progressPercentage)
    tooltip.setAttribute('style', "left: #{progressPercentage * 100}%")

  getElement: (extraSelector) ->
    selector = ".bigscreen-progress-control"
    selector = selector += " #{extraSelector}" if extraSelector?

    @video.parentNode.querySelector(selector)

  render: ->
    JST['bigscreen/templates/progress_control']()

  secondsToTimeLabel: (seconds) ->
    hours = Math.floor(seconds / (60 * 60))
    minutes = Math.floor(seconds / 60) % 60
    seconds = Math.floor(seconds) % 60

    result = ""
    result += "#{@formatTimeSegment(hours)}:" if hours > 0
    result += "#{@formatTimeSegment(minutes)}:#{@formatTimeSegment(seconds)}"

  formatTimeSegment: (segment) ->
    format = "00"
    (format + segment).slice(-format.length)

  relativeXOffset: (absOffset, element) ->
    elOffset = element.getBoundingClientRect().left +
      window.pageXOffset -
      document.documentElement.clientLeft

    absOffset - elOffset
