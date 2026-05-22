<template>
	<view class="drawRecord">
		<div class="navbar_x flex_r flex_jb flex_ac">
			<view class="top_Back" @click.stop="gateBack">
				<text class="icof Back_ico">&#xe72c;</text>
				<text class="txt">返回</text>
			</view>
		</div>
		<div class="shanggui_con">
			<view class="p_lists">
				<div class="title" v-if="data.state == 1">可用卡包</div>
				<div class="order_list">
					<template>
						<scroll-view class="product-scroll" @scrolltolower="onReachScollBottom" :scroll-y="true"
							v-if="myCouponData.length || myPostcardData.length">
							<div class="order_item  flex_r flex_ac" :class="{ usedTicket: item.state != 1 }"
								v-for="(item, index) in myCouponData" :key="index" @click="onclickToChaowan(item)">
								<div class="rowl ticket flex_c flex_jc flex_ac">
									<span class="txt">{{ item.discountPrice || "0" }}</span>
									<span class="txt1">{{ {va: item.useRange, target: item.target, name:item.targetName} |userange }}</span>
								</div>
								<div class="row_r flex_r flex_ac flex_jb">
									<div class="rowc borr flex_c flex_jb flex_as">
										<div class="">
											<div class="txt">{{ item.name }}</div>
											<div class="date">有效期至：{{ item.expiredAt }}</div>
											<div class="desc ellipsis">{{ item.desc }}</div>
										</div>
										<div class="ico"
											@click.stop="goto('/pages/common/rulepop', { val: 'CouponRule' })">
											<span>使用规则</span><span class="icof">&#xe72b;</span>
										</div>
									</div>
									<div class="rowr flex_r flex_jc flex_ac">
										<div class="select" v-if="selectTicketId == item.id"></div>
										<span class="txt" style="color:#999" v-else-if="item.state != 1">{{ item.state== 3 ?"已使用" : item.state == 4 ? "已过期" : "锁定" }}</span>
										<span class="txt" v-else>立即使用</span>
									</div>
								</div>
							</div>
							<div class="con_msg" v-if="data.state == 1">~ 已过期或不能使用的券不予展示 ~</div>
						</scroll-view>
						<u-empty v-else text="暂无卡券~" icon="https://img.shinemang.com/gachaStatic/static/img/home/empty.png" :marginTop="50" />
					</template>
				</div>
			</view>
		</div>
	</view>
