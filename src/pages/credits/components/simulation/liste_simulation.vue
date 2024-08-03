<template>
  <q-page style="min-height:0">
    <div class="ba overflow-hidden panel-primary q-mt-sm">
      <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
        <div class="col">
          <div class="text-h6">Simulation crédit</div>
        </div>

        <div class="col-auto">
          <q-btn
            color="blue-1"
            text-color="primary"
            label="Lancer la simulation"
            icon="las la-check"
            unelevated
            rounded
            size="
                12px"
            no-caps
            @click="$refs.myForm.validate().then(saveForm)"
          />

        </div>

      </div>
      <linearLoading :loading="loading" />
      <q-separator />

      <q-form
        ref="myForm"
        class="q-pa-sm"
      >

        <div class="row q-col-gutter-md ">
          <!-- ******************************************* -->
          <!-- ******************************************* -->
          <!-- ************** SITE ******************* -->
          <!-- ******************************************* -->
          <!-- ******************************************* -->
          <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
            <div class="ba overflow-hidden panel-primary">

              <div class="q-pa-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Produit de crédit</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      placeholder="Sélectionner un produit de crédit"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      clearable
                      v-model="simulation.produit"
                      :options="produits"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.designation}`"
                      @filter="filterProduits"
                      @input="onProduitSelected"
                      lazy-rules
                      :rules="[ val => !!val || 'Sélectionner un produit']"
                    >
                      <template #no-option>
                        <q-item>
                          <q-item-section class="text-red">
                            produit de crédit trouvé
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Type d'amortissement</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      placeholder="Sélectionner type amortissement"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      clearable
                      use-input
                      v-model="simulation.amortissement"
                      :options="amortissementTab"
                      :option-value="opt => opt"
                      lazy-rules
                      :rules="[val => !!val || 'Choisissez un type d\'amortissement']"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Montant de prêt</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="simulation.montant_pret"
                      placeholder="Montant"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',]"
                      class="mrg"
                      maxlength="15"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Taux d'intérêt annuel</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="simulation.taux_interet"
                      placeholder="Taux"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) > 0 && parseFloat(val) < 100 || 'en O et 100% svp',]"
                      class="mrg"
                      maxlength="4"
                    >
                      <template v-slot:append>
                        <div style="font-size:13px"><strong>%</strong></div>
                      </template>
                    </q-input>
                  </div>

                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Echeance</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="simulation.echeance"
                      placeholder="echéance"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumber(val) || 'Uniquement les nombres entiers',
                                val => parseInt(val) >= 0 || 'L\'échéance doit être un nombre positif']"
                      class="mrg"
                      maxlength="6"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label>Differées (Facultatif)</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="simulation.differe"
                      placeholder="Differées (Facultatif)"
                      lazy-rules
                      :rules="[ val => !val || val && val.trim().length > 0 || 'Champs requis',
                                val => !val || this.$helper.isNumber(val) || 'Uniquement les nombre entiers',
                                val => !val || parseInt(val) >= 0 || 'Le differé doit être un nombre positif']"
                      class="mrg"
                      maxlength="3"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Date effet</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="simulation.started_date"
                      placeholder="Date effet"
                      mask="####-##-##"
                      lazy-rules
                      readonly
                      :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                      @click="$refs.popup_dt_effet.show()"
                    >
                      <template #append>
                        <q-icon
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_effet"
                          >
                            <q-date
                              v-model="simulation.started_date"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_effet.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col">
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
                      v-model="simulation.periodicite"
                      :options="periodicites"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt}`"
                      lazy-rules
                      :rules="[val => !!val || 'Choisissez une option']"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="ba overflow-hidden panel-primary">
              <div class="row items-center">
                <div class="col">
                  <div class="q-pa-sm text-bold">
                    Tableau d'amortissement
                  </div>
                </div>
                <div
                  class="col-auto q-pr-md"
                  v-if="$helper.isNotEmpty(tableau)"
                >
                  <q-btn
                    color="blue-1"
                    text-color="primary"
                    label="Imprimer le tableau"
                    icon="las la-print"
                    unelevated
                    rounded
                    size="11px"
                    no-caps
                  />
                </div>
              </div>
              <q-separator />
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>N*</th>
                    <th class="text-left">ECHEANCE</th>
                    <th class="text-right">INTERET</th>
                    <th class="text-right">CAPITAL</th>
                    <th class="text-right">MENSUALITE</th>
                    <th class="text-right">CAPITAL RESTANT DU</th>
                  </tr>
                </thead>
                <tbody style="font-size:12px">
                  <tr
                    v-for="(row,index) in tableau"
                    :key="index"
                  >
                    <td class="text-center text-bold">{{index + 1}}</td>
                    <td class="text-left text-bold">{{$helper.dateBien(row.date_echeance,false)}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(row.interet)}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(row.capital)}}</td>
                    <td class="text-right text-bold text-primary bg-blue-1">{{$helper.formatMoney(row.mensualite)}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(row.capital_restant)}}</td>
                  </tr>
                  <tr v-if="totaux">
                    <td
                      colspan="2"
                      class="text-left text-bold text-primary"
                    >TOTAL</td>
                    <td class="text-right text-bold text-primary">{{$helper.formatMoney(totaux.interet)}}</td>
                    <td class="text-right text-bold text-primary">{{$helper.formatMoney(totaux.capital)}}</td>
                    <td class="text-right text-bold text-primary">{{$helper.formatMoney(totaux.mensualite)}}</td>
                    <td class="text-right text-bold text-primary">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </q-form>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'dialogValidationProduit',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      simulation: {},
      produits: [],
      tableau: [],
      totaux: {},

      calculPenalite: [],
      ordresRemoursement: [],
      periodicites: [],
      amortissementTab: []

    }
  },

  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    this.$vue.set(this.simulation, 'started_date', this.$helper.now())
    this.getStaticsDatas()
  },
  destroyed: function () { },
  watch: {},
  computed: {},
  methods: {
    viderChamps () {
      this.simulation = {
        produit: this.simulation.produit
      }
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    onProduitSelected (e) {
      this.tableau = []

      if (e) {
        this.$vue.set(this.simulation, 'taux_interet', e.taux_interet_max)
      } else {
        this.$vue.set(this.simulation, 'taux_interet', null)
      }
    },
    getStaticsDatas (val, update, abort) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Produit_credit/getStaticsDatas`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.calculPenalite = infos.data.calcul_penalite
          this.ordresRemoursement = infos.data.ordres_remoursement
          this.periodicites = infos.data.periodicites
          this.amortissementTab = infos.data.amortissements
        }
      }).catch(() => {
        this.$q.loading.hide()
      })
    },

    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Produit_credit/searchProduitsCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = infos.data.records
        })
      }).catch(() => {
        update(() => { this.produits = [] })
      })
    },
    saveForm (isOk) {
      if (!isOk) return
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        ...this.simulation
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Decaissement/simulationTableauAmortissement`

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.tableau = infos.data.tableau
          this.totaux = infos.data.totaux
        } else {
          this.$helper.showMessage(infos.data.message, 0, 'center')
        }
      }).catch((e) => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    }

  }

}
</script>
<style lang="stylus"></style>
