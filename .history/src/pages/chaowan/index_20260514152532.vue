<!-- 潮玩界面 -->
<template>      
                                                                    <!-- 获取高度,返回写死的 -->
    <view class="chaowan" :class="{ mpWeixin: ISmp() }" :style="{ paddingTop: MBInfo().top + 'px' }">
        <!-- 搜索框 -->
        <x-search v-model="keyword" @search="onClickSearhResult" :height="MBInfo().height" :width="boundW" />
        <div class="chaowan-scroll-box" :style="{
            height: 'calc(100% - ' + MBInfo().height + 'px)',
            paddingTop: '28rpx',
        }">
            <scroll-view class="chaowan-scroll" @scrolltolower="onReachScollBottom" :scroll-y="true">
                <u-swiper @click="tn" :list="list3" indicator height="294rpx" indicatorMode="dot" circular
                    radius="18rpx" indicatorStyle="bottom: 10px" indicatorActiveColor="#7240F1"
                    indicatorInactiveColor="#fff"></u-swiper>
                <div class="chaowan_con">
                    <!-- 小程序没有 -->
                    <div class="tabs flex_r flex_ac flex_jb">
                        <div class="tag_item" :class="{ active: active == 1 }" @click="ontab(1)">
                            <img src="https://img.chaoshewang.com/static/img/cw-new/cw_tag_bg.png" class="tag_bg" />
                            <div class="tag_txt">乐享潮玩</div>
                        </div>
                        <div class="tag_item" :class="{ active: active == 2 }" @click="ontab(2)">
                            <img src="https://img.chaoshewang.com/static/img/cw-new/cw_tag_bg.png" class="tag_bg" />
                            <div class="tag_txt">新品预约</div>
                        </div>
                    </div>
                    <!-- 小程序没有 -->
                        <!-- 乐享 -->
                    <div class="paly_boxs" v-if="active == 1">
                        <div class="paly_item flex_r flex_ac flex_jb" :class="{ 'dy': i.type == 3 }"
                            v-for="(i, s) in playingMethod" :key="s" @click.stop="onClickViewPrizeBox(i)">
                            <img :src="i.adimg" class="paly_img" />
                            <div class="paly_info flex_c flex_jb">
                                <div class="p_name" :style="{ color: i.type == 3 ? '#fff' : '' }">{{ i.name }}</div>
                                <div class="tags">
                                    <img v-for="(j, k) in i.tegs" :key="k"
                                        :src="`https://img.chaoshewang.com/static/img/cw-new/ico_${j}.png`"
                                        :class="[i.type !== 5 ? j : j + '1', i.type == 3 ? 'base-tag' : i.type == 3]" />
                                </div>
                                <div class="bb flex_r flex_ac flex_jb" :style="{ color: i.type == 3 ? '#A78C8F' : '' }">
                                    <span>{{ i.txt }}</span>
                                    <div class="btn" @click.stop="onClickViewPrizeBox(i)">抽赏 </div>
                                </div>
                                <img src="https://img.chaoshewang.com/static/img/cw-new/yfs_logo.png" v-if="i.type == 1"
                                    class="yfs_logo" />
                                <view class="qita_logo" v-else></view>
                                <!-- <img src="https://img.chaoshewang.com/static/img/home/ico_ico.png" v-else /> -->
                            </div>
                        </div>
                    </div>
                    <!-- 新品预约 -->
                    <div class="subscribe paly_boxs" v-if="active == 2">
                        <div class="paly_item flex_r flex_ac flex_jb" v-for="(i, s) in orderList" :key="s">
                            <img :src="i.coverThumb" class="paly_img" />
                            <div class="paly_info flex_c flex_jb">
                                <div class="p_name">
                                    <div class="t1 ellipsis"> {{ i.themeName }}</div>
                                    <div class="t2">{{ i.startTime }} 准时上新</div>
                                </div>
                                <div class="tags">
                                    <img v-for="(j, k) in i.tegs" :key="k"
                                        :src="`https://img.chaoshewang.com/static/img/cw-new/ico_${j}.png`"
                                        :class="[i.type !== 5 ? j : j + '1']" />
                                </div>
                                <div class="bb flex_r flex_ac flex_jb">
                                    <div>
                                        ￥<span class="pn">{{ i.price }} / 抽</span>
                                    </div>
                                    <div class="btn" @click="onClickOrder(i.id, i.isSub)">
                                        {{ i.isSub ? "预约成功" : "点击预约" }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <u-empty v-if="orderList.length < 1" text="今天没有新品预约~"
                            icon="https://img.chaoshewang.com/static/img/home/empty.png" :marginTop="50" />
                    </div>
                </div>
                <div class="gap"></div>
            </scroll-view>
        </div>
        <!-- 操作提示,注意是否需要 不需要-->
        <x-modal :visible.sync="downShow" />
    </view>
</template>
<script>    
import xSearch from "@/components/modules/x-search.vue";
import { post } from "@/utils/api.js";
import xModal from "@/components/modules/x-modal";
import { service } from '@/utils/fun.js';
export default {
    data() {
        return {
            list3: [],
            active: 1,
            playingMethod: [
               
                {
                    name: "潮游赏",
                    // tegs: ["cs2", "oh2", "wxs2"],
                    tegs: ["cxy", "oh3", "wxsDy"],
                    txt: "刺激停不下来",
                    adimg: "https://img.chaoshewang.com/static/img/duoyou/c7.png",
                    type: 3,
                    path: "/pages/chaowan/gachasList",
                },
                {
                    name: "潮社赏",
                    tegs: ["jqs", "Lucky", "Last"],
                    txt: "趣味无穷",
                    adimg: "https://img.chaoshewang.com/static/img/cw-new/c5.png",
                    type: 5,
                    path: "/pages/chaowan/gachasList",
                },
                {
                    name: "潮魂扭蛋机",
                    tegs: ["Lucky", 'super'],
                    txt: "手办、3C、雕像",
                    adimg: "https://img.chaoshewang.com/static/img/cw-new/c7.png",
                    type: 2,
                    path: "/pages/chaowan/gachasList",
                },
                {
                    name: "疯狂洞洞乐",
                    tegs: ["Lucky"],
                    txt: "童年经典再现",
                    adimg: "https://img.chaoshewang.com/static/img/cw-new/c8.png",
                    type: 4,
                    path: "/pages/chaowan/gachasList",
                },
                
                {
                    name: "一番赏",
                    tegs: ["Last"],
                    txt: "万代官方正品",
                    adimg: "https://img.chaoshewang.com/static/img/cw-new/c9.png",
                    type: 1,
                    path: "/pages/chaowan/gachasList",
                },
                // #endif
            ],
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
            orderTxt: ["点击预约", "已预约"],
            orderList: [],
            noticeList: [],
            keyword: undefined, // 搜索热门交易
            ismp: false,
            downShow: false,
        };
    },
    components: {  xSearch, xModal },
    props: {
        inx: {
            type: Number,
            default: 1,
        },
    },
    watch: {
        inx: {
            immediate: true,
            deep: true,
            handler(va) {
                let num = this.$gl("chaowanInx");
                this.ontab(Number(num) || this.active);
            },
        },
    },
    computed: {
        boundW() {
            let w = this.SystemInfo.windowWidth;
            let va = this.MBInfo().width;
            return w - va - 32;
        },
    },
    created() {
        // #ifdef MP-WEIXIN
        this.ismp = true;
        // #endif
        this.getBannerList();
    },
    mounted() { },
    methods: {
        getBannerList() {
            this.list3 = [];
            post("v1/publicize/banner/list").then((res) => {
                for (let s of res.banners) {
                    this.list3.push({
                        url: s.bannerUrl,
                        id: s.targetId,
                        type: s.type,
                        name: s.name,
                        key: s.protocolKey,
                        targetType: s.targetType,
                    });
                }
            });
            post("v1/system/notice/list", {
                type: 1,
            }).then((res) => {
                this.noticeList = res.notices;
                getApp().globalData.noticeInfo = res.notices;
            });
        },
        ontab(index) {
            this.active = index;
            if (index == 1) {
                // 玩法
            } else if (index == 2) {
                // 预约
                post("v1/gacha/booking/list", {
                    type: 0, // 0: 所有, 1:一番赏, 2:彩蛋机, 3:潮游赏
                    is_mp: this.ismp,
                    ...this.pageda,
                }).then((res) => {
                    if (this.pageda.page == 1) this.orderList = [];
                    const mergedA = res.gachas.map(a => ({ ...a, tegs: this.playingMethod.find(b => b.type === a.type)?.tegs }));
                    this.orderList = this.orderList.concat(mergedA);
                    this.pageda.total = res.total;
                });
            }
        },
        onClickViewPrizeBox(da) {
            this.goto(da.path, { type: da.type });
        },
        onClickOrder(id, isSub) {
            if (isSub) return;
            let self = this;
            // #ifdef MP-WEIXIN
            if (!isSub) {
                wx.requestSubscribeMessage({
                    tmplIds: [getApp().globalData.SubscriptionTemplate],
                    success(res) {
                        if (
                            res[getApp().globalData.SubscriptionTemplate] ==
                            "accept"
                        ) {
                            post("v1/gacha/subscribe", {
                                gacha_id: id,
                                option: isSub ? 2 : 1,
                            }).then((res) => {
                                if (res.code) {
                                    uni.$u.toast(res.message);
                                } else {
                                    uni.$u.toast(
                                        isSub ? "已取消预约~" : "预约成功！"
                                    );
                                    self.ontab(2);
                                }
                            });
                        } else {
                            uni.$u.toast("预约失败！");
                        }
                    },
                    fail(err) {
                        uni.$u.toast("预约失败！");
                    },
                });
            } else {
                post("v1/gacha/subscribe", {
                    gacha_id: id,
                    option: isSub ? 2 : 1,
                }).then((res) => {
                    if (res.code) {
                        uni.$u.toast(res.message);
                    } else {
                        uni.$u.toast(isSub ? "已取消预约~" : "预约成功！");
                        this.ontab(2);
                    }
                });
            }
            // #endif
            // #ifndef MP-WEIXIN
            post("v1/gacha/subscribe", {
                gacha_id: id,
                option: isSub ? 2 : 1,
            }).then((res) => {
                uni.$u.toast(isSub ? "已取消预约~" : "预约成功！");
                this.ontab(2);
            });
            // #endif
        },
        onClickSearhResult() {
            this.goto("/pages/chaowan/gachasList", {
                type: 0,
                keyword: this.keyword,
            });
        },
        tn(index) {
            const item = this.list3[index];
            const { type, id, key, targetType } = item;
            const itemJson = JSON.stringify(item);
            // 产品类型路由处理函数
            const productRoutes = {
                1: () =>
                    id !== 0 && this.goto("/pages/product/yifanshang", { id }),
                2: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/niudan", { id });
                    // #endif
                },
                3: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/chaowanshang", { id });
                    // #endif
                },
                4: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/dongle", { id });
                    // #endif
                },
                5: () => {
                    if (id === 0) return;

                    // #ifdef MP-WEIXIN
                    this.downShow = true;
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.goto("/pages/product/chaosheshang", { id });
                    // #endif
                },
            };

            // 活动类型路由处理函数
            const activityRoutes = {
                100: () => this.goto("/page-activity/activity/index"),
                102: () => this.goto("/page-activity/ticket/index", { itemJson }),
                103: () => this.goto("/page-activity/huigui/index", { id }),
                104: () => this.goto("/page-activity/ticketc/index", { id }),
                105: () => this.goto("/page-activity/ocean/index", { id }),//id === 0 &&
                106: () => this.goto("/page-activity/turntable/index", { id }),
                107: () => this.goto("/page-activity/pyramid/index", { id }),
                108: () => this.goto("/page-activity/newYear/index", { id }),
                411: () => this.goto("/page-activity/battleOrder/index", { id }),//战令
                400: () => this.goto('/page-activity/welfare/index', { id }),//任务
                109: () =>
                    this.goto("/page-activity/friendReturn/index", {
                        itemJson,
                    }),
                200: () =>
                    this.goto("/page-activity/activityDescription/index", {
                        id,
                        key,
                        targetType,
                    }),
                201: () => this.goto('/pages/common/rulepop', { key }),
                300: () => service(),
                101: () => { }, // 不执行任何操作
            };

            // 合并所有路由处理函数
            const routeHandlers = { ...productRoutes, ...activityRoutes };
            // 执行对应的路由处理函数
            if (routeHandlers[type]) {
                routeHandlers[type]();
            }
        },
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.ontab(2);
            }
        },
    },
};
</script>
<style lang='scss' scoped>
.chaowan {
    width: 100vw;
    height: 100vh;
    position: relative;
    padding: 96rpx 32rpx 130rpx;
    background-image: url("https://img.chaoshewang.com/static/img/cw-new/cw_bg.png");
    background-size: 100% 100%;
}

