<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">{{isAdd?'Nouveau ': 'Mise à jours du '}} frais</div>
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
                    <div
                      class="q-py-xs q-px-sm text-h6"
                      style="font-size:14px"
                    >INFORMATIONS</div>
                    <q-separator />
                    <div class="q-pa-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12">
                          <input-label required>Intitulé du frais</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="frais.designation"
                            placeholder="Intitulé du frais"
                            lazy-rules
                            :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                            class="mrg"
                            maxlength="150"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Devise </input-label>
                          <q-select
                            transition-show="scale"
                            transition-hide="scale"
                            square
                            dense
                            v-model="frais.devise"
                            rounded
                            fill-input
                            hide-selected
                            hide-bottom-space
                            use-input
                            outlined
                            clearable
                            :options="['CDF','USD']"
                            placeholder="Devise"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                            @input=" $vue.set(frais,'compte',null)"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Compte lié </input-label>
                          <q-select
                            :readonly="!(!!frais.devise)"
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
                            v-model="frais.compte"
                            :options="comptes"
                            :option-value="opt => opt"
                            :option-label="opt => !!opt ? `${!!opt.devise ? `${opt.indice} - ${opt.devise} -` : ''} ${opt.intitule}` : ''"
                            @filter="filterComptes"
                            lazy-rules
                            :rules="[val => !!val || 'Choisissez une option']"
                          >
                            <template #option="scope">
                              <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                              >
                                <q-item-section v-if="scope.opt">
                                  <q-item-label>
                                    <span
                                      v-if="!!scope.opt.devise"
                                      class="semi-bold"
                                    >{{scope.opt.indice}}-</span>

                                    <span
                                      v-if="!!scope.opt.devise"
                                      class="text-primary semi-bold"
                                    >{{scope.opt.devise}}-</span>

                                    {{scope.opt.intitule}}
                                  </q-item-label>
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
  name: 'dialogFrais',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      frais: {},
      comptes: []
    }
  },
  props: {
    value: Boolean,
    selectedFrais: null,
    isAdd: {
      type: Boolean,
      default: false
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
        if (this.selectedFrais != null) {
          this.frais = { ...this.selectedFrais }
        } else {
          this.frais = {}
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

    onSubmit (isSucess) {
      if (isSucess) {
        this.$q.dialog({
          dark: this.$q.dark.isActive,
          title: 'Enregistrement en cours...',
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce frais?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.frais,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Frais_credit/${this.isAdd ? 'add' : 'update'}/`

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
    filterComptes (val, update, abort) {
      let donnees = JSON.stringify({
        chaine: val,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        devise: this.frais.devise

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
    viderChamps () {
      this.frais = {}
      this.$refs.myForm.resetValidation()
    }

  }

}
</script>

<style lang="stylus"></style>
