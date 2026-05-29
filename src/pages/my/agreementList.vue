<template>
    <view class="agreementList" :style="{ paddingTop: MBInfo().top + 'px'  }">
        <div  :style="{ height: MBInfo().height + 'px' }" class="navbar_x flex_r flex_jb flex_ac">
            <view class="top_Back" @click.stop="gateBack">
                <text class="icof Back_ico">&#xe72c;</text>
                <text class="txt">关于我们</text>
            </view>
        </div>
        <div :style="{ height: conHeight }" class="agr_con" v-if="tab == 1">
            <div class="agr_list">
                <div class="agr_item flex_r flex_ac flex_jb" v-for="(i, s) in list" :key="s"
                    @click="onClickGoto(i.key)">
                    <div class="agr_tit">{{ i.name }}</div>
                    <div class="icof">&#xe72b;</div>
                </div>
                <!-- <div class="agr_item flex_r flex_ac flex_jb">
                    <div class="agr_tit">ICP备案</div>
                    <div class="a_text">
                        <div @click="copyToClipboard(text)" class="icof_txt">{{ text }}</div>
                        <a class="icof" href="https://beian.miit.gov.cn/" target="_blank">&#xe72b;</a>
                    </div>
                </div> -->
            </div>
            <div class="msg">
                <!-- <div class="p">芒星赏文化传播(深圳)有限公司版权所有</div> -->
            </div>
        </div>
        <view class="shake flex_r flex_jb flex_ac" v-else>
            <view>手机震动</view>
            <u-switch v-model="vibration" :size="18" inactiveColor="#31E597" @change="switchChange"></u-switch>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            tab: 1,
            list: [
                { name: "隐私政策", key: { val: 'PrivacyClause' } },
                { name: "用户服务协议", key: { val: 'UserAgreement' } },
                // #ifndef MP-WEIXIN
                { name: "集市服务协议", key: { val: 'MarketAgreement' } },
                // #endif
                // { name: "营业执照", key: { val: 'BusinessLicense' } },
                { name: "概率公正", key: { val: 'SystemProbabilityDetection' } },
            ],
            // #ifndef MP-WEIXIN
            text: '粤ICP备2023103620号-3A', // app
            // #endif
            // #ifdef MP-WEIXIN
            text: '粤ICP备2023103620号-5X', // 微信小程序
            // #endif
            vibration: true,

        };
    },
    computed: {
        padTop() {
            let da = this.MBInfo();
            
            return da.top  + "px";
        },
    },
    onLoad(da) {
        this.tab = da.id
        if (da.id == 2) {
            let v = uni.getStorageSync("vibration")
            this.vibration =  v ?? true  
            uni.setStorageSync('vibration', v);
        }

    },
     computed: {
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 10+20;
            let str = h - th + "px";
            return str;
        },
    },
    methods: {
        onClickGoto(key) {
            this.goto('/pages/common/rulepop', key)
        },
        copyToClipboard(value) {
            uni.setClipboardData({
                data: value + '', //	这里是个坑接受字符串类型 value转化为字符串
                success: function () {
                }
            })
        },
        switchChange(e) {
            let message = ''
            if (e) message = '开启震动'
            else message = '关闭震动'
            uni.setStorageSync('vibration', e);
            uni.$u.toast(message);

        }

    },
};
</script>
<style lang='scss' scoped>
a {
    text-decoration: none !important;
}

.agreementList {
    width: 100vw;
    height: 100vh;
    position: relative;
      background-color: #F5F6F8;
        
}

.navbar_x {
    padding: 0 36rpx;
    position: relative;
    z-index: 2;

    .btn_r {
        width: 162rpx;
        height: 46rpx;
    }
}

.top_Back {
    color: #1c1c1c;

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

.agr_con {
    padding: 30rpx 0rpx;
    position: relative;
    margin-top: 34rpx;
    z-index: 2;
    height: calc(100% - 92rpx);
    background-color: #fff;

    border-radius: 32rpx 32rpx 0 0;

    .agr_list {
        background-color: #fff;
        border-radius: 16rpx;
        padding: 0 32rpx;
    }

    .agr_item {
        padding: 32rpx 0;
        font-weight: 500;
        font-size: 28rpx;
        color: #1A1A1A;
        // border-bottom: 2rpx solid #e2e1e3;

        &:last-child {
            border-bottom: none;
        }

        .icof {
            font-size: 40rpx;
            color: #B3B3B3;

        }

        .a_text {
            display: flex;
            align-items: center;
        }

        .icof_txt {
            font-size: 26rpx;
            color: darkgray;
            padding-right: 10rpx;
        }
    }

    .msg {
        margin-top: 40rpx;
        font-size: 24rpx;
        color: #736B5A;
        line-height: 38rpx;
        text-align: center;
    }
}

.hi_progress {
    width: 100%;
    padding: 0 32rpx;
    position: fixed;
    bottom: 60rpx;
    left: 0;

}

.shake {
    width: 686rpx;
    height: 108rpx;
    background: #FFFFFF;
    border-radius: 16rpx;
    margin: 64rpx auto;
    padding: 24rpx;
    font-weight: 500;
    font-size: 28rpx;
    color: #383228;
}
</style>