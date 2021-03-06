import { handleNewMessage } from "./chat";
import { handleDisconnected, handleNewUser } from "./notifications";
import { handleUpdatePlayer, handleUpdateRoom } from "./room";

let socket = null;

export const getSocket = () => socket;

export const initSockets = (aSocket) => {
  socket = aSocket;
  socket.on("newUser", handleNewUser);
  socket.on("disconnected", handleDisconnected);
  socket.on("newMsg", handleNewMessage);
  socket.on("updatePlayer", handleUpdatePlayer);
  socket.on("updateRoom", handleUpdateRoom);
};
