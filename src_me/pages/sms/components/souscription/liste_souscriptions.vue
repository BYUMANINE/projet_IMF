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
        @option-clicked="showDialogSearch = true"
      />
      <menu-option
        text="Nouvelle souscription"
        icon="add.png"
        @option-clicked="showDlgNouveau = true "
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked=" showDialogSearch = false; searchOperation = null; getDatas()"
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
                    <th>#</th>
                    <th>ETAT</th>
                    <th class="text-center">CODE</th>
                    <th class="text-left">ADHERENT</th>
                    <th class="text-left">CMPT PRELEV.</th>
                    <th class="text-center">DATE DEBUT</th>
                    <th class="text-center">DATE FIN</th>
                    <th class="text-center">SERVICES</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDetailsSouscription(row)"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-left">{{ row.code }}</td>
                    <td class="text-left">{{ row.folio }}</td>
                    <td class="text-left text-bold">{{ row.client_str }}</td>
                    <td class="text-center text-bold bg-blue-1">{{row.num_min +' à  '+ row.num_max}}</td>
                    <td class="text-center">{{row.nombre}}</td>
                    <td class="text-center">{{row.nb_cheques_utilises}}</td>

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
                          @click="showDetailsSouscription(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Détails du souscription</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedSouscription=row;showDlgDetailsOperation=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Détails de l'opération de paiement</q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="supprimer(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-trash-alt"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Supprimer</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          @click="enableOrDisable(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              :class="`las la-toggle-${row.status == 'ACTIF' ? 'on' : 'off'}`"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>{{row.status == 'ACTIF'? 'désactiver le souscription ?': 'Activer le souscription ?'}}</q-item-section>
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
                        v-for="item2 in 8"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="8">
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
              idPagination="paginationSouscription"
              @onPaginate="getDatas()"
            />
          </div>
        </div>
      </div>
    </div>

    <search
      v-model="showDialogSearch"
      :search="searchOperation"
      @onSearch="e => {searchOperation = e;this.getDatas()}"
      :filters="[
        {value:'S.client_str|%%',label:'Par adhérent'},
        {value:'S.folio|%%',label:'Par code adhérent'}
      ]"
    />

    <nouveauSouscription
      v-model="showDlgNouveau"
      @onFinish="getDatas()"
    />

    <detailsSouscription
      v-model="showDlgDetailsSouscription"
      :selectedSouscription="selectedSouscription"
      :user="user"
    />

    <detailsOperation
      v-model="showDlgDetailsOperation"
      :selectedOperation="{id:selectedSouscription.fk_operation}"
      :user="user"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />
  </q-page>
</template>
<script>

import detailsSouscription from './details_souscription.vue'
import nouveauSouscription from './nouveau_souscription.vue'
import detailsOperation from '../../../commun/details_operation.vue'
import dialogFilters from './dialog_filters.vue'

export default {
  name: 'liste_souscriptions',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      showDlgNouveau: false,
      showDlgDetailsSouscription: false,
      showDlgDetailsOperation: false,
      showDlgFilters: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedSouscription: {},
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0,

      clients: []
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
    nouveauSouscription,
    detailsSouscription,
    detailsOperation,
    dialogFilters
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
      this.loading = false
      /* const donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        filtres_avances: this.filterListe.filtres_avances,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Sms/getAllSouscriptions`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationSouscription')
            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationSouscription a').forEach(el => {
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
          let el = document.querySelector('.paginationSouscription')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        }) */
    },
    enableOrDisable (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} ce souscription ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_agent: this.user.id_agent
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Souscription/enableOrDisable/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1)
                // this.data.splice(this.data.indexOf(row), 1)
                row.status = row.status === 'ACTIF' ? 'INACTIF' : 'ACTIF'
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
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment supprimer ce souscription ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          ...row,
          id_agent: this.user.id,
          id_agence: this.user.id_agence
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Souscription/delete/`

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
    },
    showDetailsSouscription (row) {
      const donnees = JSON.stringify({
        id_souscription: row.id
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Souscription/getDetailsSouscription/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedSouscription = {
              ...row,
              ...infos.data.records
            }
            this.showDlgDetailsSouscription = true
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
