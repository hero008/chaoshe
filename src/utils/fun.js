import { getCache, setCache } from "@/utils/storage.js";
import { post } from "@/utils/api.js";
let goto = (url, json) => {
    if (!url) {
        // uni.$u.toast('该功能暂未开放，敬请期待！');
    }
    let params = "";
    if (json) {
        params = [];
        let da = Object.keys(json).map(function (key) {
            if (json[key]) return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        });
        da.forEach(e => {
            if (e) params.push(e)
        });
        params = params.join("&")
    }
    uni.navigateTo({ url: url + '?' + params });
}
// copy
let copyCode = (v) => {
    let value = v + ''
    uni.setClipboardData({
        data: value,
        success: () => {
            uni.$u.toast('复制成功');
        },
        fail: (err) => {
            console.error('复制失败:', err);
            uni.showToast({
                title: '复制失败',
                icon: 'none'
            });
        }
    });
}
// 删除数组指定值
let remove = (Arr, val) => {
    var index = Arr.indexOf(val);
    if (index > -1) Arr.splice(index, 1);
    return Arr
}
// 判断是否是微信小程序
let ISmp = () => {
    let da = uni.getSystemInfoSync();
    return da.uniPlatform == "mp-weixin" && !["windows", "mac"].includes(da.platform)
}
// 获取胶囊按钮信息
let getMBInfo = () => {
    // #ifdef MP-WEIXIN
    return uni.getMenuButtonBoundingClientRect();
    // #endif
    // #ifndef MP-WEIXIN
    return { top: 40, height: 32, width: 0 }
    // #endif
}
// 播放音效
let playDede = (type = 1, AudioSrc) => {
    let miniaudio = 'https://img.chaoshewang.com/static/media/mini.mp3'
    let largeaudio = 'https://img.chaoshewang.com/static/media/large.mp3'
    const innerAudio = uni.createInnerAudioContext();
    innerAudio.autoplay = true;
    innerAudio.src = AudioSrc ? AudioSrc : type == 1 ? miniaudio : largeaudio;
    innerAudio.onPlay(() => { });
    innerAudio.onError((res) => { });
    innerAudio.onPause((res) => {
        innerAudio.src = '';
    });
}
//格式化时间
let toTime = (timestamp) => { //时间戳转换方法
    if (timestamp ?? '' != '') {
        const date = new Date(+timestamp);
        const formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + '.' + ('0' + date.getDate()).slice(-2); // 格式化日期
        const formattedTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2); // 格式化时间
        return formattedDate + ' ' + formattedTime; // 拼接日期和时间
    } else {
        return ''
    }
}
//根据文件本地路径检查缓存文件是否存在
let isHave = (path) => {
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        uni.getSavedFileInfo({
            filePath: path,
            success: function (res) {
                if (res.size > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            },
            fail() {
                resolve(false)
            }
        })
        // #endif
        // #ifdef MP-WEIXIN
        wx.getFileSystemManager().getFileInfo({
            filePath: path,
            success: function (res) {
                if (res.size > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            },
            fail() {
                resolve(false)
            }
        })
        // #endif
    })
}
// 缓存文件
let saveFileToLocal = (key, url) => {
    return new Promise(async (resolve, reject) => {
        let FilePath = getCache(key);
        let ishave = await isHave(FilePath)
        if (ishave) resolve(FilePath)
        else {
            uni.downloadFile({
                url: url,
                success: (downloadResult) => {
                    if (downloadResult.statusCode === 200) {
                        // #ifdef APP-PLUS
                        uni.saveFile({
                            tempFilePath: downloadResult.tempFilePath,
                            success: (saveResult) => {
                                setCache(key, saveResult.savedFilePath)
                                resolve(saveResult.savedFilePath)
                            }
                        });
                        // #endif
                        // #ifdef MP-WEIXIN
                        wx.getFileSystemManager().saveFile({
                            tempFilePath: downloadResult.tempFilePath,
                            success: (saveResult) => {
                                setCache(key, saveResult.savedFilePath)
                                resolve(saveResult.savedFilePath)
                            }
                        })
                        // #endif
                    }
                }
            });
        }
    })
}
// uni分享
let objectToUrl = (obj) => {
    let url = "";
    for (let key in obj) {
        if (obj[key]) {
            if (url.length > 0) url += "&";
            url += `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
        }
    }
    return url;
}
let uniShare = (obj = {}, params = {}, imageUrl) => {
    let user = getCache("userInfo") || {};
    if (user.inviteCode) params.inviteCode = user.inviteCode;
    imageUrl = imageUrl ? imageUrl : "https://img.chaoshewang.com/static/img/imgs/gachas_share.jpg";
    uni.share({
        provider: 'weixin',
        scene: "WXSceneSession",
        type: 5,
        imageUrl,
        title: obj.tit || "潮社赏",
        miniProgram: {
            // id: 'gh_8701a277156e',
            id: "gh_47ea484e5bbc",
            path: obj.path + '?' + objectToUrl(params), // 可带参
            webUrl: 'http://www.chaoshewang.com',
            // type:2,//开发
        },
        success: ret => {
        },
        fail: err => {
            if (uni.getSystemInfoSync().osName == "ios") {
                let imgType = imageUrl.split(".").pop() //获取图片类型，只有jpg类型图片才支持图片质量quality参数
                let type1 = {
                    quality: 100,
                    width: imgType == "jpg" ? "500px" : "400px",
                    height: "auto",
                }
                let type2 = {
                    scene: "WXSceneSession",
                    type: 5,
                    title: obj.tit || "潮社赏",
                    miniProgram: {
                        id: 'gh_47ea484e5bbc',//潮社online
                        path: obj.path + '?' + objectToUrl(params), // 可带参
                        webUrl: 'http://www.chaoshewang.com',
                        // type:2,
                    },
                }
                compressImg(imageUrl, type1, type2, obj, params)
                return
            }
            shareImg(obj, params)
        }
    });

}
//压缩图片
let compressImg = (imageUrl, type = {}, type1 = {}, obj = {}, params = {}) => {
    uni.downloadFile({ //网上图片资源转为本地
        url: imageUrl,
        success: (res) => {
            if (res.statusCode == 200) {
                uni.compressImage({ //压缩图片
                    src: res.tempFilePath,
                    ...type,
                    success: ret => {
                        uni.share({
                            provider: 'weixin',
                            imageUrl: ret.tempFilePath,
                            ...type1,
                            success: res => {
                                // console.log(JSON.stringify(res));
                            },
                            fail: err => {
                                // console.log(JSON.stringify(err));
                            }
                        });

                    }
                })
            }
        },
        fail: () => {
            shareImg(obj, params)
        }
    })
}
// 失败后的分享
let shareImg = (obj = {}, params = {},) => {

    uni.share({
        provider: 'weixin',
        scene: "WXSceneSession",
        type: 5,
        imageUrl: "https://img.chaoshewang.com/static/img/imgs/gachas_share.jpg",
        title: obj.tit || "潮社赏",
        miniProgram: {
            id: "gh_47ea484e5bbc",
            path: obj.path + '?' + objectToUrl(params), // 可带参
            webUrl: 'http://www.chaoshewang.com',
            // type:2,
        },
        success: ret => {
            // console.log(JSON.stringify(ret));
        },
        fail: err => {
            // console.log(JSON.stringify(err));
        }
    });
}

let order = (list, nuns) => {
    let arr1 = [], arr2 = [];
    list.map((item) => {
        if (item.state == 1) {
            arr1.push(item);
        } else {
            arr2.push(item);
        }
    });
    let Arr = [
        ...arr1.sort((a, b) => b.startTime - a.startTime).slice(nuns),
        ...arr2,
    ];
    return Arr

}
// 防止处理多次点击
function noMultipleClicks(methods, info) {
    // methods是需要点击后需要执行的函数， info是点击需要传的参数
    let that = this;
    if (that.noClick) {
        // 第一次点击
        that.noClick = false;
        if (info && info !== '') {
            // info是执行函数需要传的参数
            methods(info);
        } else {
            methods();
        }
        setTimeout(() => {
            that.noClick = true;
        }, that.noClickTime)
    } else {

        // 这里是重复点击的判断
    }

}
//时间计算
let remainingTime = (tiemDate) => {
    let time = tiemDate.replace(/-/g, "/");
    let currentTime = new Date().getTime();
    let endTime = new Date(time).getTime();
    return endTime - currentTime;
}
let monthAndndDay = (time, type = 0) => {
    const date = time.slice(5, 7);
    const date1 = time.slice(8, 10);
    let formattedDate = ''
    if (type) { formattedDate = date + '月' + date1 + '日' + time.split(' ')[1]; }
    else { formattedDate = date + '月' + date1 + '日'; }

    return formattedDate;
}
let getTimestamp = (value) => { //时间戳转换方法
    let s = value.replace(/-/g, "/");
    let st = new Date(s).getTime();
    return st - new Date().getTime();
}
// 浮点数
function floatingPoint(left, operator, right) {
    const price1 = Math.round(Number(left) * 100);
    const price2 = Math.round(Number(right) * 100);
    switch (operator) {
        case '+':
            return (price1 + price2) / 100;
        case '-':
            return (price1 - price2) / 100;
        case '*':
            return (price1 * price2) / 100;
        case '/':
            return (price1 / price2) / 100;
        default:
            console.warn('无效运算符');
            return null;
    }
}
// 切换中文数字
function numberToChinese(num) {
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千'];
    if (num === 0) return chineseNums[0];
    let str = '';
    let decimalPart = '';
    // 处理小数
    // if (num % 1 !== 0) {
    //     const decimalStr = num.toString().split('.')[1];
    //     decimalPart = '点' + [...decimalStr].map(d => chineseNums[parseInt(d)]).join('');
    //     num = Math.floor(num);
    // }
    // 处理整数
    let unitIndex = 0;
    while (num > 0) {
        const digit = num % 10;
        str = (digit !== 0 ? chineseNums[digit] + units[unitIndex] : chineseNums[digit]) + str;
        num = Math.floor(num / 10);
        unitIndex++;
    }

    return str.replace(/零+/g, '零').replace(/零$/, '') + decimalPart;
}

// 计算抽奖按钮是否显示
function canShowGachaButton(data) {
    const { userBetCount, userBetCountDaily, gacha, specialDiscountCount, gachaBox } = data
    let btn = false
    if (userBetCount !== 0 && userBetCountDaily !== 0) {
        btn =
            (userBetCount === -1 ||
                userBetCount >=
                gacha.specialDiscountLimitBetNum) &&
            (userBetCountDaily === -1 ||
                userBetCountDaily >=
                gacha.specialDiscountLimitBetNum) && specialDiscountCount > 0 && gachaBox.leftAwards >= gacha.specialDiscountLimitBetNum
    }
    return btn

}
function service() {
    let date = new Date();
    let dayOfWeekIndex = date.getDay();
    if (dayOfWeekIndex == 0 || dayOfWeekIndex == 6) {
        uni.showModal({
            title: "提示",
            // 提示文字
            content:
                "客服工作时间为工作日10:00-22:00，非此时间段将无法及时回复，敬请谅解！若有问题请您留言，我们将于工作时间按先后处理。",
            // 取消按钮的文字自定义
            cancelText: "取消",
            // 确认按钮的文字自定义
            confirmText: "确定",
            //删除字体的颜色
            confirmColor: "blue",
            //取消字体的颜色
            cancelColor: "#000000",
            success: function (res) {
                if (res.confirm) {
                    // 执行确认后的操作
                    kefu();
                } else {
                    // 执行取消后的操作
                }
            },
        });
    } else {
        kefu();
    }
}
function kefu() {
    // #ifdef APP-PLUS
    uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        openCustomerServiceChat: true,
        corpid: "ww6c4b9baf0bf53076",
        customerUrl:
            "https://work.weixin.qq.com/kfid/kfc27f785a690541d74",
    });
    // #endif
    // #ifdef MP-WEIXIN
    wx.openCustomerServiceChat({
        extInfo: {
            url: "https://work.weixin.qq.com/kfid/kfc27f785a690541d74",
        },
        corpId: "ww6c4b9baf0bf53076",
        success(res) { },
        fail(err) { },
    });
    // #endif
}
function groupBySum(arr) {
    const result = {};
    const prize = []

    arr.forEach(item => {
        const currentNumber = typeof item.probability === 'string'
            ? Number(item.probability) || 0 : item.probability || 0;
        if ([27, 42, 45].includes(item.levelIndex) && (item.leftNums || item.totalNums)) {
            if (item.levelName == 'Surprise') prize.push({ levelName: item.levelName, text: '满足条件赠送。' })
            if (item.levelName == 'Lucky') prize.push({ levelName: item.levelName, text: '当前盲盒售罄时所有参与当前盲盒抽赏玩家随机选择一名参与用户赠送。' })
            if (item.levelName == 'Last') prize.push({ levelName: item.levelName, text: '随盲盒最后一抽送出。' })
        }
        if (currentNumber === 0) return;
        if (result[item.levelName]) {
            result[item.levelName] = parseFloat((result[item.levelName] + currentNumber).toFixed(2));
        } else result[item.levelName] = currentNumber;
    });
    const result1 = prize.filter((item, index, arr) => { return arr.findIndex(obj => obj.levelName === item.levelName) === index; });
    const result2 = Object.entries(result).map(([key, value]) => ({
        levelName: `${key}赏`,
        text: value
    }));
    let total = 0;
    result2.map((item, i) => {
        if (i == result2.length - 1) {
            item.text = parseFloat((100 - total).toFixed(2))
        } else total += item.text
    })
    return [...result1, ...result2]
}

// 获取详情并打开弹窗
function itemDetails(data, gachaDetailsRef, str, price) {
    const { itemId, probability, levelIndex ,luckyPhase} = data
    let cont = "";
    if (levelIndex == 42) {
        str = "概率";
        cont =luckyPhase?'当前奖箱个人参与次数/当前阶段Lcuky发放所需参与次数': "本期个人参与次数/本期总参与次数";
    }
    if (levelIndex == 27) {
        str = "概率";
        cont = "非卖品，随最后一抽赠送";
    }
    if (levelIndex == 45) {
        str = "";
    }
    if (levelIndex == 50) {
        str = "概率";
        cont = "非卖品，售罄时赠与本池抽数最多的玩家";
    }
    post("v1/goods/item/get", {
        item_id: itemId,
    }).then((res) => {
        res.item.price = price;
        gachaDetailsRef.open(res, probability||0, str, cont);
    });
}

// 计算进度百分比
let calculateProgress = (schedule) => {
    // 避免除以零的情况
    if (!schedule || !schedule.target || schedule.target === 0) {
        return 0;
    }

    // 计算当前值占目标值的百分比，并取整
    const percentage = (schedule.current / schedule.target) * 100;

    // 确保百分比不超过100%
    return Math.min(percentage, 100);
};
// 震动
let vibratePhone = (duration = 2000) => {
    const vibrationStatus = uni.getStorageSync("vibration");
    const isOpenVibrate = vibrationStatus === false ? false : true;
    if (!isOpenVibrate) return;
    if (!vibrationStatus) uni.setStorageSync('vibration', isOpenVibrate);
    const { platform } = uni.getSystemInfoSync();
    if (platform === 'ios') {
        let startTime = new Date().getTime();
        let loseEfficacy = true
        let interval = setInterval(() => {
            uni.vibrateShort({
                fail: (err) => {
                    iosNativeVibrate(duration)
                    loseEfficacy = false
                    clearInterval(interval);
                }
            })
            if (new Date().getTime() - startTime >= duration && loseEfficacy) {
                clearInterval(interval);
            } else {
                clearInterval(interval);
            }
        }, 50);
        return
    }
    if (typeof plus !== 'undefined' && plus.device) {
        plus.device.vibrate(duration);
    } else {
        // plus 不可用时回退到循环短震
        startShortVibrateLoop(duration);
    }

};
//ios
let iosNativeVibrate = (duration = 2000) => {
    var UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator');
    // 创建实例
    var impact = new UIImpactFeedbackGenerator();
    // 准备震动 (可选，但能减少延迟)
    impact.prepare();
    let startTime = new Date().getTime();
    let interval = setInterval(() => {
        impact.init(1);
        impact.impactOccurred();
        if (new Date().getTime() - startTime >= duration) {
            clearInterval(interval);
            // 释放对象
            plus.ios.deleteObject(impact);
            plus.ios.deleteObject(UIImpactFeedbackGenerator);
        }
    }, 5);

};
//安卓
let startShortVibrateLoop = (duration = 2000) => {
    const startTime = new Date().getTime();
    const interval = setInterval(() => {
        uni.vibrateShort();
        if (new Date().getTime() - startTime >= duration) clearInterval(interval);
    }, 100);

}

export {
    ISmp, copyCode, getMBInfo, goto, isHave, monthAndndDay, noMultipleClicks,
    order, playDede, remainingTime, remove, saveFileToLocal,
    toTime, canShowGachaButton, service, compressImg, uniShare, floatingPoint, getTimestamp, numberToChinese, groupBySum, itemDetails, calculateProgress, vibratePhone,
};
