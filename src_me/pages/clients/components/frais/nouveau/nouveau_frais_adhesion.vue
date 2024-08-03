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
              <div class="text-h6">Frais d'adhesion</div>
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

              <q-form ref="myForm">
                <div class="row q-col-gutter-md ">
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** SITE ******************* -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="col-12">
                    <div class="ba overflow-hidden panel-primary">
                      <div class="q-pa-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Type adhérent</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner un type adhérent"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="frais.type"
                              :options="optionsTypes"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.label}`"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @input="$vue.set(frais,'client',null);$vue.set(frais,'compte',null);$vue.set(frais,'type_frais',null)"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>{{frais.type? (frais.type.value === 'MEMBRE'?'Membre':(frais.type.value === 'GROUPE'?'Groupe':'Entreprise')): 'Adhérent'}}</input-label>
                            <q-select
                              :readonly="!(!!frais.type)"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner une option"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="frais.client"
                              :options="clients"
                              :option-value="opt => opt"
                              :option-label="opt => !!opt ? `${opt.folio} - ${opt.client_str}` : ''"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @filter="filterClients"
                              @input="getComptesEpargne"
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
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Compte épargne de prélèvement</input-label>
                            <q-select
                              :readonly="!(!!frais.client)"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner une option"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="frais.compte"
                              :options="comptes"
                              :option-value="opt => opt"
                              :option-label="opt => !!opt ? `${opt.indice} - ${opt.nom_complet || opt.designation }` : ''"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @input="$vue.set(frais,'type_frais',null)"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun compte epargne de ce membre trouvé
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>

                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Frais d'adhésion</input-label>
                            <q-select
                              :readonly="!(!!frais.compte)"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Selectionner une option"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="frais.type_frais"
                              :options="typesFrais"
                              :option-value="opt => opt"
                              :option-label="opt => !!opt ? `${opt.designation} - ${opt.devise} - ${opt.montant}` : ''"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @filter="searchFraisAdhesion"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun frais d'adhésion trouvé pour ce type d'adhérent et devise
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                          <div
                            class="col-12"
                            v-if="!!frais.compte"
                          >
                            <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                              Solde disponible : <span class="text-primary"> {{'S'+frais.compte.solde.solde+' : '+$helper.formatMoney(frais.compte.solde.montant)+' '+frais.compte.devise}}</span>
                            </div>
                          </div>

                          <div class="col-12">
                            <input-label>Montant frais</input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >{{!!frais.type_frais ? frais.type_frais.montant || '0,00':'0,00'}}</div>
                              </template>
                              <template
                                v-if="!!frais.type_frais"
                                #append
                              >
                                <strong style="font-size:14px">{{frais.type_frais.devise}}</strong>
                              </template>
                            </q-field>
                          </div>

                          <div class="col-12">
                            <input-label>Libellé de l'opération</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="frais.libelle"
                              placeholder="Libellé"
                              lazy-rules
                              :rules="[ val => !!val && val && val.trim().length > 10 || 'Saisissez au moins 10 caractères']"
                              type="textarea"
                              rows="3"
                              maxlength="250"
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

  </div>
</template>

<script>

export default {
  name: 'dialogFrais',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgNewType: false,

      frais: {},
      optionsTypes: [
        { value: 'MEMBRE', label: 'Membres individuels' },
        { value: 'GROUPE', label: 'Groupes residuels' },
        { value: 'ENTREPRISE', label: 'Les entreprises' }
      ],
      clients: [],
      typesFrais: [],
      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedFrais: {}
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
        if (this.selectedFrais != null) {
          this.frais = { ...this.selectedFrais }
        } else {
          this.frais = {}
        }
      }
    }
  },
  components: {

  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {

    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type_client: this.frais.type.value,
        exclude_if_has_paye_adhesion: 'OUI'
      })

      let url = `${this.URLS.BASE_URL}/Frais_adhesion/searchMembresFrais`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.clients = []
        })
      })
    },
    searchFraisAdhesion (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.frais.compte.devise,
        type_client: this.frais.type.value
      })

      let url = `${this.URLS.BASE_URL}/Frais_adhesion/searchFraisAdhesion`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.typesFrais = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.typesFrais = []
        })
      })
    },
    getComptesEpargne (e) {
      if (!e) {
        this.comptes = []
        return
      }

      this.$vue.set(this.frais, 'compte', null)
      this.$vue.set(this.frais, 'type_frais', null)

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type_client: this.frais.type.value,
        id_client: e.id_client,
        with_solde: true
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Adherent/getComptesEpargne`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        this.comptes = infos.data.records
      }).catch(() => {
        this.$q.loading.hide()
        this.comptes = []
      })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment enregistrer cette opération ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            type_client: this.frais.type.value,
            montant: this.frais.type_frais.montant,
            id_client: this.frais.client.id_client,
            id_type_frais: this.frais.type_frais.id,
            id_compte_prelev: this.frais.compte.id,
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            libelle: this.frais.libelle,
            devise: this.frais.compte.devise,
            type: 'ADH'
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Frais_adhesion/add/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
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
      this.frais = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
