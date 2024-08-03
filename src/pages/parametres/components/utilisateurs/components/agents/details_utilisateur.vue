<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 750px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon
                name="info"
                size="sm"
                color="primary"
              />
            </div>
            <div class="col">
              <div class="text-h6">Détails de l'utilisateur [{{utilisateur.id}}] </div>
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

          <q-separator />
          <div class="row">
            <div class="col">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey panel-primary"
                active-color="primary"
                indicator-color="transparent"
                align="left"
                narrow-indicator
              >
                <q-tab name="1">
                  <strong class="style-tab">INFORMATIONS</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">AGENCES D'AFFECTATION</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:50vh;max-height:90vh"
          >
            <div class="col">
              <q-tab-panels
                v-model="tab"
                animated
                style="background-color:transparent;padding:0 "
                transition-prev="fade"
                transition-next="fade"
              >
                <q-tab-panel
                  name="1"
                  class="bg-transparent q-pa-none"
                >
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ***** INFORMATIONS SUR UTILISATEUR ***** -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div class="row items-center">
                              <div class="col">
                                <div
                                  class="q-py-xs q-px-sm text-h6"
                                  style="font-size:14px"
                                >INFORMATIONS UTILISATEUR </div>
                              </div>
                              <div class="col-auto q-pr-sm">
                                <q-badge
                                  :color="utilisateur.username && utilisateur.status ==='ACTIF'  ? 'green-1 text-green':'red-2 text-red'"
                                  text-color="black"
                                  :label="utilisateur.username && utilisateur.status ==='ACTIF' ? 'A accès au système' : 'N\'a pas d\'accès'"
                                  class="text-bold"
                                  style="padding:5px 5px"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <q-separator />
                        <div
                          style="min-height:45vh;max-height:58vh"
                          class="scroll q-px-md q-pt-sm q-pb-md"
                        >
                          <div class="row q-col-gutter-sm items-center">
                            <div class="col-12">
                              <div class="row q-col-gutter-md items-center">
                                <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                                  <div class="text-center">
                                    <div class=" contStylephoto">
                                      <q-img
                                        :src=" (!!utilisateur && !!utilisateur.photo ?  `${URLS.IMG_AGENT}/${utilisateur.photo}` :'statics/images/icone/avatar.png')"
                                        spinner-color="white"
                                        spinner-size="35px"
                                        class="stylePhoto bg-blue-1"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-12">
                                      <input-label>Nom complet</input-label>
                                      <div class="text-details"> {{utilisateur.nom_complet}}</div>
                                    </div>
                                    <div class="col-12">
                                      <input-label>Sexe</input-label>
                                      <div class="text-details"> {{utilisateur.sexe}}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Téléphone</input-label>
                              <div class="text-details"> {{utilisateur.phone || 'Non défini'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Adresse</input-label>
                              <div class="text-details"> {{utilisateur.adresse || 'Non définie'}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Etat civil</input-label>
                              <div class="text-details"> {{utilisateur.etat_civil}}</div>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nom d'utilisateur</input-label>
                              <div class="text-details"> {{utilisateur.username || 'Non défini'}}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row q-col-gutter-sm items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >AGENCES</div>
                      <div class="col-auto">
                        <q-btn
                          color="blue-1"
                          text-color="primary"
                          label="Actualiser"
                          icon-right="las la-sync"
                          rounded
                          size="sm"
                          unelevated
                          @click="getDatas()"
                        />
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="min-height:45vh;max-height:58vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>STATUT</th>
                            <th class="text-left">AGENCE</th>
                            <th class="text-left">TYPE DROIT</th>
                          </tr>
                        </thead>

                        <tbody
                          style="font-size:12px"
                          v-if="utilisateur.agences"
                        >
                          <tr
                            v-for="(row, index) in utilisateur.agences"
                            :key="index"
                          >
                            <td class="text-center">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="19px"
                                class="text-bold"
                              >
                                {{ index + 1 }}
                              </q-avatar>
                            </td>
                            <td class="text-center text-bold ">
                              <q-icon
                                :class="row.status === 'ACTIF' ? 'las la-check text-blue': 'las la-exclamation-circle text-red'"
                                size="18px"
                              />
                            </td>
                            <td class="text-left text-bold bg-blue-1">{{ row.agence_str }}</td>
                            <td class="text-left">{{ row.type_agent_str || 'N/A' }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>

</template>

<script>

export default {
  name: 'dialogDetailsAgent',
  data () {
    return {
      utilisateur: {
        agences: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedUser: {},
    user: {},
    URLS: {}
  },
  components: {

  },
  beforeMount () { },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.tab = '1'
        if (this.selectedUser) {
          this.utilisateur = {
            ...this.selectedUser,
            agences: []
          }
        } else {
          this.utilisateur = {
            agences: []
          }
        }
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
    enableOrDisable (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'En cours d\'exécution...',
        message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} cette affectation ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      })
        .onOk(() => {
          let data = {
            ...row,
            id_agent: this.user.id
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Utilisateur/enableOrDisableAffectation/`

          this.$axios.post(url, this.$helper.objectToform({ data: donnees })).then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              // this.data.splice(this.data.indexOf(row), 1)
              row.status = row.status === 'ACTIF' ? 'INACTIF' : 'ACTIF'
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
            .catch(e => {
              this.$q.loading.hide()
              this.$helper.showMessage()
            })
        })
    },
    getDatas () {
      const donnees = JSON.stringify(this.utilisateur)

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Utilisateur/getDetailsUtilisateur/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.utilisateur = {
              ...this.utilisateur,
              ...infos.data.records
            }
          } else {
            this.$helper.showMessage(infos.data.message)
            this.showDialog = false
          }
        })
        .catch(e => {
          this.$q.loading.hide()
          this.$helper.showMessage()
          this.showDialog = false
        })
    }
  }

}
</script>

<style lang="stylus"></style>
