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
        <strong class="style-tab">Carnets ouverts</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">Membres EAC</strong>
      </q-tab>
      <q-tab name="3">
        <strong class="style-tab">Collecteurs</strong>
      </q-tab>
      <q-tab name="4">
        <strong class="style-tab">Commissions</strong>
      </q-tab>
    </q-tabs>

    <q-separator class="color-gradient" />
    <q-tab-panels
      v-model="tab"
      animated
      style="background-color:transparent;padding:0 "
      transition-prev="fade"
      transition-next="fade"
    >
      <q-tab-panel
        name="1"
        class="bg-transparent q-pa-none "
      >
        <listeCarnetsEac
          :filtersProps="paramsEat"
          @onRedirect="addOrEditEat"
          @clear="paramsEat=null"
        />
      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none "
      >
        <listeMembresEac @onRedirect="addOrEditEat" />
      </q-tab-panel>

      <q-tab-panel
        name="3"
        class="bg-transparent q-pa-none "
      >
        <listeCollecteurs />
      </q-tab-panel>
      <q-tab-panel
        name="4"
        class="bg-transparent q-pa-none "
      >
        <listeCommissions />
      </q-tab-panel>

    </q-tab-panels>
  </div>
</template>
<script>

import listeMembresEac from './components/membres/liste_membres_eac.vue'
import listeCarnetsEac from './components/carnets/liste_carnets.vue'
import listeCollecteurs from './components/collecteurs/liste_collecteurs.vue'
import listeCommissions from './components/comissions/liste_comissions.vue'

export default {
  name: 'eac',
  data () {
    return {
      user: {},
      tab: '1',

      paramsEat: null
    }
  },
  beforeMount () {
    this.user = this.$helper.getConnectedUser()
    this.getTabStoredIndex()
  },
  mounted: function () {
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  components: {
    listeMembresEac,
    listeCarnetsEac,
    listeCollecteurs,
    listeCommissions
  },
  computed: {},
  methods: {
    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_eac'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_eac', tabIndex)
    },
    addOrEditEat (params) {
      this.tab = params.tab
      this.paramsEat = params.data
      this.tabChanged(this.tab)
    }
  }
}
</script>

<style>
</style>
