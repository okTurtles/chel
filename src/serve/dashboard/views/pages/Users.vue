<template lang='pug'>
PageTemplate
  template(#title='') {{ L('Users') }}

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  .is-centered-on-mobile(v-else-if='live.data')
    section.c-user-stats-section
      i18n.section-title Stats

      .c-stat-cards
        StatCard(v-for='(item, index) in userStats'
          :key='item.id'
          :description='item.name'
          :stat='item.value'
          :icon='item.icon'
          :color='index % 2 === 0 ? "blue" : "purple"'
        )

    section.c-user-table
      i18n.section-title Usage by user

      .summary-list.c-user-usages
        .c-table-wrapper
          table.table.c-table
            thead
              tr
                i18n.c-th-user(tag='th') User
                i18n.c-th-owned-contracts(tag='th') Contracts owned
                i18n.c-th-owned-files(tag='th') Files owned
                i18n.c-th-space-used(tag='th') Space used
                i18n.c-th-space-share(tag='th') Share of storage
                i18n.c-th-credits(tag='th') Credits

            tbody
              tr(v-for='item in live.data' :key='item.username')
                td.c-cell-name.has-text-bold {{ item.username }}
                td.c-cell-deleted(v-if='item.deleted' colspan='5')
                  i18n.pill.is-danger(tag='span') Account deleted
                template(v-else)
                  td.c-cell-contracts-owned {{ item.ownedContracts }}
                  td.c-cell-files-owned {{ item.ownedFiles }}
                  td.c-cell-space {{ humanBytes(item.size) }}
                  td.c-cell-space-share {{ shareOf(item.size) }}
                  td.c-cell-credits(:class='{ "has-text-danger": item.picocredits.startsWith("-") }') {{ credits(item.picocredits) }}
</template>

<script>
import PageTemplate from './PageTemplate.vue'
import StatCard from '@components/StatCard.vue'
import InfoCard from '@components/InfoCard.vue'
import L from '@common/translations.js'
import liveData from '@view-utils/liveData.js'
import { credits, humanBytes } from '@view-utils/format.js'

export default {
  name: 'Users',
  mixins: [liveData('users')],
  components: {
    PageTemplate,
    StatCard,
    InfoCard
  },
  computed: {
    liveUsers () {
      return this.live.data.filter(user => !user.deleted)
    },
    totalSize () {
      return this.liveUsers.reduce((sum, user) => sum + user.size, 0)
    },
    userStats () {
      return [
        { id: 'users', name: L('Users'), value: this.liveUsers.length, icon: 'users' },
        { id: 'deleted', name: L('Deleted accounts'), value: this.live.data.length - this.liveUsers.length, icon: 'trend-down' },
        { id: 'storage', name: L('Storage used'), value: humanBytes(this.totalSize), icon: 'battery-charging' }
      ]
    }
  },
  methods: {
    credits,
    humanBytes,
    shareOf (size) {
      return this.totalSize ? `${(100 * size / this.totalSize).toFixed(1)}%` : '0%'
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@assets/style/_variables.scss" as *;

.c-stat-cards {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.c-user-usages {
  max-width: max-content;
}

.c-user-table {
  margin-top: 3rem;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-table {
  position: relative;
  height: max-content;
}

.c-th-user,
.c-cell-name {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  min-width: 8rem;
}

.c-cell-name {
  line-height: 1.4;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.c-th-owned-files,
.c-cell-files-owned,
.c-th-credits,
.c-cell-credits {
  min-width: 6.25rem;
  text-align: center;
}

.c-th-owned-contracts,
.c-cell-contracts-owned,
.c-th-space-used,
.c-cell-space {
  min-width: 8.75rem;
  text-align: center;
}

.c-th-space-share,
.c-cell-space-share {
  min-width: 9.25rem;
  text-align: center;
}

.c-cell-deleted {
  text-align: center;
}
</style>
