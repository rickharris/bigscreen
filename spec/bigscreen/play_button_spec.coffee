describe "Bigscreen.PlayButton", ->
  beforeEach ->
    loadFixtures('video.html')

    # We spy on the prototype because the actual methods are attached to the
    # events on initialization. So, we can't spy on the actual instance's
    # methods, because the event already holds a reference to the real method.
    # When the event is fired, the real method will be called, bypassing the
    # spy.
    @prototype = Bigscreen.PlayButton.prototype
    spyOn(@prototype, "wasPlayed").andCallThrough()
    spyOn(@prototype, "wasPaused").andCallThrough()
    spyOn(@prototype, "onClick").andCallThrough()

    @video = document.getElementById('video')
    # Access the PlayButton instance through the main class so that things
    # actually get appended to the DOM. Some of the events don't work in
    # certain browsers unless they're actually present in the DOM :(
    @playButton = new Bigscreen.Tv(@video).features.playButton

  describe "#wasPlayed", ->
    it "is called when the video is played", ->
      @video.play()

      waitsFor ->
        @prototype.wasPlayed.wasCalled
      , 1
      runs -> expect(@prototype.wasPlayed).toHaveBeenCalled()

    it "adds the 'is-playing' class from the view", ->
      el = $(@playButton.getElement())

      expect(el).not.toHaveClass('is-playing')
      @playButton.wasPlayed()
      expect(el).toHaveClass('is-playing')

  describe "#wasPaused", ->
    it "is called when the video is paused", ->
      @video.play()
      @video.pause()
      waitsFor ->
        @prototype.wasPaused.wasCalled
      , 1
      runs -> expect(@prototype.wasPaused).toHaveBeenCalled()

    it "removes the 'is-playing' class from the view", ->
      el = $(@playButton.getElement()).addClass('is-playing')

      expect(el).toHaveClass('is-playing')
      @playButton.wasPaused()
      expect(el).not.toHaveClass('is-playing')

  describe "#onClick", ->
    it "is called when the element is clicked", ->
      @playButton.getElement().click()
      expect(@prototype.onClick).toHaveBeenCalled()

    it "plays the video if the video is paused", ->
      expect(video.paused).toEqual(true)
      @playButton.onClick()
      expect(video.paused).toEqual(false)

    it "does not try to play the video if it's already playing", ->
      spyOn(@video, "play").andCallThrough()
      @video.play()
      expect(@video.play.callCount).toEqual(1)
      @playButton.onClick()
      expect(@video.play.callCount).toEqual(1)
