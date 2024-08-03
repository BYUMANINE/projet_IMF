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
              <div class="text-h6">Détails du collecteur [ {{collecteur.folio}} ]</div>
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
                  <strong class="style-tab">CARNETS MEMBRES</strong>
                </q-tab>
                <q-tab name="3">
                  <strong class="style-tab">COMPTES</strong>
                </q-tab>
                <q-tab name="4">
                  <strong class="style-tab">COMMISSIONS</strong>
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
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** IDENTITE ******************* -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >INFORMATIONS SUR LE COLLECTEUR <span
                            class="text-primary"
                            v-if="collecteur.folio"
                          >[ {{collecteur.folio}} ]</span></div>
                      </div>
                      <div
                        class="col-auto q-py-xs q-pr-md"
                        v-if="collecteur.folio"
                      >
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          icon="las la-copy"
                          unelevated
                          round
                          size="sm"
                          @click="$helper.copy(collecteur.folio)"
                        >
                          <q-tooltip>
                            Copier le code du collecteur
                          </q-tooltip>

                        </q-btn>
                      </div>
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <div class="row q-col-gutter-md items-center">
                            <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                              <div class="text-center">
                                <div class=" contStylephoto">
                                  <q-img
                                    :src=" (!!collecteur && !!collecteur.photo ?  `${URLS.IMG_AGENT}/${collecteur.photo}` :'statics/images/icone/avatar.png')"
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
                                  <input-label>Nom complet</input-label>
                                  <div class="text-details"> {{collecteur.nom_complet}}</div>
                                </div>
                                <div class="col-12">
                                  <input-label>Adresse</input-label>
                                  <div class="text-details"> {{collecteur.adresse}}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                          <input-label>Etat civil</input-label>
                          <div class="text-details">{{collecteur.etat_civil || 'Non défini'}}</div>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                          <input-label>Sexe</input-label>
                          <div class="text-details">{{collecteur.sexe || 'Non défini'}}</div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                          <input-label>Téléphone</input-label>
                          <div class="text-details">{{collecteur.phone || 'Non défini'}}</div>
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
                      >CARNETS A RECOUVRER PAR LE COLLECTEUR</div>
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
                            <th
                              style="width:20%"
                              class="text-left"
                            >NOM COMPLET</th>
                            <th class="text-center">SEXE</th>
                            <th class="text-center">PROFESSION</th>
                            <th class="text-center">ADRESSE</th>
                            <th class="text-center">TELEPHONE</th>
                            <th class="text-center">CARNET N*</th>
                            <th class="text-center">MISE</th>
                            <th class="text-center">ETAT</th>

                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in collecteur.carnets"
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
                            <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                            <td class="text-center">{{ row.sexe }}</td>
                            <td class="text-center">{{ row.profession || 'Non définie' }}</td>
                            <td class="text-center">{{ row.avenue || 'Non définie' }}</td>
                            <td class="text-center">{{ row.phone || 'Non définie' }}</td>
                            <td class="text-center">{{ row.code }}</td>
                            <td class="text-center">{{ row.mise}} {{row.devise}}</td>
                            <td class="text-center">{{ row.status }}</td>
                          </tr>

                          <template v-if="!collecteur.carnets || collecteur.carnets.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="9"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/enseignants.png"
                                  title="Aucun membre sous la responsabilité de ce collecteur"
                                  :showBtn="false"
                                />
                              </td>
                            </tr>
                          </template>
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
                            <th class="text-left">COMPTE</th>
                            <th class="text-left">INTITULE</th>
                            <th>DEVISE</th>
                            <th class="text-left">SOLDE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row,index) in collecteur.comptes"
                            :key="index"
                          >
                            <td class="text-center">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="22px"
                              >{{index+1}}</q-avatar>
                            </td>
                            <td>{{row.indice}}</td>
                            <td>{{row.intitule}}</td>
                            <td class="text-center">{{row.devise}}</td>
                            <td class="text-bold text-primary">S{{row.solde.solde.solde}} : {{ $helper.formatMoney(row.solde.solde.montant)}}</td>
                          </tr>
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
                            >COMMISSIONS</div>
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
                            <th class="text-left">CARNET</th>
                            <th class="text-right">MISE</th>
                            <th class="text-right">COMMISSION</th>
                            <th>TRANSFERE</th>
                            <th>DATE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row,index) in collecteur.commissions"
                            :key="index"
                          >
                            <td class="text-center">{{index+1}}</td>
                            <td class="text-left">{{row.code}}</td>
                            <td class="text-right">{{$helper.formatMoney(row.mise)}} {{row.devise}}</td>
                            <td class="text-right">{{$helper.formatMoney(row.montant)}} {{row.devise}}</td>
                            <td class="text-center">{{row.fk_operation ? 'OUI' : 'NON'}}</td>
                            <td class="text-center">{{$helper.dateBien(row.created_at,false)}}</td>
                          </tr>

                          <tr>
                            <td
                              colspan="3"
                              class="text-left text-bold"
                            >NON TRANSFERE DANS EPARGNE</td>
                            <td class="text-right text-bold text-primary">{{$helper.formatMoney(_nonTransfere)}}</td>
                            <td
                              colspan="2"
                              :style="$helper.cellEmptyImg"
                            ></td>
                          </tr>
                          <tr>
                            <td
                              colspan="3"
                              class="text-left text-bold"
                            >TRANSFERE DANS EPARGNE</td>
                            <td class="text-right text-bold text-primary">{{$helper.formatMoney(_transfere)}}</td>
                            <td
                              colspan="2"
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

  </div>
</template>

<script>

export default {
  name: 'dialogDetailsCollecteur',
  data () {
    return {
      URLS: {},

      loading: false,

      collecteur: {
        carnets: [],
        comptes: [],
        commissions: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedCollecteur: {},
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
        if (this.selectedCollecteur) {
          this.collecteur = { ...this.selectedCollecteur }
        } else {
          this.collecteur = {
            carnets: [],
            comptes: [],
            commissions: []
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
    },
    _nonTransfere () {
      if (this.$helper.isNotEmpty(this.collecteur.commissions)) {
        return this.collecteur.commissions.reduce((prev, curr) => {
          return prev + (curr.fk_operation === null ? parseFloat(curr.montant) : 0)
        }, 0)
      }
      return 0
    },
    _transfere () {
      if (this.$helper.isNotEmpty(this.collecteur.commissions)) {
        return this.collecteur.commissions.reduce((prev, curr) => {
          return prev + (curr.fk_operation !== null ? parseFloat(curr.montant) : 0)
        }, 0)
      }
      return 0
    }
  },
  methods: {

  }

}
</script>

<style lang="stylus"></style>
