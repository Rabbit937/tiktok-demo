const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
	setlink: (link) => ipcRenderer.send("set-link", link),
});
