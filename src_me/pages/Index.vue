<template>
  <q-page>

    <div
      class="ba overflow-hidden panel-primary q-mt-md text-center"
      style="padding:170px 0"
    >

      <div
        style="border:2px dotted #0266fe;display:inline-block"
        class="q-pa-lg"
      >
        <q-img
          src="statics/images/logo/logo.png"
          spinner-color="white"
          spinner-size="20px"
          contain
          width="300px"
        />

        <div>
          <div
            class="text-h4 text-bold q-mt-lg bg-primary q-pa-md text-white"
            style="display:inline-block"
          >
            COOPERATIVES <span
              class="q-px-sm text-secondary"
              style="background:rgba(255,253,6,.3)"
            >ET</span> IMF
          </div>
        </div>
      </div>
      <div class="text-bold q-mt-md">
        © Copyright - 2024
      </div>

    </div>
    <div v-if="!loading && $helper.isNotEmpty(data)"></div>
  </q-page>
</template>
<script>

export default {
  name: 'page_votes',
  data () {
    return {
      URLS: {},
      user: {},

      selectedFilter: {},
      optionsFilters: [
        { value: 'GRAPHIQUE', label: 'Affichage graphique' }
      ],
      data: {},
      loading: true
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.selectedFilter = this.optionsFilters[0]

    if (this.user === null) {
      this.$router.push('/')
    }
  },
  mounted: function () { },
  unmounted () { },
  components: {},
  watch: {},
  computed: {},
  methods: {
  }
}
</script>

<style>
</style>
