<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jour '}} compte auxi.</div>
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
            <!-- <div class="q-mb-sm">
              <consigne title="Remarques">
                * Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires<br>
                * Rassurez-vous d'avoir completé toutes les informations requises avant d'enregistrer
              </consigne>
            </div> -->
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
                          <input-label required>Sélectionner la devise</input-label>
                          <q-field
                            :readonly="!isAdd"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            lazy-rules
                            :rules="[ val => !!operation.devise || 'Sélectionner la devise']"
                          >
                            <template v-slot:control>
                              <div class="self-center full-width no-outline q-pa-none">
                                <div class="row q-col-gutter-sm items-center">
                                  <div
                                    class="col"
                                    style="border-right:1px dashed rgba(0,0,0,.2)"
                                  >
                                    <q-radio
                                      v-model="operation.devise"
                                      val="CDF"
                                      label="CDF"
                                      dense
                                      class="text-bold"
                                      :disable="!isAdd"
                                    />
                                  </div>
                                  <div class="col">
                                    <q-radio
                                      v-model="operation.devise"
                                      val="USD"
                                      label="USD"
                                      dense
                                      class="text-bold"
                                      :disable="!isAdd"
                                    />
                                  </div>
                                </div>
                              </div>
                            </template>
                          </q-field>
                        </div>

                        <div class="col-12">
                          <div class="row q-col-gutter-sm">
                            <div
                              class="col"
                              v-if="isAdd"
                            >
                              <input-label required>Compte principal</input-label>
                              <q-select
                                :readonly="!(!!operation.devise) || !isAdd"
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                outlined
                                dense
                                placeholder="Compte principal"
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                emit-value
                                map-options
                                clearable
                                behavior="menu"
                                v-model="operation.cmpt_initial"
                                :options="comptes"
                                :option-value="opt => opt"
                                :option-label="opt => !!opt? `${opt.indice} - ${opt.intitule}` : ''"
                                @filter="filterComptes"
                                lazy-rules
                                :rules="[ val => !!val || 'Sélectionner un compte']"
                                @input="getNextIndiceCompte"
                              >
                                <template #no-option>
                                  <q-item>
                                    <q-item-section class="text-red">
                                      Aucun compte trouvé
                                    </q-item-section>
                                  </q-item>
                                </template>
                              </q-select>
                            </div>
                            <div class="col">
                              <input-label required>Compte auxiliaire</input-label>
                              <q-input
                                readonly
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.indice"
                                placeholder="Compte auxiliaire"
                                lazy-rules
                                :rules="[ val => val && val.trim().length  >=5 || 'Le compte doit avoir au minimum 5 caractère']"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <input-label required>Intitulé du compte</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="operation.intitule"
                            placeholder="Intitulé du compte"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
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
  name: 'nouveau_compte',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      operation: {
        devise: null
      },

      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedCompte: null,
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
        if (this.selectedCompte != null) {
          this.operation = { ...this.selectedCompte }
        } else {
          this.operation = {}
        }
      }
    },
    'operation.devise': {
      handler (newValue, oldValue) {
        this.$vue.set(this.operation, 'indice', null)
        this.$vue.set(this.operation, 'cmpt_initial', null)
        this.$vue.set(this.operation, 'intitule', null)
      },
      deep: false
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  },
  methods: {

    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        min: 5,
        max: 5,
        poste: null,
        type_compte: null,
        classe: null,
        indice: null
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptesByLength`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.comptes = [] })
      })
    },
    getNextIndiceCompte (e) {
      if (!e) {
        this.operation.indice = null
        return
      }
      let donnees = JSON.stringify({
        indice: e.indice,
        devise: this.operation.devise,
        is_principal: 'NON',
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Compte/generateCompte`

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.$vue.set(this.operation, 'indice', infos.data.generate_compte)
          this.$vue.set(this.operation, 'intitule', e.intitule)
        } else {
          this.$vue.set(this.operation, 'indice', null)
          this.$vue.set(this.operation, 'cmpt_initial', null)
          this.$vue.set(this.operation, 'intitule', null)

          this.$helper.showMessage(infos.data.message, 0, 'bottom')
        }
      }).catch((e) => {
        this.$vue.set(this.operation, 'indice', null)
        this.$vue.set(this.operation, 'cmpt_initial', null)
        this.$vue.set(this.operation, 'intitule', null)
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment44 ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce compte?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.operation,
            poste_str: this.isAdd ? this.operation.cmpt_initial.poste : null,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Compte/${this.isAdd ? 'add' : 'update'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

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
      this.operation = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
