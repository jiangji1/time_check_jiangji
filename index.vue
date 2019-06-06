<template>
<div class="container">
  <div class="Btn">
    <div class="cancleBtn" @click="btcancle" v-if="cancleFn">取消</div>
    <div class="sureBtn" @click="btsure">确定</div>
  </div>
  <div class="all">
    <div v-for="(v, i) in arrSelf" :key="i" @touchstart="tstart(i)" @touchmove="tmove(i)" @touchend="tend(i)">
      <ul :style="{'transform': `translateY(${a[i] && a[i].distance}px)`}">
        <li v-for="(v2, i2) in v" :key="i2" :style="{'transform': `translateZ(${!a[i]? 0: Math.abs(i2 - 3 + a[i].distance / 40) * 100 }px) rotateX(${!a[i]? 0: -(i2 - 3 + a[i].distance / 40) * 15 }deg)`,'color': `${Math.abs(i2 - 3 + a[i].distance / 40)? '': '#ff5722'}`}">{{v2}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Tim',
  props: {
    time: Boolean, // 是否开启默认时间模式
    arr: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    cancleFn: Function
  },
  data () {
    return {
      a: [],
      arrSelf: [],
      valueSelf: [],
      valueArr: []
    }
  },
  mounted () {
    console.log(this.defaultValue)
    this.initArr()
    this.initDistance()
  },
  methods: {
    tstart (i) {
      let e = window.event
      if (e.touches.lengh > 1) return
      this.a[i].ystart = e.touches[0].screenY - this.a[i].distance
    },
    tmove (i) {
      let e = window.event
      if (e.touches.lengh > 1) return
      let y = e.touches[0].screenY
      let { maxy, miny, ystart } = this.a[i]
      let distance = y - ystart
      if (distance > miny) distance = miny
      if (distance < maxy) distance = maxy
      this.a[i].distance = distance
      this.a = this.a
      this.$forceUpdate()
    },
    tend (i) {
      let e = window.event
      if (e.touches.length === 0 && e.changedTouches.length === 1) {
        let distance = Math.round(this.a[i].distance / 40) * 40
        let distanceDif = this.a[i].distance - distance
        let distanceDif10 = distanceDif / 10
        for (let i2 = 0; i2 < 10; i2++) {
          setTimeout(() => {
            if (i2 === 9) {
              this.a[i].distance = distance
              if (this.time && i === 1) { // 如果选择的是月份
                let [year, month] = this.getValueArr()
                this.arrSelf[2] = this.getDayArr(year, month)
                this.time && this.initDistance(true)
              }
              if (this.time && i === 0) { // 如果选择的是年份
                let [year, month] = this.getValueArr()
                this.arrSelf[1] = this.getMonthArr(year)
                this.arrSelf[2] = this.getDayArr(year, month)
                this.time && this.initDistance(true)
              }
            } else this.a[i].distance -= distanceDif10
            this.$forceUpdate()
          }, 17 * i2)
        }
      }
      this.valueArr = this.arrSelf.map((v, i) => {
        let i2 = -this.a[i].distance / 40 + 3
        return this.arrSelf[i][i2]
      })
    },
    btcancle () {
      this.cancleFn()
    },
    btsure () {
      this.$emit('click', this.getValueArr())
    },
    // 传入年月获得day的arr
    getDayArr (year, month) {
      let dayArr = []
      for (let i = 1; i < 32; i++) {
        dayArr.push(i)
      }
      if ([4, 6, 9, 11].includes(month)) dayArr.splice(30)
      if (month === 2) {
        if (year % 4) dayArr.splice(28)
        else dayArr.splice(29)
      }
      let time = new Date().toLocaleDateString().split('/')
      let yearNow = +time[0]
      let monthNow = +time[1]
      let dayNow = +time[2]
      if (year === yearNow && month === monthNow) dayArr = dayArr.filter(v => v <= dayNow)
      else if (year === yearNow - 3 && month === monthNow) dayArr = dayArr.filter(v => v >= dayNow)
      return dayArr
    },
    getMonthArr (year) {
      let monthArr = []
      let time = new Date().toLocaleDateString().split('/')
      let yearNow = +time[0]
      let monthNow = +time[1]
      for (let i = 1; i < 13; i++) {
        monthArr.push(i)
      }
      if (year === yearNow) monthArr = monthArr.filter(v => v <= monthNow)
      if (year === yearNow - 3) monthArr = monthArr.filter(v => v >= monthNow)
      return monthArr
    },
    getValueArr () {
      let arr = this.arrSelf.map((v, i) => {
        let i2 = -this.a[i].distance / 40 + 3
        return this.arrSelf[i][i2]
      })
      this.valueSelf = arr
      return arr
    },
    initArr () {
      if (this.time) {
        let time = new Date().toLocaleDateString().split('/')
        let year = +time[0]
        let month = +time[1]
        let day = +time[2]
        // let day = 30
        let yearArr = []
        let monthArr = []
        let dayArr = []
        if (this.defaultValue[0] && this.defaultValue[1] && this.defaultValue[2]) this.valueSelf = this.defaultValue
        else this.valueSelf = [year, month, day, ...this.value]
        if (month === 1 && day === 1) yearArr = [year - 3, year - 2, year - 1, year] // 这两行没想好，先随便写着
        else yearArr = [year - 3, year - 2, year - 1, year] // 这两行没想好，先随便写着
        let months = 13
        if (this.valueSelf[0] === year) months = month
        else if (this.valueSelf[0] === year - 3) months = 13 - month
        for (let i = 1; i <= months; i++) {
          monthArr.push(i)
        }
        dayArr = this.getDayArr(year, month)
        this.arrSelf = [yearArr, monthArr, dayArr, ...this.arr]
      } else {
        this.arrSelf = this.arr
        this.valueSelf = this.defaultValue[0] ? this.defaultValue : this.value
      }
      this.$forceUpdate()
    },
    initDistance (a) { // 如果没找到对应值的位置，就用数组最后一项
      this.arrSelf.forEach((v, i) => {
        let i2 = this.arrSelf[i].findIndex(a => a === this.valueSelf[i])
        let distance
        if (a && i2 === -1) i2 = this.arrSelf[i].length - 1
        if (i2 !== -1) distance = -(i2 - 3) * 40
        else distance = 40
        this.a[i] = {
          distance,
          maxy: -(this.arrSelf[i].length - 4) * 40,
          miny: 3 * 40
        }
      })
      this.$forceUpdate()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  background-color: #fff;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
ul, li {
  list-style: none ;
  margin: 0;
}
.all {
  display: flex;
  width: 100%;
  height: 280px;
  overflow: hidden;
  >div {
    flex: 1;
    position: relative;
    left: 0;
    top: 0;
    &:before {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 100%;
      height: calc(50% - 20px);
      background: linear-gradient(rgba(200, 200, 200, .1), rgba(0, 0, 0, 0));
      border-bottom: 1px solid #ccc;
    }
    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: calc(50% - 20px);
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(200, 200, 200, .1));
      border-top: 1px solid #ccc;
    }
    >ul {
      // perspective 4000
      padding: 0;
      transform-origin: center;
      >li {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
.Btn {
  height: 45px;
  line-height: 45px;
  color: #666666;
  font-size: 15px;
  background-color: #FFFAF8;
  .cancleBtn {
    // display: none;
    float: left;
    margin-left: 18px;
  }
  .sureBtn {
    float: right;
    margin-right: 28px;
  }
}
</style>
