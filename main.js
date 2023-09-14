var os = require("os");
const { app, BrowserWindow, screen, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const electronLocalshortcut = require('electron-localshortcut');
const path = require("path");
const { dialog, shell } = require("electron");
const { electron } = require("process");

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

  if (app.isPackaged) {
    mainWindow.loadFile("updates/index.html");
  } else {
    mainWindow.loadFile("game/index.html");
  }

  mainWindow.webContents.on("new-window", function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  // Toggle Full Screen Mode
  electronLocalshortcut.register(mainWindow, 'F11', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
};

autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send("updateMessage", "Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
  mainWindow.webContents.send("updateMessage", "Update available.");
});

autoUpdater.on("update-not-available", (info) => {
  mainWindow.webContents.send("updateMessage", "Update not available.");
  mainWindow.loadFile("game/index.html");
});

autoUpdater.on("error", (err) => {
  mainWindow.webContents.send("updateMessage", "Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  mainWindow.webContents.send(
    "updateMessage",
    `Downloading update - ${Math.floor(progressObj.percent)}%` //  " (${progressObj.transferred}/${progressObj.total})`
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
