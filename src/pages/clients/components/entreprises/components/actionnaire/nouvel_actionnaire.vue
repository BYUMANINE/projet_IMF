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
              <div class="text-h6">{{isAdd?'Nouvel ': 'Mise à jours de l\''}}actionnaire</div>
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
                label="Valider"
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
                        IDENTITE DE L'ACTIONNAIRE
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
                              v-model.trim="actionnaire.nom"
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
                              v-model.trim="actionnaire.postnom"
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
                              v-model.trim="actionnaire.prenom"
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
                              v-model="actionnaire.sexe"
                              placeholder="Sexe"
                              lazy-rules
                              :options="['MASCULIN', 'FEMININ']"
                              :rules="[val => !!val || 'Choisissez le sexe']"
                            />
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
                              v-model="actionnaire.etat_civil"
                              placeholder="Etat civil"
                              :options="['CELIBATAIRE','MARIE','DIVORCE','VEUF']"
                              lazy-rules
                              :rules="[val => !!val || 'Choisissez l\'état civil' ]"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Nationalité</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.nationalite"
                              placeholder="Nationalité"
                              lazy-rules
                              :rules="[val =>val && val.trim().length > 2 ||'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Profession</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.profession"
                              placeholder="Profession"
                              lazy-rules
                              :rules="[val =>val && val.trim().length > 2 ||'Minimun 3 caractères']"
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
                              v-model.trim="actionnaire.phone"
                              placeholder="Ex: +243994367438"
                              lazy-rules
                              :rules="[ val => val && val.length > 0 || 'Champs requis',
                                      val => this.$helper.isTelephone(val) || 'Numéro invalide',
                                      val => val.length >= 12 || 'Pas moins de 12 chiffres',
                                      val => val.length <= 14 || 'Pas plus de 14 chiffres']"
                              maxlength="14"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Adresse mail</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.email"
                              placeholder="Adresse email"
                              lazy-rules
                              :rules="[ val => !val || this.$helper.isMail(val) || 'Adresse mail invalide']"
                              maxlength="150"
                            />
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Avenue/ Village</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.avenue"
                              placeholder="Avenue/village"
                              lazy-rules
                              :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Quartier/ Groupement</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.quartier"
                              placeholder="Quartier/Groupement *"
                              lazy-rules
                              :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Commune/ Territoire</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.commune"
                              placeholder="Commune/Territoire *"
                              lazy-rules
                              :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Ville </input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.ville"
                              placeholder="Ville *"
                              lazy-rules
                              :rules="[val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Province</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Séléctionner une province"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              clearable
                              use-input
                              emit-value
                              map-options
                              v-model="actionnaire.province"
                              :options="provinces"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt}`"
                              @filter="filterProvinces"
                              lazy-rules
                              :rules="[ val => !!val || 'Séléctionner une province']"
                            >
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-primary">
                                    Saisissez le nom de la province
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Pays</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Séléctionner un pays"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              clearable
                              use-input
                              emit-value
                              map-options
                              v-model="actionnaire.pays"
                              :options="pays"
                              :option-value="opt => opt ? (typeof opt === 'string' ? opt : opt.nom) : null "
                              :option-label="opt => (typeof opt === 'string' ? opt : opt.nom)"
                              @filter="filterPays"
                              lazy-rules
                              :rules="[ val => !!val || 'Séléctionner un pays']"
                            >
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-primary">
                                    Aucun pays trouvé
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-select>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Type de pièce</input-label>
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
                              v-model="actionnaire.type_piece"
                              placeholder="Type de la pièce présentée"
                              lazy-rules
                              :options="['CARTE ELECTEUR','VISA','PASSEPORT','ATTESTATION','AUTRES']"
                              :rules="[val => !!val || 'Choisissez le type de pièce']"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Numéro de la pièce</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.num_piece"
                              placeholder="Numéro de la pièce"
                              lazy-rules
                              :rules="[val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                              maxlength="50"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Date d'expiration de la pièce</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="actionnaire.date_expiration"
                              placeholder="Date d'expiration de la pièce"
                              lazy-rules
                              mask="####-##-##"
                              readonly
                              :rules="[val => !!val || 'Séléctionner la date']"
                              @click="$refs.popup_proxy.show()"
                            >
                              <template v-slot:append>
                                <q-icon
                                  name="las la-calendar"
                                  class="cursor-pointer"
                                >
                                  <q-popup-proxy
                                    transition-show="scale"
                                    transition-hide="scale"
                                    ref="popup_proxy"
                                  >
                                    <q-date
                                      v-model="actionnaire.date_expiration"
                                      mask="YYYY-MM-DD"
                                      @input="$refs.popup_proxy.hide()"
                                    ></q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md col-lg col-xl">
                            <input-label required>N° RCCM/Patente</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="actionnaire.num_rccm"
                              placeholder="RCCM"
                              lazy-rules
                              :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                              maxlength="60"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md col-lg col-xl">
                            <input-label required>Secteur d'activité</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              placeholder="Secteur d'activité"
                              fill-input
                              hide-selected
                              hide-bottom-space
                              use-input
                              emit-value
                              map-options
                              v-model="actionnaire.secteur"
                              :options="secteurs"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt.designation}`"
                              @filter="filterSecteurs"
                              lazy-rules
                              :rules="[ val => !!val || 'Selectionner un secteur']"
                            >
                              <template v-slot:no-option>
                                <q-item>
                                  <q-item-section class="text-red">
                                    Aucun secteur trouvé
                                  </q-item-section>
                                </q-item>
                              </template>
                              <template v-slot:after>
                                <q-btn
                                  color="blue-1"
                                  text-color="primary"
                                  icon="add"
                                  unelevated
                                  @click="showDlgSecteur=true"
                                />
                              </template>
                            </q-select>
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md col-lg col-xl">
                            <input-label>Signature de l'actionnaire</input-label>
                            <input
                              type="file"
                              ref="inputSign"
                              style="display:none"
                              @change="onInputSignChange"
                              accept="image/x-png, image/jpg, image/jpeg"
                            >
                            <q-field
                              square
                              outlined
                              dense
                              hide-bottom-space
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >{{(!!actionnaire.new_signature || !!actionnaire.signature) ? 'SIGNATURE JOINTE': 'Non définie'}}</div>
                              </template>
                              <template #prepend>
                                <div>
                                  <q-icon name="las la-signature" />
                                </div>
                              </template>
                              <template #append>
                                <div>
                                  <q-btn
                                    @click="actionnaire.new_signature ? actionnaire.new_signature  = null : $refs.inputSign.click()"
                                    color="white"
                                    text-color="black"
                                    :icon="actionnaire.new_signature ? 'close' :'las la-paperclip'"
                                    unelevated
                                    round
                                    size="12px"
                                  />
                                </div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-12 q-mt-sm">
                            <q-card
                              flat
                              bordered
                            >
                              <q-card-section class="q-pa-none">
                                <div class="q-px-md q-py-sm text-primary">
                                  <strong>Informations en lien avec l'entreprise</strong>
                                </div>
                                <q-separator />
                              </q-card-section>
                              <q-card-section>
                                <div class="row q-col-gutter-sm">
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <input-label required>Fontion dans l'entreprise</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="actionnaire.fonction"
                                      placeholder="Fonction"
                                      lazy-rules
                                      :rules="[val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="50"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <input-label required>Part social (En pourcentage)</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="actionnaire.part_sociale"
                                      placeholder="Part social"
                                      lazy-rules
                                      :rules="[ val => !!val && this.$helper.isNumeric(val) || 'Uniquement les chiffres']"
                                      maxlength="50"
                                    >
                                      <template v-slot:append>
                                        <div
                                          class="text-bold"
                                          style="font-size:18px"
                                        >%</div>
                                      </template>
                                    </q-input>
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <input-label required>Fait-il parti des mandataires du compte ?</input-label>
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
                                      v-model="actionnaire.is_mandataire"
                                      placeholder="Mandataire"
                                      lazy-rules
                                      :options="['OUI', 'NON']"
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <input-label required>Est-il le responsable de l'entreprise ?</input-label>
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
                                      v-model="actionnaire.is_responsable"
                                      placeholder="Responsable"
                                      lazy-rules
                                      :options="['OUI', 'NON']"
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    />
                                  </div>
                                </div>
                              </q-card-section>
                            </q-card>

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

    <nouveauSecteur
      v-model="showDlgSecteur"
      :isAdd="true"
    />
  </div>
