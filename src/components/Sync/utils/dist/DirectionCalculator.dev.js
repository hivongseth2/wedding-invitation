"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findClosestWindowInDirection = exports.calculateWindowDirection = void 0;

// Tính toán hướng giữa hai cửa sổ
var calculateWindowDirection = function calculateWindowDirection(sourceWindow, targetWindow) {
  // Tính toán tâm của cửa sổ nguồn
  var sourceCenter = {
    x: sourceWindow.shape.x + sourceWindow.shape.w / 2,
    y: sourceWindow.shape.y + sourceWindow.shape.h / 2
  }; // Tính toán tâm của cửa sổ đích

  var targetCenter = {
    x: targetWindow.shape.x + targetWindow.shape.w / 2,
    y: targetWindow.shape.y + targetWindow.shape.h / 2
  }; // Tính vector hướng từ nguồn đến đích

  var direction = {
    x: targetCenter.x - sourceCenter.x,
    y: targetCenter.y - sourceCenter.y
  };
  return direction;
}; // Tìm cửa sổ gần nhất theo hướng


exports.calculateWindowDirection = calculateWindowDirection;

var findClosestWindowInDirection = function findClosestWindowInDirection(windows, sourceWindow, direction) {
  if (!windows || windows.length <= 1) return null;
  var bestMatch = null;
  var bestScore = Number.NEGATIVE_INFINITY; // Chuẩn hóa vector hướng

  var dirLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
  var normalizedDir = {
    x: direction.x / dirLength,
    y: direction.y / dirLength
  };
  windows.forEach(function (win) {
    // Bỏ qua cửa sổ nguồn
    if (win.id === sourceWindow.id) return; // Tính vector từ cửa sổ nguồn đến cửa sổ đích

    var windowVector = calculateWindowDirection(sourceWindow, win); // Chuẩn hóa vector

    var winVecLength = Math.sqrt(windowVector.x * windowVector.x + windowVector.y * windowVector.y);
    var normalizedWinVec = {
      x: windowVector.x / winVecLength,
      y: windowVector.y / winVecLength
    }; // Tính độ tương đồng giữa hai hướng (dot product)

    var dotProduct = normalizedDir.x * normalizedWinVec.x + normalizedDir.y * normalizedWinVec.y; // Nếu góc giữa hai vector nhỏ (dot product lớn), đây là ứng viên tốt

    if (dotProduct > 0.7) {
      // Góc nhỏ hơn khoảng 45 độ
      var score = dotProduct - winVecLength / 5000; // Ưu tiên cửa sổ gần hơn

      if (score > bestScore) {
        bestScore = score;
        bestMatch = win;
      }
    }
  });
  return bestMatch;
};

exports.findClosestWindowInDirection = findClosestWindowInDirection;