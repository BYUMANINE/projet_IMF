<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 850px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouvel ': 'Mise à jours de l\''}}heritier</div>
          </div>
          <div
            class="col-auto"
            v-if="isAdd"
          >
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Vider formulaire"
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
              label="Appliquer"
              icon="las la-check-circle"
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
            <div class="q-mb-sm">
              <consigne title="Remarques">
                * Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires<br>
                * Rassurez-vous d'avoir completé toutes les informations requises avant d'enregistrer
              </consigne>
            </div>
            <q-form ref="myForm">
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col">
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >
                      IDENTITE DE L'HERITIER
                    </div>
                    <q-separator />
                    <div class="q-px-md q-pt-sm q-pb-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Nom</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.nom"
                            placeholder="Nom"
                            lazy-rules
                            :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Postnom</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.postnom"
                            placeholder="Postnom"
                            lazy-rules
                            :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label>Prenom</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.prenom"
                            placeholder="Prénom"
                            lazy-rules
                            :rules="[val => !val || val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="50"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Sexe</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            hide-selected
                            use-input
                            fill-input
                            v-model="heritier.sexe"
                            placeholder="Sexe"
                            lazy-rules
                            :options="['MASCULIN', 'FEMININ']"
                            :rules="[val => !!val || 'Choisissez le sexe']"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Lieu de naissance</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.lieu_naissance"
                            placeholder="Lieu"
                            lazy-rules
                            :rules="[val => !!val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Date de naissance</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model="heritier.date_naissance"
                            placeholder="Date de naissance"
                            mask="####-##-##"
                            lazy-rules
                            readonly
                            :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date',
                           val => this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                            @click="$refs.popup_dt_naissance.show()"
                          >
                            <template v-slot:append>
                              <q-icon
                                class="cursor-pointer"
                                name="las la-calendar"
                                style="font-size:25px"
                              >
                                <q-popup-proxy
                                  transition-show="scale"
                                  transition-hide="scale"
                                  ref="popup_dt_naissance"
                                >
                                  <q-date
                                    v-model="heritier.date_naissance"
                                    mask="YYYY-MM-DD"
                                    @input="() => $refs.popup_dt_naissance.hide()"
                                  />
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Etat civil</input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            hide-bottom-space
                            hide-selected
                            use-input
                            fill-input
                            v-model="heritier.etat_civil"
                            placeholder="Etat civil"
                            :options="['CELIBATAIRE','MARIE','DIVORCE','VEUF']"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez l\'état civil' ]"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label>Profession</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.profession"
                            placeholder="Profession"
                            lazy-rules
                            :rules="[val => !val || !!val && val.trim().length >= 2 ||'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label
                            required
                            info="Le numéro de téléphone doit commencer par le code du pays auquel appartient le numéro; Ex: +243994061228"
                          >Numéro de téléphone</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.phone"
                            placeholder="Ex: +243994367438"
                            lazy-rules
                            :rules="[ val => !val || this.$helper.isTelephone(val) || 'Numéro invalide',
                                      val => !val || val.length >= 12 || 'Pas moins de 12 chiffres',
                                      val => !val || val.length <= 14 || 'Pas plus de 14 chiffres']"
                            maxlength="16"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label>Adresse mail</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.email"
                            placeholder="Adresse email"
                            lazy-rules
                            :rules="[ val => !val || this.$helper.isMail(val) || 'Adresse mail invalide']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label required>Nationalité</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.nationalite"
                            placeholder="Nationalité"
                            lazy-rules
                            :rules="[val =>val && val.trim().length > 2 ||'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label>Adresse complete</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.adresse"
                            placeholder="Adresse"
                            lazy-rules
                            :rules="[val => !val || val && val.trim().length >= 2 || 'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                          <input-label>Lien familial</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.lien_familial"
                            placeholder="Lien familial"
                            lazy-rules
                            :rules="[val => !val || val && val.trim().length >= 2 || 'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm col-md col-lg col-xl">
                          <input-label>Détails à préciser</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="heritier.description"
                            placeholder="Détails à préciser"
                            lazy-rules
                            :rules="[val => !val || val && val.trim().length >= 2 || 'Minimun 3 caractères']"
                            maxlength="255"
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
  name: 'dialogHeritier',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      heritier: {},

      pays: [],
      paysTemps: [],

      provinces: [],
      provincesTemps: []
    }
  },
  props: {
    value: Boolean,
    selectedHeritier: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.paysTemps = this.$datas.pays
    this.provincesTemps = this.$datas.provinces
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedHeritier != null) {
          this.heritier = { ...this.selectedHeritier }
        } else {
          this.heritier = {}
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
    filterProvinces (val, update, abort) {
      update(() => {
        this.provinces = this.provincesTemps.filter(e => e.toLowerCase().indexOf(val.toLowerCase()) > -1)
        if (this.provinces.length === 0) {
          this.provinces.push(val)
        }
      })
    },
    filterPays (val, update, abort) {
      update(() => {
        this.pays = this.paysTemps.filter(e => e.nom.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.code_pays.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.heritier)
      }
    },
    viderChamps () {
      this.heritier = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
