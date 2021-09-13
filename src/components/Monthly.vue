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
              :style="{
                transform: `translateY(${item.isEmpty ? 0 : -(item.rewards / item.goal) * 100}%)`,
              }"
            />
          </li>
        </ul>
      </div>
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
      calendar: [],
    }
  },
  computed: {
    ...mapState(['db']),
  },
  async created() {
    const info = await this.db.getMonthlyInfo()
    this.calendar = info
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
  background-color rgba(#fff, .7)
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
  .details
    flex 1 1 auto
    background-color rgba(red, .1)

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
    border-bottom solid 1px #c5e1a5
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
  .feature
    color #ccc
  .today
    font-size 16px
    color #558b2f
</style>
