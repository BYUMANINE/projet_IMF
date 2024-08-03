<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">
      <menu-option
        text="Actualiser"
        icon="refresh.png"
        @option-clicked="getParametres()"
      />
      <menu-option
        :text="modeEdit?'Quitter l\'edition':'Editer les paramètres'"
        :icon="modeEdit?'clear.png':'edit.png'"
        @option-clicked="modeEdit=!modeEdit; updateConnexion = false; $refs.myForm.resetValidation()"
      />
      <menu-option
        :disable="!modeEdit"
        text="Mettre à jour"
        icon="save.png"
        @option-clicked="$refs.myForm.validate().then(onSubmit)"
      />

    </list-menu-options>
    <div class="ba overflow-hidden panel-primary">
      <!-- <grandTitre
        :titre="`MON COMPTE`"
        height="60px"
        spacing="60"
        size="18px"
      /> -->
      <div>
        <linearLoading :loading="loading" />
        <q-form
          ref="myForm"
          class="q-pa-md"
        >
          <div
            class="q-mb-sm"
            v-if="modeEdit"
          >
            <consigne title="Remarques">
              * Les champs dont les étiquettes finissent avec un astérisque en rouge sont obligatoires<br>
              * Rassurez-vous d'avoir completé toutes les informations requises avant d'enregistrer
            </consigne>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <q-card
                flat
                class="panel-primary"
                bordered
              >
                <q-card-section>
                  <strong>Institution</strong>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pa-none">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <input
                        :disable="loading"
                        type="file"
                        ref="inputFileSelect"
                        style="display:none"
                        @change="onInputLogoChange"
                        accept="image/x-png, image/jpg, image/jpeg"
                      >
                      <q-item :disable="!modeEdit">
                        <q-item-section avatar>
                          <div
                            class="color-gradient text-center"
                            style="padding:3px; width:41px;margin:auto"
                          >
                            <q-img
                              :src="!!parametre.new_logo ? parametre.new_logo : (!!parametre.logo ?  `${URLS.IMG_LOGO}/${parametre.logo}` :'statics/images/logo/logo_min.png')"
                              spinner-color="blue"
                              spinner-size="15px"
                              class="panel-primary"
                              style="height: 35px; width: 35px;"
                            />
                          </div>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            class="text-bold"
                            style="font-size:12px"
                          >Changer le logo</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            :disable="loading"
                            color="blue-1"
                            text-color="primary"
                            :icon="parametre.new_logo ? 'close' :'las la-paperclip'"
                            round
                            size="sm"
                            unelevated
                            @click="parametre.new_logo ? parametre.new_logo  = null : $refs.inputFileSelect.click()"
                          />
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </div>
                    <div class="col-12">
                      <div class="q-px-md q-mb-md">
                        <input-label :required="modeEdit">Appellation de l'institution</input-label>
                        <q-input
                          :readonly="!modeEdit"
                          square
                          outlined
                          dense
                          v-model.trim="parametre.institution"
                          placeholder="Appellation *"
                          lazy-rules
                          :rules="[ val => val && val.trim().length > 3 || 'Champs requis']"
                          maxlength="150"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <q-card
                flat
                class="panel-primary"
                bordered
              >
                <q-card-section>
                  <strong>Devise et taux</strong>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <input-label :required="modeEdit">Devise par défaut</input-label>
                      <q-select
                        :readonly="!modeEdit"
                        transition-show="scale"
                        transition-hide="scale"
                        square
                        outlined
                        dense
                        hide-bottom-space
                        hide-selected
                        use-input
                        fill-input
                        v-model="parametre.devise"
                        placeholder="Devise"
                        lazy-rules
                        :options="['CDF','USD']"
                        :rules="[val => !!val || 'Choisissez une option']"
                      />
                    </div>
                    <div class="col-12">
                      <input-label :required="modeEdit">Taux de change (1 USD = ... CDF ?)</input-label>
                      <q-input
                        :readonly="!modeEdit || !$helper.isNumeric(parametre.frais_ouverture_indiv)"
                        square
                        outlined
                        dense
                        hide-bottom-space
                        v-model.trim="parametre.taux"
                        placeholder="Taux de change *"
                        lazy-rules
                        :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                  val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',]"
                        maxlength="7"
                      >
                        <template v-slot:append>
                          <strong style="font-size:12px">{{parametre.devise}}</strong>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <q-card
                flat
                class="panel-primary"
                bordered
              >
                <q-card-section>
                  <strong>Envoi SMS</strong>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-pa-none">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <q-item
                        :disable="!modeEdit"
                        clickable
                        v-ripple
                        @click="$vue.set(parametre,'active_sms', parametre.active_sms === 'OUI' ? 'NON' : 'OUI')"
                      >
                        <q-item-section>
                          <q-item-label
                            class="text-bold"
                            style="font-size:12px"
                          >Activer l'envoi des SMS</q-item-label>
                          <q-item-label
                            caption
                            lines="2"
                          >Envoyer des SMS aux membres apès une opération de dépôt, retrait, virement, rappel d'echeance de crédit,...</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-checkbox
                            :disable="!modeEdit"
                            style="width:100%"
                            v-model="parametre.active_sms"
                            color="primary"
                            true-value="OUI"
                            false-value="NON"
                          />
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </div>
                    <div class="col-12">
                      <div class="q-px-md q-mb-md">
                        <input-label :required="modeEdit">Cout par SMS</input-label>
                        <q-input
                          :disable="parametre.active_sms != 'OUI'"
                          :readonly="!modeEdit"
                          square
                          outlined
                          dense
                          v-model.trim="parametre.cout_sms"
                          placeholder="Cout *"
                          lazy-rules
                          :rules="[ val => val && val.trim().length > 0 || 'Champs requis',
                                  val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                  val => parseFloat(val) > 0 || 'Le montant doit être superieur à zéro',]"
                          maxlength="7"
                        >
                          <template v-slot:append>
                            <strong style="font-size:12px">{{parametre.devise}}</strong>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12">
              <q-card
                flat
                class="panel-primary"
                bordered
              >
                <q-card-section class="q-pa-none">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12">
                      <div class="q-px-md q-py-sm">
                        <strong>Jours non ouvrables</strong>
                      </div>
                      <q-separator />
                      <div class="q-px-md q-py-sm">
                        <q-select
                          :readonly="!modeEdit"
                          transition-show="scale"
                          transition-hide="scale"
                          square
                          outlined
                          dense
                          use-input
                          fill-input
                          multiple
                          clearable
                          v-model="parametre.jours_non_ouvrables"
                          placeholder="Sélectionner les jours non ouvrables"
                          :options="['LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI','DIMANCHE']"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <q-separator />
                      <div class="q-px-md q-py-sm">
                        <div class="row">
                          <div class="col">
                            <strong>Jours fériés</strong>
                          </div>
                          <div
                            class="col-auto"
                            v-if="modeEdit"
                          >
                            <q-btn
                              color="blue-1"
                              text-color="primary"
                              icon="add"
                              label="Ajouter jour férié"
                              unelevated
                              no-caps
                              rounded
                              size="11px"
                              @click="showDlgFerie=true"
                            />
                          </div>
                        </div>
                      </div>
                      <q-separator />
                      <table class="table head-bold  table-colored-head tiny-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>DATE</th>
                            <th class="text-left">DESCRIPTION</th>
                            <th>#</th>
                          </tr>
                        </thead>

                        <tbody style="font-size:11.5px">
                          <tr
                            v-for="(row,index) in parametre.jours_feries || []"
                            :key="index"
                          >
                            <td class="text-center">
                              <q-avatar
                                size="20px"
                                color="primary"
                                text-color="white"
                                class="text-bold"
                              >
                                {{index+1}}
                              </q-avatar>
                            </td>
                            <td class="text-center text-bold">{{longMois(row.date)}}</td>
                            <td class="text-left">{{row.description }}</td>
                            <td
                              class="text-center"
                              style="width:30px"
                            >
                              <q-btn
                                flat
                                text-color="red"
                                icon="close"
                                round
                                size="sm"
                                unelevated
                                @click="retirerJourFerie(row)"
                              />
                            </td>
                          </tr>

                          <template v-if="!$helper.isNotEmpty(parametre.jours_feries)">
                            <tr class="panel-primary">
                              <td
                                :colspan="4"
                                class="text-center text-bold q-py-lg"
                              >
                                Aucun jour férié défini
                              </td>
                            </tr>
                          </template>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-form>
        <linearLoading :loading="loading" />
      </div>
    </div>

    <nouveauJourFerie
      v-model="showDlgFerie"
      @onFinish="addRowJourFerie"
    />

  </q-page>
