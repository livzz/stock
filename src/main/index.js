/* eslint-disable no-new */
'use strict';

import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let mainWindow;

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

// // Url for Edit entry
// const editEntryURL =
//   process.env.NODE_ENV === 'development'
//     ? `http://localhost:9080/#/editSales`
//     : `file://${__dirname}/index.html#editSales`;

const urlGenerator = url =>
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/${url}`
    : `file://${__dirname}/index.html#${url}`;

function createWindow() {
  /**
   * Initial window options
   */
  const menu = new Menu()
  
  menu.append(new MenuItem({
    label: 'Print',
    accelerator: 'CmdOrCtrl+P',
    click: () => { console.log('time to print stuff') }
  }));
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    show: false,
    minWidth: 1050
  });



  mainWindow.setMenu(menu);
  mainWindow.loadURL(winURL);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

app.on('ready', createWindow);

const showUrl = (url, dev) => {
  return (e, data) => {
    let win = new BrowserWindow({
      width: 1050,
      height: 500,
      show: false
    });
    win.on('close', function() {
      win = null;
    });
    if (dev) {
      win.openDevTools();
    }
    win.setMenu(null);
    win.loadURL(url);
    win.show();
    win.webContents.on('did-finish-load', function() {
      win.webContents.send('message', data);
    });
  };
};

// Electon will listen to event and on receiving the event it will open new window with the given url
ipcMain.on('showPrint', showUrl(urlGenerator('print')));
// Electon will listen to event and on receiving the event it will open new window with the given url
ipcMain.on('editSales', showUrl(urlGenerator('editSales')));
// Electon will listen to event and on receiving the event it will open new window with the given url
ipcMain.on('editPurchase', showUrl(urlGenerator('editPurchase')));
// Electon will listen to event and on receiving the event it will open new window with the given url
ipcMain.on('editStock', showUrl(urlGenerator('editStock')));
ipcMain.on('editcreditnote', showUrl(urlGenerator('editcreditnote')));
ipcMain.on('editdebitnote', showUrl(urlGenerator('editdebitnote')));
ipcMain.on('editdelivery', showUrl(urlGenerator('editdelivery')));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
