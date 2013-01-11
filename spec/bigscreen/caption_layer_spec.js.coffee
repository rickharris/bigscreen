describe "Bigscreen.CaptionLayer", ->
  describe "#onLanguageChange", ->
    beforeEach ->
      loadFixtures('video.html')

      @prototype = Bigscreen.CaptionLayer.prototype
      spyOn(@prototype, 'onLanguageChange').andCallThrough()
      spyOn(@prototype, 'setActiveLanguage')

      video = document.getElementById('video')
      subject = new Bigscreen.Tv(video).captionLayer

      document.getElementById('bigscreen-caption-language-en').click()

    it "is called when the user selects a caption language option", ->
      expect(@prototype.onLanguageChange).toHaveBeenCalled()
