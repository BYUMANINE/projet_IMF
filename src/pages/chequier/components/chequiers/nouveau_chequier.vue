<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}chèquier</div>
            </div>
            <div
              class="col-auto"
              v-if="isAdd"
            >
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
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
                        <div class="row q-col-gutter-xs">
                          <div class="col-12">
                            <input-label required>Adhérent</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner un adhérent"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              clearable
                              v-model="chequier.client"
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
                          <div class="col-12">
                            <input-label required>Compte épargne de prélèvement</input-label>
                            <q-select
                              :readonly="!(!!chequier.client)"
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
                              clearable
                              v-model="chequier.compte"
                              :options="comptes"
                              :option-value="opt => opt"
                              :option-label="opt => !!opt ? `${opt.indice} - ${opt.nom_complet || opt.designation }` : ''"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @input="$vue.set(chequier,'type_chequier',null)"
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
                          <div
                            class="col-12"
                            v-if="!!chequier.compte"
                          >
                            <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                              Solde disponible : <span class="text-primary"> {{'S'+chequier.compte.solde.solde+' : '+$helper.formatMoney(chequier.compte.solde.montant)+' '+chequier.compte.devise}}</span>
                            </div>
                          </div>
                          <div class="col-12">
                            <input-label required>Type chéquier</input-label>
                            <q-select
                              :readonly="!(!!chequier.compte)"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Selectionner type chéquier"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              clearable
                              v-model="chequier.type_chequier"
                              :options="typesChequiers"
                              :option-value="opt => opt"
                              :option-label="opt => !!opt ? `${opt.designation} - ${opt.nb_cheques} chèques - ${opt.prix} ${opt.devise}` : ''"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une option']"
                              @filter="filterTypesChequiers"
                            >
                              <template #after>
                                <q-btn
                                  color="primary"
                                  text-color="white"
                                  unelevated
                                  icon="add"
                                  @click="showDlgNewType= true"
                                />

                              </template>
                            </q-select>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Nombre de chèques</input-label>
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
                                >{{!!chequier.type_chequier ? chequier.type_chequier.nb_cheques +' Chèques':'N/A'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Prix du chequier</input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              lazy-rules
                              :rules="[ val => _soldeEpargneSuffisant() || 'Le solde disponible dans le compte epargne ne peut pas couvrir cet achat de chéquier']"
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >{{!!chequier.type_chequier ? `${chequier.type_chequier.prix} ${chequier.type_chequier.devise}` || 'N/A':'N/A'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Numèro initial</input-label>
                            <q-input
                              :readonly="!(!!chequier.type_chequier)"
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="chequier.num_initial"
                              placeholder="Numèro initial"
                              lazy-rules
                              :rules="[
                                      val => (val && val.trim().length > 0) || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) > 0 || 'La nombre doit être superieur à zéro'
                                    ]"
                              maxlength="10"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Numero final</input-label>
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
                                >{{getNumeroFinal}}</div>
                              </template>
                            </q-field>

                          </div>
                          <div class="col-12">
                            <input-label required>Libellé </input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="chequier.libelle"
                              placeholder="Libellé"
                              lazy-rules
                              :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                              maxlength="150"
                              type="textarea"
                              rows="3"
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

    <nouveauTypeChequier
      v-model="showDlgNewType"
      :isAdd="true"
      :selectedType="null"
    />
  </div>
</template>

<script>
import nouveauTypeChequier from '../types_chequiers/nouveau_type_chequier.vue'

export default {
  name: 'dialogChequier',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgNewType: false,

      chequier: {},
      clients: [],
      typesChequiers: [],
      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedChequier: {},
    isAdd: {
      type: Boolean,
      default: true
    }
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
        if (this.selectedChequier != null) {
          this.chequier = { ...this.selectedChequier }
        } else {
          this.chequier = {}
        }
      }
    }
  },
  components: {
    nouveauTypeChequier
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    getNumeroFinal () {
      if (this.chequier.num_initial && this.chequier.type_chequier) {
        return this.$helper.toDouble(this.chequier.num_initial) + this.$helper.toDouble(this.chequier.type_chequier.nb_cheques)
      }
      return 0
    }
  },
  methods: {
    _soldeEpargneSuffisant () {
      if (this.chequier.compte && this.chequier.type_chequier) {
        if (this.chequier.compte.solde.solde === 'C') {
          let prix = this.$helper.toDouble(this.chequier.type_chequier)
          let solde = this.$helper.toDouble(this.chequier.compte.solde.montant)
          if (prix <= solde) {
            return true
          }
        }
      }
      return false
    },
    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only_produits: ['EAV']
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
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
    filterTypesChequiers (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.chequier.compte ? this.chequier.compte.devise : null,
        type_client: this.chequier.client ? this.chequier.client.type_client : null
      })

      let url = `${this.URLS.BASE_URL}/Chequier/searchTypesChequiers`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.typesChequiers = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.typesChequiers = []
        })
      })
    },
    getComptesEpargne (e) {
      this.$vue.set(this.chequier, 'compte', null)
      this.$vue.set(this.chequier, 'type_chequier', null)

      if (!e) {
        this.comptes = []
        return
      }

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type_client: e.type_client,
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
          message: `Souhaitez-vous vraiment ajouter ce chéquier ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            type_client: this.chequier.client.type_client,
            libelle: this.chequier.libelle,
            id_client: this.chequier.client.id_client,
            id_compte_client: this.chequier.compte.id,
            id_type_chequier: this.chequier.type_chequier.id,
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            num_initial: this.chequier.num_initial,
            num_final: this.getNumeroFinal
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Chequier/${this.isAdd ? 'add' : 'update'}/`

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
      this.chequier = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
