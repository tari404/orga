<template>
  <div class="update-diary">
    <div class="container">
      <h2>添加支出</h2>
      <p>开销内容</p>
      <textarea rows="3" v-model="content"></textarea>
      <p>费用</p>
      <input type="number" v-model="value" placeholder="0" />
      <p class="total-spend">本月已花费{{ spend.length }}笔，共支出{{ totalValue }}</p>
      <ul class="spend-list">
        <li v-for="(item, i) in spend" :key="item.key" @click="toggle(i)">
          <i />
          <div class="content">
            <p>{{ item.content }}</p>
          </div>
          <span>{{ item.value }}</span>
          <div class="remove" :open="focus === i">
            <div @click.stop="remove(i)">删除</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="buttons">
      <div @click="$emit('close')">取消</div>
      <div @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Shopping',
  props: {
    monthly: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    const spend = this.monthly.spend.map((item) => ({
      ...item,
      key: Math.round(Math.random() * 1e10),
    }))
    const totalValue = spend.reduce((s, r) => s + r.value, 0)
    return {
      spend,
      totalValue,
      grow: this.monthly.grow,

      content: '',
      value: '',

      focus: -1,
    }
  },
  computed: {
    ...mapState(['db']),
  },
  methods: {
    toggle(i) {
      if (this.focus === i) {
        this.focus = -1
      } else {
        this.focus = i
      }
    },
    async remove(i) {
      this.focus = -1
      const removed = this.spend.splice(i, 1)[0]
      const value = removed.value
      this.grow += value
      this.totalValue -= value
      await this.db.set('monthly', {
        ...this.monthly,
        grow: this.grow,
        spend: this.spend.map((item) => ({
          content: item.content,
          value: item.value,
        })),
      })
      this.$emit('update')
    },
    async submit() {
      const value = Number(this.value)
      if (!value || value < 0 || !this.content) {
        return
      }
      this.grow -= value
      await this.db.set('monthly', {
        ...this.monthly,
        grow: this.grow,
        spend: [
          ...this.spend.map((item) => ({
            content: item.content,
            value: item.value,
          })),
          {
            content: this.content,
            value,
          },
        ],
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


.total-spend
  margin 24px 0 8px
.spend-list
  padding 0
  li
    padding 6px 0
    display flex
    justify-content space-between
    align-items center
    border-top solid 1px #f4f5f4
    line-height 24px
    overflow hidden
    position relative
    &:last-child
      border-bottom solid 1px #f4f5f4
    span
      margin-left 12px
      flex 0 0 80px
      text-align right
    .content
      flex 1 1 auto
      p
        width 180px
    >i
      margin-right 12px
      flex 0 0 4px
      width 4px
      height 4px
      border-radius 50%
      background-color #ddd
  .remove
    flex 0 0 0
    transition all .2s
    will-change auto
    overflow hidden
    &[open]
      flex 0 0 60px
    >div
      margin-left 30px
      width 30px
      color #f44336
      font-size 14px
      text-align right

textarea
  padding 10px
  width 100%
  max-height 200px
  resize none
  font inherit
</style>
