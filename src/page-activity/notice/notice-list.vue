<template>
    <view class="notice-list">
        <view class="header">
            <view class="title flex_r flex_ac"
                ><view class="icon" @click.stop="gateBack"></view>
                <view class="txt">资讯中心</view>
                <!-- #ifndef MP-WEIXIN -->
                <view class="icon1 flex_r flex_ac" @click="onDeleteAll"
                    ><view class="sba"></view><view class="text">全部已读</view>
                </view>
                <!-- #endif -->
            </view>
            <view class="wrapper">
                <u-sticky>
                    <u-tabs
                        lineWidth="56rpx"
                        lineHeight="10rpx"
                        :is-scroll="false"
                        :list="navbar"
                        @click="ontab"
                        :activeStyle="{
                            color: '#343434',
                            fontWeight: '800',
                            fontSize: '32rpx',
                        }"
                        :inactiveStyle="{
                            color: '#606266',
                            fontWeight: '500',
                            fontSize: '28rpx',
                        }"
                        lineColor="#8745EE"
                        itemStyle=" height: 96rpx;"
                        :current="currentTab"
                    >
                    </u-tabs>
                </u-sticky>
            </view>
        </view>
        <!-- #ifndef MP-WEIXIN -->
        <scroll-view
            scroll-y="true"
            class="list"
            @scrolltolower="onReachScollBottom"
            :lower-threshold="400"
            @touchstart.stop="touchstart"
            @touchmove.stop="touchmove"
            @touchend.stop="touchend"
            v-if="showList"
        >
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <scroll-view
            scroll-y="true"
            class="list"
            @scrolltolower="onReachScollBottom"
            :lower-threshold="400"
            v-if="showList"
        >
         <!-- #endif -->
            <view
                class="item flex_r flex_jb flex_ac"
                @click="
                    goto('/page-activity/notice/notice-details', {
                        id: item.id,
                        index: currentTab,
                    })
                "
                v-for="(item, index) in noticeList"
                :key="index"
            >
                <view class="l_tit">
                    <view class="n_name flex_r flex_ac">
                        <view
                            class="red"
                            v-if="!(item.isRead || item.read)"
                        ></view>
                        <view class="name flex_r flex_ac">
                            {{ item.title }}</view
                        >
                    </view>
                    <view class="n_txt flex_r flex_js flex_ac">
                        <img
                            src="https://img.chaoshewang.com/static/img/home/date.png"
                            class="n_timt_ico"
                        />
                        <view>{{ item.startTime || item.date }}</view>
                    </view>
                </view>
                <view class="r_ico icof">&#xe72b;</view>
            </view>
        </scroll-view>
        <u-empty
            v-else
            text="暂无资讯~"
            icon="https://img.chaoshewang.com/static/img/home/empty.png"
            :marginTop="50"
        />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            noticeList: [],
            navbar: [
                {
                    name: "系统通知",
                },
                {
                    name: "个人通知",
                    badge: { value: 0 },
                },
            ],
            currentTab: 0, // 展示 tabs哪一项的
            startX: 0, // 触摸开始位置
            endX: 0, // 触摸结束位置
            moveX: 0, // 移动距离
            pageda: {
                page: 1,
                page_size: 15,
                total: 0,
            },
            showList:false
        };
    },
    mounted() {
        this.navbar[1].badge.value = this.mail;
    },
    onLoad() {},
    onShow() {
        this.getLis();
    },
    methods: {
        ...mapMutations(["UpMail"]),
        ontab(e) {
            this.currentTab = e.index;
            this.getLis();
        },
        getLis() {
            let url = "",
                data = {};
            if (this.currentTab) {
                url = "v1/publicize/mail";
                data = {
                    page: this.pageda.page,
                    page_size: this.pageda.page_size,
                };
            } else {
                url = "v1/system/notice/list";
                data = { type: 1 };
            }
            post(url, data).then((res) => {
                if (!res.code) {
                    if (this.currentTab) {
                        this.noticeList = res.data;
                        this.showList=res.data.length?true:false;
                        this.navbar[1].badge.value = res.unread;
                        this.UpMail(res.unread);
                    } else {
                        this.noticeList = res.notices;
                        getApp().globalData.noticeInfo = res.notices;
                        this.showList=res.notices.length?true:false;
                    }
                }
            });
        },
        async onDeleteAll() {
            await post("v1/publicize/mail/read", { id: 0 }).then((res) => {
                if (!res.code) {
                    uni.$u.toast("已读成功~");
                    this.UpMail(0);
                    this.navbar[1].badge.value = 0;
                }
            });
            this.getLis();
        },
        // 触摸开始事件
        touchstart(e) {
            this.startX = e.touches[0].clientX;
        },
        // 触摸移动事件
        touchmove(e) {
            this.moveX = e.touches[0].clientX - this.startX;
        },
        // 触摸结束事件
        touchend(e) {
            this.endX = e.changedTouches[0].clientX;
            let distance = this.endX - this.startX;
            // 判断滑动方向和距离是否足够触发切换
            // 通常需要一定的滑动距离才触发，这里设置为50px
            if (Math.abs(distance) > 160) {
                if (distance > 0) {
                    // 右滑，切换到上一个标签
                    if (this.currentTab > 0) {
                        this.currentTab -= 1;
                        this.noticeList = [];
                    }
                } else {
                    // 左滑，切换到下一个标签
                    if (this.currentTab < this.navbar.length - 1) {
                        this.currentTab += 1;
                        this.noticeList = [];
                    }
                }
            }
            (this.pageda = {
                page: 1,
                page_size: 15,
                total: 0,
            }),
                this.getLis();
            // 重置触摸数据
            this.startX = 0;
            this.endX = 0;
            this.moveX = 0;
        },
        onReachScollBottom() {
            if (
                this.pageda.total > this.pageda.page * this.pageda.page_size &&
                this.currentTab
            ) {
                this.pageda.page++;
                this.getLis();
            }
        },
    },
    computed: {
        ...mapState(["mail"]),
    },
};
</script>
<style lang="scss">
::v-deep .u-tabs__wrapper__nav__line {
    bottom: 0rpx !important;
}
::v-deep .u-empty__text {
    position: relative;
    color: #000 !important;
}

