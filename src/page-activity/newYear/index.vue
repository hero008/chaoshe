<template>
    <view class="new_year_box">
        <view class="new_year" :style="{ backgroundImage: `url(${imageUrlMap.bg})` }">
            <view class="topBack">
                <img :src="imageUrlMap.btn_close" @click.stop="gateBack" class="Back_ico" />
                <!-- #ifndef MP-WEIXIN -->
                <view class="share" :style="{
                    backgroundImage: `url(${imageUrlMap.btn_share})`,
                }" @click="onShare" />
                <!-- #endif  -->
            </view>
            <view class="gz" :style="{ backgroundImage: `url(${imageUrlMap.record})` }"
                @click="  goto('/pages/common/rulepop', { val: 'ActivitySignIn', })"></view>
            <view class="titleBg" :style="{ backgroundImage: `url(${imageUrlMap.title_bg})` }"></view>
            <view class="particulars">
                <view class="everyday">
                    <view class="header"
                        :style="{ color: colorList.time, backgroundImage: `url(${imageUrlMap.title_one})`, }">
                        活动时间:{{ configList.startTime }}-{{ configList.endTime }}
                    </view>
                    <view class="everyday_box"
                        :style="{ background: colorList.bg, border: `2rpx solid ${colorList.bg}`, }">
                        <view class="days">已{{ signType }}签到
                            <span class="text" :style="{ color: colorList.signInNum }">
                                {{ stateObj.normalContinuousDays }} </span>天<span class="hint"
                                :style="{ color: colorList.hint }">（{{ signType }}签到天数越多，奖励越丰厚）</span>
                        </view>
                        <view class="list_box flex_r flex_wrap flex_jb">
                            <view class="list" v-for="(i, s) in configList.normalConfig" :key="s"
                                @click="ondetail(i.awards[0])"
                                :class="[i.show ? 'list2' : '', configList.normalConfig.length == 7 && s == 6 ? 'list7' : '',]"
                                :style="{ color: i.show ? colorList.today : colorList.day, background: i.show ? getBg : colorList.itemBg }">
                                <view v-if="configList.normalConfig.length == 7 && s == 6">
                                    <img class="img img7" :src="i.awards[0].thumb" />
                                    <view :style="{ color: i.show?colorList.getName: colorList.name }" class="ellipsis name name7">{{ i.awards[0].name }}</view>
                                    <view class="tx name7">第{{ i.day }}天</view>
                                </view>
                                <view v-else>
                                    <view class="tx">第{{ i.day }}天</view>
                                    <img class="img" :src="i.awards[0].thumb" />
                                    <view class="ellipsis name" :style="{ color: i.show?colorList.getName: colorList.name }">{{ i.awards[0].name }}</view>
                                </view>
                                <view class="sign_in" :style="{
                                    backgroundImage: `url(${imageUrlMap.today})`,
                                }" v-if="
                                    (stateObj.normalContinuousDays + 1 ==
                                        i.day &&
                                        !stateObj.isSignedToday) ||
                                    (stateObj.normalContinuousDays ==
                                        i.day &&
                                        stateObj.isSignedToday)
                                "></view>

                                <view v-if="
                                    (stateObj.isSignedToday &&
                                        i.day ==
                                        stateObj.normalContinuousDays) ||
                                    stateObj.normalContinuousDays > s
                                " :class="[
                                    configList.normalConfig.length == 7 &&
                                        s == 6
                                        ? 'get7'
                                        : '',
                                ]" class="get" :style="{
                                    backgroundImage: `url(${imageUrlMap.succeed})`,
                                }"></view>
                            </view>
                        </view>
                        <view class="foot" :class="[
                            stateObj.isSignedToday ||
                                endTime < 0 ||
                                stateObj.normalContinuousDays == tDay
                                ? 'forbid'
                                : '',
                        ]" :style="[
                            endTime < 0 ||
                                stateObj.normalContinuousDays == tDay
                                ? {
                                    backgroundImage: `url(${imageUrlMap.end_btn})`,
                                }
                                : {
                                    backgroundImage: `url(${imageUrlMap.signIn_btn})`,
                                },
                        ]" @click="footBtn(1)">
                        </view>
                    </view>
                </view>
                <view class="page" :style="{ backgroundImage: `url(${imageUrlMap.page})` }"></view>
                <view class="everyday">
                    <view class="header" :style="{
                        backgroundImage: `url(${imageUrlMap.title_tow})`,
                        color: colorList.time,
                    }">活动时间:{{ configList.startTime }}-{{
                        configList.endTime
                    }}
                    </view>
                    <view class="everyday_box" :style="{
                        background: colorList.bg,
                        border: `2rpx solid ${colorList.bg}`,
                    }">
                        <view class="days">已{{ signType }}签到<span class="text"
                                :style="{ color: colorList.signInNum }">{{ stateObj.extraContinuousDays }}</span>天<span
                                class="hint" :style="{ color: colorList.hint }">（{{
                                    signType
                                }}签到天数越多，奖励越丰厚）</span></view>
                        <view class="list_box flex_r flex_wrap flex_jb">
                            <view class="list" v-for="(i, s) in configList.extraConfig" :key="s"
                                @click="ondetail(i.awards[0])" :class="[
                                    configList.normalConfig.length == 7 &&
                                        s == 6
                                        ? 'list7'
                                        : '',
                                ]" :style="{
                                    color: i.show
                                        ? colorList.today
                                        : colorList.day,
                                    background: i.show
                                        ? getBg
                                        : colorList.itemBg,
                                }">
                                <view v-if="
                                    configList.extraConfig.length == 7 &&
                                    s == 6
                                ">
                                    <img class="img img7" :src="i.awards[0].thumb" />

                                    <view :style="{ color: i.show?colorList.getName: colorList.name }" class="ellipsis name name7">{{ i.awards[0].name }}</view>
                                    <view class="tx name7">第{{ i.day }}天</view>
                                </view>
                                <view v-else>
                                    <view class="tx">第{{ i.day }}天</view>
                                    <img class="img" :src="i.awards[0].thumb" />
                                    <view class="ellipsis name" :style="{ color: i.show?colorList.getName: colorList.name }">{{ i.awards[0].name }}</view>
                                </view>
                                <view class="sign_in" :style="{
                                    backgroundImage: `url(${imageUrlMap.today})`,
                                }" v-if="
                                    (stateObj.extraContinuousDays + 1 ==
                                        i.day &&
                                        !stateObj.isExtraSignedToday) ||
                                    (stateObj.extraContinuousDays ==
                                        i.day &&
                                        stateObj.isExtraSignedToday)
                                "></view>
                                <view class="get" :class="[
                                    configList.extraConfig.length == 7 &&
                                        s == 6
                                        ? 'get7'
                                        : '',
                                ]" v-if="
                                    (stateObj.isExtraSignedToday &&
                                        i.day ==
                                        stateObj.extraContinuousDays) ||
                                    stateObj.extraContinuousDays > s
                                " :style="{
                                    backgroundImage: `url(${imageUrlMap.succeed})`,
                                }"></view>
                            </view>
                        </view>
                        <!-- stateObj.isSignedToday && -->
                        <view class="foot" :class="[
                            stateObj.canExtraSign &&
                                !stateObj.isExtraSignedToday &&
                                endTime > 0 &&
                                stateObj.extraContinuousDays < eDay
                                ? ''
                                : 'forbid',
                        ]" :style="[
                            endTime > 0 &&
                                stateObj.extraContinuousDays < eDay
                                ? {
                                    backgroundImage: `url(${imageUrlMap.signIn_btn})`,
                                }
                                : {
                                    backgroundImage: `url(${imageUrlMap.end_btn})`,
                                },
                        ]" @click="footBtn(2)">
                        </view>
                        <view class="foot_text" :style="{ color: colorList.money }">今日抽赏金额{{ stateObj.currentAmount
                        }}/{{
                                configList.extraSignAmount
                            }}</view>
                    </view>
                </view>
            </view>
            <gachaDetails ref="gachaDetails" />
            <xPrize ref="refPrize" :prize="prize" />
        </view>
    </view>
