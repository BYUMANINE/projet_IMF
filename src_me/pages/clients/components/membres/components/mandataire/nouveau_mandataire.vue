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
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}mandataire</div>
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
                        IDENTITE DU MANDATAIRE
                      </div>
                      <q-separator />
                      <div class="q-px-md q-pt-sm q-pb-md">
                        <div class="row q-col-gutter-md items-center">
                          <div class="col-xs-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto">
                            <div class="text-center">
                              <input
                                ref="fileComputer"
                                type="file"
                                @change="onInputFileChange"
                                style="display:none"
                                accept="image/x-png, image/jpg, image/jpeg"
                              >
                              <div class="relative-position contStylephoto">
                                <q-img
                                  :src="!!mandataire.new_photo ? mandataire.new_photo : (!!mandataire.photo ?  `${URLS.IMG_MANDATAIRE}/${mandataire.photo}` :'statics/images/icone/avatar.png')"
                                  spinner-color="white"
                                  spinner-size="35px"
                                  class="stylePhoto bg-blue-1"
                                />
                                <div style="position:absolute;bottom:-10px;left:0;right:0;z-index:2">
                                  <div class="row q-col-gutter-sm justify-center items-center">
                                    <div class="col-auto">
                                      <q-btn
                                        text-color="blue"
                                        color="white"
                                        size="11px"
                                        round
                                        @click="choosePhoto()"
                                      >
                                        <q-icon
                                          class="las la-camera"
                                          size="17px"
                                        />
                                      </q-btn>
                                    </div>
                                    <div
                                      class="col-auto"
                                      v-if="!!mandataire.new_photo"
                                    >
                                      <q-btn
                                        text-color="blue"
                                        color="white"
                                        size="11px"
                                        round
                                        @click="clearPhoto()"
                                      >
                                        <q-icon
                                          class="las la-times"
                                          size="17px"
                                        />
                                      </q-btn>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md col-lg col-xl q-mt-none q-pt-none">
                            <div class="row q-col-gutter-sm items-center">
                              <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                                <input-label required>Nom</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="mandataire.nom"
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
                                  v-model.trim="mandataire.postnom"
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
                                  v-model.trim="mandataire.prenom"
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
                                  v-model="mandataire.sexe"
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
                                  v-model.trim="mandataire.lieu_naissance"
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
                                  v-model="mandataire.date_naissance"
                                  placeholder="Date de naissance"
                                  mask="####-##-##"
                                  lazy-rules
                                  readonly
                                  :rules="[val => !!val &&  val.length > 0  || 'Sélectionner une date',
                                           val => this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                                  @click="$refs.popup_dt_naissance.show()"
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
                                        ref="popup_dt_naissance"
                                      >
                                        <q-date
                                          v-model="mandataire.date_naissance"
                                          mask="YYYY-MM-DD"
                                          @input="() => $refs.popup_dt_naissance.hide()"
                                        />
                                      </q-popup-proxy>
                                    </q-icon>
                                  </template>
                                </q-input>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row q-col-gutter-sm">

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
                              v-model="mandataire.etat_civil"
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
                              v-model.trim="mandataire.nationalite"
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
                              v-model.trim="mandataire.profession"
                              placeholder="Profession"
                              lazy-rules
                              :rules="[val =>!!val || val.trim().length > 2 ||'Minimun 3 caractères']"
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
                              v-model.trim="mandataire.phone"
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
                              v-model.trim="mandataire.email"
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
                              v-model.trim="mandataire.avenue"
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
                              v-model.trim="mandataire.quartier"
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
                              v-model.trim="mandataire.commune"
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
                              v-model.trim="mandataire.ville"
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
                              v-model="mandataire.province"
                              :options="provinces"
                              :option-value="opt => opt"
                              :option-label="opt => `${opt}`"
                              @filter="filterProvinces"
                              lazy-rules
                              :rules="[ val => !!val || 'Séléctionner une province']"
                            >
                              <template #no-option>
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
                              v-model="mandataire.pays"
                              :options="pays"
                              :option-value="opt => opt ? (typeof opt === 'string' ? opt : opt.nom) : null "
                              :option-label="opt => (typeof opt === 'string' ? opt : opt.nom)"
                              @filter="filterPays"
                              lazy-rules
                              :rules="[ val => !!val || 'Séléctionner un pays']"
                            >
                              <template #no-option>
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
                              clearable
                              v-model="mandataire.type_piece"
                              placeholder="Type de la pièce présentée"
                              lazy-rules
                              :options="['CARTE ELECTEUR','VISA','PASSEPORT','ATTESTATION DE PERTE DE PIECE','AUTRES']"
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
                              v-model.trim="mandataire.num_piece"
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
                              v-model="mandataire.date_expiration"
                              placeholder="Date d'expiration de la pièce"
                              lazy-rules
                              mask="####-##-##"
                              readonly
                              :rules="[val => !!val || 'Séléctionner la date']"
                            >
                              <template #append>
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
                                      v-model="mandataire.date_expiration"
                                      mask="YYYY-MM-DD"
                                      @input="$refs.popup_proxy.hide()"
                                    ></q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Signature du mandataire</input-label>
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
                              lazy-rules
                              :rules="[ val => (!!mandataire.new_signature || !!mandataire.signature)  || 'Sélectionner la signature']"
                            >
                              <template #control>
                                <div
                                  class="self-center full-width no-outline"
                                  tabindex="0"
                                >{{(!!mandataire.new_signature || !!mandataire.signature) ? 'SIGNATURE JOINTE': 'Non définie'}}</div>
                              </template>
                              <template #prepend>
                                <div>
                                  <q-icon name="las la-signature" />
                                </div>
                              </template>
                              <template #append>
                                <div>
                                  <q-btn
                                    @click="mandataire.new_signature ? mandataire.new_signature  = null : $refs.inputSign.click()"
                                    color="white"
                                    text-color="black"
                                    :icon="mandataire.new_signature ? 'close' :'las la-paperclip'"
                                    unelevated
                                    round
                                    size="12px"
                                  />
                                </div>
                              </template>
                            </q-field>
                          </div>
                          <div class="col-xs-12 col-sm col-md col-lg col-xl">
                            <input-label required>Relation ou lien familial avec le membre</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="mandataire.relation"
                              placeholder="Préciser le lien avec le membre"
                              lazy-rules
                              :rules="[val => !!val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                              maxlength="50"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Pouvoir du mandataire sur ce compte</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              hide-bottom-space
                              use-input
                              fill-input
                              multiple
                              clearable
                              v-model="mandataire.pouvoirs"
                              placeholder="Limites"
                              lazy-rules
                              class="mrg"
                              :options="pouvoirsMandataire"
                              :rules="[val => !!val || 'Choisissez les options']"
                            />
                          </div>

                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label required>Niveau du mandat</input-label>
                            <q-select
                              transition-show="scale"
                              transition-hide="scale"
                              square
                              outlined
                              dense
                              hide-bottom-space
                              use-input
                              fill-input
                              clearable
                              v-model="mandataire.niveau_mandat"
                              placeholder="Niveau"
                              lazy-rules
                              class="mrg"
                              :options="['Signe seul','Double signatures']"
                              :rules="[val => !!val || 'Choisissez une option']"
                            />
                          </div>
                          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <input-label>Durée du mandat</input-label>
                            <q-input
                              square
                              outlined
                              dense
                              hide-bottom-space
                              v-model.trim="mandataire.date_limite_mandat"
                              placeholder="Date limite du mandat"
                              mask="####-##-##"
                              lazy-rules
                              clearable
                              readonly
                              :rules="[val => !val || !!val &&  val.length > 0  || 'Sélectionner une date']"
                              @click="$refs.popup_dt_limit.show()"
                            >
                              <template #append>
                                <div class="row q-col-gutter-sm">
                                  <div class="col-auto">
                                    <q-icon
                                      class="cursor-pointer"
                                      name="las la-calendar"
                                      style="font-size:25px"
                                    >
                                      <q-popup-proxy
                                        transition-show="scale"
                                        transition-hide="scale"
                                        ref="popup_dt_limit"
                                      >
                                        <q-date
                                          v-model.trim="mandataire.date_limite_mandat"
                                          mask="YYYY-MM-DD"
                                          @input="() => $refs.popup_dt_limit.hide()"
                                        />
                                      </q-popup-proxy>
                                    </q-icon>
                                  </div>
                                  <div
                                    class="col-auto"
                                    v-if="!!mandataire.date_limite_mandat"
                                  >
                                    <q-btn
                                      color="grey"
                                      text-color="white"
                                      size="7px"
                                      round
                                      unelevated
                                      @click="mandataire.date_limite_mandat=null"
                                    >
                                      <q-icon
                                        size="16px"
                                        name="close"
                                      />
                                    </q-btn>

                                  </div>
                                </div>
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

    <webcamManager
      v-if="showDialogWebcame"
      @onclose="showDialogWebcame = false"
      @onFinish="e=>{mandataire.new_photo=e;showDialogWebcame = false}"
    />
  </div>
