import { getSocket } from "./sockets";

const clients = document.getElementById("jsClients");
const rooms = document.getElementById("jsRooms");
const addRoom = document.getElementById("jsAddRoom");

const updateClients = (client_list) => {
  while (clients.hasChildNodes()) {
    clients.removeChild(clients.firstChild);
  }
  client_list.forEach((nickname) => {
    const li = document.createElement("li");
    li.innerHTML = `${nickname}`;
    clients.appendChild(li);
  });
};

const updateRooms = (room_list) => {
  while (rooms.hasChildNodes()) {
    rooms.removeChild(rooms.firstChild);
  }
  room_list.forEach((roomId) => {
    const li = document.createElement("li");
    li.innerHTML = `${roomId}`;
    rooms.appendChild(li);
  });
};

const handleAddRoom = (event) => {
  event.preventDefault();
  const input = addRoom.querySelector("input");
  const { value } = input;
  input.value = "";
  getSocket().emit("addRoom", { message: value });
};

export const handleUpdateRoom = ({ room_info }) => {
  let room_list = [];
  for (const key in room_info) {
    room_list.push(room_info[key].roomId);
  }
  updateRooms(room_list);
};

export const handleUpdatePlayer = ({ sockets }) => {
  let client_list = [];
  for (const key in sockets) {
    client_list.push(sockets[key].nickname);
  }
  updateClients(client_list);
};

if (addRoom) {
  addRoom.addEventListener("submit", handleAddRoom);
}
