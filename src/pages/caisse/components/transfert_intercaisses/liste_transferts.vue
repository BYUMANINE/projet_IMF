<template>
  <q-page style="min-height:0">

    <list-menu-options contentStyle="top: 120px">

      <menu-option
        text="Actualiser"
        tooltip="Alt + R"
        icon="refresh.png"
        @option-clicked="searchOperation=null;getDatas()"
      />

      <menu-option
        text="Recherche"
        tooltip="Ctrl + F"
        icon="search.png"
        @option-clicked="showDialogSearch=true"
      />

      <menu-option
        v-if="searchOperation"
        text="Quitter la recherche"
        icon="clear.png"
        @option-clicked="showDialogSearch = false;searchOperation=null;getDatas()"
      />

      <menu-option
        text="Nouveau transfert"
        icon="add.png"
        @option-clicked="showNewTransfert=true"
      />
    </list-menu-options>

    <div class="ba overflow-hidden panel-primary q-mt-md">

      <linearLoading :loading="loading" />
      <div class="row">
        <div class="col">
          <div class="panel-primary shadow-1 ">
            <search-result :search="searchOperation" />
            <div class="panel-primary  overflow-auto">
              <table class="table head-bold hover  table-colored-head">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>TYPE</th>
                    <th class="text-left">CAISSE EM.</th>
                    <th class="text-left">CAISSE REC.</th>
                    <th class="text-left">AGENT EM.</th>
                    <th class="text-left">AGENT REC.</th>
                    <th>MONTANT</th>
                    <th>DATE TRANS.</th>
                    <th>OP</th>
                  </tr>
                </thead>

                <tbody style="font-size:11.5px">
                  <tr
                    v-for="(row,index) in data"
                    :key="index"
                    @dblclick="selectedOperation={id:row.fk_operation};showDlgDetailsOp=true"
                  >
                    <td class="text-center">{{index+1}}</td>
                    <td class="text-center">
                      <q-icon
                        v-if="row.is_in === 'OUI'"
                        name="las la-arrow-down"
                        color="green"
                        size="20px"
                      />
                      <q-icon
                        v-else
                        name="las la-arrow-up"
                        color="red"
                        size="20px"
                      />
                    </td>
                    <td class="text-left ">{{row.caisse_src}}</td>
                    <td class="text-left ">{{row.caisse_dest}}</td>
                    <td class="text-left ">{{row.agent_src}}</td>
                    <td class="text-left ">{{row.agent_dest || 'N/A'}}</td>
                    <td class="text-right text-bold">{{$helper.formatMoney(row.montant)}} {{row.devise}}</td>
                    <td class="text-center">{{$helper.dateBien(row.date_transfert,false)}}</td>
                    <td class="text-center">{{row.fk_operation}}</td>

                    <!-- ************************************* -->
                    <!-- *************** MENU    ************* -->
                    <!-- ************************************* -->
                    <q-tooltip>
                      Clic droit pour plus d'options
                    </q-tooltip>

                    <q-menu
                      touch-position
                      context-menu
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-list
                        separator
                        style="min-width: 100px"
                      >

                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="selectedOperation={id:row.fk_operation};showDlgDetailsOp=true"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-caret-square-down"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Afficher détails de l'opération</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="imprimer({id_transfert:row.id})"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-print"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Imprimer le bordereau</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          v-close-popup
                          @click="annulerTransfert()"
                        >
                          <q-item-section avatar>
                            <q-icon
                              class="las la-times"
                              size="24px"
                              color="primary"
                            />
                          </q-item-section>
                          <q-item-section>Annuler ce transfert ?</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>

                  </tr>

                  <template v-if="loading && data.length===0">
                    <tr
                      v-for="item in 6"
                      :key="item"
                      class="panel-primary"
                    >
                      <td
                        v-for="item2 in 8"
                        :key="item2"
                        class="text-center"
                      >
                        <q-skeleton type="rect" />
                      </td>
                    </tr>
                  </template>

                  <template v-if="!loading && data.length===0">
                    <tr class="panel-primary">
                      <td :colspan="8">
                        <nondata
                          v-if="!loading"
                          title="Aucune affectation trouvée"
                          @actualiser="getDatas()"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <linearLoading :loading="loading && data && data.length >= 5" />
            <q-separator />
            <myPagination
              v-model="filterListe.peer_page"
              idPagination="paginationcaisse"
              @onPaginate="getDatas()"
            />
          </div>
        </div>
      </div>
    </div>

    <search
      v-model="showDialogSearch"
      :search="searchOperation"
      :filters="[
        {value:'caisse_src.designation|%%',label:'Par intitulé de la caisse émettrice'},
        {value:'caisse_dest.designation|%%',label:'Par intitulé de la caisse réceptrice'},
        {value:'caisse_src.code|%%',label:'Par code de la caisse réceptrice'},
        {value:'caisse_dest.code|%%',label:'Par code de la caisse réceptrice'},
        {value:'agent_src.nom_complet|%%',label:'Par nom de l\'agent émetteur',is_checked:false},
        {value:'agent_dest.nom_complet|%%',label:'Par nom de l\'agent réceptreur',is_checked:false}
      ]"
      @onSearch="(e)=>{searchOperation=e;this.getDatas()}"
    />

    <nouveauTransfert
      v-model="showNewTransfert"
      @onFinish="getDatas()"
    />

    <detailsOperation
      v-model="showDlgDetailsOp"
      :selectedOperation="selectedOperation"
      :user="user"
    />

    <previewRapportDialog
      v-model="showDlgPreview"
      :document="document"
      width="600px"
    />
  </q-page>
