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
        text="`Enregistrer l\'opération'"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />

      <menu-option
        text="Type décaissement"
        icon="option.png"
      >
        <subMenuOption
          v-model="selectedOption"
          :index="2"
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
        <q-form
          ref="myForm"
          class="q-pa-md"
        >
          <div class="
          row
          q-col-gutter-md ">
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
                    >INFORMATIONS SUR L'ENTREPRISE <span
                        class="text-primary"
                        v-if="!!entreprise && !!entreprise.folio"
                      >[ {{entreprise.folio}} ]</span></div>
                  </div>
                  <div
                    class="col-auto q-py-xs q-pr-md"
                    v-if="!!entreprise && !!entreprise.folio"
                  >
                    <q-btn
                      color="blue-1"
                      text-color="primary"
                      icon="las la-copy"
                      unelevated
                      round
                      size="sm"
                      @click="$helper.copy(entreprise.folio)"
                    >
                      <q-tooltip>
                        Copier le code de l'entreprise
                      </q-tooltip>

                    </q-btn>
                  </div>
                </div>
                <q-separator />
                <div class="q-px-md q-pt-sm q-pb-md">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <input-label required>Rechercher une entreprise</input-label>
                      <q-select
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        placeholder="Rechercher une entreprise"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        clearable
                        behavior="menu"
                        v-model="entreprise"
                        :options="entreprises"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.folio} - ${opt.designation}`"
                        @filter="filterEntreprises"
                        lazy-rules
                        :rules="[ val => !!val || 'Sélectionner une entreprise']"
                        @input="onEntrepriseSelected"
                      >
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucune entreprise trouvé
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
                        :readonly="!(!!entreprise)"
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
                    <div class="col-12">
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
                          >{{!!entreprise ? entreprise.sigle || 'Non défini' :'Non défini'}}</div>
                        </template>
                      </q-field>
                    </div>
                    <div class="col-12">
                      <q-card
                        flat
                        bordered
                        class="radius-none"
                        @click="showDlgActionnaire=true"
                      >
                        <q-card-section class="row items-center q-col-gutter-sm">
                          <div class="col-auto"><q-icon
                              name="las la-users"
                              size="30px"
                            />
                          </div>
                          <div class="col text-primary text-bold">Afficher les actionnaires</div>
                        </q-card-section>
                      </q-card>
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
        </q-form>
      </div>
    </div>

    <filAttente
      v-model="showDlgFilAttente"
      :user="user"
    />

    <afficherActionnaires
      v-model="showDlgActionnaire"
      :actionnaires="actionnaires"
    />
  </q-page>
</template>
<script>
import filAttente from '../../fil_attente/fil_attente.vue'
import afficherActionnaires from './afficher_actionnaire.vue'

export default {
  name: 'entreprise',
  data () {
    return {
      showDlgFilAttente: false,
      showDlgActionnaire: false,

      operation: {
        default_libelle: true
      },

      compte: null,
      entreprise: null,

      entreprises: [],
      actionnaires: [],
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
    }

  },
  components: {
    filAttente,
    afficherActionnaires
  },
  computed: {

    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Retrait de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte ? this.compte.indice : ''} de l'entreprise ${this.entreprise ? this.entreprise.designation : ''}. Bénéficiaire : ${this.operation.initiateur || 'Non défini'}`)
        }
        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
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
    onCompteSelected (e) {
      if (e) {
        this.$vue.set(this.operation, 'devise', e.devise)
      } else {
        this.$vue.set(this.operation, 'devise', null)
      }
    },
    onEntrepriseSelected (entreprise) {
      this.$vue.set(this.operation, 'initiateur', null)
      this.$vue.set(this.operation, 'devise', null)
      this.compte = null
      this.comptes = []
      this.actionnaires = []

      if (entreprise) {
        this.getSoldeCompteEpargne(entreprise)
      }
    },
    filterEntreprises (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Entreprise/searchEntreprises`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.entreprises = infos.data.records
        })
      }).catch(() => {
        update(() => { this.entreprises = [] })
      })
    },
    getSoldeCompteEpargne (entreprise) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_entreprise: entreprise.id,
        with_actionnaires: true,
        with_solde: true
      })

      let url = `${this.URLS.BASE_URL}/Entreprise/getComptesEpargnes`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.comptes = infos.data.comptes
          this.actionnaires = infos.data.actionnaires

          this.$vue.set(this.operation, 'initiateur', entreprise.responsable_str)
        } else {
          this.comptes = []
          this.compte = null
          this.entreprise = null
          this.actionnaires = []
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.comptes = []
        this.compte = null
        this.entreprise = null
        this.actionnaires = []

        this.$helper.showMessage()
      })
    },
    checkform (isOk) {
      if (isOk) {
        this.saveForm()
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
          id_client: this.entreprise.id,
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
        default_libelle: true
      }

      this.entreprise = null
      this.compte = null
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
