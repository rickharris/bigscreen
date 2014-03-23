describe "Bigscreen.CaptionControl", ->

  describe "#captionsData", ->
    it "returns an empty array if the video has no caption tracks", ->
      loadFixtures('video_no_captions.html')
      video = document.getElementById('video')
      subject = new Bigscreen.CaptionControl(video)
      expect(subject.captionsData()).toEqual([])

    it "returns a non-empty array if the video has caption tracks", ->
      loadFixtures('video.html')
      video = document.getElementById('video')
      subject = new Bigscreen.CaptionControl(video)
      expect(subject.captionsData().length).not.toEqual(0)

    it "only includes tracks of kind 'subtitles'", ->
      loadFixtures('video_with_non_subtitle_track.html')
      video = document.getElementById('video')
      subject = new Bigscreen.CaptionControl(video)
      expect(subject.captionsData().length).toEqual(0)

  describe "#trackData", ->
    beforeEach ->
      loadFixtures('video.html')
      video = document.getElementById('video')
      @track = video.querySelector('track')
      @subject = new Bigscreen.CaptionControl(video)

    it "sets the language attribute to the srclang property of the track", ->
      expect(@subject.trackData(@track).language).toEqual('en')

    it "sets the title attribute to the title property of the track", ->
      expect(@subject.trackData(@track).title).toEqual('English')

    it "sets the title attribute to the srclang property of the track if the track doesn't have a title", ->
      @track.title = ""
      expect(@subject.trackData(@track).title).toEqual('en')

