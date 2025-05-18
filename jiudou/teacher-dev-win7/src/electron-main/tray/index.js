const { app, Menu, Tray, nativeImage, BrowserWindow } = require('electron')
const path = require('path')
let appIcon = null
const initTray = () => {
    const iconPath = path.join(__dirname, '/icone.ico').replace('/\\/g', '\\\\');
    appIcon = new Tray(nativeImage.createFromPath(iconPath))
    appIcon.setToolTip('九斗考试系统')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出', type: 'radio', click: () => {
                app.quit()
            }
        },
        // {
        //     label: '返回登录页', type: 'radio', click: () => {

        //     }
        // }
    ])

    // Make a change to the context menu
    contextMenu.items[0].checked = false

    // Call this again for Linux because we modified the context menu



    appIcon.setContextMenu(contextMenu)
}

module.exports = {
    initTray
}
