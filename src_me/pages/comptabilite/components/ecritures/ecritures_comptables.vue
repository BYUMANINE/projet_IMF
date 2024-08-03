<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="()=>{}"
      />

      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        text="Enregistrer l'opération"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(saveForm)"
      />

    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre
        height="60px"
        spacing="18"
        size="18px"
      >
        <template #titre>
          ECRITURES COMPTABLES
        </template>
      </grandTitre>

      <div class="panel-primary">
        <div class="row">
          <div class="col-12">
            <q-form
              ref="myForm"
              class="q-pa-sm"
            >
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** TRANSACTION **************** -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                          style="font-size:15px"
                        >{{$helper.formatMoney(_totalDebit)}} {{operation.devise}}</span>
                      </div>
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">

                        <div class="col-12">
                          <input-label
                            required
                            info="Sélectionner la devise avant de tenter de saisier les écritures comptables"
                          >Sélectionner la devise</input-label>
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
                                      @click.native="onDeviseClicked('CDF')"
                                    />
                                  </div>
                                  <div class="col">
                                    <q-radio
                                      v-model="operation.devise"
                                      val="USD"
                                      label="USD"
                                      dense
                                      class="text-bold"
                                      @click.native="onDeviseClicked('USD')"
                                    />
                                  </div>
                                </div>
                              </div>
                            </template>
                          </q-field>
                        </div>

                        <div class="col-12">
                          <input-label>Numéro de la pièce (Facultatif)</input-label>
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
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="operation.libelle"
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
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                  <div class="ba overflow-hidden panel-primary ">
                    <div class="row items-center q-col-gutter-sm">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >COMPTES</div>
                      </div>

                      <div class="col-auto">
                        <q-btn
                          :disable="!operation.devise"
                          color="blue-1"
                          text-color="blue"
                          label="Ajouter compte"
                          rounded
                          no-caps
                          unelevated
                          icon="add"
                          outline
                          size="12px"
                          @click="addLigne()"
                        />
                      </div>
                      <div class="col-auto">
                        <q-btn
                          :disable="step == 1 || !operation.devise"
                          :icon="`img:statics/images/icone/${step == 1 ? 'prev_desable.png' : 'prev.png'}`"
                          color="blue-1"
                          text-color="primary"
                          label="Précédent"
                          size="12px"
                          unelevated
                          outline
                          rounded
                          no-caps
                          @click="onPrevClicked()"
                        />
                      </div>

                      <div class="col-auto q-pr-sm">
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          label="Suivant"
                          size="12px"
                          unelevated
                          outline
                          rounded
                          no-caps
                          :disable="step == 2 || !operation.devise"
                          :icon-right="`img:statics/images/icone/${step === 2 ? 'next_disable.png' : 'next.png'}`"
                          @click="onNextClicked()"
                        />
                      </div>
                    </div>
                    <q-separator />
                    <q-stepper
                      v-model="step"
                      ref="stepper"
                      color="primary"
                      class="q-pa-none panel-primary q-pa-none-stepper"
                      transition-next="fade"
                      transition-prev="fade"
                      style="min-height:45vh"
                      flat
                    >
                      <q-step
                        :name="1"
                        title="Comptes à débiter"
                        icon="las la-portrait"
                        :done="step > 1"
                      >
                        <q-separator />
                        <table class="table head-bold table-colored-head tiny-body ba-outer">
                          <thead>
                            <tr>
                              <th class="text-left">COMPTES A DEBITER</th>
                              <th>POSTE</th>
                              <th>MONTANT</th>
                              <th>SOLDE</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody style="font-size:11.5px">
                            <tr
                              v-for="(row, index) in operation.debit"
                              :key="index"
                            >
                              <td>
                                <q-select
                                  :disable="!operation.devise"
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
                                  v-model="row.compte"
                                  :options="comptes"
                                  :option-value="opt => opt"
                                  :option-label="opt => !!opt? `${opt.indice} - ${opt.devise} - ${opt.intitule}` : ''"
                                  @filter="filterComptes"
                                  lazy-rules
                                  :rules="[ val => !!val || 'Sélectionner un compte']"
                                  @input="e=>onCompteSelected(e,row)"
                                >
                                  <template #no-option>
                                    <q-item>
                                      <q-item-section class="text-red">
                                        Aucun compte trouvé
                                      </q-item-section>
                                    </q-item>
                                  </template>
                                  <template #prepend>
                                    <q-avatar
                                      size="20px"
                                      font-size="11px"
                                      color="primary"
                                      text-color="white"
                                    >
                                      {{index+1}}
                                    </q-avatar>
                                  </template>
                                </q-select>
                              </td>
                              <td class="text-bold text-center">
                                {{!!row.compte ? row.compte.poste : '---'}}
                              </td>
                              <td style="width:25%">
                                <q-input
                                  :disable="!operation.devise"
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="row.montant"
                                  placeholder="Montant"
                                  lazy-rules
                                  :rules="[ val => !!val && val.trim().length > 0 || 'Champs requis',
                                            val => $helper.isNumeric(val) || 'Uniquement les chiffres',
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
                              </td>
                              <td class="text-center text-bold">
                                {{!!row.compte ? `S${row.compte.solde.solde.solde} : ${$helper.formatMoney(row.compte.solde.solde.montant)}` : 'SDC : 0,00'}}
                              </td>
                              <td class="text-center">
                                <q-btn
                                  v-if="operation.debit.length > 1"
                                  color="red-1"
                                  text-color="red"
                                  icon="las la-trash-alt"
                                  round
                                  unelevated
                                  size="sm"
                                  @click="removeLigne(row)"
                                />
                              </td>
                            </tr>

                            <tr class="panel-primary">
                              <td
                                :style="$helper.cellEmptyImg"
                                class="text-bold"
                                colspan="2"
                              >
                                <div
                                  class="q-px-sm"
                                  style="font-size:13px"
                                >TOTAL DEBIT</div>
                              </td>
                              <td class="text-center text-bold">
                                <div
                                  class="q-pa-xs"
                                  style="font-size:13px"
                                >
                                  {{$helper.formatMoney(_totalDebit)}} {{operation.devise}}</div>
                              </td>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td :style="$helper.cellEmptyImg"></td>
                            </tr>
                          </tbody>
                        </table>
                      </q-step>
                      <q-step
                        :name="2"
                        title="Comptes à créditer"
                        icon="las la-portrait"
                        :done="step > 2"
                      >
                        <q-separator />
                        <table class="table head-bold table-colored-head tiny-body ba-outer">
                          <thead>
                            <tr>
                              <th class="text-left">COMPTES A CREDITER</th>
                              <th>POSTE</th>
                              <th>MONTANT</th>
                              <th>SOLDE</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody style="font-size:11.5px">
                            <tr
                              v-for="(row, index) in operation.credit"
                              :key="index"
                            >
                              <td>
                                <q-select
                                  :disable="!operation.devise"
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Rechercher un compte à créditer"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  clearable
                                  behavior="menu"
                                  v-model="row.compte"
                                  :options="comptes"
                                  :option-value="opt => opt"
                                  :option-label="opt => !!opt? `${opt.indice} - ${opt.devise} - ${opt.intitule}` : ''"
                                  @filter="filterComptes"
                                  lazy-rules
                                  :rules="[ val => !!val || 'Sélectionner un compte']"
                                  @input="e=>onCompteSelected(e,row)"
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
                                    <q-avatar
                                      size="20px"
                                      font-size="11px"
                                      color="primary"
                                      text-color="white"
                                    >
                                      {{index+1}}
                                    </q-avatar>
                                  </template>
                                </q-select>
                              </td>
                              <td class="text-bold text-center">
                                {{!!row.compte ? row.compte.poste : '---'}}
                              </td>
                              <td style="width:25%">
                                <q-input
                                  :disable="!operation.devise"
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="row.montant"
                                  placeholder="Montant"
                                  lazy-rules
                                  :rules="[ val => !!val && val.trim().length > 0 || 'Champs requis',
                                            val => $helper.isNumeric(val) || 'Uniquement les chiffres',
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
                              </td>
                              <td class="text-center text-bold">
                                {{!!row.compte ? `S${row.compte.solde.solde.solde} : ${$helper.formatMoney(row.compte.solde.solde.montant)}` : 'SDC : 0,00'}}
                              </td>
                              <td class="text-center">
                                <q-btn
                                  v-if="operation.credit.length > 1"
                                  color="red-1"
                                  text-color="red"
                                  icon="las la-trash-alt"
                                  round
                                  unelevated
                                  size="sm"
                                  @click="removeLigne(row)"
                                />
                              </td>
                            </tr>

                            <tr class="panel-primary">
                              <td
                                :style="$helper.cellEmptyImg"
                                class="text-bold"
                                colspan="2"
                              >
                                <div
                                  class="q-px-sm"
                                  style="font-size:13px"
                                >TOTAL CREDIT</div>
                              </td>
                              <td class="text-center text-bold">
                                <div
                                  class="q-pa-xs"
                                  style="font-size:13px"
                                >
                                  {{$helper.formatMoney(_totalCredit)}} {{operation.devise}}</div>
                              </td>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td :style="$helper.cellEmptyImg"></td>
                            </tr>
                          </tbody>
                        </table>

                      </q-step>
                    </q-stepper>

                  </div>
                </div>

              </div>
            </q-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>

