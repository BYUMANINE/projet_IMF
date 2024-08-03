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
              <div class="text-h6">Détails du membre</div>
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
                  <strong class="style-tab">INFORMATIONS</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">ADRESSES & CONTACTS</strong>
                </q-tab>
                <!-- <q-tab name="3">
                  <strong class="style-tab">CONTRIBUTIONS</strong>
                </q-tab> -->
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
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** IDENTITE ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >INFORMATIONS SUR LE MEMBRE</div>
                          </div>

                        </div>
                        <q-separator />
                        <div class="q-pa-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                              <input-label>Nom</input-label>
                              <div class="text-details">{{membre.nom || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                              <input-label>Postnom</input-label>
                              <div class="text-details">{{membre.postnom || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                              <input-label>Prenom</input-label>
                              <div class="text-details">{{membre.prenom || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Sexe</input-label>
                              <div class="text-details">{{membre.sexe || 'Non défini'}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Etat civil</input-label>
                              <div class="text-details">{{membre.etat_civil || 'Non défini'}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date de naissance</input-label>
                              <div class="text-details">{{membre.date_naissance || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu de naissance</input-label>
                              <div class="text-details"> {{membre.lieu_naissance || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Profession</input-label>
                              <div class="text-details"> {{membre.profession || 'Non défini'}}</div>

                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Secteur d'activité</input-label>
                              <div class="text-details"> {{membre.secteur_str || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Autres activités</input-label>
                              <div class="text-details"> {{membre.autres_activites || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Revenu mensuel moyen ({{user.devise}})</input-label>
                              <div class="text-details"> {{membre.revenu_moyen || 'Non défini'}}</div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-12">
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="row items-center q-py-xs q-px-sm">
                              <div
                                class="col text-h6"
                                style="font-size:14px"
                              >PIECES & SIGNATURE</div>
                            </div>
                            <q-separator />
                            <div class="q-px-md q-pt-sm q-pb-md">
                              <div class="row q-col-gutter-sm">

                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Type de pièce d'identité</input-label>
                                  <div class="text-details">{{membre.type_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Numéro de la pièce</input-label>
                                  <div class="text-details">{{membre.num_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Lieu de délivrance</input-label>
                                  <div class="text-details">{{membre.lieu_delivrance || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Pièce valide jusqu'au</input-label>
                                  <div
                                    v-if="!$helper.isExpireDate(membre.expiration_piece)"
                                    class="text-details"
                                  > {{!!membre.expiration_piece ? membre.expiration_piece :'Illimité' }}</div>
                                  <div
                                    v-else
                                    class="text-details bg-red-1 text-red text-bold"
                                  >Pièce non valide
                                  </div>
                                </div>
                                <div class="col-12">
                                  <input-label>Nationalité</input-label>
                                  <div class="text-details">{{membre.nationalite || 'Non défini'}}</div>
                                </div>

                                <div class="col-12">
                                  <input-label>Signature du membre</input-label>
                                  <q-img
                                    v-if="!!membre && !!membre.signature"
                                    :src="`${URLS.IMG_SIGNATURE}/${membre.signature}`"
                                    spinner-color="blue"
                                    spinner-size="20px"
                                    class="panel-primary"
                                    contain
                                    style="height: 150px; width: 100%;border:2px dotted #5764ec"
                                  />
                                  <div
                                    v-else
                                    class="text-center q-py-md"
                                    style="height: 150px; width: 100%;border:2px dotted #5764ec"
                                  >
                                    <q-icon
                                      name="las la-signature"
                                      size="100px"
                                      color="grey-5"
                                    /> <br>
                                    <strong>Aucune signature</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="bg-transparent q-pa-none"
                >
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** ADRESSES ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >ADRESSES & CONTACTS </div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm ">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Pays</input-label>
                              <div class="text-details"> {{membre.pays || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Province</input-label>
                              <div class="text-details"> {{membre.province || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Ville </input-label>
                              <div class="text-details"> {{membre.ville || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Commune/ Territoire</input-label>
                              <div class="text-details"> {{membre.commune || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Quartier/ Groupement</input-label>
                              <div class="text-details"> {{membre.quartier || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Avenue/ Village</input-label>
                              <div class="text-details"> {{membre.avenue || 'Non défini'}}</div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** CONTACTS ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >CONTACTS</div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-12">
                              <input-label>Téléphone 1</input-label>
                              <div class="text-details"> {{membre.phone || 'Non défini'}}</div>

                            </div>

                            <div class="col-12">
                              <input-label>Adresse mail</input-label>
                              <div class="text-details"> {{membre.email || 'Non défini'}}</div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <!-- <q-tab-panel
                  name="3"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >CONTRIBUTIONS</div>
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
                            <th>ID. TRANS.</th>
                            <th
                              style="width:20%"
                              class="text-left"
                            >LIBELLE</th>
                            <th class="text-center">DEBIT</th>
                            <th class="text-center">CREDIT</th>
                            <th class="text-center">SOLDE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in (membre.transactions || [])"
                            :key="index"
                          >
                            <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="20px"
                              >
                                {{ index + 1 }}
                              </q-avatar>
                            </td>

                            <td class="text-left text-bold bg-blue-1">{{ row.code }} {{ row.postnom }} {{ row.prenom }}</td>
                            <td class="text-center">{{ row.libelle }}</td>
                            <td class="text-center">{{ row.debit }}</td>
                            <td class="text-center">{{ row.credit }}</td>
                            <td class="text-center">{{ row.solde }}</td>

                          </tr>

                          <template v-if="!membre.transaction || membre.transactions.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="9"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/historique.png"
                                  title="Aucune transaction effectué par ce membre"
                                  :showBtn="false"
                                />
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel> -->
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
  name: 'dialogDetailsMembre',
  data () {
    return {
      URLS: {},

      loading: false,

      membre: {
        transactions: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedMembre: {},
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
        this.tab = '1'

        if (this.selectedMembre) {
          this.membre = { ...this.selectedMembre }
        } else {
          this.membre = {
            transactions: []
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
