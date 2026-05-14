const { statusBarHeight } = uni.getSystemInfoSync();
let richText = 0
let lastTimeY
let startY
let maxTop
class Notice {
	// 整个区域的宽高
	constructor(item, cb) {
		// 记录内容信息，以供回调使用
		this.viewStyle = {
			left: (plus.screen.resolutionWidth - uni.upx2px(542)) / 2 + 'px',
			top: (plus.screen.resolutionHeight - uni.upx2px(962)) / 2 + 'px',
			width: `${uni.upx2px(542)}px`,
			height: `${uni.upx2px(962)}px`
		};
		this.txtStyle = {
			top: (plus.screen.resolutionHeight - uni.upx2px(962)) / 2+uni.upx2px(396)+'px',
			left: (plus.screen.resolutionWidth - uni.upx2px(446)) / 2 + 'px',
			width: `${uni.upx2px(446)}px`,
			height: `${uni.upx2px(516)}px`
		};
		this.endTop = statusBarHeight;
		this.item = item;
		this.view = null;
		this.viewText = null;
		// 背景图片
		this.cb = cb || null;
		// 标记当前弹窗状态
		this.status = "active";
		this.list = []
		this.getImg()
	}
	// 创建区域以及背景
	create() {
		maxTop = 0
		richText = 0
		let _view = null;
		let _viewText = null;
		_view = new plus.nativeObj.View(`bg-${this.item.id || "ins"}`, this.viewStyle);
		_viewText = new plus.nativeObj.View(`text-${this.item.id || "ins"}`,this.txtStyle);
		// 增加点击事件监听
		_view.interceptTouchEvent(true);
		_view.addEventListener("click", (e) => {
			const { clientX, clientY } = e
			let Y = clientY - Number(this.item.params_map.top)
			let x = Number(this.item.params_map.width) - Number(this.item.params_map.right) - 14 - clientX
			if (x < 50 && x > -20 && Y < 50 && Y > -20) {
				this.hide()
			}
		});
		_viewText.interceptTouchEvent(true);
		// 触摸事件监听
		_viewText.addEventListener("touchstart", res => {
			startY = res.clientY; // 记录起始 Y 坐标
		}, { passive: true });
		// 触摸事件监听
		_viewText.addEventListener("touchmove", res => {
			const { clientY } = res; // 当前 Y 坐标
			const deltaY = clientY - startY; // 计算移动距离
			if (deltaY == 0 || lastTimeY == clientY) return
			lastTimeY = clientY
			if (deltaY > 0 && richText < this.endTop) {
				richText = richText + 9
				// console.log(deltaY,"向下滑动");
			} else if (deltaY < 0 && richText > maxTop) {
				richText = richText - 9
				// console.log(deltaY,"向上滑动");
			} else return
			this.getRichtext()
		}, { passive: false });
		this.view = _view;
		this.viewText = _viewText
		this.drawInfo()
		this.view.show();
		this.viewText.show();
	}
	async getImg() {

		let arr = JSON.parse(this.item.body);
		this.list = [arr.bg, arr.close_btn];
		await Promise.all(this.list).then(values => {
			this.create();
		})
			.catch(error => {
				this.create();
			});

	}
	// 画内容
	drawInfo() {
		const { params_map, title, created_at } = this.item;
		this.view.draw([
			{
				tag: 'img',
				id: 'background',
				src: this.list[0],
				position: { top: 'auto', left: 'auto', width: '100%', height: '100%' }
			},
			{
				tag: 'img',
				id: 'btn',
				src: this.list[1],
				position: { top: `${uni.upx2px(146)}px`, left: `${uni.upx2px(466)}px`, width: `${uni.upx2px(56)}px`, height: `${uni.upx2px(56)}px` },
			},
			{
				tag: "font",
				id: "title",
				text: title,
				textStyles: { size: '22px', color: "rgba(193, 113, 255, 1)", weight: "bold", align: "acenter", family: 'PingFang SC, PingFang SC' },
				position: { top: `${uni.upx2px(-210)}px` }
			},
			{
				tag: "font",
				id: "time",
				text: created_at.split('T')[0],
				textStyles: { size: '12px', color: "rgba(74, 110, 233, 1)", align: "acenter", family: 'PingFang SC, PingFang SC' },
				position: { top: `${uni.upx2px(-160)}px` }
			},
			{
				tag: 'rect',
				id: 'rect',
				rectStyles: { color: "rgba(255, 255, 255, 0.40)", radius:`${uni.upx2px(20)}px`, borderWidth: '2px', },
				position: { bottom:`${uni.upx2px(50)}px`, left:`${uni.upx2px(24)}px`, width: `${uni.upx2px(494)}px`, height:`${uni.upx2px(542)}px`},
			},

		]);
		this.getRichtext()
	}
	getRichtext() {
		this.viewText.draw([
			{
				tag: "richtext",
				id: "myRichText",
				text: this.item.content,
				position: { top: `${richText}px`, width: '100%', height: 'wrap_content' },

			}
		]);
		const stats = this.countVisibleChars(this.item.content) / 160;
		maxTop = (stats * 200) * -1 + 100
	}
	hide() {
		this.status = "close";
		// 销毁
		this.view.close();
		this.viewText.close();
		// 销毁图片
		this.view.clear();
		this.viewText.clear();
	}
	// 获取当前状态
	getStatus() {
		return this.status;
	}
	countVisibleChars(html) {
		// 1. 去除所有HTML标签
		const textWithoutTags = html.replace(/<[^>]+>/g, '');

		// 2. 去除换行符和多余空格
		const visibleText = textWithoutTags
			.replace(/[\r\n]+/g, ' ') // 换行符转空格
			.replace(/\s{2,}/g, ' ')  // 多个空格合并
			.trim();
		return visibleText.length;
	}

}

// 对外暴露一个创建实例的方法
export function showNotice(item, cb) {
	return new Notice(item, cb);
}
