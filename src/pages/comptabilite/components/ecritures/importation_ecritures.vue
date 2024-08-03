<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        :disable="isImported"
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="()=>{}"
      />

      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        :disable="isImported"
        text="Enregistrer l'opération"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(saveForm)"
      />

    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre
        height="60px"
        spacing="18"
        size="18px"
      >
        <template #titre>
          IMPORTATION ECRITURES COMPTABLES
        </template>
      </grandTitre>

      <div class="panel-primary">
        <div
          v-if="!isImported"
          class="row"
        >
          <div class="col-12">
            <q-form
              ref="myForm"
              class="q-pa-sm"
            >
              <div class="row q-col-gutter-md ">

                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** IMPORTATION ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                  <div class="ba overflow-hidden panel-primary ">
                    <div class="row items-center q-col-gutter-sm">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >FICHIER</div>
                      </div>
                    </div>
                    <q-separator />
                    <div class="q-pa-md">
                      <div class="row justify-center items-center ">
                        <div
                          class="col-12"
                          v-if="!loading "
                        >
                          <div class="q-pt-sm text-center">
                            <input
                              ref="fileComputer"
                              type="file"
                              multiple
                              @change="onInputFileChange"
                              style="display:none"
                            >
                            <div
                              id="dropper"
                              class="row q-col-gutter-sm text-center bg-blue-1 q-pa-sm scroll  bg-grey-2 justify-center items-center"
                              style="height:250px;border:2px dashed #6643e0;border-radius:10px;"
                            >
                              <div
                                v-if="fichier !== null"
                                class="col-auto"
                              >
                                <q-icon
                                  name="img:statics/images/icone/excel.png"
                                  size="40px"
                                  color="primary"
                                />
                                <div>
                                  <span class="text-primary">Fichier joint et prêt à être importé</span> <br>
                                  <span class="text-primary">{{fichier.filename}}</span>

                                </div>
                                <q-btn
                                  text-color="primary"
                                  color="blue-1"
                                  icon="las la-plus"
                                  label="Choisir un fichier different"
                                  rounded
                                  unelevated
                                  no-caps
                                  class="q-mt-md"
                                  @click="$refs.fileComputer.click()"
                                />
                              </div>
                              <div
                                v-else
                                class="col-auto text-grey"
                              >
                                <q-icon
                                  name="img:statics/images/icone/excel.png"
                                  size="40px"
                                  color="primary"
                                />
                                <div>
                                  <small style="font-size:13px">Joindre un fichier à importer
                                    <br>
                                    <span class="text-primary">Cliquer sur cette zone ou faites du glisser-déposer pour joindre le fichier</span>
                                  </small>
                                </div>
                                <q-btn
                                  text-color="primary"
                                  color="blue-1"
                                  icon="las la-plus"
                                  label="Choisir le fichier"
                                  rounded
                                  unelevated
                                  no-caps
                                  class="q-mt-md"
                                  @click="$refs.fileComputer.click()"
                                />

                                <div class="q-mt-md">
                                  <a
                                    href="statics/excel/model_fichier_ecritures_comptables.xlsx"
                                    download="model_fichier_ecritures_comptables.xlsx"
                                    class="text-bold text-primary q-pa-md btn-import"
                                    style="text-decoration: none"
                                  >Telecharger le modèle de fichier à remplir ?</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="loading && fichier === null"
                          class="col-12"
                        >
                          <div class="q-pa-xl text-center">
                            <q-spinner-ios
                              color="primary"
                              size="2rem"
                              :thickness="5"
                            />
                            <div class="text-grey q-mt-sm">
                              <strong>Chargement en cours...</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** TRANSACTION **************** -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >TRANSACTION</div>
                      </div>

                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">

                        <div class="col-12">
                          <input-label required>Sélectionner la devise</input-label>
                          <q-field
                            square
                            outlined
                            dense
                            hide-bottom-space
                            lazy-rules
                            :rules="[ val => !!operation.devise || 'Sélectionner la devise']"
                          >
                            <template v-slot:control>
                              <div class="self-center full-width no-outline q-pa-none">
                                <div class="row q-col-gutter-sm items-center">
                                  <div
                                    class="col"
                                    style="border-right:1px dashed rgba(0,0,0,.2)"
                                  >
                                    <q-radio
                                      v-model="operation.devise"
                                      val="CDF"
                                      label="CDF"
                                      dense
                                      class="text-bold"
                                    />
                                  </div>
                                  <div class="col">
                                    <q-radio
                                      v-model="operation.devise"
                                      val="USD"
                                      label="USD"
                                      dense
                                      class="text-bold"
                                    />
                                  </div>
                                </div>
                              </div>
                            </template>
                          </q-field>
                        </div>

                        <div class="col-12">
                          <input-label>Numéro de la pièce (Facultatif)</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="operation.piece"
                            placeholder="Numéro de la pièce"
                            lazy-rules
                            :rules="[ val => !val || !!val && val.trim().length > 0 || 'Entrer le numero de la pièce']"
                            maxlength="150"
                          />
                        </div>

                        <div class="col-xs-12 col-sm col-md col-lg col-xl">
                          <input-label required>Libellé de l'opération</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="operation.libelle"
                            placeholder="Libellé"
                            lazy-rules
                            :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                            maxlength="255"
                            type="textarea"
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
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
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                icon="las la-arrow-left"
                label="Retour en arrière"
                no-caps
                unelevated
                rounded
                size="12px"
                @click="succes=0;echecs=[]"
              />
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
      </div>
    </div>
  </q-page>
