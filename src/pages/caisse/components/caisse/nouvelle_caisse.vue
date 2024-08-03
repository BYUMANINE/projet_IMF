<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 550px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouvelle ': 'Mise à jours '}}caisse</div>
          </div>
          <div
            class="col-auto"
            v-if="isAdd"
          >
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="las la-broom"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="viderChamps()"
              class="gt-xs"
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
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Intitulé</input-label>
                          <q-input
                            :disable="loading"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="caisse.designation"
                            placeholder="INTITULE"
                            lazy-rules
                            :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Type caisse</input-label>
                          <q-select
                            :disable="loading"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            hide-selected
                            use-input
                            fill-input
                            v-model="caisse.type"
                            placeholder="Type caisse"
                            lazy-rules
                            :options="['SECONDAIRE','COFFRE-FORT']"
                            :rules="[val => !!val || 'Choisissez une option']"
                          />
                        </div>

                        <div class="col-12 q-mt-sm">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="text-bold q-pa-sm">COMPTES CAISSE</div>
                            <q-separator />
                            <table class="table head-bold hover  table-colored-head">
                              <thead>
                                <tr>
                                  <th style="width:40px">#</th>
                                  <th style="width:40px">DEVISE</th>
                                  <th class="text-left">COMPTE</th>
                                </tr>
                              </thead>

                              <tbody style="font-size:11.5px">
                                <tr
                                  v-for="(row,index) in caisse.comptes"
                                  :key="index"
                                >
                                  <td class="text-center">
                                    <q-avatar
                                      color="primary"
                                      text-color="white"
                                      size="20px"
                                    >
                                      {{ index + 1 }}
                                    </q-avatar>
                                  </td>
                                  <td class="text-center">{{row.devise}}</td>
                                  <td class="text-left text-bold ">
                                    <q-select
                                      transition-show="scale"
                                      transition-hide="scale"
                                      square
                                      outlined
                                      dense
                                      :label="row.fk_compte? row.fk_compte.intitule:undefined"
                                      :placeholder="`Sélectionner un compte ${row.devise}`"
                                      fill-input
                                      hide-selected
                                      hide-bottom-space
                                      use-input
                                      emit-value
                                      map-options
                                      v-model="row.fk_compte"
                                      :options="comptes"
                                      :option-value="opt => opt"
                                      :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                      @filter="filterComptes"
                                      @focus="selectedDevise = row.devise"
                                      lazy-rules
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    >
                                      <template #option="scope">
                                        <q-item
                                          v-bind="scope.itemProps"
                                          v-on="scope.itemEvents"
                                        >
                                          <q-item-section>
                                            <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                          </q-item-section>
                                        </q-item>
                                        <q-separator />
                                      </template>
                                      <template #no-option>
                                        <q-item>
                                          <q-item-section class="text-red">
                                            Aucun compte trouvé
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div class="col-12 q-mt-sm">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="text-bold q-pa-sm">COMPTES TRANSFERT INTER-CAISSES</div>
                            <q-separator />
                            <table class="table head-bold hover  table-colored-head">
                              <thead>
                                <tr>
                                  <th style="width:40px">#</th>
                                  <th style="width:40px">DEVISE</th>
                                  <th class="text-left">COMPTE</th>
                                </tr>
                              </thead>

                              <tbody style="font-size:11.5px">
                                <tr
                                  v-for="(row,index) in caisse.comptes_transfert"
                                  :key="index"
                                >
                                  <td class="text-center">
                                    <q-avatar
                                      color="primary"
                                      text-color="white"
                                      size="20px"
                                    >
                                      {{ index + 1 }}
                                    </q-avatar>
                                  </td>
                                  <td class="text-center">{{row.devise}}</td>
                                  <td class="text-left text-bold ">
                                    <q-select
                                      transition-show="scale"
                                      transition-hide="scale"
                                      square
                                      outlined
                                      dense
                                      :label="row.fk_compte? row.fk_compte.intitule:undefined"
                                      :placeholder="`Sélectionner un compte ${row.devise}`"
                                      fill-input
                                      hide-selected
                                      hide-bottom-space
                                      use-input
                                      emit-value
                                      map-options
                                      v-model="row.fk_compte"
                                      :options="comptes"
                                      :option-value="opt => opt"
                                      :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                      @filter="filterComptes"
                                      @focus="selectedDevise = row.devise"
                                      lazy-rules
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    >
                                      <template #option="scope">
                                        <q-item
                                          v-bind="scope.itemProps"
                                          v-on="scope.itemEvents"
                                        >
                                          <q-item-section>
                                            <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                          </q-item-section>
                                        </q-item>
                                        <q-separator />
                                      </template>
                                      <template #no-option>
                                        <q-item>
                                          <q-item-section class="text-red">
                                            Aucun compte trouvé
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div class="col-12 q-mt-sm">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="text-bold q-pa-sm">EXEDENT DE CAISSE</div>
                            <q-separator />
                            <table class="table head-bold hover  table-colored-head">
                              <thead>
                                <tr>
                                  <th style="width:40px">#</th>
                                  <th style="width:40px">DEVISE</th>
                                  <th class="text-left">COMPTE</th>
                                </tr>
                              </thead>

                              <tbody style="font-size:11.5px">
                                <tr
                                  v-for="(row,index) in caisse.comptes_excedent"
                                  :key="index"
                                >
                                  <td class="text-center">
                                    <q-avatar
                                      color="primary"
                                      text-color="white"
                                      size="20px"
                                    >
                                      {{ index + 1 }}
                                    </q-avatar>
                                  </td>
                                  <td class="text-center">{{row.devise}}</td>
                                  <td class="text-left text-bold ">
                                    <q-select
                                      transition-show="scale"
                                      transition-hide="scale"
                                      square
                                      outlined
                                      dense
                                      :label="row.fk_compte? row.fk_compte.intitule:undefined"
                                      :placeholder="`Sélectionner un compte ${row.devise}`"
                                      fill-input
                                      hide-selected
                                      hide-bottom-space
                                      use-input
                                      emit-value
                                      map-options
                                      v-model="row.fk_compte"
                                      :options="comptes"
                                      :option-value="opt => opt"
                                      :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                      @filter="filterComptes"
                                      @focus="selectedDevise = row.devise"
                                      lazy-rules
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    >
                                      <template #option="scope">
                                        <q-item
                                          v-bind="scope.itemProps"
                                          v-on="scope.itemEvents"
                                        >
                                          <q-item-section>
                                            <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                          </q-item-section>
                                        </q-item>
                                        <q-separator />
                                      </template>
                                      <template #no-option>
                                        <q-item>
                                          <q-item-section class="text-red">
                                            Aucun compte trouvé
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div class="col-12 q-mt-sm">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="text-bold q-pa-sm">MANQUANT DE CAISSE</div>
                            <q-separator />
                            <table class="table head-bold hover  table-colored-head">
                              <thead>
                                <tr>
                                  <th style="width:40px">#</th>
                                  <th style="width:40px">DEVISE</th>
                                  <th class="text-left">COMPTE</th>
                                </tr>
                              </thead>

                              <tbody style="font-size:11.5px">
                                <tr
                                  v-for="(row,index) in caisse.comptes_manquant"
                                  :key="index"
                                >
                                  <td class="text-center">
                                    <q-avatar
                                      color="primary"
                                      text-color="white"
                                      size="20px"
                                    >
                                      {{ index + 1 }}
                                    </q-avatar>
                                  </td>
                                  <td class="text-center">{{row.devise}}</td>
                                  <td class="text-left text-bold ">
                                    <q-select
                                      transition-show="scale"
                                      transition-hide="scale"
                                      square
                                      outlined
                                      dense
                                      :label="row.fk_compte? row.fk_compte.intitule:undefined"
                                      :placeholder="`Sélectionner un compte ${row.devise}`"
                                      fill-input
                                      hide-selected
                                      hide-bottom-space
                                      use-input
                                      emit-value
                                      map-options
                                      v-model="row.fk_compte"
                                      :options="comptes"
                                      :option-value="opt => opt"
                                      :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                      @filter="filterComptes"
                                      @focus="selectedDevise = row.devise"
                                      lazy-rules
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    >
                                      <template #option="scope">
                                        <q-item
                                          v-bind="scope.itemProps"
                                          v-on="scope.itemEvents"
                                        >
                                          <q-item-section>
                                            <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                          </q-item-section>
                                        </q-item>
                                        <q-separator />
                                      </template>
                                      <template #no-option>
                                        <q-item>
                                          <q-item-section class="text-red">
                                            Aucun compte trouvé
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                    </q-select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
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
  name: 'dialogCaisse',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,

      selectedDevise: null,
      caisse: {},
      comptes: [],
      defaultCompte: [
        { devise: 'CDF', fk_compte: null },
        { devise: 'USD', fk_compte: null }
      ]
    }
  },
  props: {
    value: Boolean,
    selectedCaisse: {},
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
        if (this.selectedCaisse != null) {
          this.caisse = { ...this.selectedCaisse }
          this.setDefautComptes()
        } else {
          this.viderChamps()
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },

  methods: {
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        only: [],
        devise: this.selectedDevise,
        with_length: 14,
        signe_length: '>='
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.comptes = []
        })
      })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
          message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer cette caisse ?' : 'Souhaitez-vous vraiment modifier les infos de cette caisse ?'}`,
          cancel: 'Annuler',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            ...this.caisse
          })

          this.loading = true

          let url = `${this.URLS.BASE_URL}/Caisse/${this.isAdd ? 'add' : 'update'}/`

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
    setDefautComptes () {
      if (this.caisse.comptes.length === 0) this.caisse.comptes = this.$helper.noRef(this.defaultCompte)
      if (this.caisse.comptes_transfert.length === 0) this.caisse.comptes_transfert = this.$helper.noRef(this.defaultCompte)
      if (this.caisse.comptes_manquant.length === 0) this.caisse.comptes_manquant = this.$helper.noRef(this.defaultCompte)
      if (this.caisse.comptes_excedent.length === 0) this.caisse.comptes_excedent = this.$helper.noRef(this.defaultCompte)
    },
    viderChamps () {
      this.caisse = {
        comptes: this.$helper.noRef(this.defaultCompte),
        comptes_transfert: this.$helper.noRef(this.defaultCompte),
        comptes_manquant: this.$helper.noRef(this.defaultCompte),
        comptes_excedent: this.$helper.noRef(this.defaultCompte)
      }

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }
  }
}
</script>

<style lang="stylus"></style>
