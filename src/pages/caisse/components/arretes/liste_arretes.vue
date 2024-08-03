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
        text="Nouvelle arrêté"
        tooltip="Alt + A"
        icon="add.png"
        @option-clicked="selectedAffectation=null;isAdd=true;showDlgAffectation=true;"
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
          <div class="panel-primary shadow-1 ">

            <search-result :search="searchOperation" />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover  table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CODE</th>
                    <th class="text-left">CAISSE</th>
                    <th class="text-right">S. INIT</th>
                    <th class="text-right">ENCAISS.</th>
                    <th class="text-right">DECAISS.</th>
                    <th class="text-right">S. CLOTURE</th>
                    <th class="text-right">S. PHYSIQUE</th>
                    <th class="text-right">ECART</th>
                    <th class="text-left">REF.</th>
                    <th class="text-left">DATE</th>
                    <th class="text-left">AGENT</th>
                  </tr>

                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center text-bold ">{{row.caisse_code}}</td>
                    <td class="text-left text-bold ">{{row.caisse_str}} - {{row.devise}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.solde_initial)}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.encaissement)}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.decaissement)}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.solde_cloture)}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.solde_physique)}}</td>
                    <td class="text-right">{{$helper.formatMoney(row.difference)}}</td>
                    <td class="text-left">{{row.fk_operation_difference || 'N/A'}}</td>
                    <td class="text-left">{{$helper.dateBien(row.date_jour,false)}}</td>
                    <td class="text-center">{{row.agent_folio}}</td>

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
                        v-for="item2 in 12"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="12">
                        <nondata
                          v-if="!loading"
                          title="Aucune arrêté trouvée"
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
              idPagination="paginationArreteCaisse"
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
        {value:'caisse.designation|%%',label:'Par intitulé de la caisse'},
        {value:'caisse.code|%%',label:'Par code de la caisse'}
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouvelleAffectation
      v-model="showDlgAffectation"
      :selectedAffectation="selectedAffectation"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import nouvelleAffectation from './nouvelle_arrete.vue'
export default {
  name: 'liste_caisse',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDlgAffectation: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedAffectation: {},
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
    nouvelleAffectation
  },
  computed: {},
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
        this.showDlgAffectation = true
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

        url = url || `${this.URLS.BASE_URL}/Caisse/getAllArretesCaisses`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationArreteCaisse')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationArreteCaisse a').forEach(el => {
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
          let el = document.querySelector('.paginationArreteCaisse')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
      }
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment supprimer cette arrêté ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          ...row,
          id_agent: this.user.id
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Caisse/delete/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              this.data.splice(this.data.indexOf(row), 1)
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
          .catch(e => {
            this.$q.loading.hide()
            this.$helper.showMessage()
          })
      })
    }

  }

}
</script>
<style lang="stylus"></style>
