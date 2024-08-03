<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 900px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Transfert entre comptes</div>
            </div>
            <div class="col-auto">
              <q-btn
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
                color="blue-1"
                text-color="primary"
                label="Enregistrer"
                icon="las la-cloud-upload-alt"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="$refs.myForm.validate().then(saveForm)"
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
          <q-separator />
          <q-form
            ref="myForm"
            class="q-pa-md scroll"
            style="min-height:75;max-height:75vh"
          >

            <div class="row q-col-gutter-md">
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <!-- ********* MEMBRE SOURCE ******************* -->
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                <div class="ba overflow-hidden panel-primary ">
                  <div class="row items-center">
                    <div class="col">
                      <div
                        class="q-py-xs q-px-sm text-h6"
                        style="font-size:14px"
                      >COMPTES</div>
                    </div>

                  </div>
                  <q-separator />

                  <div class="q-px-md q-pt-sm q-pb-md">
                    <div class="row items-center q-col-gutter-sm">
                      <div class="col-12">
                        <input-label required>Membre émetteur</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Rechercher un adhérent"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          behavior="menu"
                          v-model="client_src"
                          :options="clients"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.folio} - ${opt.client_str}`"
                          @filter="filterClients"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un adhérent']"
                          @input="onMembreSourceSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun adhérent trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                          <template #prepend>
                            <q-icon name="search" />
                          </template>
                        </q-select>
                      </div>
                      <div class="col-12">
                        <input-label required>Compte épargne émetteur</input-label>
                        <q-select
                          :readonly="!(!!client_src)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Compte épargne émetteur"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          behavior="menu"
                          v-model="compte_src"
                          :options="comptes_source"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.devise} - ${opt.designation}`"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un compte']"
                          @input="onCompteSourceSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Cet adherent n'a aucun compte epargne
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Compte épargne</input-label>
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
                            >{{!!compte_src ? compte_src.indice || 'Non défini':'Non défini'}}</div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Solde du compte</input-label>
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
                            >{{!!compte_src ? $helper.formatMoney(compte_src.solde.montant) || '0,00':'0,00'}}</div>
                          </template>
                          <template #prepend>
                            <div
                              style="font-size:14px"
                              class="text-bold"
                            >{{!!compte_src ? `S${compte_src.solde.solde} :` || 'SDC :':'SDC :'}}</div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-12">
                        <input-label required>Membre recepteur</input-label>
                        <q-select
                          :readonly="!(!!compte_src)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Rechercher un adhérent"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          behavior="menu"
                          v-model="client_dest"
                          :options="clients"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.folio} - ${opt.client_str}`"
                          @filter="filterClients"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un adhérent']"
                          @input="onMembreDestinationSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun adhérent trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                          <template #prepend>
                            <q-icon name="search" />
                          </template>
                        </q-select>
                      </div>
                      <div class="col-12">
                        <input-label required>Compte épargne recepteur</input-label>
                        <q-select
                          :readonly="!(!!client_dest)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Compte épargne recepteur"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          behavior="menu"
                          v-model="compte_dest"
                          :options="comptes_destination"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.devise} - ${opt.designation}`"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un compte']"
                          @input="onCompteDestinataireSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Cet adherent n'a aucun compte epargne
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-12">
                        <input-label>Compte épargne</input-label>
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
                            >{{!!compte_dest ? compte_dest.indice || 'Non défini':'Non défini'}}</div>
                          </template>
                        </q-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <!-- ************** TRANSACTION **************** -->
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                <div class="ba overflow-hidden panel-primary">
                  <div class="row items-center">
                    <div class="col">
                      <div
                        class="q-py-xs q-px-sm text-h6"
                        style="font-size:14px"
                      >TRANSACTION</div>
                    </div>
                    <div class="col-auto q-px-md">
                      <span
                        class="text-bold"
                        style="font-size:20px"
                      >{{$helper.formatMoney(operation.montant) }} {{operation.devise}}</span>
                    </div>
                  </div>
                  <q-separator />
                  <div class="q-px-md q-pt-sm q-pb-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <input-label required>Devise</input-label>
                        <q-field
                          square
                          outlined
                          dense
                          hide-bottom-space
                          lazy-rules
                          :rules="[ val => !!operation.devise || 'Sélectionner la devise']"
                        >
                          <template v-slot:control>
                            <div class="self-center full-width no-outline q-pa-none">
                              <div class="row q-col-gutter-sm items-center border-divider">
                                <div
                                  v-for="(devise,index) in devices"
                                  :key="index"
                                  class="col"
                                >
                                  <q-radio
                                    v-model="operation.devise"
                                    :val="devise"
                                    :label="devise"
                                    dense
                                    disable
                                    class="text-bold"
                                  />
                                </div>
                              </div>
                            </div>
                          </template>
                        </q-field>

                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <input-label required>Montant à retirer</input-label>
                        <q-input
                          :readonly="!operation.devise"
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.montant"
                          placeholder="Montant"
                          lazy-rules
                          :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                          val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                          val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',
                                          val => this.soldeDisponible >= parseFloat(val) || 'Le solde disponible dans le compte epargne est inferieur au montant saisi']"
                          maxlength="10"
                        >
                          <template
                            v-if="!!operation.devise"
                            #append
                          >
                            <strong style="font-size:14px">{{operation.devise}}</strong>
                          </template>
                        </q-input>
                      </div>

                      <div class="col-12">
                        <input-label>Numéro du chèque (Si virement par chèque)</input-label>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.piece"
                          placeholder="Numéro du chèque"
                          maxlength="50"
                        />
                      </div>

                      <div class="col-12">
                        <input-label>Date opération</input-label>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model="operation.date_operation"
                          placeholder="Date opération"
                          mask="####-##-##"
                          readonly
                          lazy-rules
                          :rules="[ val => !val || (val && val.trim().length > 0) || 'Champs requis',
                                    val => !val || $dateManager.inferieurEgalA(val,user.exercice.date_jour) || 'La date doit être inferieure ou égale à la date actuelle']"
                          @click="$refs.date_operation.show()"
                        >
                          <template v-slot:append>
                            <q-btn
                              v-if="operation.date_operation"
                              color="primary"
                              text-color="primary"
                              icon="close"
                              size="sm"
                              flat
                              round
                              @click="operation.date_operation=null"
                            />
                          </template>
                          <template #prepend>
                            <q-icon
                              class="cursor-pointer"
                              name="las la-calendar"
                              style="font-size:25px"
                            >
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                                ref="date_operation"
                              >
                                <q-date
                                  v-model="operation.date_operation"
                                  mask="YYYY-MM-DD"
                                  @input="() => $refs.date_operation.hide()"
                                />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>

                      </div>
                      <div class="col-12">
                        <input-label required>Libellé de l'opération</input-label>
                        <q-card
                          flat
                          bordered
                          class="radius-none"
                        >
                          <q-card-section class="q-pa-none q-px-sm">
                            <q-item
                              dense
                              class="q-pl-none"
                              clickable
                              v-ripple
                              @click="operation.default_libelle=!operation.default_libelle"
                            >
                              <q-item-section>
                                <q-item-label style="font-size:13px">Utiliser le libellé généré par défaut par le système ?</q-item-label>
                              </q-item-section>
                              <q-item-section side>
                                <q-checkbox v-model="operation.default_libelle" />
                              </q-item-section>
                            </q-item>
                          </q-card-section>
                        </q-card>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="_libelle"
                          placeholder="Libellé"
                          lazy-rules
                          :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                          maxlength="255"
                          type="textarea"
                          rows="7"
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

    <detailsMandataire
      v-model="showDlgDetails"
      :selectedMandataire="selectedMandataire"
      :user="user"
    />
  </div>
