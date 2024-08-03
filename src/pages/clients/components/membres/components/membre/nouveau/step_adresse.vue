<template>
  <div class="panel-primary">
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
                <input-label required>Pays</input-label>
                <q-select
                  :disable="!(!!identite)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  placeholder="Séléctionner un pays"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  clearable
                  use-input
                  emit-value
                  map-options
                  v-model="identite.pays"
                  :options="pays"
                  :option-value="opt => opt ? (typeof opt === 'string' ? opt : opt.nom) : null "
                  :option-label="opt => (typeof opt === 'string' ? opt : opt.nom)"
                  @filter="filterPays"
                  lazy-rules
                  :rules="[ val => !!val || 'Séléctionner n un pays']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-primary">
                        Aucun pays trouvé
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Province</input-label>
                <q-select
                  :disable="!(!!identite)"
                  transition-show="scale"
                  transition-hide="scale"
                  square
                  outlined
                  dense
                  placeholder="Séléctionner une province"
                  fill-input
                  hide-selected
                  hide-bottom-space
                  clearable
                  use-input
                  emit-value
                  map-options
                  v-model="identite.province"
                  :options="provinces"
                  :option-value="opt => opt"
                  :option-label="opt => `${opt}`"
                  @filter="filterProvinces"
                  lazy-rules
                  :rules="[ val => !!val || 'Séléctionner une province']"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-primary">
                        Saisissez le nom de la province
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Ville </input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.ville"
                  placeholder="Ville"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Commune/ Territoire</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.commune"
                  placeholder="Commune"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Quartier/ Groupement</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.quartier"
                  placeholder="Quartier"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Avenue/ Village</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.avenue"
                  placeholder="Avenue"
                  lazy-rules
                  :rules="[ val => val && val.trim().length > 3 || 'Minimun 3 caractères']"
                  maxlength="150"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label>N° maison/immeuble</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.num_maison"
                  placeholder="Numéro de la maison"
                  lazy-rules
                  :rules="[ val => !val || val.trim().length >= 3 || 'Minimun 3 caractères']"
                  maxlength="20"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <input-label required>Type de menage</input-label>
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
                  v-model="identite.type_menage"
                  placeholder="Séléctionner le type"
                  lazy-rules
                  :options="['PROPRIETAIRE','LOCATAIRE']"
                  :rules="[val => !!val || 'Choisissez une option']"
                />
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
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <input-label
                  required
                  info="Le numéro de téléphone doit commencer par le code du pays auquel appartient le numéro; Ex: +243994061228"
                >Téléphone 1</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.phone"
                  placeholder="Ex. +243995467234"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Champs requis',
                            val => this.$helper.isTelephone(val) || 'Numéro invalide',
                            val => val.length >= 12 || 'Pas moins de 12 chiffres',
                            val => val.length <= 14 || 'Pas plus de 14 chiffres']"
                  maxlength="16"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <input-label>Téléphone 2</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.phone2"
                  placeholder="Numéro 2"
                  lazy-rules
                  :rules="[ val => !val || this.$helper.isTelephone(val) || 'Numéro invalide',
                            val => !val || val.length >= 12 || 'Pas moins de 12 chiffres',
                            val => !val || val.length <= 14 || 'Pas plus de 14 chiffres']"
                  maxlength="16"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <input-label>Adresse mail</input-label>
                <q-input
                  :disable="!(!!identite)"
                  square
                  outlined
                  dense
                  hide-bottom-space
                  v-model="identite.email"
                  placeholder="ex. example@gmail.com"
                  lazy-rules
                  :rules="[ val => !val || !!val && this.$helper.isMail(val) || 'Adresse mail invalide']"
                  maxlength="150"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'step_adresse',
  data () {
    return {
      pays: [],
      paysTemps: [],

      provinces: [],
      provincesTemps: []

    }
  },
  props: ['value'],
  components: {},
  beforeMount () {
    this.paysTemps = this.$datas.pays
    this.provincesTemps = this.$datas.provinces
  },
  computed: {
    identite: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    filterProvinces (val, update, abort) {
      update(() => {
        this.provinces = this.provincesTemps.filter(e => e.toLowerCase().indexOf(val.toLowerCase()) > -1)
        if (this.provinces.length === 0) {
          this.provinces.push(val)
        }
      })
    },
    filterPays (val, update, abort) {
      update(() => {
        this.pays = this.paysTemps.filter(e => e.nom.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.code_pays.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
  }
}
</script>

<style>
</style>
