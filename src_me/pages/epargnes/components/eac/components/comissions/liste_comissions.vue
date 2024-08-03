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
                    <th class="text-left">CODE</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-left">MEMBRE</th>
                    <th class="text-left">COLLECTEUR</th>
                    <th class="text-left">COMMISSION</th>
                    <th class="text-center">TYPE</th>
                    <th class="text-center">TRANSFERE</th>
                    <th class="text-right">DATE</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @click="row.fk_operation !== null ?showDetailsOperation({id_operation:row.fk_operation}) : null"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold text-left">{{ row.code }}</td>
                    <td class="text-left">{{row.produit_str }}</td>
                    <td class="text-left">{{row.client_str }}</td>
                    <td class="text-left">{{row.collecteur_str }}</td>
                    <td class="text-right text-boldt">{{ $helper.formatMoney(row.montant) + ' '+  row.devise}}</td>
                    <td class="text-center">{{row.type }}</td>
                    <td class="text-center">{{row.fk_operation != null ? 'OUI':'NON' }}</td>
                    <td class="text-right">{{ $helper.dateBien(row.created_at,false) }}</td>

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
                          v-if="row.fk_operation != null"
                          @click="showDetailsOperation({id_operation:row.fk_operation})"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Détails sur l'opération l'opération</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-if="row.fk_operation === null && row.type ==='COLLECTEUR'"
                          @click="transfertCommissionVersEpargne(row)"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-exchange-alt"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Transferer la commission vers le compte epargne du collecteur</q-item-section>
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
              idPagination="paginationCommission"
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
        {value:'membre.nom_complet|%%',label:'Par nom du membre',is_checked:false},
        {value:'produit.designation|%%',label:'Par produit EAC',is_checked:false},
        ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <detailsOperation
      v-model="showDlgDetails"
      :selectedOperation="selectedOperation"
      :user="user"
    />
  </q-page>
</template>
<script>
import dialogFilters from './dialog_filters.vue'
import detailsOperation from '../../../../../commun/details_operation.vue'

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
      showDlgFilters: false,
      showDlgDetails: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,
      selectedOperation: null,

      selectedCommission: null,
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
    detailsOperation
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
    showDetailsOperation (row) {
      if (row.id_operation) {
        row.id = row.id_operation
        this.selectedOperation = row
        this.showDlgDetails = true
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

      url = url || `${this.URLS.BASE_URL}/Eac/getAllCommissions`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationCommission')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationCommission a').forEach(el => {
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
          let el = document.querySelector('.paginationCommission')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    transfertCommissionVersEpargne (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Transferer la commission du collecteur vers son compte epargne ?`,
          cancel: 'Non',
          html: true,
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            montant: row.montant,
            id_carnet: row.id_carnet,
            id_commission: row.id,
            id_agence: this.user.agence.id,
            id_agent: this.user.id
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Eac/transfertCommissionVersEpargne/`

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
    annulerCommission (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous annuler cet commission ? <br/><br/> Cette action est irréversible, une fois appliquée, vous ne pouvez plus revenir en arrière. <br/><br/> <b>Continuer quand même ?</b>`,
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
    }
  }
}
</script>
<style lang="stylus"></style>
