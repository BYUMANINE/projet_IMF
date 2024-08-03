<template>
  <q-page class="filly-auto">
    <list-menu-options>
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="$emit('actualiser',true)"
      />

      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        v-if="!(_isLastStep && operation.step == 1)"
        :disable="operation.step == 1"
        text="Etape précédente"
        :icon="operation.step == 1 ? 'prev_desable.png' : 'prev.png'"
        @option-clicked="() => {if (operation.step > 1) {operation.step--}}"
      />
      <menu-option
        :text="`${_isLastStep ? 'Enregistrer l\'opération' : 'Etape suivante'}`"
        :icon="_isLastStep ? 'save.png' : 'next.png'"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />

      <menu-option
        text="Type encaissement"
        icon="option.png"
      >
        <subMenuOption
          v-model="selectedOption"
          :index="5"
          :options="options"
          @onOptionChanged="e=>$emit('onOptionChanged',e)"
        />
      </menu-option>

    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre>
        <template #titre>
          <span>{{selectedOption.label }} </span> |
          <span style="font-size:14px">{{caisseName }}</span>
        </template>
      </grandTitre>

      <div class="panel-primary">
        <div class="row">
          <div class="col-12">
            <q-form ref="myForm">
              <q-stepper
                v-model="operation.step"
                ref="stepper"
                color="primary"
                class="q-pa-none panel-primary q-pa-none-xs-stepper"
                transition-next="fade"
                transition-prev="fade"
                :vertical="$q.screen.lt.sm"
              >
                <q-step
                  :name="1"
                  title="Informations du collecteur"
                  icon="las la-portrait"
                  :done="operation.step > 1"
                >
                  <div class="row q-col-gutter-md">
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
                            >SELECTIONNER UN COLLECTEUR EAC<span
                                class="text-primary"
                                v-if="!!collecteur && !!collecteur.folio"
                              >[ {{collecteur.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="!!collecteur && !!collecteur.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(collecteur.folio)"
                            >
                              <q-tooltip>
                                Copier le code du collecteur
                              </q-tooltip>

                            </q-btn>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-md items-center">
                            <div class="col-xs-12 col-sm-auto col-md-auto col-lg-auto col-xl-auto">
                              <div class="text-center">

                                <div class=" contStylephoto">
                                  <q-img
                                    :src=" (!!collecteur && !!collecteur.photo ?  `${URLS.IMG_AGENT}/${collecteur.photo}` :'statics/images/icone/avatar.png')"
                                    spinner-color="white"
                                    spinner-size="35px"
                                    class="stylePhoto bg-blue-1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">

                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label required>Rechercher un collecteur</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Rechercher un collecteur"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    behavior="menu"
                                    v-model="collecteur"
                                    :options="collecteurs"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.nom_complet}`"
                                    @filter="filterCollecteurs"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner un collecteur']"
                                    @input="onCollecteurSelected"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label class="text-bold">{{scope.opt.nom_complet}}</q-item-label>
                                          <q-item-label
                                            caption
                                            class="text-grey"
                                          >
                                            FOLIO : {{scope.opt.folio}}
                                          </q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun collecteur trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                    <template #prepend>
                                      <q-icon name="search" />
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Sexe</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.sexe || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Date de naissance</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.date_naissance || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row q-col-gutter-sm">

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu de naissance</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!collecteur ? collecteur.lieu_naissance || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Profession</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!collecteur ? collecteur.profession || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Etat civil</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!collecteur ? collecteur.etat_civil || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Secteur d'activité</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!collecteur ? collecteur.secteur_str || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm col-md col-lg col-xl">
                              <input-label>Nationalité</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline"
                                    tabindex="0"
                                  >{{!!collecteur ? collecteur.nationalite || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
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

                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Type de pièce d'identité</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.type_piece || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Numéro de la pièce</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline text-bold text-primary"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.num_piece || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Lieu de délivrance</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.lieu_delivrance || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Pièce valide jusqu'au</input-label>
                                  <q-field
                                    square
                                    outlined
                                    dense
                                    readonly
                                  >
                                    <template #control>
                                      <div
                                        class="self-center full-width no-outline"
                                        tabindex="0"
                                      >{{!!collecteur ? collecteur.expiration_piece || 'Non défini':'Non défini'}}</div>
                                    </template>
                                  </q-field>
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
                              >SIGNATURE DU COLLECTEUR</div>
                              <div class="col-auto">
                                <q-btn
                                  color="blue-1"
                                  text-color="primary"
                                  icon="las la-fingerprint"
                                  size="md"
                                  unelevated
                                  round
                                >
                                  <q-tooltip content-style="font-size:11px">
                                    Scanner l'empreinte du collecteur
                                  </q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                            <q-separator />
                            <div class="q-pa-xs">
                              <q-img
                                v-if="!!collecteur && !!collecteur.signature"
                                :src="`${URLS.IMG_SIGNATURE}/${collecteur.signature}`"
                                spinner-color="blue"
                                spinner-size="20px"
                                class="panel-primary"
                                contain
                                style="height: 170px; width: 100%;border:2px dotted #5764ec"
                              />
                              <div
                                v-else
                                class="text-center q-py-md"
                                style="height: 170px; width: 100%;border:2px dotted #5764ec"
                              >
                                <q-icon
                                  name="las la-signature"
                                  size="100px"
                                  color="grey-5"
                                /> <br>
                                <strong>Aucune signature</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-step>
                <q-step
                  :name="2"
                  title="Opération"
                  icon="las la-exchange-alt"
                  :done="operation.step > 3"
                >
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** IDENTITE ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >COLLECTEUR</div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Nom complet</input-label>
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
                                  >{{!!collecteur ? collecteur.nom_complet || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>

                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Code</input-label>
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
                                  >{{!!collecteur ? collecteur.folio || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Compte epargne CDF</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                                :bg-color="!!operation && operation.devise === 'CDF' ? 'blue-2':''"
                              >
                                <template #control>
                                  <div
                                    :class="!!operation && operation.devise === 'CDF' ? 'text-primary text-bold':`self-center full-width no-outline`"
                                    tabindex="0"
                                  >{{!!compte ? compte.cdf.compte || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Compte epargne USD</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                                :bg-color="!!operation && operation.devise === 'USD' ? 'blue-2':''"
                              >
                                <template #control>
                                  <div
                                    :class="!!operation && operation.devise === 'USD' ? 'text-primary text-bold':`self-center full-width no-outline`"
                                    tabindex="0"
                                  >{{!!compte ? compte.usd.compte || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Solde CDF</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                                :bg-color="!!operation && operation.devise === 'CDF' ? 'blue-2':''"
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline text-bold"
                                    tabindex="0"
                                  >{{!!compte ? $helper.formatMoney(compte.cdf.solde.montant) || '0,00':'0,00'}}</div>
                                </template>
                                <template #prepend>
                                  <div
                                    style="font-size:14px"
                                    class="text-bold"
                                  >{{!!compte ? `S${compte.cdf.solde.solde} :` || 'SDC :':'SDC :'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Solde USD</input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                                :bg-color="!!operation && operation.devise === 'USD' ? 'blue-2':''"
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline text-bold"
                                    tabindex="0"
                                  >{{!!compte ? $helper.formatMoney(compte.usd.solde.montant) || '0,00':'0,00'}}</div>
                                </template>
                                <template #prepend>
                                  <div
                                    style="font-size:14px"
                                    class="text-bold"
                                  >{{!!compte ? `S${compte.usd.solde.solde} :` || 'SDC :':'SDC :'}}</div>
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
                              <input-label required>Sélectionner la devise</input-label>
                              <q-field
                                hide-bottom-space
                                square
                                outlined
                                dense
                                lazy-rules
                                :rules="[ val => !!operation.devise || 'Sélectionner la devise']"
                              >
                                <template v-slot:control>
                                  <div class="self-center full-width no-outline q-pa-none">
                                    <div class="row q-col-gutter-sm items-center border-divider">
                                      <div
                                        v-for="(devise,index) in devises"
                                        :key="index"
                                        class="col"
                                      >
                                        <q-radio
                                          v-model="operation.devise"
                                          :val="devise"
                                          :label="devise"
                                          dense
                                          class="text-bold"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label required>Montant à retirer</input-label>
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
                                          val => this.soldeEpDisponible >= parseFloat(val) || 'Le solde disponible dans le compte epargne est inferieur au montant saisi']"
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
                            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                              <input-label required>Nom complet du bénéficiaire</input-label>
                              <q-input
                                readonly
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.initiateur"
                                placeholder="Bénéficiaire"
                                lazy-rules
                                :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                                maxlength="60"
                              />
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
                </q-step>
              </q-stepper>
            </q-form>
          </div>

        </div>
      </div>
    </div>

    <filAttente
      v-model="showDlgFilAttente"
      :user="user"
    />

  </q-page>
</template>
<script>
import filAttente from '../../fil_attente/fil_attente.vue'

export default {
  name: 'REtrait_COMMISSION',
  data () {
    return {
      showDlgFilAttente: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      carnet: null,
      compte: null,
      collecteur: null,

      collecteurs: [],
      comptes: [],
      carnets: [],
      devises: ['CDF', 'USD'],

      step: 1,

      selectedOption: {}
    }
  },
  props: ['URLS', 'user', 'options', 'caisseName'],
  watch: {

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
  components: {
    filAttente
  },
  computed: {

    _isLastStep () {
      return this.operation.step === 2
    },
    _libelle: {
      get () {
        if (this.operation.default_libelle) {
          this.$vue.set(this.operation, 'libelle', `Retrait de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.compte ? this.compte.indice : ''}, carnet numéro ${this.carnet ? this.carnet.code : ''} du collecteur ${this.collecteur ? this.collecteur.nom_complet : ''}. Bénéficiaire : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },

    soldeEpDisponible () {
      if (this.operation.devise && this.compte) {
        if (this.operation.devise === 'USD') {
          if (this.compte.usd.solde.solde === 'C') {
            return this.compte.usd.solde.montant
          }
        } else {
          if (this.compte.cdf.solde.solde === 'C') {
            return this.compte.cdf.solde.montant
          }
        }
      }

      return 0
    }
  },
  beforeMount () {
  },
  methods: {
    onCollecteurSelected (collecteur) {
      this.compte = null
      this.$vue.set(this.operation, 'devise', null)
      this.$vue.set(this.operation, 'montant', null)

      if (collecteur) {
        this.getSoldeCompteEpargne(collecteur)
      } else {
        this.compte = null
      }
    },
    getSoldeCompteEpargne (collecteur) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_collecteur: collecteur.id,
        with_solde: true
      })

      let url = `${this.URLS.BASE_URL}/Collecteur/getComptesEpargnes`

      this.$q.loading.show()

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()

        if (infos.data.erreur === false) {
          this.compte = infos.data.records
          this.$vue.set(this.operation, 'initiateur', collecteur.nom_complet)
        } else {
          this.compte = null
          this.collecteur = null
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.compte = null
        this.collecteur = null
        this.$helper.showMessage()
      })
    },
    filterCollecteurs (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        exclude_id: this.user.id
      })

      let url = `${this.URLS.BASE_URL}/Collecteur/searchCollecteurs`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.collecteurs = infos.data.records
        })
      }).catch(() => {
        update(() => { this.collecteurs = [] })
      })
    },
    checkform (isOk) {
      if (isOk) {
        if (this._isLastStep) {
          this.saveForm()
        } else {
          this.operation.step += 1
        }
      }
    },
    saveForm () {
      if (!this.$helper.isNotEmpty(this.user.caisse)) {
        this.$helper.showMessage("Cet utilisateur n'est lié à aucune caisse, il ne peut donc pas passer des opération de d'encaissement")
      }

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
          id_collecteur: this.collecteur.id,
          id_compte: this.operation.devise === 'CDF'
            ? this.compte.cdf.fk_compte
            : this.compte.usd.fk_compte,
          type_decaissement: 'COMMISSION',
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte_caisse: this.user.caisse[this.operation.devise.toLowerCase()].id
        }

        let donnees = JSON.stringify(dt)

        console.log(donnees)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Caisse/decaissement/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          if (infos.data.erreur === false) {
            this.$emit('onPrint', infos.data.id_operation)
            this.$emit('actualiser', true)
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.viderChamps()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.loadingSave = false
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.operation = {
        step: 1,
        default_libelle: true
      }

      this.collecteur = null
      this.compte = null
      this.carnet = null

      this.$refs.myForm.resetValidation()
    }

  }
}
</script>

<style>
</style>
