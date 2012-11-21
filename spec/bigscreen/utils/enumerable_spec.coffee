describe "Bigscreen.Utils.Enumerable", ->
  describe ".includes", ->
    it "returns true if the item in question is in the enumerable", ->
      expect(Bigscreen.Utils.Enumerable.includes([1, 2, 3], 1)).toEqual(true)

    it "returns false if the item is not in the enumerable", ->
      expect(Bigscreen.Utils.Enumerable.includes([1, 2, 3], 4)).toEqual(false)

    it "works for NodeLists", ->
      loadFixtures('video.html')
      root = document.getElementById('video-wrapper')
      video = document.getElementById('video')
      rando = document.createElement('video')
      nodeList = root.querySelectorAll('video')
      expect(Bigscreen.Utils.Enumerable.includes(nodeList, video)).toEqual(true)
      expect(Bigscreen.Utils.Enumerable.includes(nodeList, rando)).toEqual(false)
