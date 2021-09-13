<template>
  <div class="orga-select-date">
    <i @click="selectDate"></i>
    <input type="date" v-model="date" />
  </div>
</template>

<script>
import Timer from '@/assets/lib/Timer'

export default {
  name: 'SelectDate',
  data() {
    const today = Timer.dateOf().dateStr
    return {
      today,
      date: today,
    }
  },
  watch: {
    date(v) {
      if (v && v !== this.today) {
        this.$emit('update', v) // YYYY-MM-DD
      }
    },
  },
  methods: {
    selectDate() {
      const input = this.$el.querySelector('input')
      input.focus({ preventScroll: true })
    },
  },
}
</script>

<style lang="stylus" scoped>
.orga-select-date
  width 24px
  height 24px
  display flex
  justify-content center
  align-items center
  overflow hidden
  position relative
  i
    width 24px
    height 24px
    background-image url('~@/assets/icon/history.svg')
  input
    position absolute
    top -100px
    left 0
    width 0
    height 0
    opacity 0
</style>
