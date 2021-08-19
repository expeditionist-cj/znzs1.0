<template>
  <div class="thirdStep-wrap">
    <BasicLayout style="margin-bottom: 117px">
      <div slot="header">
        <el-steps :active="2" finish-status="success" simple>
          <el-step title="基本信息" icon="el-icon-edit" />
          <el-step title="基础设置" icon="el-icon-s-custom" />
          <el-step title="详细设置" icon="el-icon-s-tools" />
        </el-steps>
      </div>
      <div slot="main">
        <!-- <div class="main-title">算法用点</div> -->
        <AlgTable
          ref="algTable0"
          :key="'algTable0'"
          :table-data="routinePoints"
          :cal-point-carry="calPointCarry"
        />
        <AlgTable
          v-for="(item, index) in listPoints"
          :ref="'algTable' + (index + 1)"
          :key="index"
          :cal-point-carry="item.calPointCarry"
          :table-data="item.list"
          :point-title="item.pointTitle"
          :type="item.type"
        />
      </div>
    </BasicLayout>
    <!-- 操作栏 -->
    <el-card class="thirdStep-tool-wrap">
      <el-button
        size="small"
        icon="el-icon-circle-check"
        type="primary"
        :loading="loading"
        @click="submitFormAll"
      >{{ loadingText }}</el-button>
      <el-button
        size="small"
        icon="el-icon-s-order"
        type="primary"
        @click="$store.commit('backend/CHANGE_SHOW', 'InstanceList')"
      >返回列表</el-button>
      <el-button
        size="small"
        icon="el-icon-back"
        type="primary"
        @click="goback"
      >上一步</el-button>
    </el-card>
  </div>
</template>

<script>
import BasicLayout from '@/commonLayout/basicLayout'
import AlgTable from './algTable/index'
import { mapState } from 'vuex' // 引入vuex state
import { selectModelListThirdStep } from '@/api/modelnstanceBasicInfo'
import {
  validateSinglePoint,
  validateMtpPoints,
  queryByInstanceId,
  batchSave,
  update,
  validatePointParamCode
} from '@/api/alg'

