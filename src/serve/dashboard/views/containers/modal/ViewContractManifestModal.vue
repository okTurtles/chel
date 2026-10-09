<template lang="pug">
ModalTemplate(:title='L("Contract manifest")' icon='suitcase')
  .c-contract-id-container
    span.c-id-label.has-family-poppins contractID :
    TextToCopy.c-id-copy(:text='contract.contractID')
      .c-id-value {{ contract.contractID }}

  InfoCard(v-if='error' :heading='L("Note")') {{ error }}

  .c-code-demo-container(v-else-if='content')
    .c-code-demo-block
      .c-code-demo-label manifest
      pre.custom-pre {{ content.manifestCID }}

    .c-code-demo-block
      .c-code-demo-label head
      pre.custom-pre {{ content.head }}

    .c-code-demo-block
      .c-code-demo-label body
      pre.custom-pre {{ content.body }}

    .c-code-demo-block
      .c-code-demo-label signature
      pre.custom-pre {{ content.signature }}
</template>

<script>
import sbp from '@sbp/sbp'
import ModalTemplate from './ModalTemplate.vue'
import TextToCopy from '@components/TextToCopy.vue'
import InfoCard from '@components/InfoCard.vue'
import L from '@common/translations.js'

// head and body are JSON inside strings, so they are parsed before showing
const pretty = (value) => {
  try {
    return JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2)
  } catch {
    return String(value)
  }
}

export default {
  name: 'ViewContractManifestModal',
  components: {
    ModalTemplate,
    TextToCopy,
    InfoCard
  },
  props: {
    contract: Object,
    // Shown as is, without asking the server. The design system page uses it.
    preview: Object
  },
  data () {
    return {
      content: null,
      error: ''
    }
  },
  async created () {
    try {
      const { manifestCID, manifest } = this.preview ||
        await sbp('backend/dashboard/get', `contracts/${this.contract.contractID}/manifest`)
      this.content = {
        manifestCID,
        head: pretty(manifest.head),
        body: pretty(manifest.body),
        signature: pretty(manifest.signature)
      }
    } catch (e) {
      console.error('[dashboard] could not load the manifest', e)
      this.error = L('Could not load the manifest. The browser console has the details.')
    }
  }
}
</script>

<style lang='scss' scoped>
@use "@assets/style/_variables.scss" as *;

.c-contract-id-container {
  position: relative;
  padding-left: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0.4rem;
    background-color: $text_1;
  }

  .c-id-label {
    display: inline-block;
    margin-right: 0.4rem;
    font-weight: 600;
    font-size: $size_5;
  }

  .c-id-value {
    display: inline-block;
    max-width: 10rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    direction: rtl;
    margin-top: 2px;

    @include phone_narrow {
      max-width: 7.5rem;
    }
  }
}

.c-code-demo-block {
  position: relative;
  margin-bottom: 1.2rem;
}

.c-code-demo-label {
  display: block;
  font-weight: 600;
  font-size: $size_5;
  font-family: "Poppins";
  margin-bottom: 0.4rem;
  margin-left: 0.2rem;
}
</style>
