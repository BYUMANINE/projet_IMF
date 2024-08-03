<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 950px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
            <div class="col">
              <div class="text-h6">Demande pour groupe</div>
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
                :disable="step == 1"
                color="blue-1"
                text-color="primary"
                label="Précédent"
                icon="las la-arrow-left"
                unelevated
                rounded
                size="12px"
                no-caps
                @click="step--"
              />
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                :label="step < 3 ?'Suivant' : 'Enregistrer'"
                :icon="step  < 3 ?'las la-arrow-right' : 'las la-cloud-upload-alt'"
                unelevated
                rounded
                size="
                12px"
                no-caps
                @click="$refs.myForm.validate().then(checkform)"
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
            class="row  q-px-sm q-py-sm scroll"
            style="height:70vh"
          >
            <div class="col">

              <q-form ref="myForm">
                <div class="ba overflow-hidden panel-primary">
                  <q-stepper
                    v-model="step"
                    ref="stepper"
                    color="primary"
                    class="q-pa-none-xs-stepper"
                    transition-next="fade"
                    transition-prev="fade"
                  >
                    <q-step
                      :name="1"
                      title="INFORMATIONS SUR LE CREDIT"
                      icon="las la-users"
                      :done="step > 1"
                    >
                      <div class="row q-col-gutter-md ">
                        <!-- ******************************************* -->
                        <!-- ******************************************* -->
                        <!-- ************** SITE ******************* -->
                        <!-- ******************************************* -->
                        <!-- ******************************************* -->
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <div class="ba overflow-hidden panel-primary">

                            <div class="q-pa-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label required>Groupe</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Rechercher un groupe"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    v-model="credit.client"
                                    :options="clients"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.folio} - ${opt.designation}`"
                                    @filter="filterClients"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner un membre']"
                                  >
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun groupe trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                    <template #prepend>
                                      <q-icon name="search" />
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-12">
                                  <input-label required>Produit de crédit</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un produit de credit"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    clearable
                                    v-model="credit.produit"
                                    :options="produits"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt.designation} - ${opt.devise}`"
                                    @filter="filterProduits"
                                    @input="onProduitSelected"
                                    lazy-rules
                                    :rules="[ val => !!val || 'Sélectionner un produit']"
                                  >
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun produit de crédit trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-12">
                                  <input-label required>Date réception</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model="credit.date_reception"
                                    placeholder="Date réception"
                                    mask="####-##-##"
                                    lazy-rules
                                    readonly
                                    :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                                    @click="$refs.popup_dt_reception.show()"
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
                                          ref="popup_dt_reception"
                                        >
                                          <q-date
                                            v-model="credit.date_reception"
                                            mask="YYYY-MM-DD"
                                            @input="() => $refs.popup_dt_reception.hide()"
                                          />
                                        </q-popup-proxy>
                                      </q-icon>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Montant sollicité</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="credit.montant_sollicite"
                                    placeholder="Montant"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',]"
                                    maxlength="10"
                                  >
                                    <template
                                      v-slot:append
                                      v-if="credit.produit"
                                    >
                                      <div style="font-size:13px"><strong>{{credit.produit.devise}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Taux d'intérêt annuel</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="credit.taux_interet"
                                    placeholder="Taux"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) > 0 && parseFloat(val) < 100 || 'Le pourcentage doit figurer dans l\'intervalle de 1 à 100',]"
                                    maxlength="5"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>%</strong></div>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Périodicité</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner une périodicité"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    clearable
                                    use-input
                                    v-model="credit.periodicite"
                                    :options="credit.produit ? credit.produit.periodicite : []"
                                    :option-value="opt => opt"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                  />
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Nombre échéances</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="credit.nombre_echeance"
                                    placeholder="echéances"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumber(val) || 'Uniquement les nombres entiers',
                                              val => parseInt(val) >= 0 || 'L\'échéance doit être un nombre positif']"
                                    maxlength="3"
                                  />
                                </div>
                                <div class="col-12">
                                  <input-label>Nombre differées</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="credit.nombre_differe"
                                    placeholder="Nombre differées"
                                    lazy-rules
                                    :rules="[ val => !val || val && val.trim().length > 0 || 'Champs requis',
                                              val => !val || this.$helper.isNumber(val) || 'Uniquement les nombre entiers',
                                              val => !val || parseInt(val) >= 0 || 'Le differé doit être un nombre positif']"
                                    maxlength="3"
                                  />
                                </div>
                                <div class="col-12">
                                  <input-label>Chiffre d'affaire</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="credit.chiffre_affaire"
                                    placeholder="Chiffre d'affaire"
                                    lazy-rules
                                    :rules="[ val => !val || val && val.trim().length > 0 || 'Champs requis',
                                              val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => !val || parseFloat(val) >= 0 || 'Le montant doit être un chiffre positif',]"
                                    maxlength="11"
                                  />
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <div class="ba overflow-hidden panel-primary">
                            <div class="q-pa-sm text-bold">
                              Informations sur le produit de crédit
                            </div>
                            <q-separator />
                            <div v-if="credit.produit">
                              <table class="table head-bold table-striped">

                                <tbody style="font-size:12px">
                                  <tr>
                                    <td>INTITULE</td>
                                    <td>{{credit.produit.designation}}</td>
                                  </tr>
                                  <tr>
                                    <td>DEVISE</td>
                                    <td>{{credit.produit.devise}}</td>
                                  </tr>
                                  <tr>
                                    <td>MONTANT MIN.</td>
                                    <td>{{credit.produit.montant_min}}</td>
                                  </tr>
                                  <tr>
                                    <td>MONTANT MAX.</td>
                                    <td>{{credit.produit.montant_max}}</td>
                                  </tr>
                                  <tr>
                                    <td>AMORTISSEMENT</td>
                                    <td>{{credit.produit.amortissement}}</td>
                                  </tr>
                                  <tr>
                                    <td>INTERET MIN.</td>
                                    <td>{{credit.produit.taux_interet_min}} %</td>
                                  </tr>
                                  <tr>
                                    <td>INTERET MAX.</td>
                                    <td>{{credit.produit.taux_interet_max}} %</td>
                                  </tr>
                                  <tr>
                                    <td>EPARGNE OBLIGATOIRE</td>
                                    <td>{{credit.produit.pourcent_epargne_obligatoire}} %</td>
                                  </tr>
                                  <tr>
                                    <td>CAUTION OBLIGATOIRE</td>
                                    <td>{{credit.produit.pourcent_caution_obligatoire}} %</td>
                                  </tr>
                                  <tr>
                                    <td>NOMBRE GARANTIES</td>
                                    <td>{{credit.produit.nombre_garantie}}</td>
                                  </tr>
                                  <tr>
                                    <td>MODE REMBOURSEMENT</td>
                                    <td>{{credit.produit.ordre_remboursement}}</td>
                                  </tr>
                                  <tr>
                                    <td>POURCENT PENALITE</td>
                                    <td>{{credit.produit.pourcent_penalite}} %</td>
                                  </tr>
                                  <tr>
                                    <td>CALCUL PENALITE</td>
                                    <td>{{credit.produit.calcul_penalite}}</td>
                                  </tr>
                                  <tr>
                                    <td>PERIODE GRACE</td>
                                    <td>{{credit.produit.delais_grace}}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div
                              v-else
                              class="q-px-md q-py-xl text-center"
                            >
                              <q-img
                                src="statics/images/icone/cloud.png"
                                spinner-color="white"
                                spinner-size="15px"
                                style="height: 100px; max-width: 100px"
                              /> <br>
                              <span>Aucun produit de crédit sélectionné</span>
                            </div>
                          </div>
                          <div class="ba panel-primary q-pa-md q-mt-md">
                            <div class="row q-col-gutter-md">
                              <div class="col-12">
                                <input-label required>Objet de financement</input-label>
                                <q-select
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Selectionner une option"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  clearable
                                  v-model="credit.objet"
                                  :options="objets"
                                  :option-value="opt => opt"
                                  :option-label="opt => `${opt.designation}`"
                                  @filter="filterObjetFinancement"
                                  lazy-rules
                                  :rules="[ val => !!val || 'Sélectionner une option']"
                                >
                                  <template #no-option>
                                    <q-item>
                                      <q-item-section class="text-red">
                                        Aucun objet de financement trouvé
                                      </q-item-section>
                                    </q-item>
                                  </template>
                                </q-select>
                              </div>

                              <div class="col-12">
                                <input-label>Détails à préciser (Facultatif)</input-label>
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="credit.motif"
                                  placeholder="Détails"
                                  lazy-rules
                                  :rules="[ val => !val || val && val.trim().length > 1 || 'Champs requis']"
                                  type="textarea"
                                  rows="3"
                                  maxlength="250"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </q-step>
                    <q-step
                      :name="2"
                      title="REPARTITION"
                      icon="las la-users"
                      :done="step > 2"
                    >
                      <div class="ba overflow-hidden panel-primary">
                        <div
                          class="q-py-xs q-px-sm text-h6"
                          style="font-size:14px"
                        >PART DES MEMBRES DU GROUPE</div>
                        <q-separator />
                        <table class="table head-bold hover table-striped table-colored-head">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th class="text-left">MONTANT</th>
                              <th class="text-left">NOM COMPLET</th>
                            </tr>
                          </thead>

                          <tbody style="font-size:12px">
                            <tr
                              v-for="(row, index) in ($helper.isNotEmpty(credit.client) ? credit.client.membres : [])"
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
                              <td
                                class="text-center text-bold input-table"
                                style="width:30%"
                              >
                                <q-input
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model="row.montant"
                                  placeholder="Montant"
                                  lazy-rules
                                  :rules="[ val => !!val || 'Champs requis',
                                            val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                            val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',
                                            val => montantReparti >= 0 || 'Montant superieur au reste à répartir']"
                                  maxlength="7"
                                >
                                  <template
                                    v-if="!!credit.produit"
                                    #append
                                  >
                                    <strong style="font-size:13px">{{credit.produit.devise}}</strong>
                                  </template>
                                </q-input>
                              </td>
                              <td class="text-left text-bold">{{ row.nom_complet }}</td>
                            </tr>
                            <template v-if="($helper.isNotEmpty(credit.client) ? credit.client.membres : []).length === 0">
                              <tr class="panel-primary">
                                <td
                                  :colspan="3"
                                  class="text-center"
                                >
                                  <nondata
                                    icone="img:statics/images/icone/enseignants.png"
                                    title="Aucun membre trouvé dans ce groupe"
                                    btnLabel="Actualiser la liste"
                                    :showBtn="false"
                                  />
                                </td>
                              </tr>
                            </template>

                            <tr>
                              <td :style="$helper.cellEmptyImg"></td>
                              <td class="text-center input-table">
                                <q-field
                                  square
                                  outlined
                                  dense
                                  readonly
                                  hide-bottom-space
                                  lazy-rules
                                  :rules="[ val => montantReparti <= 0 || `Vous devez répartir le ${montantReparti} ${credit.produit ? credit.produit.devise : ''} restant aux membres`]"
                                >
                                  <template
                                    v-slot:control
                                    v-if="!!credit.produit"
                                  >
                                    <div class="self-center full-width no-outline q-pa-none text-bold">
                                      {{montantReparti}} / {{credit.montant_sollicite}} {{credit.produit.devise}}
                                    </div>
                                  </template>
                                </q-field>
                              </td>
                              <td :style="$helper.cellEmptyImg"></td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </q-step>
                    <q-step
                      :name="3"
                      title="GARANTIES "
                      icon="las la-address-card"
                      :done="step > 3"
                    >
                      <div
                        class="panel-primary"
                        style="min-height:50vh"
                      >
                        <div class="row q-col-gutter-md ">

                          <!-- ******************************************* -->
                          <!-- ***** GARANTIES ******************* -->
                          <!-- ******************************************* -->
                          <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                            <div class="ba overflow-hidden panel-primary">
                              <div class="q-pa-sm text-bold">
                                Liste des garanties
                              </div>
                              <q-separator />
                              <div class="q-pa-xs">
                                <q-select
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Selectionner une garantie"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  clearable
                                  v-model="selectedGarantie"
                                  :options="garanties"
                                  :option-value="opt => opt"
                                  :option-label="opt => `${opt.num_piece} - ${opt.proprietaire}`"
                                  @filter="filterGaranties"
                                >
                                  <template #no-option>
                                    <q-item>
                                      <q-item-section class="text-red">
                                        Aucune garantie trouvée
                                      </q-item-section>
                                    </q-item>
                                  </template>
                                  <template #after>
                                    <div class="row q-col-gutter-sm">
                                      <div class="col-auto">
                                        <q-btn
                                          :disable="!$helper.isNotEmpty(selectedGarantie)"
                                          color="primary"
                                          icon="add"
                                          label="Ajouter à la liste"
                                          unelevated
                                          no-caps
                                          @click="addGarantieToListe()"
                                        />
                                      </div>
                                      <div class="col-auto">
                                        <q-btn
                                          color="primary"
                                          icon="las la-external-link-square-alt"
                                          label="Nouveau"
                                          unelevated
                                          no-caps
                                          @click="showDlgGarantie=true"
                                        />
                                      </div>
                                    </div>
                                  </template>
                                </q-select>
                              </div>
                              <q-separator />
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th class="text-left">GARANTIE</th>
                                    <th>VALEUR</th>
                                    <th>DEVISE</th>
                                  </tr>
                                </thead>
                                <tbody style="font-size:12px">
                                  <tr
                                    v-for="(row,index) in credit.garanties"
                                    :key="index+'2346'"
                                  >
                                    <td class="text-center">
                                      <q-avatar
                                        color="primary"
                                        text-color="white"
                                        size="20px"
                                        class="text-bold"
                                      >
                                        {{index+1}}
                                      </q-avatar>
                                    </td>
                                    <td class="text-bold text-left">
                                      {{row.num_piece}} - {{row.proprietaire}}
                                    </td>

                                    <td class="text-bold text-center">
                                      {{row.valeur}}
                                    </td>
                                    <td class="text-bold text-center">
                                      {{row.devise}}
                                    </td>
                                    <td class="text-center">
                                      <q-btn
                                        color="red-1"
                                        text-color="red"
                                        icon="close"
                                        unelevated
                                        round
                                        size="xs"
                                        @click="removeGarantie(row)"
                                      />
                                    </td>
                                  </tr>
                                  <tr v-if="credit.garanties.length === 0">
                                    <td
                                      colspan="4"
                                      class="text-bold text-center"
                                    >
                                      <div class="q-px-md q-py-xl text-center">
                                        <q-img
                                          src="statics/images/icone/cloud.png"
                                          spinner-color="white"
                                          spinner-size="15px"
                                          style="height: 50px; max-width: 50px"
                                        /> <br>
                                        <span>Aucune garantie sélectionnée</span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </div>
                      </div>
                    </q-step>
                  </q-stepper>
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <nouvelleGarantie
      v-model="showDlgGarantie"
      :selectedGarantie="null"
      :isAdd="true"
    />
  </div>
