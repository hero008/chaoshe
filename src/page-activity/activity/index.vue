<template>
    <view class="activity">
        <u-navbar :title="message.name" bgColor="transparent" :titleStyle="titleStyle" @leftClick="gateBack"
            leftIconColor="#fff" />
        <div class="activity_con" :style="{ color: colorList.text }">
            <view :style="{ backgroundImage: `url(${imageUrlMap.bg})` }" class="bg" />
            <view :style="{ backgroundImage: `url(${imageUrlMap.class})` }" class="gu" />
            <view class="gz" :style="{ backgroundImage: `url(${imageUrlMap.record})` }"
                @click=" goto('/pages/common/rulepop', { val: 'LuckExpRankingRules' })"></view>
            <div class="topThree sussuspension flex_r flex_ac flex_jc" v-if="topThree.length"
                :style="{ color: colorList.label }">
                <div class="user_item flex_c flex_ac" v-for="value in topThree" :class="value.rahmen">
                    <template>
                        <view :class="value.class" :style="{
                            backgroundImage: `url(${value.label})`,
                        }">{{ value.rankLabel }}</view>
                        <div class="headP">
                            <img :src="value.profile | active" class="avatar" />
                            <view :style="{
                                backgroundImage: `url(${value.top})`,
                            }" class="rahmen2" />
                        </div>
                        <div class="name ellipsis">
                            {{ value.userName }}
                        </div>
                        <div class="nums flex_r flex_ac flex_jc" v-show="value.point">
                            <view class="ico" />
                            <div class="num ellipsis" :style="{
                                color: colorList.text,
                                background: getBg,
                            }">
                                {{ value.point }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="rankList" :style="{ background: colorList.bg }">
                <div class="head_tit flex_r flex_ac flex_jb">
                    <div class="tit">榜单排名</div>
                    <div class="time flex_c flex_ac flex_jse">
                        <view v-if="countDown" class="start">活动开始倒计时</view>
                        <div class="timeBox flex_r flex_ac">
                            <view :style="{
                                backgroundImage: `url(${imageUrlMap.time})`,
                            }" class="ico" />
                            <template v-if="residuetime > 0">
                                <u-count-down :time="residuetime" @change="rtimeChange">
                                    <view class="timetxt" :style="{ color: colorList.time }">
                                        <text>{{ timeData.days }}天</text>
                                        <text>{{ timeData.hours }}小时</text>
                                        <text>{{ timeData.minutes }}分</text>
                                        <text>{{ timeData.seconds }}秒</text>
                                    </view>
                                </u-count-down>
                            </template>
                            <view class="timetxt" :style="{ color: colorList.time }" v-else>已结束</view>
                        </div>
                    </div>
                    <div class="unfold flex_r flex_ac" @click="unfold = !unfold">
                        <span class="txt">{{
                            !unfold ? "查看奖励" : "收起奖励"
                            }}</span>
                        <span :class="['icof', { rotate180: unfold }]">&#xe72d;</span>
                    </div>
                </div>
                <div class="rankList_con">
                    <div class="preview" :style="{
                        background: colorList.min_bg,
                        border: `2rpx solid ${colorList.min_bd}`,
                    }" v-if="unfold">
                        <div class="tit">
                            <span>倒计时结束，TOP{{
                                awards.length || 10
                            }}获得奖励</span>
                            <span :style="{ color: colorList.img_ts }">（左右滑动查看所有奖励）</span>
                        </div>
                        <div class="list">
                            <div class="awards flex_r flex_ac">
                                <div class="award" v-for="(i, s) in awards" :key="s"    @click="ondetail(i.itemList[0].id)">
                                    <img :src="i.thumb" class="award_img" :style="{
                                        backgroundColor: colorList.img_bg,
                                        border: `2rpx solid ${colorList.img_bd}`,
                                    }" />
                                    <div class="a_tit">TOP{{ s + 1 }}奖励</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ranks">
                        <div class="rank_item flex_r flex_ac flex_jb" v-for="i in rank" :key="i.no">
                            <div class="l flex_r flex_ac">
                                <div class="no">{{ i.no }}</div>
                                <img :src="i.profile | active" class="avatar" :style="{
                                    border: `2rpx solid ${colorList.list_img}`,
                                }" />
                                <div :style="{ color: colorList.list_name }">
                                    {{ i.userName }}
                                </div>
                            </div>
                            <div class="r flex_r flex_ac flex_je">
                                <span :style="{ color: colorList.img_ts }" class="txt">欧气值</span>
                                <span class="num">{{ i.point }}</span>
                                <image src="https://img.chaoshewang.com/static/img/activity/ioc2.png" class="ico" />
                            </div>
                        </div>
                        <div class="rank_item flex_r flex_ac flex_jb i_bg" :style="{
                            backgroundImage: `url(${imageUrlMap.my_bg})`,
                            color: colorList.my,
                        }">
                            <div class="l flex_r flex_ac">
                                <div class="no">{{ myrank.no || "-" }}</div>
                                <img :src="myrank.profile | active" class="avatar" :style="{
                                    border: `2px solid ${colorList.my}`,
                                }" />
                                <div>
                                    <div class="userName ellipsis">
                                        {{ myrank.userName }}
                                        <!-- {{ myrank.userName | tmName }} -->
                                    </div>
                                    <div class="tt" v-if="myrank.no > 1">
                                        距上一名差 {{ gap }}
                                    </div>
                                    <div class="tt" v-if="myrank.no > 1">
                                        领先下一名 {{ gapNext }}
                                    </div>
                                    <div class="tt" v-if="myrank.no == 1">
                                        第二名与你相差 {{ gapNext }}
                                    </div>
                                    <div class="tt" v-else-if="myrank.no == 0">
                                        暂未上榜,距上榜还差{{ gap }}
                                    </div>
                                </div>
                            </div>
                            <div class="r flex_r flex_ac flex_je">
                                <span class="txt">欧气值</span>
                                <span class="num">{{ myrank.point }}</span>
                                <image src="https://img.chaoshewang.com/static/img/activity/ioc2.png" class="ico" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
