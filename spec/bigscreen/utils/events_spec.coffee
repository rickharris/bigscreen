describe "Bigscreen.Utils.Events", ->
  describe ".delegate", ->

    beforeEach ->
      loadFixtures('delegation.html')
      @root = document.getElementById('root')
      @target = document.getElementById('target')
      @wrongTarget = document.getElementById('wrong-target')

      obj =
        onEvent: ->
      spyOn(obj, 'onEvent')
      @callback = obj.onEvent

    it "calls the provided callback", ->
      Bigscreen.Utils.Events.delegate 'click', @root, '#target', @callback
      @target.click()
      expect(@callback).toHaveBeenCalled()

    it "calls the callback in the context of the root element", ->
      correctContext = @root
      passedContext = null
      Bigscreen.Utils.Events.delegate 'click', @root, '#target', ->
        passedContext = this
      @target.click()
      expect(passedContext).toEqual(correctContext)

    it "does not listen on events that don't match the selector", ->
      Bigscreen.Utils.Events.delegate 'click', @root, 'a', @callback
      @root.click()
      expect(@callback).not.toHaveBeenCalled()

    it "passes the event object as the first argument to the callback", ->
      event = undefined
      Bigscreen.Utils.Events.delegate 'click', @root, '#target', (e) =>
        event = e
      @target.click()
      expect(event).toBeDefined()

    it "queries the DOM only in the scope of the root element", ->
      # The fixture in this example has the following structure:
      #
      #   a#wrong-target
      #   div#root
      #     a#target
      #
      # So, if the querySelector weren't scoped by the `div#root` element, then
      # it would wrongly return the `a#wrong-target` element and not call the
      # callback.
      Bigscreen.Utils.Events.delegate 'click', @root, 'a', @callback
      @target.click()
      expect(@callback).toHaveBeenCalled()

    it "bubbles the event", ->
      Bigscreen.Utils.Events.delegate 'click', @root, 'a', @callback
      document.getElementById('target-2').click()
      expect(@callback).toHaveBeenCalled()
