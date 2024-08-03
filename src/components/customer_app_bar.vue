<template>
  <div
    :class="`row bg-font ${contentClasse}`"
    :style="`position:sticky;top:55px;z-index:1000; ${contentStyle}`"
  >
    <div class="col">
      <div
        class="panel-primary ba"
        :style="contentStyle2"
      >
        <q-item>
          <q-item-section
            v-if="showBackBtn"
            avatar
          >
            <q-btn
              rounded
              unelevated
              text-color="blue"
              style="background-color:rgba(87,100,236,.1)"
              @click="()=>this.$router.go(-1)"
              size="12px"
              class="text-bold"
              no-caps
            >
              <q-icon
                class="las la-chevron-circle-left q-mr-sm"
                size="16px"
              />
              Retour
            </q-btn>

          </q-item-section>
          <q-item-section>
            <q-item-label
              class="text-bold text-uppercase"
              style="color:gray"
              lines="1"
            >
              <span v-if="user && user.default_fonction">{{user.default_fonction.designation}} - </span>
              <span v-if="option">{{option}}</span>
              <span
                class="text-blue"
                v-if="selected"
              > - {{selected}}</span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <slot />
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'appbarcustomer',
  props: {
    option: {
      type: String,
      default: ''
    },
    user: Object,
    selected: {
      type: String,
      default: ''
    },
    showBackBtn: {
      type: Boolean,
      default: true
    },
    contentClasse: {
      type: String,
      default: 'q-pt-md q-mb-md'
    },
    contentStyle: {
      type: String,
      default: ''
    },
    contentStyle2: {
      stype: String,
      default: ''
    }
  }
}
</script>

<style>
</style>
