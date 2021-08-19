<template>
  <div class="curve-wrap" style="width:100%;height:100%">
      <v-chart  style="width:100%;height: 6rem" autoresize :options="options" />
  </div>
</template>

<script>
export default {
  name: "curve",
  props:['options']
};
</script>

<style lang="scss">
.curve-wrap {
  height: 100%;
}
</style>
