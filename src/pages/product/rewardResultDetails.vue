<template>
    <view class="rewardResultDetails">
        <div class="details_con" :style="{ paddingTop: padTop }">
            <div class="details">
                <div class="top_tit flex_r flex_ac flex_jb">
                    <div class="l_t">恭喜您抽中</div>
                    <div v-show="!isdemo">赏品已自动放入潮柜</div>
                </div>
                <div class="list">
                    <div class="item flex_c flex_ac flex_jc" v-for="(i, s) in awards" :key="s"
                        @click="ondetail(i.itemId)">
                        <img src="https://img.chaoshewang.com/static/img/cs-result/border.png"
                            v-if="BigAward.includes(i.levelIndex)" class="active" />
                        <div class="border" v-else></div>
                        <img :src="i.coverImage || i.itemCover" class="img" />
                    </div>
                </div>
                <div class="foot_btn flex_r flex_jc">
                    <x-btn txt="确定" @click="confirmBtn" cor="3" />
                </div>
            </div>
        </div>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import xBtn from "@/components/modules/x-btn";
export default {
    data() {
        return {
            Xdata: {},
            awards: [], // 抽到的赏
            BigAward: [1, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
            isdemo: false,
        };
    },
    components: { xBtn },
    computed: {
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + 10 + "px";
        },
    },
    onLoad(da) {
        if (da.isdemo) {
            this.isdemo = da.isdemo;
        } else {
            this.isdemo = false;
        }
    },
    onShow() {
        this.loadAwards();
    },
    methods: {
        loadAwards() {
            this.Xdata = this.$gl("extractAwards");
            this.awards = this.Xdata.da;
        },
        confirmBtn() {
            let that = this;
            uni.$u.route({
                type: "redirect",
                url: that.Xdata.path,
                params: {
                    id: that.Xdata.id,
                    index: that.Xdata.index,
                },
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
    },
};
</script>
<style lang='scss' scoped>
.rewardResultDetails {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);

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

.details_con {
    position: absolute;
    padding: 0 36rpx;
    height: 100vh;
    width: 100%;
    bottom: 0;
    left: 0;
}

.details {
    height: 100%;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    padding: 28rpx 32rpx;

    .top_tit {
        color: #818181;
        font-weight: 500;
        font-size: 24rpx;

        .l_t {
            font-size: 28rpx;
            color: #383228;
            font-weight: bold;
        }
    }

    .list {
        @include grid(200rpx);
        max-height: calc(100% - 50rpx);
        margin-top: 20rpx;
        padding-bottom: 150rpx;
        overflow-y: auto;

        .item {
            width: 200rpx;
            height: 200rpx;
            position: relative;

            .active {
                width: 100%;
                height: 100%;
                animation: breathingLight 3s infinite;
                position: absolute;
                left: 0;
                top: 0;
            }

            .border {
                width: 188rpx;
                height: 188rpx;
                border-radius: 16rpx;
                border: 2rpx solid #cacaca;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .img {
                width: 169rpx;
                height: 169rpx;
                border-radius: 12rpx;
                /* background-color: rgba($color: #9064FF, $alpha: 0.5); */
            }
        }

        @keyframes breathingLight {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.1;
            }

            100% {
                opacity: 1;
            }
        }
    }

    .foot_btn {
        width: 100%;
        position: absolute;
        bottom: 60rpx;
        left: 0;
    }
}
</style>