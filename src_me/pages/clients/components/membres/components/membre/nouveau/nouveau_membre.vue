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
        v-if="isAdd || !!membre.id_brouillon"
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
        :text="`${step == 4 ? 'Enregistrer le membre' : 'Etape suivante'}`"
        :icon="step == 4 ? 'save.png' : 'next.png'"
        @option-clicked="$refs.myForm.validate().then(checkform)"
      />
    </list-menu-options>

    <div class="ba overflow-hidden">
      <grandTitre
        :titre="isAdd? `NOUVEAU MEMBRE`:`MISE A JOUR INFOS MEMBRE`"
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
                <stepIdentite
                  v-model="membre"
                  :user="user"
                />
              </q-form>
            </q-step>
            <q-step
              :name="2"
              title="Adresses & contacts"
              icon="las la-map-marker"
              :done="step > 2"
            >
              <q-form ref="myForm">
                <stepAdresse
                  v-model="membre"
                  :user="user"
                />
              </q-form>
            </q-step>
            <q-step
              :name="3"
              title="Mandataires"
              icon="las la-users"
              :done="step > 3"
            >
              <q-form ref="myForm">
                <stepMandataire
                  v-model="membre.mandataires"
                  :user="user"
                />
              </q-form>
            </q-step>
            <q-step
              :name="4"
              title="Héritier"
              icon="las la-users"
              :done="step > 4"
            >
              <q-form ref="myForm">
                <stepHeritier
                  v-model="membre.heritiers"
                  :user="user"
                />
              </q-form>
            </q-step>

          </q-stepper>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script>

import stepMandataire from './step_mandataire.vue'
import stepHeritier from './step_heritier.vue'
import stepIdentite from './step_identite.vue'
import stepAdresse from './step_adresse.vue'

export default {
  name: 'nouveau_membre',
  data () {
    return {
      URLS: {},
      user: {},
      loading: false,
      step: 1,

      membre: {
        mandataires: [],
        heritiers: []
      },
      isAdd: true
    }
  },
  props: ['paramsMembre'],
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    if (this.paramsMembre) {
      this.isAdd = !this.paramsMembre.id
      this.membre = { ...this.paramsMembre }
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
    stepMandataire,
    stepHeritier,
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
          this.step = 3
        } else if (this.step === 3) {
          this.step = 4
        } else if (this.step === 4) {
          this.saveForm()
        }
      }
    },
    saveForm () {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: `${this.isAdd ? 'Enregistrement en cours...' : 'Modifications en cours...'}`,
        message: `${this.isAdd ? 'Souhaitez-vous vraiment enregistrer ce membre ?' : 'Souhaitez-vous vraiment modifier les infos de ce membre ?'}`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          ...this.membre
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Membre/${this.isAdd ? 'add' : 'update'}/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
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
          data: this.membre,
          type: 'MEMBRE'
        })

        this.$q.loading.show()

        let url = `${this.URLS.BASE_URL}/Brouillon/add`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$q.loading.hide()

          if (infos.data.erreur === false) {
            if (!this.membre.id_brouillon && infos.data.id_brouillon) {
              this.membre.id_brouillon = infos.data.id_brouillon
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

      this.membre = {
        mandataires: [],
        heritiers: []
      }

      this.$refs.myForm.resetValidation()
    }
  }
}
</script>

<style></style>
