<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="min-width:400px">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Connexion au système</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              label="Enregistrer"
              icon="las la-cloud-upload-alt"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="$refs.submitBtn.$el.click()"
            />
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
                * Les champs dont les étiquettes finissent avec un astérisque sont obligatoires<br>
                * Rassurez-vous d'avoir completé toutes les informations requises avant d'enregistrer
              </consigne>
            </div>
            <q-form
              @submit="onSubmit"
              ref="myForm"
            >
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** IDENTITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col">
                  <div class="ba overflow-hidden panel-primary">
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >IDENTIFIANTS DE CONNEXION</div>
                    <q-separator />

                    <div class="row q-col-gutter-sm">
                      <div class="col-12">
                        <q-item
                          clickable
                          v-ripple
                        >
                          <q-item-section>
                            <q-item-label>Retirer le droit de connexion au systeme</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon
                              :class="`las la-toggle-${connexion.status=='ACTIF'?'on':'off'}`"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          clickable
                          v-ripple
                        >
                          <q-item-section>
                            <q-item-label>Reinitialiser les identifiants de connexion</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon
                              :class="`las la-key`"
                              size="20px"
                              color="primary"
                            />
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </div>
                      <div class="col-12">
                        <div class="q-pa-md">
                          <!-- <small class="text-bold">Nom *</small> -->
                          <q-input
                            square
                            outlined
                            dense
                            v-model.trim="connexion.username"
                            label="Nom d'utilisateur *"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                          />
                          <!-- <small class="text-bold">Postnom *</small> -->
                          <q-input
                            square
                            outlined
                            dense
                            v-model.trim="connexion.password"
                            label="Mot de passe *"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <q-btn
                v-show="false"
                type="submit"
                ref="submitBtn"
              />
            </q-form>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'ConnexionSysteme',
  data () {
    return {
      URLS: {},
      user: {},
      showDialog: true,
      loading: false,
      connexion: {}
    }
  },
  props: {
    identifiants: {}
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    this.activeEdit = this.editInput

    if (this.$helper.isNotEmpty(this.identifiants)) {
      this.connexion = this.identifiants
    } else {
      this.connexion = {}
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
      let donnees = JSON.stringify({
        ...this.connexion,
        id_agent: this.user.id_agent,
        fonction: this.user.default_fonction
      })

      this.$q.loading.show()
      let url = `${this.URLS.BASE_URL}/Responsable/${this.isAdd ? 'add' : 'update'}/`

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.$q.loading.hide()
        if (infos.data.erreur === false) {
          this.$helper.showMessage(infos.data.message, 1, 'center')

          if (!this.isAdd) {
            this.getElevesSousRespo()
          } else {
            this.$emit('onclose', true)
            this.viderChamps()
          }
          this.$refs.myForm.resetValidation()
        } else {
          this.$helper.showMessage(infos.data.message, 0, 'bottom')
        }
      }).catch((e) => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    },
    viderChamps () {
      this.connexion = {}
      this.$refs.myForm.resetValidation()
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
