<template>
    <view class="chaowanshang">
        <view class="topBack">
            <img src="https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png" @click.stop="gateBack"
                class="Back_ico" />
            <text class="title" v-if="!Object.keys(types).length">{{ message.name }}</text>
            <!--  #ifndef MP-WEIXIN -->
            <view class="share" @click="onShare" v-if="!Object.keys(types).length"></view>
            <!-- #endif -->
        </view>
        <view class="ocean" :style="{ backgroundImage: `url(${imageUrlMap.bg})` }">
            <view class="particulars">
                <view v-if="stock !== -1 && !Object.keys(types).length" class="banner-limited"
                    :style="{ backgroundImage: `url(${imageUrlMap.ticketNum})` }">限时领取总数：{{ stock }}张</view>
                <img class="rule" :src="imageUrlMap.rule"
                    @click="goto('/pages/common/rulepop', { val: Object.keys(types).length ? 'ChaoyouRules' : 'CostGiftCouponSummaryDiscount' })" />
                <view class="center">
                    <view class="time cn" v-if="Object.keys(message).length" :style="{ color: colorList.time }"> {{message.startTime }} - {{ message.endTime }}</view>
                    <view class="number-box cn" :style="{ color: colorList.centre }" v-if="!Object.keys(types).length">
                        <view class="nums_left">{{ typeName }}可领:{{ cnt }} </view>
                        <view class="nums_right">已领取: {{ receivedCnt }}张</view>
                    </view>
                    <view class="progress-container cn" v-if="Object.keys(types).length">
                        <view class="progress-track">
                            <view class="progress-bar" :style="{ width: currentAmount * (490 / total) + 'rpx' }"></view>
                        </view>
                        <div class='pop' :style="popWidth">
                            <div class='pop_text'>{{ Math.floor(currentAmount) }}</div>
                            <div class='triangle-bottom'></div>
                        </div>
                        <!-- 动态渲染宝箱，通过数据计算left -->
                        <view v-for="(chest, index) in chestList" :key="chest.cellId"
                            class="chest-point flex_c  flex_ac"
                            :style="{ left: `${(chest.flowAmount / total) * 100}%`, top: `${-topBor}rpx` }">
                            <view class="chest-node " :class="{ 'node': chest.flowAmount <= currentAmount }"></view>
                            <view class="chest-text">{{ chest.flowAmount }}</view>
                            <view class="chestBg " v-for="awards in chest.awards" :key="awards.id"
                                :class="{ active: awards.open }" @click="getChest(awards, chest)">
                                <img class="chest-icon " :class="{ 'dx': openId == awards.id }"
                                    :src="`https://img.shinemang.com/gachaStatic/static/img/activity/${chest.cellTypeName}.png`" />
                            </view>
                            <img class="chest-get" v-if="chest.awards[0].open && index == 0"
                                src="https://img.shinemang.com/gachaStatic/static/img/activity/chest_get.png" />
                        </view>
                    </view>
                    <view v-else>
                        <view class="progress-view flex_js cn" :style="{
                            background: colorList.bg,
                            border: `4rpx solid ${colorList.border}`,
                        }">
                            <view style="height: 100%">
                                <view class="progress"
                                    :style="{ width: currentAmount * (502 / amountLimit) + 'rpx', background: gradientBg }">
                                </view>
                            </view>
                            <view class="progress-text" :style="{ color: colorList.text }">{{ currentAmount }}/{{
                                amountLimit }}</view>
                        </view>
                        <!-- <img class="get cn" :src="cnt > 0 ? imageUrlMap.button_open : imageUrlMap.button_close"
                            @click="getChK" /> -->
                        <img class="get cn" :src="state == 0 ? imageUrlMap.button_open : imageUrlMap.button_close"
                            @click="getInquire" />
                    </view>
                    <view v-if="Object.keys(types).length" class="numss_right nums_right">已领取: {{ receivedCnt }}张
                    </view>
                </view>
                <view class="attention" :style="{
                    color: colorList.attention,
                    background: colorList.attentionBg,
                }">
                    <view class="titleBox">
                        <view class="l" :style="border2"> </view>
                        <view class="title">注意事项 </view>
                        <view class="l" :style="border1"> </view>
                    </view>
                    <view class="text">
                        1.公司有权根据实际情况对活动规则进行必要的调整或解释，以确保活动的公平、公正和顺利进行。<br />2.用户参与活动时需遵守潮社APP的相关规定和法律法规要求，不得采用任何不正当手段参与活动或获取奖励。例大小号互绑/家人号互绑/机刷用户互绑、佣金邀新等违规方法邀新，将无法获得奖励。对于违规行为，潮社文化传播公司有权取消用户的参与资格及已获得的奖励。
                    </view>
                </view>
            </view>
        </view>
        <xPrize ref="refPrize" :prize="prize" @showPrize="onVisible" />
    </view>
