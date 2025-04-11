"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEtherealConnection = exports.createEtherealConnection = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Tạo kết nối ethereal giữa hai điểm
var createEtherealConnection = function createEtherealConnection(start, end, startColor, endColor) {
  var count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000;
  // Create a group to hold all connection elements
  var group = new THREE.Group(); // Calculate control points for a curved path

  var direction = new THREE.Vector3().subVectors(end, start);
  var midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5); // Add some height to the curve

  var perpendicular = new THREE.Vector3(0, 1, 0);

  if (Math.abs(direction.y) > 0.9) {
    perpendicular.set(1, 0, 0);
  }

  var normal = new THREE.Vector3().crossVectors(direction, perpendicular).normalize();
  var curveHeight = direction.length() * 0.3; // Moderate curve height
  // Create multiple control points for a more complex curve

  var controlPoints = []; // Add start point

  controlPoints.push(start.clone()); // Add intermediate points with slight variations

  var numIntermediatePoints = 6; // Giảm số điểm để tối ưu

  for (var i = 1; i < numIntermediatePoints; i++) {
    var t = i / numIntermediatePoints; // Base point along the line

    var basePoint = new THREE.Vector3().lerpVectors(start, end, t); // Add some curvature
    // Use sine wave for natural curve

    var curveOffset = Math.sin(t * Math.PI) * curveHeight; // Add some randomness to each control point

    var randomOffset = (Math.random() - 0.5) * 0.1; // Create the control point with offset

    var controlPoint = basePoint.clone().add(normal.clone().multiplyScalar(curveOffset + randomOffset));
    controlPoints.push(controlPoint);
  } // Add end point


  controlPoints.push(end.clone()); // Create a smooth curve through all control points

  var curve = new THREE.CatmullRomCurve3(controlPoints);
  curve.tension = 0.1; // Lower tension for smoother curve
  // Create particles along the curve

  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var sizes = new Float32Array(count);
  var opacities = new Float32Array(count);
  var offsets = new Float32Array(count);
  var speeds = new Float32Array(count);
  var startColorObj = new THREE.Color(startColor);
  var endColorObj = new THREE.Color(endColor); // Sample points along the curve for reference

  var curvePoints = curve.getPoints(50); // Giảm số điểm lấy mẫu

  for (var _i = 0; _i < count; _i++) {
    // Random position along the curve
    var _t = Math.random();

    var curvePoint = curve.getPointAt(_t); // Add some randomness to position
    // More randomness in the middle, less at endpoints

    var spreadFactor = Math.sin(_t * Math.PI) * 0.2; // Random distance from curve

    var randomAngle = Math.random() * Math.PI * 2;
    var randomRadius = Math.random() * spreadFactor; // Calculate offset direction (perpendicular to curve)

    var tangent = curve.getTangentAt(_t);

    var _normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();

    var binormal = new THREE.Vector3().crossVectors(tangent, _normal); // Create position with randomness in all directions

    var pos = curvePoint.clone();
    pos.add(_normal.clone().multiplyScalar(Math.cos(randomAngle) * randomRadius));
    pos.add(binormal.clone().multiplyScalar(Math.sin(randomAngle) * randomRadius));
    positions[_i * 3] = pos.x;
    positions[_i * 3 + 1] = pos.y;
    positions[_i * 3 + 2] = pos.z; // Interpolate color based on position

    var colorT = _t;
    var color = new THREE.Color().lerpColors(startColorObj, endColorObj, colorT);
    colors[_i * 3] = color.r;
    colors[_i * 3 + 1] = color.g;
    colors[_i * 3 + 2] = color.b; // Extremely small particles for a misty effect
    // Vary size based on distance from curve center

    var sizeVariation = 1.0 - 0.5 * Math.random() * randomRadius / spreadFactor;
    sizes[_i] = (0.002 + Math.random() * 0.003) * sizeVariation; // Vary opacity - more transparent at edges

    opacities[_i] = 0.1 + 0.2 * sizeVariation * Math.random(); // Random offset for animation

    offsets[_i] = Math.random() * Math.PI * 2; // Random speed for each particle

    speeds[_i] = 0.1 + Math.random() * 0.4;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
  geometry.setAttribute("offset", new THREE.BufferAttribute(offsets, 1));
  geometry.setAttribute("speed", new THREE.BufferAttribute(speeds, 1)); // Đơn giản hóa shader

  var material = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        value: 0
      },
      interactionIntensity: {
        value: 0
      }
    },
    vertexShader: "\n      attribute float size;\n      attribute vec3 color;\n      attribute float opacity;\n      attribute float offset;\n      attribute float speed;\n      \n      uniform float time;\n      uniform float interactionIntensity;\n      \n      varying vec3 vColor;\n      varying float vOpacity;\n      \n      void main() {\n        vColor = color;\n        vOpacity = opacity * (1.0 + interactionIntensity * 0.5);\n        \n        // Add subtle movement to particles\n        vec3 pos = position;\n        \n        // Simple noise based on time and offset\n        float noise = sin(time * speed + offset) * 0.02;\n        \n        // Apply noise perpendicular to the direction to the center\n        vec3 toCenter = normalize(vec3(0.0, 0.0, 0.0) - position);\n        vec3 perpendicular = normalize(cross(toCenter, vec3(0.0, 1.0, 0.0)));\n        \n        pos += perpendicular * noise * (1.0 + interactionIntensity * 0.3);\n        \n        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);\n        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + interactionIntensity * 0.3);\n        gl_Position = projectionMatrix * mvPosition;\n      }\n    ",
    fragmentShader: "\n      uniform float interactionIntensity;\n      varying vec3 vColor;\n      varying float vOpacity;\n      \n      void main() {\n        // Create a soft, glowing particle\n        float dist = length(gl_PointCoord - vec2(0.5));\n        if (dist > 0.5) discard;\n        \n        // Softer edge with custom falloff\n        float edge = smoothstep(0.5, 0.1, dist);\n        float finalOpacity = vOpacity * edge;\n        \n        // Enhance color with interaction\n        vec3 brightColor = vColor * (1.0 + interactionIntensity * 0.3);\n        \n        gl_FragColor = vec4(brightColor, finalOpacity);\n      }\n    ",
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var particles = new THREE.Points(geometry, material);
  group.add(particles); // Add a subtle volumetric light effect - đơn giản hóa

  var volumetricLightGeometry = new THREE.TubeGeometry(curve, 32, 0.02, 8, false);
  var volumetricLightMaterial = new THREE.ShaderMaterial({
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
      interactionIntensity: {
        value: 0
      }
    },
    vertexShader: "\n      varying vec3 vPosition;\n      varying vec2 vUv;\n      \n      void main() {\n        vPosition = position;\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n      }\n    ",
    fragmentShader: "\n      uniform float time;\n      uniform vec3 startColor;\n      uniform vec3 endColor;\n      uniform float interactionIntensity;\n      \n      varying vec3 vPosition;\n      varying vec2 vUv;\n      \n      void main() {\n        // Interpolate between start and end colors\n        vec3 color = mix(startColor, endColor, vUv.x);\n        \n        // Add subtle pulsing\n        float pulse = 0.7 + 0.3 * sin(time * 2.0 + vUv.x * 10.0);\n        \n        // Fade at edges\n        float edge = 1.0 - 2.0 * abs(vUv.y - 0.5);\n        edge = pow(edge, 2.0);\n        \n        // Enhance with interaction\n        float interactionEffect = 1.0 + interactionIntensity * 0.5;\n        color *= interactionEffect;\n        \n        float opacity = (0.05 + interactionIntensity * 0.03) * pulse * edge;\n        \n        gl_FragColor = vec4(color, opacity);\n      }\n    ",
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  var volumetricLight = new THREE.Mesh(volumetricLightGeometry, volumetricLightMaterial);
  group.add(volumetricLight);
  return group;
}; // Cập nhật animation cho kết nối


exports.createEtherealConnection = createEtherealConnection;

var updateEtherealConnection = function updateEtherealConnection(connection, time, interactionIntensity) {
  if (!connection) return;
  connection.traverse(function (child) {
    if (child.material && child.material.uniforms) {
      if (child.material.uniforms.time) {
        child.material.uniforms.time.value = time;
      }

      if (child.material.uniforms.interactionIntensity) {
        child.material.uniforms.interactionIntensity.value = interactionIntensity;
      }
    }
  });
};

exports.updateEtherealConnection = updateEtherealConnection;