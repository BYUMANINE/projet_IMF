<template>
  <q-page style="min-height:0">
    <div class="ba overflow-hidden panel-primary q-mt-sm">
      <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

        <div class="col">
          <div class="text-h6">Rechercher un compte adhérent</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="blue-1"
            text-color="primary"
            icon="las la-broom"
            label="Vider"
            unelevated
            rounded
            size="12px"
            no-caps
            @click="viderChamps()"
          />
        </div>

      </div>
      <linearLoading :loading="loading" />
      <q-separator />

      <q-form
        ref="myForm"
        class="q-pa-sm"
      >
        <div class="row q-col-gutter-md ">
          <!-- ******************************************* -->
          <!-- ******************************************* -->
          <!-- ************** SITE ******************* -->
          <!-- ******************************************* -->
          <!-- ******************************************* -->
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-6 col-xl-5">
            <div class="ba overflow-hidden panel-primary">

              <div class="q-pa-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <input-label>Type adhérent</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      placeholder="Sélectionner un type adhérent"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      clearable
                      v-model="filtre.type"
                      :options="optionsTypes"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.label}`"
                      @input="$vue.set(filtre,'client',null);"
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12">
                    <input-label>Code ou nom de l'adhérent</input-label>
                    <q-select
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      clearable
                      placeholder="Sélectionner un adhérent"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      v-model="filtre.client"
                      :options="adherents"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.folio} - ${opt.client_str}`"
                      @filter="filterAdherents"
                      lazy-rules
                      :rules="[ val => !!val || 'Sélectionner un adhérent']"
                    >
                      <template #prepend>
                        <q-icon name="search" />
                      </template>
                      <template #no-option>
                        <q-item>
                          <q-item-section class="text-red">
                            Aucune adhérent trouvé
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12 q-pt-md text-left">
                    <q-btn
                      color="primary"
                      label="SITUATION DU COMPTE"
                      icon-right="search"
                      unelevated
                      no-caps
                      size="md"
                      @click="$refs.myForm.validate().then(onSubmit)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </q-form>

      <detailsMembre
        v-model="showDlgDetailsMembre"
        :idMembre="this.filtre.client ? this.filtre.client.id_client : null"
        :user="user"
      />

      <detailsGroupe
        v-model="showDlgDetailsGroupe"
        :idGroupe="this.filtre.client ? this.filtre.client.id_client : null"
      />

      <detailsEntreprise
        v-model="showDlgDetailsEntreprise"
        :idEntreprise="this.filtre.client ? this.filtre.client.id_client : null"
      />
    </div>
  </q-page>
</template>
<script>
import detailsMembre from '../../../../../clients/components/membres/components/membre/details_membre.vue'
import detailsGroupe from '../../../../../clients/components/groupes/components/groupe/details_groupe.vue'
import detailsEntreprise from '../../../../../clients/components/entreprises/components/entreprise/details_entreprise.vue'

export default {
  name: 'recherche_sur_compte',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      showDlgDetailsMembre: false,
      showDlgDetailsGroupe: false,
      showDlgDetailsEntreprise: false,

      filtre: {},

      adherents: [],

      optionsTypes: [
        { value: 'MEMBRE', label: 'Membres individuels' },
        { value: 'GROUPE', label: 'Groupes residuels' },
        { value: 'ENTREPRISE', label: 'Les entreprises' }
      ]

    }
  },

  components: {
    detailsMembre,
    detailsGroupe,
    detailsEntreprise
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () { },
  destroyed: function () { },
  watch: {},
  computed: {

  },
  methods: {
    viderChamps () {
      this.filtre = {}

      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    },

    filterAdherents (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        only_types: [this.filtre.type ? this.filtre.type.value : undefined],
        only_produits: ['EAV']
      })

      let url = `${this.URLS.BASE_URL}/Adherent/searchAdherents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.adherents = infos.data.records
        })
      }).catch(() => {
        update(() => { this.adherents = [] })
      })
    },
    onSubmit (isOk) {
      if (!isOk) return

      if (this.filtre.client.type_client === 'MEMBRE') {
        this.showDlgDetailsMembre = true
      } else if (this.filtre.client.type_client === 'GROUPE') {
        this.showDlgDetailsGroupe = true
      } else if (this.filtre.client.type_client === 'ENTREPRISE') {
        this.showDlgDetailsEntreprise = true
      }
    }

  }

}
</script>
<style lang="stylus"></style>
