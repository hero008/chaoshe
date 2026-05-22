<template>
    <view>
        <view class="join" :class="{ active: !val }">
            <view class="top_Back flex_r flex_js flex_ac">
                <img
                    src="https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allFh.png"
                    @click.stop="gateBack"
                    class="Back_ico"
                />{{ val ? "我的开奖记录" : "成团记录" }}
            </view>
            <view class="title ellipsis">{{ title }}</view>

            <view class="list" v-if="val">
                <scroll-view
                    scroll-y="true"
                    class="card_box1"
                    :class="{ active: val == 2, active: !mytotal }"
                    @scrolltolower="onReachScollBottom"
                    :lower-threshold="400"
                    :scroll-into-view="toView"
                    scroll-with-animation="true"
                >
                    <view
                        class="card_item"
                        v-for="(item, index) in list"
                        :key="index"
                        :id="'a' + index"
                    >
                        <view class="card_title flex_r flex_jb flex_ac"
                            ><view class="time">{{ item.createTime }}</view>
                            <view class="name">x{{ item.awardNum }}</view>
                        </view>
                        <view class="card_bottom flex_r flex_wrap flex_jb">
                            <view
                                class="goods flex_r flex_ac"
                                v-for="j in item.items"
                                :key="j.itemId"
                            >
                                <img :src="j.itemCover" class="goods_img" />
                                <view class="goods_name ellipsis2">{{
                                    j.itemName
                                }}</view>
                                <view class="goods_number ellipsis"
                                    >x{{ j.count }}</view
                                >
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="btn_box flex_r flex_jb" v-if="val == 1 && mytotal">
                    <view class="card_btn" @click="onRecurs(2)"></view>
                    <view class="card_btn card_btn1" @click="onRecurs(1)">
                        <view class="card_num" v-if="mytotal"
                            >剩余 x{{ mytotal }}</view
                        >
                    </view>
                </view>
            </view>
        </view>
        <!-- 卡牌动效 -->
        <view class="card_box" v-if="!val">
            <view class="card_list">
                <view class="card"></view>
                <view class="card_num">x{{ pageda.total }}</view>
            </view>
            <view class="card_btn" @click="onGain(1)"></view>
            <view class="card_btn card_btn1" @click="onGain(2)"></view>
        </view>
    </view>
</template>

