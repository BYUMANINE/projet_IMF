<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 450px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Changer gestionnaire</div>
            </div>

            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Valider"
                icon="las la-check"
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
                <div class="ba overflow-hidden panel-primary q-pa-sm">
                  <input-label required>Sélectionner un gestionnaire</input-label>
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
                    v-model="selectedGestionnaire"
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
  name: 'dialogChangerGestionnaire',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      selectedGestionnaire: null,
      gestionnaires: []

    }
  },
  props: {
    value: Boolean,
    selectedDemande: {}
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
        this.selectedGestionnaire = null
        this.getGestionnaire()
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
    getGestionnaire () {
      let data = {
        id_demande: this.selectedDemande.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }

      let donnees = JSON.stringify(data)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Demande_credit/getGestionnaire/`

      this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.selectedGestionnaire = infos.data.gestionnaire
          } else {
            this.showDialog = false
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.showDialog = false
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },
    saveForm (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous mettre à jour le gestionnaire de cette demande ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_demande: this.selectedDemande.id,
          gestionnaire: this.selectedGestionnaire
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Demande_credit/changerGestionnaire/`

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
