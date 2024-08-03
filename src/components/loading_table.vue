<template>
  <tbody v-if="loading && (data  && data.length===0)">
    <tr class="panel-primary">
      <td
        :colspan="13"
        class="text-center"
      >
        <div class="q-pa-xl">
          <q-spinner-ios
            color="primary"
            size="2em"
          />
          <div class="q-mt-md"><strong>Chargement...</strong></div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'loadingTable',
  props: ['loading', 'data']
}
</script>

<style>
</style>
