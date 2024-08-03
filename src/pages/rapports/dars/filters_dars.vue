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
                  v-model="filtre.devise"
                  :options="['CDF','USD']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  lazy-rules
                  :rules="[val => !!val || 'Choisissez une option']"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par état</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par état"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.status"
                  :options="optionsStatus"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par type client</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par type client"
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
                <input-label>Par produit DARS</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  clearable
                  label="Par produits DARS"
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
                <input-label>Par client (Adherent)</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par client membre"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.client"
                  :options="clients"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.folio} - ${opt.client_str}` : ''"
                  @filter="filterClients"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun membre trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par categorie de client</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par categorie client"
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
                <input-label>Intervalle montant</input-label>
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
                <input-label>Date d'ouverture</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_ouverture_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_ouverture_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_ouverture_min=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops3"
                          >
                            <q-date
                              v-model="filtre.date_ouverture_min"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops3.hide()"
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
                      v-model="filtre.date_ouverture_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_ouverture_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_ouverture_max=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops4"
                          >
                            <q-date
                              v-model="filtre.date_ouverture_max"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops4.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Date de debut</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_debut_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_debut_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_debut_min=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops3"
                          >
                            <q-date
                              v-model="filtre.date_debut_min"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops3.hide()"
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
                      v-model="filtre.date_debut_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_debut_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_debut_max=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops4"
                          >
                            <q-date
                              v-model="filtre.date_debut_max"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops4.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Date de fin</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_fin_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_fin_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_fin_min=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops3"
                          >
                            <q-date
                              v-model="filtre.date_fin_min"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops3.hide()"
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
                      v-model="filtre.date_fin_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_fin_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_fin_max=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops4"
                          >
                            <q-date
                              v-model="filtre.date_fin_max"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops4.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
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

      clients: [],
      categories: [],
      produits: [],
      optionsTypes: [
        { value: 'MEMBRE', label: 'Individus' },
        { value: 'ENTREPRISE', label: 'Entreprises' }
      ],
      optionsStatus: [
        { value: 'ENCOURS', label: 'Uniquement les DARS en cours' },
        { value: 'TERMINE', label: 'Uniquement les DARS terminés' },
        { value: 'ANNULE', label: 'Uniquement les DARS annulés' }
      ]
    }
  },
  props: {
    value: Object

  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    this.filtre.devise = this.user.devise
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
      } else { this.filtre = {} }
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
        type: 'DARS'
      })

      let url = `${this.URLS.BASE_URL}/Produit/searchProduits`
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
        update(() => {
          this.clients = []
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
