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
      <div
        class="my-scroll"
        style="padding:6px 10px"
      >
        <div class="row no-wrap q-gutter-sm">
          <div class="col-auto">
            <q-avatar
              size="35px"
              color="blue-1"
              text-color="primary"
            >
              <q-icon
                name="las la-filter"
                size="20px"
              />
            </q-avatar>
          </div>
          <div class="col">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              outlined
              dense
              label="Par état"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.status"
              :options="optionsActive"
              :option-value="opt => opt"
              :option-label="opt => `${opt.label}`"
              @input="getDatas()"
            />
          </div>

          <div class="col">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              outlined
              dense
              label="Par agence"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.agence"
              :options="agences"
              :option-value="opt => opt"
              :option-label="opt => `${opt.designation}`"
              @filter="filterAgences"
              @input="getDatas()"
            >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label class="semi-bold">{{scope.opt.designation}}</q-item-label>
                    <q-item-label
                      caption
                      class="text-grey"
                    >
                      CODE : {{scope.opt.code}}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-red">
                    Aucune agence trouvée
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col">
            <q-select
              transition-show="scale"
              transition-hide="scale"
              square
              outlined
              dense
              label="Par type"
              fill-input
              hide-selected
              hide-bottom-space
              use-input
              emit-value
              map-options
              v-model="filterListe.type"
              :options="types"
              :option-value="opt => opt"
              :option-label="opt => `${opt.designation}`"
              @filter="filterFonctions"
              @input="getDatas()"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-red">
                    Aucun type trouvé
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary">
            <q-separator v-if="!!searchOperation" />
            <search-result :search="searchOperation" />
            <q-separator />
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
                    <th class="text-left">TYPE</th>
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
                    <td class="text-left">{{row.type_designation}}</td>
                    <td class="text-left">{{row.username || 'Pas d\'accès'}}</td>
                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->
                    <q-tooltip v-if="row.type_str != 'ADMIN'">
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
                        <template v-if="(row.type_str != 'ADMIN' || user.type_str == 'ADMIN') ">
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
                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="selectedUser=row;showDialogDroits=true"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-user-shield"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Droits d'accès au système</q-item-section>
                          </q-item>
                        </template>

                        <q-item v-if="row.type_str =='ADMIN' || row.type_str=='ADMIN-S'">
                          <q-item-section
                            top
                            avatar
                          >
                            <q-avatar
                              color="red-1"
                              text-color="red"
                              icon="las la-lock"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Compte administrateur</q-item-label>
                          </q-item-section>
                        </q-item>
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
                        v-for="item2 in 9"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="9">
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

    <!-- <definirDroits
      v-if="showDialogDroits"
      :selectedUser="selectedUser"
      @onclose="showDialogDroits=false"
      @onFinish="getDatas()"
    /> -->

  </q-page>
</template>
<script>
import nouvelUtilisateur from './nouvel_utilisateur.vue'
import detailsUtilisateur from './details_utilisateur.vue'
// import definirDroits from './definir_droits.vue'

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
      showDialogDroits: false,
      showDlgDetails: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,

      selectedUser: {},
      defaultValues: {
        filters: {
          status: { value: 'ALL', label: 'Tous les utilisateurs' },
          type: { id: 'ALL', designation: 'Touts les types' },
          agence: { id: 'ALL', designation: 'Toutes les agences', code: 'Tous' },
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0,

      agences: [],
      types: [],

      optionsActive: [
        { value: 'ALL', label: 'Tous les utilisateurs' },
        { value: 'ACTIF', label: 'Uniquement les utilisateurs actifs' },
        { value: 'INACTIF', label: 'Uniquement les utilisateurs inactifs' }
      ]

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
    detailsUtilisateur
    // definirDroits
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

    filterAgences (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Agence/searchAgences`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.agences = infos.data.records
          this.agences.unshift({ ...this.defaultValues.filters.agence })
        })
      }).catch(() => {
        update(() => {
          this.agences = [this.defaultValues.filters.agence]
        })
      })
    },

    filterFonctions (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id
      })

      let url = `${this.URLS.BASE_URL}/Utilisateur/searchTypesAgents`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.types = infos.data.records
          this.types.unshift(this.defaultValues.filters.type)
        })
      }).catch(() => {
        update(() => {
          this.types = [this.defaultValues.filters.type]
        })
      })
    },
    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.status) &&
        this.$helper.isNotEmpty(this.filterListe.agence) &&
        this.$helper.isNotEmpty(this.filterListe.type) &&
        this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_agent: this.user.id,
          id_agence: this.filterListe.agence.id,
          id_type: this.filterListe.type.id,
          status: this.filterListe.status.value,
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
