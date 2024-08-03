<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">

      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="searchOperation='';getDatas();getSituationCaisse()"
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

      <menu-option
        text="Exporter"
        icon="office.png"
      >
        <q-menu
          touch-position
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-ripple
              v-close-popup
            >
              <q-item-section
                avatar
                class="relative-position"
              >
                <q-img
                  src="statics/images/icone/excel.png"
                  spinner-color="blue"
                  style="height: 30px; max-width: 30px"
                  spinner-size="20px"
                  transition="scale"
                />
              </q-item-section>
              <q-item-section>Exporter vers excel</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              v-ripple
              v-close-popup
            >
              <q-item-section
                avatar
                class="relative-position"
              >
                <q-img
                  src="statics/images/icone/word.png"
                  spinner-color="blue"
                  style="height: 30px; max-width: 30px"
                  spinner-size="20px"
                  transition="scale"
                />
              </q-item-section>
              <q-item-section>Exporter vers word</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </menu-option>

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
              label="Par caisse"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.caisse"
              :options="caisses"
              :option-value="opt => opt"
              :option-label="opt => `${opt.designation}`"
              @filter="filterCaisses"
              @input="getDatas()"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-red">
                    Aucun resultat trouvé
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
              label="Par produit (Epargne ou crédit)"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.produit"
              :options="produits"
              :option-value="opt => opt"
              :option-label="opt => !!opt ? `${opt.designation}` : ''"
              @filter="filterProduits"
              @input="getDatas()"
            >
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section v-if="scope.opt">
                    <q-item-label class="semi-bold">
                      {{scope.opt.designation}}
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
              label="Par compte en contre-partie"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.compte"
              :options="comptes"
              :option-value="opt => opt"
              :option-label="opt => !!opt? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
              @filter="filterComptes"
              @input="getDatas()"
            >
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
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
        <div class="col-12">
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
                    <th class="text-center">AGENCE</th>
                    <th class="text-center">AGENT</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr>
                    <td
                      colspan="7"
                      class="text-blue bg-blue-1 text-bold text-left"
                    >REPPORT</td>
                    <td class="text-center text-blue bg-blue-1 text-bold">{{$helper.formatMoney(data.repport.montant)}} S{{data.repport.solde}}</td>
                    <td
                      colspan="2"
                      class="text-center text-blue bg-blue-1 text-bold"
                    ></td>
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
                    <td class="text-left">{{row.contre_partie}}</td>
                    <td class="text-left">
                      {{row.libelle | short_libelle}}
                      <q-tooltip content-class="tooltip-style">
                        {{row.libelle}}
                      </q-tooltip>
                    </td>
                    <td class="text-bold">{{row.operation == 'D' ? $helper.formatMoney(row.montant) : '0,00'}}</td>
                    <td class="text-bold">{{row.operation == 'C' ? $helper.formatMoney(row.montant) : '0,00'}}</td>
                    <td :class="`text-bold ${row.solde < 0 ?'bg-red-1 text-red':'bg-blue-1 text-primary'}`">{{$helper.formatMoney(row.solde)}}</td>
                    <td>{{row.code_agence || 'Non défini'}}</td>
                    <td>{{row.code_agent || 'Non défini'}}</td>

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
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedOperation = row; showDlgJoindreFile= true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-paperclip"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Fichiers joints</q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="annulerOperation(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-times-circle"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Demander l'annulation de cette opération</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="imprimer({id_operation:row.id})"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-print"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Imprimer le bordereau</q-item-section>
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
                        v-for="item2 in 10"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.operations.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="10">
                        <nondata
                          v-if="!loading"
                          :title="!dateMin || dateMin === null ? 'Aucune opération enregistré à la date d\'aujourd\'hui' : 'Aucun resultat trouvé pour la (les) date(s) sélectionnée(s)'"
                          btnLabel="Actualiser la liste"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>

                  <tr>
                    <td
                      :style="$helper.cellEmptyImg"
                      colspan="4"
                    ></td>
                    <td class="text-bold">TOTAL GENERAL</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(data.debit)}}</td>
                    <td class="text-center text-bold">{{$helper.formatMoney(data.credit)}}</td>
                    <td class="text-center bg-blue-1 text-blue text-bold">{{$helper.formatMoney(data.solde)}}</td>
                    <td
                      colspan="2"
                      :style="$helper.cellEmptyImg"
                    ></td>
                  </tr>
                </tbody>

              </table>
            </div>
            <linearLoading :loading="loading && data && data.operations.length >= 5" />

          </div>
        </div>
      </div>
    </div>

    <div class="ba overflow-hidden q-mt-md">
      <table class="table  table-tiny">
        <tr>
          <td class="text-bold text-left bg-blue-1 text-blue relative-position">DISPONIBLE DANS <span class="text-blue">{{caisseName }}</span>
            <div style="position:absolute;bottom:0;left:0;right:0;">
              <linearLoading :loading="loadingSoldeDispo" />
            </div>
          </td>
          <td
            class="text-bold text-center bg-blue-1 text-blue"
            style="width:40px"
          >DEVISE</td>
          <td class="text-bold text-right bg-blue-1 text-blue">MONTANT</td>
          <td class="text-bold text-left bg-blue-1 text-blue">SOLDE</td>
        </tr>

        <!-- INITIAL -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >SOLDE INITIAL</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_initial.montant) : '0,00' }} </td>
          <td
            class="text-bold text-left"
            style="width:50px"
          >{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_initial.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_initial.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_initial.solde}` : 'SDC'}}</td>
        </tr>
        <!-- ENCAISSEMENTS -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >ENCAISSEMENTS</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_entrees.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_entrees.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_entrees.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_entrees.solde}` : 'SDC'}}</td>
        </tr>
        <!-- DECAISSEMENTS -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >DECAISSEMENTS</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse  ? $helper.formatMoney(soldeCaisse.cdf.solde_sorties.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_sorties.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse  ? $helper.formatMoney(soldeCaisse.usd.solde_sorties.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_sorties.solde}` : 'SDC'}}</td>
        </tr>
        <!-- SOLDE -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left text-blue bg-blue-1"
          >SOLDE ACTUEL</td>
          <td class="text-bold text-center bg-blue-1">CDF</td>
          <td class="text-bold text-right text-blue bg-blue-1">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_actuel.montant) : '0,00' }} </td>
          <td class="text-bold text-left text-blue bg-blue-1">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_actuel.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center bg-blue-1">USD</td>
          <td class="text-bold text-right text-blue bg-blue-1">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_actuel.montant) : '0,00' }} </td>
          <td class="text-bold text-left text-blue bg-blue-1">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_actuel.solde}` : 'SDC'}}</td>
        </tr>

      </table>
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
      label="Aujourd'hui"
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

    <joindreFichier
      v-model="showDlgJoindreFile"
      :selectedOperation="selectedOperation"
      :user="user"
      :URLS="URLS"
    />

    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
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
      showDlgJoindreFile: false,
      showDlgPreview: false,
      loadingSoldeDispo: true,

      filter: null, // from,between
      dateMax: null,
      dateMin: null,
      document: null,

      filterListe: null,
      selectedOperation: null,
      soldeCaisse: null,

      data: null,

      defaultValues: {
        filters: {
          devise: 'CDF',
          status: null,
          compte: { id: 'ALL', indice: 'ALL', intitule: 'Tous les comptes' },
          produit: { id: 'ALL', indice: 'ALL', designation: 'Tous les produits' },
          caisse: null
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
      caisses: [],
      produits: []

    }
  },
  props: [],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.data = this.defaultValues.data
    this.filterListe = { ...this.defaultValues.filters }

    this.filterListe.devise = this.user.devise
    this.filterListe.caisse = this.$helper.isNotEmpty(this.user.caisse) ? this.user.caisse[this.filterListe.devise.toLowerCase()] : null
  },
  mounted: function () {
    document.addEventListener('keydown', this.initialiseShortcut, false)

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.getDatas()
      this.getSituationCaisse()
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
    _caisseName () {
      return this.$helper.isNotEmpty(this.user.caisse) ? this.user.caisse.cdf.designation : 'AUCUNE CAISSE'
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
    filterCaisses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.filterListe.devise
      })

      let url = `${this.URLS.BASE_URL}/Caisse/searchCaisses`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.caisses = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.caisses = []
        })
      })
    },
    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Produit/searchProduits`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = [
            ...[this.defaultValues.filters.produit, { id: 'EAV', indice: '33000', designation: 'Epargne à vie' }],
            ...infos.data.records]
        })
      }).catch(() => {
        update(() => {
          this.produits = [this.defaultValues.filters.produit, { id: 'EAV', indice: '33000', designation: 'Epargne à vie' }]
        })
      })
    },
    onDeviseSelected (e) {
      if (e) {
        this.$vue.set(this.filterListe, 'caisse', null)
        this.$vue.set(this.filterListe, 'compte', this.defaultValues.filters.compte)

        this.data = this.defaultValues.data
      }
    },
    getSituationCaisse () {
      if (this.$helper.isNotEmpty(this.filterListe.caisse)) {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_caisse: this.filterListe.caisse.id_caisse
        })

        let url = `${this.URLS.BASE_URL}/Caisse/getSituationCaisse`

        this.loadingSoldeDispo = true

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loadingSoldeDispo = false
          if (infos.data.erreur === false) {
            this.soldeCaisse = null
            if (infos.data.records) {
              this.soldeCaisse = infos.data.records
            }
          }
        }).catch(() => {
          this.loadingSoldeDispo = false
          this.soldeCaisse = null
          this.$helper.showMessage()
        })
      }
    },
    getDatas () {
      if (this.$helper.isNotEmpty(this.filterListe.devise) &&
        this.$helper.isNotEmpty(this.filterListe.caisse) &&
        this.$helper.isNotEmpty(this.filterListe.produit) &&
        this.$helper.isNotEmpty(this.filterListe.compte)) {
        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte: this.filterListe.caisse.id_compte,
          indice_cp: this.filterListe.compte.indice,
          indice_pr: this.filterListe.produit.indice,
          devise: this.filterListe.devise,
          status: 'NOT_ANNULE',
          date_min: this.dateMin,
          date_max: this.dateMax,
          search: this.searchOperation
        })

        this.loading = true

        const url = `${this.URLS.BASE_URL}/Caisse/getJournalCaisse`

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
    imprimer (filtre, typePrint = 'html') {
      let donnees = JSON.stringify({
        ...filtre,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'html'
      })

      let urlStr = `${this.URLS.BASE_URL}/rapports/Rapport_caisse/exportBordereauDepotRetrait/`
      const ext = typePrint === 'excel' ? '.xls' : (typePrint === 'word' ? '.doc' : '.html')
      const filename = `borderau_caisse${ext}`

      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        if (typePrint !== 'html') {
          const url = window.URL.createObjectURL(new Blob([response.data]))

          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))
          // window.open(url, '', 'width=1200,height=800')
          this.document = {
            url,
            name: 'BORDEREAU'
          }

          this.showDlgPreview = true
        }

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
