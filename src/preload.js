const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    setLink: (link) => ipcRenderer.send('set-start', link)
})