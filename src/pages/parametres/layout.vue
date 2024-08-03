<template>
  <q-page>

    <customerAppBar
      :option="`PARAMETRES - ${titre}`"
      :user="null"
      :selected="null"
      content-classe="q-pt-md q-mb-none"
      content-style2="border-bottom-left-radius: 0;border-bottom-right-radius: 0;"
    >
      <q-btn
        @click="drawer=!drawer"
        round
        dense
        icon="menu"
        text-color="primary"
        unelevated
        class="lt-md"
        size="md"
      />

    </customerAppBar>

    <div
      class="ba panel-primary"
      style="border-top-left-radius: 0;border-top-right-radius: 0;margin-top:-2px"
    >
      <div class="row">
        <div class="gt-sm col-xs-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
          <q-list
            separator
            class="scroll"
            style="height:75vh; position: sticky;top: 120px;z-index:10;"
          >
            <template v-for="(row,index) in options">
              <q-item
                :key="index"
                clickable
                v-ripple
                @click="selectedOption = row"
                :class="selectedOption.value === row.value?'bg-blue-1 text-primary':''"
              >
                <q-item-section>
                  <q-item-label class="text-bold">{{row.label}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    name="las la-angle-right"
                    size="15px"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <q-separator vertical />
        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl q-px-sm q-pb-sm">
          <monCompte v-if="selectedOption.value === 'COMPTE'" />
          <parametres v-if="selectedOption.value === 'AUTRES'" />
          <utilisateurs v-if="selectedOption.value === 'USER'" />
          <agences v-if="selectedOption.value === 'AGENCE'" />
          <importations v-if="selectedOption.value === 'IMPORT'" />
        </div>
      </div>
    </div>
    <q-drawer
      v-model="drawer"
      :width="300"
      show-if-above
      side="right"
      content-class="drawer-primary relative-position"
      v-if="$q.screen.lt.md"
    >
      <q-scroll-area class="fit relative-position">
        <q-list separator>
          <template v-for="(row,index) in options">
            <q-item
              :key="index"
              clickable
              v-ripple
              @click="selectedOption = row;drawer=false"
              :class="selectedOption.value === row.value?'bg-blue-1 text-primary':''"
            >
              <q-item-section>
                <q-item-label class="text-bold">{{row.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

    </q-drawer>
  </q-page>
</template>

<script>

import monCompte from './components/profil/mon_compte.vue'
import parametres from './components/autres/autres_parametres.vue'
import utilisateurs from './components/utilisateurs/layout.vue'
import agences from './components/agences/liste_agences.vue'
import importations from './components/importation/importation_donnees.vue'

export default {
  data () {
    return {
      options: [
        { value: 'COMPTE', label: 'Mon compte' },
        { value: 'USER', label: 'Utilisateurs' },
        { value: 'AGENCE', label: 'Agences' },
        { value: 'AUTRES', label: 'Autres paramètres' },
        { value: 'IMPORT', label: 'Import données' }
      ],
      selectedOption: null,
      drawer: false
    }
  },
  beforeMount () {
    this.selectedOption = this.options[0]
  },
  components: {
    monCompte,
    parametres,
    utilisateurs,
    agences,
    importations
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    titre () {
      let t = ''

      if (this.selectedOption.value === 'COMPTE') {
        t = 'MON COMPTE'
      } else if (this.selectedOption.value === 'USER') {
        t = 'UTILISATEURS'
      } else if (this.selectedOption.value === 'AGENCE') {
        t = 'AGENCES'
      } else if (this.selectedOption.value === 'AUTRES') {
        t = 'AUTRES'
      } else if (this.selectedOption.value === 'IMPORT') {
        t = 'IMPORTATIONS DES DONNEES'
      }

      return t
    }
  },
  methods: {

  }
}
</script>

<style></style>
