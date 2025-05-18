// @ts-ignore
const { contextBridge, ipcRenderer } = require("electron");

// @ts-ignore
const setLogin = async (content) => {
  let result = await ipcRenderer.invoke("on-setlogin-event", content);
};
const setClose = async (content) => {
  let result = await ipcRenderer.invoke("on-setScreen-event", content);
};
const openRegister = async (content) => {
  let result = await ipcRenderer.invoke("on-openRegister-event", content);
};
const openRestPassword = async (content) => {
  let result = await ipcRenderer.invoke("on-openRestPassword-event", content);
  return result;
};
// 页面全屏 缩小 关闭
const setScreen = (value) => {
  ipcRenderer.invoke("on-setScreen-event", value);
};

const dropTable = () => {
  ipcRenderer.invoke("on-dropTable-event");
};

const queryLocalIP = async () => {
  let result = await ipcRenderer.invoke("on-getIp-event");
  return result;
};

const openFolder = async (value) => {
  console.log(value, "folder path");
  ipcRenderer.invoke("on-openFolder-event", value);
};

const saveFileOnline = async (value) => {
  ipcRenderer.invoke("on-uploadFile-event", value);
};
contextBridge.exposeInMainWorld("electronAPI", {
  openRestPassword,
  openRegister,
  setScreen,
  setLogin,
  setClose,
  queryLocalIP,
  openFolder,
  dropTable,
  saveFileOnline,
  ipcRenderer,
});
