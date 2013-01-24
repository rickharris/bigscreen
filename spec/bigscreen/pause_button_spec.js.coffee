describe "Bigscreen.PauseButton", ->
  beforeEach ->
    loadFixtures('video.html')

    # We spy on the prototype because the actual methods are attached to the
    # events on initialization. So, we can't spy on the actual instance's
    # methods, because the event already holds a reference to the real method.
    # When the event is fired, the real method will be called, bypassing the
    # spy.
    @prototype = Bigscreen.PauseButton.prototype
    spyOn(@prototype, "wasPlayed").andCallThrough()
    spyOn(@prototype, "wasPaused").andCallThrough()
    spyOn(@prototype, "onClick").andCallThrough()

    @video = document.getElementById('video')
    # Access the PlayButton instance through the main class so that things
    # actually get appended to the DOM. Some of the events don't work in
    # certain browsers unless they're actually present in the DOM :(
    @pauseButton = new Bigscreen.Tv(@video).features.pauseButton

  describe "#wasPaused", ->
    it "is called when the video is paused", ->
      @video.play()
      @video.pause()
      waitsFor ->
        @prototype.wasPaused.wasCalled
      , 1
      runs -> expect(@prototype.wasPaused).toHaveBeenCalled()

    it "adds the 'bigscreen-is-paused' class to the container", ->
      @pauseButton.wasPaused()
      expect($(video.parentNode)).toHaveClass('bigscreen-is-paused')

  describe "#wasPlayed", ->
    it "is called when the video is played", ->
      @video.play()
      waitsFor ->
        @prototype.wasPlayed.wasCalled
      , 1
      runs -> expect(@prototype.wasPlayed).toHaveBeenCalled()

    it "removes the 'bigscreen-is-paused' class from the view", ->
      @pauseButton.wasPlayed()
      expect($(@video.parentNode)).not.toHaveClass('bigscreen-is-paused')

  describe "#onClick", ->
    it "is called when the view is clicked", ->
      @pauseButton.getElement().click()
      expect(@prototype.onClick).toHaveBeenCalled()

    it "pauses the video", ->
      @video.play()
      @pauseButton.onClick()
      expect(@video.paused).toEqual(true)

    it "doesn't try to pause the video if it's already paused", ->
      spyOn(@video, 'pause')
      @pauseButton.onClick()
      expect(@video.pause).not.toHaveBeenCalled()

