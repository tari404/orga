<template>
  <div class="update-diary">
    <div class="container">
      <h2>添加支出</h2>
      <p>开销内容</p>
      <textarea rows="3" v-model="content"></textarea>
      <p>费用</p>
      <input type="number" v-model="value" />
      <p class="total-spend">本月已花费{{ spend.length }}笔，共支出{{ totalValue }}</p>
      <ul class="spend-list">
        <li v-for="(item, i) in spend" :key="i">
          <i />
          <p>{{ item.content }}</p>
          <span>{{ item.value }}</span>
        </li>
      </ul>
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
  name: 'Shopping',
  props: {
    monthly: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    const spend = this.monthly.spend
    const totalValue = spend.reduce((s, r) => s + r.value, 0)
    return {
      spend: this.monthly.spend,
      totalValue,
      content: '',
      value: '0',
    }
  },
  computed: {
    ...mapState(['db']),
  },
  methods: {
    async submit() {
      const value = Number(this.value)
      if (!value || value < 0 || !this.content) {
        return
      }
      await this.db.set('monthly', {
        ...this.monthly,
        grow: this.monthly.grow - value,
        spend: [
          ...this.spend,
          {
            content: this.content,
            value: value,
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
    &:last-child
      border-bottom solid 1px #f4f5f4
    span
      margin-left 12px
      flex 0 0 80px
      text-align right
    p
      flex 1 1 auto
    >i
      margin-right 12px
      flex 0 0 4px
      width 4px
      height 4px
      border-radius 50%
      background-color #ddd

textarea
  padding 10px
  width 100%
  max-height 200px
  resize none
  font inherit
</style>
