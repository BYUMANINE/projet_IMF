<template>
  <q-dialog
    v-model="showDialog"
    position="bottom"
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none">
        <div class="row q-py-sm q-px-md">
          <div class="col">
            <div class="text-h6">Recherche</div>
          </div>
          <div
            class="col-auto"
            style="margin-left:150px"
          >
            <q-btn
              color="blue-1"
              text-color="blue"
              icon="close"
              size="sm"
              v-close-popup
              round
              unelevated
            />
          </div>
        </div>
        <q-separator />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div v-if="filters1">
          <q-list
            class="q-px-sm"
            separator
          >
            <q-option-group
              v-model="selectedFilters"
              :options="filters1"
              color="primary"
              type="checkbox"
            />
          </q-list>
          <q-separator />
        </div>

        <div class="q-pa-md">
          <q-form
            ref="myForm"
            @submit.prevent="onSearch"
          >
            <q-input
              :readonly="selectedFilters.length==0"
              rounded
              standout
              outlined
              dense
              v-model.trim="search1"
              label="Recherche"
              class="q-mb-lg"
              ref="inputsearch"
              lazy-rules
              :rules="[ val => val && val.trim().length > 0 || 'Entrer le texte à rechercher']"
            >
              <template v-slot:after>
                <q-btn
                  :disable="selectedFilters.length==0"
                  color="blue"
                  text-color="white"
                  icon="search"
                  round
                  dense
                  @click="onSearch()"
                />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="search1 && search1.length > 0 && selectedFilters.length>0"
                  name="clear"
                  class="cursor-pointer"
                  @click="search1 = null;"
                />
              </template>
            </q-input>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Search_component',
  data () {
    return {

      search1: null,
      selectedFilters: [],
      filters1: []
    }
  },
  props: {
    value: Boolean,
    search: {},
    filters: {
      type: Array,
      default: null
    }
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (Array.isArray(this.filters)) {
          this.filters1 = [...this.filters]
          if (this.search) {
            this.search1 = (this.search.search) ? this.search.search : null

            if (this.search.fields && this.search.fields.length > 0) {
              this.selectedFilters = this.search.fields
            }
          } else {
            this.search1 = null
            this.selectedFilters = this.filters.filter(e => e.is_checked !== false).map(e => e.value)
          }
        } else {
          this.filters1 = null
        }

        setTimeout(() => {
          this.$refs.inputsearch.$el.focus()
        }, 200)
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  beforeMount () { },
  mounted () {
    /* document.addEventListener('keydown', this.initialiseShortcut, false) */
  },
  destroyed: function () {
    /* document.removeEventListener('keydown', this.initialiseShortcut, false) */
  },
  methods: {
    /* initialiseShortcut (e) {
      if (e.which === 13) { // Enter
        this.onSearch()
      }
    }, */
    onSearch (isOk) {
      let form = this.$refs.myForm
      if (form) {
        form.validate().then((isOk) => {
          if (isOk) {
            if (this.selectedFilters.length > 0 && this.search1) {
              const v = {
                fields: this.selectedFilters,
                search: this.search1.trim(),
                filters: this.filters1.filter(e1 =>
                  this.selectedFilters.find(e2 => e2 === e1.value) !== undefined
                ).map(e => e.label)
              }

              this.$emit('onSearch', v)
              setTimeout(() => {
                this.showDialog = false
              }, 100)
            }
          }
        })
      }
    }
  }
}
</script>

<style></style>
