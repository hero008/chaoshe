<template>
    <view class="welfare" :style="{ backgroundImage: `url(${imgList.bg})` }">
        <view class="topBack">
            <img
                src="https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png"
                @click.stop="gateBack"
                class="Back_ico"
            />
            <!--  #ifndef MP-WEIXIN -->
            <view class="share" @click="onShare"></view>
            <!-- #endif -->
        </view>
        <view
            class="gz"
            @click="
                goto('/pages/common/rulepop', {
                    val: 'TaskRule',
                })
            "
        ></view>
        <view class="list_box">
            <view class="list">
                <view
                    class="header flex_r "
                    :style="{ backgroundImage: `url(${imgList.tab})` }"
                >
                    <view
                        class="item"
                        v-for="(item, index) in tabs"
                        :key="index"
                        :class="{ active: activeIndex == item.id }"
                        :style="{
                            backgroundImage:
                                activeIndex == item.id
                                    ? `url(${imgList.btn})`
                                    : '',
                        }"
                        @click="cutTab(item.id)"
                    >
                        {{ item.name }}
                    </view>
                </view>
                <view class="upload" v-if="list.length == 0">
                    <view
                        class="img"
                        :style="{ backgroundImage: `url(${imgList.upload})` }"
                    ></view>
                    <view class="text">敬请期待</view>
                </view>
                <view
                    v-show="list.length > 0"
                    class="content"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <view class="shade" v-if="item.mask"
                        ><view class="text">活动待解锁...</view></view
                    >
                    <view
                        class="title1"
                        :style="{ backgroundImage: `url(${imgList.title})` }"
                        >{{ item.name }}</view
                    >
                    <view
                        class="schedule flex_r flex_ac flex_jb"
                        v-if="item.acceptType == 'TaskAcceptType_Stage'"
                    >
                        <view class="progress-view flex_js">
                            <view style="height: 100%">
                                <view
                                    class="progress"
                                    :style="{ width: currentPercent + 'rpx' }"
                                ></view>
                            </view>
                        </view>
                        <view class="txt">{{
                            item.schedule.current + "/" + item.schedule.target
                        }}</view>
                    </view>
                    <view class="details">
                        <view
                            class="left flex_c flex_jb"
                            v-for="(k, s) in item.subTask"
                            :key="s"
                        >
                            <rich-text
                                class="msg"
                                :nodes="formattedMsg(k.name)"
                            ></rich-text>
                            <view>
                                <view class="flex_r">
                                    <view>
                                        <view
                                            class="bottom flex_c"
                                            v-for="(j, y) in k.award"
                                            :key="y"
                                        >
                                            <view class="flex_r">
                                                <image
                                                    :src="j.thumb"
                                                    class="ico"
                                                />
                                                <view
                                                    class="right_text ellipsis"
                                                    >{{ j.name }}</view
                                                ><span
                                                    v-if="j.num"
                                                    style="marginleft: 10rpx"
                                                    >x{{ j.num }}</span
                                                >
                                            </view>
                                        </view>
                                    </view>
                                    <view
                                        class="right"
                                        :class="{
                                            active:
                                                k.schedule.status == '已完成',
                                            forbid:
                                                k.schedule.status !== '领取',
                                            forbid1:
                                                item.schedule.status ==
                                                'TaskUserScheduleStatus_Finished',
                                        }"
                                        :style="{
                                            'pointer-events':
                                                k.schedule.status == '领取'
                                                    ? 'auto'
                                                    : 'none',
                                        }"
                                        @click="getAward(item.id, k)"
                                        >{{ k.schedule.status }}</view
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
// 任务活动
import { post, activityLIst } from "@/utils/api.js";
import { uniShare } from "@/utils/fun.js";
export default {
    data() {
        return {
            tabs: [
                { name: "日福利", id: 3 },
                { name: "周福利", id: 4 },
                // { name: "月福利", id: 5 },
                // { name: "限时福利", id: 2 },
            ],
            activeIndex: 3, // 默认选中第一个
            today: new Date(),
            list: [],
            pageda: {
                page: 1,
                page_size: 10,
                total: 10,
            },
            TaskUserScheduleStatus: [
                "TaskUserScheduleStatus_Finished",
                "TaskUserScheduleStatus_Enable",
                "TaskUserScheduleStatus_Disenable",
            ],
            activity: {},
            imgList: { bg: "", btn: "", tab: "", title: "", share: "" },
            currentPercent: 0, //当前下载百分比
        };
    },
    components: {},
    watch: {},
    computed: {},
    onLoad() {},
    onShow() {},
    created() {},
    mounted() {
        this.getData();
    },
    methods: {
        async getData(key = "") {
            post("v1/task/list", {
                type: this.activeIndex,
                key: key,
                // ...this.pageda,
            }).then((res) => {
                if (!res.code) {
                    // this.pageda.total = res.total;
                    if (key) {
                        // 遍历现有列表，找到并更新匹配的项
                        for (let i = 0; i < this.list.length; i++) {
                            if (this.list[i].key === res.data[0].key) {
                                // 使用Vue的响应式方法替换整个对象，确保视图更新
                                this.$set(this.list, i, res.data[0]);
                                break;
                            }
                        }
                        
                    } else {
                        this.list = [];
                        this.list = res.data;
                    }
                    // 处理状态显示
                    for (let i = 0; i < this.list.length; i++) {
                        const item = this.list[i];

                        if (
                            item.acceptType == "TaskAcceptType_Stage" &&
                            item.schedule.current
                        ) {
                            let w = this.floatingPoint(
                                468,
                                "/",
                                item.schedule.target
                            );
                            this.currentPercent = this.floatingPoint(
                                w,
                                "*",
                                item.schedule.current
                            );
                        }
                        for (let j = 0; j < item.subTask.length; j++) {
                            const k = item.subTask[j];
                            if (
                                this.TaskUserScheduleStatus.includes(
                                    k.schedule.status
                                )
                            ) {
                                if (
                                    k.schedule.status ==
                                    "TaskUserScheduleStatus_Disenable"
                                ) {
                                    // 使用Vue的响应式方法更新嵌套对象的属性
                                    this.$set(
                                        this.list[i].subTask[j].schedule,
                                        "status",
                                        k.schedule.current +
                                            "/" +
                                            k.schedule.target
                                    );
                                } else {
                                    // 使用Vue的响应式方法更新嵌套对象的属性
                                    this.$set(
                                        this.list[i].subTask[j].schedule,
                                        "status",
                                        getApp().globalData
                                            .TaskUserScheduleStatus[
                                            k.schedule.status
                                        ]
                                    );
                                }
                            }
                        }
                    }
                }
            });
            if (Object.keys(this.activity).length) return;
            this.activity = await activityLIst({ key: ["Task"] });
            this.imgList = this.activity.activities[0].imageUrlMap;
        },
        formattedMsg(text) {
            return text.replace(/(\d+)/g, "<span>$1</span>");
        },
        cutTab(i) {
            this.activeIndex = i;
            this.getData();
        },
        getAward(item, schedule) {
            post("v1/task/accept", { id: item, sub_id: schedule.id }).then(
                (res) => {
                    if (!res.code) {
                         this.getData(schedule.key);
                        uni.$u.toast("领取成功");
                    } else uni.$u.toast(res.message);
                }
            );
        },
        onShare() {
            uniShare(
                {
                    tit: this.activity.activities[0].name,
                    path: "page-activity/welfare/index",
                },
                { id: this.activity.activities[0].id, index: 0 },
                this.imgList.share
            );
        },
    },
};
</script>
<style lang='scss' scoped>
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
.welfare {
    width: 100vw;
    height: 100vh;
    background-size: cover; /* 保证图片覆盖整个容器，可能裁剪图片 */
    overflow: hidden;
    .list_box {
        width: 702rpx;
        height: 100%;
        margin: 0 auto;
        margin-top: 150rpx;
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: 48rpx;
    }
    .list {
        width: 702rpx;
        margin: 400rpx auto 200rpx;
        border-radius: 48rpx;
        background: #f3f3f5;
        padding-bottom: 48rpx;
        .header {
            position: sticky;
            top: 0; /* 固定在顶部 */
            width: 100%;
            height: 120rpx;
            background-size: 100% 100%;
            padding-top: 32rpx ;
            margin-bottom: 76rpx;
            z-index: 102;
                justify-content: space-around;
            .item {
                position: relative;
                font-family: PingFang SC, PingFang SC;
                font-weight: 800;
                font-size: 32rpx;
                color: #86838c;
                height: 76rpx;
                line-height: 76rpx;
                &.active {
                    font-size: 36rpx;
                    color: #000000;
                    background-size: 100rpx 32rpx;
                    background-repeat: no-repeat;
                    background-position: center bottom;
                }
            }
        }
        .content {
            position: relative;
            width: 654rpx;
            background: #ffffff;
            border-radius: 32rpx;
            margin-left: 32rpx;
            padding: 48rpx 24rpx 32rpx 32rpx;
            font-weight: 800;
            margin-top: 36rpx;
            margin-bottom: 88rpx;
            .shade {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                text-align: center;
                background: rgba(
                    255,
                    255,
                    255,
                    0.1
                ); /* 透明白色（透明度30%） */
                backdrop-filter: blur(3px); /* 关键：毛玻璃模糊效果 */
                z-index: 100;
                border-radius: 32rpx;
                color: rgba(139, 147, 169, 0.8);
                .text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .title1 {
                width: 248rpx;
                height: 80rpx;
                position: absolute;
                z-index: 1;
                font-size: 32rpx;
                top: -56rpx;
                left: 20rpx;
                padding-top: 16rpx;
                text-align: center;
                background-size: 100% 100%;
                &::before {
                    content: attr(data-text);
                    position: absolute;
                    -webkit-text-stroke: 4rpx #fff;
                    z-index: -1;
                }
                z-index: 101;
            }
            .schedule {
                width: 590rpx;
                height: 60rpx;
                background: #f3f3f5;
                border-radius: 8rpx;
                padding: 0 24rpx;
                margin-bottom: 32rpx;
                .progress-view {
                    width: 468rpx;
                    height: 12rpx;
                    background: rgba(255, 172, 0, 0.2);
                    border-radius: 30rpx;
                    display: flex;
                    box-sizing: border-box;
                    overflow: hidden;
                    &.active {
                        background: linear-gradient(
                            90deg,
                            #ffb700 0%,
                            #fe6700 100%
                        );
                    }
                    .progress {
                        height: 100%;
                        background: linear-gradient(
                            90deg,
                            #ffb700 0%,
                            #fe6700 100%
                        );
                        border-radius: 6rpx;
                    }
                }
                .txt {
                    color: #fe6700;
                }
            }

            .details {
                .left {
                    font-size: 28rpx;
                    color: #000000;
                    height: 100%;
                    .msg {
                        margin-top: 16rpx;
                        margin-bottom: 16rpx;
                    }
                    span {
                        color: #ff1f6b;
                        height: 48rpx;
                        line-height: 48rpx;
                    }
                    .bottom {
                        width: 400rpx;
                        font-weight: 500;
                        font-size: 24rpx;
                        color: #86838c;
                        margin-bottom: 8rpx;
                        .ico {
                            width: 48rpx;
                            height: 48rpx;
                            margin-right: 16rpx;
                        }
                        .right_text {
                            height: 48rpx;
                            line-height: 48rpx;
                            max-width: 300rpx;
                            margin-right: 5rpx;
                        }
                    }
                }
            }
            .right {
                min-width: 140rpx;
                padding: 0 16rpx;
                height: 60rpx;
                border-radius: 30rpx;
                font-weight: bold;
                font-size: 24rpx;
                line-height: 60rpx;
                text-align: center;
                margin-left: auto;
                flex-shrink: 0;
                color: #ffffff;
                background: linear-gradient(277deg, #ff7c7e 0%, #ff1268 100%);
                &.active {
                    color: #86838c;
                    background: #f3f3f5;
                }
            }
            &:last-child {
                margin-bottom: 0;
            }
        }
        .upload {
            width: 100%;
            height: 832rpx;
            padding-top: 188rpx;
            font-weight: bold;
            font-size: 32rpx;
            color: #000000;
            .img {
                width: 180rpx;
                height: 180rpx;
                margin: 0 auto 24rpx;
                background-size: 100% 100%;
                animation: swing 2s infinite ease-in-out;
            }
            .text {
                width: 100%;
                text-align: center;
                &::after {
                    content: "...";
                    animation: dot-animation 1.5s infinite step-end;
                }
            }
            @keyframes dot-animation {
                0% {
                    content: ".";
                }
                33% {
                    content: "..";
                }
                66% {
                    content: "...";
                }
            }
            @keyframes swing {
                0%,
                100% {
                    transform: rotate(-40deg);
                }
                50% {
                    transform: rotate(10deg);
                }
            }
        }
    }
    .gz {
        position: absolute;
        right: 0;
        top: 215rpx;
        width: 48rpx;
        height: 144rpx;
        background-image: url("https://img-test.chaoshewang.com/product/99988016abf1ae73d716cba5345bac30.png");
        background-size: 100% 100%;
        z-index: 999;
    }
}
.forbid1 {
    // pointer-events: none !important;
    opacity: 0.6;
}
</style>