this.Bigscreen || (this.Bigscreen = {});

Bigscreen.CaptionControl = (function() {
  function CaptionControl(video) {
    this.video = video;
  }

  CaptionControl.prototype.captionsData = function() {
    var track, tracks, _i, _len, _results;
    tracks = this.video.parentNode.querySelectorAll('track[kind=subtitles]');
    _results = [];
    for (_i = 0, _len = tracks.length; _i < _len; _i++) {
      track = tracks[_i];
      _results.push(this.trackData(track));
    }
    return _results;
  };

  CaptionControl.prototype.trackData = function(track) {
    return {
      language: track.getAttribute('srclang'),
      title: track.title || track.getAttribute('srclang')
    };
  };

  CaptionControl.prototype.render = function() {
    var captionsData;
    captionsData = this.captionsData();
    return JST['bigscreen/templates/caption_control']({
      captionsData: captionsData
    });
  };

  return CaptionControl;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.CaptionLayer = (function() {
  function CaptionLayer(video) {
    this.video = video;
    this.onTimeUpdate = __bind(this.onTimeUpdate, this);
    this.onLanguageChange = __bind(this.onLanguageChange, this);
    Bigscreen.Utils.Events.delegate('change', this.video.parentNode, '.bigscreen-caption-control input', this.onLanguageChange);
    this.processedLanguages = {
      error: "The selected language isn't available.",
      none: " "
    };
  }

  CaptionLayer.prototype.onLanguageChange = function(event) {
    var captionTrack, language;
    language = event.target.value;
    if (this.processedLanguages[language]) {
      return this.setActiveLanguage(language);
    } else {
      captionTrack = this.video.querySelector("track[kind=subtitles][srclang=" + language + "]");
      return this.processCaptionTrack(captionTrack);
    }
  };

  CaptionLayer.prototype.processCaptionTrack = function(captionTrack) {
    this.request = new XMLHttpRequest();
    this.request.open("GET", captionTrack.getAttribute('src'));
    this.request.onreadystatechange = (function(_this) {
      return function() {
        if (_this.request.readyState === 4) {
          if (_this.request.status === 200) {
            _this.parseCaptions(captionTrack.getAttribute('srclang'), _this.request.responseText);
            return _this.setActiveLanguage(captionTrack.getAttribute('srclang'));
          } else {
            return _this.setActiveLanguage('error');
          }
        }
      };
    })(this);
    return this.request.send();
  };

  CaptionLayer.prototype.parseCaptions = function(language, captions) {
    var entries, entry, i, lineNumberPattern, lines;
    lineNumberPattern = /^[0-9]+$/;
    lines = captions.split(/\r?\n/);
    entries = [];
    i = 0;
    while (i < lines.length) {
      if (lines[i].match(lineNumberPattern)) {
        entry = {};
        entry.times = this.parseTimeCode(lines[i + 1]);
        entry.text = lines[i + 2];
        entries.push(entry);
      }
      i++;
    }
    return this.processedLanguages[language] = entries;
  };

  CaptionLayer.prototype.parseTimeCode = function(timeCode) {
    var end, endSeconds, parts, start, startSeconds, timeCodePattern;
    timeCodePattern = /^([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{1,3}) --\> ([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{1,3})$/;
    parts = timeCodePattern.exec(timeCode);
    start = {
      hours: parseInt(parts[1], 10),
      minutes: parseInt(parts[2], 10),
      seconds: parseInt(parts[3], 10),
      miliseconds: parseInt(parts[4], 10)
    };
    end = {
      hours: parseInt(parts[5], 10),
      minutes: parseInt(parts[6], 10),
      seconds: parseInt(parts[7], 10),
      miliseconds: parseInt(parts[8], 10)
    };
    startSeconds = (start.hours * 60 * 60) + (start.minutes * 60) + start.seconds + (start.miliseconds / 1000);
    endSeconds = (end.hours * 60 * 60) + (end.minutes * 60) + end.seconds + (end.miliseconds / 1000);
    return [startSeconds, endSeconds];
  };

  CaptionLayer.prototype.setActiveLanguage = function(language) {
    this.currentLanguage = this.processedLanguages[language];
    if (typeof this.currentLanguage === "string") {
      this.video.removeEventListener('timeupdate', this.onTimeUpdate);
      return this.showCaptionMessage(this.currentLanguage);
    } else {
      this.video.removeEventListener('timeupdate', this.onTimeUpdate);
      return this.video.addEventListener('timeupdate', this.onTimeUpdate);
    }
  };

  CaptionLayer.prototype.showCaptionMessage = function(text) {
    var captionContainer;
    captionContainer = this.getElement().querySelector('.bigscreen-caption-content');
    return captionContainer.textContent = text;
  };

  CaptionLayer.prototype.onTimeUpdate = function(event) {
    var cue, currentTime, _i, _len, _ref, _results;
    currentTime = this.video.currentTime;
    _ref = this.currentLanguage;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cue = _ref[_i];
      if (currentTime >= cue.times[0] && currentTime < cue.times[1]) {
        _results.push(this.showCaptionMessage(cue.text));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  CaptionLayer.prototype.getElement = function() {
    return this.video.parentNode.querySelector('.bigscreen-caption-layer');
  };

  CaptionLayer.prototype.render = function() {
    return JST['bigscreen/templates/caption_layer']();
  };

  return CaptionLayer;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.FullscreenControl = (function() {
  function FullscreenControl(video) {
    this.video = video;
    this.onClick = __bind(this.onClick, this);
    this.isFullscreen = false;
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-fullscreen-control', this.onClick);
  }

  FullscreenControl.prototype.onClick = function() {
    if (this.isFullscreen === true) {
      return this.exitFullscreen();
    } else {
      return this.enterFullscreen();
    }
  };

  FullscreenControl.prototype.enterFullscreen = function() {
    Bigscreen.Utils.ClassList.add('bigscreen-is-fullscreen', this.video.parentNode);
    return this.isFullscreen = true;
  };

  FullscreenControl.prototype.exitFullscreen = function() {
    Bigscreen.Utils.ClassList.remove('bigscreen-is-fullscreen', this.video.parentNode);
    return this.isFullscreen = false;
  };

  FullscreenControl.prototype.getElement = function() {
    return this.video.parentNode.querySelector('.bigscreen-fullscreen-control');
  };

  FullscreenControl.prototype.render = function() {
    return JST['bigscreen/templates/fullscreen_control']();
  };

  return FullscreenControl;

})();

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
    return Bigscreen.Utils.ClassList.add('bigscreen-is-paused', this.video.parentNode);
  };

  PauseButton.prototype.wasPlayed = function() {
    return Bigscreen.Utils.ClassList.remove('bigscreen-is-paused', this.video.parentNode);
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
    return Bigscreen.Utils.ClassList.add('bigscreen-is-playing', this.video.parentNode);
  };

  PlayButton.prototype.wasPaused = function(event) {
    return Bigscreen.Utils.ClassList.remove('bigscreen-is-playing', this.video.parentNode);
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

Bigscreen.PlaybackRateControl = (function() {
  function PlaybackRateControl(video) {
    this.video = video;
    this.onOptionChange = __bind(this.onOptionChange, this);
    this.rateWasChanged = __bind(this.rateWasChanged, this);
    this.video.addEventListener('ratechange', this.rateWasChanged);
    Bigscreen.Utils.Events.delegate('change', this.video.parentNode, '.bigscreen-playback-rate-control input', this.onOptionChange);
  }

  PlaybackRateControl.prototype.rateWasChanged = function() {
    var current;
    current = this.getElement().querySelector("li[data-playback-rate='" + this.video.playbackRate + "']");
    if (current) {
      return current.querySelector('input[type=radio]').checked = true;
    } else {
      return this.getElement().querySelector('input[type=radio][checked]').checked = false;
    }
  };

  PlaybackRateControl.prototype.onOptionChange = function(event) {
    return this.video.playbackRate = event.target.value;
  };

  PlaybackRateControl.prototype.getElement = function() {
    return this.video.parentNode.querySelector('.bigscreen-playback-rate-control');
  };

  PlaybackRateControl.prototype.render = function() {
    return JST['bigscreen/templates/playback_rate_control']();
  };

  return PlaybackRateControl;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.ProgressControl = (function() {
  function ProgressControl(video) {
    this.video = video;
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.onMouseOut = __bind(this.onMouseOut, this);
    this.onMouseOver = __bind(this.onMouseOver, this);
    this.onClick = __bind(this.onClick, this);
    this.onTimeUpdate = __bind(this.onTimeUpdate, this);
    this.video.addEventListener('timeupdate', this.onTimeUpdate);
    this.video.addEventListener('load', this.setDuration);
    Bigscreen.Utils.Events.delegate('click', this.video.parentNode, '.bigscreen-progress-bar', this.onClick);
    Bigscreen.Utils.Events.delegate('mouseover', this.video.parentNode, '.bigscreen-progress-bar', this.onMouseOver);
    Bigscreen.Utils.Events.delegate('mouseout', this.video.parentNode, '.bigscreen-progress-bar', this.onMouseOut);
    this.durationSet = false;
  }

  ProgressControl.prototype.onTimeUpdate = function() {
    if (!this.durationSet) {
      this.setDuration();
    }
    this.updateCurrentTime();
    return this.updateProgressBar();
  };

  ProgressControl.prototype.setDuration = function() {
    var durationLabel;
    durationLabel = this.getElement('.bigscreen-duration-label');
    durationLabel.textContent = this.secondsToTimeLabel(this.video.duration);
    return this.durationSet = true;
  };

  ProgressControl.prototype.updateCurrentTime = function() {
    var currentTimeLabel;
    currentTimeLabel = this.getElement('.bigscreen-current-time-label');
    return currentTimeLabel.textContent = this.secondsToTimeLabel(this.video.currentTime);
  };

  ProgressControl.prototype.updateProgressBar = function() {
    var percentComplete;
    percentComplete = this.video.currentTime / this.video.duration * 100;
    return this.getElement('.bigscreen-progress').setAttribute('style', "width: " + percentComplete + "%");
  };

  ProgressControl.prototype.onClick = function(event) {
    var el, progressPercentage;
    el = this.getElement('.bigscreen-progress-bar');
    progressPercentage = this.relativeXOffset(event.pageX, el) / el.clientWidth;
    return this.video.currentTime = this.video.duration * progressPercentage;
  };

  ProgressControl.prototype.onMouseOver = function(event) {
    this.getElement('.bigscreen-progress-bar').addEventListener('mousemove', this.onMouseMove);
    return this.getElement('.bigscreen-progress-tooltip').setAttribute('style', 'display: block');
  };

  ProgressControl.prototype.onMouseOut = function(event) {
    this.getElement('.bigscreen-progress-bar').removeEventListener('mousemove', this.onMouseMove);
    return this.getElement('.bigscreen-progress-tooltip').setAttribute('style', 'display: none');
  };

  ProgressControl.prototype.onMouseMove = function(event) {
    var progressBar, progressPercentage, tooltip;
    progressBar = this.getElement('.bigscreen-progress-bar');
    progressPercentage = this.relativeXOffset(event.pageX, progressBar) / progressBar.clientWidth;
    tooltip = this.getElement('.bigscreen-progress-tooltip');
    tooltip.textContent = this.secondsToTimeLabel(this.video.duration * progressPercentage);
    return tooltip.setAttribute('style', "left: " + (progressPercentage * 100) + "%");
  };

  ProgressControl.prototype.getElement = function(extraSelector) {
    var selector;
    selector = ".bigscreen-progress-control";
    if (extraSelector != null) {
      selector = selector += " " + extraSelector;
    }
    return this.video.parentNode.querySelector(selector);
  };

  ProgressControl.prototype.render = function() {
    return JST['bigscreen/templates/progress_control']();
  };

  ProgressControl.prototype.secondsToTimeLabel = function(seconds) {
    var hours, minutes, result;
    hours = Math.floor(seconds / (60 * 60));
    minutes = Math.floor(seconds / 60) % 60;
    seconds = Math.floor(seconds) % 60;
    result = "";
    if (hours > 0) {
      result += "" + (this.formatTimeSegment(hours)) + ":";
    }
    return result += "" + (this.formatTimeSegment(minutes)) + ":" + (this.formatTimeSegment(seconds));
  };

  ProgressControl.prototype.formatTimeSegment = function(segment) {
    var format;
    format = "00";
    return (format + segment).slice(-format.length);
  };

  ProgressControl.prototype.relativeXOffset = function(absOffset, element) {
    var elOffset;
    elOffset = element.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft;
    return absOffset - elOffset;
  };

  return ProgressControl;

})();

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Tv = (function() {
  function Tv(video) {
    this.video = video;
    Bigscreen.Utils.ClassList.add('bigscreen-is-paused', this.video.parentNode);
    this.features = {
      playButton: new Bigscreen.PlayButton(video),
      pauseButton: new Bigscreen.PauseButton(video),
      playbackRateControl: (Bigscreen.Utils.FeatureDetects.playbackRate ? new Bigscreen.PlaybackRateControl(video) : null),
      captionControl: new Bigscreen.CaptionControl(video),
      captionLayer: new Bigscreen.CaptionLayer(video),
      progressControl: new Bigscreen.ProgressControl(video),
      fullscreenControl: new Bigscreen.FullscreenControl(video)
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
      var current, matches, matchingElements, _results;
      matchingElements = context.querySelectorAll(selector);
      current = event.target;
      _results = [];
      while (current !== context) {
        matches = Bigscreen.Utils.Enumerable.includes(matchingElements, current);
        if (matches) {
          callback.apply(this, arguments);
        }
        _results.push(current = current.parentNode);
      }
      return _results;
    });
  };

  return Events;

})();

this.Bigscreen || (this.Bigscreen = {});

Bigscreen.Utils || (Bigscreen.Utils = {});

Bigscreen.Utils.FeatureDetects = (function() {
  function FeatureDetects() {}

  FeatureDetects.playbackRate = document.createElement('video').playbackRate != null;

  return FeatureDetects;

})();

this["JST"] = this["JST"] || {};
this["JST"]["bigscreen/templates/caption_control"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if (captionsData.length) { 
__p+='\n  <div class="bigscreen-caption-control">\n    <div class="bigscreen-control-headline">\n      Caption Language\n    </div>\n    <ul>\n      <li data-caption-language="none">\n        <label>\n          <input type="radio"\n            name="bigscreen-caption-language"\n            id="bigscreen-caption-language-none"\n            value="none"\n            checked>\n          <span class="bigscreen-label-value">None</span>\n        </label>\n      </li>\n\n      ';
 for (var i in captionsData) { 
__p+='\n        ';
 var track = captionsData[i] 
__p+='\n        <li data-caption-language="'+
((__t=( track.language ))==null?'':__t)+
'">\n          <label>\n            <input type="radio"\n              name="bigscreen-caption-language"\n              id="bigscreen-caption-language-'+
((__t=( track.language ))==null?'':__t)+
'"\n              value="'+
((__t=( track.language ))==null?'':__t)+
'">\n            <span class="bigscreen-label-value">'+
((__t=( track.title ))==null?'':__t)+
'</span>\n          </label>\n        </li>\n      ';
 } 
__p+='\n    </ul>\n  </div>\n';
 } 
__p+='\n';
}
return __p;
};
this["JST"]["bigscreen/templates/caption_layer"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="bigscreen-caption-layer">\n  <div class="bigscreen-caption-content">\n  </div>\n</div>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/fullscreen_control"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a class="bigscreen-fullscreen-control">Toggle Fullscreen</a>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/pause_button"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a class="bigscreen-pause-button">Pause</a>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/play_button"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<a class="bigscreen-play-button">Play</a>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/playback_rate_control"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="bigscreen-playback-rate-control">\n  <div class="bigscreen-control-headline">\n    Video speed\n  </div>\n  <ul>\n    <li data-playback-rate="1">\n      <label for="bigscreen-playback-rate-normal">\n        <input type="radio"\n          name="bigscreen-playback-rate"\n          id="bigscreen-playback-rate-normal"\n          value="1"\n          checked>\n        <span class="bigscreen-label-value">Normal</span>\n      </label>\n    </li>\n    <li data-playback-rate="1.5">\n      <label for="bigscreen-playback-rate-1-5x">\n        <input type="radio"\n          name="bigscreen-playback-rate"\n          id="bigscreen-playback-rate-1-5x"\n          value="1.5">\n        <span class="bigscreen-label-value">1.5x</span>\n      </label>\n    </li>\n    <li data-playback-rate="2">\n      <label for="bigscreen-playback-rate-2-0x">\n        <input type="radio"\n          name="bigscreen-playback-rate"\n          id="bigscreen-playback-rate-2-0x"\n          value="2">\n        <span class="bigscreen-label-value">2.0x</span>\n      </label>\n    </li>\n  </ul>\n</div>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/progress_control"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="bigscreen-progress-control">\n  <div class="bigscreen-time-label bigscreen-current-time-label">0:00</div>\n  <div class="bigscreen-progress-bar">\n    <div class="bigscreen-progress"></div>\n    <div class="bigscreen-progress-tooltip" style="display: none">0:00</div>\n  </div>\n  <div class="bigscreen-time-label bigscreen-duration-label">0:00</div>\n</div>\n';
}
return __p;
};
this["JST"]["bigscreen/templates/tv"] = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="bigscreen-layers">\n  '+
((__t=( captionLayer.render() ))==null?'':__t)+
'\n</div>\n\n<div class="bigscreen-controls">\n  '+
((__t=( playButton.render() ))==null?'':__t)+
'\n  '+
((__t=( pauseButton.render() ))==null?'':__t)+
'\n  '+
((__t=( progressControl.render() ))==null?'':__t)+
'\n  ';
 if(playbackRateControl) { 
__p+='\n    '+
((__t=( playbackRateControl.render() ))==null?'':__t)+
'\n  ';
 } 
__p+='\n  '+
((__t=( captionControl.render() ))==null?'':__t)+
'\n  '+
((__t=( fullscreenControl.render() ))==null?'':__t)+
'\n</div>\n';
}
return __p;
};