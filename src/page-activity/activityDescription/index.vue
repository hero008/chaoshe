<template>
    <view class="activityDescription">
        <view class="topBack">
            <img
                src="https://img.chaoshewang.com/static/img/activity/bbgsfh.png"
                @click.stop="gateBack"
                class="Back_ico"
            />
            <!-- #ifndef MP-WEIXIN -->
            <img
                src="https://img.chaoshewang.com/static/img/activity/bbgsfx.png"
                @click="onShare"
                class="Back_ico ml"
            />
            <!-- #endif  -->
        </view>
        <view class="particulars">
            <view class="title"> </view>
            <view class="everyday">
                <view class="header flex_r flex_jc">
                    <view class="l"> </view>
                    <text class="c">活动规则</text>
                    <view class="r"> </view>
                </view>
                <view class="box"
                    ><u-parse
                        :content="(cont && cont.text) || ''"
                        :selectable="true"
                    ></u-parse>
                </view>
            </view>
            <view class="foot_box" @click="footBtn"> </view>
        </view>
        <x-modal :visible.sync="downShow" />
    </view>
</template>
<script>
// 抽赏免单
import { post } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import xModal from "@/components/modules/x-modal";
export default {
    data() {
        return {
            activity: {},
            cont: "",
            downShow: false,
        };
    },
    components: {
        xModal,
    },
    watch: {},
    computed: {},
    onLoad(da) {
        this.activity = da;
    },
    // onShow页面显示时调用(启动/页面从隐藏到启动)，可调用多次。
    onShow() {},
    created() {},
    mounted() {
        this.getRuleInfo();
    },
    methods: {
        onShare() {
            uniShare(
                {
                    tit: "财神驾到",
                    path: "page-activity/activityDescription/index",
                },
                { id: this.activity.id, index: 0 },
                "https://img.chaoshewang.com/static/img/activity/huodongfx3.png"
            );
        },

        footBtn() {
            let type =
                getApp().globalData.BannerTargetType[this.activity.targetType];
            let id = this.activity.id;
            if (type == 1 && id !== 0)
                this.goto("/pages/product/yifanshang", { id });
            else if (type == 2 && id !== 0) {
                // #ifndef MP-WEIXIN
                this.goto("/pages/product/niudan", { id });
                // #endif
                // #ifdef MP-WEIXIN
                this.downShow = true;
                // #endif
            } else if (type == 3 && id !== 0) {
                // #ifndef MP-WEIXIN
                this.goto("/pages/product/chaowanshang", { id });
                // #endif
                // #ifdef MP-WEIXIN
                this.downShow = true;
                // #endif
            } else if (type == 4 && id !== 0) {
                // #ifndef MP-WEIXIN
                this.goto("/pages/product/dongle", { id });
                // #endif
                // #ifdef MP-WEIXIN
                this.downShow = true;
                // #endif
            } else if (type == 5 && id !== 0) {
                // #ifndef MP-WEIXIN
                this.goto("/pages/product/chaosheshang", { id });
                // #endif
                // #ifdef MP-WEIXIN
                this.downShow = true;
                // #endif
            }
        },
        getRuleInfo() {
            post("v1/system/protocol/get", { key: this.activity.key }).then(
                (res) => {
                    this.cont = res;
                }
            );
        },
    },
};
</script>
<style lang='scss' scoped>
.activityDescription {
    height: 100vh;
    overflow-y: auto;
    background: #fef7d2;
    background-image: url("https://img.chaoshewang.com/static/img/activity/caishen_bg.png");
    background-size: 100% 800rpx;
    background-repeat: no-repeat;
    overflow-y: auto;
}


.Back_ico {
    width: 64rpx;
    height: 64rpx;
}
.ml {
    margin-inline-start: auto;
}

.particulars {
    width: 100%;
    height: 100%;
    padding-top: 570rpx;
    position: relative;
    .title {
        width: 750rpx;
        height: 640rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/caoshen.png");
        background-size: 100% 100%;
        position: absolute;
        top: 0rpx;
    }
    .center {
        width: 574rpx;
        height: 76rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/center.png");
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 686rpx;
        transform: translateX(-50%);
    }
    .everyday {
        width: 702rpx;
        margin: 0 auto;
        height: calc(100% - 0rpx);
        background: linear-gradient(
            180deg,
            #ffcaa8 0%,
            #ffffff 30%,
            #ffffff 100%
        );
        border-radius: 32rpx 32rpx 0 0;
        border: 2rpx solid rgba(255, 255, 255, 0.5);
        padding: 48rpx;
        .header {
            width: 100%;
            margin-bottom: 48rpx;

            .c {
                font-weight: 800;
                font-size: 40rpx;
                line-height: 40rpx;
                background-image: linear-gradient(to top, #b95e1d, #ba3f2c);
                -webkit-background-clip: text;
                color: transparent;
            }
            .r {
                width: 96rpx;
                height: 24rpx;
                background-image: url("https://img.chaoshewang.com/static/img/activity/caishengr.png");
                background-size: 100% 100%;
                margin-left: 32rpx;
            }
            .l {
                width: 96rpx;
                height: 24rpx;
                background-image: url("https://img.chaoshewang.com/static/img/activity/caishenl.png");
                background-size: 100% 100%;
                margin-right: 32rpx;
            }
        }
        .box {
            height: calc(100% - 80rpx);
            overflow: hidden;
            overflow-y: auto;
            font-weight: 500;
            font-size: 28rpx;
            color: #64432f;
        }
    }
    .foot_box {
        position: absolute;
        width: 380rpx;
        height: 80rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/choushangfoot.png");
        background-size: 100% 100%;
        left: 50%;
        transform: translate(-50%);
        bottom: 100rpx;
    }
}
</style>