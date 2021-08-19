<template>
  <div class="personInfoRow-wrap">
    <el-form ref="elForm" :model="formData" size="small" label-width="1rem">
      <el-row>
        <el-col :span="12">
          <el-form-item
            label-width="1.5rem"
            :label="formData.param_cn"
          >
            <el-input
              v-model="formData.param_val"
              placeholder="请输入数字"
              clearable
              readonly
              :style="{ width: '100%' }"
            >
              <template v-if="formData.dimension != null" slot="append">{{
                formData.dimension
              }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否更改"  v-if="formData.param_type == 'const'">
            <i
              v-if="formData.changeable"
              class="el-icon-circle-check"
              style="color: #08ef08"
            ></i>
            <i v-else class="el-icon-circle-close" style="color: red"></i>
          </el-form-item>

          <el-form-item
            label-width="0.4rem"
            prop="refExp"
            v-if="formData.param_type == 'list'"
          >
            <el-input
              v-model="formData.ref_exp"
              readonly
              clearable
              :style="{ minWidth: '3rem' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否显示" v-if="formData.param_type == 'const'">
            <i
              v-if="formData.is_show"
              class="el-icon-circle-check"
              style="color: #08ef08"
            ></i>
            <i v-else class="el-icon-circle-close" style="color: red"></i>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    formData: {
      type: Object,
      default() {
        return {
          dimension: "", // 单位
          param_cn: "",
          param_val: "",
          is_show: "",
          changeable: "",
          ref_exp:""
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
.personInfoRow-wrap {
  .el-divider--horizontal {
    margin-top: 0;
  }
  .el-form-item__label{
    width: 1.5rem!important;
    font-size: .14rem;
  }
  .el-form-item__content{
    margin-left: 1.5rem!important;
  }
}
</style>
