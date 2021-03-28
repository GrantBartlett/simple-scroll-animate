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

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var AnimationElement = /*#__PURE__*/function () {
  function AnimationElement(_htmlElement) {
    this._htmlElement = _htmlElement;
    this.animationPlaying = false;
    this.animationPlayedOnce = false;
    this._animateOnce = false;
    this._animateClass = "no-animation";
    this._animateThreshold = 0.5;

    if (this.htmlElement.dataset.animateOnce) {
      this._animateOnce = this.htmlElement.dataset.animateOnce === "true";
    }

    if (this.htmlElement.dataset.animateClass) {
      this._animateClass = this.htmlElement.dataset.animateClass;
    }

    if (this.htmlElement.dataset.animateThreshold) {
      this._animateThreshold = parseFloat(this.htmlElement.dataset.animateThreshold);
    }

    this.observer = new IntersectionObserver(this.onIntersectionCallback.bind(this), {
      rootMargin: "0px",
      threshold: this.animateThreshold
    });
    this.observer.observe(this.htmlElement);
  }

  var _proto = AnimationElement.prototype;

  _proto.onIntersectionCallback = function onIntersectionCallback(entries, observer) {
    if (this.animationPlayedOnce === true && this.animateOnce === true) {
      // Configured to play the animation once, no need to keep the observer
      return observer.disconnect();
    }

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if (entry.isIntersecting === true && this.animationPlaying === false) {
        this.play();
      } else {
        this.reset();
      }
    }
  };

  _proto.play = function play() {
    this.animationPlaying = true;
    this.animationPlayedOnce = true;
    this.htmlElement.classList.add(this.animateClass);
    this.htmlElement.addEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
    this.htmlElement.addEventListener("animationend", this.onAnimationComplete.bind(this), false);
  };

  _proto.onAnimationComplete = function onAnimationComplete() {
    this.animationPlaying = false;
    this.htmlElement.removeEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
    this.htmlElement.removeEventListener("animationend", this.onAnimationComplete.bind(this), false);
  };

  _proto.reset = function reset() {
    this.htmlElement.classList.remove(this.animateClass);
    this.htmlElement.removeEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
    this.htmlElement.removeEventListener("animationend", this.onAnimationComplete.bind(this), false);
  };

  _proto.dispose = function dispose() {
    this.observer.disconnect();
  };

  _createClass(AnimationElement, [{
    key: "animateOnce",
    get: function get() {
      return this._animateOnce;
    }
  }, {
    key: "animateThreshold",
    get: function get() {
      return this._animateThreshold;
    }
  }, {
    key: "animateClass",
    get: function get() {
      return this._animateClass;
    }
  }, {
    key: "htmlElement",
    get: function get() {
      return this._htmlElement;
    }
  }]);

  return AnimationElement;
}();

var ScrollAnimator = /*#__PURE__*/function () {
  function ScrollAnimator() {
    this.animationElements = [];
  }
  /**
   * Create observers from a NodeListOf<HTMLElement>
   * Clears existing list of elements if any exist
   * @param elements
   */


  var _proto = ScrollAnimator.prototype;

  _proto.create = function create(elements) {
    this.dispose();

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
scrollAnimator.create(document.querySelectorAll("[data-animate]"));
},{"../.":"ClzE"}]},{},["QCba"], null)
//# sourceMappingURL=/example.6fe2a491.js.map