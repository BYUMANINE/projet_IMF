<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
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
        text="Déclassement"
        icon="chequier.png"
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
              @click="selectedDeclassement=null;showDlgAddDecl=true"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >1</q-avatar>
              </q-item-section>
              <q-item-section>Transfert des crédits en souffrance</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              disable
              clickable
              v-close-popup
              @click="selectedDeclassement=null;showDlgAddPerte=true;"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >2</q-avatar>
              </q-item-section>
              <q-item-section>Transfert des crédits en perte</q-item-section>
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
                    <th>TRANS.</th>
                    <th class="text-left">NUM DMD</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-left">CLIENT</th>
                    <th class="text-right">ENCOURS</th>
                    <th class="text-right">INTERET</th>
                    <th class="text-right">PENALITE</th>
                    <th class="text-right">RETARD</th>
                    <th class="text-right">TAUX</th>
                    <th class="text-right">PROV</th>
                    <th class="text-center">DATE</th>
                    <th class="text-center">TYPE</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ row.fk_operation }}</td>
                    <td class="text-bold text-left">{{ row.code }}</td>
                    <td class="text-left">{{row.produit_str}} - {{row.devise}}</td>
                    <td class="text-left">{{ row.client_str }}</td>
                    <td class="text-bold text-right">{{$helper.formatMoney(row.montant_encours) }}</td>
                    <td class="text-bold text-right">{{$helper.formatMoney(row.montant_interet) }}</td>
                    <td class="text-bold text-right">{{$helper.formatMoney(row.montant_penalite) }}</td>
                    <td class="text-right">{{ row.nombre_retard }} Jrs</td>
                    <td class="text-right">{{ $helper.formatMoney(row.taux_provision) }} %</td>
                    <td class="text-right">{{ $helper.formatMoney(row.montant_provision) }}</td>
                    <td class="text-center">{{$helper.dateBien(row.created_at,false) }}</td>
                    <td class="text-center">{{ row.type }}</td>

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
                          @click="selectedDeclassement=row;showDlgDetailsOp = true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher le détails écritures</q-item-section>
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
                        v-for="item2 in 13"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="13">
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
              idPagination="paginationRemb"
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
        {value:'produit.designation|%%',label:'Par designation du produit'},
        {value:'credit_objet_financement.designation|%%',label:'Par objet de financement'},
        {value:'agent.nom_complet|%%',label:'Par nom du gestionnaire'}
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <nouveauDeclassementLot
      v-model="showDlgAddDecl"
      :selectedDeclassement="selectedDeclassement"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <nouveauTransfertPerteLot
      v-model="showDlgAddPerte"
      :selectedDeclassement="selectedDeclassement"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />
    <detailsOperation
      v-model="showDlgDetailsOp"
      :selectedOperation="selectedDeclassement ? {id:selectedDeclassement.fk_operation} : null"
      :user="user"
    />
  </q-page>
</template>
<script>
import dialogFilters from './dialog_filters.vue'
import nouveauDeclassementLot from './nouveau_declassement_lot.vue'
import nouveauTransfertPerteLot from './nouveau_transfert_perte_lot.vue'
import detailsOperation from '../../../commun/details_operation.vue'

export default {
  name: 'liste_demande',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      isAdd: false,

      showDialogSearch: false,
      showDlgFilters: false,
      showDlgAddDecl: false,
      showDlgAddPerte: false,
      showDlgDetailsOp: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedDeclassement: null,
      defaultValues: {
        filters: {
          filtres_avances: {},
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
    dialogFilters,
    nouveauDeclassementLot,
    nouveauTransfertPerteLot,
    detailsOperation
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
        filtres_avances: this.filterListe.filtres_avances,
        peer_page: this.filterListe.peer_page,
        search: this.searchOperation
      })

      url = url || `${this.URLS.BASE_URL}/Declassement/getAllDeclassements`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationRemb')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationRemb a').forEach(el => {
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
          let el = document.querySelector('.paginationRemb')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    }

  }
}
</script>
<style lang="stylus"></style>