</template>
<script>
// 欢乐福利池带进度条
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            state: null,//0:可领取 1:不可领取
            message: {
                id: "",
                startTime: '',
                endTime: '',
                phaseId: null
            },
            cnt: 0, //未领取
            receivedCnt: 0, //已领取
            currentAmount: 0, //累计金额
            amountLimit: 0, //达标金额
            colorList: {
                // time: "#FFFFFF", //时间
                // centre: "#FFF7DE", //优惠卷文字 
                // border: "rgba(255,255,255,0.5)", //进度条边框
                // bg: "#FFCD4A", //进度条背景 
                // bg1: "#FFCD77", //已完成进度条渐变 
                // bg2: "#FF6756", //已完成进度条渐变 
                // bg3: "#F21C35", //已完成进度条渐变
                // text: "#fff", //进度条文字颜色 
                // attention: "#830404", //活动说明
                // attentionBg:'#EF927B',//注意事项背景
            },
            border1: {},
            border2: {},
            imageUrlMap: {
                // bg: "", //大背景
                // button_close: "", //不可领取状态按钮
                // button_open: "", //可领取状态按钮
                // rule: "", //规则
                // share: "", //分享
            },
            stock: 0,//限量优惠券剩余数量
            types: {},
            typeName: '优惠券',
            total: 1000,
            chestList: [],
            prize: {
                width: 550,
                height: 752,
                imgWidth: 320,
                imgHeight: 320,
                bg: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_tc.png",
                btn: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_an.png",
            },
            prizeItems: [{ thumb: '', name: '' }],
            openId: null,
            debounceTimer: null,
            popWidth: 0,
            topBor: 6,
        };
    },
    components: { xPrize },
    watch: {
        currentAmount(newVal) {
            if (Object.keys(this.types).length) {
                /* #ifdef APP-PLUS */
                this.topBor = plus.os.name == 'iOS' ? 4 : 6
                /* #endif */
                this.$nextTick(() => { // 确保 DOM 已更新
                    this.calculateBoxSize();
                });
            }
        }
    },
    computed: {
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top;
            let str = h - th + "px";
            return str;
        },
        gradientBg() {
            return `linear-gradient(90deg, ${this.colorList.bg1} 0%, ${this.colorList.bg2} 50%,${this.colorList.bg3} 100%) `;
        },
    },
    onLoad(da) {
        this.message.id = da.id;
        if (da.gacha_id) {
            this.types = da
            this.imageUrlMap = {
                bg: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_bg1.png", //大背景
                button_close: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_get.png", //不可领取状态按钮
                button_open: "https://img.shinemang.com/gachaStatic/static/img/activity/chq_btn.png", //可领取状态按钮
                rule: "https://img.shinemang.com/gachaStatic/static/img/activity/gz.png", //规则
            }
            this.colorList = {
                time: "#E97102", //时间
                centre: "#E97102", //优惠卷文字
                border: "#FA9C00", //进度条边框
                bg: "#FFC62F", //进度条背景
                bg1: "#FCD900", //已完成进度条渐变
                bg2: "#FF7B4C", //已完成进度条渐变
                bg3: "#FF524B", //已完成进度条渐变
                text: "#fff", //进度条文字颜色
                attention: "#E38E00", //活动说明
                attentionBg: '#FCD399',//注意事项背景
            }

        }
    },
    onShow() {
        if (Object.keys(this.types).length) {
            this.getChq()
            return
        }
        this.onInquire();
    },
    created() { },
    mounted() { },
    methods: {
        onShare() {
            uniShare(
                {
                    tit: this.message.name,
                    path: "page-activity/ocean/index",
                },
                { id: this.message.id, index: 0 },
                this.imageUrlMap.share
            );
        },
        async onInquire() {
            let a = await activityLIst({ key: ["CostGiftCouponSummary"] });
            this.message = a.activities[0];
            this.message.startTime = this.monthAndndDay(a.activities[0].startTime);
            this.message.endTime = this.monthAndndDay(a.activities[0].endTime);
            if (!Object.keys(this.colorList).length) {
                this.colorList = a.activities[0].paramsMap;
                this.border1 = {
                    border: "2px solid transparent",
                    borderImage: `linear-gradient(90deg, ${this.colorList.attention} ,rgba(227, 142, 0, 0))2 2 `,
                };
                this.border2 = {
                    border: "2px solid transparent",
                    borderImage: `linear-gradient(90deg ,rgba(227, 142, 0, 0), ${this.colorList.attention})2 2 `,
                };
            }
            if (!Object.keys(this.imageUrlMap).length)
                this.imageUrlMap = a.activities[0].imageUrlMap;
            post("v1/activity/cost-gift-coupon-summary").then((res) => {
                if (!res.code) {
                    let {
                        state,
                        cnt,
                        receivedCnt,
                        residueAmount,
                        amountLimit,
                        stock
                    } = res;
                    this.state = state;
                    this.cnt = cnt;
                    this.receivedCnt = receivedCnt;
                    this.currentAmount = residueAmount || 0;
                    this.amountLimit = amountLimit || 0;
                    this.stock = stock
                }
            });
        },
        getInquire() {
            if (this.state == 0) {
                post("v1/activity/cost-gift-coupon-summary/accept").then(
                    (res) => {
                        if (!res.code) {
                            uni.$u.toast("您已领取成功~");
                        } else {
                            uni.$u.toast(res.message);
                        }
                        this.onInquire();
                    }
                );
                return;
            } else if (this.state == 1) uni.$u.toast("您已领取~");
            else uni.$u.toast("您尚未达到领取条件~");
        },
        getChq() {
            post("v1/activity/chaoyou", this.types).then((res) => {
                if (!res.code) {
                    this.message.startTime = this.monthAndndDay(res.startTime, 1);
                    this.message.endTime = this.monthAndndDay(res.endTime, 1);
                    this.message.phaseId = res.phaseId
                    this.currentAmount = res.historyFlowAmount //累计金额
                    this.receivedCnt = res.historyCount;
                    this.total = Math.max(...res.cell.map(item => item.flowAmount));
                    res.cell.map(item => {
                        if (item.flowAmount <= this.currentAmount) {
                            item.cellTypeName = item.cellTypeName + 1
                            item.awards[0].open = true
                        } else item.awards[0].open = false
                    })
                    this.chestList = res.cell
                }
            });
        },
        getChK(id) {
            post("v1/activity/chaoyou/claim", { phase_id: this.message.phaseId, cell_id: id }).then((res) => {
                if (!res.code) {
                    this.$refs.refPrize.open(res.awards);
                    this.openId = null;
                } else uni.$u.toast(res.message);
            });
        },
        getChest(item, va) {
            if (!item.open) return;
            if (this.openId) return
            this.openId = item.id;
            setTimeout(() => {
                va.cellTypeName = va.cellTypeName.slice(0, -1) + 2;
                this.getChK(va.cellId);
            }, 1000);
        },
        onVisible() {
            this.getChq()
        },
        calculateBoxSize() {
            const query = uni.createSelectorQuery().in(this);
            if (!query) return;
            query.selectAll('.pop').boundingClientRect(data => {
                const w = this.currentAmount * (490 / this.total)
                if (w > 490) {
                    this.popWidth = { right: -data[0].width + 5 + 'rpx' }
                } else if (w > 490 - data[0].width) {
                    this.popWidth = { right: 490 - w - data[0].width + 'rpx' }
                } else {
                    this.popWidth = { left: w - data[0].width + 'rpx' }
                }
            }).exec();
        }

    },
};
</script>
<style lang="scss">
.notice-bar {
    .u-notice-bar {
        padding: 0 36rpx !important;
    }
}
</style>
<style lang='scss' scoped>
.chaowanshang {
    height: 100vh;
    overflow-y: auto;
}


