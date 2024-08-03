<template>
  <q-page style="min-height:0">

    <list-menu-options>

      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="searchOperation=null;getDatas()"
      />
      <menu-option
        text="Recherche"
        icon="search.png"
        @option-clicked="showDialogSearch=true"
      />
      <menu-option
        text="Nouvel utilisateur"
        icon="add.png"
        @option-clicked="selectedUser=null;isAdd=true;showDialogNewUser=true;"
      />
      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />
    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">
      <grandTitre
        :titre="`LISTE DES UTILISATEURS`"
        height="35px"
        spacing="35"
        size="15px"
      >
        <q-badge
          color="primary"
          text-color="white"
          class="text-bold"
          :label="nombre"
        />
      </grandTitre>

      <div class="row">
        <div class="col">
          <div class="panel-primary">
            <search-result :search="searchOperation" />
            <div class="panel-primary overflow-auto">
              <table class="table head-bold hover table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style="width:40px">ETAT</th>
                    <th style="width:40px">PHOTO</th>
                    <th
                      style="width:20%"
                      class="text-left"
                    >NOM COMPLET</th>
                    <th>SEXE</th>
                    <th class="text-left">ETAT CIVIL</th>
                    <th>TELEPHONE</th>
                    <th class="text-left">NOM D'UTILISATEUR</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                    @dblclick="showDetailsUtilisateur(row)"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center">
                      <q-icon
                        :class="row.status==='INACTIF' ? 'las la-exclamation-circle text-red':'las la-check text-blue'"
                        size="18px"
                      />
                    </td>
                    <td class="text-center">
                      <div
                        class="color-gradient text-center"
                        style="padding:3px; width:31px;margin:auto"
                      >
                        <q-img
                          :src="!!row.photo ?  `${URLS.IMG_AGENT}/${row.photo}` :'statics/images/icone/avatar.png'"
                          spinner-color="blue"
                          spinner-size="15px"
                          class="panel-primary"
                          style="height: 25px; width: 25px;"
                        />
                      </div>
                      <q-tooltip
                        v-if="!!row.photo"
                        transition-show="scale"
                        transition-hide="scale"
                        anchor="center right"
                        self="center middle"
                        content-class="panel-primary shadow-3 q-pa-none"
                      >
                        <div
                          class="color-gradient text-center"
                          style="padding:3px; width:250px"
                        >
                          <q-img
                            :src="!!row.photo ?  `${URLS.IMG_AGENT}/${row.photo}` :'statics/images/icone/avatar.png'"
                            spinner-color="blue"
                            spinner-size="20px"
                            class="panel-primary"
                            style="height: 243px; width: 243px;"
                          />
                        </div>
                      </q-tooltip>
                    </td>
                    <td class="text-left text-bold">{{row.nom_complet}}</td>
                    <td class="text-center">{{row.sexe}}</td>
                    <td class="text-left">{{row.etat_civil || 'Non définie'}}</td>
                    <td class="text-center">{{row.phone || 'Non défini'}}</td>
                    <td class="text-left">{{row.username || 'Pas d\'accès'}}</td>
                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->
                    <q-tooltip>
                      Clic droit pour plus d'options
                    </q-tooltip>

                    <q-menu
                      touch-position
                      context-menu
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="showDetailsUtilisateur(row)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher détails</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedUser = row;showDialogAffectation = true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-exchange-alt"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Affectation agences</q-item-section>
                        </q-item>
                        <template>
                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="selectedUser=row;isAdd=false;showDialogNewUser=true"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-pen"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Mise à jour</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="supprimer(row)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-trash-alt"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Supprimer</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            @click="enableOrDisable(row)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                :class="`las la-toggle-${row.status=='ACTIF'?'on':'off'}`"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>{{row.status=='ACTIF'?'Désactiver cet utilisateur ?':'Activer cet utilisateur ?'}}</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="resendCredentials(row)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-key"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Initialiser le mot de passe de cet utilisateur</q-item-section>
                          </q-item>

                        </template>

                      </q-list>
                    </q-menu>
                  </tr>

                  <template v-if="loading && data.length===0">
                    <tr
                      v-for="item in 6"
                      :key="item"
                      class="panel-primary"
                    >
                      <td
                        v-for="item2 in 8"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="8">
                        <nondata
                          v-if="!loading"
                          title="Aucun utilisateur enregistré"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>

                </tbody>
              </table>
            </div>
            <linearLoading :loading="loading && data && data.length >= 5" />
            <q-separator />
            <myPagination
              v-model="filterListe.peer_page"
              idPagination="paginationutilisateur"
              @onPaginate="getDatas()"
            />
          </div>
        </div>
      </div>
    </div>

    <search
      v-model="showDialogSearch"
      :search="searchOperation"
      :filters="[
        {value:'agent.nom_complet|%%',label:'Par nom complet'},
        {value:'agent.sexe|%%',label:'Par sexe'},
        {value:'agent.adresse|%%',label:'Par adresse'},
        {value:'agent.username|%%',label:'Par nom d\'utilisateur'},
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouvelUtilisateur
      v-model="showDialogNewUser"
      :selectedUser="selectedUser"
      :isAdd="isAdd"
      @onFinish="getDatas()"
    />

    <detailsUtilisateur
      v-model="showDlgDetails"
      :selectedUser="selectedUser"
      :user="user"
      :URLS="URLS"
    />

    <affectationAgence
      v-model="showDialogAffectation"
      :selectedUser="selectedUser"
    />

  </q-page>
