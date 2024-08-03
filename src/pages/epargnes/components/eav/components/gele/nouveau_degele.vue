<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 500px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">Degeler montant</div>
            </div>

            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                label="Enregistrer"
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
                            <input-label>Adhérent</input-label>
                            <div class="text-details"> {{gele.client_str}}</div>
                          </div>
                          <div class="col-12">
                            <input-label>Compte épargne</input-label>
                            <div class="text-details"> {{gele.indice}}</div>
                          </div>
                          <div class="col-12">
                            <div class="q-py-xs q-px-sm text-bold bg-blue-1">
                              Montant gelé : <span class="text-primary"> {{$helper.formatMoney(gele.montant_gele)}} {{gele.devise}}</span>
                            </div>
                          </div>
                          <div class="col-12">
                            <input-label required>Montant à dégeler</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="gele.montant_degele"
                              placeholder="Montant"
                              lazy-rules
                              :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                        val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                        val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',
                                        val => parseFloat(val)  <= this.geleDisponible || 'Le montant saisi est superieur au total gelé']"
                              maxlength="10"
                            >
                              <template
                                v-if="!!gele.devise"
                                #append
                              >
                                <strong style="font-size:14px">{{gele.devise}}</strong>
                              </template>
                            </q-input>
                          </div>
                          <div class="col-12">
                            <input-label>Motif du débloquage</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="gele.motif"
                              placeholder="Motif"
                              lazy-rules
                              :rules="[ val => !!val && val && val.trim().length > 10 || 'Saisissez au moins 10 caractères']"
                              type="textarea"
                              rows="3"
                              maxlength="250"
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
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogFrais',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgNewType: false,

      gele: {},
      clients: [],
      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedGele: {}
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
        if (this.selectedGele != null) {
          this.gele = { ...this.selectedGele }
        } else {
          this.gele = {}
        }
      }
    }
  },
  components: {

  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    geleDisponible () {
      if (this.gele) {
        return this.gele.montant_gele
      }
      return 0
    }
  },
  methods: {

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment enregistrer cette opération ?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.gele,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Gele/degeleMontant/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
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
    },
    viderChamps () {
      this.gele = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
