@Bigscreen ||= {}
Bigscreen.Utils ||= {}

class Bigscreen.Utils.Events
  @delegate: (eventName, context, selector, callback) ->
    context.addEventListener eventName, (event) ->
      matchingElements = context.querySelectorAll(selector)
      matches = Bigscreen.Utils.Enumerable.includes(matchingElements, event.target)
      callback.apply(this, event) if matches
