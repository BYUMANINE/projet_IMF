<template>
  <q-page>
    <div
      class="ba overflow-hidden panel-primary q-pa-sm q-mt-sm"
      style="min-height:67vh"
    >
      <div class="row q-col-gutter-md">
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
          v-for="(row,index) in rapports"
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
                @click="afficherImport(row)"
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
                  <q-item-label>{{row.title}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>

    <importFichierExcel
      v-model="showDlgImport"
      :urlModele="selectedRapport ? selectedRapport.url_model :''"
      :urlToSaveTo="selectedRapport ? selectedRapport.url_save :''"
      :filenameModele="selectedRapport ? selectedRapport.filename_model :''"
      :title="selectedRapport ? selectedRapport.title :''"
      :type="selectedRapport ? selectedRapport.type :''"
      :othersDatas="{}"
    />
  </q-page>
</template>

<script>
import importFichierExcel from '../../../commun/import_fichier_excel.vue'

export default {
  data () {
    return {
      URLS: {},
      user: {},
      showDlgImport: false,

      rapports: [
        {
          title: 'Import adhérent individu',
          type: 'MEMBRE-INDIVIDUEL',
          filename_model: 'model_fichier_individus.xlsx',
          url_model: 'statics/excel/model_fichier_individus.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import adhérent groupe',
          type: 'MEMBRE-GROUPE',
          filename_model: 'model_fichier_groupes.xlsx',
          url_model: 'statics/excel/model_fichier_groupes.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import adhérent entreprise',
          type: 'MEMBRE-ENTREPRISE',
          filename_model: 'model_fichier_entreprises.xlsx',
          url_model: 'statics/excel/model_fichier_entreprises.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import soldes des comptes',
          type: 'SOLDES-COMPTES',
          filename_model: 'model_fichier_soldes.xlsx',
          url_model: 'statics/excel/model_fichier_soldes.xlsx',
          url_save: 'Importation/importFichier'
        },
        /* {
          title: 'Import situation EAV',
          type: 'EAV',
          filename_model: 'model_fichier_eav.xlsx',
          url_model: 'statics/excel/model_fichier_eav.xlsx',
          url_save: 'Importation/importFichier'
        }, */
        {
          title: 'Import situation des crédits',
          type: 'CREDIT',
          filename_model: 'model_fichier_credits.xlsx',
          url_model: 'statics/excel/model_fichier_credits.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import situation EAC',
          type: 'EAC',
          filename_model: 'model_fichier_eac.xlsx',
          url_model: 'statics/excel/model_fichier_eac.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import situation DAT',
          type: 'DAT',
          filename_model: 'model_fichier_dat.xlsx',
          url_model: 'statics/excel/model_fichier_dat.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import situation DARS',
          type: 'EAC',
          filename_model: 'model_fichier_dars.xlsx',
          url_model: 'statics/excel/model_fichier_dars.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import comptes principaux',
          type: 'COMPTE-P',
          filename_model: 'model_fichier_comptes_generaux.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_generaux.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import comptes auxiliaires',
          type: 'COMPTE-S',
          filename_model: 'model_fichier_comptes_auxiliaires.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_auxiliaires.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import photos et signatures',
          type: 'PHOTOS',
          filename_model: 'model_fichier_comptes_auxiliaires.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_auxiliaires.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import mandataires',
          type: 'MANDATAIRES',
          filename_model: 'model_fichier_comptes_auxiliaires.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_auxiliaires.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import heritiers',
          type: 'HERITIERS',
          filename_model: 'model_fichier_comptes_auxiliaires.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_auxiliaires.xlsx',
          url_save: 'Importation/importFichier'
        },
        {
          title: 'Import membres groupes',
          type: 'MEMBRES-G',
          filename_model: 'model_fichier_comptes_auxiliaires.xlsx',
          url_model: 'statics/excel/model_fichier_comptes_auxiliaires.xlsx',
          url_save: 'Importation/importFichier'
        }
      ],
      selectedRapport: null
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  components: {
    importFichierExcel
  },
  filters: {},
  computed: {},
  methods: {
    afficherImport (row) {
      this.showDlgImport = true
      this.selectedRapport = row
    }
  }
}
</script>

<style></style>
