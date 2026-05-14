<template>
    <div class="friendReturn">
        <view class="invite" :style="{ paddingTop: padTop }">
            <x-navbar tcolor="#fff" />
            <div class="gz flex_r flex_ac" @click="
                goto('/pages/common/rulepop', {
                    val: information.protocolKey,
                })
                ">
                活动规则
            </div>
            <div class="myaward">
                <div class="award_card flex_c flex_ac">
                    <div class="tit"></div>
                    <div class="already">
                        <view>我的邀请码：</view>
                        <view class="cp flex_r flex_ac" @click="getCopy(QRdata.inviteCode)">
                            <view class="number">{{ QRdata.inviteCode }}</view>
                            <view class="cp_icon"></view>复制
                        </view>
                    </div>
                    <div class="already1 flex_r flex_ac">
                        <view>好友邀请码：</view>
                        <input class="number" @blur="onFriend" v-model="inviteCode" placeholder="未绑定"
                            :disabled="!QRdata.canBindRecallInviteCode" />
                        <view class="cp" v-if="
                            QRdata.canBindRecallInviteCode &&
                            !QRdata.parentRecallInviteCode
                        " @click="onFriend">
                            <view>邀请码绑定</view>
                            <template v-if="QRdata.bindRecallDeadline">
                                <u-count-down :time="residuetime" @change="rtimeChange">
                                    <view>
                                        <text v-if="timeData.days">{{ timeData.days }}天</text>
                                        <text>{{ timeData.hours }}:</text>
                                        <text>{{ timeData.minutes }}:</text>
                                        <text>{{ timeData.seconds }}</text>
                                    </view>
                                </u-count-down>
                            </template>
                        </view>
                        <view class="cp ca" v-if="failing && !QRdata.canBindRecallInviteCode">邀请回归失效</view>
                    </div>
                    <view class="data">
                        <view class="data_box flex_r flex_jb">
                            <view class="box">
                                <view class="text">好友今日消费</view>
                                <view class="number">{{
                                    pointData.consumeToday || 0
                                    }}</view>
                            </view>
                            <view class="box">
                                <view class="text1">返利欧气值</view>
                                <view class="number">{{
                                    pointData.pointToday || 0
                                    }}</view>
                            </view>
                        </view>
                        <div class="msg flex_r flex_jb flex_ac">
                            <view>累计返利欧气值</view>
                            <view class="texn">{{ pointData.point }}</view>
                        </div>
                    </view>
                </div>
            </div>
            <div class="cord_bar flex_c flex_ac">
                <div class="tit">
                    <div class="img"></div>
                </div>
                <div class="flow flex_r flex_ac flex_jb">
                    <img v-for="(value, index) in imgList" :src="value.imgSrc" :key="index" :class="value.class" />
                </div>
                <div class="flow_txt flex_r flex_ac flex_jb">
                    <div class="t">分享给好友或者<br />好友绑定您的邀请码</div>
                    <div class="t">好友通过你分享的<br />链接登入平台</div>
                    <div class="t">好友消费越多<br />您获得的奖励越多</div>
                </div>
            </div>
            <div class="cord_bar flex_c flex_ac" style="marginbottom: 650rpx">
                <div class="tit">
                    <div class="img img1"></div>
                </div>
                <div class="th flex_r flex_ac flex_jb">
                    <span>好友昵称</span>
                    <span>当前返比</span>
                </div>

                <u-empty v-if="!pointData.recalledList.length" text="暂无记录~"
                    icon="https://img.chaoshewang.com/static/img/home/empty.png" :marginTop="30" />
                <div v-else class="td flex_r flex_ac flex_jb" v-for="i in pointData.recalledList" :key="i.userId">
                    <div class="user flex_r flex_ac">
                        <img :src="i.profile | active" class="user_img" />
                        <span>{{ i.userName }}</span>
                    </div>
                    <span>{{ i.rate || "0%" }}</span>
                </div>
            </div>
            <div class="footbtn flex_r flex_ac flex_jc">
                <!-- <view class="btn"  @click="onShare"></view> -->
                <div class="footbtn flex_r flex_ac flex_jc">
                    <button open-type="share" @click="onShare" class="btn">
                        邀请好友
                    </button>
                </div>
            </div>
        </view>
    </div>