export default {
  components: { BasicLayout, AlgTable },
  props: {},
  data() {
    return {
      loading: false,
      loadingText: '保存',
      routinePoints: [],
      listPoints: [],
      calPointCarry: [] // 常规点缓存
    }
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
      modelCode: (state) => state.backend.modelCode,
      addThird: (state) => state.backend.addThird
    })
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    // 初始化加载
    init() {
      if (this.addThird) {
        // 修改-查询
        queryByInstanceId({ instanceId: this.addInstanceId }).then((res) => {
          const data = res.data
          // 常规计算点
          const routinePoints = []
          const listPoints = []
          data.forEach((item, i) => {
            if (item.type == 'list') {
              // 构造 list点数据结构
              const catchObj = {
                list: [],
                calPointCarry: [],
                type: 'list'
              }
              catchObj.pointTitle = item.param_cn // 中文title
              item.list.forEach((o, index) => {
                o.isBind = o.is_bind
                o.pointValue = ''
                o.loading = false
                o.list_cn = item.param_cn
                o.list_code = item.param_code
                if (o.mtp_points) {
                  // 计算点带公式
                  o.singlePoint = o.cpt_exp
                  o.loadingText = '已校验'
                  // 构造dynamicValidateForm 数据
                  const obj = {
                    state: 0,
                    data: {
                      domains: [],
                      formula: ''
                    }
                  }
                  obj.state = 0
                  obj.data.domains = []
                  obj.data.formula = o.cpt_exp
                  const arry = JSON.parse(o.mtp_points)
                  arry.forEach((ele, idx) => {
                    const obj1 = {}
                    obj1.cn = ele.name
                    obj1.en = ele['P' + idx]
                    obj1.value = ''
                    obj.data.domains.push(obj1)
                  })
                  catchObj.calPointCarry[index] = obj
                } else {
                  // 计算点不带公式
                  o.singlePoint = o.single_point
                  o.loadingText = '已校验'
                }
                catchObj.list.push(o)
              })
              listPoints.push(catchObj)
            } else {
              // 构造常规点数据结构
              item.isBind = item.is_bind
              item.singlePoint = item.single_point
              item.pointValue = ''
              item.loading = false
              item.loadingText = '已校验'
              if (item.mtp_points) {
                // 计算点带公式
                item.singlePoint = item.cpt_exp
                item.loadingText = '已校验'
                // 构造dynamicValidateForm 数据
                const obj = {
                  state: 0,
                  data: {
                    domains: [],
                    formula: ''
                  }
                }
                obj.state = 0
                obj.data.domains = []
                obj.data.formula = item.cpt_exp
                const arry = JSON.parse(item.mtp_points)
                arry.forEach((ele, idx) => {
                  const obj1 = {}
                  obj1.cn = ele.name
                  obj1.en = ele['P' + idx]
                  obj1.value = ''
                  obj.data.domains.push(obj1)
                })
                this.calPointCarry[i] = obj
              } else {
                // 计算点不带公式
                item.singlePoint = item.single_point
                item.loadingText = '已校验'
              }
              routinePoints.push(item)
            }
          })
          this.routinePoints = routinePoints
          this.listPoints = listPoints
        })
      } else {
        // 查询对应的模型参数列表
        selectModelListThirdStep({
          modelCode: this.modelCode,
          instanceId: this.addInstanceId
        }).then((res) => {
          const data = res.data
          // 常规计算点
          const routinePoints = []
          const listPoints = []
          data.forEach((item) => {
            if (item.type == 'list') {
              // 构造 list点数据结构
              const catchObj = {
                list: [],
                calPointCarry: [],
                type: 'list'
              }
              catchObj.pointTitle = item.param_cn // 中文title
              item.list.forEach((o) => {
                o.isBind = 1
                o.singlePoint = ''
                o.pointValue = ''
                o.is_show = 0
                o.changeable = 0
                o.loading = false
                o.loadingText = '校验'
                o.list_cn = item.param_cn
                o.list_code = item.param_code
                catchObj.list.push(o)
              })
              listPoints.push(catchObj)
            } else {
              // 构造常规点数据结构
              item.isBind = 1
              item.singlePoint = ''
              item.pointValue = ''
              item.is_show = 0
              item.changeable = 0
              item.loading = false
              item.loadingText = '校验'
              routinePoints.push(item)
            }
          })
          this.routinePoints = routinePoints
          this.listPoints = listPoints
        })
      }
    },
    // 提交所有
    submitFormAll() {
      const len = this.listPoints.length
      const postArray = []
      for (let index = 0; index < len + 1; index++) {
        const ele = this.$refs['algTable' + index]
        let data = null
        if (Object.prototype.toString.call(ele) === '[object Array]') {
          // 判断是否为数组
          data = ele[0].getData('alg')
          console.log(data, 100023)
        } else {
          data = ele.getData('alg')
        }
        if (data == false) {
          return this.$message.error('请完成数据录入且校验保存')
        } else {
          postArray.push(...data)
        }
      }
      this.num = 0
      postArray.forEach((ele) => {
        if (!ele.list && !ele.show_order) {
          this.num++
        }
      })
      if (this.num > 0) {
        return this.$message.error('排序不能为空')
      } else {
        this.loading = true
        this.loadingText = '保存中'
        if (this.addThird) {
          // 更新
          update(postArray)
            .then((res1) => {
              this.loading = false
              if (res1.code == 0) {
                this.loadingText = '保存成功'
                // 保存成功后重新获取机组信息

                this.$message.success('更新成功')
              } else {
                this.$message.error('更新成功')
              }
            })
            .catch((e) => {
              this.loading = false
              console.log(e)
            })
        } else {
          // 新增
          validatePointParamCode(postArray)
            .then((res) => {
              console.log(res)
              if (res.code == 0) {
                batchSave(postArray)
                  .then((res1) => {
                    this.loading = false
                    if (res1.code == 0) {
                      this.loadingText = '保存成功'
                      this.$message.success('新增成功')
                      this.$store.commit('backend/CHANGE_ADDTHIRD', true)
                    } else {
                      this.$message.error('新增失败')
                    }
                  })
                  .catch((e) => {
                    this.loading = false
                    console.log(e)
                  })
              } else {
                this.$message.error('校验实例测点值编码的唯一性失败')
                this.loading = false
              }
            })
            .catch((e) => {
              this.loading = false
              console.log(e)
            })
        }
      }
    },
    // 返回
    goback() {
      this.$store.commit('backend/CHANGE_SHOW', 'SecendStep')
    }
  }
}
</script>

<style scoped lang="scss">
.thirdStep-wrap {
  .thirdStep-tool-wrap {
    text-align: right;
    position: fixed;
    bottom: 20px;
    right: 0;
    z-index: 2000;
  }
}
</style>
<style lang="scss">
.thirdStep-wrap {
  .el-dialog,
  .el-pager li {
    background-color: #122344;
  }
  .main-title {
    color: #69fff9;
  }
}
</style>
