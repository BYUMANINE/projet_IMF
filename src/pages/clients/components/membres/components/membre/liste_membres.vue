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
              {value:'1', label: 'Membres actifs', field: `membre.status`,params:`='ACTIF'` },
              {value:'2', label: 'Membres inactif', field: `membre.status`,params:`='INACTIF'` },
              {value:'3', label: 'Membres dont les comptes sont dormants', field: `membre.dormant`,params:`='OUI'` },
              {value:'4', label: 'Membres avec un pièce expirée', field: `membre.expiration_piece`,params:`< now()` },
              {value:'5', label: 'Membres avec un pièce non expirée', field: `membre.expiration_piece`,params:`>= now()` },
              {value:'6', label: 'Membres n\'ayant pas de signature', field: `membre.signature`,params:`IS NULL` },
              {value:'7', label: 'Membres n\'ayant pas de photo', field: `membre.photo`,params:` IS NULL` },
              {value:'8', label: 'Membres qui exerce une fonction publique', field: `membre.activite_publique`,params:`='OUI'` },
              {value:'9', label: 'Membres qui n\'exerce pas une fonction publique', field: `membre.activite_publique`,params:`='NON'` },
            ]"
              @onSelected="getDatas()"
            />
            <q-item
              clickable
              v-ripple
              v-close-popup
            >
              <q-item-section class="text-primary">Filtres avancés</q-item-section>
            </q-item>
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
                    <th>FOLIO</th>
                    <th>CODE</th>
                    <th>PHOTO</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >NOM COMPLET</th>
                    <th class="text-center">SEXE</th>
                    <th class="text-left">PROFESSION</th>
                    <th class="text-left">CATEGORIE</th>
                    <th class="text-left">SECTEUR</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="selectedMembre=row;showDlgDetails=true"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status === 'INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center">{{ row.folio }}</td>
                    <td class="text-center">{{ row.folio_2 || 'N/A' }}</td>
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
                    <td class="text-bold text-left">{{ row.nom_complet }}</td>
                    <td class="text-center">{{ row.sexe }}</td>
                    <td class="text-left">{{ row.profession || 'Non définie' }}</td>
                    <td class="text-left">{{ row.categorie_str || 'N/A' }}</td>
                    <td class="text-left">{{ row.secteur_str || 'N/A'
                       }}</td>

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
                          @click="selectedMembre=row;showDlgDetails=true"
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
                          @click="imprimer({id_client:row.id})"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-print"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Imprimer la fiche d'adhésion</q-item-section>
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
                          @click="selectedMembre= row;showDlgComptes=true"
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
                          >
                            <q-list
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
        {value: `membre.sexe|%%`, label: 'Par sexe', is_checked: false},
        { value: 'membre.profession', label: 'Par profession', is_checked: false },
        { value: 'secteur_activite.designation', label: 'Par secteur d\'activité', is_checked: false },
        { value: 'membre.quartier|%%', label: 'Par quartier',is_checked:false },
        { value: 'membre.commune|%%', label: 'Par commune',is_checked:false },
      ]"
    />

    <detailsMembre
      v-model="showDlgDetails"
      :idMembre="selectedMembre ? selectedMembre.id : null"
    />

    <ouvrirCompte
      v-model="showDlgComptes"
      :selectedClient="selectedMembre"
      typeClient="MEMBRE"
    />

    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
      width="700px"
    />
  </q-page>
</template>
<script>
import detailsMembre from './details_membre.vue'
import ouvrirCompte from '../../../compte/ouverture_compte.vue'

export default {
  name: 'liste_membres',
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
      showDlgPreview: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,
      document: null,

      selectedMembre: null,
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

      url = url || `${this.URLS.BASE_URL}/Membre/getAllMembres`

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
    updateOrDetails (row) {
      const donnees = JSON.stringify({
        id_membre: row.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Membre/getDetailsMembre/`

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
    },
    imprimer (filtre) {
      let donnees = JSON.stringify({
        ...filtre,
        type_client: 'MEMBRE',
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'html'
      })

      let urlStr = `${this.URLS.BASE_URL}/rapports/Rapport_adhesion/exportFicheAdhesion/`
      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))

        this.document = {
          url,
          name: 'FICHE D\'ADHESION INDIVIDU'
        }
        this.showDlgPreview = true
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    }
  }
}
</script>
<style lang="stylus"></style>
