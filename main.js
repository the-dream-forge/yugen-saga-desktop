var os = require("os");
const { app, BrowserWindow, screen, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { dialog } = require("electron");

autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "Yugen Saga",
    icon: "build/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !app.isPackaged,

      // Need this to update the status of the update screen.
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  Menu.setApplicationMenu(null);

  //if (app.isPackaged) {
  mainWindow.loadFile("updates/index.html");
  //} else {
  //  mainWindow.loadFile("game/index.html");
  //}
};

autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send("updateMessage", "Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
  mainWindow.webContents.send("updateMessage", "Update available.");
});

autoUpdater.on("update-not-available", (info) => {
  mainWindow.webContents.send("updateMessage", "Update not available.");
});

autoUpdater.on("error", (err) => {
  mainWindow.webContents.send("updateMessage", "Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  mainWindow.webContents.send(
    "updateMessage",
    `Downloading update - ${progressObj.percent}% " (${progressObj.transferred}/${progressObj.total})`
  );
});

autoUpdater.on("update-downloaded", (info) => {
  mainWindow.webContents.send(
    "updateMessage",
    "Update downloaded. Please relaunch Yugen Saga to update the client."
  );

  dialog.showMessageBox({
    message: "Click OK to relaunch Yugen Saga.",
  });

  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
