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

            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label
                  required
                  info="Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires"
                >Dénomination</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.designation"
                  placeholder="Dénomination"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Sigle</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.sigle"
                  placeholder="Sigle"
                  lazy-rules
                  :rules="[ val => val && val.trim().length >= 2 || 'Minimun 2 caractères']"
                  maxlength="50"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>N° RCCM/Patente</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.num_rccm"
                  placeholder="RCCM"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="60"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Identification Nationale</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.id_national"
                  placeholder="ID Nat."
                  lazy-rules
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="60"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Forme juridique</input-label>
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
                  v-model="identite.forme_juridique"
                  placeholder="Forme juridique"
                  :options="formes_juridiques"
                  lazy-rules
                  :rules="[val => !!val || 'Choisissez une option']"
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
                  placeholder="Secteur"
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
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-red">
                        Aucun secteur trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #after>
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
                <input-label>Numéro d'agrement</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.num_agrement"
                  placeholder="Numéro d'agrement"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="60"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Numéro d'impot</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.num_impot"
                  placeholder="Numéro d'impot"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="60"
                />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Employers plein temps</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.nb_employe_plein"
                  placeholder="Nombre"
                  lazy-rules
                  :rules="[ val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres']"
                  maxlength="3"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Employers temps partiel</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.nb_employe_partiel"
                  placeholder="Nombre"
                  lazy-rules
                  :rules="[ val => !val || this.$helper.isNumeric(val) || 'Uniquement les chiffres']"
                  maxlength="3"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Date de création de l'entreprise</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.date_creation"
                  placeholder="Date de création"
                  mask="####-##-## ##:##"
                  lazy-rules
                  readonly
                  :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date',
                           val => this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                  @click="$refs.popup_dt_creation.show()"
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
                        ref="popup_dt_creation"
                      >
                        <q-date
                          v-model="identite.date_creation"
                          mask="YYYY-MM-DD"
                          @input="() => $refs.popup_dt_creation.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
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
                  :rules="[ val => !val || val.trim().length > 3 || 'Minimun 3 caractères']"
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
                >CHIFFRE D'AFFAIRE & CAPITAL</div>
              </div>
              <q-separator />
              <div class="q-px-md q-pt-sm q-pb-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Chiffre d'affaire USD</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.ca_usd"
                      placeholder="CA (usd)*"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="7"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Chiffre d'affaire CDF</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.ca_cdf"
                      placeholder="CA (cdf) *"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="10"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Capital USD</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.capital_usd"
                      placeholder="Capital (usd) *"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="7"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Capital CDF</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.capital_cdf"
                      placeholder="Capital (cdf) *"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="10"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Date capital USD</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="identite.date_capital_usd"
                      placeholder="Date capital (usd)"
                      mask="####-##-## ##:##"
                      lazy-rules
                      readonly
                      :rules="[val => !val ||  val.length > 0  || 'Selectionner une date',
                               val => !val ||  this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                      @click="$refs.popup_dt_cap_usd.show()"
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
                            ref="popup_dt_cap_usd"
                          >
                            <q-date
                              v-model="identite.date_capital_usd"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_cap_usd.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label>Date capital CDF</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.date_capital_cdf"
                      placeholder="Date capital (cdf)"
                      mask="####-##-## ##:##"
                      lazy-rules
                      readonly
                      :rules="[val => !val ||  val.length > 0  || 'Selectionner une date',
                               val => !val ||  this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                      @click="$refs.popup_dt_cap_cdf.show()"
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
                            ref="popup_dt_cap_cdf"
                          >
                            <q-date
                              v-model="identite.date_capital_cdf"
                              mask="YYYY-MM-DD"
                              @input="() => $refs.popup_dt_cap_cdf.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
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
                      rows="3"
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

    <nouveauSecteur
      v-model="showDlgSecteur"
      :isAdd="true"
    />
  </div>
</template>

<script>
import nouveauSecteur from '../../../../secteurs_activite/nouveau_secteur.vue'
// import nouveauSecteur from '../../../../../../parametres/components/secteurs_activite/nouveau_secteur.vue'
export default {
  name: 'step_identite',
  data () {
    return {
      URLS: {},

      showDlgSecteur: false,

      formes_juridiques: [
        'Société Anonyme',
        'Société par Action à Responsabilité Limitée',
        'Société Commerciale',
        'Etablissement',
        'Autres'
      ],
      secteurs: [],
      categories: []
    }
  },
  props: ['value'],
  watch: {},
  components: {
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
