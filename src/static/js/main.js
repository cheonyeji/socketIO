(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewMessage = void 0;

var _sockets = require("./sockets");

var messages = document.getElementById("jsMessages");
var sendMsg = document.getElementById("jsSendMsg");

var appendMsg = function appendMsg(text, nickname, id) {
  var li = document.createElement("li");
  console.log((0, _sockets.getSocket)());
  li.innerHTML = "\n        <span class=\"author ".concat(id !== (0, _sockets.getSocket)().id ? "out" : "self", "\">").concat(id !== (0, _sockets.getSocket)().id ? nickname : "You", ":</span> ").concat(text, "\n    ");
  messages.appendChild(li);
};

var handleSendMsg = function handleSendMsg(event) {
  event.preventDefault();
  var input = sendMsg.querySelector("input");
  var value = input.value;
  input.value = "";
  (0, _sockets.getSocket)().emit("sendMsg", {
    message: value
  }); // appendMsg(value); 두번 안되게!
};

var handleNewMessage = function handleNewMessage(_ref) {
  var message = _ref.message,
      nickname = _ref.nickname,
      id = _ref.id;
  return appendMsg(message, nickname, id);
};

exports.handleNewMessage = handleNewMessage;

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}

},{"./sockets":6}],2:[function(require,module,exports){
"use strict";

var _sockets = require("./sockets");

var body = document.querySelector("body");
var loginForm = document.getElementById("jsLogin");
var NICKNAME = "nickname";
var LOGGED_OUT = "loggedOut";
var LOGGED_IN = "loggedIn";
var nickname = localStorage.getItem(NICKNAME);

var logIn = function logIn(nickname) {
  var socket = io("/");
  socket.emit("login", {
    nickname: nickname
  });
  (0, _sockets.initSockets)(socket);
};

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  logIn(nickname);
}

var handleFormSubmit = function handleFormSubmit(e) {
  e.preventDefault();
  var input = loginForm.querySelector("input");
  var value = input.value; // input.value와 동일

  input.value = "";
  localStorage.setItem(NICKNAME, value);
  body.className = LOGGED_IN;
  logIn(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}

},{"./sockets":6}],3:[function(require,module,exports){
"use strict";

require("./chat");

require("./login");

require("./sockets");

},{"./chat":1,"./login":2,"./sockets":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNewUser = exports.handleDisconnected = void 0;
var body = document.querySelector("body");

var fireNotification = function fireNotification(text, color) {
  var notification = document.createElement("div");
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  body.appendChild(notification);
};

var handleNewUser = function handleNewUser(_ref) {
  var nickname = _ref.nickname;
  return fireNotification("".concat(nickname, " just joined!"), "rgb(0, 122, 255)");
};

exports.handleNewUser = handleNewUser;

var handleDisconnected = function handleDisconnected(_ref2) {
  var nickname = _ref2.nickname;
  return fireNotification("".concat(nickname, " just left!"), "rgb(255, 149, 0)");
};

exports.handleDisconnected = handleDisconnected;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateRoom = exports.handleUpdatePlayer = void 0;

var _sockets = require("./sockets");

var clients = document.getElementById("jsClients");
var rooms = document.getElementById("jsRooms");
var addRoom = document.getElementById("jsAddRoom");
var roomWrapper = document.querySelector(".room");
var messages = document.getElementById("jsMessages");

var updateClients = function updateClients(client_list) {
  while (clients.hasChildNodes()) {
    clients.removeChild(clients.firstChild);
  }

  client_list.forEach(function (nickname) {
    var li = document.createElement("li");
    li.innerHTML = "".concat(nickname);
    clients.appendChild(li);
  });
};

var handleRoomClick = function handleRoomClick(roomId) {
  if (confirm("".concat(roomId, "\uC73C\uB85C \uC811\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"))) {
    // 예 버튼 클릭시
    (0, _sockets.getSocket)().emit("enterRoom", {
      roomId: roomId
    });
    roomWrapper.classList.add("joined");

    while (messages.hasChildNodes()) {
      messages.removeChild(messages.firstChild);
    }
  } else {
    console.log("접속x");
  }
};

var updateRooms = function updateRooms(room_list) {
  while (rooms.hasChildNodes()) {
    rooms.removeChild(rooms.firstChild);
  }

  room_list.forEach(function (roomId) {
    var li = document.createElement("li");
    li.innerHTML = "".concat(roomId);
    li.addEventListener("click", function () {
      handleRoomClick(roomId);
    });
    rooms.appendChild(li);
  });
};

var handleAddRoom = function handleAddRoom(event) {
  event.preventDefault();
  var input = addRoom.querySelector("input");
  var value = input.value;
  input.value = "";
  (0, _sockets.getSocket)().emit("addRoom", {
    message: value
  });
};

var handleUpdateRoom = function handleUpdateRoom(_ref) {
  var room_info = _ref.room_info;
  var room_list = [];

  for (var key in room_info) {
    room_list.push(room_info[key].roomId);
  }

  updateRooms(room_list);
};

exports.handleUpdateRoom = handleUpdateRoom;

var handleUpdatePlayer = function handleUpdatePlayer(_ref2) {
  var sockets = _ref2.sockets;
  var client_list = [];

  for (var key in sockets) {
    client_list.push(sockets[key].nickname);
  }

  updateClients(client_list);
};

exports.handleUpdatePlayer = handleUpdatePlayer;

if (addRoom) {
  addRoom.addEventListener("submit", handleAddRoom);
}

},{"./sockets":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSockets = exports.getSocket = void 0;

var _chat = require("./chat");

var _notifications = require("./notifications");

var _room = require("./room");

var socket = null;

var getSocket = function getSocket() {
  return socket;
};

exports.getSocket = getSocket;

var initSockets = function initSockets(aSocket) {
  socket = aSocket;
  socket.on("newUser", _notifications.handleNewUser);
  socket.on("disconnected", _notifications.handleDisconnected);
  socket.on("newMsg", _chat.handleNewMessage);
  socket.on("updatePlayer", _room.handleUpdatePlayer);
  socket.on("updateRoom", _room.handleUpdateRoom);
};

exports.initSockets = initSockets;

},{"./chat":1,"./notifications":4,"./room":5}]},{},[3]);
