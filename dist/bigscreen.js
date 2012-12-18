var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.PauseButton = (function() {

  function PauseButton(video) {
    this.video = video;
    this.onClick = __bind(this.onClick, this);

    this.wasPlayed = __bind(this.wasPlayed, this);

    this.wasPaused = __bind(this.wasPaused, this);

    this.video.addEventListener('pause', this.wasPaused);
    this.video.addEventListener('play', this.wasPlayed);
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-pause-button', this.onClick);
  }

  PauseButton.prototype.wasPaused = function() {
    return Bigscreen.Utils.ClassList.add('is-paused', this.getElement());
  };

  PauseButton.prototype.wasPlayed = function() {
    return Bigscreen.Utils.ClassList.remove('is-paused', this.getElement());
  };

  PauseButton.prototype.onClick = function() {
    if (!this.video.paused) {
      return this.video.pause();
    }
  };

  PauseButton.prototype.render = function() {
    return JST['bigscreen/templates/pause_button']();
  };

  PauseButton.prototype.getElement = function() {
    return this.video.parentNode.querySelector('.bigscreen-pause-button');
  };

  return PauseButton;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.PlayButton = (function() {

  function PlayButton(video) {
    this.video = video;
    this.onClick = __bind(this.onClick, this);

    this.wasPaused = __bind(this.wasPaused, this);

    this.wasPlayed = __bind(this.wasPlayed, this);

    this.video.addEventListener('play', this.wasPlayed);
    this.video.addEventListener('pause', this.wasPaused);
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-play-button', this.onClick);
  }

  PlayButton.prototype.wasPlayed = function(event) {
    return Bigscreen.Utils.ClassList.add('is-playing', this.getElement());
  };

  PlayButton.prototype.wasPaused = function(event) {
    return Bigscreen.Utils.ClassList.remove('is-playing', this.getElement());
  };

  PlayButton.prototype.onClick = function(event) {
    if (this.video.paused) {
      return this.video.play();
    }
  };

  PlayButton.prototype.getElement = function() {
    return this.video.parentNode.querySelector('.bigscreen-play-button');
  };

  PlayButton.prototype.render = function() {
    return JST['bigscreen/templates/play_button']();
  };

  return PlayButton;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.PlayToggle = (function() {

  function PlayToggle(video) {
    this.video = video;
    this.render = __bind(this.render, this);

    this.toggle = __bind(this.toggle, this);

    this.onPause = __bind(this.onPause, this);

    this.onPlay = __bind(this.onPlay, this);

    this.video.addEventListener('play', this.onPlay);
    this.video.addEventListener('pause', this.onPause);
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-play-toggle', this.toggle);
  }

  PlayToggle.prototype.onPlay = function() {
    this.getElement().classList.add('bigscreen-is-playing');
    return this.getElement().classList.remove('bigscreen-is-paused');
  };

  PlayToggle.prototype.onPause = function() {
    this.getElement().classList.add('bigscreen-is-paused');
    return this.getElement().classList.remove('bigscreen-is-playing');
  };

  PlayToggle.prototype.toggle = function() {
    if (this.video.paused) {
      return this.video.play();
    } else {
      return this.video.pause();
    }
  };

  PlayToggle.prototype.getElement = function() {
    return this.element || (this.element = this.video.parentNode.querySelector('.bigscreen-play-toggle'));
  };

  PlayToggle.prototype.render = function() {
    return JST['bigscreen/templates/play_toggle']();
  };

  return PlayToggle;

})();


this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Tv = (function() {

  function Tv(video) {
    this.video = video;
    this.features = {
      playButton: new Bigscreen.PlayButton(video),
      pauseButton: new Bigscreen.PauseButton(video)
    };
    this.render(this.features);
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

Bigscreen.Utils.ClassList = (function() {

  function ClassList() {}

  ClassList.supportsClassList = document.documentElement.classList != null;

  ClassList.parseClassList = function(element) {
    if (element.className === "") {
      return [];
    } else {
      return element.className.replace(/^\s+|\s+$/g, "").split(/\s+/);
    }
  };

  ClassList.add = function(value, element) {
    var classList;
    if (this.supportsClassList) {
      return element.classList.add(value);
    } else {
      classList = this.parseClassList(element);
      if (classList.indexOf(value) === -1) {
        classList.push(value);
      }
      return element.className = classList.join(' ');
    }
  };

  ClassList.remove = function(value, element) {
    var classList, index;
    if (this.supportsClassList) {
      return element.classList.remove(value);
    } else {
      classList = this.parseClassList(element);
      index = classList.indexOf(value);
      if (index !== -1) {
        classList.splice(index, 1);
        return element.className = classList.join(' ');
      }
    }
  };

  return ClassList;

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

this["JST"]["bigscreen/templates/pause_button"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a class="bigscreen-pause-button is-paused">Pause</a>\n';
}
return __p;
};

this["JST"]["bigscreen/templates/play_button"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a class="bigscreen-play-button">Play</a>\n';
}
return __p;
};

this["JST"]["bigscreen/templates/tv"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( playButton.render() )+
'\n'+
( pauseButton.render() )+
'\n';
}
return __p;
};