</template>

<script>
import nouveauSecteur from '../../../secteurs_activite/nouveau_secteur.vue'

export default {
  name: 'dialogActionnaire',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgSecteur: false,
      actionnaire: {},

      pays: [],
      provinces: [],
      secteurs: [],

      paysTemps: this.$datas.pays,
      provincesTemps: this.$datas.provinces
    }
  },
  props: {
    value: Boolean,
    selectedActionnaire: {},
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
        if (this.selectedActionnaire != null) {
          this.actionnaire = { ...this.selectedActionnaire }
        } else {
          this.actionnaire = {}
        }
      }
    }
  },
  components: {
    nouveauSecteur
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },

  methods: {
    onInputSignChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.actionnaire, 'new_signature', e1.target.result)
              e.target.value = null
              this.$refs.myForm.resetValidation()
              this.$refs.myForm.validate()
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            this.$helper.showMessage('Le format de fichier n\'est pas pris en charge')
          }
        } else {
          this.$helper.showMessage('Séléction de la signature annulée')
        }
      }
    },
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
    filterSecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val
      })

      let url = `${this.URLS.BASE_URL}/Secteur/searchSecteurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.secteurs = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.secteurs = []
        })
      })
    },
    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.actionnaire)
      }
    },
    viderChamps () {
      this.actionnaire = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
