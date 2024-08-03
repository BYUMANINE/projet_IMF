<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">{{isAdd?'Nouvel ': 'Mise à jour de l\''}}utilisateur</div>
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                :label="`${step == 2 || !isAdd ? 'Etape précédente' : ''}`"
                :icon="`${step  == 2 || !isAdd ? 'las la-arrow-left' : 'las la-broom'}`"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="step == 2 || !isAdd ? pevStep() : viderChamps()"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                :label="`${step   == 2 || !canBeConnected ? 'Enregistrer': 'Etape suivante'}`"
                :icon-right="step == 2 || !canBeConnected ? 'las la-cloud-upload-alt' : 'las la-arrow-right'"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="$refs.myForm.validate().then(checkform)"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
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
            style="max-height:80vh"
          >
            <div class="col">

              <q-stepper
                v-model="step"
                ref="stepper"
                color="primary"
                class="q-pa-none panel-primary q-pa-none-xs-stepper"
                transition-next="fade"
                transition-prev="fade"
                flat
                bordered
              >
                <q-step
                  :name="1"
                  title="Infos de l'utilisateur"
                  prefix="1"
                  :done="step > 1"
                  :disable="loadingInit"
                >
                  <q-form ref="myForm">
                    <div class="row">
                      <!-- ******************************************* -->
                      <!-- ******************************************* -->
                      <!-- ************** INFORAMTIONS ******************* -->
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
                                <div class="row q-col-gutter-md items-center">
                                  <div class="col-xs-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto">
                                    <div class="text-center">
                                      <input
                                        ref="fileComputer"
                                        type="file"
                                        @change="onInputFileChange"
                                        style="display:none"
                                        accept="image/x-png, image/jpg, image/jpeg"
                                      >
                                      <div class="relative-position contStylephoto">
                                        <q-img
                                          :src="!!utilisateur.new_photo ? utilisateur.new_photo : (!!utilisateur.photo ?  `${URLS.IMG_AGENT}/${utilisateur.photo}` :'statics/images/icone/avatar.png')"
                                          spinner-color="white"
                                          spinner-size="35px"
                                          class="stylePhoto bg-blue-1"
                                        />
                                        <div style="position:absolute;bottom:-10px;left:0;right:0;z-index:2">
                                          <div class="row q-col-gutter-sm justify-center items-center">
                                            <div class="col-auto">
                                              <q-btn
                                                text-color="blue"
                                                color="white"
                                                size="11px"
                                                round
                                                @click="choosePhoto()"
                                              >
                                                <q-icon
                                                  class="las la-camera"
                                                  size="17px"
                                                />
                                              </q-btn>
                                            </div>
                                            <div
                                              class="col-auto"
                                              v-if="!!utilisateur.new_photo"
                                            >
                                              <q-btn
                                                text-color="blue"
                                                color="white"
                                                size="11px"
                                                round
                                                @click="clearPhoto()"
                                              >
                                                <q-icon
                                                  class="las la-times"
                                                  size="17px"
                                                />
                                              </q-btn>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl q-mt-none q-pt-none">
                                    <div class="row q-col-gutter-sm items-center">
                                      <div class="col-12">
                                        <input-label
                                          required
                                          info="Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires"
                                        >Nom complet</input-label>
                                        <q-input
                                          square
                                          outlined
                                          dense
                                          hide-bottom-space
                                          v-model="utilisateur.nom_complet"
                                          placeholder="Nom complet"
                                          lazy-rules
                                          :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                                          maxlength="50"
                                        />
                                      </div>
                                      <div class="col-12">
                                        <input-label required>Sexe</input-label>
                                        <q-select
                                          transition-show="scale"
                                          transition-hide="scale"
                                          square
                                          outlined
                                          dense
                                          hide-bottom-space
                                          hide-selected
                                          use-input
                                          fill-input
                                          v-model="utilisateur.sexe"
                                          placeholder="Sexe"
                                          lazy-rules
                                          :options="['MASCULIN','FEMININ']"
                                          :rules="[val => !!val || 'Choisissez le sexe']"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <input-label required>Etat civil</input-label>
                                <q-select
                                  :disable="loading"
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  hide-selected
                                  use-input
                                  fill-input
                                  v-model="utilisateur.etat_civil"
                                  placeholder="Séléctionner l'etat"
                                  lazy-rules
                                  :options="['CELIBATAIRE','MARIE(E)','VEUF(VE)','DIVORCE(E)']"
                                  :rules="[val => !!val || 'Choisissez une option']"
                                />
                              </div>
                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <input-label>Numéro de téléphone</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="utilisateur.phone"
                                  placeholder="Téléphone (Ex.:099 4061 228)"
                                  mask="### ### ####"
                                  lazy-rules
                                  :rules="[ val => !val || (val.trim().length > 11) || 'Minimun 10 caractères']"
                                  maxlength="31"
                                />
                              </div>
                              <div class="col-xs-12 col-sm-6 col-md col-lg col-xl">
                                <input-label>Adresse</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="utilisateur.adresse"
                                  placeholder="Adresse"
                                  lazy-rules
                                  :rules="[ val => !val || val.trim().length > 2 || 'Minimun 3 caractères']"
                                  maxlength="150"
                                />
                              </div>
                              <div
                                v-if="isAdd"
                                class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
                              >
                                <input-label required>Type utilisateur</input-label>
                                <q-select
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Sélectionner un type"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  v-model="utilisateur.type"
                                  :options="typesUtilisateurs"
                                  :option-value="opt => opt"
                                  :option-label="opt => `${opt.designation}`"
                                  @filter="filterTypes"
                                  lazy-rules
                                  :rules="[val =>!!val || 'Sélectionner une option']"
                                  @click="onTypeSelected"
                                >
                                  <template v-slot:no-option>
                                    <q-item>
                                      <q-item-section class="text-red">
                                        Aucun resultat trouvé
                                      </q-item-section>
                                    </q-item>
                                  </template>
                                </q-select>
                              </div>
                              <div
                                v-if="isAdd"
                                class="col-12"
                              >
                                <input-label required>Agence à laquelle appartient l'utilisateur</input-label>
                                <q-select
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Sélectionner une agence"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  v-model="utilisateur.agence"
                                  :options="agences"
                                  :option-value="opt => opt"
                                  :option-label="opt => `${opt.designation}`"
                                  @filter="filterAgences"
                                  lazy-rules
                                  :rules="[val =>!!val || 'Sélectionner une agence']"
                                >
                                  <template v-slot:no-option>
                                    <q-item>
                                      <q-item-section class="text-red">
                                        Aucun resultat trouvé
                                      </q-item-section>
                                    </q-item>
                                  </template>
                                </q-select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 q-my-md">
                        <div
                          class="row items-center bg-blue-1 q-pa-sm"
                          style="border-left:2px solid #2196f3"
                        >
                          <div class="col-auto q-pr-md">
                            <q-avatar
                              color="blue"
                              text-color="white"
                              icon="las la-info"
                              size="20px"
                            />
                          </div>
                          <div
                            class="col"
                            style="font-size:12px"
                          >
                            <div class="text-bold q-mb-xs">Connexion au systeme</div>
                            <small class="text-grey">Permettre à cet utilisateur de se connecter au systeme ?</small>
                          </div>
                          <q-checkbox
                            class="col-auto"
                            left-label
                            v-model="canBeConnected"
                            dense
                          />
                        </div>
                      </div>
                      <div
                        class="col-12"
                        v-if=" !!canBeConnected"
                      >
                        <div class="ba overflow-hidden panel-primary">
                          <div
                            class="q-py-xs q-px-sm text-h6"
                            style="font-size:14px"
                          >IDENTIFIANTS DE CONNEXION</div>
                          <q-separator />
                          <div class="q-pa-md">
                            <div class="row q-col-gutter-sm">
                              <div class="col-12">
                                <input-label required>Nom d'utilisateur</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="utilisateur.username"
                                  placeholder="Adresse e-mail"
                                  lazy-rules
                                  :rules="[ val => !!val && this.$helper.isMail(val) || 'Adresse mail invalide']"
                                  maxlength="150"
                                />
                              </div>
                              <div
                                v-if="utilisateur.can_login == 'NON' || isAdd"
                                class="col-12"
                              >
                                <q-card
                                  bordered
                                  flat
                                  class="radius-none"
                                >
                                  <q-item>
                                    <q-item-section avatar>
                                      <q-avatar
                                        color="primary"
                                        text-color="white"
                                        icon="las la-key"
                                      />
                                    </q-item-section>
                                    <q-item-section>
                                      <q-item-label>Mot de passe : <strong>{{utilisateur.password}}</strong></q-item-label>
                                      <q-item-label
                                        caption
                                        lines="2"
                                      >Ce mot de passe sera envoyé par email à l'utilisateur créé </q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                      <div>
                                        <q-btn
                                          color="blue-1"
                                          text-color="primary"
                                          icon="las la-sync"
                                          round
                                          unelevated
                                          size="sm"
                                          @click="generatePassword()"
                                        >
                                          <q-tooltip>
                                            Générer un autre mot de passe
                                          </q-tooltip>

                                        </q-btn>
                                        <q-btn
                                          color="blue-1"
                                          text-color="primary"
                                          icon="las la-copy"
                                          round
                                          unelevated
                                          size="sm"
                                          class="q-ml-md"
                                          @click="$helper.copy(utilisateur.password)"
                                        >
                                          <q-tooltip>
                                            Copier le mot de passe dans le presse-papiers
                                          </q-tooltip>

                                        </q-btn>
                                      </div>
                                    </q-item-section>
                                  </q-item>
                                </q-card>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </q-form>
                </q-step>
                <q-step
                  :name="2"
                  title="Droits d'accès au système"
                  prefix="2"
                  :done="step > 2"
                  :disable="loadingInit"
                >
                  <q-form ref="myForm">
                    <!-- <itemDroitsAcces
                    :selectedUser="utilisateur"
                    @onChange="e=>utilisateur.droits=e"
                  /> -->
                  </q-form>
                </q-step>
              </q-stepper>
              <div
                class="row"
                v-if="loadingInit"
              >
                <div class="col">
                  <div class="q-pa-xl text-center">
                    <q-spinner-ios
                      color="primary"
                      size="2em"
                    />
                    <div class="q-mt-md"><strong>{{message}}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

    <webcamManager
      v-if="showDialogWebcame"
      @onclose="showDialogWebcame = false"
      @onFinish="e=>{utilisateur.new_photo=e;showDialogWebcame = false}"
    />
  </div>
