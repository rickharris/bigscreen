describe "Bigscreen.Tv", ->
  describe "#constructor", ->
    it "creates a play/pause toggle button", ->
      video = document.createElement('video')
      tv = new Bigscreen.Tv(video)
      expect(tv.playToggle instanceof Bigscreen.PlayToggle).toEqual(true)
