<template>
  <Main v-if="refresh" :date="ts" />
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
