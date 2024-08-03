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
      <!-- <menu-option
        text="Nouveau dat"
        icon="add.png"
        @option-clicked="$emit('onRedirect',{tab:'3',data:null}) "
      /> -->
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
                    <th style="width:50px">ETAT</th>
                    <th style="width:50px">CODE</th>

                    <!-- ********************************************** -->
                    <!-- ******************** MEMBRE  ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client=='MEMBRE'">
                      <th style="width:50px">PHOTO</th>
                      <th
                        style="width:20%"
                        class="text-left"
                      > NOM COMPLET</th>
                      <th class="text-left">SEXE</th>
                      <th class="text-left">PROFESSION</th>
                      <th class="text-left">PIECE</th>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ********* GROUPES-ENTREPRISE ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client != 'MEMBRE'">
                      <th
                        style="width:20%"
                        class="text-left"
                      >APPELLATION</th>
                      <th class="text-center">SIGLE</th>
                      <th class="text-left">DATE DE CREATION</th>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ******************** GROUPES ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client =='GROUPE'">
                      <th class="text-left">TYPE DE CONTRIBUTION</th>
                      <th class="text-right">CONTR. CDF</th>
                      <th class="text-right">CONTR. USD</th>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ******************** ENTREPRISE ************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client =='ENTREPRISE'">
                      <th class="text-left">RCCM</th>
                      <th class="text-left">ID NAT</th>
                      <th class="text-left">FORME JURIDUQUE</th>
                    </template>
                    <!-- ********************************************** -->
                    <!-- *********************** COMMUNS ************** -->
                    <!-- ********************************************** -->
                    <th class="text-left">SECTEUR</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDetailsClient(row)"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center">{{ row.folio }}</td>

                    <!-- ********************************************** -->
                    <!-- ******************** MEMBRE  ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client=='MEMBRE'">
                      <td class="text-center">
                        <div
                          class="color-gradient text-center"
                          style="padding:3px; width:31px;margin:auto"
                        >
                          <q-img
                            :src="!!row.photo ?  `${URLS.IMG_MEMBRE}/${row.photo}` :'statics/images/icone/avatar.png'"
                            spinner-color="blue"
                            spinner-size="15px"
                            class="panel-primary"
                            style="height: 25px; width: 25px;"
                          />
                        </div>
                        <q-tooltip
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="center right"
                          self="center middle"
                          content-class="panel-primary shadow-3 q-pa-none"
                        >
                          <div
                            class="color-gradient text-center"
                            style="padding:3px; width:250px"
                          >
                            <q-img
                              :src="!!row.photo ?  `${URLS.IMG_MEMBRE}/${row.photo}` :'statics/images/icone/avatar.png'"
                              spinner-color="blue"
                              spinner-size="20px"
                              class="panel-primary"
                              style="height: 243px; width: 243px;"
                            />
                          </div>
                        </q-tooltip>
                      </td>
                      <td
                        style="width:20%"
                        class="text-left text-bold bg-blue-1"
                      >{{row.nom_complet}}</td>
                      <td class="text-left">{{row.sexe}}</td>
                      <td class="text-left">{{row.profession || 'N/A'}}</td>
                      <td class="text-left">{{row.num_piece || 'N/A'}}</td>
                    </template>
                    <!-- ********************************************** -->
                    <!-- ********* GROUPES-ENTREPRISE ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client != 'MEMBRE'">
                      <td
                        style="width:20%"
                        class="text-left text-bold bg-blue-1"
                      >{{row.designation}}</td>
                      <td class="text-left">{{row.sigle || 'N/A'}}</td>
                      <td class="text-left">{{$helper.dateBien(row.date_creation,false) || '---'}}</td>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ******************** GROUPES ***************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client =='GROUPE'">
                      <td class="text-left">{{row.type_contribution || 'N/A'}}</td>
                      <td class="text-right">{{row.montant_cdf}}</td>
                      <td class="text-right">{{row.montant_usd}}</td>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ******************** ENTREPRISE ************** -->
                    <!-- ********************************************** -->
                    <template v-if="filterListe.type_client =='ENTREPRISE'">
                      <td class="text-left">{{row.num_rccm}}</td>
                      <td class="text-left">{{row.id_national}}</td>
                      <td class="text-left">{{row.forme_juridique}}</td>
                    </template>

                    <!-- ********************************************** -->
                    <!-- ******************** COMMUNS ************** -->
                    <!-- ********************************************** -->
                    <td class="text-left">{{ row.secteur_str || 'Non défini' }}</td>

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
                          <q-item-section avatar>
                            <q-avatar color="blue-1">
                              <q-icon
                                size="40px"
                                name="img:statics/images/icone/avatar.png"
                              />
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="text-bold">{{!!row.nom_complet?row.nom_complet:row.designation}}</q-item-label>
                            <q-item-label caption>CODE : {{row.folio}}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="showDetailsClient(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Détails supplementaires</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="$emit('onRedirect',{tab:'1',data:{client:row,type:filterListe.type_client}})"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>DARS effectués par ce membre</q-item-section>
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
                        v-for="item2 in nb_colonnes"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="nb_colonnes">
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
              idPagination="paginationMembresDars"
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
      :filters="searchFilters"
    />

    <detailsMembre
      v-model="showDlgDetailsMembre"
      :idMembre="selectedClient ? selectedClient.id : null"
      :user="user"
    />

    <detailsGroupe
      v-model="showDlgDetailsGroupe"
      :idGroupe="selectedClient ? selectedClient.id : null"
    />

    <detailsEntreprise
      v-model="showDlgDetailsEntreprise"
      :idEntreprise="selectedClient ? selectedClient.id : null"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;if(e.type_client){this.filterListe.type_client = e.type_client.value};getDatas()}"
    />
  </q-page>
