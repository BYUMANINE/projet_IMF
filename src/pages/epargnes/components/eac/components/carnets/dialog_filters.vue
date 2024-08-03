<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">
              <q-icon
                name="las la-filter"
                color="primary"
              />
              Filtrage
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="las la-broom"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="viderChamps()"
            />
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Appliquer les filters"
              icon="las la-check"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.myForm.validate().then(onSubmit)"
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
          style="max-height:80vh"
        >
          <div class="col">
            <q-form ref="myForm">
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
                          label="Devise"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          v-model="filtre.devise"
                          :options="optionsDevises"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.label}`"
                        />
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <input-label>Par état du carnet</input-label>
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
                        <input-label>Par produit EAC</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          clearable
                          label="Par produits EAC"
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
                                Aucun compte trouvé
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
                          :option-label="opt => !!opt ? `${opt.folio} - ${opt.nom_complet || opt.designation }` : ''"
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
                        <input-label>Par collecteur</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          label="Par collecteur"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          v-model="filtre.collecteur"
                          :options="clients"
                          :option-value="opt => opt"
                          :option-label="opt => !!opt ? `${opt.nom_complet}` : ''"
                          @filter="filterCollecteurs"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun collecteur trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogRisque',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      filtre: {},

      clients: [],
      produits: [],
      optionsStatus: [
        { value: 'ENCOURS', label: 'Les carnets en cours' },
        { value: 'TERMINE', label: 'Les carnets terminés' },
        { value: 'ARRETE', label: 'Les carnets arrêtés' },
        { value: 'INACTIF', label: 'Les carnets inactifs' },
        { value: 'RETIRE', label: 'Les carnets retirés' }
      ],

      optionsDevises: [
        { value: 'CDF', label: 'CDF' },
        { value: 'USD', label: 'USD' }
      ]
    }
  },
  props: {
    value: Boolean,
    oldFilters: null

  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.oldFilters != null) {
          this.filtre = { ...this.oldFilters }
        } else {
          this.filtre = {}
        }
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

    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'EAC'
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

      let url = `${this.URLS.BASE_URL}/Eac/searchMembresEac`
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
    filterCollecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Collecteur/searchCollecteurs`
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