</template>
<script>
import nouvelUtilisateur from './nouvel_utilisateur.vue'
import detailsUtilisateur from './details_utilisateur.vue'
import affectationAgence from './affectation_agence.vue'

export default {
  name: 'liste_utilisateur',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showDialogNewUser: false,
      showDlgDetails: false,
      showDialogAffectation: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedUser: {},
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0

    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.filterListe = { ...this.defaultValues.filters }
  },
  mounted: function () {
    document.addEventListener('keydown', this.initialiseShortcut, false)

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.getDatas()
    }
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  filters: {},
  watch: {},
  components: {
    nouvelUtilisateur,
    detailsUtilisateur,
    affectationAgence
  },
  computed: {

  },
  methods: {
    initialiseShortcut (e) {
      if (e.altKey && e.which === 65) { // Alt+A
      } else if (e.altKey && e.which === 82) { // Alt + R
        this.getDatas()
      } else if (e.ctrlKey && e.shiftKey && e.which === 70) { // Ctrl + Shift + F
        this.showDialogSearch = true
      }
    },

    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Utilisateur/getAllUtilisateurs`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.$helper.checkResponse(infos.data)
          this.loading = false

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationutilisateur')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationutilisateur a').forEach(el => {
                el.onclick = e => {
                  e.preventDefault()
                  this.getDatas(e.target.href)
                }
              })
            }
          } else {
            this.nombre = 0
            this.data = []
          }
        }).catch((e) => {
          this.loading = false
          let el = document.querySelector('.paginationutilisateur')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
      }
    },

    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment supprimer cet utilisateur ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          ...row,
          id_agent: this.user.id
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Utilisateur/delete/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              this.data.splice(this.data.indexOf(row), 1)
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
          .catch(e => {
            this.$q.loading.hide()
            this.$helper.showMessage()
          })
      })
    },
    enableOrDisable (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'En cours d\'exécution...',
        message: `Souhaitez-vous ${row.status === 'ACTIF' ? 'désactiver' : 'activer'} cet utilisateur ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      })
        .onOk(() => {
          let data = {
            ...row,
            id_agent: this.user.id
          }
          let donnees = JSON.stringify(data)

          this.$q.loading.show()
          let url = `${this.URLS.BASE_URL}/Utilisateur/enableOrDisable/`

          this.$axios.post(url, this.$helper.objectToform({ data: donnees })).then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              // this.data.splice(this.data.indexOf(row), 1)
              row.status = row.status === 'ACTIF' ? 'INACTIF' : 'ACTIF'
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
            .catch(e => {
              this.$q.loading.hide()
              this.$helper.showMessage()
            })
        })
    },
    resendCredentials (row) {
      let newPassword = this.$helper.autoGenerateCleComplexe(10)

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'En cours d\'exécution...',
        message: `Souhaitez-vous initialiser le mot de passe de ${row.nom_complet} ?<div class="q-my-md q-pa-sm bg-blue-1 text-primary"> Nouveau mot de passe : <b>${newPassword}</b> </div> Un email contenant ce nouveau mot de passe sera envoyé à ${row.nom_complet} à l'adresse ${row.email}. <b>Continuer ?</b>`,
        cancel: 'Non',
        ok: 'Oui',
        html: true,
        persistent: true
      }).onOk(() => {
        row.password = newPassword

        let data = {
          ...row,
          id_agent: this.user.id
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Utilisateur/resetCredentials/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees })).then(infos => {
          this.$q.loading.hide()
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1)
            this.getDatas()
          } else {
            this.$helper.showMessage(infos.data.message)
          }
        }).catch(e => {
          this.$q.loading.hide()
          this.$helper.showMessage()
        })
      })
    },
    showDetailsUtilisateur (row) {
      this.selectedUser = { ...row }
      this.showDlgDetails = true
    }

  }

}
</script>
<style lang="stylus"></style>
