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
              <div class="text-h6">Ajouter adhérent</div>
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
          <q-form
            ref="myForm"
            class="q-pa-md scroll"
            style="min-height:75;max-height:75vh"
          >
            <div class="row q-col-gutter-md ">
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <!-- ************** IDENTITE ******************* -->
              <!-- ******************************************* -->
              <!-- ******************************************* -->
              <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                <div class="ba overflow-hidden panel-primary">
                  <div class="q-px-md q-pt-sm q-pb-md">
                    <div class="row q-col-gutter-sm">
                      <div
                        class="col-12"
                        v-if="isAdd"
                      >
                        <input-label required>Rechercher un adherent</input-label>
                        <q-select
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Rechercher un adherent"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          clearable
                          behavior="menu"
                          v-model="client"
                          :options="clients"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.folio} - ${opt.client_str}`"
                          @filter="filterClients"
                          lazy-rules
                          :rules="[ val => !!val || 'Sélectionner une adherent']"
                        >
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun adherent trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                          <template #prepend>
                            <q-icon name="search" />
                          </template>
                        </q-select>
                      </div>
                      <div
                        v-else
                        class="col-12"
                      >
                        <input-label>Adhérent</input-label>
                        <div
                          class="text-details"
                          v-if="client"
                        > {{client.folio}} - {{client.client_str}}</div>
                      </div>
                      <div class="col-xs-12 col-sm col-md col-lg col-xl">
                        <input-label required>Raison</input-label>
                        <q-input
                          square
                          outlined
                          dense
                          hide-bottom-space
                          v-model.trim="description"
                          placeholder="Raison"
                          lazy-rules
                          :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                          maxlength="255"
                          type="textarea"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>

export default {
  name: 'dat_entreprise',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      loading: false,

      description: null,
      client: null,

      clients: []
    }
  },
  props: {
    value: Boolean,
    selectedSaction: null,
    isAdd: Boolean
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
  destroyed: function () { },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.$helper.isNotEmpty(this.selectedSaction)) {
          this.client = {
            client_str: this.selectedSaction.client_str,
            folio: this.selectedSaction.folio
          }
          this.description = this.selectedSaction.description
        } else {
          this.viderChamps()
        }
      }
    }
  },
  components: {},
  filters: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {

    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => { this.clients = [] })
      })
    },
    onSubmit (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment ajouter cet adhérent sur la liste noire ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        const dt = {
          id: this.selectedSaction ? this.selectedSaction.id : null,
          description: this.description,
          id_client: this.client.id_client,
          type_client: this.client.type_client,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Blacklist/${this.isAdd ? 'add' : 'update'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.viderChamps()
            this.$emit('onFinish', true)
            this.showDialog = false
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.description = null
      this.client = null

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }

  }
}
</script>

<style></style>
