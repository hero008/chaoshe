<template>
    <view class="pyramid">
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
        <view
            class="ladder_box"
            :style="{ backgroundImage: `url(${imageUrlMap.bg})` }"
        >
            <view class="lottery flex_r flex_wrap flex_jc">
                <div
                    class="grid-container bg"
                    v-for="(item, index) in dataList"
                    :key="index"
                    :class="'bg' + item.stepNo"
                    :style="{
                        backgroundImage: `url(${
                            imageUrlMap['bg' + item.stepNo]
                        })`,
                    }"
                >
                    <div class="grid-item" v-for="(i, s) in item.cell" :key="s">
                        <view
                            class="grid-bg"
                            :class="{ gridActive: isActive == i.id }"
                            :style="[
                                {
                                    backgroundImage: selected.includes(i.id)
                                        ? `url(${i.thumb})`
                                        : `url(${imageUrlMap.prize})`,
                                },
                            ]"
                        />
                    </div>
                </div>
            </view>
            <view
                class="foot_box"
                :style="{ backgroundImage: `url(${imageUrlMap.foot_bg})` }"
            >
                <div
                    class="btn po"
                    @click="$noMultipleClicks(spinGrid)"
                    :style="{
                        backgroundImage: `url(${imageUrlMap.button})`,
                        color: colorList.text,
                    }"
                >
                    <view class="stepNo"
                        >您当前在第{{ numberToChinese(stepNo) }}层</view
                    >
                    <view class="btnBox">
                        <view class="text">立即抽奖</view>
                        <view class="num" v-if="resData.length"
                            >本次消耗{{ resData[stepNo - 1].pointType }}：{{
                                resData[stepNo - 1].point
                            }}</view
                        >
                    </view>
                </div>
                <view class="myNum" :style="{ color: colorList.number }"
                    >我的{{ typeName }}：{{ point }}</view
                >
                <view class="attention">
                    <view
                        class="header flex_r flex_jc"
                        :style="{ background: getBg }"
                    >
                        <view
                            class="l"
                            :style="{
                                backgroundImage: `url(${imageUrlMap.figure})`,
                            }"
                        >
                        </view>
                        <text
                            class="c"
                            :style="{ backgroundImage: attentionFz }"
                            >活动规则</text
                        >
                        <view
                            class="r"
                            :style="{
                                backgroundImage: `url(${imageUrlMap.figure})`,
                            }"
                        >
                        </view>
                    </view>
                    <view
                        class="box"
                        :style="{
                            background: colorList.attention_bg,
                            color: colorList.attention_color,
                        }"
                    >
                        <u-parse
                            :content="(cont && cont.text) || ''"
                            :selectable="true"
                            :tag-style="tagStyle"
                        ></u-parse>
                    </view>
                </view>
            </view>
            <view
                class="order"
                @click="openBtn(2)"
                :style="{
                    backgroundImage: `url(${imageUrlMap.order})`,
                }"
            >
            </view>
            <view
                class="record"
                @click="openBtn(1)"
                :style="{
                    backgroundImage: `url(${imageUrlMap.record})`,
                }"
            >
            </view>
        </view>
        <u-overlay :show="visible">
            <view class="rank_box" :style="{ background: colorList.rank_bg }">
                <view
                    class="visible_btn"
                    :style="{
                        backgroundImage: `url(${imageUrlMap.pop_close})`,
                    }"
                    @click="openBtn(3)"
                ></view>
                <view
                    class="header"
                    :style="{ backgroundImage: `url(${imageUrlMap.header})` }"
                >
                    <view
                        class="header_title"
                        :style="{
                            backgroundImage: `url(${
                                btnNum == 2
                                    ? imageUrlMap.header_title
                                    : imageUrlMap.header_title1
                            })`,
                        }"
                    >
                    </view>
                </view>
                <view
                    class="rank_list"
                    v-if="rankList.length"
                    :style="{ color: colorList.rank_title }"
                >
                    <view class="title_box flex_r">
                        <view>排名</view>
                        <view class="mr">用户ID</view>
                        <view class="ml">挖矿次数</view>
                    </view>
                    <view class="list">
                        <view
                            class="list_item flex_r flex_ac"
                            v-for="(i, s) in rankList"
                            :key="s"
                            :style="{ background: colorList.item }"
                        >
                            <img
                                :src="`https://img.chaoshewang.com/static/img/activity/classs_${s}.png`"
                            />
                            <image
                                class="title_img"
                                :src="i.userAvatar | active"
                                mode="aspectFill"
                            />
                            <view class="item_name">
                                <view class="name">{{ i.userName }} </view>
                                <view class="id"> ID：{{ i.userId }}</view>
                            </view>
                            <view class="cnt">{{ i.cnt }}</view>
                        </view>
                    </view>
                </view>
                <view
                    class="history_list"
                    v-if="historyList.length"
                    :style="{ background: colorList.history }"
                >
                    <scroll-view
                        @scrolltolower="onReachScollBottom"
                        class="home-scroll"
                        :scroll-y="true"
                        refresher-background="rgba(0,0,0,0)"
                        :refresher-threshold="60"
                    >
                        <view
                            class="list_item flex_r flex_ac flex_jb"
                            v-for="(i, s) in historyList"
                            :key="s"
                            :style="{ color: colorList.history_text }"
                        >
                            <view class="flex_r">
                                <image
                                    :src="i.userAvatar | active"
                                    class="title_img"
                                    mode="aspectFill"
                                />
                                <view class="item_message">
                                    <view class="name">{{ i.userName }}</view>
                                    <view
                                        class="item"
                                        :style="{
                                            color: colorList.history_time,
                                        }"
                                        >{{ i.gainTime }}</view
                                    >
                                </view>
                            </view>
                            <view class="right_item flex_r flex_ac">
                                <img class="item_img" :src="i.cell.thumb" />
                                <view class="goods_name ellipsis">{{
                                    i.cell.name
                                }}</view>
                                <view class="number ellipsis">x1</view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </u-overlay>
        <xPrize ref="refPrize" :prize="prize" />
    </view>