.chaowan-scroll {
    height: 100%;
}

.chaowan_con {
    min-height: calc(100% - 380rpx);
    padding: 20rpx 0;
    background: #e9ebfa;
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.15);
    border-radius: 20rpx;
    margin-top: 28rpx;

    .tabs {
        margin-bottom: 32rpx;
        padding: 0 20rpx;

        .tag_item {
            width: calc(50% - 10rpx);
            height: 78rpx;
            background-color: #f8f9fd;
            border-radius: 20rpx;
            position: relative;
        }

        .tag_txt {
            width: calc(100%);
            height: 78rpx;
            text-align: center;
            line-height: 78rpx;
            font-weight: 500;
            font-size: 32rpx;
            color: #928fa6;
            position: absolute;
            right: 0;
            top: 0;
        }

        .tag_bg {
            display: none;
            width: calc(100% + 10rpx);
            height: 105rpx;
            position: absolute;
            left: -5rpx;
            top: 0;
        }

        .active {
            .tag_bg {
                display: inline-block;
            }

            .tag_txt {
                color: #fff;
            }
        }
    }

    .paly_boxs {
        height: 100%;
        padding: 0 20rpx;

        .paly_item {
            background: #fff;
            border-radius: 16rpx;
            box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.15);
            margin-bottom: 20rpx;
            height: 256rpx;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .dy {
            background: #4F1A1F;
            box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.15);
        }


        .paly_img {
            width: 284rpx;
            height: 256rpx;
        }

        .paly_info {
            height: 256rpx;
            width: calc(100% - 282rpx);
            padding: 26rpx 20rpx;
            position: relative;

            .p_name {
                font-size: 36rpx;
                color: #6457a7;
                font-weight: 800;
            }

            .jqs1 {
                width: 84rpx;
                height: 40rpx;
            }

            .super {
                width: 180rpx;
                height: 56rpx;
            }

            .Lucky1 {
                width: 112rpx;
                height: 40rpx;
                margin: 0 12rpx;
            }

            .Last1 {
                width: 92rpx;
                height: 44rpx;
            }

            .Lucky {
                width: 138rpx;
                height: 44rpx;
            }

            .Last {
                width: 116rpx;
                height: 44rpx;
                margin-right: 12rpx;
            }

            .cxy {
                width: 116rpx;
            }

            .oh3 {
                width: 92rpx;
            }

            .wxsDy {
                width: 92rpx;
            }

            .base-tag {
                height: 40rpx;
                padding: 4rpx 8rpx;
                box-sizing: border-box;
                border: none;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 36rpx;
            }

            .tag {
                width: 116rpx;
                height: 44rpx;

                &.w {
                    width: 138rpx;
                    margin-left: 8rpx;
                }
            }

            .tag2 {
                width: 78rpx;
                height: 26rpx;
                margin-right: 26rpx;

                &:last-child {
                    margin-right: 0;
                }
            }

            .tag3 {
                width: 96rpx;
                height: 40rpx;
                margin-right: 26rpx;

                &:last-child {
                    margin-right: 0;
                }
            }

            .bb {
                font-weight: 500;
                font-size: 24rpx;
                color: #6457a7;

                .btn {
                    padding: 8rpx 30rpx;
                    color: #fff;
                    font-size: 24rpx;
                    border-radius: 36rpx;
                    background: linear-gradient(90deg,
                            #fe4394 0%,
                            #ff870c 100%);
                }
            }
        }
    }

    .yfs_logo {
        width: 56rpx;
        height: 56rpx;
        position: absolute;
        right: 20rpx;
        top: 20rpx;
    }

    .qita_logo {
        width: 56rpx;
        height: 38rpx;
        position: absolute;
        background: url("@/static/homePage/ico.png");
        background-size: 100% 100%;
        right: 20rpx;
        top: 20rpx;
    }

    .subscribe {
        .paly_item {
            padding: 14rpx 20rpx;
        }

        .paly_img {
            width: 216rpx;
            height: 216rpx;
            border-radius: 12rpx;
        }

        .paly_info {
            height: 216rpx;
            width: calc(100% - 216rpx);
            padding: 6rpx 0 6rpx 20rpx;

            .p_name {
                font-size: 28rpx;

                .t2 {
                    font-weight: 500;
                    font-size: 24rpx;
                    margin-top: 8rpx;
                }
            }
        }

        .pn {
            font-size: 36rpx;
            font-weight: 600;
        }
    }
}

.gap {
    height: 60rpx;
}

.mpWeixin {
    .notice-bar {
        width: calc(100% - 160rpx);
    }
}
</style>