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
              <div class="text-h6">Détails du Mandataire</div>
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
                  <strong class="style-tab">IDENTITE</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">ADRESSES & CONTACTS</strong>
                </q-tab>
                <q-tab name="3">
                  <strong class="style-tab">POUVOIRS SUR LE COMPTE</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:50vh;max-height:65vh"
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
                            >INFORMATIONS SUR LE MANDATAIRE</div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-md items-center">
                            <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                              <div class="text-center">

                                <div class=" contStylephoto">
                                  <q-img
                                    :src=" (!!mandataire.photo ?  `${URLS.IMG_MANDATAIRE}/${mandataire.photo}` :'statics/images/icone/avatar.png')"
                                    spinner-color="white"
                                    spinner-size="35px"
                                    class="stylePhoto bg-blue-1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                              <div class="row">
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Nom</input-label>
                                  <div class="text-details">{{mandataire.nom || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Postnom</input-label>
                                  <div class="text-details">{{mandataire.postnom || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Prenom</input-label>
                                  <div class="text-details">{{mandataire.prenom || 'Non défini'}}</div>
                                </div>
                              </div>

                              <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Sexe</input-label>
                                  <div class="text-details">{{mandataire.sexe || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Etat civil</input-label>
                                  <div class="text-details">{{mandataire.etat_civil || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Date de naissance</input-label>
                                  <div class="text-details">{{mandataire.date_naissance || 'Non défini'}}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row q-col-gutter-sm">

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu de naissance</input-label>
                              <div class="text-details"> {{mandataire.lieu_naissance || 'Non défini'}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Profession</input-label>
                              <div class="text-details"> {{mandataire.profession || 'Non défini'}}</div>

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
                                  <div class="text-details">{{mandataire.type_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Numéro de la pièce</input-label>
                                  <div class="text-details">{{mandataire.num_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Pièce valide jusqu'au</input-label>

                                  <div
                                    v-if="!$helper.isExpireDate(mandataire.date_expiration)"
                                    class="text-details"
                                  > {{mandataire.date_expiration || 'Non définie' }}</div>
                                  <div
                                    v-else
                                    class="text-details bg-red-1 text-red text-bold"
                                  >
                                    Pièce non valide depuis {{$helper.dateBien(mandataire.date_expiration,false) }}
                                  </div>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Nationalité</input-label>
                                  <div class="text-details">{{mandataire.nationalite || 'Non défini'}}</div>
                                </div>

                                <div class="col-12">
                                  <input-label>Signature du mandataire</input-label>
                                  <q-img
                                    v-if="!!mandataire && !!mandataire.signature"
                                    :src="`${URLS.IMG_SIGNATURE}/${mandataire.signature}`"
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
                            >ADRESSES & CONTACTS</div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm ">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Pays</input-label>
                              <div class="text-details"> {{mandataire.pays || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Province</input-label>
                              <div class="text-details"> {{mandataire.province || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Ville </input-label>
                              <div class="text-details"> {{mandataire.ville || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Commune/ Territoire</input-label>
                              <div class="text-details"> {{mandataire.commune || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Quartier/ Groupement</input-label>
                              <div class="text-details"> {{mandataire.quartier || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Avenue/ Village</input-label>
                              <div class="text-details"> {{mandataire.avenue || 'Non défini'}}</div>

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
                              <input-label>Téléphone</input-label>
                              <div class="text-details"> {{mandataire.phone || 'Non défini'}}</div>

                            </div>

                            <div class="col-12">
                              <input-label>Adresse mail</input-label>
                              <div class="text-details"> {{mandataire.email || 'Non défini'}}</div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      >POUVOIRS SUR LE COMPTE</div>
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm ">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Lien avec le mandataire</input-label>
                          <div class="text-details"> {{mandataire.relation || 'Non défini'}}</div>

                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Durée du mandat</input-label>
                          <div
                            v-if="!$helper.isExpireDate(mandataire.date_limite_mandat)"
                            class="text-details"
                          > {{!!mandataire.date_limite_mandat ? mandataire.date_limite_mandat :'Illimité' }}</div>
                          <div
                            v-else
                            class="text-details bg-red-1 text-red text-bold"
                          >Mandat expiré depuis {{$helper.dateBien(mandataire.date_limite_mandat,false)}}
                          </div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Niveau du mandat</input-label>
                          <div class="text-details"> {{mandataire.niveau_mandat || 'Non défini'}}</div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Pouvoir du mandataire sur ce compte</input-label>
                          <div class="text-details"> {{mandataire.pouvoirs.join(" ; ") || 'Non défini'}}</div>

                        </div>

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
  name: 'dialogDetailsEnfant',
  data () {
    return {
      URLS: {},

      loading: false,
      mandataire: {
        pouvoirs: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedMandataire: {},
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

        if (this.selectedMandataire) {
          this.mandataire = { ...this.selectedMandataire }
        } else {
          this.mandataire = {
            pouvoirs: []
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

<style lang="stylus">
.fixed-head .head-1 th
  position sticky
  top 0
  z-index 1000
  background-color white
</style>
