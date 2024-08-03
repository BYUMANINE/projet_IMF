<template>
  <div
    :class="`q-mb-md panel-primary bb menu-options ${contentClass}`"
    :style="contentStyle"
  >
    <div
      :class="`row no-wrap items-center ${$q.screen.lt.sm?'q-gutter-xs':'q-gutter-sm'}`"
      style="overflow:auto;position:relative"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contentClass: {
      type: String,
      default: ''
    },
    contentStyle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
</style>