</template>
<script>
// 步步高升
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
import xPrize from "@/components/modules/x-prize";
export default {
    data() {
        return {
            deepInterval: null,
            isActive: null, //选中奖品
            stepNo: 0, //当前层级
            dataList: [],
            isActiveList: [],
            resList: {},
            selected: [], //已选中数据
            show: false, //奖品弹窗
            noClick: true, //防抖挂载
            noClickTime: 3000, //防抖挂载
            typeName: "",
            point: 0,
            pointClass: 0,
            resData: [],
            visible: false,
            btnNum: 2,
            rankList: [],
            historyList: [],
            total: 0,
            page: 1,
            cont: "",
            activity: {},
            imageUrlMap: {
                // bg: "https://img.chaoshewang.com/static/img/activity/ladder_bg.png", //大背景
                // button: "https://img.chaoshewang.com/static/img/activity/begin_icon.png", //立即抽奖
                // prize: "https://img.chaoshewang.com/static/img/activity/prize_1.png", //礼物
                // bg1: "https://img.chaoshewang.com/static/img/activity/foot_1.png", //
                // bg2: "https://img.chaoshewang.com/static/img/activity/foot_2.png", //
                // bg3: "https://img.chaoshewang.com/static/img/activity/foot_3.png", //
                // bg4: "https://img.chaoshewang.com/static/img/activity/foot_4.png", //
                // bg5: "https://img.chaoshewang.com/static/img/activity/foot_5.png", //
                // foot_bg:
                //     "https://img.chaoshewang.com/static/img/activity/foot_bg.png",
                // record: "https://img.chaoshewang.com/static/img/activity/record.png", //中奖记录
                // order: "https://img.chaoshewang.com/static/img/activity/order.png", //排行榜
                // pop_bg: "https://img.chaoshewang.com/static/img/activity/tcbg.png", //弹窗背景
                // pop_close:
                //     "https://img.chaoshewang.com/static/img/market/close.png", //弹窗关闭
                // pop_btn:
                //     "https://img.chaoshewang.com/static/img/activity/qd3.png", //弹窗按钮
                // spin: "https://img.chaoshewang.com/static/img/activity/guang.png", //旋转bg
                // pop_close1:
                //     "https://img.chaoshewang.com/static/img/activity/icon32.png", //弹窗关闭按钮
                // header: "https://img.chaoshewang.com/static/img/activity/hbg.png", //弹窗头部
                // figure: "https://img.chaoshewang.com/static/img/activity/huawen_r.png", //花纹
                // share: "https://img.chaoshewang.com/static/img/activity/huodongfx.png", //分享
            },
            colorList: {
                // number: "#8e3b00", //
                // attention1: "#ff4b2b", //活动头部
                // attention2: "#ff9c46", //活动头部
                // attention3: "#ffbd7f", //活动头部
                // attention_bg: "#fef2d9", //活动背景
                // attention_color: "#8e3b00", //活动文字
                // header: "#fffeef", //活动头部
                // header1: "#fff195", //活动头部
                // text: "#fff", //文字颜色
                // rank_bg: "#fbf2e5", //排行榜背景
                // item: "#fcfbf2", //挖矿背景
                // history: "#fff", //中奖记录
                // rank_title: "#b67344", //奖品名称
                // history_text: "#8e3b00", //中奖记录文字
                // history_tiem: "#b67344", //
            },
            tagStyle: {
                table: "border-collapse: collapse; width: 100%;",
                th: "border: 1px solid #ddd; padding: 8px;",
                td: "border: 1px solid #ddd; padding: 8px;",
            },
            prize: {
                bg: "", //背景
                btn: "", //按钮图片
                width: 646, //背景图片大小
                height: 764,
                imgWidth: 240,
                imgHeight: 240,
            },
        };
    },
    components: { xPrize },
    watch: {},
    computed: {
        getBg() {
            return `linear-gradient(180deg, ${this.colorList.attention1} 0%, ${this.colorList.attention2} 50%, ${this.colorList.attention3} 100%) `;
        },
        attentionFz() {
            return `linear-gradient(to top, ${this.colorList.header} ,  ${this.colorList.header1} ) `;
        },
    },
    onLoad(da) {},
    onShow() {},
    created() {},
    mounted() {
        this.getList();
        this.getRuleInfo();
    },
    methods: {
        onShare() {
            uniShare(
                {
                    tit: this.activity.name,
                    path: "page-activity/pyramid/index",
                },
                { id: "", index: 0 },
                this.imageUrlMap.share
            );
        },
        async spinGrid() {
            let listId = [],
                arr1 = [];
            let list = this.dataList.filter(
                (item) => item.stepNo == this.stepNo
            );
            list[0].cell.map((item) => {
                arr1.push(item.id);
            });
            listId = arr1.filter((v) => this.selected.every((val) => val != v));
            listId.sort(() => Math.random() - 0.5);
            let i = 0,
                num = 0,
                nums = 20;
            let that = this;
            let res = await post("v1/activity/step-by-step/accept");
            if (res.code) {
                uni.$u.toast("您的" + this.typeName + "不足");
                return;
            }
            listId.length == 1
                ? (listId.push("0"), (nums = 10), (this.noClickTime = 3000))
                : listId;
            listId.length == 2
                ? (this.noClickTime = 1000)
                : (this.noClickTime = 3000);
            that.deepInterval = setInterval(() => {
                if (i > listId.length - 1) i = 0;
                that.isActive = listId[i];
                i++;
                num++;
                if (num > nums) {
                    clearInterval(that.deepInterval);
                    that.rankList = [];
                    that.historyList = [];
                    that.isActive = res.cell.id;
                    that.deepInterval = null;
                    that.resList = res.cell;

                    that.selected = res.cellId;
                    that.show = true;
                    that.$refs.refPrize.open([
                        {
                            thumb: res.cell.thumb,
                            name: res.cell.name,
                        },
                    ]);
                    that.stepNo > res.stepNo
                        ? that.getList()
                        : (that.stepNo = res.stepNo);
                    that.getList();
                }
            }, 70);
        },
        // 获取列表
        async getList() {
            post("v1/activity/step-by-step/detail").then((res) => {
                if (!res.code) {
                    let num = 0;
                    res.config.step.map((item) => {
                        if (item.stepNo == res.stepNo) {
                            this.typeName =
                                getApp().globalData.ActivityPointType[
                                    item.pointType
                                ];
                            num =
                                getApp().globalData.ActivityPointTypeNumber[
                                    item.pointType
                                ];
                        }
                        item.pointType =
                            getApp().globalData.ActivityPointType[
                                item.pointType
                            ];
                    });
                    this.resData = JSON.parse(JSON.stringify(res.config.step));
                    this.dataList = res.config.step.reverse();
                    this.stepNo = res.stepNo;
                    this.point = res.point[num];
                    this.selected = res.cellId;
                    this.isActive = res.cellId[res.cellId.length - 1];
                }
            });
            if (Object.keys(this.activity).length) return;
            let a = await activityLIst({ key: ["StepByStep"] });
            this.activity = a.activities[0];
            this.imageUrlMap = a.activities[0].imageUrlMap;
            this.colorList = a.activities[0].paramsMap;
            this.prize = {
                ...this.prize,
                bg: this.imageUrlMap.pop_bg,
                btn: this.imageUrlMap.pop_btn,
            };
        },
        // 历史记录
        getHistory() {
            post("v1/activity/step-by-step/history/list", {
                page: this.page,
                page_size: 20,
            }).then((res) => {
                if (!res.code) {
                    res.history.map((item) => {
                        item.gainTime = item.gainTime.slice(
                            5,
                            item.gainTime.length
                        );
                    });
                    if (this.page > 1) {
                        this.historyList = [
                            ...this.historyList,
                            ...res.history,
                        ];
                    } else {
                        this.historyList = res.history;
                    }

                    this.total = res.total;
                }
            });
        },
        // 排行榜
        getRank() {
            post("v1/activity/step-by-step/rank/list").then((res) => {
                if (!res.code) {
                    this.rankList = res.rank;
                }
            });
        },
        onReachScollBottom() {
            this.page = this.page + 1;
            this.page <= this.total / 20
                ? this.getHistory()
                : uni.$u.toast("已经是最后一页~");
        },
        openBtn(value) {
            if (value == 3) {
                this.visible = false;
                this.rankList = [];
                this.historyList = [];
                this.resList = {};
                this.total = 0;
                this.page = 1;
                return;
            }
            this.rankList = [];
            this.historyList = [];
            this.resList = {};
            this.total = 0;
            this.page = 1;
            this.visible = true;
            this.btnNum = value;
            if (value == 1) this.getHistory();
            else this.getRank();
        },
        getRuleInfo() {
            post("v1/system/protocol/get", { key: "ActivityStepByStep" }).then(
                (res) => {
                    this.cont = res;
                }
            );
        },
    },
};
</script>
<style lang='scss' scoped>
.pyramid {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    .ladder_box {
        width: 100%;
        height: 1520rpx;
        background-size: 100% 100%;
        padding-top: 580rpx;
        position: absolute;
        .lottery {
            height: 840rpx;
            .grid-container {
                display: flex;
                justify-content: space-around;
            }
        }
    }
    .foot_box {
        width: 100%;
        height: 1048rpx;
        background-size: 100% 100%;
        position: absolute;
        padding-top: 132rpx;
        top: 1300rpx;
        .btn {
            width: 500rpx;
            height: 164rpx;
            background-size: 100% 100%;
            top: -118rpx;
            .stepNo {
                width: 100%;
                position: absolute;
                top: -50rpx;
            }
            .btnBox {
                margin-top: 10rpx;
                .text {
                    font-weight: 800;
                    font-size: 40rpx;
                }
                .num {
                    width: 100%;
                    font-weight: 500;
                    font-size: 24rpx;
                }
            }
        }
        .myNum {
            font-weight: 500;
            font-size: 28rpx;
            // color: #8e3b00;
            text-align: center;
        }
        .attention {
            width: 686rpx;
            height: 788rpx;
            margin: 32rpx auto 0;
            position: relative;
            .header {
                width: 100%;
                height: 188rpx;
                // background: linear-gradient(
                //     180deg,
                //     #ff4b2b 0%,
                //     #ff9c46 50%,
                //     #ffbd7f 100%
                // );
                border-radius: 32rpx 32rpx 32rpx 32rpx;
                // border: 2rpx solid #ffe4b7;
                padding-top: 24rpx;

                view {
                    width: 144rpx;
                    height: 32rpx;
                }
                .c {
                    font-weight: 800;
                    font-size: 32rpx;

                    -webkit-background-clip: text;
                    color: transparent;
                }
                .r {
                    background-size: 100% 100%;
                    margin-left: 32rpx;
                }
                .l {
                    background-size: 100% 100%;
                    margin-right: 32rpx;
                    transform: scaleX(-1);
                    -webkit-transform: scaleX(-1); /* Safari 和 Chrome */
                    -moz-transform: scaleX(-1); /* Firefox */
                }
            }
            .box {
                position: absolute;
                top: 88rpx;
                width: 100%;
                height: 700rpx;
                // background: #fef2d9;
                border-radius: 32rpx;
                border: 2rpx solid #ffffff;
                font-weight: 400;
                font-size: 28rpx;
                // color: #8e3b00;
                padding: 32rpx;
                line-height: 1.5;
                overflow-y: auto;
            }
        }
    }
    .order {
        width: 108rpx;
        height: 108rpx;
        background-size: 100% 100%;
        position: absolute;
        right: 16rpx;
        top: 508rpx;
    }
    .record {
        width: 108rpx;
        height: 108rpx;
        background-size: 100% 100%;
        position: absolute;
        right: 16rpx;
        top: 368rpx;
    }
}
.po {
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}
.Back_ico {
    width: 64rpx;
    height: 64rpx;
}

