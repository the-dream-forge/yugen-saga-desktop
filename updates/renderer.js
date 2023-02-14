const { ipcRenderer } = require("electron");

ipcRenderer.on("updateMessage", (event, message) => {
  console.log("!!");
  document.getElementById("message").innerText = message;
});
