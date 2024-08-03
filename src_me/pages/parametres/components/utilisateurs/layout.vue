<template>
  <div class="row ">
    <div class="col">
      <div class="bg-transparent remove-overflow">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey panel-primary border-onglet sticky-tabs overflow-hidden"
          active-color="primary"
          indicator-color="transparent"
          align="left"
          narrow-indicator
        >
          <q-tab name="1">
            <strong class="style-tab">LISTE DES UTILISATEURS</strong>
          </q-tab>
          <q-tab name="2">
            <strong class="style-tab">TYPES UTILISATEURS</strong>
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
            <listeUtilisateurs />
          </q-tab-panel>
          <q-tab-panel
            name="2"
            class="bg-transparent q-pa-none "
          >
            <listeTypesUtilisateurs />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script>
import listeUtilisateurs from './components/agents/liste_utilisateurs.vue'
import listeTypesUtilisateurs from './components/types_utilisateur/liste_types_utilisateur.vue'

export default {
  name: 'gestion_user',
  data () {
    return {
      user: {},
      tab: '1'
    }
  },
  beforeMount () {
    this.user = this.$helper.getConnectedUser()

    const p = this.$route.params

    if (p && p.tab) {
      this.params = p
      this.tab = p.tab || '1'
    }
  },
  mounted: function () {
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  components: {
    listeUtilisateurs,
    listeTypesUtilisateurs
  },
  computed: {
    titre () {
      let t = ''

      if (this.tab === '1') {
        t = 'LISTE DES UTILISATEURS'
      } else if (this.tab === '1') {
        t = 'LISTE DES TYPES UTILISATEURS'
      }

      return t
    }
  }
}
</script>

<style>
</style>
