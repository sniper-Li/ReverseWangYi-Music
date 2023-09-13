const { app, BrowserWindow, ipcMain } = require('electron');
const SearchMusic = require('./SearchMusic');
const NeteaseCloudMusic = require('./NeteaseCloudMusic');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('search-song', async (event, songName) => {
    const searchMusic = new SearchMusic(JSON.stringify({ s: songName, limit: 30, type: 1, csrf_token: '' }));
    const songs = await searchMusic.search();
    event.sender.send('search-result', songs);
});

ipcMain.on('download-song', async (event, song) => {
    const neteaseCloudMusic = new NeteaseCloudMusic(song);
    try {
        await neteaseCloudMusic.music();
        event.sender.send('download-status', '下载完成');
    } catch (error) {
        console.error(error);
        event.sender.send('download-status', '下载失败: ' + error.message);
    }
});

ipcMain.on('update-cookie', (event, newCookie) => {
    try {
        // 获取配置文件的路径
        let configPath = path.resolve(__dirname, './headerConfig.js');
        
        // 清除之前的模块缓存
        delete require.cache[require.resolve('./headerConfig.js')];

        // 重新加载配置文件
        let config = require('./headerConfig.js');

        // 更新cookie值
        config.headers['cookie'] = newCookie;

        // 将更新后的配置对象转换为字符串
        let configData = "module.exports = " + JSON.stringify(config, null, 4) + ";";

        // 写入更新后的配置对象到文件
        fs.writeFileSync(configPath, configData);

        // 回应渲染进程
        event.reply('update-cookie-status', '更新成功');
    } catch (error) {
        console.error(error);
        event.reply('update-cookie-status', '更新失败: ' + error.message);
    }
});

