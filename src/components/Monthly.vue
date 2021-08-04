<template>
  <div id="orga-monthly">
    <div class="calendar"></div>
    <div class="details"></div>
  </div>
</template>

<script>
export default {
  name: 'Monthly',
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
  .calendar
    height 400px
    flex 0 0 400px
    background-color rgba(blue, .1)
  .details
    flex 1 1 auto
    background-color rgba(red, .1)
</style>
