<template>
  <q-page style="min-height:0">
    <div class="ba overflow-hidden panel-primary q-mt-sm">
      <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
        <div class="col">
          <div class="text-h6">Validation de la demande</div>
        </div>

        <div
          class="col-auto"
          v-if="!validateOnly"
        >
          <q-btn
            color="blue-1"
            text-color="primary"
            label="Enregistrer"
            icon="las la-cloud-upload-alt"
            unelevated
            rounded
            size="12px"
            no-caps
            @click="$refs.myForm.validate().then(saveForm)"
          />
        </div>

      </div>
      <linearLoading :loading="loading" />
      <q-separator />

      <q-form
        ref="myForm"
        class="q-pa-sm"
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
                    <q-card
                      flat
                      bordered
                    >
                      <q-card-section class="q-pa-none">
                        <q-checkbox
                          v-model="validateOnly"
                          label="Dossiers ayant une validation finale"
                          @input="viderChamps();listeValidations=[];validation.demande=null"
                        />
                      </q-card-section>
                    </q-card>

                  </div>
                  <div class="col-12">
                    <input-label required>Demande de crédit</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      placeholder="Sélectionner une demande de validation"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      clearable
                      v-model="validation.demande"
                      :options="demandes"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.code}-${opt.client_str}`"
                      @filter="filterDemandes"
                      @input="onDemandeSelected"
                      lazy-rules
                      :rules="[ val => !!val || 'Sélectionner une demande']"
                    >
                      <template #no-option>
                        <q-item>
                          <q-item-section class="text-red">
                            Aucune demande de crédit trouvée
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Montant accordé</input-label>
                    <q-input
                      :readonly="validateOnly"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="validation.montant_accorde"
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
                        v-if="validation.demande"
                      >
                        <div style="font-size:13px"><strong>{{validation.demande.devise}}</strong></div>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Taux d'intérêt annuel</input-label>
                    <q-input
                      :readonly="validateOnly"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="validation.taux_interet"
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
                      :readonly="validateOnly"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="validation.echeance_accorde"
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
                        v-if="validation.demande"
                      >
                        <div style="font-size:13px"><strong>{{validation.demande.periodicite}}</strong></div>
                      </template></q-input>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Nombre differées</input-label>
                    <q-input
                      :readonly="validateOnly"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="validation.nombre_differe"
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
                        v-if="validation.demande"
                      >
                        <div style="font-size:13px"><strong>{{validation.demande.periodicite}}</strong></div>
                      </template></q-input>
                  </div>
                  <template v-if="!validateOnly">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <input-label required>Avis</input-label>
                      <q-select
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        label="Avis"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        v-model="validation.avis"
                        :options="['FAVORABLE','DEFAVORABLE']"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt}`"
                        lazy-rules
                        :rules="[ val => !!val || 'Selectionner un avis']"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <input-label required>Type validation</input-label>
                      <q-select
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        label="Type validation"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        v-model="validation.type_validation"
                        :options="['PARTIEL','FINAL']"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt}`"
                        lazy-rules
                        :rules="[ val => !!val || 'Selectionner un avis']"
                      />
                    </div>
                  </template>

                  <div
                    class="col-12"
                    v-if="validation.demande"
                  >
                    <div class="ba overflow-hidden panel-primary">

                      <q-expansion-item
                        expand-separator
                        label="Informations sur le demande de crédit"
                        dense
                        class="text-bold q-py-xs"
                      >
                        <q-separator />
                        <div v-if="validation.demande">
                          <table class="table head-bold table-striped">

                            <tbody style="font-size:12px">
                              <tr>
                                <td>PRODUIT</td>
                                <td>{{validation.demande.produit_str}}</td>
                              </tr>
                              <tr>
                                <td>CODE</td>
                                <td>{{validation.demande.code}}</td>
                              </tr>
                              <tr>
                                <td>MONTANT </td>
                                <td>{{validation.demande.montant_sollicite}} {{validation.demande.devise}}</td>
                              </tr>
                              <tr>
                                <td>TAUX INT.</td>
                                <td>{{validation.demande.taux_interet}} %</td>
                              </tr>
                              <tr>
                                <td>ECHEANCE</td>
                                <td>{{validation.demande.nombre_echeance}} </td>
                              </tr>
                              <tr>
                                <td>DIFFERE</td>
                                <td>{{validation.demande.nombre_differe}} </td>
                              </tr>
                              <tr>
                                <td>PERIODICITE</td>
                                <td>{{validation.demande.periodicite}} </td>
                              </tr>
                              <tr>
                                <td>PERIODE GRACE</td>
                                <td>{{validation.demande.delais_grace}} </td>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </q-expansion-item>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
            <div class="ba overflow-hidden panel-primary">
              <div class="q-pa-sm text-bold">
                Validations déjà effectuées
              </div>
              <q-separator />
              <div v-if="$helper.isNotEmpty(listeValidations)">
                <table class="table head-bold hover table-colored-head">
                  <thead>
                    <tr>
                      <th>AGENT</th>
                      <th>AVIS</th>
                      <th>MONTANT</th>
                      <th>TAUX</th>
                      <th>ECHEANCE</th>
                    </tr>
                  </thead>
                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row,index) in listeValidations"
                      :key="index"
                    >
                      <td>{{row.agent_str}}</td>
                      <td class="text-center">
                        <q-badge
                          :color="row.avis ==='FAVORABLE' ? 'blue-1 text-blue':'red-1 text-red'"
                          text-color="black"
                          :label="row.avis"
                          class="text-bold"
                          style="padding:5px 5px"
                        />
                      </td>
                      <td class="text-center">{{row.montant_accorde}}</td>
                      <td class="text-center">{{row.taux_interet}}</td>
                      <td class="text-center">{{row.echeance_accorde}}</td>
                    </tr>
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
            <div
              class="ba panel-primary q-pa-md q-mt-md"
              v-if="!validateOnly"
            >
              <div class="row q-col-gutter-md">

                <div class="col-12">
                  <input-label>Observation</input-label>
                  <q-input
                    square
                    outlined
                    dense
                    hide-bottom-space
                    v-model.trim="validation.observation"
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

      </q-form>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'dialogValidationDemande',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      validation: {},
      demandes: [],
      listeValidations: [],

      validateOnly: false

    }
  },

  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () { },
  watch: {},
  computed: {},
  methods: {
    viderChamps () {
      this.validation = {
        demande: this.validation.demande
      }
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    onDemandeSelected (e) {
      this.listeValidations = []

      if (e) {
        this.$vue.set(this.validation, 'montant_accorde', e.montant_sollicite)
        this.$vue.set(this.validation, 'taux_interet', e.taux_interet)
        this.$vue.set(this.validation, 'echeance_accorde', e.nombre_echeance)
        this.$vue.set(this.validation, 'nombre_differe', e.nombre_differe)

        this.getValidations(e)
      } else {
        this.$vue.set(this.validation, 'montant_accorde', null)
        this.$vue.set(this.validation, 'taux_interet', null)
        this.$vue.set(this.validation, 'echeance_accorde', null)
        this.$vue.set(this.validation, 'nombre_differe', null)
      }
    },
    getValidations (e) {
      let data = {
        id_demande: e.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }

      let donnees = JSON.stringify(data)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Validation_credit/getValidations/`

      this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.listeValidations = infos.data.records
          } else {
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },

    filterDemandes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        decision: this.validateOnly ? null : 'ETUDE',
        more_request: this.validateOnly
          ? ` AND (decision ='VALIDE' OR decision ='ACCORDE')`
          : null,
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
    saveForm (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment enregistrer ce validation ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          ...this.validation
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Validation_credit/add`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.getValidations(this.validation.demande)
            this.viderChamps()
            this.$refs.myForm.resetValidation()
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
<style lang="stylus"></style>
