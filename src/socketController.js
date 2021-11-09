let sockets = [];
const socketController = (socket, io) => {
  socket.on("login", ({ nickname }) => {
    socket.nickname = nickname;
    socket.broadcast.emit("newUser", { nickname });
    sockets.push({ id: socket.id, nickname: nickname });
    io.emit("updatePlayer", { sockets });
  });

  socket.on("disconnect", () => {
    sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
    socket.broadcast.emit("disconnected", { nickname: socket.nickname });
    io.emit("updatePlayer", { sockets });
  });

  socket.on("sendMsg", ({ message }) =>
    socket.broadcast.emit("newMsg", { message, nickname: socket.nickname })
  );
};

export default socketController;
