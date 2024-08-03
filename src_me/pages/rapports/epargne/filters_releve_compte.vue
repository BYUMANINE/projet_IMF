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
                <input-label>Par type client</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par type client"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  clearable
                  map-options
                  v-model="filtre.type_client"
                  :options="optionsTypes"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt.label}`"
                />
              </div>
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
                  v-model="filtre.devise"
                  :options="['CDF','USD']"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  @input="onDeviseSelected"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par Client</input-label>
                <q-select
                  :readonly="!filtre.type_client"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  label="Par client"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.client"
                  :options="clients"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${opt.folio} - ${opt.client_str}` : ''"
                  @filter="filterClients"
                  :rules="[ val => !!val || 'Sélectionner un client']"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun client trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Choisir le compte compte</input-label>

                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  :readonly="!filtre.client || !filtre.devise"
                  square
                  outlined
                  dense
                  label="Relevé du compte"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.compte"
                  :options="comptes"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt ? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
                  @filter="filterComptes"
                  :rules="[ val => !!val || 'Sélectionner un compte']"
                  @focus="type_select='COMPTE'"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun compte trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par compte en contre-partie</input-label>
                <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  :readonly="!filtre.compte"
                  square
                  outlined
                  clearable
                  dense
                  label="Compte en contre-partie"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  use-input
                  emit-value
                  map-options
                  v-model="filtre.compte_cp"
                  :options="comptes"
                  :option-value="opt => opt"
                  :option-label="opt => !!opt? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
                  @filter="filterComptes"
                  @focus="type_select='COMPTE-CP'"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun compte trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <input-label>Par date</input-label>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="filtre.date_min"
                      placeholder="Date min."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops3.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_min"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_min=null"
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
                              v-model="filtre.date_min"
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
                      v-model="filtre.date_max"
                      placeholder="Date max."
                      mask="####-##-##"
                      readonly
                      @click="$refs.popup_dt_ops4.show()"
                    >
                      <template v-slot:append>
                        <q-btn
                          v-if="filtre.date_max"
                          color="primary"
                          text-color="primary"
                          icon="close"
                          size="sm"
                          flat
                          round
                          @click="filtre.date_max=null"
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
                              v-model="filtre.date_max"
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
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      clients: [],
      comptes: [],

      optionsStatus: [
        { value: 'PS', label: 'Part sociale' },
        { value: 'OUV', label: 'Frais d\'ouveture de compte' },
        { value: 'TENU', label: 'Frais de tenu de compte' },
        { value: 'ADH', label: 'Frais d\'adhésion' }
      ],
      optionsTypes: [
        { value: 'MEMBRE', label: 'Individus' },
        { value: 'ENTREPRISE', label: 'Entreprises' },
        { value: 'GROUPE', label: 'Groupes' }
      ],
      type_select: 'COMPTE'
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
        id_agence: this.user.agence.id,
        only_types: this.filtre.type_client ? [this.filtre.type_client.value] : null
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
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
    onDeviseSelected (e) {
      if (e) {
        this.$vue.set(this.filtre, 'compte', null)
        this.$vue.set(this.filtre, 'compte_cp', null)
        this.$vue.set(this.filtre, 'produit', null)
      }
    },
    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.filtre.devise ? this.filtre.devise : null
      })

      let url = `${this.URLS.BASE_URL}/Produit/searchProduits`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.produits = []
        })
      })
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_membre: this.type_select === 'COMPTE' && this.filtre.type_client && this.filtre.type_client.value === 'MEMBRE' && this.filtre.client ? this.filtre.client.id_client : null,
        id_entreprise: this.type_select === 'COMPTE' && this.filtre.type_client && this.filtre.type_client.value === 'ENTREPRISE' && this.filtre.client ? this.filtre.client.id_client : null,
        id_groupe: this.type_select === 'COMPTE' && this.filtre.type_client && this.filtre.type_client.value === 'GROUPE' && this.filtre.client ? this.filtre.client.id_client : null,
        devise: this.filtre.devise ? this.filtre.devise : null
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = (this.type_select === 'COMPTE')
            ? infos.data.records
            : infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.comptes = (this.type_select === 'COMPTE')
            ? []
            : []
        })
      })
    }

  }
}
</script>

<style>
</style>
