<template>
  <q-page>

    <customerAppBar
      :option="`GESTION DES ADHESIONS - ${titre}`"
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
        <div class="gt-sm col-xs-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
          <q-list
            separator
            class="scroll"
            style="height:75vh; position: sticky;top: 120px;z-index:10;"
          >
            <template v-for="(row,index) in options">
              <q-item
                v-if="row.value !== null"
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
              <q-item
                v-else
                :key="index"
                clickable
                v-ripple
                dense
                class="bg-blue-2 text-primary q-px-md"
              >
                <q-item-section>
                  <q-item-label class="text-bold">{{row.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <q-separator vertical />
        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl q-px-sm q-pb-sm">
          <individus v-if="selectedOption.value === 'INDIVIDU'" />
          <groupes v-if="selectedOption.value === 'GROUPE'" />
          <entreprises v-if="selectedOption.value === 'ENTREPRISE'" />
          <fraisCompte v-if="selectedOption.value === 'FRAIS'" />
          <categorie v-if="selectedOption.value === 'CATEGORIE'" />
          <listeSecteurs v-if="selectedOption.value === 'SECTEUR'" />
          <fraisAdhesion v-if="selectedOption.value === 'ADHESION'" />
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

import individus from './components/membres/layout.vue'
import groupes from './components/groupes/layout.vue'
import entreprises from './components/entreprises/layout.vue'
import fraisCompte from './components/frais/liste_frais_compte.vue'
import categorie from './components/categories/liste_categories.vue'
import fraisAdhesion from './components/adhesion_param_frais/liste_adhesion_param_frais.vue'
import listeSecteurs from './components/secteurs_activite/liste_secteurs.vue'

export default {
  data () {
    return {
      options: [
        { value: 'INDIVIDU', label: 'Individus' },
        { value: 'GROUPE', label: 'Groupes' },
        { value: 'ENTREPRISE', label: 'Entreprises' },
        { value: 'FRAIS', label: 'Paiement frais' },
        { value: null, label: 'PARAMETRES' },
        { value: 'ADHESION', label: 'Frais sur adhesion' },
        { value: 'SECTEUR', label: 'Secteurs d\'activité' },
        { value: 'CATEGORIE', label: 'Catégories' }
      ],
      selectedOption: null,
      drawer: false
    }
  },
  beforeMount () {
    this.selectedOption = this.options[0]
  },
  components: {
    individus,
    groupes,
    entreprises,
    fraisCompte,
    categorie,
    fraisAdhesion,
    listeSecteurs
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    titre () {
      let t = ''

      if (this.selectedOption.value === 'INDIVIDU') {
        t = 'GESTION DES INDIVIDUS'
      } else if (this.selectedOption.value === 'GROUPE') {
        t = 'GESTION DES GROUPES'
      } else if (this.selectedOption.value === 'ENTREPRISE') {
        t = 'GESTION DES ENTREPRISES'
      } else if (this.selectedOption.value === 'FRAIS') {
        t = 'PAIEMENT FRAIS'
      } else if (this.selectedOption.value === 'CATEGORIE') {
        t = 'CATEGORIE ADHERENT'
      } else if (this.selectedOption.value === 'SECTEUR') {
        t = 'SECTEURS D\'ACTIVITES'
      } else if (this.selectedOption.value === 'ADHESION') {
        t = 'FRAIS SUR ADHESION'
      }

      return t
    }
  },
  methods: {

  }
}
</script>

<style></style>
