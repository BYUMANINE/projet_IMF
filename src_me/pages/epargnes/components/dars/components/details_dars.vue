<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
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
              <div class="text-h6">
                Détails du dépôt à terme
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
                  <strong class="style-tab">INFORMATIONS</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">INTERETS</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:60vh;max-height:65vh"
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
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ***** INFORMATIONS SUR LE BLOCAGE DARS ***** -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div class="row items-center">
                              <div class="col">
                                <div
                                  class="q-py-xs q-px-sm text-h6"
                                  style="font-size:14px"
                                >INFORMATIONS DARS <span class="text-primary">[{{dat.code}}]</span></div>
                              </div>
                              <div
                                class="col-auto q-pr-md"
                                v-if="dat"
                              >
                                <div
                                  class="q-pa-xs text-bold text-white"
                                  style="border-radius:3px;font-size:12px"
                                  :class="dat.status==='TERMINE'?'bg-green':(dat.status==='ENCOURS'?'bg-primary':'bg-red')"
                                >
                                  <q-icon
                                    size="18px"
                                    :name="dat.status==='TERMINE'?'las la-check':(dat.status==='ENCOURS'?'las la-hourglass-start':'las la-times')"
                                  />
                                  {{'DARS '+dat.status}}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-12">
                              <input-label>Adhérent</input-label>
                              <div class="text-details">{{dat.folio}} - {{dat.client_str}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Montant DARS</input-label>
                              <div class="text-details"> {{dat.montant + ' ' + dat.devise}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Echéance</input-label>
                              <div class="text-details"> {{dat.echeance}} Mois</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Taux d'interet</input-label>
                              <div class="text-details"> {{dat.taux_interet}} %</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Periodicité</input-label>
                              <div class="text-details"> {{dat.periodicite}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Intérêt Total</input-label>
                              <div class="text-details"> {{dat.interet}} {{dat.devise}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Intérêt accordé</input-label>
                              <div class="text-details"> {{dat.interet_accorde}} {{dat.devise}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Type EAT</input-label>
                              <div class="text-details"> {{dat.produit_str}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date début</input-label>
                              <div class="text-details"> {{$helper.dateBien(dat.date_debut,false)}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date fin</input-label>
                              <div class="text-details"> {{$helper.dateBien(dat.date_fin,false)}} </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Enregistrer par</input-label>
                              <div class="text-details"> {{dat.agent_str}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Compte EAV de prélèvement</input-label>
                              <div class="text-details"> {{dat.indice_compte_eav}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Compte DARS</input-label>
                              <div class="text-details"> {{dat.indice_compte_dars}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Référence transfert DARS</input-label>
                              <div
                                class="text-details"
                                @dblclick="showDetailsOperation({id_operation:dat.fk_operation_transfert  })"
                              > <span class="text-bold text-primary">{{dat.fk_operation_transfert   || 'N/A'}}</span> </div>
                              <q-tooltip>
                                Cliquer pour afficher les détails sur l'opération
                              </q-tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >INTERETS</div>
                      <div class="col-auto">
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          label="Imprimer"
                          icon-right="las la-print"
                          rounded
                          no-caps
                          size="sm"
                          v-close-popup
                          unelevated
                        />
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:58vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-center">DATE</th>
                            <th class="text-center">DEPOT</th>
                            <th class="text-center">CUMUL DEPOT</th>
                            <th class="text-center">INTERET</th>
                            <th class="text-center">CUMUL INTERET</th>
                            <th class="text-center">PAIEMENT</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in dat.interets"
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

                            <td class="text-center">{{ $helper.dateBien(row.date_echeance,false) }}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.depot)}} {{dat.devise}}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.cumul_depot)}} {{dat.devise}}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.interet)}} {{dat.devise}}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.cumul_interet)}} {{dat.devise}}</td>
                            <td class="text-center">
                              <q-icon
                                :color="row.fk_operation != null ? 'primary':'red'"
                                :name="row.fk_operation != null ? 'las la-check':'las la-times'"
                                size="16px"
                                class="q-mr-sm"
                              />
                              <strong :class="row.fk_operation != null ? 'text-primary':'text-red'">{{row.fk_operation ? 'Accordé' : 'Non accordé'}}</strong>
                            </td>

                            <!-- ************************************* -->
                            <!-- *************** MENU    ************* -->
                            <!-- ************************************* -->

                            <q-menu
                              v-if="row.id"
                              touch-position
                              context-menu
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-list
                                separator
                                style="min-width: 100px"
                              >
                                <q-item
                                  clickable
                                  v-ripple
                                  v-close-popup
                                  @click="showDetailsOperation({id_operation:row.fk_operation})"
                                >
                                  <q-item-section avatar>
                                    <q-icon
                                      class="las la-caret-square-down"
                                      size="24px"
                                      color="primary"
                                    />
                                  </q-item-section>
                                  <q-item-section>Afficher les détails de l'opération</q-item-section>
                                </q-item>

                              </q-list>
                            </q-menu>

                          </tr>
                          <template>
                            <tr class="panel-primary">
                              <td
                                colspan="2"
                                class="text-bold"
                                :style="$helper.cellEmptyImg"
                              >TOTAL</td>
                              <td class="text-bold text-center">{{$helper.formatMoney(dat.montant * dat.echeance )}} {{dat.devise}}</td>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td class="text-bold text-center">{{$helper.formatMoney(dat.interet)}} {{dat.devise}}</td>
                              <td
                                colspan="2"
                                :style="$helper.cellEmptyImg"
                              ></td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

    <detailsOperation
      v-model="showDlgDetails"
      :selectedOperation="selectedInteret"
      :user="user"
    />
  </div>

</template>

<script>
import detailsOperation from '../../../../commun/details_operation.vue'
export default {
  name: 'dialogDetailsDAT',
  data () {
    return {
      URLS: {},
      showDlgDetails: false,
      selectedInteret: null,

      dat: {
        interets: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedDars: {},
    user: {}
  },
  components: {
    detailsOperation
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.tab = '1'

        if (this.selectedDars) {
          this.dat = { ...this.selectedDars }
        } else {
          this.dat = {
            interets: []
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
  methods: {
    showDetailsOperation (row) {
      if (row.id_operation) {
        row.id = row.id_operation
        this.selectedInteret = row
        this.showDlgDetails = true
      }
    }
  }

}
</script>

<style lang="stylus"></style>
