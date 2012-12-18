@Bigscreen ||= {}
Bigscreen.Utils ||= {}

class Bigscreen.Utils.ClassList
  @supportsClassList: document.documentElement.classList?

  @parseClassList: (element) ->
    if element.className == ""
      []
    else
      element.className.replace(/^\s+|\s+$/g, "").split(/\s+/)

  @add: (value, element) ->
    if @supportsClassList
      element.classList.add(value)
    else
      classList = @parseClassList(element)
      classList.push(value) if classList.indexOf(value) == -1
      element.className = classList.join(' ')

  @remove: (value, element) ->
    if @supportsClassList
      element.classList.remove(value)
    else
      classList = @parseClassList(element)
      index = classList.indexOf(value)
      if index != -1
        classList.splice(index, 1)
        element.className = classList.join(' ')