</template>
<script>
// 签到活动
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            stateObj: {},
            configList: [],
            endTime: null,
            message: {},
            colorList: {
                // time: "", //时间
                // signIn: "", //签到文字
                // getName:'',//已签到文字
                // signInNum: "#FF6040", //已签到天数 
                // hint: "", //签到提示
                // today: "", //今日天数 未签到但可以签到
                // day: "", //未签到天数
                // name: "#FF6040", //商品名称
                // money: "#FF6040", //额外签到金额
                // popUp: "", //弹窗商品名称
                // bg: "", //大背景
                // itemBg: "", // 未签到背景
                // itemBg1: "", //签到背景颜色
                // itemBg2: "", //签到背景颜色
            },
            imageUrlMap: {
                // bg: "", //背景
                // btn_close: "", //黑色返回页面按钮
                // btn_share: "", //黑色分享页面按钮
                // end_btn: "", //活动已结束置灰按钮
                // pop_up: "", //弹窗背景
                // share: "", //分享展示图
                // signIn_btn: "", //高亮立即签到
                // succeed: "", //签到成功 选中
                // title_one: "", //每日签到头部
                // title_tow: "", //额外签到头部
                // today: "", //今日领取标
                // record: "", //活动规则
                // close: "", //弹窗关闭按钮
                // heeler: "", //收下按钮
                // 以下字段未用上
                // finish: "", //活动已结束置灰按钮 未用上
                // forbid: "", //立即签到置灰按钮 未用上
                // signIn: "", //高亮立即签到 未用上
                // item_bg:'',//签到小背景
                // e_item_bg:'',//额外签到小背景
                // page:'',//翻页器
                // title_bg:'',//头部
            },
            prize: {
                width: 570,
                height: 680,
                imgWidth: 200,
                imgHeight: 200,
                bg: "", //背景
                btn: "", //按钮图片
            },
            tDay: 0,
            eDay: 0,
            signType: "连续",
        };
    },
    components: { xPrize },
    watch: {},
    computed: {
        getBg() {
            return `linear-gradient(180deg, ${this.colorList.itemBg1} 0%, ${this.colorList.itemBg2} 100%) `;
        },
    },
    onLoad(da) { },
    // onShow页面显示时调用(启动/页面从隐藏到启动)，可调用多次。
    onShow() { },
    created() { },
    mounted() {
        this.getList();
    },
    methods: {
        onShare() {
            uniShare(
                {
                    tit: this.message.name,
                    path: "page-activity/newYear/index",
                },
                { id: this.message.id, index: 0 },
                this.message.imageUrlMap.share
            );
        },
        // 获取列表
        async getList() {
            post("v1/activity/sign-in/detail/list").then((res) => {
                if (!res.code) {
                    this.endTime = this.remainingTime(res.config.endTime);
                    this.stateObj = res.state;
                    res.config.endTime = this.monthAndndDay(res.config.endTime);
                    res.config.startTime = this.monthAndndDay(
                        res.config.startTime
                    );
                    this.eDay = res.config.extraConfig.length;
                    this.tDay = res.config.normalConfig.length;
                    res.config.normalConfig.map((i, s) => {
                        if (
                            (res.state.normalContinuousDays + 1 == i.day &&
                                !res.state.isSignedToday) ||
                            (res.state.normalContinuousDays == i.day &&
                                res.state.isSignedToday) ||
                            (res.state.isSignedToday &&
                                i.day == res.state.normalContinuousDays) ||
                            res.state.normalContinuousDays > s
                        ) {
                            i.show = true;
                        } else i.show = false;
                    });
                    res.config.extraConfig.map((i, s) => {
                        if (
                            (res.state.extraContinuousDays + 1 == i.day &&
                                !res.state.isExtraSignedToday) ||
                            (res.state.extraContinuousDays == i.day &&
                                res.state.isExtraSignedToday) ||
                            (res.state.isExtraSignedToday &&
                                i.day == res.state.extraContinuousDays) ||
                            res.state.extraContinuousDays > s
                        ) {
                            i.show = true;
                        } else i.show = false;
                    });
                    this.configList = res.config;
                    this.signType = res.state.signType == 1 ? "连续" : "累积";
                }
            });
            if (Object.keys(this.imageUrlMap).length) return;
            let a = await activityLIst({ key: ["SignIn"] });
            this.message = a.activities[0];
            this.imageUrlMap = a.activities[0].imageUrlMap;
            this.colorList = a.activities[0].paramsMap;
            this.prize = {
                ...this.prize,
                bg: this.imageUrlMap.pop_up,
                btn: this.imageUrlMap.heeler,
            };
        },

        footBtn(value) {
            let url =
                value == 1
                    ? "v1/activity/sign-in/sign-in"
                    : "v1/activity/sign-in/extra/sign-in";
            post(url).then((res) => {
                if (!res.code) {
                    this.getList();
                    this.$refs.refPrize.open(res.awards);
                } else uni.$u.toast(res.message);
            });
        },
        ondetail(v) {
            if (v.type !== "Item") return;
            else this.gachaDetailsMethod(this, v.value);
        },
    },
};
</script>
<style lang='scss' scoped>
.new_year_box {
    height: 100vh;
    overflow-y: auto;
    position: relative;
}

