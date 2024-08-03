<template>
  <q-page>

    <customerAppBar
      :option="`GESTION DE CAISSE - ${titre}`"
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
          <depotsRetraits v-if="selectedOption.value === 'FLUX'" />
          <journalCaisse v-if="selectedOption.value === 'JOURNAL'" />
          <listeTransferts v-if="selectedOption.value === 'TRANSFERT'" />
          <affectations v-if="selectedOption.value === 'AFFECTATION'" />
          <listeCaisses v-if="selectedOption.value === 'CAISSE'" />
          <listeArretes v-if="selectedOption.value === 'ARRETE'" />
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

import depotsRetraits from './components/depots_retraits/layout.vue'
import journalCaisse from './components/journal_caisse/journal_caisse.vue'
import affectations from './components/affectation_caisse/liste_affectation_caisse.vue'
import listeTransferts from './components/transfert_intercaisses/liste_transferts.vue'
import listeCaisses from './components/caisse/liste_caisses.vue'
import listeArretes from './components/arretes/liste_arretes.vue'

export default {
  data () {
    return {
      options: [
        { value: 'FLUX', label: 'Opérations' },
        { value: 'JOURNAL', label: 'Journal caisse' },
        { value: 'TRANSFERT', label: 'Transferts' },
        { value: 'AFFECTATION', label: 'Affectations' },
        { value: 'ARRETE', label: 'Arretés caisse' },
        { value: null, label: 'PARAMETRES' },

        { value: 'CAISSE', label: 'Caisses' }
      ],
      selectedOption: null,
      drawer: false
    }
  },
  beforeMount () {
    this.selectedOption = this.options[0]
  },
  components: {
    depotsRetraits,
    journalCaisse,
    affectations,
    listeTransferts,
    listeCaisses,
    listeArretes
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    titre () {
      let t = ''

      if (this.selectedOption.value === 'FLUX') {
        t = 'DEPOTS & RETRAITS'
      } else if (this.selectedOption.value === 'JOURNAL') {
        t = 'JOURNAL DE CAISSE'
      } else if (this.selectedOption.value === 'TRANSFERT') {
        t = 'TRANSFERT ENTRE CAISSES'
      } else if (this.selectedOption.value === 'AFFECTATION') {
        t = 'AFFECTATION CAISSE'
      } else if (this.selectedOption.value === 'CAISSE') {
        t = 'LISTE DES CAISSES'
      }

      return t
    }
  },
  methods: {

  }
}
</script>

<style></style>
