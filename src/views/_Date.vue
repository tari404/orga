<template>
  <Main v-if="refresh" :ts="ts">
    <template #menu>
      <router-link to="/" class="back-to-home"></router-link>
    </template>
  </Main>
</template>

<script>
import Timer from '@/assets/lib/Timer'
import Main from '@/components/Main'

export default {
  name: 'Date',
  components: {
    Main,
  },
  props: ['date'],
  data() {
    return {
      refresh: true,
    }
  },
  computed: {
    ts() {
      return Timer.fromISODate(this.date)
    },
  },
  watch: {
    $route() {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.back-to-home
  display block
  width 24px
  height 24px
  background-image url('~@/assets/icon/home.svg')
</style>
