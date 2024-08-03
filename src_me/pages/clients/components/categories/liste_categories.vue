<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">

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
        text="Nouvelle categorie"
        icon="add.png"
        @option-clicked="selectedCategorie=null;isAdd=true;showDialogNewCategorie=true;"
      />

      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
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
            <div class="panel-primary overflow-auto">
              <table class="table head-bold hover table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-left">DESIGNATION</th>
                    <th class="text-left">DESCRIPTION</th>
                    <th>INDIVIDU</th>
                    <th>GROUPE</th>
                    <th>ENTREPRISE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-left text-bold ">{{row.designation}}</td>
                    <td class="text-left">{{row.description || 'Non définie'}}</td>
                    <td class="text-center text-bold">{{row.nb_membres}}</td>
                    <td class="text-center text-bold">{{row.nb_groupes}}</td>
                    <td class="text-center text-bold">{{row.nb_entreprises}}</td>
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
                          @click="selectedCategorie=row;isAdd=false;showDialogNewCategorie=true"
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
                        v-for="item2 in 6"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="6">
                        <nondata
                          v-if="!loading"
                          title="Aucune categorie trouvée"
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
              idPagination="paginationcategorie"
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
        {value:'agent.designation|%%',label:'Par designation'},
        {value:'agence.description|%%',label:'Par description'},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouvelleCategorie
      v-model="showDialogNewCategorie"
      :selectedCategorie="selectedCategorie"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import nouvelleCategorie from './nouvelle_categorie.vue'

export default {
  name: 'liste_categorie',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDialogNewCategorie: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedCategorie: {},
      defaultValues: {
        filters: {
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
    nouvelleCategorie
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
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Categorie/getAllCategories`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$helper.checkResponse(infos.data)
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationcategorie')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationcategorie a').forEach(el => {
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
          let el = document.querySelector('.paginationcategorie')
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
        message: `Souhaitez-vous vraiment supprimer cet categorie ?`,
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
        let url = `${this.URLS.BASE_URL}/Categorie/delete/`

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
