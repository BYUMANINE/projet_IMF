<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top:-2px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="searchOperation='';getDatas()"
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
        @option-clicked="showDialogSearch = false;searchOperation='';getDatas()"
      />

      <menu-option
        text="Filtrer par date"
        icon="filter_date.png"
        @option-clicked="showDialogDate=true"
      />

      <labelFilterByDate
        :filter="filter"
        :dateMin="dateMin"
        :dateMax="dateMax"
        close
        @closeFiltre="dateMin=null;dateMax=null;filter=null;getDatas()"
      />

    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">

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

          <div class="col-1">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              dense
              v-model="filterListe.devise"
              rounded
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              outlined
              :options="['CDF','USD']"
              label="Devise"
              @input="onDeviseSelected"
            />
          </div>

          <div class="col">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              outlined
              dense
              label="Sélectionner un compte"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.compte"
              :options="comptes"
              :option-value="opt => opt"
              :option-label="opt => !!opt ? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
              @filter="filterComptes"
              @input="getDatas()"
              @focus="type_select='COMPTE'"
            >
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section v-if="scope.opt">
                    <q-item-label>
                      <span
                        v-if="!!scope.opt.devise"
                        class="semi-bold"
                      >{{scope.opt.indice}}-</span>

                      <span
                        v-if="!!scope.opt.devise"
                        class="text-primary semi-bold"
                      >{{scope.opt.devise}}-</span>

                      {{scope.opt.intitule}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
              <template #no-option>
                <q-item>
                  <q-item-section class="text-red">
                    Aucun compte trouvé
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
              label="Compte en contre-partie"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.compte_cp"
              :options="comptes"
              :option-value="opt => opt"
              :option-label="opt => !!opt? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
              @filter="filterComptes"
              @input="getDatas()"
              @focus="type_select='COMPTE-CP'"
            >
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section v-if="scope.opt">
                    <q-item-label>
                      <span
                        v-if="!!scope.opt.devise"
                        class="semi-bold"
                      >{{scope.opt.indice}}-</span>

                      <span
                        v-if="!!scope.opt.devise"
                        class="text-primary semi-bold"
                      >{{scope.opt.devise}}-</span>

                      {{scope.opt.intitule}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
              <template #no-option>
                <q-item>
                  <q-item-section class="text-red">
                    Aucun compte trouvé
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

        </div>
      </div>

      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary">

            <q-separator v-if="!!searchOperation" />
            <search-result :search="searchOperation" />
            <q-separator />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped  table-colored-head">
                <thead>
                  <tr>
                    <th style="width:50px">CODE</th>
                    <th>DATE</th>
                    <th>PIECE</th>
                    <th class="text-left">COMPTE</th>
                    <th
                      style="width:22%"
                      class="text-left"
                    >LIBELLE</th>
                    <th class="text-center">DEBIT</th>
                    <th class="text-center">CREDIT</th>
                    <th class="text-center">SOLDE</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr>
                    <td
                      colspan="7"
                      class="text-blue bg-blue-1 text-bold text-left"
                    >REPPORT</td>
                    <td class="text-center text-blue bg-blue-1 text-bold">{{$helper.formatMoney(data.repport.montant)}} S{{data.repport.solde}}</td>
                  </tr>
                  <tr
                    v-for="(row,index) in data.operations"
                    :key="index"
                    :class="`text-center ${row.status == 'ANNULE' ? 'text-red' : ''}`"
                    @dblclick="selectedOperation = row; showDlgDetails= true"
                  >
                    <td>{{row.id}}</td>
                    <td>{{row.date_str}}</td>
                    <td>{{row.piece || '---'}}</td>
                    <td class="text-left relative-position cell-cmpt">
                      {{row.contre_partie}}
                      <q-btn
                        id="btn-copy"
                        color="blue-1"
                        text-color="primary"
                        icon="las la-copy"
                        unelevated
                        round
                        size="sm"
                        @click="$helper.copy(row.contre_partie)"
                      >
                        <q-tooltip>
                          Copier le numéro de compte
                        </q-tooltip>
                      </q-btn>
                    </td>
                    <td class="text-left">
                      {{row.libelle | short_libelle}}
                      <q-tooltip content-class="tooltip-style">
                        {{row.libelle}}
                      </q-tooltip>
                    </td>
                    <td class="text-bold">{{row.operation == 'D' ? $helper.formatMoney(row.montant) : '----'}}</td>
                    <td class="text-bold">{{row.operation == 'C' ? $helper.formatMoney(row.montant) : '----'}}</td>
                    <td :class="`text-bold ${row.solde < 0 ?'bg-red-1 text-red':'bg-blue-1 text-primary'}`">{{$helper.formatMoney(row.solde)}}</td>

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
                          @click="selectedOperation = row; showDlgDetails= true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher les détails de l'opération</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>

                  </tr>

                  <template v-if="loading && data.operations.length === 0">
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

                  <template v-if="!loading && data.operations.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="8">
                        <nondata
                          v-if="!loading"
                          :title="_messageTableau"
                          btnLabel="Actualiser la liste"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>

                  <tr>
                    <td
                      :style="$helper.cellEmptyImg"
                      colspan="5"
                      class="text-bold"
                    >TOTAL GENERAL</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(data.debit)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(data.credit)}}</td>
                    <td class="text-center bg-blue-1 text-blue text-bold">{{$helper.formatMoney(data.solde)}}</td>

                  </tr>
                </tbody>

              </table>
            </div>
            <linearLoading :loading="loading && data && data.operations.length >= 5" />

          </div>
        </div>
      </div>
    </div>

    <search
      v-model="showDialogSearch"
      :search="searchOperation"
      @onSearch="e => {searchOperation = e;this.getDatas()}"
      :filters="[
        { value: 'operation.id', label: 'Par code opération' },
        { value: 'operation.piece', label: 'Par numéro de la pièce' },
        { value: 'operation.initiateur', label: 'Par non du déposant ou bénéficiare' },

      ]"
    />

    <filterByDate
      v-model="showDialogDate"
      :label="`A partir du ${this.user.exercice.date_jour}`"
      :filter="filter"
      :dateMin="dateMin"
      :dateMax="dateMax"
      @onSelected="(e)=>{this.filter= e.filter;this.dateMin =e.min;this.dateMax=e.max;this.getDatas()}"
    />

    <detailsOperation
      v-model="showDlgDetails"
      :selectedOperation="selectedOperation"
      :user="user"
    />
  </q-page>
