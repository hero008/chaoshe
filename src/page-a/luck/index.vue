<template>
    <view class="luck">
        <u-navbar
            title="集赏中心"
            bgColor="transparent"
            placeholder
            :titleStyle="titleStyle"
            @leftClick="gateBack"
        >
            <view
                class="fenxiang"
                slot="right"
                @click="onShare"
                :style="[
                    SystemInfo.uniPlatform == 'app' ? '' : { display: 'none' },
                ]"
            />
        </u-navbar>
        <div class="con_box" :style="{ height: conHeight }">
            <view
                class="gz"
                @click="goto('/pages/common/rulepop', { val: 'ItemExchange' })"
                >玩法规则</view
            >
            <div class="time flex_r flex_ac flex_jc">
                <img
                    src="https://img.chaoshewang.com/static/img/luck/clockx.png"
                    class="timeImg"
                />
                <view class="timeTiele">集赏时间：</view>
                <template v-if="residuetime > 0">
                    <u-count-down :time="residuetime" @change="rtimeChange">
                        <view class="timetxt">
                            <text>{{ timeData.days }}天</text>
                            <text>{{ timeData.hours }}小时</text>
                            <text>{{ timeData.minutes }}分</text>
                            <text>{{ timeData.seconds }}秒</text>
                        </view>
                    </u-count-down>
                </template>
                <div class="timetxt" v-else>已结束</div>
            </div>
            <view class="rightImg" />
            <div class="soll-bar">
                <div class="exchange" v-if="exchangeList.length > 0">
                    <div
                        class="exchangeItem flex_r flex_ac"
                        v-for="(i, s) in exchangeList"
                        :key="s"
                    >
                        <img
                            :src="i.item.thumb"
                            class="exchange_img"
                            @click="ondetail(i.item.id)"
                        />
                        <div class="exchange_info flex_c">
                            <div class="e_name">{{ i.item.name }}</div>

                            <div class="e_btn flex_r flex_ac flex_jb">
                                <div class="e_num">
                                    库存：{{ i.stock !== "" ? i.stock : 99999 }}
                                </div>
                                <div
                                    v-if="
                                        residuetime < 0 ||
                                        i.stock == '0' ||
                                        !i.endTime ||
                                        !i.startTime
                                    "
                                    class="e_bnt"
                                >
                                    去集赏
                                </div>

                                <!-- ||new Date(i.startTime).valueOf() - currentTime >0  -->

                                <div
                                    @click="
                                        goto('/page-a/luck/playingMethod', {
                                            index: s + 1,
                                            id: i.id,
                                        })
                                    "
                                    v-else
                                    class="e_bnt cor"
                                >
                                    去集赏
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <u-empty
                    v-else
                    text="暂无集赏物品~"
                    icon="https://img.chaoshewang.com/static/img/home/empty.png"
                    :marginTop="50"
                />
            </div>
        </div>
        <!-- 公共弹窗提示组件 -->
        <show-modal></show-modal>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { mapState } from "vuex";
import { uniShare } from "@/utils/fun.js";
export default {
    data() {
        return {
            titleStyle: {
                fontWeight: 800,
                color: "#000",
                fontSize: "36rpx",
            },
            point: 0,
            maxPoint: 10000000,
            exchangeList: [],
            step: "",
            residuetime: 0,
            timeData: {},
            currentTime: new Date().getTime(),
        };
    },
    watch: {},
    computed: {
        ...mapState(["userInfo"]),
        progNum() {
            let num = this.$h.Mul(this.$h.Div(this.point, this.maxPoint), 100);
            return num > 100 ? 100 : num;
        },
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top;
            let str = h - th + "px";
            return str;
        },
    },
    created() {},
    mounted() {},
    onLoad(da) {},
    onShow() {
        this.loadDetail();
    },
    methods: {
        loadDetail() {
            post("v1/activity/item-exchange/list", {
                // type: 1,
            }).then((res) => {
                if (!res.code) {
                    res.config.map((item) => {
                        if (item.endTime == "") item.endTime = true;
                        else {
                            let endDate = this.remainingTime(item.endTime);
                            item.endTime = endDate > 0;
                        }
                        if (item.startTime == "") item.startTime = true;
                        else {
                            let endDate = this.remainingTime(item.startTime);
                            item.startTime = endDate < 0;
                        }
                    });
                    this.exchangeList = res.config;
                    this.step = res.step;
                    this.residuetime = this.remainingTime(res.endTime);
                }
            });
            post("v1/activity/cost-award/point", {}).then((res) => {
                if (!res.code) {
                    this.point = parseFloat(res.point);
                    this.maxPoint = parseFloat(res.maxPoint);
                }
            });
        },

        rtimeChange(e) {
            this.timeData = e;
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
        // 分享
        onShare() {
            uniShare(
                {
                    tit: "集赏中心",
                    path: "page-a/luck/index",
                },
                { id: "", index: "" },
                "https://img.chaoshewang.com/matt/static/img/index/fenxiangjcbg.png"
            );
        },
    },
};
</script>
<style lang="scss" scoped>
.luck {
    width: 100%;
    height: 100vh;
    background-image: url("https://img.chaoshewang.com/static/img/luck/jcbg.png");
    background-size: 100% auto;
    overflow: hidden;
    background-color: #f4f4f4;
}

