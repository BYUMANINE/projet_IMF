<template>
  <div
    class="row"
    v-if="loading"
  >
    <div class="col">
      <q-linear-progress
        indeterminate
        color="blue"
        size="3px"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'linearLoading',
  props: ['loading']
}
</script>

<style>
</style>
