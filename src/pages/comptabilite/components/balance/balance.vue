<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">

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
      <grandTitre
        height="35px"
        spacing="35"
        size="15px"
      >
        <template #titre>
          BALANCE GENERALE DES COMPTES
        </template>
      </grandTitre>
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
              label="Filtre par compte"
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
            >
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
              dense
              v-model="filterListe.groupe_indice"
              rounded
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              outlined
              :options="groupes_indices"
              label="Grouper par type comptes"
              @input="getDatas()"
            />
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
                    <th
                      rowspan="2"
                      class="text-center"
                    >#</th>
                    <th
                      rowspan="2"
                      class="text-left"
                    >COMPTE</th>
                    <th
                      rowspan="2"
                      class="text-left "
                      style="width:25%"
                    >INTITULE</th>
                    <th
                      class="text-center"
                      colspan="2"
                    >SOLDE D'OUVERTURE</th>
                    <th
                      class="text-center"
                      colspan="2"
                    >MOUVEMENT</th>
                    <th
                      class="text-center"
                      colspan="2"
                    >SOLDE FINAL</th>
                  </tr>
                  <tr>
                    <th class="text-black bg-blue-1 text-right">DEBIT</th>
                    <th class="text-black bg-blue-1 text-right">CREDIT</th>
                    <th class="text-black bg-blue-1 text-right">DEBIT</th>
                    <th class="text-black bg-blue-1 text-right">CREDIT</th>
                    <th class="text-black bg-blue-1 text-right">DEBIT</th>
                    <th class="text-black bg-blue-1 text-right">CREDIT</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row,index) in data.operations"
                    :key="index"
                  >
                    <td class="text-center">{{index + 1}}</td>
                    <td class="text-left">{{row.indice}}</td>
                    <td class="text-left">{{row.intitule | short_libelle }}
                      <q-tooltip content-class="tooltip-style">
                        {{row.intitule}}
                      </q-tooltip>
                    </td>
                    <td class="text-right">{{ $helper.formatMoney(row.debit_ouv)}}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.credit_ouv)}}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.debit_mouv)}}</td>
                    <td class="text-right">{{ $helper.formatMoney(row.credit_mouv)}}</td>
                    <td class="text-right text-bold bg-blue-1 ">{{ $helper.formatMoney(row.final.solde === 'D' ? row.final.montant : 0)}}</td>
                    <td class="text-right text-bold bg-blue-1 ">{{ $helper.formatMoney(row.final.solde === 'C' ? row.final.montant : 0)}}</td>

                    <q-menu
                      touch-position
                      context-menu
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list style="min-width: 100px">
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="showGrandLivreOfCompte(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-table"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher le grand livre de ce compte</q-item-section>
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
                        v-for="item2 in 9"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.operations.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="9">
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
                      colspan="3"
                      class=" text-bold text-left"
                      :style="$helper.cellEmptyImg"
                    >TOTAL GENERAL</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.ouverture.debit)}}</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.ouverture.credit)}}</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.mouvement.debit)}}</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.mouvement.credit)}}</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.final.debit)}}</td>
                    <td class="text-blue bg-blue-1 text-bold text-right">{{ $helper.formatMoney(data.final.credit)}}</td>
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
        { value: 'compte.poste', label: 'Par position compte (Ex. Actif, Passif, Produit,...)' },

      ]"
    />

    <filterByDate
      v-model="showDialogDate"
      :label="`A partir du ${this.user.exercice.date_debut}`"
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
import detailsOperation from '../../../commun/details_operation.vue'

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
          status: null,
          compte: { id: 'ALL', indice: 'ALL', intitule: 'Tous les comptes' },
          groupe_indice: null
        },
        data: {
          operations: [],
          ouverture: {},
          mouvement: {},
          final: {}
        }
      },
      comptes: [],
      groupes_indices: [
        { value: 'ALL', label: 'Tous les comptes' },
        { value: 5, label: 'Comptes principaux' },
        { value: 14, label: 'Comptes auxiliaires' }
      ]
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.data = this.defaultValues.data
    this.filterListe = { ...this.defaultValues.filters }
    this.filterListe.groupe_indice = this.groupes_indices[0]
    this.filterListe.devise = this.user.devise
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
      return v ? (v.length > 30 ? v.substring(0, 30) + '...' : v) : v
    }
  },
  watch: {},
  components: {
    detailsOperation
  },
  computed: {
    _messageTableau () {
      if (this.filterListe.compte != null) {
        if (!this.dateMin || this.dateMin === null) {
          return "Aucune opération trouvée; Essayez d'actualiser la liste"
        } else {
          return 'Aucun resultat trouvé pour la (les) date(s) sélectionnée(s)'
        }
      } else {
        return "Sélectionner un compte ou sélectionner l'option tous les comptes"
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
        devise: this.filterListe.devise
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = [...[this.defaultValues.filters.compte], ...infos.data.records]
        })
      }).catch(() => {
        update(() => {
          this.comptes = [this.defaultValues.filters.compte]
        })
      })
    },
    onDeviseSelected (e) {
      if (e) {
        this.$vue.set(this.filterListe, 'compte', this.defaultValues.filters.compte)
        this.data = this.defaultValues.data

        this.getDatas()
      }
    },
    getDatas () {
      if (this.$helper.isNotEmpty(this.filterListe.devise) &&
        this.$helper.isNotEmpty(this.filterListe.groupe_indice) &&
        this.$helper.isNotEmpty(this.filterListe.compte)) {
        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          indice_cp: this.filterListe.compte.indice,
          groupe_indice: this.filterListe.groupe_indice.value,

          devise: this.filterListe.devise,
          date_min: !!this.dateMin && this.dateMin !== null
            ? this.dateMin
            : this.user.exercice.date_debut,
          date_max: this.dateMax,
          search: this.searchOperation
        })

        this.loading = true

        const url = `${this.URLS.BASE_URL}/Compte/getBalance`

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
    showGrandLivreOfCompte (row) {
      const donnees = JSON.stringify({
        id_compte: row.id
      })

      this.$q.loading.show()

      let url = `${this.URLS.BASE_URL}/Compte/getOneCompte/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false && infos.data.records) {
            this.$emit('onRedirect', {
              tab: '3',
              data: { compte: infos.data.records, devise: this.filterListe.devise }
            })
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
