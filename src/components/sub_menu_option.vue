<template>
  <q-menu
    transition-show="scale"
    transition-hide="scale"
  >
    <q-list
      separator
      style="min-width: 150px"
    >
      <q-item
        v-for="(row,index) in options"
        :key="index"
      >
        <q-item-section>
          <q-radio
            v-model="selectedOption"
            :val="row"
            :label="row.label"
            v-close-popup
            @input="$emit('onOptionChanged',row)"
            :disable="row.disable"
          />
          <q-tooltip v-if="row.disable">
            Cette option a été désactivée
          </q-tooltip>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
export default {
  props: {
    value: Object,
    index: {
      type: Number,
      require: true
    },
    options: Array
  },
  beforeMount () {
    this.selectedOption = this.options[this.index]
  },
  computed: {
    selectedOption: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  }
}
</script>

<style>
</style>
