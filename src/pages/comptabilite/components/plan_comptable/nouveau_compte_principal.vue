<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours '}} compte principal</div>
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
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <input-label required>Type compte</input-label>
                          <q-select
                            :readonly="!isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            label="Type de compte"
                            behavior="menu"
                            rounded
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            v-model="operation.type_compte"
                            :option-value="opt => opt"
                            :option-label="opt => opt"
                            :options="optionsTypesComptes"
                            @filter="filterTypesComptes"
                            @input="$vue.set(operation,'classe', null);
                                    $vue.set(operation,'poste', null);
                                    $vue.set(operation,'cmpt_initial', null);"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <input-label required>Classe du compte</input-label>
                          <q-select
                            :readonly="!(!!operation.type_compte) || !isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            label="Classe du compte"
                            behavior="menu"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            v-model="operation.classe"
                            :option-value="opt => opt"
                            :option-label="opt => opt"
                            :options="optionsClasses"
                            @filter="filterClasses"
                            @input="$vue.set(operation,'poste',null);
                                    $vue.set(operation,'cmpt_initial', null);"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Poste de compte </input-label>
                          <q-select
                            :readonly="!(!!operation.classe) || !isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            label="Poste de compte"
                            behavior="menu"
                            rounded
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            v-model="operation.poste"
                            :options="optionsPostes"
                            @input="$vue.set(operation,'cmpt_initial', null);"
                          />
                        </div>
                        <div class="col-12">
                          <div class="row q-col-gutter-sm">
                            <div
                              class="col"
                              v-if="isAdd"
                            >
                              <input-label required>Initiales du compte</input-label>

                              <q-select
                                :readonly="!(!!operation.poste) "
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                outlined
                                dense
                                placeholder="Niveau 1"
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                emit-value
                                map-options
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
                              <input-label required>Compte généré</input-label>
                              <q-input
                                readonly
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.indice"
                                placeholder="Compte généré"
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

      comptes: [],
      optionsTypesComptes: [],
      optionsPostes: [],
      optionsClasses: []

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

    this.optionsPostes = [...this.$datas.postesComptes]
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
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  },
  methods: {

    filterTypesComptes (val, update, abort) {
      let donnees = JSON.stringify({})

      let url = `${this.URLS.BASE_URL}/Compte/searchTypesComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.optionsTypesComptes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.optionsTypesComptes = [] })
      })
    },
    filterClasses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: this.operation.type_compte
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchClassesComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.optionsClasses = infos.data.records
        })
      }).catch(() => {
        update(() => { this.optionsClasses = [] })
      })
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        min: 3,
        max: 3,
        poste: this.operation.poste.value,
        type_compte: this.operation.type_compte,
        classe: this.operation.classe,
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
        is_principal: 'OUI',
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
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce compte?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.operation,
            poste_str: this.operation.poste.value,
            utilisable: 'NON',
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
