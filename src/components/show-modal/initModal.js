import Vuex from 'vuex'
export default function initModal(v) {
    // 挂在store到全局Vue原型上
    v.prototype.$modalStore = new Vuex.Store({
        state: {
            show: false,
            title: "",
            content: '',
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#ED4F4E",
            cancelBackgroundColor: "#FFE5E5",
            confirmText: "确定",
            confirmColor: "#FFFEFA",
            confirmBackgroundColor: "linear-gradient(0deg, #F65555 0%, #E54848 100%)",
            success: null,
        },
        mutations: {
            hideModal(state) {
                // 小程序导航条页面控制
                // #ifndef H5
                if (state.hideTabBar) {
                    wx.showTabBar();
                }
                // #endif
                state.show = false
            },
            showModal(state, data) {
                state = Object.assign(state, data)
                // console.log(state);
                state.show = true
            },
            success(state, res) {
                let cb = state.success
                let resObj = {
                    cancel: false,
                    confirm: false
                }
                res == "confirm" ? resObj.confirm = true : resObj.cancel = true
                cb && cb(resObj)
            }
        }
    })
    v.prototype.$showModal = function(option) {
        if (typeof option === 'object') {
            // #ifndef H5
            if (option.hideTabBar) {
                wx.hideTabBar();
            }
            // #endif

            v.prototype.$modalStore.commit('showModal', option)
        } else {
            throw "配置项必须为对象传入的值为：" + typeof option;
        }
    }
}