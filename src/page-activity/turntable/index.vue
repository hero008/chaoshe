    <!-- 活动 -->
<template>
    <view>
        <view
            v-if="Object.keys(tiem).length"
            class="ticket"
            :style="[
                {
                    pointerEvents: noClick ? 'auto' : 'none',
                    backgroundImage: `url(${imgList.bg})`,
                },
            ]"
        >
            <view class="topBack">
                <img
                    src="https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png"
                    @click.stop="gateBack"
                    class="Back_ico"
                />
                <text class="title">{{ tiem.activities[0].name }}</text>
                <!--  #ifndef MP-WEIXIN -->
                <view class="share" @click="onShare"></view>
                <!-- #endif -->
            </view>
            <view class="particulars">
                <view
                    class="rule"
                    :style="{ backgroundImage: `url(${imgList.record})` }"
                    @click="getRewardHistory"
                ></view>
                <view class="turntableTitle_box">
                    <view
                        class="turntableTitle"
                        :style="{
                            backgroundImage: `url(${imgList.title})`,
                        }"
                    ></view>
                </view>
                <view
                    class="anniu_box flex_r"
                    :class="[prizeList.length > 2 ? '' : 'flex_jc']"
                >
                    <view
                        v-for="(i, s) in prizeList"
                        :key="s"
                        class="anniu0"
                        :class="{ active: cut !== i.index }"
                        :style="{
                            color: `${
                                cut !== i.index
                                    ? colorList.btn1
                                    : colorList.btn2
                            }`,
                            backgroundImage: `url(${
                                cut == i.index
                                    ? imgList.button_checked
                                    : imgList.button
                            })`,
                        }"
                        @click="onClickCut(i)"
                        >{{ i.name }}</view
                    >
                </view>
                <view
                    class="time_box2"
                    :style="{ color: colorList.time, background: gradientBg }"
                    v-if="JSON.stringify(this.tiem) !== '{}'"
                    >活动时间：{{
                        tiem.activities[0].startTime.slice(0, 10) || ""
                    }}
                    -
                    {{ tiem.activities[0].endTime.slice(0, 10) || "" }}</view
                >
                <view
                    class="get"
                    :style="{
                        backgroundImage: `url(${imgList.prize_wheel})`,
                        color: colorList.text,
                    }"
                >
                    <view class="show_dialer">
                        <l-dialer
                            :prizeList="cutObj.award"
                            @click="$noMultipleClicks(onClickIndex)"
                            @done="onDone"
                            ref="dialer"
                            :styleOpt="styleOpt"
                            :duration="2"
                            :btnImg="imgList.button_draw"
                            :pointerStyle="pointerStyle"
                            dial-style="width: 520rpx;height: 520rpx"
                            :key="cutObj.index"
                            :forbid="forbid"
                        />
                    </view>
                    <view
                        class="number_box"
                        v-if="
                            !['PointType_Free', 'PointType_Disable'].includes(
                                cutObj.pointType
                            )
                        "
                        :style="{ color: colorList.text }"
                        >{{
                            cutObj.pointType == "PointType_Coin"
                                ? "支付 "
                                : "消耗 "
                        }}
                        <span
                            class="number"
                            :style="{ color: colorList.number }"
                            >{{ cutObj.point }}
                        </span>
                        {{
                            cutObj.pointType == "PointType_Coin"
                                ? "元"
                                : cutObj.pointTypeName
                        }}
                    </view>
                    <view class="number_box" v-else>{{
                        cutObj.pointTypeName
                    }}</view>
                    <view
                        class="time_box1"
                        v-if="
                            ![
                                'PointType_Free',
                                'PointType_Coin',
                                'PointType_Disable',
                            ].includes(cutObj.pointType)
                        "
                        >我的{{ cutObj.pointTypeName }}：{{
                            cutObj.price
                        }}</view
                    >
                    <view
                        class="time_box1"
                        v-if="
                            ['PointType_Free', 'PointType_Coin'].includes(
                                cutObj.pointType
                            )
                        "
                        >{{ cutObj.pointTypeName }}：1次/天</view
                    >
                </view>

                <view class="attention">
                    <view class="title_box">
                        <view class="r"> </view>
                        <view class="title">活动规则 </view>
                        <view class="r"> </view>
                    </view>
                    <view class="text" :style="{ color: colorList.attention }">
                        <u-parse
                            :content="(cont && cont.text) || ''"
                            :selectable="true"
                        ></u-parse
                    ></view>
                    <view class="text1"
                        >本活动解释权归芒盒娱乐文化官方所有</view
                    >
                </view>
            </view>
            <!-- 中赏记录 -->
            <draw-log-else ref="drawLog" :drawType="4" />
        </view>
        <x-pay @success="getPay" ref="xPay" mtype="12" :probabilityShow=[]   />
        <xPrize ref="refPrize" :prize="prize" @showPrize="onVisible" />
    </view>
