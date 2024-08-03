<template>
  <q-page class="filly-auto">
    <individuel
      v-if="selectedOption.value === 'INDIVIDUEL'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
      @onOptionChanged="onOptionChanged"
      @onPrint="e=>$emit('onPrint',e)"
    />
    <groupe
      v-if="selectedOption.value === 'GROUPE'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
      @onOptionChanged="onOptionChanged"
      @onPrint="e=>$emit('onPrint',e)"
    />
    <entreprise
      v-if="selectedOption.value === 'ENTREPRISE'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
      @onOptionChanged="onOptionChanged"
      @onPrint="e=>$emit('onPrint',e)"
    />
    <retraitEac
      v-if="selectedOption.value === 'EAC'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
      @onOptionChanged="onOptionChanged"
      @onPrint="e=>$emit('onPrint',e)"
    />

    <!-- <retraitCommission
      v-if="selectedOption.value === 'COMMISSION'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
       @onOptionChanged="onOptionChanged"
 @onPrint="e=>$emit('onPrint',e)"

    /> -->

    <autresDecaissements
      v-if="selectedOption.value === 'AUTRES-DECAISSEMENTS'"
      :options="options"
      :URLS="URLS"
      :user="user"
      :caisse="caisse"
      :solde="soldeCaisse"
      :caisseName="caisseName"
      @actualiser="getSituationCaisse()"
      @onOptionChanged="onOptionChanged"
      @onPrint="e=>$emit('onPrint',e)"
    />
    <div
      class="ba overflow-hidden q-mt-md"
      v-if="this.$helper.isNotEmpty(this.caisse)"
    >

      <table class="table  table-tiny">
        <tr>
          <td class="text-bold text-left bg-blue-1 text-blue relative-position">DISPONIBLE DANS <span class="text-blue">{{caisseName }}</span>
            <div style="position:absolute;bottom:0;left:0;right:0;">
              <linearLoading :loading="loadingSoldeDispo" />
            </div>
          </td>
          <td
            class="text-bold text-center bg-blue-1 text-blue"
            style="width:40px"
          >DEVISE</td>
          <td class="text-bold text-right bg-blue-1 text-blue">MONTANT</td>
          <td class="text-bold text-left bg-blue-1 text-blue">SOLDE</td>
        </tr>

        <!-- INITIAL -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >SOLDE INITIAL</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_initial.montant) : '0,00' }} </td>
          <td
            class="text-bold text-left"
            style="width:50px"
          >{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_initial.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_initial.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_initial.solde}` : 'SDC'}}</td>
        </tr>
        <!-- ENCAISSEMENTS -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >ENCAISSEMENTS</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_entrees.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_entrees.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_entrees.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_entrees.solde}` : 'SDC'}}</td>
        </tr>
        <!-- DECAISSEMENTS -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left"
          >DECAISSEMENTS</td>
          <td class="text-bold text-center">CDF</td>
          <td class="text-bold text-right">{{!!soldeCaisse  ? $helper.formatMoney(soldeCaisse.cdf.solde_sorties.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_sorties.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center">USD</td>
          <td class="text-bold text-right">{{!!soldeCaisse  ? $helper.formatMoney(soldeCaisse.usd.solde_sorties.montant) : '0,00' }} </td>
          <td class="text-bold text-left">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_sorties.solde}` : 'SDC'}}</td>
        </tr>
        <!-- SOLDE -->
        <tr>
          <td
            rowspan="2"
            class="text-bold text-left text-blue bg-blue-1"
          >SOLDE ACTUEL</td>
          <td class="text-bold text-center bg-blue-1">CDF</td>
          <td class="text-bold text-right text-blue bg-blue-1">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.cdf.solde_actuel.montant) : '0,00' }} </td>
          <td class="text-bold text-left text-blue bg-blue-1">{{!!soldeCaisse ? `S${soldeCaisse.cdf.solde_actuel.solde}` : 'SDC'}}</td>
        </tr>
        <tr>
          <td class="text-bold text-center bg-blue-1">USD</td>
          <td class="text-bold text-right text-blue bg-blue-1">{{!!soldeCaisse ? $helper.formatMoney(soldeCaisse.usd.solde_actuel.montant) : '0,00' }} </td>
          <td class="text-bold text-left text-blue bg-blue-1">{{!!soldeCaisse ? `S${soldeCaisse.usd.solde_actuel.solde}` : 'SDC'}}</td>
        </tr>

      </table>
    </div>
  </q-page>
</template>
<script>

import individuel from './individuel/individuel.vue'
import groupe from './groupe/groupe.vue'
import entreprise from './entreprise/entreprise.vue'
import autresDecaissements from './autres/autres_decaissements.vue'
import retraitEac from './eac/retrait_eac.vue'
// import retraitCommission from './eac/retrait_commission.vue'

export default {
  name: 'decaissement',
  data () {
    return {

      selectedOption: null,
      soldeCaisse: null,
      loadingSoldeDispo: true,

      options: [
        { value: 'INDIVIDUEL', label: 'Retrait compte individuel' },
        { value: 'GROUPE', label: 'Retrait compte groupe' },
        { value: 'ENTREPRISE', label: 'Retrait compte entreprise' },
        { value: 'EAC', label: 'Retrait épargne à la carte' },
        // { value: 'COMMISSION', label: 'Retrait commission du collecteur' },
        { value: 'AUTRES-DECAISSEMENTS', label: 'Autres décaissements' }
      ]
    }
  },
  props: ['URLS', 'user', 'caisse'],
  beforeMount () {
    this.selectedOption = this.options[0]
  },
  mounted: function () {
    this.getSituationCaisse()
  },
  destroyed: function () {
  },
  watch: {
    caisse (newValue, oldValue) {
      if (newValue) {
        this.getSituationCaisse()
      }
    }
  },
  components: {
    individuel,
    groupe,
    entreprise,
    autresDecaissements,
    retraitEac
    // retraitCommission
  },
  filters: {
    uppercase (v) {
      return v ? v.toUpperCase() : v
    }
  },
  computed: {
    caisseName () {
      return this.$helper.isNotEmpty(this.caisse) ? this.caisse.cdf.designation : 'AUCUNE CAISSE'
    }
  },
  methods: {
    onOptionChanged (option) {
      if (option) {
        this.selectedOption = option
      }
    },
    getSituationCaisse () {
      if (!this.$helper.isNotEmpty(this.caisse)) {
        return
      }

      let donnees = JSON.stringify({
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        id_caisse: this.caisse.cdf.id_caisse // id_caisse est le meme pour  et
      })

      let url = `${this.URLS.BASE_URL}/Caisse/getSituationCaisse`

      this.loadingSoldeDispo = true

      this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
        this.loadingSoldeDispo = false
        if (infos.data.erreur === false) {
          this.soldeCaisse = null
          if (infos.data.records) {
            this.soldeCaisse = infos.data.records
          }
        }
      }).catch(() => {
        this.loadingSoldeDispo = false
        this.soldeCaisse = null
        this.$helper.showMessage()
      })
    }
  }
}
</script>

<style>
.table-tiny tr td {
  padding: 4px 15px 4px 15px !important;
  font-size: 11.5px;
}
.table-tiny tr td:last-child {
  font-weight: bold;
}
</style>
