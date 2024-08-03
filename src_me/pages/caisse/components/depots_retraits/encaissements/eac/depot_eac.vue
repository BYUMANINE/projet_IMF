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
          :index="3"
          :options="options"
          @onOptionChanged="e=>$emit('onOptionChanged',e)"
        />
      </menu-option>
      <menu-option
        text="Importer"
        icon="office.png"
      >
        <q-menu
          touch-position
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-ripple
              v-close-popup
              @click="showDlgImport=true"
            >
              <q-item-section
                avatar
                class="relative-position"
              >
                <q-img
                  src="statics/images/icone/excel.png"
                  spinner-color="blue"
                  style="height: 30px; max-width: 30px"
                  spinner-size="20px"
                  transition="scale"
                />
              </q-item-section>
              <q-item-section>Importer les collectes dépuis un fichier excel</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
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
                          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
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
                            <input-label>Code membre</input-label>
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
                          <div class="col-12">
                            <input-label>Compte EAC</input-label>
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
                                >{{!!carnet ? carnet.indice|| 'Non défini':'Non défini'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Total à déposer</input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              class="bg-blue-1"
                            >
                              <template #control>
                                <div
                                  class="text-primary self-center full-width no-outline text-bold"
                                  tabindex="0"
                                >{{!!carnet ? `${carnet.total_echeance} ${carnet.devise}  `:'0,00'}}</div>
                              </template>
                            </q-field>
                          </div>

                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Total déposé </input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              class="bg-green-1"
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline text-bold"
                                  tabindex="0"
                                >{{!!carnet ? $helper.formatMoney(carnet.total_depot) || '0,00':'0,00'}}</div>
                              </template>
                              <template #append>
                                <div
                                  style="font-size:14px"
                                  class="text-bold"
                                >{{!!carnet ? `${carnet.devise} `:''}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Reste à déposer</input-label>
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              class="bg-red-1"
                            >
                              <template #control>
                                <div
                                  class="text-primary self-center full-width no-outline text-bold"
                                  tabindex="0"
                                >{{!!carnet ? `${carnet.reste_depot} ${carnet.devise}  `:'0,00'}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Montant à retirer </input-label>
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
                                >{{montantARetirer}}</div>
                              </template>
                              <template #append>
                                <div
                                  style="font-size:14px"
                                  class="text-bold"
                                >{{!!carnet ? `${carnet.devise} `:''}}</div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-12">
                            <input-label>Nombre de dépôts</input-label>
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
                                >{{!!carnet ? `${$helper.formatMoney(carnet.total_depot / carnet.mise)} `:'0,00'}}</div>
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
                          <div class="col-12">
                            <input-label>Sélectionner un carnet</input-label>
                            <q-select
                              :readonly="!membre"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              clearable
                              placeholder="Sélectionner un carnet"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="carnet"
                              :options="carnets"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.code}-${opt.membre_str}-${opt.devise}`"
                              @filter="filterCarnets"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner un carnet']"
                              @input="onCarnetsSelected"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Ce membre n'a aucun carnet en cours
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>

                          </div>
                          <div
                            class="col-12"
                            v-if="!!carnet"
                          >
                            <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                              MISE : <span class="text-primary"> {{$helper.formatMoney(carnet.mise)+' '+carnet.devise}}</span> |
                              RESTE : <span class="text-primary"> {{$helper.formatMoney(carnet.reste_depot)+' '+carnet.devise}}</span>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <input-label required>Sélectionner la devise</input-label>
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
                              :rules="[ val => !!val || 'Champs requis',
                                        val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                        val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',
                                        val => this.isMiseSupAuNombre(val) || 'Le montant doit être supérieure ou égale à la mise',
                                        val => this.isSuperieurToReste(val) || 'Le montant saisi est superieur aux mises restantes à deposer sur le carnet',
                                        val => this.checkMontantAndMise(val) || 'Le montant doit être un multiple de la mise initiale']"
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

    <importFichierExcel
      v-model="showDlgImport"
      urlModele="statics/excel/model_fichier_depots_eac.xlsx"
      filenameModele="model_fichier_depots_eac.xlsx"
      title="Importation des collectes EAC"
      type="DEPOT EAC"
    />

  </q-page>
</template>
<script>
import filAttente from '../../fil_attente/fil_attente.vue'
import importFichierExcel from '../../../../../commun/import_fichier_excel.vue'

export default {
  name: 'individuel',
  data () {
    return {
      showDlgFilAttente: false,
      showDlgImport: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      carnet: null,
      membre: null,

      membres: [],
      comptes: [],
      carnets: [],

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
    filAttente,
    importFichierExcel
  },
  computed: {

    _isLastStep () {
      return this.operation.step === 1
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Dépôt de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.carnet ? this.carnet.indice : ''}, carnet numéro ${this.carnet ? this.carnet.code : ''} du membre ${this.membre ? this.membre.nom_complet : ''}. Déposant : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    montantARetirer () {
      let montant = 0

      if (this.carnet) {
        montant = this.$helper.toDouble(this.carnet.total_depot)
        if (montant > 0) {
          montant = montant - this.$helper.toDouble(this.carnet.total_commission)
        }
      }

      return this.$helper.formatMoney(montant)
    }
  },
  beforeMount () { },
  methods: {
    onMembreSelected (membre) {
      this.carnet = null
      this.$vue.set(this.operation, 'devise', null)

      if (membre) {
        this.operation.initiateur = membre.nom_complet
      }
    },

    onCarnetsSelected (carn) {
      this.$vue.set(this.operation, 'devise', null)

      if (carn) {
        this.$vue.set(this.operation, 'devise', carn.devise)
      }
    },
    isMiseSupAuNombre (val) {
      if (val) {
        if (this.carnet) {
          if (parseFloat(val) >= parseFloat(this.carnet.mise)) {
            return true
          }
        }
      }
      return false
    },
    isSuperieurToReste (val) {
      if (val && this.carnet) {
        if (parseFloat(val) <= parseFloat(this.carnet.reste_depot)) {
          return true
        }
      }

      return false
    },
    checkMontantAndMise (val) {
      if (val && this.carnet) {
        if (parseFloat(val) % parseFloat(this.carnet.mise) === 0) {
          return true
        }
      }

      return false
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

    filterCarnets (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_membre: this.membre.id,
        status: ['ENCOURS'],
        carnet_retire: 'NON'
      })

      let url = `${this.URLS.BASE_URL}/Eac/searchCarnetsEac`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.carnets = infos.data.records
        })
      }).catch(() => {
        update(() => { this.carnets = [] })
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
          id_client: this.membre.id,
          id_carnet: this.carnet.id,
          id_compte: this.carnet.id,
          id_membre_compte: this.carnet.id_membre_compte,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte_caisse: this.caisse[this.operation.devise.toLowerCase()].id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Eac/saveDepot/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          if (infos.data.erreur === false) {
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
        default_libelle: true
      }

      this.membre = null
      this.carnet = null

      this.$refs.myForm.resetValidation()
    }

  }
}
</script>

<style>
</style>
