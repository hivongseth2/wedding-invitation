"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBlackHoleEffect = exports.createBlackHoleEffect = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Trong BlackHoleEffect.js
var createBlackHoleEffect = function createBlackHoleEffect(position, endPosition, startColor, endColor) {
  var progress = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var group = new THREE.Group();
  group.position.copy(position); // Tạo vortex

  var vortexGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 50); // Giảm phân giải để tối ưu

  var vortexMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0
      },
      startColor: {
        value: new THREE.Color(startColor)
      },
      endColor: {
        value: new THREE.Color(endColor)
      },
      progress: {
        value: progress
      }
    },
    vertexShader: "\n      uniform float time;\n      uniform float progress;\n      varying vec2 vUv;\n      varying vec3 vPosition;\n      void main() {\n        vUv = uv;\n        vPosition = position;\n        float angle = atan(position.y, position.x);\n        float radius = length(position.xy);\n        float spiralFactor = progress * 1.5;\n        float newAngle = angle + time * 1.5 + radius * spiralFactor;\n        vec3 newPosition = position;\n        newPosition.x = cos(newAngle) * radius;\n        newPosition.y = sin(newAngle) * radius;\n        float shrinkFactor = 1.0 - progress * 0.4;\n        newPosition.xy *= shrinkFactor;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n      }\n    ",
    fragmentShader: "\n      uniform float time;\n      uniform vec3 startColor;\n      uniform vec3 endColor;\n      uniform float progress;\n      varying vec2 vUv;\n      varying vec3 vPosition;\n      void main() {\n        vec3 color = mix(startColor, endColor, progress);\n        float pulse = 0.9 + 0.1 * sin(time * 2.0);\n        float opacity = 0.3 + progress * 0.7;\n        gl_FragColor = vec4(color, opacity * pulse);\n      }\n    ",
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  var vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
  vortex.rotation.x = Math.PI / 2;
  group.add(vortex); // Animation update

  group.userData.update = function (time) {
    vortexMaterial.uniforms.time.value = time;
    var newProgress = Math.min(vortexMaterial.uniforms.progress.value + 0.03, 1.0);
    vortexMaterial.uniforms.progress.value = newProgress;
  };

  return group;
};

exports.createBlackHoleEffect = createBlackHoleEffect;

var updateBlackHoleEffect = function updateBlackHoleEffect(blackHole, time) {
  if (!blackHole || !blackHole.userData.update) return;
  blackHole.userData.update(time);
  blackHole.scale.set(2, 2, 2); // Giảm scale để tránh che khuất
};

exports.updateBlackHoleEffect = updateBlackHoleEffect;