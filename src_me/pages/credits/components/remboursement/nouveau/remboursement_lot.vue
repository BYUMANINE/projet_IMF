<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 1200px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Remboursement par lot</div>
            </div>

            <div class="col-auto">
              <q-btn
                :disable="dossiers.length === 0 || !isFinish"
                color="blue-1"
                text-color="primary"
                label="Lancer le remboursement"
                icon="las la-cloud-upload-alt"
                unelevated
                rounded
                size="
                12px"
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
                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                    <div class="ba overflow-hidden panel-primary">

                      <div class="q-pa-md">
                        <div class="row q-col-gutter-sm">
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Produit de crédit</input-label>
                            <q-select
                              :disable="!isFinish"
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
                              v-model="selectedProduit"
                              :options="produits"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.designation}  ${opt.devise}`"
                              @filter="filterProduits"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner un produit']"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun produit de crédit trouvé
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <input-label>Catégorie</input-label>
                            <q-select
                              :disable="!isFinish"
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Sélectionner une catégorie"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="selectedCategorie"
                              :options="categories"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.designation}`"
                              @filter="filterCategories"
                              lazy-rules
                              :rules="[ val => !!val || 'Sélectionner une catégorie']"
                            >
                              <template #no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucune catégorie
                                  </q-item-section>
                                </q-item>
                              </template>
                              <template #after>
                                <q-btn
                                  :disable="!isFinish"
                                  color="primary"
                                  icon="search"
                                  label="Charger les dossiers"
                                  unelevated
                                  no-caps
                                  @click="getDossierParLot()"
                                />
                              </template>
                            </q-select>
                          </div>

                          <div class="col-12">
                            <div
                              class="scroll ba panel-primary"
                              style="min-height:40vh;max-height:40vh"
                            >
                              <table class="table head-bold hover table-striped table-colored-head">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>N*</th>
                                    <th>NUM. DOSSIER</th>
                                    <th>CODE</th>
                                    <th class="text-left">ADHERENT</th>
                                    <th class="text-left">PRODUIT</th>
                                    <th>SOLDE</th>
                                    <th>ENCOURS</th>
                                    <th>IMPAYE</th>
                                    <th>CAPITAL</th>
                                    <th>INTERET</th>
                                    <th>PENALITE</th>
                                    <th>RETARD</th>
                                    <th>ECHEANCE</th>
                                  </tr>
                                </thead>
                                <tbody style="font-size:12px;">
                                  <tr
                                    v-for="(row,index) in dossiers"
                                    :key="index"
                                  >
                                    <td class="text-center">
                                      <div
                                        @click="isFinish ? (row.selected = !row.selected):null"
                                        style="width:18px;height:18px;border:2px solid #0266fe;text-align:center;margin:2px auto"
                                        :class="row.selected ? 'bg-primary' : 'bg-white'"
                                      >
                                        <span
                                          v-if="row.selected"
                                          class="las la-check text-white"
                                          style="font-size:14px"
                                        ></span>
                                      </div>
                                    </td>
                                    <td class="text-center">{{index + 1}}</td>
                                    <td class="text-center text-bold">{{row.code}}</td>
                                    <td class="text-center">{{row.folio}}</td>
                                    <td class="text-left">{{row.client_str}}</td>
                                    <td class="text-left">{{row.produit_str}}</td>
                                    <td class="text-right">{{$helper.formatMoney(row.solde_epargne)}}</td>
                                    <td class="text-right">{{$helper.formatMoney(row.encours_capital)}}</td>
                                    <td class="text-right text-bold">{{$helper.formatMoney(row.total_impaye)}}</td>
                                    <td class="text-right text-bold">{{$helper.formatMoney(row.impaye_capital)}}</td>
                                    <td class="text-right text-bold">{{$helper.formatMoney(row.impaye_interet)}}</td>
                                    <td class="text-right text-bold">{{$helper.formatMoney(row.impaye_penalite)}}</td>
                                    <td class="text-center">{{row.jours_retard}} Jr(s)</td>
                                    <td class="text-center">{{$helper.dateBien(row.date_echeance,false)}}</td>
                                  </tr>
                                  <tr>
                                    <td colspan="14"></td>
                                  </tr>
                                  <tr v-if="dossiers.length === 0">
                                    <td
                                      colspan="14"
                                      class="text-center bg-white"
                                    >
                                      <div class="q-py-xl">
                                        <q-img
                                          src="statics/images/icone/cloud.png"
                                          spinner-color="white"
                                          spinner-size="15px"
                                          style="height: 60px; max-width: 60px"
                                        /> <br>
                                        <span style="font-size:14px">Aucun dossier chargé</span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div
                            class="col-12 text-right"
                            v-if="isSending || !isFinish || succes"
                          >
                            <div
                              class="q-pa-md text-bold"
                              v-if="!isFinish"
                            >
                              <q-spinner
                                color="primary"
                                size="2em"
                                class="q-mr-md"
                              />
                              Remboursement en cours (<span class="text-primary">{{increment}}%</span>) ...
                            </div>

                            <div
                              class="q-pa-md text-bold"
                              v-if="succes"
                            >
                              <q-icon
                                name="las la-check"
                                size="20px"
                                color="primary"
                                class="q-mr-md"
                              />
                              Remboursement terminé
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
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogSuiviIndividuel',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      selectedProduit: null,
      selectedCategorie: null,
      produits: [],
      dossiers: [],
      categories: [],

      defaultProduit: { id: 'ALL', designation: 'Tous les produits', devise: '' },
      defaultCategorie: { id: 'ALL', designation: 'Toutes les catégories' },

      increment: 0,
      isSending: false,
      incrementId: null,
      isFinish: true,
      succes: false
    }
  },
  props: {
    value: Boolean,
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed () {
    clearInterval(this.incrementId)
  },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },

  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.viderChamps()
      } else {
        clearInterval(this.incrementId)
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    viderChamps () {
      this.isFinish = true
      this.increment = 0
      this.isSending = false
      this.succes = false

      this.dossiers = []
      this.produits = [this.defaultProduit]
      this.categories = [this.defaultCategorie]
      this.selectedProduit = this.defaultProduit
      this.selectedCategorie = this.defaultCategorie

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
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
          this.produits.unshift(this.defaultProduit)
        })
      }).catch(() => {
        update(() => {
          this.produits = [this.defaultProduit]
        })
      })
    },
    filterCategories (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Categorie/searchCategories`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.categories = infos.data.records
          this.categories.unshift(this.defaultCategorie)
        })
      }).catch(() => {
        update(() => {
          this.categories = [this.defaultCategorie]
        })
      })
    },
    getDossierParLot (e) {
      this.succes = false

      if (!this.selectedProduit) return

      let donnees = JSON.stringify({
        id_produit_credit: this.selectedProduit.id,
        id_categorie: this.selectedCategorie.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })
      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Remboursement/getDossierParLot`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.dossiers = infos.data.records
        } else {
          this.dossiers = []
          this.$helper.showMessage(infos.data.message)
        }
      }).catch(() => {
        this.dossiers = []
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },
    incrementPourcent (value = 1, delay = 5000) {
      this.increment = value
      clearInterval(this.incrementId)
      this.incrementId = setInterval(() => {
        if (this.increment < 100) {
          this.increment++
        } else {
          if (!this.isSending) {
            this.isFinish = true
            this.dossiers = []
            this.succes = true
          }
          clearInterval(this.incrementId)
        }
      }, delay)
    },
    saveForm (isOk) {
      if (!isOk) return

      if (this.dossiers.filter(e => e.selected).length === 0) {
        this.$helper.showMessage('Aucun dossier sélectionné; Sélectionner au moins un dossier')
        return
      }

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment lancer ce remboursement ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_produit_credit: this.selectedProduit.id,
          id_categorie: this.selectedCategorie.id,
          exclude: this.dossiers.filter(e => !e.selected).map(e => e.id_dossier)
        })

        this.incrementPourcent()
        this.isSending = true
        this.isFinish = false
        this.succes = false

        let url = `${this.URLS.BASE_URL}/Remboursement/addRemboursementLot`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          if (infos.data.erreur === false) {
            this.$emit('onFinish', true)

            this.isSending = false

            if (this.increment < 100) {
              this.incrementPourcent(this.increment, 100)
            } else {
              this.isFinish = true
              this.dossiers = []
              this.succes = true
            }
          } else {
            this.succes = false
            this.isFinish = true
            this.isSending = false
            clearInterval(this.incrementId)
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.succes = false
          this.isFinish = true
          this.isSending = false
          clearInterval(this.incrementId)
          this.$helper.showMessage()
        })
      })
    }
  }

}
</script>

<style></style>
