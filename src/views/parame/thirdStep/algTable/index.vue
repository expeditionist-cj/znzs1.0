<template>
  <div class="algTable-wrap">
    <div v-if="pointTitle" class="main-title">{{ pointTitle }}</div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :show-header="false"
      size="small"
    >
      <el-table-column
        align="center"
        prop="param_cn"
        label="参数名称"
        min-width="120"
      />
      <el-table-column align="center" prop="name" label="类型" min-width="220">
        <template slot-scope="scope">
          <el-radio-group
            v-model="scope.row.isBind"
            @change="change(scope.row.isBind, scope)"
          >
            <el-radio :label="1">绑定</el-radio>
            <el-radio :label="0">计算</el-radio>
            <el-radio :label="2">设定</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="绑定"
        min-width="300"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.singlePoint"
            clearable
            size="small"
            placeholder="请输入参数点名或设定值"
            @input="changeIpt(scope.row)"
          >
            <el-tooltip
              slot="append"
              class="item"
              effect="dark"
              content="点击校验"
              placement="right"
            >
              <el-button
                :loading="scope.row.loading"
                type="primary"
                round
                size="small"
                @click="validateSinglePoint(scope.row, scope.$index)"
              >{{ scope.row.loadingText }}</el-button>
            </el-tooltip>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="pointValue"
        label="值"
        min-width="160"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.pointValue"
            placeholder=""
            readonly
            :disabled="false"
            clearable
            size="small"
            :style="{ width: '100%' }"
          >
            <!-- <template slot="append" v-if="scope.row.dimension">{{
              scope.row.dimension
            }}</template> -->
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="is_show"
        label="是否显示"
        min-width="150"
      >
        <template slot-scope="scope">
          <span style="margin-right: 10px">显示：</span>
          <!-- <el-radio-group v-model="scope.row.is_show" size="small">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group> -->
          <el-switch
            v-model="scope.row.is_show"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            active-color="#69fff9"
            inactive-color="rgba(105, 255, 249, 0.1)"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="changeable"
        label="修改"
        min-width="150"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.isBind === 2">
            <span style="margin-right: 10px">修改：</span>
            <el-switch
              v-model="scope.row.changeable"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
              active-color="#69fff9"
              inactive-color="rgba(105, 255, 249, 0.1)"
              size="small"
            />
          </div>
          <div v-else />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="show_order"
        label="排序"
        min-width="160"
      >
        <template slot-scope="scope">
          <span style="margin-right: 10px">排序：</span>
          <el-input
            v-model.number="scope.row.show_order"
            placeholder="输入序号排序"
            type="number"
            size="small"
            :style="{ width: '70%' }"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 计算点详细信息 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dynamicValidateForm"
        :model="dynamicValidateForm"
        label-width="100px"
        size="small"
      >
        <!-- 动态增加 -->
        <el-row
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="index"
          :gutter="20"
        >
          <el-col :span="8">
            <el-form-item
              :label="'P' + (index + 0)"
              :prop="'domains[' + index + '].cn'"
              :rules="[
                { required: true, message: '请输入中文描述', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="domain.cn"
                placeholder="请输入中文描述"
                clearable
                :style="{ width: '100%' }"
                size="small"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label-width="0"
              :prop="'domains[' + index + '].en'"
              :rules="[
                { required: true, message: '请输入点名', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="domain.en"
                placeholder="请输入点名"
                clearable
                :style="{ width: '100%' }"
                size="small"
                @input="iptPoint"
              />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              label-width="0"
              :prop="'domains[' + index + '].value'"
              :rules="[
                { required: true, message: '请先校验', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="domain.value"
                clearable
                readonly
                size="small"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击验证"
              placement="top"
              size="small"
            >
              <el-button
                type="primary"
                icon="el-icon-check"
                circle
                size="small"
                @click="valMult(index)"
              />
            </el-tooltip>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              circle
              size="small"
              @click="addP"
            />
            <el-button
              type="primary"
              icon="el-icon-remove-outline"
              circle
              size="small"
              @click="delP(index)"
            />
          </el-col>
        </el-row>
        <el-form-item
          label="公式框"
          prop="formula"
          :rules="[{ required: true, message: '请输入公式', trigger: 'blur' }]"
        >
          <el-input
            v-model="dynamicValidateForm.formula"
            size="small"
            type="textarea"
            placeholder="请输入公式"
            clearable
            :autosize="{ minRows: 20, maxRows: 100 }"
            :style="{ width: '100%' }"
            @input="formulaIpt"
          />
        </el-form-item>

        <el-form-item size="small">
          <el-button
            size="small"
            :loading="loading"
            type="primary"
            @click="submitForm"
          >{{ loadingText }}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="resetForm"
          >重置</el-button>
          <el-button
            size="small"
            type="primary"
            @click="dialogVisible = !dialogVisible"
          >关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-divider />
  </div>
</template>

<script>
import { selectModelListThirdStep } from '@/api/modelnstanceBasicInfo'
import { mapState } from 'vuex' // 引入vuex state
import {
  validateSinglePoint,
  validateMtpPoints,
  queryByInstanceId
} from '@/api/alg'
let idx = 0
const isSave = false
// let this.calPointCarry = [];
export default {
  name: 'AlgTable',
  components: {},
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    calPointCarry: {
      type: Array,
      default: () => {
        return []
      }
    },
    pointTitle: {
      type: String,
      default: () => {
        return ''
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      title: '',
      dialogVisible: false,
      dynamicValidateForm: {
        domains: [
          {
            cn: '',
            en: '',
            value: ''
          }
        ],
        formula: '' // 公式
      },
      loading: false, // 公式验证loading
      loadingText: '校验'
    }
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
      modelCode: (state) => state.backend.modelCode,
      addThird: (state) => state.backend.addThird
    })
  },
  watch: {
    dialogVisible(value) {
      this.loadingText = '校验'
      if (!value) {
        const state = this.calPointCarry[idx] && this.calPointCarry[idx].state
        if (state != 0) {
          if (!this.calPointCarry[idx]) {
            this.calPointCarry[idx] = {}
          }
          this.tableData[idx].isBind = this.calPointCarry[idx].state
        } else {
          this.tableData[idx].isBind = this.calPointCarry[idx].state
        }
        this.dynamicValidateForm = {
          domains: [
            {
              cn: '',
              en: '',
              value: ''
            }
          ],
          formula: '' // 公式
        }
      }
    }
  },
  created() {
    // this.init();
  },
  mounted() {},
  methods: {
    // 更改绑定类型
    change(value, scope) {
      const index = scope.$index
      const name = this.tableData[index].param_cn
      this.title = name + '计算'
      idx = index
      if (value == 0) {
        this.dialogVisible = true
        if (!this.calPointCarry[idx]) {
          this.calPointCarry[idx] = {}
        }
        this.calPointCarry[idx].state = scope.row.isBind
        scope.row.loadingText = '校验'
        scope.row.singlePoint = ''
        scope.row.pointValue = ''
      } else {
        this.dialogVisible = false
        scope.row.loadingText = '校验'
        scope.row.singlePoint = ''
        scope.row.pointValue = ''
        if (!this.calPointCarry[idx]) {
          this.calPointCarry[idx] = {}
        }
        this.calPointCarry[idx].state = value
      }
    },

    // 添加参数
    addP() {
      this.dynamicValidateForm.domains.push({
        cn: '',
        en: '',
        value: ''
      })
    },
    // 删除参数
    delP(index) {
      const { domains } = this.dynamicValidateForm
      const length = domains.length
      if (length == 1) {
        return this.$message({
          message: '至少保留一个参数',
          type: 'warning'
        })
      }
      domains.splice(index, 1)
    },

    // 验证公式及测点的正确性
    submitForm() {
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.loadingText = '校验'
          const data = {
            jsScript: this.dynamicValidateForm.formula
          }
          const obj = {}
          this.dynamicValidateForm.domains.forEach((item, index) => {
            obj['P' + index] = item.value
          })
          // 验证
          validateMtpPoints({
            jsScript: this.dynamicValidateForm.formula,
            params: obj
          })
            .then((res) => {
              if (res.data.validated) {
                this.loading = false
                this.loadingText = '校验成功'
                this.tableData[idx].pointValue = res.data.value
                this.tableData[idx].loadingText = '修改'
                this.tableData[idx].isBind = 0
                this.tableData[
                  idx
                ].singlePoint = this.dynamicValidateForm.formula
                this.calPointCarry[idx] = {}
                this.calPointCarry[idx].data = JSON.parse(
                  JSON.stringify(this.dynamicValidateForm)
                ) // 缓存
                this.calPointCarry[idx].state = 0
              } else {
                this.loading = false
                this.loadingText = '失败'
                this.$message.error(res.data.value)
              }
            })
            .catch((e) => {
              this.loading = false
              console.log(e)
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['dynamicValidateForm'].resetFields()
    },
    // 校验单测点及修改
    validateSinglePoint(row, index) {
      console.log(row)
      if (
        !this.tableData[index].singlePoint &&
        this.tableData[index].isBind != 0
      ) {
        return this.$message.error('请输入参数点名或设定的值')
      }
      if (row.isBind == 2) {
        row.loadingText = '校验成功'
        return (this.tableData[index].pointValue = this.tableData[
          index
        ].singlePoint)
      }
      if (row.isBind == 0) {
        // 修改
        idx = index
        this.dialogVisible = true
        this.dynamicValidateForm = this.calPointCarry[index].data
      } else {
        const singlePoint = row.singlePoint
        row.loading = true
        row.loadingText = '校验'
        validateSinglePoint({
          pointCode: singlePoint
        })
          .then((res) => {
            const data = res.data
            if (data.validated) {
              row.loadingText = '校验成功'
              row.pointValue = data.value
            } else {
              row.loadingText = '校验失败'
            }
            row.loading = false
          })
          .catch((e) => {
            row.loading = false
          })
      }
    },

    // 验证多测点
    valMult(index) {
      const data = this.dynamicValidateForm.domains[index]
      if (!data.cn || !data.en) {
        return this.$message.error('请输入中文描述和点名')
      }
      validateSinglePoint({
        pointCode: data.en
      })
        .then((res) => {
          if (res.data.validated) {
            this.$message.success('验证成功')
            data.value = res.data.value
          } else {
            this.$message.error('验证失败')
            data.value = '验证失败'
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getData(type) {
      const arry = []
      let flag = true
      if (this.type != 'list') {
        this.tableData.forEach((item, index) => {
          const obj = {}
          obj.instance_id = this.addInstanceId
          obj.param_code = item.param_code
          obj.point_type = type
          obj.is_bind = item.isBind
          obj.is_show = item.is_show
          obj.changeable = item.changeable
          obj.show_order = item.show_order
          if (item.isBind == 0) {
            // 通过计算
            obj.cpt_exp = item.singlePoint
            obj.mtp_point = []
            this.calPointCarry[index].data.domains.forEach((ele, idx) => {
              const a = {}
              a['P' + idx] = ele.en
              a.name = ele.cn
              obj.mtp_point.push(a)
            })
            if (item.loadingText == '修改' || item.loadingText == '校验') {
              if (item.pointValue === '') {
                flag = false
                return false
              }
            }
          } else {
            // 直接绑定
            obj.single_point = item.singlePoint
            // 已校验的不用再校验
            if (item.loadingText == '校验' || item.loadingText == '修改') {
              if (
                item.singlePoint === '' ||
                item.singlePoint === undefined ||
                item.singlePoint === null ||
                item.pointValue === '' ||
                item.pointValue === undefined ||
                item.pointValue === null
              ) {
                flag = false
                return false
              }
            }
          }
          arry.push(obj)
        })
      } else {
        // 构造type == 'list' 上传参数
        const obj = {
          list: []
        }
        obj.type = this.type
        this.tableData.forEach((item, index) => {
          const o = {}
          if (!obj.param_code) {
            obj.param_cn = item.list_cn
            obj.param_code = item.list_code
          }
          o.instance_id = this.addInstanceId
          o.param_code = item.param_code
          o.param_cn = item.param_cn
          o.point_type = type
          o.is_bind = item.isBind
          o.is_show = item.is_show
          o.changeable = item.changeable
          o.show_order = item.show_order
          if (item.isBind == 0) {
            // 通过计算
            o.cpt_exp = item.singlePoint
            o.mtp_point = []
            this.calPointCarry[index].data.domains.forEach((ele, idx) => {
              const a = {}
              a['P' + idx] = ele.en
              a.name = ele.cn
              o.mtp_point.push(a)
            })
            if (item.loadingText == '修改') {
              if (item.pointValue === '') {
                flag = false
                return false
              }
            }
          } else {
            // 直接绑定
            o.single_point = item.singlePoint
            // 已校验的不用再校验
            if (item.loadingText == '校验' || item.loadingText == '修改') {
              if (
                item.singlePoint === '' ||
                item.singlePoint === undefined ||
                item.singlePoint === null ||
                item.pointValue === '' ||
                item.pointValue === undefined ||
                item.pointValue === null
              ) {
                flag = false
                return false
              }
            }
          }
          obj.list.push(o)
        })
        arry.push(obj)
      }
      if (!flag) {
        return false
      }
      return arry
    },
    changeIpt(row) {
      if (this.addThird) {
        row.loadingText = '校验'
        row.pointValue = ''
      }
    },
    // 计算点公式输入框
    formulaIpt() {
      this.tableData[idx].loadingText = '修改'
      row.pointValue = ''
    },
    // 计算点多点点位输入
    iptPoint() {
      this.tableData[idx].loadingText = '修改'
      row.pointValue = ''
    }
  }
}
</script>

<style scoped lang="scss">
.algTable-wrap {
}
</style>
<style lang="scss">
.algTable-wrap {
  .main-title {
    font-size: 14px;
    font-weight: bolder;
    margin: 10px 0;
  }
  .el-input-group__append {
    width: 58px;
    padding: 0;
  }
  .el-dialog__header {
    .el-dialog__title {
      color: #69fff9;
    }

    height: 0.6rem !important;
    line-height: 0.6rem;
    margin-bottom: 10px;
  }
}
</style>
