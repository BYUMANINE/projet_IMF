<template>
  <q-page>

    <customerAppBar
      :option="`CREDIT - ${titre}`"
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
        <div class="gt-sm col-xs-12 col-sm-3 col-md-3 col-lg-2 col-xl-2">
          <div class="q-px-md">
            <q-input
              borderless
              dense
              hide-bottom-space
              v-model="search"
              placeholder="Rechercher"
              maxlength="250"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
              <template #append>
                <q-btn
                  v-if="search"
                  icon="close"
                  size="sm"
                  round
                  unelevated
                  flat
                  @click="search=null"
                />
              </template>
            </q-input>
          </div>
          <q-separator />
          <q-list
            separator
            class="scroll"
            style="height:75vh; position: sticky;top: 120px;z-index:10;"
          >
            <template v-for="(row,index) in filterOptions">
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
          <ListeDemande v-if="selectedOption.value === 'DEMANDE'" />
          <Garantie v-if="selectedOption.value === 'GARANTIE'" />
          <Suivis v-if="selectedOption.value === 'SUIVI'" />
          <Validation v-if="selectedOption.value === 'VALIDATION'" />
          <Decaissemnt v-if="selectedOption.value === 'DECAISSEMENT'" />
          <produitsCredit v-if="selectedOption.value === 'PRODUIT'" />
          <listeFraisCredit v-if="selectedOption.value === 'FRAIS'" />
          <objetFinancement v-if="selectedOption.value === 'OBJET-FIN'" />
          <gestionnaire v-if="selectedOption.value === 'GESTIONN'" />
          <listePaiement v-if="selectedOption.value === 'P-FRAIS'" />
          <simulation v-if="selectedOption.value === 'SIM'" />
          <remboursement v-if="selectedOption.value === 'REMB'" />
          <blacklist v-if="selectedOption.value === 'ACL'" />
          <declassements v-if="selectedOption.value === 'DECL'" />
          <intervallesRetards v-if="selectedOption.value === 'RETARD-I'" />
          <amortissement v-if="selectedOption.value === 'AMORT'" />
          <recouvrement v-if="selectedOption.value === 'REC'" />
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
              @click="selectedOption = row;drawer=false; MenuIndex(selectedOption)"
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

import ListeDemande from './components/demandes/liste_demandes.vue'
import Garantie from './components/garanties/layout.vue'
import Suivis from './components/suivis/liste_suivis.vue'
import Validation from './components/validation/liste_validations.vue'
import Decaissemnt from './components/decaissement/liste_decaissements.vue'
import produitsCredit from './components/produits_credit/liste_produits.vue'
import listeFraisCredit from './components/frais_credit/liste_frais_credit.vue'
import objetFinancement from './components/objet_financement/liste_objet_financement.vue'
import gestionnaire from './components/gestionnaire/liste_gestionnaire.vue'
import listePaiement from './components/paiement_frais/liste_paiement_frais.vue'
import simulation from './components/simulation/liste_simulation.vue'
import remboursement from './components/remboursement/liste_remboursement.vue'
import blacklist from './components/blacklist/liste_blacklist'
import declassements from './components/declassement/liste_declassement.vue'
import intervallesRetards from './components/intervalles_retard/liste_intervalles_retard.vue'
import amortissement from './components/amortissement/liste_amortisement.vue'
import recouvrement from './components/recouvrement/liste_recouvrement.vue'

