## SY-StackedCarousel

该组件一般用于导航轮播，广告展示等场景,可开箱即用，具有如下特点：

- 3D 轮播图效果，满足不同的开发需求
- 可配置显示标题，涵盖不同的应用场景
- 功能属性齐全丰富
- 轻量级，支持小程序、H5 等平台（支持 vue2、vue3）

### 使用方式

```html
<template>
  <view class="container">
    <SYStackedCarousel
      height="480rpx"
      autoplay
      :images="images"
      :current="3"
      :interval="2000"
      @click="clickHandler"
      @change="changeHandler"
    >
    </SYStackedCarousel>
  </view>
</template>

<script>
  import SYStackedCarousel from "@/uni_modules/SY-StackedCarousel/components/SY-StackedCarousel.vue";
  export default {
    components: {
      SYStackedCarousel,
    },
    data() {
      return {
        images: [
          {
            url: "../../static/images/1.jpg",
            desc: "星辰大海任我行，风雨兼程志更坚。星辰大海任我行，风雨兼程志更坚。星辰大海任我行，风雨兼程志更坚。星辰大海任我行，风雨兼程志更坚。",
          },
          {
            url: "../../static/images/2.jpg",
            desc: "晨曦微露破晓时，梦想起航正当时。",
          },
          {
            url: "../../static/images/3.jpg",
            desc: "千锤百炼钢更强，逆境之中显真章。",
          },
          {
            url: "../../static/images/4.jpg",
            desc: "心有猛虎细嗅蔷薇，勇者无畏亦柔情。",
          },
          {
            url: "../../static/images/5.jpg",
            desc: "高山仰止景行行，志士仁人共长天。",
          },
        ],
      };
    },
    onLoad() {},
    methods: {
      clickHandler(item, index) {
        console.log("item: ", item);
        console.log("index: ", index);
      },
      changeHandler(index) {
        console.log("当前触发change事件，返回索引: ", index);
      },
    },
  };
</script>
```

### 属性说明

| 属性名						| 类型						| 默认值							| 说明																												|
| :-----------------| :---------------| :------------------	| :---------------------------------------------------------	|
| images						| Array						| []									| 图片数组																										|
| height						| [String, Number]| 300rpx							| 轮播图高度																									|
| autoplay					| Boolean					| true								| 是否自动播放																								|
| padding						| String					| 10px								| 轮播内边距																									|
| radius						| [String, Number]| 4										| 组件圆角值																									|
| bgColor						| String					| #ffffff							| 容器背景色																									|
| interval					| Number					| 2000								| 滑块自动切换时间间隔（ms）																	|
| current						| Number					| 0										| 当前显示的图片索引																					|
| easing						| String					| ease-in-out					| 动画类型																										|
| enableOpacity			| Boolean					| true								| 是否启用不透明度设定（堆叠每一层逐渐变透明）								|
| baseOpacity				| Number					| 0.8									| 最顶层图片的不透明度，每一层会根据这个值自动缩小 opacity值	|
| duration					| Number					| 500									| 滑块切换过程所需时间（ms）																	|
| horizontalMargin	| [String, Number]| 10									| 横向间距																										|
| verticalMargin		| [String, Number]| 10									| 纵向间距																										|
| showButton				| Boolean					| false								| 是否显示操作按钮																						|
| buttonSize				| [String, Number]| 24									| 按钮大小以及按钮图标大小																		|
| buttonBgColor			| String					| rgba(0, 0, 0, 0.26)	| 按钮背景颜色																								|
| imgMode						| String					| aspectFill					| 图片裁剪模式，详情见微信原生 imageMode											|
| showFirstImageOnly| Boolean					| false								| 是否只显示第一张图片，其他图片被蒙版遮住										|
| maskBgColor				| String					| #ffffff							| 遮住蒙版的颜色																							|
| showDesc					| Boolean					| true								| 是否显示图片描述（需要 images 传递的数据中存在 desc 属性）	|
| descBgColor				| String					| rgba(0, 0, 0, 0.5)	| 底部描述的背景颜色																					|
| descColor					| String					| #ffffff							| 底部描述字体颜色																						|
| descSize					| [String, Number]| 10									| 底部描述字体大小																						|
| descNoWrap				| Boolean					| false								| 描述是否不换行，超出后用...省略															|
| slideRadius				| [String, Number]| 10									| 图片的圆角值																								|

### 事件说明

| 事件名 | 说明                                 | 回调参数                                                   |
| :----- | :----------------------------------- | :--------------------------------------------------------- |
| click  | 点击图片触发                         | item：当前图片对象信息, index：当前是第几张图片，从 0 开始 |
| change | 轮播图切换时触发（自动或者手动切换） | index：当前是第几张图片，从 0 开始                         |

### 插槽

| 插槽名称		| 说明																|
| :-----			| :-----------------------------------|
| left-button	| 翻页按钮左侧图标										|
| right-button| 翻页按钮右侧图标										|