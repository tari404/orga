<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('OPEN_DB')
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
</style>
