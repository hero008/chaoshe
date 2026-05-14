import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
// 引入vuex
import store from './store'
Vue.prototype.$store = store
// uView UI
import uView from "uview-ui";
Vue.use(uView);
import gachaDetails from "@/components/gachaDetails/index.vue";
Vue.component('gachaDetails', gachaDetails);

// 公共方法
import { canShowGachaButton, goto, copyCode, remove, ISmp, getMBInfo, toTime, noMultipleClicks, remainingTime, monthAndndDay, floatingPoint, numberToChinese} from '@/utils/fun.js';
import { gachaDetailsMethod } from './utils/getData'
Vue.prototype.goto = goto; // 页面跳转
Vue.prototype.copy = copyCode; // 复制
Vue.prototype.remove = remove; // 删除数组指定值
Vue.prototype.ISmp = ISmp; // 判断是否是微信小程序
Vue.prototype.MBInfo = getMBInfo; // 获取胶囊按钮信息
Vue.prototype.toTime = toTime; // 获取胶囊按钮信息
Vue.prototype.appversion = process.env.VUE_APP_VERSION; // APP版本号
// Vue.prototype.getTimestamp = getTimestamp; //  yyyy-MM-dd HH:mm:ss SSS格式转换时间戳
Vue.prototype.$noMultipleClicks = noMultipleClicks; // 防抖
// Vue.prototype.order = order; // 控制预售显示
Vue.prototype.remainingTime = remainingTime; // 时间
Vue.prototype.monthAndndDay = monthAndndDay; // 月日
Vue.prototype.floatingPoint = floatingPoint;
Vue.prototype.canShowGachaButton = canShowGachaButton;
Vue.prototype.numberToChinese = numberToChinese;//汉语数字
Vue.prototype.gachaDetailsMethod = gachaDetailsMethod;
import initModal from "@/components/show-modal/initModal.js"
import showModal from "@/components/show-modal/show-modal.vue"
initModal(Vue);
Vue.component('show-modal', showModal);

// #ifdef MP-WEIXIN
// 微信小程序全局分享
import share from "@/utils/share.js"
Vue.mixin(share)
// #endif

// js高精度计算
import highPrecision from "@/utils/highPrecision";
Vue.prototype.$h = highPrecision;
// 返回上一级页面
Vue.prototype.gateBack = (url) => {
	let routes = getCurrentPages();
	if (routes.length > 1) {
		uni.navigateBack({
			delta: 1,
			fail() {
				goto('/pages/index/index')
			}
		})
	} else {
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}
	store.dispatch('asyncUpdateInfo');
};
Vue.prototype.getReLaunch = (url) => {
	uni.reLaunch({
		url: '/pages/index/index'
	});
};

// 全局封装使用缓存
import { setCache, getCache } from "@/utils/storage.js"
Vue.prototype.$sl = setCache;
Vue.prototype.$gl = getCache;

// 系统信息|设备信息
let SystemInfo = uni.getSystemInfoSync();
Vue.prototype.SystemInfo = SystemInfo;

// 全局注册过滤
import filters from "@/utils/filters.js";
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store,
})
app.$mount()