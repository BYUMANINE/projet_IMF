<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Nouvelle affectation</div>
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
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col">
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >
                      INFORMATIONS
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <q-list bordered>
                            <q-item>
                              <q-item-section avatar>
                                <div
                                  class="color-gradient text-center"
                                  style="padding:3px; width:61px;margin:auto"
                                >
                                  <q-img
                                    :src="!!affectation.agent && !!affectation.agent.photo ?  `${URLS.IMG_AGENT}/${affectation.agent.photo}` :'statics/images/icone/avatar.png'"
                                    spinner-color="blue"
                                    spinner-size="15px"
                                    class="panel-primary"
                                    style="height: 55px; width: 55px;"
                                  />
                                </div>
                              </q-item-section>
                              <q-item-section>
                                <q-item-label class="text-bold">{{affectation.agent ? affectation.agent.nom_complet : 'xxxxxxxxxxxxxxxxxx'}}</q-item-label>
                                <q-item-label
                                  caption
                                  lines="1"
                                ><strong>CODE :</strong> {{affectation.agent ? affectation.agent.folio : 'xxxxxxxx'}}</q-item-label>
                                <q-item-label
                                  caption
                                  lines="1"
                                ><strong>SEXE :</strong> {{affectation.agent ? affectation.agent.sexe : 'xxxxxxxx'}}</q-item-label>

                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                        <div class="col-12">
                          <input-label>Agent en charge (Caissier)</input-label>
                          <q-select
                            :disable="loading || !isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner un agent"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            clearable
                            map-options
                            v-model="affectation.agent"
                            :options="agents"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.nom_complet}`"
                            @filter="filterAgents"
                            lazy-rules
                            :rules="[ val => !val || !!val || 'Sélectionner une option']"
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucun caissier trouvé
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-12">
                          <input-label>Caisses</input-label>
                          <q-select
                            :disable="loading"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner une caisse"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            clearable
                            map-options
                            v-model="affectation.caisse"
                            :options="caisses"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.designation}`"
                            @filter="filterCaisses"
                            lazy-rules
                            :rules="[ val => !val || !!val || 'Sélectionner une option']"
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucune caisse trouvée
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div
                          class="col-12 "
                          v-if="!isAdd"
                        >
                          <input-label>Etat</input-label>
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
                            v-model="affectation.status"
                            placeholder="Etat"
                            lazy-rules
                            :options="['ACTIF', 'INACTIF']"
                            :rules="[val => !!val || 'Choisissez une option']"
                          />
                        </div>
                        <div
                          class="col-12 "
                          v-if="!isAdd"
                        >
                          <input-label>Date et heure de la dernière affectation</input-label>
                          <q-input
                            readonly
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="affectation.created_at_str"
                            placeholder="Date et heure"
                            lazy-rules
                            :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
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
  name: 'dialogAffectationCaisse',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      affectation: {},

      agents: [],
      caisses: []
    }
  },
  props: {
    value: Boolean,
    selectedAffectation: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedAffectation != null) {
          this.affectation = { ...this.selectedAffectation }
        } else {
          this.affectation = {}
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
    filterAgents (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchUtilisateurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.agents = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.agents = []
        })
      })
    },
    filterCaisses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agence: this.user.agence.id,
        devise: this.user.devise
      })

      let url = `${this.URLS.BASE_URL}/Caisse/searchCaisses`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.caisses = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.caisses = []
        })
      })
    },

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
          message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer cette affectation ?' : 'Souhaitez-vous vraiment modifier les infos de cette affectation ?'}`,
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            ...this.affectation
          })

          this.loading = true

          let url = `${this.URLS.BASE_URL}/Caisse/addAffectation/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.$helper.checkResponse(infos.data)

            this.loading = false

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false
              this.viderChamps()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'center')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    },
    viderChamps () {
      this.affectation = {}
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style lang="stylus"></style>
