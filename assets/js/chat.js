import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

const appendMsg = (text, nickname, id) => {
  const li = document.createElement("li");
  console.log(getSocket());
  li.innerHTML = `
        <span class="author ${id !== getSocket().id ? "out" : "self"}">${
    id !== getSocket().id ? nickname : "You"
  }:</span> ${text}
    `;
  messages.appendChild(li);
};

const handleSendMsg = (event) => {
  event.preventDefault();
  const input = sendMsg.querySelector("input");
  const { value } = input;
  input.value = "";
  getSocket().emit("sendMsg", { message: value });
  // appendMsg(value); 두번 안되게!
};

export const handleNewMessage = ({ message, nickname, id }) =>
  appendMsg(message, nickname, id);

if (sendMsg) {
  sendMsg.addEventListener("submit", handleSendMsg);
}
