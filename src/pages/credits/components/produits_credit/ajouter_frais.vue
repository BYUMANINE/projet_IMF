<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 450px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Ajouter frais</div>
          </div>

          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Ajouter"
              icon-right="add"
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
                <!-- ************** SITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Frais</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            clearable
                            placeholder="Sélectionner un frais"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            v-model="selectedFrais"
                            :options="listeFrais"
                            :option-value="opt => opt"
                            :option-label="opt => !!opt ? `${opt.devise} - ${opt.designation}` : ''"
                            @filter="filterFrais"
                            @input="onFraisSelected"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                          >
                            <template #no-option>
                              <div class="text-red">
                                Aucun frais trouvé
                              </div>
                            </template>
                          </q-select>
                        </div>
                        <div class="col-12">
                          <input-label required>Intervalle montant de credit</input-label>
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-xs">
                              <q-input
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="frais.montant_min"
                                placeholder="Montant min"
                                lazy-rules
                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',]"
                                class="mrg"
                                maxlength="10"
                              >
                                <template
                                  v-slot:append
                                  v-if="selectedFrais"
                                >
                                  <div style="font-size:13px"><strong>{{selectedFrais.devise}}</strong></div>
                                </template>
                              </q-input>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-xs">
                              <q-input
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="frais.montant_max"
                                placeholder="Montant max"
                                lazy-rules
                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                                  val => parseFloat(val) >= this.$helper.parseNumeric(this.frais.montant_min) || 'Doit être superieur ou égal au montant min',]"
                                class="mrg"
                                maxlength="10"
                              >
                                <template
                                  v-slot:append
                                  v-if="selectedFrais"
                                >
                                  <div style="font-size:13px"><strong>{{selectedFrais.devise}}</strong></div>
                                </template>
                              </q-input>
                            </div>
                          </div>

                        </div>
                        <div class="col-12">
                          <input-label>Type prélevement </input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner une option"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            clearable
                            use-input
                            v-model="frais.type"
                            :options="['FORFAIT','POURCENTAGE']"
                            :option-value="opt => opt"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                          />
                        </div>
                        <div class="col-12">
                          <input-label>Valeur </input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="frais.valeur"
                            placeholder="Valeur"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) > 0 || 'La valeur doit être superieure ou égale à 1',]"
                            class="mrg"
                            maxlength="10"
                          >
                            <template v-slot:append>
                              <div style="font-size:13px"><strong>{{frais.type}}</strong></div>
                            </template>
                          </q-input>
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
  name: 'dialogfrais',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      frais: {},
      selectedFrais: null,
      listeFrais: []
    }
  },
  props: {
    value: Boolean,
    devise: {
      type: String,
      default: null
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
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
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }

  },
  methods: {
    filterFrais (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        devise: this.devise
      })

      let url = `${this.URLS.BASE_URL}/Frais_credit/searchFraisCredits`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.listeFrais = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.listeFrais = []
        })
      })
    },
    onFraisSelected (e) {
      if (e) {
        this.frais.fk_credit_param_frais = e.id
        this.frais.designation = e.designation
        this.frais.devise = e.devise
      } else {
        this.frais.fk_credit_param_frais = null
        this.frais.designation = null
        this.frais.devise = null
      }
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.frais)
        this.showDialog = false
      }
    },
    viderChamps () {
      this.selectedFrais = null
      this.frais = {}
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }
  }

}

</script>

<style lang="stylus"></style>
