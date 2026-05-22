<template>
    <div class="invitePage">
        <view class="invite" :style="{ paddingTop: padTop }">
            <x-navbar tcolor="#fff" />
            <div
                class="gz flex_r flex_ac"
                @click="goto('/pages/common/rulepop', { val: 'InviteRules' })"
            >
                活动规则
            </div>
            <div class="myaward">
                <div class="award_card flex_c flex_ac">
                    <div class="tit"></div>
                    <div class="qr">
                        <image
                            class="qr_img"
                            mode="aspectFit"
                            show-menu-by-longpress="true"
                            :src="'data:image/png;base64,' + QRdata.inviteLink"
                        />
                    </div>
                    <div class="already flex_r flex_ac flex_jb">
                        <span>我的邀请码：</span>
                        <span class="number">{{ QRdata.inviteCode }}</span>
                        <view
                            class="cp flex_r flex_ac"
                            @click="getCopy(QRdata.inviteCode)"
                            ><view class="cp_icon"></view>复制</view
                        >
                    </div>
                    <view class="data">
                        <view class="data_box flex_r flex_jb">
                            <view class="box">
                                <view class="text">已邀请好友</view>
                                <view class="number">{{
                                    pointData.inviteeNum || 0
                                }}</view>
                            </view>
                            <view class="box">
                                <view class="text1">邀请奖励</view>
                                <view class="number">{{
                                    pointData.point || 0
                                }}</view>
                            </view>
                        </view>
                        <div class="msg">* 邀请的好友奖励10天内领取有效</div>
                    </view>
                </div>
            </div>
            <div class="cord_bar flex_c flex_ac">
                <div class="tit"><div class="img"></div></div>
                <div class="flow flex_r flex_ac flex_jb">
                    <img
                        src="https://img.chaoshewang.com/matt/static/img/index/friend_icon.png"
                        class="ico"
                    />
                    <img
                        src="https://img.chaoshewang.com/matt/static/img/index/next_step.png"
                        class="ico1"
                    />
                    <img
                        src="https://img.chaoshewang.com/matt/static/img/index/app_icon.png"
                        class="ico"
                    />
                    <img
                        src="https://img.chaoshewang.com/matt/static/img/index/next_step.png"
                        class="ico1"
                    />
                    <img
                        src="https://img.chaoshewang.com/matt/static/img/index/gift_icon.png"
                        class="ico"
                    />
                </div>
                <div class="flow_txt flex_r flex_ac flex_jb">
                    <div class="t">分享给好友 或者扫描二维码</div>
                    <div class="t">好友通过你分享的 链接登入平台</div>
                    <div class="t">你获得奖励</div>
                </div>
            </div>
            <div class="cord_bar flex_c flex_ac" style="marginbottom: 650rpx">
                <div class="tit">
                    <div class="img img1"></div>
                </div>
                <div class="th flex_r flex_ac flex_jb">
                    <span>好友昵称</span>
                    <span>奖励 (欧气值)</span>
                </div>
                <div
                    class="td flex_r flex_ac flex_jb"
                    v-for="i in pointData.inviteeList"
                    :key="i.userId"
                >
                    <div class="user flex_r flex_ac">
                        <img :src="i.profile | active" class="user_img" />
                        <span>{{ i.userName }}</span>
                    </div>
                    <span>{{ i.point }}</span>
                </div>
                <u-empty
                    v-if="!pointData.inviteeList.length"
                    text="暂无记录~"
                    icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png"
                    :marginTop="30"
                />
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
//邀请好友
import xNavbar from "@/components/modules/x-navbar";
import { uniShare, copyCode } from "@/utils/fun.js";
import { post } from "@/utils/api.js";
export default {
    data() {
        return {
            pointData: {
                inviteeList: [],
            },
            userInfo: this.$gl("userInfo") || {},
            shareimg:"https://img.shinemang.com/gachaStatic/static/img/activity/invite_share.png",
            QRdata: {},
            ysImg:''  
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
    created() {
        this.loadData();
        this.getImg();
    },
    /**
     * 组件挂载后执行的钩子函数
     * @remarks 当前为注释状态，用于示例如何构造带参数的分享链接
     */
    mounted() {},
    onLoad(da) {},
    onShow() {},
    methods: {
        async loadData() {
            post("v1/activity/invite-cost-award/point", {
                user_id: this.userInfo.id,
            }).then((res) => {
                if (!res.code) {
                    this.pointData = res;
                }
            });
            uni.downloadFile({
                url: "https://img.chaoshewang.com/product/258b301a00d9ada7ab51825bf2180ccb.png", //仅为示例，并非真实的资源
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.getTu(res.tempFilePath)
                    }
                },
            });
        },
        getTu(img) {
            uni.compressImage({
                src: img,
                quality: 10,
                width: 100,
                height: 100,
                success: (res) => {
                    this.ysImg = res.tempFilePath;
                },
            });
        },
        getImg() {
            post("v1/user/getuserinvitecodeandlink").then((res) => {
                if (!res.code) {
                    this.QRdata = res;
                }
            });
        },
        shareToTimeline() {
            // #ifdef APP-PLUS
            plus.share.getServices((services) => {
                const weixinService = services.find(service => service.id === 'weixin');
                if (weixinService) {
                    weixinService.authenticate(() => {
                        weixinService.shareToTimeline({
                            title: this.shareData.title,
                            href: this.shareData.link,
                            pictures: [this.shareData.imageUrl],
                            extra: {
                                scene: 'WXSenceTimeline'
                            },
                            success: () => {
                                uni.showToast({
                                    title: '分享成功'
                                });
                            },
                            fail: (err) => {
                                uni.showToast({
                                    title: '分享失败',
                                    icon: 'none'
                                });
                            }
                        });
                    });
                }
            });
            // #endif
        },
        onShare() {
            uniShare(
                { tit: "邀请好友，领欧气值", path: "pages/login/sharePage" },
                { inviteCode: this.userInfo.inviteCode },
                this.shareimg
            );
        },
        getCopy(v) {
            copyCode(v);
        },
    },
};
</script>
<style lang="scss" scoped>
.invitePage {
    height: 100vh;
    overflow: hidden;
    // overflow-y: auto;
}

