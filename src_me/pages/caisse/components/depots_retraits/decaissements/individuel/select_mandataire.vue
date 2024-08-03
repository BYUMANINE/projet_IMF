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
              <div class="text-h6">Sélectionner un mandataire</div>
            </div>

            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Valider la sélection"
                icon-right="las la-cloud-upload-alt"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="$refs.myForm.validate().then(validateForm)"
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
          <q-separator />

          <div
            class="row  q-px-md q-py-sm scroll "
            style="max-height:80vh"
          >
            <div class="col">
              <q-form ref="myForm">
                <q-field
                  square
                  outlined
                  dense
                  readonly
                  lazy-rules
                  :rules="[val => _validateRulesMandataire() || 'Sélectionner le mandataire bénéficiaire']"
                  class="pa-none-field"
                >
                  <template #control>
                    <div
                      class="self-center full-width no-outline"
                      tabindex="0"
                    >
                      <table class="table head-bold hover table-striped table-colored-head">
                        <thead>
                          <tr>
                            <th></th>
                            <th>#</th>
                            <th>PHOTO</th>
                            <th
                              style="width:20%"
                              class="text-left"
                            >NOM COMPLET</th>
                            <th class="text-center">SEXE</th>
                            <th class="text-center">TYPE PIECE</th>
                            <th class="text-center">PIECE</th>
                            <th class="text-center">VALIDITE</th>
                            <th class="text-center">POUVOIRS</th>
                            <th class="text-center">NIVEAU</th>
                            <th class="text-center">LIMITE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in mandataires"
                            :key="index"
                            @dblclick="selectedMandataire=row; showDlgDetails=true"
                          >
                            <td @click="onSelectedMandataire(row)">
                              <div
                                style="width:25px;height:25px;border:2px solid #5764ff;text-align:center"
                                :class="selectedMandataire && selectedMandataire.id=== row.id ? 'bg-primary' : 'bg-grey-3'"
                              >
                                <q-icon
                                  v-if="selectedMandataire && selectedMandataire.id=== row.id"
                                  name="las la-check"
                                  color="white"
                                  size="18px"
                                />
                              </div>
                            </td>
                            <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''} text-bold`">
                              {{ index + 1 }}
                            </td>
                            <td class="text-center">
                              <div
                                class="color-gradient text-center"
                                style="padding:3px; width:41px;margin:auto"
                              >
                                <q-img
                                  :src="!!row.new_photo ? row.new_photo : (!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png')"
                                  spinner-color="blue"
                                  spinner-size="15px"
                                  class="panel-primary"
                                  style="height: 35px; width: 35px;"
                                />
                              </div>
                              <q-tooltip
                                transition-show="scale"
                                transition-hide="scale"
                                anchor="center right"
                                self="center middle"
                                content-class="panel-primary shadow-3 q-pa-none"
                              >
                                <div
                                  class="color-gradient text-center"
                                  style="padding:3px; width:250px"
                                >
                                  <q-img
                                    :src="!!row.new_photo ? row.new_photo : (!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png')"
                                    spinner-color="blue"
                                    spinner-size="20px"
                                    class="panel-primary"
                                    style="height: 243px; width: 243px;"
                                  />
                                </div>
                              </q-tooltip>
                            </td>
                            <td class="text-left text-bold bg-blue-1">{{ row.nom_complet }}</td>
                            <td class="text-center">{{ row.sexe }}</td>
                            <td class="text-center">{{ row.type_piece }}</td>
                            <td class="text-center">{{ row.num_piece }}</td>
                            <td class="text-center">
                              <div v-if="!$helper.isExpireDate(row.date_expiration)"> {{$helper.dateBien(row.date_expiration,false) || 'Non définie' }}</div>
                              <div
                                v-else
                                class="text-details bg-red-1 text-red text-bold"
                              >
                                Pièce non valide depuis {{$helper.dateBien(row.date_expiration,false) }}
                              </div>
                            </td>
                            <td class="text-center">
                              <div v-if="row.pouvoirs.includes('RETRAIT')">Peut retirer</div>
                              <div
                                v-else
                                class="text-details bg-red-1 text-red text-bold"
                              >
                                Ne peut pas retirer sur ce compte
                              </div>
                            </td>
                            <td class="text-center">{{ row.niveau_mandat || 'Non défini' }}</td>
                            <td class="text-center">
                              <div v-if="!$helper.isExpireDate(row.date_limite_mandat)"> {{!!row.date_limite_mandat ? $helper.dateBien(row.date_limite_mandat,false) :'Illimité' }}</div>
                              <div
                                v-else
                                class="text-details bg-red-1 text-red text-bold"
                              >Mandat expiré depuis {{$helper.dateBien(row.date_limite_mandat,false)}}
                              </div>
                            </td>

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
                                  @click="selectedMandataireDet=row; showDlgDetails=true"
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

                          <template v-if="mandataires.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="11"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/enseignants.png"
                                  btnLabel="Actualiser la liste"
                                  title="Aucun mandataire trouvé"
                                  :showBtn="false"
                                />
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </q-field>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <detailsMandataire
      v-model="showDlgDetails"
      :selectedMandataire="selectedMandataireDet"
      :user="user"
    />
  </div>
</template>

<script>
import detailsMandataire from '../../../../../clients/components/membres/components/mandataire/details_mandataire.vue'

export default {
  data () {
    return {
      showDlgDetails: false,
      selectedMandataire: null,
      selectedMandataireDet: null
    }
  },
  props: {
    value: Boolean,
    mandataire: {},
    membre: {},
    mandataires: Array,
    isAdd: {
      type: Boolean,
      default: false
    },
    URLS: {},
    user: {}
  },
  beforeMount () { },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.mandataire != null) {
          this.selectedMandataire = { ...this.mandataire }
        } else {
          this.selectedMandataire = null
        }
      }
    }
  },
  components: {
    detailsMandataire
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    _validateRulesMandataire () {
      if (this.$helper.isNotEmpty(this.selectedMandataire)) {
        return true
      }
      return false
    },
    onSelectedMandataire (row) {
      if (row) {
        if (this.selectedMandataire && this.selectedMandataire.id === row.id) {
          this.selectedMandataire = null
        } else {
          this.checkSituationMandataire(row)
        }
        this.$forceUpdate()
      }
    },
    checkSituationMandataire (row) {
      let donnees = JSON.stringify({
        id_membre: this.membre.id,
        id_mandataire: row.id,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        types: ['RETRAIT']
      })

      let url = `${this.URLS.BASE_URL}/Membre/isMandataireEligible`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          if (infos.data.message) {
            this.$helper.showMessage(infos.data.message, 2)
          }
          this.selectedMandataire = row
          this.$forceUpdate()
        } else {
          this.$helper.showMessage(infos.data.message)
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },
    validateForm (isOk) {
      if (!isOk) return
      this.$emit('onFinish', this.selectedMandataire)
      this.showDialog = false
    }
  }
}
</script>

<style>
</style>
