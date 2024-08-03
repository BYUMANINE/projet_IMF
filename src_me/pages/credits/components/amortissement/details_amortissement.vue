<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        v-if="showDialog"
        style="width: 900px; max-width: 95vw;"
      >
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon
                name="info"
                size="sm"
                color="primary"
              />
            </div>
            <div class="col">
              <div class="text-h6">Tableau d'amortissement</div>
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
          <linearLoading :loading="loading" />
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:60vh;max-height:75vh"
          >
            <div class="col">
              <div class="ba overflow-hidden panel-primary">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th rowspan="2">N*</th>
                          <th colspan="5">ECHEANCIER</th>
                          <th colspan="5">REMBOURSEMENT</th>
                        </tr>
                        <tr>
                          <th>ECHEANCE</th>
                          <th>INTERET</th>
                          <th>CAPITAL</th>
                          <th>MENSUALITE</th>
                          <th>CAP R. DU</th>
                          <th>TOT. REMBOURSE</th>
                          <th>REMB. INT.</th>
                          <th>REMB. CAP.</th>
                          <th>REMB. MENS.</th>
                          <th>RESTE</th>
                        </tr>
                      </thead>
                      <tbody style="font-size:12px;">
                        <tr
                          v-for="(row,index) in decaissement.tableau"
                          :key="index"
                        >
                          <td class="text-center text-bold">{{index + 1}}</td>
                          <td class="text-center text-bold">{{$helper.dateBien(row.date_echeance,false)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.interet)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.capital)}}</td>
                          <td class="text-center text-bold text-primary bg-blue-1">{{$helper.formatMoney(row.mensualite)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.capital_restant)}}</td>
                          <td
                            class="text-center text-bold"
                            :class="row.total_rembourse =='NON'?'text-red':'text-blue'"
                          >{{row.total_rembourse}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.interet_remb)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.capital_remb)}}</td>
                          <td class="text-center text-bold text-primary bg-blue-1">{{$helper.formatMoney(row.mensualite_remb)}}</td>
                          <td class="text-center text-bold text-primary bg-blue-1">{{$helper.formatMoney(row.reste_remb)}}</td>
                        </tr>
                        <tr v-if="decaissement.totaux">
                          <td
                            colspan="2"
                            class="text-left text-bold text-primary"
                          >TOTAL</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.interet)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.capital)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.mensualite)}}</td>
                          <td class="text-center text-bold text-primary">-</td>
                          <td class="text-center text-bold text-primary">-</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.interet_remb)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.capital_remb)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.mensualite_remb)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(decaissement.totaux.reste_remb)}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogDetailsAmortissement',
  data () {
    return {
      URLS: {},

      loading: false,
      decaissement: {
        tableau: [],
        totaux: {}
      }
    }
  },
  props: {
    value: Boolean,
    selectedAmortissement: null,
    user: {}

  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedAmortissement) {
          this.getDatas()
        } else {
          this.showDialog = false
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    getDatas (row) {
      const donnees = JSON.stringify({
        id_decaissement: this.selectedAmortissement.id_decaissement
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Amortissement/getTableauAmortissementDetails/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.decaissement = infos.data.records
          } else {
            this.viderChamps()
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.viderChamps()
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },
    viderChamps () {
      this.decaissement = {
        tableau: [],
        totaux: {}
      }
    }
  }

}
</script>

<style lang="stylus"></style>
