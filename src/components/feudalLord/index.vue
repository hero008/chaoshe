<template>
    <!-- 领主接力弹窗（公共组件）：样式与交互与 duiduipeng.vue 保持一致 -->
    <u-popup :show="show" bgColor="transparent" @close="close" >
        <view class="lord_popup" @touchstart="onLordTouchStart" @touchmove="onLordTouchMove"
            @touchend="onLordTouchEnd" @touchcancel="onLordTouchEnd">
            <view class="close" @click="close"></view>
            <view class="lord_pop_head flex_jc">
                <view class="lord_pop_title">领主接力</view>
                <!-- <view class="lord_pop_close">获得欧气值奖励</view> -->
            </view>
            <view class="lord_owner flex_c flex_ac">
                <img class="lzIcon" src="https://img.shinemang.com/gachaStatic/static/duiduipeng/lzIcon.png" alt="">
                <!-- <view class="crown"></view> -->
                <img :src="lord.avatarUrl | active" class="lord_owner_avatar" />
             
               
            </view>
              <view class="lord_owner_name ellipsis">{{ lord.name }}</view>
            <view class="lord_notice" style="  white-space: nowrap;" v-if="Object.keys(awardsList).length">
               <block>玩家每挑战一发，领主可获得 </block>


                    <block class="lord_notice_awards">
                    <block class="lord_notice_item " v-for="(value, index) in awardsList" :key="index"
                        @click="ondetail(value.value)">
                        {{ value.name }}
                        <block class="lord_notice_num" v-if="value.num > 1">X{{ value.num }}</block>
                    </block>
                    </block>
           
                <!-- <view class="lord_notice_awards flex_r flex_ac flex_wrap">
                    <view class="lord_notice_item flex_r flex_ac" v-for="(value, index) in awardsList" :key="index"
                        @click="ondetail(value.value)">
                        <view class="lord_notice_desc ellipsis">{{ value.name }}</view>
                        <view class="lord_notice_num" v-if="value.num > 1">X{{ value.num }}</view>
                    </view>
                </view> -->
            </view>
            <view class="listBox">
                <view class="lord_tabs flex_r">
                    <!-- Tab背景层：切到领主收益时水平镜像翻转 -->
                    <view class="lord_tabs_bg" :class="{ lord_tabs_bg_flip: tabIndex == 1 }"></view>
                    <view class="lord_tab flex_c flex_ac" :class="{ lord_tab_on: tabIndex == 0 }"
                        @click="switchTab(0)">
                        <view class="lord_tab_txt">领主记录</view>
                        <view class="lord_tab_line"></view>
                    </view>
                    <view class="lord_tab flex_c flex_ac" :class="{ lord_tab_on: tabIndex == 1 }"
                        @click="switchTab(1)">
                        <view class="lord_tab_txt">领主收益</view>
                        <view class="lord_tab_line"></view>
                    </view>
                </view>
                <scroll-view class="lord_list" :scroll-y="true" @scrolltolower="onReachScollBottom"
                    @touchstart="onLordListTouchStart" v-if="lordRecord.length">
                    <view class="lord_item flex_r flex_ac" v-for="(n, i) in lordRecord" :key="i">
                        <img :src="n.avatarUrl | active" class="lord_item_avatar" />
                        <view class="lord_item_info flex_c">
                            <view class="lord_item_name ellipsis">{{ n.name }}</view>
                            <view class="lord_item_time" v-if="tabIndex === 1">{{ n.occupyTime }}</view>
                        </view>
                        <view class="lord_item_value" v-if="tabIndex === 0">占领发数{{ n.num }}发</view>
                        <view class="lord_item_awards flex_c" v-else>
                            <view class="lord_award_row flex_r flex_ac" v-for="(item, ai) in n.revenue" :key="ai">
                                <image class="lord_award_img" :src="item.thumb" mode="aspectFit" />
                                <view class="lord_award_txt ellipsis">{{ item.name }}</view>
                                <view class="lord_award_num" v-if="item.totalNum > 1">X{{ item.totalNum }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <u-empty v-else text="暂无记录" style="position: relative;" textColor="#000" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" />
            </view>
        </view>
        <!-- 物品详情弹窗：组件自持，保证复用时无需宿主页面额外接入 -->
        <gachaDetails ref="gachaDetails" />
    </u-popup>
</template>

<script>
import { post } from "@/utils/api.js";

export default {
    name: "feudalLord",
    props: {
        // 抽赏活动ID，未传时以 open(id) 传入的值为准
        gachaId: {
            type: [String, Number],
            default: "",
        },
    },
    data() {
        return {
            show: false,            // 弹窗显示标志
            tabIndex: 0,            // 当前Tab：0=领主记录 1=领主收益
            touchStartY: 0,         // 关闭手势起点Y
            touchStartX: 0,         // 关闭手势起点X
            touchInList: false,     // 手势是否起始于记录列表内部（列表内滑动不触发关闭）
            lord: { avatarUrl: '', name: '虚位以待' },
            awardsList: [],
            lordRecord: [],         // 领主记录 / 领主收益
            innerGachaId: "",       // open() 传入的活动ID
            pageda: {
                page: 1,
                page_size: 20,
                total: 20,
            },
        };
    },
    methods: {
        /** 打开领主接力弹窗，id 优先取参数，其次取 prop */
        open(id) {
            this.innerGachaId = id || this.gachaId;
            this.tabIndex = 0;
            this.resetPage();
            this.show = true;
            post("v1/activity/lord", {
                gacha_id: this.innerGachaId,
            }).then(res => {
                if (!res.code) {
                    this.awardsList = res.awards || [];
                    this.lord = res.log || { avatarUrl: '', name: '虚位以待' };
                }
            });
            this.getLog();
        },
        /** 关闭领主接力弹窗 */
        close() {
            this.show = false;
            this.resetPage();
            this.$emit("close");
        },
        /** 重置分页状态 */
        resetPage() {
            this.pageda = {
                page: 1,
                page_size: 20,
                total: 20,
            };
        },
        /** 切换Tab */
        switchTab(index) {
            if (this.tabIndex === index) return;
            this.tabIndex = index;
            this.resetPage();
            this.getLog();
        },
        /** 拉取领主记录 / 领主收益列表 */
        getLog() {
            const url = this.tabIndex ? "v1/activity/lord/revenue" : "v1/activity/lord/log";
            post(url, {
                gacha_id: this.innerGachaId,
                page: this.pageda.page,
                pageSize: this.pageda.page_size,
            }).then(res => {
                if (res.code) return;
                if (this.pageda.page == 1) this.lordRecord = [];
                this.lordRecord = this.lordRecord.concat(res.log || res.revenue || []);
                this.pageda.total = res.total || 0;
            });
        },
        /** 触底加载下一页 */
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.getLog();
            }
        },
        /** 记录列表内的滑动：标记后不参与关闭手势判断 */
        onLordListTouchStart() {
            this.touchInList = true;
        },
        /** 关闭手势：记录起点 */
        onLordTouchStart(e) {
            const touch = e.touches && e.touches[0];
            if (!touch) return;
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        },
        /** 关闭手势：向下滑动超过阈值即关闭 */
        onLordTouchMove(e) {
            if (this.touchInList || !this.show) return;
            const touch = e.touches && e.touches[0];
            if (!touch) return;
            const deltaY = touch.clientY - this.touchStartY;
            const deltaX = touch.clientX - this.touchStartX;
            // 向下滑动且以纵向位移为主，避免误触横向滑动
            if (deltaY > 80 && deltaY > Math.abs(deltaX)) {
                this.touchInList = true; // 本次手势已处理，避免重复触发
                this.close();
            }
        },
        /** 关闭手势：重置手势状态 */
        onLordTouchEnd() {
            this.touchInList = false;
            this.touchStartX = 0;
            this.touchStartY = 0;
        },
        /** 物品详情：走全局详情弹窗方法，组件自持 gachaDetails 实例 */
        ondetail(id) {
            if (!id) return;
            this.gachaDetailsMethod(this, id);
        },
    },
};
</script>

