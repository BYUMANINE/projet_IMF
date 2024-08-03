<template>
  <q-page class="filly-auto">
    <customerAppBar
      option="PARAMETRES"
      :user="user"
      :selected="null"
    />
    <div class=" q-mt-md ">
      <div class="row q-gutter-md">
        <div
          class="col-4 panel-primary"
          style="padding:2px"
        >

          <div class="bg-blue-1 text-blue text-bold q-pa-sm">
            <div class="row items-center">
              <div class="col">
                AUTRES PARAMETRES
              </div>
              <div class="col-auto">
                <q-btn
                  color="blue-1"
                  text-color="blue"
                  icon="las la-edit"
                  :label="doUpdateOthers?'Annuler':'Editer'"
                  size="11px"
                  class="text-lowercase"
                  rounded
                  unelevated
                  @click="doUpdateOthers=!doUpdateOthers"
                />
              </div>
            </div>
          </div>
          <q-form @submit="onSubmitParams">
            <div class="q-pa-md">

              <div>
                <small>Theme</small>
                <q-select
                  :readonly="!doUpdateOthers"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  v-model.trim="theme"
                  label="Theme"
                  lazy-rules
                  class="mrg"
                  :options="['Noir','Blanc']"
                  :rules="[val => val !== null && val !== '' && val!== undefined || 'Choisissez un theme']"
                >
                  <template v-slot:prepend>
                    <q-avatar
                      color="blue-1"
                      text-color="blue"
                      :icon="theme==='Noir'?'las la-moon':'las la-sun'"
                      size="30px"
                    />
                  </template>
                </q-select>
              </div>

            </div>
            <div
              class="row justify-end q-pa-md"
              v-if="doUpdateOthers"
            >
              <div class="col-auto">
                <q-btn
                  color="blue"
                  text-color="white"
                  rounded
                  type="submit"
                  size="11px"
                  :loading="loading"
                  @click="doUpdateOthers=false"
                >
                  Enregistrer
                  <template v-slot:loading>
                    <q-spinner-ios class="on-left" />
                    En cours...
                  </template>
                </q-btn>
              </div>
            </div>
          </q-form>

        </div>

        <!-- PROFIL -->
        <div
          class="col panel-primary"
          style="padding:2px"
        >
          <div class="bg-blue-1 text-blue text-bold q-pa-sm">
            <div class="row items-center">
              <div class="col">
                MON PROFIL
              </div>
              <div class="col-auto">
                <q-btn
                  color="blue-1"
                  text-color="blue"
                  icon="las la-edit"
                  :label="doUpdateProfil?'Annuler':'Editer'"
                  flat
                  size="11px"
                  class="text-lowercase"
                  rounded
                  unelevated
                  @click="doUpdateProfil=!doUpdateProfil"
                />
              </div>
            </div>
          </div>

          <q-form
            @submit="onSubmitProfil"
            ref="myFormParam"
          >
            <div class="q-pa-md">

              <div class="row q-gutter-md">
                <div class="col">
                  <small>Nom complet</small>
                  <q-input
                    square
                    outlined
                    dense
                    v-model.trim="user.nom_complet"
                    lazy-rules
                    :rules="[
                              val => val && val.trim().length > 0 || 'Ce champs est requis',
                              val => val && val.trim().length > 3 || 'Minimum 4 caractères',
                            ]"
                    :readonly="!doUpdateProfil"
                    maxlength="30"
                  />
                </div>
              </div>

              <div
                class="row items-center bg-blue-1 q-pa-sm q-my-md"
                v-if="doUpdateProfil"
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
                  class="col-auto"
                  left-label
                  v-model="updateConnexion"
                  dense
                />
              </div>
              <div
                class="row q-gutter-md"
                v-if="updateConnexion && doUpdateProfil"
              >
                <div class="col">
                  <small>Nom d'utilisateur <small class="text-grey">(obligatoire)</small></small>
                  <q-input
                    square
                    outlined
                    dense
                    v-model.trim="user.username"
                    lazy-rules
                    :rules="[
                              val => val && val.trim().length > 0 || 'Ce champs est requis',
                              val => val && val.trim().length >= 4 || 'Le nom doit avoir au minimum 4 caractères'
                            ]"
                    :readonly="!doUpdateProfil"
                    maxlength="50"
                  />
                </div>
                <div class="col">
                  <small>Ancien mot de passe <small class="text-grey">(obligatoire)</small></small>
                  <q-input
                    square
                    outlined
                    dense
                    v-model.trim="user.mdp"
                    lazy-rules
                    :rules="[ val => val && val.trim().length > 0 || 'Ce champs est requis']"
                    :readonly="!doUpdateProfil"
                    :type="isPwd ? 'password' : 'text'"
                  >
                    <template
                      v-slot:append
                      v-if="user.mdp && user.mdp.length > 0 "
                    >
                      <q-icon
                        :name="isPwd ? 'las la-eye-slash' : 'las la-eye'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <div
                class="row q-gutter-md"
                v-if="updateConnexion && doUpdateProfil"
              >
                <div class="col">
                  <small>Nouveau mot de passe <small class="text-grey">(facultatif)</small></small>
                  <q-input
                    square
                    outlined
                    dense
                    v-model="user.newMdp"
                    lazy-rules
                    :rules="[
                              val => !val || val && val.length > 7 || 'Minimum 8 caractères',
                            ]"
                    :readonly="!doUpdateProfil"
                    :type="isNewPwd ? 'password' : 'text'"
                    maxlength="15"
                  >
                    <template
                      v-slot:append
                      v-if="user.newMdp && user.newMdp.length > 0 "
                    >
                      <q-icon
                        :name="isNewPwd ? 'las la-eye-slash' : 'las la-eye'"
                        class="cursor-pointer"
                        @click="isNewPwd = !isNewPwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <small>Rétaper le nouveau mot de passe <small
                      v-if="user.newMdp && user.newMdp.length > 0 "
                      class="text-grey"
                    >(obligatoire)</small></small>
                  <q-input
                    square
                    outlined
                    dense
                    v-model="user.newMdpRetape"
                    lazy-rules
                    :rules="[
                              val => !user.newMdp || user.newMdp && user.newMdp.length > 0 && !!val || 'Ce champs est requis',
                              val => !user.newMdp || val === user.newMdp || 'Le deux mot de passe ne sont pas indentiques',
                            ]"
                    :readonly="!doUpdateProfil"
                    :type="isRetapePwd ? 'password' : 'text'"
                    maxlength="15"
                  >
                    <template
                      v-slot:append
                      v-if="user.newMdpRetape && user.newMdpRetape.length > 0 "
                    >
                      <q-icon
                        :name="isRetapePwd ? 'las la-eye-slash' : 'las la-eye'"
                        class="cursor-pointer"
                        @click="isRetapePwd = !isRetapePwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

            </div>
            <div
              class="row justify-end q-pa-md"
              v-if="doUpdateProfil"
            >
              <div class="col-auto">
                <q-btn
                  color="blue"
                  text-color="white"
                  rounded
                  type="submit"
                  size="11px"
                >
                  Enregistrer
                  <template v-slot:loading>
                    <q-spinner-ios class="on-left" />
                    En cours...
                  </template>
                </q-btn>
              </div>
            </div>
          </q-form>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
