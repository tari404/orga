<template>
  <div id="app">
    <router-view />
    <div v-if="needToSetGoal" id="orga-setgoal">
      <div>
        <p>设置目标</p>
        <input type="number" v-model="inputGoal" />
        <div @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      needToSetGoal: true,
      inputGoal: '0',
    }
  },
  computed: {
    ...mapState(['db']),
  },
  async created() {
    await this.$store.dispatch('OPEN_DB')
    const goal = await this.db.get('states', 'goal')
    if (typeof goal !== 'number') {
      this.needToSetGoal = true
    }
  },
  methods: {
    async confirm() {
      const n = Number(this.inputGoal)
      await this.db.set('states', n, 'goal')
      this.needToSetGoal = false
    },
  },
}
</script>

<style lang="stylus">
*
  box-sizing border-box
body, ul, p
  margin 0
a
  color inherit
  text-decoration none
#app
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

#orga-setgoal
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  padding 40px
  background-color rgba(#000, .5)
  display flex
  justify-content center
  align-items center
  >div
    padding 20px
    width 100%
    border-radius 10px
    background-color #fff
</style>
