<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        v-if="!!operation"
        style="width: 650px; max-width: 95vw;"
      >
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col-auto">
              <q-icon
                name="info"
                size="sm"
                color="primary"
              />
            </div>
            <div class="col">
              <div class="text-h6">Détails opération <span
                  class="text-primary"
                  style="font-size:15px"
                >[ {{operation.id}} ]</span></div>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                icon="las la-print"
                label="Imprimer"
                rounded
                size="12px"
                no-caps
                unelevated
                @click="imprimer({id_operation:operation.id})"
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
            class="row  q-px-md q-py-sm scroll "
            style="max-height:70vh"
          >
            <div
              v-if="details.length > 0"
              class="col-12"
            >
              <table class="table table-colored-head ">
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">COMPTE</th>
                    <th class="text-left">INTITULE</th>
                    <th class="text-right">DEBIT</th>
                    <th class="text-right">CREDIT</th>
                    <th class="text-center">AGENCE</th>

                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in details"
                    :key="index"
                  >
                    <td class="text-center text-bold">{{ row.operation }}</td>
                    <td class="text-left">{{ row.indice }}</td>
                    <td class="text-left">{{ row.intitule }}</td>
                    <td class="text-bold text-right">{{row.operation == 'D' ? $helper.formatMoney(row.montant) : ''}}</td>
                    <td class="text-bold text-right">{{row.operation == 'C' ? $helper.formatMoney(row.montant) : ''}}</td>
                    <td class="text-center">{{ row.code_agence || 'Non définie' }}</td>
                  </tr>
                  <tr v-if="details && details.length >0">
                    <td
                      :style="$helper.cellEmptyImg"
                      colspan="3"
                      class="text-left text-bold"
                    >TOTAL</td>
                    <td class="text-bold text-right">{{$helper.formatMoney(details[0].totaux.debit)}}</td>
                    <td class="text-bold text-right">{{$helper.formatMoney(details[0].totaux.credit)}}</td>
                    <td :style="$helper.cellEmptyImg"></td>
                  </tr>
                </tbody>
              </table>

              <!-- <consigne
              class="q-mt-md"
              title="Autres détails sur l'opération"
            /> -->
              <q-list
                bordered
                separator
                class="q-mt-md"
              >

                <q-item>
                  <q-item-section>
                    <q-item-label class="text-bold">Devise</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].devise}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-bold">Libellé</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].libelle}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].piece">
                  <q-item-section>
                    <q-item-label class="text-bold">Pièce (Chèque, réçu, facture, bordereau,...)</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].piece || 'Non précisée'}}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      color="blue-1"
                      text-color="primary"
                      icon="las la-copy"
                      unelevated
                      round
                      size="sm"
                      @click="$helper.copy(details[0].piece)"
                    >
                      <q-tooltip>
                        Copier le numéro de la pièce
                      </q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].initiateur">
                  <q-item-section>
                    <q-item-label class="text-bold">Déposant ou bénéficiaire</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].initiateur || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].status === 'ANNULE'">
                  <q-item-section>
                    <q-item-label class="text-bold">status</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >
                      <q-badge
                        color="red"
                        text-color="white"
                        label="OPERATION ANNULEE"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-bold">Opération enregistrée par </q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].agent || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].groupe">
                  <q-item-section>
                    <q-item-label class="text-bold">Groupe solidaire</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].groupe || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].membre">
                  <q-item-section>
                    <q-item-label class="text-bold">Membre</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].membre || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].mandataire">
                  <q-item-section>
                    <q-item-label class="text-bold">Mandataire</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].mandataire || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="details[0].entreprise">
                  <q-item-section>
                    <q-item-label class="text-bold">Entreprise</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{details[0].entreprise || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-bold">Date de l'opération</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{$helper.dateBien(details[0].created_at) || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-bold">Date de saisi de l'opération</q-item-label>
                    <q-item-label
                      class="text-black"
                      caption
                    >{{$helper.dateBien(details[0].created_at_2) || 'Non défini'}}</q-item-label>
                  </q-item-section>
                </q-item>

                <template v-if="$helper.isNotEmpty(details[0].pieces)">
                  <q-item>
                    <q-item-section side>
                      <q-icon name="las la-paperclip" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-bold">Pièces jointes</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <div
                      class="col-4 q-pa-xs "
                      v-for="(media,index) in details[0].pieces"
                      :key="index"
                    >
                      <div
                        class="relative-position"
                        style="height:150px;border:2px solid #5764ec;border-radius:10px"
                      >
                        <q-img
                          v-if="media.type === 'IMG'"
                          :src="URLS.IMG_PIECE+media.designation"
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
                  </q-item>
                </template>
              </q-list>

            </div>
            <div
              v-if="loading && details.length === 0"
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

            <div
              class="col-12"
              v-if="!loading && details.length === 0"
            >
              <nondata
                :title="`Une erreur est survenue lors de la récupération des détails de l'opération numéro ${operation.id}`"
                btnLabel="Réessayer"
                @actualiser="getDatas()"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
      width="700px"
    />
  </div>
</template>

<script>

export default {
  name: 'details_operation',
  data () {
    return {
      URLS: {},
      loading: false,
      operation: null,
      details: [],
      showDlgPreview: false,
      document: null

    }
  },
  props: {
    value: Boolean,
    user: {},
    selectedOperation: {}
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedOperation != null) {
          this.operation = { ...this.selectedOperation }
          this.details = []
          this.getDatas()
        } else {
          this.showDialog = false
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  },
  methods: {
    getDatas () {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_operation: this.operation.id
      })

      let url = `${this.URLS.BASE_URL}/Compte/getDetailsOperation`

      this.loading = true

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false

        if (infos.data.erreur === false) {
          this.details = infos.data.records
        } else {
          this.details = []
          this.$helper.showMessage(infos.data.message)
        }
      }).catch(() => {
        this.loading = false
        this.details = []
        this.$helper.showMessage()
      })
    },
    imprimer (filtre) {
      let donnees = JSON.stringify({
        ...filtre,
        type_client: 'GROUPE',
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'html'
      })

      let urlStr = `${this.URLS.BASE_URL}/rapports/Rapport_comptabilite/exportPieceEcritureComptable/`
      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))

        this.document = {
          url,
          name: 'PIECE COMPTABLE'
        }
        this.showDlgPreview = true
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
