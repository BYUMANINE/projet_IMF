<template>
  <q-page>

    <customerAppBar
      :option="`RAPPORTS`"
      :user="null"
      :selected="null"
    >
      <q-btn
        @click="drawer=!drawer"
        round
        dense
        icon="menu"
        text-color="primary"
        unelevated
        class="lt-md"
        size="md"
      />

    </customerAppBar>

    <div class="ba overflow-hidden panel-primary">
      <div class="row">
        <div class="gt-sm col-xs-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
          <q-list
            separator
            class="scroll"
            style="height:75vh"
          >
            <template v-for="(row,index) in rapports">
              <q-item
                :key="index"
                clickable
                v-ripple
                @click="selectedRapport = row"
                :class="selectedRapport.value === row.value?'bg-blue-1 text-primary':''"
              >
                <q-item-section>
                  <q-item-label class="text-bold">{{row.label}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    name="las la-angle-right"
                    size="15px"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
        <q-separator vertical />
        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
          <div class="q-pa-xs">
            <q-input
              square
              outlined
              dense
              hide-bottom-space
              v-model.trim="search"
              placeholder="Recherche"
            >

              <template #prepend>
                <q-icon name="search" />
              </template>
              <template
                #append
                v-if="!!search"
              >
                <q-btn
                  color="primary"
                  icon="close"
                  round
                  flat
                  size="sm"
                  @click="this.search=null"
                />
              </template>
            </q-input>
          </div>
          <q-separator />
          <div
            class="q-pa-md scroll"
            style="height:67vh"
          >
            <div class="row q-col-gutter-md">
              <div
                class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
                v-for="(row,index) in listeRapports"
                :key=" index"
              >
                <q-card
                  flat
                  bordered
                >
                  <q-card-section class="q-pa-none">
                    <q-item
                      clickable
                      v-ripple
                      @click="afficherFiltres(row)"
                    >
                      <q-item-section avatar>
                        <q-avatar
                          color="blue-1"
                          text-color="primary"
                          font-size="13px"
                          size="25px"
                        >
                          <strong>{{index +1}}</strong>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{row.label}}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
              </div>
              <div
                class="col-12"
                v-if="listeRapports.length ===0"
              >
                <div class="q-pa-xl">
                  <nondata
                    title="Aucun rapport trouvé"
                    :showBtn="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-drawer
      v-model="drawer"
      :width="300"
      show-if-above
      side="right"
      content-class="drawer-primary relative-position"
      v-if="$q.screen.lt.md"
    >
      <q-scroll-area class="fit relative-position">
        <q-list separator>
          <template v-for="(row,index) in rapports">
            <q-item
              :key="index"
              clickable
              v-ripple
              @click="selectedRapport = row;drawer=false;"
              :class="selectedRapport.value === row.value?'bg-blue-1 text-primary':''"
            >
              <q-item-section>
                <q-item-label class="text-bold">{{row.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

    </q-drawer>
    <filtresRapports
      v-model="showDlgFiltres"
      :selectedImprimable="selectedImprimable"
    />
  </q-page>
</template>

<script>
import filtresRapports from './filtres_rapports.vue'
export default {
  data () {
    return {
      URLS: {},
      user: {},
      showDlgFiltres: false,
      search: null,
      drawer: false,

      rapports: [
        {
          value: 'ADHESION',
          label: 'Adhesions',
          datas: [
            {
              url: null,
              value: 'LISTE_ADHERANTS',
              group: 'ADHESION',
              label: 'Rapport sur adhesion',
              content: '',
              width: '800px'
            },
            {
              url: null,
              value: 'PAIEMENT_FRAIS',
              group: 'ADHESION',
              label: 'Rapports sur paiement des frais',
              icon: 'operation.png',
              content: 'export_paiement_frais',
              width: '800px'
            }
          ]
        },
        {
          value: 'COMPTA',
          label: 'Comptabilité',
          datas: [
            {
              url: null,
              value: 'JOURNAL',
              group: 'COMPTABILITE',
              label: 'Journal des opérations',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'BALANCE_GENERALE',
              group: 'COMPTABILITE',
              label: 'Balance générale',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'GRAND_LIVRE',
              group: 'COMPTABILITE',
              label: 'Grand livre des comptes',
              icon: 'grand_livre.png',
              content: '',
              width: '700px'
            },
            {
              url: null,
              value: 'CHEQUIER',
              group: 'COMPTABILITE',
              label: 'Bilan',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CHEQUIER',
              group: 'COMPTABILITE',
              label: 'Tableau de resultat',
              icon: 'grand_livre.png',
              content: ''
            }
          ]
        },
        {
          value: 'EPARGNE',
          label: 'Epargnes',
          datas: [
            {
              url: null,
              group: 'EPARGNE',
              value: 'RELEVE_COMPTE_EPARGNE',
              label: 'Relevé de compte epargne',
              content: '',
              width: '750px'
            }, {
              url: null,
              group: 'EPARGNE',
              value: 'ENCOURS_EPARGNE',
              label: 'Encours des épargnes',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE',
              value: 'DAT',
              label: 'Compte d\'epargne cloturés',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE',
              value: 'CONCENTRATION_EPARGNE',
              label: 'Concentration des dêpôts des adhérents',
              content: '',
              width: '700px'
            },
            {
              url: null,
              group: 'EPARGNE',
              value: 'COMPTE_GELE',
              label: 'Situation des comptes gélés',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A REGIME SPECIAL',
              value: 'DAT',
              label: 'Interêts sur plan epargne',
              content: '',
              width: '750px'
            }, {
              url: null,
              group: 'EPARGNE A REGIME SPECIAL',
              value: 'LISTE_DARS',
              label: 'Rapport sur dépôt à regime special',
              content: '',
              width: '750px'
            }, {
              url: null,
              group: 'EPARGNE A REGIME SPECIAL',
              value: 'ECHEANCES_RATEES_DARS',
              label: 'Situation des echéances ratées',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'DEPOTS A TERME',
              value: 'LISTE_DAT',
              label: 'Rapport sur dêpôts à terme',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'DEPOTS A TERME',
              value: 'INTERET_DAT',
              label: 'Intêrêts sur dêpôts à terme',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'LISTE_CARNET',
              label: 'Liste des carnets',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'LISTE_MEMBRE_EAC',
              label: 'Liste des membres EAC',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'LISTE_COLLECTEUR',
              label: 'Liste des collecteurs',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'LISTE_COMMISSION_EAC',
              label: 'Situation des commissions sur EAC',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'ECHEANCE_RATEES_EAC',
              label: 'Echeances EAC ratées',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'ECHEANCE_PLANING_EAC',
              label: 'Planning des écheances EAC',
              content: '',
              width: '750px'
            },
            {
              url: null,
              group: 'EPARGNE A LA CARTE',
              value: 'DEPOT_EAC',
              label: 'Dépot de mise sur carnets',
              content: '',
              width: '750px'
            }

          ]
        },
        {
          value: 'CREDIT',
          label: 'Crédits',
          datas: [
            {
              url: null,
              value: 'LISTE_DEMANDE_CREDIT',
              group: 'CREDIT',
              label: 'Demande de crédit',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'LISTE_SUIVI_CREDITS',
              group: 'CREDIT',
              label: 'Suivis des crédits',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Crédits transferés en souffrance',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Crédits transferés en perte',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Situations des recouvrement des crédits transferés en perte',
              icon: 'grand_livre.png',
              content: ''
            },

            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Rapport sur les commission et frais sur crédit',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Recapitulatif des crédits soldés',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Situation des impayés',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Situation des intérets',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'LISTE_REMBOURSEMENT_CREDITS',
              group: 'CREDIT',
              label: 'Rapport des remboursements',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Rapport sur les penalités',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'PLANNING_REMBOURSEMENT',
              group: 'CREDIT',
              label: 'Planning de remboursement',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: 'rapports/Rapport_credit/getRapportBalanceAgee/',
              value: 'BALANCE_AGEE',
              group: 'CREDIT',
              label: 'Balance agée développée du portefeuille',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Resumé du portefeuille de credit',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CREDIT',
              group: 'CREDIT',
              label: 'Rapport de performence',
              icon: 'grand_livre.png',
              content: ''
            }
          ]
        },
        {
          value: 'CAISSE',
          label: 'Caisses',
          datas: [
            {
              url: null,
              value: 'JOURNAL_CAISSE',
              group: 'CAISSE',
              label: 'Journal de caisse',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'TRANSFERT_CAISSE',
              group: 'CAISSE',
              label: 'Rapport des transferts entre caisses',
              icon: 'grand_livre.png',
              content: ''
            },
            {
              url: null,
              value: 'CHEQUIER',
              group: 'CREDIT',
              label: 'Rapport sur arrêté de caisse',
              icon: 'grand_livre.png',
              content: ''
            }
          ]
        },
        {
          value: 'CHEQUIER',
          label: 'Chequiers',
          datas: [
            {
              url: null,
              value: 'CHEQUIER',
              group: 'CREDIT',
              label: 'Rapports des chequiers vendus',
              icon: 'grand_livre.png',
              content: ''
            }
          ]
        },
        {
          value: 'AUTRES',
          label: 'Autres rapports',
          datas: []
        }
      ],
      selectedRapport: null,
      selectedImprimable: null
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    this.selectedRapport = this.rapports[0]
  },
  components: {
    filtresRapports
  },
  filters: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 2) : ''
    }
  },
  computed: {
    listeRapports () {
      if (this.$helper.isEmpty(this.selectedRapport)) return []
      if (this.$helper.isEmpty(this.search)) {
        return this.selectedRapport.datas
      }
      return this.selectedRapport.datas.filter(row => row.label.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
    }
  },
  methods: {
    groupBy (data, property) {
      return data.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {})
    },
    onRedirect (option) {
      if (option) {
        this.selectedRapport = option
      }
    },
    afficherFiltres (row) {
      this.selectedImprimable = row
      if (!!row && row.value.length > 0) {
        this.showDlgFiltres = true
      } else {
        this.$helper.showMessage('Rapport pas encore prêt', 0, 'center')
      }
    }
  }
}
</script>

<style></style>
