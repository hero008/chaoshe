<template>
    <view class="notice-details" :style="{paddingTop: MBInfo().top + 'px'}">
        <view class="icof" style="font-size: 50rpx; margin-right: 8px;margin-left: 16px;" @click.stop="gateBack">&#xe72c;</view>
        <view class="n_info" :style="{ height: conHeight }">
            <view class="l_tit">
                <view class="n_name ellipsis2">{{ content.title }}</view>
                <view class="n_txt flex_r flex_ac">
                    <view class="n_timt_ico"></view>
                    <view>{{ content.date || content.startTime }}</view>
                </view>
            </view>
            <div class="notice">
                <view :class="[goodsList.length ? 'text' : 'goodsShow']">
                    <u-parse
                        :content="content.content"
                        :selectable="true"
                    ></u-parse>
                </view>
                <view class="goods" v-if="goodsList.length">
                    <view
                        class="goods_box"   
                        :class="[goodsList.length < 3 ? 'flex_jc' : '']"
                    >
                        <view
                            class="goods_list"
                            v-for="(item, index) in goodsList"
                            :key="index"
                            @click="clickHandler(item)"
                        >
                            <view class="goods_imgBox">
                                <img class="goods_img" :src="item.thumb" />
                                <view v-if="item.num" class="goods_num"
                                    >X{{ item.num }}</view
                                >
                            </view>

                            <view class="goods_name ellipsis">{{
                                item.name
                            }}</view>
                        </view>
                    </view>
                    <view
                        class="getBtn"
                        :class="{ active: content.accept }"
                        @click="getGoods"
                        >{{ content.accept ? "已领取" : "一键领取" }}</view
                    >
                </view>
            </div>
        </view>
        <gachaDetails ref="gachaDetails" />
    </view>
</template>
<script>
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            content: {},
            goodsList: [],
        };
    },
    computed: {
        conHeight() {
            let h = this.SystemInfo.screenHeight;
            let va = this.MBInfo();
            let th = va.height + va.top + 2;
            let str = h - th + "px";
            return str;
        },
    },
    onLoad(da) {
        // for (let s of getApp().globalData.noticeInfo) {
        //     if (s.id == da.index) {
        //         this.content = s;
        //     }
        // }

        this.getContent(da.id, da.index);
    },
    methods: {
        getContent(id, index) {
            this.goodsList = [];
            let url = "";
            if (index) url = "v1/publicize/mail/read";
            else url = "v1/system/notice/read";
            post(url, { id: id }).then((res) => {
                if (!res.code) {
                    if (index) {
                        this.goodsList = res.data.attachment;
                        this.content = res.data;
                    } else this.content = res.notice;
                }
            });
        },
        async getGoods() {
            await post("v1/publicize/mail/accept", {
                id: this.content.id,
            }).then((res) => {
                if (!res.code) {
                    uni.$u.toast("领取成功");
                } else uni.$u.toast(res.message);
            });
            await post("v1/publicize/mail/read", {
                id: this.content.id,
            }).then((res) => {
                if (!res.code) {
                    this.goodsList = res.data.attachment;
                    this.content = res.data;
                } else uni.$u.toast(res.message);
            });
        },
         clickHandler(item) {
            this.gachaDetailsMethod(this,item.value)
        },
    },
};
</script>
<style lang="scss">
.notice-details {
    width: 100%;
    height: 100vh;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/gg_bg.png");
    background-size: 100% 100%;
    padding-top: 88rpx;
    overflow: hidden;
    .icon {
        position: sticky;
        top: 0;
        width: 48rpx;
        height: 48rpx;
        margin-left: 30rpx;
        margin-bottom: 36rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/niudan/ndj_back.png");
        background-size: 100% 100%;
    }
}
.n_info {
    .l_tit {
        margin-bottom: 20rpx;
    }
    .n_name {
        font-weight: bold;
        font-size: 36rpx;
        color: #343434;
        text-align: center;
        margin-bottom: 8rpx;
        padding: 0 96rpx;
    }
    .n_txt {
        font-size: 24rpx;
        color: #999;
        width: 100%;
        justify-content: center;
        .n_timt_ico {
            width: 26rpx;
            height: 26rpx;
            margin-right: 16rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/date.png");
            background-size: 100% 100%;
        }
    }
    .notice {
        height: calc(100% - 228rpx);
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/home/gg_text.png");
        background-size: 100% 100%;
        overflow: hidden;
        padding: 72rpx 0;
        color: #343434;
        .text {
            height: calc(100% - 220rpx);
            padding: 0 88rpx;
            overflow-y: auto;
        }
        .goodsShow {
            width: 100%;
            padding: 0 88rpx;
            height: calc(100% - 20rpx);
            overflow-y: auto;
        }
        .goods {
            width: 100%;
            .goods_box {
                width: 660rpx;
                margin: 0 auto;
                padding: 10rpx 0;
                border: 2px dashed #db99ff;
                display: flex;
                overflow-x: auto;
                .goods_list {
                    // width: 100rpx;
                    .goods_imgBox {
                        position: relative;
                        width: 72rpx;
                        height: 72rpx;
                        margin: auto;
                        .goods_img {
                            
                            width: 72rpx;
                            height: 72rpx;
                        }
                        .goods_num {
                            padding: 2rpx 10rpx;
                            height: 30rpx;
                            border-radius: 6rpx;
                            line-height: 30rpx;
                            background: rgba(0, 0, 0, 0.5);
                            position: absolute;
                            color: #fff;
                            text-align: center;
                            font-size: 24rpx;
                            right: 0;
                            top: 42rpx;
                        }
                    }

                    .goods_name {
                        width: 200rpx;
                        height: 50rpx;
                        margin-top: 10rpx;
                        text-align: center;
                    }
                }
            }

            .getBtn {
                width: 260rpx;
                height: 81rpx;
                line-height: 81rpx;
                font-weight: 500;
                font-size: 32rpx;
                color: #fff;
                text-align: center;
                background: linear-gradient(104deg, #db99ff 0%, #ff82e7 100%);
                border-radius: 40rpx;
                margin: 20rpx auto 0;
                &.active {
                    background: rgba(226, 225, 227, 0.5);
                    pointer-events: none;
                    color: #db99ff;
                }
            }
        }
    }
}
</style>