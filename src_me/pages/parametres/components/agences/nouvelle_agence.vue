<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 650px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouvelle ': 'Mise à jours de l\''}}agence</div>
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
            />
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
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >INFORMATIONS</div>
                    <q-separator />
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">

                        <div class="col-12">
                          <input-label required>Appellation de l'agence</input-label>
                          <q-input
                            :disable="loading"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="agence.designation"
                            placeholder="Agence"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Adresse</input-label>
                          <q-input
                            :disable="loading"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="agence.adresse"
                            placeholder="Adresse"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Téléphone </input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model="agence.phone"
                            placeholder="Ex. +243995467234"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Champs requis',
                            val => this.$helper.isTelephone(val) || 'Numéro invalide',
                            val => val.length >= 12 || 'Pas moins de 12 chiffres',
                            val => val.length <= 14 || 'Pas plus de 14 chiffres']"
                            maxlength="16"
                          />
                        </div>
                        <div class="col-12">
                          <input-label>Adresse mail</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model="agence.email"
                            placeholder="ex. example@gmail.com"
                            lazy-rules
                            :rules="[ val => !val || !!val && this.$helper.isMail(val) || 'Adresse mail invalide']"
                            maxlength="150"
                          />
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
  name: 'dialogAgence',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      agence: {}

    }
  },
  props: {
    value: Boolean,
    selectedAgence: {},
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
        if (this.selectedAgence != null) {
          this.agence = { ...this.selectedAgence }
        } else {
          this.agence = {}
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
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce agence?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.agence,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Agence/${this.isAdd ? 'add' : 'update'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
              this.$refs.myForm.resetValidation()
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
    viderChamps () {
      this.agence = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
