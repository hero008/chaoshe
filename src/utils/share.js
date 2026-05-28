import { getCache } from "@/utils/storage.js"
export default {
    data() {
        return {
            sharePath: "",
            inviteCode: "",
        }
    },
    onShow() {
        let pages = uni.$u.pages();
        let pagestr = pages[pages.length - 1]?.$page.fullPath;
        if (pagestr) this.sharePath = pagestr.slice(1);

        let user = getCache("userInfo") || {};
        if (user.inviteCode) {
            if (this.sharePath.indexOf("?") != -1) this.sharePath = this.sharePath + "&inviteCode=" + user.inviteCode
            else this.sharePath = this.sharePath + "?inviteCode=" + user.inviteCode
        }
    },
    onLoad(da) {
        if (da.inviteCode) uni.setStorageSync('inviteCode', da.inviteCode);
    },
    //1.配置发送给朋友
    onShareAppMessage() {
        return {
            title: '芒星赏', //分享的标题
            path: this.sharePath, //点击分享链接之后进入的页面路径
        };
    },
    //2.配置分享到朋友圈
    onShareTimeline() {
        return {
            title: '芒星赏', //分享的标题
            query: this.sharePath, //点击分享链接之后进入的页面路径
            // imageUrl: this.img_card //分享发送的链接图片地址
        }
    },
}