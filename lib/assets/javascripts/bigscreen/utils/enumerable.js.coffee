@Bigscreen ||= {}
Bigscreen.Utils ||= {}

class Bigscreen.Utils.Enumerable
  @includes: (enumerable, item) ->
    if enumerable.indexOf
      enumerable.indexOf(item) >= 0
    else
      for i in enumerable
        return true if i == item
      false
