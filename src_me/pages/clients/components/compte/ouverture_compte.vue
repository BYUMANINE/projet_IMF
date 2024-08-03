<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Ouverture compte</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Appliquer"
              icon="las la-check"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="saveForm()"
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
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col">
                  <div class="ba overflow-hidden panel-primary">
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>COMPTE</th>
                          <th class="text-left">PRODUIT</th>
                          <th class="text-center">TYPE</th>
                          <th class="text-center">DEVISE</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody style="font-size:11.5px">
                        <tr
                          v-for="(row, index) in data"
                          :key="index"
                        >
                          <td
                            class="text-center"
                            style="width:40px"
                          >
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                            >{{index + 1}}</q-avatar>
                          </td>
                          <td class="text-center text-bold">{{ row.indice }}</td>
                          <td class="text-left text-bold">{{ row.produit_str }}</td>
                          <td class="text-center text-bold">{{ row.type }}</td>
                          <td class="text-center text-bold">{{ row.devise }}</td>
                          <td
                            class="text-center"
                            style="width:30px"
                          >
                            <q-checkbox
                              v-if="row.is_exists === 'NON'"
                              v-model="row.selected"
                              true-value="OUI"
                              false-value="NON"
                              @click="row.selected = row.selected === 'NON' ? 'OUI': 'NON'"
                            />
                            <q-icon
                              v-else
                              class="las la-check text-blue"
                              size="18px"
                            />
                          </td>
                        </tr>

                        <template v-if="loading && data.length === 0">
                          <tr
                            v-for="item in 6"
                            :key="item"
                            class="panel-primary"
                          >
                            <td
                              v-for="item2 in 6"
                              :key="item2"
                              class="text-center"
                            >
                              <q-skeleton type="rect" />
                            </td>
                          </tr>
                        </template>

                        <template v-if="!loading && data.length === 0">
                          <tr class="panel-primary">
                            <td :colspan="6">
                              <nondata
                                v-if="!loading"
                                title="Aucun produit trouvé"
                                @actualiser="getDatas()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
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
  name: 'dialogComptes',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      data: []
    }
  },
  props: {
    value: Boolean,
    selectedClient: Object,
    typeClient: String
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.data = []
        this.getDatas()
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
      this.$q.loading.show()

      const donnees = JSON.stringify({
        id_client: this.selectedClient.id,
        id_agence: this.selectedClient.fk_agence,
        type_client: this.typeClient
      })

      let url = `${this.URLS.BASE_URL}/Produit/getListeProduits`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()
          this.data = infos.data.records
        }).catch(e => {
          this.$q.loading.hide()
          this.data = []
          this.$helper.showMessage()
        })
    },

    saveForm () {
      let comptes = this.data.filter(e => e.selected === 'OUI' && e.is_exists === 'NON')
      if (comptes.length === 0) {
        this.$helper.showMessage('Séllectionner au moin un compte')
        return
      }

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment ouvrir ces comptes ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_client: this.selectedClient.id,
          type_client: this.typeClient,
          comptes: comptes
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Compte/ouvertureCompteEpargne`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.getDatas()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    }
  }
}
</script>

<style lang="stylus"></style>
