<template>
  <div class="now">
    <p>当前时间:</p>
    <p>{{ this.date.join(' ') }}</p>
  </div>
</template>

<script>
import Timer from '../assets/lib/Timer'

export default {
  name: 'Now',
  data() {
    return {
      date: [],
      raf: 0,
    }
  },
  created() {
    this.render()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.raf)
  },
  methods: {
    render() {
      const now = Timer.dateWithoutTimezone()
      const date = now.toISOString()

      this.date = [date.substr(0, 10).replace(/-/g, '/'), date.substr(11, 12)]

      this.raf = requestAnimationFrame(this.render)
    },
  },
}
</script>