<script>
import { post } from "@/utils/api.js";
import { mapState} from "vuex";
export default {
    data() {
        return {
            list: [],
            val: null,
            toView: "a0",
            mytotal: 0,
            myId: {},
            pageda: {
                page: 1,
                page_size: 20,
                total: 0,
            },
            dataList: [], //原数据
            title: "",
        };
    },
    computed:{
        ...mapState(["userInfo"]),
    },
    onLoad(da) {
        this.myId = da;
        this.title = decodeURIComponent(da.name);
        this.toView = "a0";
        let storedArray = uni.getStorageSync(`${this.userInfo.id}`);
        if (storedArray.includes(da.id)) {
            this.val = 2;
        } else {
            storedArray.push(da.id);
            uni.setStorageSync(`${this.userInfo.id}`, storedArray);
        }
        this.onClickPrizeMy();
    },
    methods: {
        onShowItem(index) {},
        onReachScollBottom() {
            if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
                this.pageda.page++;
                this.onClickPrizeMy();
            }
        },
        onRecurs(val) {
            if (val == 2) {
                this.val = val;
                this.mytotal = 0;
                this.onClickPrizeMy();
                setTimeout(() => {
                    this.toView = "a0";
                }, 100);
                return;
            }
            this.addList();
        },
        addList() {
            this.list.push(this.dataList[this.list.length]);
            this.mytotal = this.pageda.total - this.list.length;
            setTimeout(() => {
                this.toView = "a" + (this.list.length - 1);
            }, 100);
        },
        onClickPrizeMy() {
            post("v1/gacha/user_record", {
                ...this.pageda,
                gacha_id: this.myId.id,
                box_index: this.myId.index,
            }).then((res) => {
                if (!res.code) {
                    if (this.pageda.page == 1) this.dataList = [];
                    this.dataList = this.dataList.concat(res.records);
                    this.pageda.total = res.total;
                    if (this.val == 2) this.list = this.dataList;
                } else uni.$u.toast(res.message);
            });
        },
        onGain(type) {
            this.val = type;
            if (type == 1) {
                this.list = [this.dataList[0]];
                this.mytotal = this.pageda.total - 1;
            } else {
                this.list = this.dataList;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.join {
    width: 100%;
    height: 100vh;
    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/recordBg.png");
    background-size: 100% 100%;
    overflow: hidden;
    color: #ffffff;
    &.active {
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allCardBg.png");
        background-size: 100% 100%;
    }
    .top_Back {
        position: relative;
        width: 100%;
        padding: 90rpx 32rpx 0;
        font-weight: 800;
        font-size: 36rpx;
        z-index: 999;
        .Back_ico {
            width: 56rpx;
            height: 56rpx;
            margin-right: 32rpx;
        }
    }
    .title {
        margin-top: 32rpx;
        text-align: center;
        font-weight: 800;
        font-size: 32rpx;
        margin-bottom: 16rpx;
        padding: 0 32rpx;
        z-index: 99;
    }
    .list {
        height: calc(100% - 242rpx);
        .card_box1 {
            width: 686rpx;
            margin: 0 auto;
            height: calc(100% - 180rpx);
            .card_item {
                background: #25007d;
                border-radius: 16rpx;
                overflow: hidden;
                margin-bottom: 16rpx;
                .card_title {
                    width: 100%;
                    height: 112rpx;
                    background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/carTitle.png");
                    background-size: 100% 100%;
                    z-index: 90;
                    padding: 0 32rpx 0 120rpx;
                    .time {
                        font-weight: bold;
                        font-size: 28rpx;
                        color: #ffc119;
                    }
                    .name {
                        font-weight: 800;
                        font-size: 40rpx;
                    }
                }
                .card_bottom {
                    padding: 0 24rpx 24rpx;
                    width: 100%;

                    overflow-y: auto;
                    background: linear-gradient(
                        180deg,
                        #25007d 0%,
                        #7f29af 100%
                    );
                    .goods {
                        margin-top: 24rpx;
                        .goods_img {
                            width: 80rpx;
                            height: 80rpx;
                            border-radius: 8rpx;
                        }
                        .goods_name {
                            font-weight: 500;
                            font-size: 24rpx;
                            width: 164rpx;
                            margin-left: 8rpx;
                        }
                        .goods_number {
                            width: 50rpx;
                            text-align: end;
                        }
                    }
                }
            }
            &.active {
                height: 100%;
            }
        }
        .btn_box {
            position: absolute;
            padding: 0 16rpx;
            width: 100%;
            bottom: 50rpx;
            .card_btn {
                width: 352rpx;
                height: 136rpx;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allInMin.png");
                background-size: 100% 100%;
            }
            .card_btn1 {
                position: relative;
                background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/againMin.png");
                background-size: 100% 100%;
                .card_num {
                    position: absolute;
                    right: 28rpx;
                    top: -55rpx;
                    padding: 0 24rpx;
                    height: 64rpx;
                    line-height: 64rpx;
                    background: #ff411b;
                    text-align: center;
                    border-radius: 32rpx 32rpx 32rpx 8rpx;
                }
            }
        }
    }
}
.card_box {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    .card_list {
        position: absolute;
        width: 100%;
        height: 784rpx;
        top: 50%;
        transform: translateY(-60%);
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allLight.png");
        background-size: 100% 100%;
        padding-top: 112rpx;
        .card {
            margin: 0 auto;
            width: 380rpx;
            height: 564rpx;
            background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allCard1.png");
            background-size: 100% 100%;
            transform-style: preserve-3d;
            animation: spin-y 1s linear 2;
        }
        @keyframes spin-y {
            from {
                transform: rotateY(0deg);
            }
            to {
                transform: rotateY(360deg);
            }
        }
        .card_num {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 800;
            color: #ffffff;
            font-size: 56rpx;
            -webkit-text-stroke: 3px transparent;
            background-color: #ae4419;
            -webkit-background-clip: text;
        }
    }
    .card_btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 438rpx;
        height: 136rpx;
        bottom: 220rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/again.png");
        background-size: 100% 100%;
    }
    .card_btn1 {
        bottom: 80rpx;
        background-image: url("https://img.shinemang.com/gachaStatic/static/img/chaowanshang/allIn.png");
        background-size: 100% 100%;
    }
}
</style>