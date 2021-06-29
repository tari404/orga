<template>
  <div class="update-diary">
    <div class="container">
      <h2>更新目标</h2>
      <p>备注</p>
      <textarea rows="6" v-model="remarks"></textarea>
      <p>目标</p>
      <div class="aims">
        <ul>
          <li v-for="(item, i) in targets" :key="i">
            <textarea v-model="targets[i]" rows="2"></textarea>
            <span @click="removeTarget(i)">X</span>
          </li>
        </ul>
        <div @click="addTargets">添加</div>
      </div>
    </div>
    <div class="buttons">
      <button @click="$emit('close')">取消</button>
      <button @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UpdateDiary',
  props: {
    date: {
      type: Number,
      default: 0,
    },
    diary: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    let targets = ['']
    if (this.diary && this.diary.targets && this.diary.targets.length) {
      targets = this.diary.targets.map((item) => item.content)
    }
    return {
      targets,
      remarks: (this.diary && this.diary.remarks) || '',
    }
  },
  computed: {
    ...mapState(['db']),
  },
  methods: {
    addTargets(e) {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth' })
      })
      this.targets.push('')
    },
    removeTarget(i) {
      this.targets.splice(i, 1)
    },
    async submit() {
      await this.db.set('diary', {
        ...this.diary,
        targets: this.targets
          .filter((item) => !!item)
          .map((item) => ({
            content: item,
            finished: false,
          })),
        remarks: this.remarks,
      })
      this.$emit('close', true)
    },
  },
}
</script>

<style lang="stylus" scoped>
.update-diary
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(#000, .5)
  .container
    position absolute
    left 0
    right 0
    bottom 0
    padding 10px 10px 50px
    background-color #fff
    width 100%
    max-height 80%
    overflow scroll

  .buttons
    position absolute
    bottom 0
    left 0
    width 100%
    display flex
    >button
      border none
      font inherit
      height 40px
      color #666
      background-color #ddd
      flex 1 1 auto
    >button:last-child
      color #fff
      background-color #8bc34a
      flex 3 1 auto

textarea
  padding 10px
  width 100%
  max-height 200px
  resize none
  font inherit
</style>
