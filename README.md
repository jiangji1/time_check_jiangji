## 一个vue的滑动选择器(移动端和PC端都能使用) 
### 先来张效果图
![1](https://raw.githubusercontent.com/jiangji1/time_check_jiangji/master/1.png)

安装 npm install time_check_jiangji

引入 import ReactTree from 'time_check_jiangji'

## 直接上干货，demo
```javascript
<template>
  <div class="App">
    <div @click="timeShow = true">点击显示Time组件</div>
    <Time v-if="timeShow" :cancleFn="cancleFn" :time="true" :defaultValue="[2019, 6, 5, '上午', '随便2']"  :arr="[['上午', '下午'], ['随便1', '随便2']]" @click="clickFn" :arrayFirstdayAndLastday="['2012.6.8', '2019.6.10']" :stylBtn="{'color': '#00ffff'}" />
  </div>
</template>

<script>
import Time from 'time_check_jiangji'
export default {
  name: 'App',
  components: {
    Time
  },
  data() {
    return {
      timeShow: true
    };
  },
  methods: {
    clickFn (e) {
      console.log(e)
      this.timeShow = false
    },
    cancleFn () {
      console.log('取消')
      this.timeShow = false
    }
  }
};
</script>
```

下面再来一个说明
```javascript
@click="clickFn"
是点击确认按钮的触发的函数 接受一个参数(数组类型)，是当前的值
(例如[2019, 6, 5, "上午", "随便2"])

:cancleFn="cancleFn"  (特别注意，是:cancleFn不是@cancleFn，是: 不是@)
是点击取消按钮触发的函数，不传则不显示取消按钮(非必传)

:defaultValue="[2019, 6, 5, "上午", "随便2"]"
是回显值(一维数组，非必传，传了能回显)  数据类型注意要对应上

:time="true"
开启年月日的时间选择模式(只能选择三年内的日期，非必传)

:arr="[['上午', '下午'], ['随便1', '随便2']]"
传入二维数组(非必传)
如果:time="true" 那么前三列是时间(年月日)，第四列是['上午', '下午']，第五列是['随便1', '随便2']
如果:time="false"或者未传， 第1列是['上午', '下午']，第2列是['随便1', '随便2']

:arrayFirstdayAndLastday="['2016.6-8', '2019-6.10']" (日期用逗号(.)或者一杠(-)隔开都行)
arrayFirstdayAndLastday是一维数组，数组长度必须是2，数组长度必须是2，数组长度必须是2
第一项是最早的显示时间，第二项是最晚的显示时间
['2016.6.8', '2019.6.10'] 那么最早显示时间是2016年6月8号，最晚时间是2019年6月10号

:stylBtn="{'color': '#00ffff'}"
是按钮这一栏的行内样式

```