</template>

<script>
import nouvelleGarantie from '../../garanties/components/garanties/nouvelle_garantie.vue'

export default {
  name: 'dialogDemandeIndividuel',
  data () {
    return {
      URLS: {},
      user: {},

      step: 1,

      loading: false,
      showDlgGarantie: false,

      credit: {
        garanties: [],
        garants: [],
        periodicite: [],
        date_reception: null
      },

      selectedGarant: null,
      selectedGarantie: null,

      clients: [],
      objets: [],
      produits: [],
      garants: [],
      garanties: [],
      membresGroupe: []

    }
  },
  props: {
    value: Boolean,
    selectedDemande: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  components: {
    nouvelleGarantie
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
        if (this.selectedDemande != null) {
          this.credit = { ...this.selectedDemande }
          this.step = 1
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
    },
    montantReparti () {
      if (this.$helper.isNotEmpty(this.credit.client)) {
        return this.credit.client.membres
          ? this.credit.client.membres.reduce((prev, next) => {
            const value = this.$helper.isNumeric(next.montant)
              ? parseFloat(next.montant)
              : 0

            return prev - value
          }, parseFloat(this.credit.montant_sollicite))
          : 0
      }
      return 0
    }
  },
  methods: {
    addGarantieToListe () {
      if (this.$helper.isNotEmpty(this.selectedGarantie)) {
        let exist = false

        for (let i = 0; i < this.credit.garanties.length; i++) {
          if (this.credit.garanties[i].id === this.selectedGarantie.id) {
            exist = true
            break
          }
        }
        if (!exist) {
          this.credit.garanties.push(this.selectedGarantie)
          this.selectedGarantie = null
        } else {
          this.$helper.showMessage('Cette garantie éxiste déjà sur la liste')
        }
      }
    },
    removeGarantie (row) {
      if (row) {
        if (row.id_rel) {
          this.deleteGarantOrGarantieRemote(row, 'GARANTIE')
        } else {
          this.credit.garanties.splice(this.credit.garanties.indexOf(row))
        }
      }
    },
    deleteGarantOrGarantieRemote (row, type) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment cette ligne ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          ...row,
          type,
          id_agent: this.user.id
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Demande_credit/deleteGarantOrGarantie/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              if (type === 'GARANTIE') {
                this.credit.garanties.splice(this.credit.garanties.indexOf(row), 1)
              } else {
                this.credit.garants.splice(this.credit.garants.indexOf(row), 1)
              }
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
          .catch(e => {
            this.$q.loading.hide()
            this.$helper.showMessage()
          })
      })
    },
    checkform (isSucess) {
      if (isSucess) {
        if (this.step === 1) {
          this.step = 2
        } else if (this.step === 2) {
          this.step = 3
        } else if (this.step === 3) {
          this.saveForm()
        }
      }
    },
    viderChamps () {
      this.step = 1
      this.credit = {
        garanties: [],
        garants: [],
        periodicite: [],
        date_reception: this.$helper.now()
      }
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    onProduitSelected (e) {
      if (e) {
        this.credit.taux_interet = e.taux_interet_max
      }
    },
    filterGaranties (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchGaranties`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.garanties = infos.data.records
        })
      }).catch(() => {
        update(() => { this.garanties = [] })
      })
    },
    filterGarants (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Garantie/searchGarants`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.garants = infos.data.records
        })
      }).catch(() => {
        update(() => { this.garants = [] })
      })
    },
    filterProduits (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Produit_credit/searchProduitsCredit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.produits = infos.data.records
        })
      }).catch(() => {
        update(() => { this.produits = [] })
      })
    },
    filterClients (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        avec_membres: 'OUI'
      })

      let url = `${this.URLS.BASE_URL}/Groupe/searchGroupes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.clients = infos.data.records
        })
      }).catch(() => {
        update(() => { this.clients = [] })
      })
    },

    filterObjetFinancement (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val
      })

      let url = `${this.URLS.BASE_URL}/ObjetFinancement/searchObjetFinancements`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.objets = infos.data.records
        })
      }).catch(() => {
        update(() => { this.objets = [] })
      })
    },
    saveForm () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
        message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer ce credit ?' : 'Souhaitez-vous vraiment modifier les infos de ce credit ?'}`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          ...this.credit,
          type: 'GROUPE'
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Demande_credit/${this.isAdd ? 'add' : 'update'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.$emit('onFinish', true)
            this.showDialog = false
            this.viderChamps()
            this.$refs.myForm.resetValidation()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    }

  }

}
</script>

<style ></style>
