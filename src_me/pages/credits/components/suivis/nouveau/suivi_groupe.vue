<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 950px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Suivi pour groupe</div>
            </div>
            <div
              class="col-auto"
              v-if="isAdd"
            >
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                icon="las la-broom"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="viderChamps()"
                class="gt-xs"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="step == 1"
                color="blue-1"
                text-color="primary"
                label="Précédent"
                icon="las la-arrow-left"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="step--"
              />
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                :label="step < 2 ?'Suivant' : 'Enregistrer'"
                :icon="step  < 2 ?'las la-arrow-right' : 'las la-cloud-upload-alt'"
                unelevated
                rounded
                size="
                12px"
                no-caps
                @click="$refs.myForm.validate().then(checkform)"
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

          <div
            class="row  q-px-sm q-py-sm scroll "
            style="max-height:75vh"
          >
            <div class="col">

              <q-form ref="myForm">
                <div class="ba overflow-hidden panel-primary">
                  <q-stepper
                    v-model="step"
                    ref="stepper"
                    color="primary"
                    class="q-pa-none-xs-stepper"
                    transition-next="fade"
                    transition-prev="fade"
                  >
                    <q-step
                      :name="1"
                      title="SUIVI DE CREDIT"
                      icon="las la-users"
                      :done="step > 1"
                    >
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
                                  <input-label required>Demande de crédit</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner une demande"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    v-model="suivi.demande"
                                    :options="demandes"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.code}-${opt.client_str}`"
                                    @filter="filterDemandes"
                                    @input="onSuiviSelected"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner une demande']"
                                  >
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucune demande de crédit validée pour le suivi
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Montant accordé</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="suivi.montant"
                                    placeholder="Montant"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',]"
                                    class="mrg"
                                    maxlength="10"
                                  >
                                    <template
                                      v-slot:append
                                      v-if="suivi.demande"
                                    >
                                      <div style="font-size:13px"><strong>{{suivi.demande.devise}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Taux d'intérêt annuel</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="suivi.taux_interet"
                                    placeholder="Taux"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) > 0 && parseFloat(val) < 100 || 'en O et 100% svp',]"
                                    class="mrg"
                                    maxlength="5"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>%</strong></div>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Echeance accordée</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="suivi.echeance"
                                    placeholder="echéances"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumber(val) || 'Uniquement les nombres entiers',
                                              val => parseInt(val) >= 0 || 'L\'échéance doit être un nombre positif']"
                                    class="mrg"
                                    maxlength="3"
                                  >
                                    <template
                                      v-slot:append
                                      v-if="suivi.demande"
                                    >
                                      <div style="font-size:13px"><strong>{{suivi.demande.periodicite}}</strong></div>
                                    </template></q-input>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Nombre differées</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="suivi.differe"
                                    placeholder="Nombre differées"
                                    lazy-rules
                                    :rules="[ val => !val || val && val.trim().length > 0 || 'Champs requis',
                                              val => !val || this.$helper.isNumber(val) || 'Uniquement les nombre entiers',
                                              val => !val || parseInt(val) >= 0 || 'Le differé doit être un nombre positif']"
                                    class="mrg"
                                    maxlength="3"
                                  >
                                    <template
                                      v-slot:append
                                      v-if="suivi.demande"
                                    >
                                      <div style="font-size:13px"><strong>{{suivi.demande.periodicite}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-12">
                                  <input-label required>Référence du contrat</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="suivi.ref_contrat"
                                    placeholder="Référence"
                                    lazy-rules
                                    :rules="[ val => !!val && val && val.trim().length > 0 || 'Champs requis']"
                                    maxlength="40"
                                  />
                                </div>
                                <div class="col-12">
                                  <input-label required>Gestionnaire</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Selectionner un gestionnaire"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    v-model="suivi.gestionnaire"
                                    :options="gestionnaires"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.nom_complet}`"
                                    @filter="filterGestionnaires"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner un gestionnaire']"
                                  >
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun gestionnaire trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="q-pa-sm text-bold">
                              Validations finale
                            </div>
                            <q-separator />
                            <div v-if="!!validation">
                              <table class="table head-bold table-striped">

                                <tbody style="font-size:12px">
                                  <tr>
                                    <td>AGENT</td>
                                    <td>{{validation.agent_str}}</td>
                                  </tr>
                                  <tr>
                                    <td>AVIS</td>
                                    <td>
                                      <q-badge
                                        :color="validation.avis ==='FAVORABLE' ? 'blue-1 text-blue':'red-1 text-red'"
                                        text-color="black"
                                        :label="validation.avis"
                                        class="text-bold"
                                        style="padding:5px 5px"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>MONTANT</td>
                                    <td>{{validation.montant_accorde}}</td>
                                  </tr>
                                  <tr>
                                    <td>TAUX INT.</td>
                                    <td>{{validation.taux_interet}} %</td>
                                  </tr>
                                  <tr>
                                    <td>ECHEANCE</td>
                                    <td>{{validation.echeance_accorde}} </td>
                                  </tr>
                                  <tr>
                                    <td>DIFFERE</td>
                                    <td>{{validation.nombre_differe}} </td>
                                  </tr>
                                  <template v-if="suivi.demande">
                                    <tr>
                                      <td>PERIODICITE</td>
                                      <td>{{suivi.demande.periodicite}} </td>
                                    </tr>
                                    <tr>
                                      <td>PERIODE GRACE</td>
                                      <td>{{suivi.demande.delais_grace}} JOUR(S)</td>
                                    </tr>
                                  </template>

                                </tbody>
                              </table>
                            </div>
                            <div
                              v-else
                              class="q-px-sm q-py-sm text-center"
                            >
                              <q-img
                                src="statics/images/icone/cloud.png"
                                spinner-color="white"
                                spinner-size="15px"
                                style="height: 60px; max-width: 60px"
                              /> <br>
                              <span>Aucune demande de crédit sélectionnée</span>
                            </div>
                          </div>
                          <div class="ba panel-primary q-pa-md q-mt-md">
                            <div class="row">

                              <div class="col-12">
                                <input-label>Observation</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="suivi.observation"
                                  placeholder="Observation"
                                  lazy-rules
                                  :rules="[ val => !val || val && val.trim().length > 1 || 'Champs requis']"
                                  type="textarea"
                                  rows="3"
                                  maxlength="250"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </q-step>
                    <q-step
                      :name="2"
                      title="REPARTIRION"
                      icon="las la-users"
                      :done="step > 2"
                    >
                      <div class="ba overflow-hidden panel-primary">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >PART DES MEMBRES DU GROUPE</div>
                        <q-separator />
                        <table class="table head-bold hover table-striped table-colored-head">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th class="text-left">MONTANT SOLLICITE</th>
                              <th class="text-left">MONTANT ACCORDE</th>
                              <th class="text-left">NOM COMPLET</th>
                            </tr>
                          </thead>

                          <tbody style="font-size:12px">
                            <tr
                              v-for="(row, index) in membresGroupe"
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
                              <td class="text-left text-bold">
                                {{row.montant_sollicite}} {{suivi.demande?suivi.demande.devise:''}}
                              </td>
                              <td
                                class="text-center text-bold input-table"
                                style="width:30%"
                              >
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model="row.montant_accorde"
                                  placeholder="Montant"
                                  lazy-rules
                                  :rules="[ val => !!val || 'Champs requis',
                                            val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                            val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',
                                            val => montantReparti >= 0 || 'Montant superieur au reste à répartir']"
                                  maxlength="7"
                                >
                                  <template
                                    v-if="!!suivi.demande"
                                    #append
                                  >
                                    <strong style="font-size:13px">{{suivi.demande.devise}}</strong>
                                  </template>
                                </q-input>
                              </td>
                              <td class="text-left text-bold">{{ row.nom_complet }}</td>
                            </tr>
                            <template v-if="membresGroupe.length === 0">
                              <tr class="panel-primary">
                                <td
                                  :colspan="3"
                                  class="text-center"
                                >
                                  <nondata
                                    icone="img:statics/images/icone/enseignants.png"
                                    title="Aucun membre trouvé dans ce groupe"
                                    btnLabel="Actualiser la liste"
                                    :showBtn="false"
                                  />
                                </td>
                              </tr>
                            </template>

                            <tr>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td class="text-center input-table">
                                <q-field
                                  square
                                  outlined
                                  dense
                                  readonly
                                  hide-bottom-space
                                  lazy-rules
                                  :rules="[ val => montantReparti <= 0 || `Vous devez répartir le ${montantReparti} ${suivi.demande ? suivi.demande.devise : ''} restant aux membres`]"
                                >
                                  <template
                                    v-slot:control
                                    v-if="!!suivi.demande"
                                  >
                                    <div class="self-center full-width no-outline q-pa-none text-bold">
                                      {{montantReparti}} / {{suivi.montant}} {{suivi.demande.devise}}
                                    </div>
                                  </template>
                                </q-field>
                              </td>
                              <td :style="$helper.cellEmptyImg"></td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </q-step>
                  </q-stepper>
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogDemandeIndividuel',
  data () {
    return {
      URLS: {},
      user: {},

      step: 1,

      loading: false,
      suivi: {},
      demandes: [],
      gestionnaires: [],
      validation: null,
      membresGroupe: []

    }
  },
  props: {
    value: Boolean,
    selectedDemande: {},
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
        if (this.selectedDemande != null) {
          this.credit = { ...this.selectedDemande }
          this.step = 1
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
    },
    montantReparti () {
      return this.membresGroupe
        ? this.membresGroupe.reduce((prev, next) => {
          const value = this.$helper.isNumeric(next.montant_accorde)
            ? parseFloat(next.montant_accorde)
            : 0

          return prev - value
        }, parseFloat(this.suivi.montant))
        : 0
    }
  },
  methods: {

    checkform (isSucess) {
      if (isSucess) {
        if (this.step === 1) {
          this.step = 2
        } else if (this.step === 2) {
          this.saveForm()
        }
      }
    },
    viderChamps () {
      this.suivi = {}
      this.validation = null
      this.viderAutresChamps()
      this.step = 1
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    viderAutresChamps () {
      this.$vue.set(this.suivi, 'montant', null)
      this.$vue.set(this.suivi, 'taux_interet', null)
      this.$vue.set(this.suivi, 'echeance', null)
      this.$vue.set(this.suivi, 'differe', null)
      this.$vue.set(this.suivi, 'gestionnaire', null)
    },
    onSuiviSelected (e) {
      this.validation = null

      if (e) {
        this.getFinalValidation(e)
      } else {
        this.viderAutresChamps()
      }
    },
    getFinalValidation (e) {
      let data = {
        id_demande: e.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }

      let donnees = JSON.stringify(data)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Validation_credit/getFinalValidation/`

      this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.validation = infos.data.records

            this.$vue.set(this.suivi, 'montant', this.validation.montant_accorde)
            this.$vue.set(this.suivi, 'taux_interet', this.validation.taux_interet)
            this.$vue.set(this.suivi, 'echeance', this.validation.echeance_accorde)
            this.$vue.set(this.suivi, 'differe', this.validation.nombre_differe)
            this.$vue.set(this.suivi, 'gestionnaire', e.gestionnaire)
            this.getRepartitionMembres(e)
          } else {
            this.viderAutresChamps()
            this.suivi.demande = null
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.viderAutresChamps()
          this.suivi.demande = null
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },
    getRepartitionMembres (e) {
      let data = {
        id_demande: e.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }

      let donnees = JSON.stringify(data)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Suivi_credit/getRepartitionMembres/`

      this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.membresGroupe = infos.data.records
          } else {
            this.viderAutresChamps()
            this.suivi.demande = null
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.viderAutresChamps()
          this.suivi.demande = null
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },
    filterGestionnaires (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Gestionnaire/searchGestionnaires`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.gestionnaires = infos.data.records
        })
      }).catch(() => {
        update(() => { this.gestionnaires = [] })
      })
    },
    filterDemandes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        decision: 'VALIDE',
        client: 'GROUPE',
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Demande_credit/searchDemandesCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.demandes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.demandes = [] })
      })
    },
    saveForm () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment enregistrer ce suivi ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          type: 'GROUPE',
          ...this.suivi,
          membres: this.membresGroupe
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Suivi_credit/add`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.$emit('onFinish', true)
            this.showDialog = false
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    }

  }

}
</script>

<style ></style>
