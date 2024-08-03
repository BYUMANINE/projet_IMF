<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
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
              <div class="text-h6">Détails de l'heritier</div>
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
            class="row  q-px-md q-py-sm scroll "
            style="min-height:50vh;max-height:65vh"
          >
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ************** IDENTITE ******************* -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-12">
              <div class="ba overflow-hidden panel-primary">
                <div class="row items-center">
                  <div class="col">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >INFORMATIONS SUR L'HERITIER</div>
                  </div>
                </div>
                <q-separator />
                <div class="q-px-md q-pt-sm q-pb-md">

                  <div class="row q-col-gutter-sm">
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Nom</input-label>
                      <div class="text-details">{{heritier.nom || 'Non défini'}}</div>

                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Postnom</input-label>
                      <div class="text-details">{{heritier.postnom || 'Non défini'}}</div>

                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Prenom</input-label>
                      <div class="text-details">{{heritier.prenom || 'Non défini'}}</div>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Sexe</input-label>
                      <div class="text-details">{{heritier.sexe || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Etat civil</input-label>
                      <div class="text-details">{{heritier.etat_civil || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <input-label>Date de naissance</input-label>
                      <div class="text-details">{{heritier.date_naissance || 'Non défini'}}</div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Lieu de naissance</input-label>
                      <div class="text-details"> {{heritier.lieu_naissance || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Profession</input-label>
                      <div class="text-details"> {{heritier.profession || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Téléphone</input-label>
                      <div class="text-details"> {{heritier.phone || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Adresse mail</input-label>
                      <div class="text-details"> {{heritier.email || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Nationalité</input-label>
                      <div class="text-details"> {{heritier.nationalite || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Adresse complete</input-label>
                      <div class="text-details"> {{heritier.adresse || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Lien familial</input-label>
                      <div class="text-details"> {{heritier.lien_familial || 'Non défini'}}</div>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <input-label>Autres détails à préciser</input-label>
                      <div class="text-details"> {{heritier.description || 'Non défini'}}</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogHeritier',
  data () {
    return {
      URLS: {},

      loading: false,
      heritier: {},
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedHeritier: {},
    user: {}
  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.tab = '1'

        if (this.selectedHeritier) {
          this.heritier = { ...this.selectedHeritier }
        } else {
          this.heritier = {}
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {}

}
</script>

<style lang="stylus">
.fixed-head .head-1 th
  position sticky
  top 0
  z-index 1000
  background-color white
</style>
