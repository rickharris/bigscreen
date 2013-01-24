describe "Bigscreen.FullscreenControl", ->
  beforeEach ->
    loadFixtures('video.html')

    @prototype = Bigscreen.FullscreenControl.prototype
    spyOn(@prototype, "onClick").andCallThrough()
    spyOn(@prototype, "enterFullscreen").andCallThrough()
    spyOn(@prototype, "exitFullscreen").andCallThrough()

    video = document.getElementById('video')
    @container = video.parentNode
    @subject = new Bigscreen.Tv(video).features.fullscreenControl

  describe "#enterFullscreen", ->
    beforeEach ->
      @subject.enterFullscreen()

    it "adds the fullscreen state class to the container", ->
      expect($(@container)).toHaveClass('is-fullscreen')

    it "sets #isFullscreen to true", ->
      expect(@subject.isFullscreen).toEqual(true)

  describe "#exitFullscreen", ->
    beforeEach ->
      @subject.enterFullscreen()
      @subject.exitFullscreen()

    it "removes the fullscreen state class from the container", ->
      expect($(@container)).not.toHaveClass('is-fullscreen')

    it "sets #isFullscreen to false", ->
      expect(@subject.isFullscreen).toEqual(false)

  describe "#onClick", ->
    it "is called when the fullscreen button is clicked", ->
      @subject.getElement().click()
      expect(@prototype.onClick).toHaveBeenCalled()

    it "calls #enterFullscreen when not already in fullscreen mode", ->
      @subject.isFullscreen = false
      @subject.getElement().click()
      expect(@prototype.enterFullscreen).toHaveBeenCalled()

    it "calls #exitFullscreen when in fullscreen mode", ->
      @subject.isFullscreen = true
      @subject.getElement().click()
      expect(@prototype.exitFullscreen).toHaveBeenCalled()


