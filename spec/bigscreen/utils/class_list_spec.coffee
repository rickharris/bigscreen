describe "Bigscreen.Utils.ClassList", ->
  beforeEach ->
    @subject = Bigscreen.Utils.ClassList
    @el = document.createElement('div')

  describe ".add", ->
    it "adds the given class to the given element", ->
      @subject.add('bigscreen', @el)
      expect(@el.className).toEqual('bigscreen')

    it "does not add the class if the element already has the class", ->
      $(@el).addClass('bigscreen')
      @subject.add('bigscreen', @el)
      expect(@el.className).toEqual('bigscreen')


  describe ".remove", ->
    it "removes the given class", ->
      $(@el).addClass('bigscreen')
      @subject.remove('bigscreen', @el)
      expect(@el.className).toEqual('')
