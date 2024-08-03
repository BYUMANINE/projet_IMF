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
          :index="3"
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
                  title="Informations du membre"
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
                            >SELECTIONNER UN MEMBRE EAC<span
                                class="text-primary"
                                v-if="!!membre && !!membre.folio"
                              >[ {{membre.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="!!membre && !!membre.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(membre.folio)"
                            >
                              <q-tooltip>
                                Copier le code du membre
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
                                    :src=" (!!membre && !!membre.photo ?  `${URLS.IMG_MEMBRE}/${membre.photo}` :'statics/images/icone/avatar.png')"
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
                                  <input-label required>Rechercher un membre</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Rechercher un membre"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    behavior="menu"
                                    v-model="membre"
                                    :options="membres"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.folio} - ${opt.nom_complet}`"
                                    @filter="filterMembres"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner un membre']"
                                    @input="onMembreSelected"
                                  >
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun membre trouvé
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
                                      >{{!!membre ? membre.sexe || 'Non défini':'Non défini'}}</div>
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
                                      >{{!!membre ? membre.date_naissance || 'Non défini':'Non défini'}}</div>
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
                                  >{{!!membre ? membre.lieu_naissance || 'Non défini':'Non défini'}}</div>
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
                                  >{{!!membre ? membre.profession || 'Non défini':'Non défini'}}</div>
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
                                  >{{!!membre ? membre.etat_civil || 'Non défini':'Non défini'}}</div>
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
                                  >{{!!membre ? membre.secteur_str || 'Non défini':'Non défini'}}</div>
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
                                  >{{!!membre ? membre.nationalite || 'Non défini':'Non défini'}}</div>
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
                                      >{{!!membre ? membre.type_piece || 'Non défini':'Non défini'}}</div>
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
                                      >{{!!membre ? membre.num_piece || 'Non défini':'Non défini'}}</div>
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
                                      >{{!!membre ? membre.lieu_delivrance || 'Non défini':'Non défini'}}</div>
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
                                      >{{!!membre ? membre.expiration_piece || 'Non défini':'Non défini'}}</div>
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
                              >SIGNATURE DU MEMBRE</div>
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
                                    Scanner l'empreinte du membre
                                  </q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                            <q-separator />
                            <div class="q-pa-xs">
                              <q-img
                                v-if="!!membre && !!membre.signature"
                                :src="`${URLS.IMG_SIGNATURE}/${membre.signature}`"
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
                  :done="operation.step > 2"
                >
                  <div class="row q-col-gutter-md ">
                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >INFORMATIONS SUR LE MEMBRE <span
                                class="text-primary"
                                v-if="!!membre && !!membre.folio"
                              >[ {{membre.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="!!membre && !!membre.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(membre.folio)"
                            >
                              <q-tooltip>
                                Copier le code du membre
                              </q-tooltip>

                            </q-btn>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm ">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Membre sélectionné</input-label>
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
                                  >{{!!membre ? membre.nom_complet || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>

                            <div class="col-12">
                              <input-label>Code membre</input-label>
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
                                  >{{!!membre ? membre.folio || 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-12">
                              <input-label>Compte EAC</input-label>
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
                                  >{{!!carnet ? carnet.indice|| 'Non défini':'Non défini'}}</div>
                                </template>
                              </q-field>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Montant déjà deposé </input-label>
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
                                  >{{!!carnet ? $helper.formatMoney(carnet.total_depot) || '0,00':'0,00'}}</div>
                                </template>
                                <template #append>
                                  <div
                                    style="font-size:14px"
                                    class="text-bold"
                                  >{{!!carnet ? `${carnet.devise} `:''}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Montant à retirer </input-label>
                              <q-field
                                square
                                outlined
                                dense
                                readonly
                                class="bg-blue-1"
                              >
                                <template #control>
                                  <div
                                    class="self-center full-width no-outline text-bold text-primary"
                                    tabindex="0"
                                  >{{$helper.formatMoney(montantARetirer)}}</div>
                                </template>
                                <template #append>
                                  <div
                                    style="font-size:14px"
                                    class="text-bold"
                                  >{{!!carnet ? `${carnet.devise} `:''}}</div>
                                </template>
                              </q-field>
                            </div>
                            <div class="col-12">
                              <input-label>Nombre de dépôts</input-label>
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
                                  >{{!!carnet ? `${$helper.formatMoney(carnet.total_depot / carnet.mise)} `:'0,00'}}</div>
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
                            <div class="col-12">
                              <input-label>Sélectionner un carnet</input-label>
                              <q-select
                                :readonly="!membre"
                                transition-show="scale"
                                transition-hide="scale"
                                square
                                outlined
                                dense
                                clearable
                                placeholder="Sélectionner un carnet"
                                fill-input
                                hide-selected
                                hide-bottom-space
                                use-input
                                emit-value
                                map-options
                                v-model="carnet"
                                :options="carnets"
                                :option-value="opt => opt"
                                :option-label="opt => `${opt.code}-${opt.membre_str}-${opt.devise}`"
                                @filter="filterCarnets"
                                lazy-rules
                                :rules="[ val => !!val || 'Sélectionner un carnet']"
                                @input="onCarnetSelected"
                              >
                                <template #no-option>
                                  <q-item>
                                    <q-item-section class="text-red">
                                      Ce membre n'a aucun carnet terminé ou arrêté
                                    </q-item-section>
                                  </q-item>
                                </template>
                              </q-select>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label required>Sélectionner la devise</input-label>
                              <q-field
                                square
                                outlined
                                hide-bottom-space
                                dense
                              >
                                <template #control>
                                  <div class="self-center full-width no-outline q-pa-none">
                                    <div class="row q-col-gutter-sm items-center">
                                      <div
                                        class="col"
                                        style="border-right:1px dashed rgba(0,0,0,.2)"
                                      >
                                        <q-radio
                                          v-model="operation.devise"
                                          val="CDF"
                                          label="CDF"
                                          dense
                                          class="text-bold"
                                          disable
                                        />
                                      </div>
                                      <div class="col">
                                        <q-radio
                                          v-model="operation.devise"
                                          val="USD"
                                          label="USD"
                                          dense
                                          class="text-bold"
                                          disable
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
                                readonly
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.montant"
                                placeholder="Montant"
                                lazy-rules
                                :rules="[ val => !!val || 'Champs requis',
                                        val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                        val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro']"
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
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label required>Bénéficiaire</input-label>
                              <q-input
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
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Numéro de la pièce</input-label>
                              <q-input
                                square
                                outlined
                                dense
                                hide-bottom-space
                                v-model.trim="operation.piece"
                                placeholder="Numéro de la pièce"
                                lazy-rules
                                :rules="[ val => !val || !!val && val.trim().length > 0 || 'Entrer le numero de la pièce']"
                                maxlength="150"
                              />
                            </div>

                            <div class="col-xs-12 col-sm col-md col-lg col-xl">
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
  name: 'individuel',
  data () {
    return {
      showDlgFilAttente: false,

      operation: {
        step: 1,
        default_libelle: true
      },

      carnet: null,
      membre: null,

      membres: [],
      carnets: [],

      step: 1,

      selectedOption: {}
    }
  },
  props: ['URLS', 'user', 'options', 'caisseName', 'caisse'],
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
          this.$vue.set(this.operation, 'libelle', `Retrait de ${this.$helper.formatMoney(this.operation.montant) || '0,00'} ${this.operation.devise || ''} dans le compte ${this.carnet ? this.carnet.indice : ''}, carnet numéro ${this.carnet ? this.carnet.code : ''} du membre ${this.membre ? this.membre.nom_complet : ''}. Bénéficiaire : ${this.operation.initiateur || 'Non défini'}`)
        }

        return this.operation.libelle
      },
      set (val) {
        this.$vue.set(this.operation, 'libelle', val)
      }
    },
    montantARetirer () {
      let montant = 0

      if (this.carnet) {
        montant = this.$helper.toDouble(this.carnet.total_depot)
        if (montant > 0) {
          montant = montant - this.$helper.toDouble(this.carnet.total_commission)
        }
      }

      return montant
    }
  },
  beforeMount () {
  },
  methods: {
    onMembreSelected (membre) {
      this.carnet = null
      this.$vue.set(this.operation, 'devise', null)
      this.$vue.set(this.operation, 'montant', null)

      if (membre) {
        this.operation.initiateur = membre.nom_complet
      }
    },

    onCarnetSelected (carn) {
      this.$vue.set(this.operation, 'devise', null)
      this.$vue.set(this.operation, 'montant', null)

      if (carn && carn.status !== 'ENCOURS') {
        this.$vue.set(this.operation, 'devise', carn.devise)
        this.$vue.set(this.operation, 'montant', this.montantARetirer + '')
      } else {
        this.carnet = null
      }
    },
    isMiseSupAuNombre (val) {
      if (val) {
        if (this.carnet) {
          if (parseFloat(val) >= parseFloat(this.carnet.mise)) {
            return true
          }
        }
      }
      return false
    },
    checkMontantAndMise (val) {
      if (val) {
        if (this.carnet) {
          if (parseFloat(val) % parseFloat(this.carnet.mise) === 0) {
            return true
          }
        }
      }

      return false
    },
    filterMembres (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Eac/searchMembresEac`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.membres = infos.data.records
        })
      }).catch(() => {
        update(() => { this.membres = [] })
      })
    },

    filterCarnets (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_membre: this.membre.id,
        status: ['TERMINE', 'ARRETE'],
        carnet_retire: 'NON'
      })

      let url = `${this.URLS.BASE_URL}/Eac/searchCarnetsEac`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.carnets = infos.data.records
        })
      }).catch(() => {
        update(() => { this.carnets = [] })
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
      if (!this.$helper.isNotEmpty(this.caisse)) {
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
          id_client: this.membre.id,
          id_carnet: this.carnet.id,
          id_compte: this.carnet.id_compte,
          id_membre_compte: this.carnet.id_membre_compte,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          id_compte_caisse: this.caisse[this.operation.devise.toLowerCase()].id
        }

        let donnees = JSON.stringify(dt)

        this.$q.loading.show()
        this.loadingSave = true

        let url = `${this.URLS.BASE_URL}/Eac/saveRetrait/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()
          this.loadingSave = false

          if (infos.data.erreur === false) {
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

      this.membre = null
      this.carnet = null

      this.$refs.myForm.resetValidation()
    }

  }
}
</script>

<style>
</style>
