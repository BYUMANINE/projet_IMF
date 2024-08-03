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
              <div class="text-h6">Nouveau dossier DARS</div>
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
          <q-form
            ref="myForm"
            class="q-pa-md scroll"
            style="min-height:75;max-height:75vh"
          >
            <div class="row q-col-gutter-md ">
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
                      >INFORMATIONS SUR L'ADHERENT
                      </div>
                    </div>
                  </div>
                  <q-separator />
                  <div class="q-px-md q-pt-sm q-pb-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <input-label required>Rechercher une adherent</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Rechercher une adherent"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          behavior="menu"
                          v-model="client_dars"
                          :options="clients"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.folio} - ${opt.client_str}`"
                          @filter="filterClients"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner une adherent']"
                          @input="onMembreSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun adherent trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                          <template #prepend>
                            <q-icon name="search" />
                          </template>
                        </q-select>
                      </div>

                      <div class="col-12">
                        <input-label required>Compte EAV de prélèvement</input-label>
                        <q-select
                          :readonly="!(!!client_dars)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Compte épargne"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          behavior="menu"
                          v-model="compte_eav"
                          :options="comptes"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.devise} - ${opt.designation}`"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un compte']"
                          @input="onCompteSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Ce membre n'a aucun compte epargne
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
                            >{{!!compte_eav ? compte_eav.indice || 'Non défini':'Non défini'}}</div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-12">
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
                            >{{!!compte_eav ? $helper.formatMoney(compte_eav.solde.montant) || '0,00':'0,00'}}</div>
                          </template>
                          <template #prepend>
                            <div
                              style="font-size:14px"
                              class="text-bold"
                            >{{!!compte_eav ? `S${compte_eav.solde.solde} :` || 'SDC :':'SDC :'}}</div>
                          </template>
                          <template #append>
                            <div
                              style="font-size:14px"
                              class="text-bold"
                            >{{!!compte_eav ? `${compte_eav.devise}` : ''}}</div>
                          </template>
                        </q-field>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                        <input-label>Code</input-label>
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
                            >{{!!client_dars ? client_dars.folio || 'Non défini':'Non défini'}}</div>
                          </template>
                        </q-field>
                      </div>

                      <div
                        class="col-12"
                        v-if="_showInterets"
                      >
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          icon-right="las la-external-link-alt"
                          label="Afficher les intérêts"
                          @click="previewInterets()"
                          no-caps
                          unelevated
                        />
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
              <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
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
                      >{{$helper.formatMoney(operation.montant) }} {{operation.devise}}</span>
                    </div>
                  </div>
                  <q-separator />
                  <div class="q-px-md q-pt-sm q-pb-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <input-label>Comptes DARS</input-label>
                        <q-select
                          :readonly="!(!!compte_eav)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Choisir un compte DARS"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          v-model="compte_dars"
                          :options="produits"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.devise} - ${opt.designation}`"
                          @filter="filterProduits"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner un produit DARS']"
                          @input="onProduitDarsSelected"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucune souscription aux produits DARS trouvée
                              </q-item-section>
                            </q-item>
                          </template>
                          <template #prepend>
                            <q-icon name="search" />
                          </template>
                        </q-select>
                      </div>
                      <div
                        class="col-12"
                        v-if="!!compte_dars"
                      >
                        <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                          Intervalle : <span class="text-primary"> {{$helper.formatMoney(compte_dars.montant_min)+' '+compte_dars.devise +' à '+ $helper.formatMoney(compte_dars.montant_max)+' '+compte_dars.devise}}</span>
                        </div>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Montant de souscription</input-label>
                        <q-input
                          :disable="!(!!compte_dars)"
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.montant"
                          placeholder="Montant"
                          lazy-rules
                          :rules="[
                              val => (val && val.trim().length > 0) || 'Champs requis',
                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                              val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',
                              val => (parseFloat(val) >= this.compte_dars.montant_min && parseFloat(val) <= this.compte_dars.montant_max) || `Le montant à bloquer doit figurer dans l\'intervalle de ${this.compte_dars.montant_min} à ${this.compte_dars.montant_max} `,
                              val => this.compte_eav.solde.solde == 'C' && (parseFloat(val) <= this.compte_eav.solde.montant) || `Le solde disponible dans le compte EAV de l\'adhérent est inferieur au DARS à constituer`
                              ]"
                          maxlength="12"
                          @input="$vue.set(operation,'echeance',null);
                                $vue.set(operation,'taux',null);
                                foundTauxInteret()"
                        >
                          <template
                            v-if="!!compte_dars"
                            #append
                          >
                            <strong style="font-size:14px">{{compte_dars.devise}}</strong>
                          </template>
                        </q-input>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Echéance</input-label>
                        <q-input
                          :disable="!(!!compte_dars)"
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.echeance"
                          placeholder="Echéance"
                          lazy-rules
                          :rules="[
                              val => (val && val.trim().length > 0) || 'Champs requis',
                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                              val => parseFloat(val) > 0 || 'L\'écheance doit être superieure à zéro',
                              ]"
                          maxlength="12"
                          @input="$vue.set(operation,'taux',null);foundTauxInteret()"
                        >
                          <template
                            v-if="!!compte_dars"
                            #append
                          >
                            <strong style="font-size:14px">{{compte_dars.devise}}</strong>
                          </template>
                        </q-input>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label required>Taux d'intérêt</input-label>
                        <q-input
                          readonly
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.taux"
                          placeholder="Taux"
                          lazy-rules
                          :rules="[
                              val => (val && val.trim().length > 0) || 'Champs requis',
                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                              val => parseFloat(val) > 0 || 'Le taux  doit être superieur à zéro',
                              ]"
                        >
                          <template #append>
                            <strong style="font-size:16px">%</strong>
                          </template>
                        </q-input>
                      </div>

                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Numéro de la pièce</input-label>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="operation.piece"
                          placeholder="Numéro de la pièce"
                          lazy-rules
                          :rules="[ val => !val || !!val || 'Entrer le numero de la pièce']"
                          maxlength="150"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label required>Periodicité</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Séléctionner la périodicité"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          clearable
                          use-input
                          v-model="operation.periodicite"
                          :options="periodicites"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt}`"
                          lazy-rules
                          :rules="[val => !!val || 'Choisissez une option']"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label required>Date début</input-label>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model="operation.date_debut"
                          placeholder="Date début"
                          mask="####-##-##"
                          lazy-rules
                          readonly
                          :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                          @click="$refs.popup_dt_reception.show()"
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
                                ref="popup_dt_reception"
                              >
                                <q-date
                                  v-model="operation.date_debut"
                                  mask="YYYY-MM-DD"
                                  @input="() => $refs.popup_dt_reception.hide()"
                                />
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>

                      <div class="col-xs-12 col-sm col-md col-lg col-xl">
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
                          rows="3"
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

    <afficherInterets
      v-model="showDlgPreview"
      :data="journalInterets"
      :devise="operation.devise"
    />
  </div>
</template>
<script>
import afficherInterets from './afficher_interets.vue'

export default {
  name: 'dars_entreprise',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      loading: false,
      showDlgPreview: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      client_dars: null,
      compte_dars: null,
      compte_eav: null,

      clients: [],
      produits: [],
      comptes: [],
      periodicites: [],

      journalInterets: {
        interets: [],
        total: {}
      }
    }
  },
  props: {
    value: Boolean,
    selectedDars: {}
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
        this.getStaticsDatas()

        if (this.selectedDars != null) {
          this.operation = { ...this.selectedDars }
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
    afficherInterets
  },
  filters: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    _isLastStep () {
      return this.operation.step === 2
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `DARS de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} avec une échéance de  ${this.operation.echeance ? this.operation.echeance + ' mois et un taux d\'intérêt de ' + this.operation.taux + '%' : ''} dans le compte ${this.compte_dars ? this.compte_dars.indice : ''} du membre ${this.client_dars ? this.client_dars.client_str : ''} en provenance de son compte epargne ${this.compte_eav ? this.compte_eav.indice : ''}`)
        }
        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    _showInterets () {
      return this.operation.montant && this.operation.echeance && this.operation.taux && this.operation.periodicite && this.operation.date_debut
    }
  },
  methods: {
    foundTauxInteret () {
      let taux = 0
      const montant = this.$helper.toDouble(this.operation.montant)
      const echeance = this.$helper.toDouble(this.operation.echeance)

      if (montant > 0 && echeance > 0 && this.$helper.isNotEmpty(this.compte_dars)) {
        for (let i = 0; i < this.compte_dars.taux_interet.length; i++) {
          const interet = this.compte_dars.taux_interet[i]

          if (montant >= this.$helper.toDouble(interet.min) &&
            montant <= this.$helper.toDouble(interet.max) &&
            echeance >= this.$helper.toDouble(interet.echeance_min) &&
            echeance <= this.$helper.toDouble(interet.echeance_max)) {
            taux = interet.taux
            break
          }
        }
      }

      this.$vue.set(this.operation, 'taux', taux)
    },
    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Dars/searchMembresDars`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => { this.clients = [] })
      })
    },
    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_client: this.client_dars.id_client,
        type_client: this.client_dars.type_client,
        devise: this.compte_eav.devise
      })

      let url = `${this.URLS.BASE_URL}/Dars/searchComptesDars`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = infos.data.records
        })
      }).catch(() => {
        update(() => { this.produits = [] })
      })
    },
    onMembreSelected (client) {
      this.$vue.set(this.operation, 'devise', null)
      this.compte_eav = null
      this.compte_dars = null
      this.comptes = []

      if (client) {
        this.getSoldeCompteEpargne(client)
      }
    },
    onProduitDarsSelected (e) {
      this.$vue.set(this.operation, 'montant', null)
      this.$vue.set(this.operation, 'echeance', null)
      this.$vue.set(this.operation, 'taux', null)
    },
    onCompteSelected (e) {
      this.$vue.set(this.operation, 'devise', null)
      this.compte_dars = null
      this.$vue.set(this.operation, 'montant', null)
      this.$vue.set(this.operation, 'echeance', null)
      this.$vue.set(this.operation, 'taux', null)

      if (e) {
        this.$vue.set(this.operation, 'devise', e.devise)
      }
    },
    previewInterets () {
      const donnees = JSON.stringify({
        montant: this.operation.montant,
        echeance: this.operation.echeance,
        taux: this.operation.taux,
        periodicite: this.operation.periodicite,
        date_debut: this.operation.date_debut
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Dars/previewInterets/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.journalInterets = infos.data.records
            this.showDlgPreview = true
          } else {
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.$q.loading.hide()
          this.journalInterets = { interets: [], total: {} }
          this.$helper.showMessage()
        })
    },
    getStaticsDatas (val, update, abort) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Dars/getStaticsDatas`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.periodicites = infos.data.periodicites
        }
      }).catch(() => {
        this.$q.loading.hide()
      })
    },

    getSoldeCompteEpargne (e) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_client: e.id_client,
        with_solde: true,
        type_client: e.type_client,
        type_epargne: 'EAV'
      })

      let url = `${this.URLS.BASE_URL}/Dars/getComptesEpargnes`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.comptes = infos.data.comptes
        } else {
          this.comptes = []
          this.compte = null
          this.membre = null
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.comptes = []
        this.compte = null
        this.membre = null
        this.$helper.showMessage()
      })
    },
    onSubmit (isOk) {
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
          devise: this.compte_dars.devise,
          type_client: this.client_dars.type_client,
          id_client: this.client_dars.id_client,
          id_rel_client_compte_dars: this.compte_dars.id_rel_compte_client,
          id_rel_client_compte_eav: this.compte_eav.id,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Dars/addDossierDars/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.viderChamps()
            this.$emit('onFinish', true)
            this.showDialog = false
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
      this.operation = {
        step: 1,
        default_libelle: true
      }

      this.compte_eav = null
      this.compte_dars = null
      this.client_dars = null
      this.journalInterets = { interets: [], total: {} }

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }

  }
}
</script>

<style></style>