</template>
<script>
// 老玩家回归
import xNavbar from "@/components/modules/x-navbar";
import { uniShare, copyCode } from "@/utils/fun.js";
import { post, activityLIst } from "@/utils/api.js";
export default {
    data() {
        return {
            pointData: {
                recalledList: [],
            },
            userInfo: this.$gl("userInfo") || {},
            shareimg:"https://img.chaoshewang.com/static/img/activity/hyhgfx.png",
            QRdata: {},
            timeData: {},
            inviteCode: "",
            information: {},
            message: {},
            failing: false,
            residuetime: 0,
            imgList: [{ imgSrc: 'https://img.chaoshewang.com/matt/static/img/index/friend_icon.png', class: 'ico' },
            { imgSrc: 'https://img.chaoshewang.com/matt/static/img/index/next_step.png', class: 'ico1' },
            { imgSrc: 'https://img.chaoshewang.com/matt/static/img/index/app_icon.png', class: 'ico' },
            { imgSrc: 'https://img.chaoshewang.com/matt/static/img/index/next_step.png', class: 'ico1' },
            { imgSrc: 'https://img.chaoshewang.com/matt/static/img/index/gift_icon.png', class: 'ico' },]
        };
    },
    components: { xNavbar },
    watch: {},
    computed: {
        padTop() {
            let da = this.MBInfo();
            return da.top + "px";
        },
    },
    created() { },
    mounted() { },
    onLoad(da) {
        if (da.inviteCode) {
            this.inviteCode = da.inviteCode;
            this.onFriend();
        } else {
            this.getImg();
            this.loadData();
        }
    },
    onShow() { },
    methods: {
        // 获取要求好友列表
        loadData() {
            post("v1/activity/recall-cost-award/point", {
                user_id: this.userInfo.id,
            }).then((res) => {
                if (!res.code) {
                    this.pointData = res;
                }
            });
        },
        // 获取信息
        async getImg() {
            let c = await activityLIst({ key: ["Recall"] });
            this.information = c.activities[0];
            post("v1/user/getuserinvitecodeandlink").then((res) => {
                if (!res.code) {
                    this.QRdata = res;
                    this.residuetime = this.remainingTime(
                        res.bindRecallDeadline
                    );
                    res.parentRecallInviteCode
                        ? (this.inviteCode = res.parentRecallInviteCode)
                        : this.inviteCode;
                    this.failing = !res.parentRecallInviteCode;
                }
            });
        },
        onFriend() {
            if (this.inviteCode && !this.QRdata.parentRecallInviteCode) {
                post("/v1/user/bind-recall-user", {
                    recallInviteCode: this.inviteCode,
                }).then((res) => {
                    if (!res.code) {
                        this.failing = false;
                        uni.$u.toast("关系绑定成功");
                    } else {
                        this.failing = true;
                        uni.$u.toast(res.message);
                    }

                    this.getImg();
                    this.loadData();
                });
            }
        },

        onShare() {
            uniShare(
                {
                    tit: this.information.name,
                    path: "page-activity/friendReturn/index",
                },
                { inviteCode: this.userInfo.inviteCode },
                this.shareimg
            );
        },
        getCopy(v) {
            copyCode(v);
        },
        rtimeChange(e) {
            this.timeData = e;
        },
    },
    //1.配置发送给朋友
    onShareAppMessage() {
        return {
            title: this.information.name, //分享的标题
            path:
                "page-activity/friendReturn/index?inviteCode=" +
                this.userInfo.inviteCode, //点击分享链接之后进入的页面路径
            //path: "pages/login/login" , //点击分享链接之后进入的页面路径
            imageUrl: this.shareimg,
        };
    },
};
</script>
<style lang="scss" scoped>
::v-deep .u-count-down {
    position: absolute;
    width: 100%;
    bottom: 3rpx;
    left: 50%;
    transform: translate(-50%, 0);
}

.friendReturn {
    height: 100vh;
    overflow: hidden;
    // overflow-y: auto;
}

.invite {
    // height: 2000rpx;
    height: 100%;
    background-image: url("https://img.chaoshewang.com/static/img/activity/fr_bg.png");
    background-size: cover;
    /* 图片覆盖整个容器 */
    background-position: top;
    background-repeat: no-repeat;
    /* 不重复 */
    overflow-y: auto;
    padding: 0rpx 36rpx 180rpx;
}

.gz {
    position: absolute;
    width: 48rpx;
    height: 144rpx;
    background: #1d9dff;
    border: 2rpx solid #ffffff;
    border-radius: 16rpx 0 0 16rpx;
    font-weight: 800;
    font-size: 24rpx;
    color: #ffffff;
    right: 0px;
    top: 150rpx;
    z-index: 88;
    // #ifdef MP-WEIXIN
    top: 180rpx;
    // #endif
    padding-left: 10rpx;
}

