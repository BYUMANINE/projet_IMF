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
        <strong class="style-tab">LISTE DES MEMBRES</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">NOUVEAU MEMBRE</strong>
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
        <listeMembre
          @onRedirect="onRedirect"
          :filtersProps="paramsMembre"
        />
      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <nouveauMembre
          :paramsMembre="paramsMembre"
          @clear="paramsMembre=null"
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
import listeMembre from './components/membre/liste_membres.vue'
import nouveauMembre from './components/membre/nouveau/nouveau_membre.vue'
import listeBrouillons from './components/brouillon/liste_brouillons.vue'

export default {
  name: 'liste_des_membres',
  data () {
    return {
      user: {},
      tab: '1',

      paramsMembre: null
    }
  },
  beforeMount () {
    const p = this.$route.params

    if (p && p.tab) {
      this.paramsMembre = p.data
      this.tab = p.tab || '1'
      this.tabChanged(this.tab)
    } else {
      this.getTabStoredIndex()
    }
  },
  mounted: function () {
    this.user = this.$helper.getConnectedUser()
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  components: {
    listeMembre,
    nouveauMembre,
    listeBrouillons
  },
  watch: {},
  computed: {},
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_membre'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_membre', tabIndex)
    },
    onRedirect (params) {
      this.tab = params.tab
      this.paramsMembre = params.data

      this.tabChanged(this.tab)
    }
  }
}
</script>

<style></style>
