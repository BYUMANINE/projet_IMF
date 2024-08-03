<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Ajouter un jour férié</div>
          </div>

          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              label="Ajouter"
              icon="add"
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
        <q-separator />

        <div
          class="row  q-px-md q-py-sm scroll "
          style="max-height:75vh"
        >
          <div class="col">

            <q-form ref="myForm">
              <div class="ba overflow-hidden panel-primary">
                <div class="row q-col-gutter-sm q-pa-md">
                  <div class="col-12">
                    <input-label required>Date</input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model="ferie.date"
                      placeholder="Date"
                      mask="##-##"
                      lazy-rules
                      readonly
                      :rules="[val => !!val &&  val.length > 0  || 'Selectionner une date']"
                      @click="$refs.popup_date.show()"
                    >
                      <template v-slot:append>
                        <q-icon
                          class="cursor-pointer"
                          name="las la-calendar"
                          style="font-size:25px"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                            ref="popup_date"
                          >
                            <q-date
                              v-model="ferie.date"
                              mask="DD-MM"
                              @input="() => $refs.popup_date.hide()"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <input-label required>Description </input-label>
                    <q-input
                      square
                      outlined
                      dense
                      hide-bottom-space
                      v-model.trim="ferie.description"
                      placeholder="Description"
                      lazy-rules
                      :rules="[ val => val && val.trim().length > 2 || 'Minimun 3 caractères']"
                      class="mrg"
                      maxlength="50"
                    />
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
  name: 'dialogJourFerie',
  data () {
    return {
      ferie: {}
    }
  },
  props: {
    value: Boolean
  },
  beforeMount () { },
  mounted: function () { },
  destroyed: function () { },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.ferie = {}
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

    onSubmit (isOk) {
      if (!isOk) return

      this.$emit('onFinish', this.ferie)
      this.showDialog = false
    }

  }

}
</script>

<style lang="stylus"></style>
