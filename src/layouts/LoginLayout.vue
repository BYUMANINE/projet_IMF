<template class="q-pa-none q-ma-none">
  <div class="bg-white q-pa-none q-ma-none">
    <div class="transp q-pa-none q-ma-none"></div>

    <!-- style="background-image: url('../statics/images/autres/bc.jpg')" -->
    <!-- hHh Lpr lff  -->

    <q-layout class="q-pa-none q-ma-none">
      <q-page-container class="q-pa-none q-ma-none">
        <router-view class="q-pa-none q-ma-none" />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'LoginLayout',

  data () {
    return {

    }
  },
  computed: {

  }

}
</script>

<style lang="stylus" scoped>
.bc-style
  position relative

.transp
  position absolute
  left 0
  right 0
  bottom 0
  top 0
  // background-color: rgba(0, 0, 0, 0.4);
  filter blur(7px) !important
  background-size 100% 100%
</style>
