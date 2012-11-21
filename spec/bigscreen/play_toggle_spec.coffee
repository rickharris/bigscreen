describe "Bigscreen.PlayToggle", ->

  beforeEach ->
    loadFixtures('video.html')

    @prototype = Bigscreen.PlayToggle.prototype
    spyOn(@prototype, "onPlay").andCallThrough()
    spyOn(@prototype, "toggle").andCallThrough()

    @video = document.getElementById('video')
    @tv = new Bigscreen.Tv(@video)
    @el = @video.parentNode.querySelector('.bigscreen-play-toggle')

  describe "#onPlay", ->
    it "is called when the video starts playing", ->
      # WTF is this I don't even...
      # Apparently there's a tiny and asynchronous delay between the moment you
      # call `play` (and the video is no longer considered paused) and the
      # moment the 'play' event is fired.
      @video.play()
      waitsFor ->
        @prototype.onPlay.wasCalled
      , 1 # 1ms is all it takes folks. That makes sense, right? ...Right?!
      runs -> expect(@prototype.onPlay).toHaveBeenCalled()

    xit "adds the playing class to its element"
    xit "removes the paused class from its element"

  describe "#onPause", ->
    xit "is called when the video pauses"
    xit "adds the paused class to its element"
    xit "removes the playing class from its element"

  describe "#toggle", ->
    it "is called when the toggle element is clicked", ->
      @el.click()
      expect(@prototype.toggle).toHaveBeenCalled()

    it "plays the video if the video is paused", ->
      expect(@video.paused).toEqual(true)
      @el.click()
      expect(@video.paused).toEqual(false)

    it "pauses the video if the video is playing", ->
      @video.play()
      @el.click()
      expect(@video.paused).toEqual(true)
