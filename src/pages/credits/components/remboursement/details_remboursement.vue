<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        v-if="showDialog"
        style="width: 600px; max-width: 95vw;"
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
              <div class="text-h6">Détails remboursement</div>
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

          <div class="q-px-md q-mt-md">
            <q-card
              flat
              bordered
              class="radius-none"
            >
              <q-card-section class="q-pa-none q-pa-sm">
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Folio</input-label>
                    <div class="text-details"> {{remboursement.folio }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Adherent</input-label>
                    <div class="text-details"> {{remboursement.client_str }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Num. dossier</input-label>
                    <div class="text-details"> {{remboursement.code }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Produit de crédit</input-label>
                    <div class="text-details"> {{remboursement.produit_str }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Date remboursement</input-label>
                    <div class="text-details"> {{$helper.dateBien(remboursement.created_at,false) }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Remboursement passé par</input-label>
                    <div class="text-details"> {{remboursement.agent_str }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div
            class="row  q-px-md q-py-sm scroll q-mt-sm"
            style="min-height:30vh;max-height:30vh"
          >
            <div class="col-12">
              <div class="ba overflow-hidden panel-primary">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th>N*</th>
                          <th>ECHEANCE</th>
                          <th>INTERET</th>
                          <th>CAPITAL</th>
                          <th>PENALITE</th>
                        </tr>
                      </thead>
                      <tbody style="font-size:12px;">
                        <tr
                          v-for="(row,index) in remboursement.tableau"
                          :key="index"
                        >
                          <td class="text-center text-bold">{{index + 1}}</td>
                          <td class="text-center text-bold">{{$helper.dateBien(row.date_echeance,false)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.interet_remb)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.capital_remb)}}</td>
                          <td class="text-center text-bold">{{$helper.formatMoney(row.penalite_remb)}}</td>
                        </tr>
                        <tr v-if="$helper.isNotEmpty(remboursement.tableau[0])">
                          <td
                            colspan="2"
                            class="text-left text-bold text-primary"
                          >TOTAL</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(remboursement.totaux.interet)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(remboursement.totaux.capital)}}</td>
                          <td class="text-center text-bold text-primary">{{$helper.formatMoney(remboursement.totaux.penalite)}}</td>
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
  name: 'dialogDetailsDecaissement',
  data () {
    return {
      URLS: {},

      loading: false,
      showDlgDetails: false,

      remboursement: {
        tableau: []
      }
    }
  },
  props: {
    value: Boolean,
    selectedRemboursement: {},
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
        if (this.selectedRemboursement) {
          this.remboursement = { ...this.selectedRemboursement }
        } else {
          this.remboursement = {
            tableau: []
          }
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
  methods: {}

}
</script>

<style lang="stylus"></style>
