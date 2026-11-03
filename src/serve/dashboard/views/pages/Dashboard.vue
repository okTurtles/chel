<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Dashboard') }}

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  .is-centered-on-mobile(v-else-if='live.data')
    section.c-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard.c-stat-card(v-for='(item, index) in stats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-recent-and-summary
      i18n.section-title Users / Space

      .c-flex-container
        .summary-list.c-summary-list
          i18n.summary-list-label Newest users

          ul
            li.summary-list-item.c-user-list-ths
              i18n(tag='label') Name
              i18n(tag='label') Space used
            li.summary-list-item(v-for='user in live.data.newestUsers' :key='user.username')
              span {{ user.username }}
              span {{ humanBytes(user.size) }}

        .summary-list.is-outlined.c-summary-list
          i18n.summary-list-label Space usage

          ul
            li.summary-list-item(v-for='item in spaceUsage' :key='item.id')
              label {{ item.name }}
              span.c-usage-value {{ item.value }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '@components/StatCard.vue'
import InfoCard from '@components/InfoCard.vue'
import L from '@common/translations.js'
import liveData from '@view-utils/liveData.js'
import { humanBytes } from '@view-utils/format.js'

export default {
  name: 'Dashboard',
  mixins: [liveData('overview')],
  components: {
    PageTemplate,
    StatCard,
    InfoCard
  },
  computed: {
    stats () {
      const { users, contracts, storage } = this.live.data
      return [
        { id: 'users', name: L('Users'), value: users, icon: 'users' },
        { id: 'contracts', name: L('Contracts'), value: contracts, icon: 'chart-bar' },
        { id: 'storage', name: L('Storage used'), value: humanBytes(storage.total), icon: 'battery-charging' }
      ]
    },
    spaceUsage () {
      const { storage, freeAllowance } = this.live.data
      return [
        { id: 'contracts', name: L('Contracts'), value: humanBytes(storage.contracts) },
        { id: 'files', name: L('Files'), value: humanBytes(storage.files) },
        { id: 'free', name: L('Free per account'), value: humanBytes(freeAllowance) }
      ]
    }
  },
  methods: {
    humanBytes
  }
}
</script>

<style lang="scss" scoped>
@use "@assets/style/_variables.scss" as *;

.c-sections-container {
  @include phone {
    max-width: $formWidthConstraint;
    margin-left: auto;
    margin-right: auto;
  }
}

.c-stats-section {
  margin-bottom: 3.2rem;
}

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.75rem;
}

.c-user-list-ths {
  font-weight: 600;
  font-size: $size_5;
  margin-bottom: 0.25rem;
}

.c-usage-value {
  font-weight: 600;
  font-size: 1.25em;
}

.c-summary-list {
  @include phone {
    max-width: unset;
  }
}
</style>
