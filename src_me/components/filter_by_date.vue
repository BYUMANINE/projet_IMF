<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="border-radius:10px; width: 450px; max-width: 95vw;">
      <q-card-section class="q-pa-none">
        <div class="q-pa-md">
          <div class="row items-center q-col-gutter-sm">
            <div class="col-auto">
              <q-avatar
                color="blue-1"
                text-color="primary"
                size="30px"
              >
                <q-icon
                  name="las la-calendar"
                  size="22px"
                />
              </q-avatar>

            </div>
            <div class="col">
              <div class="text-h6">Filtrer par date</div>
            </div>
            <div class="col-auto">
              <q-btn
                unelevated
                round
                color="blue-1"
                text-color="blue"
                size="sm"
                icon="close"
                v-close-popup
              />
            </div>
          </div>
        </div>
        <q-separator />
      </q-card-section>
      <q-card-section>
        <q-list
          separator
          bordered
          style="min-width: 150px;border-radius:10px"
          dense
        >
          <q-item
            v-for="(row,index) in filters"
            :key="index"
          >
            <q-item-section>
              <q-radio
                v-model="filter1"
                :val="row.value"
                :label="row.label"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section
        class="q-py-none"
        v-if="filter1 !== null"
      >
        <q-list
          separator
          bordered
          style="min-width: 150px;border-radius:10px"
          dense
        >
          <q-form ref="myForm">
            <q-card-section>
              <input-label required>{{filter1 === null ? "Sélectionner une date" : "A partir de"}}</input-label>
              <q-input
                rounded
                outlined
                dense
                hide-bottom-space
                v-model="dateMin1"
                :label="filter1 === null ? 'Date' : 'Date min'"
                lazy-rules
                mask="####-##-##"
                readonly
                :rules="[val => !!val && val !==null || 'Date obligatoire',
                         val => $dateManager.inferieurEgalA(val,$helper.now('-')) || 'Doit être inferièure ou égale à la date actuelle']"
                @click="$refs.popup_date_min.show()"
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
                      ref="popup_date_min"
                    >
                      <q-date
                        v-model="dateMin1"
                        mask="YYYY-MM-DD"
                        @input="() => $refs.popup_date_min.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <div v-if="filter1 === 'between'">
                <input-label required>Jusqu'à</input-label>
                <q-input
                  rounded
                  outlined
                  dense
                  hide-bottom-space
                  v-model="dateMax1"
                  label="Date max"
                  mask="####-##-##"
                  lazy-rules
                  readonly
                  :rules="[val => val !== null && val !== '' && val !==null || 'Date obligatoire',
                           val => val >= dateMin1 || 'Cette date doit etre superieur ou égale à la première']"
                  @click="$refs.popup_date_max.show()"
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
                        ref="popup_date_max"
                      >
                        <q-date
                          v-model="dateMax1"
                          mask="YYYY-MM-DD"
                          @input="() => $refs.popup_date_max.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </q-card-section>
          </q-form>
        </q-list>
      </q-card-section>
      <q-card-section align="right">
        <q-btn
          label="Appliquer les filtres"
          no-caps
          color="blue-1"
          text-color="primary"
          type="submit"
          rounded
          unelevated
          size="12px"
          class="q-mr-sm"
          @click="onFilterSubmit()"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'filter_search',
  data () {
    return {
      filter1: null, // from,between
      dateMin1: null,
      dateMax1: null,
      filters: [
        { value: null, label: this.label },
        { value: 'from', label: "A partir de ---> jusqu'à aujourd'hui" },
        { value: 'between', label: "A partir de ---> jusqu'à" }
      ]
    }
  },
  props: {
    value: Boolean,
    label: {
      type: String,
      default: 'Aujourd\'hui'
    },
    filter: {
      type: String,
      value: null
    },
    dateMin: {
      type: String,
      value: null
    },
    dateMax: {
      type: String,
      value: null
    }

  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.filter1 = this.filter
        this.dateMin1 = this.dateMin
        this.dateMax1 = this.dateMax
      }
    }
  },
  methods: {
    async onFilterSubmit () {
      let isSuccess = this.filter1 === null
        ? true
        : await this.$refs.myForm.validate()

      if (isSuccess) {
        if (this.filter1 === 'from') {
          this.dateMax1 = this.$helper.now('-', false)
        } else if (this.filter1 === null) {
          this.dateMin1 = null
          this.dateMax1 = null
        }

        this.$emit('onSelected', { min: this.dateMin1.trim(), max: this.dateMax1.trim(), filter: this.filter1.trim() })
        this.showDialog = false
      }
    }
  }
}
</script>

<style>
</style>
