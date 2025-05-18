// @ts-ignore
const { LOAD_URL } = require("./config.js");
const path = require("path");
const isDev = require("electron-is-dev");
// const { execFile } = require('child_process');
// //客户端尺寸位置记忆插件
// const windowStateKeeper = require('electron-window-state');
const loginWinURL = isDev
  ? `http://localhost:5000/#/login`
  : `${LOAD_URL}#login`;

const createLoginWindow = (BrowserWindow) => {
  // // 默认窗口尺寸
  // let mainWindowState = windowStateKeeper({
  //     defaultWidth: 826,
  //     defaultHeight: 528
  // });
  const win = new BrowserWindow({
    // 'x': mainWindowState.x,
    // 'y': mainWindowState.y,
    width: 1600,
    height: 900,
    transparent: false,
    backgroundColor: "#00000000",
    focusable: true,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true,
      // 渲染器进程到主进程通信 定义预加载的界面ts
      preload: path.resolve(__dirname, "../modules/preload/login.js"),
    },
  });
  // 加载页面地址 线上内网可切换地址
  win.loadURL(loginWinURL);
  // execFile('node', [path.join(__dirname, './../db-teacher/index-files.js')], (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`文件服务: ${error}`);
  //     return;
  //   }
  //   console.log(`文件服务: ${stdout}`);
  // });
  // // 管理客户端尺寸位置记忆插件
  // mainWindowState.manage(win);
  // 开发者工具
  if (isDev) {
    win.webContents.openDevTools();
  }
  // 优雅打开界面
  win.on("ready-to-show", () => {
    win.show();
  });
};

module.exports = {
  createLoginWindow,
};
