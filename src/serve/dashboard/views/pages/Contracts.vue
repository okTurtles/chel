<template lang='pug'>
PageTemplate.c-page-contracts
  template(#title='') {{ L('Contracts') }}

  Dropdown.c-filter-menu(
    v-if='live.data'
    defaultItemId='all-contracts'
    :isOverlayStyle='true'
    :options='filterOptions'
    @select='onFilterSelect'
  )

  InfoCard(v-if='live.error' :heading='L("Note")') {{ live.error }}

  section.c-contracts-list-container(v-else-if='live.data')
    .summary-list.c-contracts-list
      .c-table-wrapper
        table.table.c-contract-ids-table
          thead
            tr
              i18n.c-th-contract-id(tag='th') contractID
              i18n.c-th-type(tag='th') Type
              i18n.c-th-size(tag='th') Size
              i18n.c-th-messages(tag='th') Messages
              i18n.c-th-owner(tag='th') Belongs to
              i18n.c-th-action(tag='th') Action

          tbody
            tr(v-for='item in filteredContracts' :key='item.contractID')
              td.c-cell-contract-id {{ item.contractID }}
              td.c-cell-type
                span.pill(:class='pillFor(item.type)') {{ item.type || L('Unknown') }}
              td.c-cell-size {{ humanBytes(item.size) }}
              td.c-cell-messages {{ item.messages }}
              td.c-cell-owner {{ item.name || item.ownerName || item.owner || L('None') }}
              td.c-cell-action
                i18n.is-extra-small.has-blue-background(tag='button' @click='viewManifest(item)') view
</template>

<script>
import sbp from '@sbp/sbp'
import PageTemplate from './PageTemplate.vue'
import Dropdown from '@forms/Dropdown.vue'
import InfoCard from '@components/InfoCard.vue'
import L from '@common/translations.js'
import liveData from '@view-utils/liveData.js'
import { humanBytes } from '@view-utils/format.js'
import { OPEN_MODAL } from '@view-utils/events.js'

const ALL_CONTRACTS = { id: 'all-contracts', name: L('All contracts') }
// The pill colors there are, given out to the types in sorted order
const PILLS = ['is-warning', 'is-purple-1', 'is-blue-1', 'is-green-1', 'is-neautral']

export default {
  name: 'Contracts',
  mixins: [liveData('contracts')],
  components: {
    PageTemplate,
    Dropdown,
    InfoCard
  },
  data () {
    return {
      ephemeral: {
        contractFilter: ALL_CONTRACTS
      }
    }
  },
  computed: {
    types () {
      return [...new Set(this.live.data.map(item => item.type).filter(Boolean))].sort()
    },
    filterOptions () {
      return [ALL_CONTRACTS, ...this.types.map(type => ({ id: type, name: type }))]
    },
    filteredContracts () {
      const filterId = this.ephemeral.contractFilter.id
      return this.live.data
        .filter(item => filterId === ALL_CONTRACTS.id || item.type === filterId)
    }
  },
  methods: {
    humanBytes,
    onFilterSelect (item) {
      this.ephemeral.contractFilter = item
    },
    viewManifest (item) {
      sbp('okTurtles.events/emit', OPEN_MODAL, 'ViewContractManifestModal', { contract: item })
    },
    pillFor (type) {
      const index = this.types.indexOf(type)
      return index === -1 ? 'is-neautral' : PILLS[index % PILLS.length]
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@assets/style/_variables.scss" as *;

.c-page-contracts {
  position: relative;
}

.c-filter-menu {
  position: absolute !important;
  top: 2rem;
  right: 1rem;

  ::v-deep .c-dropdown-trigger {
    min-width: 8.75rem;
  }
}

.c-contracts-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: max-content;
}

.c-table-wrapper {
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.c-contract-ids-table {
  position: relative;
  height: max-content;
}

.c-th-contract-id,
.c-cell-contract-id {
  position: sticky;
  left: 0;
  padding: 0 0.8rem 0 0.2rem;
  background-color: var(--summary-list-bg-color);
  overflow: hidden;
}

.c-cell-contract-id {
  display: block;
  max-width: 10.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;

  @include phone_narrow {
    max-width: 7.25rem;
  }
}

.c-th-type,
.c-cell-type {
  padding-left: 2.75rem;

  @include phone_narrow {
    padding-left: 1.85rem;
  }
}

.c-th-size,
.c-cell-size {
  min-width: 7.25rem;
  text-align: right;

  @include phone_narrow {
    min-width: 6.25rem;
  }
}

.c-th-messages,
.c-cell-messages {
  min-width: 11.25rem;
  text-align: center;

  @include phone_narrow {
    min-width: 9.75rem;
  }
}

.c-th-owner,
.c-cell-owner {
  min-width: 7.75rem;
  max-width: 12rem;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.c-th-action,
.c-cell-action {
  min-width: 6.75rem;
  text-align: right;
  padding-right: 0.75rem;
}
</style>