</template>
<script>
import nouveauJourFerie from './nouveau_jours_ferie.vue'

export default {
  name: 'monCompte',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      loading: false,
      showDlgFerie: false,

      utilisateur: {},
      updateConnexion: false,
      modeEdit: false,
      parametre: {}
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
    const parmsJson = localStorage.getItem(this.$helper.PREF_PARAMS)
    if (parmsJson) {
      this.parametre = JSON.parse(parmsJson)
    }
  },
  mounted: function () {
    document.addEventListener('keydown', this.initialiseShortcut, false)

    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.getParametres()
    }
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.initialiseShortcut, false)
  },
  filters: {},
  watch: {},
  components: {
    nouveauJourFerie
  },
  computed: {

  },
  methods: {
    longMois (v) {
      let d = v.split('-')
      return d[0] + ' ' + this.$helper.long_mois(d[1])
    },
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.longeurCompte === 14 ? this.produit.devise : null,
        with_length: 14,
        signe_length: '>='
      })

      let url = `${this.URLS.BASE_URL}/Compte/searchComptes`
      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        update(() => {
          this.comptes = infos.data.records
        })
      }).catch(() => {
        update(() => {
          this.comptes = []
        })
      })
    },
    onInputLogoChange (e) {
      if (e) {
        if (e.target.files.length > 0) {
          var typeAtorise = ['jpg', 'jpeg', 'png']
          let typeImg = e.target.files[0].name.split('.').pop().toLowerCase()
          if (typeAtorise.indexOf(typeImg) > -1) {
            let reader = new FileReader()
            reader.onload = e1 => {
              this.$vue.set(this.parametre, 'new_logo', e1.target.result)
              e.target.value = null
            }
            reader.readAsDataURL(e.target.files[0])
          } else {
            this.$helper.showMessage('Le format de fichier n\'est pas pris en charge')
          }
        } else {
          this.$helper.showMessage('Séléction du logo annulée')
        }
      }
    },
    getParametres () {
      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id
      })

      let url = `${this.URLS.BASE_URL}/Parametre/getParametres`

      this.loading = true

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loading = false

        if (infos.data.erreur === false && infos.data.records) {
          this.parametre = infos.data.records
          localStorage.setItem(this.$helper.PREF_PARAMS, JSON.stringify(infos.data.records))
        }
      }).catch(() => {
        this.loading = false
        this.$helper.showMessage()
      })
    },
    addRowJourFerie (row) {
      let jours = this.parametre.jours_feries
      let exists = false

      for (let i = 0; i < jours.length; i++) {
        if (row.date === jours[i].date) {
          exists = true
          this.$helper.showMessage('Cette date éxiste déjà sur la liste des jours fériés')
          break
        }
      }

      if (!exists) {
        this.parametre.jours_feries.push(row)
      }
    },
    retirerJourFerie (row) {
      this.parametre.jours_feries.splice(this.parametre.jours_feries.indexOf(row), 1)
    },
    onSubmit (isOk) {
      if (!isOk) return

      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Mise à jour en cours...',
        message: `Souhaitez-vous enregistrer les modifications apportées ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let donnees = JSON.stringify({
          ...this.parametre,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        })

        this.loading = true
        let url = `${this.URLS.BASE_URL}/Parametre/updateParams/`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data.erreur === false) {
            this.$helper.showMessage(infos.data.message, 1, 'center')

            localStorage.setItem(this.$helper.PREF_PARAMS, JSON.stringify(infos.data.params))
            this.modeEdit = false
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
</script>
<style>
.tiny-table > td {
  padding: 0.1rem 0.2rem;
}
</style>
