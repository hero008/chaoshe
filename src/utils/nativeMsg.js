const { statusBarHeight } = uni.getSystemInfoSync();
let timerId
let timeClose
let offTimerId
let messageCounter = 0;
class NativeMsg {

	// 整个区域的宽高
	viewStyle = {
		top: "0px",
		left: "0px",
		width: "100%",
		// 取图片的高度（带阴影的尺寸）
		height: `${uni.upx2px(260)}px`
	};

	constructor(item, cb) {
		// 记录内容信息，以供回调使用
		this.item = item;
		// 弹出、消失动画要用
		this.offsetTop = -statusBarHeight - uni.upx2px(159);
		// 上边界  
		this.startTop = -statusBarHeight - uni.upx2px(159);
		// 下边界
		this.endTop = statusBarHeight - uni.upx2px(36);
		// nativeObj.View 实例
		this.view = null;
		// 回调函数
		this.cb = cb || null;
		// 隐藏过程flag，防止重复执行
		this.hiding = false;
		// 标记当前弹窗状态
		this.status = "active";
		this.list = []
		this.off = false
		this.getImg()
	}
	// 创建区域以及背景
	create() {
		let _view = null;
		// 创建 View区域
		_view = new plus.nativeObj.View(`alarmMsg-${this.item.id}`, this.viewStyle);
		// 拦截触摸事件: 开启后 区域内的触摸事件不会透传到下面
		_view.interceptTouchEvent(true);
		// 触摸事件监听
		_view.addEventListener("touchstart", res => {
			this.endTop = this.offsetTop
		});
		messageCounter++
		// 触摸事件监听
		_view.addEventListener("touchmove", res => {
			if (this.offsetTop == this.endTop && !this.off && !this.hiding) {
				this.off = true
				this.hiding = true;
				this.cb && this.cb({ type: "move", result: this.item });
				this.animationHide();
			}

		});
		this.view = _view;
		this.drawInfo()
		this.animationShow();
		timerId = setTimeout(() => {
			if (!this.off && !this.hiding) {
				this.off = true
				this.hiding = true;
				this.cb && this.cb({ type: "move", result: this.item });
				this.animationHide();
			}
		}, this.item.display_duration * 1000);
		offTimerId = setTimeout(() => {
			this.off = true
			this.hiding = true;
			this.cb && this.cb({ type: "move", result: this.item });
			this.destroy()
		}, this.item.display_duration * 1000 + 3000);
	}
	async getImg() {

		const { extra_data } = this.item;
		let headImg = extra_data.user_avatar_url.includes('avatars') ? `https://img.shinemang.com/gachaStatic/static/${extra_data.user_avatar_url}` : extra_data.user_avatar_url
		this.list = [headImg, this.item.body]
		await Promise.all(this.list).then(values => {
			this.create();
		})
			.catch(error => {
				this.create();
			});

	}
	// 画内容
	drawInfo() {
		const { title, body, extra_data } = this.item;
		let titleName = title
		let nameShow = extra_data.user_name.includes("***") ? extra_data.user_name : '您'
		if (extra_data.level_name == '冲冲') extra_data.level_name = 'cc'
		if (title.length > 13) titleName = title.slice(0, 13) + '...'
		this.view.draw([
			{
				tag: 'rect',
				id: 'rect',
				rectStyles: { color: "#fff", radius: `${uni.upx2px(20)}px`, },
				position: { top: `${uni.upx2px(56)}px`, width: '100%', height: `${uni.upx2px(144)}px` },
			},
			// 头像
			{
				tag: 'img',
				id: 'head',
				src: this.list[0],
				position: { top: `${uni.upx2px(96)}px`, left: `${uni.upx2px(32)}px`, width: `${uni.upx2px(64)}px`, height: `${uni.upx2px(64)}px` },
			},
			{
				tag: 'img',
				id: 'goods',
				src: body,
				position: { top: `${uni.upx2px(68)}px`, right: `${uni.upx2px(144)}px`, width: `${uni.upx2px(80)}px`, height: `${uni.upx2px(80)}px` },
			},
			{
				tag: 'img',
				id: 'background',
				src: `_www/static/class/${extra_data.level_name}.png`,
				position: { top: '0px', left: '0px', width: '100%', height: '100%' }
			},

			{
				tag: "font",
				id: "name",
				text: '恭喜              获得',
				textStyles: { size: '14px', color: "#383228", weight: "800", align: "left" },
				position: { top: `${uni.upx2px(84)}px`, left: `${uni.upx2px(112)}px`, height: "wrap_content" }
			},
			{
				tag: "font",
				id: "userName",
				text: nameShow,
				textStyles: { size: '14px', color: "#6345FF", weight: "800", align: "center" },
				position: { width: `${uni.upx2px(100)}px`, top: `${uni.upx2px(84)}px`, left: `${uni.upx2px(168)}px`, height: "wrap_content" },

			},
			{
				tag: "font",
				id: "goodsName",
				text: `【${titleName}】`,
				textStyles: { size: '14px', color: "#383228", weight: "500", align: "right", },
				position: { width: `${uni.upx2px(420)}px`, top: `${uni.upx2px(152)}px`, right: `${uni.upx2px(62)}px`, height: "wrap_content" },
				clip: true, // 关键属性，启用裁剪
				styles: {
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}
			},
		]);
	}
	// 简易向下出现动画
	animationShow() {
		this.view.show();
		let allNum = Math.abs((this.offsetTop - this.endTop) * 2)
		for (let i = 1; i <= allNum; i++) {
			if (i % 2 == 0) {
				this.view.setStyle({
					...this.viewStyle,
					top: `${this.offsetTop++}px`,
				});
			}
		}
		if (this.offsetTop >= this.endTop) {
			this.status = "active";
			return;
		}

	}
	// 简易向上消失动画
	animationHide() {
		this.view.setStyle({
			...this.viewStyle,
			top: `${this.offsetTop--}px`,
		});
		if (this.offsetTop <= this.startTop) {
			this.hiding = false;
			this.destroy()
			if (messageCounter % 20 == 0) {
				this.clickClear()
				messageCounter = 0
			}
			return;
		}
		timeClose = setTimeout(() => {
			this.animationHide();
		}, 0);

	}
	destroy() {
		clearTimeout(timerId);
		clearTimeout(timeClose);
		clearTimeout(offTimerId);
		this.view.clear();//释放Bitmap图片占用的内存资源，销毁后图片对象将不可使用，其id属性值为undefined，调用其所有方法操作都会失
		this.status = "close";
		this.list = null;
	}
	clickClear() {
		// 必须手动置空引用
		this.view.close();  // 释放原生资源//当控件不再使用时需要调用close方法销毁控件
		// this.view.hide()//将View控件从屏幕隐藏，如果View控件未显示则不做任何操作。
		this.view = null;
		this.cb = null;

	}
	// 获取当前状态
	getStatus() {
		return this.status;
	}
}


// 对外暴露一个创建实例的方法
export function createAlarm(item, cb) {
	return new NativeMsg(item, cb);
}
