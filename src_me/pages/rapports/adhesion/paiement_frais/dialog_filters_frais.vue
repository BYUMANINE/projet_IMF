<template>
  <div class="row  q-px-md q-py-sm scroll ">
    <div class="col">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm col-md col-lg col-xl">
          <q-card
            flat
            bordered
          >
            <q-card-section class="row q-pa-sm q-col-gutter-sm">

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par devise</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Devise"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.devise"
                  :options="['CDF','USD']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par type frais</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par type frais"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.type_frais"
                  :options="optionsStatus"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par client (Adherent)</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par client membre"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.client"
                  :options="clients"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.folio} - ${opt.client_str}` : ''"
                  @filter="filterClients"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun membre trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par utilisateur</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par utilisateur"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.agent"
                  :options="agents"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.nom_complet}` : ''"
                  @filter="filterAgents"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun agent trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Date de paiement</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_paiement_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_paiement_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_paiement_min=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops3"
                          >
                            <q-date
                              v-model="filtre.date_paiement_min"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops3.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-auto">à</div>
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_paiement_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_paiemnt_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_paiement_max=null"
                        />
                        <q-icon
                          v-else
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_dt_ops4"
                          >
                            <q-date
                              v-model="filtre.date_paiement_max"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_ops4.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Type rapport</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  placeholder="Type rapport"
                  hide-selected
                  hide-bottom-space
                  fill-input
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.type_rapport"
                  :options="types_rapport"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.designation}`"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Grouper par</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  placeholder="Grouper"
                  hide-selected
                  hide-bottom-space
                  fill-input
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.group_by"
                  :options="groupes"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.designation}`"
                />
              </div> -->
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      clients: [],
      agents: [],

      optionsStatus: [
        { value: 'PS', label: 'Part sociale' },
        { value: 'OUV', label: 'Frais d\'ouveture de compte' },
        { value: 'TENU', label: 'Frais de tenu de compte' },
        { value: 'ADH', label: 'Frais d\'adhésion' }
      ],
      types_rapport: [
        { value: 'DETAILLE', designation: 'Rapport détaillé' },
        { value: 'SYNTHESE', designation: 'Rapport sythèse' }
      ],
      groupes: [
        { value: 'type', field: 'adhesion_frais.type', designation: 'Grouper par type de frais' }
      ]

    }
  },
  props: {
    value: Object
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  computed: {
    filtre: {
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

      let url = `${this.URLS.BASE_URL}/Frais_adhesion/searchMembresFrais`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.clients = []
        })
      })
    },
    filterAgents (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchUtilisateurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.agents = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.agents = []
        })
      })
    }

  }
}
</script>

<style>
</style>
