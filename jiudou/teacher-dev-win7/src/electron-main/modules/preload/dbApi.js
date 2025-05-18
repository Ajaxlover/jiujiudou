// @ts-ignore
const { ipcRenderer } = require('electron')
// @ts-ignore
const setUser = async (content) => {
    let result = await ipcRenderer.invoke('on-setUser-event', content)
}
const querySubject = async (content) => {
    let result = await ipcRenderer.invoke('on-subject-event', content)
}
module.exports = {
    setUser,
    querySubject,
};

