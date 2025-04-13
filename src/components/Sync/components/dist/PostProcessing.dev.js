"use strict";
// src/components/Sync/components/PostProcessing.js
"use client";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPostProcessing = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer");

var _RenderPass = require("three/examples/jsm/postprocessing/RenderPass");

var _UnrealBloomPass = require("three/examples/jsm/postprocessing/UnrealBloomPass");

var _EtherealGlowEffect = require("./EtherealGlowEffect");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var createPostProcessing = function createPostProcessing(scene, camera, renderer) {
  if (!renderer || !(renderer instanceof THREE.WebGLRenderer)) {
    console.error("Invalid renderer provided to createPostProcessing");
    return null;
  }

  if (!scene || !camera) {
    console.error("Scene or camera missing in createPostProcessing");
    return null;
  }

  var renderScene = new _RenderPass.RenderPass(scene, camera);
  var bloomPass = new _UnrealBloomPass.UnrealBloomPass(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), // Reduced resolution
  1.2, // Lower intensity
  0.4, 0.85);
  var etherealGlowPass = (0, _EtherealGlowEffect.createEtherealGlowEffect)();
  var composer = new _EffectComposer.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(etherealGlowPass);

  var handleResize = function handleResize() {
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.resolution.set(window.innerWidth / 2, window.innerHeight / 2);
  };

  window.addEventListener("resize", handleResize);
  return {
    composer: composer,
    dispose: function dispose() {
      window.removeEventListener("resize", handleResize);
      composer.passes.forEach(function (pass) {
        if (pass.dispose) pass.dispose();
      });
      composer.dispose();
    }
  };
};

exports.createPostProcessing = createPostProcessing;