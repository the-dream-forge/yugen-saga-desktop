var os = require("os");
const { app, BrowserWindow, screen, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { dialog } = require("electron");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "Yugen Saga",
    icon: "build/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("game/index.html");
};

autoUpdater.on("checking-for-update", () => {
  dialog.showMessageBox({ message: "Checking for update..." });
});
autoUpdater.on("update-available", (info) => {
  dialog.showMessageBox({ message: "Update available." });
});
autoUpdater.on("update-not-available", (info) => {
  dialog.showMessageBox({ message: "Update not available." });
});
autoUpdater.on("error", (err) => {
  dialog.showMessageBox({ message: "Error in auto-updater. " + err });
});

autoUpdater.on("update-downloaded", (info) => {
  dialog.showMessageBox({ message: "Update downloaded" });
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  app.quit();
});
