<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 900px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Simulation de remboursement</div>
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

          <div
            class="row  q-px-md q-py-sm scroll "
            style="max-height:75vh"
          >
            <div class="col">

              <q-form ref="myForm">

                <div class="row q-col-gutter-md ">
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** SITE ******************* -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                    <div class="ba overflow-hidden panel-primary">

                      <div class="q-pa-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12">
                            <input-label required>Dossier de crédit</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner un dossier de crédit"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              clearable
                              v-model="selectedDossier"
                              :options="dossiers"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.code}-${opt.client_str}`"
                              @filter="filterDossiers"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une dossier']"
                              @input="onDossierSelected"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun dossier de crédit validé pour le decaissement
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                          <div class="col-12">
                            <q-card
                              flat
                              bordered
                              class="q-py-xs radius-none"
                            >
                              <q-card-section class="q-pa-none q-px-sm text-bold">
                                EPARGNE : {{remboursement ? $helper.formatMoney(remboursement.solde_epargne) : '0,00'}} {{selectedDossier?selectedDossier.devise :''}}
                              </q-card-section>
                            </q-card>
                          </div>
                          <div class="col-12">
                            <div class="row q-col-gutter-sm">
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                <div style="border:1px solid rgba(0,0,255,.3);">
                                  <div class="text-bold text-primary q-px-sm q-py-xs">
                                    Situation de crédit
                                  </div>
                                  <q-separator />
                                  <div class="q-pa-sm row ">
                                    <div class="col-12">
                                      <input-label>Montant credit</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.montant_pret):'N/A'}}</div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Cap. remboursé</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.t_capital_remb):'N/A'}}</div>
                                    </div>
                                    <div class="q-pl-xs col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Int. remboursé</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.t_interet_remb) :'N/A'}}</div>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Encours cap.</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.encours_capital) :'N/A'}}</div>
                                    </div>
                                    <div class="q-pl-xs col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                      <input-label>Encours int.</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.encours_interet) :'N/A'}}</div>
                                    </div>
                                    <div class="col-12">
                                      <input-label>Nombre jours des retard</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.jours_retard)+' Jour(s)' :'N/A'}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                <div style="border:1px solid rgba(255,0,0,.3);background-color:rgba(255,0,0,.07)">
                                  <div class="text-bold text-red q-px-sm q-py-xs">
                                    Impayés
                                  </div>
                                  <q-separator />
                                  <div class="q-pa-sm">
                                    <div>
                                      <input-label>Impayé capital</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.impaye_capital):'N/A'}}</div>
                                    </div>
                                    <div>
                                      <input-label>Impayé intérêts</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.impaye_interet):'N/A'}}</div>
                                    </div>
                                    <div>
                                      <input-label>Impayé penalités</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney(remboursement.impaye_penalite) :'N/A'}}</div>
                                    </div>
                                    <div>
                                      <input-label>Total impayés</input-label>
                                      <div class="text-details"> {{remboursement ? $helper.formatMoney($helper.toDouble(remboursement.impaye_capital) + $helper.toDouble(remboursement.impaye_interet) + $helper.toDouble(remboursement.impaye_penalite)) || 'Non défini':'N/A'}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                    <div class="ba overflow-hidden panel-primary">

                      <div class="q-pa-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12">
                            <input-label required>Montant à rembourser</input-label>
                            <q-input
                              :readonly="!$helper.isNotEmpty(selectedDossier)"
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="montantReparti"
                              placeholder="Montant à rembourser"
                              lazy-rules
                              :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                        val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                        val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                        val => parseFloat(val) <= parseFloat(this.remboursement.solde_epargne) || 'Le solde disponible sur le compte epargne est inferieur au montant saisi']"
                              class="mrg"
                              maxlength="10"
                              @keyup.enter="e=>e.target.blur()"
                              @blur="getRepartitionSurImpayes"
                            >
                              <template
                                v-slot:append
                                v-if="remboursement"
                              >
                                <div style="font-size:13px"><strong>{{remboursement.devise}}</strong></div>
                              </template>
                            </q-input>
                          </div>
                          <div
                            class="col-12"
                            v-if="$helper.isNotEmpty(selectedDossier) && $helper.isNotEmpty(montantReparti) && $helper.isNotEmpty(repartitions)"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              label="Previsualiser la repartition"
                              @click="showDlgPreviewRepartition=true"
                              unelevated
                              size="12px"
                              icon=""
                              icon-right="las la-external-link-square-alt"
                              style="width:100%"
                              no-caps
                            />
                          </div>
                          <div class="col-12">

                            <div
                              style="border:1px solid rgba(0,0,255,.3);"
                              class="q-mt-sm"
                            >
                              <div class="text-bold text-primary q-px-sm q-py-xs">
                                Autres informations
                              </div>
                              <q-separator />
                              <div v-if="selectedDossier">
                                <table class="table head-bold table-striped">

                                  <tbody style="font-size:12px">

                                    <tr>
                                      <td>CODE ADH.</td>
                                      <td>{{selectedDossier.folio}}</td>
                                    </tr>
                                    <tr>
                                      <td>ADHERENT</td>
                                      <td>{{selectedDossier.client_str}}</td>
                                    </tr>
                                    <tr>
                                      <td>PRODUIT</td>
                                      <td>{{selectedDossier.produit_str}}</td>
                                    </tr>

                                    <tr>
                                      <td>TAUX INT.</td>
                                      <td>{{selectedDossier.taux_interet}} %</td>
                                    </tr>
                                    <tr>
                                      <td>ECHEANCE</td>
                                      <td>{{selectedDossier.echeance}} </td>
                                    </tr>
                                    <tr>
                                      <td>PERIODICITE</td>
                                      <td>{{selectedDossier.periodicite}}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showDlgPreviewRepartition"
      persistent
    >
      <q-card style="width: 800px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Repartitions</div>
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

          <div
            class="row  q-px-md q-py-sm scroll "
            style="max-height:75vh"
          >
            <div class="col">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th rowspan="2">N*</th>
                    <th rowspan="2">DATE REMB.</th>
                    <td
                      colspan="3"
                      class="text-center text-bold"
                    >ECHEANCIER</td>
                    <td
                      colspan="4"
                      class="text-center text-bold"
                    >REMBOURSEMENT</td>
                  </tr>
                  <tr>
                    <th>INTERET</th>
                    <th>CAPITAL</th>
                    <th>MENSUALITE</th>
                    <th>TOTAL REMB.</th>
                    <th>INTERET REMB.</th>
                    <th>CAPITAL REMB.</th>
                    <th>PENALITE</th>
                  </tr>
                </thead>
                <tbody style="font-size:12px;">
                  <tr
                    v-for="(row,index) in repartitions"
                    :key="index"
                  >
                    <td class="text-center text-bold">{{index + 1}}</td>
                    <td class="text-center text-bold">{{$helper.dateBien(row.date_echeance,false)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.interet)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.capital)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.mensualite)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.remb_mensualite)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.remb_interet)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.remb_capital)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(row.remb_penalite)}}</td>
                  </tr>
                  <tr class="text-bold text-center">
                    <td colspan="5">TOTAL REMBOURSEMENT</td>
                    <td>{{$helper.formatMoney(montantReparti)}}</td>
                    <td>{{$helper.formatMoney(interetRemb )}}</td>
                    <td>{{$helper.formatMoney(capitalRemb)}}</td>
                    <td>{{$helper.formatMoney(penaliteRemb)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogSuiviIndividuel',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      remboursement: {},
      dossiers: [],

      montantReparti: null,
      penaliteReparti: null,
      capitalRemb: null,
      interetRemb: null,
      penaliteRemb: null,

      selectedDossier: null,
      modifierPenalites: false,
      showDlgPreviewRepartition: false,
      repartitions: []
    }
  },
  props: {
    value: Boolean,
    selectedSuivi: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedSuivi != null) {
          this.remboursement = { ...this.selectedSuivi }
        } else {
          this.viderChamps()
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

    viderChamps () {
      this.selectedDossier = null
      this.remboursement = null
      this.modifierPenalites = false
      this.montantReparti = null
      this.penaliteReparti = null
      this.repartitions = []

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },

    filterDossiers (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        decision: 'DECAISSE',
        client: 'ALL',
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Suivi_credit/searchSuivisCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.dossiers = infos.data.records
        })
      }).catch(() => {
        update(() => { this.dossiers = [] })
      })
    },
    onDossierSelected (e) {
      if (e) {
        this.repartitions = []
        this.montantReparti = null
        this.penaliteReparti = null
        this.getRemboursementProbable(e)
      } else {
        this.viderChamps()
      }
    },
    getRemboursementProbable (e) {
      let donnees = JSON.stringify({
        id_dossier: e.id,
        id_client: e.id_client,
        type_client: e.type,
        devise: e.devise,
        calcul_penalite: e.calcul_penalite,
        pourcent_penalite: e.pourcent_penalite,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })
      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Remboursement/getOneDossierARembourser`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.remboursement = infos.data.records
          this.penaliteReparti = this.$helper.roundNombre(this.remboursement.impaye_penalite, 2) + ''
        } else {
          this.viderChamps()
          this.$helper.showMessage(infos.data.message)
        }
      }).catch(() => {
        this.viderChamps()
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },
    getRepartitionSurImpayes () {
      if (!this.$helper.isNotEmpty(this.montantReparti) ||
        !this.$helper.isNumeric(this.montantReparti) ||
        parseFloat(this.montantReparti) > parseFloat(this.remboursement.solde_epargne) ||
        !this.$helper.isNumeric(this.penaliteReparti) ||
        parseFloat(this.penaliteReparti) < 0) return

      this.repartitions = []
      let donnees = JSON.stringify({
        id_dossier: this.selectedDossier.id,
        ordre_remboursement: this.selectedDossier.ordre_remboursement,
        montant_reparti: this.montantReparti,
        impaye_penalite: this.penaliteReparti,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })
      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Remboursement/getRepartitionRemboursement`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.repartitions = infos.data.records.repartitions
          this.montantReparti = infos.data.records.total_reparti + ''
          this.capitalRemb = infos.data.records.total_capital
          this.interetRemb = infos.data.records.total_interet
          this.penaliteRemb = infos.data.records.total_penalite
        } else {
          this.repartitions = []
          this.capitalRemb = null
          this.interetRemb = null
          this.penaliteRemb = null
          this.$helper.showMessage(infos.data.message)
        }
      }).catch(() => {
        this.repartitions = []
        this.capitalRemb = null
        this.interetRemb = null
        this.penaliteRemb = null
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    }

  }

}
</script>

<style ></style>
