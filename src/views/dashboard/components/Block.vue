<template>
  <div class="block">
    <BgWrap>
      <div class="content">
        <div class="title">
           <slot name="title"></slot>
        </div>
        <div class="detail">
          <slot name="content"></slot>
        </div>
      </div>
    </BgWrap>
  </div>
</template>

<script>
import BgWrap from "./BgWrap";
export default {
  props: {},
  data() {
    return {};
  },
  components: { BgWrap },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.block {
  width: 100%;
  height: 1.74rem; 
  .bg-wrap {
    width: 100%;
    height: 100%;
  }
  .content {
    height: 100%;
    padding-top: 0.12rem;
    .title {
      padding-left: 0.2rem;
      font-size: 0.16rem;
      font-weight: 500;
      color: rgba(105, 255, 249, 1);
    }
     
  }
}
</style>