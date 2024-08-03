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
          JOURNAL DES OPERATIONS
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

          <div class="col-1">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              outlined
              dense
              v-model="filterListe.devise"
              rounded
              fill-input
              hide-selected
              hide-bottom-space
              use-input
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
              @input="$vue.set(filterListe,'compte',defaultValues.filters.compte);getDatas()"
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
                    <q-item-label
                      caption
                      v-if="!!scope.opt.montant_min"
                    >
                      MIN : {{scope.opt.montant_min}} {{user.devise}} - MAX : {{scope.opt.montant_max}} {{user.devise}}
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
              label="Par compte"
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
              v-model="filterListe.piece"
              rounded
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              :options="optionsPieces"
              label="Par pièces"
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
            <div class="panel-primary  overflow-auto ">
              <table class="table head-bold table-colored-head">
                <thead>
                  <tr>
                    <th style="width:50px">CODE</th>
                    <th>DATE</th>
                    <th>PIECE</th>
                    <th>SENS</th>
                    <th class="text-left">COMPTE</th>
                    <th
                      style="width:25%"
                      class="text-left"
                    >LIBELLE</th>
                    <th class="text-right">DEBIT</th>
                    <th class="text-right">CREDIT</th>
                    <th class="text-center">AGENCE</th>
                    <th class="text-center">AGENT</th>
                  </tr>

                </thead>

                <tbody style="font-size:11.5px">
                  <template v-for="(tab,index0) in data.operations">
                    <tr
                      v-for="(row,index) in tab"
                      :key="index0+'OP'+index"
                      class="text-center"
                      @dblclick="selectedOperation = row; showDlgDetails= true"
                    >
                      <td
                        :rowspan="tab.length"
                        v-if="index ===0"
                        class="text-bold"
                      >{{row.id}}</td>
                      <td
                        :rowspan="tab.length"
                        v-if="index ===0"
                      >{{$helper.dateBien(row.created_at,false)}}</td>
                      <td
                        :rowspan="tab.length"
                        v-if="index ===0"
                      >{{row.piece || '---'}}</td>
                      <td class="text-center text-bold">{{ row.operation }}</td>
                      <td class="text-left">
                        {{ row.indice}}
                        <q-tooltip content-class="tooltip-style">
                          {{row.intitule}}
                        </q-tooltip>
                      </td>
                      <td
                        :rowspan="tab.length"
                        v-if="index ===0"
                        class="text-left"
                      >
                        {{row.libelle }}
                      </td>
                      <td class="text-bold bg-blue-1 text-right">{{row.operation == 'D' ? $helper.formatMoney(row.montant) : '0,00'}}</td>
                      <td class="text-bold bg-orange-1 text-right">{{row.operation == 'C' ? $helper.formatMoney(row.montant) : '0,00'}}</td>
                      <td>{{row.code_agence || 'Non définie'}}</td>
                      <td
                        :rowspan="tab.length"
                        v-if="index ===0"
                      >{{row.code_agent || 'Non défini'}}</td>

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

                        </q-list>
                      </q-menu>

                    </tr>
                  </template>
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
                          :title="_messageTableau"
                          btnLabel="Actualiser la liste"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>

                  <tr>
                    <td
                      colspan="5"
                      :style="$helper.cellEmptyImg"
                    ></td>
                    <td class="text-bold">TOTAL GENERAL</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(data.debit)}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(data.credit)}}</td>
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

    <joindreFichier
      v-model="showDlgJoindreFile"
      :selectedOperation="selectedOperation"
      :user="user"
      :URLS="URLS"
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

      filter: null, // from,between
      dateMax: null,
      dateMin: null,

      filterListe: null,
      selectedOperation: null,

      data: null,

      defaultValues: {
        filters: {
          devise: 'CDF',
          compte: { id: 'ALL', indice: 'ALL', intitule: 'Tous les comptes' },
          produit: { id: 'ALL', indice: 'ALL', designation: 'Tous les produits' },
          piece: null
        },
        data: {
          operations: [],
          debit: 0,
          credit: 0
        }
      },
      comptes: [],
      produits: [],

      optionsPieces: [
        { value: 'ALL', label: 'Toutes les opérations' },
        { value: 'WITH', label: 'Opérations avec numéro de pièce' },
        { value: 'WITHOUT', label: 'Opérations sans numéro de pièce' }
      ]

    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.data = this.defaultValues.data
    this.defaultValues.filters.piece = this.optionsPieces[0]

    this.filterListe = { ...this.defaultValues.filters }

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
      return v ? (v.length > 40 ? v.substring(0, 30) + '...' : v) : v
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
          return "Aucune opération enregistré à la date d'aujourd'hui"
        } else {
          return 'Aucun resultat trouvé pour la (les) date(s) sélectionnée(s)'
        }
      } else {
        return 'Sélectionner un compte pour lequel vous souhaitez tirer le grand livre'
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
        this.$vue.set(this.filterListe, 'compte', this.defaultValues.filters.compte)
        this.data = this.defaultValues.data

        this.getDatas()
      }
    },
    getDatas () {
      if (this.$helper.isNotEmpty(this.filterListe.devise) &&
        this.$helper.isNotEmpty(this.filterListe.compte) &&
        this.$helper.isNotEmpty(this.filterListe.produit) &&
        this.$helper.isNotEmpty(this.filterListe.piece)) {
        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          indice_cp: this.filterListe.compte.indice,
          indice_pr: this.filterListe.produit.indice,
          piece: this.filterListe.piece.value,

          devise: this.filterListe.devise,
          date_min: !!this.dateMin && this.dateMin !== null
            ? this.dateMin
            : this.user.exercice.date_jour,
          date_max: this.dateMax,
          search: this.searchOperation
        })

        this.loading = true

        const url = `${this.URLS.BASE_URL}/Compte/getJournal`

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
            id_operation: operation.id_operation
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
