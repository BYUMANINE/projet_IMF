<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="searchOperation = null;getDatas()"
      />
      <menu-option
        text="Recherche"
        icon="search.png"
        @option-clicked="showDialogSearch=true"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />

      <menu-option
        :text="$helper.isNotEmpty(filterListe.filtres_avances) ? 'Filtres appliqués' :'Filtres'"
        :icon="$helper.isNotEmpty(filterListe.filtres_avances) ? 'filter2.png':'filter_others.png'"
        :className="$helper.isNotEmpty(filterListe.filtres_avances) ? 'bg-orange-1' : ''"
        @option-clicked="showDlgFilters = true;"
      />

      <menu-option
        v-if="$helper.isNotEmpty(filterListe.filtres_avances)"
        text="Annuler les filtres"
        icon="clear.png"
        @option-clicked="filterListe.filtres_avances ={};getDatas()"
      />

    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">
      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary shadow-1 ">

            <search-result :search="searchOperation" />

            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th rowspan="2">N*</th>
                    <th colspan="6">ECHEANCES</th>
                    <th colspan="4">REMBOURSEMENTS</th>
                  </tr>
                  <tr>
                    <th>DOSSIER</th>
                    <th class="text-left">FOLIO</th>
                    <th class="text-left">ADHERENT</th>
                    <th>CAPITAL</th>
                    <th>INTERET</th>
                    <th>MENSUALITE</th>
                    <th>REMB. INT.</th>
                    <th>REMB. CAP.</th>
                    <th>REMB. TOTAL</th>
                    <th>RESTE</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDlgDetails(row)"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold text-left">{{ row.code }}</td>
                    <td class="text-left">{{ row.folio }}</td>
                    <td class="text-left">{{ row.client_str }}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.capital_amor) }}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.interet_amor) }}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.mensualite_amor) }}</td>
                    <td class="text-right">{{$helper.formatMoney(row.capital_remb)}}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.interet_remb) }}</td>
                    <td class="text-right">{{$helper.formatMoney(row.mensualite_remb) }} {{row.devise}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(row.mensualite_amor - row.mensualite_remb)}}</td>

                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->

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
                          @click="updateOrDetails(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Tableau d'omortissement détaillés</q-item-section>
                        </q-item>

                      </q-list>
                    </q-menu>
                  </tr>

                  <template v-if="loading && data.length === 0">
                    <tr
                      v-for="item in 6"
                      :key="item"
                      class="panel-primary"
                    >
                      <td
                        v-for="item2 in 9"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="9">
                        <nondata
                          v-if="!loading"
                          title="Aucun resultat trouvé"
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
              idPagination="paginationDecaiss"
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
        {value:'dmd.code|%%',label:'Par référence dossier'},
       ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <detailsAmortissement
      v-model="showDlgDetails"
      :selectedAmortissement="selectedAmortissement"
    />

  </q-page>
</template>
<script>
import dialogFilters from './dialog_filters.vue'
import detailsAmortissement from './details_amortissement.vue'

export default {
  name: 'liste_amortissements',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      isAdd: false,

      showDialogSearch: false,
      showDlgFilters: false,
      showDlgDetails: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedAmortissement: null,
      defaultValues: {
        filters: {
          filtres_avances: {},
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
    dialogFilters,
    detailsAmortissement
  },
  computed: {},
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) {
        // Alt+A
      } else if (e.altKey && e.which === 82) {
        // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.shiftKey && e.which === 70) {
        // Ctrl + Shift + F
        this.showDialogSearch = true
      }
    },

    getDatas (url = null) {
      this.loading = true

      const donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        filtres_avances: this.filterListe.filtres_avances,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Amortissement/getAllAmortissements`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationDecaiss')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationDecaiss a').forEach(el => {
                el.onclick = e => {
                  e.preventDefault()
                  this.getDatas(e.target.href)
                }
              })
            }
          } else {
            this.data = []
          }
        })
        .catch(e => {
          this.loading = false
          let el = document.querySelector('.paginationDecaiss')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    updateOrDetails (row) {
      this.selectedAmortissement = row
      this.showDlgDetails = true
    }

  }
}
</script>
<style lang="stylus"></style>
