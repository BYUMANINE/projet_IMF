<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jour '}} gestionnaire</div>
          </div>

          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Enregistrer"
              icon="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.myForm.validate().then(onSubmit)"
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
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">

                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Nom complet</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="gestionnaire.nom_complet"
                            placeholder="Nom complet"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Agence d'appartenance</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            clearable
                            placeholder="Sélectionner une agence"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            v-model="gestionnaire.agence"
                            :options="agences"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.designation}`"
                            @filter="filterAgences"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                          >
                            <template #no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucune agence trouvé
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
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
</template>

<script>

export default {
  name: 'dialoggestionnaire',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      gestionnaire: {},
      agences: []
    }
  },
  props: {
    value: Boolean,
    selectedGestionnaire: null,
    isAdd: {
      type: Boolean,
      default: false
    }
  },
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
        if (this.selectedGestionnaire != null) {
          this.gestionnaire = { ...this.selectedGestionnaire }
        } else {
          this.gestionnaire = {}
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

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce gestionnaire ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.gestionnaire,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Gestionnaire/${this.isAdd ? 'add' : 'update'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'bottom')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    },
    filterAgences (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id

      })

      let url = `${this.URLS.BASE_URL}/Agence/searchAgences`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.agences = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.agences = []
        })
      })
    },
    viderChamps () {
      this.gestionnaire = {}
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }

  }

}
</script>

<style lang="stylus"></style>
