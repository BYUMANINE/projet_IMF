<template>
  <div class="full-width text-center q-py-xl row justify-center">
    <div
      class="col-a panel-primary q-pa-md"
      style="border-radius:20px;"
    >
      <!-- border:1px solid rgba(0,0,0,.08) -->
      <q-icon
        :name="icone"
        size="55px"
        class="q-mb-md"
      />
      <div
        class="text-grey"
        :style="textStyle"
        textStyle
      >
        {{title}}
        <slot />
      </div>

      <q-btn
        v-if="showBtn"
        color="blue-1"
        text-color="blue"
        :label="btnLabel"
        no-caps
        unelevated
        :icon="btnIcon"
        outline
        size="12px"
        class="q-mt-md"
        @click="$emit('actualiser')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'noDataComponent',
  props: {
    title: {
      type: String,
      default: null
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    icone: {
      type: String,
      default: 'img:statics/images/icone/searchIn.png'
    },
    textStyle: {
      type: String,
      default: 'font-size:14px'
    },
    btnLabel: {
      type: String,
      default: 'Réessayer'
    },
    btnIcon: {
      type: String,
      default: 'las la-sync'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
