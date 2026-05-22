<template>
    <u-popup :show="show" :round="12" :closeable="true" :closeOnClickOverlay="false" :safeAreaInsetBottom="false" @close="close">
        <view class="select-address-box">
            <view class="header-title">选择所在地区</view>
            <view class="main-box">
                <view class="address-info">
                    <view class="address-item" @tap="setSelectStatus(0)">
                        <view class="strip-item">
                            <view :class="{ 'show-line': address.province, active: address.province }"></view>
                        </view>
                        <view class="name-box" :class="{ active: selectStatus == 0 }">
                            <text v-if="address.province">{{ address.province }}</text>
                            <text v-else>请选择所在省份</text>
                        </view>
                        <view class="icon-box">
                            <view class="iconfont icon-xiangyou">{{ '>' }}</view>
                        </view>
                    </view>
                    <view v-if="address.province" class="address-item" @tap="setSelectStatus(1)">
                        <view class="strip-item">
                            <view :class="{ 'show-line': address.city, active: address.city }"></view>
                        </view>
                        <view class="name-box" :class="{ active: selectStatus == 1 }">
                            <text v-if="address.city">{{ address.city }}</text>
                            <text v-else>请选择所在城市</text>
                        </view>
                        <view class="icon-box">
                            <view class="iconfont icon-xiangyou">{{ '>' }}</view>
                        </view>
                    </view>
                    <view v-if="address.city" class="address-item" @tap="setSelectStatus(2)">
                        <view class="strip-item last-strip-item">
                            <view :class="{ 'show-line': showStreet, active: address.area }"></view>
                        </view>
                        <view class="name-box" :class="{ active: selectStatus == 2 }">
                            <text v-if="address.area">{{ address.area }}</text>
                            <text v-else>请选择所在区/县</text>
                        </view>
                        <view class="icon-box">
                            <view class="iconfont icon-xiangyou">{{ '>' }}</view>
                        </view>
                    </view>
                    <view v-if="showStreet" class="address-item" @tap="setSelectStatus(3)">
                        <view class="strip-item last-strip-item">
                            <view :class="{ active: address.street }"></view>
                        </view>
                        <view class="name-box" :class="{ active: selectStatus == 3 }">
                            <text v-if="address.street">{{ address.street }}</text>
                            <text v-else>请选择所在乡/镇</text>
                        </view>
                        <view class="icon-box">
                            <view class="iconfont icon-xiangyou">{{ '>' }}</view>
                        </view>
                    </view>
                </view>
                <view class="address-select-box">
                    <scroll-view class="content-box" :style="{ height: scrollHeight }" :scroll-y="true">
                        <view v-if="selectStatus === 0">
                            <view class="select-tip">请选择省份</view>
                            <view class="select-item" :class="{ active: activeProvinvial.name === i.name }" v-for="i in provinvial" :key="i.code" @tap="changeProvinvial(i)">{{ i.name }}</view>
                        </view>
                        <view v-else-if="selectStatus === 1">
                            <view class="select-tip">请选择城市</view>
                            <view class="select-item" :class="{ active: activeCity.name === i.name }" v-for="i in citys" :key="i.code" @tap="changeCity(i)">{{ i.name }}</view>
                        </view>
                        <view v-else-if="selectStatus === 2">
                            <view class="select-tip">请选择区/县</view>
                            <view class="select-item" :class="{ active: activeArea.name === i.name }" v-for="i in areas" :key="i.code" @tap="changeArea(i)">{{ i.name }}</view>
                        </view>
                        <view v-else>
                            <view class="select-tip">请选择乡/镇</view>
                            <view class="select-item" :class="{ active: activeStreet.name === i.name }" v-for="i in streets" :key="i.code" @tap="changeStreet(i)">{{ i.name }}</view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </view>
    </u-popup>
</template>
<script>
// 替换json文件地址
const provinvialUrl = 'https://img.shinemang.com/gachaStatic/static/json/provinces.json';
const cityUrl = 'https://img.shinemang.com/gachaStatic/static/json/cities.json';
const areaUrl = 'https://img.shinemang.com/gachaStatic/static/json/areas.json';
const streetsUrl = 'https://img.shinemang.com/gachaStatic/static/json/streets.json';
// const provinvialUrl = 'https://cos.wkea.cn/static/provinces.json';
// const cityUrl = 'https://cos.wkea.cn/static/cities.json';
// const areaUrl = 'https://cos.wkea.cn/static/areas.json';
// const streetsUrl = 'https://cos.wkea.cn/static/streets.json';

