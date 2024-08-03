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
        @option-clicked="showDialogSearch = true"
      />
      <menu-option
        text="Nouvelle entreprise"
        icon="add.png"
        @option-clicked="$emit('onRedirect',{
                tab: '2',
                data: null
              }) "
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked=" showDialogSearch = false; searchOperation = null; getDatas()"
      />

      <menu-option
        text="Autres filtres"
        icon="filter_others.png"
      >
        <q-menu
          transition-show="scale"
          transition-hide="scale"
        >
          <div class="q-pa-md">
            <checkBoxGroup
              v-model="filterListe.autres_filters"
              :options="[
              {value:'1', label: 'Entreprises actives', field: `entreprise.status`,params:`='ACTIF'` },
              {value:'2', label: 'Entreprises inactives', field: `entreprise.status`,params:`='INACTIF'` },
              {value:'3', label: 'Entreprises dont les comptes sont dormants', field: `entreprise.dormant`,params:`='OUI'` },
              {value:'4', label: 'Entreprises ayant un ID NAT', field: `entreprise.id_national`,params:`IS NULL` },
              {value:'5', label: 'Entreprises n\'ayant pas d\'ID NAT', field: `entreprise.id_national`,params:`IS NOT NULL` },
              {value:'6', label: 'Entreprises ayant un numéro d\'impôt', field: `entreprise.num_impot`,params:`IS NULL` },
              {value:'7', label: 'Entreprises n\'ayant pas de numéro d\'impôt', field: `entreprise.num_impot`,params:`IS NOT NULL` },
              {value:'8', label: 'Entreprises ayant un agrement', field: `entreprise.num_agrement`,params:`IS NULL` },
              {value:'9', label: 'Entreprises n\'ayant pas d\'agrement', field: `entreprise.num_agrement`,params:`IS NOT NULL` },
            ]"
              @onSelected="getDatas()"
            />
          </div>
        </q-menu>
      </menu-option>
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
                    <th>CODE</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >APPELLATION</th>
                    <th class="text-center">SIGLE</th>
                    <th class="text-center">RCCM</th>
                    <th class="text-center">ID NAT</th>
                    <th class="text-left">CATEGORIE</th>
                    <th class="text-left">SECTEUR</th>
                    <th class="text-left">ACTIONNAIRES</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="selectedEntreprise=row;showDlgDetails=true"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center">{{ row.folio }}</td>
                    <td class="text-bold bg-blue-1">{{ row.designation }}</td>
                    <td class="text-center">{{ row.sigle }}</td>
                    <td class="text-center">{{ row.num_rccm }}</td>
                    <td class="text-center">{{ row.id_national }}</td>
                    <td class="text-left">{{ row.categorie_str || 'N/A' }}</td>
                    <td>{{ row.secteur != null ? row.secteur_str :'Non défini' }}</td>
                    <td class="text-center text-bold">{{ row.nb_actionnaires }}</td>

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
                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-bold">{{row.designation}}</q-item-label>
                            <q-item-label caption>CODE : {{row.folio}}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedEntreprise=row;showDlgDetails=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Situation du compte</q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="updateOrDetails(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-pen"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Mise à jour</q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedEntreprise= row;showDlgComptes=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Ouvrir un compte epargne</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-times"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Annuler cette adhésion</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Départ du membre</q-item-section>
                          <q-item-section side>
                            <q-icon name="keyboard_arrow_right" />
                          </q-item-section>
                          <q-menu
                            anchor="top end"
                            self="top start"
                            transition-show="scale"
                            transition-hide="scale"
                          ><q-list
                              separator
                              style="min-width: 100px"
                            >
                              <q-item
                                clickable
                                v-ripple
                                v-close-popup
                              >
                                <q-item-section>Saisi d'un départ</q-item-section>
                              </q-item>
                              <q-item
                                clickable
                                v-ripple
                                v-close-popup
                              >
                                <q-item-section>Annulation de départ</q-item-section>
                              </q-item>

                            </q-list>
                          </q-menu>
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
                          <q-item-section>{{row.status == 'ACTIF'? 'désactiver l\'entreprise ?': 'Activer l\'entreprise ?'}}</q-item-section>
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
                        v-for="item2 in 10"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="10">
                        <nondata
                          v-if="!loading"
                          title="Aucune entreprise trouvée"
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
              idPagination="paginationEntreprise"
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
        { value: 'entreprise.folio', label: 'Par code entreprise' },
        {value: `entreprise.designation|%%`, label: 'Par appellation'},
        {value: `entreprise.sigle|%%`, label: 'Par sigle'},
        { value: 'entreprise.num_rccm', label: 'Par RCCM', is_checked: false },
        { value: 'entreprise.id_national', label: 'Par ID NAT', is_checked: false },
        { value: 'entreprise.forme_juridique|%%', label: 'Par forme juridique', is_checked: false },
       ]"
    />

    <detailsEntreprise
      v-model="showDlgDetails"
      :idEntreprise="selectedEntreprise ? selectedEntreprise.id : null"
    />

    <ouvrirCompte
      v-model="showDlgComptes"
      :selectedClient="selectedEntreprise"
      typeClient="ENTREPRISE"
    />
  </q-page>
</template>
<script>
import detailsEntreprise from './details_entreprise.vue'
import ouvrirCompte from '../../../compte/ouverture_compte.vue'

export default {
  name: 'liste_entreprises',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      editInput: false,
      isAdd: false,
      showDlgDetails: false,
      showDlgComptes: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedEntreprise: null,
      defaultValues: {
        filters: {
          autres_filters: [],
          peer_page: '20'
        }
      },
      nombre: 0,

      /* TABLEAU VARAIBLES */
      data: [],
      fonctions: []

    }
  },
  props: ['filtersProps'],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.filterListe = { ...this.defaultValues.filters }

    // if (this.filtersProps) {
    //   for (var key in this.filtersProps) {
    //     this.filterListe[key] = this.filtersProps[key]
    //   }
    // }
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
    detailsEntreprise,
    ouvrirCompte
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
        autres_filters: this.filterListe.autres_filters,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Entreprise/getAllEntreprises`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationEntreprise')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationEntreprise a').forEach(el => {
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
        })
        .catch(e => {
          this.loading = false
          let el = document.querySelector('.paginationEntreprise')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },

    exportDatas () {
      let url = ''
      window.location.href = url
    },
    supprimer (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'Suppression en cours...',
          message: `Souhaitez-vous vraiment supprimer cette entreprise ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_entreprise_connect: this.user.id_agent
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Entreprise/delete/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()

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
    enableOrDisable (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} cette entreprise ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_entreprise_connect: this.user.id_agent
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Entreprise/enableOrDisable/`

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
    updateOrDetails (row) {
      const donnees = JSON.stringify({
        id_entreprise: row.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Entreprise/getDetailsEntreprise/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$emit('onRedirect', {
              tab: '2',
              data: {
                ...row,
                ...infos.data.records
              }
            })
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
