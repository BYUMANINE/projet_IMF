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
        text="Nouveau membre"
        icon="add.png"
        @option-clicked="isAdd=true;selectedMembre=null;showDNewMembre= true"
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
              {value:'1', label: 'Membres actifs', field: `membre.status`,params:`='ACTIF'` },
              {value:'2', label: 'Membres inactif', field: `membre.status`,params:`='INACTIF'`},
              {value:'3', label: 'Membres ayant des comptes CDF', field: `rel_compte_client.devise`,params:`='CDF'` },
              {value:'4', label: 'Membres ayant des comptes USD', field: `rel_compte_client.devise`,params:`='USD'` },
              {value:'5', label: 'Membres dont les comptes sont dormants', field: `membre.dormant`,params:`='OUI'` },
              {value:'6', label: 'Membres avec un pièce expirée', field: `membre.expiration_piece`,params:`< now()` },
              {value:'7', label: 'Membres avec un pièce non expirée', field: `membre.expiration_piece`,params:`>= now()` },
              {value:'8', label: 'Membres n\'ayant pas de signature', field: `membre.signature`,params:`IS NULL` },
              {value:'9', label: 'Membres n\'ayant pas de photo', field: `membre.photo`,params:` IS NULL` },
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
                    <th style="width:50px">PHOTO</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >NOM COMPLET</th>
                    <th class="text-center">SEXE </th>
                    <th class="text-left">PROFESSION</th>
                    <th class="text-left">SECTEUR</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="updateOrDetails(row,'INFO')"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center text-bold">{{ row.folio }}</td>
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
                        !!row.photo
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
                    <td class="text-bold bg-blue-1">{{ row.nom_complet }}</td>
                    <td class="text-center">{{ row.sexe }}</td>
                    <td class="text-left">{{ row.profession || 'Non définie' }}</td>
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
                            <q-item-label class="text-bold">{{row.nom_complet}}</q-item-label>
                            <q-item-label caption>CODE : {{row.folio}}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="updateOrDetails(row,'INFO')"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher détails</q-item-section>
                        </q-item>

                        <q-item
                          v-if="row.has_cmpt_epargne ==='NON'"
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedMembre=row;showDlgComptes=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Ouvrir un compte épargne à vie pour ce membre</q-item-section>
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
                          @click="enableOrDisable(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              :class="`las la-toggle-${row.status == 'ACTIF' ? 'on' : 'off'}`"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>{{row.status == 'ACTIF'? 'désactiver le membre ?': 'Activer le membre ?'}}</q-item-section>
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
              idPagination="paginationMembre"
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
        { value: 'membre.folio', label: 'Par code membre' },
        {value: `membre.nom_complet|%%`, label: 'Par nom complet'},
        {value: `membre.sexe|%%`, label: 'Par sexe',is_checked:false},
        { value: 'membre.profession', label: 'Par profession',is_checked:false },
        { value: 'secteur_activite.designation', label: 'Par secteur d\'activité',is_checked:false },
        { value: 'membre.quartier|%%', label: 'Par quartier',is_checked:false },
        { value: 'membre.commune|%%', label: 'Par commune',is_checked:false },
      ]"
    />

    <detailsMembre
      v-model="showDlgDetails"
      :selectedMembre="selectedMembre"
      :user="user"
      @edit="isAdd = true; showDNewMembre = true"
    />

    <nouveauMembre
      v-model="showDNewMembre"
      :selectedMembre="selectedMembre"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <ouvrirCompte
      v-model="showDlgComptes"
      :selectedClient="selectedMembre"
      typeClient="MEMBRE"
    />
  </q-page>
</template>
<script>
import detailsMembre from './details_membre_eac.vue'
import nouveauMembre from './nouveau_membre_eac.vue'
import ouvrirCompte from '../../../../../clients/components/compte/ouverture_compte.vue'

export default {
  name: 'liste_membres_eac',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDlgDetails: false,
      showDNewMembre: false,
      showDlgComptes: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedMembre: null,
      defaultValues: {
        filters: {
          autres_filters: [],
          sorts: {},
          peer_page: '20'
        }
      },
      nombre: 0,

      /* TABLEAU VARAIBLES */
      data: []
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
  watch: {
    'filterListe.sorts': {
      handler (newValue, oldValue) {
        this.getDatas()
      },
      deep: true
    }
  },
  components: {
    detailsMembre,
    nouveauMembre,
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
        search: this.searchOperation,
        sorts: this.filterListe.sorts
      })

      url = url || `${this.URLS.BASE_URL}/Eac/getAllMembresEac`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationMembre')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationMembre a').forEach(el => {
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
          let el = document.querySelector('.paginationMembre')
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
          message: `Souhaitez-vous vraiment supprimer ce membre ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_membre_connect: this.user.id_agent
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Membre/delete/`

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
          message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} ce membre ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            ...row,
            id_membre_connect: this.user.id_agent
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Membre/enableOrDisable/`

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
    updateOrDetails (row, type = 'UPDATE') {
      const donnees = JSON.stringify({
        id_membre: row.id,
        id_secteur: row.fk_secteur_activite,
        membre_eac: 'OUI'
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Membre/getDetailsMembre/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            if (type === 'UPDATE') {
              this.selectedMembre = {
                ...row,
                ...infos.data.records
              }
              this.isAdd = false
              this.showDNewMembre = true
            } else {
              this.selectedMembre = {
                ...row,
                ...infos.data.records,
                from_eac: true
              }
              this.isAdd = false
              this.showDlgDetails = true
            }
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
