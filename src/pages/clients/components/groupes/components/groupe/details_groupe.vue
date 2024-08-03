<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card
        v-if="showDialog"
        style="width: 1200px; max-width: 95vw;"
      >
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-col-gutter-md">
            <div class="col">
              <div class="text-h6">Détails du groupe [ {{groupe.folio}} ]</div>
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
          <div class="row">
            <div class="col">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey panel-primary"
                active-color="primary"
                indicator-color="transparent"
                align="left"
                narrow-indicator
              >
                <q-tab name="1">
                  <strong class="style-tab">INFORMATIONS</strong>
                </q-tab>
                <q-tab name="2">
                  <strong class="style-tab">ADRESSES & CONTACTS</strong>
                </q-tab>
                <q-tab name="3">
                  <strong class="style-tab">MEMBRES DU GROUPE</strong>
                </q-tab>
                <q-tab name="4">
                  <strong class="style-tab">COMPTES</strong>
                </q-tab>
                <q-tab name="5">
                  <strong class="style-tab">RELEVES</strong>
                </q-tab>
                <q-tab name="6">
                  <strong class="style-tab">CREDITS</strong>
                </q-tab>
              </q-tabs>
            </div>
          </div>
          <q-separator />
          <div
            class="row  q-px-md q-py-sm scroll "
            style="min-height:60vh;max-height:75vh"
          >
            <div class="col">
              <q-tab-panels
                v-model="tab"
                animated
                style="background-color:transparent;padding:0 "
                transition-prev="fade"
                transition-next="fade"
              >
                <q-tab-panel
                  name="1"
                  class="bg-transparent q-pa-none"
                >
                  <div class="row q-col-gutter-md ">
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >INFORMATIONS SUR LE GROUPE <span
                                class="text-primary"
                                v-if="groupe.folio"
                              >[ {{groupe.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="groupe.folio"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="las la-copy"
                              unelevated
                              round
                              size="sm"
                              @click="$helper.copy(groupe.folio)"
                            >
                              <q-tooltip>
                                Copier le code de l'identite
                              </q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">

                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Appellation</input-label>
                              <div class="text-details">{{groupe.designation || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Sigle</input-label>
                              <div class="text-details">{{groupe.sigle || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Document autorisant l'existence du groupe</input-label>
                              <div class="text-details">{{groupe.type_document || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>N* notariant du document</input-label>
                              <div class="text-details">{{groupe.num_document || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Autres documents</input-label>
                              <div class="text-details">{{groupe.autres_documents || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Secteur d'activité</input-label>
                              <div class="text-details">{{groupe.secteur ? groupe.secteur.designation : 'Non défini' }}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Date de création de groupe</input-label>
                              <div class="text-details">{{groupe.date_creation || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Propriétaire d'autres comptes ailleurs ?</input-label>
                              <div class="text-details">{{groupe.autres_banques || 'Non défini'}}</div>
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
                              >CONTRIBUTIONS</div>
                            </div>
                            <q-separator />
                            <div class="q-px-md q-pt-sm q-pb-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                  <input-label>Fréquence de contribution</input-label>
                                  <div class="text-details">{{groupe.type_contribution || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Montant CDF</input-label>
                                  <div class="text-details">{{groupe.montant_cdf || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Montant USD</input-label>
                                  <div class="text-details">{{groupe.montant_usd || 'Non défini'}}</div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="ba overflow-hidden panel-primary">

                            <div class="q-mt-none q-px-md q-pb-md">
                              <div class="row q-col-gutter-sm">
                                <div class="col-12">
                                  <input-label>Détails à préciser</input-label>
                                  <div class="text-details">{{groupe.description || 'Non défini'}}</div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="2"
                  class="bg-transparent q-pa-none"
                >
                  <div class="row q-col-gutter-md ">
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** ADRESSES ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >ADRESSES </div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm ">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Pays</input-label>
                              <div class="text-details">{{groupe.pays || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Province</input-label>
                              <div class="text-details">{{groupe.province || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Ville </input-label>
                              <div class="text-details">{{groupe.ville || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Commune/ Territoire</input-label>
                              <div class="text-details">{{groupe.commune || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Quartier/ Groupement</input-label>
                              <div class="text-details">{{groupe.quartier || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Avenue/ Village</input-label>
                              <div class="text-details">{{groupe.avenue || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>N° maison/immeuble</input-label>
                              <div class="text-details">{{groupe.num_maison || 'Non défini'}}</div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <!-- ************** CONTACTS ******************* -->
                    <!-- ******************************************* -->
                    <!-- ******************************************* -->
                    <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
                      <div class="ba overflow-hidden panel-primary">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >CONTACTS</div>
                          </div>
                        </div>
                        <q-separator />
                        <div class="q-px-md q-pt-sm q-pb-md">
                          <div class="row q-col-gutter-sm">
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Téléphone 1</input-label>
                              <div class="text-details">{{groupe.phone1 || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Téléphone 2</input-label>
                              <div class="text-details">{{groupe.phone2 || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Téléphone 3</input-label>
                              <div class="text-details">{{groupe.phone3 || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Adresse mail</input-label>
                              <div class="text-details">{{groupe.email || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Facebook</input-label>
                              <div class="text-details">{{groupe.facebook || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <input-label>Twitter</input-label>
                              <div class="text-details">{{groupe.twitter || 'Non défini'}}</div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="3"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >MEMBRES DU GROUPE</div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table head-bold hover table-striped table-colored-head ba-outer">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>CODE</th>
                            <th
                              style="width:20%"
                              class="text-left"
                            >NOM COMPLET</th>
                            <th class="text-center">SEXE</th>
                            <th class="text-center">FONCTION</th>
                            <th class="text-center">COMITE</th>
                            <th class="text-center">GESTIONNAIRE</th>
                            <th class="text-center">SOLDE CDF</th>
                            <th class="text-center">SOLDE USD</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in groupe.membres"
                            :key="index"
                            @dblclick="selectedMembre=row; showDlgDetails=true"
                          >
                            <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="20px"
                              >
                                {{ index + 1 }}
                              </q-avatar>
                            </td>
                            <td class="text-center text-bold">{{ row.folio || 'Non défini' }} </td>
                            <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                            <td class="text-center">{{ row.sexe }}</td>
                            <td class="text-center">{{ row.fonction }}</td>
                            <td class="text-center">{{ row.in_comite }}</td>
                            <td class="text-center">{{ row.is_gestionnaire }}</td>
                            <td class="text-center text-bold">{{ $helper.formatMoney(row.solde.cdf.solde.montant)}} CDF</td>
                            <td class="text-center text-bold">{{ $helper.formatMoney(row.solde.usd.solde.montant)}} USD</td>

                            <!-- ************************************* -->
                            <!-- *************** MENU    ************* -->
                            <!-- ************************************* -->

                            <q-menu
                              touch-position
                              context-menu
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-list
                                separator
                                style="min-width: 100px"
                              >
                                <q-item>
                                  <q-item-section avatar>
                                    <q-avatar color="blue-1">
                                      <q-icon
                                        size="40px"
                                        name="img:statics/images/icone/avatar.png"
                                      />
                                    </q-avatar>
                                  </q-item-section>
                                  <q-item-section>
                                    <q-item-label class="text-bold">{{row.nom_complet}}</q-item-label>
                                    <q-item-label caption>Sexe : {{row.sexe}}</q-item-label>
                                  </q-item-section>
                                </q-item>

                                <q-item
                                  clickable
                                  v-ripple
                                  v-close-popup
                                  @click="selectedMembre=row; showDlgDetails=true"
                                >
                                  <q-item-section avatar>
                                    <q-icon
                                      class="las la-caret-square-down"
                                      size="24px"
                                      color="primary"
                                    />
                                  </q-item-section>
                                  <q-item-section>Afficher détails</q-item-section>
                                </q-item>

                              </q-list>
                            </q-menu>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="4"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >COMPTES</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>DEVISE</th>
                            <th class="text-left">COMPTE</th>
                            <th class="text-left">INTITULE</th>
                            <th class="text-left">PRODUIT</th>
                            <th class="text-right">GELE</th>
                            <th
                              colspan="2"
                              class="text-center"
                            >SOLDE</th>
                            <th
                              colspan="2"
                              class="text-right"
                            >DISPONIBLE</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <template v-for="(row0,key0,index0) in groupe.comptes_grp">
                            <tr :key="'cmpt0'+index0">
                              <td
                                colspan="10"
                                class="text-bold text-primary bg-blue-1"
                              >{{key0}}</td>
                            </tr>
                            <tr
                              v-for="(row,index) in row0"
                              :key="index0+'cmpt'+index"
                              @dblclick="selectedCompte = row; tab = '5'"
                            >
                              <td class="text-center">
                                <q-avatar
                                  color="primary"
                                  text-color="white"
                                  size="20px"
                                >{{index+1}}</q-avatar>
                              </td>
                              <td
                                class="text-bold text-center"
                                style="width:45px"
                              >
                                {{row.devise}}
                              </td>
                              <td class="text-center text-bold">{{row.indice}}</td>
                              <td class="text-bold">{{row.designation}}</td>
                              <td>{{row.type_epargne}}</td>
                              <td class="text-right text-bold bg-red-1 text-red">
                                {{$helper.formatMoney(row.solde.montant_gele)}}
                              </td>
                              <td class="text-right text-bold">
                                {{$helper.formatMoney(row.solde.solde_global.montant)}}
                              </td>
                              <td class="text-left text-bold bg-blue-1">
                                S{{row.solde.solde_global.solde}}
                              </td>
                              <td class="text-right text-bold">
                                {{$helper.formatMoney(row.solde.solde.montant)}}
                              </td>
                              <td class="text-left text-bold bg-blue-1">
                                S{{row.solde.solde.solde}}
                              </td>
                              <!-- ************************************* -->
                              <!-- *************** MENU    ************* -->
                              <!-- ************************************* -->

                              <q-menu
                                touch-position
                                context-menu
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-list
                                  separator
                                  style="min-width: 100px"
                                >
                                  <q-item
                                    clickable
                                    v-ripple
                                    v-close-popup
                                    @click="selectedCompte = row; tab = '5'"
                                  >
                                    <q-item-section avatar>
                                      <q-icon
                                        class="las la-caret-square-down"
                                        size="24px"
                                        color="primary"
                                      />
                                    </q-item-section>
                                    <q-item-section>Afficher le relevé relatif à ce compte</q-item-section>
                                  </q-item>
                                </q-list>
                              </q-menu>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="5"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center">
                      <div class="col">
                        <div class="row items-center">
                          <div class="col">
                            <div
                              class="q-py-xs q-px-sm text-h6"
                              style="font-size:14px"
                            >RELEVES DE COMPTE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:65vh"
                    >
                      <relevesCompte
                        :selectedCompte="selectedCompte"
                        :groupe="{id:idGroupe}"
                      />
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="6"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >CREDITS</div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:50vh"
                    >
                      <table class="table ba-outer head-bold hover table-striped table-colored-head ">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th class="text-left">DOSSIER</th>
                            <th class="text-left">PRODUIT</th>
                            <th class="text-left">DATE EFFET</th>
                            <th class="text-right">MONTANT PRET</th>
                            <th class="text-right">ENCOURS</th>
                            <th class="text-right">I. CAPITAL</th>
                            <th class="text-right">I. INTERET</th>
                            <th class="text-right">PENALITE</th>
                            <th class="text-right">T. IMPAYE</th>
                            <th class="text-center">RETARD</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in groupe.credits"
                            :key="index"
                            @dblclick="selectedCredit =row; showDlgAmortissement=true"
                          >
                            <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="20px"
                              >
                                {{ index + 1 }}
                              </q-avatar>
                            </td>
                            <td class="text-left ">{{ row.code }} </td>
                            <td class="text-left">{{ row.produit_str }} - {{row.devise}}</td>
                            <td class="text-left">{{ $helper.dateBien(row.date_effet,false) }}</td>
                            <td class="text-right">{{$helper.formatMoney( row.montant_pret) }}</td>
                            <td class="text-right">{{ $helper.formatMoney(row.encours_capital) }}</td>
                            <td class="text-right">{{ $helper.formatMoney(row.impaye_capital) }}</td>
                            <td class="text-right">{{ $helper.formatMoney(row.impaye_interet) }}</td>
                            <td class="text-right">{{ $helper.formatMoney(row.impaye_penalite) }}</td>
                            <td class="text-right">{{ $helper.formatMoney(($helper.toDouble(row.impaye_capital) + $helper.toDouble(row.impaye_interet)+ $helper.toDouble(row.impaye_penalite))) }}</td>
                            <td class="text-center">{{ row.jours_retard }} Jrs</td>

                            <!-- ************************************* -->
                            <!-- *************** MENU    ************* -->
                            <!-- ************************************* -->

                            <q-menu
                              touch-position
                              context-menu
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-list
                                separator
                                style="min-width: 100px"
                              >
                                <q-item
                                  clickable
                                  v-ripple
                                  v-close-popup
                                  @click="selectedCredit =row; showDlgAmortissement=true"
                                >
                                  <q-item-section avatar>
                                    <q-icon
                                      class="las la-caret-square-down"
                                      size="24px"
                                      color="primary"
                                    />
                                  </q-item-section>
                                  <q-item-section>Afficher le tableau d'amortissement</q-item-section>
                                </q-item>

                              </q-list>
                            </q-menu>
                          </tr>

                          <template v-if="!groupe.credits || groupe.credits.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="11"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/searchIn.png"
                                  title="Aucun dossier de crédit trouvé"
                                  :showBtn="false"
                                />
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

    <detailsMembre
      v-model="showDlgDetails"
      :selectedMembre="selectedMembre"
      :user="user"
    />

    <tableauAmortissement
      v-model="showDlgAmortissement"
      :selectedAmortissement="selectedCredit?{id_decaissement:selectedCredit.id_decaissement}:null"
    />
  </div>
</template>

<script>
import detailsMembre from '../membre/details_membre.vue'
import relevesCompte from './releves_compte.vue'
import tableauAmortissement from './../../../../../credits/components/amortissement/details_amortissement.vue'

export default {
  name: 'dialogDetailsEnfant',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgDetails: false,
      showDlgAmortissement: false,

      selectedMembre: null,
      selectedCompte: null,
      selectedCredit: null,

      groupe: {
        actionnaires: [],
        comptes: [],
        credits: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    idGroupe: null
  },
  components: {
    detailsMembre,
    relevesCompte,
    tableauAmortissement
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    if (this.user === null) {
      this.$emit('onclose', true)
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.idGroupe) {
          this.getDetailsGroupe()
        } else {
          this.showDialog = false
        }

        this.selectedCompte = null
        this.tab = '1'
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
    getDetailsGroupe () {
      const donnees = JSON.stringify({
        id_groupe: this.idGroupe
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Groupe/getDetailsGroupe/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.groupe = {
              ...infos.data.records.groupe,
              ...infos.data.records
            }
          } else {
            this.showDialog = false
            this.$helper.showMessage(infos.data.message)
          }
        })
        .catch(e => {
          this.showDialog = false
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
    }
  }

}
</script>

<style lang="stylus"></style>
