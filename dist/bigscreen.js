var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.PlayToggle = (function() {

  function PlayToggle(video) {
    this.video = video;
    this.render = __bind(this.render, this);

    this.toggle = __bind(this.toggle, this);

    this.onPlay = __bind(this.onPlay, this);

    this.video.addEventListener('play', this.onPlay);
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-play-toggle', this.toggle);
  }

  PlayToggle.prototype.onPlay = function() {};

  PlayToggle.prototype.toggle = function() {
    if (this.video.paused) {
      return this.video.play();
    } else {
      return this.video.pause();
    }
  };

  PlayToggle.prototype.render = function() {
    return JST['bigscreen/templates/play_toggle']();
  };

  return PlayToggle;

})();


this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Tv = (function() {

  function Tv(video) {
    var features;
    this.video = video;
    features = {
      playToggle: new Bigscreen.PlayToggle(video)
    };
    this.render(features);
  }

  Tv.prototype.render = function(features) {
    var featureWrapper;
    featureWrapper = document.createElement('div');
    featureWrapper.className = "bigscreen-features";
    featureWrapper.innerHTML = JST['bigscreen/templates/tv'](features);
    return this.video.parentNode.appendChild(featureWrapper);
  };

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

this["JST"] = this["JST"] || {};

this["JST"]["bigscreen/templates/play_toggle"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a class="bigscreen-play-toggle" title="Play or pause the video">Play</a>\n';
}
return __p;
};

this["JST"]["bigscreen/templates/tv"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( playToggle.render() )+
'\n';
}
return __p;
};