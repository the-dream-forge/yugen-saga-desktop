var os = require("os");
const { app, BrowserWindow, screen, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "Yugen Saga",
    icon: "build/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //devTools: !app.isPackaged,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("game/index.html");
};

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  app.quit();
});
