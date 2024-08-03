<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 900px; max-width: 95vw;">
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
              <div class="text-h6">Détails de l'Agence [{{agence.id}}] </div>
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
                  <strong class="style-tab">COMPTES DE LIAISON AVEC D'AUTRES AGENCES</strong>
                </q-tab>
                <q-tab name="3">
                  <strong class="style-tab">COMPTES DE LIAISON DANS D'AUTRES AGENCES</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div class="row  q-px-md q-py-sm ">
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
                    <!-- ***** INFORMATIONS SUR L'AGENCE ***** -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >INFORMATIONS AGENCE </div>
                          </div>
                        </div>
                        <q-separator />
                        <div
                          class="q-px-md q-pt-sm q-pb-md scroll"
                          style="height:60vh"
                        >

                          <div class="row q-col-gutter-md">
                            <div class="col-12">
                              <input-label>Appellation</input-label>
                              <div class="text-details">{{agence.designation || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Adresse physique</input-label>
                              <div class="text-details">{{agence.adresse || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Téléphone</input-label>
                              <div class="text-details">{{agence.phone || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>E-mail</input-label>
                              <div class="text-details">{{agence.email || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nombre des membres</input-label>
                              <div class="text-details">{{agence.nb_membres || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nombre des groupes</input-label>
                              <div class="text-details">{{agence.nb_groupes || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nombre des entreprises</input-label>
                              <div class="text-details">{{agence.nb_entreprises || 'Non défini'}}</div>
                            </div>
                            <div class="col">
                              <input-label>Nombre des agents</input-label>
                              <div class="text-details">{{agence.nb_agents || 'Non défini'}}</div>
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
                      >COMPTES DE LISAISONS AVEC D'AUTRES AGENCES</div>
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
                    <div
                      class="scroll"
                      style="height:60vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-left">INDICE</th>
                            <th class="text-left">INTITULE</th>
                            <th class="text-center">DEVISE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in agence.comptesInterInAgence"
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
                            <td class="text-left text-bold bg-blue-1">{{ row.indice }}</td>
                            <td class="text-left">{{ row.intitule }}</td>
                            <td class="text-center">{{ row.devise }}</td>

                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="3"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >COMPTES DES LISAISONS DANS D'AUTRES AGENCES</div>
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
                    <div
                      class="scroll"
                      style="height:60vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-left">INDICE</th>
                            <th class="text-left">INTITULE</th>
                            <th class="text-center">DEVISE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in agence.comptesInterOutAgence"
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
                            <td class="text-left text-bold bg-blue-1">{{ row.indice }}</td>
                            <td class="text-left">{{ row.intitule }}</td>
                            <td class="text-center">{{ row.devise }}</td>

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
  </div>

</template>

<script>
export default {
  name: 'dialogDetailsDAT',
  data () {
    return {
      URLS: {},
      showDlgDetails: false,
      selectedInteret: null,

      agence: {
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedAgence: {},
    user: {}
  },
  components: {
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
        if (this.selectedAgence) {
          this.agence = { ...this.selectedAgence }
        } else {
          this.agence = {
            interets: { data: [], total: {} }
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
    removeGlm (v) {
      return v ? v.replace(/"/g, '') : 'Par défaut'
    }
  }

}
</script>

<style lang="stylus">
.fixed-head .head-1 th
  position sticky
  top 0
  z-index 1000
  background-color white
</style>
