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
                <input-label>Par type produit</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par type produit"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.type_produit"
                  :options="optionsTypeProduits"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                  lazy-rules
                  :rules="[val => !!val || 'Choisissez une option']"
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
                <input-label>Par produit </input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  clearable
                  label="Par produits "
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
                        Aucun client trouvé
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

              <div class="col-12">
                <q-card
                  flat
                  bordered
                  class="radius-none q-a-none"
                >
                  <q-card-section class="q-pa-xs">
                    Solde de compte
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pa-xs">
                    <q-option-group
                      v-model="filtre.solde_compte"
                      :options="optionsSoldes"
                      color="primary"
                    />
                  </q-card-section>
                </q-card>
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
        { value: 'rel.fk_membre IS NOT NULL', label: 'Uniquement les individus', table: 'MEMBRE' },
        { value: 'rel.fk_groupe IS NOT NULL', label: 'Uniquement les groupes', table: 'GROUPE' },
        { value: 'rel.fk_entreprise IS NOT NULL', label: 'Uniquement les entreprises', table: 'ENTREPRISE' }
      ],
      optionsTypeProduits: [
        { value: 'EAV', label: 'Epargnes à vue' },
        { value: 'EAC', label: 'Epargnes à la carte' },
        { value: 'DAT', label: 'Dépôt à terme' },
        { value: 'DARS', label: 'Dépôt à reigime special' },
        { value: 'EG', label: 'Epargnes garantis' }
      ],
      optionsSoldes: [
        { value: 'ALL', label: 'Tous les comptes' },
        { value: 'POSITIF', label: 'Comptes avec solde positif' },
        { value: 'NULL', label: 'Comptes avec solde null' },
        { value: 'NEGATIF', label: 'Comptes avec solde négatif' }
      ]
    }
  },
  props: {
    value: Object

  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    this.$vue.set(this.filtre, 'devise', this.user.devise)
  },
  mounted: function () {
  },
  destroyed: function () {
    this.filtre = {}
  },
  watch: {
    filtre (newValue, oldValue) { }
  },
  computed: {
    filtre: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {

    filterProduits (val, update, abort) {
      let type = this.filtre.type_produit ? this.filtre.type_produit.value : null
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: type
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
      let type = this.filtre.type_client ? this.filtre.type_client.table : null
      let produit = this.filtre.produit ? this.filtre.produit.type : null
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only_types: [type],
        only_produits: [produit]
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
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
      this.filtre = {
        solde_compte: null
      }
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