// 荣耀排行榜
import { post, activityLIst } from "@/utils/api.js";
export default {
    data() {
        return {
            titleStyle: {
                fontWeight: 800,
                color: "#fff",
            },
            unfold: true,
            residuetime: 0,
            timeData: {},
            myrank: {},
            topThree: [],
            rank: [],
            awards: [],
            gap: 0,
            gapNext: 0,
            countDown: false,
            colorList: {
                // bg: "#FBF2E5", //背景
                // min_bg: "#FCFBF2", //小框背景
                // min_bd: "#FADCA4", //小框背景边框
                // img_bg: "#ffe5d8", //图片背景色
                // img_bd: "#E1A448 ", //图片边框
                // numbder: "#8E3B00", //
                // badge: "#8E3B00", //欧气值数量
                // text: "#8E3B00", //文字
                // number_bg1: "#FFCE46", //欧气值背景
                // number_bg2: "#FFEF61", //欧气值背景
                // img_ts: "#B67344 ", //提示
                // label: "#fff", //标签
                // time: "#EC8E00", //时间
                // list_name: "#2F2F2F", //列表名字
                // list_img: "#f5433b", //列表名字
                // my: "#FFF5D4", //我的
            },
            imageUrlMap: {
                // bg: "", //背景图
                // class: "", //等级图
                // time: "", //时间
                // top_one: "", //等级1
                // top_two: "", //等级2
                // top_three: "", //等级3
                // label_one: "", //标签1
                // label_two: "", //标签2
                // label_three: "", //标签3
                // badge: "", //欧气值
                // my_bg:'',//我的背景
                // record:'',//规则
            },
            message: {},
        };
    },
    components: {},
    watch: {},
    computed: {
        getBg() {
            return `linear-gradient(274deg, ${this.colorList.number_bg1} 0%, ${this.colorList.number_bg2} 100%) `;
        },
    },
    created() {
        this.loadData();
    },
    mounted() { },
    onLoad(da) { },
    onShow() { },
    methods: {
        async loadData() {
            if (!Object.keys(this.imageUrlMap).length) {
                let a = await activityLIst({ key: ["CostRank"] });
                this.imageUrlMap = a.activities[0].imageUrlMap;
                this.colorList = a.activities[0].paramsMap;
                this.message = a.activities[0];
            }
            post("v1/activity/cost-rank/rank").then((res) => {
                if (!res.code) {
                    this.gap = res.gap;
                    this.gapNext = res.gapNext;
                    this.myrank = res.current;
                    this.rank = res.list.slice(3);
                    // this.topThree = res.list.slice(0, 3);
                    this.topThree = this.formatRankList(res.list.slice(0, 3))

                }
            });
            post("v1/activity/cost-rank/config").then((res) => {
                if (!res.code) {
                    for (const it of res.config.award) {
                        let arr = new Array(it.noLimit - it.noStart + 1).fill(
                            it
                        );
                        this.awards = [...this.awards, ...arr];
                    }
                    let startDate = res.config.startTime.replace(/-/g, "/");
                    let start = new Date(startDate).getTime();
                    let currentTime = new Date().getTime();
                    if (
                        currentTime < start &&
                        Number(start - currentTime) < 86400000
                    ) {
                        this.residuetime = this.remainingTime(res.config.startTime);
                        this.countDown = true;
                    } else {
                        this.residuetime = this.remainingTime(res.config.endTime);
                        this.countDown = false;
                    }
                }
            });

        },
        formatRankList(rawList = []) {
            const defaultRankItems = {
                2: { no: 2, point: 0, rankLabel: "永恒之光", userId: "0", userName: "虚位以待", class: 'title2', rahmen: '', top: this.imageUrlMap.top_two, label: this.imageUrlMap.label_two },
                1: { no: 1, point: 0, rankLabel: "奢华之光", userId: "0", userName: "虚位以待", class: 'title1', rahmen: ' rahmen1', top: this.imageUrlMap.top_one, label: this.imageUrlMap.label_one },
                3: { no: 3, point: 0, rankLabel: "璀璨之光", userId: "0", userName: "虚位以待", class: 'title3', rahmen: ' rahmen3', top: this.imageUrlMap.top_three, label: this.imageUrlMap.label_three },
            };

            // 2. 将原始数据转为对象映射（仅保留no=1/2/3，覆盖默认数据）
            const rankMap = rawList.reduce((map, item) => {
                if ([1, 2, 3].includes(item.no)) {
                    // 后端返回的有效数据覆盖默认值（保持后端返回的name/imgUrl）
                    map[item.no] = { ...defaultRankItems[item.no], ...item };
                }
                return map;
            }, { ...defaultRankItems }); // 先复制默认数据，再用后端数据覆盖

            // 3. 按固定顺序（2→1→3）生成最终数组（必返回3项）
            const finalRankList = [
                rankMap[2], // 第一位：no=2（亚军）
                rankMap[1], // 第二位：no=1（冠军）
                rankMap[3]  // 第三位：no=3（季军）
            ];

            return finalRankList;
        },
        rtimeChange(e) {
            this.timeData = e;
        },
         ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
    },
};
</script>
<style lang="scss" scoped>
.activity {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
}

