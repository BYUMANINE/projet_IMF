<template>
  <div class="panel-primary">
    <div class="row q-col-gutter-md ">
      <!-- ******************************************* -->
      <!-- ******************************************* -->
      <!-- ************** IDENTITE ******************* -->
      <!-- ******************************************* -->
      <!-- ******************************************* -->
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <div class="ba overflow-hidden panel-primary">
          <div class="row items-center">
            <div class="col">
              <div
                class="q-py-xs q-px-sm text-h6"
                style="font-size:14px"
              >INFORMATIONS SUR L'ENTREPRISE <span
                  class="text-primary"
                  v-if="identite.folio"
                >[ {{identite.folio}} ]</span></div>
            </div>
            <div
              class="col-auto q-py-xs q-pr-md"
              v-if="identite.folio"
            >
              <q-btn
                color="blue-1"
                text-color="primary"
                icon="las la-copy"
                unelevated
                round
                size="sm"
                @click="$helper.copy(identite.folio)"
              >
                <q-tooltip>
                  Copier le code de l'identite
                </q-tooltip>

              </q-btn>
            </div>
          </div>
          <q-separator />
          <div class="q-px-md q-pt-sm q-pb-md">
            <div class="row q-col-gutter-md items-center">
              <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
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
                      :src="!!identite.new_photo ? identite.new_photo : (!!identite.photo ?  `${URLS.IMG_MEMBRE}/${identite.photo}` :'statics/images/icone/avatar.png')"
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
                          v-if="identite.new_photo"
                        >
                          <q-btn
                            text-color="blue"
                            color="white"
                            size="11px"
                            round
                            @click="identite.new_photo = null"
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
              <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                <div class="row">
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label
                      required
                      info="Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires"
                    >Nom</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.nom"
                      placeholder="Nom"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Postnom</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.postnom"
                      placeholder="Postnom"
                      lazy-rules
                      :rules="[ val => val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label>Prenom</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.prenom"
                      placeholder="Prenom"
                      lazy-rules
                      :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                      maxlength="50"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Sexe</input-label>
                    <q-select
                      :disable="!(!!identite)"
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      hide-selected
                      use-input
                      fill-input
                      v-model="identite.sexe"
                      placeholder="Séléctionner le sexe"
                      lazy-rules
                      :options="['MASCULIN','FEMININ']"
                      :rules="[val => !!val || 'Choisissez une option']"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Etat civil</input-label>
                    <q-select
                      :disable="!(!!identite)"
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      hide-selected
                      use-input
                      fill-input
                      v-model="identite.etat_civil"
                      placeholder="Séléctionner l'etat"
                      lazy-rules
                      :options="['CELIBATAIRE','MARIE(E)','VEUF(VE)','DIVORCE(E)']"
                      :rules="[val => !!val || 'Choisissez une option']"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <input-label required>Lieu de naissance</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.lieu_naissance"
                      placeholder="Lieu"
                      lazy-rules
                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                      maxlength="150"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-sm">

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Date de naissance</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.date_naissance"
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
                          v-model="identite.date_naissance"
                          mask="YYYY-MM-DD"
                          @input="() => $refs.popup_dt_naissance.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Profession</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.profession"
                  placeholder="Profession"
                  lazy-rules
                  :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Nombre d'enfants</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.nb_enfant"
                  placeholder="Nombre"
                  lazy-rules
                  :rules="[ val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres']"
                  maxlength="3"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
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
                  v-model="identite.secteur"
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
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Autres activités</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.autres_activites"
                  placeholder="Autres activités"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="200"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Lieu d'activité</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.lieu_activite"
                  placeholder="Lieu"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Revenu mensuel moyen ({{user.devise}})</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.revenu_moyen"
                  :placeholder="`Revenu mensuel (${user.devise})`"
                  lazy-rules
                  :rules="[ val => !val || !!val && val.trim().length > 0 || 'Champs requis',
                            val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                            val => !val || parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                  maxlength="7"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Propriétaire d'autres comptes ailleurs ?</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.autres_banques"
                  placeholder="Si oui, quelles Banques, cooperatives ou IMF"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length >= 3 || 'Minimun 3 caractères']"
                />
              </div>
              <div class="col-12">
                <input-label required>Exercez-vous ou avez-vous exerce une activité publique ?</input-label>
                <q-select
                  :disable="!(!!identite)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-selected
                  use-input
                  fill-input
                  v-model="identite.activite_publique"
                  placeholder="Choisissez une option"
                  lazy-rules
                  :options="['OUI', 'NON']"
                  :rules="[val => !!val || 'Choisissez une option']"
                />
              </div>
              <div
                class="col-12"
                v-if="identite.activite_publique==='OUI'"
              >
                <input-label>Si oui, veuillez préciser la fonction / Grade</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.fonction_publique"
                  placeholder="Fonction publique"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length >= 3 || 'Minimun 3 caractères']"
                />
              </div>

              <div class="col-12">
                <input-label required>Etes-vous apparenté ou proche associé d'une personne exercant une activité publique ?</input-label>
                <q-select
                  :disable="!(!!identite)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-selected
                  use-input
                  fill-input
                  v-model="identite.proche_activite_publique"
                  placeholder="Choisissez une option"
                  lazy-rules
                  :options="['OUI', 'NON']"
                  :rules="[val => !!val || 'Choisissez une option']"
                />
              </div>
              <div
                class="col-12"
                v-if="identite.proche_activite_publique==='OUI'"
              >
                <input-label>Si oui, indiquez le lien avec cette personne</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.lien_personne_publique"
                  placeholder="Lien"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length >= 3 || 'Minimun 3 caractères']"
                />
              </div>

              <div class="col-12">
                <input-label required>Etes-vous propriétaire des avoirs logés sur le compte ?</input-label>
                <q-select
                  :disable="!(!!identite)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  hide-selected
                  use-input
                  fill-input
                  v-model="identite.avoirs_loges"
                  placeholder="Choisissez une option"
                  lazy-rules
                  :options="['OUI', 'NON']"
                  :rules="[val => !!val || 'Choisissez une option']"
                />
              </div>
              <div
                class="col-12"
                v-if="identite.avoirs_loges === 'NON'"
              >
                <input-label>Sinon, indiquez le lien et les noms de bénéficiaires effectifs</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.beneficiaire_avoirs"
                  placeholder="Bénéficiaires"
                  lazy-rules
                  :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="ba overflow-hidden panel-primary">
              <div class="row items-center q-py-xs q-px-sm">
                <div
                  class="col text-h6"
                  style="font-size:14px"
                >PIECES</div>
              </div>
              <q-separator />
              <div class="q-px-md q-pt-sm q-pb-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <input-label>N° d'impôt</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.numero_impot"
                      placeholder="Numéro d'impot"
                      lazy-rules
                      :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-12">
                    <input-label required>Type de pièce d'identité</input-label>
                    <q-select
                      :disable="!(!!identite)"
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      hide-selected
                      use-input
                      fill-input
                      v-model="identite.type_piece"
                      placeholder="Type de pièce d'indentité"
                      lazy-rules
                      :options="types_pieces"
                      :rules="[val => !!val || 'Choisissez une option']"
                    />
                  </div>
                  <div class="col-12">
                    <input-label required>Numéro de la pièce</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.num_piece"
                      placeholder="N* de la pièce"
                      lazy-rules
                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                      maxlength="100"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Lieu de délivrance</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.lieu_delivrance"
                      placeholder="Lieu"
                      lazy-rules
                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                      maxlength="150"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Pièce valide jusqu'au</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.expiration_piece"
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
                              v-model="identite.expiration_piece"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_piece.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <input-label required>Nationalité</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.nationalite"
                      placeholder="Nationalité"
                      lazy-rules
                      :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                      maxlength="150"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="ba overflow-hidden panel-primary">
              <div class="row items-center q-py-xs q-px-sm">
                <div
                  class="col text-h6"
                  style="font-size:14px"
                >AUTRES DETAILS A PRECISER</div>
              </div>
              <q-separator />
              <div class="q-mt-none q-px-md q-pb-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <input-label required>Signature membre</input-label>
                    <input
                      type="file"
                      ref="inputSign"
                      style="display:none"
                      @change="onInputSignChange"
                      accept="image/x-png, image/jpg, image/jpeg"
                    >
                    <q-field
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      lazy-rules
                      :rules="[ val => (!!identite.new_signature || !!identite.signature) || 'Sélectionner la signature']"
                    >
                      <template v-slot:control>
                        <div
                          class="self-center full-width no-outline"
                          tabindex="0"
                        >{{(!!identite.new_signature || !!identite.signature) ? 'SIGNATURE JOINTE': 'Non définie'}}</div>
                      </template>
                      <template v-slot:prepend>
                        <div>
                          <q-icon name="las la-signature" />
                        </div>
                      </template>
                      <template v-slot:append>
                        <div>
                          <q-btn
                            @click="!!identite.new_signature ? identite.new_signature = null : $refs.inputSign.click()"
                            color="white"
                            text-color="black"
                            :icon="!!identite.new_signature ? 'close' :'las la-paperclip'"
                            unelevated
                            round
                            size="12px"
                          />
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div class="col-12">
                    <input-label>Catégorie</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      placeholder="Catégorie"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      clearable
                      v-model="identite.categorie"
                      :options="categories"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.designation}`"
                      @filter="filterCategories"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-red">
                            Aucune catégorie trouvée
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12">
                    <input-label>Membre sensibilisé par</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.sensibilateur "
                      placeholder="Sensibilisateur"
                      lazy-rules
                      :rules="[ val => !val || val.trim().length >= 3 || 'Minimun 3 caractères']"
                    />
                  </div>
                  <div class="col-12">
                    <input-label>Détails à préciser</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.description"
                      placeholder="Préciser d'autres détails à savoir sur l'entreprise (Facultatif)"
                      lazy-rules
                      :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                      type="textarea"
                      rows="2"
                      maxlength="255"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <webcamManager
      v-if="showDialogWebcame"
      @onclose="showDialogWebcame = false"
      @onFinish="e=>{identite.new_photo=e;showDialogWebcame = false}"
    />

    <nouveauSecteur
      v-model="showDlgSecteur"
      :isAdd="true"
    />
  </div>
</template>

<script>
import webcamManager from '../../../../../../webcam/webcams_manager.vue'
// import nouveauSecteur from '../../../../../../parametres/components/secteurs_activite/nouveau_secteur.vue'
import nouveauSecteur from '../../../../secteurs_activite/nouveau_secteur.vue'
export default {
  name: 'step_identite',
  data () {
    return {
      URLS: {},

      showDialogWebcame: false,
      showDlgSecteur: false,

      types_pieces: this.$datas.pieces,
      secteurs: [],
      categories: []
    }
  },
  props: ['value', 'user'],
  watch: {},
  components: {
    webcamManager,
    nouveauSecteur
  },
  computed: {
    identite: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  methods: {
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
            label: 'Selectionner une image existante',
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
    onInputFileChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.identite, 'new_photo', e1.target.result)

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
              this.$vue.set(this.identite, 'new_signature', e1.target.result)
              e.target.value = null
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
    filterCategories (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val
      })

      let url = `${this.URLS.BASE_URL}/Categorie/searchCategories`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$helper.checkResponse(infos.data)

        update(() => {
          this.categories = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.categories = []
        })
      })
    }
  }
}
</script>

<style>
</style>
