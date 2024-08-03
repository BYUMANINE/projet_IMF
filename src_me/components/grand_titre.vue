<template>
  <div>
    <div class="cont-grand-title text-bold text-left q-py-xs q-px-md">
      <span v-if="titre">{{titre}}</span>
      <slot name="titre" />
    </div>
    <q-separator />
  </div>
</template>

<script>
export default {
  name: 'grand_titre',
  props: {
    titre: {
      type: String,
      default: null
    }
  }
}
</script>

<style>
.cont-grand-title {
  height: 30px;
  width: 100%;
  background-color: white;
  color: #5764ec;
  position: relative;
  padding-left: 30px;
}

.cont-grand-title::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 10px;
  width: 10px;
  height: 10px;
  background: #5764ec;
  border-radius: 20px;
}
</style>