export default {
  name: 'pageParametre',
  data () {
    return {
      URLS: {},
      user: {},
      doUpdateOthers: false,
      doUpdateProfil: false,
      theme: 'Blanc',
      updateConnexion: false,

      loading: false,
      loadingSave: false,
      isPwd: true,
      isNewPwd: true,
      isRetapePwd: true
    }
  },
  watch: {

    theme: {
      handler (newValue, oldValue) {
        localStorage.setItem(this.$helper.PREF_THEME, newValue === 'Noir' ? 'Dark' : 'White')
        this.$q.dark.set(newValue === 'Noir')
      }
    },
    doUpdateProfil: {
      handler (newValue, oldValue) {
        this.onCancel()
        if (!newValue) {
          this.user = this.$helper.getConnectedUser()
          this.updateConnexion = false
        }
      }
    },
    updateConnexion: {
      handler (newValue, oldValue) {
        this.onCancel()
      }
    }
  },
  mounted () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.theme = (this.$helper.isDark() ? 'Noir' : 'Blanc')

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.user = this.user
    }
  },
  destroyed: function () {

  },
  computed: {

  },
  methods: {

    onSubmitParams () {
      this.saveLocalParams()
    },
    saveLocalParams () {
      if (this.theme) {
        localStorage.setItem(this.$helper.PREF_THEME, this.theme === 'Noir' ? 'Dark' : 'White')
        this.$q.dark.set(this.theme === 'Noir')
      }
    },

    onSubmitProfil () {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: 'Souhaitez-vous enregistrer ces modifications ?',
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
          this.loadingSave = true

          let datas = {
            id_agent: this.user.id_agent,
            nom_complet: this.user.nom_complet,
            updateConnexion: this.updateConnexion ? 'OUI' : 'NON'
          }

          if (this.updateConnexion) {
            datas.username = this.user.username
            datas.password = this.user.mdp
            if (this.user.newMdp !== undefined && this.user.newMdp != null && this.user.newMdp.length > 0) {
              datas.new_password = this.user.newMdp
            }
          }

          let url = `${this.URLS.BASE_URL}/Utilisateur/updateProfil/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: JSON.stringify(datas) }))
            .then(infos => {
              this.$q.loading.hide()
              this.loadingSave = false

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1, 'center')
                this.onCancel()
                localStorage.setItem(this.$helper.PREF_USER, JSON.stringify(this.user))
                this.doUpdateProfil = false
              } else {
                this.$helper.showMessage(
                  infos.data.message,
                  0,
                  'center'
                )
              }
            })
            .catch(e => {
              this.$q.loading.hide()
              this.loadingSave = false
              this.$helper.showMessage()
            })
        })
    },
    onCancel () {
      this.$vue.delete(this.user, 'mdp')
      this.$vue.delete(this.user, 'newMdp')
      this.$vue.delete(this.user, 'newMdpRetape')
    }

  }
}
</script>

<style>
</style>
