// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ClzE":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollAnimator = void 0;

var AnimatorDelay = /*#__PURE__*/function () {
  function AnimatorDelay(animateDelay, delayComplete) {
    this.animateDelay = animateDelay;
    this.delayComplete = delayComplete;
    this.timerRunning = false;
    this.timeElapsed = 0;
    this.callbackFired = false;
  }

  var _proto = AnimatorDelay.prototype;

  _proto.start = function start() {
    this.timerRunning = true;
  };

  _proto.update = function update(deltaTime) {
    if (this.timerRunning === false) return;
    this.timeElapsed += deltaTime;

    if (this.timeElapsed > this.animateDelay) {
      this.delayComplete();
      this.callbackFired = true;
      this.reset();
    }
  };

  _proto.reset = function reset() {
    this.timerRunning = false;
    this.timeElapsed = 0;
  };

  _proto.canPlayAnimation = function canPlayAnimation() {
    return this.callbackFired;
  };

  return AnimatorDelay;
}();

var AnimationElement = /*#__PURE__*/function () {
  function AnimationElement(_htmlElement) {
    this._htmlElement = _htmlElement;
    this._hasPlayedOnce = false;
    this._animateOnce = false;
    this._animateClass = "animate-in";
    this._animateThreshold = 0.5;
    this._animateRootMargin = "0px";
    this._animateDelaySeconds = 0;
    var animateOnce = this._htmlElement.dataset.animateOnce;

    if (animateOnce) {
      this._animateOnce = animateOnce === "true";
    }

    var animateClass = this._htmlElement.dataset.animateClass;

    if (animateClass) {
      this._animateClass = animateClass;
    }

    var animateThreshold = this._htmlElement.dataset.animateThreshold;

    if (animateThreshold) {
      this._animateThreshold = parseFloat(animateThreshold);
    }

    var animateRootMargin = this._htmlElement.dataset.animateRootMargin;

    if (animateRootMargin) {
      this._animateRootMargin = animateRootMargin;
    }

    var animateDelaySeconds = this._htmlElement.dataset.animateDelaySeconds;

    if (animateDelaySeconds) {
      this._animateDelaySeconds = parseFloat(animateDelaySeconds);
    }

    this._animatorDelay = new AnimatorDelay(this._animateDelaySeconds, this.onAnimationCanPlay.bind(this));
    this.observer = new IntersectionObserver(this.onIntersectionCallback.bind(this), {
      rootMargin: this._animateRootMargin,
      threshold: this._animateThreshold
    });
    this.observer.observe(this._htmlElement);
  }

  var _proto = AnimationElement.prototype;

  _proto.onIntersectionCallback = function onIntersectionCallback(entries, observer) {
    if (this._hasPlayedOnce === true && this._animateOnce === true) {
      // Configured to play the animation once, no need to keep the observer
      return observer.disconnect();
    }

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if (entry.isIntersecting === true && entry.intersectionRatio > 0) {
        this.play();
      } else {
        this.finish();
      }
    }
  };

  _proto.play = function play() {
    this._animatorDelay.start();
  };

  _proto.onAnimationCanPlay = function onAnimationCanPlay() {
    console.log("onAnimationCanPlay");

    this._htmlElement.classList.add(this._animateClass);

    this._hasPlayedOnce = true;
  };

  _proto.finish = function finish() {
    this._htmlElement.classList.remove(this._animateClass);
  };

  _proto.dispose = function dispose() {
    this.observer.disconnect();
  };

  _proto.update = function update(deltaTime) {
    this._animatorDelay.update(deltaTime);
  };

  return AnimationElement;
}();

var ScrollAnimator = /*#__PURE__*/function () {
  function ScrollAnimator() {
    this.animationElements = [];
    this.requestAnimationFrameRunning = false;
    this.then = 0;
  }
  /**
   * Create observers from a NodeListOf<HTMLElement>
   * Clears existing list of elements if any exist
   * @param elements
   */


  var _proto = ScrollAnimator.prototype;

  _proto.create = function create(elements) {
    this.dispose();

    if (this.requestAnimationFrameRunning === false) {
      window.requestAnimationFrame(this.update.bind(this));
    }

    this.requestAnimationFrameRunning = true;

    for (var i = 0; i < elements.length; i++) {
      var htmlElement = elements[i];
      this.animationElements.push(new AnimationElement(htmlElement));
    }
  }
  /**
   * Dispose of all observers and remove existing list elements
   */
  ;

  _proto.dispose = function dispose() {
    for (var i = 0; i < this.animationElements.length; i++) {
      this.animationElements[i].dispose();
    }

    this.animationElements = [];
  };

  _proto.update = function update(now) {
    now *= 0.001;
    var deltaTime = now - this.then;

    for (var i = 0; i < this.animationElements.length; i++) {
      this.animationElements[i].update(deltaTime);
    }

    this.then = now;
    requestAnimationFrame(this.update.bind(this));
  };

  return ScrollAnimator;
}();

exports.ScrollAnimator = ScrollAnimator;
},{}],"QCba":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _1 = require("../.");

var scrollAnimator = new _1.ScrollAnimator();
scrollAnimator.create(document.querySelectorAll(".js-animate"));
},{"../.":"ClzE"}]},{},["QCba"], null)
//# sourceMappingURL=/example.312895b9.js.map