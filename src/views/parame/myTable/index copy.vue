<template>
  <div class="myTable-wrap" v-loading = "loading">
    <el-table show-header :data="tableData" border style="width: 100%">
      <el-table-column
        prop="param_cn"
        label="参数名称"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column show prop="name" label="类型" width="180" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title="详情"
            width="600"
            trigger="hover"
            v-if="!scope.row.is_bind"
          >
            <el-card shadow="never">
              <!-- 参数描述 -->
              <el-form
                :model="scope.row.dynamicValidateForm"
                ref="dynamicValidateForm"
                label-width="100px"
              >
                <!-- 动态增加 -->
                <el-row
                  :gutter="20"
                  v-for="(domain, index) in scope.row.dynamicValidateForm.domains"
                  :key="index"
                >
                  <el-col :span="12">
                    <el-form-item
                      :label="'P' + (index + 0)"
                      :prop="'domains[' + index + '].cn'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入中文描述',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-input
                        v-model="domain.cn"
                        placeholder="请输入中文描述"
                        clearable
                        readonly
                        :style="{ width: '100%' }"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      label-width="0"
                    >
                      <el-input
                        v-model="domain.en"
                        placeholder="请输入点名"
                        readonly
                        clearable
                        :style="{ width: '100%' }"
                      ></el-input>
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :span="6">
                    <el-form-item
                      label-width="0"
                      :prop="'domains[' + index + '].value'"
                      :rules="[
                        { required: true, message: '请先校验', trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="domain.value"
                        clearable
                        readonly
                        :style="{ width: '100%' }"
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-form-item
                  label="公式框"
                >
                  <el-input
                    v-model="scope.row.dynamicValidateForm.formula"
                    type="textarea"
                    placeholder="请输入公式"
                    readonly
                    clearable
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-card>
            <span slot="reference" style="cursor:pointer"
              >计算 <i class="el-icon-view" style="color: #f70527"></i
            ></span>
          </el-popover>
          <span v-else>绑定</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="single_point"
        label="绑定点"
        align="center"
        min-width="200"
      >
      </el-table-column>
      <!-- <el-table-column prop="address" label="值" align="center">
      </el-table-column> -->
      <el-table-column prop="address" label="是否显示" align="center">
        <template slot-scope="scope">
          <i
            v-if="!scope.row.is_show"
            class="el-icon-circle-check"
            style="color: #08ef08"
          ></i>
          <i v-else class="el-icon-circle-close" style="color: red"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex"; // 引入vuex state
import { queryByInstanceId } from "@/api/alg";
export default {
  props: {
    type: {
      type: String,
      default: "alg" // 默认算法用点
    }
  },
  data() {
    return {
      tableData: [],
      formData: {},
      loading: false,
    };
  },
  components: {},
  computed: {
    ...mapState({
      addInstanceId: state => state.dashboard.addInstanceId
    })
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    init() {
      this.loading = true
      queryByInstanceId({ instanceId: this.addInstanceId }).then(res => {
        let data = res.data;
        data = data.filter(item => {
          item.dynamicValidateForm = {
            domains: [],
            formula: ""
          };
          if (!item.is_bind) {
            item.dynamicValidateForm.formula = item.cpt_exp;
            item.dynamicValidateForm.domains = JSON.parse(item.mtp_points);
            let arry = [];
            item.dynamicValidateForm.domains.forEach((ele,idx)=>{
                let obj = {};
                obj.cn = ele.name;
                obj.en = ele['P'+idx];
                arry.push(obj);
            })
            item.dynamicValidateForm.domains = arry;
          }
          return item.point_type == this.type;
        });

        this.tableData = data;
        this.timer = setTimeout(()=>{
            this.loading = false;
          },500)
      }).catch(e=>{
        this.loading = false;
      });
    }
  },
  destroyed(){
    clearTimeout(this.timer);
  }
};
</script>

<style scoped lang="scss">
.myTable-wrap {
}
</style>
