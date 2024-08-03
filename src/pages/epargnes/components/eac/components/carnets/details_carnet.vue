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
              <div class="text-h6">Détails du carnet </div>
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
                  <strong class="style-tab">ECHEANCES</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:50vh;max-height:90vh"
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
                    <!-- ***** INFORMATIONS SUR EAC ***** -->
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
                                >INFORMATIONS EAC [ <span class="text-primary">{{carnet.code}}</span> ]</div>
                              </div>
                              <div
                                class="col-auto q-pr-md"
                                v-if="carnet"
                              >
                                <div
                                  class="q-pa-xs text-bold text-white"
                                  style="border-radius:3px;font-size:12px"
                                  :class="carnet.status==='TERMINE' || carnet.status==='RETIRE'?'bg-green':(carnet.status==='ENCOURS'?'bg-primary':'bg-red')"
                                >
                                  <q-icon
                                    size="18px"
                                    :name="carnet.status==='TERMINE' || carnet.status==='RETIRE'?'las la-check':(carnet.status==='ENCOURS'?'las la-hourglass-start':'las la-times')"
                                  />
                                  {{'CARNET '+carnet.status}}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <q-separator />
                        <div
                          style="min-height:45vh;max-height:58vh"
                          class="scroll q-px-md q-pt-sm q-pb-md"
                        >
                          <div class="row q-col-gutter-sm items-center">
                            <div class="col-12">
                              <div class="row q-col-gutter-md items-center">
                                <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                                  <div class="text-center">
                                    <div class=" contStylephoto">
                                      <q-img
                                        :src=" (!!carnet && !!carnet.photo ?  `${URLS.IMG_MEMBRE}/${carnet.photo}` :'statics/images/icone/avatar.png')"
                                        spinner-color="white"
                                        spinner-size="35px"
                                        class="stylePhoto bg-blue-1"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-12">
                                      <input-label>Nom complet du membre</input-label>
                                      <div class="text-details"> {{carnet.client_str}}</div>
                                    </div>
                                    <div class="col-12">
                                      <input-label>Collecteur</input-label>
                                      <div class="text-details"> {{carnet.collecteur_str}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Type EAC</input-label>
                              <div class="text-details"> {{carnet.produit_str}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Intitulé du compte</input-label>
                              <div class="text-details"> {{carnet.intitule}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Numéro de compte</input-label>
                              <div class="text-details row items-center">
                                <div class="col">{{carnet.indice}}</div>
                                <div class="col-auto">
                                  <q-btn
                                    color="blue-1"
                                    text-color="primary"
                                    icon="las la-copy"
                                    unelevated
                                    round
                                    size="sm"
                                    @click="$helper.copy(carnet.indice)"
                                  >
                                    <q-tooltip>
                                      Copier le numéro du compte
                                    </q-tooltip>
                                  </q-btn>
                                </div>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Mise journalière</input-label>
                              <div class="text-details"> {{carnet.mise + ' ' + carnet.devise}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date d'ouverture</input-label>
                              <div class="text-details"> {{$helper.dateBien(carnet.date_ouverture,false)}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date de fermeture</input-label>
                              <div class="text-details"> {{$helper.dateBien(carnet.date_fermeture,false)}} </div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Référence achat carnet</input-label>
                              <div
                                class="text-details"
                                @dblclick="showDetailsOperation({id_operation:carnet.fk_operation_frais})"
                              > <span class="text-bold text-primary">{{carnet.fk_operation_frais || 'N/A'}}</span> </div>
                              <q-tooltip>
                                Cliquer pour afficher les détails sur l'opération
                              </q-tooltip>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Référence retrait carnet</input-label>
                              <div
                                class="text-details"
                                @dblclick="showDetailsOperation({id_operation:carnet.fk_operation_retrait})"
                              > <span class="text-bold text-primary">{{carnet.fk_operation_retrait || 'N/A'}}</span> </div>
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
                      >ECHEANCES DU CARNET</div>
                      <div class="col-auto">
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          label="Imprimer l'échéancier"
                          icon-right="las la-print"
                          rounded
                          no-caps
                          size="11px"
                          v-close-popup
                          unelevated
                        />
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="min-height:45vh;max-height:58vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-left">ECHEANCE</th>
                            <th class="text-center">MISE</th>
                            <th class="text-center">TOTAL A DEPOSER</th>
                            <th class="text-center">RESTE A DEPOSER</th>
                            <th class="text-center">ETAT</th>
                            <th class="text-center">OPERATION</th>
                          </tr>
                        </thead>

                        <tbody
                          style="font-size:12px"
                          v-if="carnet.echeances"
                        >
                          <tr
                            v-for="(row, index) in carnet.echeances"
                            :key="index"
                            @dblclick="row.fk_operation_depot ? showDetailsOperation({id_operation:row.fk_operation_depot}) : null"
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
                            <td class="text-left text-bold bg-blue-1">{{ $helper.dateBien(row.date_echeance,false)}}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.mise)+ ' ' + carnet.devise}}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.cumul) + ' ' + carnet.devise }}</td>
                            <td class="text-center">{{ $helper.formatMoney(row.reste_depot) + ' ' + carnet.devise }}</td>
                            <td class="text-center">
                              <q-icon
                                :color="row.fk_operation_depot != null ? 'primary':'red'"
                                :name="row.fk_operation_depot != null ? 'las la-check':'las la-times'"
                                size="16px"
                                class="q-mr-sm"
                              />
                              <strong :class="row.fk_operation_depot != null ? 'text-primary':'text-red'">{{row.fk_operation_depot ? 'Déposé' : 'Non déposé'}}</strong>
                            </td>
                            <td class="text-center">{{ row.fk_operation_depot || '---' }}</td>

                            <!-- ************************************* -->
                            <!-- *************** MENU    ************* -->
                            <!-- ************************************* -->
                            <q-tooltip v-if="row.fk_operation_depot">
                              Click droit pour afficher les détails de l'opération de dépôt
                            </q-tooltip>
                            <q-menu
                              v-if="row.fk_operation_depot"
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
                                  @click="showDetailsOperation({id_operation:row.fk_operation_depot})"
                                >
                                  <q-item-section avatar>
                                    <q-icon
                                      class="las la-caret-square-down"
                                      size="24px"
                                      color="primary"
                                    />
                                  </q-item-section>
                                  <q-item-section>Afficher les détails de l'opération de depot</q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </tr>
                          <tr v-if="carnet.totaux">
                            <td
                              colspan="2"
                              class="text-bold"
                            >TOTAL</td>
                            <td class="text-center text-bold">{{$helper.formatMoney(carnet.totaux.mise) +' '+carnet.devise}}</td>
                            <td class="text-center text-bold">{{$helper.formatMoney(carnet.totaux.depot) +' '+carnet.devise}}</td>
                            <td
                              colspan="3"
                              :style="$helper.cellEmptyImg"
                            ></td>
                          </tr>
                          <tr
                            v-if="carnet.totaux"
                            @dblclick="carnet.fk_operation_retrait ? showDetailsOperation({id_operation:carnet.fk_operation_retrait}) : null"
                          >
                            <td
                              colspan="3"
                              class="text-bold"
                            >{{carnet.fk_operation_retrait ? 'MONTANT RETIRE' : 'MONTANT A RETIRER'}}</td>
                            <td
                              colspan="1"
                              class="text-center text-bold"
                            >
                              <q-avatar
                                v-if="carnet.fk_operation_retrait"
                                color="green"
                                size="15px"
                              >
                                <q-icon
                                  name="las la-check"
                                  color="white"
                                  size="11px"
                                />
                              </q-avatar>
                              {{$helper.formatMoney(carnet.totaux.a_retirer) +' '+carnet.devise}}
                            </td>
                            <td
                              colspan="3"
                              :style="$helper.cellEmptyImg"
                            ></td>

                          </tr>

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
      :selectedOperation="selectedOperationDepot"
      :user="user"
    />
  </div>

</template>

<script>
import detailsOperation from '../../../../../commun/details_operation.vue'
export default {
  name: 'dialogDetailsEAC',
  data () {
    return {
      URLS: {},
      showDlgDetails: false,
      selectedOperationDepot: null,

      carnet: {
        echeances: [],
        totaux: {}
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedCarnet: {},
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
        if (this.selectedCarnet) {
          this.carnet = { ...this.selectedCarnet }
        } else {
          this.carnet = {
            echeances: [],
            totaux: {}
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
        this.selectedOperationDepot = row
        this.showDlgDetails = true
      }
    }
  }

}
</script>

<style lang="stylus"></style>
