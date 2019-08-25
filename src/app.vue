<template>
  <div class="App">
    <div @click="timeShow = true">点击显示Time组件</div>
    <Time v-if="timeShow" :cancleFn="cancleFn" :time="true" @click="clickFn" :arrayFirstdayAndLastday="['2012.6.8', '2019.6.10']" :stylBtn="{'color': '#00ffff'}" />
  </div>
</template>

<script>
import Time from './component'
// import Time from './../lib'
// import Time from './../node_modules/timeJ'
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

<style lang="scss" scoped>
.App {
  color: skyblue;
}
</style>