.btn {
    margin-top: 100rpx;
}
.ml {
    margin-left: auto;
}
.bg {
    background-size: 100% 100%;
    .grid-item {
        position: relative;
        .grid-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
        }
    }
}
.bg1 {
    width: 100%;
    height: 280rpx;
    padding: 0 32rpx;
    .grid-item {
        width: 72rpx;
        height: 72rpx;
        .grid-bg {
            top: -32rpx;
        }
    }
}
.bg2 {
    width: 662rpx;
    height: 132rpx;
    padding: 0 38rpx;
    .grid-item {
        width: 80rpx;
        height: 80rpx;
        .grid-bg {
            top: -40rpx;
        }
    }
}
.bg3 {
    width: 518rpx;
    height: 136rpx;
    padding: 0 44rpx;
    .grid-item {
        width: 84rpx;
        height: 84rpx;
        .grid-bg {
            top: -44rpx;
        }
    }
}
.bg4 {
    width: 366rpx;
    height: 140rpx;
    margin: 0 76rpx;
    padding: 0 44rpx;
    .grid-item {
        width: 92rpx;
        height: 92rpx;
        .grid-bg {
            top: -48rpx;
        }
    }
}
.bg5 {
    width: 238rpx;
    height: 158rpx;
    margin: 0 140rpx;
    padding: 0 44rpx;
    .grid-item {
        width: 104rpx;
        height: 104rpx;
        .grid-bg {
            top: -52rpx;
        }
    }
}
.gridActive {
    border: 4rpx solid #ffd700;
}
.record_box {
    width: 100%;
    height: 1304rpx;
    background: #fbf2e5;
    border-radius: 48rpx 48rpx 0 0;
    position: absolute;
    bottom: 0;
}
.header {
    height: 180rpx;
    width: 100%;
    background-size: 100% 100%;
    position: relative;
    .header_title {
        position: absolute;
        height: 84rpx;
        width: 368rpx;
        background-size: 100% 100%;
        left: 50%;
        transform: translate(-50%);
        top: -8rpx;
    }
}
.rank_box {
    width: 100%;
    height: 1028rpx;
    // background: #fbf2e5;
    position: absolute;
    border-radius: 48rpx 48rpx 0 0;
    bottom: 0;
    .rank_list {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        width: 100%;
        height: 860rpx;
        top: 100rpx;
        padding: 16rpx 32rpx 0rpx;
        overflow-x: auto;
        .title_box {
            width: 100%;
            padding: 0 24rpx;
            font-weight: 500;
            font-size: 24rpx;
            // color: #b67344;
        }
        .list {
            height: 680rpx;
            width: 100%;
            margin-top: 24rpx;
            .list_item {
                width: 686rpx;
                height: 144rpx;
                // background: #fcfbf2;
                border-radius: 16rpx;
                border: 2rpx solid #fadca4;
                padding: 0 32rpx;
                margin-bottom: 16rpx;
                img {
                    width: 48rpx;
                    height: 48rpx;
                }
                .title_img {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    margin: 0 16rpx 0 30rpx;
                }
                .item_name {
                    .name {
                        font-weight: bold;
                        font-size: 28rpx;
                        color: #2f2f2f;
                        margin-bottom: 8rpx;
                    }
                    .id {
                        font-weight: 400;
                        font-size: 24rpx;
                        // color: #b67344;
                    }
                }
                .cnt {
                    font-weight: bold;
                    font-size: 28rpx;
                    // color: #8e3b00;
                    margin-left: auto;
                }
            }
        }
    }
    .history_list {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        width: 702rpx;
        height: 860rpx;
        // background: #ffffff;
        border-radius: 32rpx 32rpx 0 0;
        top: 100rpx;
        padding: 16rpx 32rpx;
        overflow-x: auto;
        .home-scroll {
            height: 100%;
        }
        .list_item {
            width: 100%;
            height: 136rpx;
            .title_img {
                width: 72rpx;
                height: 72rpx;
                border-radius: 50%;
                margin-right: 16rpx;
            }
            .item_message {
                .name {
                    font-weight: bold;
                    font-size: 28rpx;
                    // color: #8e3b00;
                }
                .item {
                    font-weight: 400;
                    font-size: 24rpx;
                    // color: #b67344;
                }
            }
            .right_item {
                width: 250rpx;
                .item_img {
                    min-width: 56rpx;
                    width: 56rpx;
                    height: 56rpx;
                }
                .goods_name {
                    font-weight: 500;
                    font-size: 24rpx;
                    // color: #8e3b00;
                    margin-left: 8rpx;
                }
                .number {
                    width: 50rpx;
                    margin-left: auto;
                    text-align: center;
                    min-width: 50rpx;
                    object-fit: cover;
                    font-weight: bold;
                    font-size: 28rpx;
                    color: #f25b46;
                }
            }
        }
    }
}
.visible_btn {
    position: absolute;
    right: 32rpx;
    width: 56rpx;
    height: 56rpx;
    top: -100rpx;
    background-size: 100% 100%;
}
// .visible_title {
//     animation: rotate 5s linear infinite;
//     width: 100%;
//     height: 750rpx;
//     position: absolute;
//     top: 10%;
// }
// @keyframes rotate {
//     from {
//         transform: rotate(0deg);
//     }
//     to {
//         transform: rotate(360deg);
//     }
// }
.mr {
    margin-left: 40rpx;
}
.ml {
    margin-left: auto;
}
</style>