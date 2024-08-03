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
              })"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false; searchOperation = null; getDatas()"
      />
    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">
      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary shadow-1 ">
            <grandTitre
              :titre="`BROUILLONS ENREGISTRES`"
              height="35px"
              spacing="35"
              size="15px"
            />
            <search-result :search="searchOperation" />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >APPELLATION</th>
                    <th class="text-center">SIGLE</th>
                    <th class="text-center">RCCM</th>
                    <th class="text-center">ID NAT</th>
                    <th class="text-center">FORME JURIDIQUE</th>
                    <th class="text-left">ACTIONNAIRES</th>
                    <th class="text-left">DATE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold bg-blue-1">{{ row.data.designation }}</td>
                    <td class="text-center">{{ row.data.sigle }}</td>
                    <td class="text-center">{{ row.data.num_rccm }}</td>
                    <td class="text-center">{{ row.data.id_national }}</td>
                    <td class="text-center">{{ row.data.forme_juridique }}</td>
                    <td class="text-center text-bold">{{ row.data.nb_actionnaires }}</td>
                    <td class="text-center text-bold">{{ row.data.created_at }}</td>

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
                            <q-item-label class="text-bold">{{row.data.designation}}</q-item-label>
                            <q-item-label caption>SIGLE : {{row.data.sigle}}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="$emit('onRedirect',{
                                    tab: '2',
                                    data: row.data
                                  })"
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

                  <template v-if="loading && data.length === 0">
                    <tr
                      v-for="item in 8"
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

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="8">
                        <nondata
                          v-if="!loading"
                          title="Aucun brouillon enregistré"
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
              idPagination="paginationBrouillon"
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
        {value: `CAST(JSON_EXTRACT(data,'$.designation') AS CHAR)|%%`, label: 'Par appellation'},
        {value: `CAST(JSON_EXTRACT(data,'$.sigle') AS CHAR)|%%`, label: 'Par sigle'},
        { value: `CAST(JSON_EXTRACT(data,'$.num_rccm') AS CHAR)`, label: 'Par RCCM' },
        { value: `CAST(JSON_EXTRACT(data,'$.id_national') AS CHAR)`, label: 'Par ID NAT' }
      ]"
    />

  </q-page>
</template>
<script>

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

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedBrouillon: null,
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

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
  watch: {},
  components: {},
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
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation,
        type: 'ENTREPRISE'
      })

      url = url || `${this.URLS.BASE_URL}/Brouillon/getAllBrouillons`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records

            let el = document.querySelector('.paginationBrouillon')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationBrouillon a').forEach(el => {
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
          let el = document.querySelector('.paginationBrouillon')
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
          message: `Souhaitez-vous supprimer ce brouillon ?`,
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            ...row
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Brouillon/delete/`

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
    }

  }
}
</script>
<style lang="stylus"></style>
