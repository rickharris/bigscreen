@Bigscreen ||= {}

class Bigscreen.Tv
  constructor: (video) ->
    @playToggle = new Bigscreen.PlayToggle(video)
