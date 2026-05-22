<template>
    <view class="agreement">
        <view class="top_Back" @click="gateBack"  v-if="this.urlData">
            <text class="icof Back_ico">&#xe72c;</text>
            <text class="txt">返回</text>
        </view>
        <x-navbar v-else />
        <div class="agreement_con" :style="{ paddingTop: padTop }">
            <div class="agree">
                <div class="parse_box">
                    <div class="parse_con">
                        <u-parse
                            :content="(cont && cont.text) || ''"
                            :selectable="true"
                        ></u-parse>
                    </div>
                </div>
            </div>
        </div>
    </view>
</template>
<script>
import xNavbar from "@/components/modules/x-navbar";
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            agree: {},
            cont: {},
            urlData: "",
        };
    },
    components: { xNavbar },
    computed: {
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + 10 + "px";
        },
    },
    onLoad(da) {
        this.getRuleInfo(da.val||da.key);
        this.urlData = da.urlData || "";
    },
    methods: {
        getRuleInfo(key) {
            post("v1/system/protocol/get", { key }).then((res) => {
                this.cont = res;
            });
        },
        gateBack() {
            this.urlData ="";
            uni.navigateBack({
                delta: 1, // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
         
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.agreement {
    width: 100vw;
    height: 100vh;
    position: relative;
background: #F5F6F8;
    &::after {
        content: "";
        width: 100vw;
        height: 600rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/chaogui/topBg.png');
        background-size: 100% 100%;
      }
}

.agreement_con {
    position: absolute;
    padding: 0 36rpx;
    height: 100vh;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 9;
}

.agree {
    height: 100%;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    padding: 28rpx 32rpx;

    .tit {
        font-weight: 800;
        font-size: 36rpx;
        text-align: center;
    }

    .time {
        color: #7f7a88;
        font-weight: 500;
        font-size: 24rpx;
        text-align: center;
        margin: 20rpx 0 40rpx;
    }

    .parse_box {
        height: calc(100% - 110rpx);
        overflow-y: auto;
        .parse_con {
            padding-bottom: 50rpx;
        }
    }
}
.top_Back {
     position: absolute;
    color: #1c1c1c;
    top: 50rpx;
    z-index: 999;
    
    text {
        vertical-align: middle;
    }

    .Back_ico {
        font-size: 50rpx;
        margin-right: 8rpx;
    }

    .txt {
        font-size: 36rpx;
    }
}
</style>