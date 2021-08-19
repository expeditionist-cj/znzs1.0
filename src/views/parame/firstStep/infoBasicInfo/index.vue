<template>
  <div
    v-loading="formLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="12">
          <el-form-item label="模型分类" prop="modelType">
            <el-select
              v-model="formData.modelType"
              placeholder="请选择下拉选择模型分类"
              clearable
              :style="{ width: '100%' }"
              @change="formData.modeList = ''"
            >
              <el-option
                v-for="(item, index) in modelTypeOptions"
                :key="index"
                :label="item.type_name"
                :value="item.type_code"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="模型名称" prop="modeList">
            <el-select
              v-model="formData.modeList"
              placeholder="请选择下拉选择模型"
              clearable
              :style="{ width: '100%' }"
              @change="changeModel(formData.modeList, modeListOptions)"
            >
              <el-option
                v-for="(item, index) in modeListOptions"
                :key="index"
                :label="item.short_name"
                :value="item.model_code"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目名称" prop="plantList">
            <el-select
              v-model="formData.plantList"
              placeholder="请选择下拉选择项目名称"
              clearable
              :style="{ width: '100%' }"
              @change="formData.unitList = ''"
            >
              <el-option
                v-for="(item, index) in plantListOptions"
                :key="index"
                :label="item.name"
                :value="item.orgCode"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="deviceShow" :span="12">
          <el-form-item label="机组名称" prop="unitList">
            <el-select
              v-model="formData.unitList"
              placeholder="请选择下拉选择机组名称"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in unitListOptions"
                :key="index"
                :label="item.deviceName"
                :value="item.deviceCode"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 反应器 -->
        <el-col v-if="rectorShow" :span="12">
          <el-form-item label="反应器" prop="sub_fix_code">
            <!-- <el-input
              placeholder="请输入一位数字或者单个字母"
              v-model="formData.sub_fix_code"
            > -->
            <el-select
              v-model="formData.sub_fix_code"
              placeholder="请选择下拉选择机组名称"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in subOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <template slot="append">侧</template> -->
            <!-- </el-input> -->
          </el-form-item>
        </el-col>
        <!-- cron表达式 -->
        <el-col v-if="cronShow" :span="12">
          <el-form-item label="cron表达式" prop="cron">
            <el-input
              v-model="formData.cron"
              placeholder="请输入cron表达式"
              clearable
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item size="large">
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              :loading="loading"
              @click="submitForm"
            >提交</el-button>
            <el-button
              size="small"
              icon="el-icon-circle-close"
              type="primary"
              @click="resetForm"
            >重置</el-button>
            <el-button
              size="small"
              icon="el-icon-back"
              type="primary"
              @click="goInstanceList"
            >返回</el-button>
            <el-button
              v-if="addFirst"
              size="small"
              icon="el-icon-right"
              type="primary"
              @click="goAhead"
            >前进</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex' // 引入vuex state