</template>
<script>
// 摩天轮转盘
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import drawLogElse from "@/pages/product/modules/drawLogElse.vue";
import xPay from "@/components/x-pay/index.vue";
import { mapMutations, mapActions } from "vuex";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            state: null,
            money: 0,
            message: { id: "" },
            prizeList: [],
            tiem: {},
            styleOpt: {},
            forbid: "a",
            pointerStyle: " opacity: 1",
            cut: null,
            cutObj: {},
            cont: {},
            noClick: true, //防抖挂载
            noClickTime: 3000, //防抖挂载
            imgList: {
                bg: "", //大背景
                button: "", //未选中按钮
                button_checked: "", //选中按钮
                button_draw: "", //点击抽奖按钮
                prize_wheel: "", //摩天轮
                share: "", //分享小程序显示图片
                title: "", //活动标题
                record: "", //
                visibleTitle: "", //弹窗图片
                close: "", //弹窗关闭按钮
                heeler: "", //收下按钮
            },
            colorList: {
                // btn1: "#000000", //未选中
                // btn2: "#fffda1", //选中
                // time: "#000000", //时间
                // timeBg1: "rgba(255, 229, 0, 0.5)", //时间背景
                // timeBg2: "rgba(255, 255, 255, 0.5)", //时间背景
                // timeBg3: "rgba(255, 66, 60, 0.5)", //时间背景
                // border: "#edca8c", //转盘边框
                // bg1: "#F8AFB0", //转盘背景1
                // bg2: "#FAD0D1", //转盘背景2
                // text: "#fff", //状态文字颜色
                // attention: "#383228", //活动说明
                // turntableText:'#E10000',//转盘文字
                // number:'#FED88A',//使用额度
                // visibleBg: "#ff9b9b",//弹框背景色
                // visibleBg1: "#ffffff",//弹框背景色
                // visibleBg2: "#ffffff",//弹框背景色
                // visibleTitle: "#9320e3",//弹框头部字体颜色
                // name: "#383228",//商品名称
                // visibleBtn:'#fff',//弹框按钮文字
                // title: "#000",//文字
            },
            prize: {
                width: 646,
                height: 764,
                imgWidth: 240,
                imgHeight: 240,
                bg: "",
                btn: "",
            },
            prizeItems: [],
        };
    },
    components: {
        drawLogElse,
        xPay,
        xPrize,
    },
    watch: {},
    computed: {
        gradientBg() {
            return `linear-gradient(91deg, ${this.colorList.timeBg1} 20%, ${this.colorList.timeBg2} 70%,${this.colorList.timeBg3} 100%) `;
        },
        visibleBg() {
            return `linear-gradient(180deg, ${this.colorList.visibleBg} 0%, ${this.colorList.visibleBg1} 60%,${this.colorList.visibleBg} 100%) `;
        },
    },
    onLoad(da) {
        this.message.id = da.id;
    },
    // onShow页面显示时调用(启动/页面从隐藏到启动)，可调用多次。
    onShow() {},
    created() {},
    mounted() {
        this.getList();
        this.getRuleInfo();
    },
    methods: {
        ...mapActions(["asyncUpBalance"]),
        ...mapMutations(["UppayMessage"]),
        onDone() {
            this.$refs.refPrize.open(this.prizeItems);
        },

        onClickIndex() {
            // 奖品的索引
            let a = [
                "PointType_AmountPoint",
                "PointType_CostAwardPoint",
            ].includes(this.cutObj.pointType);
            let show = true;
            // 微信小程序支付 this.cutObj.point我的钱
            // #ifdef MP-WEIXIN
            if (Number(this.cutObj.price) > Number(this.cutObj.point)) {
                show = false;
            }
            // #endif
            if (Number(this.cutObj.price) < Number(this.cutObj.point) && a) {
                uni.showToast({
                    title: `您的${this.cutObj.pointTypeName}不足，尚未达到抽奖条件~`,
                    icon: "none",
                    duration: 3000,
                });
                return;
            } else if (
                this.cutObj.pointType == "PointType_Disable" ||
                !this.cutObj.state
            ) {
                this.pointerStyle = "opacity: 0.5";
                uni.$u.toast("每日参与机会已用完~");
                return;
            }
            if (
                ["PointType_Coin", "PointType_Gold"].includes(
                    this.cutObj.pointType
                ) &&
                show
            ) {
                // 涉及到金钱支付 仅金币和支付宝支付
                this.$refs.xPay.open(
                    Number(this.cutObj.point),
                    1,
                    getApp().globalData.RechargeType.activity,
                    0,
                    "0"
                );
                this.UppayMessage({
                    url: "v1/activity/prize-wheel/draw",
                    message: { index: this.cut },
                });
                return;
            }

            post("v1/activity/prize-wheel/draw", { index: this.cut }).then(
                (res) => {
                    this.confirmOrder(res);
                }
            );
        },
        // 记录
        getRewardHistory() {
            this.$refs.drawLog.open("", "", this.cut);
        },
        onClickCut(i) {
            if (i.pointType == "PointType_Disable" || !i.state)
                this.pointerStyle = "opacity: 0.5";
            else this.pointerStyle = " opacity: 1";
            this.$refs.dialer.someMethod();
            this.cut = i.index;
            this.getList();
        },
        onShare() {
            uniShare(
                {
                    tit: this.tiem.activities[0].name,
                    path: "page-activity/turntable/index",
                },
                { id: this.tiem.activities[0].id, index: 0 },
                this.tiem.activities[0].share
            );
        },
        // 转盘列表
        async getList() {
            post("v1/activity/prize-wheel/list").then((res) => {
                if (!res.code) {
                    let { config, point } = res;
                    this.prizeList = JSON.parse(JSON.stringify(config));
                    if (this.cut == null) this.cut = this.prizeList[0].index;
                    this.prizeList.map((item, index) => {
                        item.price =
                            point[
                                getApp().globalData.ActivityPointTypeNumber[
                                    item.pointType
                                ] + ""
                            ];
                        item.pointTypeName =
                            getApp().globalData.ActivityPointType[
                                item.pointType
                            ];
                        if (this.cut == item.index) this.cutObj = item;
                    });

                    if (
                        this.cutObj.pointType == "PointType_Disable" ||
                        !this.cutObj.state
                    ) {
                        this.pointerStyle = " opacity: 0.5";
                    } else this.pointerStyle = "opacity: 1";
                } else {
                    uni.$u.toast(res.message);
                }
            });
            if (Object.keys(this.cutObj).length) return;
            this.tiem = await activityLIst({ key: ["PrizeWheel"] });
            this.imgList = this.tiem.activities[0].imageUrlMap;
            this.colorList = this.tiem.activities[0].paramsMap;
            this.styleOpt = {
                prizeBgColors: [this.colorList.bg1, this.colorList.bg2],
                borderColo: this.colorList.border,
                textColor: this.colorList.turntableText,
            };
            this.prize = {
                ...this.prize,
                bg: this.imgList.visibleTitle,
                btn: this.imgList.heeler,
            };
        },
        onVisible() {
            this.forbid = "auto";
            this.getList();
        },
        getRuleInfo() {
            post("v1/system/protocol/get", { key: "ActivityPrizeWheel" }).then(
                (res) => {
                    this.cont = res;
                }
            );
        },
        getPay(res, showAnim, type) {
            this.forbid = "none";
            let that = this;
            if (type) {
                post("v1/activity/prize-wheel/draw/result", {
                    pay_id: res.res.createPaymentReply.payId,
                }).then((res1) => {
                    if (!res1.code) {
                        that.confirmOrder(res1);
                    } else uni.$u.toast(res1.message);
                });
            } else that.confirmOrder(res);
        },
        confirmOrder(res) {
            this.asyncUpBalance();
            if (!res.code) {
                let { award, point } = res;
                let indexId = this.cutObj.award.findIndex(
                    (item) => item.value == award.value
                );
                this.cutObj.price =
                    point[
                        getApp().globalData.ActivityPointTypeNumber[
                            this.cutObj.pointType
                        ] + ""
                    ];
                this.$refs.dialer.run(indexId);
                this.prizeItems = [{ thumb: award.thumb, name: award.name }];
            } else uni.$u.toast(res.message);
        },
    },
};
</script>
<style lang='scss' scoped>
.ticket {
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 82rpx;
    background-size: 100% 100%;
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
    width: 48rpx;
    height: 48rpx;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/fenx.png");
    background-size: 100% 100%;
    margin-left: auto;
}
.particulars {
    width: 100%;
    height: 100%;
    position: relative;

    .t_btn {
        width: 72rpx;
        height: 72rpx;
        position: absolute;
    }
    .rule {
        position: absolute;
        right: 0;
        top: 290rpx;
        width: 48rpx;
        height: 144rpx;
        background-size: 100% 100%;
        z-index: 999;
    }
    .time_box2 {
        margin: 16rpx auto 32rpx;
        width: 590rpx;
        height: 56rpx;
        line-height: 56rpx;
        text-align: center;
        font-size: 28rpx;
    }
    .time_box1 {
        margin: 152rpx auto 0;
        width: 470rpx;
        height: 64rpx;
        line-height: 64rpx;
        text-align: center;
        font-weight: bold;
        font-size: 28rpx;
    }
    .turntableTitle_box {
        margin-top: 200rpx;
        position: relative;
        .turntableTitle {
            width: 750rpx;
            height: 116rpx;
            background-size: 100% 100%;
        }
    }
    .anniu_box {
        width: calc(100% - 72rpx);
        overflow-x: scroll;
        overflow-y: hidden;
        height: 76rpx;
        margin: 0 auto;
        .anniu0 {
            padding: 0 50rpx;
            width: 332rpx;
            height: 76rpx;
            flex-shrink: 0;
            background-size: 100% 100%;
            margin-right: 16rpx;
            font-weight: 800;
            font-size: 36rpx;
            line-height: 76rpx;
            text-align: center;
            &.active {
                width: 312rpx;
            }
        }
    }

    .get {
        position: relative;
        margin-top: 12rpx;
        width: 750rpx;
        height: 984rpx;
        padding: 82rpx;
        background-size: 100% 100%;
        .number_box {
            width: 100%;
            font-weight: bold;
            font-size: 28rpx;
            margin: 86rpx auto 0;
            text-align: center;
            .number {
                font-weight: 800;
                font-size: 36rpx;
            }
        }
        .show_dialer {
            width: 520rpx;
            height: 520rpx;
            overflow: hidden;
            margin: 0 auto;
        }
        .l-dialer {
            width: 520rpx !important;
            height: 520rpx !important;
            margin: 0 auto;
        }
    }
    .attention {
        margin: 0 auto;
        width: 686rpx;
        margin-top: 32rpx;
        background: #ffffff;
        border-radius: 40rpx;
        padding: 40rpx;
        .title_box {
            display: flex;
            width: 100%;
            height: 40rpx;
            align-items: center;
            justify-content: center;
            margin-bottom: 32rpx;
            .title {
                width: 128rpx;
                font-weight: bold;
                font-size: 32rpx;
                margin: 0 16rpx 0;
            }
            .r {
                width: 36rpx;
                height: 24rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/activity/zhuangshi.png");
                background-size: 100% 100%;
            }
        }
        .text {
            height: 312rpx;
            overflow-y: auto;
            font-weight: 500;
            font-size: 28rpx;
            margin-bottom: 16rpx;
        }
        .text1 {
            margin-top: 48rpx;
            width: 606rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #818181;
            line-height: 32rpx;
            text-align: center;
            font-style: normal;
            text-transform: none;
        }
    }
}
</style>