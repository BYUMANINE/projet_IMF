<template>
  <q-page style="min-height:0">
    <list-menu-options>
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
        text="Nouveau carnet"
        icon="add.png"
        @option-clicked="selectedCarnet=null;isAdd=true;showNewCarnet=true"
      />
      <menu-option
        text="Transfert carnets"
        icon="affectation.png"
        @option-clicked="showDlgAffectation=true;"
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
            <q-separator v-if="!!searchOperation" />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CODE</th>
                    <th class="text-left">ETAT</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-left">MEMBRE</th>
                    <th class="text-left">COLLECTEUR</th>
                    <th class="text-right">MISE</th>
                    <th class="text-right">DEBUT</th>
                    <th class="text-right">FIN</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDetailsEac(row)"
                    :class="row.status === 'INACTIF' ? 'bg-red-1' : ''"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold text-center">{{ row.code }}</td>
                    <td class="text-left">{{row.status}}</td>
                    <td class="text-left">{{ row.produit_str }}</td>
                    <td class="text-left">{{row.client_str }}</td>
                    <td class="text-left">{{row.collecteur_str }}</td>
                    <td class="text-right text-boldt">{{ row.mise + ' '+  row.devise}}</td>
                    <td class="text-right">{{ $helper.dateBien(row.date_ouverture,false) }}</td>
                    <td class="text-right">{{ $helper.dateBien(row.date_fermeture,false) }}</td>

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
                          @click="showDetailsEac(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher les détails du carnet</q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-if="row.status==='ENCOURS'"
                          @click="stopEac(row)"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-times"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Arrêter ce carnet</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-if="(row.status==='ENCOURS' || row.status==='INACTIF') && row.has_depots === 'NON'"
                          @click="annulerCarnet(row)"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-times"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Annuler ce carnet</q-item-section>
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
              idPagination="paginationEac"
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
        {value:'carnet.code|%%',label:'Par code carnet'},
        {value:'carnet.date_ouverture|%%',label:'Par date ouverture',is_checked:false},
        {value:'carnet.date_fermeture|%%',label:'Par date fermeture',is_checked:false},
        {value:'carnet.mise|%%',label:'Par mise',is_checked:false},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <detailsCarnet
      v-model="showDlgDetails"
      :selectedCarnet="selectedCarnet"
      :user="user"
    />

    <nouveauCarnet
      v-model="showNewCarnet"
      :selectedCarnet="selectedCarnet"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <transfertCarnets v-model="showDlgAffectation" />
  </q-page>
</template>
<script>
import detailsCarnet from './details_carnet.vue'
import nouveauCarnet from './nouveau_carnet.vue'
import dialogFilters from './dialog_filters.vue'
import transfertCarnets from './transfert_carnets.vue'

export default {
  name: 'liste_dats',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      showDlgDetails: false,
      showNewCarnet: false,
      showDlgFilters: false,
      showDlgAffectation: false,
      isAdd: false,

      filter: 'none', // from,between
      dateMax: 'none',
      dateMin: 'none',

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedCarnet: null,
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
  props: ['filtersProps'],
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
    detailsCarnet,
    nouveauCarnet,
    dialogFilters,
    transfertCarnets
  },
  computed: {

  },
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

      url = url || `${this.URLS.BASE_URL}/Eac/getAllCarnets`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationEac')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationEac a').forEach(el => {
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
          let el = document.querySelector('.paginationEac')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    stopEac (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous arrêter cet Eac ? <br/><br/> Cette action est irréversible, une fois appliquée, vous ne pouvez plus revenir en arrière. <br/><br/> <b>Continuer quand même ?</b>`,
          cancel: 'Non',
          html: true,
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_agent: this.user.id
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Eac/stopEac/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1)
                this.getDatas()
              } else {
                this.$helper.showMessage(infos.data.message)
              }
            })
            .catch(e => {
              this.$q.loading.hide()
              this.$helper.showMessage()
            })
        })
    },
    annulerCarnet (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous annuler cet carnet ? <br/><br/> Cette action est irréversible, une fois appliquée, vous ne pouvez plus revenir en arrière. <br/><br/> <b>Continuer quand même ?</b>`,
          cancel: 'Non',
          html: true,
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_agent: this.user.id
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Eac/supprimer/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1)
                this.getDatas()
              } else {
                this.$helper.showMessage(infos.data.message)
              }
            })
            .catch(e => {
              this.$q.loading.hide()
              this.$helper.showMessage()
            })
        })
    },
    showDetailsEac (row) {
      const donnees = JSON.stringify(row)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Eac/getDetailsCarnet/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedCarnet = {
              ...row,
              ...infos.data.records
            }
            this.showDlgDetails = true
          } else {
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    }

  }
}
</script>
<style lang="stylus"></style>