.new_year {
    position: absolute;
    top: 0;
    width: 100%;
    height: 2172rpx;
    background-size: 100% 100%;
}

.gz {
    position: absolute;
    right: 0;
    top: 215rpx;
    width: 48rpx;
    height: 144rpx;
    z-index: 999;
    background-size: 100% 100%;
}

.visible_box {
    position: relative;
    height: 100vh;

    .visible {
        width: 570rpx;
        height: 680rpx;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 999;
        transform: translate(-50%, -50%);
        padding-top: 288rpx;

        .visible_img {
            width: 100%;

            .img {
                margin: 0 auto;
                width: 200rpx;
                height: 200rpx;
                background-size: 100% 100%;
            }

            .visible_name {
                width: 100%;
                padding: 0 100rpx;
                font-weight: bold;
                font-size: 32rpx;
                text-align: center;
            }

            .btn {
                width: 380rpx;
                height: 80rpx;
                margin: 48rpx auto 0;
                background-size: 100% 100%;
            }
        }

        .visible_btn {
            position: absolute;
            width: 64rpx;
            height: 64rpx;
            background-size: 100% 100%;
            left: 50%;
            bottom: -150rpx;
            transform: translate(-50%);
        }
    }
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
    margin-left: auto;
    width: 48rpx;
    height: 48rpx;
    background-size: 100% 100%;
}

