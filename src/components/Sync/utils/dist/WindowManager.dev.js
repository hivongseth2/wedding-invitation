"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// src/components/Sync/utils/WindowManager.js
var WindowManager =
/*#__PURE__*/
function () {
  function WindowManager() {
    _classCallCheck(this, WindowManager);

    this.windows = [];
    this.thisWindow = {};
    this.lastUpdate = 0;
    this.updateThrottle = 100; // Throttle updates to every 100ms

    this.init();
  }

  _createClass(WindowManager, [{
    key: "init",
    value: function init() {
      var storedWindows = localStorage.getItem("windows");
      this.windows = storedWindows ? JSON.parse(storedWindows) : [];
      this.thisWindow = {
        id: Math.random().toString(36).substr(2, 9),
        shape: {
          x: window.screenX,
          y: window.screenY,
          w: window.innerWidth,
          h: window.innerHeight
        },
        metaData: {
          sphere: null
        } // { x, y, z, color }

      };
      this.windows.push(this.thisWindow);
      this.saveWindows();
      window.addEventListener("storage", this.handleStorage.bind(this));
      window.addEventListener("unload", this.removeWindow.bind(this));
    }
  }, {
    key: "saveWindows",
    value: function saveWindows() {
      var now = Date.now();
      if (now - this.lastUpdate < this.updateThrottle) return;
      this.lastUpdate = now;

      try {
        localStorage.setItem("windows", JSON.stringify(this.windows));
      } catch (e) {
        console.warn("Failed to save windows:", e);
      }
    }
  }, {
    key: "handleStorage",
    value: function handleStorage(event) {
      if (event.key === "windows") {
        this.windows = JSON.parse(event.newValue || "[]");
      }
    }
  }, {
    key: "removeWindow",
    value: function removeWindow() {
      var _this = this;

      this.windows = this.windows.filter(function (win) {
        return win.id !== _this.thisWindow.id;
      });
      this.saveWindows();
    }
  }, {
    key: "getWindows",
    value: function getWindows() {
      return this.windows;
    }
  }, {
    key: "getThisWindowData",
    value: function getThisWindowData() {
      return this.thisWindow;
    }
  }, {
    key: "setMetaData",
    value: function setMetaData(data) {
      this.thisWindow.metaData = _objectSpread({}, this.thisWindow.metaData, {}, data);
      this.saveWindows();
    }
  }]);

  return WindowManager;
}();

exports["default"] = WindowManager;