<template>
    <view class="rewardResultDetails">
        <div class="details_con" :style="{ paddingTop: padTop }">
            <div class="details">
                <div class="top_tit flex_r flex_ac flex_jb">
                    <div class="l_t">恭喜您抽中</div>
                    <div v-show="!isdemo">赏品已自动放入星仓</div>
                </div>
                <div class="list">
                    <div class="item flex_c flex_ac flex_jc" v-for="(i, s) in awards" :key="s"
                        @click="ondetail(i.itemId)">
                        <img src="https://img.shinemang.com/gachaStatic/static/img/cs-result/border.png"
                            v-if="BigAward.includes(i.levelIndex)" class="active" />
                        <div class="border" v-else></div>
                        <img :src="i.coverImage || i.itemCover" class="img" />
                    </div>
                </div>
                <div class="foot_btn flex_r flex_jc">
                     <view v-if='awards.length > 0 && awards[0].requestId' @click='fangsheng' class="fangsheng">放生</view>
                    <view class="btn" @click="confirmBtn" >确定</view>
                    <!-- <x-btn txt="确定" @click="confirmBtn" cor="3" /> -->
                </div>
            </div>
        </div>
        <gachaDetails ref="gachaDetails" />
             <!-- 通用提示框 -->
        <show-modal></show-modal> 
    </view>
</template>
<script>
import xBtn from "@/components/modules/x-btn";
import {groupByItemId} from '@/utils/mgtv'
import { post } from '../../utils/api';
export default {
    data() {
        return {
            Xdata: {},
            awards: [], // 抽到的赏
            BigAward: [1, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
            isdemo: false,
        };
    },
    components: { xBtn },
    computed: {
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + 10 + "px";
        },
    },
    onLoad(da) {
        if (da.isdemo) {
            this.isdemo = da.isdemo;
        } else {
            this.isdemo = false;
        }
    },
    onShow() {
        this.loadAwards();
    },
    methods: {
        fangsheng() {
           
            const that = this;
           const result = groupByItemId(this.awards)
           console.log(result)
           post('v1/cabinet/decompose/cal-obtained',{item_dict:result}).then((res) => {
            console.log(res);
            if(!res.code){
                     that.$showModal({
                        title: "放生",
                        content: `本次放生共获得${res.balance}星币`,
                        hint: '温馨提示：回收后将无法恢复，请谨慎操作~',
                        success:(res1)=> {
                            if (res1.confirm) {
                                post("v1/cabinet/decompose/by-gacha-order", {
                                    request_id: that.awards[0].requestId,
                                }).then((res2) => {
                                    if (res2.code) {
                                        uni.$u.toast(res2.message);
                                    } else {
                                        uni.$u.toast("放生成功");
                                        setTimeout(()=>{
                                             that.confirmBtn()
                                        },2000)
                                    }
                                });
                            }
                        },
                    });
              }
           })
        },
        loadAwards() {
            this.Xdata = this.$gl("extractAwards"); // 获取本地存储
            console.log(this.Xdata)
            this.awards = this.Xdata.da;
        },
        confirmBtn() {
            let that = this;
            uni.$u.route({
                type: "redirect",
                url: that.Xdata.path,
                params: {
                    id: that.Xdata.id,
                    index: that.Xdata.index,
                },
            });
        },
        ondetail(id) {
            this.gachaDetailsMethod(this, id);
        },
    },
};
</script>
<style lang='scss' scoped>
.rewardResultDetails {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #F5F6F8;

    // &::before {
    //     content: "";
    //     width: 100vw;
    //     height: calc(100vh - 212rpx);
    //     left: 0;
    //     top: 212rpx;
    //     position: absolute;
    //     background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #f0f0f0 50%);
    // }
}

.details_con {
    position: absolute;
    padding: 0 36rpx;
    height: 100vh;
    width: 100%;
    bottom: 0;
    left: 0;
}

.details {
    height: 100%;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    padding: 28rpx 32rpx;

    .top_tit {
        color: #818181;
        font-weight: 500;
        font-size: 24rpx;

        .l_t {
            font-size: 28rpx;
            color: #383228;
            font-weight: bold;
        }
    }

    .list {
        @include grid(200rpx);
        max-height: calc(100% - 50rpx);
        margin-top: 20rpx;
        padding-bottom: 150rpx;
        overflow-y: auto;

        .item {
            width: 200rpx;
            height: 200rpx;
            position: relative;

            .active {
                width: 100%;
                height: 100%;
                animation: breathingLight 3s infinite;
                position: absolute;
                left: 0;
                top: 0;
            }

            .border {
                width: 188rpx;
                height: 188rpx;
                border-radius: 16rpx;
                border: 2rpx solid #cacaca;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .img {
                width: 169rpx;
                height: 169rpx;
                border-radius: 12rpx;
                /* background-color: rgba($color: #9064FF, $alpha: 0.5); */
            }
        }

        @keyframes breathingLight {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.1;
            }

            100% {
                opacity: 1;
            }
        }
    }

    .foot_btn {
        width: 100%;
        position: absolute;
        bottom: 60rpx;
        left: 0;
        display: flex;
        align-items: center;
        .btn{
            width: 228rpx;
            height: 80rpx;
            background: linear-gradient( 90deg, #31E597 0%, #40E0EA 100%);
            border-radius: 40rpx 40rpx 40rpx 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
            font-weight: bold;
         
        }
        .fangsheng{
              width: 228rpx;
            height: 80rpx;
            background: linear-gradient(0deg, #4FEF5F 0.01%, #1BAB04 100%);
            border-radius: 40rpx 40rpx 40rpx 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
            font-weight: bold;
            margin-right: 20rpx;
        }
    }
}
</style>