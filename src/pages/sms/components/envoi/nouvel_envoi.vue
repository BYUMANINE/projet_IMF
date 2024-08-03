<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 550px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Envoi SMS</div>
          </div>
          <div
            class="col-auto"
            v-if="isAdd"
          >
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="las la-broom"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="viderChamps()"
            />
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
              @click="$refs.myForm.validate().then(onSubmit)"
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

            <q-form ref="myForm">
              <div class="row q-col-gutter-md ">
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <!-- ************** SITE ******************* -->
                <!-- ******************************************* -->
                <!-- ******************************************* -->
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">

                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Désignation</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="message.designation"
                            placeholder="Désignation"
                            lazy-rules
                            :rules="[ val => !!val && val.trim().length >= 3 || 'Minimun 3 caractères']"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Type client</input-label>
                          <q-select
                            :readonly="!isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner un type"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            v-model="message.type_client"
                            :options="['MEMBRE','GROUPE','ENTREPRISE']"
                            :option-value="opt => opt"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une opton']"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Nombre de chèques</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="message.nb_cheques"
                            placeholder="Nombre de chèques"
                            lazy-rules
                            :rules="[
                                      val => (val && val.trim().length > 0) || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) > 0 || 'La nombre doit être superieur à zéro'
                                    ]"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Devise</input-label>
                          <q-select
                            :readonly="!isAdd"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            placeholder="Sélectionner une devise"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            v-model="message.devise"
                            :options="['CDF','USD']"
                            :option-value="opt => opt"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une devise']"
                            @input="$vue.set(message,'fk_compte_produit',null)"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <input-label required>Prix de vente</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="message.prix"
                            placeholder="Prix de vente"
                            lazy-rules
                            :rules="[
                                      val => (val && val.trim().length > 0) || 'Champs requis',
                                      val => this.$helper.isNumeric(val) || 'Uniquement les chiffres',
                                      val => parseFloat(val) > 0 || 'La mise doit être superieur à zéro'
                                    ]"
                            maxlength="12"
                          >
                            <template
                              v-if="message.devise"
                              #append
                            >
                              <strong style="font-size:14px">{{message.devise}}</strong>
                            </template>
                          </q-input>
                        </div>
                        <div class="col-12">
                          <input-label required>Produit sur vente chéquier (Ex. 727)</input-label>
                          <q-select
                            :readonly="!(!!message.devise)"
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            outlined
                            dense
                            clearable
                            placeholder="Sélectionner un compte"
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            emit-value
                            map-options
                            v-model="message.fk_compte_produit "
                            :options="comptes"
                            :option-value="opt => opt"
                            :option-label="opt => !!opt ? `${opt.indice}` : ''"
                            @filter="filterComptes"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                          >
                            <template #option="scope">
                              <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                              >
                                <q-item-section>
                                  <q-item-label> {{scope.opt.indice}} - {{scope.opt.devise}} - {{scope.opt.intitule}}</q-item-label>
                                </q-item-section>
                              </q-item>
                              <q-separator />
                            </template>
                            <template #no-option>
                              <q-item>
                                <q-item-section class="text-red">
                                  Aucun compte trouvé
                                </q-item-section>
                              </q-item>
                            </template>
                          </q-select>
                        </div>
                        <div
                          class="col-12"
                          v-if="message.fk_compte_produit"
                        >
                          <input-label>Intitulé du compte</input-label>
                          <div class="text-details"> {{`${message.fk_compte_produit.indice} - ${message.fk_compte_produit.intitule}`}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogChequier',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      message: {},
      comptes: []

    }
  },
  props: {
    value: Boolean,
    selectedType: {},
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        if (this.selectedType != null) {
          this.message = { ...this.selectedType }
        } else {
          this.message = {}
        }
      }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.message.devise,
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
    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce type chequier?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.message,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Chequier/${this.isAdd ? 'addType' : 'updateType'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
              this.$refs.myForm.resetValidation()
            } else {
              this.$helper.showMessage(infos.data.message, 0, 'bottom')
            }
          }).catch((e) => {
            this.loading = false
            this.$helper.showMessage()
          })
        })
      }
    },
    viderChamps () {
      this.message = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
