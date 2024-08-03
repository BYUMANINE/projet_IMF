<template>
  <q-page class="filly-auto">
    <list-menu-options>
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="$emit('actualiser',true)"
      />

      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        v-if="!(_isLastStep && operation.step == 1)"
        :disable="operation.step == 1"
        text="Etape précédente"
        :icon="operation.step == 1 ? 'prev_desable.png' : 'prev.png'"
        @option-clicked="() => {if (operation.step > 1) {operation.step--}}"
      />
      <menu-option
        :text="`${_isLastStep ? 'Enregistrer l\'opération' : 'Etape suivante'}`"
        :icon="_isLastStep ? 'save.png' : 'next.png'"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />

      <menu-option
        text="Type encaissement"
        icon="option.png"
      >
        <subMenuOption
          v-model="selectedOption"
          :index="0"
          :options="options"
          @onOptionChanged="e=>$emit('onOptionChanged',e)"
        />
      </menu-option>

    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre>
        <template #titre>
          <span>{{selectedOption.label }} </span> |
          <span style="font-size:14px">{{caisseName }}</span>
        </template>
      </grandTitre>

      <div class="panel-primary">
        <div class="row">
          <div class="col-12">
            <q-form ref="myForm">
              <div class="q-pa-md">
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
                          >INFORMATIONS SUR LE MEMBRE <span
                              class="text-primary"
                              v-if="!!membre && !!membre.folio"
                            >[ {{membre.folio}} ]</span></div>
                        </div>
                        <div
                          class="col-auto q-py-xs q-pr-md"
                          v-if="!!membre && !!membre.folio"
                        >
                          <q-btn
                            color="blue-1"
                            text-color="primary"
                            icon="las la-copy"
                            unelevated
                            round
                            size="sm"
                            @click="$helper.copy(membre.folio)"
                          >
                            <q-tooltip>
                              Copier le code du membre
                            </q-tooltip>

                          </q-btn>
                        </div>
                      </div>
                      <q-separator />
                      <div class="q-px-md q-pt-sm q-pb-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12">
                            <input-label>Rechercher un membre</input-label>
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
                              v-model="membre"
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
                                    Aucun membre trouvé
                                  </q-item-section>
                                </q-item>
                              </template>
                              <template #prepend>
                                <q-icon name="search" />
                              </template>
                            </q-select>

                          </div>
                          <div class="col-12">
                            <input-label required>Compte épargne</input-label>
                            <q-select
                              :readonly="!(!!membre)"
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
                              v-model="compte"
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
                                >{{!!compte ? compte.indice || 'Non défini':'Non défini'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
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
                                >{{!!compte ? $helper.formatMoney(compte.solde_global.montant) || '0,00':'0,00'}}</div>
                              </template>
                              <template #prepend>
                                <div
                                  style="font-size:14px"
                                  class="text-bold"
                                >{{!!compte ? `S${compte.solde_global.solde} :` || 'SDC :':'SDC :'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <input-label>Montant gelé</input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              bg-color="red-2"
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline text-bold text-red"
                                  tabindex="0"
                                >{{!!compte ? $helper.formatMoney(compte.montant_gele) || '0,00':'0,00'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <input-label>Disponible</input-label>
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
                                >{{!!compte ? $helper.formatMoney(compte.solde.montant) || '0,00':'0,00'}}</div>
                              </template>
                              <template #prepend>
                                <div
                                  style="font-size:14px"
                                  class="text-bold"
                                >{{!!compte ? `S${compte.solde.solde} :` || 'SDC :':'SDC :'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
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
                                >{{!!membre ? membre.folio || 'Non défini':'Non défini'}}</div>
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
                              hide-bottom-space
                              dense
                            >
                              <template #control>
                                <div class="self-center full-width no-outline q-pa-none">
                                  <div class="row q-col-gutter-sm items-center">
                                    <div
                                      class="col"
                                      style="border-right:1px dashed rgba(0,0,0,.2)"
                                    >
                                      <q-radio
                                        v-model="operation.devise"
                                        val="CDF"
                                        label="CDF"
                                        dense
                                        class="text-bold"
                                        disable
                                      />
                                    </div>
                                    <div class="col">
                                      <q-radio
                                        v-model="operation.devise"
                                        val="USD"
                                        label="USD"
                                        dense
                                        class="text-bold"
                                        disable
                                      />
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Montant à déposer</input-label>
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
                                        val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',]"
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
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Nom complet du déposant</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="operation.initiateur"
                              placeholder="Déposant"
                              lazy-rules
                              :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                              maxlength="60"
                            />
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
                              :rules="[ val => !val || !!val && val.trim().length > 0 || 'Entrer le numero de la pièce']"
                              maxlength="150"
                            />
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
                              rows="7"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </q-form>
          </div>

        </div>
      </div>
    </div>

    <filAttente
      v-model="showDlgFilAttente"
      :user="user"
    />

  </q-page>
</template>
<script>
import filAttente from '../../fil_attente/fil_attente.vue'

export default {
  name: 'individuel',
  data () {
    return {
      showDlgFilAttente: false,

      operation: {
        step: 1,
        default_libelle: true,
        pieces: []
      },

      compte: null,
      membre: null,
      membres: [],
      comptes: [],

      step: 1,

      selectedOption: {}
    }
  },
  props: ['URLS', 'user', 'options', 'caisseName', 'caisse'],
  watch: {

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
    filAttente
  },
  computed: {

    _isLastStep () {
      return this.operation.step === 1
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Dépôt de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte ? this.compte.indice : ''} du membre ${this.membre ? this.membre.nom_complet : ''}. Déposant : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    }
  },
  beforeMount () { },
  methods: {
    onMembreSelected (membre) {
      this.$vue.set(this.operation, 'initiateur', null)
      this.$vue.set(this.operation, 'devise', null)
      this.compte = null
      this.comptes = []

      if (membre) {
        this.getSoldeCompteEpargne(membre)
      }
    },
    onCompteSelected (e) {
      if (e) {
        this.$vue.set(this.operation, 'devise', e.devise)
      } else {
        this.$vue.set(this.operation, 'devise', null)
      }
    },
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
    getSoldeCompteEpargne (membre) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_membre: membre.id,
        with_mandataires: false,
        with_solde: true
      })

      let url = `${this.URLS.BASE_URL}/Membre/getComptesEpargnes`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.comptes = infos.data.comptes
          this.$vue.set(this.operation, 'initiateur', membre.nom_complet)
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
    checkform (isOk) {
      if (isOk) {
        if (this._isLastStep) {
          this.saveForm()
        } else {
          this.operation.step += 1
        }
      }
    },
    saveForm () {
      if (!this.$helper.isNotEmpty(this.caisse)) {
        this.$helper.showMessage("Cet utilisateur n'est lié à aucune caisse, il ne peut donc pas passer des opération de d'encaissement")
        return
      }

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
          id_compte: this.compte.id,
          id_client: this.membre.id,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte_caisse: this.caisse[this.operation.devise.toLowerCase()].id,
          type_encaissement: this.selectedOption.value
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Caisse/encaissement/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          if (infos.data.erreur === false) {
            this.$emit('onPrint', infos.data.id_operation)
            this.$emit('actualiser', true)
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.viderChamps()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.loadingSave = false
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.operation = {
        step: 1,
        default_libelle: true,
        pieces: []
      }

      this.compte = null
      this.membre = null

      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style>
</style>
