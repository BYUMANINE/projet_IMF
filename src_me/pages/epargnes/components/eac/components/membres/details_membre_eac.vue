<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        v-if="showDialog"
        style="width: 1200px; max-width: 95vw;"
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
              <div class="text-h6">Détails du membre [ <span class="text-primary">{{membre.folio}}</span> ]</div>
            </div>
            <div
              class="col-auto"
              v-if="showEditBtn"
            >
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Modifier les infos"
                icon-right="las la-pen"
                rounded
                no-caps
                size="12px"
                v-close-popup
                unelevated
                @click="$emit('edit',selectedMembre)"
              />
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
                <q-tab name="3">
                  <strong class="style-tab">COMPTES</strong>
                </q-tab>
                <q-tab name="4">
                  <strong class="style-tab">RELEVES</strong>
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
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** IDENTITE ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >INFORMATIONS SUR LE MEMBRE <span
                                class="text-primary"
                                v-if="membre.folio"
                              >[ {{membre.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="membre.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(membre.folio)"
                            >
                              <q-tooltip>
                                Copier le code du membre
                              </q-tooltip>

                            </q-btn>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-md items-center">
                            <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                              <div class="text-center">

                                <div class=" contStylephoto">
                                  <q-img
                                    :src=" (!!membre.photo ?  `${URLS.IMG_MEMBRE}/${membre.photo}` :'statics/images/icone/avatar.png')"
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
                              </div>

                              <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Sexe</input-label>
                                  <div class="text-details">{{membre.sexe || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Etat civil</input-label>
                                  <div class="text-details">{{membre.etat_civil || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Date de naissance</input-label>
                                  <div class="text-details">{{membre.date_naissance || 'Non défini'}}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row q-col-gutter-sm">

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu de naissance</input-label>
                              <div class="text-details"> {{membre.lieu_naissance || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Profession</input-label>
                              <div class="text-details"> {{membre.profession || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nombre d'enfants</input-label>
                              <div class="text-details"> {{membre.nb_enfant || 'Non défini'}}</div>

                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Secteur d'activité</input-label>
                              <div class="text-details"> {{membre.secteur_str || 'Non défini'}}</div>

                            </div>

                            <div class="col-12">
                              <input-label>Revenu mensuel moyen ({{user.devise}})</input-label>
                              <div class="text-details"> {{membre.revenu_moyen || 'Non défini'}}</div>

                            </div>
                            <div class="col-12">
                              <input-label>Autres activités</input-label>
                              <div class="text-details"> {{membre.autres_activites || 'Non défini'}}</div>

                            </div>
                            <div class="col-12">
                              <input-label>Lieu d'activité</input-label>
                              <div class="text-details"> {{membre.lieu_activite || 'Non défini'}}</div>

                            </div>
                            <div class="col-12">
                              <input-label>Propriétaire d'autres comptes ailleurs ?</input-label>
                              <div class="text-details"> {{membre.autres_banques || 'Non défini'}}</div>

                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="row items-center q-py-xs q-px-sm">
                              <div
                                class="col text-h6"
                                style="font-size:14px"
                              >PIECES</div>
                            </div>
                            <q-separator />
                            <div class="q-px-md q-pt-sm q-pb-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label>N° d'impôt</input-label>
                                  <div class="text-details">{{membre.numero_impot || 'Non défini'}}</div>
                                </div>

                                <div class="col-12">
                                  <input-label>Type de pièce d'identité</input-label>
                                  <div class="text-details">{{membre.type_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-12">
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
                                  > {{membre.expiration_piece || 'Non définie' }}</div>
                                  <div
                                    v-else
                                    class="text-details bg-red-1 text-red text-bold"
                                  >
                                    Pièce non valide depuis {{membre.expiration_piece }}
                                  </div>
                                </div>
                                <div class="col-12">
                                  <input-label>Nationalité</input-label>
                                  <div class="text-details">{{membre.nationalite || 'Non défini'}}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="row items-center q-py-xs q-px-sm">
                              <div
                                class="col text-h6"
                                style="font-size:14px"
                              >SIGNATURE</div>
                            </div>
                            <q-separator />
                            <div class="q-mt-none q-px-md q-pb-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label>Signature membre</input-label>
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
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >ADRESSES </div>
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
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>N° maison/immeuble</input-label>
                              <div class="text-details"> {{membre.num_maison || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Type de menage</input-label>
                              <div class="text-details"> {{membre.type_menage || 'Non défini'}}</div>

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
                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
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
                              <input-label>Téléphone 2</input-label>
                              <div class="text-details"> {{membre.phone2 || 'Non défini'}}</div>

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
                <q-tab-panel
                  name="3"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >COMPTES</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table ba-outer head-bold table-striped table-colored-head">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th colspan="2">COMPTE</th>
                            <th class="text-left">INTITULE</th>
                            <th class="text-left">TYPE</th>
                            <th
                              class="text-center"
                              colspan="2"
                            >SOLDE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <template v-for="(row0,key0,index0) in membre.comptes_grp">
                            <tr :key="'cmpt0'+index0">
                              <td
                                colspan="7"
                                class="text-bold text-primary bg-blue-1"
                              >{{key0}}</td>
                            </tr>
                            <tr
                              v-for="(row,index) in row0"
                              :key="index0+'cmpt'+index"
                              @dblclick="selectedCompte = row; tab = '4'"
                            >
                              <td class="text-center">
                                <q-avatar
                                  color="primary"
                                  text-color="white"
                                  size="22px"
                                >{{index+1}}</q-avatar>
                              </td>
                              <td
                                class="text-bold text-center"
                                style="width:45px"
                              >
                                {{row.devise}}
                              </td>
                              <td class="text-center text-bold">
                                <div class="row">
                                  <div
                                    class="col-auto"
                                    v-if="row.id_produit==null"
                                  >
                                    <q-icon
                                      name="las la-lock"
                                      size="15px"
                                      color="red"
                                    />
                                  </div>
                                  <div class="col">{{row.indice}}</div>
                                </div>
                              </td>
                              <td class="text-bold">{{row.designation}}</td>
                              <td>{{removeGlm(row.type_epargne)}}</td>
                              <td class="text-center text-bold bg-blue-1">
                                S{{row.solde.solde.solde}}
                              </td>
                              <td class="text-right text-bold">
                                {{$helper.formatMoney(row.solde.solde.montant)}} <span class="text-primary">{{row.devise}}</span>
                              </td>

                              <!-- ************************************* -->
                              <!-- *************** MENU    ************* -->
                              <!-- ************************************* -->

                              <q-menu
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
                                    @click="selectedCompte = row; tab = '4'"
                                  >
                                    <q-item-section avatar>
                                      <q-icon
                                        class="las la-caret-square-down"
                                        size="24px"
                                        color="primary"
                                      />
                                    </q-item-section>
                                    <q-item-section>Afficher le relevé relatif à ce compte</q-item-section>
                                  </q-item>
                                </q-list>
                              </q-menu>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="4"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >RELEVES DE COMPTE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:65vh"
                    >
                      <relevesCompte
                        :selectedCompte="selectedCompte"
                        :membre="selectedMembre"
                      />
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
import relevesCompte from '../../../../../clients/components/membres/components/membre/releves_compte.vue'

export default {
  name: 'dialogDetailsMembre',
  data () {
    return {
      URLS: {},

      loading: false,
      showDlgDetails: false,

      selectedCompte: null,

      membre: {
        comptes: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedMembre: {},
    user: {},
    showEditBtn: {
      type: Boolean,
      default: true
    }
  },
  components: {
    relevesCompte
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
        if (this.selectedMembre) {
          this.membre = { ...this.selectedMembre }
        } else {
          this.membre = {
            comptes: []
          }
        }
        this.selectedCompte = null
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
