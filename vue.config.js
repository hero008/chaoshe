module.exports = {
    transpileDependencies: ['uview-ui'],
    devServer: {
          host: '0.0.0.0',  // 允许外部访问
    port: 8080,
         allowedHosts: 'all',
        client: {
            overlay: false // 编译错误时，取消全屏覆盖（建议关掉）
        },
         headers: {
      'Access-Control-Allow-Origin': '*',
    }
    }
}