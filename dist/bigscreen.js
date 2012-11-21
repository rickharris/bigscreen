var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.PlayToggle = (function() {

  function PlayToggle(video) {
    this.video = video;
    this.toggle = __bind(this.toggle, this);

    this.onPlay = __bind(this.onPlay, this);

    this.video.addEventListener('play', this.onPlay);
    this.el = document.createElement('a');
    this.el.addEventListener('click', this.toggle);
  }

  PlayToggle.prototype.onPlay = function() {};

  PlayToggle.prototype.toggle = function() {
    if (this.video.paused) {
      return this.video.play();
    } else {
      return this.video.pause();
    }
  };

  return PlayToggle;

})();


this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Tv = (function() {

  function Tv(video) {
    this.playToggle = new Bigscreen.PlayToggle(video);
  }

  return Tv;

})();


this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Utils || (Bigscreen.Utils = {});

Bigscreen.Utils.Enumerable = (function() {

  function Enumerable() {}

  Enumerable.includes = function(enumerable, item) {
    var i, _i, _len;
    if (enumerable.indexOf) {
      return enumerable.indexOf(item) >= 0;
    } else {
      for (_i = 0, _len = enumerable.length; _i < _len; _i++) {
        i = enumerable[_i];
        if (i === item) {
          return true;
        }
      }
      return false;
    }
  };

  return Enumerable;

})();


this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Utils || (Bigscreen.Utils = {});

Bigscreen.Utils.Events = (function() {

  function Events() {}

  Events.delegate = function(eventName, context, selector, callback) {
    return context.addEventListener(eventName, function(event) {
      var matches, matchingElements;
      matchingElements = context.querySelectorAll(selector);
      matches = Bigscreen.Utils.Enumerable.includes(matchingElements, event.target);
      if (matches) {
        return callback.apply(this, event);
      }
    });
  };

  return Events;

})();
