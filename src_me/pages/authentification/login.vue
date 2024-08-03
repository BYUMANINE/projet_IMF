<template>
  <q-page>
    <div
      style="width:100%;height:100vh"
      class="bg-primary relative-position"
    >
      <div class="barreHaut"></div>
      <div class=" barreBas">
        <div class="contText text-center text-white">
          <small>
            Powered by GAREC
          </small>
        </div>
      </div>

      <div
        class=" contLogin  q-pa-lg panel-primary"
        :style="$q.screen.lt.sm?'right: 10px;left:10px':'width:450px;left: calc(50% - 210px);'"
      >
        <div class="text-h6 text-center text-bold text-primary q-mb-lg q-ml-md relative-position">

          <q-img
            src="statics/images/logo/logo_min.png"
            spinner-color="white"
            style=" max-width: 200px;height:50px;"
            contain
          />
          <div>
            <strong style="font-weight:900">BANCO-<span class="text-pink">MANAGEMENT</span></strong>
          </div>
          <div
            style="width:10%;margin:10px auto 10px auto;height:8px;border-radius:20px"
            class="bg-primary"
          ></div>
          <div style="font-size:17px"> Connexion</div>
        </div>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-card-section>
            <q-input
              rounded
              standout
              outlined
              dense
              v-model="data.username"
              label="Nom d'utilisateur"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ce champs est obligatoire']"
              class="mrg "
              style="font-size:15px"
            />
            <q-input
              :type="!viewPassword?'password':'text'"
              rounded
              standout
              outlined
              dense
              v-model="data.password"
              label="Mot de passe"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Ce champs est obligatoire']"
              class="mrg"
              style="font-size:15px"
            >
              <template v-slot:append>
                <q-btn
                  color="white"
                  text-color="primary"
                  :icon="!viewPassword?'las la-eye':'las la-eye-slash'"
                  size="sm"
                  flat
                  round
                  @click="viewPassword=!viewPassword"
                />
              </template>
            </q-input>
            <q-checkbox
              right-label
              v-model="data.souvenir"
              label="Me souvenir"
            />
            <div class="q-mt-md">
              <q-btn
                color="primary"
                style="width: 100%;height:40px"
                type="submit"
                outline
                rounded
                unelevated
              >
                connexion
              </q-btn>
            </div>
          </q-card-section>

        </q-form>
      </div>
    </div>

    <q-dialog
      v-model="loading"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <q-spinner-ios
            size="30px"
            class="on-left"
            color="primary"
          />
          <span class="q-mt-sm text-primary">Vérification...</span>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>

export default {
  name: 'pageLogin',
  data () {
    return {
      URLS: {},
      loading: false,
      data: {
        username: '',
        password: '',
        souvenir: true
      },
      viewPassword: false

    }
  },
  beforeMount () {
    this.$helper.isDark()
    this.getParametre()
  },
  mounted: function () { },
  watch: {

  },
  computed: {

  },
  methods: {

    getParametre () {
      this.URLS = this.$helper.urls()
      let user = this.$helper.getConnectedUser()

      if (user !== null) {
        this.showUserInterface(user)
      } else {
        let s = this.$helper.getSouvenir()
        if (this.$helper.isNotEmpty(s)) {
          this.data.username = s.username
          this.data.souvenir = true
        } else {
          this.data.username = null
          this.data.souvenir = false
        }
      }
    },
    onSubmit () {
      let donnees = JSON.stringify(this.data)

      this.loading = true
      let url = `${this.URLS.BASE_URL}/Auth/checkLogin/`

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false

        if (infos.data.erreur === false) {
          // On enregistre l'utilisateur connecté dans les prefrences en local
          localStorage.setItem(this.$helper.PREF_USER, JSON.stringify(infos.data.user))
          // On enregistre les parametres
          localStorage.setItem(this.$helper.PREF_PARAMS, JSON.stringify(infos.data.params))

          // On enregistre les droits utilisateur
          // localStorage.setItem(this.$helper.PREF_DROITS, JSON.stringify(infos.data.droits))

          localStorage.setItem(this.$helper.PREF_SOUVENIR,
            this.data.souvenir
              ? JSON.stringify({ username: infos.data.user.username })
              : null)

          this.showUserInterface(infos.data.user)
        } else {
          this.$helper.showMessage(infos.data.message)
        }
      }).catch((e) => {
        this.loading = false
        this.$helper.showMessage()
      })
    },
    showUserInterface (user) {
      // let route = localStorage.getItem(this.$helper.PREF_LAST_ROUTE)
      let route = null

      if (route === '/') {
        route = null
      }

      this.$router.push(route || '/home')
    }
  }
}
</script>

<style>
.barreHaut {
  width: 100%;
  height: 100vh;
  background-color: #0d6db5;
  /* background-image: url("../../../statics/images/bg/8.jpg"); */
  background: url("../../statics/images/bg/9.png");
  /* background-repeat: no-repeat; */
  background-size: cover;
  filter: blur(8px);
  position: relative;
}

.barreHaut::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 255, 0.3);
}

.barreBas {
  width: 100%;
}

.contLogin {
  height: 450px;
  position: absolute;
  top: 13vh;
  border-radius: 30px;
  box-shadow: 0 0 10px 0 rgba(100, 100, 100, 0.5);
}

.contText {
  width: 100%;
  text-align: center;
  /* margin: 0 auto; */
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  font-weight: bold;
}

@media (max-width: 599px) {
}

@media (max-width: 1023px) {
}
</style>
