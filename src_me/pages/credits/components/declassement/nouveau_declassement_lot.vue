<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 1000px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Déclassement</div>
            </div>

            <div class="col-auto">
              <q-btn
                :disable="declassement.dossiers.length === 0 || !isFinish"
                color="blue-1"
                text-color="primary"
                label="Lancer le déclassement"
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
            class="row scroll "
            style="min-height:45vh;max-height:75vh"
          >
            <div class="col">
              <q-form ref="myForm">
                <div class="q-pa-sm">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center q-pa-sm">
                          <div
                            class="col text-bold"
                            style="font-size:15px"
                          >
                            Dossiers des crédits
                          </div>
                          <div class="col-auto">
                            <q-btn
                              :disable="!isFinish"
                              color="primary"
                              text-color="white"
                              icon="search"
                              label="Charger les dossiers"
                              unelevated
                              no-caps
                              size="12px"
                              @click="chargerDossiers()"
                            />
                          </div>
                        </div>
                        <q-separator />
                        <table class="table head-bold hover table-striped table-colored-head ">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th class="text-left">DOSSIER</th>
                              <th class="text-center">CODE ADH.</th>
                              <th class="text-left">ADHERENT</th>
                              <th class="text-right">PRET</th>
                              <th class="text-right">ENCOURS</th>
                              <th class="text-left">RETARD</th>
                              <th class="text-right">RETARD</th>
                              <th class="text-right">TAUX PROV.</th>
                              <th class="text-right">PROV.</th>
                            </tr>
                          </thead>

                          <tbody style="font-size:12px">
                            <tr
                              v-for="(row, index) in declassement.dossiers"
                              :key="index"
                            >
                              <td class="text-center">
                                <q-avatar
                                  color="primary"
                                  text-color="white"
                                  size="18px"
                                >
                                  {{ index + 1 }}
                                </q-avatar>
                              </td>
                              <td class="text-left">{{row.code}}</td>
                              <td class="text-center">{{row.folio}}</td>
                              <td class="text-left">{{row.client_str}}</td>
                              <td class="text-right">{{ $helper.formatMoney(row.montant_pret) + ' ' + row.devise}}</td>
                              <td class="text-right">{{ $helper.formatMoney(row.encours_capital) + ' ' + row.devise}}</td>
                              <td class="text-left">{{ row.intervalle_str}}</td>
                              <td class="text-right">{{ row.jours_retard}} Jrs</td>
                              <td class="text-right">{{ row.taux_provision}} %</td>
                              <td class="text-right">{{ $helper.formatMoney(row.montant_provision) + ' ' + row.devise }}</td>
                            </tr>
                            <tr v-if="declassement.dossiers.length === 0">
                              <td
                                colspan="10"
                                class="text-bold text-center"
                              >
                                <div class="q-px-md q-py-xl text-center">
                                  <q-img
                                    src="statics/images/icone/cloud.png"
                                    spinner-color="white"
                                    spinner-size="15px"
                                    style="height: 50px; max-width: 50px"
                                  /> <br>
                                  <span>Aucun dossier</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      class="col-12 text-right"
                      v-if="isSending || !isFinish || succes"
                    >
                      <div
                        class="q-pa-md text-bold"
                        v-if="!isFinish"
                      >
                        <q-spinner
                          color="primary"
                          size="2em"
                          class="q-mr-md"
                        />
                        Déclassement en cours (<span class="text-primary">{{increment}}%</span>) ...
                      </div>

                      <div
                        class="q-pa-md text-bold"
                        v-if="succes"
                      >
                        <q-icon
                          name="las la-check"
                          size="20px"
                          color="primary"
                          class="q-mr-md"
                        />
                        Déclassement terminé
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
      declassement: {
        dossiers: []
      },
      retards: [],
      dossiers: [],

      increment: 0,
      isSending: false,
      incrementId: null,
      isFinish: true,
      succes: false
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
  destroyed () {
    clearInterval(this.incrementId)
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.viderChamps()
      } else {
        clearInterval(this.incrementId)
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
      this.isFinish = true
      this.increment = 0
      this.isSending = false
      this.succes = false

      this.declassement = {
        dossiers: []
      }
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    onTypeChanged (e) {
      this.declassement.dossiers = []
      this.$vue.set(this.declassement, 'dossier', null)
    },
    chargerDossiers () {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Declassement/getDossierADeclasser`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        if (infos.data.erreur === false) {
          this.declassement.dossiers = infos.data.records
        } else {
          this.$helper.showMessage(infos.data.message, 0, 'center')
        }
      }).catch(() => {
        this.declassement.dossiers = []
      })
    },
    incrementPourcent (value = 1, delay = 5000) {
      this.increment = value
      clearInterval(this.incrementId)
      this.incrementId = setInterval(() => {
        if (this.increment < 100) {
          this.increment++
        } else {
          if (!this.isSending) {
            this.isFinish = true
            this.declassement.dossiers = []
            this.succes = true
          }
          clearInterval(this.incrementId)
        }
      }, delay)
    },
    saveForm (isOk) {
      if (!isOk) return
      if (this.declassement.dossiers.length === 0) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment lancer le déclassement de ces dossiers ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.incrementPourcent()
        this.isSending = true
        this.isFinish = false
        this.succes = false

        let url = `${this.URLS.BASE_URL}/Declassement/addDeclassementLot`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          if (infos.data.erreur === false) {
            this.$emit('onFinish', true)

            this.isSending = false

            if (this.increment < 100) {
              this.incrementPourcent(this.increment, 100)
            } else {
              this.isFinish = true
              this.declassement.dossiers = []
              this.succes = true
            }
          } else {
            this.succes = false
            this.isFinish = true
            this.isSending = false
            clearInterval(this.incrementId)
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.succes = false
          this.isFinish = true
          this.isSending = false
          clearInterval(this.incrementId)
          this.$helper.showMessage()
        })
      })
    }

  }

}
</script>

<style ></style>
