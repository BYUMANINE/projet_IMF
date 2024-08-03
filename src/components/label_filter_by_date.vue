<template>
  <div
    class="col-auto text-center"
    v-if="filter!=null"
  >
    <div
      class=" bg-blue-1"
      style="border-radius:5px;border-left:4px solid #5586e6 "
    >
      <div class="row items-center">
        <div class="col text-left">
          <div
            class="q-pa-xs"
            v-if="filter==='from' && dateMin !==null"
          >
            <strong style="font-size:12px">
              <q-icon
                name="las la-calendar"
                size="20px"
              />
              Date : A partir de {{dateMin}}
            </strong>
          </div>

          <div
            class="q-pa-xs"
            v-if="filter==='between' && dateMin !==null && dateMax !==null"
          >
            <strong style="font-size:12px">
              <q-icon
                name="las la-calendar"
                size="20px"
              />
              Date : A partir de {{dateMin}} juqu'à {{dateMax}}
            </strong>
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            v-if="close"
            color="blue-2"
            text-color="primary"
            icon="close"
            flat
            unelevated
            round
            size="sm"
            @click="$emit('closeFiltre',true)"
            class="q-mx-md q-my-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'label_filter_by_date',
  props: {
    filter: {
      type: String,
      value: null
    },
    dateMin: {
      type: String,
      value: null
    },
    dateMax: {
      type: String,
      value: null
    },
    close: {
      type: Boolean,
      value: false
    }
  }

}
</script>

<style>
</style>
