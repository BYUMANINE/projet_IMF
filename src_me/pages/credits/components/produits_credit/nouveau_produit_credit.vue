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
              <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}}produit credit</div>
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
            class="row  q-px-sm q-py-sm scroll "
            style="min-height:75vh;max-height:75vh"
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
                      title="INFORMATIONS SUR LE PRODUIT"
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
                                  <input-label required>Intitulé du produit</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.designation"
                                    placeholder="Intitulé du produit"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                                    class="mrg"
                                    maxlength="150"
                                  />
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                                  <input-label required>Devise</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner une devise"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    v-model="produit.devise"
                                    :options="['CDF','USD']"
                                    :option-value="opt => opt"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une devise']"
                                  />
                                </div>
                                <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                                  <input-label required>Type tableau d'amortissement</input-label>
                                  <q-select
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
                                    v-model="produit.amortissement"
                                    :options="amortissementTab"
                                    :option-value="opt => opt"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez un type']"
                                  />
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
                                        v-model.trim="produit.montant_min"
                                        placeholder="Montant min"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',]"
                                        class="mrg"
                                        maxlength="10"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xs">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.montant_max"
                                        placeholder="Montant max"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                    val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                    val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                                    val => parseFloat(val) >= this.$helper.parseNumeric(this.produit.montant_min) || 'Doit être superieur ou égal au montant min',]"
                                        class="mrg"
                                        maxlength="10"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                  </div>

                                </div>
                                <div class="col-12">
                                  <input-label required>Intervalle taux d'intêret</input-label>
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.taux_interet_min"
                                        placeholder="Taux min"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) > 0 && parseFloat(val) < 100 || 'en O et 100% svp',]"
                                        class="mrg"
                                        maxlength="5"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>%</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.taux_interet_max"
                                        placeholder="taux max"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) > 0 && parseFloat(val) < 100 || 'Le taux d\'interêt doit être compris entre 0 et 100 svp',
                                                      val => parseFloat(val) >= $helper.parseNumeric(this.produit.taux_interet_min) || 'Le taux max doit être superieur au taux min',]"
                                        class="mrg"
                                        maxlength="5"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>%</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                  </div>
                                </div>

                                <div class="row q-col-gutter-sm">
                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                    <input-label>Deduire impayé du solde</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="produit.jour_deduire_impaye"
                                      placeholder="Jour"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'La periode doit être un chiffre positif',]"
                                      class="mrg"
                                      maxlength="2"
                                    >
                                      <template v-slot:append>
                                        <div style="font-size:13px"><strong>Jours</strong></div>
                                      </template>
                                    </q-input>
                                  </div>
                                  <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                    <input-label>Nombre de validations</input-label>
                                    <q-input
                                      square
                                      outlined
                                      dense
                                      hide-bottom-space
                                      v-model.trim="produit.nb_validations"
                                      placeholder="Nbre validation"
                                      lazy-rules
                                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                val => parseFloat(val) >= 0 || 'Le nombre des validations',]"
                                      class="mrg"
                                      maxlength="2"
                                    >
                                    </q-input>
                                  </div>

                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <div class="ba overflow-hidden panel-primary">

                            <div class="q-pa-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label required>Pénalités et calcul pénalité sur</input-label>
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.pourcent_penalite"
                                        placeholder="Pénalités en %"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                        val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                        val => parseFloat(val) >= 0 && parseFloat(val) < 100 || 'en pourcentage svp! ',]"
                                        class="mrg"
                                        maxlength="5"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>%</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-select
                                        transition-show="scale"
                                        transition-hide="scale"
                                        square
                                        outlined
                                        dense
                                        placeholder="Calculer sur"
                                        fill-input
                                        hide-selected
                                        hide-bottom-space
                                        use-input
                                        v-model="produit.calcul_penalite"
                                        :options="calculPenalite"
                                        :option-value="opt => opt"
                                        lazy-rules
                                        :rules="[val => !!val || 'Choisissez une option']"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div class="col-12">
                                  <input-label>Periode de grâce</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.delais_grace"
                                    placeholder="Periode de grâce"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'La periode doit être un chiffre positif',]"
                                    class="mrg"
                                    maxlength="2"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>Jours</strong></div>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-12">
                                  <input-label required>Ordre de remboursement</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Ordre de remboursement"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    v-model="produit.ordre_remboursement"
                                    :options="ordresRemoursement"
                                    :option-value="opt => opt"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                  />
                                </div>
                                <div class="col-12">
                                  <input-label required>Periodicité</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Periodicité"
                                    fill-input
                                    hide-bottom-space
                                    use-input
                                    multiple
                                    use-chips
                                    v-model="produit.periodicite"
                                    :options="periodicites"
                                    :option-value="opt => opt"
                                    :option-label="opt => `${opt}`"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                  />
                                </div>

                                <div class="col-12">
                                  <input-label required>Pourcentage caution et epargne obligatoire</input-label>
                                  <div class="row q-col-gutter-sm">
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.pourcent_epargne_obligatoire"
                                        placeholder="Epargne"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'La valeur doit être un chiffre positif',]"
                                        class="mrg"
                                        maxlength="2"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>%</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md col-lg col-lg">
                                      <q-input
                                        square
                                        outlined
                                        dense
                                        hide-bottom-space
                                        v-model.trim="produit.pourcent_caution_obligatoire"
                                        placeholder="Caution"
                                        lazy-rules
                                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'La valeur doit être un chiffre positif',]"
                                        class="mrg"
                                        maxlength="2"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>%</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                  </div>
                                </div>

                                <div class="col-12">
                                  <input-label required>Nombre des garanties</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.nombre_garantie"
                                    placeholder="Garantie"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 0  || 'Le nombre doit être positif',]"
                                    class="mrg"
                                    maxlength="5"
                                  />
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </q-step>
                    <q-step
                      :name="2"
                      title="FRAIS SUR CREDIT"
                      icon="las la-address-card"
                      :done="step > 2"
                    >
                      <div class="panel-primary">
                        <div class="row q-col-gutter-md ">

                          <!-- ******************************************* -->
                          <!-- ***** FRAIS SUR CREDIT******************* -->
                          <!-- ******************************************* -->
                          <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                            <div class="ba overflow-hidden panel-primary">
                              <div class="row items-center">
                                <div class="col">
                                  <div class="row items-center">
                                    <div class="col">
                                      <div
                                        class="q-py-xs q-px-sm text-h6"
                                        style="font-size:14px"
                                      >LES TYPES DES FRAIS</div>
                                    </div>

                                    <div class="col-auto q-py-sm">
                                      <q-btn
                                        color="blue-1"
                                        text-color="primary"
                                        label="Ajouter un frais"
                                        icon-right="add"
                                        rounded
                                        unelevated
                                        no-caps
                                        size="12px"
                                        class="q-mr-md"
                                        @click="showDlgFrais=true"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <q-separator />
                              <div
                                class="scroll"
                                style="height:50vh"
                              >
                                <table class="table head-bold hover table-striped table-colored-head">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th class="text-left">DESIGNATION</th>
                                      <th class="text-right">MONTANT MIN.</th>
                                      <th class="text-right">MONTANT MAX.</th>
                                      <th>VALEUR</th>
                                      <th class="text-left">TYPE</th>
                                      <th></th>
                                    </tr>
                                  </thead>

                                  <tbody style="font-size:12px">
                                    <tr
                                      v-for="(row,index) in produit.frais"
                                      :key="index"
                                    >
                                      <td class="text-center">
                                        <q-avatar
                                          color="blue"
                                          text-color="white"
                                          size="20px"
                                        >
                                          {{index + 1}}
                                        </q-avatar>
                                      </td>
                                      <td class="text-bold">{{row.designation}}</td>
                                      <td class="text-right">{{row.montant_min}} {{row.devise}}</td>
                                      <td class="text-right">{{row.montant_max}} {{row.devise}}</td>
                                      <td class="text-center">{{row.valeur}} {{row.type === 'POURCENTAGE'?'%':row.devise}}</td>
                                      <td class="text-left">{{row.type}}</td>

                                      <td class="text-center">
                                        <q-btn
                                          color="red-1"
                                          text-color="red"
                                          icon="close"
                                          size="sm"
                                          round
                                          unelevated
                                          @click="removeFrais(row)"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <q-separator />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-step>
                    <q-step
                      :name="3"
                      title="COMPTES"
                      icon="las la-address-card"
                      :done="step > 3"
                    >
                      <div class="row q-col-gutter-md ">
                        <!-- ******************************************* -->
                        <!-- ******************************************* -->
                        <!-- ************** COMPTES ******************* -->
                        <!-- ******************************************* -->
                        <!-- ******************************************* -->
                        <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                          <div class="ba overflow-hidden panel-primary">

                            <div class="q-pa-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Crédits sains (Ex.:32)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    :label="produit.fk_compte_credit_sain? produit.fk_compte_credit_sain.intitule:undefined"
                                    v-model="produit.fk_compte_credit_sain "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=5;signeLength='='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} -{{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Comptes provisions (Ex.:38)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    :label="produit.fk_compte_provision? produit.fk_compte_provision.intitule:undefined"
                                    v-model="produit.fk_compte_provision"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=5;signeLength='='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} -{{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Crédits souffrants (Ex.:39)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    :label="produit.fk_compte_credit_souffrant? produit.fk_compte_credit_souffrant.intitule:undefined"
                                    v-model="produit.fk_compte_credit_souffrant"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=5;signeLength='='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} -{{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Comptes des intérêts (Ex.:71)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    v-model="produit.fk_compte_interet"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice} - ${opt.devise} ` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Perte sur crédits irrecouvrables (Ex.:69)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    v-model="produit.fk_compte_perte_credit_irrecouvr "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice} - ${opt.devise} ` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Compte de recouvrement (Ex.:79)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    v-model="produit.fk_compte_recouvremnt "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice} - ${opt.devise} ` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Compte de pénalités (Ex.:71)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    v-model="produit.fk_compte_penalite "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice} - ${opt.devise} ` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>

                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Dotation aux provisions (Ex.:69)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    :label="produit.fk_compte_dotation_provision? produit.fk_compte_dotation_provision.intitule:undefined"
                                    v-model="produit.fk_compte_dotation_provision"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} -{{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Reprise des provisions (Ex.:79)</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner un compte"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    emit-value
                                    map-options
                                    :label="produit.fk_compte_reprise_provision? produit.fk_compte_reprise_provision.intitule:undefined"
                                    v-model="produit.fk_compte_reprise_provision"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                    @focus="longeurCompte=14;signeLength='>='"
                                  >
                                    <template #option="scope">
                                      <q-item
                                        v-bind="scope.itemProps"
                                        v-on="scope.itemEvents"
                                      >
                                        <q-item-section>
                                          <q-item-label> {{scope.opt.indice}} -{{scope.opt.intitule}}</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator />
                                    </template>
                                    <template #no-option>
                                      <q-item>
                                        <q-item-section class="text-red">
                                          Aucun compte trouvé
                                        </q-item-section>
                                      </q-item>
                                    </template>
                                  </q-select>
                                </div>
                              </div>
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

    <ajouterFrais
      v-model="showDlgFrais"
      :devise="produit.devise"
      @onFinish="onFraisAdded"
    />

  </div>
</template>

<script>
import ajouterFrais from './ajouter_frais.vue'

export default {
  name: 'dialogMembre',
  data () {
    return {
      URLS: {},
      user: {},

      step: 1,

      showDlgFrais: false,

      loading: false,
      produit: {
        frais: [],
        periodicite: []
      },
      calculPenalite: [],
      ordresRemoursement: [],
      periodicites: [],
      amortissementTab: [],
      indiceComptes: [],
      comptes: [],
      longeurCompte: 5,
      signeLength: '='

    }
  },
  props: {
    value: Boolean,
    selectedProduit: {},
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ajouterFrais
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    for (let i = 0; i < 100; i++) {
      this.indiceComptes.push(`320` + `${i}`.padStart(2, '0'))
    }
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
        if (this.selectedProduit != null) {
          this.produit = { ...this.selectedProduit }
          this.step = 1
        } else {
          this.viderChamps()
        }

        this.getStaticsDatas()
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
      this.produit = {
        frais: [],
        periodicite: []
      }
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },
    getStaticsDatas (val, update, abort) {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Produit_credit/getStaticsDatas`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.calculPenalite = infos.data.calcul_penalite
          this.ordresRemoursement = infos.data.ordres_remoursement
          this.periodicites = infos.data.periodicites
          this.amortissementTab = infos.data.amortissements
        } else {
          this.showDialog = false
        }
      }).catch(() => {
        this.$q.loading.hide()
        this.showDialog = false
      })
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.longeurCompte === 14 ? this.produit.devise : null,
        with_length: this.longeurCompte,
        signe_length: this.signeLength
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.comptes = []
        })
      })
    },

    saveForm () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
        message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer ce produit ?' : 'Souhaitez-vous vraiment modifier les infos de ce produit ?'}`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          ...this.produit
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Produit_credit/${this.isAdd ? 'add' : 'update'}/`

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
    },
    removeFrais (row) {
      if (row) {
        if (row.id) {
          this.$q.dialog({
            dark: this.$q.dark.isActive,
            title: 'Suppression en cours...',
            message: `Souhaitez-vous vraiment supprimer ce frais ?`,
            cancel: 'Non',
            ok: 'Oui',
            persistent: true
          }).onOk(() => {
            let data = {
              ...row,
              id_agent: this.user.id
            }

            let donnees = JSON.stringify(data)

            this.$q.loading.show()
            let url = `${this.URLS.BASE_URL}/Produit_credit/deleteFrais/`

            this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
              .then(infos => {
                this.$q.loading.hide()
                this.$helper.checkResponse(infos.data)

                if (infos.data.erreur === false) {
                  this.$helper.showMessage(infos.data.message, 1)
                  this.produit.frais.splice(this.produit.frais.indexOf(row), 1)
                } else {
                  this.$helper.showMessage(infos.data.message)
                }
              })
              .catch(e => {
                this.$q.loading.hide()
                this.$helper.showMessage()
              })
          })
        } else {
          this.produit.frais.splice(this.produit.frais.indexOf(row), 1)
        }
      }
    },
    onFraisAdded (e) {
      if (e && e.fk_credit_param_frais) {
        let isExists = false

        for (let i = 0; i < this.produit.frais.length; i++) {
          if (this.produit.frais[i].fk_credit_param_frais === e.fk_credit_param_frais) {
            isExists = true
            break
          }
        }
        if (!isExists) {
          this.produit.frais.push(e)
        } else {
          this.$helper.showMessage('Ce frais est déjà associé à ce produit')
        }
      } else {
        this.$helper.showMessage('Aucun frais précisé')
      }
    }
  }

}
</script>

<style ></style>
