/**
   *
   * @param {缓存key} key
   * @param {需要存储的缓存值} value
   * @param {过期时间，默认0表示永久有效} expire
   */
export const setCache = (key, value, expire = 0) => {
    let obj = {
        data: value, //存储的数据
        time: Date.now() / 1000, //记录存储的时间戳
        expire: expire //记录过期时间，单位秒
    }
    uni.setStorageSync(key, JSON.stringify(obj))
}

export const getCache = (key) => {
    let val = uni.getStorageSync(key)
    if (!val) return null
    val = JSON.parse(val)
    if (val.expire && Date.now() / 1000 - val.time > val.expire) {
        uni.removeStorageSync(key)
        return null
    }
    return val.data
}

export const cacheImage = (url) => {
    return new Promise(async (resolve) => {
        if (!url) return resolve(url)
        const key = 'ddpImg_' + url
        // 命中缓存且文件仍有效，直接返回本地路径
        const cachedPath = getCache(key)
        if (cachedPath && await verifyLocalFile(cachedPath)) {
            return resolve(cachedPath)
        }else{
          
          const img = new Image()
          img.src = url
        // img.onload = resolve
        // img.onerror = reject
            resolve(url)
        }

        return;
        // 未命中或文件失效：下载并保存
        uni.downloadFile({
            url: url,
            success: (downloadResult) => {
                if (downloadResult.statusCode !== 200) {
                    return resolve(url)
                }
                // // #ifdef APP-PLUS
                // uni.saveFile({
                //     tempFilePath: downloadResult.tempFilePath,
                //     success: (saveResult) => {
                //         setCache(key, saveResult.savedFilePath)
                //         resolve(saveResult.savedFilePath)
                //     },
                //     fail: () => resolve(url)
                // })
                // // #endif
                // // #ifdef MP-WEIXIN
                // wx.getFileSystemManager().saveFile({
                //     tempFilePath: downloadResult.tempFilePath,
                //     success: (saveResult) => {
                //         setCache(key, saveResult.savedFilePath)
                //         resolve(saveResult.savedFilePath)
                //     },
                //     fail: () => resolve(url)
                // })
                // #endif
            },
            fail: () => resolve(url)
        })
    })
}