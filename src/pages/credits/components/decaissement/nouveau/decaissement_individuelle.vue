<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Débloquage</div>
            </div>

            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Valider l'opération"
                icon="las la-cloud-upload-alt"
                unelevated
                rounded
                size="
                12px"
                no-caps
                @click="$refs.myForm.validate().then(saveForm)"
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
                              v-model="suivi.dossier"
                              :options="dossiers"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.code}-${opt.client_str}`"
                              @filter="filterDossiers"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une dossier']"
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
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Folio</input-label>
                            <div class="text-details"> {{suivi.dossier ? suivi.dossier.folio:'N/A'}}</div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Client</input-label>
                            <div class="text-details"> {{suivi.dossier ? suivi.dossier.client_str:'N/A'}}</div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Gestionnaire</input-label>
                            <div class="text-details"> {{suivi.dossier ? suivi.dossier.gestionnaire_str || 'Non défini':'N/A'}}</div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Montant accordé</input-label>
                            <div class="text-details"> {{suivi.dossier ? suivi.dossier.montant+' '+suivi.dossier.devise:'N/A'}}</div>
                          </div>

                          <div class="col-12">
                            <input-label>Libellé de l'opération</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="suivi.libelle"
                              placeholder="Libellé"
                              lazy-rules
                              :rules="[ val => !!val && val && val.trim().length > 10 || 'Saisissez au moins 10 caractères']"
                              type="textarea"
                              rows="3"
                              maxlength="250"
                            />
                          </div>

                          <div
                            class="col-12"
                            v-if="suivi.dossier"
                          >
                            <div class="ba overflow-hidden panel-primary">

                              <q-expansion-item
                                expand-separator
                                label="Informations supplementaires"
                                dense
                                class="text-bold q-py-xs"
                              >
                                <q-separator />
                                <div v-if="suivi.dossier">
                                  <table class="table head-bold table-striped">

                                    <tbody style="font-size:12px">
                                      <tr>
                                        <td>PRODUIT</td>
                                        <td>{{suivi.dossier.produit_str}}</td>
                                      </tr>
                                      <tr>
                                        <td>MONTANT </td>
                                        <td>{{suivi.dossier.montant_sollicite}} {{suivi.dossier.devise}}</td>
                                      </tr>
                                      <tr>
                                        <td>TAUX INT.</td>
                                        <td>{{suivi.dossier.taux_interet}} %</td>
                                      </tr>
                                      <tr>
                                        <td>ECHEANCE</td>
                                        <td>{{suivi.dossier.echeance}} </td>
                                      </tr>
                                      <tr>
                                        <td>DIFFERE</td>
                                        <td>{{suivi.dossier.differe}} </td>
                                      </tr>
                                      <tr>
                                        <td>PERIODICITE</td>
                                        <td>{{suivi.dossier.periodicite}} </td>
                                      </tr>
                                      <tr>
                                        <td>PERIODE GRACE</td>
                                        <td>{{suivi.dossier.delais_grace}} Jour(s)</td>
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
  name: 'dialogSuiviIndividuel',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      suivi: {},
      dossiers: []
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
          this.suivi = { ...this.selectedSuivi }
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
      this.suivi = {}
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },

    filterDossiers (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        decision: 'SUIVI',
        client: 'MEMBRE',
        frais_paye: 'OUI',
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
    saveForm (isOk) {
      if (!isOk) return

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
          type_client: 'MEMBRE',
          ...this.suivi
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Decaissement/add`

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