.myaward {
    text-align: center;
    margin-top: 350rpx;

    .Pikachu {
        width: 236rpx;
        height: 224rpx;
    }

    .award_card {
        width: 686rpx;
        height: 704rpx;
        background-image: url("https://img.chaoshewang.com/static/img/activity/fr_bg1.png");
        background-size: 100% 100%;

        .tit {
            width: 260rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/static/img/activity/fr_header.png");
            background-size: 100% 100%;
            margin-top: 32rpx;
        }

        .already {
            width: 560rpx;
            height: 200rpx;
            background: #ea4166;
            border-radius: 16rpx;
            border: 2rpx solid #ffffff;
            margin-top: 32rpx;
            padding: 32rpx;
            font-weight: bold;
            font-size: 28rpx;
            color: #ffffff;

            .cp {
                margin-top: 32rpx;
                font-size: 24rpx;

                .number {
                    font-weight: 800;
                    font-size: 40rpx;
                    margin-right: 100rpx;
                    margin-left: auto;
                }

                .cp_icon {
                    width: 24rpx;
                    height: 24rpx;
                    background-image: url("https://img.chaoshewang.com/matt/static/img/index/cp_icon.png");
                    background-size: 100% 100%;
                    margin-right: 4rpx;
                }
            }
        }

        .already1 {
            width: 560rpx;
            height: 72rpx;
            border-radius: 40rpx;
            border: 2rpx solid #ea4166;
            margin-top: 32rpx;
            padding: 0 4rpx 0 32rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #000000;

            .number {
                width: 150rpx;
                font-weight: bold;
                font-size: 28rpx;
                cursor: not-allowed;
            }

            .cp {
                height: 64rpx;
                background: #ea4166;
                border-radius: 40rpx;
                padding: 0 32rpx;
                margin-left: auto;
                font-weight: 500;
                font-size: 24rpx;
                color: #ffffff;
                position: relative;
            }

            .ca {
                line-height: 64rpx;
                text-align: center;
                opacity: 0.5;
            }
        }

        .data {
            width: 654rpx;
            height: 140rpx;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 16rpx;
            margin-top: 32rpx;

            .data_box {
                padding: 32rpx 68rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #000000;

                .box {
                    .text {
                        &::after {
                            content: "(元)";
                            color: #aaacbb;
                            font-weight: 500;
                            font-size: 24rpx;
                            margin-left: 8rpx;
                        }
                    }

                    .number {
                        margin-top: 8rpx;
                        font-weight: 800;
                        font-size: 36rpx;
                    }
                }
            }

            .msg {
                width: 654rpx;
                height: 84rpx;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 16rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #000000;
                padding: 0 32rpx;
            }

            .texn {
                font-weight: 800;
                font-size: 36rpx;
            }
        }
    }
}

.cord_bar {
    background: #fff;
    border-radius: 32rpx;
    overflow: hidden;
    margin-top: 16rpx;
    padding-bottom: 48rpx;

    .tit {
        width: 100%;
        height: 96rpx;
        background: linear-gradient(180deg,
                rgba(161, 220, 254, 1) 0%,
                rgba(245, 219, 252, 0) 100%);

        .img {
            margin: auto;
            width: 176rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/static/img/activity/fr_flow.png");
            background-size: 100% 100%;
            margin-top: 32rpx;
        }

        .img1 {
            background-image: url("https://img.chaoshewang.com/static/img/activity/fr_record.png");
            background-size: 100% 100%;
        }
    }

    .flow {
        width: 100%;
        margin: 44rpx 0 8rpx;
        padding: 0 92rpx;

        .ico {
            width: 72rpx;
            height: 72rpx;
        }

        .ico1 {
            width: 32rpx;
            height: 32rpx;
        }
    }

    .flow_txt {
        width: 100%;
        font-weight: 500;
        font-size: 24rpx;
        color: #000000;
        line-height: 28rpx;
        padding: 0 18rpx;

        .t {
            width: 216rpx;
            text-align: center;
        }
    }

    .th {
        width: 100%;
        padding: 0 32rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #aaacbb;
        margin: 24rpx 0;
    }

    .td {
        width: 100%;
        padding: 12rpx 32rpx;

        .user_img {
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            margin-right: 16rpx;
        }
    }
}

.footbtn {
    width: 100%;
    // #ifndef MP-WEIXIN
    height: 128rpx;
    // #endif
    // #ifdef MP-WEIXIN
    height: 138rpx;
    padding-bottom: 20rpx;
    // #endif
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;

    // .btn {
    //         width: 582rpx;
    //     height: 80rpx;
    // background-image: url("https://img.chaoshewang.com/matt/static/img/index/inviteFriends_btn.png");
    //  background-size: 100% 100%;
    // }
    .btn {
        width: 582rpx;
        height: 80rpx;
        color: #fff;
        font-size: 32rpx;
        font-weight: 500;
        text-align: center;
        line-height: 76rpx;
        background: #ff5070;
        border-radius: 40rpx;
        text-shadow: 0px 2px 2px #e6183e;
        box-shadow: inset 0rpx 8rpx 24rpx 0rpx rgba(255, 248, 248, 0.5);
    }
}

.butijiao {
    pointer-events: none;
    opacity: 0.5;
}
</style>