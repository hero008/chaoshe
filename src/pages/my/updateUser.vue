<template>
    <view class="updateUser">
        <x-navbar />
        <div class="info_con" :style="{ paddingTop: padTop }">
            <div class="user_img flex_r flex_jc">
                <div class="avatar_box flex_r flex_ac flex_jc">
                    <image
                        v-if="activeUrl"
                        :src="activeUrl | active"
                        class="avatar"
                        mode="aspectFill"
                        @click="yulan"
                    />
                    <div class="edit_avatar" @click="handleUpImg">修改头像</div>
                </div>
            </div>
            <div class="info_list">
                <div class="con_title">个人信息</div>
                <div
                    class="info_item flex_r flex_ac flex_jb"
                    v-for="(i, s) in list"
                    :key="s"
                >
                    <div class="info_tit flex_r flex_ac">
                        <image
                            :src="`https://img.shinemang.com/gachaStatic/static/img/my/${i.ico}.png`"
                            class="ico"
                            mode="aspectFill"
                        />
                        <div class="txt">{{ i.name }}</div>
                    </div>
                    <div class="info_va flex_r flex_ac" v-if="i.key == 'name'">
                        <input
                            v-model="newName"
                            maxlength="12"
                            focus
                            class="va_name"
                            v-if="isedit"
                        />
                        <span v-else>{{ newName }}</span>
                        <img
                            src="https://img.shinemang.com/gachaStatic/static/img/my/uico4.png"
                            @click="isedit = !isedit"
                            class="ico"
                        />
                    </div>
                    <div class="info_va" v-else>{{ userInfo[i.key] }}</div>
                </div>
            </div>
            <div class="footBtn flex_r flex_jc">
                <x-btn txt="确认" v-if="IsConfirm" @click="confirm" cor="3" />
                <x-btn txt="确认" v-else />
            </div>
        </div>
    </view>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { post } from "@/utils/api.js";
import { up } from "@/utils/up.js";
import xNavbar from "@/components/modules/x-navbar";
import xBtn from "@/components/modules/x-btn";
let that;
export default {
    data() {
        return {
            activeUrl: "",
            list: [
                { name: "昵称", key: "name", ico: "uico1" },
                { name: "手机号", key: "phone", ico: "uico2" },
                { name: "潮社ID", key: "id", ico: "uico3" },
            ],
            isedit: false, // 是否编辑
            newName: "",
            SelectedAvatar: {},
        };
    },
    components: { xNavbar, xBtn },
    computed: {
        ...mapState(["userInfo"]),
        padTop() {
            let da = this.MBInfo();
            return da.top + da.height + 29 + "px";
        },
        IsConfirm() {
            return (
                this.SelectedAvatar.tempFilePaths ||
                this.newName != this.userInfo.name
            );
        },
    },
    onShow() {
        this.activeUrl = this.userInfo.avatarUrl;
        this.newName = this.userInfo.name;
    },
    created() {
        that = this;
    },
    mounted() {},
    methods: {
        ...mapActions(["asyncUpdateInfo", "requestPermissions"]),
        async confirm() {
            if (!this.newName) {
                uni.$u.toast("请输入有效昵称");
                return;
            }
            uni.showLoading({
                title: "正在提交审核",
                mask: true,
            });
            let data = {};
            if (this.SelectedAvatar.tempFilePaths) {
                let url = await up(this.SelectedAvatar.tempFilePaths[0]);
                if (url) data.avatar_url = url;
                else {
                    uni.hideLoading();
                    uni.$u.toast("头像不合规，请重新上传");
                    return;
                }
            }
            if (this.newName != this.userInfo.name)
                data.nickname = this.newName;
            post("v1/user/self/update", data).then((res) => {
                uni.hideLoading();
                if (!res.code) {
                    uni.$u.toast("修改成功");
                    this.asyncUpdateInfo();
                    setTimeout(() => {
                        this.gateBack();
                    }, 1000);
                } else {
                    uni.$u.toast(res.message);
                }
            });
        },
        yulan() {
            let str = process.env.VUE_APP_IMG_URL;
            let prefix = this.activeUrl.slice(0, 7);
            let url =
                prefix == "avatars" ? str + this.activeUrl : this.activeUrl;
            uni.previewImage({ urls: [url] });
        },
        async handleUpImg1(a) {
            // 点击图片区域，选择图片并上传
            let type =a=='camera'?'CAMERA':"WRITE_EXTERNAL_STORAGE"
            /* #ifdef APP-PLUS */
            let result = await this.requestPermissions(type);
            if (result !== 1) return;
            /* #endif */
            uni.chooseImage({
                // 选择图片
                count: 1,
                sourceType: [a],
                success: (res) => {
                    // 图片选择成功的回调（必传），会返回一个对象
                    that.SelectedAvatar = res;
                    that.activeUrl = res.tempFilePaths[0]; // 用于更新视图
                },
            });
        },
        async handleUpImg() {
            uni.showActionSheet({
                itemList: ["拍照", "从相册选择"],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        this.handleUpImg1("camera");
                        // console.log("用户点击了拍照");
                    } else if (res.tapIndex === 1) {
                        this.handleUpImg1("album");
                        // console.log("用户点击了相册");
                    }
                },
            });
        },
    },
};
</script>
<style lang='scss' scoped>
.updateUser {
    width: 100vw;
    height: 100vh;
    position: relative;
    // background: linear-gradient(104deg, #e1d6f8 0%, #f8e7ed 100%);
    overflow-y: auto;
   background-color: #F5F6F8;
          &::after {
        content: "";
        width: 100vw;
        height: 600rpx;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 1;
        background: url('https://img.shinemang.com/gachaStatic/chaogui/topBg.png');
        background-size: 100% 100%;
      }
}

.info_con {
    height: 100%;
    padding: 0 32rpx;
    z-index: 2;
    position: relative;

    .avatar {
        width: 172rpx;
        height: 172rpx;
    }

    .avatar_box {
        width: 180rpx;
        height: 180rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
        overflow: hidden;
        position: relative;
    }

    .edit_avatar {
        width: 100%;
        text-align: center;
        font-size: 20rpx;
        height: 46rpx;
        line-height: 40rpx;
        color: #fff;
        background-color: rgba($color: #000, $alpha: 0.5);
        position: absolute;
        bottom: 0;
        left: 0;
    }
}

.info_list {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 0 28rpx;
    margin-top: 40rpx;

    .con_title {
        font-size: 28rpx;
        font-weight: bold;
        padding: 28rpx 0;
    }

    .info_item {
        padding: 32rpx 0;
        font-weight: 500;
        font-size: 28rpx;
        color: #383228;
        border-bottom: 2rpx solid #e2e1e3;

        &:last-child {
            border-bottom: none;
        }

        .info_tit {
            .ico {
                width: 36rpx;
                height: 36rpx;
                margin-right: 16rpx;
            }
        }

        .info_va {
            color: #615e74;
            .va_name {
                text-align: right;
                color: $motif-color;
            }
            .ico {
                width: 36rpx;
                height: 36rpx;
                margin-left: 24rpx;
            }
        }
    }
}



.footBtn {
    width: 100%;
    position: fixed;
    bottom: 100rpx;
    left: 0;
}
</style>