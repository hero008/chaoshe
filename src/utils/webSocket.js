// 在 UniApp 页面或组件中
let socketTask = null;
import Vue from 'vue'
import store from '@/store';
import { createAlarm } from "@/utils/nativeMsg.js";
import { showNotice } from "@/utils/notice.js";
Vue.prototype.$store = store
let SystemInfo = uni.getSystemInfoSync();
Vue.prototype.SystemInfo = SystemInfo;
let that
let reconnectAttempts = 0 // 重连次数
let MAX_RETRY = 5      // 最大重连次数
let RETRY_DELAY = 10000 // 初始重连延迟（毫秒）
// 文件顶部变量新增
let messageQueue = [];
let isAlarmActive = false;
let alarmMsgInstance = null;
let connect=false
export function getWebSocket(vm) {
    // return
    if(connect) return
    connect=true  
    that = vm 
    let url = process.env.VUE_APP_BASE_URL == 'https://v2.app.chaoshewang.com/api/' ? 'ws://v2.app.chaoshewang.com/ws' : 'ws://192.168.8.180/ws'
    let token = uni.getStorageSync('aToken');
    socketTask = uni.connectSocket({
        url: url,
        header: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        success: (res) => {
            // console.log(res, 'WebSocket连接已发起')
        },
        fail: (err) => {
            // console.error('连接失败:', err)
            return
        }
    });
    // 监听事件  
    socketTask.onOpen(() => {
        // console.log('WebSocket连接已打开');
        vm.$store.commit('UpSelectWebSocket', true)
        reconnectAttempts = 0 // 重连次数 
        MAX_RETRY = 3      // 最大重连次数
        RETRY_DELAY = 30000
    });

    socketTask.onMessage((res) => {
        if (res.data == 'Connected') return
        const parsed = JSON.parse(res.data);
        // console.log(parsed, '收到消息'); 
        if (parsed.type == 2) {
            showNotice(parsed)
        }else if(parsed.type == 100){
            vm.$store.commit('UpAllInLeft', parsed)
        }else {
            // 新消息加入队列
            messageQueue.push(parsed);
            processMessageQueue();
        }
    })

    socketTask.onClose(() => {
        // console.log('WebSocket连接已关闭');
        vm.$store.commit('UpSelectWebSocket', false)
        connect=false
    });
    socketTask.onError((err) => {
        // console.error('WebSocket错误:', err);
        vm.$store.commit('UpSelectWebSocket', false)
        scheduleReconnect()
        connect=false
    });
};

function scheduleReconnect() {
    if (reconnectAttempts >= MAX_RETRY) return
    const delay = RETRY_DELAY * Math.pow(2, reconnectAttempts)
    reconnectAttempts++
    // console.log(`第${reconnectAttempts}次重连，等待${delay}ms`)
    setTimeout(() => getWebSocket(that), delay)
}
// 核心队列处理器（新增计数器逻辑）

function processMessageQueue() {
    if (!isAlarmActive && messageQueue.length > 0) {
        const nextMsg = messageQueue.shift();
        isAlarmActive = true;
        // 创建新弹窗
        alarmMsgInstance = createAlarm(nextMsg);
        // 弹窗关闭监听
        const checkClose = setInterval(() => {
            if (alarmMsgInstance?.getStatus?.() !== "active") {
                clearInterval(checkClose);
                isAlarmActive = false;
                processMessageQueue(); // 继续下一条
            }
        }, nextMsg.expire_time);
    }
}

export function getMsg() {
    return socketTask

}