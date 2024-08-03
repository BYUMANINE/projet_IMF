<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">
              <q-icon
                name="las la-filter"
                color="primary"
              />
              Interets sur DARS
            </div>
          </div>

          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              icon="close"
              round
              size="sm"
              v-close-popup
              unelevated
            />
          </div>
        </div>
        <q-separator />

        <div
          class="row  q-px-md q-py-sm scroll "
          style="max-height:80vh"
        >
          <div class="col">
            <div class="ba overflow-hidden panel-primary">
              <div class="row items-center q-py-xs q-px-sm">
                <div
                  class="col text-h6"
                  style="font-size:14px"
                >ECHEANCIER DE DEPOT</div>

              </div>
              <q-separator />
              <div
                class="scroll"
                style="min-height:30vh"
              >
                <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th class="text-center">ECHEANCE</th>
                      <th class="text-center">DEPOT</th>
                      <th class="text-center">CUMUL DEPOT</th>
                      <th class="text-center">INTERET</th>
                      <th class="text-center">CUMUL INTERET</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row, index) in data.interets"
                      :key="index"
                    >
                      <td class="text-center">
                        <q-avatar
                          color="primary"
                          text-color="white"
                          size="20px"
                        >
                          {{ index + 1 }}
                        </q-avatar>
                      </td>
                      <td class="text-center text-bold bg-blue-1">{{ $helper.dateBien(row.date_echeance,false)  }}</td>
                      <td class="text-center">{{ $helper.formatMoney(row.depot)}} {{devise}}</td>
                      <td class="text-center">{{ $helper.formatMoney(row.cumul_depot)}} {{devise}}</td>
                      <td class="text-center">{{ $helper.formatMoney(row.interet)}} {{devise}}</td>
                      <td class="text-center">{{ $helper.formatMoney(row.cumul_interet)}} {{devise}}</td>
                    </tr>

                    <template>
                      <tr class="panel-primary">
                        <td
                          colspan="2"
                          class="text-bold"
                          :style="$helper.cellEmptyImg"
                        >TOTAL</td>
                        <td class="text-bold text-center">{{$helper.formatMoney(data.total_depot)}} {{devise}}</td>
                        <td :style="$helper.cellEmptyImg"></td>
                        <td class="text-bold text-center">{{$helper.formatMoney(data.total_interet)}} {{devise}}</td>
                        <td :style="$helper.cellEmptyImg"></td>
                      </tr>
                    </template>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'AfficherInteret',
  data () {
    return {

    }
  },
  props: {
    value: Boolean,
    data: {},
    devise: null
  },
  beforeMount () { },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {

      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {}
}
</script>

<style lang="stylus"></style>
