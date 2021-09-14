<template>
  <div id="orga-monthly">
    <div class="title">
      <h2>日历</h2>
      <span @click="$emit('close')">BACK</span>
    </div>
    <div class="calendar-layout">
      <div class="calendar">
        <ul class="week">
          <li v-for="(item, i) in week" :key="i">{{ item }}</li>
        </ul>
        <ul>
          <span v-for="i in dayOfFirstDate" :key="i"></span>
          <li
            v-for="(item, i) in calendar"
            :key="item.date"
            :class="{
              feature: item.date >= today,
              today: item.date === today,
            }"
            class="day"
          >
            {{ i + 1 }}
            <i
              :class="{
                delay: item.delay,
              }"
              :style="{
                transform: `translateY(${dY(item)})`,
              }"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="month">
      <span @click="jumpMonth(-1)">&lt;</span>
      <p>{{ month }}</p>
      <span @click="jumpMonth(1)">&gt;</span>
    </div>
    <div class="details"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timer from '../assets/lib/Timer'

const week = ['日', '一', '二', '三', '四', '五', '六']

export default {
  name: 'Monthly',
  data() {
    return {
      week,
      today: Timer.dateOf().date,

      timePointer: null,
      month: '',
      dayOfFirstDate: 0,
      calendar: [],
    }
  },
  computed: {
    ...mapState(['db']),
  },
  created() {
    this.update()
  },
  methods: {
    dY(item) {
      if (item.isEmpty) {
        return '0'
      }
      let y = -(item.rewards / item.goal) * 100
      if (y < -100) {
        y = -100
      }
      return y.toString() + '%'
    },
    async update(ts) {
      const firstDate = Timer.firstDateOfMonth(ts)
      this.timePointer = firstDate
      this.month = firstDate.dateStr.substr(0, 7).replace('-', '/')
      const day = new Date(firstDate.dateStr).getDay()
      this.dayOfFirstDate = day
      const info = await this.db.getMonthlyInfo(ts)
      this.calendar = info
    },
    jumpMonth(step) {
      const d = new Date(this.timePointer.dateStr)
      const nd = new Date(d.getFullYear(), d.getMonth() + step)
      this.update(nd.getTime())
    },
  },
}
</script>

<style lang="stylus">
#orga-monthly
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(#ebf1e9, .7)
  backdrop-filter blur(4px)
  display flex
  flex-direction column
  .title
    padding 0 12px
    display flex
    justify-content space-between
    align-items center
  .calendar-layout
    background-color #fff
  .month
    margin 8px 12px
    display flex
    justify-content space-between
    align-items center
    p
      font-size 20px
      font-weight 600
  .details
    flex 1 1 auto
    // background-color rgba(red, .1)

.calendar
  margin 10px auto 20px
  max-width 320px
  ul
    display grid
    grid-template-columns repeat(7, 1fr)
  li
    display flex
    justify-content center
    align-items center
  .week
    margin-bottom 4px
    padding 8px 0
    background-color #fff
    border-radius 10px 10px 0 0
    font-size 14px
    font-weight 600
    color #ccc
    >li:first-child, >li:last-child
      color green
  .day
    display flex
    justify-content center
    align-items center
    width 100%
    height 38px
    border-top solid 2px #fff
    border-bottom solid 2px #c5e1a5
    font-weight 600
    font-size 12px
    color #000
    overflow hidden
    position relative
    z-index 0
    i
      position absolute
      top 100%
      left 0
      width 100%
      height 100%
      background-color #c5e1a5
      z-index -1
    .delay
      border-top solid 6px #e91e7440
  .feature
    color #ccc
  .today
    font-size 16px
    color #558b2f
</style>
