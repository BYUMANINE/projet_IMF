<template>

  <q-tooltip
    anchor="center left"
    self="center left"
    :offset="[0, 0]"
    transition-show="flip-right"
    transition-hide="fade"
    content-class="tooltip-drawer bg-grey-8"
    content-style="overflow:hidden"
  >
    <div class="q-pa-sm">
      <q-icon
        :class="`${style_class} q-mr-sm`"
        size="20px"
      />
      <span style="font-size:12px">
        {{titre}}
      </span>
    </div>
  </q-tooltip>
</template>

<script>
export default {
  name: 'tooltipdrawer',
  props: ['style_class', 'titre']
}
</script>

<style lang="stylus" >
.tooltip-drawer {
  height: 48px;
  border-radius: 0;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}
</style>
