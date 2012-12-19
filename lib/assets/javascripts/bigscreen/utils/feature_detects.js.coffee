@Bigscreen ||= {}
Bigscreen.Utils ||= {}

class Bigscreen.Utils.FeatureDetects
  @playbackRate: document.createElement('video').playbackRate?
