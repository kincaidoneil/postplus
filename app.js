'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// For OS X, stay active until the user quits explicitly with Cmd + Q.
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// Create the browser windows.
app.on('ready', function() {
	// Create the browser window hidden, maximize it, then show it...
	// ...because unfortunately, Atom doesn't offer a 'maximize' property when you initalize it
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		show: false,
		autoHideMenuBar: true
	});
	mainWindow.maximize();
	mainWindow.show();
	// Load index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// If your app supports multi windows (typically stored in an array), delete the corresponding element.
		mainWindow = null;
	});
});