</template>
<script>
import nouveauTransfert from './nouveau_transfert.vue'
import detailsOperation from '../../../commun/details_operation.vue'

export default {
  name: 'liste_caisse',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},
      user: {},

      /* BOOLEAN VARAIBLES */
      loading: true,
      showDialogSearch: false,
      isAdd: false,
      showNewTransfert: false,
      showDlgDetailsOp: false,
      showDlgPreview: false,

      /* STRING AND OBJECT VARAIBLES */
      searchOperation: null,
      filterListe: null,
      selectedCaisse: null,
      selectedOperation: null,
      document: null,

      selectedAffectation: {},
      defaultValues: {
        filters: {
          peer_page: '20'
        }
      },

      /* TABLEAU VARAIBLES */
      data: [],
      nombre: 0

    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    this.selectedCaisse = this.user.caisse
    this.filterListe = { ...this.defaultValues.filters }
  },
  mounted: function () {
    if (this.user === null) {
      this.$router.push('/')
    } else {
      this.getDatas()
    }
  },
  destroyed: function () { },
  filters: {},
  watch: {},
  components: {
    nouveauTransfert,
    detailsOperation
  },
  computed: {},
  methods: {

    getDatas (url = null) {
      if (this.$helper.isNotEmpty(this.filterListe.peer_page)) {
        this.loading = true

        const donnees = JSON.stringify({
          id_caisse: this.selectedCaisse.cdf.id_caisse,
          id_agent: this.user.id,
          id_agence: this.user.agence.id,
          peer_page: this.filterListe.peer_page,
          search: this.searchOperation
        })

        url = url || `${this.URLS.BASE_URL}/Caisse/getAllTransfertsCaisses`

        this.$axios.post(url, this.$helper.objectToform({ 'data': donnees })).then((infos) => {
          this.loading = false
          this.$helper.checkResponse(infos.data)

          if (infos.data && infos.data.records.length > 0) {
            this.data = infos.data.records
            this.nombre = infos.data.nombre

            let el = document.querySelector('.paginationcaisse')

            if (el) {
              el.innerHTML = infos.data.pagination
              document.querySelectorAll('.paginationcaisse a').forEach(el => {
                el.onclick = e => {
                  e.preventDefault()
                  this.getDatas(e.target.href)
                }
              })
            }
          } else {
            this.nombre = 0
            this.data = []
          }
        }).catch((e) => {
          this.loading = false
          let el = document.querySelector('.paginationcaisse')
          if (el) {
            el.innerHTML = ''
          }
          this.data = []
          this.$helper.showMessage()
        })
      }
    },
    annulerTransfert (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Annulation  en cours...',
        message: `Souhaitez-vous vraiment annuler ce transfert ?`,
        cancel: 'Non',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        let data = {
          ...row,
          id_agent: this.user.id,
          id_agence: this.user.agence.id
        }

        let donnees = JSON.stringify(data)

        this.$q.loading.show()
        let url = `${this.URLS.BASE_URL}/Caisse/deleteTransfert/`

        this.$axios.post(url, this.$helper.objectToform({ data: donnees }))
          .then(infos => {
            this.$q.loading.hide()
            this.$helper.checkResponse(infos.data)

            if (infos.data.erreur === false) {
              this.$helper.showMessage(infos.data.message, 1)
              this.data.splice(this.data.indexOf(row), 1)
            } else {
              this.$helper.showMessage(infos.data.message)
            }
          })
          .catch(e => {
            this.$q.loading.hide()
            this.$helper.showMessage()
          })
      })
    },
    imprimer (filtre) {
      let donnees = JSON.stringify({
        ...filtre,
        id_agent: this.user.id,
        id_agence: this.user.agence.id,
        type: 'html'
      })

      let urlStr = `${this.URLS.BASE_URL}/rapports/Rapport_caisse/exportBordereauTransfert/`
      this.$q.loading.show()

      this.$axios({
        url: urlStr,
        method: 'POST',
        responseType: 'blob',
        data: this.$helper.objectToform({ 'data': donnees })
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }))

        this.document = {
          url,
          name: 'TRANSFERT ENTRE CAISSES'
        }
        this.showDlgPreview = true
        this.$q.loading.hide()
      }).catch(e => {
        this.$q.loading.hide()
        this.$helper.showMessage()
      })
    }
  }

}
</script>
<style lang="stylus"></style>
