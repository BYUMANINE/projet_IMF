<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Nouveau transfert</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="las la-broom"
              label="Vider"
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
              icon="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.myForm.validate().then(saveForm)"
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

        <q-form
          ref="myForm"
          class="q-pa-sm"
        >

          <div class="row q-col-gutter-md">
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ********* MEMBRE SOURCE ******************* -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-7 col-xl-7">
              <div class="ba overflow-hidden panel-primary ">
                <div class="row items-center">
                  <div class="col">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >CAISSES</div>
                  </div>
                </div>
                <q-separator />

                <div class="q-px-md q-pt-sm q-pb-md">
                  <div class="row items-center q-col-gutter-sm">
                    <div class="col-12">
                      <input-label required>Caisse émettrice</input-label>
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
                        behavior="menu"
                        v-model="caisse_src"
                        :options="caisses"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.code} - ${opt.designation} ${opt.devise}`"
                        @filter="filterCaisses"
                        lazy-rules
                        :rules="[ val => !!val || 'Sélectionner une caisse']"
                        @input="onCaisseSourceSelected"
                        @focus="selectedDevise = null;onlyCaisses=[selectedCaisse.cdf.id_caisse, selectedCaisse.usd.id_caisse];excludeCaisse=[]"
                      >
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucune caisse trouvé
                            </q-item-section>
                          </q-item>
                        </template>
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-select>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Compte caisse émettrice</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!caisse_src ? caisse_src.indice || 'N/A':'N/A'}}</div>
                        </template>

                      </q-field>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Solde du compte</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!caisse_src  && solde_src ? $helper.formatMoney(solde_src.montant) || '0,00':'0,00'}}</div>
                        </template>
                        <template #prepend>
                          <div
                            style="font-size:14px"
                            class="text-bold"
                          >{{!!caisse_src && solde_src ? `S${solde_src.solde} :` || 'SDC :':'SDC :'}}</div>
                        </template>
                      </q-field>
                    </div>

                    <div class="col-12">
                      <input-label required>Caisse réceptrice</input-label>
                      <q-select
                        :readonly="!(!!caisse_src)"
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
                        behavior="menu"
                        v-model="caisse_dest"
                        :options="caisses"
                        :option-value="opt => opt"
                        :option-label="opt => `${opt.code} - ${opt.designation} ${opt.devise}`"
                        @filter="filterCaisses"
                        lazy-rules
                        :rules="[ val => !!val || 'Sélectionner une caisse']"
                        @input="onCaisseDestSelected"
                        @focus="selectedDevise = caisse_src.devise; excludeCaisse=[selectedCaisse.cdf.id_caisse, selectedCaisse.usd.id_caisse];onlyCaisses=[]"
                      >
                        <template #no-option>
                          <q-item>
                            <q-item-section class="text-red">
                              Aucune caisse trouvé
                            </q-item-section>
                          </q-item>
                        </template>
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                      </q-select>
                    </div>

                    <div class="col-12">
                      <input-label>Compte caisse réceptrice</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        readonly
                      >
                        <template #control>
                          <div
                            class="self-center full-width no-outline text-bold"
                            tabindex="0"
                          >{{!!caisse_dest ? caisse_dest.indice || 'N/A':'N/A'}}</div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ************** TRANSACTION **************** -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
              <div class="ba overflow-hidden panel-primary">
                <div class="row items-center">
                  <div class="col">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >TRANSACTION</div>
                  </div>
                  <div class="col-auto q-px-md">
                    <span
                      class="text-bold"
                      style="font-size:20px"
                    >{{$helper.formatMoney(operation.montant) }} {{operation.devise}}</span>
                  </div>
                </div>
                <q-separator />
                <div class="q-px-md q-pt-sm q-pb-md">
                  <div class="row q-col-gutter-sm">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label required>Devise</input-label>
                      <q-field
                        square
                        outlined
                        dense
                        hide-bottom-space
                        lazy-rules
                        :rules="[ val => !!operation.devise || 'Sélectionner la devise']"
                      >
                        <template v-slot:control>
                          <div class="self-center full-width no-outline q-pa-none">
                            <div class="row q-col-gutter-sm items-center border-divider">
                              <div
                                v-for="(devise,index) in devices"
                                :key="index"
                                class="col"
                              >
                                <q-radio
                                  v-model="operation.devise"
                                  :val="devise"
                                  :label="devise"
                                  dense
                                  disable
                                  class="text-bold"
                                />
                              </div>
                            </div>
                          </div>
                        </template>
                      </q-field>

                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label required>Montant</input-label>
                      <q-input
                        :readonly="!operation.devise"
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="operation.montant"
                        placeholder="Montant"
                        lazy-rules
                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',
                                      val => this.soldeDisponible >= parseFloat(val) || 'Le solde disponible dans la caisse émettrice est inferieur au montant saisi']"
                        maxlength="10"
                      >
                        <template
                          v-if="!!operation.devise"
                          #append
                        >
                          <strong style="font-size:14px">{{operation.devise}}</strong>
                        </template>
                      </q-input>
                    </div>

                    <div class="col-12">
                      <input-label required>Libellé de l'opération</input-label>
                      <q-card
                        flat
                        bordered
                        class="radius-none"
                      >
                        <q-card-section class="q-pa-none q-px-sm">
                          <q-item
                            dense
                            class="q-pl-none"
                            clickable
                            v-ripple
                            @click="operation.default_libelle=!operation.default_libelle"
                          >
                            <q-item-section>
                              <q-item-label style="font-size:13px">Utiliser le libellé généré par défaut par le système ?</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-checkbox v-model="operation.default_libelle" />
                            </q-item-section>
                          </q-item>
                        </q-card-section>
                      </q-card>
                      <q-input
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="_libelle"
                        placeholder="Libellé"
                        lazy-rules
                        :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                        maxlength="255"
                        type="textarea"
                        rows="7"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogCarnet',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      loading: false,

      operation: {
        default_libelle: true,
        devise: null,
        montant: null
      },

      selectedCaisse: null,
      selectedDevise: null,

      solde_src: null,
      caisse_src: null,
      caisse_dest: null,

      devices: ['CDF', 'USD'],

      caisses: [],
      onlyCaisses: [],
      excludeCaisses: []
    }
  },
  props: {
    value: Boolean,
    selectedCarnet: {}
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.selectedCaisse = this.user.caisse
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
        this.viderChamps()
      }
    },
    'operation.default_libelle': {
      handler (newValue, oldValue) {
        if (!newValue) {
          this._libelle = null
        } else {
          this.$vue.set(this.operation, 'libelle', this._libelle)
        }
      },
      deep: false
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Transfert de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} vers la caisse  ${this.caisse_dest ? this.caisse_dest.code + ' ' + this.caisse_dest.designation : ''} en provenance de la caisse ${this.caisse_src ? this.caisse_src.code + ' ' + this.caisse_src.designation : ''}`)
        }
        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    soldeDisponible () {
      if (this.caisse_src && this.solde_src) {
        return this.solde_src.montant
      }

      return 0
    }
  },
  methods: {
    actualiser () {
      this.$q.loading.show()
      setTimeout(() => {
        this.$q.loading.hide()
      }, 2000)
    },

    onCaisseSourceSelected (caisse) {
      this.caisse_dest = null
      this.operation.devise = null
      this.solde_src = null

      if (caisse) {
        this.getSoldeCompteCaisseSource(caisse)
      }
    },
    onCaisseDestSelected (caisse) {
      if (caisse) {
        if (caisse.devise !== this.caisse_src.devise) {
          this.caisse_dest = null
          this.$helper.showMessage('La caisse de destination doit être de la même devise que la caisse source', 0, 'center')
        }

        if (caisse.id === this.caisse_src.id) {
          this.caisse_dest = null
          this.$helper.showMessage('La caisse émettrice doit être differente de la caisse receptrice ', 0, 'center')
        }
      }
    },
    filterCaisses (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only: this.onlyCaisses,
        exclude: this.excludeCaisse,
        devise: this.selectedDevise
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
    getSoldeCompteCaisseSource (caisse) {
      let donnees = JSON.stringify({
        id_compte: caisse.id_compte,
        devise: caisse.devise,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Compte/getSoldeCompte`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.solde_src = infos.data.records.solde
          this.operation.devise = caisse.devise
        } else {
          this.caisse_src = null
          this.solde_src = null
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.caisse_src = null
        this.solde_src = null

        this.$helper.showMessage()
      })
    },

    saveForm (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Souhaitez-vous vraiment enregistrer cette opération ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        const dt = {
          ...this.operation,

          id_caisse_src: this.caisse_src.id,
          id_caisse_dest: this.caisse_dest.id,
          id_compte_src: this.caisse_src.id_compte,
          id_compte_dest: this.caisse_dest.id_compte,
          caisse_str_src: this.caisse_src.designation,
          caisse_str_dest: this.caisse_dest.designation,

          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        // console.log(dt)

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Caisse/saveTransfertCaisses/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.$emit('onFinish', true)
            this.viderChamps()
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
      this.operation = { default_libelle: true }
      this.caisse_src = null
      this.caisse_dest = null
      this.solde_src = null

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }
  }
}
</script>

<style lang="stylus"></style>
