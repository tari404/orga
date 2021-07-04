<template>
  <div class="orga-input-reward">
    <input type="range" min="-100" max="400" step="1" v-model="inputRewards" @change="update" />
    <input type="number" v-model="inputRewards" @change="update" />
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
  },
  data() {
    return {
      inputRewards: this.rewards.toString(),
    }
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
</style>
