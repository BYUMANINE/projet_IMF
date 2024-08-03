<template>
  <q-page style="min-height:0">
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        flat
        bordered
        :style="`width: ${selectedImprimable && selectedImprimable.width ?selectedImprimable.width : '900px' }; max-width: 95vw;`"
      >
        <q-card-section class="q-pa-none ">
          <div class="row q-col-gutter-sm panel-primary q-px-md q-py-sm items-center">

            <div class="col">
              <div class="text-h6"><q-icon name="las la-filter" />
                Filtres</div>
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                icon="las la-broom"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="viderChamps()"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                label="Exporter la liste"
                icon="img:statics/images/icone/office.png"
                icon-right="las la-angle-down"
                unelevated
                rounded
                size="12px"
                no-caps
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
                      v-ripple
                      v-close-popup
                      @click="selectedTypePrint='html';$refs.myForm.validate().then(onSubmit)"
                    >
                      <q-item-section
                        avatar
                        class="relative-position"
                      >
                        <q-img
                          src="statics/images/icone/cloud.png"
                          spinner-color="blue"
                          style="height: 30px; max-width: 30px"
                          spinner-size="20px"
                          transition="scale"
                        />
                      </q-item-section>
                      <q-item-section>Prévisualiser avant exportation</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="selectedTypePrint='excel';$refs.myForm.validate().then(onSubmit)"
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
                      <q-item-section>Exporter sous format excel</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="selectedTypePrint='word';$refs.myForm.validate().then(onSubmit)"
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
                      <q-item-section>Exporter sous format word</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                icon="close"
                round
                size="sm"
                v-close-popup
                unelevated
              />
            </div>
          </div>
          <linearLoading :loading="loading" />
          <q-separator />
          <q-form
            ref="myForm"
            v-if="selectedImprimable"
            class="scroll "
            style="max-height:75vh"
          >
            <filtresPaiementAdhesion
              v-model="filtre"
              v-if="selectedImprimable.value=='PAIEMENT_FRAIS'"
            />
            <filtresAdherants
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_ADHERANTS'"
            />
            <filtreJournal
              v-model="filtre"
              v-else-if="selectedImprimable.value=='JOURNAL'"
            />
            <filtersGrandLivre
              v-model="filtre"
              v-else-if="selectedImprimable.value=='GRAND_LIVRE'"
            />
            <filterBalanceGenerale
              v-model="filtre"
              v-else-if="selectedImprimable.value=='BALANCE_GENERALE'"
            />

            <filtersJournalCaisse
              v-model="filtre"
              v-else-if="selectedImprimable.value=='JOURNAL_CAISSE'"
            />
            <filtersTransfertCaisse
              v-model="filtre"
              v-else-if="selectedImprimable.value=='TRANSFERT_CAISSE'"
            />
            <filterCompteGele
              v-model="filtre"
              v-else-if="selectedImprimable.value=='COMPTE_GELE'"
            />
            <filtersReleveCompte
              v-model="filtre"
              v-else-if="selectedImprimable.value=='RELEVE_COMPTE_EPARGNE'"
            />
            <filtersEncoursEpargne
              v-model="filtre"
              v-else-if="selectedImprimable.value=='ENCOURS_EPARGNE'"
            />
            <filtersConcentrationEpargne
              v-model="filtre"
              v-else-if="selectedImprimable.value=='CONCENTRATION_EPARGNE'"
            />

            <filtersDarsListe
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_DARS'"
            />
            <filtersEcheancesRateesDars
              v-model="filtre"
              v-else-if="selectedImprimable.value=='ECHEANCES_RATEES_DARS'"
            />
            <filterDatListe
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_DAT'"
            />
            <filterInteretDat
              v-model="filtre"
              v-else-if="selectedImprimable.value=='INTERET_DAT'"
            />
            <filterCarnetListe
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_CARNET'"
            />
            <filterMembreEac
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_MEMBRE_EAC'"
            />
            <filterCollecteurListe
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_COLLECTEUR'"
            />
            <filterCommissionEac
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_COMMISSION_EAC'"
            />
            <filterEcheancesRateesEac
              v-model="filtre"
              v-else-if="selectedImprimable.value=='ECHEANCE_RATEES_EAC'"
            />
            <filtrePlanningEcheanceEac
              v-model="filtre"
              v-else-if="selectedImprimable.value=='ECHEANCE_PLANING_EAC'"
            />
            <filterListeDemandesCredit
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_DEMANDE_CREDIT'"
            />
            <filterListeSuiviCredit
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_SUIVI_CREDITS'"
            />
            <filterBalanceAgee
              v-model="filtre"
              v-else-if="selectedImprimable.value=='BALANCE_AGEE'"
            />

            <filterListeRemboursementCredit
              v-model="filtre"
              v-else-if="selectedImprimable.value=='LISTE_REMBOURSEMENT_CREDITS'"
            />
            <filterPlanningRemboursement
              v-model="filtre"
              v-else-if="selectedImprimable.value=='PLANNING_REMBOURSEMENT'"
            />

            <filterListeChequiers
              v-model="filtre"
              v-else-if="selectedImprimable.value=='CHEQUIER'"
            />

            <div
              v-else
              class="q-px-md q-py-xl text-center"
            >
              <q-img
                src="statics/images/icone/cloud.png"
                spinner-color="white"
                spinner-size="15px"
                style="height: 100px; max-width: 100px"
              /> <br>
              <span class="text-bold">Rapport [ {{selectedImprimable.label}} ] en cours de developpement...</span>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
    />
  </q-page>
