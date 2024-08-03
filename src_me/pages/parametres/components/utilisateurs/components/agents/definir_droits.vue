<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 650px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Droits d'accès au système</div>
          </div>

          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              label="Enregistrer"
              icon="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="onSubmit()"
            />
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="close"
              round
              size="sm"
              v-close-popup
              unelevated
              @click="$emit('onclose',true)"
            />
          </div>
        </div>
        <linearLoading :loading="loading" />
        <q-separator />

        <div
          class="row  q-px-md q-py-sm scroll "
          style="max-height:75vh"
        >
          <div class="col">
            <div class="q-mb-sm">
              <consigne title="Remarques">
                * N'oublier pas d'enregistrer les modification apportées<br>
                * Toutes les modifications faites seront appliquées à la prochaine reconnexion de l'utilisateur conserné
              </consigne>
            </div>
            <itemDroitsAcces
              :selectedUtilisateur="utilisateur"
              @onChange="e=>droits=e"
            />
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import itemDroitsAcces from '../../parametres/components/droits_acces/item_droits_acces.vue'

export default {
  name: 'dialogDroitstilisateur',
  data () {
    return {
      URLS: {},
      user: {},

      showDialog: true,
      loading: false,

      droits: null,
      utilisateur: {}

    }
  },
  props: {
    selectedUtilisateur: {}
  },
  components: {
    itemDroitsAcces
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    if (this.selectedUtilisateur != null) {
      this.utilisateur = { ...this.selectedUtilisateur }
    } else {
      this.utilisateur = null
    }
  },
  mounted: function () {
    if (this.user === null) {
      this.$emit('onclose', true)
    }
  },
  destroyed: function () {
  },
  watch: {

  },
  computed: {

  },
  methods: {
    onSubmit () {
      if (this.droits != null) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Enregistrer les modifications apportées`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            droits: this.droits,
            id_utilisateur: this.utilisateur.id,
            id_agent: this.user.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Utilisateur/updateDroits`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false

            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')
              this.droits = null
              this.$emit('onFinish', true)
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'bottom')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.fixed-head .head-1 th
  position sticky
  top 0
  z-index 1000
  background-color white
</style>