</template>
<script>

export default {
  name: 'importation_ecriture',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      fichier: null,

      operation: {
        devise: null
      },
      succes: 0,
      echecs: []
    }
  },
  props: [],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted () {
    document.addEventListener('dragover', this.onDropBegin, false)
    document.addEventListener('drop', this.onFilesDroped, false)
  },
  destroyed: function () {
    document.removeEventListener('dragover', this.onFilesDroped, false)
    document.removeEventListener('drop', this.onFilesDroped, false)
  },
  watch: {},
  components: {
  },
  filters: {},
  computed: {
    isImported () {
      return this.succes > 0 || this.echecs.length > 0
    }
  },
  methods: {
    onFilesDroped (e) {
      if (e) {
        e.preventDefault() // Cette méthode est toujours nécessaire pour éviter une
        this.onInputFileRady(e.dataTransfer.files)
      }
    },
    onDropBegin (e) {
      if (e) {
        e.preventDefault() // Annule l'interdiction de drop
      }
    },

    initEventDragDrop () {
      document.addEventListener('dragover', this.onDropBegin, false)
      document.addEventListener('drop', this.onFilesDroped, false)
    },
    onInputFileRady (files) {
      const typeAtorises = ['xls', 'xlsx', 'csv']
      let file = files[0]

      return new Promise((resolve, reject) => {
        let fileType = file.name.split('.').pop().toLowerCase()

        if (typeAtorises.indexOf(fileType) > -1) {
          let reader = new FileReader()
          reader.onload = e => {
            e.target.value = null

            return resolve({
              id: null,
              file: e.target.result,
              extension: fileType,
              filename: file.name
            })
          }
          reader.readAsDataURL(file)
        } else {
          resolve(null)
          this.$helper.showMessage('Le format de fichier [ ' + file.name + ' ] n\'est pas pris en charge')
        }
      }).then(f => {
        this.fichier = f
      }).catch(e => {
      })
    },
    onInputFileChange (e) {
      this.onInputFileRady(e.target.files)
    },
    saveForm (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment enregistrer cette importation ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        const dt = {
          ...this.operation,
          fileBase64: this.fichier.file,
          extension: this.fichier.extension,
          is_first_row_header: 'OUI',
          type_import: 'ECRITURES-COMPTABLES',
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Importation/importFichier/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          this.succes = infos.data.succes
          this.echecs = infos.data.echecs
        }).catch((e) => {
          this.$q.loading.hide()
          this.loadingSave = false
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.succes = 0
      this.echecs = []

      this.operation = {
        devise: null
      }
      this.fichier = null
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style>
.tiny-body tr td {
  padding: 2px !important;
}
</style>
