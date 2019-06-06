<template>
  <div class="A">
    <div @click="showFn">开</div>
    <Time v-if="show" :arr="arr" :value="value" @click="btn" :time="true" :cancleFn="cancleFn" :defaultValue="defaultValue"></Time>
  </div>
</template>

<script>
import Time from 'time_check_jiangji' // 这里是组件路径

export default {
  name: 'A',
  components: {
    Time
  },
  data () {
    return {
      show: false,
      arr: [
        ['上午', '下午'], 
        ['随便1', '随便2']
      ],
      value: ['上午', '随便2'],
      defaultValue: []
    }
  },
  methods: {
    showFn () {
      this.show = true
    },
    btn (e) {
      this.show = false
      this.defaultValue = e
      console.log('这是确认按钮接受的值', e)
    },
    cancleFn () {
      this.show = false
      console.log('取消按钮被电击了')
    }
  }
}
</script>
