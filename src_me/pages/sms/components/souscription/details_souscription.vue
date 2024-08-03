<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 800px; max-width: 95vw;">
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
                Détails du chéquier
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
                  <strong class="style-tab">INFORMATIONS SUR LE CHEQUIER</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">LISTE DES CHEQUES</strong>
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
                    <!-- ***** INFORMATIONS SUR LE BLOCAGE CHEQUIER ***** -->
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
                                >INFORMATIONS DU CHEQUIER
                                  <span class="text-primary">[ {{chequier.code}} ]</span>
                                </div>
                              </div>
                              <div
                                class="col-auto q-pr-md"
                                v-if="chequier"
                              >
                                <div
                                  class="q-pa-xs text-bold text-white"
                                  style="border-radius:3px;font-size:12px"
                                  :class="chequier.status==='ACTIF'?'bg-green':'bg-red'"
                                >
                                  <q-icon
                                    size="18px"
                                    :name="chequier.status==='ACTIF'?'las la-check':'las la-times'"
                                  />
                                  {{'CHEQUIER '+chequier.status}}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <q-separator />
                        <div class="q-pa-md ">
                          <div class="row q-col-gutter-sm">
                            <div class="col-12">
                              <div class="row q-col-gutter-md items-center">
                                <div
                                  v-if="chequier.photo"
                                  class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto"
                                >
                                  <div class="text-center">
                                    <div class=" contStylephoto">
                                      <q-img
                                        :src=" (!!chequier && !!chequier.photo ?  `${URLS.IMG_MEMBRE}/${chequier.photo}` :'statics/images/icone/avatar.png')"
                                        spinner-color="white"
                                        spinner-size="35px"
                                        class="stylePhoto bg-blue-1"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Adhérent</input-label>
                                      <div class="text-details"> {{chequier.client_str}}</div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Code adhérent</input-label>
                                      <div class="text-details"> {{chequier.folio }}</div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>REF CHEQUIER</input-label>
                                      <div class="text-details"> {{chequier.code}}</div>
                                    </div>
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>PLAGE</input-label>
                                      <div class="text-details"> {{chequier.num_min +' à  '+ chequier.num_max}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>NOMBRES DES CHEQUES</input-label>
                              <div class="text-details"> {{chequier.nombre}} chèques</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>CHEQUES UTILISES</input-label>
                              <div class="text-details"> {{chequier.nb_cheques_utilises}} chèques</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>RESTE A UTILISER</input-label>
                              <div class="text-details"> {{chequier.nombre - chequier.nb_cheques_utilises}} chèques</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>DATE D'EMISSION</input-label>
                              <div class="text-details"> {{$helper.dateBien(chequier.created_at,false)}}</div>
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
                      >CHEQUES</div>
                      <div class="col-auto">
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          label="Imprimer"
                          icon-right="las la-print"
                          rounded
                          no-caps
                          size="12px"
                          v-close-popup
                          unelevated
                        />
                      </div>
                    </div>
                    <q-separator />
                    <div class="q-px-sm">
                      <q-input
                        square
                        borderless
                        dense
                        hide-bottom-space
                        v-model.trim="search"
                        placeholder="Recherche"
                        lazy-rules
                      >
                        <template #prepend>
                          <q-icon name="las la-search" />
                        </template>
                        <template
                          v-if="!!search"
                          #append
                        >
                          <q-btn
                            flat
                            round
                            color="white"
                            text-color="black"
                            icon="close"
                            size="sm"
                            @click="search=null"
                          />
                        </template>
                      </q-input>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-center">NUM. CHEQUE</th>
                            <th class="text-center">DATE EMISSION</th>
                            <th class="text-center">DATE UTILISATION</th>
                            <th class="text-center">BENEFICIAIRE</th>
                            <th class="text-center">MONTANT</th>
                            <th class="text-center">OPERATION</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in filterCheques"
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

                            <td :class="`text-center text-bold relative-position ${row.id_operation != null ?'bg-green-2':'bg-green-1'}`">
                              <q-avatar
                                v-if="row.id_operation"
                                color="green"
                                size="15px"
                                style="position:absolute;top:10px;left:10px"
                              >
                                <q-icon
                                  name="las la-check"
                                  color="white"
                                  size="11px"
                                />
                              </q-avatar>
                              {{ row.numero }}
                            </td>
                            <td class="text-center">{{ $helper.dateBien(chequier.created_at,false) }}</td>
                            <td class="text-center">{{ $helper.dateBien(row.date_utilisation,false) || '---' }}</td>
                            <td class="text-center">{{ row.initiateur || '---' }}</td>
                            <td class="text-center">{{ row.montant || '---' }} {{ row.devise || '' }}</td>
                            <td class="text-center">{{ row.id_operation || '---' }}</td>
                            <!-- ************************************* -->
                            <!-- *************** MENU    ************* -->
                            <!-- ************************************* -->

                            <q-menu
                              v-if="row.id_operation"
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
                                  v-if="row.id_operation"
                                  clickable
                                  v-ripple
                                  v-close-popup
                                  @click="showDetailsChequier(row)"
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
      :selectedOperation="selectedCheque"
      :user="user"
    />
  </div>

</template>

<script>
import detailsOperation from '../../../commun/details_operation.vue'
export default {
  name: 'dialogDetailsChequier',
  data () {
    return {
      URLS: {},
      showDlgDetails: false,
      selectedCheque: null,

      chequier: {
        interets: { data: [], total: {} }
      },
      tab: '1',
      search: null
    }
  },
  props: {
    value: Boolean,
    selectedChequier: {},
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
        if (this.selectedChequier) {
          this.search = null
          this.chequier = { ...this.selectedChequier }
        } else {
          this.search = null
          this.chequier = {
            cheques: []
          }
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    filterCheques () {
      if (this.$helper.isEmpty(this.search)) return this.chequier.cheques

      return this.chequier.cheques.filter(e => e.numero.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    }
  },
  methods: {
    showDetailsChequier (row) {
      if (row.id_operation) {
        this.selectedCheque = { id: row.id_operation }
        this.showDlgDetails = true
      }
    }
  }

}
</script>

<style></style>
