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
        text="Type décaissement"
        icon="option.png"
      >
        <subMenuOption
          v-model="selectedOption"
          :index="4"
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
            <q-form
              class="q-pa-md"
              ref="myForm"
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
                        >INFORMATIONS SUR LE COMPTE</div>
                      </div>
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label>Rechercher un compte à débiter</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Rechercher un compte à débiter"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            clearable
                            behavior="menu"
                            v-model="selectedCompte"
                            :options="comptes"
                            :option-value="opt => opt"
                            :option-label="opt => !!opt? `${opt.indice} - ${opt.devise} - ${opt.intitule}` : ''"
                            @filter="filterComptes"
                            lazy-rules
                            :rules="[ val => !!val || 'Sélectionner un compte']"
                            @input="onCompteSelected"
                          >
                            <template #option="scope">
                              <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                              >
                                <q-item-section>
                                  <q-item-label>
                                    <span class="semi-bold">{{scope.opt.indice}}</span> -
                                    <span class="text-primary semi-bold">{{scope.opt.devise}}</span> -
                                    {{scope.opt.intitule}}
                                  </q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-separator />
                            </template>
                            <template #no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucun compte trouvé
                                </q-item-section>
                              </q-item>
                            </template>
                            <template #prepend>
                              <q-icon name="search" />
                            </template>
                          </q-select>
                        </div>
                        <div class="col-12">
                          <input-label>Numéro de compte {{!!compte ? compte.devise : ''}}</input-label>
                          <q-field
                            square
                            outlined
                            dense
                            readonly
                            bg-color="blue-2"
                          >
                            <template #control>
                              <div
                                class="text-primary text-bold"
                                tabindex="0"
                              >{{!!compte ? compte.indice || 'Non défini':'Non défini'}}</div>
                            </template>
                          </q-field>
                        </div>
                        <div class="col-12">
                          <input-label>Classe de compte</input-label>
                          <q-field
                            square
                            outlined
                            dense
                            readonly
                          >
                            <template #control>
                              <div
                                class="text-bold"
                                tabindex="0"
                              >{{!!compte ? compte.classe || 'Non défini':'Non défini'}}</div>
                            </template>
                          </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Type de compte</input-label>
                          <q-field
                            square
                            outlined
                            dense
                            readonly
                          >
                            <template #control>
                              <div
                                class="text-bold"
                                tabindex="0"
                              >{{!!compte ? compte.poste || 'Non défini':'Non défini'}}</div>
                            </template>
                          </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label>Solde {{!!compte ? compte.devise :''}}</input-label>
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
                              >{{!!compte && !!compte.solde ? $helper.formatMoney(compte.solde.solde.montant) || '0,00':'0,00'}}</div>
                            </template>
                            <template #prepend>
                              <div
                                style="font-size:14px"
                                class="text-bold"
                              >{{!!compte && !!compte.solde ? `S${compte.solde.solde.solde} :` || 'SDC :':'SDC :'}}</div>
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
                          <input-label required>Sélectionner la devise</input-label>
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
                          <input-label>Nom complet du bénéficiaire</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="operation.initiateur"
                            placeholder="Bénéficiaire"
                            lazy-rules
                            :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
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
                            rows="4"
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
  name: 'autres_decaissements',
  data () {
    return {
      showDlgFilAttente: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      compte: null,
      selectedCompte: null,
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
    filAttente
  },
  computed: {
    _isLastStep () {
      return this.operation.step === 1
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Décaissement de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte ? this.compte.indice : ''} intitulé ${this.compte ? this.compte.intitule : ''}. Bénéficiaire : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    }

  },
  beforeMount () {
  },
  methods: {
    onCompteSelected (cmpt) {
      if (cmpt) {
        this.getSoldeCompte(cmpt)
      } else {
        this.compte = null
        this.operation.devise = null
      }
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        exclude: ['3', '103', '5'],
        signe_length: '>=',
        with_length: '14'
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.comptes = [] })
      })
    },
    getSoldeCompte (cmpt) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_compte: cmpt.id,
        devise: cmpt.devise
      })

      let url = `${this.URLS.BASE_URL}/Compte/getSoldeCompte`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.compte = { ...cmpt }

          // this.$vue.set(this.compte, 'solde', infos.data.records)
          this.compte.solde = infos.data.records
          this.operation.devise = cmpt.devise

          // this.$forceUpdate()
        } else {
          this.selectedCompte = null
          this.compte = null
          this.operation.devise = null
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.compte = null
        this.operation.devise = null
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
        default_libelle: true
      }

      this.selectedCompte = null
      this.compte = null

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
