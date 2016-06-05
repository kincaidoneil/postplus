import electron from 'electron'
const app = electron.app

import configStore from 'configstore'
const config = new configStore('postplus')

import _merge from 'lodash/merge'

app.on('window-all-closed', () => app.quit())

app.on('ready', () => {
	// Create default options
	let options = {
		width: 1280,
		height: 720,
		show: false,
		autoHideMenuBar: true,
		maximize: true // Only for reference; not actually recognized by Electron
	}
	// Overwrite defaults by merging saved objects
	let saved = config.get('window')
	_merge(options, saved)
	// Actually create the browser window!
	let mainWindow = new electron.BrowserWindow(options)
	// Maximize the window before it's shown
	if (options.maximize) mainWindow.maximize()
	// Load index.html of the app
	// Use dirname due to Webpack bug (refer to the config for more info)
	mainWindow.loadURL(`file://${dirname}/index.html`)
	// Regardless of whether its maximized, show window after URL is loaded
	mainWindow.show()
	// When the window is resized/moved, cache the bounds to save prefs later
	// If it's maximized, don't save them: the bounds get screwed up
	// If the user closes the app while maximized, reopens it, and then resizes
	// the window, it should show up as the original size before it was maximized
	let updateBounds = () => {
		if (!mainWindow.isMaximized()) _merge(options, mainWindow.getBounds())
	}
	mainWindow.on('resize', updateBounds)
	mainWindow.on('move', updateBounds)
	// Update maximizataion when window state changes to be saved later because
	// isMaximized() isn't true if the window was maximized and then minimized
	mainWindow.on('maximize', () => options.maximize = true)
	mainWindow.on('unmaximize', () => options.maximize = false)
	// Before the window is closed, save preferences
	mainWindow.on('close', () => config.set('window', options))
	// Window object MUST be deleted within 'closed' handler to prevent lifecycle error
	mainWindow.on('closed', () => mainWindow = null)
})
