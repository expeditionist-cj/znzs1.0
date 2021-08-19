<template>
  <div class="bg-wrap" 
  
  :class="custormClass">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    custormClass:{
      type: String,
      default: ""
    },
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.bg-wrap{
  background-image: url('../../../assets/dashboard/bg-s.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

</style>
