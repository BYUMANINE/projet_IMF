<template>
  <div>
    <!-- hHh Lpr lff  -->

    <q-layout :view="$q.screen.lt.sm ? 'lHh Lpr lff' : 'lHh Lpr lFf'">
      <q-header class="primary">
        <q-toolbar style="min-height:auto;height:65px">
          <q-btn
            @click="showAndHideDrawer()"
            round
            dense
            icon="menu"
            text-color="white"
            unelevated
            class="q-pa-xs"
            size="md"
          />

          <q-toolbar-title style="line-height:20px">
            <div class="row items-center">
              <div
                class="col-auto"
                v-if="$q.screen.gt.xs"
              >
                <span
                  style="font-size:15px"
                  class="text-bold"
                >{{ user.agence.designation+' - '+user.agence.code }}</span>
                <div>
                  <small>Taux : <strong>{{user.taux}}</strong> | Devise par défaut : <strong>{{user.devise}}</strong> | Journée : <strong>{{user.exercice ? user.exercice.date_jour : 'Non ouverte'}}</strong> | Caisse : <b>{{user.caisse && user.caisse.cdf ? user.caisse.cdf.designation : 'N/A'}}</b></small>
                </div>
              </div>
            </div>
          </q-toolbar-title>

          <div class="row q-col-gutter-md items-center">
            <div
              class="col-auto"
              v-if="$q.screen.gt.xs"
            >
              <q-btn
                dense
                flat
                rounded
                @click="$q.fullscreen.toggle()"
              >
                <q-icon
                  class="text-white"
                  :name="
                    $q.fullscreen.isActive
                      ? 'las la-compress-arrows-alt'
                      : 'las la-expand-arrows-alt'
                  "
                  size="20px"
                />
                <q-tooltip
                  content-class="bg-blue text-white shadow-4"
                  :offset="[10, 10]"
                >
                  Plein ecran
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col-auto">
              <q-btn
                color="white"
                text-color="white"
                :icon="`las la-${isDark ? 'sun' : 'moon'}`"
                round
                flat
                size="12px"
                @click="isDark = !isDark"
                unelevated
              >
                <q-tooltip content-class="bg-blue text-white">
                  Passer en mode {{ isDark ? 'clair' : 'sombre' }}
                </q-tooltip>
              </q-btn>
            </div>

            <!-- ********************************* -->
            <!-- ********************************* -->
            <!-- ****** AGENT CONNEXTE******** -->
            <!-- ********************************* -->
            <!-- ********************************* -->

            <div class="col-auto">
              <q-item>
                <q-item-section avatar>
                  <q-avatar
                    class="bg-white text-blue tex"
                    size="30px"
                  >
                    <span class="
                    text-bold">{{ user ? getFirstLettre(user.nom_complet) : '' }}</span>
                  </q-avatar>
                </q-item-section>
                <q-item-section
                  v-if="$q.screen.gt.xs"
                  class="text-uppercase"
                >{{
                  user ? user.nom_complet : ''
                }}</q-item-section>
                <q-item-section
                  v-if="$q.screen.gt.xs"
                  side
                >
                  <q-btn
                    flat
                    color="white"
                    round
                    size="sm"
                  >
                    <q-icon
                      name="las la-angle-down"
                      size="15px"
                    />
                  </q-btn>
                </q-item-section>
                <q-menu
                  transition-show="scale"
                  transition-hide="scale"
                  style="min-width:220px"
                >
                  <div class="row  q-pa-md">

                    <div
                      v-if="user"
                      class="column items-center"
                    >
                      <q-avatar
                        class="bg-grey-3 text-white"
                        size="72px"
                      >
                        <q-img
                          src="statics/images/icone/avatar.png"
                          spinner-color="white"
                          spinner-size="20px"
                          contain
                          style="height: 100%; max-width: 100%"
                        />

                      </q-avatar>

                      <div class="q-mt-md ellipsis text-uppercase text-bold">{{user ? user.nom_complet : ''}}</div>
                      <!-- <span class="q-py-sm">{{user.type.designation}}</span> -->
                      <q-btn
                        label="Deconnexion"
                        raised
                        unelevated
                        size="sm"
                        v-close-popup
                        text-color="white"
                        class="color-gradient"
                        @click="deconnexion()"
                      />
                    </div>
                  </div>
                </q-menu>
              </q-item>
            </div>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        :mini="miniState"
        :width="220"
        :breakpoint="500"
        show-if-above
        content-class="drawer-primary relative-position"
        content-style="background-image:url('statics/images/bg/8.png');background-size:cover;"
      >
        <q-scroll-area class="fit relative-position">
          <q-list>
            <div>
              <div
                style="height:64px"
                class="text-center"
              >
                <q-img
                  v-if="!miniState || $q.screen.lt.sm"
                  src="statics/images/logo/logo.png"
                  spinner-color="white"
                  style="height: 53px; max-width: 200px;margin-top:6px"
                  contain
                />
                <q-img
                  v-else
                  src="statics/images/logo/logo_min.png"
                  spinner-color="white"
                  style="height: 45px; width: 45px"
                  contain
                  class="q-mt-xs"
                />
              </div>
              <q-separator />
            </div>
            <!-- <div style="margin-top:65px"></div> -->
            <template v-for="(row,index) in optionsMenus">
              <q-item
                v-if="!row.subOptions"
                :key="index"
                clickable
                v-ripple
                :to="row.route"
              >
                <mytooltip
                  v-if="miniState"
                  :style_class="`${row.icon3} text-grey-5`"
                  :titre="row.label"
                />
                <q-item-section avatar>
                  <q-img
                    :src="`statics/images/icone/${row.icon2}`"
                    spinner-color="white"
                    spinner-size="15px"
                    style="height: 25px; width: 25px"
                  />
                </q-item-section>
                <q-item-section>
                  {{row.label}}
                </q-item-section>
              </q-item>
              <q-expansion-item
                v-else
                :key="index"
              >
                <template v-slot:header>
                  <mytooltip
                    v-if="miniState"
                    style_class="las la-sticky-note text-grey-5"
                    :titre="row.label"
                  />
                  <q-item-section avatar>
                    <q-icon :name="`img:statics/images/icone/${row.icon2}`" />
                  </q-item-section>
                  <q-item-section>
                    {{row.label}}
                  </q-item-section>
                </template>

                <div class="q-pl-sm">
                  <q-separator />
                  <q-item
                    v-for="(row2,index2) in row.subOptions"
                    :key="index2"
                    clickable
                    v-ripple
                    :to="row2.route"
                  >
                    <q-item-section avatar>
                      <q-icon :name="row2.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{row2.label}}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </div>
              </q-expansion-item>
            </template>
          </q-list>
        </q-scroll-area>

        <div
          @click="showDialogMenu = !showDialogMenu"
          class="text-center gt-sm btn-menu"
        >
          <q-icon
            name="img:statics/images/icone/circle_menu.png"
            size="35px"
          />
        </div>
      </q-drawer>

      <q-dialog
        v-model="showDialogMenu"
        position="bottom"
        content-class="my-dialog-menu"
      >
        <q-card class="my-menu-card">
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <div>
                <div class="q-py-sm">
                  <small class="text-bold">Récement ouverts</small>
                </div>
                <q-item
                  v-for="(row,index) in recementOuverts"
                  :key="index"
                  dense
                  clickable
                  v-ripple
                  @click="$router.push(row.route).catch(e=>{})"
                >
                  <q-item-section avatar>
                    <q-avatar
                      color="primary"
                      text-color="white"
                      size="22px"
                    >
                      <span class="text-bold">{{index+1}}</span>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{row.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mt-md">
                <div class="q-py-sm">
                  <small class="text-bold">Raccourcis</small>
                </div>

                <q-item
                  v-for="(row,index) in optionsImportantes"
                  :key="index+'sug'"
                  dense
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-avatar
                      rounded
                      color="blue-1"
                      text-color="white"
                      :icon="`img:statics/images/icone/${row.icon}`"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{row.label}}</q-item-label>
                  </q-item-section>
                </q-item>

              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md col-lg col-xl">
              <div class="q-py-sm">
                <small class="text-bold">Menus</small>
              </div>
              <div class="row q-col-gutter-sm">
                <div
                  class="col-4"
                  v-for="(row,index) in optionsMenus"
                  :key="index"
                  style="height:100px"
                >
                  <q-item
                    clickable
                    v-ripple
                    style="height:100%"
                    :class="`bg-${row.color} q-pa-sm text-center text-white`"
                    @click="row.subOptions ? null : $router.push(row.route).catch(e=>{})"
                  >
                    <q-item-section class="text-center">
                      <div class="row">
                        <div class="col-12">
                          <q-icon
                            :name="`img:statics/images/icone/${row.icon}`"
                            size="40px"
                          />
                        </div>
                        <div class="col-12 q-mt-sm">
                          <small>{{row.label}}</small>
                        </div>
                      </div>
                    </q-item-section>
                    <q-menu
                      v-if="$helper.isNotEmpty(row.subOptions)"
                      touch-position
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >
                        <q-item
                          v-for="(row2,index2) in row.subOptions"
                          :key="index2"
                          clickable
                          v-ripple
                          v-close-popup
                          :to="row2.route"
                        >
                          <q-item-section avatar>
                            <q-icon
                              :class="row2.icon"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>{{row2.label}}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-page-container class="relative-position">
        <router-view
          :class="$q.screen.gt.xs ? 'q-px-md q-pb-md' : 'q-pb-md'"
          :style="$q.screen.lt.sm ? 'padding:0 7px 0 7px' : ''"
        />
      </q-page-container>

      <q-page-scroller
        position="bottom-right"
        :scroll-offset="95"
        :offset="[18, 18]"
      >
        <q-btn
          round
          size="sm"
          icon="las la-arrow-up"
          color="blue-1"
          text-color="blue"
          re="btnScrollUp"
        />
      </q-page-scroller>
    </q-layout>
  </div>