</template>
<script>
import detailsOperation from '../../../../../commun/details_operation.vue'

export default {
  name: 'journalOperation',
  data () {
    return {
      URLS: {},
      user: {},
      loading: false,

      searchOperation: '',
      showDialogSearch: false,
      showDialogDate: false,
      showDlgDetails: false,

      filter: null, // from,between
      dateMax: null,
      dateMin: null,

      filterListe: null,
      selectedOperation: null,

      data: null,

      defaultValues: {
        filters: {
          devise: 'CDF',
          compte: null,
          compte_cp: { id: 'ALL', indice: 'ALL', intitule: 'Tous les comptes' }
        },
        data: {
          repport: {},
          operations: [],
          debit: 0,
          credit: 0,
          solde: 0
        }
      },
      comptes: [],
      type_select: 'COMPTE'

    }
  },
  props: {
    entreprise: {},
    selectedCompte: null
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.data = this.defaultValues.data
    this.filterListe = { ...this.defaultValues.filters }
    this.filterListe.devise = this.user.devise

    if (this.selectedCompte != null) {
      this.filterListe.devise = this.selectedCompte.devise
      this.filterListe.compte = this.selectedCompte
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
  filters: {
    short_libelle (v) {
      return v ? (v.length > 35 ? v.substring(0, 35) + '...' : v) : v
    }
  },
  watch: {},
  components: {
    detailsOperation
  },
  computed: {
    _messageTableau () {
      if (this.filterListe.compte != null && this.filterListe.compte_cp != null) {
        if (!this.dateMin || this.dateMin === null) {
          return `Aucune opération trouvé pour l'intervalle des dates renseignées`
        } else {
          return 'Aucun resultat trouvé pour la (les) date(s) sélectionnée(s)'
        }
      } else {
        return 'Sélectionner un compte pour lequel vous souhaitez tirer les relevés'
      }
    }
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
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.filterListe.devise,
        signe_length: '>=',
        with_length: '14',
        id_entreprise: this.type_select === 'COMPTE'
          ? (this.entreprise ? this.entreprise.id : null)
          : null
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = (this.type_select === 'COMPTE')
            ? infos.data.records
            : [...[this.defaultValues.filters.compte_cp], ...infos.data.records]
        })
      }).catch(() => {
        update(() => {
          this.comptes = (this.type_select === 'COMPTE')
            ? []
            : [this.defaultValues.filters.compte_cp]
        })
      })
    },

    onDeviseSelected (e) {
      if (e) {
        this.$vue.set(this.filterListe, 'compte', null)
        this.$vue.set(this.filterListe, 'compte_cp', this.defaultValues.filters.compte_cp)

        this.data = this.defaultValues.data
      }
    },
    getDatas () {
      if (this.$helper.isNotEmpty(this.filterListe.devise) &&
        this.$helper.isNotEmpty(this.filterListe.compte_cp) &&
        this.$helper.isNotEmpty(this.filterListe.compte)) {
        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte: this.filterListe.compte.id,
          indice_cp: this.filterListe.compte_cp.indice,
          indice_pr: null,
          status: 'NOT_ANNULE',
          devise: this.filterListe.devise,
          date_min: !!this.dateMin && this.dateMin !== null
            ? this.dateMin
            : this.user.exercice.date_jour,
          date_max: this.dateMax,
          search: this.searchOperation
        })

        this.loading = true

        const url = `${this.URLS.BASE_URL}/Compte/getGrandLivre`

        this.$axios
          .post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.loading = false

            if (infos.data.erreur === false && infos.data.records) {
              this.data = infos.data.records
            } else {
              this.$helper.showMessage(infos.data.message)
              this.data = this.defaultValues.data
            }
          }).catch(() => {
            this.loading = false
            this.data = this.defaultValues.data

            this.$helper.showMessage()
          })
      }
    },
    annulerOperation (operation) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'Annulation en cours...',
          message: `Souhaitez-vous vraiment annuler cette opération ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            id_operation: operation.id_operation,
            status: 'INACTIF'
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Operation/setStatus/`

          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1)
                this.getDatas()
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

    exportDatas () {

    }

  }

}
</script>
<style>
#btn-copy {
  position: absolute;
  right: 5px;
  top: 5px;
  display: none;
}

.cell-cmpt:hover #btn-copy {
  display: block;
}
</style>
