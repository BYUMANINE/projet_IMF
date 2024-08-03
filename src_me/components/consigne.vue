<template>
  <div
    class="ba overflow-hidden"
    style="border-radius:0 "
  >
    <q-item
      class="bg-grey-2  q-px-sm "
      style="border-left:3px solid #5764ec"
    >
      <q-item-section avatar>
        <q-icon
          :name="icon"
          color="primary"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label
          v-if="!!title"
          class="text-bold"
        >{{title}}</q-item-label>
        <q-item-label
          caption
          class="text-grey-8"
        >
          <span v-if="!!description">{{description}}</span>
          <slot />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'consigne',
  props: {
    icon: {
      type: String,
      default: 'info'
    },
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    }
  }
}
</script>

<style>
</style>
