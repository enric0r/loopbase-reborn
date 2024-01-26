'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { search, downloadMP3 } from './loopermanData';
import * as fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';
const { shell } = require('electron')
const isDevelopment = process.env.NODE_ENV !== 'production'

const pref = {
    dir : {
        content: homedir() + "\\loopbaseContent"
    }
}


function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        // titleBarStyle: 'hidden',
        trafficLightPosition: {x: 21, y: 18},
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
  }
    win.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const { requestHeaders } = details;
        UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
        UpsertKeyValue(requestHeaders, 'Referer', "https://www.looperman.com");
        callback({ requestHeaders });
      },
    );
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const { responseHeaders } = details;
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
      callback({
        responseHeaders,
      });
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

async function fileExists(path){
  return new Promise((resolve, reject) => {
      try {
          if(fs.existsSync(path)) resolve(true);
          else resolve(false);
      } catch {
          reject();
      }
  })
}

async function fileDelete(path){
  return new Promise((resolve, reject) => {
      try {
          fs.unlinkSync(path);
          resolve();
      } catch (err) {
          reject(err);
      }
  })
}

ipcMain.handle('search', async (event, args) => {
    return await search(args);
});

ipcMain.handle('downloadMP3', async (event, args) => {
    return await downloadMP3(args.url, pref.dir.content + "/" + args.dest);
});

ipcMain.handle('getDir', async (event, dir) => {
    return pref.dir[dir];
});

ipcMain.handle('getVersion', async () => {
    return app.getVersion();
});

ipcMain.handle('fileExists', async (event, path) =>{
    return await fileExists(pref.dir.content + "/" + path);
});

ipcMain.handle('fileDelete', async (event, path) =>{
    return await fileDelete(pref.dir.content + "/" + path);
});

ipcMain.handle('revealFile', (event, path)=>{
    shell.openPath(pref.dir.content + "\\" + path.replace("/","\\").substring(0, path.lastIndexOf("/")));
})

ipcMain.handle('openLink', async (event, url) =>{
    shell.openExternal(url);
});

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: join(pref.dir.content, filePath),
        icon: join(__static, 'dragAndDrop.png')
    });
});