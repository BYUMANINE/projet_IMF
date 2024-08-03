<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="()=>{}"
      />
      <menu-option
        :text="modeEdit?'Quitter l\'edition':'Editer mon profil'"
        :icon="modeEdit?'clear.png':'edit.png'"
        @option-clicked="modeEdit=!modeEdit; updateConnexion=false"
      />
      <menu-option
        :disable="!modeEdit"
        text="Mettre à jour"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(onSubmit)"
      />
    </list-menu-options>
    <div class="ba overflow-hidden panel-primary">

      <div class="q-pa-md">

        <q-form ref="myForm">
          <div class="row justify-center">
            <div class="col-12">
              <div
                class="q-mb-sm"
                v-if="modeEdit"
              >
                <consigne title="Remarques">
                  * Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires<br>
                  * Rassurez-vous d'avoir completé toutes les informations requises avant d'enregistrer
                </consigne>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                  <q-card
                    flat
                    bordered
                    class="panel-primary"
                  >
                    <q-card-section>
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
                              <div
                                v-if="modeEdit"
                                style="position:absolute;bottom:-10px;left:0;right:0;z-index:2"
                              >
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
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl q-pt-none">
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12 col-xl-12">
                              <input-label :required="modeEdit">Nom complet</input-label>
                              <q-input
                                :readonly="!modeEdit"
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="utilisateur.nom_complet"
                                placeholder="Nom *"
                                lazy-rules
                                :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                                class="mrg"
                              />
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12 col-xl-12">
                              <input-label :required="modeEdit">Sexe</input-label>
                              <q-select
                                :readonly="!modeEdit"
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
                                label="Sexe"
                                lazy-rules
                                class="mrg"
                                :options="['MASCULIN','FEMININ']"
                                :rules="[val => !!val || 'Choisissez le sexe']"
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                      <div class="row q-col-gutter-sm">
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Numéro de téléphone</input-label>
                          <q-input
                            :readonly="!modeEdit"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="utilisateur.phone"
                            placeholder="Téléphone (Ex.:099 4061 228)"
                            mask="### ### ####"
                            lazy-rules
                            :rules="[ val => !val || (val.trim().length > 11) || 'Minimun 10 caractères']"
                            class="mrg"
                            maxlength="31"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label :required="modeEdit">Etat civil</input-label>
                          <q-select
                            :readonly="!modeEdit"
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
                          <input-label>Adresse</input-label>
                          <q-input
                            :readonly="!modeEdit"
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
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label :required="modeEdit">Type utilisateur</input-label>
                          <!-- v-model.trim="utilisateur.type.designation" -->

                          <q-input
                            readonly
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="utilisateur.type"
                            placeholder="Type utilisateur"
                            class="mrg"
                          />
                        </div>
                        <div class="col-12">
                          <input-label>Agence d'ouverture par défaut</input-label>
                          <q-select
                            :readonly="!modeEdit"
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
                            clearable
                            v-model="utilisateur.agence_default"
                            :options="agences"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.designation}`"
                            @filter="filterAgences"
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
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
                  <q-card
                    flat
                    bordered
                    class="panel-primary"
                  >
                    <q-card-section>
                      <div
                        class="row items-center bg-blue-1 q-pa-sm q-my-md"
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
                          <div class="text-bold q-mb-xs">Modifier les identifiants de connexion ?</div>
                          <small class="text-grey">Cocher la case à droite si oui</small>
                        </div>
                        <q-checkbox
                          :disable="!modeEdit"
                          class="col-auto"
                          left-label
                          v-model="updateConnexion"
                          dense
                        />
                      </div>
                      <div
                        :disabled="!updateConnexion "
                        class="row q-col-gutter-sm"
                      >
                        <div class="col-12">
                          <input-label :required="modeEdit">Nom d'utilisateur</input-label>
                          <q-input
                            :readonly="!updateConnexion"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model="utilisateur.username"
                            placeholder="Nom d'utilisateur"
                            lazy-rules
                            :rules="[ val => !updateConnexion || (val && val.trim().length > 3) || 'Minimun 3 caractères']"
                            class="mrg"
                          />
                        </div>
                        <div class="col-12">
                          <input-label :required="modeEdit">Ancien mot de passe</input-label>
                          <q-input
                            :readonly="!updateConnexion"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="utilisateur.password"
                            placeholder="Mot de passe"
                            lazy-rules
                            :rules="[ val => !updateConnexion || (!!val) || 'Champs obligatoire']"
                            class="mrg"
                            type="password"
                          />
                        </div>
                        <div class="col-12">
                          <input-label>Nouveau mot de passe</input-label>
                          <q-input
                            :readonly="!updateConnexion"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="utilisateur.new_password"
                            placeholder="Nouveau de passe"
                            lazy-rules
                            :rules="[ val => !updateConnexion || (!val || (!!val && val.trim().length >= 8)) || 'Minimun 8 caractères']"
                            class="mrg"
                            type="password"
                          />
                        </div>
                        <div class="col-12">
                          <input-label>Retaper le nouveau mot de passe</input-label>
                          <q-input
                            :readonly="!updateConnexion"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="utilisateur.new_password_retape"
                            placeholder="Retaper le mot de passe"
                            lazy-rules
                            :rules="[ val => !updateConnexion || ( !utilisateur.new_password || (!!utilisateur.new_password && utilisateur.new_password == val)) || 'Mot de passe non identique']"
                            class="mrg"
                            type="password"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <webcamManager
      v-if="showDialogWebcame"
      @onclose="showDialogWebcame = false"
      @onFinish="e=>{utilisateur.new_photo=e;showDialogWebcame = false}"
    />

  </q-page>
</template>
<script>
import webcamManager from '../../../webcam/webcams_manager.vue'

export default {
  name: 'monCompte',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      utilisateur: {},
      updateConnexion: false,
      modeEdit: false,
      showDialogWebcame: false,

      agences: []

    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    if (this.user) {
      this.utilisateur = this.user
    }
  },
  mounted: function () {
    document.addEventListener('keydown', this.initialiseShortcut, false)

    if (this.user === null) {
      this.$router.push('/')
    }
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  filters: {},
  watch: {

  },
  components: {
    webcamManager
  },
  computed: {

  },
  methods: {
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
    filterAgences (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Agence/searchAgencesOfAgent`
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
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Mise à jour en cours...',
          message: `Souhaitez-vous enregistrer les modifications apportées à votre compte?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          this.utilisateur.updateConnexion = this.updateConnexion

          let donnees = JSON.stringify({
            ...this.utilisateur,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Utilisateur/update_compte/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              // this.$helper.showMessage(infos.data.message, 1, 'center')
              this.viderChamps()

              this.$q.notify({
                position: 'bottom-right',
                message: 'Vous devez vous reconnecter pour permettre le système d\'appliquer les midifications effectuées sur votre compte. ',

                icon: 'las la-sign-out-alt',
                progress: true,
                actions: [
                  { label: 'Plus tard', color: 'yellow', handler: () => { /* ... */ } },
                  {
                    label: 'Déconnexion',
                    color: 'white',
                    handler: () => {
                      this.$helper.deconnexion()
                      this.$router.push('/')
                    }
                  }
                ]
              })
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
      this.modeEdit = false
      this.updateConnexion = false
      this.utilisateur.password = null
      this.utilisateur.new_password = null
      this.utilisateur.new_password_retape = null
    }
  }

}
</script>
<style lang="stylus"></style>
