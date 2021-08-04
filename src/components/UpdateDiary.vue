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
      <div @click="$emit('close')">取消</div>
      <div @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timer from '../assets/lib/Timer'

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
      const diary = this.diary
      const now = Timer.dateOf().date
      const isEmpty = diary.targets.length === 0 && !diary.remarks

      await this.db.set('diary', {
        ...diary,
        targets: this.targets
          .filter((item) => !!item)
          .map((item) => {
            const old = diary.targets.find((r) => r.content === item)
            return {
              content: item,
              finished: !!old && old.finished,
            }
          }),
        remarks: this.remarks,
        goal: 300, // TODO
        delay: diary.delay || (isEmpty && diary.date <= now),
        rewards: 0,
        updated: false,
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
  h2
    margin 0 0 24px
    font-size 20px

  .buttons
    position absolute
    bottom 0
    left 0
    width 100%
    display flex
    font-size 18px
    >div
      flex 1 1 auto
      height 50px
      display flex
      justify-content center
      align-items center
      color #666
      background-color #ddd
      cursor pointer
    >div:last-child
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
