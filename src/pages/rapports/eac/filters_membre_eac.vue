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
                <input-label>Par secteur activité</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par secteur d'activité"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.secteur_activite"
                  :options="secteurs"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.designation}` : ''"
                  @filter="filterSecteurs"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun secteur trouvé
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
                <input-label>Avoir compte epargne</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="A t-il un compte epargne?"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.compteEP"
                  :options="optionsCompteEP"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par devise du compte EAC</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par devise de compte"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.compteDevise"
                  :options="optionsCompteDevise"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                  lazy-rules
                  :rules="[val => !!val || 'Choisissez une option']"
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

      secteurs: [],
      categories: [],
      collecteurs: [],
      produits: [],
      optionsCompteEP: [
        { value: 'OUI', label: 'Uniquement les ayant compte épargne' },
        { value: 'NON', label: 'Uniquement les n\'ayant pas de compte epagne' }
      ],
      optionsCompteDevise: [
        { value: 'USD', label: 'Membres ayant des comptes en USD' },
        { value: 'CDF', label: 'Membres ayant des comptes en CDF' }
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

    filterSecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Secteur/searchSecteurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.secteurs = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.secteurs = []
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
