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
              <div class="text-h6">{{isAdd?'Nouvelle ': 'Mise à jours de l\''}}affectation</div>
            </div>
            <div
              class="col-auto"
              v-if="step > 0"
            >
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                :label="`${isLast || !isAdd ? 'Etape précédente' : ''}`"
                :icon="`${isLast || !isAdd ? 'las la-arrow-left' : 'las la-broom'}`"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="isLast || !isAdd ? pevStep() : viderChamps()"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                :label="`${isLast   ? 'Enregistrer': 'Etape suivante'}`"
                :icon-right="isLast ? 'las la-cloud-upload-alt' : 'las la-arrow-right'"
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

              <q-stepper
                v-model="step"
                ref="stepper"
                color="primary"
                class="q-pa-none panel-primary"
                transition-next="fade"
                transition-prev="fade"
                flat
                bordered
              >
                <q-step
                  :name="1"
                  title="Infos sur l'affectation"
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
                          >INFORMATIONS SUR L'AFFECTATION</div>
                          <q-separator />
                          <div class="q-pa-md">
                            <div class="row q-col-gutter-sm">
                              <div
                                class="col-12"
                                v-if="selectedLigne && selectedLigne.agent"
                              >
                                <q-list bordered>
                                  <q-item>
                                    <q-item-section avatar>
                                      <div
                                        class="color-gradient text-center"
                                        style="padding:3px; width:61px;margin:auto"
                                      >
                                        <q-img
                                          :src="!!selectedLigne.agent.photo ?  `${URLS.IMG_AGENT}/${selectedLigne.agent.photo}` :'statics/images/icone/avatar.png'"
                                          spinner-color="blue"
                                          spinner-size="15px"
                                          class="panel-primary"
                                          style="height: 55px; width: 55px;"
                                        />
                                      </div>
                                    </q-item-section>
                                    <q-item-section>
                                      <q-item-label class="text-bold">{{selectedLigne.agent.nom_complet}}</q-item-label>
                                      <q-item-label
                                        caption
                                        lines="2"
                                      >{{selectedLigne.agent.sexe}}</q-item-label>
                                    </q-item-section>
                                  </q-item>
                                </q-list>

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
                                  v-model="affectation.agence"
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
                              <div
                                class="col-12"
                                v-if="!isAdd"
                              >
                                <input-label>Agence d'affectation</input-label>
                                <div class="text-details"> {{affectation.agence_str}}</div>
                              </div>
                              <div class="col-12">
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
                                  v-model="affectation.type"
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

                              <div class="col-12">
                                <div class="row q-col-gutter-sm">
                                  <div class="col">
                                    <input-label>Heures de début connexion</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      readonly
                                      hide-bottom-space
                                      v-model="affectation.heure_debut"
                                      placeholder="Heure début"
                                      mask="time"
                                      lazy-rules
                                      :rules="[val => (!val && $helper.isEmpty(affectation.heure_fin)) || !!val  || 'Sélectionner la date']"
                                      clearable
                                      @click="$refs.poup_time_debut.show()"
                                    >
                                      <template v-slot:append>
                                        <q-icon
                                          name="access_time"
                                          class="cursor-pointer"
                                        >
                                          <q-popup-proxy
                                            cover
                                            transition-show="scale"
                                            transition-hide="scale"
                                            ref="poup_time_debut"
                                          >
                                            <q-time
                                              format24h
                                              v-model="affectation.heure_debut"
                                              @input="$refs.poup_time_debut.hide()"
                                            >
                                              <div class="row items-center justify-end">
                                                <q-btn
                                                  v-close-popup
                                                  label="Close"
                                                  color="primary"
                                                  flat
                                                />
                                              </div>
                                            </q-time>
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                  <div class="col">
                                    <input-label>Heures de fin connexion</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      readonly
                                      hide-bottom-space
                                      v-model="affectation.heure_fin"
                                      placeholder="Heure fin"
                                      mask="time"
                                      lazy-rules
                                      :rules="[val => (!val && $helper.isEmpty(affectation.heure_debut)) || !!val  || 'Sélectionner la date',
                                               val => (!val && $helper.isEmpty(affectation.heure_debut)) || !!val && affectation.heure_debut < affectation.heure_fin || 'L\'heure de début doit être inferieure à l\'heure de la fin']"
                                      clearable
                                      @click="$refs.poup_time_fin.show()"
                                    >
                                      <template v-slot:append>
                                        <q-icon
                                          name="access_time"
                                          class="cursor-pointer"
                                        >
                                          <q-popup-proxy
                                            cover
                                            transition-show="scale"
                                            transition-hide="scale"
                                            ref="poup_time_fin"
                                          >
                                            <q-time
                                              format24h
                                              v-model="affectation.heure_fin"
                                              @input="$refs.poup_time_fin.hide()"
                                            >
                                              <div class="row items-center justify-end">
                                                <q-btn
                                                  v-close-popup
                                                  label="Close"
                                                  color="primary"
                                                  flat
                                                />
                                              </div>
                                            </q-time>
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                </div>
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
                    :selectedLigne="affectation"
                    @onChange="e=>affectation.droits=e"
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
  </div>
</template>

<script>

// import itemDroitsAcces from '../../parametres/components/droits_acces/item_droits_acces.vue'

export default {
  name: 'dialogAddUser',
  data () {
    return {

      loading: false,
      loadingInit: false,
      showDialogWebcame: false,

      step: 1,

      message: 'Chargement en cours...',
      affectation: {},

      typesUtilisateurs: [],
      agences: [],
      droits: []
    }
  },
  props: {
    value: Boolean,
    selectedLigne: {},
    isAdd: {
      type: Boolean,
      default: false
    },
    URLS: {},
    user: {}
  },
  beforeMount () { },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedLigne && this.selectedLigne.affectation) {
          this.affectation = { ...this.selectedLigne.affectation }
        } else {
          this.affectation = {
            droits: null
          }
        }
      }
    }
  },
  components: {

    // itemDroitsAcces
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    isLast () {
      return this.step === 2
    }
  },

  methods: {

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
          this.affectation.droits = infos.data.records.droits
        } else {
          this.affectation.droits = []
          this.$vue.set(this.affectation, 'type', null)
        }
      }).catch(() => {
        this.$vue.set(this.affectation, 'type', null)
        this.$q.loading.hide()
        this.affectation.droits = []
      })
    },
    checkform (isSucess) {
      if (isSucess) {
        if (this.step === 1) {
          //   this.step += 1
          this.onSubmit()
        } else if (this.step === 2) {
          //   this.onSubmit()
        }
      }
    },
    onSubmit () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} cette affectation?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          ...this.affectation,
          id_agent: this.selectedLigne.agent.id,
          is_add: this.isAdd
        })

        this.message = 'Enregistrement en cours...'
        this.loading = true
        let url = `${this.URLS.BASE_URL}/Utilisateur/saveOrUpdateAffectation`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')

            this.$emit('onFinish', true)
            this.viderChamps()
            this.showDialog = false
          } else {
            this.affectation.droits = this.droits
            this.$helper.showMessage(infos.data.message, 0, 'bottom')
          }
        }).catch((e) => {
          this.affectation.droits = this.droits
          this.loading = false
          this.$helper.showMessage()
        })
      })
    },

    viderChamps () {
      this.affectation = {
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
