<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Type garantie</div>
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
                          <input-label required>Intitulé du type de garantie</input-label>
                          <q-input
                            square
                            outlined
                            dense
                            hide-bottom-space
                            v-model.trim="type_garantie.designation"
                            placeholder="Intitulé du type de garantie"
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
                            v-model="type_garantie.devise"
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
                            @input=" $vue.set(type_garantie,'compte',null)"
                          />
                        </div>
                        <div class="col-12">
                          <input-label required>Compte lié </input-label>
                          <q-select
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
                            v-model="type_garantie.compte"
                            :options="comptes"
                            :option-value="opt => opt"
                            :option-label="opt => !!opt ? `${opt.indice}` : ''"
                            @filter="filterComptes"
                            @focus="longeurCompte=14;signeLength='>='"
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
  name: 'dialogtype_garantie',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      type_garantie: {},
      comptes: [],
      longeurCompte: 5,
      signeLength: '='
    }
  },
  props: {
    value: Boolean,
    selectedtypeGarantie: null,
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
        if (this.selectedtypeGarantie != null) {
          this.type_garantie = { ...this.selectedtypeGarantie }
        } else {
          this.type_garantie = {}
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
          message: `Souhaitez-vous vraiment ${this.isAdd ? 'ajouter' : 'mettre à jour'} ce type garantie?`,
          cancel: 'Non',
          ok: 'Oui',
          persistent: true
        }).onOk(() => {
          let donnees = JSON.stringify({
            ...this.type_garantie,
            id_agent: this.user.id,
            id_agence: this.user.agence.id
          })

          this.loading = true
          let url = `${this.URLS.BASE_URL}/Garantie/${this.isAdd ? 'addType' : 'updateType'}/`

          this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
            this.loading = false
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1, 'center')

              this.$emit('onFinish', true)
              this.showDialog = false

              this.viderChamps()
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
        devise: this.type_garantie.devise,
        with_length: this.longeurCompte,
        signe_length: this.signeLength
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
      this.type_garantie = {}
      if (this.$refs.myForm) {
        this.$refs.myForm.resetValidation()
      }
    }

  }

}
</script>

<style lang="stylus"></style>
