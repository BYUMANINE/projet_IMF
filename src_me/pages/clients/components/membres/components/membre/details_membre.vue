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
            <div class="col-auto">
              <q-icon
                name="info"
                size="sm"
                color="primary"
              />
            </div>
            <div class="col">
              <div class="text-h6">Détails du membre [ <span class="text-primary">{{membre.folio}}</span> ]</div>
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
                  <strong class="style-tab">MANDATAIRES</strong>
                </q-tab>
                <q-tab name="4">
                  <strong class="style-tab">HERITIERS</strong>
                </q-tab>
                <q-tab name="5">
                  <strong class="style-tab">COMPTES</strong>
                </q-tab>
                <q-tab name="6">
                  <strong class="style-tab">RELEVES</strong>
                </q-tab>
                <q-tab name="7">
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
                            >INFORMATIONS SUR LE MEMBRE <span
                                class="text-primary"
                                v-if="membre.folio"
                              >[ {{membre.folio}} ]</span></div>
                          </div>
                          <div
                            class="col-auto q-py-xs q-pr-md"
                            v-if="membre.folio"
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
                                    :src=" (!!membre.photo ?  `${URLS.IMG_MEMBRE}/${membre.photo}` :'statics/images/icone/avatar.png')"
                                    spinner-color="white"
                                    spinner-size="35px"
                                    class="stylePhoto bg-blue-1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm col-md col-lg col-xl q-mt-none q-pt-none">
                              <div class="row">
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Nom</input-label>
                                  <div class="text-details">{{membre.nom || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Postnom</input-label>
                                  <div class="text-details">{{membre.postnom || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Prenom</input-label>
                                  <div class="text-details">{{membre.prenom || 'Non défini'}}</div>
                                </div>
                              </div>

                              <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Sexe</input-label>
                                  <div class="text-details">{{membre.sexe || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Etat civil</input-label>
                                  <div class="text-details">{{membre.etat_civil || 'Non défini'}}</div>
                                </div>

                                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <input-label>Date de naissance</input-label>
                                  <div class="text-details">{{membre.date_naissance || 'Non défini'}}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row q-col-gutter-sm">

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu de naissance</input-label>
                              <div class="text-details"> {{membre.lieu_naissance || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Profession</input-label>
                              <div class="text-details"> {{membre.profession || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Nombre d'enfants</input-label>
                              <div class="text-details"> {{membre.nb_enfant || 'Non défini'}}</div>

                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Secteur d'activité</input-label>
                              <div class="text-details"> {{membre.secteur_str || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Autres activités</input-label>
                              <div class="text-details"> {{membre.autres_activites || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Lieu d'activité</input-label>
                              <div class="text-details"> {{membre.lieu_activite || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Revenu mensuel moyen ({{user.devise}})</input-label>
                              <div class="text-details"> {{membre.revenu_moyen || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Propriétaire d'autres comptes ailleurs ?</input-label>
                              <div class="text-details"> {{membre.autres_banques || 'Non défini'}}</div>

                            </div>

                            <div class="col-12">
                              <input-label>Activité publique ?</input-label>
                              <div class="text-details"> {{membre.activite_publique || 'Non défini'}}</div>

                            </div>
                            <div
                              class="col-12"
                              v-if="membre.activite_publique==='OUI'"
                            >
                              <input-label>Fonction / Grade publique</input-label>
                              <div class="text-details"> {{membre.fonction_publique || 'Non défini'}}</div>
                            </div>

                            <div class="col-12">
                              <input-label>Personne ou proche associé exercant une activité publique ?</input-label>
                              <div class="text-details"> {{membre.proche_activite_publique || 'Non défini'}}</div>
                            </div>
                            <div
                              class="col-12"
                              v-if="membre.proche_activite_publique==='OUI'"
                            >
                              <input-label>Lien avec cette personne</input-label>
                              <div class="text-details"> {{membre.lien_personne_publique || 'Non défini'}}</div>
                            </div>

                            <div class="col-12">
                              <input-label>Etes-vous apparenté ou proche associé d'une personne exercant une activité publique ?</input-label>
                              <div class="text-details"> {{membre.avoirs_loges || 'Non défini'}}</div>
                            </div>

                            <div
                              class="col-12"
                              v-if="membre.avoirs_loges === 'NON'"
                            >
                              <input-label>Sinon, indiquez le lien et les noms de bénéficiaires effectifs</input-label>
                              <div class="text-details"> {{membre.beneficiaire_avoirs || 'Non défini'}}</div>
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
                                  <div class="text-details">{{membre.numero_impot || 'Non défini'}}</div>
                                </div>

                                <div class="col-12">
                                  <input-label>Type de pièce d'identité</input-label>
                                  <div class="text-details">{{membre.type_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-12">
                                  <input-label>Numéro de la pièce</input-label>
                                  <div class="text-details">{{membre.num_piece || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Lieu de délivrance</input-label>
                                  <div class="text-details">{{membre.lieu_delivrance || 'Non défini'}}</div>

                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                  <input-label>Pièce valide jusqu'au</input-label>

                                  <div
                                    v-if="!$helper.isExpireDate(membre.expiration_piece)"
                                    class="text-details"
                                  > {{membre.expiration_piece || 'Non définie' }}</div>
                                  <div
                                    v-else
                                    class="text-details bg-red-1 text-red text-bold"
                                  >
                                    Pièce non valide depuis {{membre.expiration_piece }}
                                  </div>
                                </div>
                                <div class="col-12">
                                  <input-label>Nationalité</input-label>
                                  <div class="text-details">{{membre.nationalite || 'Non défini'}}</div>
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
                                  <input-label>Membre sensibilisé par</input-label>
                                  <div class="text-details">{{membre.sensibilateur || 'Non défini'}}</div>

                                </div>
                                <div class="col-12">
                                  <input-label>Détails à préciser</input-label>
                                  <div class="text-details">{{membre.description || 'Non défini'}}</div>

                                </div>
                                <div class="col-12">
                                  <input-label>Signature membre</input-label>
                                  <q-img
                                    v-if="!!membre && !!membre.signature"
                                    :src="`${URLS.IMG_SIGNATURE}/${membre.signature}`"
                                    spinner-color="blue"
                                    spinner-size="20px"
                                    class="panel-primary"
                                    contain
                                    style="height: 150px; width: 100%;border:2px dotted #5764ec"
                                  />
                                  <div
                                    v-else
                                    class="text-center q-py-md"
                                    style="height: 150px; width: 100%;border:2px dotted #5764ec"
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
                              <div class="text-details"> {{membre.pays || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Province</input-label>
                              <div class="text-details"> {{membre.province || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Ville </input-label>
                              <div class="text-details"> {{membre.ville || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Commune/ Territoire</input-label>
                              <div class="text-details"> {{membre.commune || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Quartier/ Groupement</input-label>
                              <div class="text-details"> {{membre.quartier || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Avenue/ Village</input-label>
                              <div class="text-details"> {{membre.avenue || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>N° maison/immeuble</input-label>
                              <div class="text-details"> {{membre.num_maison || 'Non défini'}}</div>

                            </div>
                            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <input-label>Type de menage</input-label>
                              <div class="text-details"> {{membre.type_menage || 'Non défini'}}</div>

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
                            <div class="col-12">
                              <input-label>Téléphone 1</input-label>
                              <div class="text-details"> {{membre.phone || 'Non défini'}}</div>

                            </div>
                            <div class="col-12">
                              <input-label>Téléphone 2</input-label>
                              <div class="text-details"> {{membre.phone2 || 'Non défini'}}</div>

                            </div>
                            <div class="col-12">
                              <input-label>Adresse mail</input-label>
                              <div class="text-details"> {{membre.email || 'Non défini'}}</div>

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
                      >MANDATAIRES</div>
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
                            <th>PHOTO</th>
                            <th
                              style="width:20%"
                              class="text-left"
                            >NOM COMPLET</th>
                            <th class="text-center">SEXE</th>
                            <th class="text-center">ETAT CIVIL</th>
                            <th class="text-center">NATIONALITE</th>
                            <th class="text-center">PROFESSION</th>
                            <th class="text-center">PIECE</th>
                            <th class="text-center">POUVOIRS</th>
                            <th class="text-center">MAX RETRAIT</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in membre.mandataires"
                            :key="index"
                            @dblclick="selectedMandataire=row; showDlgDetails=true"
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
                            <td class="text-center">
                              <div
                                class="color-gradient text-center"
                                style="padding:3px; width:41px;margin:auto"
                              >
                                <q-img
                                  :src="!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png'"
                                  spinner-color="blue"
                                  spinner-size="15px"
                                  class="panel-primary"
                                  style="height: 35px; width: 35px;"
                                />
                              </div>
                              <q-tooltip
                                transition-show="scale"
                                transition-hide="scale"
                                anchor="center right"
                                self="center middle"
                                content-class="panel-primary shadow-3 q-pa-none"
                              >
                                <div
                                  class="color-gradient text-center"
                                  style="padding:3px; width:250px"
                                >
                                  <q-img
                                    :src="!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png'"
                                    spinner-color="blue"
                                    spinner-size="20px"
                                    class="panel-primary"
                                    style="height: 243px; width: 243px;"
                                  />
                                </div>
                              </q-tooltip>
                            </td>
                            <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                            <td class="text-center">{{ row.sexe }}</td>
                            <td class="text-center">{{ row.etat_civil }}</td>
                            <td class="text-center">{{ row.nationalite }}</td>
                            <td class="text-center">{{ row.profession }}</td>
                            <td class="text-center">{{ row.type_piece }}</td>
                            <td class="text-center">{{ row.pouvoirs.length > 0 ? row.pouvoirs.join(" ; ") : "Non défini" }}</td>
                            <td class="text-center">{{ row.max_retrait || 'Non défini' }}</td>

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
                                  @click="selectedMandataire=row; showDlgDetails=true"
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
                          <template v-if="!membre.mandataires || membre.mandataires.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="10"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/enseignants.png"
                                  title="Aucun mandataire au compte de ce membre"
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
                <q-tab-panel
                  name="4"
                  class="q-pa-none"
                >
                  <div class="ba overflow-hidden panel-primary">
                    <div class="row items-center q-py-xs q-px-sm">
                      <div
                        class="col text-h6"
                        style="font-size:14px"
                      >HERITIERS</div>
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
                            <th
                              style="width:20%"
                              class="text-left"
                            >NOM COMPLET</th>
                            <th class="text-center">SEXE</th>
                            <th class="text-center">DATE NAISS.</th>
                            <th class="text-center">LIEU NAISS.</th>
                            <th class="text-center">ETAT CIVIL</th>
                            <th class="text-center">NATIONALITE</th>
                            <th class="text-center">PROFESSION</th>
                            <th class="text-center">ADRESSE</th>
                            <th class="text-center">TELEPHONE</th>
                            <th class="text-center">EMAIL</th>

                          </tr>
                        </thead>

                        <tbody style="font-size:12px">
                          <tr
                            v-for="(row, index) in membre.heritiers"
                            :key="index"
                            @dblclick="selectedHeritier=row; showDlgDetailsHeritier=true"
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
                            <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                            <td class="text-center">{{ row.sexe }}</td>
                            <td class="text-center">{{ row.date_naissance }}</td>
                            <td class="text-center">{{ row.lieu_naissance }}</td>
                            <td class="text-center">{{ row.etat_civil }}</td>
                            <td class="text-center">{{ row.nationalite  || 'Non définie'}}</td>
                            <td class="text-center">{{ row.profession || 'Non définie' }}</td>
                            <td class="text-center">{{ row.adresse || 'Non définie' }}</td>
                            <td class="text-center">{{ row.phone || 'Non définie' }}</td>
                            <td class="text-center">{{ row.email || 'Non définie' }}</td>

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
                                  @click="selectedHeritier=row; showDlgDetailsHeritier=true"
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

                          <template v-if="!membre.heritiers || membre.heritiers.length === 0">
                            <tr class="panel-primary">
                              <td
                                :colspan="11"
                                class="text-center"
                              >
                                <nondata
                                  icone="img:statics/images/icone/enseignants.png"
                                  title="Aucun héritier défini"
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
                            >COMPTES</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <q-separator />
                    <div
                      class="scroll"
                      style="height:60vh"
                    >
                      <table class="table ba-outer head-bold table-striped table-colored-head">
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
                          <template v-for="(row0,key0,index0) in membre.comptes_grp">
                            <tr :key="'cmpt0'+index0">
                              <td
                                colspan="10"
                                class="text-bold text-primary bg-blue-1"
                              >{{key0}}</td>
                            </tr>
                            <tr
                              v-for="(row,index) in row0"
                              :key="index0+'cmpt'+index"
                              @dblclick="selectedCompte = row; tab = '6'"
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
                              <td class="text-left text-bold">{{row.indice}}</td>
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
                                    @click="selectedCompte = row; tab = '6'"
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
                  name="6"
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
                        :membre="{id:idMembre}"
                      />
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel
                  name="7"
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
                            v-for="(row, index) in membre.credits"
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

                          <template v-if="!membre.credits || membre.credits.length === 0">
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

    <detailsMandataire
      v-model="showDlgDetails"
      :selectedMandataire="selectedMandataire"
      :user="user"
    />

    <detailsHeritier
      v-model="showDlgDetailsHeritier"
      :selectedHeritier="selectedHeritier"
      :user="user"
    />

    <tableauAmortissement
      v-model="showDlgAmortissement"
      :selectedAmortissement="selectedCredit?{id_decaissement:selectedCredit.id_decaissement}:null"
    />
  </div>
</template>

<script>
import detailsMandataire from '../mandataire/details_mandataire.vue'
import detailsHeritier from '../heritier/details_heritier.vue'
import relevesCompte from './releves_compte.vue'
import tableauAmortissement from './../../../../../credits/components/amortissement/details_amortissement.vue'

export default {
  name: 'dialogDetailsMembre',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      loading: false,
      showDlgDetails: false,
      showDlgDetailsHeritier: false,
      showDlgAmortissement: false,

      selectedMandataire: null,
      selectedHeritier: null,
      selectedCompte: null,
      selectedCredit: null,

      membre: {
        actionnaires: [],
        heritiers: [],
        comptes: [],
        credits: []
      },
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    idMembre: null
  },
  components: {
    detailsMandataire,
    detailsHeritier,
    relevesCompte,
    tableauAmortissement
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.idMembre) {
          this.getDetailsMembre()
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
    getDetailsMembre () {
      const donnees = JSON.stringify({
        id_membre: this.idMembre
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Membre/getDetailsMembre/`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.membre = {
              ...infos.data.records.membre,
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
