<template>
  <li class="orga-target">
    <i />
    <span>{{ content }}</span>
    <div class="checkbox" :selected="finished" @click="onSelect"></div>
  </li>
</template>

<script>
export default {
  name: 'Target',
  props: {
    content: {
      type: String,
      default: '',
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onSelect() {
      this.$emit('select', !this.finished)
    },
  },
}
</script>

<style lang="stylus" scoped>
.orga-target
  padding 8px 12px
  display flex
  justify-content space-between
  align-items center
  border-top solid 1px #f4f5f4
  line-height 24px
  overflow hidden
  &:last-child
    border-bottom solid 1px #f4f5f4
  >span
    flex 1 1 auto
  >i
    margin-right 12px
    flex 0 0 4px
    width 4px
    height 4px
    border-radius 50%
    background-color #ddd

.checkbox
  margin-left 14px
  flex 0 0 16px
  width 16px
  height 16px
  border-radius 4px
  border solid 1px #aeb6ae
  transition all ease-in-out .3s
  &[selected]
    transform scale(-1.2)
    border-radius 8px
    background-color #cddc39
    border-color #cddc39
</style>
