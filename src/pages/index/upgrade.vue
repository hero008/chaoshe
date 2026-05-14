<template>
    <view class="upgrade-popup">
        <view class="header">
            <image
                class="header-bg"
                src="@/static/login/update.png"
                mode="widthFix"
            ></image>
            <view class="title">发现新版本</view>
            <view class="version">{{ versionName }}</view>
            <view class="bj" />
        </view>
        <view class="main">
            <view class="content">
                <div class="desc" v-for="(item, key) in list" :key="key">
                    {{ item }}
                </div>
            </view>
            <!-- 强制更新  -->
            <view
                class="footer"
                @click="handleUpgrade"
                v-show="isStartDownload == 1"
            >
                <view class="btn">立即升级</view>
            </view>
            <!--下载状态-进度条显示 "-->
            <view class="footer" v-show="isStartDownload == 2">
                <view class="btn btn1">正在升级</view>
                <view class="progresss flex_ac flex_jc">
                    <view class="txt">更新中</view>
                    <view class="progress-view flex_js">
                        <view style="height: 100%">
                            <view class="progress" :style="setProStyle"></view>
                        </view>
                    </view>
                    <view class="txt">{{ percentText }}</view>
                </view>
            </view>
            <view
                class="footer"
                v-show="isStartDownload == 3"
                @click="handleInstallApp"
            >
                <view class="btn">升级完成</view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            versionName: "", //版本名称
            isDownloadFinish: false, //是否下载完成
            hasProgress: true, //是否能显示进度条
            currentPercent: 0, //当前下载百分比
            isStartDownload: 1, //是否开始下载
            list: [],
        };
    },
    computed: {
        //设置进度条样式，实时更新进度位置
        setProStyle() {
            return {
                width: (246 * this.currentPercent) / 100 + "rpx", //510：按钮进度条宽度
            };
        },
        //百分比文字
        percentText() {
            let percent = this.currentPercent;
            if (percent < 100) return `${percent}%`;
        },
    },
    onLoad(e) {
        let userInfo = JSON.parse(decodeURIComponent(e.info));
        this.list = userInfo.versionText.text;
        this.versionName = userInfo.versionText.version;
    },
    mounted() {},
    methods: {
        //更新
        handleUpgrade() {
            this.isStartDownload = 2;
            let downloadTask = uni.downloadFile({
                url: "https://img.chaoshewang.com/download/chaoshe.wgt",
                success: (downloadResult) => {
                    plus.runtime.install(downloadResult.tempFilePath, {
                        force: true,
                    });
                },
            });
            downloadTask.onProgressUpdate((res) => {
                // 显示进度条
                this.hasProgress = true;
                // 进度
                this.currentPercent = res.progress;
                if (res.progress == 100) {
                    //下载完成
                    this.isStartDownload = 3;
                }
            });
        },

        //关闭返回
        handleInstallApp() {
            if (this.isStartDownload == 3) {
                plus.runtime.restart();
                this.isStartDownload == 1;
            }
        },
    },
};
</script>
<style>
page {
    background: rgba(0, 0, 0, 0.5);
    /**设置窗口背景半透明*/
}
</style>
<style lang="scss" scoped>
.upgrade-popup {
    width: 542rpx;
    height: 880rpx;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20rpx;
    box-sizing: border-box;
    font-family: PingFang SC, PingFang SC;

    .header {
        position: relative;
        font-weight: 800;
        .header-bg {
            width: 100%;
            height: 484rpx;
        }

        .title {
            position: absolute;
            bottom: 80rpx;
            font-size: 56rpx;
            background-image: linear-gradient(to right, #4a6ee9, #c171ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            transform: translateY(-50%);
            text-align: center;
            width: 100%;
        }

        .version {
            position: absolute;
            bottom: 40rpx;
            transform: translateY(-50%);
            width: 100%;
            font-size: 36rpx;
            text-align: center;
            font-style: normal;
            text-transform: none;
            background-image: linear-gradient(to right, #4a6ee9, #c171ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }

        .bj {
            position: absolute;
            width: 100%;
            height: 44rpx;
            bottom: -2rpx;
            background: #fff;
        }
    }

    .main {
        padding: 0 30rpx;
        width: 100%;
        height: 392rpx;
        background: #fff;
        border-radius: 0rpx 0px 40rpx 40rpx;

        .content {
            width: 100%;
            height: 250rpx;
            border-radius: 10rpx;
            overflow-y: auto;
            z-index: 1;
            padding-top: 10rpx;
            .desc {
                font-weight: 500;
                font-size: 32rpx;
                color: #383228;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }
        }

        .footer {
            width: 100%;
            display: flex;
            flex-direction: column;

            // .btn {
            //     width: 270rpx;
            //     height: 112rpx;
            //     margin: 0 auto;
            // }
            .btn {
                width: 230rpx;
                height: 72rpx;
                margin: 0 auto 8rpx;
                text-align: center;
                line-height: 72rpx;
                font-size: 28rpx;
                color: white;
                border-radius: 50px;
                background: linear-gradient(180deg, #9181e5 0%, #6e5bd2 100%);
                box-shadow: 0 0 0 4px rgba(145, 129, 229, 0.5);
            }

            .btn1 {
                background: #a69ae7;
                box-shadow: 0 0 0 4px #d3cdf5;
            }
            // .btn1 {
            //     margin: 0 auto;
            //     width: 246rpx;
            //     height: 88rpx;
            // }

            .progresss {
                display: flex;
                height: 36rpx;
                width: 100%;

                .progress-view {
                    width: 246rpx;
                    height: 16rpx;
                    background: rgba(131, 92, 224, 0.2);
                    border-radius: 8rpx;
                    display: flex;

                    box-sizing: border-box;
                    overflow: hidden;
                    margin: 0 16rpx;

                    &.active {
                        background-color: #835ce0;
                    }

                    .progress {
                        height: 100%;
                        background-color: #835ce0;
                        padding: 0px;
                        box-sizing: border-box;
                        border: none;
                        border-radius: 8rpx;
                    }
                }

                .txt {
                    color: #835ce0;
                }
            }
        }
    }
}
</style>