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
        text="Nouvelle caisse"
        tooltip="Alt + A"
        icon="add.png"
        @option-clicked="selectedCaisse=null;isAdd=true;showDlgCaisse=true;"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
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
              {value:'1', label: 'Caisses actives', field: `caisse.status`,params:`='ACTIF'` },
              {value:'2', label: 'Caisses inactives', field: `caisse.status`,params:`='INACTIF'` },
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
              <table class="table head-bold hover  table-colored-head">
                <thead>
                  <tr>
                    <th rowspan="2">#</th>
                    <th
                      rowspan="2"
                      style="width:40px"
                    >ETAT</th>
                    <th rowspan="2">CODE</th>
                    <th
                      rowspan="2"
                      style="width:20%"
                      class="text-left"
                    >INTITULE</th>
                    <th rowspan="2">TYPE CAISSE</th>
                    <th colspan="2">COMPTE PRINCIPAUX</th>

                  </tr>
                  <tr>
                    <th class="text-black bg-blue-1">CDF</th>
                    <th class="text-black bg-blue-1">USD</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status==='INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center ">{{row.code}}</td>
                    <td class="text-left text-bold ">{{row.designation}}</td>
                    <td class="text-center">{{row.type}}</td>
                    <td class="text-center">{{row.comptes[0].indice}}</td>
                    <td class="text-center">{{row.comptes[1].indice}}</td>

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
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="showDetailsCaisse(row)"
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
                              :class="`las la-toggle-${row.status=='ACTIF'?'on':'off'}`"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>{{row.status=='ACTIF'?'Désactiver cette caisse ?':'Activer cette caisse ?'}}</q-item-section>
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
                        v-for="item2 in 7"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="7">
                        <nondata
                          v-if="!loading"
                          title="Aucune caisse trouvée"
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
              idPagination="paginationcaisse"
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
        {value:'caisse.designation|%%',label:'Par intitulé de la caisse'},
        {value:'caisse.code|%%',label:'Par code de la caisse'},
        {value:'compte.indice|%%',label:'Par numéro de compte caisse'},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouvelleCaisse
      v-model="showDlgCaisse"
      :selectedCaisse="selectedCaisse"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import nouvelleCaisse from './nouvelle_caisse.vue'
export default {
  name: 'liste_caisse',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDlgCaisse: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedCaisse: {},
      defaultValues: {
        filters: {
          autres_filters: [],
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

    if (this.filtersProps) {
      for (var key in this.filtersProps) {
        this.filterListe[key] = this.filtersProps[key]
      }
    }
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
    nouvelleCaisse
  },
  computed: {

  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
        this.showDlgCaisse = true
      } else if (e.altKey && e.which === 82) { // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.which === 70) { // Ctrl + F
        this.showDialogSearch = true
      }
    },
    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          autres_filters: this.filterListe.autres_filters,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Caisse/getAllCaisses`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationcaisse')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationcaisse a').forEach(el => {
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
          let el = document.querySelector('.paginationcaisse')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
      }
    },

    exportDatas (type = 'excel') {
      let urlStr = `${this.URLS.BASE_URL}/caisse/exporter`

      const filename = `Rapport_journalier${type === 'excel' ? '.xls' : '.doc'}`
      const donnees = JSON.stringify([

      ])

      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
      })
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment supprimer cette caisse ?`,
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
        let url = `${this.URLS.BASE_URL}/Caisse/delete/`

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
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'En cours d\'exécution...',
          message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} cette caisse ?`,
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
          let url = `${this.URLS.BASE_URL}/Caisse/enableOrDisable/`

          this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
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
    showDetailsCaisse (row) {
      const donnees = JSON.stringify({
        id_caisse: row.id
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Caisse/getDetailsCaisse/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedCaisse = {
              ...row,
              ...infos.data.records
            }

            this.isAdd = false
            this.showDlgCaisse = true
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
