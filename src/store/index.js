import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { post } from "@/utils/api.js"
import { setCache, getCache } from "@/utils/storage.js"
import { isMTVapp, mgTvIsLogin } from '../utils/mgtv'
let userInfo = getCache("userInfo") || {};
const store = new Vuex.Store({
    /* 此处存储数据 */
    state: {
        isMTVLogin:false,
        userName: "Nnnni",
        userInfo, // 用户信息
        selectTicket: {}, // 选择的优惠券
        offsetInfo: {},
        payMessage: { url: '', message: {}, discount: true },//支付信息]
        popupWebSocket: false,
        allInLeft: { id: '', extra_data: { left_bet_num: '', gacha_id: '' } },//一网打尽
        mail: 0,
        subtract: false,
        // 处理应用程序权限请求
        CAMERA: false,
        WRITE_EXTERNAL_STORAGE: false,
        ACCESS_FINE_LOCATION: false,
        CALL_PHONE: false,
        /* #ifdef APP-PLUS */
        isIos: plus.os.name == "iOS",
        /* #endif */
        mapping: {
            'CAMERA': {
                title: "潮社娱乐赏对相机权限使用说明",
                content: "便于您使用该功能拍摄照片用于更换头像场景中读取和写入相册和文件内容。",
                methods: 'SET_CAMERA'
            },
            'WRITE_EXTERNAL_STORAGE': {
                title: "潮社娱乐赏对相册权限使用说明",
                content: "便于您使用该功能上传您的照片/图片用于更换头像场景中读取和写入相册和文件内容。",
                methods: 'SET_WRITE_EXTERNAL_STORAGE'
            },
            // 'ACCESS_FINE_LOCATION': {
            //     title: "潮社娱乐赏对地理位置权限申请说明",
            //     content: "潮社娱乐赏应用程序可以提供基于位置的服务、定位导航、附近搜索等功能。",
            //     methods: 'SET_ACCESS_FINE_LOCATION'
            // },
            // 'CALL_PHONE': {
            //     title: "潮社娱乐赏拨打/管理电话权限申请说明",
            //     content: "便于您使用该功能联系买家、客服、业务经理与联系等场景下使用",
            //     methods: 'SET_CALL_PHONE'
            // }
        },
    },
    /* 
     * 包装类，此处用于包装 state 中数据，类似于页面组件中的计算属性
     * getters 是唯一可以取 state 值的方法
     */
    getters: {
        isMgLogin(state) {
            return state.isMTVLogin
        },
        userInfo(state) {
            return state.userInfo
        },
        selectTicket(state) {
            return state.selectTicket
        },
        selectPayMessage(state) {
            return state.payMessage
        },
        popupWebSocket(state) {
            return state.popupWebSocket
        },
        selectAllInLeft(state) {
            return state.allInLeft
        },
        selectMail(state) {
            return state.mail
        },
        subtract(state) {
            return state.subtract
        }
    },


    /** 
     * 唯一修改 state 值方法，会造成同步阻塞
     * 此处用于处理state中数据，存放方法类似页面组件中的 methods
     * state 中所有数据的修改都应该通过 mutations 内方法实现
     * 第一个形参永远都是 state
     * 第二个形参是调用此方法时传递的参数
     */
    mutations: {
        updateMgTvLogin(state,val){
            if(!val){
                uni.removeStorageSync("aToken")
                uni.removeStorageSync("rToken")
                uni.removeStorageSync("userInfo")
            }
            state.isMTVLogin = val
        },
       
        updateInfo(state, info) {
            state.userInfo = info;
            setCache("userInfo", info, 60 * 60 * 24 * 7)
        },
        UpBalance(state, va) {
            state.userInfo.coin = va.balance;
            state.userInfo.gold = va.gold;
            setCache("userInfo", state.userInfo, 60 * 60 * 24 * 7)
        },
        UpselectTicket(state, va) {
            state.selectTicket = va;
        },
        UpOffsetInfo(state, va) {
            state.offsetInfo = va;
        },
        RandomDiscount(state, va) {
            state.subtract = va;
        },
        UppayMessage(state, va) {
            state.payMessage.url = va.url;
            state.payMessage.message = va.message;
            state.payMessage.discount = va.discount
        },
        UpSelectWebSocket(state, va) {
            state.popupWebSocket = va;
        },
        UpAllInLeft(state, va) {
            state.allInLeft = va;
        },
        UpMail(state, va) {
            state.mail = va;
        },
        // 管理权限告知目的
        SET_CAMERA(state, val) {
            state.CAMERA = val
        },
        SET_WRITE_EXTERNAL_STORAGE(state, val) {
            state.WRITE_EXTERNAL_STORAGE = val
        },
        // SET_CALL_PHONE(state, val) {
        //     state.CALL_PHONE = val
        // },
        // SET_ACCESS_FINE_LOCATION(state, val) {
        //     state.ACCESS_FINE_LOCATION = val
        // }
    },
    /**
     * 异步方法
     * 调用 mutations 方法，实现异步更新 state 数据*
     * 第一个形参永远都是 context
     * 第二个形参是调用此方法时传递的参数
     */
    actions: {
        asyncUpdateMgTvLogin(context) {
            mgTvIsLogin().then(res => {
                context.commit('updateMgTvLogin', res)
            })
        },
        asyncUpdateInfo(context) {
            let userInfo = getCache("userInfo") || {};
            post("v1/user/self/get", { user_id: userInfo.id }).then(res => {
                if (!res.code) {
                    let { id, avatarUrl, nickname, phone, coinBalance, inviteCode, showMarket, balanceGold, isAdmin, level, allowCoinBet, isAuthenticated } = res
                    let info = { ...userInfo, id, name: nickname, avatarUrl, phone, coin: coinBalance, gold: balanceGold, inviteCode, showMarket, isAdmin, level, allowCoinBet, isAuthenticated }
                    context.commit('updateInfo', info)
                }
            })
        },
        asyncUpBalance(context) {
            let userInfo = getCache("userInfo") || {};
            post("v1/wallet/balance", { user_id: userInfo.id }).then(res => {
                if (!res.code) {
                    let a = { balance: res.wallet['0'].balance, gold: res.wallet['2'].balance }
                    context.commit('UpBalance', a)
                }
            })

        },
        async asyncUpOffsetInfo(context) {
            await post("v1/activity/cost-award-offset/list").then(res => {
                if (!res.code) {
                    context.commit('UpOffsetInfo', res)
                }
            })
        },
        //权限获取
        async requestPermissions({ state, dispatch, commit }, permissionID) {
            try {
                if (!state[permissionID] && !state.isIos) {
                    var viewObj = await dispatch('nativeObjView', permissionID);
                    viewObj.show();
                }
                return new Promise(async (resolve, reject) => {
                    //苹果不需要这个
                    if (state.isIos) {
                        resolve(1);
                        return
                    }
                    // Android权限查询
                    function requestAndroidPermission(permissionID_) {
                        return new Promise((resolve, reject) => {
                            plus.android.requestPermissions(
                                [permissionID_], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
                                function (resultObj) {

                                    var result = 0;
                                    for (var i = 0; i < resultObj.granted.length; i++) {
                                        var grantedPermission = resultObj.granted[i];
                                        // console.log('已获取的权限：' + grantedPermission);
                                        result = 1
                                    }
                                    for (var i = 0; i < resultObj.deniedPresent.length; i++) {
                                        // var deniedPresentPermission = resultObj.deniedPresent[i];
                                        // console.log('拒绝本次申请的权限：' + deniedPresentPermission);
                                        result = 0
                                    }
                                    for (var i = 0; i < resultObj.deniedAlways.length; i++) {
                                        // var deniedAlwaysPermission = resultObj.deniedAlways[i];
                                        // console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
                                        result = -1
                                    }
                                    resolve(result);
                                },
                                function (error) {
                                    console.log('申请权限错误：' + error.code + " = " + error
                                        .message);
                                    resolve({
                                        code: error.code,
                                        message: error.message
                                    });
                                }
                            );
                        });
                    }

                    const result = await requestAndroidPermission(
                        'android.permission.' + permissionID
                    );
                    if (result === 1) {
                        //'已获得授权'
                        commit(state.mapping[permissionID].methods, true)
                    } else if (result === 0) {
                        //'未获得授权'
                        commit(state.mapping[permissionID].methods, false)
                    } else {
                        commit(state.mapping[permissionID].methods, true)
                        uni.showModal({
                            title: '提示',
                            content: '操作权限已被拒绝，请手动前往设置',
                            confirmText: "立即设置",
                            success: (res) => {
                                if (res.confirm) {
                                    dispatch('gotoAppPermissionSetting')
                                }
                            }
                        })
                    }
                    if (viewObj) viewObj.close()
                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        },
        async getPopUp() {
            if (!state[permissionID] && !state.isIos) {
                var viewObj = await dispatch('nativeObjView', permissionID);
                viewObj.show();
            }
        },
        //提示框
        nativeObjView({ state }, permissionID) {
            const systemInfo = uni.getSystemInfoSync();
            const statusBarHeight = systemInfo.statusBarHeight;
            const navigationBarHeight = systemInfo.platform === 'android' ? 48 :
                44; // Set the navigation bar height based on the platform
            const totalHeight = statusBarHeight + navigationBarHeight;
            let view = new plus.nativeObj.View('per-modal', {
                top: '0px',
                left: '0px',
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                //opacity: .5;
            })
            view.drawRect({
                color: '#fff',
                radius: '5px'
            }, {
                top: totalHeight + 'px',
                left: '5%',
                width: '90%',
                height: "100px",
            })
            view.drawText(state.mapping[permissionID].title, {
                top: totalHeight + 5 + 'px',
                left: "8%",
                height: "30px"
            }, {
                align: "left",
                color: "#000",
            }, {
                onClick: function (e) {
                    // console.log(e);
                }
            })
            view.drawText(state.mapping[permissionID].content, {
                top: totalHeight + 35 + 'px',
                height: "60px",
                left: "8%",
                width: "84%"
            }, {
                whiteSpace: 'normal',
                size: "14px",
                align: "left",
                color: "#656563"
            })

            function show() {
                view = plus.nativeObj.View.getViewById('per-modal');
                view.show()
                view = null //展示的时候也得清空，不然影响下次的关闭，不知道为啥
            }

            function close() {
                view = plus.nativeObj.View.getViewById('per-modal');
                view.close();
                view = null
            }
            return {
                show,
                close
            }
        },
        // 跳转到**应用**的权限页面
        gotoAppPermissionSetting({ state }) {
            if (state.isIos) {
                var UIApplication = plus.ios.import("UIApplication");
                var application2 = UIApplication.sharedApplication();
                var NSURL2 = plus.ios.import("NSURL");
                // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");		
                var setting2 = NSURL2.URLWithString("app-settings:");
                application2.openURL(setting2);

                plus.ios.deleteObject(setting2);
                plus.ios.deleteObject(NSURL2);
                plus.ios.deleteObject(application2);
            } else {
                // console.log(plus.device.vendor);
                var Intent = plus.android.importClass("android.content.Intent");
                var Settings = plus.android.importClass("android.provider.Settings");
                var Uri = plus.android.importClass("android.net.Uri");
                var mainActivity = plus.android.runtimeMainActivity();
                var intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
                intent.setData(uri);
                mainActivity.startActivity(intent);
            }
        }

    },
})
export default store