<!-- 首页 -->
<template>
    <view>
        <view class="index_page">
            <chao-wan v-if="tbStyle.selectIndex == 0" :inx.sync="chaowanInx" />
            <!-- #ifndef MP-WEIXIN -->
            <market v-if="tbStyle.selectIndex == 1" ref="marketPage" />
            <!-- #endif -->
            <home v-if="tbStyle.selectIndex == 2" />
            <shang-gui v-if="tbStyle.selectIndex == 3" ref="shangGui" />
            <my v-if="tbStyle.selectIndex == 4" ref="tabmy" />
            <tabbar :tbStyle.sync="tbStyle" ref="xtabbar" @currentChange="currentChange" />
            <!-- #ifdef MP-WEIXIN -->
            <mp-privacy initiative />
            <!-- #endif -->
        </view>
    </view>
</template>
<script>
import chaoWan from "@/pages/chaowan/index.vue";
// #ifndef MP-WEIXIN
import market from "@/pages/market/index.vue";
// #endif
import home from "@/pages/index/home.vue";
import shangGui from "@/pages/product/shanggui.vue";
import my from "@/pages/my/index.vue";
import tabbar from "@/components/tabbar/tabbar.vue";
// #ifdef MP-WEIXIN
import mpPrivacy from "@/components/modules/mp-privacy.vue";
// #endif
import { mapState } from "vuex";
import { post } from "@/utils/api.js";
import { getWebSocket } from "../../utils/webSocket";
export default {
    data() {
        return {
            tbStyle: {
                selectIndex: 2,
            },
            chaowanInx: 1,
            isPopupVisible: true,
            loading: true,
        };
    },

    components: {
        chaoWan,
        // #ifndef MP-WEIXIN
        market,
        // #endif
        home,
        shangGui,
        tabbar,
        my,
        // #ifdef MP-WEIXIN
        mpPrivacy,
        // #endif
    },
    computed: {
        ...mapState(["popupWebSocket", 'userInfo']),
    },
    async onLoad(da) {
        if (da.chaowanInx) this.chaowanInx = Number(da.chaowanInx);
        let a = 0;
        a = Object.keys(this.userInfo).length;
        let that = this;
        uni.getNetworkType({
            success: function (res) {
                if (res.networkType !== "none" && a > 0) {
                    // #ifdef APP-PLUS
                    that.checkVersion();
                    // #endif
                }
            },
        });
        if (
            !this.popupWebSocket &&
            this.SystemInfo.uniPlatform == "app" &&
            uni.getStorageSync("aToken")
        ) {
            getWebSocket(this);
        }
    },
    onShow() {
        let inx = uni.getStorageSync("currentChange");
        inx = [0, 1, 2, 3, 4].includes(inx) ? inx : 2;
        this.tbStyle.selectIndex = inx;
        if (this.$refs.xtabbar) this.$refs.xtabbar.upindex(inx);
        if (this.$refs.marketPage && inx == 1) this.$refs.marketPage.refresh();
        if (this.$refs.tabmy && inx == 4) this.$refs.tabmy.tabload();
        if (this.$refs.shangGui && inx == 3) this.$refs.shangGui.loadDetail(1);
    },
    methods: {
        currentChange(va) {
            this.tbStyle.selectIndex = va;
            setTimeout(() => {
                if (va == 4) this.$refs.tabmy.tabload();
            }, 200);
        },
        async checkVersion() {
            // let firstTime = uni.getStorageSync('firstTime')
            // console.log(typeof !firstTime ,firstTime, '测试更新');
            let that = this;
            let gres = await post("v1/system/version");
            let popupVersion = gres.versionText.version.replace(/[.]/g, "");
            let uniPlatform = this.SystemInfo.uniPlatform;
            // let AppType =getApp().globalData.AppTypeList[plus.runtime.channel] || 1;
            if (uniPlatform == "app") {
                let osname = this.SystemInfo.osName;
                // let urlAversion =
                //     AppType == 1
                //         ? "https://img.chaoshewang.com/download/app.version"
                //         : "https://img.chaoshewang.com/download_channel/app.version";

                uni.request({
                    url: "https://img.chaoshewang.com/download/app.version",
                    success: (res) => {
                        let newVer = Number(res.data.replace(/\./g, ""));
                        let toVer = that.appversion.replace(/[.]/g, ""); //获取的是上一个包的版本号
                        if (["android", "ios"].includes(osname)) {
                            if (newVer > Number(toVer)) {
                                // let urlData =
                                //     AppType == 1
                                //         ? "https://img.chaoshewang.com/download/chaoshe.wgt"
                                //         : "https://img.chaoshewang.com/download_channel/chaoshe.wgt";
                                // let firstTime = uni.getStorageSync('firstTime')
                                // console.log(firstTime,'是否更新过');|| !firstTime
                                if (newVer > Number(popupVersion) ) {
                                    // uni.setStorageSync("firstTime", true)
                                    uni.downloadFile({
                                        url: "https://img.chaoshewang.com/download/chaoshe.wgt",
                                        success: (downloadResult) => {
                                            plus.runtime.install(
                                                downloadResult.tempFilePath,
                                                { force: true },
                                                () => {
                                                    plus.runtime.restart();
                                                }
                                            );
                                        },
                                    });
                                } else {
                                    uni.navigateTo({
                                        url:
                                            "./upgrade?info=" +
                                            encodeURIComponent(
                                                JSON.stringify(gres)
                                            ),
                                    });
                                }
                            }
                        }
                    },
                });
            }
        },
    },
};  
</script>
<style lang='scss' scoped>
.index_page {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;

    &::before {
        content: "";
        width: 100vw;
        height: calc(100vh - 212rpx);
        left: 0;
        top: 212rpx;
        position: absolute;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
}
</style>