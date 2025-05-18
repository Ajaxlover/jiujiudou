// @ts-ignore
const { app, ipcMain, BrowserWindow, shell, dialog } = require("electron");
const { createMainWindow } = require("../../windows/mainWindows.js");
const { createLoginWindow } = require("../../windows/loginWindows");
const { createRegisterWindow } = require("../../windows/registerWindows");
const {
  createResetPasswordWindow,
} = require("../../windows/resetPasswordWindows");
const {
  dropUserInfoTable,
  createUserInfoTable,
} = require("./../../db-teacher/index.js");
const {
  openServer,
  closeServer,
} = require("./../../db-teacher/index-serve.js");
const isDev = require("electron-is-dev");

const os = require("os");
const path = require("path");
const fs = require("fs");

const settitle = () => {
  // @ts-ignore
  ipcMain.handle("on-settitle-event", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
    return "已收到";
  });
};
// 浏览器打开页面
const openByBrowser = () => {
  // @ts-ignore
  ipcMain.handle("on-useOpenByBrowser-event", (event, url) => {
    shell.openExternal(url);
  });
};
// 登录 展示首页
const setlogin = () => {
  // @ts-ignore
  ipcMain.handle("on-setlogin-event", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
    createMainWindow(BrowserWindow);
    return "已经登录";
  });
};
// 加载页判断登录或者展示首页
const isShowLogin = () => {
  // @ts-ignore
  ipcMain.handle("on-isshowlogin-event", (event, value) => {
    if (value) {
      setTimeout(() => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.close();
        createLoginWindow(BrowserWindow);
      }, 3000);
    } else {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents);
      win.close();
      createMainWindow(BrowserWindow);
    }

    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win.close()
    // createMainWindow(BrowserWindow)
    return "";
  });
};
// 首页屏幕缩小 放大 关闭控制
const setScreen = () => {
  // @ts-ignore
  ipcMain.handle("on-setScreen-event", (event, value) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (value === "miniScreen") {
      win.minimize();
    } else if (value === "fullScreen") {
      console.log("win.isMaximized", win.isMaximized());
      if (win.isMaximized()) {
        win.restore();
      } else {
        win.maximize();
      }
    } else if (value === "closeScreen") {
      win.close();
      // createLoginWindow(BrowserWindow)
    } else if (value === "backLogin") {
      win.close();
      createLoginWindow(BrowserWindow);
    }
    return "";
  });
};
// 打开注册页面
const openRegister = () => {
  // @ts-ignore
  ipcMain.handle("on-openRegister-event", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
    createRegisterWindow(BrowserWindow);
    return "打开注册页面";
  });
};
// 注册成功
const setRegister = () => {
  // @ts-ignore
  ipcMain.handle("on-register-event", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
    createLoginWindow(BrowserWindow);
    return "返回登录页面";
  });
};
// 重置密码后返回登录页面
const setBackLogin = () => {
  // @ts-ignore
  ipcMain.handle("on-backLogin-event", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
    createLoginWindow(BrowserWindow);
    return "重置密码后返回登录页面";
  });
};
// 打开重置密码
const openRestPassword = () => {
  // @ts-ignore
  ipcMain.handle("on-openRestPassword-event", (event, title) => {
    if (title) {
      openServer();
    } else {
      closeServer();
    }
  });
};

const setUser = () => {
  // @ts-ignore
  ipcMain.handle("on-setUser-event", (event, params) => {
    const res = inertUserInfoTable(params);
    return res;
  });
};
const querySubject = () => {
  // @ts-ignore
  ipcMain.handle("on-subject-event", (event, params) => {
    const res = getTest(params);
    return res;
  });
};
const openFolder = () => {
  // @ts-ignore
  ipcMain.handle("on-openFolder-event", (event, params) => {
    console.log(params.exam_name, "监控文件");
    // const folderPath = path.join(__dirname, './../monitor'); // 替换为您想要打开的文件夹的路径
    const folderPath =
      app.getAppPath().split("resources")[0] +
      (isDev ? "\\monitor" : "monitor");
    console.log(folderPath);
    fs.access(folderPath, fs.constants.F_OK, (err) => {
      if (err) {
        dialog.showMessageBox({
          title: "监控文件查看",
          message: "你目前的考试中暂无监控文件",
          buttons: ["确定"],
        }); // 文件夹不存在
      } else {
        event.returnValue = true; // 文件夹存在
        shell
          .openPath(folderPath)
          .then(() => {
            console.log("Folder opened successfully");
          })
          .catch((error) => {
            dialog.showMessageBox({
              title: "监控文件查看",
              message: "你目前的考试中暂无监控文件",
              buttons: ["确定"],
            });
            console.error("Error opening folder:", error);
          });
      }
    });
  });
};
//删除表格
const dropTable = () => {
  // @ts-ignore
  ipcMain.handle("on-dropTable-event", (event, params) => {
    dropUserInfoTable();
    setTimeout(() => {
      createUserInfoTable();
    }, 3000);
  });
};
const queryLocalIP = () => {
  // @ts-ignore
  ipcMain.handle("on-getIp-event", (event, params) => {
    // 获取本机IP地址
    const ip = getLocalIP();
    return ip;
  });
};
const localstorage = require('electron-localstorage');

const saveFileOnline = () => {
  // @ts-ignore
  ipcMain.handle("on-uploadFile-event", (event, params) => {
    localstorage.setItem('uploadFileOnline', params);
    return 'save';
  });
};

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  let ip = null;

  for (const key in networkInterfaces) {
    if (networkInterfaces.hasOwnProperty(key)) {
      const interfaces = networkInterfaces[key];
      for (const item of interfaces) {
        if (item.family === "IPv4" && !item.internal) {
          ip = item.address;
          break;
        }
      }
    }
    if (ip) break;
  }

  return ip;
}
const InitController = (app) => {
  openRestPassword(),
    setBackLogin(),
    openRegister(),
    setRegister(),
    settitle(),
    openByBrowser(),
    setlogin(),
    isShowLogin(),
    setScreen(),
    setUser(),
    querySubject(),
    openFolder(),
    queryLocalIP(),
    saveFileOnline(),
    dropTable();
};

module.exports = {
  InitController,
};
