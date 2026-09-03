<template>
    <view class="addressAdd" :style="{paddingTop:MBInfo().top+'px'}">
        <div class="a_con">
            <div class="navbar_x flex_r flex_jb flex_ac">
                <view class="top_Back" @click.stop="gateBack">
                    <text class="icof Back_ico">&#xe72c;</text>
                    <text class="txt">返回</text>
                </view>
            </div>
            <u--form class="uform" labelPosition="left" :model="formDa" :rules="rules" ref="uForm" labelWidth="80">
                <div class="form_item">
                    <u-form-item label="收货人" prop="name" required borderBottom>
                        <u--input v-model="formDa.name" placeholder="请输入收货人名称" border="none"></u--input>
                    </u-form-item>
                    <u-form-item label="手机号码" prop="phone_num" required borderBottom>
                        <u--input v-model="formDa.phone_num" type="number" maxlength="11" placeholder="请输入手机号码" border="none"></u--input>
                    </u-form-item>
                    <u-form-item label="所在地区" prop="sub_area" required borderBottom>
                        <div class="onSelectAddr" @click="onSelectAddress">
                            <div class="z_inp" v-if="selectAddr.sub_area">
                                <span v-for="(i,s) in selectAddr" :key="s" class="addr_item">{{i}}</span>
                            </div>
                            <div class="z_placeholder" v-else @click="onSelectAddress">请输入所在地区</div>
                        </div>
                        <!-- <u--input v-model="formDa.area" readonly placeholder="请输入所在地区" border="none"></u--input> -->
                    </u-form-item>
                    <u-form-item label="详细地址" prop="address" required>
                        <u--input v-model="formDa.address" placeholder="请输入详细地址，精确门牌号" border="none"></u--input>
                    </u-form-item>
                </div>
                <div class="form_item">
                    <u-form-item label="地址标签" borderBottom>
                        <div class="tags flex_r flex_ac">
                            <div class="s_tag" @click="ontag(i)" :class="{corb:formDa.address_tag == i}" v-for="(i,s) in tags" :key="s">{{ i }}</div>
                        </div>
                    </u-form-item>
                    <u-form-item label="设置为默认地址" labelWidth="auto">
                        <div class="flex_r flex_je flex_ac" style="width:100%">
                            <u-switch v-model="formDa.is_default" :size="18" inactiveColor="#DBDBDB" />
                        </div>
                    </u-form-item>
                </div>
            </u--form>
            <view  class="foot_btn">
                 <view v-if="id" @click="ondelAddr" class="delete">删除</view>
                <view class="add"  @click="confirmAdd">保存</view>
               
            </view>
            <!-- <img class="foot_btn" src="https://img.shinemang.com/gachaStatic/static/img/transaction/btn5.png"> -->
            <select-address ref="AddressRef" :address.sync="address" @change="addressChange" />
        </div>
    </view>
