<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">

      <menu-option
        text="Actualiser"
        tooltip="Alt + R"
        icon="refresh.png"
        @option-clicked="searchOperation=null;getDatas()"
      />

      <menu-option
        text="Recherche"
        tooltip="Ctrl + F"
        icon="search.png"
        @option-clicked="showDialogSearch=true"
      />
      <menu-option
        text="Geler un montant"
        tooltip="Alt + A"
        icon="add.png"
        @option-clicked="selectedGele=null;isAdd=true;showDlgGele=true;"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />

    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">

      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary">

            <q-separator v-if="!!searchOperation" />
            <search-result :search="searchOperation" />
            <q-separator />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover  table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-center">CODE</th>
                    <th class="text-left">ADHERENT</th>
                    <th class="text-left">COMPTE</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-right">MONTANT</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center text-bold">{{row.folio}}</td>
                    <td class="text-left">{{row.client_str}}</td>
                    <td class="text-left">{{row.indice}}</td>
                    <td class="text-left">{{row.produit_str}}</td>
                    <td class="text-right text-bold">{{row.montant_gele}} {{row.devise}}</td>

                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->
                    <q-tooltip>
                      Clic droit pour plus d'options
                    </q-tooltip>

                    <q-menu
                      touch-position
                      context-menu
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedGele=row;isAdd=false;showDlgDegele=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-unlock"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Débloquer un montant</q-item-section>
                        </q-item>

                      </q-list>
                    </q-menu>

                  </tr>

                  <template v-if="loading && data.length===0">
                    <tr
                      v-for="item in 6"
                      :key="item"
                      class="panel-primary"
                    >
                      <td
                        v-for="item2 in 6"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="6">
                        <nondata
                          v-if="!loading"
                          title="Aucun compte gelé enregistré"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <linearLoading :loading="loading && data && data.length >= 5" />
            <q-separator />
            <myPagination
              v-model="filterListe.peer_page"
              idPagination="paginationgele"
              @onPaginate="getDatas()"
            />
          </div>
        </div>
      </div>
    </div>

    <search
      v-model="showDialogSearch"
      :search="searchOperation"
      :filters="[
        {value:'compte.indice|%%',label:'Par numéro compte'},
        {value:'produit.designation|%%',label:'Par produit épargne',is_checked:false},
        {value:'rel_compte_client.devise|%%',label:'Par devise',is_checked:false},
        ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouveauGele
      v-model="showDlgGele"
      :selectedGele="selectedGele"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <nouveauDegele
      v-model="showDlgDegele"
      :selectedGele="selectedGele"
      @onFinish="getDatas()"
    />
  </q-page>
</template>
<script>
import nouveauGele from './nouveau_gele.vue'
import nouveauDegele from './nouveau_degele.vue'

export default {
  name: 'liste_gele',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDlgGele: false,
      showDlgDegele: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedGele: {},
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0

    }
  },
  props: [],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.filterListe = { ...this.defaultValues.filters }
  },
  mounted: function () {
    document.addEventListener('keydown', this.initialiseShortcut, false)

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.getDatas()
    }
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  filters: {},
  watch: {},
  components: {
    nouveauGele,
    nouveauDegele
  },
  computed: {

  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
        this.showDlgGele = true
      } else if (e.altKey && e.which === 82) { // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.which === 70) { // Ctrl + F
        this.showDialogSearch = true
      }
    },
    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Gele/getAllGeles`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationgele')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationgele a').forEach(el => {
                el.onclick = e => {
                  e.preventDefault()
                  this.getDatas(e.target.href)
                }
              })
            }
          } else {
            this.nombre = 0
            this.data = []
          }
        }).catch((e) => {
          this.loading = false
          let el = document.querySelector('.paginationgele')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
      }
    }
  }

}
</script>
<style lang="stylus"></style>
