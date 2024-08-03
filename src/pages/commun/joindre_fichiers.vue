<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col-auto">
            <q-icon
              name="las la-paperclip"
              size="sm"
              color="primary"
            />
          </div>
          <div class="col">
            <div class="text-h6">Joindre des fichiers</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              icon="las la-sync"
              label="Actualiser"
              rounded
              size="sm"
              unelevated
              @click="getDatas()"
            />
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
        <div
          class="row  q-px-md justify-center items-center "
          style="height:50vh"
        >
          <div
            class="col-12"
            v-if="!loading "
          >
            <div class="q-pt-md text-center">
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
                style="height:200px;border:2px dashed #6643e0;border-radius:10px;"
              >
                <div
                  class="col-4 q-pa-xs "
                  v-for="(media,index) in pieces"
                  :key="index"
                >
                  <div
                    class="relative-position"
                    style="height:150px;border:2px solid #5764ec;border-radius:10px"
                  >
                    <div style="position:absolute;top:10px;right:10px;z-index:10">
                      <q-btn
                        color="blue-1"
                        text-color="primary"
                        icon="close"
                        round
                        size="sm"
                        unelevated
                        @click="removeImage(media)"
                      />
                    </div>

                    <q-img
                      v-if="media.type === 'IMG'"
                      :src="media.id != null ? URLS.IMG_PIECE+media.designation : media.designation"
                      spinner-color="white"
                      contain
                      style="width:100%;height:100%"
                    />
                    <q-img
                      v-else
                      src="statics/images/icone/pdf2.png"
                      spinner-color="white"
                      contain
                      style="width:100%;height:100%"
                    />

                    <div
                      v-if="media.description"
                      class="q-pa-sm"
                      style="background:rgba(0,0,40,.5);position:absolute;left:0;bottom:0;right:0;height:40%;border-bottom-left-radius:8px;border-bottom-right-radius:8px"
                    >
                      <span
                        class="text-bold text-white"
                        style="font-size:13px;"
                      >{{media.description}}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="nbPieces === 0"
                  class="col-auto text-grey"
                >
                  <q-icon
                    name="las la-paperclip"
                    size="40px"
                    color="primary"
                  />
                  <div>
                    <small style="font-size:13px">Joindre une pièce justificative (Borderau, réçu,...)
                      <br>
                      <span class="text-blue-5">Cliquer sur cette zone ou faites du glisser-déposer pour joindre le fichier</span>
                    </small>
                  </div>
                  <q-btn
                    text-color="primary"
                    color="blue-1"
                    icon="las la-plus"
                    label="Choisir des fichiers"
                    rounded
                    unelevated
                    no-caps
                    class="q-mt-md"
                    @click="$refs.fileComputer.click()"
                  />
                </div>
              </div>

              <q-btn
                v-if="nbPieces > 0 && nbPieces < 3"
                text-color="primary"
                color="blue-1"
                rounded
                unelevated
                label="choisir d'autres fichiers"
                icon="las la-plus"
                no-caps
                class="q-mt-md"
                @click="$refs.fileComputer.click()"
              />
            </div>
          </div>
          <div
            v-if="loading && nbPieces === 0"
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'joindre_fichiers',
  data () {
    return {
      loading: false,
      pieces: [],
      operation: null
    }
  },
  props: {
    value: Boolean,
    user: {},
    URLS: {},
    selectedOperation: {}
  },
  beforeMount () { },
  mounted: function () {

  },
  destroyed: function () {
    document.removeEventListener('dragover', this.onFilesDroped, false)
    document.removeEventListener('drop', this.onFilesDroped, false)
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedOperation != null) {
          this.initEventDragDrop()
          this.operation = { ...this.selectedOperation }
          this.pieces = []
          this.getDatas()
        } else {
          this.loading = false
          this.showDialog = false
        }
      } else {
        document.removeEventListener('dragover', this.onFilesDroped, false)
        document.removeEventListener('drop', this.onFilesDroped, false)
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    nbPieces () {
      return this.pieces.length
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
      if (this.nbPieces < 3) {
        const typeAtorises = ['jpg', 'jpeg', 'png', 'pdf']

        Promise.all([...files].map(file => {
          return new Promise((resolve, reject) => {
            let fileType = file.name.split('.').pop().toLowerCase()

            if (typeAtorises.indexOf(fileType) > -1) {
              let reader = new FileReader()
              reader.onload = e => {
                e.target.value = null

                return resolve({
                  id: null,
                  type: fileType === 'pdf' ? 'DOC' : 'IMG',
                  designation: e.target.result,
                  description: file.name
                })
              }
              reader.readAsDataURL(file)
            } else {
              resolve(null)
              this.$helper.showMessage('Le format de fichier [ ' + file.name + ' ] n\'est pas pris en charge')
            }
          })
        })).then(imgs => {
          const reste = 3 - this.nbPieces

          if (reste > 0) {
            this.saveFichiersToServer(imgs.filter(e => e != null).slice(0, reste))
          } else {
            this.$helper.showMessage('Vous avez déjà atteint la limite de 3 fichiers à joindre')
          }
        }).catch(e => {
        })
      } else {
        this.$helper.showMessage('Vous avez déjà atteint la limite de 3 fichiers à joindre')
      }
    },
    onInputFileChange (e) {
      this.onInputFileRady(e.target.files)
    },
    removeImage (media) {
      if (media.id) {
        // ON SUPPRIME SUR LE SERVEUR
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Suppression en cours...',
          message: `Souhaitez-vous vraiment supprimer ce fichier ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let data = {
            ...media,
            id_agent: this.user.id,
            id_agence: this.user.id_agence
          }

          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Media/delete/`

          this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
            .then(infos => {
              this.$q.loading.hide()
              this.$helper.checkResponse(infos.data)

              if (infos.data.erreur === false) {
                this.$helper.showMessage(infos.data.message, 1)
                this.pieces.splice(this.pieces.indexOf(media), 1)
              } else {
                this.$helper.showMessage(infos.data.message)
              }
            })
            .catch(e => {
              this.$q.loading.hide()
              this.$helper.showMessage()
            })
        })
      } else {
        this.pieces.splice(this.pieces.indexOf(media), 1)
      }
    },
    getDatas () {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_operation: this.operation.id
      })

      let url = `${this.URLS.BASE_URL}/Media/getMediasOfOperation`

      this.loading = true

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false

        if (infos.data.erreur === false) {
          this.pieces = infos.data.records
        } else {
          this.pieces = []
        }
      }).catch(() => {
        this.loading = false
        this.pieces = []
        this.$helper.showMessage()
      })
    },
    saveFichiersToServer (medias) {
      if (medias.length === 0) return

      // ON SUPPRIME SUR LE SERVEUR
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment joindre ces fichier à cette opération ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          medias,
          id_operation: this.operation.id,
          id_agent: this.user.id,
          id_agence: this.user.id_agence
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Media/addMedias/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              this.pieces = [...this.pieces, ...medias]
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
