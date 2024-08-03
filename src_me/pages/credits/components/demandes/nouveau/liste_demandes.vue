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
        text="Nouvelle demande"
        icon="add.png"
      >
        <q-menu
          touch-position
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px">

            <q-item
              clickable
              v-close-popup
              @click="showDlgIndividuelle=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section avatar><q-icon name="las la-user" />
              </q-item-section>
              <q-item-section>Demande pour un individu</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              v-close-popup
              @click="showDlgGroupe=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section avatar><q-icon name="las la-users" />
              </q-item-section>
              <q-item-section>Demande pour un groupe</q-item-section>
              <q-item-section side><q-icon
                  name="las la-angle-right"
                  size="18px"
                />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="showDlgEntreprise=true;isAdd=true;selectedDemande=null"
            >
              <q-item-section avatar><q-icon name="las la-building" />
              </q-item-section>
              <q-item-section>Demande pour une entreprise</q-item-section>
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
                    <th>CODE</th>
                    <th>ETAT</th>
                    <th class="text-left">PRODUIT</th>
                    <th class="text-left">CLIENT</th>
                    <th class="text-left">GESTIONNAIRE</th>
                    <th class="text-center">MONTANT</th>
                    <th class="text-center">ECHEANCE</th>
                    <th class="text-center">TAUX INTERET</th>
                    <th class="text-center">DATE RECEPTION</th>
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
                    <td class="text-bold text-center">{{ row.code }}</td>
                    <td class="text-center">
                      <q-badge
                        :color="row.status ==='ENCOURS' ? 'blue-2 text-blue':(row.status === 'TERMINE' ? 'green-2 text-green':'red-2 text-red')"
                        text-color="black"
                        :label="row.status"
                        class="text-bold"
                        style="padding:5px 5px"
                      />
                    </td>
                    <td class="text-bold bg-blue-1">{{ row.produit_str }}</td>
                    <td class="text-bold bg-blue-1">{{row.client_str }}</td>
                    <td class="tex-left">{{row.gestionnaire_str || 'Non défini' }}</td>
                    <td class="text-center">{{ row.montant_sollicite + ' '+  row.devise}}</td>
                    <td class="text-center">{{ row.nombre_echeance }} Mois</td>
                    <td class="text-center">{{ row.taux_interet }} %</td>
                    <td class="text-center">{{ $helper.dateBien(row.date_reception,false) }}</td>
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
                          @click="updateOrDetails(row,)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="edit"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Mise à jour de la demande</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedDemande=row;showDlgGestionnaire= true;"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="las la-stream"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Changer le gestionnaire</q-item-section>
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
                          <q-item-section>Annuler la demande de crédit</q-item-section>
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
                        v-for="item2 in 11"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length === 0">
                    <tr class="panel-primary">
                      <td :colspan="11">
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
              idPagination="paginationDemandec"
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

    <demandeIndividuelle
      v-model="showDlgIndividuelle"
      :selectedDemande="selectedDemande"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <demandeGroupe
      v-model="showDlgGroupe"
      :selectedDemande="selectedDemande"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <demandeEntreprise
      v-model="showDlgEntreprise"
      :selectedDemande="selectedDemande"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <changerGestionnaire
      v-model="showDlgGestionnaire "
      :selectedDemande="selectedDemande"
      @onFinish="getDatas()"
    />

  </q-page>
</template>
<script>
import dialogFilters from './dialog_filters.vue'
import demandeIndividuelle from './nouveau/demande_individuelle.vue'
import demandeGroupe from './nouveau/demande_groupe.vue'
import demandeEntreprise from './nouveau/demande_entreprise.vue'
import changerGestionnaire from './nouveau/changer_gestionnaire.vue'

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
      showDlgIndividuelle: false,
      showDlgGroupe: false,
      showDlgEntreprise: false,
      showDlgGestionnaire: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedDemande: null,
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
    dialogFilters,
    demandeIndividuelle,
    demandeGroupe,
    demandeEntreprise,
    changerGestionnaire
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

      url = url || `${this.URLS.BASE_URL}/Demande_credit/getAllDemandeCredits`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationDemandec')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationDemandec a').forEach(el => {
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
          let el = document.querySelector('.paginationDemandec')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
    },
    updateOrDetails (row, type = 'UPDATE') {
      const donnees = JSON.stringify({
        ...row
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Demande_credit/getDetailsDemandeCredit/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.selectedDemande = {
              ...row,
              ...infos.data.records
            }

            this.isAdd = false

            if (row.type === 'MEMBRE') {
              this.showDlgIndividuelle = true
            } else if (row.type === 'GROUPE') {
              this.showDlgGroupe = true
            } else if (row.type === 'ENTREPRISE') {
              this.showDlgEntreprise = true
            }
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
        let url = `${this.URLS.BASE_URL}/Demande_credit/delete/`

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
