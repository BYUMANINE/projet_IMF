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
              >INFORMATIONS SUR LE GROUPE <span
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
                >Appellation</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.designation"
                  placeholder="Appellation"
                  lazy-rules
                  :rules="[ val => val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Sigle</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.sigle"
                  placeholder="Sigle"
                  lazy-rules
                  :rules="[ val => !val || (!!val && val.trim().length >= 2) || 'Minimun 2 caractères']"
                  maxlength="50"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Document autorisant l'existence du groupe</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.type_document"
                  placeholder="Document"
                  lazy-rules
                  :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="50"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>N* notariant du document</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.num_document"
                  placeholder="Numéro"
                  lazy-rules
                  :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="50"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>Autres documents</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model.trim="identite.autres_documents"
                  placeholder="Autres documents"
                  lazy-rules
                  :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="200"
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
                <input-label required>Date de création du groupe</input-label>
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
                  :rules="[val => !!val && val.length > 0  || 'Selectionner une date',
                           val =>  this.$dateManager.inferieurEgalA(val,this.$helper.now('-')) || 'Doit être inferieure ou égale à la date actuelle']"
                  @click="$refs.popup_dt_creation.show()"
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
                  :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="255"
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
                >CONTRIBUTIONS</div>
              </div>
              <q-separator />
              <div class="q-px-md q-pt-sm q-pb-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <input-label required>Fréquence de contribution</input-label>
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
                      v-model="identite.type_contribution"
                      placeholder="Fréquence contribution"
                      lazy-rules
                      :options="requencesContributions"
                      :rules="[val => !!val || 'Choisissez une option']"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Montant CDF</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.montant_cdf"
                      placeholder="Montant (cdf) *"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="10"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <input-label required>Montant USD</input-label>
                    <q-input
                      :disable="!(!!identite)"
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="identite.montant_usd"
                      placeholder="Montant (usd) *"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                val => parseFloat(val) >= 0 || 'Le montant doit être superieur ou égal à zéro',]"
                      maxlength="10"
                    />
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
                      placeholder="Préciser d'autres détails à savoir sur le groupe (Facultatif)"
                      lazy-rules
                      :rules="[ val => !val || !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
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
export default {
  name: 'step_identite',
  data () {
    return {
      URLS: {},

      showDlgSecteur: false,
      requencesContributions: [
        'JOURNALIER',
        'HEBDOMADAIRE',
        'BIHEBDOMADAIRE',
        'MENSUEL'
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