<style lang="scss" scoped>
/* 领主接力弹窗 */
.lord_popup {
    width: 100vw;
    height: 1244rpx;
    position: relative;
    
    padding: 44rpx 32rpx 0;
    background: #F5F6F8;
    bottom: -40rpx;
    >view{
        position: relative;
        z-index: 20;
    }
  &::after {
    content: "";
    width: 100vw;
    height: 210rpx;
    left: 0;
    top: 0;
    position: absolute;
    z-index: 1;
    background: url("@/static/payTop.png");
    background-size: 100% 100%;
  }
    .close {
        width: 56rpx;
        height: 56rpx;
        background: url("@/static/close.png");
        background-size: 100% 100%;
        position: absolute;
        top: -80rpx;
        right: 20rpx;
    }

    .lord_pop_head {
        flex-direction: row;
        text-align: center;
        margin-bottom: 40rpx;

        .lord_pop_title {
            font-weight: 600;
            font-size: 36rpx;
            color:#1A1A1A;
        }

        .lord_pop_close {
            font-weight: 500;
            font-size: 24rpx;
            color: #776F7A;
        }
    }

    .lord_owner {
        // width: 100%;
     
        position: relative;
        width: 240rpx;
        height: 220rpx;
        margin: auto;
         
           position: relative;
           display: flex;
           align-items: center;
           justify-content: center;

        .lzIcon{
            width: 240rpx;
            height: 220rpx;
            position: absolute;
            top: 0;
            left: 0;

        }
       


        .lord_owner_avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            // border: 6rpx solid #DE9A35;
            overflow: hidden;
        }


        .crown {
            position: absolute;
            width: 78rpx;
            height: 70rpx;
            background-size: 100% 100%;
            top: -30rpx;
            left: 52%;
            z-index: 3;
        }

    }

        .lord_owner_name {
            font-weight: bold;
            font-size: 28rpx;
       
            text-align: center;
              margin-bottom: 24rpx;
              padding: 0 100rpx;

        }
    .lord_notice {
        width: 686rpx;
height: 52rpx;
background: linear-gradient( 180deg, #FFF7A3 0%, #FFFEF9 100%);
border-radius: 8rpx 8rpx 8rpx 8rpx;
border: 2rpx solid #F894B8;
      
        // min-height: 52rpx;
    
        margin: 0 auto;
        padding: 6rpx 0;
        box-sizing: border-box;
        line-height: 52rpx;
 font-size: 24rpx;
 text-align: center;
            color: #FF659B;
            padding: 0 20rpx;
            overflow-x: auto;
        .lord_notice_row {
            font-weight: 500;
            font-size: 24rpx;
            color: #FF659B;
            flex-shrink: 0;
        }

        /* 物品区：撑不下时换行，不挤压左侧文案 */
        .lord_notice_awards {
            min-width: 0;
            justify-content: flex-start;
        }

        .lord_notice_item {
            max-width: 100%;
            margin-right: 12rpx;

            &:last-child {
                margin-right: 0;
            }
        }

        .lord_notice_img {
            width: 36rpx;
            height: 36rpx;
            margin-left: 8rpx;
            flex-shrink: 0;

        }

        .lord_notice_desc {
            // font-weight: 500;
            font-size: 24rpx;
            color: #FF659B;
            // line-height: 40rpx;
            min-width: 0;
        }

        /* 数量独立成列：不参与压缩与省略 */
        .lord_notice_num {
            font-weight: 500;
            font-size: 24rpx;
            color: #FF7A1A;
            line-height: 40rpx;
            margin-left: 4rpx;
            flex-shrink: 0;
            white-space: nowrap;
        }
    }

    .listBox {
        height: 1008rpx;
        width: 686rpx;
        position: relative;
        background: #fff;
        border-radius: 32rpx;
        padding-top: 18rpx;
        margin-top: 42rpx;

        .lord_tabs {
            position: relative;
            // margin-top: 40rpx;
            width: 686rpx;
            // height: 200rpx;
           
            font-weight: 400;
            font-size: 32rpx;
            display: flex;
            justify-content: center;
            color: #1A1A1A;

            /* 背景独立成层，翻转时不影响Tab文字与下划线 */
            // .lord_tabs_bg {
            //     position: absolute;
            //     top: -16rpx;
            //     /* 抵消父级 padding-top，铺满整个Tab条 */
            //     left: 0;
            //     width: 686rpx;
            //     height: 200rpx;
            //     z-index: 0;
           
            //     /* 默认态也声明 transform，保证列表为空时翻转仍能触发重绘 */
            //     transform: scaleX(1);
            //     will-change: transform;

            //     &.lord_tabs_bg_flip {
            //         transform: scaleX(-1);
            //     }
            // }

            .lord_tab {
                position: relative;
                z-index: 1;
                // flex: 1;
                height: 72rpx;
                justify-content: center;
                margin-right: 110rpx;
                &:last-child{
                    margin-right: 0;
                }

                .lord_tab_txt {
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #8D8D94;
                    position: relative;
                    z-index:4
                }

                .lord_tab_line {
                    width: 128rpx;
                    height: 16rpx;
                    border-radius: 4rpx;
                    margin-top: 4rpx;
                    background: transparent;
                    margin-top: -12rpx;
                    position: static;
                    z-index: 1;
                }

                &.lord_tab_on {
                    .lord_tab_txt {
                        font-weight: bold;
                        color:#1A1A1A;
                    }

                    .lord_tab_line {
                        background:linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
                    }
                }
            }
        }

        .lord_list {
            position: absolute;
            height: 620rpx;
            overflow-y: auto;
            top: 70rpx;
            /* 左右撑满容器，避免绝对定位收缩宽度导致行内元素挤在一起 */
            left: 0;
            right: 0;

            .lord_item {
                width: 100%;
                // height: 120rpx;
                padding: 20rpx 32rpx;
                font-weight: bold;
                font-size: 24rpx;
                box-sizing: border-box;

                .lord_item_avatar {
                    width: 64rpx;
                    height: 64rpx;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .lord_item_name {
                    max-width: 100%;
                }

                /* 名称 + 占领时长纵向信息列 */
                .lord_item_info {
                    margin-left: 16rpx;
                    margin-right: 16rpx;
                    align-items: flex-start;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                }

                .lord_item_time {
                    font-weight: 500;
                    font-size: 24rpx;
                    color: #818181;
                    margin-top: 8rpx;
                    white-space: nowrap;
                }

                .lord_item_value {
                    margin-left: auto;
                    flex-shrink: 0;
                    white-space: nowrap;
                }

                /* 领主收益：单条记录可能含多个物品，纵向右对齐逐行展示 */
                .lord_item_awards {
                    max-width: 260rpx;
                    margin-left: auto;
                    align-items: flex-end;
                    flex-shrink: 0;

                    /* 单个物品：缩略图 + 文案，横向垂直居中 */
                    .lord_award_row {
                        max-width: 100%;
                        justify-content: flex-end;
                    }

                    .lord_award_img {
                        width: 36rpx;
                        height: 36rpx;
                        border-radius: 8rpx;
                        margin-right: 8rpx;
                        flex-shrink: 0;
                    }

                    .lord_award_txt {
                        font-weight: bold;
                        font-size: 24rpx;
                        line-height: 48rpx;
                        text-align: right;
                        min-width: 0;
                        flex-shrink: 1;
                    }

                    /* 数量独立成列：不参与压缩与省略，名称过长时仅省略名称 */
                    .lord_award_num {
                        font-weight: bold;
                        font-size: 24rpx;
                        line-height: 48rpx;
                        margin-left: 4rpx;
                        flex-shrink: 0;
                        white-space: nowrap;
                    }
                }
            }
        }

        &::before {
            content: "";
            width: 100%;
            height: calc(100% - 150rpx);
            bottom: 0rpx;
            position: absolute;
            background: #fff;
        }
    }


}

@keyframes lordPopIn {
    0% {
        opacity: 0;
        transform: translateY(60rpx);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
