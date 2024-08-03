<template>
  <q-page>
    <div class="row ">
      <div class="col">
        <div class="bg-transparent remove-overflow">
          <template v-if="user.caisse">
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
                <strong class="style-tab">ENCAISSEMENTS</strong>
              </q-tab>
              <q-tab name="2">
                <strong class="style-tab">DECAISSEMENTS</strong>
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
                <encaissements
                  :caisse="selectedCaisse"
                  :URLS="URLS"
                  :user="user"
                />
              </q-tab-panel>
              <q-tab-panel
                name="2"
                class="bg-transparent q-pa-none"
              >
                <decaissements
                  :caisse="selectedCaisse"
                  :URLS="URLS"
                  :user="user"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
          <div
            v-else
            class="text-center text-bold "
            style="padding-top:20vh;"
          >
            <div
              class="bg-blue-1 q-pa-md"
              style="width:250px;height:250px;border-radius:200px;margin:auto"
            >
              <q-img
                src="statics/images/icone/chequier.png"
                spinner-color="white"
                style="height: 100px; max-width: 100px"
              />
              <div class="q-mt-md">
                Vous n'êtes affecté à aucune caisse
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import encaissements from './encaissements/layout.vue'
import decaissements from './decaissements/layout.vue'

export default {
  name: 'layout_caisse',
  data () {
    return {
      URLS: {},
      user: {},
      tab: '1',
      selectedCaisse: null
    }
  },
  beforeMount () {
    this.getTabStoredIndex()
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.selectedCaisse = this.user.caisse
    }
  },
  mounted: function () { },
  components: {
    encaissements,
    decaissements
  },
  watch: {},
  computed: {
    titre () {
      let t = ''
      if (this.tab === '1') {
        t = 'ENCAISSEMENTS'
      } else if (this.tab === '2') {
        t = 'DECAISSEMENTS'
      }
      return t
    }
  },
  methods: {
    getTabStoredIndex () {
      let index = parseInt(localStorage.getItem('tab_index_caisse'))
      this.tab = index ? index.toString() : '1'
    },
    tabChanged (tabIndex) {
      localStorage.setItem('tab_index_caisse', tabIndex)
    }

  }
}
</script>

<style></style>
