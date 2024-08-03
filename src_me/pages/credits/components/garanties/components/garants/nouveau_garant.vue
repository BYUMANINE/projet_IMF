<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 750px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}garant</div>
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                label="Vider"
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
                icon-right="las la-cloud-upload-alt"
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
            class="row  q-px-md q-py-sm scroll "
            style="max-height:80vh"
          >
            <div class="col">

              <q-form ref="myForm">
                <div class="row q-col-gutter-md ">
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** INFORAMTIONS ******************* -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="col-12">
                    <div class="ba overflow-hidden panel-primary">

                      <div class="q-pa-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12">
                            <div class="row q-col-gutter-md items-center">
                              <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
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
                                      :src="!!garant.new_photo ? garant.new_photo : (!!garant.photo ?  `${URLS.IMG_GARANT}/${garant.photo}` :'statics/images/icone/avatar.png')"
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
                                          v-if="!!garant.new_photo"
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
                              <div class="col-xs-12 col-sm-auto col-md col-lg col-xl q-mt-none q-pt-none">
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
                                      v-model="garant.nom_complet"
                                      placeholder="Nom complet"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                                      maxlength="50"
                                    />
                                  </div>
                                  <div class="col-12">
                                    <input-label>Adresse</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="garant.adresse"
                                      placeholder="Adresse"
                                      lazy-rules
                                      :rules="[ val => !val || val.trim().length > 2 || 'Minimun 3 caractères']"
                                      maxlength="150"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
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
                              v-model="garant.sexe"
                              placeholder="Sexe"
                              lazy-rules
                              :options="['MASCULIN','FEMININ']"
                              :rules="[val => !!val || 'Choisissez le sexe']"
                            />
                          </div>
                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
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
                              v-model="garant.etat_civil"
                              placeholder="Séléctionner l'etat"
                              lazy-rules
                              :options="['CELIBATAIRE','MARIE(E)','VEUF(VE)','DIVORCE(E)']"
                              :rules="[val => !!val || 'Choisissez une option']"
                            />
                          </div>
                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Numéro de téléphone</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="garant.phone"
                              placeholder="Téléphone (Ex.:099 4061 228)"
                              mask="### ### ####"
                              lazy-rules
                              :rules="[ val => !val || (val.trim().length > 11) || 'Minimun 10 caractères']"
                              maxlength="31"
                            />
                          </div>
                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Lieu de naissance</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              placeholder="Lieu de naissance"
                              hide-bottom-space
                              v-model.trim="garant.lieu_naissance"
                              lazy-rules
                              :rules="[ val => !val || (val.trim().length > 3) || 'Minimun 3 caractères']"
                              maxlength="100"
                            />
                          </div>

                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Date de naissance</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="garant.date_naissance"
                              placeholder="Date de naissance"
                              mask="####-##-##"
                              lazy-rules
                              readonly
                              :rules="[val => !!val &&  val.length > 0  || 'Sélectionner une date',
                                           val => this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                              @click="$refs.popup_dt_naissance.show()"
                            >
                              <template #append>
                                <q-icon
                                  class="cursor-pointer"
                                  name="las la-calendar"
                                  style="font-size:25px"
                                >
                                  <q-popup-proxy
                                    transition-show="scale"
                                    transition-hide="scale"
                                    ref="popup_dt_naissance"
                                  >
                                    <q-date
                                      v-model="garant.date_naissance"
                                      mask="YYYY-MM-DD"
                                      @input="() => $refs.popup_dt_naissance.hide()"
                                    />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>

                          <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Signature du garant</input-label>
                            <input
                              type="file"
                              ref="inputSign"
                              style="display:none"
                              @change="onInputSignChange"
                              accept="image/x-png, image/jpg, image/jpeg"
                            >
                            <q-field
                              square
                              outlined
                              dense
                              hide-bottom-space
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >{{(!!garant.new_signature || !!garant.signature) ? 'SIGNATURE JOINTE': 'Non définie'}}</div>
                              </template>
                              <template #prepend>
                                <div>
                                  <q-icon name="las la-signature" />
                                </div>
                              </template>
                              <template #append>
                                <div>
                                  <q-btn
                                    @click="garant.new_signature ? garant.new_signature  = null : $refs.inputSign.click()"
                                    color="white"
                                    text-color="black"
                                    :icon="garant.new_signature ? 'close' :'las la-paperclip'"
                                    unelevated
                                    round
                                    size="12px"
                                  />
                                </div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-12 q-mt-sm">
                            <q-card
                              flat
                              bordered
                            >
                              <q-card-section class="q-pa-none">
                                <div class="q-px-md q-py-sm text-primary">
                                  <strong>Pièces</strong>
                                </div>
                                <q-separator />
                              </q-card-section>
                              <q-card-section>
                                <div class="row q-col-gutter-sm">
                                  <div class="ol-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Type de pièce d'identité</input-label>
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
                                      v-model="garant.type_piece"
                                      placeholder="Type de pièce d'indentité"
                                      lazy-rules
                                      :options="types_pieces"
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    />
                                  </div>
                                  <div class="ol-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Numéro de la pièce</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="garant.num_piece"
                                      placeholder="N* de la pièce"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="100"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Lieu de délivrance</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="garant.lieu_delivrance"
                                      placeholder="Lieu"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="150"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Pièce valide jusqu'au</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model="garant.expiration_piece"
                                      placeholder="Date validité"
                                      mask="####-##-##"
                                      lazy-rules
                                      readonly
                                      :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                                      @click="$refs.popup_dt_piece.show()"
                                    >
                                      <template v-slot:append>
                                        <q-icon
                                          class="cursor-pointer"
                                          name="las la-calendar"
                                          style="font-size:25px"
                                        >
                                          <q-popup-proxy
                                            transition-show="scale"
                                            transition-hide="scale"
                                            ref="popup_dt_piece"
                                          >
                                            <q-date
                                              v-model="garant.expiration_piece"
                                              mask="YYYY-MM-DD"
                                              @input="() => $refs.popup_dt_piece.hide()"
                                            />
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                </div>
                              </q-card-section>
                            </q-card>
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
    <webcamManager
      v-if="showDialogWebcame"
      @onclose="showDialogWebcame = false"
      @onFinish="e=>{garant.new_photo=e;showDialogWebcame = false}"
    />
  </div>
</template>

<script>
import webcamManager from '../../../../../webcam/webcams_manager.vue'

export default {
  name: 'dialogAddUser',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDialogWebcame: false,

      garant: {},
      types_pieces: this.$datas.pieces
    }
  },
  props: {
    value: Boolean,
    selectedGarant: {},
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
        if (this.selectedGarant != null) {
          this.garant = { ...this.selectedGarant }
        } else {
          this.garant = {}
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
    onInputSignChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.garant, 'new_signature', e1.target.result)
              e.target.value = null
              this.$refs.myForm.resetValidation()
              this.$refs.myForm.validate()
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            this.$helper.showMessage('Le format de fichier n\'est pas pris en charge')
          }
        } else {
          this.$helper.showMessage('Séléction de la signature annulée')
        }
      }
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
      this.garant.new_photo = null
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
              this.$vue.set(this.garant, 'new_photo', e1.target.result)
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
    checkform (isSucess) {
      if (isSucess) {
        this.onSubmit()
      }
    },
    onSubmit () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce garant?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          ...this.garant,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Garantie/${this.isAdd ? 'addGarant' : 'updateGarant'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')

            this.$emit('onFinish', true)
            this.viderChamps()
            this.showDialog = false
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'bottom')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.garant = {}
      if (this.$refs.myForm) { this.$refs.myForm.resetValidation() }
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