.titleBg {
    width: 100%;
    height: 518rpx;
    position: absolute;
    background-size: 100% 100%;
    z-index: 2;
}

.particulars {
    width: 100%;
    margin-top: 500rpx;
    position: relative;

    .everyday {
        width: 702rpx;
        height: 776rpx;
        margin: 0 auto 24rpx;
        position: relative;

        .header {
            position: absolute;
            font-weight: 500;
            font-size: 24rpx;
            width: 702rpx;
            height: 200rpx;
            text-align: center;
            padding-top: 104rpx;
            background-size: 100% 100%;
        }

        .everyday_box {
            position: absolute;
            top: 152rpx;
            border-radius: 32rpx;
            padding: 24rpx 32rpx;

            .days {
                text-align: center;
                font-weight: 800;
                font-size: 28rpx;

                .text {
                    font-weight: 800;
                    font-size: 36rpx;
                    margin: 0 4rpx;
                }

                .hint {
                    font-weight: 500;
                    font-size: 24rpx;
                    margin-left: 8rpx;
                }
            }

            .ts {
                text-align: center;
                font-size: 24rpx;
                color: #d97132;
                font-weight: 500;
            }

            .list_box {
                width: 100%;

                .list {
                    width: 144rpx;
                    height: 176rpx;
                    padding: 16rpx 0;
                    border-radius: 24rpx;
                    position: relative;
                    text-align: center;
                    font-weight: 500;
                    font-size: 20rpx;
                    margin-top: 24rpx;

                    .get {
                        width: 144rpx;
                        height: 176rpx;
                        border-radius: 24rpx;
                        background: rgba(235, 238, 243, 0.5);
                        background-repeat: no-repeat;
                        background-size: 48rpx 48rpx;
                        /* 背景图片居中 */
                        background-position: center center;
                        position: absolute;
                        top: 0;
                        z-index: 999;
                    }

                    .img {
                        width: 72rpx;
                        height: 72rpx;
                        margin: 8rpx 0;
                    }

                    .tx {
                        font-weight: 500;
                        font-size: 20rpx;
                    }

                    .name {
                        font-weight: bold;
                        font-size: 24rpx;
                    }

                    .sign_in {
                        width: 76rpx;
                        height: 76rpx;
                        background-size: 100% 100%;
                        position: absolute;
                        left: -32rpx;
                        top: 0rpx;
                        z-index: 1000;
                    }
                }

                .list7 {
                    width: 308rpx;
                    height: 176rpx;
                    padding-top: 48rpx;

                    .img7 {
                        position: absolute;
                        width: 96rpx;
                        height: 96rpx;
                        top: 40rpx;
                        left: 24rpx;
                        margin: 0;
                    }

                    .name7 {
                        width: 188rpx;
                        text-align: center;
                        margin-left: auto;
                    }

                    .get7 {
                        width: 308rpx;
                        height: 176rpx;
                    }
                }

                .list2 {
                    // background: linear-gradient(
                    //     180deg,
                    //     #ffd606 0%,
                    //     #fff46c 100%
                    // );
                    // color: #000000;
                }
            }

            .foot {
                margin: 32rpx auto 16rpx;
                width: 380rpx;
                height: 80rpx;
                background-size: 100% 100%;
            }

            .foot_text {
                font-weight: bold;
                font-size: 24rpx;
                text-align: center;
                margin-bottom: 8rpx;
            }
        }
    }
    .page {
        width: 574rpx;
        height: 76rpx;
        position: absolute;
        background-size: 100% 100%;
        left: 50%;
        transform: translateX(-50%);
        top: 750rpx;
        z-index: 99;

    }
}

.forbid {
    pointer-events: none;
    opacity: 0.5;
}
</style>