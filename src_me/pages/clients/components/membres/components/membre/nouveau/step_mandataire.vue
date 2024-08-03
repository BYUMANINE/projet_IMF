<template>
  <div
    class="panel-primary"
    style="width:100%"
  >
    <div class="row q-col-gutter-md ">
      <div class="col">
        <div class="ba overflow-hidden panel-primary">
          <div class="row items-center q-py-xs">
            <div class="col">
              <div
                class="q-py-xs q-px-sm text-h6"
                style="font-size:14px"
              >MANDATAIRES AU COMPTE</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Ajouter un mandataire"
                icon-right="add"
                rounded
                unelevated
                no-caps
                size="12px"
                class="q-mr-md"
              >
                <q-menu
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
                      @click="isAdd=true;selectedMandataire=null;showDNewMandataire= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="add"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Créer un nouveau mandataire</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="showDlgExistMandataire= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          class="las la-history"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Sélectionner un mandataire éxistant</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
          <q-separator />
          <div>
            <div class="row">
              <div class="col-12">
                <table class="table head-bold hover table-striped table-colored-head">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PHOTO</th>
                      <th
                        style="width:20%"
                        class="text-left"
                      >NOM COMPLET</th>
                      <th class="text-center">SEXE</th>
                      <th class="text-center">ETAT CIVIL</th>
                      <th class="text-center">NATIONALITE</th>
                      <th class="text-center">PROFESSION</th>
                      <th class="text-center">PIECE</th>
                      <th class="text-center">TELEPHONE</th>
                      <th class="text-center">RELATION</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row, index) in mandataires"
                      :key="index"
                      @dblclick="selectedMandataire = row; isAdd = false; showDNewMandataire = true"
                    >
                      <td :class="`text-center  ${row.status == 'INACTIF' ? 'border-red' : ''}`">
                        <q-avatar
                          color="primary"
                          text-color="white"
                          size="20px"
                        >
                          {{ index + 1 }}
                        </q-avatar>
                      </td>
                      <td class="text-center">
                        <div
                          class="color-gradient text-center"
                          style="padding:3px; width:31px;margin:auto"
                        >
                          <q-img
                            :src="!!row.new_photo ? row.new_photo : (!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png')"
                            spinner-color="blue"
                            spinner-size="15px"
                            class="panel-primary"
                            style="height: 25px; width: 25px;"
                          />
                        </div>
                        <q-tooltip
                          transition-show="scale"
                          transition-hide="scale"
                          anchor="center right"
                          self="center middle"
                          content-class="panel-primary shadow-3 q-pa-none"
                        >
                          <div
                            class="color-gradient text-center"
                            style="padding:3px; width:250px"
                          >
                            <q-img
                              :src="!!row.new_photo ? row.new_photo : (!!row.photo ?  `${URLS.IMG_MANDATAIRE}/${row.photo}` :'statics/images/icone/avatar.png')"
                              spinner-color="blue"
                              spinner-size="20px"
                              class="panel-primary"
                              style="height: 243px; width: 243px;"
                            />
                          </div>
                        </q-tooltip>
                      </td>
                      <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                      <td class="text-center">{{ row.sexe }}</td>
                      <td class="text-center">{{ row.etat_civil }}</td>
                      <td class="text-center">{{ row.nationalite }}</td>
                      <td class="text-center">{{ row.profession }}</td>
                      <td class="text-center">{{ row.type_piece }}</td>
                      <td class="text-center">{{ row.phone }}</td>
                      <td class="text-center">{{ row.relation }}</td>

                      <!-- ************************************* -->
                      <!-- *************** MENU    ************* -->
                      <!-- ************************************* -->

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
                          <q-item>
                            <q-item-section avatar>
                              <q-avatar color="blue-1">
                                <q-icon
                                  size="40px"
                                  name="img:statics/images/icone/avatar.png"
                                />
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label class="text-bold">{{row.nom}} {{row.postnom}} {{row.prenom}}</q-item-label>
                              <q-item-label caption>{{row.sexe}}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="selectedMandataire = row; isAdd = false; showDNewMandataire = true"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-pen"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Mise à jour des informations</q-item-section>
                          </q-item>

                          <q-item
                            clickable
                            v-ripple
                            v-close-popup
                            @click="supprimer(row)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                class="las la-trash-alt"
                                size="24px"
                                color="primary"
                              />
                            </q-item-section>
                            <q-item-section>Supprimer cet mandataire</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </tr>

                    <template v-if="mandataires.length === 0">
                      <tr class="panel-primary">
                        <td
                          :colspan="10"
                          class="text-center"
                        >
                          <nondata
                            icone="img:statics/images/icone/add_ligne.png"
                            btnLabel="Ajouter un mandataire"
                            title="Aucun mandataire  ajouté"
                            @actualiser="isAdd=true;selectedMandataire=null;showDNewMandataire= true"
                          />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nouvelMandataire
      v-model="showDNewMandataire"
      :selectedMandataire="selectedMandataire"
      :isAdd="isAdd"
      @onFinish="onDialogResult"
    />
    <selectMandataire
      v-model="showDlgExistMandataire"
      @onFinish="onOldMandataireSelected"
    />
  </div>
</template>

<script>
import nouvelMandataire from '../../mandataire/nouveau_mandataire.vue'
import selectMandataire from '../../mandataire/select_mandataire.vue'

export default {
  name: 'step_mandataire',
  data () {
    return {
      /* URLS AND  USER */
      URLS: {},

      showDNewMandataire: false,
      showDlgExistMandataire: false,
      isAdd: true,
      selectedMandataire: null
    }
  },
  props: ['value'],
  watch: {},
  components: {
    nouvelMandataire,
    selectMandataire
  },
  computed: {
    mandataires: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  beforeMount () {
    this.URLS = this.$helper.urls()
  },
  mounted () { },
  methods: {
    onOldMandataireSelected (e) {
      const index = this.mandataires.findIndex(v => v.id === e.id)
      if (index === -1) {
        this.selectedMandataire = e
        this.isAdd = true
        this.showDNewMandataire = true
      } else {
        this.$helper.showMessage('Ce mandataire existe déjà sur la liste')
      }
    },
    onDialogResult (row) {
      if (this.isAdd) {
        row.is_new = !row.id
        this.mandataires.push({ ...row })
      } else {
        row.is_update = row.is_new === false
        this.$set(this.mandataires, this.mandataires.indexOf(this.selectedMandataire), { ...row })
      }

      this.showDNewMandataire = false
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment retirer ce mandataire de la liste des mandataires de ce membre ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        this.mandataires.splice(this.mandataires.indexOf(row), 1)
        this.$helper.showMessage('Mandataire retiré avec succès', 1)
      })
    }
  }
}
</script>

<style>
</style>
