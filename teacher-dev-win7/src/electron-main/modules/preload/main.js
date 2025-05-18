const { contextBridge, ipcRenderer } = require("electron");
const dbApi = require("./dbApi");
const setTitle = async (title) => {
  let result = await ipcRenderer.invoke("on-settitle-event", title);
};
// 浏览器打开页面
const openByBrowser = (url) => {
  ipcRenderer.invoke("on-useOpenByBrowser-event", url);
};
// 页面全屏 缩小 关闭
const setScreen = (value) => {
  ipcRenderer.invoke("on-setScreen-event", value);
};
const setUser = (content) => {
  ipcRenderer.invoke("on-setUser-event", content);
};
const querySubject = (content) => {
  const res = ipcRenderer.invoke("on-subject-event", content);
  return res;
};
const openRestPassword = async (content) => {
  let result = await ipcRenderer.invoke("on-openRestPassword-event", content);
  return result;
};
contextBridge.exposeInMainWorld("electronAPI", {
  setTitle,
  openByBrowser,
  setScreen,
  setUser,
  querySubject,
  openRestPassword,
  ipcRenderer: { ...ipcRenderer, on: ipcRenderer.on.bind(ipcRenderer) },
});
