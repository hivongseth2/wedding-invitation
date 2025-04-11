"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("socket.io"),
    Server = _require.Server; // Create Socket.IO server


var io = new Server(3001, {
  cors: {
    origin: "*"
  },
  pingTimeout: 10000,
  pingInterval: 2000
});
var clients = {}; // clientId: { id, tabs: { [tabId]: socketId }, ... }

io.on("connection", function (socket) {
  socket.on("join", function (_ref) {
    var clientId = _ref.clientId,
        tabId = _ref.tabId;

    if (!clients[clientId]) {
      clients[clientId] = {
        id: clientId,
        tabs: {},
        lastSeen: Date.now()
      };
    }

    clients[clientId].tabs[tabId] = socket.id;
    clients[clientId].lastSeen = Date.now();
    console.log("\uD83E\uDDE0 Client ".concat(clientId, " joined from tab ").concat(tabId)); // Gửi peer data cho socket này thôi

    socket.emit("peer-count", Object.keys(clients).length);
    socket.emit("peers", Object.entries(clients).flatMap(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          clientId = _ref3[0],
          client = _ref3[1];

      return Object.entries(client.tabs).map(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 1),
            tabId = _ref5[0];

        return {
          clientId: clientId,
          tabId: tabId
        };
      });
    })); // Thông báo peer mới cho các tab khác

    socket.broadcast.emit("peer-joined", {
      id: clientId
    });
  });
  socket.on("disconnect", function () {
    var client = Object.values(clients).find(function (c) {
      return Object.values(c.tabs).includes(socket.id);
    });

    if (client) {
      var tabId = Object.keys(client.tabs).find(function (tid) {
        return client.tabs[tid] === socket.id;
      });

      if (tabId) {
        delete client.tabs[tabId];
        console.log("\u274C Tab ".concat(tabId, " of client ").concat(client.id, " disconnected"));

        if (Object.keys(client.tabs).length === 0) {
          delete clients[client.id];
          io.emit("peer-left", {
            id: client.id
          });
        }

        io.emit("peer-count", Object.keys(clients).length);
        io.emit("peers", getAllPeers());
      }
    }
  });
});

function getAllPeers() {
  return Object.entries(clients).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        id = _ref7[0],
        tabs = _ref7[1].tabs;

    return {
      id: id,
      tabs: Object.keys(tabs)
    };
  });
}

function getAllPeersExcluding(clientId, tabId) {
  var result = [];

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        id = _Object$entries$_i[0],
        client = _Object$entries$_i[1];

    if (id === clientId) {
      // Nếu là chính mình → loại tab này ra
      var otherTabs = Object.entries(client.tabs).filter(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 1),
            tid = _ref9[0];

        return tid !== tabId;
      }).map(function (_ref10) {
        var _ref11 = _slicedToArray(_ref10, 2),
            tid = _ref11[0],
            sid = _ref11[1];

        return {
          id: id,
          tabId: tid
        };
      });
      result.push.apply(result, _toConsumableArray(otherTabs));
    } else {
      // Nếu là người khác → thêm tất cả tab
      var tabs = Object.keys(client.tabs).map(function (tid) {
        return {
          id: id,
          tabId: tid
        };
      });
      result.push.apply(result, _toConsumableArray(tabs));
    }
  };

  for (var _i2 = 0, _Object$entries = Object.entries(clients); _i2 < _Object$entries.length; _i2++) {
    _loop();
  }

  return result;
}