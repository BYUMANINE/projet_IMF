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
              >MEMBRES DU GROUPE</div>
            </div>
            <div class="col-auto">
              <q-btn
                color="blue-1"
                text-color="primary"
                label="Ajouter un membre"
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
                      @click="isAdd=true;selectedMembre=null;showDNewMembre= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="add"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Créer un nouveau membre</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="showDlgExistMembre= true"
                    >
                      <q-item-section avatar>
                        <q-icon
                          class="las las la-history"
                          size="24px"
                          color="primary"
                        />
                      </q-item-section>
                      <q-item-section>Sélectionner un membre éxistant</q-item-section>
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
                      <th>CODE</th>
                      <th
                        style="width:20%"
                        class="text-left"
                      >NOM COMPLET</th>
                      <th class="text-center">SEXE</th>
                      <th class="text-center">ETAT CIVIL</th>
                      <th class="text-center">NATIONALITE</th>
                      <th class="text-center">FONCTION</th>
                      <th class="text-center">COMITE</th>
                      <th class="text-center">GESTIONNAIRE</th>
                    </tr>
                  </thead>

                  <tbody style="font-size:12px">
                    <tr
                      v-for="(row, index) in membres"
                      :key="index"
                      @dblclick="selectedMembre = row; isAdd = false; showDNewMembre = true"
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
                      <td class="text-center text-bold">{{ row.folio || 'Non défini' }} </td>
                      <td class="text-left text-bold bg-blue-1">{{ row.nom }} {{ row.postnom }} {{ row.prenom }}</td>
                      <td class="text-center">{{ row.sexe }}</td>
                      <td class="text-center">{{ row.etat_civil }}</td>
                      <td class="text-center">{{ row.nationalite }}</td>
                      <td class="text-center">{{ row.fonction }}</td>
                      <td class="text-center">{{ row.in_comite }}</td>
                      <td class="text-center">{{ row.is_gestionnaire }}</td>

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
                            @click="selectedMembre = row; isAdd = false; showDNewMembre = true"
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
                            <q-item-section>Supprimer cet membre</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </tr>

                    <template v-if="membres.length === 0">
                      <tr class="panel-primary">
                        <td
                          :colspan="9"
                          class="text-center"
                        >
                          <nondata
                            icone="img:statics/images/icone/add_ligne.png"
                            btnLabel="Ajouter un membre"
                            title="Aucun membre ajouté dans le groupe"
                            @actualiser="isAdd=true;selectedMembre=null;showDNewMembre= true"
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

    <nouveauMembre
      v-model="showDNewMembre"
      :selectedMembre="selectedMembre"
      :isAdd="isAdd"
      :user="user"
      @onFinish="onDialogResult"
    />

    <selectMembre
      v-model="showDlgExistMembre"
      @onFinish="onOldMembreSelected"
    />
  </div>
</template>

<script>
import nouveauMembre from '../../membre/nouveau_membre.vue'
import selectMembre from '../../membre/select_membre.vue'

export default {
  name: 'step_membre',
  data () {
    return {
      showDNewMembre: false,
      showDlgExistMembre: false,
      isAdd: true,
      selectedMembre: null
    }
  },
  props: ['value', 'user'],
  watch: {},
  components: {
    nouveauMembre,
    selectMembre
  },
  computed: {
    membres: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  mounted () { },
  methods: {
    onOldMembreSelected (e) {
      const index = this.membres.findIndex(v => v.id === e.id)
      if (index === -1) {
        this.selectedMembre = e
        this.isAdd = true
        this.showDNewMembre = true
      } else {
        this.$helper.showMessage('Ce membre existe déjà sur la liste')
      }
    },
    onDialogResult (row) {
      if (this.isAdd) {
        row.is_new = !row.id
        this.membres.push({ ...row })
      } else {
        row.is_update = row.is_new === false
        this.$set(this.membres, this.membres.indexOf(this.selectedMembre), { ...row })
      }

      this.showDNewMembre = false
    },
    supprimer (row) {
      this.$q.dialog({
        dark: this.$q.dark.isActive,
        title: 'Suppression en cours...',
        message: `Souhaitez-vous vraiment retirer ce membre de la liste des membres de ce groupe ?`,
        cancel: 'Annuler',
        ok: 'Oui',
        persistent: true
      }).onOk(() => {
        this.membres.splice(this.membres.indexOf(row), 1)
        this.$helper.showMessage('Membre retiré avec succès', 1)
      })
    }
  }
}
</script>

<style>
</style>
