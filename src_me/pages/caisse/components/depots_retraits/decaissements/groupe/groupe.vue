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
        v-if="!(isLastStep && operation.step == 1)"
        :disable="operation.step == 1"
        text="Etape précédente"
        :icon="operation.step == 1 ? 'prev_desable.png' : 'prev.png'"
        @option-clicked="() => {if (operation.step > 1) {operation.step--}}"
      />
      <menu-option
        :text="`${isLastStep ? 'Enregistrer l\'opération' : 'Etape suivante'}`"
        :icon="isLastStep ? 'save.png' : 'next.png'"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />

      <menu-option
        text="Type décaissement"
        icon="option.png"
      >
        <subMenuOption
          v-model="selectedOption"
          :index="1"
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
              <q-stepper
                v-model="operation.step"
                ref="stepper"
                color="primary"
                class="q-pa-none panel-primary q-pa-none-xs-stepper"
                transition-next="fade"
                transition-prev="fade"
              >
                <q-step
                  :name="1"
                  title="Informations du groupe"
                  icon="las la-portrait"
                  :done="operation.step > 1"
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
                            >INFORMATIONS SUR LE GROUPE <span
                                class="text-primary"
                                v-if="!!groupe && !!groupe.folio"
                              >[ {{groupe.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="!!groupe && !!groupe.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(groupe.folio)"
                            >
                              <q-tooltip>
                                Copier le code du groupe
                              </q-tooltip>

                            </q-btn>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-12">
                              <input-label>Rechercher un groupe</input-label>
                              <q-select
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                outlined
                                dense
                                placeholder="Rechercher un groupe"
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                emit-value
                                map-options
                                clearable
                                behavior="menu"
                                v-model="groupe"
                                :options="groupes"
                                :option-value="opt => opt"
                                :option-label="opt => `${opt.folio} - ${opt.designation}`"
                                @filter="filterGroupes"
                                lazy-rules
                                :rules="[ val => !!val || 'Sélectionner un groupe']"
                                @input="onGroupeSelected"
                              >
                                <template #no-option>
                                  <q-item>
                                    <q-item-section class="text-red">
                                      Aucun groupe trouvé
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
                                :readonly="!(!!groupe)"
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
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                              <input-label>Sigle</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template v-slot:control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!groupe ? groupe.sigle || 'Non défini' :'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                              <input-label>Gestionnaire du groupe</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template v-slot:control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!groupe ? groupe.gestionnaire_str || 'Non défini':'Non défini' }}</div>
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
                                type="number"
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
                              <input-label required>Bénéficiaire</input-label>
                              <q-input
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.initiateur"
                                placeholder="Bénéficiaire"
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
                                placeholder="Numéro du chèque"
                                lazy-rules
                                :rules="[ val => !val || !!val && val.trim().length > 0 || 'Entrer le numero de la pièce']"
                                maxlength="150"
                              />
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
                </q-step>
                <q-step
                  :name="2"
                  title="Répartition"
                  icon="las la-users"
                  :done="operation.step > 2"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >PART DES MEMBRES DU GROUPE</div>
                    <q-separator />
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>MONTANT</th>
                          <th>SOLDE</th>
                          <th>CODE</th>
                          <th
                            style="width:20%"
                            class="text-left"
                          >NOM COMPLET</th>
                          <th class="text-center">SEXE</th>
                          <th class="text-center">FONCTION</th>
                          <th class="text-center">COMITE</th>
                          <th class="text-center">GESTIONNAIRE</th>
                        </tr>
                      </thead>

                      <tbody style="font-size:12px">
                        <tr
                          v-for="(row, index) in membres"
                          :key="index"
                        >
                          <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                            >
                              {{ index + 1 }}
                            </q-avatar>
                          </td>
                          <td class="text-center text-bold input-table">
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="row.montant"
                              placeholder="Montant contribué"
                              lazy-rules
                              :rules="[ val => !!val || 'Champs requis',
                            val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                            val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',
                            val => montantReparti >= 0 || 'Montant superieur au reste à répartir']"
                              maxlength="7"
                            >
                              <template
                                v-if="!!operation.devise"
                                #append
                              >
                                <strong style="font-size:13px">{{operation.devise}}</strong>
                              </template>
                            </q-input>
                          </td>
                          <td class="text-center text-bold">{{ _printSoldeMembre(row.solde)}} {{operation.devise}} </td>
                          <td class="text-center text-bold">{{ row.folio || 'Non défini' }} </td>
                          <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                          <td class="text-center">{{ row.sexe }}</td>
                          <!-- <td class="text-center">{{ row.nationalite }}</td> -->
                          <td class="text-center">{{ row.fonction }}</td>
                          <td class="text-center">{{ row.in_comite }}</td>
                          <td class="text-center">{{ row.is_gestionnaire }}</td>
                        </tr>

                        <tr>
                          <td :style="$helper.cellEmptyImg"></td>
                          <td class="text-center input-table">
                            <q-field
                              square
                              outlined
                              dense
                              readonly
                              hide-bottom-space
                              lazy-rules
                              :rules="[ val => montantReparti <= 0 || `Vous devez répartir le ${montantReparti} ${this.operation.devise} restant aux membres`]"
                            >
                              <template v-slot:control>
                                <div class="self-center full-width no-outline q-pa-none text-bold">
                                  {{montantReparti}} / {{operation.montant}} {{operation.devise}}
                                </div>
                              </template>
                            </q-field>
                          </td>
                          <td
                            colspan="7"
                            :style="$helper.cellEmptyImg"
                          ></td>
                        </tr>

                        <template v-if="!membres || membres.length === 0">
                          <tr class="panel-primary">
                            <td
                              :colspan="9"
                              class="text-center"
                            >
                              <nondata
                                icone="img:statics/images/icone/enseignants.png"
                                title="Aucun membre trouvé dans ce groupe"
                                btnLabel="Actualiser la liste"
                                @actualiser="getSoldeCompteEpargne()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </q-step>
              </q-stepper>
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
  name: 'groupe',
  data () {
    return {
      showDlgFilAttente: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      compte: null,
      groupe: null,

      groupes: [],
      membres: [],
      comptes: [],

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
    },

    membres: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.operation.membres = this.membres.map(e => {
            return {
              id: e.id,
              montant: this.$helper.isNumeric(e.montant) ? parseFloat(e.montant) : 0
            }
          }).filter(e => e.montant > 0)
        }
      },
      deep: true
    }
  },
  components: {
    filAttente
  },
  computed: {
    isLastStep () {
      return this.operation.step === 2
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Dépôt de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte ? this.compte.indice : ''} du groupe ${this.groupe ? this.groupe.designation : ''}. Bénéficiaire : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    montantReparti () {
      return this.membres ? this.membres.reduce((prev, next) => {
        const value = this.$helper.isNumeric(next.montant)
          ? parseFloat(next.montant)
          : 0

        return prev - value
      }, parseFloat(this.operation.montant)) : 0
    },
    soldeDisponible () {
      if (this.operation.devise && this.compte) {
        if (this.compte.solde.solde === 'C') {
          return this.compte.solde.montant
        }
      }
      return 0
    }
  },
  beforeMount () {
  },
  methods: {
    _printSoldeMembre (solde) {
      if (this.$helper.isNotEmpty(this.operation.devise)) {
        let deviseLc = this.operation.devise.toLowerCase()
        if (this.$helper.isNotEmpty(solde[deviseLc])) {
          return solde[deviseLc].solde.montant
        }
      }
      return 0
    },
    onCompteSelected (e) {
      if (e) {
        this.$vue.set(this.operation, 'devise', e.devise)
      } else {
        this.$vue.set(this.operation, 'devise', null)
      }
    },
    onGroupeSelected (groupe) {
      this.$vue.set(this.operation, 'initiateur', null)
      this.$vue.set(this.operation, 'devise', null)
      this.compte = null
      this.comptes = []
      this.membres = []

      if (groupe) {
        this.getSoldeCompteEpargne(groupe)
      }
    },
    filterGroupes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Groupe/searchGroupes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.groupes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.groupes = [] })
      })
    },
    getSoldeCompteEpargne (groupe) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_groupe: groupe.id,
        with_membres: true,
        with_solde: true
      })

      let url = `${this.URLS.BASE_URL}/Groupe/getComptesEpargnes`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.comptes = infos.data.comptes
          this.membres = infos.data.membres

          this.$vue.set(this.operation, 'initiateur', groupe.gestionnaire_str)
        } else {
          this.comptes = []
          this.compte = null
          this.groupe = null
          this.membres = []
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.comptes = []
        this.compte = null
        this.groupe = null
        this.membres = []

        this.$helper.showMessage()
      })
    },
    checkform (isOk) {
      if (isOk) {
        if (this.isLastStep) {
          this.saveForm()
        } else {
          this.operation.step += 1
        }
      }
    },
    saveForm () {
      if (!this.$helper.isNotEmpty(this.caisse)) {
        this.$helper.showMessage("Cet utilisateur n'est lié à aucune caisse, il ne peut donc pas passer des opération de décaissement")
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
          id_client: this.groupe.id,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte_caisse: this.caisse[this.operation.devise.toLowerCase()].id,
          type_decaissement: this.selectedOption.value
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Caisse/decaissement/`

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

      this.groupe = null
      this.compte = null
      this.membres = []
      this.comptes = []

      this.$refs.myForm.resetValidation()
    }

  }
}
</script>

<style>
.table tr .input-table {
  padding: 0;
}
</style>
