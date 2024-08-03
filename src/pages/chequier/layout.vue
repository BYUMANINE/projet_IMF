<template>
  <q-page>

    <customerAppBar
      :option="`CHEQUES - ${titre}`"
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
          <carnetCheques v-if="selectedOption.value === 'CARNET'" />
          <typesCheques v-if="selectedOption.value === 'TYPE'" />
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

import carnetCheques from './components/chequiers/liste_chequiers.vue'
import typesCheques from './components/types_chequiers/liste_types_chequiers.vue'

export default {
  data () {
    return {
      options: [
        { value: 'CARNET', label: 'Carnet chèques' },
        { value: 'TYPE', label: 'Types chéquiers' }
      ],
      selectedOption: null,
      drawer: false
    }
  },
  beforeMount () {
    this.selectedOption = this.options[0]
  },
  components: {
    carnetCheques,
    typesCheques
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    titre () {
      let t = ''

      if (this.selectedOption.value === 'CARNET') {
        t = 'CARNETS DES CHEQUES'
      } else if (this.selectedOption.value === 'TYPE') {
        t = 'TYPES DE CHEQUES'
      }

      return t
    }
  },
  methods: {

  }
}
</script>

<style></style>
