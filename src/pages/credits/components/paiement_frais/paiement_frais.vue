<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 650px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Paiement frais</div>
          </div>

          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Valider le paiement"
              icon="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.myForm.validate().then(onSubmit)"
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
          style="max-height:75vh"
        >
          <div class="col">

            <q-form ref="myForm">
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** SITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Demande de crédit</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner une demande"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            clearable
                            v-model="selectedDemande"
                            :options="demandes"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.code} - ${opt.client_str}`"
                            @filter="filterDemandes"
                            @input="onDemandeSelected"
                            lazy-rules
                            :rules="[ val => !!val || 'Sélectionner un produit']"
                          >
                            <template #no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucun produit de crédit trouvé
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div
                          class="col-12"
                          v-if="!!selectedDemande"
                        >
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Référence demande</input-label>
                              <div class="text-details"> {{selectedDemande.code}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Produit de crédit</input-label>
                              <div class="text-details"> {{selectedDemande.produit_str}}</div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Adherant</input-label>
                              <div class="text-details">{{selectedDemande.folio}}- {{selectedDemande.client_str}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Gestionnaire</input-label>
                              <div class="text-details"> {{selectedDemande.gestionnaire_str || 'Non défini'}}</div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <input-label reauired>Libellé</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="libelle"
                            placeholder="Libellé"
                            lazy-rules
                            :rules="[ val => !!val || !!val && val.length >= 3 || 'Minimun 3 caractères']"
                            maxlength="255"
                            type="textarea"
                            rows="2"
                          />
                        </div>
                        <div
                          class="col-12"
                          v-if="$helper.isNotEmpty(listeFrais) && $helper.isNotEmpty(selectedDemande)"
                        >
                          <div class="ba overflow-hidden panel-primary">
                            <table class="table head-bold  table-striped table-colored-head">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th class="text-left">FRAIS</th>
                                  <th class="text-left">MODE</th>
                                  <th class="text-center">VALEUR</th>
                                  <th class="text-center">MONTANT</th>
                                </tr>
                              </thead>

                              <tbody style="font-size:12px">
                                <tr
                                  v-for="(row, index) in listeFrais"
                                  :key="index"
                                >
                                  <td class="text-center">
                                    <q-avatar
                                      color="primary"
                                      text-color="white"
                                      size="20px"
                                      class="text-bold"
                                    >
                                      {{ index + 1 }}
                                    </q-avatar>
                                  </td>
                                  <td class="text-left">{{ row.designation }}</td>
                                  <td class="text-bold text-left">{{ row.type }}</td>
                                  <td class="text-bold text-center">{{$helper.formatMoney(row.valeur) }} {{row.type ==='FORFAIT' ? selectedDemande.devise :'%'}}</td>
                                  <td class="text-bold text-center">{{$helper.formatMoney(row.montant) }} {{selectedDemande.devise}}</td>
                                </tr>
                                <tr>
                                  <td
                                    colspan="4"
                                    class="text-bold"
                                  >TOTAL FRAIS A PAYER</td>
                                  <td class="text-bold text-center">{{$helper.formatMoney(totalFrais)}} {{selectedDemande.devise}}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </q-form>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogFrais',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      selectedDemande: null,
      libelle: null,

      demandes: [],
      listeFrais: [],
      totalFrais: 0
    }
  },
  props: {
    value: Boolean,
    selectedFrais: null,
    isAdd: {
      type: Boolean,
      default: false
    }
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
        if (this.selectedFrais != null) {
        } else {
          this.selectedDemande = null
          this.listeFrais = 0
          this.totalFrais = 0
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
    filterDemandes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        decision: 'ACCORDE',
        frais_paye: 'NON',
        client: 'ALL',
        id_agent: this.user.id,
        id_agence: this.user.agence.id

      })

      let url = `${this.URLS.BASE_URL}/Demande_credit/searchDemandesCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.demandes = infos.data.records
        })
      }).catch(() => {
        update(() => { this.demandes = [] })
      })
    },
    onDemandeSelected (e) {
      if (e) {
        this.getSoldeEpargneAndFrais(e)
      } else {
        this.listeFrais = 0
        this.totalFrais = 0
      }
    },

    getSoldeEpargneAndFrais () {
      let data = {
        id_demande: this.selectedDemande.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }

      let donnees = JSON.stringify(data)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Frais_credit/getFraisOfDemande/`

      this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.listeFrais = infos.data.records.frais
            this.totalFrais = infos.data.records.total_frais
          } else {
            this.listeFrais = 0
            this.totalFrais = 0
            this.showDialog = false
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.showDialog = false
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment effectuer le paiement de ce frais ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.selectedDemande,
            frais: this.listeFrais,
            total_frais: this.totalFrais,
            libelle: this.libelle,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Frais_credit/add/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.$refs.myForm.resetValidation()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'bottom')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    }

  }

}
</script>

<style lang="stylus"></style>
