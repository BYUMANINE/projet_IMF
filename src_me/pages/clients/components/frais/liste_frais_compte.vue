
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
        text="Paiement par prelevement"
        icon="newCompte.png"
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
              @click="showDlgFrAdhesion=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section>Paiement frais d'adhesion</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgFrOuvert=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section>Paiement frais d'ouverture de compte</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgFrTenu=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section>Paiement frais de tenu de compte</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgFrPart=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section>Achat part sociale</q-item-section>
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
            <q-separator v-if="!!searchOperation" />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CODE</th>
                    <th class="text-left">CLIENT</th>
                    <th class="text-center">TYPE</th>
                    <th class="text-center">NB</th>
                    <th class="text-right">MONTANT</th>
                    <th class="text-center">OPERATION</th>
                    <th class="text-left">DATE</th>
                    <th class="text-left">AGENT</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in data"
                    :key="index"
                    @dblclick="showDetailsOperation({id_operation:row.fk_operation})"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-bold text-center">{{ row.folio }}</td>
                    <td class="text-left">{{row.client_str}}</td>
                    <td class="text-center">{{ row.type }}</td>
                    <td class="text-center">{{ row.nombre_part || '---' }}</td>
                    <td class="text-right">{{$helper.formatMoney(row.montant) }} {{row.devise}}</td>
                    <td class="text-center">{{row.fk_operation || 'N/A' }}</td>
                    <td class="text-left">{{$helper.dateBien(row.created_at) }}</td>
                    <td class="text-left">{{row.agent_str }}</td>

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
                          @click="showDetailsOperation({id_operation:row.fk_operation})"
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
                          @click="annulerPaiement(row)"
                          v-close-popup
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Annuler ce frais</q-item-section>
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
                        v-for="item2 in 9"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="9">
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
              idPagination="paginationFrais"
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
        {value:'adhesion_frais.id|%%',label:'Par code paiement'},
        {value:'membre.nom_complet|%%',label:'Par nom de l\'adherent',is_checked:false},
        {value:'membre.folio|%%',label:'Par code adherent',is_checked:false},
        {value:'adhesion_frais.type|%%',label:'Par type adhesion',is_checked:false},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouveauFraisOuverture
      v-model="showDlgFrOuvert"
      :selectedFrais="selectedFrais"
      @onFinish="getDatas()"
    />

    <nouveauFraisPartSociale
      v-model="showDlgFrPart"
      :selectedFrais="selectedFrais"
      @onFinish="getDatas()"
    />

    <nouveauFraisTenuCompte
      v-model="showDlgFrTenu"
      :selectedFrais="selectedFrais"
      @onFinish="getDatas()"
    />

    <nouveauFraisAdhesion
      v-model="showDlgFrAdhesion"
      :selectedFrais="selectedFrais"
      @onFinish="getDatas()"
    />

    <dialogFilters
      v-model="showDlgFilters"
      :oldFilters="filterListe.filtres_avances"
      @onFinish="e=>{filterListe.filtres_avances=e;getDatas()}"
    />

    <detailsOperation
      v-model="showDlgDetails"
      :selectedOperation="selectedFrais"
      :user="user"
    />
  </q-page>
</template>
<script>
import nouveauFraisOuverture from './nouveau/nouveau_frais_ouverture.vue'
import nouveauFraisPartSociale from './nouveau/nouveau_frais_ps.vue'
import nouveauFraisTenuCompte from './nouveau/nouveau_frais_tenu.vue'
import nouveauFraisAdhesion from './nouveau/nouveau_frais_adhesion.vue'
import dialogFilters from './dialog_filters.vue'
import detailsOperation from '../../../commun/details_operation.vue'

export default {
  name: 'listeFraisCompte',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,

      showDlgFrAdhesion: false,
      showDlgFrOuvert: false,
      showDlgFrTenu: false,
      showDlgFrPart: false,
      showDlgDetails: false,

      showDlgFilters: false,
      isAdd: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedFrais: null,
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
    nouveauFraisOuverture,
    nouveauFraisPartSociale,
    nouveauFraisTenuCompte,
    nouveauFraisAdhesion,
    detailsOperation
  },
  computed: {

  },
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
    showDetailsOperation (row) {
      if (row.id_operation) {
        row.id = row.id_operation
        this.selectedFrais = row
        this.showDlgDetails = true
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

      url = url || `${this.URLS.BASE_URL}/Frais_adhesion/getAllPaiementsFrais`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationFrais')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationFrais a').forEach(el => {
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
          let el = document.querySelector('.paginationFrais')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    annulerPaiement (row) {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: "En cours d'exécution...",
          message: `Souhaitez-vous annuler cet carnet ? <br/><br/> Cette action est irréversible, une fois appliquée, vous ne pouvez plus revenir en arrière. <br/><br/> <b>Continuer quand même ?</b>`,
          cancel: 'Non',
          html: true,
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
          let url = `${this.URLS.BASE_URL}/Frais_adhesion/delete/`

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
<style lang="stylus"></style>