.ocean {
    width: 100%;
    background-size: 100% 100%;
    height: 1744rpx;
}

.Back_ico {
    width: 50rpx;
    height: 50rpx;
    margin-right: 50rpx;
}

.title {
    height: 50rpx;
    line-height: 50rpx;
}

.share {
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/fenx.png");
    background-size: 100% 100%;
    margin-left: auto;
    width: 48rpx;
    height: 48rpx;
}

.particulars {
    width: 100%;
    height: 100%;
    position: relative;

    .banner-limited {
        position: absolute;
        width: 518rpx;
        height: 56rpx;
        line-height: 56rpx;
        background-size: 100% 100%;
        font-weight: 800;
        font-size: 32rpx;
        color: #FFFFFF;
        text-align: center;
        top: 388rpx;
        left: 50%;
        transform: translateX(-50%);


    }


    .btns_2 {
        left: 19rpx;
        top: 360rpx;
        padding: 0;
        background-color: rgba($color: #000, $alpha: 0);

        &::after {
            border: none;
        }

        image {
            width: 72rpx;
            height: 72rpx;
        }
    }

    .t_btn {
        width: 72rpx;
        height: 72rpx;
        position: absolute;
    }

    .rule {
        width: 50rpx;
        height: 102rpx;
        position: absolute;
        right: 0;
        top: 320rpx;
    }

    .center {
        width: 100%;
        height: 868rpx;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 420rpx;

        .time {
            width: 100%;
            font-size: 28rpx;
            text-align: center;
            position: absolute;
            top: 74rpx;
        }

        .number-box {
            width: 502rpx;
            height: 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: absolute;
            bottom: 218rpx;

            .nums_left {
                font-weight: 800;
                font-size: 28rpx;
                line-height: 33rpx;
            }


        }

        .get {
            display: block;
            margin: 46rpx auto 0;
            width: 366rpx;
            height: 132rpx;
            position: absolute;
            bottom: 0rpx;
        }

        .progress-view {
            width: 502rpx;
            height: 32rpx;
            margin: 0 auto;
            border-radius: 18rpx;
            overflow: hidden;
            position: absolute;
            bottom: 178rpx;


            .progress {
                max-width: 502rpx;
                height: 28rpx;
                border-radius: 40rpx;
            }

            .progress-text {
                font-weight: bold;
                font-size: 24rpx;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .cn {
            left: 50%;
            transform: translateX(-50%);
        }

        .progress-container {
            position: absolute;
            width: 490rpx;
            top: 666rpx;

            .progress-track {
                // width: 490rpx;
                height: 24rpx;
                background: #FFC62F;
                border-radius: 18rpx;
                box-sizing: border-box;
                border: 4rpx solid #FA9C00;
                overflow: hidden;

                .progress-bar {
                    height: 100%;
                    background: #F24900;
                    border-radius: 14rpx;
                    transition: width 0.3s ease;
                }
            }

            .chest-point {
                // width: 490rpx;
                position: absolute;
                top: -6rpx;
                transform: translateX(-50%);
                text-align: center;


                .chest-node {
                    width: 24rpx;
                    height: 32rpx;
                    background: #FFEA94;
                    border-radius: 12rpx;
                    box-sizing: border-box;
                    border: 4rpx solid #FA9C00;
                    margin-bottom: 8rpx;
                }

                .chest-text {
                    min-width: 100rpx;
                    font-weight: bold;
                    font-size: 20rpx;
                    color: transparent;
                    -webkit-text-stroke: 1px #E97102;

                }

                .node {
                    background: #F24900;
                }

                .chestBg {
                    position: absolute;
                    top: 35rpx;
                    width: 124rpx;
                    height: 124rpx;

                    &.active {
                        width: 124rpx;
                        height: 124rpx;
                        background: url("https://img.shinemang.com/gachaStatic/static/img/activity/light.png");
                        background-size: 100% 100%;
                    }

                    .chest-icon {
                        width: 92rpx;
                        height: 92rpx;
                        margin: 0 auto;
                        padding: 16rpx;
                    }

                    .dx {
                        animation: zy 1s 0.15s linear infinite;
                        -moz-animation: zy 1s 0.15s linear infinite;
                        -webkit-animation: zy 1s 0.15s linear infinite;
                        -o-animation: zy 1s 0.15s linear infinite;
                    }

                    @keyframes zy {
                        10% {
                            transform: rotate(15deg);
                        }

                        20% {
                            transform: rotate(-10deg);
                        }

                        30% {
                            transform: rotate(5deg);
                        }

                        40% {
                            transform: rotate(-5deg);
                        }

                        50% {
                            transform: rotate(15deg);
                        }

                        100% {
                            transform: rotate(0deg);
                        }
                    }
                }


                .chest-get {
                    position: absolute;
                    width: 124rpx;
                    height: 42rpx;
                    bottom: -112rpx;
                }
            }

            .pop {
                min-width: 80rpx;
                object-fit: cover;
                height: 40rpx;
                background: #FFEA94;
                border-radius: 12rpx;
                border: 4rpx solid #FA9C00;
                font-weight: bold;
                font-size: 20rpx;
                position: absolute;
                top: -45rpx;
                color: #E97102;
                text-align: center;
                padding: 0 10rpx;

                .triangle-bottom {
                    width: 0;
                    height: 0;
                    border-top: 10rpx solid #FA9C00;
                    border-left: 10rpx dashed transparent;
                    border-right: 10rpx dashed transparent;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -10rpx;
                }

                .pop_text {
                    width: 100%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);

                }
            }


        }

        .numss_right {
            position: absolute;
            color: #E97102;
            bottom: 0;
            right: 120rpx;
        }


    }

    .nums_right {
        font-weight: 400;
        font-size: 24rpx;
        line-height: 32rpx;
        margin-left: auto;
    }

    .nums_right {
        font-weight: 400;
        font-size: 24rpx;
        line-height: 32rpx;
        margin-left: auto;
    }


    .attention {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 686rpx;
        height: 350rpx;
        bottom: 0rpx;
        border-radius: 16rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;

        .titleBox {
            display: flex;
            width: 100%;
            height: 40rpx;
            align-items: center;
            justify-content: center;

            .l {
                width: 60rpx;
                height: 0;
                border: 2rpx solid;
            }

            .title {
                width: 112rpx;
                font-weight: 800;
                font-size: 28rpx;
                margin: 0 20rpx 0;
            }
        }

        .text {
            height: 40rpx;
            line-height: 40rpx;
            font-weight: 500;
            font-size: 24rpx;
            margin-bottom: 40rpx;
        }
    }
}
</style>