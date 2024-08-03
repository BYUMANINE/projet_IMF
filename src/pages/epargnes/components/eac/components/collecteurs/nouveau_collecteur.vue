<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 650px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}collecteur</div>
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
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Nom complet</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="collecteur.nom_complet"
                              placeholder="Nom complet"
                              lazy-rules
                              :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                              maxlength="50"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Adresse</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="collecteur.adresse"
                              placeholder="Adresse"
                              lazy-rules
                              :rules="[ val => !val || val.trim().length > 2 || 'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                              v-model="collecteur.sexe"
                              placeholder="Sexe"
                              lazy-rules
                              :options="['MASCULIN','FEMININ']"
                              :rules="[val => !!val || 'Choisissez le sexe']"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
                              v-model="collecteur.etat_civil"
                              placeholder="Séléctionner l'etat"
                              lazy-rules
                              :options="['CELIBATAIRE','MARIE(E)','VEUF(VE)','DIVORCE(E)']"
                              :rules="[val => !!val || 'Choisissez une option']"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Numéro de téléphone</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="collecteur.phone"
                              placeholder="Téléphone (Ex.:099 4061 228)"
                              mask="### ### ####"
                              lazy-rules
                              :rules="[ val => !val || (val.trim().length > 11) || 'Minimun 10 caractères']"
                              maxlength="31"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Compte epargne associé</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Rechercher un membre"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              clearable
                              behavior="menu"
                              v-model="selectedMembre"
                              :options="membres"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.folio} - ${opt.nom_complet}`"
                              @filter="filterMembres"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner un membre']"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun membre trouvé
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

  </div>
</template>

<script>

export default {
  name: 'dialogAddCollecteur',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      collecteur: {},
      selectedMembre: null,
      membres: []
    }
  },
  props: {
    value: Boolean,
    selectedCollecteur: {},
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
        if (this.selectedCollecteur != null) {
          this.collecteur = { ...this.selectedCollecteur }
          this.selectedMembre = this.selectedCollecteur.membre_coll
        } else {
          this.collecteur = {}
          this.selectedMembre = null
        }
      }
    }
  },
  components: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },

  methods: {
    filterMembres (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only: 'MEMBRE' // Uniquement les membres qui ont un cpt epargne
      })

      let url = `${this.URLS.BASE_URL}/Membre/searchMembres`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.membres = infos.data.records
        })
      }).catch(() => {
        update(() => { this.membres = [] })
      })
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
        message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce collecteur?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          ...this.collecteur,
          id_membre: this.selectedMembre.id,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Collecteur/${this.isAdd ? 'add' : 'update'}/`

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
      this.collecteur = {}
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