</template>
<script>

import detailsMembre from '../../../../../clients/components/membres/components/membre/details_membre.vue'
import detailsGroupe from '../../../../../clients/components/groupes/components/groupe/details_groupe.vue'
import detailsEntreprise from '../../../../../clients/components/entreprises/components/entreprise/details_entreprise.vue'
import dialogFilters from './dialog_filters.vue'

export default {
  name: 'liste_membres_dars',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      showDlgDetailsMembre: false,
      showDlgDetailsGroupe: false,
      showDlgDetailsEntreprise: false,
      showDlgFilters: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedClient: null,
      defaultValues: {
        filters: {
          filtres_avances: {},
          type_client: 'MEMBRE',
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
    detailsMembre,
    detailsGroupe,
    detailsEntreprise,
    dialogFilters
  },
  computed: {
    nb_colonnes () {
      return this.filterListe.type_client === 'MEMBRE'
        ? 9
        : (this.filterListe.type_client === 'GROUPE')
          ? 10
          : 10
    },
    searchFilters () {
      return this.filterListe.type_client === 'MEMBRE'
        ? [
          { value: 'membre.folio', label: 'Par code' },
          { value: `membre.nom_complet|%%`, label: 'Par nom complet' },
          { value: `membre.sexe|%%`, label: 'Par sexe', is_checked: false },
          { value: 'membre.profession', label: 'Par profession', is_checked: false },
          { value: 'secteur_activite.designation', label: 'Par secteur d\'activité', is_checked: false },
          { value: 'membre.pays|%%', label: 'Par pays', is_checked: false }
        ]
        : (this.filterListe.type_client === 'GROUPE'
          ? [
            { value: 'groupe.folio', label: 'Par code groupe' },
            { value: `groupe.designation|%%`, label: 'Par appellation' },
            { value: `groupe.sigle|%%`, label: 'Par sigle' },
            { value: 'secteur_activite.designation', label: 'Par secteur d\'activité', is_checked: false },
            { value: 'groupe.type_contribution', label: 'Par type contribution', is_checked: false },
            { value: 'groupe.axe|%%', label: 'Par axe', is_checked: false },
            { value: 'groupe.pays|%%', label: 'Par pays', is_checked: false }
          ]
          : [
            { value: 'entreprise.folio', label: 'Par code entreprise' },
            { value: `entreprise.designation|%%`, label: 'Par appellation' },
            { value: `entreprise.sigle|%%`, label: 'Par sigle' },
            { value: 'entreprise.num_rccm', label: 'Par RCCM', is_checked: false },
            { value: 'entreprise.id_national', label: 'Par ID NAT', is_checked: false },
            { value: 'secteur_activite.designation', label: 'Par secteur d\'activité', is_checked: false },
            { value: 'entreprise.forme_juridique|%%', label: 'Par forme juridique', is_checked: false },
            { value: 'entreprise.pays|%%', label: 'Par forme juridique', is_checked: false }
          ])
    }
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
        type_client: this.filterListe.type_client,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Dars/getAllMembresDars`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationMembresDars')
            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationMembresDars a').forEach(el => {
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
          let el = document.querySelector('.paginationMembresDars')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },

    showDetailsClient (row) {
      const type = this.filterListe.type_client
      this.selectedClient = row

      if (type === 'MEMBRE') {
        this.showDlgDetailsMembre = true
      } else if (type === 'GROUPE') {
        this.showDlgDetailsGroupe = true
      } else {
        this.showDlgDetailsEntreprise = true
      }
    }
  }
}
</script>
<style lang="stylus"></style>
