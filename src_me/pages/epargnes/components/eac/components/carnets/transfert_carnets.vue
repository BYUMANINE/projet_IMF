<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 1050px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col gt-xs">
            <div class="text-h6">Transfert carnets entre collecteurs</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Vider"
              icon="las la-broom"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="viderChamps()"
            />
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Enregistrer"
              icon-right="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.myForm.validate().then(onSubmit)"
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
          class="row  q-px-sm q-py-sm scroll "
          style="max-height:80vh"
        >
          <div class="col">

            <q-form ref="myForm">
              <div class="row q-col-gutter-sm items-center">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** INFORAMTIONS ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-xs-12 col-sm col-md col-lg col-xl">
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >COLLECTEUR SOURCE</div>
                    <q-separator />
                    <div class="q-pa-xs">
                      <q-select
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        placeholder="Sélectionner le collecteur source"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        v-model="collecteurSrc"
                        :options="collecteurs"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.nom_complet}`"
                        lazy-rules
                        :rules="[val => !!val || 'Choisissez une option']"
                        @filter="filterCollecteurs"
                        @input="getMembres"
                        @focus="focusedCollecteur='SRC'"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucun collecteur trouvé
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <q-separator />
                    <div class="q-pa-xs">
                      <q-input
                        :disable="!(!!collecteurSrc) || membres.length ===0"
                        square
                        outlined
                        dense
                        clearable
                        hide-bottom-space
                        v-model.trim="searchSrc"
                        placeholder="Rechercher un carnet"
                        maxlength="30"
                      >
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                        lazy-rules
                        :rules="[val => selectedMembres.length > 0 || 'Sélectionner au minimum un carnet du membre']"
                        class="pa-none-field"
                      >
                        <template #control>
                          <table class="table head-bold table-striped table-colored-head">
                            <thead>
                              <tr>
                                <th></th>
                                <th>#</th>
                                <th class="text-left">MEMBRE</th>
                                <th class="text-left">CARNET</th>
                                <th class="text-right">MISE</th>
                              </tr>
                            </thead>

                            <tbody style="font-size:12px">
                              <tr
                                v-for="(row,index) in listeMembres"
                                :key="index"
                              >
                                <td>
                                  <q-checkbox v-model="row.selected" />
                                </td>
                                <td>
                                  <q-avatar
                                    color="primary"
                                    text-color="white"
                                    size="20px"
                                  >{{index+1}}</q-avatar>
                                </td>
                                <td>{{row.nom_complet}}</td>
                                <td class="text-left">{{row.code}}</td>
                                <td class="text-right">{{row.mise}} {{row.devise}}</td>
                              </tr>
                              <template v-if="loading && membres.length === 0">
                                <tr>
                                  <td
                                    :colspan="5"
                                    class="text-center q-py-xl"
                                  >
                                    <q-spinner-ios
                                      color="primary"
                                      size="2rem"
                                      :thickness="5"
                                    />
                                    <div> chargement en cours...</div>
                                  </td>
                                </tr>
                              </template>
                              <template v-if="!loading && membres.length === 0">
                                <tr class="panel-primary">
                                  <td :colspan="5">
                                    <nondata
                                      v-if="!loading"
                                      :title="!!collecteurSrc ? 'Aucun membre trouvé sous la responsabilité de ce collecteur':'Les carnets du collecteur selectionné s\'afficheront ici'"
                                      @actualiser="getMembres(collecteurSrc)"
                                      :showBtn="!!collecteurSrc"
                                    />
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon
                    name="img:statics/images/icone/angle-droit.png"
                    size="25px"
                  />
                </div>
                <div class="col-xs-12 col-sm col-md col-lg col-xl">
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >COLLECTEUR DE DESTINATION</div>
                    <q-separator />
                    <div class="q-pa-xs">
                      <q-select
                        :disable="!(!!collecteurSrc)"
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        placeholder="Sélectionner le collecteur de destination"
                        fill-input
                        hide-selected
                        hide-bottom-space
                        use-input
                        emit-value
                        map-options
                        v-model="collecteurDest"
                        :options="collecteurs"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.nom_complet}`"
                        lazy-rules
                        :rules="[val => !!val || 'Choisissez une option']"
                        @filter="filterCollecteurs"
                        @focus="focusedCollecteur='DEST'"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucun collecteur trouvé
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    <q-separator />
                    <div class="q-pa-xs">
                      <q-input
                        :disable="!(!!collecteurSrc) "
                        square
                        outlined
                        dense
                        clearable
                        hide-bottom-space
                        v-model.trim="searchDest"
                        placeholder="Rechercher un carnet"
                        maxlength="30"
                      >
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table head-bold table-striped table-colored-head">
                        <thead>
                          <tr>
                            <th></th>
                            <th>#</th>
                            <th class="text-left">MEMBRE</th>
                            <th class="text-left">CARNET</th>
                            <th class="text-right">MISE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row,index) in selectedMembres"
                            :key="index"
                          >
                            <td>
                              <q-checkbox v-model="row.selected" />
                            </td>
                            <td>
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="20px"
                              >{{index+1}}</q-avatar>
                            </td>
                            <td>{{row.nom_complet}}</td>
                            <td class="text-left">{{row.code}}</td>
                            <td class="text-right">{{row.mise}} {{row.devise}}</td>
                          </tr>
                          <template v-if="selectedMembres.length === 0">
                            <tr class="panel-primary">
                              <td :colspan="5">
                                <nondata
                                  v-if="!loading"
                                  :title="!!collecteurSrc ? 'Aucun membre sélectionné':'Les carnets à affecter au collecteur de destination s\'afficheront ici'"
                                  :showBtn="false"
                                  icone="img:statics/images/icone/selected.png"
                                />
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
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
  name: 'dialogAffectation',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      collecteurSrc: null,
      collecteurDest: null,
      membres: [],

      searchSrc: null,
      searchDest: null,
      focusedCollecteur: null,

      collecteurs: []
    }
  },
  props: {
    value: Boolean
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
        this.collecteurSrc = null
        this.collecteurDest = null
        this.membres = []
      }
    }
  },
  components: {},
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    listeMembres () {
      if (this.$helper.isNotEmpty(this.searchSrc)) {
        return this.membres.filter(row => {
          return row.nom_complet.toLowerCase().indexOf(this.searchSrc.toLowerCase()) > -1 ||
            row.code.toLowerCase().indexOf(this.searchSrc.toLowerCase()) > -1
        })
      }
      return this.membres
    },

    selectedMembres () {
      if (this.$helper.isNotEmpty(this.searchDest)) {
        return this.membres.filter(row => {
          if (row.selected) {
            return row.nom_complet.toLowerCase().indexOf(this.searchDest.toLowerCase()) > -1 ||
              row.code.toLowerCase().indexOf(this.searchDest.toLowerCase()) > -1
          }

          return false
        })
      }

      return this.membres.filter(row => {
        return row.selected
      })
    }
  },

  methods: {
    filterCollecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agence: this.user.agence.id,
        exclude_id: this.focusedCollecteur === 'DEST' ? this.collecteurSrc.id : null
      })

      let url = `${this.URLS.BASE_URL}/Collecteur/searchCollecteurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.collecteurs = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.collecteurs = []
        })
      })
    },
    getMembres (collecteur) {
      this.membres = []

      if (collecteur != null) {
        const donnees = JSON.stringify({
          id_collecteur: collecteur.id
        })

        this.loading = true

        let url = `${this.URLS.BASE_URL}/Collecteur/getMembresOfCollecteur/`

        this.$axios
          .post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.loading = false

            if (infos.data.erreur === false) {
              this.membres = infos.data.records
            } else {
              this.membres = []
              this.$helper.showMessage(infos.data.message)
            }
          })
          .catch(e => {
            this.membres = []
            this.loading = false
            this.$helper.showMessage()
          })
      }
    },
    onSubmit (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce collecteur?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          collecteur_src: this.collecteurSrc,
          collecteur_dest: this.collecteurDest,
          membres: this.selectedMembres,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Collecteur/affecterMembresToCollecteur`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')

            this.showDialog = false
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'bottom')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.searchSrc = null
      this.searchDest = null
      this.collecteurSrc = null
      this.collecteurDest = null
      this.membres = []

      if (this.$refs.myForm) { this.$refs.myForm.resetValidation() }
    }

  }

}
</script>

<style lang="stylus"></style>