.invite {
    // height: 2000rpx;
    height: 100%;
    background-image: url("https://img.chaoshewang.com/matt/static/img/index/share_bg.png");
    background-size: cover; /* 图片覆盖整个容器 */
    background-position: top;
    background-repeat: no-repeat; /* 不重复 */
    overflow-y: auto;
    padding: 0rpx 36rpx 180rpx;
}

.gz {
    position: absolute;
    width: 48rpx;
    height: 144rpx;
    background: #aa5de5;
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
        width: 100%;
        height: 768rpx;
        background-image: url("https://img.chaoshewang.com/matt/static/img/index/card.png");
        background-size: 100% 100%;
        .tit {
            width: 260rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/QR_code.png");
            background-size: 100% 100%;
            margin-top: 32rpx;
        }
        .qr {
            width: 320rpx;
            height: 320rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/qr_box.png");
            background-size: 100% 100%;
            margin-top: 24rpx;
            position: relative;
            .qr_img {
                position: absolute;
                width: 296rpx;
                height: 296rpx;
                padding: 16rpx;
                box-sizing: border-box;
                background: #ffffff;
                border-radius: 16rpx;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .already {
            width: 560rpx;
            height: 64rpx;
            background: #ea4166;
            border-radius: 32rpx;
            border: 2rpx solid #ffffff;
            margin-top: 24rpx;
            padding: 0 32rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #ffffff;
            .number {
                font-weight: 800;
                font-size: 36rpx;
            }
            .cp {
                .cp_icon {
                    width: 24rpx;
                    height: 24rpx;
                    background-image: url("https://img.chaoshewang.com/matt/static/img/index/cp_icon.png");
                    background-size: 100% 100%;
                    margin-right: 4rpx;
                }
            }
        }
        .data {
            width: 654rpx;
            height: 204rpx;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 16rpx;
            margin-top: 24rpx;
            .data_box {
                padding: 32rpx 68rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #000000;
                .box {
                    .text {
                        &::after {
                            content: "(人)";
                            color: #aaacbb;
                            font-weight: 500;
                            font-size: 24rpx;
                            margin-left: 8rpx;
                        }
                    }
                    .text1 {
                        &::after {
                            content: "(欧气值)";
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
                font-weight: 500;
                font-size: 24rpx;
                color: #aaacbb;
            }
        }
    }
}

.cord_bar {
    // height: 332rpx;
    background: #fff;
    border-radius: 32rpx;
    overflow: hidden;
    margin-top: 16rpx;
    padding-bottom: 48rpx;
    .tit {
        width: 100%;
        height: 96rpx;
        background: linear-gradient(
            180deg,
            #f5dbfc 0%,
            rgba(245, 219, 252, 0) 100%
        );

        .img {
            margin: auto;
            width: 176rpx;
            height: 60rpx;
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/flow.png");
            background-size: 100% 100%;
            margin-top: 32rpx;
        }
        .img1 {
            background-image: url("https://img.chaoshewang.com/matt/static/img/index/Invitation_record.png");
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
        padding: 0 42rpx;
        .t {
            width: 178rpx;
            text-align: center;
        }
    }

    .th {
        width: 100%;
        padding: 0 48rpx;
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
</style>