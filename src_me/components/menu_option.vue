<template>
  <div class="col-auto  text-center">
    <q-btn
      :disable="disable"
      flat
      no-caps
      @click="$emit('option-clicked',true)"
      class="relative-position"
    >
      <div class="col-12">
        <q-img
          :src="`statics/images/icone/${icon}`"
          spinner-color="primary"
          :style="$q.screen.lt.sm ? 'height: 20px; max-width: 20px' : 'height: 24px; max-width: 24px'"
          spinner-size="15px"
          transition="scale"
        />
      </div>
      <small :style="$q.screen.lt.sm ? 'font-size:11px' : 'font-size:11.5px'">{{text}}</small>
      <slot />
      <q-tooltip v-if="tooltip">
        {{tooltip}}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'menu_option',
  props: {
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    tooltip: {
      type: String,
      default: null
    },
    disable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
