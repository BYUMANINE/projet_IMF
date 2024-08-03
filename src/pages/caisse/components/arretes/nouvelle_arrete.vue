<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Arrêté de caisse</div>
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

        <div
          class="row  q-px-md q-py-sm scroll "
          style="max-height:75vh"
        >
          <div class="col">

            <q-form ref="myForm">
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col">
                  <div class="ba overflow-hidden panel-primary">

                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">

                        <div
                          class="col-12"
                          v-if="!!soldeCaisse && !!arrete.caisse "
                        >
                          <div class="ba overflow-hidden panel-primary">
                            <table class="table  table-tiny">
                              <!-- INITIAL -->
                              <tr>
                                <td class="text-bold text-left">SOLDE INITIAL :</td>
                                <td class="text-bold text-right">{{$helper.formatMoney(soldeCaisse[deviseToLc].solde_initial.montant)}} {{arrete.caisse.devise}}</td>
                              </tr>
                              <!-- ENCAISSEMENTS -->
                              <tr>
                                <td class="text-bold text-left">ENCAISSEMENTS :</td>
                                <td class="text-bold text-right">{{$helper.formatMoney(soldeCaisse[deviseToLc].solde_entrees.montant) }} {{arrete.caisse.devise}}</td>
                              </tr>
                              <!-- DECAISSEMENTS -->
                              <tr>
                                <td class="text-bold text-left">DECAISSEMENTS:</td>
                                <td class="text-bold text-right">{{$helper.formatMoney(soldeCaisse[deviseToLc].solde_sorties.montant)}} {{arrete.caisse.devise}}</td>
                              </tr>
                              <!-- SOLDE -->
                              <tr>
                                <td class="text-bold text-left text-indigo">SOLDE ACTUEL :</td>
                                <td class="text-bold text-right text-indigo">{{$helper.formatMoney(soldeCaisse[deviseToLc].solde_actuel.montant) }} {{arrete.caisse.devise}}</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                        <div class="col-12">
                          <input-label>Caisse</input-label>
                          <q-select
                            :disable="loading"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner une caisse"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            clearable
                            map-options
                            v-model="arrete.caisse"
                            :options="caisses"
                            :option-value="opt => opt"
                            :option-label="opt => `${opt.designation}-${opt.devise}`"
                            @filter="filterCaisses"
                            lazy-rules
                            :rules="[ val =>  !!val || 'Sélectionner la caisse']"
                            @input="getSituationCaisse"
                          >
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucune caisse trouvée
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Solde physique</input-label>
                          <q-input
                            :readonly="!(!!arrete.caisse)"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="arrete.solde_physique"
                            placeholder="Montant"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro']"
                            maxlength="10"
                          >
                            <template
                              v-if="!!arrete.caisse && arrete.caisse.devise"
                              #append
                            >
                              <strong style="font-size:14px">{{arrete.caisse.devise}}</strong>
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Ecart</input-label>
                          <q-field
                            readonly
                            square
                            outlined
                            dense
                            placeholder="Montant"
                          >
                            <template v-slot:control>
                              <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                              >{{$helper.formatMoney(getDifference)}} </div>
                            </template>
                            <template
                              v-if="!!arrete.caisse && arrete.caisse.devise"
                              #append
                            >
                              <strong style="font-size:14px">{{arrete.caisse.devise}}</strong>
                            </template>
                          </q-field>
                        </div>
                        <div class="col-12">
                          <input-label reauired>Libellé</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="arrete.libelle"
                            placeholder="Libellé"
                            lazy-rules
                            :rules="[ val => !!val || !!val && val.length >= 3 || 'Minimun 3 caractères']"
                            maxlength="255"
                            type="textarea"
                            rows="2"
                          />
                        </div>
                      </div>
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
  name: 'dialogAffectationCaisse',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      arrete: {},
      soldeCaisse: null,

      agents: [],
      caisses: []
    }
  },
  props: {
    value: Boolean,
    selectedAffectation: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedAffectation != null) {
          this.arrete = { ...this.selectedAffectation }
        } else {
          this.arrete = {}
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    getDifference () {
      if (this.$helper.isNotEmpty(this.arrete.solde_physique)) {
        return this.$helper.toDouble(this.arrete.solde_physique) - this.$helper.toDouble(this.soldeActuel)
      }

      return 0
    },
    deviseToLc () {
      if (this.arrete.caisse) {
        return (this.arrete.caisse.devise + '').toLowerCase()
      }
      return ''
    },
    soldeActuel () {
      if (this.soldeCaisse && this.arrete.caisse) {
        return this.soldeCaisse[this.deviseToLc].solde_actuel.solde === 'C'
          ? -(this.soldeCaisse[this.deviseToLc].solde_actuel.montant)
          : this.soldeCaisse[this.deviseToLc].solde_actuel.montant
      }
      return 0
    },
    getSoldeCaisse () {
      if (this.soldeCaisse && this.arrete.caisse) {
        return {
          solde_initial: this.soldeCaisse[this.deviseToLc].solde_actuel.solde === 'C'
            ? -(this.soldeCaisse[this.deviseToLc].solde_initial.montant)
            : this.soldeCaisse[this.deviseToLc].solde_initial.montant,
          encaissement: this.soldeCaisse[this.deviseToLc].solde_entrees.montant,
          decaissement: this.soldeCaisse[this.deviseToLc].solde_sorties.montant,
          solde_actuel: this.soldeCaisse[this.deviseToLc].solde_actuel.solde === 'C'
            ? -(this.soldeCaisse[this.deviseToLc].solde_actuel.montant)
            : this.soldeCaisse[this.deviseToLc].solde_actuel.montant
        }
      }
      return null
    }
  },
  methods: {
    filterAgents (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agence: this.user.agence.id
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
        id_agence: this.user.agence.id,
        only: [this.user.caisse.usd.id_caisse]
      })

      let url = `${this.URLS.BASE_URL}/Caisse/searchCaisses`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.caisses = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.caisses = []
        })
      })
    },
    getSituationCaisse (e) {
      this.soldeCaisse = null
      this.$vue.set(this.arrete, 'solde_physique', null)

      if (!this.$helper.isNotEmpty(e)) {
        return
      }

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: e.fk_agence,
        id_caisse: e.id
      })

      let url = `${this.URLS.BASE_URL}/Caisse/getSituationCaisse`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.soldeCaisse = infos.data.records
        } else {
          this.soldeCaisse = null
          this.$vue.set(this.arrete, 'caisse', null)
        }
      }).catch(() => {
        this.$vue.set(this.arrete, 'caisse', null)
        this.soldeCaisse = null
        this.$q.loading.hide()

        this.$helper.showMessage()
      })
    },
    onSubmit (isSucess) {
      let situations = this.getSoldeCaisse
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_caisse: this.arrete.caisse.id,
        devise: this.arrete.caisse.devise,
        ...situations,
        difference: this.getDifference,
        solde_physique: this.arrete.solde_physique,
        libelle: this.arrete.libelle
      })

      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: `Enregistrement en cours...`,
          message: `Souhaitez-vous vraiment enregistrer cette arrêté ?`,
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          this.loading = true

          let url = `${this.URLS.BASE_URL}/Caisse/addArreteCaisse/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.$helper.checkResponse(infos.data)

            this.loading = false

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false
              this.viderChamps()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'center')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    },
    viderChamps () {
      this.arrete = {}
      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style lang="stylus"></style>
