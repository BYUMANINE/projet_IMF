<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 900px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">Affectation agence</div>
            </div>

            <div class="col-auto">
              <q-btn
                :disable="loading || data.filter(e=>e.selected === 'OUI').length === 0"
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
          <div class="q-pa-xs q-px-sm text-bold bg-blue-1 text-primary">
            UTILISATEUR : {{selectedUser? selectedUser.nom_complet : ''}}
          </div>
          <div class="q-pa-xs">
            <q-input
              :disable="loading"
              square
              outlined
              dense
              hide-bottom-space
              v-model.trim="searchAgence"
              placeholder="Rechercher une agence"
              lazy-rules
              maxlength="30"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
              <template
                #append
                v-if="searchAgence"
              >
                <q-btn
                  color="white"
                  text-color="black"
                  size="sm"
                  icon="close"
                  round
                  unelevated
                  flat
                  @click="searchAgence=null"
                />
              </template>
            </q-input>
          </div>
          <q-separator />
          <div
            class="row q-pa-xs scroll "
            style="height:60vh"
          >
            <div class="col">
              <q-form ref="myForm">
                <table class="table head-bold  table-colored-head">
                  <thead>
                    <tr>
                      <th
                        class="text-center"
                        style="width:40px"
                      >#</th>
                      <th class="text-left">AGENCE</th>
                      <th class="text-left">TYPE</th>
                      <th
                        class="text-left"
                        style="width:10%"
                      >ETAT</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:11.5px">
                    <tr
                      v-for="(row,index) in listeAgences "
                      :key="index"
                    >
                      <td @click="onAgenceSelected(row)">
                        <div
                          style="width:18px;height:18px;border:2px solid #0266fe;text-align:center;margin:auto"
                          :class="row.selected === 'OUI' ? 'bg-primary' : 'bg-white'"
                        >
                          <span
                            v-if="row.selected === 'OUI'"
                            class="las la-check text-white"
                            style="font-size:14px"
                          ></span>
                        </div>
                      </td>
                      <td class="text-left text-bold">{{row.agence_str}}</td>
                      <td>
                        <q-select
                          v-if="row.selected === 'OUI'"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Type utilisateur"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          v-model="row.type_agent"
                          :options="typesAgents"
                          :option-value="opt => opt"
                          :option-label="opt => `${opt.designation}`"
                          @filter="filterTypes"
                          lazy-rules
                          :rules="[val =>!!val || 'Sélectionner une option']"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun resultat trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                        <span v-else>N/A</span>
                      </td>
                      <td>
                        <q-select
                          v-if="row.selected === 'OUI'"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Etat"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          v-model="row.status"
                          :options="['ACTIF','INACTIF']"
                          :option-value="opt => opt"
                          lazy-rules
                          :rules="[val => !!val || 'Choisissez un option']"
                        />
                        <span v-else>N/A</span>
                      </td>
                    </tr>
                    <template v-if="data.length===0">
                      <tr class="panel-primary">
                        <td :colspan="4">
                          <nondata
                            title="Aucun affectation définie"
                            :showBtn="false"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
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
  name: 'dialogAffectation',
  data () {
    return {
      URLS: {},
      user: {},

      searchAgence: null,

      loading: false,

      data: [],

      agences: [],
      typesAgents: [],
      status: ['ACTIF', 'INACTIF']
    }
  },
  props: {
    value: Boolean,
    selectedUser: null
  },
  components: {},
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
        this.data = []
        this.getAgences()
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    listeAgences () {
      return (this.$helper.isNotEmpty(this.searchAgence)
        ? this.data.filter(e => e.agence_str.toLowerCase().indexOf(this.searchAgence.toLowerCase()) > -1)
        : this.data)
    }
  },
  methods: {
    onAgenceSelected (row) {
      if (row.selected === 'OUI') {
        row.selected = 'NON'
      } else {
        row.selected = 'OUI'
      }
    },
    filterTypes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchTypesAgents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.typesAgents = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.typesAgents = []
        })
      })
    },
    getAgences (e) {
      let donnees = JSON.stringify({
        id_agent: this.selectedUser.id
      })
      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Utilisateur/getAffectationsOfAgent`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        this.$helper.checkResponse(infos.data)

        if (infos.data.erreur === false) {
          this.data = infos.data.records
        } else {
          this.data = []
        }
      }).catch(() => {
        this.data = []
        this.$q.loading.hide()
      })
    },
    onSubmit (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Enregistrement en cours...',
        message: `Souhaitez-vous vraiment mettre à jour les affectations ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let agences = this.data.filter(e => e.selected === 'OUI' || (e.selected === 'NON' && this.$helper.isNotEmpty(e.id_rel)))

        let donnees = JSON.stringify({
          id_user: this.selectedUser.id,
          agences: agences,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.loading = true
        let url = `${this.URLS.BASE_URL}/Utilisateur/saveOrUpdateAffectation/`

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
    },
    viderChamps () {
      this.affectation = {
        agences: []
      }
      this.relation = {}
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style lang="stylus"></style>
