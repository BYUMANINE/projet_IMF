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
        text="Nouveau compte"
        tooltip="Alt + A"
        icon="add.png"
      >

        <q-menu
          touch-position
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list
            separator
            style="min-width: 100px"
          >
            <q-item
              clickable
              v-close-popup
              @click="selectedCompte=null;isAdd=true;showDlgComptesPrinc=true"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >1</q-avatar>
              </q-item-section>
              <q-item-section>Nouveau compte principal</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="selectedCompte=null;isAdd=true;showDlgComptesAuxi=true;"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >2</q-avatar>
              </q-item-section>
              <q-item-section>Nouveau compte auxiliaire</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </menu-option>
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
          <div class="panel-primary">
            <q-separator v-if="!!searchOperation" />
            <search-result :search="searchOperation" />
            <q-separator />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover  table-colored-head table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style="width:40px">INDICE</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >INTITULE</th>
                    <th class="text-left">POSTE</th>
                    <th>DEVISE</th>
                    <th class="text-left">CLASSE</th>
                    <th class="text-left">TYPE COMPTE</th>
                    <th>UTILISABLE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                    :class="rowColor(row)"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-left">{{row.indice}}</td>
                    <td class="text-left bg-blue-1 text-bold ">{{row.intitule}}</td>
                    <td class="text-left">{{row.poste}}</td>
                    <td class="text-center">{{row.devise || '---'}}</td>
                    <td class="text-left">{{row.classe}}</td>
                    <td class="text-left">{{row.type_compte}}</td>
                    <td class="text-center">{{row.utilisable}}</td>

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
                      v-if="row.is_system_account === 'NON'"
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedCompte=row;isAdd=false;showDlgComptesAuxi=true"
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
                        v-for="item2 in 8"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="8">
                        <nondata
                          v-if="!loading"
                          title="Aucun resultat trouvé Veuillez actualiser la liste"
                          btnLabel="Actualiser la liste"
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
              idPagination="paginationcompte"
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
        {value:'indice|%%',label:'Par indice du compte'},
        {value:'intitule|%%',label:'Par intitulé du compte'},
        ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouveauComptePrincipal
      v-model="showDlgComptesPrinc"
      :selectedCompte="selectedCompte"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <nouveauCompteAuxiliaire
      v-model="showDlgComptesAuxi"
      :selectedCompte="selectedCompte"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

  </q-page>
</template>
<script>
import nouveauComptePrincipal from './nouveau_compte_principal.vue'
import nouveauCompteAuxiliaire from './nouveau_compte_auxiliaire.vue'
import dialogFilters from './dialog_filters.vue'

export default {
  name: 'liste_compte',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDlgComptesAuxi: false,
      showDlgComptesPrinc: false,
      showDlgFilters: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: {},

      selectedCompte: {},
      defaultValues: {
        filters: {
          peer_page: '20',
          filtres_avances: {}
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

  },
  components: {
    nouveauCompteAuxiliaire,
    nouveauComptePrincipal,
    dialogFilters
  },
  computed: {

  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
        this.showDlgComptesAuxi = true
      } else if (e.altKey && e.which === 82) { // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.which === 70) { // Ctrl + F
        this.showDialogSearch = true
      }
    },
    rowColor (row) {
      return (row.indice.length === 5
        ? 'bg-blue-1 text-bold text-black'
        : '')
    },

    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          filtres_avances: this.filterListe.filtres_avances,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Compte/getAllcomptes`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationcompte')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationcompte a').forEach(el => {
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
          let el = document.querySelector('.paginationcompte')
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
        message: `Souhaitez-vous vraiment supprimer ce compte ?`,
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
        let url = `${this.URLS.BASE_URL}/Compte/delete/`

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
