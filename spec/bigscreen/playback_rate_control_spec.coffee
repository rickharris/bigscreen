describe "Bigscreen.PlaybackRateControl", ->
  beforeEach ->
    loadFixtures('video.html')
    @prototype = Bigscreen.PlaybackRateControl.prototype
    spyOn(@prototype, 'onOptionChange').andCallThrough()
    spyOn(@prototype, 'rateWasChanged').andCallThrough()
    @video = document.getElementById('video')
    @subject = new Bigscreen.Tv(@video).features.playbackRateControl

  describe "#onOptionChange", ->
    beforeEach ->
      @subject
        .getElement()
        .querySelector('#bigscreen-playback-rate-1-5x')
        .click()

    it "is called when the user selects a playback rate option", ->
      expect(@prototype.onOptionChange).toHaveBeenCalled()

    it "changes the playbackRate of the video", ->
      expect(@video.playbackRate).toEqual(1.5)

  describe "#rateWasChanged", ->
    it "is called when the video's playbackRate changes", ->
      @video.playbackRate = 2.0
      waitsFor ->
        @prototype.rateWasChanged.wasCalled
      , 1
      runs -> expect(@prototype.rateWasChanged).toHaveBeenCalled()

    it "selects the correct radio", ->
      @video.playbackRate = 2.0
      el = document.getElementById('bigscreen-playback-rate-2-0x')
      waitsFor ->
        el.checked
      , 1
      runs -> expect($(el)).toBeChecked()

    it "deselects all radios if the current playback rate isn't an official option", ->
      @video.playbackRate = 3
      waitsFor ->
        @prototype.rateWasChanged.wasCalled
      , 1
      runs ->
        for radio in @subject.getElement().querySelectorAll('input[type=radio]')
          expect($(radio)).not.toBeChecked()
