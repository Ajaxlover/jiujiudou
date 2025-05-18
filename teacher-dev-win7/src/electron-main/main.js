// @ts-ignore
const { InitController } = require("./modules/controller/main.js");
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const { createMainWindow } = require("./windows/mainWindows.js");
const { createLoginWindow } = require("./windows/loginWindows.js");
const { createLoadWindow } = require("./windows/loadWindows.js");
const { initTray } = require("./tray/index.js");
const { initShortCut, unInstallShortCut } = require("./shortcut/index");
const path = require("path");
const { exec } = require("child_process");
const {
  createUserInfoTable
} = require("./db-teacher/index.js");
const {
  openServerFile
} = require("./db-teacher/index-files.js");

app.whenReady().then(() => {
  // createMainWindow(BrowserWindow)
  // 在主进程中运行 Node.js 文件
  createLoadWindow(BrowserWindow);
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createLoginWindow(BrowserWindow);
  });
  createUserInfoTable()

  app.on('ready', () => {
    // exec(
    //   `node ${path.join(__dirname, "./db-teacher/index-files.js")}`,
    //   (err, stdout, stderr) => {
    //     if (err) {
    //       console.error(`文件服务: ${err}`);
    //       return;
    //     }
    //     console.log(`文件服务: ${stdout}`);
    //   }
    // );
    // exec(
    //   `node ${path.join(__dirname, "./db-teacher/index.js")}`,
    //   (err, stdout, stderr) => {
    //     if (err) {
    //       console.error(`建表服务: ${err}`);
    //       return;
    //     }
    //     console.log(`建表服务: ${stdout}`);
    //   }
    // );
    setTimeout(() => {
      openServerFile()
      exec(
        `node ${path.join(__dirname, "./db-teacher/index-serve.js")}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`接口服务: ${err}`);
            return;
          }
          console.log(`接口服务: ${stdout}`);
        }
      );
    }, 1000);
  });
  // 初始化监听事件
  InitController(app);
  // 初始化托盘
  initTray();
  // 初始化快捷键
  initShortCut();
});


// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
// 客户端聚焦
app.on("browser-window-focus", () => {
  // 初始化快捷键
  initShortCut();
  // console.log("browser-window-focus");
});
// 客户端失去焦点
app.on("browser-window-blur", () => {
  // 注销快捷键
  unInstallShortCut();
  // console.log("browser-window-blur");
});
app.on("will-quit", () => {
  // 注销快捷键
  unInstallShortCut();
});