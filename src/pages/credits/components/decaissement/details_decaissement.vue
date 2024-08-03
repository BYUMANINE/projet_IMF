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
              <div class="text-h6">Détails décaissement</div>
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
          <div class="row">
            <div class="col">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey panel-primary"
                active-color="primary"
                indicator-color="transparent"
                align="left"
                narrow-indicator
              >
                <q-tab name="1">
                  <strong class="style-tab">INFORMATIONS CREDIT</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">TABLEAU D'AMORTISSEMENT</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:60vh;max-height:75vh"
          >
            <div class="col">
              <q-tab-panels
                v-model="tab"
                animated
                style="background-color:transparent;padding:0 "
                transition-prev="fade"
                transition-next="fade"
              >
                <q-tab-panel
                  name="1"
                  class="bg-transparent q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary q-pa-sm">
                    <div class="row q-col-gutter-sm">
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Num. dossier</input-label>
                        <div class="text-details">{{decaissement.code || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Produit de crédit</input-label>
                        <div class="text-details">{{decaissement.produit_str || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Adherant</input-label>
                        <div class="text-details">{{decaissement.folio}} - {{decaissement.client_str || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Montant crédit et decaissé</input-label>
                        <div class="text-details">{{decaissement.montant || 'Non défini'}} {{decaissement.devise }}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Taux d'intérêt annuel</input-label>
                        <div class="text-details">{{decaissement.taux_interet || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Echéance</input-label>
                        <div class="text-details">{{decaissement.echeance || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Periodicité</input-label>
                        <div class="text-details">{{decaissement.periodicite || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Type amortissement</input-label>
                        <div class="text-details">{{decaissement.amortissement || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Differé</input-label>
                        <div class="text-details">{{decaissement.differe || 'Non défini'}}</div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Num. transaction</input-label>
                        <div class="text-details">{{decaissement.fk_operation || 'Non défini'}}</div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="bg-transparent q-pa-none"
                >
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
                </q-tab-panel>
              </q-tab-panels>
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

      decaissement: {
        tableau: [],
        totaux: {}
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedDecaissement: {},
    user: {},
    showEditBtn: {
      type: Boolean,
      default: true
    }
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
        if (this.selectedDecaissement) {
          this.decaissement = { ...this.selectedDecaissement }
        } else {
          this.decaissement = {
            tableau: [],
            totaux: {}
          }
        }
        this.tab = '1'
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
