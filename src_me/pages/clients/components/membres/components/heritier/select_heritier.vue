<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 700px; max-width: 95vw;">
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">Sélectionner un héritier</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading || !selected.id"
              color="blue-1"
              text-color="primary"
              label="Ajouter à la liste"
              icon="las la-check-circle"
              unelevated
              rounded
              size="12px"
              no-caps
              @click="valider()"
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

            <q-form @submit.prevent="getDatas()">
              <div class="row q-col-gutter-sm ">
                <div class="col-12">
                  <q-input
                    square
                    outlined
                    dense
                    placeholder="Rechercher un héritier"
                    fill-input
                    hide-selected
                    hide-bottom-space
                    use-input
                    emit-value
                    v-model.lazy.trim="search"
                    @change="e=>{if(this.$helper.isNotEmpty(e)){getDatas() }}"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                    <template
                      #append
                      v-if="!!search"
                    >
                      <q-btn
                        color="blue-1"
                        text-color="primary"
                        size="12px"
                        round
                        unelevated
                        flat
                        no-caps
                        icon="las la-arrow-right"
                        @click="getDatas()"
                      />

                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <div class="ba overflow-hidden panel-primary">
                    <table class="table head-bold hover table-striped table-colored-head">
                      <thead>
                        <tr>
                          <th></th>
                          <th>#</th>
                          <th class="text-left">NOM COMPLET</th>
                          <th class="text-left">SEXE</th>
                          <th class="text-left">DATE NAISS.</th>
                          <th class="text-left">LIEU NAISS</th>
                        </tr>
                      </thead>

                      <tbody style="font-size:11.5px">
                        <tr
                          v-for="(row, index) in data"
                          :key="index"
                          @click="onSelected(row)"
                        >
                          <td class="text-center">
                            <div
                              style="width:25px;height:25px;border:2px solid #5764ff;text-align:center"
                              :class="row.id === selected.id ? 'bg-primary' : 'bg-grey-3'"
                            >
                              <q-icon
                                v-if=" row.id === selected.id"
                                name="las la-check"
                                color="white"
                                size="18px"
                              />
                            </div>
                          </td>
                          <td class="text-center text-bold">
                            <q-avatar
                              color="primary"
                              text-color="white"
                              size="20px"
                            >
                              {{ index + 1 }}
                            </q-avatar>
                          </td>
                          <td class="text-left">{{row.nom_complet}}</td>
                          <td class="text-left">{{row.sexe}}</td>
                          <td class="text-left">{{row.date_naissance}}</td>
                          <td class="text-left">{{row.lieu_naissance}}</td>

                        </tr>

                        <template v-if="loading && data.length === 0">
                          <tr
                            v-for="item in 6"
                            :key="item"
                            class="panel-primary"
                          >
                            <td
                              v-for="item2 in 6"
                              :key="item2"
                              class="text-center"
                            >
                              <q-skeleton type="rect" />
                            </td>
                          </tr>
                        </template>

                        <template v-if="!loading && data.length === 0">
                          <tr class="panel-primary">
                            <td :colspan="6">
                              <nondata
                                v-if="!loading"
                                title="Aucun héritier trouvé"
                                @actualiser="getDatas()"
                              />
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
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
  name: 'dialogComptes',
  data () {
    return {
      URLS: {},
      user: {},

      loading: false,
      search: null,
      selected: {},
      data: []
    }
  },
  props: {
    value: Boolean
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) {
        this.data = []
        this.search = null
        this.selected = {}
        this.getDatas()
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

    getDatas () {
      this.loading = true

      const donnees = JSON.stringify({
        id_membre: this.user.id_agent,
        id_agence: this.user.agence.id,
        search: this.search
      })

      let url = `${this.URLS.BASE_URL}/Heritier/searchHeritiers`

      this.$axios
        .post(url, this.$helper.objectToform({ data: donnees }))
        .then(infos => {
          this.loading = false

          if (infos.data.erreur === false) {
            this.data = infos.data.records
          }
        }).catch(e => {
          this.loading = false
          this.data = []
          this.$helper.showMessage()
        })
    },
    onSelected (row) {
      if (row) {
        this.selected = row
      }
    },
    valider () {
      this.$emit('onFinish', { ...this.selected, is_update: true })
      this.showDialog = false
      this.selected = {}
    }
  }
}
</script>

<style lang="stylus"></style>
