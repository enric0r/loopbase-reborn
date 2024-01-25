module.exports = {
    pluginOptions: {
        nodeIntegration: true,
        electronBuilder: {
            nodeIntegration: true,
            preload: 'src/preload.js',
        }
    }
}