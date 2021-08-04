<template>
  <div id="orga-home">
    <Main />
    <transition name="slide-right">
      <Monthly v-if="showCalendar" />
    </transition>
  </div>
</template>

<script>
import Main from '@/components/Main'
import Monthly from '@/components/Monthly'

export default {
  name: 'Home',
  components: {
    Main,
    Monthly,
  },
  data() {
    return {
      showCalendar: false,
    }
  },
  created() {
    window.orgatest = () => {
      this.showCalendar = !this.showCalendar
    }
  },
}
</script>

<style lang="stylus">
#orga-home
  height 100%

.slide-right-enter, .slide-right-leave-to
  transform translateX(101%)
.slide-right-enter-active
  transition transform .3s ease-in-out
.slide-right-leave-active
  transition transform .24s ease-in
</style>
