@Bigscreen ||= {}

class Bigscreen.CaptionLayer
  constructor: (@video) ->
    Bigscreen.Utils.Events.delegate('change', @video.parentNode,
      '.bigscreen-caption-control input', @onLanguageChange)

    @processedLanguages =
      error: "The selected language isn't available."
      none: " "

  onLanguageChange: (event) =>
    language = event.target.value

    if @processedLanguages[language]
      @setActiveLanguage(language)
    else
      captionTrack = @video.querySelector("track[kind=subtitles][srclang=#{language}]")
      @processCaptionTrack(captionTrack)

  processCaptionTrack: (captionTrack) ->
    @request = new XMLHttpRequest()
    @request.open("GET", captionTrack.getAttribute('src'))
    @request.onreadystatechange = =>
      if @request.readyState == 4
        if @request.status == 200
          @parseCaptions(captionTrack.getAttribute('srclang'), @request.responseText)
          @setActiveLanguage(captionTrack.getAttribute('srclang'))
        else
          @setActiveLanguage('error')
    @request.send()

  parseCaptions: (language, captions) ->
    lineNumberPattern = /^[0-9]+$/
    lines = captions.split(/\r?\n/)
    entries = []
    i = 0

    while i < lines.length
      if lines[i].match(lineNumberPattern)
        entry = {}
        entry.times = @parseTimeCode(lines[i + 1])
        entry.text = lines[i + 2]
        entries.push(entry)
      i++

    @processedLanguages[language] = entries

  parseTimeCode: (timeCode) ->
    timeCodePattern = /^([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{1,3}) --\> ([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{1,3})$/
    parts = timeCodePattern.exec(timeCode)
    start =
      hours:       parseInt(parts[1], 10)
      minutes:     parseInt(parts[2], 10)
      seconds:     parseInt(parts[3], 10)
      miliseconds: parseInt(parts[4], 10)
    end =
      hours:       parseInt(parts[5], 10)
      minutes:     parseInt(parts[6], 10)
      seconds:     parseInt(parts[7], 10)
      miliseconds: parseInt(parts[8], 10)

    startSeconds = (start.hours * 60 * 60) + (start.minutes * 60) + start.seconds + (start.miliseconds / 1000)
    endSeconds = (end.hours * 60 * 60) + (end.minutes * 60) + end.seconds + (end.miliseconds / 1000)

    [startSeconds, endSeconds]

  setActiveLanguage: (language) ->
    @currentLanguage = @processedLanguages[language]
    if typeof @currentLanguage == "string"
      @video.removeEventListener 'timeupdate', @onTimeUpdate
      @showCaptionMessage(@currentLanguage)
    else
      @video.removeEventListener 'timeupdate', @onTimeUpdate
      @video.addEventListener 'timeupdate', @onTimeUpdate

  showCaptionMessage: (text) ->
    captionContainer = @getElement().querySelector('.bigscreen-caption-content')
    captionContainer.textContent = text

  onTimeUpdate: (event) =>
    currentTime = @video.currentTime

    for cue in @currentLanguage
      if currentTime >= cue.times[0] && currentTime < cue.times[1]
        @showCaptionMessage(cue.text)

  getElement: ->
    @video.parentNode.querySelector('.bigscreen-caption-layer')

  render: ->
    JST['bigscreen/templates/caption_layer']()
