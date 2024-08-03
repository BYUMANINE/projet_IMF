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
        @option-clicked="showDialogSearch=true"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />

      <menu-option
        text="Nouvelle garantie"
        icon="add.png"
        @option-clicked="showDlgNew=true;selectedGarantie=null;isAdd=true;"
      />

    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">
      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary shadow-1 ">
            <grandTitre
              :titre="`LISTE DES GARANTIES`"
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
            <search-result :search="searchOperation" />
            <div
              class="my-scroll"
              style="padding:6px 10px"
            >
              <div class="row items-center no-wrap q-gutter-sm">
                <div class="col-auto">
                  <q-avatar
                    size="35px"
                    color="blue-1"
                    text-color="primary"
                  >
                    <q-icon
                      name="las la-filter"
                      size="20px"
                    />
                  </q-avatar>
                </div>

                <div class="col-2">
                  <q-select
                    transition-show="scale"
                    transition-hide="scale"
                    square
                    outlined
                    dense
                    label="Devise"
                    fill-input
                    hide-selected
                    hide-bottom-space
                    use-input
                    emit-value
                    map-options
                    v-model="filterListe.devise"
                    :options="optionsDevises"
                    :option-value="opt => opt"
                    :option-label="opt => `${opt.label}`"
                    @input="getDatas()"
                  />
                </div>

                <div class="col">
                  <q-select
                    transition-show="scale"
                    transition-hide="scale"
                    square
                    outlined
                    dense
                    label="Par Garant"
                    fill-input
                    hide-selected
                    hide-bottom-space
                    use-input
                    emit-value
                    map-options
                    v-model="filterListe.garant"
                    :options="garants"
                    :option-value="opt => opt"
                    :option-label="opt => !!opt ? `${opt.nom_complet}`:''"
                    @filter="filterGarants"
                    @input="getDatas()"
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-red">
                          Aucun garant trouvé
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col">
                  <q-select
                    transition-show="scale"
                    transition-hide="scale"
                    square
                    outlined
                    dense
                    label="Par type de garantie"
                    fill-input
                    hide-selected
                    hide-bottom-space
                    use-input
                    emit-value
                    map-options
                    v-model="filterListe.type"
                    :options="types"
                    :option-value="opt => opt"
                    :option-label="opt => !!opt ? `${opt.designation }` : ''"
                    @filter="filterTypes"
                    @input="getDatas()"
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-red">
                          Aucun type trouvé
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="text-left">NUMERO PIECE</th>
                    <th class="text-left">VALEUR</th>
                    <th class="text-left">GARANTIE</th>
                    <th class="text-left">GARANT</th>
                    <th class="text-left">TYPE GARANTIE</th>
                    <th class="text-center">DATE EXPIRATION</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold bg-blue-1">{{ row.num_piece }}</td>
                    <td class="text-center">{{ row.valeur + ' '+  row.devise}}</td>
                    <td class="text-left text-bold bg-blue-1">{{row.proprietaire }}</td>
                    <td class="text-left">{{ row.garant_str }}</td>
                    <td class="text-left">{{ row.type_garantie_str }} </td>
                    <td class="text-center">{{ row.validite_str }}</td>

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
                          @click="updateGarantie(row)"
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
                      v-for="item in 5"
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
                      <td :colspan="7">
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
              idPagination="paginationGarantie"
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
        {value:'agent.nom_complet|%%',label:'Par nom complet'},
        {value:'agent.sexe|%%',label:'Par sexe'},
        {value:'agent.adresse|%%',label:'Par adresse'},
        {value:'agent.username|%%',label:'Par nom d\'collecteur'},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouvelleGarantie
      v-model="showDlgNew"
      :selectedGarantie="selectedGarantie"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import nouvelleGarantie from './nouvelle_garantie.vue'
export default {
  name: 'liste_garanties',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      isAdd: false,
      showDialogSearch: false,
      showDlgNew: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedGarantie: null,
      defaultValues: {
        filters: {
          devise: { value: 'ALL', label: 'Toutes' },
          garant: { id: 'ALL', folio: '0', nom_complet: 'Tous les garants' },
          type: { id: 'ALL', indice: 'ALL', designation: 'Tous les type garanties' },
          peer_page: '20'

        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0,

      types: [],
      garants: [],

      optionsDevises: [
        { value: 'ALL', label: 'Toutes' },
        { value: 'CDF', label: 'CDF' },
        { value: 'USD', label: 'USD' }

      ]

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

    this.$emit('clear', null)
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
    nouvelleGarantie
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
    filterGarants (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchGarants`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.garants = [
            ...[this.defaultValues.filters.garant],
            ...infos.data.records]
        })
      }).catch(() => {
        update(() => {
          this.garants = [this.defaultValues.filters.garant]
        })
      })
    },
    filterTypes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchTypeGarantie`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.types = [
            ...[this.defaultValues.filters.type],
            ...infos.data.records]
        })
      }).catch(() => {
        update(() => {
          this.types = [this.defaultValues.filters.type]
        })
      })
    },
    getDatas (url = null) {
      this.loading = true

      const donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.filterListe.devise.value,
        id_garant: this.filterListe.garant.id,
        id_type_garantie: this.filterListe.type.id,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Garantie/getAllGaranties`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationGarantie')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationGarantie a').forEach(el => {
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
          let el = document.querySelector('.paginationGarantie')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    updateGarantie (row) {
      this.selectedGarantie = row
      this.isAdd = false
      this.showDlgNew = true
    },

    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment supprimer cette garantie ?`,
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
        let url = `${this.URLS.BASE_URL}/Garantie/deleteGarantie/`

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
