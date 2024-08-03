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
              >HERITIERS DU COMPTE</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Ajouter un heritier"
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
                      @click="isAdd=true;selectedHeritier=null;showDNewHeritier= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="add"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Créer un nouvel heritier</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="showDlgExistHeritier= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          class="las la-history"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Sélectionner un heritier éxistant</q-item-section>
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
                      <th class="text-center">DATE NAISS.</th>
                      <th class="text-center">LIEU NAISS.</th>
                      <th class="text-center">ETAT CIVIL</th>
                      <th class="text-center">NATIONALITE</th>
                      <th class="text-center">PROFESSION</th>
                      <th class="text-center">ADRESSE</th>
                      <th class="text-center">TELEPHONE</th>
                      <th class="text-center">EMAIL</th>

                    </tr>
                  </thead>

                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row, index) in heritiers"
                      :key="index"
                      @dblclick="selectedHeritier = row; isAdd = false; showDNewHeritier = true"
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
                      <td class="text-center">{{ row.date_naissance }}</td>
                      <td class="text-center">{{ row.lieu_naissance }}</td>
                      <td class="text-center">{{ row.etat_civil }}</td>
                      <td class="text-center">{{ row.nationalite  || 'Non définie'}}</td>
                      <td class="text-center">{{ row.profession || 'Non définie' }}</td>
                      <td class="text-center">{{ row.adresse || 'Non définie' }}</td>
                      <td class="text-center">{{ row.phone || 'Non définie' }}</td>
                      <td class="text-center">{{ row.email || 'Non définie' }}</td>

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
                            @click="selectedHeritier = row; isAdd = false; showDNewHeritier = true"
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
                            <q-item-section>Supprimer cet heritier</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </tr>

                    <template v-if="heritiers.length === 0">
                      <tr class="panel-primary">
                        <td
                          :colspan="11"
                          class="text-center"
                        >
                          <nondata
                            icone="img:statics/images/icone/add_ligne.png"
                            btnLabel="Ajouter un heritier"
                            title="Aucun heritier  ajouté"
                            @actualiser="isAdd=true;selectedHeritier=null;showDNewHeritier= true"
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

    <nouvelHeritier
      v-model="showDNewHeritier"
      :selectedHeritier="selectedHeritier"
      :isAdd="isAdd"
      @onFinish="onDialogResult"
    />

    <selectHeritier
      v-model="showDlgExistHeritier"
      @onFinish="onOldHeritierSelected"
    />

  </div>
</template>

<script>
import nouvelHeritier from '../../heritier/nouvel_heritier.vue'
import selectHeritier from '../../heritier/select_heritier.vue'

export default {
  name: 'step_heritier',
  data () {
    return {
      showDNewHeritier: false,
      showDlgExistHeritier: false,

      isAdd: true,
      selectedHeritier: null
    }
  },
  props: ['value'],
  watch: {},
  components: {
    nouvelHeritier,
    selectHeritier
  },
  computed: {
    heritiers: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  mounted () { },
  methods: {
    onOldHeritierSelected (e) {
      const index = this.heritiers.findIndex(v => v.id === e.id)
      if (index === -1) {
        this.selectedHeritier = e
        this.isAdd = true
        this.showDNewHeritier = true
      } else {
        this.$helper.showMessage('Cet heritier existe déjà sur la liste')
      }
    },
    onDialogResult (row) {
      if (this.isAdd) {
        row.is_new = !row.id
        this.heritiers.push({ ...row })
      } else {
        row.is_update = row.is_new === false
        this.$set(this.heritiers, this.heritiers.indexOf(this.selectedHeritier), { ...row })
      }

      this.showDNewHeritier = false
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment retirer cet heritier de la liste des heritiers de ce membre ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        this.heritiers.splice(this.heritiers.indexOf(row), 1)
        this.$helper.showMessage('Heritier retiré avec succès', 1)
      })
    }
  }
}
</script>

<style>
</style>
