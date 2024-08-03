<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 600px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouvelle ': 'Mise à jours de la '}} garantie</div>
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
                <!-- ************** SITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">

                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Designation de la garantie</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="garantie.proprietaire"
                            placeholder="Designation"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Description de la garantie</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="garantie.description"
                            placeholder="Description"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            maxlength="150"
                            type="textarea"
                            rows="2"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Valeur monnetaire de la garantie </input-label>
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                              <q-input
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="garantie.valeur"
                                placeholder="montant"
                                lazy-rules
                                :rules="[ val => val && val.trim().length > 1 || 'Minimun 2 Chiffres',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'La valeur doit être un chiffre positif',]"
                                class="mrg"
                                maxlength="15"
                              />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                              <q-select
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                dense
                                v-model="garantie.devise"
                                rounded
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                outlined
                                :options="['CDF','USD']"
                                placeholder="Devise"
                                lazy-rules
                                :rules="[val => !!val || 'Choisissez une option']"
                                @input=" $vue.set(garantie,'compte',null)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div class="row q-col-gutter-sm">
                          <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                            <input-label required>Numéro de la pièce</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="garantie.num_piece"
                              placeholder="Numèro de la pièce"
                              lazy-rules
                              :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                              class="mrg"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                            <input-label required>Date de validité </input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="garantie.date_fin_validite"
                              placeholder="Date de validité"
                              mask="####-##-##"
                              lazy-rules
                              readonly
                              :rules="[val => !!val &&  val.length > 0  || 'Sélectionner une date',
                                           val => this.$dateManager.inferieurEgalA(this.$helper.now('-'),val) || 'Doit être superieure à la date actuelle']"
                              @click="$refs.popup_dt_validite.show()"
                            >
                              <template #append>
                                <q-icon
                                  class="cursor-pointer"
                                  name="las la-calendar"
                                  style="font-size:25px"
                                >
                                  <q-popup-proxy
                                    transition-show="scale"
                                    transition-hide="scale"
                                    ref="popup_dt_validite"
                                  >
                                    <q-date
                                      v-model="garantie.date_fin_validite"
                                      mask="YYYY-MM-DD"
                                      @input="() => $refs.popup_dt_validite.hide()"
                                    />
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>

                        </div>
                      </div>
                      <div class="col-12">
                        <input-label required>Le type de garantie </input-label>
                        <q-select
                          :readonly="!(!!garantie.devise)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Sélectionner un type"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          v-model="garantie.type_garantie"
                          :options="TypeGaranties"
                          :option-value="opt => opt"
                          :option-label="opt => !!opt ? `${opt.designation} - ${opt.devise} `:''"
                          @filter="filterTypeGaranties"
                          lazy-rules
                          :rules="[val => !!val || 'Choisissez une option']"
                        >
                          <template v-slot:after>
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="add"
                              unelevated
                              @click="showDlgNewType=true"
                            />
                          </template>
                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun type trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-12">
                        <input-label required>Le choisir le garant </input-label>
                        <q-select
                          :readonly="!(!!garantie.type_garantie)"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          placeholder="Sélectionner un garant"
                          fill-input
                          hide-selected
                          hide-bottom-space
                          use-input
                          emit-value
                          map-options
                          v-model="garantie.garant"
                          :options="garants"
                          :option-value="opt => opt"
                          :option-label="opt => !!opt ? `${opt.nom_complet}`:''"
                          @filter="filterGarants"
                          lazy-rules
                          :rules="[val => !!val || 'Choisissez une option']"
                        >
                          <template v-slot:after>
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="add"
                              unelevated
                              @click="showDlgNewGarant=true"
                            />
                          </template>

                          <template #no-option>
                            <q-item>
                              <q-item-section class="text-red">
                                Aucun garant trouvé
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
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
    <nouveauTypeGarantie
      v-model="showDlgNewType"
      :selectedtypeGarantie="selectedtypeGarantie"
      :isAdd="isAddMod"
      @onFinish="getDatas()"
    />
    <nouveauGarant
      v-model="showDlgNewGarant"
      :selectedGarant="selectedGarant"
      :isAdd="isAddMod"
      @onFinish="getDatas()"
    />
  </q-dialog>
</template>

<script>
import nouveauGarant from '../garants/nouveau_garant.vue'
import nouveauTypeGarantie from '../type_garantie/nouveau_type_garantie.vue'
export default {
  name: 'dialogGarantie',
  data () {
    return {
      URLS: {},
      user: {},

      showDlgNewGarant: false,
      showDlgNewType: false,
      isAddMod: true,

      selectedtypeGarantie: null,
      selectedGarant: null,

      loading: false,
      garantie: {},
      TypeGaranties: [],
      garants: []
    }
  },
  props: {
    value: Boolean,
    selectedGarantie: null,
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
  components: {
    nouveauGarant, nouveauTypeGarantie
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedGarantie != null) {
          this.garantie = { ...this.selectedGarantie }
        } else {
          this.garantie = {}
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

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} cette garantie?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.garantie,
            id_agent: this.user.id,
            id_agence: this.user.agence.id,
            id_garant: this.garantie.garant.id,
            id_type_garantie: this.garantie.type_garantie.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Garantie/${this.isAdd ? 'addGarantie' : 'updateGarantie'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
              this.$refs.myForm.resetValidation()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'bottom')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    },
    filterTypeGaranties (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.garantie.devise

      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchTypeGarantie`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.TypeGaranties = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.TypeGaranties = []
        })
      })
    },
    filterGarants (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.garantie.devise

      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchGarants`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.garants = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.garants = []
        })
      })
    },
    viderChamps () {
      this.garantie = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
