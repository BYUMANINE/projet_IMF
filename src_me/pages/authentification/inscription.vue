<template>
  <q-page>
    <div
      class="row gutter_sm"
      style="height:100vh !important;overflow:hidden"
    >
      <div
        class="gt-xs col"
        style="background-image:url('statics/images/autres/ss.jpg');height:100vh;position:relative"
      >
        <div style="position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,.7)">
          <q-carousel
            v-model="slide"
            animated
            navigation-icon="radio_button_unchecked"
            navigation
            padding
            infinite
            autoplay
            height="300px"
            class="text-white"
            style="background-color:transparent;margin-top:20vh"
          >
            <q-carousel-slide
              name="1"
              class="column no-wrap flex-center"
            >
              <q-avatar
                color="white"
                text-color="pink"
                size="100px"
                icon="icon-handbag"
              />

              <div class="q-mt-md text-center">
                Effectuer vos achats et paiements le plus rapidement possible<br>
                et en toute securité
              </div>
            </q-carousel-slide>
            <q-carousel-slide
              name="2"
              class="column no-wrap flex-center"
            >
              <q-avatar
                color="white"
                text-color="pink"
                size="100px"
                icon="icon-present"
              />
              <div class="q-mt-md text-center">
                Récevez des reductions sur vos achats
              </div>
            </q-carousel-slide>
            <q-carousel-slide
              name="3"
              class="column no-wrap flex-center"
            >
              <q-avatar
                color="white"
                text-color="pink"
                size="100px"
                icon="icon-basket-loaded"
              />
              <div class="q-mt-md text-center">
                Beneficier d'une meilleure experience utilisateur
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 q-pt-sm">
        <div
          class="cont_login scroll q-pb-xl"
          style="max-height:100vh"
        >
          <div class="row q-mb-md justify-center">
            <div class="col-6 text-center q-py-md">
              <q-img
                src="statics/images/icone/logo.png"
                spinner-color="blue"
                spinner-size="12px"
                style="height: 40px; width: 40px"
              />
              <div class="q-mb-sm q-mt-md">
                <strong>WENAMIE</strong>
              </div>
              <q-separator color="pink" />
              <div class="q-mt-sm">
                <span> Inscription</span>
              </div>
            </div>
          </div>

          <q-form @submit="onSubmit">
            <q-card-section>
              <q-input
                dense
                square
                filled
                v-model="dataInscription.USERNAME"
                label="Adresse email"
                lazy-rules
                :rules="[ val => val && val.length > 0 && this.$helper.isMail(val) || 'email non valide']"
                class="mrg"
                style="font-size:15px"
                color="pink"
              />
              <q-input
                type="password"
                dense
                square
                filled
                v-model="dataInscription.PASSWORD"
                label="Mot de passe"
                lazy-rules
                :rules="[ val => val && val.length > 7  || 'Minimun 8 caracteres']"
                class="mrg"
                style="font-size:15px"
                color="pink"
              />
              <q-input
                type="password"
                dense
                square
                filled
                v-model="dataInscription.RETAPE_PASSWORD"
                label="Retaper le mot de passe"
                lazy-rules
                :rules="[val=> this.dataInscription.PASSWORD === val   || 'Mot de passe non identiques']"
                class="mrg"
                style="font-size:15px"
                color="pink"
              />
              <q-input
                dense
                square
                filled
                v-model="dataInscription.NOM_COMPLET"
                label="Nom complet"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Ce champs est obligatoire']"
                class="mrg"
                style="font-size:15px"
                color="pink"
              />
              <q-input
                dense
                square
                filled
                v-model="dataInscription.ADRESSE"
                label="Adresse (Pays-Province-ville)"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Ce champs est obligatoire']"
                class="mrg"
                style="font-size:15px"
                color="pink"
              />

              <q-input
                dense
                square
                filled
                v-model="dataInscription.TELEPHONE"
                placeholder="Téléphone"
                lazy-rules
                :rules="[ val => val && val.length > 11   || 'téléphone non valide (Ex.:994061228)']"
                class="mrg"
                style="font-size:15px"
                color="pink"
                mask="## ## ## ####"
              >

                <template v-slot:prepend>
                  <strong
                    class=" text-black "
                    style="font-size:15px"
                  >
                    +243
                  </strong>
                </template>

              </q-input>

            </q-card-section>
            <q-card-section style="padding-top:0">
              <q-btn
                :loading="loadingInscription"
                color="primary"
                style="width: 180px;border-radius:0;width:100%;height:50px"
                type="submit"
                unelevated
                class="bg_gradient"
              >
                Inscrire
                <template v-slot:loading>
                  <q-spinner-facebook class="on-left" />
                  En cours...
                </template>
              </q-btn>
            </q-card-section>

            <q-card-section>
              <q-separator color="pink" />
              <div class="text-center q-pl-sm q-mt-md q-mb-xl">
                Vous avez déjà un compte ? <br>
                <q-btn
                  flat
                  rounded
                  color="white"
                  text-color="pink"
                  @click="$router.push('login')"
                  label="Connectez-vous"
                  style="font-size:12px"
                />
              </div>
            </q-card-section>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'pageInscription',
  data () {
    return {
      URLS: {},
      user: {},

      loadingInscription: false,
      dataInscription: {
        USERNAME: '',
        PASSWORD: '',
        RETAPE_PASSWORD: '',
        NOM_COMPLET: '',
        ADRESSE: '',
        TELEPHONE: ''
      },
      slide: '1'
    }
  },
  components: {
  },
  mounted: function () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.isLoggedIn()
  },
  watch: {},
  computed: {},
  methods: {
    isLoggedIn () {
      // if (result) {
      if (this.user) {
        if (this.user.ID_UTILISATEUR) {
          this.$router.push('/')
        }
      }
    },
    onSubmit () {
      this.loadingInscription = true

      let url = `${this.URLS.DOMAINE}/Utilisateur/inscription`
      var donnees = JSON.stringify(this.dataInscription)

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loadingInscription = false
        // console.log(infos.data)
        if (infos.data.erreur === false) {
          // this.$router.push({ name: 'confirmation', params: { user: infos.data.user } })
          //  this.$router.push('/')

          // console.log(infos.data)

          let user = infos.data.user
          user.PASSWORD = '**********'
          user.SOUVENIR = true
          localStorage.setItem('dataLoginUser', JSON.stringify(user))
          // console.log(this.user)
          this.$router.push('/')
        } else {
          this.$helper.showMessage(infos.data.message)
        }
      }).catch((er) => {
        this.loadingInscription = false
        this.$helper.showMessage()
      })
    }
  }
}
</script>

<style>
.bg_gradient {
  background: linear-gradient(120deg, #e91e63, #d31b70) !important;
  background: -webkit-linear-gradient(120deg, #e91e63, #d31b70) !important;
}

@media (max-width: 599px) {
  /* .cont_login {
    box-shadow: 0 0 2px 1px silver;
  } */
}
</style>
