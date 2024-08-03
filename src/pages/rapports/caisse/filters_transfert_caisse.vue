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
                  label="Par devise"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.devise"
                  :options="['CDF','USD']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  lazy-rules
                  :rules="[val => !!val || 'Choisissez une option']"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par état</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par état"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.status"
                  :options="optionsStatus"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par caisse source</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  placeholder="Rechercher une caisse"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.caisse_source"
                  :options="caisses"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.code} - ${opt.designation} ${opt.devise}`"
                  @filter="filterCaisses"
                  lazy-rules
                  @input="onCaisseSourceSelected"
                  @focus="onlyCaisses=[selectedCaisse.cdf.id_caisse, selectedCaisse.usd.id_caisse];excludeCaisse=[]"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucune caisse trouvée
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par caisse destination</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="selectionner une caisse"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.caisse_destination"
                  :options="caisses"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.code} - ${opt.designation} ${opt.devise}`"
                  @filter="filterCaisses"
                  lazy-rules
                  @input="onCaisseDestSelected"
                  @focus="onlyCaisses=[];excludeCaisse=[]"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucune caisse trouvée
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par agent source</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="selectionner un  agent"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.agent_source"
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
                <input-label>Par agent recepteur</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="selectionner un  agent"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  clearable
                  v-model="filtre.agent_destination"
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
                <input-label>Intervalle montant</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.montant_min"
                      placeholder="Montant min."
                      lazy-rules
                    >
                      <template v-slot:append>
                        <span
                          style="font-size: small;"
                          v-if="filtre.devise"
                        >{{ filtre.devise }}</span>
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
                      v-model="filtre.montant_max"
                      placeholder="Montant max."
                      lazy-rules
                    >
                      <template v-slot:append>
                        <span
                          style="font-size: small;"
                          v-if="filtre.devise"
                        >{{ filtre.devise }}</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Date de transfert</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_transfert_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_transfert_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_transfert_min=null"
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
                              v-model="filtre.date_transfert_min"
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
                      v-model="filtre.date_transfert_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_transfert_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_transfert_max=null"
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
                              v-model="filtre.date_transfert_max"
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
                <input-label>Date de réception</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_reception_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_reception_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_reception_min=null"
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
                              v-model="filtre.date_reception_min"
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
                      v-model="filtre.date_reception_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_reception_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_reception_max=null"
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
                              v-model="filtre.date_reception_max"
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
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'dialogRisque',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      clients: [],
      agents: [],
      caisses: [],
      onlyCaisses: [],
      excludeCaisses: [],
      selectedCaisse: null,
      produits: [],
      optionsStatus: [
        { value: 'RECU', label: 'Uniquement les transferts reçus' },
        { value: 'NO RECU', label: 'Uniquement les transferts non reçus' }
      ]
    }
  },
  props: {
    value: Object

  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    this.filtre.devise = this.user.devise
  },
  mounted: function () {
  },
  destroyed: function () {
    this.filtre = {}
  },
  watch: {
    filtre (newValue, oldValue) {
      if (newValue) {
        this.filtre = newValue
      } else { this.filtre = {} }
    }
  },
  computed: {
    filtre: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  },
  methods: {

    filterAgents (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agence: this.user.agence.id
        // only: ['CAISSIER', 'CAISSIER-S']
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchUtilisateurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.agents = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.agents = []
        })
      })
    },
    filterCaisses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only: this.onlyCaisses,
        exclude: this.excludeCaisse,
        devise: this.filtre.devise
      })

      let url = `${this.URLS.BASE_URL}/Caisse/searchCaissesWithComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.caisses = infos.data.records
        })
      }).catch(() => {
        update(() => { this.caisses = [] })
      })
    },
    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Dat/searchMembresDat`
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
    filterCategories (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Categorie/searchCategories`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.categories = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.categories = []
        })
      })
    },

    onCaisseSourceSelected (caisse) {
      this.filtre.caisse_destination = null
    },
    onCaisseDestSelected (caisse) {
      if (caisse) {
        if (caisse.id === this.filtre.caisse_source.id) {
          this.caisse_destination = null
          this.$helper.showMessage('La caisse émettrice doit être differente de la caisse receptrice ', 0, 'center')
        }
      }
    },

    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.filtre)
        this.showDialog = false
      }
    },
    viderChamps () {
      this.filtre = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
