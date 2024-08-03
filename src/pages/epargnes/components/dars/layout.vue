<template>
  <div class="bg-transparent  remove-overflow">
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
        <strong class="style-tab">LISTE DES DARS CONSTITUES</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">MEMBRES DARS</strong>
      </q-tab>
      <q-tab name="3">
        <strong class="style-tab">DEPOTS ET INTERETS DARS</strong>
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
        <listeEatEffectues
          :filtersProps="paramsEat"
          @onRedirect="addOrEditDars"
          @clear="paramsEat=null"
        />

      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <listeClientsEat @onRedirect="addOrEditDars" />
      </q-tab-panel>
      <q-tab-panel
        name="3"
        class="bg-transparent q-pa-none"
      >
        <listeCalculInterets />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import listeEatEffectues from './components/liste_dars.vue'
import listeClientsEat from './components/clients/liste_clients_dars.vue'
import listeCalculInterets from './components/calcul_interets/liste_interets.vue'

export default {
  name: 'liste_des_dats',
  data () {
    return {
      user: {},
      tab: '1',

      paramsEat: null
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
    listeEatEffectues,
    listeClientsEat,
    listeCalculInterets
  },
  watch: {},
  computed: {},
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_dat'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_dat', tabIndex)
    },
    addOrEditDars (params) {
      this.tab = params.tab
      this.paramsEat = params.data
      this.tabChanged(this.tab)
    }
  }
}
</script>

<style></style>
