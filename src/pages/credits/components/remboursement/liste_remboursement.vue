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
        text="Remboursement"
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
              @click="showDlgRembAnticip=true;isAdd=true;selectedRemboursement=null"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >1</q-avatar>
              </q-item-section>
              <q-item-section>Remboursement manuel</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgRembLot=true;isAdd=true;selectedRemboursement=null"
            >
              <q-item-section avatar> <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >2</q-avatar>
              </q-item-section>
              <q-item-section>Remboursement par lot</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgCreance=true;isAdd=true;selectedRemboursement=null"
            >
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  size="20px"
                  class="text-bold"
                >3</q-avatar>
              </q-item-section>
              <q-item-section>Recouvrement des créances en perte</q-item-section>
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
        text="Simulation remb."
        icon="chequier.png"
        @option-clicked="showDlgSimulation=true;selectedRemboursement=null"
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
                    <th>TRANS.</th>
                    <th class="text-left">NUM DMD</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-left">CLIENT</th>
                    <th class="text-right">CAPITAL</th>
                    <th class="text-right">INTERET</th>
                    <th class="text-right">PENALITE</th>
                    <th class="text-center">DATE REMB.</th>
                    <th class="text-center">TYPE</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDlgDetails(row)"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ row.fk_operation }}</td>
                    <td class="text-bold text-left">{{ row.code }}</td>
                    <td class="text-left">{{row.produit_str}}</td>
                    <td class="text-left">{{ row.client_str }}</td>
                    <td class="text-bold text-right">{{row.capital_remb }} {{row.devise}}</td>
                    <td class="text-bold text-right">{{row.interet_remb }} {{row.devise}}</td>
                    <td class="text-bold text-right">{{row.penalite_remb }} {{row.devise}}</td>
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
                          @click="updateOrDetails(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher le détails</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="showDlgDetailsOp=true;selectedRemboursement=row"
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
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="imprimer({id_remboursement:row.id})"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-print"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Imprimer le bordereau de remboursement</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="supprimer(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-trash"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Annuler ce remboursement </q-item-section>
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
        {value:'credit_demande.code|%%',label:'Par référence dossier'},
        {value:'r.fk_operation|%%',label:'Par référence transaction',is_checked:false},
        {value:'credit_param_produit.designation|%%',label:'Par designation du produit',is_checked:false},
       ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <remboursementAnticipatif
      v-model="showDlgRembAnticip"
      :selectedRemboursement="selectedRemboursement"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <remboursementLot
      v-model="showDlgRembLot"
      :selectedRemboursement="selectedRemboursement"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <recouvrementCreancePerte
      v-model="showDlgCreance"
      :selectedRemboursement="selectedRemboursement"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <simulationRemboursement
      v-model="showDlgSimulation"
      :selectedRemboursement="selectedRemboursement"
      :isAdd="isAdd"
    />

    <detailsRemboursement
      v-model="showDlgDetails"
      :selectedRemboursement="selectedRemboursement"
    />
    <detailsOperation
      v-model="showDlgDetailsOp"
      :selectedOperation="selectedRemboursement ? {id: selectedRemboursement.fk_operation} : null"
      :user="user"
    />

    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
      width="600px"
    />
  </q-page>
</template>
<script>
import dialogFilters from './dialog_filters.vue'
import recouvrementCreancePerte from './nouveau/recouvrement_creance_perte.vue'
import remboursementAnticipatif from './nouveau/remboursement_anticipatif.vue'
import remboursementLot from './nouveau/remboursement_lot.vue'
import detailsRemboursement from './details_remboursement.vue'
import simulationRemboursement from './nouveau/simulation_remboursement.vue'
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
      showDlgRembAnticip: false,
      showDlgRembLot: false,
      showDlgCreance: false,
      showDlgDetails: false,
      showDlgSimulation: false,
      showDlgDetailsOp: false,
      showDlgPreview: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,
      document: null,

      selectedRemboursement: null,
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
    recouvrementCreancePerte,
    remboursementAnticipatif,
    remboursementLot,
    detailsRemboursement,
    simulationRemboursement,
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

      url = url || `${this.URLS.BASE_URL}/Remboursement/getAllRemboursements`

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
    },
    updateOrDetails (row) {
      const donnees = JSON.stringify({
        ...row
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Remboursement/getDetailsRemboursement/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedRemboursement = {
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
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment annuler cette demande ?`,
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
        let url = `${this.URLS.BASE_URL}/Remboursement/delete/`

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
    imprimer (filtre) {
      let donnees = JSON.stringify({
        ...filtre,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'html'
      })

      let urlStr = `${this.URLS.BASE_URL}/rapports/Rapport_credit/exportBordereauRemboursementCredit/`
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
          name: 'REMBOURSEMENT'
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
