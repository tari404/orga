<template>
  <div id="orga-home">
    <Main>
      <template #menu>
        <SelectDate @update="selectDate" />
        <i @click="showCalendar = true" class="show-monthly"></i>
      </template>
    </Main>
    <transition name="slide-right">
      <Monthly v-if="showCalendar" @close="showCalendar = false" />
    </transition>
  </div>
</template>

<script>
import Main from '@/components/Main'
import Monthly from '@/components/Monthly'
import SelectDate from '@/components/ui/SelectDate'

export default {
  name: 'Home',
  components: {
    Main,
    Monthly,
    SelectDate,
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
  methods: {
    selectDate(date) {
      this.$router.push('/' + date)
    },
  },
}
</script>

<style lang="stylus">
#orga-home
  height 100%

.show-monthly
  display block
  width 24px
  height 24px
  background-image url('~@/assets/icon/calendar.svg')
  cursor pointer

.slide-right-enter, .slide-right-leave-to
  transform translateX(101%)
.slide-right-enter-active
  transition transform .3s ease-in-out
.slide-right-leave-active
  transition transform .24s ease-in
</style>
