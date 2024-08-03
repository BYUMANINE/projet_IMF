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
        <strong class="style-tab">SITUATION COMPTE</strong>
      </q-tab>
      <q-tab name="2">
        <strong class="style-tab">TRANSFERT ENTRE COMPTES</strong>
      </q-tab>
      <q-tab name="3">
        <strong class="style-tab">GELE & DEGELE</strong>
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
        <rechercheSurCompte />
      </q-tab-panel>
      <q-tab-panel
        name="2"
        class="bg-transparent q-pa-none"
      >
        <transfertEntreComptes />
      </q-tab-panel>
      <q-tab-panel
        name="3"
        class="bg-transparent q-pa-none"
      >
        <listeGeles />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import listeGeles from './components/gele/liste_geles.vue'
import rechercheSurCompte from './components/situation_compte/recherche_sur_compte.vue'
import transfertEntreComptes from './components/transfert/liste_transfert_entre_comptes.vue'

export default {
  name: 'liste_des_eav',
  data () {
    return {
      user: {},
      tab: '1'
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
    listeGeles,
    transfertEntreComptes,
    rechercheSurCompte
  },
  watch: {},
  computed: {},
  methods: {

    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_eav'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_eav', tabIndex)
    }

  }
}
</script>

<style></style>