</template>

<script>
import mytooltip from '../components/tooltip_drawer.vue'
import { QSpinnerFacebook } from 'quasar'
import datasMenu from './datas_menu'

export default {
  name: 'CoopecLayout',
  data () {
    return {
      user: {},
      URL: {},
      drawer: false,
      miniState: false,
      isDark: false,
      selectedAnnee: null,

      showDialogMenu: false,

      recementOuverts: [],
      optionsImportantes: [
        { label: 'Liste des clients', icon: 'eleves.png' },
        { label: 'Liste des groupes', icon: 'eleves.png' },
        { label: 'Gestion caisse', icon: 'caisse.png' },
        { label: 'Parametres', icon: 'setting.png' }
      ],
      optionsMenus: []
    }
  },
  beforeMount () {
    this.$helper.isDark()
    this.isDark = this.$q.dark.isActive

    this.getDrawerState()

    this.isLoggedIn()

    this.$q.loading.setDefaults({
      message: "<strong>En cours d'exécution...</strong> <br/> Veuillez patienter s'il vous plaît",
      spinner: QSpinnerFacebook,
      spinnerSize: 60
    })
  },
  mounted () { },
  destroyed () { },
  watch: {
    $route (to, from) {
      this.isLoggedIn(to)
    },
    isDark (newValue, oldValue) {
      this.$q.dark.set(newValue)
      localStorage.setItem(this.$helper.PREF_THEME, newValue ? 'Dark' : 'White')
    },
    miniState (newValue, oldValue) {
      localStorage.setItem('stateDrawer000x000002', newValue ? 'OUI' : 'NON')
    }
  },
  components: {
    mytooltip
  },
  computed: {},
  methods: {
    getFirstLettre (mot) {
      return mot !== undefined ? mot.toUpperCase().substring(0, 1) : ''
    },
    saveCurrentRouteToStack (route) {
      let routes = this.getSavedRoutes()

      if (route && route.name && route.name !== 'home') {
        const index = routes.findIndex(e => e.route === route.path)
        if (index > -1) {
          routes.splice(index, 1)
        }

        if (routes.length > 4) {
          routes = routes.slice(0, 4)
        }

        routes.unshift({ label: route.name, route: route.path })

        this.recementOuverts = routes
        localStorage.setItem('000xxx0eeeeaaaxxii934', JSON.stringify(routes))
      } else {
        this.recementOuverts = routes
      }
    },
    getSavedRoutes () {
      const routes = localStorage.getItem('000xxx0eeeeaaaxxii934') || null
      if (this.$helper.isNotEmpty(routes)) {
        return JSON.parse(routes)
      }

      return []
    },
    showAndHideDrawer () {
      if (this.$q.screen.lt.sm) {
        this.drawer = !this.drawer
      } else {
        this.miniState = !this.miniState
      }
    },
    getDrawerState () {
      let s = localStorage.getItem('stateDrawer000x000002') || null
      this.miniState = s && s === 'OUI'
    },
    isLoggedIn (to = null) {
      this.user = this.$helper.getConnectedUser()
      if (this.user === null) {
        this.$router.push('/')
      } else {
        this.optionsMenus = datasMenu(this.user)
        this.saveCurrentRouteToStack(to)
      }
    },
    deconnexion () {
      this.$q
        .dialog({
          dark: this.$q.dark.isActive,
          title: 'En cours de déconnexion...',
          message: 'Souhaitez-vous vous déconnecter ?',
          cancel: true,
          ok: 'Oui',
          cancelText: 'Annuler',
          persistent: true
        })
        .onOk(() => {
          this.$helper.deconnexion()
          this.$router.push('/')
        })
    }
  }
}
</script>

<style >
.my-dialog-menu .q-dialog__inner--bottom {
  display: flex;
  justify-content: left;
  padding: 0;
}

.my-menu-card {
  min-width: 50%;
  height: 78vh;
  border-radius: 0;
  border-top-right-radius: 10px;
  /* background: transparent; */
  position: relative;
  border-radius: 0 !important;
  border-top-right-radius: 10px !important;
}

.btn-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  background: linear-gradient(to bottom, transparent, rgba(33, 150, 243, 0.6));
}

/* .my-menu-card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: url("../statics/images/bg/6.jpg");
  filter: blur(20px);
} */
</style>
