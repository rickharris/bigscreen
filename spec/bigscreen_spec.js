(function() {
  describe("Bigscreen.CaptionControl", function() {
    describe("#captionsData", function() {
      it("returns an empty array if the video has no caption tracks", function() {
        var subject, video;
        loadFixtures('video_no_captions.html');
        video = document.getElementById('video');
        subject = new Bigscreen.CaptionControl(video);
        return expect(subject.captionsData()).toEqual([]);
      });
      it("returns a non-empty array if the video has caption tracks", function() {
        var subject, video;
        loadFixtures('video.html');
        video = document.getElementById('video');
        subject = new Bigscreen.CaptionControl(video);
        return expect(subject.captionsData().length).not.toEqual(0);
      });
      return it("only includes tracks of kind 'subtitles'", function() {
        var subject, video;
        loadFixtures('video_with_non_subtitle_track.html');
        video = document.getElementById('video');
        subject = new Bigscreen.CaptionControl(video);
        return expect(subject.captionsData().length).toEqual(0);
      });
    });
    return describe("#trackData", function() {
      beforeEach(function() {
        var video;
        loadFixtures('video.html');
        video = document.getElementById('video');
        this.track = video.querySelector('track');
        return this.subject = new Bigscreen.CaptionControl(video);
      });
      it("sets the language attribute to the srclang property of the track", function() {
        return expect(this.subject.trackData(this.track).language).toEqual('en');
      });
      it("sets the title attribute to the title property of the track", function() {
        return expect(this.subject.trackData(this.track).title).toEqual('English');
      });
      return it("sets the title attribute to the srclang property of the track if the track doesn't have a title", function() {
        this.track.title = "";
        return expect(this.subject.trackData(this.track).title).toEqual('en');
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.CaptionLayer", function() {
    return describe("#onLanguageChange", function() {
      beforeEach(function() {
        var subject, video;
        loadFixtures('video.html');
        this.prototype = Bigscreen.CaptionLayer.prototype;
        spyOn(this.prototype, 'onLanguageChange').andCallThrough();
        spyOn(this.prototype, 'setActiveLanguage');
        video = document.getElementById('video');
        subject = new Bigscreen.Tv(video).captionLayer;
        return document.getElementById('bigscreen-caption-language-en').click();
      });
      return it("is called when the user selects a caption language option", function() {
        return expect(this.prototype.onLanguageChange).toHaveBeenCalled();
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.FullscreenControl", function() {
    beforeEach(function() {
      var video;
      loadFixtures('video.html');
      this.prototype = Bigscreen.FullscreenControl.prototype;
      spyOn(this.prototype, "onClick").andCallThrough();
      spyOn(this.prototype, "enterFullscreen").andCallThrough();
      spyOn(this.prototype, "exitFullscreen").andCallThrough();
      video = document.getElementById('video');
      this.container = video.parentNode;
      return this.subject = new Bigscreen.Tv(video).features.fullscreenControl;
    });
    describe("#enterFullscreen", function() {
      beforeEach(function() {
        return this.subject.enterFullscreen();
      });
      it("adds the fullscreen state class to the container", function() {
        return expect($(this.container)).toHaveClass('bigscreen-is-fullscreen');
      });
      return it("sets #isFullscreen to true", function() {
        return expect(this.subject.isFullscreen).toEqual(true);
      });
    });
    describe("#exitFullscreen", function() {
      beforeEach(function() {
        this.subject.enterFullscreen();
        return this.subject.exitFullscreen();
      });
      it("removes the fullscreen state class from the container", function() {
        return expect($(this.container)).not.toHaveClass('bigscreen-is-fullscreen');
      });
      return it("sets #isFullscreen to false", function() {
        return expect(this.subject.isFullscreen).toEqual(false);
      });
    });
    return describe("#onClick", function() {
      it("is called when the fullscreen button is clicked", function() {
        this.subject.getElement().click();
        return expect(this.prototype.onClick).toHaveBeenCalled();
      });
      it("calls #enterFullscreen when not already in fullscreen mode", function() {
        this.subject.isFullscreen = false;
        this.subject.getElement().click();
        return expect(this.prototype.enterFullscreen).toHaveBeenCalled();
      });
      return it("calls #exitFullscreen when in fullscreen mode", function() {
        this.subject.isFullscreen = true;
        this.subject.getElement().click();
        return expect(this.prototype.exitFullscreen).toHaveBeenCalled();
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.PauseButton", function() {
    beforeEach(function() {
      loadFixtures('video.html');
      this.prototype = Bigscreen.PauseButton.prototype;
      spyOn(this.prototype, "wasPlayed").andCallThrough();
      spyOn(this.prototype, "wasPaused").andCallThrough();
      spyOn(this.prototype, "onClick").andCallThrough();
      this.video = document.getElementById('video');
      return this.pauseButton = new Bigscreen.Tv(this.video).features.pauseButton;
    });
    describe("#wasPaused", function() {
      it("is called when the video is paused", function() {
        this.video.play();
        this.video.pause();
        waitsFor(function() {
          return this.prototype.wasPaused.wasCalled;
        }, 1);
        return runs(function() {
          return expect(this.prototype.wasPaused).toHaveBeenCalled();
        });
      });
      return it("adds the 'bigscreen-is-paused' class to the container", function() {
        this.pauseButton.wasPaused();
        return expect($(video.parentNode)).toHaveClass('bigscreen-is-paused');
      });
    });
    describe("#wasPlayed", function() {
      it("is called when the video is played", function() {
        this.video.play();
        waitsFor(function() {
          return this.prototype.wasPlayed.wasCalled;
        }, 1);
        return runs(function() {
          return expect(this.prototype.wasPlayed).toHaveBeenCalled();
        });
      });
      return it("removes the 'bigscreen-is-paused' class from the view", function() {
        this.pauseButton.wasPlayed();
        return expect($(this.video.parentNode)).not.toHaveClass('bigscreen-is-paused');
      });
    });
    return describe("#onClick", function() {
      it("is called when the view is clicked", function() {
        this.pauseButton.getElement().click();
        return expect(this.prototype.onClick).toHaveBeenCalled();
      });
      it("pauses the video", function() {
        this.video.play();
        this.pauseButton.onClick();
        return expect(this.video.paused).toEqual(true);
      });
      return it("doesn't try to pause the video if it's already paused", function() {
        spyOn(this.video, 'pause');
        this.pauseButton.onClick();
        return expect(this.video.pause).not.toHaveBeenCalled();
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.PlayButton", function() {
    beforeEach(function() {
      loadFixtures('video.html');
      this.prototype = Bigscreen.PlayButton.prototype;
      spyOn(this.prototype, "wasPlayed").andCallThrough();
      spyOn(this.prototype, "wasPaused").andCallThrough();
      spyOn(this.prototype, "onClick").andCallThrough();
      this.video = document.getElementById('video');
      return this.playButton = new Bigscreen.Tv(this.video).features.playButton;
    });
    describe("#wasPlayed", function() {
      it("is called when the video is played", function() {
        this.video.play();
        waitsFor(function() {
          return this.prototype.wasPlayed.wasCalled;
        }, 1);
        return runs(function() {
          return expect(this.prototype.wasPlayed).toHaveBeenCalled();
        });
      });
      return it("adds the 'bigscreen-is-playing' class to the container", function() {
        var el;
        el = $(video.parentNode);
        expect(el).not.toHaveClass('bigscreen-is-playing');
        this.playButton.wasPlayed();
        return expect(el).toHaveClass('bigscreen-is-playing');
      });
    });
    describe("#wasPaused", function() {
      it("is called when the video is paused", function() {
        this.video.play();
        this.video.pause();
        waitsFor(function() {
          return this.prototype.wasPaused.wasCalled;
        }, 1);
        return runs(function() {
          return expect(this.prototype.wasPaused).toHaveBeenCalled();
        });
      });
      return it("removes the 'bigscreen-is-playing' class from the container", function() {
        var el;
        el = $(this.video.parentNode).addClass('bigscreen-is-playing');
        expect(el).toHaveClass('bigscreen-is-playing');
        this.playButton.wasPaused();
        return expect(el).not.toHaveClass('bigscreen-is-playing');
      });
    });
    return describe("#onClick", function() {
      it("is called when the element is clicked", function() {
        this.playButton.getElement().click();
        return expect(this.prototype.onClick).toHaveBeenCalled();
      });
      it("plays the video if the video is paused", function() {
        expect(video.paused).toEqual(true);
        this.playButton.onClick();
        return expect(video.paused).toEqual(false);
      });
      return it("does not try to play the video if it's already playing", function() {
        spyOn(this.video, "play").andCallThrough();
        this.video.play();
        expect(this.video.play.callCount).toEqual(1);
        this.playButton.onClick();
        return expect(this.video.play.callCount).toEqual(1);
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.PlaybackRateControl", function() {
    beforeEach(function() {
      loadFixtures('video.html');
      this.prototype = Bigscreen.PlaybackRateControl.prototype;
      spyOn(this.prototype, 'onOptionChange').andCallThrough();
      spyOn(this.prototype, 'rateWasChanged').andCallThrough();
      this.video = document.getElementById('video');
      return this.subject = new Bigscreen.Tv(this.video).features.playbackRateControl;
    });
    describe("browser support", function() {
      return it("only renders if the browser supports video playbackRate", function() {
        var el;
        el = this.video.parentNode.querySelector('.bigscreen-playback-rate-control');
        if (Bigscreen.Utils.FeatureDetects.playbackRate) {
          return expect(el).not.toEqual(null);
        } else {
          return expect(el).toEqual(null);
        }
      });
    });
    if (Bigscreen.Utils.FeatureDetects.playbackRate) {
      describe("#onOptionChange", function() {
        beforeEach(function() {
          return this.subject.getElement().querySelector('#bigscreen-playback-rate-1-5x').click();
        });
        it("is called when the user selects a playback rate option", function() {
          return expect(this.prototype.onOptionChange).toHaveBeenCalled();
        });
        return it("changes the playbackRate of the video", function() {
          return expect(this.video.playbackRate).toEqual(1.5);
        });
      });
      return describe("#rateWasChanged", function() {
        it("is called when the video's playbackRate changes", function() {
          this.video.playbackRate = 2.0;
          waitsFor(function() {
            return this.prototype.rateWasChanged.wasCalled;
          }, 1);
          return runs(function() {
            return expect(this.prototype.rateWasChanged).toHaveBeenCalled();
          });
        });
        it("selects the correct radio", function() {
          var el;
          this.video.playbackRate = 2.0;
          el = document.getElementById('bigscreen-playback-rate-2-0x');
          waitsFor(function() {
            return el.checked;
          }, 1);
          return runs(function() {
            return expect($(el)).toBeChecked();
          });
        });
        return it("deselects all radios if the current playback rate isn't an official option", function() {
          this.video.playbackRate = 3;
          waitsFor(function() {
            return this.prototype.rateWasChanged.wasCalled;
          }, 1);
          return runs(function() {
            var radio, _i, _len, _ref, _results;
            _ref = this.subject.getElement().querySelectorAll('input[type=radio]');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              radio = _ref[_i];
              _results.push(expect($(radio)).not.toBeChecked());
            }
            return _results;
          });
        });
      });
    }
  });

}).call(this);

(function() {
  describe("Bigscreen.Tv", function() {
    return it("adds the paused state class to the container", function() {
      var container, video;
      loadFixtures('video.html');
      video = document.getElementById('video');
      container = $(video.parentNode);
      expect(container).not.toHaveClass('bigscreen-is-paused');
      new Bigscreen.Tv(video);
      return expect(container).toHaveClass('bigscreen-is-paused');
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.Utils.ClassList", function() {
    beforeEach(function() {
      this.subject = Bigscreen.Utils.ClassList;
      return this.el = document.createElement('div');
    });
    describe(".add", function() {
      it("adds the given class to the given element", function() {
        this.subject.add('bigscreen', this.el);
        return expect(this.el.className).toEqual('bigscreen');
      });
      return it("does not add the class if the element already has the class", function() {
        $(this.el).addClass('bigscreen');
        this.subject.add('bigscreen', this.el);
        return expect(this.el.className).toEqual('bigscreen');
      });
    });
    return describe(".remove", function() {
      return it("removes the given class", function() {
        $(this.el).addClass('bigscreen');
        this.subject.remove('bigscreen', this.el);
        return expect(this.el.className).toEqual('');
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.Utils.Enumerable", function() {
    return describe(".includes", function() {
      it("returns true if the item in question is in the enumerable", function() {
        return expect(Bigscreen.Utils.Enumerable.includes([1, 2, 3], 1)).toEqual(true);
      });
      it("returns false if the item is not in the enumerable", function() {
        return expect(Bigscreen.Utils.Enumerable.includes([1, 2, 3], 4)).toEqual(false);
      });
      return it("works for NodeLists", function() {
        var nodeList, rando, root, video;
        loadFixtures('video.html');
        root = document.getElementById('video-wrapper');
        video = document.getElementById('video');
        rando = document.createElement('video');
        nodeList = root.querySelectorAll('video');
        expect(Bigscreen.Utils.Enumerable.includes(nodeList, video)).toEqual(true);
        return expect(Bigscreen.Utils.Enumerable.includes(nodeList, rando)).toEqual(false);
      });
    });
  });

}).call(this);

(function() {
  describe("Bigscreen.Utils.Events", function() {
    return describe(".delegate", function() {
      beforeEach(function() {
        var obj;
        loadFixtures('delegation.html');
        this.root = document.getElementById('root');
        this.target = document.getElementById('target');
        this.wrongTarget = document.getElementById('wrong-target');
        obj = {
          onEvent: function() {}
        };
        spyOn(obj, 'onEvent');
        return this.callback = obj.onEvent;
      });
      it("calls the provided callback", function() {
        Bigscreen.Utils.Events.delegate('click', this.root, '#target', this.callback);
        this.target.click();
        return expect(this.callback).toHaveBeenCalled();
      });
      it("calls the callback in the context of the root element", function() {
        var correctContext, passedContext;
        correctContext = this.root;
        passedContext = null;
        Bigscreen.Utils.Events.delegate('click', this.root, '#target', function() {
          return passedContext = this;
        });
        this.target.click();
        return expect(passedContext).toEqual(correctContext);
      });
      it("does not listen on events that don't match the selector", function() {
        Bigscreen.Utils.Events.delegate('click', this.root, 'a', this.callback);
        this.root.click();
        return expect(this.callback).not.toHaveBeenCalled();
      });
      it("passes the event object as the first argument to the callback", function() {
        var event;
        event = void 0;
        Bigscreen.Utils.Events.delegate('click', this.root, '#target', (function(_this) {
          return function(e) {
            return event = e;
          };
        })(this));
        this.target.click();
        return expect(event).toBeDefined();
      });
      it("queries the DOM only in the scope of the root element", function() {
        Bigscreen.Utils.Events.delegate('click', this.root, 'a', this.callback);
        this.target.click();
        return expect(this.callback).toHaveBeenCalled();
      });
      return it("bubbles the event", function() {
        Bigscreen.Utils.Events.delegate('click', this.root, 'a', this.callback);
        document.getElementById('target-2').click();
        return expect(this.callback).toHaveBeenCalled();
      });
    });
  });

}).call(this);