export default {
  name: 'ecriture_comptable',
  data () {
    return {
      URLS: {},
      user: {},

      step: 1,

      operation: {
        devise: null,
        debit: [{}, {}, {}],
        credit: [{}, {}, {}]
      },
      comptes: []
    }
  },
  props: [],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  watch: {},
  components: {
  },
  filters: {},
  computed: {
    _totalDebit () {
      let total = 0
      this.operation.debit.forEach(e => {
        const val = this.$helper.isNumeric(e.montant) ? parseFloat(e.montant) : 0
        total += val
      })
      return total
    },
    _totalCredit () {
      let total = 0
      this.operation.credit.forEach(e => {
        const val = this.$helper.isNumeric(e.montant) ? parseFloat(e.montant) : 0
        total += val
      })
      return total
    }
  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt + A
      } else if (e.altKey && e.which === 90) { // Alt + Z
      } else if (e.altKey && e.which === 82) { // Alt + R
      }
    },
    addLigne () {
      if (this.step === 1) {
        this.operation.debit.push({})
      } else {
        this.operation.credit.push({})
      }
    },
    removeLigne (row) {
      if (row) {
        if (this.step === 1) {
          this.operation.debit.splice(this.operation.debit.indexOf(row), 1)
        } else {
          this.operation.credit.splice(this.operation.credit.indexOf(row), 1)
        }
      }
    },
    onNextClicked () {
      this.$refs.myForm.validate().then((isOk) => {
        if (!isOk) return

        if (this.step < 2) {
          this.step++
        }
      })
    },
    onPrevClicked () {
      this.$refs.myForm.validate().then((isOk) => {
        if (!isOk) return

        if (this.step > 1) {
          this.step--
        }
      })
    },
    onDeviseClicked (devise) {
      if (this._totalDebit > 0) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Changement de la devise en cours...',
          message: `En changeant la devise, toutes les écritures déjà saisies seront perdues; Continuer quand-même ?`,
          cancel: 'Annuler',
          ok: 'Oui, continuer',
          persistent: true
        }).onOk(() => {
          this.operation.debit = [{}, {}, {}]
          this.operation.credit = [{}, {}, {}]
          this.$refs.myForm.resetValidation()
        }).onCancel(() => {
          this.$vue.set(this.operation, 'devise', devise === 'CDF' ? 'USD' : 'CDF')
        })
      } else {
        this.operation.debit = [{}, {}, {}]
        this.operation.credit = [{}, {}, {}]
        this.$refs.myForm.resetValidation()
      }
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        exclude: ['57'],
        signe_length: '>=',
        with_length: '14',
        solde: true,
        devise: this.operation.devise
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
    onCompteSelected (e, row) {
      if (e) {
        if (this.step === 1) {
          let isDebitExiste = 0

          for (let i = 0; i < this.operation.debit.length; i++) {
            const cmpt = this.operation.debit[i].compte
            if (!!cmpt && cmpt.id === e.id) {
              isDebitExiste++
            }

            if (isDebitExiste > 1) {
              break
            }
          }

          if (isDebitExiste > 1) {
            row.compte = null
            this.$helper.showMessage(`Le compte [ ${e.indice}-${e.intitule} ] éxiste déjà au débit`)
          }
        } else {
          let isCreditExiste = 0

          for (let i = 0; i < this.operation.credit.length; i++) {
            const cmpt = this.operation.credit[i].compte
            if (!!cmpt && cmpt.id === e.id) {
              isCreditExiste++
            }

            if (isCreditExiste > 1) {
              break
            }
          }

          if (isCreditExiste > 1) {
            row.compte = null
            this.$helper.showMessage(`Le compte [ ${e.indice}-${e.intitule} ] éxiste déjà au crédit`)
          }
        }
      }
    },

    saveForm (isOk) {
      if (!isOk) return

      const debit = this._totalDebit
      const credit = this._totalCredit

      if (debit > credit) {
        this.$helper.showMessage('Le total débit est superieur au total crédit')
        return
      }

      if (debit < credit) {
        this.$helper.showMessage('Le total crédit est superieur au total débit')
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
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Compte/saveEcrituresComptables/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          if (infos.data.erreur === false) {
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
        devise: null,
        debit: [{}, {}, {}],
        credit: [{}, {}, {}]
      }
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style>
.tiny-body tr td {
  padding: 2px !important;
}
</style>