.activity_con {
    height: 1624rpx;
    
    position: relative;
}

.bg {
    width: 100%;
    height: 880rpx;
    background-size: 100% 100%;
}

.gu {
    position: absolute;
    width: 100%;
    height: 364rpx;
    background-size: 100% 100%;
    // top: 485rpx;
    top: 525rpx;
    left: 0;
}

.gz {
    position: absolute;
    right: 0;
    top: 215rpx;
    width: 48rpx;
    height: 144rpx;
    background-size: 100% 100%;
    z-index: 999;
}

.topThree {
    width: 100%;
    position: absolute;
    top: 270rpx;
    left: 0;
}

.user_item {
    width: 176rpx;
    font-weight: 800;

    .title1 {
        width: 240rpx;
        height: 76rpx;
        background-size: 100% 100%;
        line-height: 76rpx;
        font-size: 28rpx;
        text-align: center;
    }

    .title2 {
        width: 176rpx;
        height: 68rpx;
        background-size: 100% 100%;
        line-height: 68rpx;
        font-size: 24rpx;
        text-align: center;
    }

    .title3 {
        width: 176rpx;
        height: 60rpx;
        background-size: 100% 100%;
        line-height: 60rpx;
        text-align: center;
        font-size: 24rpx;
    }

    .headP {
        width: 176rpx;
        height: 176rpx;
        position: relative;

        .avatar {
            width: 114rpx;
            height: 114rpx;
            border-radius: 50%;
            transform: translateX(-50%);
            position: absolute;
            left: 50%;
            top: 26rpx;
        }

        .rahmen2 {
            width: 176rpx;
            height: 176rpx;
            background-size: 100% 100%;
        }
    }

    .name {
        width: 176rpx;
        font-weight: 800;
        font-size: 28rpx;
        text-align: center;
        margin: -12rpx 0 2rpx;
    }

    .nums {
        .ico {
            width: 36rpx;
            height: 38rpx;
            background-image: url("https://img.chaoshewang.com/static/img/activity/ioc2.png");
            background-size: 100% 100%;
            margin-right: 8rpx;
        }

        .num {
            padding: 0 16rpx;
            height: 32rpx;
            line-height: 32rpx;
            font-weight: 800;
            font-size: 24rpx;
            border-radius: 40rpx;
        }
    }

    &.rahmen1 {
        width: 320rpx;
        margin: -168rpx -6rpx 0;

        .headP {
            width: 300rpx;
            height: 228rpx;

            .avatar {
                width: 154rpx;
                height: 154rpx;
                top: 40rpx;
            }

            .rahmen2 {
                width: 300rpx;
                height: 228rpx;
            }
        }
    }

    &.rahmen3 {
        margin-bottom: -60rpx;
    }
}