import {
  selectModelType,
  selectModelList,
  selectPlantCode,
  selectUnitCode,
  saveInstanceList,
  selectInstance,
  updateInstance
} from '@/api/modelnstanceBasicInfo'
import _ from 'lodash'
import { CRON_EXPE } from '@/globalVariables/index'
let _this = null
export default {
  name: 'InputBasicInfo',
  components: {},
  props: [],
  data() {
    return {
      formData: {
        modelType: undefined,
        modeList: undefined,
        plantList: undefined,
        unitList: undefined,
        cron: undefined,
        sub_fix_code: undefined
      },
      rules: {
        modelType: [
          {
            required: true,
            message: '请选择下拉选择模型分类',
            trigger: 'change'
          }
        ],
        modeList: [
          {
            required: true,
            message: '请选择下拉选择模型',
            trigger: 'change'
          }
        ],
        plantList: [
          {
            required: true,
            message: '请选择下拉选择项目名称',
            trigger: 'change'
          }
        ],
        unitList: [
          {
            required: true,
            message: '请选择下拉选择机组名称',
            trigger: 'change'
          }
        ],
        sub_fix_code: [
          {
            required: true,
            message: '只能输入一位数字或者单个字母',
            trigger: 'blur'
          }
        ],
        cron: [
          {
            required: true,
            message: '请输入cron表达式',
            trigger: 'blur'
          }
        ]
      },
      subOptions: [
        {
          label: 'A侧',
          value: 'A'
        },
        {
          label: 'B侧',
          value: 'B'
        }
      ],
      modelTypeOptions: [],
      modeListOptions: [],
      plantListOptions: [],
      unitListOptions: [],
      loading: false,
      formLoading: false,
      rectorShow: false,
      cronShow: true,
      deviceShow: true
    }
  },
  computed: {
    ...mapState({
      isChangeInstance: (state) => state.backend.isChangeInstance,
      addInstanceId: (state) => state.backend.addInstanceId,
      addFirst: (state) => state.backend.addFirst,
      addSecend: (state) => state.backend.addSecend
    })
  },
  watch: {
    'formData.modelType': {
      handler(modelType) {
        selectModelList({ modelType: modelType }).then((res) => {
          const data = res.data
          this.modeListOptions = data
        })
      }
    },
    'formData.plantList': {
      handler(plant) {
        selectUnitCode({ plant }).then((res) => {
          const data = res.data
          this.unitListOptions = data
        })
      }
    }
  },
  created() {},
  mounted() {
    this.init()
    _this = this
    window.vue = this
  },
  destroyed() {},
  methods: {
    // 初始化
    async init() {
      // 查询模型分类
      await selectModelType().then((res) => {
        const data = res.data
        this.modelTypeOptions = data
      })
      // 查询电厂列表
      await selectPlantCode().then((res) => {
        const data = res.data
        this.plantListOptions = data
      })
      // 查询模型实例
      if (this.addFirst) {
        this.formLoading = true
        selectInstance({ id: this.addInstanceId })
          .then((res) => {
            const data = res.data[0]
            this.formData.modelType = data.typeCode
            this.formData.modeList = data.modelCode
            this.formData.plantList = data.plantCode
            this.formData.unitList = data.fixCode
            this.formData.cron = data.cronExp
            this.formData.sub_fix_code = data.subFixCode
            this.algType = data.algType
            if (data.subFixCode) {
              this.rectorShow = true
            }
            if (data.algType == 2) {
              this.cronShow = false
            }
            if (data.istObj == 'plant') {
              this.deviceShow = false
            }
            this.formLoading = false
          })
          .catch((e) => {
            this.loading = false
          })
      }
    },
    submitForm() {
      this.$refs['elForm'].validate((valid) => {
        if (!valid) return
        // TODO 提交表单
        this.loading = true
        const data = {}
        data.plantCode = this.formData.plantList // 电厂code
        const plantCn = _.find(this.plantListOptions, (item) => {
          return item.orgCode == this.formData.plantList
        })
        data.plantCn = plantCn.name // 电厂中文名称
        data.modelCode = this.formData.modeList // 模型编码
        data.fixCode = this.formData.unitList // 机组编码
        const fixCn = _.find(this.unitListOptions, (item) => {
          return item.deviceCode == this.formData.unitList
        })
        if (fixCn) {
          data.fixCn = fixCn.deviceName // 机组中文名称
        }

        data.remark = ''
        data.cronExp = this.formData.cron // cron 表达式
        // 组合反应器
        data.subFixCode = this.formData.sub_fix_code
        data.subFixCn = this.formData.sub_fix_code
          ? ''
          : this.formData.sub_fix_code + '侧反应器'
        // algType 区别是否传后端验证cron表达式
        data.algType = this.algType
        if (this.addFirst) {
          data.id = this.addInstanceId
          // 更新
          updateInstance(data)
            .then((res) => {
              const code = res.code
              const data = res.data
              if (code == 0 && data == true) {
                this.loading = false
                this.$alert('进入基础设置', '更新成功', {
                  confirmButtonText: '确定',
                  type: 'success',
                  showClose: false,
                  callback(action) {
                    // _this.$store.commit("backend/CHANGE_SHOW", "SecendStep");
                    _this.goAhead()
                  }
                })
              } else {
                this.loading = false
                this.$message.error('cron表达式不符合规范')
              }
            })
            .catch((e) => {
              this.loading = false
              console.log(e)
            })
        } else {
          // 增加
          saveInstanceList(data)
            .then((res) => {
              const code = res.code
              const data = res.data
              if (code == 0 && typeof data === 'number') {
                this.loading = false
                this.$store.commit('backend/CHANGE_ADDINSTANCEID', res.data) // 更改模型实例id
                this.$store.commit(
                  'backend/CHANGE_MODELCODE',
                  this.formData.modeList
                ) // 更改模型编码
                this.$store.commit('backend/CHANGE_ADDFIRST', true) // 更改修改状态
                this.$alert('进入基础设置', '新增成功', {
                  confirmButtonText: '确定',
                  type: 'success',
                  showClose: false,
                  callback(action) {
                    // _this.$store.commit("backend/CHANGE_SHOW", "SecendStep");
                    _this.goAhead()
                  }
                })
              } else if (data.indexOf('未进行催化剂配置') > -1) {
                this.loading = false
                this.$message.error(data)
              } else {
                this.loading = false
                this.$message.error(res.data)
              }
            })
            .catch((e) => {
              this.loading = false
              console.log(e)
            })
        }
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    goInstanceList() {
      this.$store.commit('backend/CHANGE_SHOW', 'InstanceList')
      this.$store.commit('backend/CHANGE_ADDFIRST', false)
      this.$store.commit('backend/CHANGE_ADDSECEND', false)
      this.$store.commit('backend/CHANGE_ADDTHIRD', false)
      this.$store.commit('backend/CHANGE_ADD_ENG_SUB_CONSUME', false)
    },
    // 模型名称选择事件
    changeModel(modeList, modeListOptions) {
      // this.formData.sub_fix_code = "";
      const obj = modeListOptions.filter((item) => {
        return item.model_code == modeList
      })[0]
      console.log(obj, 'obj')
      this.rectorShow = !!obj.fix_obj
      if (obj.alg_type == 2) {
        this.cronShow = false
      } else {
        this.cronShow = true
      }
      if (obj.ist_obj == 'plant') {
        this.deviceShow = false
      } else {
        this.deviceShow = true
      }
      this.algType = obj.alg_type
    },
    // 进入到第二步
    goAhead() {
      if (this.algType == 2) {
        this.$store.commit('backend/CHANGE_SHOW', 'Eng_sub_consume')
        this.$store.commit('backend/CHANGE_PLANTCODE', this.formData.plantList)
        this.$store.commit('backend/CHNAGE_UNITCODE', this.formData.unitList)
      } else {
        this.$store.commit('backend/CHANGE_SHOW', 'SecendStep')
      }
    }
  }
}
</script>
<style></style>
