<template>
  <div class="row  q-px-md q-py-sm scroll ">
    <div class="col">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm col-md col-lg col-xl">
          <q-card
            flat
            bordered
          >
            <q-card-section class="row q-pa-sm q-col-gutter-sm">
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Situation au</input-label>
                <q-input
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="filtre.date_situation_au"
                  placeholder="Date."
                  mask="####-##-##"
                  readonly
                  @click="$refs.date_situation_au.show()"
                >

                  <template #prepend>
                    <q-icon
                      class="cursor-pointer"
                      name="las la-calendar"
                      style="font-size:25px"
                    >
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                        ref="date_situation_au"
                      >
                        <q-date
                          v-model="filtre.date_situation_au"
                          mask="YYYY-MM-DD"
                          @input="() => $refs.date_situation_au.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Decaissé entre</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_decaissement_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.date_decaissement_min.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_decaissement_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_decaissement_min=null"
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
                            ref="date_decaissement_min"
                          >
                            <q-date
                              v-model="filtre.date_decaissement_min"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.date_decaissement_min.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-auto">à</div>
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_decaissement_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.date_decaissement_max.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_decaissement_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_decaissement_max=null"
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
                            ref="date_decaissement_max"
                          >
                            <q-date
                              v-model="filtre.date_decaissement_max"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.date_decaissement_max.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par devise</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par devise"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.devise"
                  :options="['CDF','USD']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 0 || 'Sélectionner une devise']"
                  @input="$vue.set(filtre,'produit',null)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par type adherent</input-label>
                <q-select
                  :readonly="!(!!filtre.devise)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par type gestionnaire"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  clearable
                  map-options
                  v-model="filtre.type_client"
                  :options="optionsTypes"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par produit de crédit</input-label>
                <q-select
                  :readonly="!(!!filtre.devise)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  clearable
                  label="Par produits crédit"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.produit"
                  :options="produits"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.devise} - ${opt.designation}` : ''"
                  @filter="filterProduits"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun produit trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par objet de financement</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  clearable
                  label="Par objet de financement"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.objetFinancement"
                  :options="objet_financements"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.designation}` : ''"
                  @filter="filterObjetFinancements"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun objet de financement trouvé trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par gestionnaire </input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par gestionnaire"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.gestionnaire"
                  :options="gestionnaires"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.nom_complet}` : ''"
                  @filter="filterGestionnaires"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun gestionnaire trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par catégorie</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par catégorie"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.categorie"
                  :options="categories"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.designation}` : ''"
                  @filter="filterCategories"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucune categorie trouvée
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Montant de crédit entre</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.montant_min"
                      placeholder="Montant min."
                      lazy-rules
                    >
                      <template v-slot:append>
                        <span
                          style="font-size: small;"
                          v-if="filtre.devise"
                        >{{ filtre.devise }}</span>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-auto">à</div>
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.montant_max"
                      placeholder="Montant max."
                      lazy-rules
                    >
                      <template v-slot:append>
                        <span
                          style="font-size: small;"
                          v-if="filtre.devise"
                        >{{ filtre.devise }}</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par etat crédit</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par etat crédit"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.etat_credit"
                  :options="['TOUS','RETARD','SAIN']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 0 || 'Sélectionner un etat']"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'dialogRisque',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      gestionnaires: [],
      categories: [],
      produits: [],
      objet_financements: [],
      optionsTypes: [
        { value: 'MEMBRE', label: 'Individus' },
        { value: 'GROUPE', label: 'Groupes' },
        { value: 'ENTREPRISE', label: 'Entreprises' }
      ],
      optionsStatus: [
        { value: 'ETUDE', label: 'Uniquement les demandes en étude' },
        { value: 'VALIDE', label: 'Uniquement les demandes validées' },
        { value: 'REJETE', label: 'Uniquement les demandes rejetées' },
        { value: 'ACCORDE', label: 'Uniquement les demandes accordées' },
        { value: 'ANNULE', label: 'Uniquement les demandes annulées' }
      ]
    }
  },
  props: {
    value: Object

  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
  },
  destroyed: function () {
    this.filtre = {}
  },
  watch: {
    filtre (newValue, oldValue) {
      if (newValue) {
        this.filtre = newValue
      } else {
        this.filtre = {}
      }
    }
  },
  computed: {
    filtre: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {

    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.filtre.devise
      })

      let url = `${this.URLS.BASE_URL}/Produit_credit/searchProduitsCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.produits = []
        })
      })
    },
    filterObjetFinancements (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/ObjetFinancement/searchObjetFinancements`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.objet_financements = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.objet_financements = []
        })
      })
    },
    filterGestionnaires (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Gestionnaire/searchGestionnaires`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.gestionnaires = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.gestionnaires = []
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
        })
      }).catch(() => {
        update(() => {
          this.categories = []
        })
      })
    },

    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.filtre)
        this.showDialog = false
      }
    },
    viderChamps () {
      this.filtre = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
