<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 850px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

            <div class="col">
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}membre</div>
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
                        IDENTITE DU MEMBRE
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
                              v-model.trim="membre.nom"
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
                              v-model.trim="membre.postnom"
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
                              v-model.trim="membre.prenom"
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
                              v-model="membre.sexe"
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
                              v-model.trim="membre.lieu_naissance"
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
                              v-model="membre.date_naissance"
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
                                      v-model="membre.date_naissance"
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
                              v-model="membre.etat_civil"
                              placeholder="Etat civil"
                              :options="['CELIBATAIRE','MARIE','DIVORCE','VEUF']"
                              lazy-rules
                              :rules="[val => !!val || 'Choisissez l\'état civil' ]"
                            />
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label info="Le numéro de téléphone doit commencer par le code du pays auquel appartient le numéro; Ex: +243994061228">Numéro de téléphone</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model="membre.phone1"
                              placeholder="Numéro"
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
                              v-model.trim="membre.email"
                              placeholder="Adresse email"
                              lazy-rules
                              :rules="[ val => !val || this.$helper.isMail(val) || 'Adresse mail invalide']"
                              maxlength="150"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Profession</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="membre.profession"
                              placeholder="Profession"
                              lazy-rules
                              :rules="[val => !val || !!val && val.trim().length > 2 ||'Minimun 3 caractères']"
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
                              v-model.trim="membre.nationalite"
                              placeholder="Nationalité"
                              lazy-rules
                              :rules="[val =>val && val.trim().length > 2 ||'Minimun 3 caractères']"
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
                              v-model.trim="membre.avenue"
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
                              v-model.trim="membre.quartier"
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
                              v-model.trim="membre.commune"
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
                              v-model.trim="membre.ville"
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
                              v-model="membre.province"
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
                              v-model="membre.pays"
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
                              v-model="membre.secteur"
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

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Revenu mensuel moyen ({{user.devise}})</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="membre.revenu_moyen"
                              :placeholder="`Revenu mensuel (${user.devise})`"
                              lazy-rules
                              :rules="[ val => !val || !!val && val.trim().length > 0 || 'Champs requis',
                                        val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                        val => !val || parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                              maxlength="7"
                            />
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Autres activités</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="membre.autres_activites"
                              placeholder="Autres activités"
                              lazy-rules
                              :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                              maxlength="200"
                            />
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Signature du membre</input-label>
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
                                >{{(!!membre.new_signature || !!membre.signature) ? 'SIGNATURE JOINTE': 'Non définie'}}</div>
                              </template>
                              <template #prepend>
                                <div>
                                  <q-icon name="las la-signature" />
                                </div>
                              </template>
                              <template #append>
                                <div>
                                  <q-btn
                                    @click="membre.new_signature ? membre.new_signature  = null : $refs.inputSign.click()"
                                    color="white"
                                    text-color="black"
                                    :icon="membre.new_signature ? 'close' :'las la-paperclip'"
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
                                  <strong>Pièces</strong>
                                </div>
                                <q-separator />
                              </q-card-section>
                              <q-card-section>
                                <div class="row q-col-gutter-sm">
                                  <div class="ol-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Type de pièce d'identité</input-label>
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
                                      v-model="membre.type_piece"
                                      placeholder="Type de pièce d'indentité"
                                      lazy-rules
                                      :options="types_pieces"
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    />
                                  </div>
                                  <div class="ol-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Numéro de la pièce</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="membre.num_piece"
                                      placeholder="N* de la pièce"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="100"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Lieu de délivrance</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="membre.lieu_delivrance"
                                      placeholder="Lieu"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="150"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <input-label required>Pièce valide jusqu'au</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model="membre.expiration_piece"
                                      placeholder="Date validité"
                                      mask="####-##-##"
                                      lazy-rules
                                      readonly
                                      :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                                      @click="$refs.popup_dt_piece.show()"
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
                                            ref="popup_dt_piece"
                                          >
                                            <q-date
                                              v-model="membre.expiration_piece"
                                              mask="YYYY-MM-DD"
                                              @input="() => $refs.popup_dt_piece.hide()"
                                            />
                                          </q-popup-proxy>
                                        </q-icon>
                                      </template>
                                    </q-input>
                                  </div>
                                </div>
                              </q-card-section>
                            </q-card>
                          </div>
                          <div class="col-12 q-mt-sm">
                            <q-card
                              flat
                              bordered
                            >
                              <q-card-section class="q-pa-none">
                                <div class="q-px-md q-py-sm text-primary">
                                  <strong>Informations en lien avec le groupe</strong>
                                </div>
                                <q-separator />
                              </q-card-section>
                              <q-card-section>
                                <div class="row q-col-gutter-sm">
                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                                    <input-label required>Fontion dans le groupe</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="membre.fonction"
                                      placeholder="Fonction"
                                      lazy-rules
                                      :rules="[val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                                      maxlength="50"
                                    />
                                  </div>

                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                                    <input-label required>Fait-il parti du comité du groupe ?</input-label>
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
                                      v-model="membre.in_comite"
                                      placeholder="Comité"
                                      lazy-rules
                                      :options="['OUI', 'NON']"
                                      :rules="[val => !!val || 'Choisissez une option']"
                                    />
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                                    <input-label required>Est-il le gestionnaire du groupe ?</input-label>
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
                                      v-model="membre.is_gestionnaire"
                                      placeholder="Gestionnaire"
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
  name: 'dialogMembre',
  data () {
    return {
      URLS: {},

      loading: false,
      showDlgSecteur: false,
      membre: {},

      secteurs: [],
      provinces: [],

      pays: [],
      paysTemps: this.$datas.pays,
      provincesTemps: this.$datas.provinces,
      types_pieces: this.$datas.pieces

    }
  },
  props: {
    value: Boolean,
    selectedMembre: {},
    isAdd: {
      type: Boolean,
      default: false
    },
    user: {}
  },
  components: {
    nouveauSecteur
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedMembre != null) {
          this.membre = { ...this.selectedMembre }
        } else {
          this.membre = {}
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
    onInputSignChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.membre, 'new_signature', e1.target.result)
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
        this.$emit('onFinish', this.membre)
      }
    },
    viderChamps () {
      this.membre = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
