 <template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 550px">
      <q-card-section>
        <div class="row">
          <div class="col">
            <div class="text-h6">{{title}}</div>
          </div>
          <div class="col-auto">
            <q-btn
              flat
              color="grey-2"
              text-color="blue"
              icon="close"
              size="sm"
              v-close-popup
              round
              class="bg-blue-1"
              :disable="loadingImport"
            />
          </div>
        </div>
      </q-card-section>
      <linearLoading :loading="loadingImport" />
      <q-separator />
      <q-form @submit="importeDatas">
        <q-card-section
          style="max-height: 400px"
          class="scroll q-pa-none"
          ref="downScroll"
          id="downScroll"
        >
          <div class="q-pa-md">
            <div v-if="!isImported">
              <input
                ref="fileImport"
                type="file"
                @change="onInputExcelFileChange"
                style="display:none"
                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              <q-field
                square
                outlined
                dense
                stack-label
                @click.native="chooseFile()"
              >
                <template v-slot:control>
                  <div
                    class="self-center full-width no-outline"
                    tabindex="0"
                  >{{isFileSelected? filename : 'Selectionner un fichier excel (xls, xlsx, csv)'}}</div>
                </template>
                <template v-slot:prepend>
                  <q-img
                    src="statics/images/icone/excel_lg.png"
                    spinner-color="white"
                    spinner-size="20px"
                    style="width:35px;height:35px"
                    contain
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isFileSelected
                                ?'las la-check':'las la-paperclip'"
                    :color="isFileSelected? 'primary':''"
                  />
                </template>
              </q-field>

              <q-checkbox
                class="q-mt-md"
                v-model="newImport.is_first_row_header"
                true-value="OUI"
                false-value="NON"
                label="La première ligne constitue l'entête ?"
              />
              <q-separator />
              <div class="row q-col-gutter-xs q-py-md q-px-sm">
                <div class="col-auto">
                  <q-icon
                    name="las la-download"
                    color="primary"
                    size="20px"
                  />
                </div>
                <div class="col">
                  <a
                    :href="urlModele"
                    :download="filenameModele"
                    class="text-bold text-primary q-pa-md btn-import"
                    style="text-decoration: none"
                  >Telecharger le modèle de fichier à remplir ?</a>
                </div>
              </div>

            </div>
          </div>
          <div v-if="isImported">
            <q-separator />
            <div class="row bg-grey-1 q-py-sm q-px-md">
              <div class="col">
                <div class="text-subtitle1 text-bold">
                  Résultats de l'importation
                </div>
              </div>
            </div>
            <q-separator />
            <div v-if="succes">
              <div class="text-subtitle1 text-bold q-pa-sm bg-green-1 text-green">
                Succès {{'[ ' + succes + ' ]'}}
              </div>
            </div>
            <div v-if="echecs.length > 0">
              <div class="text-subtitle1 text-bold q-pa-sm bg-red-1 text-red">
                Echecs {{'[ ' + echecs.length + ' ]'}}
              </div>
              <q-list separator>
                <q-item
                  v-for="(message,i) in echecs"
                  :key="i"
                  dense
                >
                  <q-item-section>
                    <q-item-label style="font-size:12px">{{message}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            v-if="!isImported"
            :disable="loadingImport || !isFileSelected"
            type="submit"
            color="blue-1"
            text-color="primary"
            unelevated
            rounded
            no-caps
            icon-right="las la-arrow-right"
          >
            Lancer l'importation
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'importeDatass',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgRisque: false,
      loadingImport: false,

      filename: null,
      newImport: {
        is_first_row_header: 'OUI'
      },
      succes: 0,
      echecs: []

    }
  },
  props: {
    value: Boolean,
    urlToSaveTo: String,
    urlModele: String,
    title: String,
    type: String,
    filenameModele: String,
    othersDatas: Object
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.newImport = {
          is_first_row_header: 'OUI'
        }
        this.succes = 0
        this.echecs = []
      }
    }
  },
  components: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    isImported () {
      return this.succes > 0 || this.echecs.length > 0
    },
    isFileSelected () {
      return this.newImport.file != null
    }

  },
  methods: {
    chooseFile () {
      this.$refs.fileImport.click()
    },
    onInputExcelFileChange (e) {
      this.filename = e.target.files[0].name

      const typeAtorise = ['xlsx', 'xls', 'csv']
      let typeFile = this.filename.split('.').pop().toLowerCase()

      if (typeAtorise.indexOf(typeFile) > -1) {
        let reader = new FileReader()
        reader.onload = e => {
          this.$vue.set(this.newImport, 'file', e.target.result)
          this.$vue.set(this.newImport, 'extension', typeFile)
        }
        reader.readAsDataURL(e.target.files[0])
      } else {
        this.$helper.showMessage(
          'Le format de fichier n\'est pas pris en charge'
        )
      }
    },
    importeDatas () {
      if (!this.isFileSelected) {
        this.$helper.showMessage(
          "Vous n'avez selectionné aucun fichier excel"
        )
        return
      }
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'Importation en cours...',
          message: `Souhaitez-vous vraiment lancer l'importation ?`,
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let data = {
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            fileBase64: this.newImport.file,
            extension: this.newImport.extension,
            is_first_row_header: this.newImport.is_first_row_header,
            type_import: this.type,
            ...this.othersDatas
          }

          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          this.loadingImport = true

          let url = `${this.URLS.BASE_URL}/${this.urlToSaveTo}`
          this.$axios
            .post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()
              this.loadingImport = false

              this.succes = infos.data.succes
              this.echecs = infos.data.echecs
            })
            .catch(e => {
              this.$q.loading.hide()
              this.loadingImport = false
              this.$helper.showMessage()
            })
        })
    }
  }
}
</script>

<style>
</style>
