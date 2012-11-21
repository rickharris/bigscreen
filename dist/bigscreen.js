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