.rankList {
    width: 750rpx;
    height: 900rpx;
    border-radius: 48rpx 48rpx 0rpx 0rpx;
    padding: 0 28rpx 32rpx;
    position: absolute;
    bottom: 0;
    left: 0;

    .head_tit {
        height: 102rpx;
        font-size: 24rpx;

        .tit {
            font-weight: 800;
            font-size: 32rpx;
        }

        .time {
            width: 300rpx;
            height: 102rpx;

            .timeBox {
                .ico {
                    width: 32rpx;
                    height: 32rpx;
                    background-size: 100% 100%;
                    margin-right: 10rpx;
                }

                .timetxt {
                    font-weight: 500;
                    font-size: 24rpx;
                }
            }
        }

        .unfold {
            font-weight: 500;
            font-size: 24rpx;

            .icof {
                margin-left: 6rpx;
                font-size: 30rpx;
            }
        }
    }

    .rankList_con {
        height: calc(100% - 68rpx);
        overflow-y: auto;
    }

    .preview {
        margin-bottom: 20rpx;
        padding: 24rpx;
        width: 686rpx;
        height: 356rpx;
        border-radius: 16rpx;

        .tit {
            font-weight: 500;
            font-size: 24rpx;
        }

        .list {
            overflow-x: auto;
            margin-top: 26rpx;

            .award {
                width: 196rpx;
                margin-right: 24rpx;

                &:last-child {
                    margin-right: 0;
                }
            }

            .award_img {
                width: 196rpx;
                height: 196rpx;
                border-radius: 22rpx;
            }

            .a_tit {
                font-weight: 500;
                font-size: 24rpx;
                text-align: center;
            }
        }
    }

    .ranks {
        padding-bottom: 190rpx;

        .rank_item {
            font-weight: 800;
            font-size: 28rpx;
            margin-bottom: 20rpx;

            .avatar {
                width: 94rpx;
                height: 94rpx;
                border-radius: 50%;
                margin: 0 16rpx 0 32rpx;
            }

            .txt {
                font-size: 24rpx;
            }

            .num {
                font-weight: 800;
                margin: 0 12rpx;
            }

            .ico {
                width: 48rpx;
                height: 48rpx;
                margin-top: -6rpx;
            }

            &.i_bg {
                border-radius: 40rpx;
                padding: 10rpx 28rpx;
                position: fixed;
                bottom: 60rpx;
                left: 32rpx;
                width: 686rpx;
                height: 128rpx;
                margin-bottom: 0;
                background-size: 100% 100%;

                .tt {
                    font-size: 20rpx;
                    margin-top: 6rpx;
                }

                .ico {
                    margin-top: 0;
                }
            }
        }
    }
}

.rotate180 {
    transform: rotate(180deg);
}

.sussuspension {
    animation: suspension2 3s ease-in-out infinite;
}

.userName {
    width: 200rpx;
}

@keyframes suspension2 {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(0, -30rpx);
    }
}
</style>