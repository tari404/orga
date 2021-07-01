<template>
  <div class="home">
    <div class="orga-top">
      <Now />
      <div>
        本月已攒：<span>{{ monthly.grow }}</span>
      </div>
      <div>
        今日增加：<span>{{ diary.rewards }}</span>
      </div>
    </div>
    <div class="orga-aim">
      <div class="title">
        <p>今日目标</p>
        <span v-if="diary.targets.length" @click="addDiary">编辑</span>
      </div>
      <div class="diary-container">
        <div class="add-diary" v-if="!diary.targets.length" @click="addDiary">添加目标</div>
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
      </div>
    </div>
    <div class="orga-footer">
      <div class="rewards">
        <div>
          <p>今日报酬</p>
          <div class="inputs">
            <input class="range" type="range" min="-100" max="400" step="1" v-model="rewards" />
            <input class="number" type="number" v-model="rewards" />
          </div>
        </div>
        <div class="submit-diary" @click="submitDiary">更新</div>
      </div>
      <div>
        <div v-if="tomorrow.targets.length">明日目标已安排</div>
        <div v-else @click="addTomorrow">设定明日目标</div>
      </div>
    </div>
    <UpdateDiary v-if="toUpdate" :date="toUpdate.date" :diary="toUpdate" @close="updateFinished" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timer from '../assets/lib/Timer'

import Now from '@/components/Now'
import UpdateDiary from '@/components/UpdateDiary'
import Target from '@/components/Target'

export default {
  name: 'Home',
  components: {
    Now,
    UpdateDiary,
    Target,
  },
  data() {
    const date = Timer.dateOf()
    const tomorrow = Timer.dateOf(Date.now() + 86400000)
    const month = Timer.monthOf()
    return {
      diary: {
        ...date,
        targets: [],
        remarks: '',
        goal: 300, // TODO
        rewards: 0,
        updated: false,
      },
      tomorrow: {
        ...tomorrow,
        targets: [],
        remarks: '',
        goal: 300, // TODO
        rewards: 0,
        updated: false,
      },
      monthly: {
        month,
        grow: 0,
        spend: [],
      },
      toUpdate: null,
      rewards: '0',
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
  },
  watch: {
    diary(d) {
      this.rewards = d.rewards.toString()
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
        } else {
          this.db.add('diary', this.diary)
        }
      })

      this.db.get('diary', this.tomorrow.date).then((result) => {
        if (result) {
          this.tomorrow = result
        } else {
          this.db.add('diary', this.tomorrow)
        }
      })
    },
    updateMonthly() {
      this.db.get('monthly', this.monthly.month).then((result) => {
        if (result) {
          this.monthly = result
        } else {
          this.db.add('monthly', this.monthly)
        }
      })
    },
    async submitDiary() {
      await this.db.set('monthly', {
        ...this.monthly,
        grow: this.monthly.grow - this.diary.rewards + Number(this.rewards),
      })
      await this.db.set('diary', {
        ...this.diary,
        updated: true,
        rewards: Number(this.rewards),
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
    toggleTarget(index, status) {
      const finishedBefore = this.finishedCount
      this.diary.targets[index].finished = status
      const goal = this.diary.goal
      const rewards = Number(this.rewards)

      if (status) {
        const newRewards = rewards + (goal - rewards) / (this.targetsCount - finishedBefore)
        this.rewards = Math.ceil(newRewards).toString()
      } else {
        const newRewards = rewards - rewards / finishedBefore
        this.rewards = Math.ceil(newRewards).toString()
      }
    },
    updateFinished(updated) {
      if (updated) {
        this.updateDiary()
      }
      this.toUpdate = null
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
.orga-footer
  padding 12px
  color #fff
  background-color #558b2f
  .rewards
    padding-right 50px
    display flex
    justify-content space-between
    align-items center
    position relative
    .inputs
      display flex
      align-items center
    .range
      height 30px
      margin-right 24px
    .number
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
  .submit-diary
    position absolute
    right 0
    top 0
    height 100%
    display flex
    align-items center
</style>
