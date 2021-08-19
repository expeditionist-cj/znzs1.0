<template>
  <div class="expertSetting-wrap">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-row>
        <el-col :span="9">
          <el-form-item label-width="200px" :label="label" prop="paramVal">
            <el-input
              v-model="formData.paramVal"
              placeholder="请输入数字"
              clearable
              size="small"
              :style="{ width: '100%' }"
            >
              <template v-if="dimension != null" slot="append">{{
                dimension
              }}</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item
            v-if="formData.param_type == 'const'"
            label="排序"
            prop="showOrder"
          >
            <el-input
              v-model="formData.showOrder"
              placeholder="输入序号排序"
              clearable
              type="number"
              size="small"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-if="formData.param_type == 'const'"
            label="是否修改"
            prop="changeable"
          >
            <el-radio-group v-model="formData.changeable" size="small">
              <el-radio
                v-for="(item, index) in changeListOption"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                border
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="formData.param_type == 'list'"
            label-width="40px"
            prop="refExp"
          >
            <el-input
              v-model="formData.refExp"
              placeholder=""
              clearable
              size="small"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-if="formData.param_type == 'const'"
            label="是否显示"
            prop="isShow"
          >
            <el-radio-group v-model="formData.isShow" size="small">
              <el-radio
                v-for="(item, index) in showListOption"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                border
                size="small"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formData.param_type == 'list'" class="tail">
            备注：{{ formData.remark }}
          </div>
        </el-col>
      </el-row>
      <el-divider />
    </el-form>
  </div>
</template>
<script>
import { letters } from '@/globalVariables/index'

export default {
  components: {},
  props: {
    formData: {
      type: Object,
      default() {
        return {
          isShow: 1
        }
      }
    },
    label: {
      type: String,
      default: ''
    },
    dimension: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rules: {
        paramVal: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '必须输入大于等于0的数',
            trigger: 'blur'
          }
        ],
        showOrder: [
          {
            required: false,
            message: '排序不能为空',
            trigger: 'change'
          }
        ],
        isShow: [
          {
            required: true,
            message: '是否更改不能为空',
            trigger: 'change'
          }
        ],
        changeable: [
          {
            required: true,
            message: '是否显示不能为空',
            trigger: 'change'
          }
        ],
        param_type: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '必须输入大于等于0的数',
            trigger: 'blur'
          }
        ],
        refExp: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ]
      },
      changeListOption: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      showListOption: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    }
  },
  computed: {},
  watch: {
    'formData.paramVal': {
      handler(data) {
        if (this.formData.param_type == 'list') {
          data = Number(data)
          data = letters.substring(0, data)
          this.formData.refExp = data.split('').toString()
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    resetForm() {
      console.log(222)
      this.$refs['elForm'].resetFields()
    }
  }
}
</script>
<style lang="scss">
.expertSetting-wrap {
  padding: 10px 0;
  .el-divider {
    margin: 6px 0 0 0;
  }
  .el-input-group__append {
    width: 80px;
    text-align: center;
  }
  .tail {
    height: 58px;
    line-height: 45px;
    margin-left: 10px;
    font-size: 14px;
    color: rgba(255,255,255,0.4);

  }
}
</style>
