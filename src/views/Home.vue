<template>
  <div class="home">
    <Now />
    <div>
      本月剩余零用钱：<span>{{ monthly.grow }}</span>
    </div>
    <div>
      今日增加：<span>{{ diary.rewards }}</span>
    </div>
    <div class="orga-aim">
      <p>今日目标</p>
      <div v-if="!diary.targets.length" @click="addDiary">添加目标</div>
      <ul v-else>
        <li v-for="(target, i) in diary.targets" :key="i">
          <span>{{ target.content }}</span>
          <input type="checkbox" v-model="target.finished" />
        </li>
      </ul>
      <div>{{ diary.remarks }}</div>
    </div>
    <hr />
    <div>
      <p>今日可获得</p>
      <input type="range" min="-100" max="400" step="1" v-model="rewards" />
      <span>{{ rewards }}</span>
    </div>
    <div @click="submitDiary">更新</div>
    <div>
      <div v-if="tomorrow.targets.length">明日目标已安排</div>
      <div v-else @click="addTomorrow">设定明日目标</div>
    </div>
    <UpdateDiary v-if="toUpdate" :date="toUpdate.date" :diary="toUpdate" @close="updateFinished" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Timer from '../assets/lib/Timer'

import Now from '@/components/Now'
import UpdateDiary from '@/components/UpdateDiary'

export default {
  name: 'Home',
  components: {
    Now,
    UpdateDiary,
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
.orga-aim
  ul
    padding 0
  li
    padding 4px 0
    border-top solid 1px #eee
    display flex
    justify-content space-between
    &:last-child
      border-bottom solid 1px #eee
</style>
