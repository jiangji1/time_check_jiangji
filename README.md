## 一个vue的滑动选择器(移动端和PC端都能使用) 
### 先来张效果图
![1](.\1.png)





下面再来一个说明

@click是确认按钮的触发的函数 接受的一个值，输一个数组，是每个滑动框的值

:cancleFn是取消按钮触发的函数，不传则不显示取消按钮(非必传)

:defaultValue是值(一维数字，每个滑动选择框的值，非必传，传了能回显)

:time="true"开启年月日的时间选择模式(只能选择三年内的日期，非必传)

:arr传入二维数组(开不开启年月日的时间选择模式，都可以传入，非必传)



```javascript
<Time v-if="show" @click="timeFn" :time="true" :cancleFn="cancleFn" :defaultValue="defaultValue" :arr="arr"/>
```