export default {
  data () {
    return {
      options: [
        { value: 'SIM', label: 'Simulation crédit' },
        { value: 'GARANTIE', label: 'Garanties' },
        { value: 'DEMANDE', label: 'Demande de crédit' },
        { value: 'VALIDATION', label: 'Validation demandes' },
        { value: 'SUIVI', label: 'Suivis des dossiers' },
        { value: 'P-FRAIS', label: 'Paiement frais' },
        { value: 'DECAISSEMENT', label: 'Déblocage crédit' },
        { value: 'AMORT', label: 'Amortissement' },
        { value: 'REMB', label: 'Remboursement' },
        { value: 'DECL', label: 'Déclassement' },
        { value: 'REC', label: 'Recouvrement PR' },

        { value: null, label: 'PARAMETRES' },

        { value: 'ACL', label: 'Black list' },
        { value: 'FRAIS', label: 'Frais sur credits' },
        { value: 'PRODUIT', label: 'Produits credits' },
        { value: 'RETARD-I', label: 'Intervalles retards' },
        { value: 'OBJET-FIN', label: 'Objet de financement' },
        { value: 'GESTIONN', label: 'Gestionnaires' }
      ],
      selectedOption: null,
      drawer: false,
      paramsCredit: null,
      search: null
    }
  },
  beforeMount () {
    const p = this.$route.params
    if (p) {
      this.params = p
      this.selectedOption = p.option || { value: 'DEMANDE', label: 'LES DEMANDES' }
      this.MenuIndex(this.selectedOption)
    } else {
      this.getMenuStoredIndex()
    }
  },
  components: {
    ListeDemande,
    Garantie,
    Suivis,
    Validation,
    Decaissemnt,
    produitsCredit,
    listeFraisCredit,
    objetFinancement,
    gestionnaire,
    listePaiement,
    simulation,
    remboursement,
    blacklist,
    declassements,
    intervallesRetards,
    amortissement,
    recouvrement
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    filterOptions () {
      if (this.$helper.isNotEmpty(this.search)) {
        return this.options.filter(e => e.label.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) > -1)
      }
      return this.options
    },
    titre () {
      let t = ''
      if (this.selectedOption.value === 'DEMANDE') {
        t = 'LISTES DEMANDES'
      } else if (this.selectedOption.value === 'GARANTIE') {
        t = 'GESTION DES GARANTIES'
      } else if (this.selectedOption.value === 'VALIDATION') {
        t = 'GESTION DES VALIDATIONS'
      } else if (this.selectedOption.value === 'P-FRAIS') {
        t = 'PAIEMENT FRAIS DE CREDIT'
      } else if (this.selectedOption.value === 'SUIVI') {
        t = 'SUIVIS DE CREDITS'
      } else if (this.selectedOption.value === 'DECAISSEMENT') {
        t = 'DEBLOCAGE DE CREDIT'
      } else if (this.selectedOption.value === 'PRODUIT') {
        t = 'PRODUITS DE CREDIT'
      } else if (this.selectedOption.value === 'FRAIS') {
        t = 'FRAIS SUR CREDIT'
      } else if (this.selectedOption.value === 'OBJET-FIN') {
        t = 'OBJET DE FINANCEMENT'
      } else if (this.selectedOption.value === 'GESTIONN') {
        t = 'GESTIONNAIRES'
      } else if (this.selectedOption.value === 'SIM') {
        t = 'SIMULATION DE TABLEAU D\'AMORTISSEMENT'
      } else if (this.selectedOption.value === 'REMB') {
        t = 'REMB DE CREDIT'
      } else if (this.selectedOption.value === 'ACL') {
        t = 'BLACK LIST'
      } else if (this.selectedOption.value === 'DECL') {
        t = 'DECLASSEMENT DES CREDITS'
      } else if (this.selectedOption.value === 'RETARD-I') {
        t = 'INTERVALLES DES RETARDS'
      } else if (this.selectedOption.value === 'AMORT') {
        t = 'AMORTISSEMENTS'
      } else if (this.selectedOption.value === 'REC') {
        t = 'RECOUVREMENTS'
      }
      return t
    }
  },
  methods: {
    onRedirect (params) {
      this.selectedOption = params.option
      this.paramsCredit = params.data
      this.MenuIndex(this.selectedOption)
    },
    getMenuStoredIndex () {
      let option = parseInt(localStorage.getItem('menu_index_credit'))
      this.selectedOption = option || { value: 'DEMANDE', label: 'LES DEMANDES' }
    },
    MenuIndex (menuIndex) {
      localStorage.setItem('menu_index_credit', menuIndex)
    }
  }
}
</script>

<style></style>
