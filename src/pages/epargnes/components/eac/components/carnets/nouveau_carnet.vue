<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Nouveau carnet</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="las la-broom"
              label="Vider"
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

        <q-form ref="myForm">
          <div class="row  q-px-md q-py-sm scroll q-col-gutter-md">
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ************** IDENTITE ******************* -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
              <div class="ba overflow-hidden panel-primary">
                <div class="row items-center">
                  <div class="col">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >INFORMATIONS DU MEMBRE</div>
                  </div>
                </div>
                <q-separator />
                <div class="q-px-md q-pt-sm q-pb-md">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <div class="row q-col-gutter-md items-center">
                        <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                          <div class="text-center">
                            <div class=" contStylephoto">
                              <q-img
                                :src=" (!!membre_eac && !!membre_eac.photo ?  `${URLS.IMG_MEMBRE}/${membre_eac.photo}` :'statics/images/icone/avatar.png')"
                                spinner-color="white"
                                spinner-size="35px"
                                class="stylePhoto bg-blue-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                          <div class="row q-gutter-sm">
                            <div class="col-12">
                              <input-label required>Sélectionner le membre</input-label>
                              <q-select
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                outlined
                                dense
                                placeholder="Choisissez le membre"
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                emit-value
                                map-options
                                clearable
                                v-model="membre_eac"
                                :options="membres"
                                :option-value="opt => opt"
                                :option-label="opt => `${opt.folio} - ${opt.nom_complet}`"
                                @filter="filterMembres"
                                lazy-rules
                                :rules="[ val => !!val || 'Sélectionner un membre']"
                                @input="onMembreSelected"
                              >
                                <template #no-option>
                                  <q-item>
                                    <q-item-section class="text-red">
                                      Aucun membre ayant déjà souscript aux produit epargne à la carte
                                    </q-item-section>
                                  </q-item>
                                </template>
                                <template #prepend>
                                  <q-icon name="search" />
                                </template>
                              </q-select>
                            </div>
                            <div class="col-12">
                              <input-label>Sexe</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline text-bold"
                                    tabindex="0"
                                  >{{!!membre_eac ? membre_eac.sexe || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <input-label>Secteur d'activité</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!membre_eac ? membre_eac.secteur_str || 'Non défini':'Non défini'}}</div>
                        </template>
                      </q-field>
                    </div>
                    <div class="col-12">
                      <input-label>Profession</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!membre_eac ? membre_eac.profession || 'Non défini':'Non défini'}}</div>
                        </template>
                      </q-field>
                    </div>
                    <div class="col-12">
                      <input-label>Téléphone</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!membre_eac ? membre_eac.phone || 'Non défini':'Non défini'}}</div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ************** SOUSRCIPTION **************** -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg col-xl">
              <div class="ba overflow-hidden panel-primary">
                <div class="row items-center">
                  <div class="col">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >SOUSCRIPTION</div>
                  </div>
                  <div class="col-auto q-px-md">
                    <span
                      class="text-bold"
                      style="font-size:20px"
                    >{{$helper.formatMoney(operation.mise) }} {{operation.devise || ''}}</span>
                  </div>
                </div>
                <q-separator />

                <div class="q-px-md q-pt-sm q-pb-md">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <input-label required>Les comptes EAC du client</input-label>
                      <q-select
                        :readonly="!(!!membre_eac)"
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        placeholder="Sélectionner un compte EAC"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        clearable
                        v-model="compte_eac"
                        :options="comptes"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.designation} - ${opt.devise}`"
                        @filter="filterComptesEac"
                        lazy-rules
                        :rules="[ val => !!val || 'Sélectionner un produit EAC']"
                        @input="onCompteEacSelected"
                      >
                        <template #option="scope">
                          <q-item
                            v-bind="scope.itemProps"
                            v-on="scope.itemEvents"
                          >
                            <q-item-section>
                              <q-item-label class="text-bold">{{scope.opt.designation}} {{scope.opt.devise}}</q-item-label>
                              <q-item-label
                                caption
                                class="text-bold"
                              >{{scope.opt.indice}}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator />
                        </template>
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Ce membre n'a pas souscrit à une épargne à la carte
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <div
                      class="col-12"
                      v-if="!!compte_eac"
                    >
                      <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                        Intervalle : <span class="text-primary"> {{$helper.formatMoney(compte_eac.montant_min)+' '+compte_eac.devise +' à '+ $helper.formatMoney(compte_eac.montant_max)+' '+compte_eac.devise}}</span>
                      </div>
                    </div>

                    <div class="col-12">
                      <input-label required>La mise journalière</input-label>
                      <q-input
                        :readonly="!(!!membre_eac)"
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="operation.mise"
                        placeholder="Mise"
                        lazy-rules
                        :rules="[
                                  val => (val && val.trim().length > 0) || 'Champs requis',
                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                  val => parseFloat(val) > 0 || 'La mise doit être superieur à zéro',
                                  val => (parseFloat(val) >= this.compte_eac.montant_min && parseFloat(val) <= this.compte_eac.montant_max) || `La mise doit appartenir à l\'intervalle de ${this.compte_eac.montant_min} à ${this.compte_eac.montant_max} `
                                ]"
                        maxlength="12"
                      >
                        <template
                          v-if="!!compte_eac"
                          #append
                        >
                          <strong style="font-size:14px">{{compte_eac.devise}}</strong>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12">
                      <input-label required>Sélectionner le collecteur</input-label>
                      <q-select
                        :readonly="!(!!compte_eac)"
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        placeholder="Choisir le collecteur"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        clearable
                        v-model="collecteur"
                        :options="collecteurs"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.nom_complet}`"
                        @filter="filterCollecteurs"
                        lazy-rules
                        :rules="[ val => !!val || 'Sélectionner un collecteur']"
                      >
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucun collecteur disponible
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <div class="col-12">
                      <input-label>Autres informations (Facultatives)</input-label>
                      <q-input
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="operation.description"
                        placeholder="Autres informations"
                        lazy-rules
                        :rules="[ val => !val || (!!val && val.trim().length >= 3) || 'Minimun 3 caractères']"
                        maxlength="250"
                        type="textarea"
                        rows="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogCarnet',
  data () {
    return {
      URLS: {},
      user: {},

      operation: {
        mise: null
      },
      membre_eac: null,
      compte_eac: null,
      collecteur: null,

      loading: false,

      collecteurs: [],
      membres: [],
      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedCarnet: {}
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
        if (this.selectedCarnet != null) {
          this.operation = { ...this.selectedCarnet }
        } else {
          this.viderChamps()
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
    onMembreSelected (membre) {
      this.compte_eac = null
    },
    onCompteEacSelected (cmpt) {
      this.$vue.set(this.operation, 'mise', null)

      if (cmpt) {
        this.$vue.set(this.operation, 'devise', cmpt.devise)
      }
    },
    filterCollecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.compte_eac.devise
      })

      let url = `${this.URLS.BASE_URL}/Collecteur/searchCollecteurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.collecteurs = infos.data.records
        })
      }).catch(() => {
        update(() => { this.collecteurs = [] })
      })
    },
    filterMembres (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Eac/searchMembresEac`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.membres = infos.data.records
        })
      }).catch(() => {
        update(() => { this.membres = [] })
      })
    },
    filterComptesEac (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_client: this.membre_eac.id
      })

      let url = `${this.URLS.BASE_URL}/Eac/searchComptesEac`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.comptes = [] })
      })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment enregistrer ce carnet?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          this.operation.id_client = this.membre_eac.id
          this.operation.id_collecteur = this.collecteur.id
          this.operation.id_compte = this.compte_eac.id_compte
          this.operation.id_produit = this.compte_eac.id_produit

          let donnees = JSON.stringify({
            ...this.operation,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = false
          let url = `${this.URLS.BASE_URL}/Eac/saveCarnet/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)
            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')
              this.$emit('onFinish', true)
              this.showDialog = false
              this.viderChamps()
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
      this.operation = { mise: null }
      this.compte_eac = null
      this.membre_eac = null
      this.collecteur = null

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }
  }
}
</script>

<style lang="stylus"></style>
