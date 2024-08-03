<template>
  <div
    class="filter-style q-pa-sm"
    v-if="search"
  >
    <strong>Recherche :
      <q-icon
        name="las la-filter"
        size="18px"
      />
    </strong>
    <span
      v-for="(item,index) in search.filters"
      :key="index"
    >{{item}}</span> | <strong>
      <q-icon
        name="las la-search"
        size="18px"
      />
      {{search.search}}
    </strong>
  </div>
</template>

<script>
export default {
  name: 'searchResult',
  props: {
    search: {}
  }
}
</script>

<style >
.filter-style span {
  position: relative;
  padding-left: 20px;
  font-size: 13px;
}
.filter-style span::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 10px;
  height: 10px;
  background-color: #5764ec;
  border-radius: 20px;
}
</style>
