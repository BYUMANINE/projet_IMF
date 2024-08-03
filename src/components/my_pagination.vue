<template>
  <div class="row items-center q-pa-md">
    <div class="col-auto">
      <div class="q-py-xs q-px-sm  bg-blue-1 text-primary ba cursor-pointer">
        <div class="row items-center q-col-gutter-sm">
          <div class="col">
            <span class="text-bold">Par page | </span>
          </div>
          <div class="col-auto">
            <strong>{{peerPage}}</strong>
          </div>
        </div>
        <q-menu
          transition-show="scale"
          transition-hide="scale"
          anchor="center end"
          self="bottom middle"
        >
          <q-list
            v-for="(row,index) in pages"
            :key="index"
          >
            <q-item
              :class="row === peerPage ? 'bg-blue-1 text-primary text-bold':''"
              clickable
              v-close-popup
              @click="peerPage = row;$emit('onPaginate',true)"
            >
              <q-item-section>{{row}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
    <div class="col">
      <div :class="`myPagination ${idPagination} q-px-lg q-py-md row justify-end panel-primary`">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'compPagination',
  props: {
    value: String,
    pages: {
      type: Array,
      default: () => ['10', '20', '50', '80', '100', '150', '200']
    },
    idPagination: {
      type: String,
      default: ''
    }
  },
  computed: {
    peerPage: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  }
}
</script>

<style></style>
