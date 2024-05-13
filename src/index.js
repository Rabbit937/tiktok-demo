const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require("node:path")
const setting = require('./setting.json')

try {
	require('electron-reloader')(module);
} catch {
	console.log('hot reload error')
}


function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	ipcMain.on('set-start', (event, link) => {
		console.log(link)
	})


	mainWindow.loadFile('./public/index.html')
	mainWindow.setMenuBarVisibility(false)
	mainWindow.setAutoHideMenuBar(true)

}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})