</template>
<script>
import detailsMandataire from '../../../../../clients/components/membres/components/mandataire/details_mandataire.vue'

export default {
  name: 'nouveau_transfert_comptes',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      operation: {
        default_libelle: true,
        devise: null,
        montant: null
      },

      showDlgDetails: false,
      selectedMandataire: null,

      compte_src: null,
      compte_dest: null,

      client_src: null,
      client_dest: null,

      devices: ['CDF', 'USD'],

      clients: [],

      comptes_source: [],
      comptes_destination: [],
      mandataires: [],
      membres: [],
      actionnaires: [],

      selectedOption: null
    }
  },
  props: {
    value: Boolean,
    selectedTransfert: {}
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
  destroyed: function () { },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedTransfert != null) {
          this.operation = { ...this.selectedTransfert }
        } else {
          this.viderChamps()
        }
      }
    },
    'operation.default_libelle': {
      handler (newValue, oldValue) {
        if (!newValue) {
          this._libelle = null
        } else {
          this.$vue.set(this.operation, 'libelle', this._libelle)
        }
      },
      deep: false
    }
  },
  components: {
    detailsMandataire
  },
  filters: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Virement de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte_dest ? this.compte_dest.indice : ''} du client ${this.client_dest ? this.client_dest.client_str : ''} en provenance du compte ${this.compte_src ? this.compte_src.indice : ''} du client ${this.client_src ? this.client_src.client_str : ''}`)
        }
        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    soldeDisponible () {
      if (this.compte_src) {
        return this.compte_src.solde.montant
      }

      return 0
    }
  },
  methods: {
    onCompteSourceSelected (compte) {
      this.client_dest = null
      this.compte_dest = null
      this.comptes_destination = []

      if (compte) {
        this.$vue.set(this.operation, 'devise', compte.devise)
      }
    },
    onCompteDestinataireSelected (compte) {
      if (compte) {
        if (compte.devise !== this.compte_src.devise) {
          this.compte_dest = null
          this.$helper.showMessage('Le compte de destination doit être de la même devise que le compte source', 0, 'center')
        }

        if (compte.indice === this.compte_src.indice) {
          this.compte_dest = null
          this.$helper.showMessage('Le compte émetteur doit être different du compte recepteur ', 0, 'center')
        }
      }
    },
    onMembreSourceSelected (client) {
      this.compte_src = null
      this.comptes_source = []

      this.client_dest = null
      this.compte_dest = null
      this.comptes_destination = []

      if (client) {
        this.getSoldeCompteEpargneSource(client)
      }
    },
    onMembreDestinationSelected (client) {
      this.compte_dest = null
      this.comptes_destination = []

      if (client) {
        this.getSoldeCompteEpargneDestination(client)
      } else {
        this.compte_dest = null
      }
    },
    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only_types: ['MEMBRE', 'ENTREPRISE'],
        only_produits: ['EAV']
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => { this.clients = [] })
      })
    },
    getSoldeCompteEpargneSource (client) {
      let dt = null
      let url = null

      if (client.type_client === 'MEMBRE') {
        dt = {
          id_membre: client.id_client,
          with_mandataires: true
        }
        url = `${this.URLS.BASE_URL}/Membre/getComptesEpargnes`
      } else if (client.type_client === 'ENTREPRISE') {
        dt = {
          id_entreprise: client.id_client,
          with_actionnaires: true
        }
        url = `${this.URLS.BASE_URL}/Entreprise/getComptesEpargnes`
      } else if (client.type_client === 'GROUPE') {
        dt = {
          id_groupe: client.id_client,
          with_membres: true
        }
        url = `${this.URLS.BASE_URL}/Groupe/getComptesEpargnes`
      }

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        with_solde: true,
        ...dt
      })

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.compte_src = null
          this.comptes_source = infos.data.comptes

          this.mandataires = infos.data.mandataires
          this.membres = infos.data.membres
          this.actionnaires = infos.data.actionnaires
        } else {
          this.compte_src = null
          this.client_src = null
          this.comptes_source = []
          this.mandataires = []
          this.membres = []
          this.actionnaires = []
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.compte_src = null
        this.client_src = null
        this.comptes_source = []
        this.mandataires = []
        this.membres = []
        this.actionnaires = []

        this.$helper.showMessage()
      })
    },
    getSoldeCompteEpargneDestination (client) {
      let dt = null
      let url = null

      if (client.type_client === 'MEMBRE') {
        dt = {
          id_membre: client.id_client,
          devise: this.compte_src.devise
        }
        url = `${this.URLS.BASE_URL}/Membre/getComptesEpargnes`
      } else if (client.type_client === 'ENTREPRISE') {
        dt = {
          id_entreprise: client.id_client,
          devise: this.compte_src.devise
        }
        url = `${this.URLS.BASE_URL}/Entreprise/getComptesEpargnes`
      } else if (client.type_client === 'GROUPE') {
        dt = {
          id_groupe: client.id_client,
          devise: this.compte_src.devise
        }
        url = `${this.URLS.BASE_URL}/Groupe/getComptesEpargnes`
      }

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        with_solde: false,
        ...dt
      })

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.compte_dest = null
          this.comptes_destination = infos.data.comptes
        } else {
          this.compte_dest = null
          this.client_dest = null
          this.comptes_destination = []
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.compte_dest = null
        this.client_dest = null
        this.comptes_destination = []

        this.$helper.showMessage()
      })
    },
    saveForm (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment enregistrer cette opération ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        const dt = {
          ...this.operation,

          id_client_src: this.client_src.id_client,
          id_client_dest: this.client_dest.id_client,
          id_compte_src: this.compte_src.id,
          id_compte_dest: this.compte_dest.id,

          type_client_src: this.client_src.type_client,
          type_client_dest: this.client_dest.type_client,

          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Virement/saveVirement/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.$emit('onFinish', true)
            this.showDialog = false

            this.viderChamps()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.operation = { default_libelle: true }
      this.client_src = null
      this.client_dest = null
      this.compte_src = null
      this.compte_dest = null
      this.comptes_source = []
      this.comptes_destination = []
      this.actionnaires = []
      this.membres = []
      this.mandataires = []

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }
  }
}
</script>

<style></style>
