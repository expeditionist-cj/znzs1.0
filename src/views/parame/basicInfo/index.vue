<template>
  <div v-loading="loading" class="basicInfo">
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="mini"
        label-width="100px"
      >
        <el-col :span="12">
          <el-form-item label="模型分类" prop="modelType">
            <el-input
              v-model="formData.modelType"
              placeholder="请输入单行文本模型分类"
              readonly
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模型名称" prop="modeList">
            <el-input
              v-model="formData.modeList"
              placeholder="请输入模型"
              readonly
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="plantList">
            <el-input
              v-model="formData.plantList"
              placeholder="请输入项目名称"
              readonly
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showNormalModel">
          <el-form-item label="机组名称" prop="unitList">
            <el-input
              v-model="formData.unitList"
              placeholder="请输入机组名称"
              show-word-limit
              readonly
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="showNormalModel">
          <el-form-item label="cron" prop="cron">
            <el-input
              v-model="formData.cron"
              placeholder="请输入提示建议间隔"
              readonly
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { mapState } from "vuex"; // 引入vuex state
import { selectInstance } from "@/api/modelnstanceBasicInfo";
export default {
  components: {},
  props: {
    showNormalModel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: {
        modelType: undefined,
        modeList: undefined,
        plantList: undefined,
        unitList: undefined,
        cron: undefined
      },
      rules: {
        modelType: [],
        modeList: [],
        plantList: [],
        unitList: [],
        cron: []
      },
      loading:false
    };
  },
  computed: {
    ...mapState({
      addInstanceId: state => state.backend.addInstanceId
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true;
      selectInstance({ id: this.addInstanceId }).then(res => {
          let data = res.data[0];
          this.formData.modelType = data.typeName;
          this.formData.modeList = data.shortName;
          this.formData.plantList = data.plantCn;
          this.formData.unitList = data.fixCn;
          this.formData.cron = data.cronExp;
          this.timer = setTimeout(()=>{
            this.loading = false;
          },500)
          
        }).catch(e=>{
          this.loading = false;
        })
    }
  },
  destroyed(){
    clearTimeout(this.timer);
  }
};
</script>
<style lang="scss">
.basicInfo{
  .el-form-item__label{
    width: 1rem!important;
    font-size: .14rem!important;
  }
  .el-form-item__content{
    margin-left: 1rem!important;
  }
}
</style>
