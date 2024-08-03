<template>
  <q-dialog
    v-model="showDialogPrint"
    persistent
  >
    <q-card style="border-radius:10px">
      <q-card-section style="min-width:450px">
        <div class="row">
          <div class="col">
            <div class="text-h6">Colonnes à exporter</div>
          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              round
              color="blue-1"
              text-color="blue"
              size="sm"
              icon="close"
              v-close-popup
              @click="$emit('onClose')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list
          separator
          bordered
          dense
          class="scroll"
          style="border-radius:10px;max-height:50vh;"
        >
          <q-item
            v-for="(row,index) in data"
            :key="index"
            v-show="!row.disable"
          >
            <q-item-section>
              <q-checkbox
                v-model="row.value"
                :label="row.label"
                :disable="row.disable"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section align="right">
        <q-btn
          :disable="!_isNotEmpty"
          label="Lancer l'exportation"
          no-caps
          color="blue-1"
          text-color="primary"
          rounded
          unelevated
          size="12px"
          class="q-mr-sm"
          @click="onFilterSubmit()"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'filter_print_columns',
  data () {
    return {
      showDialogPrint: true
    }
  },
  props: ['data'],
  beforeMount () { },
  computed: {
    _isNotEmpty () {
      let t = 0
      if (this.data) {
        for (let key in this.data) {
          if (this.data[key].value) {
            t += 1
          }
        }

        return t > 0
      }
      return false
    }
  },
  methods: {
    onFilterSubmit () {
      this.$emit('onExport', this.data)
      this.$emit('onClose')
    }
  }
}
</script>

<style>
</style>