</template>

<script>

// import itemDroitsAcces from '../../parametres/components/droits_acces/item_droits_acces.vue'
import webcamManager from '../../../../../webcam/webcams_manager.vue'

export default {
  name: 'dialogAddUser',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      loadingInit: false,
      canBeConnected: false,
      showDialogWebcame: false,

      step: 1,

      message: 'Chargement en cours...',
      utilisateur: {},

      typesUtilisateurs: [],
      agences: [],
      droits: []
    }
  },
  props: {
    value: Boolean,
    selectedUser: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedUser != null) {
          this.utilisateur = { ...this.selectedUser }
          this.canBeConnected = this.utilisateur.can_login === 'OUI'
          this.$vue.set(this.utilisateur, 'password', this.utilisateur.can_login === 'OUI' ? null : this.$helper.autoGenerateCleComplexe(10))
        } else {
          this.utilisateur = {
            droits: null
          }

          this.$vue.set(this.utilisateur, 'password', this.$helper.autoGenerateCleComplexe(10))

          this.canBeConnected = false
        }
      }
    }
  },
  components: {
    webcamManager
    // itemDroitsAcces
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },

  methods: {
    generatePassword () {
      this.$vue.set(this.utilisateur, 'password', this.$helper.autoGenerateCleComplexe(10))
    },
    choosePhoto () {
      this.$q.bottomSheet({
        message: 'Mode de selection image',
        grid: false,
        actions: [
          {},
          {
            label: 'Capturer via le webcam',
            img: 'statics/images/icone/photo.png',
            id: 'camera'
          },
          {
            label: 'Sélectionner une image existante',
            img: 'statics/images/icone/image.png',
            id: 'storage'
          }

        ]
      }).onOk(action => {
        if (action.id === 'camera') {
          this.showDialogWebcame = true
        } else if (action.id === 'storage') {
          this.$refs.fileComputer.click()
        }
      })
    },
    clearPhoto () {
      this.utilisateur.new_photo = null
      this.$forceUpdate()
    },
    onInputFileChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.utilisateur, 'new_photo', e1.target.result)
              e.target.value = null
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            this.$helper.showMessage('Le format de fichier n\'est pas pris en charge')
          }
        } else {
          this.$helper.showMessage('Séléction de la photo annulée')
        }
      }
    },
    onTypeSelected (e) {
      if (e) {
        this.getDroitsAndTypeUser(e)
      }
    },
    filterTypes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        exclude: ['COLLECTEUR']
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchTypesAgents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.typesUtilisateurs = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.typesUtilisateurs = []
        })
      })
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
    getDroitsAndTypeUser (e) {
      let donnees = JSON.stringify({
        ...e,
        id_agent: this.user.id
      })
      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Utilisateur/getDroitsOfTypeUser`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        this.$helper.checkResponse(infos.data)

        if (this.$helper.isNotEmpty(infos.data.records)) {
          this.utilisateur.droits = infos.data.records.droits
        } else {
          this.utilisateur.droits = []
          this.$vue.set(this.utilisateur, 'type', null)
        }
      }).catch(() => {
        this.$vue.set(this.utilisateur, 'type', null)
        this.$q.loading.hide()
        this.utilisateur.droits = []
      })
    },
    checkform (isSucess) {
      if (isSucess) {
        /* Si one souhaite erengsitrer un utilisateur de type site minier,
          on a pas besoin de demander de definir les droits d'accès systeme
          pusque ce genre d'utilisateur n'acceder pas au systeme web */

        if (this.step === 1 && !this.canBeConnected) {
          this.onSubmit()
        } else if (this.step === 1) {
          /* if (this.utilisateur.droits != null) {
            this.step = 2
          } else {
            this.$helper.showMessage("La page n'a pas été correctement chargé; Veuillez actualiser pour recuperer les infos nécessaire à la création d'un compte utilisateur")
          } */
          this.onSubmit()
        } else if (this.step === 2) {
          this.onSubmit()
        }
      }
    },
    onSubmit () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} cet utilisateur?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          ...this.utilisateur,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          can_log_checked: this.canBeConnected ? 'OUI' : 'NON'
        })

        this.message = 'Enregistrement en cours...'
        this.loading = true
        let url = `${this.URLS.BASE_URL}/Utilisateur/${this.isAdd ? 'add' : 'update'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')

            this.$emit('onFinish', true)
            this.viderChamps()
            this.showDialog = false
          } else {
            this.utilisateur.droits = this.droits
            this.$helper.showMessage(infos.data.message, 0, 'bottom')
          }
        }).catch((e) => {
          this.utilisateur.droits = this.droits
          this.loading = false
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.utilisateur = {
        droits: null
      }
      if (this.$refs.myForm) { this.$refs.myForm.resetValidation() }
    },
    pevStep () {
      if (this.step > 1) {
        this.step--
      }
    }

  }

}
</script>

<style lang="stylus">
.fixed-head .head-1 th
  position sticky
  top 0
  z-index 1000
  background-color white
</style>
