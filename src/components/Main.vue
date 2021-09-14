<template>
  <div class="home">
    <div class="orga-top">
      <div>
        <Now />
        <div class="orga-console">
          <div>
            <div class="item">
              本月已攒：<span>{{ monthly.grow }}</span>
            </div>
            <div class="item">
              <p>
                今日增加：<span>{{ diary.rewards }}</span>
              </p>
              <p v-if="!isEmpty">
                目标：<span>{{ diary.goal }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="orga-menu">
        <slot name="menu" />
      </div>
    </div>
    <div class="orga-aim">
      <div class="title">
        <p>今日目标</p>
        <span v-if="diary.targets.length" @click="addDiary">编辑</span>
      </div>
      <div class="diary-container">
        <div class="add-diary" v-if="isEmpty" @click="addDiary">添加目标</div>
        <ul v-else>
          <Target
            v-for="(target, i) in diary.targets"
            :key="i"
            :content="target.content"
            :finished="target.finished"
            @select="toggleTarget(i, $event)"
          />
        </ul>
        <div class="remarks">{{ diary.remarks }}</div>
        <div v-if="diary.delay" class="orga-overtime">过期弥补</div>
      </div>
    </div>
    <div class="orga-footer">
      <div class="rewards">
        <div>
          <p>今日零花钱</p>
          <Reward :diary="diary" :rewards.sync="rewards" @update:rewards="submitDiary" />
        </div>
      </div>
      <div v-if="!ts">
        <div v-if="tomorrow.targets.length">明日目标已安排</div>
        <div v-else @click="addTomorrow">设定明日目标</div>
      </div>
      <i class="shopping" @click="goShopping" />
    </div>
    <UpdateDiary v-if="toUpdate" :date="toUpdate.date" :diary="toUpdate" @close="updateFinished" />
    <Shopping
      v-if="shopping"
      :monthly="shopping"
      @close="shoppingFinished"
      @update="updateMonthly"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timer from '../assets/lib/Timer'

import Now from '@/components/Now'
import UpdateDiary from '@/components/UpdateDiary'
import Shopping from '@/components/Shopping'
import Target from '@/components/Target'

import Reward from '@/components/ui/Reward'

export default {
  name: 'Main',
  components: {
    Now,
    UpdateDiary,
    Shopping,
    Target,
    Reward,
  },
  props: {
    ts: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    const date = Timer.dateOf(this.ts)
    const tomorrow = Timer.dateOf(this.ts || Date.now() + 86400000)
    const month = Timer.monthOf(this.ts)
    return {
      diary: {
        ...date,
        targets: [],
        remarks: '',
        rewards: 0,
        // goal: 300,
        // updated: false,
        // delay: true,
      },
      tomorrow: {
        ...tomorrow,
        targets: [],
        remarks: '',
        // goal: 300,
        // rewards: 0,
        // updated: false,
        // delay: true,
      },
      monthly: {
        month,
        grow: 0,
        spend: [],
      },
      toUpdate: null,
      shopping: null,
      rewards: 0,
    }
  },
  computed: {
    ...mapState(['db']),
    finishedCount() {
      return this.diary.targets.reduce((s, c) => s + (c.finished ? 1 : 0), 0)
    },
    targetsCount() {
      return this.diary.targets.length
    },
    isEmpty() {
      return this.diary.targets.length === 0 && !this.diary.remarks
    },
  },
  watch: {
    diary(d) {
      this.rewards = d.rewards
    },
  },
  async created() {
    await this.$store.dispatch('OPEN_DB')

    this.updateDiary()
    this.updateMonthly()
  },
  methods: {
    updateDiary() {
      this.db.get('diary', this.diary.date).then((result) => {
        if (result) {
          this.diary = result
        }
      })

      this.db.get('diary', this.tomorrow.date).then((result) => {
        if (result) {
          this.tomorrow = result
        }
      })
    },
    updateMonthly() {
      this.db.get('monthly', this.monthly.month).then((result) => {
        if (result) {
          this.monthly = result
          this.checkMonthly()
        } else {
          this.db.add('monthly', this.monthly)
        }
      })
    },
    async checkMonthly() {
      const totalRewards = await this.db.getTotalRewards(this.ts)
      const totalSpend = this.monthly.spend.reduce((s, c) => s + (c.value || 0), 0)
      if (totalRewards - totalSpend !== this.monthly.grow) {
        this.monthly.grow = totalRewards - totalSpend
        return this.db.set('monthly', {
          ...this.monthly,
        })
      }
    },
    async submitDiary() {
      await this.db.set('monthly', {
        ...this.monthly,
        grow: this.monthly.grow - this.diary.rewards + this.rewards,
      })
      await this.db.set('diary', {
        ...this.diary,
        updated: true,
        rewards: this.rewards,
      })
      this.updateDiary()
      this.updateMonthly()
    },
    addDiary() {
      this.toUpdate = this.diary
    },
    addTomorrow() {
      this.toUpdate = this.tomorrow
    },
    goShopping() {
      this.shopping = this.monthly
    },
    toggleTarget(index, status) {
      const finishedBefore = this.finishedCount
      this.diary.targets[index].finished = status
      let goal = this.diary.goal
      if (this.diary.delay) {
        goal = goal / 2
      }
      const rewards = this.rewards

      if (status) {
        const newRewards = rewards + (goal - rewards) / (this.targetsCount - finishedBefore)
        this.rewards = Math.ceil(newRewards)
      } else {
        const newRewards = rewards - rewards / finishedBefore
        this.rewards = Math.ceil(newRewards)
      }

      this.submitDiary()
    },
    updateFinished(updated) {
      if (updated) {
        this.updateDiary()
      }
      this.toUpdate = null
    },
    shoppingFinished(updated) {
      if (updated) {
        this.updateMonthly()
      }
      this.shopping = null
    },
  },
}
</script>

<style lang="stylus" scoped>
.home
  height 100%
  display flex
  flex-direction column
.orga-top
  padding 12px
  color #fff
  background-color #558b2f
  display flex
  justify-content space-between
  align-items center
.orga-console
  .item
    display flex
    p
      width 140px
.orga-menu
  display grid
  grid-gap 8px

.orga-aim
  flex 1 1 auto
  display flex
  flex-direction column
  padding 12px 0
  .title
    padding 0 12px
    margin-bottom 18px
    display flex
    justify-content space-between
    align-items center
    p
      font-weight 500
    span
      color #c5e1a5
  .add-diary
    margin 0 12px
    height 60px
    background-color #f1f8e9
    border-radius 6px
    border solid 2px #c5e1a5
    color #c5e1a5
    font-size 24px
    display flex
    justify-content center
    align-items center
  .diary-container
    flex 1 1 100px
    white-space pre-wrap
    overflow-y scroll
  ul
    padding 0
  .remarks
    margin-top 12px
    padding 0 12px

.orga-overtime
  margin 12px
  padding 4px 0
  border-radius 4px
  border solid 2px #e91e74
  background-color #fce4ec
  text-align center
  color #e91e74
  font-weight 500
  opacity .4

.orga-footer
  padding 12px 50px 12px 12px
  color #fff
  background-color #558b2f
  position relative
  .rewards
    display flex
    justify-content space-between
    align-items center
    position relative
  .shopping
    position absolute
    right 12px
    top 50%
    transform translateY(-50%)
    width 24px
    height 24px
    background-image url('~@/assets/icon/shopping.svg')
  .submit-diary
    position absolute
    right 0
    top 0
    height 100%
    display flex
    align-items center
</style>
