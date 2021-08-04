<template>
  <div class="orga-input-reward">
    <input type="range" :min="min" :max="max" step="1" v-model="inputRewards" @change="update" />
    <input type="number" v-model="inputRewards" @change="update" />
    <div v-if="isEmpty" class="mask"></div>
  </div>
</template>

<script>
export default {
  name: 'Reward',
  props: {
    rewards: {
      type: Number,
      default: 0,
    },
    diary: {
      type: Object,
      default: () => ({
        goal: 100,
        delay: false,
      }),
    },
  },
  data() {
    return {
      inputRewards: this.rewards.toString(),
    }
  },
  computed: {
    min() {
      return -Math.round(this.diary.goal / 30) * 10
    },
    max() {
      let goal = this.diary.goal
      if (this.diary.delay) {
        goal = goal / 2
      }
      return Math.round(goal * 0.15) * 10
    },
    isEmpty() {
      return this.diary.targets.length === 0 && !this.diary.remarks
    },
  },
  watch: {
    rewards(v) {
      if (v !== Number(this.inputRewards)) {
        this.inputRewards = v.toString()
      }
    },
  },
  methods: {
    update() {
      this.$emit('update:rewards', Number(this.inputRewards) || 0)
    },
  },
}
</script>

<style lang="stylus" scoped>
.orga-input-reward
  display flex
  align-items center
  position relative
  input[type=range]
    height 30px
    margin-right 24px
  input[type=number]
    padding 0
    width 100px
    color #fff
    font inherit
    font-size 24px
    line-height 30px
    border none
    outline none
    display inline
    border-radius 0
    background none
  .mask
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background-color rgba(#558b2f, .5)
</style>
