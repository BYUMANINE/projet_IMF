<template>
  <q-page style="min-height:0">

    <list-menu-options>

      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="searchOperation=null;getDatas()"
      />
      <menu-option
        text="Recherche"
        icon="search.png"
        @option-clicked="showDialogSearch=true"
      />
      <menu-option
        text="Nouveau garant"
        icon="add.png"
        @option-clicked="selectedGarant=null;isAdd=true;showDialogNewGarant=true;"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />

      <menu-option
        text="Actifs/Inactifs"
        icon="option.png"
      >
        <q-menu
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list
            separator
            style="min-width: 150px"
          >
            <q-item
              v-for="(item,index) in optionsActive"
              :key="index"
            >
              <q-item-section>
                <q-radio
                  v-model="status"
                  :val="item"
                  :label="item.label"
                  v-close-popup
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </menu-option>
    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">
      <grandTitre
        :titre="`LISTE DES GARANTS`"
        height="35px"
        spacing="35"
        size="15px"
      >
        <q-badge
          color="primary"
          text-color="white"
          class="text-bold"
          :label="nombre"
        />
      </grandTitre>

      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary">
            <q-separator v-if="!!searchOperation" />
            <search-result :search="searchOperation" />
            <q-separator />
            <div class="panel-primary overflow-auto">
              <table class="table head-bold hover table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style="width:40px">ETAT</th>
                    <th style="width:40px">AVATAR</th>
                    <th>CODE</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >NOM COMPLET</th>
                    <th>SEXE</th>
                    <th class="text-left">ETAT CIVIL</th>
                    <th>TELEPHONE</th>
                    <th class="text-left">NB GARANTIES</th>
                    <th class="text-left">AGENCE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                    @dblclick="updateOrDetails(row,'INFO')"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status==='INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center">
                      <div
                        class="color-gradient text-center"
                        style="padding:3px; width:31px;margin:auto"
                      >
                        <q-img
                          :src="!!row.photo ?  `${URLS.IMG_GARANT}/${row.photo}` :'statics/images/icone/avatar.png'"
                          spinner-color="blue"
                          spinner-size="15px"
                          class="panel-primary"
                          style="height: 25px; width: 25px;"
                        />
                      </div>
                      <q-tooltip
                        v-if="!!row.photo"
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
                            :src="!!row.photo ?  `${URLS.IMG_GARANT}/${row.photo}` :'statics/images/icone/avatar.png'"
                            spinner-color="blue"
                            spinner-size="20px"
                            class="panel-primary"
                            style="height: 243px; width: 243px;"
                          />
                        </div>
                      </q-tooltip>
                    </td>
                    <td class="text-center text-bold">{{row.folio || '---'}}</td>
                    <td class="text-left text-bold bg-blue-1">{{row.nom_complet}}</td>
                    <td class="text-center">{{row.sexe}}</td>
                    <td class="text-left">{{row.etat_civil || 'Non définie'}}</td>
                    <td class="text-center">{{row.phone || 'Non défini'}}</td>
                    <td class="text-center text-bold">{{row.nb_garantie}}</td>
                    <td class="text-left">{{row.agence.designation}}</td>
                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->
                    <q-tooltip>
                      Clic droit pour plus d'options
                    </q-tooltip>

                    <q-menu
                      touch-position
                      context-menu
                      transition-show="
                      scale"
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
                              :class="`las la-toggle-${row.status=='ACTIF'?'on':'off'}`"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>{{row.status=='ACTIF'?'Désactiver cet garant ?':'Activer cet garant ?'}}</q-item-section>
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
                        v-for="item2 in 11"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="11">
                        <nondata
                          v-if="!loading"
                          title="Aucun garant trouvé"
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
              idPagination="paginationgarant"
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
        {value:'credit_garant.nom_complet|%%',label:'Par nom complet'},
        {value:'credit_garant.sexe|%%',label:'Par sexe'},
        {value:'credit_garant.adresse|%%',label:'Par adresse'}
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouveauGarant
      v-model="showDialogNewGarant"
      :selectedGarant="selectedGarant"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import nouveauGarant from './nouveau_garant.vue'

export default {
  name: 'liste_garant',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDialogNewGarant: false,
      showDlgDetails: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,
      status: null,

      selectedGarant: {},
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0,

      optionsActive: [
        { value: 'ALL', label: 'Tous les garants' },
        { value: 'ACTIF', label: 'Uniquement les garants actifs' },
        { value: 'INACTIF', label: 'Uniquement les garants inactifs' }
      ]

    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.status = this.optionsActive[0]
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
    status (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.data = []
        this.getDatas()
      }
    }
  },
  components: {
    nouveauGarant

  },
  computed: {

  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
      } else if (e.altKey && e.which === 82) { // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.shiftKey && e.which === 70) { // Ctrl + Shift + F
        this.showDialogSearch = true
      }
    },

    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.status) &&
        this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          status: this.status.value,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Garantie/getAllGarants`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$helper.checkResponse(infos.data)
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationgarant')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationgarant a').forEach(el => {
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
          let el = document.querySelector('.paginationgarant')
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
        message: `Souhaitez-vous vraiment supprimer cet garant ?`,
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
        let url = `${this.URLS.BASE_URL}/Garantie/deleteGarant/`

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
    enableOrDisable (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'En cours d\'exécution...',
        message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} cet garant ?`,
        cancel: 'Non',
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
          let url = `${this.URLS.BASE_URL}/Garantie/enableOrDisableGarant/`

          this.$axios.post(url, this.$helper.objectToform({ data: donnees })).then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

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
      if (type === 'UPDATE') {
        this.selectedGarant = row
        this.isAdd = false
        this.showDialogNewGarant = true
      } else {
        const donnees = JSON.stringify({
          id_agent: row.id
        })

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Garantie/getdetailsGarant/`

        this.$axios
          .post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()

            if (infos.data.erreur === false) {
              this.selectedGarant = {
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

}
</script>
<style lang="stylus"></style>
