<template>
  <nav
    class="q-pa-none q-ma-none cursor-pointer"
    @click="sortList()"
  >
    <div class="row q-col-gutter-xs">
      <div class="col">{{label}}</div>
      <div class="col-auto">
        <q-icon
          color="primary"
          size="17px"
          :name="sorting === 'none' ? 'las la-sort' : (sorting === 'ASC' ? 'las la-sort-alpha-down' : 'las la-sort-alpha-up-alt')"
        />
      </div>
    </div>
  </nav>

</template>

<script>
export default {
  data () {
    return {
      sorting: 'none'
    }
  },
  props: {
    label: { type: String, default: null },
    name: { type: String, default: null, required: true },
    value: {}
  },
  computed: {
    filters: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    sortList () {
      this.sorting = this.sorting === 'none'
        ? 'ASC'
        : (this.sorting === 'ASC'
          ? 'DESC'
          : 'ASC')

      this.$vue.set(this.filters, `${this.name}`, `${this.name} ${this.sorting}`)
    }
  }
}
</script>

<style></style>