</template>
<script>

import filtresPaiementAdhesion from './adhesion/paiement_frais/dialog_filters_frais.vue'
import filtresAdherants from './adhesion/rapport_sur_adhesion/filters_adherants.vue'

import filtreJournal from './comptabilite/filters_journal_operations.vue'
import filtersGrandLivre from './comptabilite/filters_grand_livre.vue'
import filterBalanceGenerale from './comptabilite/filters_balance_generale.vue'

import filtersJournalCaisse from './caisse/filters_journal_caisse.vue'
import filtersTransfertCaisse from './caisse/filters_transfert_caisse.vue'

import filtersReleveCompte from './epargne/filters_releve_compte.vue'
import filterCompteGele from './epargne/filters_compte_gele.vue'
import filtersConcentrationEpargne from './epargne/filters_concetraction_epargne.vue'
import filtersEncoursEpargne from './epargne/filters_encours_epargne.vue'

import filtersDarsListe from './dars/filters_dars.vue'
import filtersEcheancesRateesDars from './dars/filters_echeances_ratees_dars.vue'

import filterDatListe from './dat/filters_dat.vue'

import filterCarnetListe from './eac/filters_carnet.vue'
import filterMembreEac from './eac/filters_membre_eac.vue'
import filterCollecteurListe from './eac/filters_collecteur.vue'
import filterCommissionEac from './eac/filters_commission_eac.vue'
import filterEcheancesRateesEac from './eac/filters_echeances_ratees_carnet.vue'
import filtrePlanningEcheanceEac from './eac/filters_planning_echeances_eac.vue'

import filterInteretDat from './dat/filters_interet_dat.vue'

import filterListeDemandesCredit from './credit/filters_liste_demande.vue'
import filterListeSuiviCredit from './credit/filters_liste_suivi_demande.vue'
import filterListeRemboursementCredit from './credit/filters_remboursement_credit.vue'
import filterBalanceAgee from './credit/filters_balance_agee.vue'
import filterPlanningRemboursement from './credit/filters_planning_remboursement_credit.vue'

import filterListeChequiers from './chequier/filters_chequier.vue'

export default {
  name: 'rapports',
  data () {
    return {
      URLS: {},
      user: {},
      filtre: {},
      loading: false,
      selectedTypePrint: 'excel',

      showDlgPreview: false,
      document: null
    }
  },
  props: {
    value: Boolean,
    selectedImprimable: null
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () { },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.filtre = {}
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  components: {
    filtresPaiementAdhesion,
    filtresAdherants,
    filtreJournal,
    filtersGrandLivre,
    filterBalanceGenerale,
    filtersJournalCaisse,
    filtersTransfertCaisse,
    filtersReleveCompte,
    filterCompteGele,
    filtersEncoursEpargne,
    filtersConcentrationEpargne,
    filtersDarsListe,
    filtersEcheancesRateesDars,
    filterDatListe,
    filterInteretDat,
    filterCarnetListe,
    filterMembreEac,
    filterCollecteurListe,
    filterCommissionEac,
    filterEcheancesRateesEac,
    filtrePlanningEcheanceEac,
    filterListeDemandesCredit,
    filterListeSuiviCredit,
    filterListeRemboursementCredit,
    filterPlanningRemboursement,
    filterListeChequiers,
    filterBalanceAgee
  },
  methods: {
    onSubmit (isOk) {
      if (!isOk) return

      let donnees = JSON.stringify({
        ...this.filtre,
        type: this.selectedTypePrint,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        rapport: this.selectedImprimable.value,
        entete: { ...this.user, view: this.selectedImprimable.content }
      })

      let subUrl = this.selectedImprimable.url || 'Rapport/exportRapport/'

      let urlStr = `${this.URLS.BASE_URL}/${subUrl}`
      const ext = this.selectedTypePrint === 'excel' ? '.xls' : (this.selectedTypePrint === 'word' ? '.doc' : '.html')
      const filename = `${this.selectedImprimable.value}-${this.$helper.now('', true)}${ext}`
      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        if (this.selectedTypePrint !== 'html') {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))

          this.document = {
            url,
            name: this.selectedImprimable.label.toUpperCase()
          }
          this.showDlgPreview = true
        }

        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },
    viderChamps () {
      this.filtre = {}
      this.$refs.myForm.resetValidation()
    }

  }
}
</script>
<style lang="stylus"></style>
