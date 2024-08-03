<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 800px; max-width: 98vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">{{isAdd?'Nouveau ': 'Modifier'}} produit epargne</div>
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
              :label="step < 2 ?'Suivant' : 'Enregistrer'"
              :icon="step  < 2 ?'las la-arrow-right' : 'las la-cloud-upload-alt'"
              unelevated
              rounded
              size="12px"
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
                      <div class="col-12">
                        <div class="ba overflow-hidden panel-primary">
                          <div class="q-pa-md">
                            <div class="row q-col-gutter-sm">
                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
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
                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <input-label required>Devise</input-label>
                                <q-select
                                  :readonly="!isAdd"
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
                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <input-label required>Type de produit</input-label>
                                <q-select
                                  v-if="isAdd"
                                  transition-show="scale"
                                  transition-hide="scale"
                                  square
                                  outlined
                                  dense
                                  placeholder="Sélectionner un type de produit"
                                  fill-input
                                  hide-selected
                                  hide-bottom-space
                                  use-input
                                  emit-value
                                  map-options
                                  v-model="produit.type"
                                  :options="typesProduits"
                                  :option-value="opt => opt"
                                  :option-label="opt => `${opt}`"
                                  @filter="filterTypes"
                                  lazy-rules
                                  :rules="[val =>!!val || 'Sélectionner un type produit']"
                                  @input="$vue.set(produit,'indice', null);$vue.set(produit,'indice_sub', null)"
                                />
                                <q-input
                                  v-else
                                  readonly
                                  square
                                  outlined
                                  dense
                                  hide-bottom-space
                                  v-model.trim="produit.type"
                                />
                              </div>
                              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <input-label required>Uniquement valable pour</input-label>
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
                                  v-model="produit.valable"
                                  placeholder="Valable pour"
                                  lazy-rules
                                  emit-value
                                  map-options
                                  :options="valablesOptions"
                                  :option-value="opt => opt ? (typeof opt === 'string' ? opt : opt.value) : null "
                                  :option-label="opt => (typeof opt === 'string' ? opt : opt.label)"
                                  :rules="[val => !!val || 'Choisissez une option']"
                                />
                              </div>

                              <div
                                class="col-xs-12 col-sm col-md col-lg col-xl"
                                v-if="produit.type != 'EG'"
                              >
                                <input-label>Uniquement valable à la catégorie</input-label>
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
                                  v-model="produit.fk_categorie"
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

                              <div
                                class="col-12"
                                v-if="produit.type === 'PS' || produit.type === 'EAV'"
                              >
                                <q-card
                                  flat
                                  bordered
                                  class="radius-none q-a-none"
                                >
                                  <q-card-section class="q-pa-xs">
                                    <q-checkbox
                                      false-value="NON"
                                      true-value="OUI"
                                      v-model="produit.created_by_default"
                                      label="Souscription automatique au produit"
                                    />
                                  </q-card-section>
                                </q-card>
                              </div>

                              <template v-if="produit.type === 'EAV'">
                                <div class="col-12">
                                  <q-card
                                    flat
                                    bordered
                                    class="radius-none q-a-none"
                                  >
                                    <q-card-section class="q-pa-xs">
                                      <q-checkbox
                                        false-value="NON"
                                        true-value="OUI"
                                        v-model="produit.eav_retrait_avant_frais_ouv"
                                        label="Autoriser les retrais avant paiement de frais d'ouverture de compte"
                                      />
                                    </q-card-section>
                                  </q-card>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Frais d'ouverture de compte</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eav_frais_ouv_compte"
                                    placeholder="Frais d'ouverture"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à 0',]"
                                    class="mrg"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Frais de tenu de compte</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eav_frais_tenu_compte"
                                    placeholder="Frais de tenu de compte"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à 0',]"
                                    class="mrg"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Limite des retraits par jour</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eav_limite_retrait"
                                    placeholder="Limite des retraits"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à 0',]"
                                    class="mrg"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                    </template>
                                  </q-input>
                                </div>
                              </template>

                              <template v-if="produit.type === 'EAC'">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Frais ouverture carnet</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eac_frais_carnet"
                                    placeholder="Fais ouverture carnt *"
                                    lazy-rules
                                    :rules="[ val => !val || val && this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                          val => !val || val && parseFloat(val) >= 0 || 'Le montant doit être superieur ou egal à zéro',]"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <strong style="font-size:12px">{{produit.devise}}</strong>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Durée du cycle</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    v-model.trim="produit.eac_duree_cycle"
                                    placeholder="Nombre de jours *"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                          val => this.$helper.isNumber(val) || 'Uniquement les chiffres',
                                          val => parseInt(val) > 0 || 'Les jours ne doit pas être inferieur ou egal à zéro',]"
                                    maxlength="2"
                                  >
                                    <template v-slot:append>
                                      <strong style="font-size:15px">Jours</strong>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Comission institution sur la première mise</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eac_commission_instit"
                                    placeholder="Pourcentage *"
                                    lazy-rules
                                    :rules="[ val => !val || val && this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => !val || val && (parseFloat(val) >= 0 && parseFloat(val) <= 100) || 'Le pourcentage ne doit pas être négatif',
                                              val => _isCommissionValide(val) || 'Le pourcentage de la commission depasse 100 %',]"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <strong style="font-size:15px">%</strong>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Comission collecteur sur la première mise</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.eac_commission_coll"
                                    placeholder="Pourcentage *"
                                    lazy-rules
                                    :rules="[ val => !val || val && this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => !val || val && (parseFloat(val) >= 0 && parseFloat(val) <= 100) || 'Le pourcentage ne doit pas être négatif',
                                              val => _isCommissionValide(val) || 'Le pourcentage de la commission depasse 100 %',]"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <strong style="font-size:15px">%</strong>
                                    </template>
                                  </q-input>
                                </div>

                                <div class="col-12">
                                  <q-card
                                    flat
                                    bordered
                                    class="radius-none q-a-none"
                                  >
                                    <q-card-section class="q-pa-xs">
                                      <q-checkbox
                                        false-value="NON"
                                        true-value="OUI"
                                        v-model="produit.eac_gele_auto_commission"
                                        label="Geler la commission après transfert sur le compte du collecteur"
                                      />
                                    </q-card-section>
                                  </q-card>
                                </div>
                                <div class="col-12">
                                  <q-card
                                    flat
                                    bordered
                                    class="radius-none q-a-none"
                                  >
                                    <q-card-section class="q-pa-xs">
                                      <q-checkbox
                                        false-value="NON"
                                        true-value="OUI"
                                        v-model="produit.eac_exlure_jours_non_ouvrable"
                                        label="Exclure les jours non ouvrable des échances de dépôts"
                                      />
                                    </q-card-section>
                                  </q-card>
                                </div>

                                <div class="col-12">
                                  <q-card
                                    flat
                                    bordered
                                    class="radius-none q-a-none"
                                  >
                                    <q-card-section class="q-pa-xs">
                                      <q-checkbox
                                        false-value="NON"
                                        true-value="OUI"
                                        v-model="produit.eac_exlure_jours_feries"
                                        label="Exclure les jours fériés des échances de dépôts"
                                      />
                                    </q-card-section>
                                  </q-card>
                                </div>
                              </template>

                              <template v-if="produit.type != 'PS'">
                                <div class="col-12">
                                  <div class="row q-col-gutter-md">
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label required>{{getIntervalleLabel}}</input-label>
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
                                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <input-label></input-label>
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
                                      val => parseFloat(val) >= this.$helper.toDouble(this.produit.montant_min) || 'Doit être superieur ou égal au montant min',]"
                                        class="mrg"
                                        maxlength="20"
                                      >
                                        <template v-slot:append>
                                          <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                        </template>
                                      </q-input>
                                    </div>
                                  </div>
                                </div>
                              </template>

                              <template v-if="produit.type === 'PS'">
                                <div class="col-12">
                                  <input-label required>Valeur de la part sociale</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.ps_valeur"
                                    placeholder="Valeur *"
                                    lazy-rules
                                    :rules="[ val => !val || val && this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                                val => !val || val && parseFloat(val) >=0  || 'La valeur de la part sociale doit être positive']"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <strong style="font-size:15px">{{produit.devise}}</strong>
                                    </template>
                                  </q-input>
                                </div>
                              </template>

                              <template v-if="produit.type === 'DARS'">
                                <div class="col-12">
                                  <q-card
                                    flat
                                    class="panel-primary radius-none"
                                    bordered
                                  >

                                    <q-card-section class="q-pa-none">
                                      <div class="row q-col-gutter-sm">
                                        <div class="col-12">
                                          <q-item
                                            clickable
                                            v-ripple
                                            @click="$vue.set(produit,'dars_cloture_non_paye', produit.dars_cloture_non_paye === 'OUI' ? 'NON' : 'OUI')"
                                          >
                                            <q-item-section>
                                              <q-item-label
                                                class="text-bold"
                                                style="font-size:12px"
                                              >Activer le cloture DRAS</q-item-label>
                                              <q-item-label caption>La clôture automatique du DARS se declenche lorsque le solde du compte Epargne à vie du membre est inferieure au montant DARS à prélever automatique. <br /><br /> En cochant cette case, vous donner la possibilité au système d'effecturer cette clôture automatiquement </q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                              <q-checkbox
                                                style="width:100%"
                                                v-model="produit.dars_cloture_non_paye"
                                                color="primary"
                                                true-value="OUI"
                                                false-value="NON"
                                              />
                                            </q-item-section>
                                          </q-item>
                                        </div>
                                      </div>
                                    </q-card-section>
                                  </q-card>
                                </div>
                              </template>

                              <template v-if="produit.type === 'DAT'">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Pénalité en cas de rupture</input-label>
                                  <q-input
                                    square
                                    outlined
                                    dense
                                    hide-bottom-space
                                    v-model.trim="produit.dat_penalite_rupture"
                                    placeholder="Pénalité"
                                    lazy-rules
                                    :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                              val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                              val => parseFloat(val) >= 0 || 'Le taux doit être superieur à zéro',
                                              val => parseFloat(val) <= 100 || 'Le taux doit être inferieur ou égal à 100']"
                                    class="mrg"
                                    maxlength="10"
                                  >
                                    <template v-slot:append>
                                      <div style="font-size:13px"><strong>%</strong></div>
                                    </template>
                                  </q-input>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label required>Pénalité calculée sur</input-label>
                                  <q-select
                                    transition-show="scale"
                                    transition-hide="scale"
                                    square
                                    outlined
                                    dense
                                    placeholder="Sélectionner une option"
                                    fill-input
                                    hide-selected
                                    hide-bottom-space
                                    use-input
                                    v-model="produit.dat_calcul_penalite"
                                    :options="['INTERETS RECUS','INTERETS A RECEVOIR']"
                                    :option-value="opt => opt"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
                                  />
                                </div>

                              </template>

                              <div
                                class="col-12"
                                v-if="_configureInteret"
                              >
                                <input-label>Taux d'intérêts avec échéances</input-label>
                                <table class="table head-bold table-colored-head ba tiny-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>MONTANTS</th>
                                      <th>ECHEANCE (En mois)</th>
                                      <th>TAUX D'INTERET</th>
                                      <th>
                                        <q-btn
                                          color="primary"
                                          icon="add"
                                          @click="addInteret()"
                                          round
                                          unelevated
                                          size="xs"
                                        />
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody style="font-size:11.5px">
                                    <template v-for="(row,index) in produit.taux_interet">
                                      <tr :key="index">
                                        <td>
                                          <q-avatar
                                            size="20px"
                                            font-size="11px"
                                            color="primary"
                                            text-color="white"
                                          >{{index+1}}</q-avatar>
                                        </td>
                                        <td>
                                          <div class="row q-col-gutter-xs">
                                            <div class="col">
                                              <q-input
                                                square
                                                outlined
                                                dense
                                                hide-bottom-space
                                                v-model.trim="row.min"
                                                placeholder="Min"
                                                lazy-rules
                                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                                      val => parseFloat(val) >= $helper.toDouble(produit.montant_min) || 'Doit être superieur ou égal au montant min',]"
                                                class="mrg"
                                                maxlength="10"
                                              />
                                            </div>
                                            <div class="col">
                                              <q-input
                                                square
                                                outlined
                                                dense
                                                hide-bottom-space
                                                v-model.trim="row.max"
                                                placeholder="Max"
                                                lazy-rules
                                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                                      val => parseFloat(val) >= $helper.toDouble(row.min) || 'Doit être superieur ou égal au montant min',
                                                      val => parseFloat(val) <= $helper.toDouble(produit.montant_max) || 'Doit être inferieur ou égal au montant max',]"
                                                class="mrg"
                                                maxlength="10"
                                              >
                                                <template v-slot:append>
                                                  <div style="font-size:13px"><strong>{{produit.devise}}</strong></div>
                                                </template>
                                              </q-input>
                                            </div>
                                          </div>
                                        </td>
                                        <td class="text-center text-bold relative-position">
                                          <div class="row q-col-gutter-xs">
                                            <div class="col">
                                              <q-input
                                                square
                                                outlined
                                                dense
                                                hide-bottom-space
                                                v-model.trim="row.echeance_min"
                                                placeholder="Min"
                                                lazy-rules
                                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) >= 1 || 'L\'echeance doit être superieure ou égale à 1',]"
                                                class="mrg"
                                                maxlength="10"
                                              />
                                            </div>
                                            <div class="col">
                                              <q-input
                                                square
                                                outlined
                                                dense
                                                hide-bottom-space
                                                v-model.trim="row.echeance_max"
                                                placeholder="Max"
                                                lazy-rules
                                                :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                      val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                                      val => parseFloat(val) >= 1 || 'Le montant doit être superieur ou égal à 1',
                                                      val => parseFloat(val) >= $helper.toDouble(row.echeance_min) || 'Doit être superieur ou égal au montant min']"
                                                class="mrg"
                                                maxlength="10"
                                              >
                                                <template v-slot:append>
                                                  <div style="font-size:13px"><strong>Mois</strong></div>
                                                </template>
                                              </q-input>
                                            </div>
                                          </div>
                                        </td>
                                        <td class="text-center text-bold">
                                          <q-input
                                            square
                                            outlined
                                            dense
                                            hide-bottom-space
                                            v-model.trim="row.taux"
                                            placeholder="Taux"
                                            lazy-rules
                                            :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                                  val => $helper.isNumeric(val) || 'Uniquement les chiffres',
                                                  val => parseFloat(val) >= 0 || 'Le taux doit être superieur à zéro',
                                                  val => parseFloat(val) <= 100 || 'Le taux doit être inferieur ou égal à 100']"
                                            class="mrg"
                                            maxlength="10"
                                          >
                                            <template v-slot:append>
                                              <div style="font-size:13px"><strong>%</strong></div>
                                            </template>
                                          </q-input>
                                        </td>
                                        <td class="text-center">
                                          <q-btn
                                            v-if="produit.taux_interet.length > 1"
                                            color="red-1"
                                            text-color="red"
                                            icon="las la-trash-alt"
                                            @click="removeInteret(row)"
                                            round
                                            unelevated
                                            size="xs"
                                          />
                                        </td>
                                      </tr>
                                    </template>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </q-step>
                  <q-step
                    :name="2"
                    title="COMPTES ASSOCIES"
                    icon="las la-address-card"
                    :done="step > 2"
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
                                <input-label required>Compte produit ({{produit.type}})</input-label>
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
                                  :label="produit.fk_compte_principal? produit.fk_compte_principal.intitule:undefined"
                                  v-model="produit.fk_compte_principal "
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
                              <template v-if="produit.type === 'EAC'">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Comission sur EAC (Ex. 727)</input-label>
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
                                    :label="produit.fk_eac_commission_instit? produit.fk_eac_commission_instit.intitule:undefined"
                                    v-model="produit.fk_eac_commission_instit"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                                  <input-label required>Produit sur vente carnet (Ex. 727)</input-label>
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
                                    :label="produit.fk_eac_vente_carnet? produit.fk_eac_vente_carnet.intitule:undefined"
                                    v-model="produit.fk_eac_vente_carnet"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                              </template>
                              <template v-if="produit.type === 'EAV'">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Frais ouverture de compte (Ex. 727)</input-label>
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
                                    :label="produit.fk_eav_frais_ouvert_compte? produit.fk_eav_frais_ouvert_compte.intitule:undefined"
                                    v-model="produit.fk_eav_frais_ouvert_compte "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                                  <input-label required>Frais tenu de compte (Ex. 727)</input-label>
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
                                    :label="produit.fk_eav_frais_tenu_compte? produit.fk_eav_frais_tenu_compte.intitule:undefined"
                                    v-model="produit.fk_eav_frais_tenu_compte "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                              </template>
                              <template v-if="produit.type === 'DAT'">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Intérêts DAT (Ex. 612)</input-label>
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
                                    :label="produit.fk_dat_interet? produit.fk_dat_interet.intitule:undefined"
                                    v-model="produit.fk_dat_interet "
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                                <!-- <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Dettes rattachées DAT (Ex. 349)</input-label>
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
                                    :label="produit.fk_dat_dette_rattache? produit.fk_dat_dette_rattache.intitule:undefined"
                                    v-model="produit.fk_dat_dette_rattache"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                                </div> -->
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Pénalité sur rupture DAT (Ex. 75x)</input-label>
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
                                    :label="produit.fk_dat_penalite_rupture? produit.fk_dat_penalite_rupture.intitule:undefined"
                                    v-model="produit.fk_dat_penalite_rupture"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                              </template>
                              <template v-if="produit.type === 'DARS'">
                                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <input-label required>Intérêts sur DARS (Ex. 613)</input-label>
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
                                    :label="produit.fk_dars_interet? produit.fk_dars_interet.intitule:undefined"
                                    v-model="produit.fk_dars_interet"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                                  <input-label required>Dettes rattachées DARS (Ex. 358)</input-label>
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
                                    :label="produit.fk_dars_dette_rattache? produit.fk_dars_dette_rattache.intitule:undefined"
                                    v-model="produit.fk_dars_dette_rattache"
                                    :options="comptes"
                                    :option-value="opt => opt"
                                    :option-label="opt => !!opt ? `${opt.indice}` : ''"
                                    @filter="filterComptes"
                                    @focus="longeurCompte=14;signeLength='>='"
                                    lazy-rules
                                    :rules="[val => !!val || 'Choisissez une option']"
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
                              </template>
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

