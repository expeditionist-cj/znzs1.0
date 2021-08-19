<template>
  <div class="firstStep-wrap">
      <BasicLayout>
        <div slot="header">
          <el-steps :active="0" finish-status="success" simple>
            <el-step title="基本信息" icon="el-icon-edit"></el-step>
            <el-step
              title="基础设置"
              icon="el-icon-s-custom"
            ></el-step>
            <el-step title="详细设置" icon="el-icon-s-tools"></el-step>
          </el-steps>
        </div>
        <div slot="main">
            <InputBasicInfo />
        </div>
      </BasicLayout>
  </div>
</template>

<script>
import BasicLayout from "@/commonLayout/basicLayout";
import InputBasicInfo from "./infoBasicInfo/index";
export default {
  name: "FirstStep",
  props: {},
  data() {
    return {};
  },
  components: { BasicLayout, InputBasicInfo },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.firstStep-wrap {
}
</style>
