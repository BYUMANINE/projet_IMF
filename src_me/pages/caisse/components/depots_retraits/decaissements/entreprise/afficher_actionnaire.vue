<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 1000px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">Actionnaires</div>
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

          <div
            class="row scroll "
            style="max-height:70vh"
          >
            <div class="col">
              <table class="table head-bold hover table-striped table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >NOM COMPLET</th>
                    <th class="text-left">SEXE</th>
                    <th class="text-left">TYPE PIECE</th>
                    <th class="text-center">NUM PIECE</th>
                    <th class="text-center">VALIDITE</th>
                    <th class="text-left">FONCTION</th>
                    <th class="text-center">MENDATAIRE</th>
                    <th class="text-center">RESPONSABLE</th>
                  </tr>
                </thead>

                <tbody style="font-size:12px">
                  <tr
                    v-for="(row, index) in actionnaires"
                    :key="index"
                    @dblclick="selectedActionnaire=row; showDlgDetails=true"
                  >
                    <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                      <q-avatar
                        color="primary"
                        text-color="white"
                        size="20px"
                      >
                        {{ index + 1 }}
                      </q-avatar>
                    </td>
                    <td class="text-left text-bold">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                    <td class="text-left">{{ row.sexe }}</td>
                    <td class="text-left">{{ row.type_piece }}</td>
                    <td class="text-center">{{ row.num_piece }}</td>
                    <td class="text-center">
                      <div v-if="!$helper.isExpireDate(row.date_expiration)"> {{row.date_expiration || 'Non définie' }}
                      </div>
                      <div
                        v-else
                        class="text-details bg-red-1 text-red text-bold"
                      >
                        Pièce non valide depuis {{$helper.dateBien(row.date_expiration,false) }}
                      </div>
                    </td>
                    <td class="text-left">{{ row.fonction }}</td>
                    <td class="text-center text-bold">{{ row.is_mandataire }}</td>
                    <td class="text-center text-bold">{{ row.is_responsable }}</td>

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
                          @click="selectedActionnaire=row; showDlgDetails=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher détails</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </tr>

                  <template v-if="actionnaires.length === 0">
                    <tr class="panel-primary">
                      <td
                        :colspan="10"
                        class="text-center"
                      >
                        <nondata
                          icone="img:statics/images/icone/enseignants.png"
                          btnLabel="Actualiser la liste"
                          title="Aucun actionnaire trouvé"
                          @actualiser="()=>{}"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <detailsActionnaire
      v-model="showDlgDetails"
      :selectedActionnaire="selectedActionnaire"
      :user="user"
    />
  </div>
</template>

<script>
import detailsActionnaire from '../../../../../clients/components/entreprises/components/actionnaire/details_actionnaire.vue'

export default {
  data () {
    return {
      user: {},
      showDlgDetails: false,
      selectedActionnaire: null
    }
  },
  props: {
    value: Boolean,
    actionnaires: Array,
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.user = this.$helper.getConnectedUser()
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.selectedActionnaire = null
      }
    }
  },
  components: {
    detailsActionnaire
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

<style>
</style>
