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
        <strong class="style-tab">LISTE DES GROUPES</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">NOUVEAU GROUPE</strong>
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
        <listeGroupe
          @onRedirect="onRedirect"
          :filtersProps="paramsGroupe"
        />
      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <nouveauGroupe
          :paramsGroupe="paramsGroupe"
          @clear="paramsGroupe=null"
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
import listeGroupe from './components/groupe/liste_groupes.vue'
import nouveauGroupe from './components/groupe/nouveau/nouveau_groupe.vue'
import listeBrouillons from './components/brouillon/liste_brouillons.vue'

export default {
  name: 'liste_des_groupes',
  data () {
    return {
      user: {},
      tab: '1',

      paramsGroupe: null
    }
  },
  beforeMount () {
    const p = this.$route.params

    if (p && p.tab) {
      this.paramsGroupe = p.data
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
    listeGroupe,
    nouveauGroupe,
    listeBrouillons
  },
  watch: {},
  computed: {},
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_groupe'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_groupe', tabIndex)
    },
    onRedirect (params) {
      this.tab = params.tab
      this.paramsGroupe = params.data

      this.tabChanged(this.tab)
    }
  }
}
</script>

<style></style>
