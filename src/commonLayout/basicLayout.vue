/** 基础布局：上、中、下 */
<template>
  <div class="basicLayout-wrap">
    <el-card class="box-card" shadow="hover">
      <div class="basicLayout-header">
        <slot name="header"></slot>
      </div>
      <div class="basicLayout-main">
        <slot name="main"></slot>
      </div>
      
    </el-card>
    <back-to-top :custom-style="customStyleBackToTop" :visibility-height="100" :back-position="0" transition-name="fade" />
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop';
import {customStyleBackToTop} from "@/globalVariables/index"
export default {
  props: {},
  data() {
    return {
      customStyleBackToTop:customStyleBackToTop
    };
  },
  components: {BackToTop},
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.basicLayout-wrap {
  height: 100%;
  padding: 0.2rem;
  background: url("../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .box-card {
     height: 100%;
  }
  // padding: 10px;
  .basicLayout-header {
    // height: 100px;
    margin-bottom: 10px;
    margin-top: -20px;
  }
  .basicLayout-main {
  }
  .basicLayout-footer {
    margin-top: 10px;
    
  }
  .basicLayoutPage-footer{
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,.45);
    // line-height: 20px;
    margin: 12px 0;
    text-align: center
  }
}
</style>
