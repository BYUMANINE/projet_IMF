<template>
  <q-option-group
    :options="options"
    type="checkbox"
    v-model="selectedOptions"
    @input="onSelected"
  />
</template>

<script>
export default {
  name: 'checkBoxGroup',
  data () {
    return {
      selectedOptions: []
    }
  },
  props: {
    value: Array,
    options: {
      type: Array,
      default: null
    }
  },
  watch: {},
  computed: {
    selected: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  beforeMount () {
    if (this.selected) {
      this.selectedOptions = this.selected.map(e => e.value)
    }
  },
  methods: {
    onSelected (e) {
      this.selected = e.map(e => {
        return this.options.find(e1 => e1.value === e)
      })
      this.$emit('onSelected', this.selected)
    }

  }
}
</script>

<style></style>
