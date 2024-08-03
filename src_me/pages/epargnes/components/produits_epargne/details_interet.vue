<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="width: 700px; max-width: 95vw;">
        <q-card-section class="q-pa-none ">
          <div class="row panel-primary q-px-md q-py-sm items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon
                name="info"
                size="sm"
                color="primary"
              />
            </div>
            <div class="col">
              <div class="text-h6">Détails</div>
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
            style="min-height:50vh;max-height:65vh"
          >
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <!-- ************** IDENTITE ******************* -->
            <!-- ******************************************* -->
            <!-- ******************************************* -->
            <div class="col-12">
              <div class=" overflow-hidden panel-primary">

                <table class="table head-bold table-colored-head ba ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th class="text-left">INTERVALLE</th>
                      <th>ECHEANCE (En mois)</th>
                      <th>TAUX D'INTERET</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:11.5px">
                    <template v-for="(row,index) in produit.taux_interet">
                      <template v-for="(row2,index2) in row.interets">
                        <tr :key="index+'principal'+index2">
                          <td
                            v-if="index2 ==0"
                            :rowspan="index2 == 0 ? row.interets.length :'1'"
                            class="text-center"
                          >
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                              class="text-bold"
                            >
                              {{index +1}}
                            </q-avatar>

                          </td>
                          <td
                            v-if="index2 ==0"
                            :rowspan="index2 == 0 ? row.interets.length :'1'"
                            class="text-left bg-blue-1 text-bold"
                          >
                            {{row.min}} {{user.devise}} à {{row.max}} {{user.devise}}
                          </td>
                          <td class="text-center text-bold relative-position">
                            {{row2.echeance}} Mois
                          </td>
                          <td class="text-center text-bold">{{row2.taux}} %</td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>

export default {
  name: 'dialogHeritier',
  data () {
    return {
      URLS: {},

      loading: false,
      produit: {},
      tab: '1'
    }
  },
  props: {
    value: Boolean,
    selectedProduit: {},
    user: {}
  },
  components: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted: function () { },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.tab = '1'

        if (this.selectedProduit) {
          this.produit = { ...this.selectedProduit }
        } else {
          this.produit = {}
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
  methods: {}

}
</script>

<style lang="stylus"></style>
