<template>
  <div :class="className">
    <small class="text-bold">
      <div class="row items-center">
        <div class="col">
          <slot />
          <span
            class="text-red q-ml-sm"
            style="font-size:15px"
          >{{_required ? '*' : ''}}</span>
        </div>
        <div
          class="col-auto q-pr-sm"
          v-if="info"
        >
          <q-icon
            name="las la-info-circle"
            size="15px"
            color="primary"
          >
            <q-tooltip
              content-class="bg-white text-black"
              content-style="width:160px;border:1px solid rgba(0,0,0,.2);font-size:11px;border-left:2px solid #5764ff"
            >
              {{info}}
            </q-tooltip>
          </q-icon>
        </div>
      </div>
    </small>
  </div>
</template>

<script>
export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'q-mt-xs q-mb-xs'
    },
    info: {
      type: String,
      default: null
    }
  },
  computed: {
    _required () {
      return this.required
      // return (!this.$helper.isNotEmpty(this.required) && this.required === true)
    }
  }

}
</script>

<style>
</style>
