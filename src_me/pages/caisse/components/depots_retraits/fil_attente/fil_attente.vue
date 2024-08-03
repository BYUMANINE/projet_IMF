<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
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
              <div class="text-h6">Fil d'attente</div>
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
                  <strong class="style-tab">PERSONNES EN ATTENTE</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">PERSONNES DEJA SERVIES</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:50vh;max-height:65vh"
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
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** EN ATTENTE ***************** -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >EN ATTENTES</div>
                      </div>
                    </div>
                    <q-separator />
                    <table class="table head-bold hover  table-colored-head">
                      <thead>
                        <tr>
                          <th>NUMERO</th>
                          <th
                            style="width:20%"
                            class="text-left"
                          >NOM COMPLET</th>
                          <th class="text-left">TYPE OPERATION</th>
                          <th>MONTANT</th>
                          <th class="text-left">DESCRIPTION</th>
                        </tr>
                      </thead>

                      <tbody style="font-size:11.5px">
                        <tr
                          v-for="(row,index) in data"
                          :key="index"
                        >
                          <td class="text-center">
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                            >
                              {{index+1}}
                            </q-avatar>
                          </td>
                          <td class="text-center">
                            <q-icon
                              :class="row.status==='INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                              size="18px"
                            />
                          </td>
                          <td class="text-left text-bold">{{row.designation}}</td>
                          <td class="text-left">{{row.description || 'Non définie'}}</td>
                          <td class="text-center text-bold">{{row.nb_membres}}</td>
                          <td class="text-center text-bold">{{row.nb_groupes}}</td>
                          <td class="text-center text-bold">{{row.nb_entreprises}}</td>

                          <!-- ************************************* -->
                          <!-- *************** MENU    ************* -->
                          <!-- ************************************* -->
                          <q-tooltip>
                            Clic droit pour plus d'options
                          </q-tooltip>

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
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    class="las la-pen"
                                    size="24px"
                                    color="primary"
                                  />
                                </q-item-section>
                                <q-item-section>Valider</q-item-section>
                              </q-item>
                              <q-item
                                clickable
                                v-ripple
                                v-close-popup
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    class="las la-pen"
                                    size="24px"
                                    color="primary"
                                  />
                                </q-item-section>
                                <q-item-section>Passer</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>

                        </tr>

                        <template v-if="loading && data.length===0">
                          <tr
                            v-for="item in 6"
                            :key="item"
                            class="panel-primary"
                          >
                            <td
                              v-for="item2 in 5"
                              :key="item2"
                              class="text-center"
                            >
                              <q-skeleton type="rect" />
                            </td>
                          </tr>
                        </template>

                        <template v-if="!loading && data.length===0">
                          <tr class="panel-primary">
                            <td :colspan="5">
                              <nondata
                                v-if="!loading"
                                title="Aucune personne sur la liste d'attente"
                                btnLabel="Actualiser la liste"
                                @actualiser="getDatas()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="bg-transparent q-pa-none"
                >
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <!-- ************** ADRESSES ******************* -->
                  <!-- ******************************************* -->
                  <!-- ******************************************* -->
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >SERVIES AU COURANT DE LA JOURNEE</div>
                      </div>
                    </div>
                    <q-separator />
                    <table class="table head-bold hover  table-colored-head">
                      <thead>
                        <tr>
                          <th>NUMERO</th>
                          <th
                            style="width:20%"
                            class="text-left"
                          >NOM COMPLET</th>
                          <th class="text-left">TYPE OPERATION</th>
                          <th>MONTANT</th>
                          <th class="text-left">DESCRIPTION</th>
                        </tr>
                      </thead>

                      <tbody style="font-size:11.5px">
                        <tr
                          v-for="(row,index) in data"
                          :key="index"
                        >
                          <td class="text-center">
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                            >
                              {{index+1}}
                            </q-avatar>
                          </td>
                          <td class="text-center">
                            <q-icon
                              :class="row.status==='INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                              size="18px"
                            />
                          </td>
                          <td class="text-left text-bold">{{row.designation}}</td>
                          <td class="text-left">{{row.description || 'Non définie'}}</td>
                          <td class="text-center text-bold">{{row.nb_membres}}</td>
                          <td class="text-center text-bold">{{row.nb_groupes}}</td>
                          <td class="text-center text-bold">{{row.nb_entreprises}}</td>

                          <!-- ************************************* -->
                          <!-- *************** MENU    ************* -->
                          <!-- ************************************* -->
                          <q-tooltip>
                            Clic droit pour plus d'options
                          </q-tooltip>

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
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    class="las la-pen"
                                    size="24px"
                                    color="primary"
                                  />
                                </q-item-section>
                                <q-item-section>Valider</q-item-section>
                              </q-item>
                              <q-item
                                clickable
                                v-ripple
                                v-close-popup
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    class="las la-pen"
                                    size="24px"
                                    color="primary"
                                  />
                                </q-item-section>
                                <q-item-section>Passer</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>

                        </tr>

                        <template v-if="loading && data.length===0">
                          <tr
                            v-for="item in 6"
                            :key="item"
                            class="panel-primary"
                          >
                            <td
                              v-for="item2 in 5"
                              :key="item2"
                              class="text-center"
                            >
                              <q-skeleton type="rect" />
                            </td>
                          </tr>
                        </template>

                        <template v-if="!loading && data.length===0">
                          <tr class="panel-primary">
                            <td :colspan="5">
                              <nondata
                                v-if="!loading"
                                title="Aucune personne déjà servie au courant de la journée"
                                btnLabel="Actualiser la liste"
                                @actualiser="getDatas()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
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
  name: 'filAttente',
  data () {
    return {
      URLS: {},

      loading: false,
      data: [],
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    user: {}
  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.tab = '1'
        this.data = []
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {}

}
</script>

<style lang="stylus"></style>
