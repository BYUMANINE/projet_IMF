<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="()=>{getDatas()}"
      />

      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        text="Enregistrer la sélection"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(saveForm)"
      />
    </list-menu-options>

    <q-card
      bordered
      flat
      style="border-radius:0px"
    >
      <q-card-section class="q-pa-none">

        <div class="panel-primary">
          <div class="row">
            <div class="col-12">
              <q-form
                ref="myForm"
                class="q-pa-sm"
              >
                <div class="ba panel-primary radius-none">
                  <div
                    style="position:sticky;top:195px;z-index:2"
                    class="panel-primary q-pt-xs"
                  >
                    <div class="row items-center q-col-gutter-sm">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >ECRITURES</div>
                      </div>

                    </div>
                    <q-separator />
                    <div class="q-pa-xs">
                      <q-input
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="searchOperation"
                        placeholder="Rechercher"
                        maxlength="255"
                      >
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                        <template #append>
                          <q-btn
                            v-if="searchOperation"
                            color="primary"
                            icon="close"
                            size="sm"
                            round
                            unelevated
                            flat
                            @click="searchOperation=null"
                          />
                        </template>
                      </q-input>
                    </div>
                    <q-separator />
                  </div>
                  <div>
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th style="width:40px">
                            <div
                              v-if="listeEcritures.length > 0"
                              @click="onAllEcritureSelected"
                              style="width:18px;height:18px;border:2px solid #0266fe;text-align:center;margin:2px auto"
                              :class="selectedAllEcritures ? 'bg-primary' : 'bg-white'"
                            >
                              <span
                                v-if="selectedAllEcritures"
                                class="las la-check text-white"
                                style="font-size:14px"
                              ></span>
                            </div>
                            <div v-else>#</div>
                          </th>
                          <th>REF.</th>
                          <th
                            class="text-left"
                            style="width:50%"
                          >LIBELLE</th>
                          <th class="text-center">AGENT</th>
                          <th class="text-center">AGENCE</th>
                          <th class="text-left">DATE</th>
                        </tr>
                      </thead>

                      <tbody style="font-size:12px">
                        <tr
                          v-for="(row, index) in listeEcritures"
                          :key="index"
                          @dblclick="selectedOperation= row;showDlgDetailsOp=true;"
                        >
                          <td class="text-center">
                            <div
                              @click="onOneItemSelected(row)"
                              style="width:18px;height:18px;border:2px solid #0266fe;text-align:center;margin:2px auto"
                              :class="row.selected === 'OUI' ? 'bg-primary' : 'bg-white'"
                            >
                              <span
                                v-if="row.selected === 'OUI'"
                                class="las la-check text-white"
                                style="font-size:14px"
                              ></span>
                            </div>
                          </td>
                          <td class="text-bold text-center">{{ row.id }}</td>
                          <td class="text-left">{{row.libelle}}</td>
                          <td class="text-center">{{ row.code_agent }}</td>
                          <td class="text-center">{{row.code_agence }}</td>
                          <td class="text-left">{{ $helper.dateBien(row.created_at,false) }}</td>

                          <!-- ************************************* -->
                          <!-- *************** MENU    ************* -->
                          <!-- ************************************* -->

                          <q-menu
                            touch-position
                            context-menu
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-list
                              separator
                              style="min-width: 100px"
                            >
                              <q-item
                                clickable
                                v-ripple
                                v-close-popup
                                @click="selectedOperation= row;showDlgDetailsOp=true"
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    class="las la-caret-square-down"
                                    size="24px"
                                    color="primary"
                                  />
                                </q-item-section>
                                <q-item-section>Afficher détails de l'opération</q-item-section>
                              </q-item>

                            </q-list>
                          </q-menu>
                        </tr>

                        <template v-if="loading && listeEcritures.length === 0">
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

                        <template v-if="!loading && listeEcritures.length === 0">
                          <tr class="panel-primary">
                            <td :colspan="6">
                              <nondata
                                v-if="!loading"
                                title="Aucune opération non comptabilisée trouvée"
                                @actualiser="getDatas()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <detailsOperation
      v-model="showDlgDetailsOp"
      :selectedOperation="selectedOperation"
      :user="user"
    />
  </q-page>
</template>
<script>
import detailsOperation from '../../../commun/details_operation.vue'

export default {
  name: 'ecriture_comptable',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      selectedAllEcritures: false,
      showDlgDetailsOp: false,

      selectedOperation: null,
      searchOperation: null,

      data: []
    }
  },
  props: [],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted () {
    this.getDatas()
  },
  destroyed: function () { },
  watch: {},
  components: {
    detailsOperation
  },
  filters: {},
  computed: {
    listeEcritures () {
      if (this.$helper.isNotEmpty(this.searchOperation)) {
        return this.data.filter(row => {
          return row.id.toLowerCase().indexOf(this.searchOperation.toLowerCase()) > -1 ||
            row.libelle.toLowerCase().indexOf(this.searchOperation.toLowerCase()) > -1 ||
            row.code_agent.toLowerCase().indexOf(this.searchOperation.toLowerCase()) > -1
        })
      }
      return this.data
    }
  },
  methods: {
    onOneItemSelected (row) {
      row.selected = row.selected === 'OUI' ? 'NON' : 'OUI'
    },
    onAllEcritureSelected () {
      if (this.data.length > 0) {
        this.selectedAllEcritures = !this.selectedAllEcritures
        if (this.selectedAllEcritures) {
          this.data.forEach(e => { e.selected = 'OUI' })
        } else {
          this.data.forEach(e => { e.selected = 'NON' })
        }
      } else {
        this.selectedAllEcritures = false
      }
    },
    getDatas () {
      let data = {
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      }
      let donnees = JSON.stringify(data)

      this.loading = true
      let url = `${this.URLS.BASE_URL}/Compte/getEcrituresNonCompta/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data.erreur === false) {
            this.data = infos.data.records
          } else {
            this.data = []
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.data = []
          this.loading = false
          this.$helper.showMessage()
        })
    },

    saveForm (isOk) {
      if (!isOk) return
      let ops = this.data.filter(e => e.selected === 'OUI').map(e => e.id)

      if (ops.length === 0) {
        this.$helper.showMessage('Aucune opération sélectionnée')
        return
      }

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment valider la comptabilisation des opérations sélectionnées ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        const dt = {
          only: ops,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Compte/saveComptabilisation/`

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
    },
    viderChamps () {
      this.searchOperation = null
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style>
.tiny-body tr td {
  padding: 2px !important;
}
</style>
