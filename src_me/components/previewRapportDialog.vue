<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card
      style="width: 1000px; max-width: 95vw;"
      v-if="document"
    >
      <q-card-section class="q-pa-none ">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">
          <div class="col">
            <div class="text-h6">{{document.name}}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              icon="las la-print"
              rounded
              size="sm"
              label="Imprimer le rapport"
              unelevated
              @click="imprimer()"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="blue-1"
              text-color="primary"
              icon="close"
              round
              size="sm"
              v-close-popup
              unelevated
            />
          </div>
        </div>
        <q-separator />
        <div style="height:80vh ;overflow:hidden">
          <iframe
            :src="document.url"
            title="RAPPORT"
            width="100%"
            height="100%"
            style="border:none;"
          ></iframe>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'previewDialog',
  data () {
    return {
      winPrint: null
    }
  },
  props: {
    value: Boolean,
    document: null
  },
  beforeMount () { },
  mounted: function () {
    if (this.user === null) {
      this.showDialog = false
    }
  },
  destroyed: function () {
  },
  watch: {
    showDialog (newValue, oldValue) {
      if (newValue) { }
    }
  },
  computed: {
    showDialog: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    imprimer () {
      this.winPrint = window.open(this.document.url, '', 'toolbar=0,scrollbars=0,status=0')
      this.winPrint.addEventListener('afterprint', this.afterPrint, false)
      this.winPrint.focus()
      this.winPrint.print()
    },
    afterPrint () {
      this.winPrint.close()
      this.winPrint.removeEventListener('afterprint', this.afterPrint, false)
    }
  }

}
</script>

<style lang="stylus"></style>
