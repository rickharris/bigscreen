@Bigscreen ||= {}
Bigscreen.Utils ||= {}

class Bigscreen.Utils.Events
  @delegate: (eventName, context, selector, callback) ->
    context.addEventListener eventName, (event) ->
      matchingElements = context.querySelectorAll(selector)
      current = event.target
      while(current != context)
        matches = Bigscreen.Utils.Enumerable.includes(matchingElements, current)
        callback.apply(this, arguments) if matches
        current = current.parentNode