export default {
    emits: ['change'],
    props: {
        address: {
            type: Object,
            require: true,
            default: () => ({
                province: '',
                city: '',
                area: '',
                street: ''
            })
        }
    },
    data() {
        return {
            show: false,
            //全部数据
            provinvial: [], // 省
            cityData: [],
            areaData: [],
            streetsData: [],
            // 筛选后的数据
            citys: [], // 城市
            areas: [], // 区/县
            streets: [], // 镇
            // 选择的省、市、区具体名称
            activeProvinvial: { name: '' }, // 选择中的省份
            activeCity: { name: '' }, // 选中的城市
            activeArea: { name: '' }, // 选中的区县
            activeStreet: { name: '' }, // 选中的乡镇
            //  0 1 2 3 当前正在选择 省 市 区 镇
            selectStatus: 0
        };
    },
    computed: {
        // 高度计算
        scrollHeight() {
            let height = 920;

            if (this.address.province) {
                height -= 80;
            }
            if (this.address.city) {
                height -= 80;
            }
            if (this.address.area && 'street' in this.address) {
                height -= 80;
            }
            return height + 'rpx';
        },
        // 是否展示4级
        showStreet() {
            return Boolean(
                this.selectStatus === 3 || (this.activeArea.name && 'street' in this.address)
            );
        }
    },
    watch: {
        address: {
            handler(newHandler) {
                if (newHandler.province && !this.activeProvinvial.code) {
                    this.setActiveProvinvial();
                }
                if (newHandler.city && !this.activeCity.code) {
                    this.setActiveCity();
                }
                if (newHandler.area && !this.activeArea.code) {
                    this.setActiveArea();
                }
                if (newHandler.street && !this.activeStreet.code) {
                    this.setActiveStreet();
                }
            },
            deep: true
        }
    },
    mounted() {
        this.getProvinvial();
    },
    methods: {
        // 更新正在选择内容的标记
        setSelectStatus(newSelectStatus) {
            this.selectStatus = newSelectStatus;
            // if()
        },
        // 关闭 popup
        close() {
            this.show = false
            // this.$refs.selectAddressRef.close();
        },
        // 打开  popup
        open() {
            this.show = true
            // this.$refs.selectAddressRef.open();
        },
        // 选择省
        changeProvinvial(i) {
            if (i.name !== this.address.province) {
                this.activeProvinvial = i;
                this.activeCity = {};
                this.activeArea = {};
                this.activeStreet = {};
                const newAddress = {
                    province: i.name,
                    city: '',
                    area: ''
                };
                if ('street' in this.address) {
                    newAddress.street = '';
                }
                this.$emit('change', newAddress);
            }
            this.citys = this.cityData.filter(
                item => item.provinceCode === i.code
            );
            this.selectStatus = 1;
        },
        // 选择市
        changeCity(i) {
            if (i.name !== this.address.city) {
                this.activeCity = i;
                this.activeArea = {};
                this.activeStreet = {};
                const newAddress = {
                    province: this.address.province,
                    city: i.name,
                    area: ''
                };
                if ('street' in this.address) {
                    newAddress.street = '';
                }
                this.$emit('change', newAddress);
            }
            this.areas = this.areaData.filter(item => item.cityCode === i.code);
            this.selectStatus = 2;
        },
        // 选择区县
        changeArea(i) {
            if (i.name !== this.address.area) {
                this.activeArea = i;
                this.activeStreet = {};
                const newAddress = {
                    province: this.address.province,
                    city: this.address.city,
                    area: i.name
                };
                if ('street' in this.address) {
                    newAddress.street = '';
                }
                this.$emit('change', newAddress);
            }

            if ('street' in this.address) {
                this.selectStatus = 3;
                this.streets = this.streetsData.filter(
                    item => item.areaCode === i.code
                );
            } else {
                this.close();
            }
        },
        // 选择乡镇
        changeStreet(i) {
            if (i.name !== this.address.street) {
                this.activeStreet = i;
                this.$emit('change', {
                    ...this.address,
                    street: i.name
                });
            }
            this.close();
        },
        // 省份数据获取
        getProvinvial() {
            uni.request({
                url: provinvialUrl
            }).then(res => {
                // console.log(res);
                this.provinvial = res.data;
                // #ifdef VUE2
                // this.provinvial = res[1].data;
                // #endif
                this.setActiveProvinvial();
                this.getCity();
            });
        },
        // setActiveProvinvial
        setActiveProvinvial() {
            if (this.address.province && !this.activeProvinvial.code) {
                const provinceIndex = this.provinvial.findIndex(
                    i => i.name == this.address.province
                );
                if (provinceIndex !== -1) {
                    this.activeProvinvial = this.provinvial[provinceIndex];
                }
            }
        },
        // 城市数据获取
        getCity() {
            uni.request({
                url: cityUrl
            }).then(res => {
                this.cityData = res.data;
                // #ifdef VUE2
                // this.cityData = res[1].data;
                // #endif
                this.setActiveCity();
                this.getArea();
            });
        },
        setActiveCity() {
            // console.log(this.cityData);
            if (this.cityData && this.cityData.length === 0) {
                return;
            }

            this.citys = this.cityData.filter(
                item => item.provinceCode === this.activeProvinvial.code
            );

            if (this.address.city && !this.activeCity.code) {
                const cityIndex = this.cityData.findIndex(
                    i =>
                    i.name == this.address.city &&
                    this.activeProvinvial.code == i.provinceCode
                );
                if (cityIndex !== -1) {
                    this.activeCity = this.cityData[cityIndex];
                }
            }
        },
        // 区县数据
        getArea() {
            uni.request({
                url: areaUrl
            }).then(res => {
                this.areaData = res.data;
                // #ifdef VUE2
                // this.areaData = res[1].data;
                // #endif
                this.setActiveArea();

                if ('street' in this.address) {
                    this.getStreets();
                }
            });
        },
        setActiveArea() {
            if (this.areaData.length === 0) {
                return;
            }
            this.areas = this.areaData.filter(
                item => item.cityCode === this.activeCity.code
            );
            if (this.address.area && !this.activeArea.code) {
                const areaIndex = this.areaData.findIndex(
                    i =>
                    i.name == this.address.area &&
                    i.cityCode == this.activeCity.code
                );
                if (areaIndex !== -1) {
                    this.activeArea = this.areaData[areaIndex];
                }
            }
        },
        // 镇 社区
        getStreets() {
            uni.request({
                url: streetsUrl
            }).then(res => {
                this.streetsData = res.data;
                // #ifdef VUE2
                // this.streetsData = res[1].data;
                // #endif
                this.setActiveStreet();
            });
        },
        setActiveStreet() {
            if (this.streetsData.length === 0) {
                return;
            }
            this.streets = this.streetsData.filter(
                item => item.areaCode === this.activeArea.code
            );
            if (this.address.street && !this.activeStreet.code) {
                const streetIndex = this.streetsData.findIndex(
                    i => i.name == this.address.street
                );
                if (streetIndex !== -1) {
                    this.activeStreet = this.streetsData[streetIndex];
                }
            }
        }
    }
};
</script>
<style lang="scss">
.select-address-box {
    height: 1100rpx;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    background-color: #fff;

    .header-title {
        font-weight: bold;
        text-align: center;
        font-size: 36rpx;
        padding: 20rpx 0 0;
    }

    .main-box {
        .address-info {
            padding: 0 20rpx;

            >.address-item {
                display: flex;
                align-items: center;
                height: 80rpx;

                .strip-item {
                    color: #333;
                    margin-right: 48rpx;
                    position: relative;

                    >view {
                        width: 12rpx;
                        height: 12rpx;
                        border-radius: 50%;
                        border: 2rpx solid #086df7;
                        transition: all 0.25s;
                        box-sizing: border-box;
                    }

                    .show-line {
                        &::after {
                            content: '';
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            width: 2rpx;
                            height: 69rpx;
                            background-color: #086df7;
                        }

                        /* #ifndef H5*/
                        &::after {
                            transform: translateX(-50%);
                        }

                        /* #endif */

                        /* #ifdef VUE2 */
                        &::after {
                            transform: translateX(-50%);
                        }

                        /* #endif */
                    }

                    .active {
                        background: #086df7;
                    }
                }

                .name-box {
                    font-size: 28rpx;
                    flex: 1;
                }

                .active {
                    color: #086df7;
                }

                .icon-box {
                    .iconfont {
                        font-size: 24rpx;
                        color: #72899b;
                    }
                }
            }
        }

        .address-select-box {
            padding: 20rpx 20rpx;
            border-top: 2rpx solid #d4d4d4;

            .content-box {
                height: 600rpx;

                .select-tip {
                    font-size: 32rpx;
                    color: #333;
                    font-weight: bold;
                    padding-bottom: 20rpx;
                }

                .select-item {
                    padding: 20rpx 20rpx;
                    font-size: 28rpx;
                    color: #333;
                }

                .active {
                    color: #086df7;
                }
            }
        }
    }
}
</style>