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
                      <div class="col-6">
                        <input-label required>Par devise</input-label>
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
                          clearable
                          v-model="filtre.devise"
                          :options="optionsDevises"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt}`"
                        />
                      </div>
                      <div class="col-6">
                        <input-label required>Par type de compte</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          label="Par type de compte"
                          rounded
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          clearable
                          map-options
                          v-model="filtre.type_compte"
                          :option-value="opt => opt"
                          :option-label="opt => opt"
                          :options="optionsTypesComptes"
                          @filter="filterTypesComptes"
                        />
                      </div>
                      <div class="col">
                        <input-label required>Par classe</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          label="Par classe"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          clearable
                          map-options
                          v-model="filtre.classe"
                          :option-value="opt => opt"
                          :option-label="opt => opt"
                          :options="optionsClasses"
                          @filter="filterClasses"
                        />
                      </div>
                      <div class="col-6">
                        <input-label required>Par poste de compte</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          label="Par poste de compte"
                          rounded
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          clearable
                          v-model="filtre.poste"
                          :options="optionsPostes"
                        />
                      </div>

                      <div class="col-6">
                        <input-label required>Longeur de compte</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          v-model="filtre.is_principal"
                          rounded
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          :options="optionsPrincipal"
                          label="Longeur de compte"
                        />
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

      optionsPrincipal: [
        { value: 'OUI', label: 'Uniquement les comptes principaux' },
        { value: 'NON', label: 'Uniquement les comptes auxiliaires' }
      ],
      optionsTypesComptes: [],
      optionsPostes: [],
      optionsClasses: [],
      optionsDevises: ['CDF', 'USD']

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
    this.optionsPostes = [...this.$datas.postesComptes]
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.oldFilters != null) {
          this.filtre = { ...this.oldFilters }
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
    filterTypesComptes (val, update, abort) {
      let donnees = JSON.stringify({})

      let url = `${this.URLS.BASE_URL}/Compte/searchTypesComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.optionsTypesComptes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.optionsTypesComptes = [] })
      })
    },
    filterClasses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: this.filtre.type_compte || null
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchClassesComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.optionsClasses = infos.data.records
        })
      }).catch(() => {
        update(() => { this.optionsClasses = [] })
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
