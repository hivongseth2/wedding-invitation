"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Quản lý tương tác giữa các cửa sổ
var InteractionManager =
/*#__PURE__*/
function () {
  function InteractionManager(socket, clientId, tabId) {
    _classCallCheck(this, InteractionManager);

    this.socket = socket;
    this.clientId = clientId;
    this.tabId = tabId;
    this.interactionState = {
      isActive: false,
      intensity: 0,
      lastBroadcast: 0
    };
    this.peerInteractions = {}; // Thiết lập socket listeners

    this.setupSocketListeners();
  }

  _createClass(InteractionManager, [{
    key: "setupSocketListeners",
    value: function setupSocketListeners() {
      var _this = this;

      // Nhận tương tác từ các peer khác
      this.socket.on("peer-interaction", function (data) {
        var id = "".concat(data.clientId, "-").concat(data.tabId); // Không xử lý tương tác từ chính mình

        if (data.clientId === _this.clientId && data.tabId === _this.tabId) return; // Cập nhật trạng thái tương tác của peer

        _this.peerInteractions[id] = {
          intensity: data.intensity,
          timestamp: Date.now()
        };
      });
    } // Cập nhật trạng thái tương tác cục bộ

  }, {
    key: "updateLocalInteraction",
    value: function updateLocalInteraction(isActive) {
      this.interactionState.isActive = isActive; // Cập nhật cường độ tương tác với hiệu ứng mượt mà

      if (isActive) {
        this.interactionState.intensity = Math.min(1.0, this.interactionState.intensity + 0.05);
      } else {
        this.interactionState.intensity = Math.max(0.0, this.interactionState.intensity - 0.03);
      } // Broadcast tương tác nếu có thay đổi đáng kể


      this.broadcastInteractionIfNeeded();
      return this.interactionState.intensity;
    } // Broadcast trạng thái tương tác đến các peer khác

  }, {
    key: "broadcastInteractionIfNeeded",
    value: function broadcastInteractionIfNeeded() {
      var now = Date.now(); // Chỉ broadcast mỗi 100ms để tránh quá tải

      if (now - this.interactionState.lastBroadcast > 100) {
        this.socket.emit("interaction", {
          clientId: this.clientId,
          tabId: this.tabId,
          intensity: this.interactionState.intensity
        });
        this.interactionState.lastBroadcast = now;
      }
    } // Lấy cường độ tương tác tổng hợp từ tất cả các peer

  }, {
    key: "getAggregateInteractionIntensity",
    value: function getAggregateInteractionIntensity() {
      var _this2 = this;

      // Bắt đầu với cường độ tương tác cục bộ
      var maxIntensity = this.interactionState.intensity; // Kiểm tra tương tác từ các peer khác

      var now = Date.now();
      Object.entries(this.peerInteractions).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            id = _ref2[0],
            interaction = _ref2[1];

        // Chỉ xem xét các tương tác trong 2 giây gần đây
        if (now - interaction.timestamp < 2000) {
          // Lấy cường độ cao nhất từ tất cả các nguồn
          maxIntensity = Math.max(maxIntensity, interaction.intensity);
        } else {
          // Xóa các tương tác cũ
          delete _this2.peerInteractions[id];
        }
      });
      return maxIntensity;
    } // Xóa tất cả listeners khi hủy

  }, {
    key: "cleanup",
    value: function cleanup() {
      this.socket.off("peer-interaction");
    }
  }]);

  return InteractionManager;
}();

var _default = InteractionManager;
exports["default"] = _default;