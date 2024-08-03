<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 350px">
      <q-card-section>
        <div class="row">
          <div class="col">
            <div class="text-h6">
              Réinitialiser mot de passe
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              flat
              color="grey-2"
              text-color="primary"
              icon="close"
              size="sm"
              v-close-popup
              round
              class="bg-blue-1"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-form @submit="setPassword">
        <q-card-section>
          <br>
          <q-input
            square
            outlined
            dense
            v-model.trim="newUser.password"
            label="Mot de passe *"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Champs requis']"
          >
            <template v-slot:append>
              <q-icon
                name="las la-undo-alt"
                @click="generatePassword"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            :loading="loadingSave"
            type="submit"
            color="primary"
            flat
            rounded
            style="width: 150px"
          >
            Enregistrer
            <template v-slot:loading>
              <q-spinner-ios class="on-left" />
              En cours...
            </template>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogAddUtilisateur',
  data () {
    return {
      URLS: {},
      user: {},

      showDialog: true,
      loading: false,

      utilisateur: {
        cooperative: {
          responsable: {}
        }
      },
      inputsDatas: {}

    }
  },
  props: {
    selectedUser: {},
    editInput: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.inputsDatas = this.$datas.inputs.utilisateur

    if (this.selectedUser != null) {
      this.utilisateur = { ...this.selectedUser }
    } else {
      this.utilisateur = {
        cooperative: {
          responsable: {}
        }
      }
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
      /* let donnees = JSON.stringify({
        ...this.utilisateur,
        id_agent: this.user.id,
        fonction: this.user.default_fonction
      })

      this.loading = true
      let url = `${this.URLS.BASE_URL}/Utilisateur/${this.isAdd ? 'add' : 'update'}/`

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false
        this.$helper.checkResponse(infos.data)

        if (infos.data.erreur === false) {
          this.$helper.showMessage(infos.data.message, 1, 'center')

          if (this.isAdd) {
            this.$emit('onclose', true)
          }

          this.$emit('onFinish', true)
          this.$refs.myForm.resetValidation()
        } else {
          this.$helper.showMessage(infos.data.message, 0, 'bottom')
        }
      }).catch((e) => {
        this.loading = false
        this.$helper.showMessage()
      }) */
    },
    viderChamps () {
      this.utilisateur = {
        cooperative: {
          responsable: {}
        }
      }
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