</template>
<script>
import selectAddress from "@/components/select-address/select-address"
import { post } from "@/utils/api.js"
export default {
    data() {
        return {
            id: null,
            formDa: {
                name: "",
                phone_num: "",
                province: "",
                city: "",
                area: "",
                sub_area: "",
                address: "",
                address_tag: "",
                is_default: false
            },
            rules: {
                "name": {
                    required: true,
                    message: "请输入收货人名称",
                    trigger: ['blur', 'change']
                },
                "phone_num": [{
                        required: true,
                        message: "请输入手机号码",
                        trigger: ['blur', 'change']
                    },
                    {
                        validator: (rule, value, callback) => {
                            return uni.$u.test.mobile(value);
                        },
                        message: '手机号码不正确',
                        trigger: ['blur']
                    }
                ],
                "sub_area": {
                    required: true,
                    message: "请输入所在地区"
                },
                "address": {
                    required: true,
                    message: "请输入详细地址，精确门牌号",
                    trigger: ['blur', 'change']
                },
            },
            address: { province: '', city: '', area: '', street: '' }, //选择地址（缓存数据）
            selectAddr: {}, //选择的地址
            tags: ["家", "公司"],
        };
    },
    components: {
        selectAddress
    },
    onLoad(da) {
        if (da.selectAddrId) this.getDeilvery(da.selectAddrId)
    },
    methods: {
        ondelAddr(){
           post("v1/delivery_address/delete", {
                delivery_id: this.id,
            }).then((res) => {
                if (!res.code) {
                    uni.$u.toast("删除成功");
                    this.gateBack()
                    
                }
            });
        },
        ontag(va) {
            let str = this.formDa.address_tag == va ? "" : va
            this.$set(this.formDa, "address_tag", str)
        },
        onSelectAddress() {
            this.$refs.AddressRef.open();
        },
        addressChange(da) {
            this.address = da;
            if (da.street) {
                da.sub_area = da.street
                delete da.street
                this.selectAddr = da
                this.formDa = Object.assign({}, this.formDa, this.selectAddr);
            }
        },
        getDeilvery(id) {
               this.id = id
            post('v1/delivery_address/get', {
                delivery_id: id
            }).then(res => {
                if (!res.code) {
                 
                    let da = res.address
                    let { province, city, area, subArea } = da
                    this.addressChange({ province, city, area, street: subArea })

                    this.formDa = {
                        ...this.formDa,
                        id: da.id,
                        name: da.name,
                        phone_num: da.phoneNum,
                        address: da.address,
                        address_tag: da.addressTag,
                        is_default: da.isDefault
                    }
                }
            })
        },
        confirmAdd() {
            let url = "",
                da = {};
            if (this.formDa.id) {
                url = "v1/delivery_address/update";
                da = {
                    ...this.formDa,
                    delivery_id: this.formDa.id
                }
            } else {
                url = "v1/delivery_address/add";
                da = this.formDa
            }
            this.$refs.uForm.validate().then(() => {
                post(url, da).then(res => {
                    if (!res.code) {
                        if (this.formDa.id) uni.$u.toast('地址修改成功')
                        else uni.$u.toast('地址添加成功')
                        setTimeout(() => {
                            this.gateBack()
                        }, 1600);
                    }
                })
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.addressAdd {
    padding: 80rpx 0rpx 28rpx;
    width: 100vw;
    height: 100vh;
    position: relative;
    // background: linear-gradient(104deg, #E1D6F8 0%, #F8E7ED 100%);
    overflow-y: auto;
    background-color: #F5F6F8;
    padding-bottom: 0;
    //       &::after {
    //     content: "";
    //     width: 100vw;
    //     height: 600rpx;
    //     left: 0;
    //     top: 0;
    //     position: absolute;
    //     z-index: 1;
    //     background: url('https://img.shinemang.com/gachaStatic/chaogui/topBg.png');
    //     background-size: 100% 100%;
    //   }
    .a_con {
        position: relative;
        z-index: 2;
        height: 100%;
        
    }
}
.uform{
    height: calc(100% - 120rpx);
        background-color: #fff;
        padding-bottom: 100rpx;
}

.navbar_x {
    margin-bottom: 60rpx;
    padding-left: 36rpx;
}

.top_Back {
    color: #1c1c1c;

    text {
        vertical-align: middle;
    }

    .Back_ico {
        font-size: 50rpx;
        margin-right: 8rpx;
    }

    .txt {
        font-size: 36rpx;
    }
}

.form_item {
    padding: 20rpx 28rpx 20rpx 36rpx;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
}

.s_tag {
    width: 94rpx;
    height: 46rpx;
    line-height: 46rpx;
    text-align: center;
    font-size: 24rpx;
    background-color: #E2E1E3;
    border-radius: 16rpx;
    margin-right: 8rpx;

    &.corr {
        color: #FF005C;
        background: rgba(255, 0, 92, 0.1);
    }

    &.corb {
        color: #0052F2;
        background: rgba(0, 82, 242, 0.1);
    }
}

.onSelectAddr {
    width: 100%;
    font-size: 15px;
}

.z_placeholder {
    color: rgb(192, 196, 204);
}

.z_inp {
    color: inherit;

    .addr_item {
        margin-right: 6rpx;
    }
}

.foot_btn {
    width: 100%;
    height: 88rpx;
    position: fixed;
    bottom: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    .delete{
        width: 224rpx;
        height: 88rpx;
        border-radius: 44rpx 44rpx 44rpx 44rpx;
        border: 2rpx solid #1A1A1A;
        display: flex;
        align-items: center;
        margin-right: 24rpx;
        font-size: 32rpx;
        color: #1A1A1A;
        justify-content: center;
    }
    .add{
width: 438rpx;
height: 88rpx;
background: #1A1A1A;
border-radius: 44rpx 44rpx 44rpx 44rpx;
display: flex;
align-items: center;
justify-content: center;
color: #fff;
font-weight: bold;
line-height: 88rpx;
// margin-left: 32rpx;
    }
}
</style>