</template>

<script>
import webcamManager from '../../../../../webcam/webcams_manager.vue'
export default {
  name: 'dialogActionnaire',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDialogWebcame: false,
      mandataire: {},

      pays: [],
      paysTemps: [],

      provinces: [],
      provincesTemps: [],

      pouvoirsMandataire: [
        'DEPOT',
        'RETRAIT',
        'VIREMENT'
        // 'EMPRUNT',
        // 'SOUSCRIPTION DAT',
        // 'SOUSCRIPTION DARS',
        // 'RETIRER LES CORRESPONSACES ET LES RELEVES DE COMPTE'
      ]

    }
  },
  props: {
    value: Boolean,
    selectedMandataire: {},
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
        if (this.selectedMandataire != null) {
          this.mandataire = { ...this.selectedMandataire }
        } else {
          this.mandataire = {}
        }
      }
    }
  },
  components: {
    webcamManager
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
    choosePhoto () {
      this.$q.bottomSheet({
        message: 'Mode de selection image',
        grid: false,
        actions: [
          {},
          {
            label: 'Capturer via le webcam',
            img: 'statics/images/icone/photo.png',
            id: 'camera'
          },
          {
            label: 'Sélectionner une image existante',
            img: 'statics/images/icone/image.png',
            id: 'storage'
          }

        ]
      }).onOk(action => {
        if (action.id === 'camera') {
          this.showDialogWebcame = true
        } else if (action.id === 'storage') {
          this.$refs.fileComputer.click()
        }
      })
    },
    clearPhoto () {
      this.mandataire.new_photo = null
      this.$forceUpdate()
    },
    onInputFileChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.mandataire, 'new_photo', e1.target.result)
              e.target.value = null
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            this.$helper.showMessage('Le format de fichier n\'est pas pris en charge')
          }
        } else {
          this.$helper.showMessage('Séléction de la photo annulée')
        }
      }
    },
    onInputSignChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.mandataire, 'new_signature', e1.target.result)
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
    onSubmit (isSucess) {
      if (isSucess) {
        this.$emit('onFinish', this.mandataire)
      }
    },
    viderChamps () {
      this.mandataire = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
