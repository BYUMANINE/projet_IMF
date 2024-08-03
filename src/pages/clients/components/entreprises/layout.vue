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
        <strong class="style-tab">LISTE DES ENTREPRISES</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">NOUVELLE ENTREPRISE</strong>
      </q-tab>
      <q-tab name="3">
        <strong class="style-tab">BROUILLONS</strong>
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
        <listeEntreprise
          @onRedirect="onRedirect"
          :filtersProps="paramsEntreprise"
        />
      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <nouvelleEntreprise
          :paramsEntreprise="paramsEntreprise"
          @clear="paramsEntreprise=null"
          @onRedirect="onRedirect"
        />
      </q-tab-panel>
      <q-tab-panel
        name="3"
        class="bg-transparent q-pa-none"
      >
        <listeBrouillons @onRedirect="onRedirect" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import listeEntreprise from './components/entreprise/liste_entreprises.vue'
import nouvelleEntreprise from './components/entreprise/nouveau/nouvelle_entreprise.vue'
import listeBrouillons from './components/brouillon/liste_brouillons.vue'

export default {
  name: 'liste_des_entreprises',
  data () {
    return {
      user: {},
      tab: '1',
      paramsEntreprise: null
    }
  },
  beforeMount () {
    const p = this.$route.params

    if (p && p.tab) {
      this.paramsEntreprise = p.data
      this.tab = p.tab || '1'
      this.tabChanged(this.tab)
    } else {
      this.getTabStoredIndex()
    }
  },
  mounted: function () {
    this.getTabStoredIndex()
    this.user = this.$helper.getConnectedUser()
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  components: {
    listeEntreprise,
    nouvelleEntreprise,
    listeBrouillons
  },
  watch: {},
  computed: {},
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_entreprise'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_entreprise', tabIndex)
    },
    onRedirect (params) {
      this.tab = params.tab
      this.paramsEntreprise = params.data

      this.tabChanged(this.tab)
    }
  }
}
</script>

<style></style>