</template>

<script>

export default {
  name: 'dialogProduit',
  data () {
    return {
      URLS: {},
      user: {},

      step: 1,

      loading: false,
      produit: { taux_interet: [{}] },
      typesProduits: [],
      valablesOptions: [
        { value: 'ALL', label: 'Tous les membres' },
        { value: 'M', label: 'Membres individuels' },
        { value: 'G', label: 'Groupes' },
        { value: 'E', label: 'Entreprises' },
        { value: 'M-G', label: 'Membres individuels et groupes' },
        { value: 'M-E', label: 'Membres individuels et entreprises' },
        { value: 'G-E', label: 'Groupes et entreprises' }
      ],
      sousComptes: [],
      echeances: [],
      comptes: [],
      categories: [],
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
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.produit.taux_interet = [{}]

    for (let i = 0; i < 100; i++) {
      this.sousComptes.push(`${i}`.padStart(2, '0'))
    }

    for (let i = 1; i <= 600; i++) {
      this.echeances.push(`${i}`.padStart(2, '0'))
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

          if (!this.$helper.isNotEmpty(this.produit.taux_interet)) {
            this.produit.taux_interet = [{}]
          }
        } else {
          this.produit = {
            eac_exclusion_jour: [],
            taux_interet: [{}],
            created_by_default: 'NON'
          }
        }
        this.step = 1
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    getIntervalleLabel () {
      if (this.produit.type === 'EAV') return 'Intervalle des montants à épargner'
      else if (this.produit.type === 'DARS') return 'Intervalle des dépôts à constituer'
      else if (this.produit.type === 'DAT') return 'Intervalle des dépôts à constituer'
      else if (this.produit.type === 'EAC') return 'Intervalle des mises à constituer'
      else return 'Intervalle des montants à épargner'
    },
    _configureInteret () {
      if (this.produit.type) {
        return this.produit.type === 'DARS' || this.produit.type === 'DAT'
      }

      return false
    }

  },
  methods: {
    _isCommissionValide (val) {
      let inst = this.$helper.toDouble(this.produit.eac_commission_instit)
      let coll = this.$helper.toDouble(this.produit.eac_commission_coll)

      return (inst + coll) <= 100
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
    },
    filterTypes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Produit/getStaticTypesProduit`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.typesProduits = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.typesProduits = []
        })
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

    addInteret () {
      this.produit.taux_interet.push({})
    },
    removeInteret (row) {
      this.produit.taux_interet.splice(this.produit.taux_interet.indexOf(row), 1)
    },

    checkform (isSucess) {
      if (isSucess) {
        if (this.step === 1) {
          this.step = 2
        } else if (this.step === 2) {
          this.saveForm(true)
        }
      }
    },
    saveForm (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce produit?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.produit,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Produit/${this.isAdd ? 'add' : 'update'}/`

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

    viderChamps () {
      this.produit = { taux_interet: [{}] }
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style >
.btn-remove-interet {
  display: none;
}

td:hover .btn-remove-interet {
  display: block;
  position: absolute;
  left: -10px;
  top: 20%;
  z-index: 20;
}
.tiny-table td {
  padding: 2px;
}
</style>
