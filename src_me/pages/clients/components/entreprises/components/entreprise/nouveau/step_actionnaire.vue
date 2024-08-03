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
              >ACTIONNAIRES DE L'ENTREPRISE</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Ajouter un actionnaire"
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
                      @click="isAdd=true;selectedActionnaire=null;showDNewActionnaire= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="add"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Créer un nouvel actionnaire</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="showDlgExistActionnaire= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          class="las la-history"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Sélectionner un actionnaire éxistant</q-item-section>
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
                      <th
                        style="width:20%"
                        class="text-left"
                      >NOM COMPLET</th>
                      <th class="text-center">SEXE</th>
                      <th class="text-center">ETAT CIVIL</th>
                      <th class="text-center">NATIONALITE</th>
                      <th class="text-center">PROFESSION</th>
                      <th class="text-center">PIECE</th>
                      <th class="text-center">MENDATAIRE</th>
                      <th class="text-center">RESPONSABLE</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row, index) in actionnaires"
                      :key="index"
                      @dblclick="selectedActionnaire = row; isAdd = false; showDNewActionnaire = true"
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
                      <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                      <td class="text-center">{{ row.sexe }}</td>
                      <td class="text-center">{{ row.etat_civil }}</td>
                      <td class="text-center">{{ row.nationalite }}</td>
                      <td class="text-center">{{ row.profession }}</td>
                      <td class="text-center">{{ row.type_piece }}</td>
                      <td class="text-center">{{ row.is_mandataire }}</td>
                      <td class="text-center">{{ row.is_responsable }}</td>

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
                            @click="selectedActionnaire = row; isAdd = false; showDNewActionnaire = true"
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
                            <q-item-section>Supprimer cet actionnaire</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </tr>

                    <template v-if="actionnaires.length === 0">
                      <tr class="panel-primary">
                        <td
                          :colspan="9"
                          class="text-center"
                        >
                          <nondata
                            icone="img:statics/images/icone/add_ligne.png"
                            btnLabel="Ajouter un actionnaire"
                            title="Aucun actionnaire  ajouté"
                            @actualiser="isAdd=true;selectedActionnaire=null;showDNewActionnaire= true"
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

    <nouvelActionnaire
      v-model="showDNewActionnaire"
      :selectedActionnaire="selectedActionnaire"
      :isAdd="isAdd"
      @onFinish="onDialogResult"
    />

    <selectActionnaire
      v-model="showDlgExistActionnaire"
      @onFinish="onOldActionnaireSelected"
    />
  </div>
</template>

<script>
import nouvelActionnaire from '../../actionnaire/nouvel_actionnaire.vue'
import selectActionnaire from '../../actionnaire/select_actionnaire.vue'

export default {
  name: 'step_actionnaire',
  data () {
    return {
      showDNewActionnaire: false,
      showDlgExistActionnaire: false,
      isAdd: true,
      selectedActionnaire: null

    }
  },
  props: ['value'],
  watch: {},
  components: {
    nouvelActionnaire,
    selectActionnaire
  },
  computed: {
    actionnaires: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  mounted () { },
  methods: {
    onOldActionnaireSelected (e) {
      const index = this.actionnaires.findIndex(v => v.id === e.id)
      if (index === -1) {
        this.selectedActionnaire = e
        this.isAdd = true
        this.showDNewActionnaire = true
      } else {
        this.$helper.showMessage('Cet actionnaire existe déjà sur la liste')
      }
    },
    onDialogResult (row) {
      if (this.isAdd) {
        row.is_new = !row.id
        this.actionnaires.push({ ...row })
      } else {
        row.is_update = row.is_new === false
        this.$set(this.actionnaires, this.actionnaires.indexOf(this.selectedActionnaire), { ...row })
      }

      this.showDNewActionnaire = false
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment retirer cette actionnaire de la liste des actionnaires de cette entreprise ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        this.actionnaires.splice(this.actionnaires.indexOf(row), 1)
        this.$helper.showMessage('Actionnaire retiré avec succès', 1)
      })
    }
  }
}
</script>

<style>
</style>
