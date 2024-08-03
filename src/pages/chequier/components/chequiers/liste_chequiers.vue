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
        text="Nouveau chequier"
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
                    <th class="text-left">REF. CHEQUIER</th>
                    <th class="text-center">REF. OP</th>
                    <th class="text-left">FOLIO</th>
                    <th class="text-left">ADHERENT</th>
                    <th class="text-center">PLAGE</th>
                    <th class="text-center">CHEQUES</th>
                    <th class="text-center">UTILISES</th>
                    <th class="text-center">RESTE</th>
                    <th class="text-left">DATE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDetailsChequier(row)"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-left">{{ row.code }}</td>
                    <td class="text-center">{{ row.fk_operation }}</td>
                    <td class="text-left">{{ row.folio }}</td>
                    <td class="text-left text-bold">{{ row.client_str }}</td>
                    <td class="text-center text-bold bg-blue-1">{{row.num_min +' à  '+ row.num_max}}</td>
                    <td class="text-center">{{row.nombre}}</td>
                    <td class="text-center">{{row.nb_cheques_utilises}}</td>
                    <td class="text-center">{{row.nombre - row.nb_cheques_utilises}}</td>
                    <td class="text-left">{{$helper.dateBien(row.created_at,false)}}</td>

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
                          @click="showDetailsChequier(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Détails du chequier</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedChequier=row;showDlgDetailsOperation=true"
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
                          <q-item-section>{{row.status == 'ACTIF'? 'désactiver le chequier ?': 'Activer le chequier ?'}}</q-item-section>
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
                        v-for="item2 in 11"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="11">
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
              idPagination="paginationChequier"
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
        {value:'S.folio|%%',label:'Par code adhérent'},
        {value:'S.code|%%',label:'Par code chéquier'}
      ]"
    />

    <nouveauChequier
      v-model="showDlgNouveau"
      @onFinish="getDatas()"
    />

    <detailsChequier
      v-model="showDlgDetailsChequier"
      :selectedChequier="selectedChequier"
      :user="user"
    />

    <detailsOperation
      v-model="showDlgDetailsOperation"
      :selectedOperation="{id:selectedChequier.fk_operation}"
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

import detailsChequier from './details_chequier.vue'
import nouveauChequier from './nouveau_chequier.vue'
import detailsOperation from '../../../commun/details_operation.vue'
import dialogFilters from './dialog_filters.vue'

export default {
  name: 'liste_chequiers',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      showDlgNouveau: false,
      showDlgDetailsChequier: false,
      showDlgDetailsOperation: false,
      showDlgFilters: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedChequier: {},
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
    nouveauChequier,
    detailsChequier,
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
      this.loading = true
      const donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        filtres_avances: this.filterListe.filtres_avances,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Chequier/getAllChequiers`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationChequier')
            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationChequier a').forEach(el => {
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
          let el = document.querySelector('.paginationChequier')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    enableOrDisable (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} ce chequier ?`,
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
          let url = `${this.URLS.BASE_URL}/Chequier/enableOrDisable/`

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
        message: `Souhaitez-vous vraiment supprimer ce chequier ?`,
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
        let url = `${this.URLS.BASE_URL}/Chequier/delete/`

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
    showDetailsChequier (row) {
      const donnees = JSON.stringify({
        id_chequier: row.id
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Chequier/getDetailsChequier/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedChequier = {
              ...row,
              ...infos.data.records
            }
            this.showDlgDetailsChequier = true
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
