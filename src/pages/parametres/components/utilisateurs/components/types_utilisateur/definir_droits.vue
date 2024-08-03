<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">Habilitations</div>
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                label="Actualiser"
                icon="las la-sync"
                rounded
                size="12px"
                no-caps
                unelevated
                @click="getDatas()"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
                color="blue-1"
                text-color="primary"
                label="Valider"
                icon="las la-cloud-upload-alt"
                rounded
                size="12px"
                no-caps
                unelevated
                @click="saveHabilitations()"
              />
            </div>
            <div class="col-auto">
              <q-btn
                :disable="loading"
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
            style="min-height:55vh;max-height:75vh"
          >
            <div class="col">
              <div class="ba overflow-hidden panel-primary">
                <div class="q-px-sm q-pt-sm">
                  <q-card
                    flat
                    bordered
                    class="q-mb-md"
                  >
                    <q-card-section class="q-py-sm text-bold text-primary">
                      {{selectedType ? selectedType.designation : ''}}
                    </q-card-section>
                  </q-card>
                </div>
                <q-separator />

                <div
                  v-for="(row0,index0) in droits"
                  :key="index0"
                >
                  <q-expansion-item
                    expand-separator
                    icon="las la-shield-alt text-blue"
                    :label="index0"
                    class="text-left text-bold"
                  >
                    <q-separator />
                    <div
                      v-for="(row,index,i) in row0"
                      :key="index"
                    >
                      <q-expansion-item
                        expand-separator
                        :label="(i+1) +' - '+index"
                        class="text-left text-bold"
                        dense
                      >
                        <q-separator />
                        <q-list separator>
                          <q-item
                            v-for="(row2) in row"
                            :key="row2.id"
                            class="q-pl-md"
                            dense
                            clickable
                            @click="row2.selected = row2.selected === 'OUI' ? 'NON':'OUI'"
                          >
                            <q-item-section avatar>
                              <q-checkbox
                                v-model="row2.selected"
                                true-value="OUI"
                                false-value="NON"
                                dense
                                @input="onSelectedDroit(row2)"
                              />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label style="font-weight:normal">{{row2.designation}} <b
                                  style="font-size:10px"
                                  class="text-primary"
                                >[ {{row2.id}} ]</b></q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>

                      </q-expansion-item>
                      <q-separator />
                    </div>

                  </q-expansion-item>
                  <q-separator />
                </div>

                <template v-if="!loading && droits.length===0">
                  <div class="text-center q-py-xl">
                    <q-icon
                      name="las la-info-circle"
                      size="50px"
                      color="grey-5"
                    />
                    <div>
                      <div
                        class="q-py-sm"
                        style="font-size:14px"
                      >
                        Aucune habilitations trouvée pour cet type
                      </div>
                    </div>
                  </div>
                </template>

                <template v-if="loading && droits.length===0">
                  <div class="text-center">
                    <q-spinner
                      color="primary"
                      size="2em"
                    />
                    <div class="text-bold q-mt-sm">Chargement encours...</div>
                  </div>
                </template>

              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogDroitAcces',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      droits: []
    }
  },
  props: {
    value: Boolean,
    selectedType: null
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedType != null) {
          this.getDatas()
        } else {
          this.showDialog = false
        }
      }
    }
  },
  components: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {

    getDatas () {
      let donnees = JSON.stringify({
        id_type_agent: this.selectedType.id
      })
      this.loading = true

      let url = `${this.URLS.BASE_URL}/Utilisateur/getDroitsOfTypeUser`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false
        this.$helper.checkResponse(infos.data)

        this.droits = infos.data.records
      }).catch(() => {
        this.loading = false
        this.droits = []
      })
    },
    saveHabilitations () {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous enregistrer ces habilitations ?`,
          html: true,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        })
        .onOk(() => {
          let d = []
          for (let key in this.droits) {
            for (let key2 in this.droits[key]) {
              d = [...d, ...this.droits[key][key2].filter(e => e.selected === 'OUI' || e.deleted === 'OUI')]
            }
          }

          let donnees = JSON.stringify({
            droits: d,
            id_type_agent: this.selectedType.id
          })

          this.loading = true

          let url = `${this.URLS.BASE_URL}/Utilisateur/addHabilitations`
          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)

              this.agence = null
              this.getDatas()
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          }).catch(() => {
            this.loading = false
          })
        })
    },
    onSelectedDroit (row) {
      row.deleted = (row.selected === 'NON' &&
        this.$helper.isNotEmpty(row.id_droit_type_agent)) ? 'OUI' : 'NON'
    }
  }
}
</script>

<style lang="stylus"></style>