</template>
<script>
import { post } from "@/utils/api.js"
import { mapState, mapMutations } from 'vuex'
export default {
	data() {
		return {
			pageda: {
				page: 1,
				page_size: 30,
				total: 30,
			},
			myCouponData: [],
			myPostcardData: [],
			couponState: [''],
			selectTicketId: undefined,
			data: { state: 0, },
		};
	},
	computed: { ...mapState(['selectTicket']) },
	onLoad(da) {
		if (da == {}) {
			this.data = { state: 0, }
			return
		}
		Object.keys(da).forEach(key => {
			if (key != "gacha_id" && typeof da[key] === 'string' && !isNaN(Number(da[key]))) {
				da[key] = Number(da[key]);
			}
		});
		this.data = da
	},
	onShow() {
		this.pageda.page = 1
		this.getMyCoupons()
		if (this.selectTicket.id) this.selectTicketId = this.selectTicket.id;
	},
	methods: {
		...mapMutations(['UpselectTicket']),
		getMyCoupons() {
			post("v1/coupon/list", {
				page: this.pageda.page,
				page_size: this.pageda.page_size,
				// state: 0, // 0: 所有, 1:未使用, 2:锁定, 3:已使用，4:过期
				...this.data
			}).then(res => {
				if (this.pageda.page == 1) this.myCouponData = [];
				this.myCouponData = this.myCouponData.concat(res.tableData);
				// this.myCouponData.sort((a, b) => {
				// 	return a.state - b.state
				// })
				this.pageda.total = res.total;
			})
		},
		getMyPostCards() {
			post("v1/postcard/list", {
				...this.pageda,
			}).then(res => {
				if (this.pageda.page == 1) this.myPostcardData = [];
				this.myPostcardData = this.myPostcardData.concat(res.postcards);
				this.pageda.total = res.total;
			})
		},
		onclickToChaowan(item) {
			// 所有, 1:未使用, 2:锁定, 3:已使用，4:过期
			if (this.data.state == 1) {
				let id = this.selectTicketId == item.id ? "" : item.id
				this.selectTicketId = id
				this.UpselectTicket(id ? item : {})
				this.gateBack()
				return
			}
			let Arr = ['', '未使用', '锁定', '已使用', '过期']
			if (item.state != 1) {
				uni.showToast({
					title: `当前优惠券${Arr[item.state]}，不可使用！~`,
					icon: "none",
					duration: 2000,
				});
				return
			} else {
				switch (item.useRange) {
					case 2:
						this.goto('/pages/chaowan/gachasList', { type: item.target })
						break;
					case 3:
						this.loadDetail({ gacha_id: item.target, box_index: 0, })
						break;
					case 4:
						this.loadDetail({ theme_id: item.target })
						break;
					default:
						this.$sl("chaowanInx", 1, 1)
						uni.setStorageSync("currentChange", 0);
						uni.reLaunch({
							url: "/pages/index/index?chaowanInx=1"
						});
						break;
				}

			}

		},
		loadDetail(obj) {
			post("v1/gacha/detail", obj).then((res) => {
				// 1: 一番赏 2: 彩蛋机 3: 潮游赏 4：洞洞乐 res.gacha.type
				var url = ''
				switch (res.gacha.type) {
					case 1:
						url = '/pages/product/yifanshang'
						break;
					case 2:
						url = '/pages/product/niudan'
						break;
					case 3:
						url = '/pages/product/chaowanshang'
						break;
					case 4:
						url = '/pages/product/dongle'
						break;
					case 5:
						url = '/pages/product/chaosheshang'
						break;
					default:
						url = '/pages/index/index'
						break;
				}
				this.goto(url, obj)
			})
				.catch((err) => {
					uni.showToast({
						title: '当前盲盒属于预售状态，暂不可使用!~',
						icon: "none",
						duration: 2000,
					});
					return

				})


		},
		onReachScollBottom() {
			if (this.pageda.total > this.pageda.page * this.pageda.page_size) {
				this.pageda.page++;
				this.getMyCoupons();
			}
		}
	},
};
</script>
<style lang='scss' scoped>
.drawRecord {
	width: 100vw;
	height: 100vh;
	position: relative;
	padding: 100rpx 0 30rpx;
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

.navbar_x {
	padding: 0 32rpx;
	position: relative;
	z-index: 2;

	.btn_r {
		width: 162rpx;
		height: 46rpx;
	}

	.top_Back {
		color: #1C1C1C;

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
}

.tabs_two {
	width: 276rpx;
	height: 76rpx;
	background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tabs_bg.png");
	background-size: 100% 100%;
	font-size: 28rpx;
	color: #FFFFFF;
	line-height: 28rpx;

	.tab_item {
		width: 50%;
		line-height: 60rpx;
		text-align: center;

		&:first-child {
			&.active {
				margin-left: -16rpx;
			}
		}

		&:last-child {
			&.active {
				margin-right: -4rpx;
			}
		}

		&.active {
			margin-top: -10rpx;
			color: #333;
			width: 156rpx;
			height: 86rpx;
			line-height: 76rpx;
			font-weight: bold;
			background: url("https://img.shinemang.com/gachaStatic/static/img/shanggui/tab_bg.png");
			background-size: 100% 100%;
			font-size: 30rpx;
		}
	}
}

.shanggui_con {
	z-index: 2;
	width: 100%;
	height: calc(100% - 190rpx);
	position: absolute;
	bottom: 0;
	left: 0;

	.p_lists {
		// height: calc(100% - 66rpx);
		height: 100%;
		border-radius: 0 50rpx 0 0;
		// background: #F4F4F4;
		// margin-top: -15rpx;
		padding: 32rpx;
	}
}

.title {
	font-size: 28rpx;
	color: #626262;
	margin-bottom: 30rpx;
}

.order_list {
	// height: 100%;
	height: calc(100% - 66rpx);

	.product-scroll {
		height: 100%;
	}

	.con_msg {
		font-size: 24rpx;
		color: #B7B6B9;
		text-align: center;
		padding: 20rpx 0;
	}
}

.order_item {
	// width: 686rpx;
	width: 100%;
	height: 210rpx;
	background: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;

	.ticket {
		&::after {
			content: "";
			width: 40rpx;
			height: 40rpx;
			background: #F4F4F4;
			border-radius: 50%;
			position: absolute;
			top: -20rpx;
			right: -20rpx;
		}

		&::before {
			content: "";
			width: 40rpx;
			height: 40rpx;
			background: #F4F4F4;
			border-radius: 50%;
			position: absolute;
			bottom: -20rpx;
			right: -20rpx;
		}
	}

	.rowl {
		width: 186rpx;
		height: 210rpx;
		color: #fff;
		position: relative;
		background: linear-gradient(180deg, #EAB4D4 0%, #A259EC 100%);
		border-radius: 16rpx;

		&.active {
			background: #fff;
		}

		.txt {
			font-weight: 600;
			font-size: 56rpx;
			line-height: 80rpx;
			text-align: center;

			&:before {
				content: "￥";
				font-size: 24rpx;
				font-weight: 800;
			}
		}

		.txt1 {
			font-weight: 500;
			font-size: 28rpx;
			color: #fff;
			line-height: 34rpx;
		}

		.img_ico {
			width: 162rpx;
			height: 162rpx;
			border-radius: 12rpx;
			background-size: 100% 100%;
		}
	}

	.row_r {
		height: 210rpx;
		width: calc(100% - 186rpx);
		padding: 22rpx 28rpx;
		padding-right: 0;
	}

	.rowc {
		height: 100%;
		width: calc(100% - 88rpx);
		padding: 10rpx 0;

		&.borr {
			border-right: 4rpx dashed #eee;
		}

		.txt {
			font-weight: 800;
			font-size: 28rpx;
			color: #383228;
			line-height: 28rpx;
		}

		.date {
			font-weight: 500;
			font-size: 24rpx;
			color: #818181;
			// line-height: 60rpx;
			margin: 10rpx 0 6rpx;
		}

		.desc {
			font-size: 22rpx;
			color: #818181;
		}

		.ico {
			font-weight: 500;
			font-size: 24rpx;
			color: #818181;
		}
	}

	.rowr {
		width: 88rpx;
		height: 100%;
		position: relative;

		.select {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			background-image: url(https://img.shinemang.com/gachaStatic/static/img/pay/ico3.png);
			background-size: 100% 100%;
		}

		.txt {
			font-weight: 500;
			font-size: 28rpx;
			color: #715CDD;
			line-height: 34rpx;
			writing-mode: vertical-rl;
		}

		.btn {
			position: absolute;
			bottom: 0;
			right: 26rpx;
			width: 170rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			border-radius: 40rpx;
			border: 2rpx solid #715CDD;
			font-weight: 500;
			font-size: 24rpx;
			color: #715CDD;
		}

		.txt_sub {
			.sub_bg {
				position: absolute;
				top: -22rpx;
				right: 0;
				width: 96rpx;
				height: 76rpx;
				background: #715CDD;
				border-right: 50px solid transparent;
				border-bottom: 50px solid white;
				border-top-right-radius: 16rpx;
			}

			.sub_num {
				font-weight: 500;
				font-size: 24rpx;
				color: #fff;
				width: 56rpx;
				text-align: center;
				position: absolute;
				right: 6rpx;
				top: -12rpx;
			}
		}
	}

	.goods_item {
		background: #F9F9F9;
		border-radius: 16rpx;
		font-size: 28rpx;
		padding: 8rpx 20rpx;
		margin-bottom: 15rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.name {
			width: calc(100% - 80rpx);
		}

		.img {
			width: 60rpx;
			height: 60rpx;
			border-radius: 8rpx;
			background-color: rgba($color: $motif-color, $alpha: 0.5);
			border: 2rpx solid #fff;
			box-shadow: 0 0 2rpx 2rpx #CACACA;
			margin: 2rpx;
		}
	}

	.yifansh {
		@include grid(312rpx);

		.goods_item {
			width: 312rpx;
		}
	}

	&.usedTicket {
		.rowl {
			background: linear-gradient(180deg, #E4E4E4 0%, #959595 100%);
		}

		.row_r {
			opacity: 0.6;
		}
	}
}
</style>