.con_box {
    position: relative;
}

.soll-bar {
    height: calc(100% - 234rpx);
    overflow-y: auto;
    margin-top: 32rpx;
    background: linear-gradient(180deg, rgba(228, 218, 255, 1) 0%, #fff 5%);
    padding-bottom: 60rpx;
    border-radius: 14rpx;
    padding-bottom: 100rpx;
}

.uinfo {
    .u_img {
        width: 76rpx;
        height: 76rpx;
        border: 1rpx solid #fff;
        border-radius: 50%;
    }

    .u_data {
        height: 76rpx;
        width: calc(100% - 76rpx);
        padding-left: 18rpx;
        font-size: 22rpx;
        color: #99839e;

        .uname {
            font-weight: 800;
            font-size: 32rpx;
            color: #000;
        }
    }
}

.gz {
    width: 146rpx;
    height: 65rpx;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 33rpx 0rpx 0rpx 33rpx;

    margin-left: auto;
    line-height: 65rpx;
    text-align: center;
    font-weight: 800;
    font-size: 22rpx;
    color: #4d2e79;
}
.time {
    width: 468rpx;
    height: 56rpx;
    background-image: url("https://img.chaoshewang.com/static/img/luck/jssj.png");
    background-size: 100% auto;
    font-weight: 400;
    font-size: 24rpx;
    color: #ffffff;
    font-family: PingFang SC, PingFang SC;
    margin: 180rpx 0 28rpx 32rpx;

    .timeImg {
        width: 32rpx;
        height: 32rpx;
        margin-right: 11rpx;
    }
    .timeTiele {
        font-weight: 800;
    }
}
.exchange {
    padding: 40rpx 24rpx;
    border-radius: 14rpx;
    .exchangeItem {
        margin-bottom: 32rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .exchange_img {
            width: 160rpx;
            height: 160rpx;
            background: #f1f1f1;
            border-radius: 20rpx;
        }

        .exchange_info {
            height: 160rpx;
            width: calc(100% - 182rpx);
            padding-left: 24rpx;
            font-size: 24rpx;

            .e_name {
                height: 200px;
                line-height: 32rpx;
                font-weight: 500;
                overflow: hidden;
            }

            .e_num {
                color: #ff4142;
            }

            .e_bnt {
                color: #fbfbfb;
                font-weight: 500;
                text-align: center;
                width: 150rpx;
                height: 52rpx;
                line-height: 52rpx;
                background: #c4c4c4;
                border-radius: 26rpx;
                &.cor {
                    background: #ac51d6;
                }
            }
        }
    }
}
.fenxiang {
    width: 48rpx;
    height: 48rpx;
    background-image: url("https://img.chaoshewang.com/static/img/activity/fenx.png");
    background-size: 100% auto;
}
.rightImg {
    position: absolute;
    width: 248rpx;
    height: 200rpx;
    background-image: url("https://img.chaoshewang.com/static/img/luck/zt.png");
    background-size: 100% auto;
    right: 0;
    top: 181rpx;
}
</style>