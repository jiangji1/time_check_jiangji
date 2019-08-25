<template>
<div class="container" :style="styl">
  <div class="Btn" :style="stylBtn">
    <div class="cancleBtn" @click="btcancle" v-if="cancleFn">取消</div>
    <div class="sureBtn" @click="btsure">确定</div>
  </div>
  <div class="all">
    <div v-for="(v, i) in arrSelf" :key="i" @touchstart.stop="tstart(i)" @touchmove.stop="tmove(i)" @touchend.stop="tend(i)" @mousedown.stop="tstart(i)" @mousemove.stop="tmove(i)" @mouseup.stop="tend(i)">
      <ul :style="{'transform': `translateY(${a[i] && a[i].distance / 16 * remNumber}px)`}">
        <li v-for="(v2, i2) in v" :key="i2" :style="{'transform': `translateZ(${!a[i]? 0: Math.abs(i2 - 3 + a[i].distance / 40) * 100 }px) rotateX(${!a[i]? 0: -(i2 - 3 + a[i].distance / 40) * 15 }deg)`,'color': `${Math.abs(i2 - 3 + a[i].distance / 40)? '': '#ff5722'}`,'user-select':'none'}">{{v2}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Time',
  props: {
    time: Boolean, // 是否开启默认时间模式
    arr: {
      type: Array,
      default: () => []
    },
    arrayFirstdayAndLastday:{
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    cancleFn: Function,
    styl: {
      type: Object,
      default: () => {}
    },
    stylBtn: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      a: [],
      arrSelf: [],
      valueSelf: [],
      valueArr: [],
      first: false,
      last: false,
      isPc: false,
      remNumber: 16
    }
  },
  mounted () {
    // console.log(this.defaultValue)
    this.initArr()
    this.initDistance()
    let html = document.querySelector('html')
    let remNumber = getComputedStyle(html)['font-size']
    remNumber = parseFloat(remNumber)
    this.remNumber = remNumber
  },
  methods: {
    tstart (i) {
      let e = window.event
      if (e.touches) {
        if (e.touches.length > 1) return
      } else {
        this.isPc = true
        e = { touches: [ {screenY: e.screenY} ] }
      }
      this.a[i].ystart = e.touches[0].screenY - this.a[i].distance
    },
    tmove (i) {
      let e = window.event
      if (!e.touches && !this.isPc) return
      if (this.isPc) {
        e = { touches: [ {screenY: e.screenY} ] }
      }
      if (e.touches.length > 1) return
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
      if (e.touches) {
        if (e.touches.length > 1) return
      } else if (this.isPc) {
        this.isPc = false
        e = {
          touches: { length: 0 },
          changedTouches: { length: 1 },
        }
      }
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
      if ([4, 6, 9, 11].indexOf(month) !== -1) dayArr.splice(30)
      if (month === 2) {
        if (year % 4) dayArr.splice(28)
        else dayArr.splice(29)
      }
      let time = new Date()
      let yearNow = +time.getFullYear()
      let monthNow = +time.getMonth() + 1
      let dayNow = +time.getDate()

      if (this.first && this.last) {
        let firstDay = this.first[2]
        let lastDay = this.last[2]
        if (this.first[0] === this.last[0] && this.first[1] === this.last[1]) dayArr = dayArr.filter(v => v >= firstDay && v <= lastDay)
        else if (this.first[0] === year && this.first[1] === month) dayArr = dayArr.filter(v => v >= firstDay) 
        else if (this.last[0] === year && this.last[1] === month) dayArr = dayArr.filter(v => v <= lastDay)
      } else {
        if (year === yearNow && month === monthNow) dayArr = dayArr.filter(v => v <= dayNow)
        else if (year === yearNow - 3 && month === monthNow) dayArr = dayArr.filter(v => v >= dayNow)
      }
      return dayArr
    },
    getMonthArr (year) {
      let monthArr = []
      let time = new Date()
      let yearNow = +time.getFullYear()
      let monthNow = +time.getMonth() + 1
      for (let i = 1; i < 13; i++) {
        monthArr.push(i)
      }
      if (this.first && this.last) {
        let firstMonth = this.first[1]
        let lastMonth = this.last[1]
        if (this.first[0] === this.last[0]) monthArr = monthArr.filter(v => v >= firstMonth && v <= lastMonth)
        else if (this.first[0] === year) monthArr = monthArr.filter(v => v >= firstMonth) 
        else if (this.last[0] === year) monthArr = monthArr.filter(v => v <= lastMonth)
      } else {
        if (year === yearNow) monthArr = monthArr.filter(v => v <= monthNow)
        if (year === yearNow - 3) monthArr = monthArr.filter(v => v >= monthNow)
      }
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
        let time = new Date()
        let year = +time.getFullYear()
        let month = +time.getMonth() + 1
        let day = +time.getDate()
        let yearArr = []
        let monthArr = []
        let dayArr = []
        this.valueSelf = this.defaultValue
        if (month === 1 && day === 1) yearArr = [year - 3, year - 2, year - 1, year]
        else yearArr = [year - 3, year - 2, year - 1, year]
        let months = 13
        if (this.valueSelf[0] === year) months = month
        else if (this.valueSelf[0] === year - 3) months = 13 - month
        for (let i = 1; i <= months; i++) {
          monthArr.push(i)
        }
        dayArr = this.getDayArr(year, month)
        console.log(this.arr)
        if (this.arrayFirstdayAndLastday.length === 2) {
         this.arrSelf = this.initArrFilterFromArrayFirstdayAndLastDay([yearArr, monthArr, dayArr])
        } else {
          this.arrSelf = [yearArr, monthArr, dayArr]
        }
        // console.log(this.arrSelf)
      } else {
        this.arrSelf = this.arr
        this.valueSelf = this.defaultValue[0]/*  ? this.defaultValue : this.value */
      }
      this.arrSelf = [...this.arrSelf, ...this.arr]
      this.$forceUpdate()
    },
    initArrFilterFromArrayFirstdayAndLastDay (arr) {
      let arr2 = [...arr]
       try {
        let yearArr = arr[0]
        let monthArr = arr[1]
        let dayArr = arr[2]
        let first = this.arrayFirstdayAndLastday[0].split(/\.|-/g).map(v => +v)
        if (first.every(v => typeof v === 'number' && !isNaN(v))) this.first = first
        let firstYear = first[0]
        let firstMonth = first[1]
        let firstDay = first[2]
        let last = this.arrayFirstdayAndLastday[1].split(/\.|-/g).map(v => +v)
        if (last.every(v => typeof v === 'number' && !isNaN(v))) this.last = last
        let lastYear = last[0]
        let lastMonth = last[1]
        let lastDay = last[2]
        let yearArr2 = []
        for (let i = firstYear; i <= lastYear; i++) {
          yearArr2.push(i)
        }
        yearArr2 = yearArr2.filter(v => {
          if (v >= firstYear && v <= lastYear) return v 
        })
        yearArr = yearArr2.length? yearArr2: yearArr
        let monthArr2 = monthArr.filter(v => {
          if (yearArr.length === 1) {
            if (v >= firstMonth && v <= lastMonth) return v 
          } else {
            if (v <= lastMonth) return v 
          }
        })
        monthArr = monthArr2.length? monthArr2: monthArr
        let dayArr2 = dayArr.filter(v => {
          if (yearArr.length === 1 && monthArr.length === 1) {
            if (v >= firstDay && v <= lastDay) return v 
          } else {
            if (v <= lastDay) return v 
          }
        })
        dayArr = dayArr2.length? dayArr2: dayArr
        return [yearArr, monthArr, dayArr]
      } catch (e) {
        return arr2
      }
    },
    initDistance (a) { // 如果没找到对应值的位置，就用数组最后一项
      this.arrSelf.forEach((v, i) => {
        let i2 = this.arrSelf[i].findIndex(a => a === this.valueSelf[i])
        let distance
        if (a && i2 === -1) i2 = this.arrSelf[i].length - 1
        if (i2 !== -1) distance = -(i2 - 3) * 40
        else {
          let x
          if (v.length < 3) x = (3 - v.length) * 40 + 40
          else x = 40
          distance = x
        }
        this.a[i] = {
          distance,
          maxy: -(this.arrSelf[i].length - 4) * 40,
          miny: 3 * 40
        }
        // !i && console.log(this.a[i])
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
  background-color: #fef2ee;
  .cancleBtn {
    // display: none;
    float: left;
    margin-left: 18px;
  }
  .sureBtn {
    float: right;
    margin-right: 28px;
    user-select: none;
  }
}
</style>