.notice-list {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-bottom: 40rpx;
    background: linear-gradient(72deg, #e1d6f8 0%, #f8e7ed 100%);
    &::before {
        content: "";
        width: 100vw;
        height: calc(100vh - 0rpx);
        position: absolute;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    }
    .header {
        position: sticky;
        top: 0; /* 固定在顶部 */
        z-index: 100; /* 确保在内容上方 */
        width: 100%;
        font-weight: 800;
        font-size: 38rpx;
        color: #343434;
        padding: 88rpx 32rpx 0;
        .title {
            height: 88rpx;
            .icon {
                width: 48rpx;
                height: 48rpx;
                background-image: url("https://img.chaoshewang.com/static/img/niudan/ndj_back.png");
                background-size: 100% 100%;
            }
            .txt {
                margin-left: 232rpx;
            }
            .icon1 {
                font-weight: 500;
                font-size: 24rpx;
                color: #343434;
                margin-left: auto;

                .sba {
                    width: 40rpx;
                    height: 40rpx;
                    background-image: url("https://img.chaoshewang.com/static/img/home/icon-delete.png");
                    background-size: 100% 100%;
                }
                .text {
                    height: 40rpx;
                    margin-left: 8rpx;
                }
            }
        }
        .wrapper {
            width: 100%;

            ::v-deep .u-sticky {
                display: flex;
                justify-content: center;
            }
            ::v-deep .u-tabs__wrapper__nav__item {
                position: relative;
                padding: 0 80rpx;
            }
            ::v-deep.u-badge {
                right: 50rpx;
                top: 20rpx;
                background: #ff411b;
            }
        }
    }
    .list {
        height: calc(100% - 300rpx);
        padding: 28rpx 0;
    }
    .item {
        margin: 0 auto 20rpx;
        background-color: #fff;
        padding: 32rpx;
        border-radius: 20rpx;
        width: 686rpx;
        &:last-child {
            margin-bottom: 0;
        }

        .n_name {
            margin-bottom: 16rpx;
            .red {
                width: 20rpx;
                height: 20rpx;
                background: #ff411b;
                border-radius: 50%;
                margin-right: 8rpx;
            }
            font-weight: bold;
            font-size: 28rpx;
            color: #343434;
            .name {
                width: 580rpx;
            }
        }

        .n_txt {
            font-size: 24rpx;
            color: #999;

            .n_timt_ico {
                width: 24rpx;
                height: 24rpx;
                margin-right: 12rpx;
            }
        }
    }
    .r_ico {
        font-size: 38rpx;
        color: #666;
    }
}
</style>