<template>
  <q-page class="filly-auto">
    <list-menu-options>
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="actualiser()"
      />
      <menu-option
        text="Vider formulaire"
        icon="clean.png"
        @option-clicked="viderChamps()"
      />
      <menu-option
        v-if="isAdd || !!entreprise.id_brouillon"
        :disable="step == 1"
        text="Enregistrer brouillon"
        icon="note.png"
        @option-clicked="saveBrouillon()"
      />
      <menu-option
        :disable="step == 1"
        text="Etape précédente"
        :icon="step == 1 ? 'prev_desable.png' : 'prev.png'"
        @option-clicked="() => {if (step > 1) {step--}}"
      />
      <menu-option
        :text="`${step == 3 ? 'Enregistrer l\'entreprise' : 'Etape suivante'}`"
        :icon="step == 3 ? 'save.png' : 'next.png'"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />
    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre
        :titre="isAdd? `NOUVELLE ENTREPRISE`:`MISE A JOUR INFOS ENTREPRISE`"
        height="60px"
        spacing="60"
        size="18px"
      />

      <div class="row">
        <div class="col">
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            class="q-pa-none panel-primary q-pa-none-xs-stepper"
            transition-next="fade"
            transition-prev="fade"
            :vertical="$q.screen.lt.sm"
          >
            <q-step
              :name="1"
              title="Informations"
              icon="las la-portrait"
              :done="step > 1"
            >
              <q-form ref="myForm">
                <stepIdentite v-model="entreprise" />
              </q-form>
            </q-step>
            <q-step
              :name="2"
              title="Adresses & contacts"
              icon="las la-map-marker"
              :done="step > 2"
            >
              <q-form ref="myForm">
                <stepAdresse v-model="entreprise" />
              </q-form>
            </q-step>
            <q-step
              :name="3"
              title="Actionnaires"
              icon="las la-users"
              :done="step > 3"
            >
              <q-form ref="myForm">
                <stepActionnaire v-model="entreprise.actionnaires" />
              </q-form>
            </q-step>

          </q-stepper>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script>

import stepActionnaire from './step_actionnaire.vue'
import stepIdentite from './step_identite.vue'
import stepAdresse from './step_adresse.vue'

export default {
  name: 'nouvelle_entreprise',
  data () {
    return {
      URLS: {},
      user: {},
      loading: false,
      step: 1,

      entreprise: {
        actionnaires: [],
        comptes: []
      },
      isAdd: true
    }
  },
  props: ['paramsEntreprise'],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    if (this.paramsEntreprise) {
      this.isAdd = !this.paramsEntreprise.id
      this.entreprise = { ...this.paramsEntreprise }
      this.$emit('clear', true)
    }
  },
  mounted: function () {
    if (this.user === null) {
      this.$router.push('/')
    }
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  watch: {},
  components: {
    stepIdentite,
    stepActionnaire,
    stepAdresse

  },
  computed: {},
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) {
        // Alt + A
      } else if (e.altKey && e.which === 90) {
        // Alt + Z
      } else if (e.altKey && e.which === 82) {
        // Alt + R
      }
    },
    actualiser () {
      this.$q.loading.show()
      setTimeout(() => {
        this.$q.loading.hide()
      }, 2000)
    },
    checkform (isSucess) {
      if (isSucess) {
        if (this.step === 1) {
          this.step = 2
        } else if (this.step === 2) {
          if (this.entreprise.actionnaires.length > 0) {
            this.step = 3
          } else {
            this.$helper.showMessage('Ajouter les actionnaires de cette entreprise avant de passer à l\'etape suivante')
          }
        } else if (this.step === 3) {
          this.saveForm()
        }
      }
    },
    saveForm () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
        message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer cette entreprise ?' : 'Souhaitez-vous vraiment modifier les infos de cette entreprise ?'}`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          ...this.entreprise
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Entreprise/${this.isAdd ? 'add' : 'update'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$helper.checkResponse(infos.data)

          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')
            this.$emit('onRedirect', {
              tab: '1',
              data: null
            })
            this.viderChamps()
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    saveBrouillon () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `Enregistrement en cours...`,
        message: `Enregistrer ce brouillon ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          data: this.entreprise,
          type: 'ENTREPRISE'
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Brouillon/add`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            if (!this.entreprise.id_brouillon && infos.data.id_brouillon) {
              this.entreprise.id_brouillon = infos.data.id_brouillon
            }
            this.$helper.showMessage(infos.data.message, 1, 'center')
          } else {
            this.$helper.showMessage(infos.data.message, 0, 'center')
          }
        }).catch((e) => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    viderChamps () {
      this.step = 1

      this.entreprise = {
        actionnaires: [],
        comptes: []
      }

      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style></style>
