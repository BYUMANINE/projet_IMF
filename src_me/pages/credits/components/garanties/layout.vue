<template>
  <div class="bg-transparent remove-overflow">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey panel-primary border-onglet sticky-tabs overflow-hidden"
      active-color="primary"
      indicator-color="transparent"
      align="left"
      narrow-indicator
      @input="tabChanged"
    >
      <q-tab name="1">
        <strong class="style-tab">LISTES DES GARANTIES</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">LISTES DES GARANTS</strong>
      </q-tab>
      <q-tab name="3">
        <strong class="style-tab">TYPES DES GARANTIES</strong>
      </q-tab>
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      style="background-color:transparent;padding:0 "
      transition-prev="fade"
      transition-next="fade"
    >
      <q-tab-panel
        name="1"
        class="bg-transparent q-pa-none"
      >
        <listeGaranties
          :filtersProps="paramsGarantie"
          @onRedirect="onRedirect"
          @clear="paramsGarantie=null"
        />

      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <listeGarants @onRedirect="onRedirect" />
      </q-tab-panel>
      <q-tab-panel
        name="3"
        class="bg-transparent q-pa-none"
      >
        <listeTypeGaranties :paramsGarantie="paramsGarantie" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import listeGaranties from './components/garanties/liste_garanties.vue'
import listeGarants from './components/garants/liste_garants.vue'
import listeTypeGaranties from './components/type_garantie/liste_type_garanties.vue'

export default {
  name: 'layaut_garantie',
  data () {
    return {
      user: {},
      tab: '1',

      paramsGarantie: null
    }
  },
  beforeMount () {
    this.getTabStoredIndex()
  },
  mounted: function () {
    this.getTabStoredIndex()
    this.user = this.$helper.getConnectedUser()
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  components: {
    listeGaranties,
    listeGarants,
    listeTypeGaranties

  },
  watch: {},
  computed: {
    titre () {
      let t = ''
      if (this.tab === '1') {
        t = 'LISTE DES GARANTIES'
      } else if (this.tab === '2') {
        t = 'LISTE DES GARANTS'
      } else if (this.tab === '3') {
        t = 'LISTE DES TYPES DE GARANTIES'
      }
      return t
    }
  },
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_garantie'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_garantie', tabIndex)
    },
    onRedirect (params) {
      this.tab = params.tab
      this.paramsGarantie = params.data
      this.tabChanged(this.tab)
    }
  }
}
</script>

<style></style>
