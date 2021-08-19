<template>
  <div style="height: 100%">
    <div
      v-if="hasModel"
      class="GasFlow"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="GasFlow-head">
        <!-- 头部组件 -->
        <ModelHeader
          :suggestion="suggestion"
          :units="units"
          @checkUnit="checkUnit"
        >
          <div slot="suggestion" class="suggest">
            <span class="suggest-title">优化建议：</span>
            <span class="suggest-content">{{ suggestion }}</span>
          </div>
          <!-- 插槽：头部右边内容 -->
          <div slot="ModelHeaderRight">
            <div class="ModelHeader-head-right">
              <!-- 单选框 -->
              <div class="radio-box">
                <label
                  for="radio1"
                  class="radio-box-label"
                  :class="{
                    active: radio == 'scene',
                    blur: radio == 'scene' ? 0 : 1,
                  }"
                >
                  <input
                    id="radio1"
                    v-model="radio"
                    class="radio-box-input"
                    type="radio"
                    style="display: none"
                    name="radioPicture"
                    value="scene"
                  >
                  场景图
                </label>
                <label
                  for="radio2"
                  class="radio-box-label"
                  :class="{
                    active: radio == 'curve',
                    blur: radio == 'curve' ? 0 : 1,
                  }"
                >
                  <input
                    id="radio2"
                    v-model="radio"
                    class="radio-box-input"
                    type="radio"
                    style="display: none"
                    name="radioPicture"
                    value="curve"
                  >
                  曲线图
                </label>
              </div>
              <!-- 显示全屏图标 -->
              <div class="fullScreen">
                <img
                  v-show="!showFullScreen"
                  class="fullScreen-img"
                  src="@/assets/images/fullScreen.png"
                  alt
                  @click="changeFullScreen"
                >
                <img
                  v-show="showFullScreen"
                  class="fullScreen-img"
                  src="@/assets/images/back.png"
                  alt
                  @click="changeFullScreen"
                >
              </div>
            </div>
            <div style="font-size: 0.12rem; color: #a8cdd4; margin-top: 0.2rem">
              刷新时间：
              <span>{{ sysTime }}</span>
            </div>
          </div>
        </ModelHeader>
      </div>
      <!-- 组件内容-场景图 -->
      <div
        v-show="showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="GasFlow-model"
      >
        <div class="div-box">
          <MyBox
            v-for="(item, index) in list"
            :key="index"
            :value="item.value"
            :unit="item.unit"
            :ds="item.ds"
          />
        </div>
      </div>
      <!-- 组件内容-曲线图 -->
      <div
        v-show="!showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="GasFlow-diagram"
      >
        <div ref="div_box" class="div-box">
          <MyBox
            v-for="(item, index) in list"
            :key="index"
            :value="item.value"
            :unit="item.unit"
            :ds="item.ds"
          />
        </div>
        <div class="div-diagram" :style="{ height: canvasHeight }">
          <v-chart autoresize :options="options" />
        </div>
      </div>
    </div>
    <div v-else class="developing-container">
      <div class="developing-div">
        <img src="@/assets/images/developing.png" alt>
        <span class="developing-span">该电厂暂无此模型</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MyBox from '@/components/MyBox/index.vue'
import ModelHeader from '@/components/ModelHeader/index.vue'
import { getOption, formatterCurveData, addNewSockData } from '@/js/gasFlow.js'
import { getGasFlow, getGasDiagram } from '@/api/gasFlow.js'
import moment from 'moment'
import {
  getPumpDict
} from '@/api/pulpSupply.js'
export default {
  data() {
    return {
      hasModel: true,
      sysTime: '',
      loading: false,
      list: [],
      units: [
        {
          deviceName: '#1机组',
          instanceId: 90,
          status: 1
        },
        {
          deviceName: '#2机组',
          instanceId: 92,
          status: 1
        }
      ],
      radio: 'scene',
      suggestion: '',
      showModel: true,
      options: {},
      showFullScreen: false,
      diagramData: [],
      canvasHeight: 'calc(100% - 1rem)',
      instanceId: '',
      query: {
        stime: moment().format('YYYY-MM-DD HH:00:00'),
        etime: moment().format('YYYY-MM-DD HH:59:59')
      },
      deviceCode: '',
      diagramDataObj: {},
      enable: 0,
      dictionary: {}
    }
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel
      // dictionary: (state) => state.dashboard.dictionary
    })
  },
  watch: {
    msg(value) {
      if (value) {
        const val = JSON.parse(value)
        // 更新机组状态
        if (val.type == 'gasFlowConsum' && val.unitType == this.deviceCode) {
          const data = val.data
          const key = Object.keys(data)[0]
          this.sysTime = data[key].date
          this.suggestion = data[key].sg.toString() || '无'
          const obj = addNewSockData(this.diagramDataObj, data)
          this.options = getOption(obj)
          this.list = this.getList(data[key])
        }
      }
    },
    radio(value) {
      if (value == 'scene') {
        this.showModel = true
      } else {
        this.showModel = false
      }
    },
    units(value) {
      if (value.length) {
        this.deviceCode = value[0].deviceCode
      }
    },
    insList(value) {
      if (value.length <= 0) {
        this.suggestion = ''
        this.list = []
        this.options = {}
        this.hasModel = false
        if (this.$route.path == '/model/ays/dust') {
          return this.$message.error('该电厂暂无此模型！')
        } else {
          return
        }
      } else {
        this.hasModel = true
        this.units = this.getUnitList(this.activeModel, value, this.unitList)

        this.instanceId = this.units[0].instanceId
        this.enable = this.units[0].enable
        if (!this.instanceId) {
          this.list = []
          this.options = {}
          this.suggestion = ''
          if (this.$route.path == '/model/ays/dust') {
            return this.$message.error('该机组暂无此模型！')
          } else {
            return
          }
        } else if (!this.enable) {
          this.list = []
          this.options = {}
          this.suggestion = ''
          if (this.$route.path == '/model/ays/dust') {
            return this.$message.error('该机组此模型未启用！')
          } else {
            return
          }
        } else {
          this.checkUnit(this.units[0])
        }
      }
    }
  },
  created() {},
  mounted() {
    if (this.insList.length <= 0) {
      this.list = []
      this.options = {}
      this.hasModel = false
      return this.$message.error('该电厂暂无此模型！')
    } else {
      this.hasModel = true
      // 放入机组信息一起
      this.units = this.getUnitList(
        this.activeModel,
        this.insList,
        this.unitList
      )
      // 初始化instanceId为默认第一个机组的instanceId
      this.instanceId = this.units[0].instanceId
      this.enable = this.units[0].enable
      if (!this.instanceId) {
        this.list = []
        this.options = {}
        return this.$message.error('该机组暂无此模型！')
      } else if (!this.enable) {
        this.list = []
        this.options = {}
        return this.$message.error('该机组此模型未启用！')
      } else {
        this.checkUnit(this.units[0])
      }
    }
  },
  updated() {
    try {
      this.canvasHeight =
        'calc(100% - ' + (this.$refs.div_box.offsetHeight / 100 + 0.6) + 'rem)'
    } catch (err) {}
  },
  components: {
    MyBox,
    ModelHeader
  },
  destroyed() {},
  methods: {
    // 获取含instanceId的机组list
    getUnitList(activeModel, list, units) {
      units.forEach((ele) => {
        delete ele.instanceId
      })
      // 循环对比出当前模型实例下所有机组和instanceId
      list.forEach((ele) => {
        if (ele.model_code == activeModel) {
          units.forEach((item) => {
            if (ele.fix_code == item.deviceCode && ele.plant_code == item.orgCode) {
              // 对应放入机组信息中
              item.instanceId = ele.id
              item.enable = ele.enable
            }
          })
        }
      })
      return units
    },
    // 切换机组
    checkUnit(value) {
      this.instanceId = value.instanceId
      this.enable = value.enable
      this.deviceCode = value.deviceCode
      if (value.status <= 0) {
        this.list = []
        this.options = {}
        if (this.$route.path == '/model/ays/dust') {
          return this.$message.error('当前机组运行状态：停机！')
        } else {
          return
        }
      } else if (!this.instanceId) {
        this.list = []
        this.options = {}
        if (this.$route.path == '/model/ays/dust') {
          return this.$message.error('该机组暂无此模型！')
        } else {
          return
        }
      } else if (!this.enable) {
        this.list = []
        this.options = {}
        if (this.$route.path == '/model/ays/dust') {
          return this.$message.error('该机组此模型未启用！')
        } else {
          return
        }
      } else {
        this.init()
        this.getGasDiagramData()
      }
    },
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen
    },
    // 初始化查询页面数据
    init() {
      getPumpDict({ instanceId: this.instanceId }).then(res => {
        this.dictionary = res.data
      })
      this.loading = true
      getGasFlow({ instanceId: this.instanceId }).then((res) => {
        this.loading = false
        this.sysTime = res.data.date
        const obj = res.data
        if (obj) {
          this.list = this.getList(obj)
          this.suggestion = obj.sg.toString()
        } else {
          this.list = []
          this.suggestion = '无'
          return
        }
      })
    },
    getList(param) {
      const obj = JSON.parse(JSON.stringify(param))
      delete obj.date
      delete obj.sg
      const arr = []
      const dict = this.dictionary
      Object.keys(obj).map((k) => {
        dict.forEach((ele) => {
          if (ele.param == k) {
            arr.push({
              value: obj[k].val,
              unit:
                ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : ''),
              ds: obj[k].ds
            })
          }
        })
      })
      return arr
    },
    // 获取曲线数据
    async getGasDiagramData() {
      try {
        await getGasDiagram({
          ...this.query,
          instanceId: this.instanceId
        }).then((res) => {
          if (res.data) {
            const diagramDataObj = formatterCurveData(res.data)
            this.diagramDataObj = diagramDataObj
            this.options = getOption(this.diagramDataObj)
          } else {
            this.options = {}
          }
        })
      } catch (error) {
        this.options = {}
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.GasFlow {
  // font-family: PingFang-SC-Medium;
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .GasFlow-head {
    height: 1.2rem;
  }
  .GasFlow-model {
    height: calc(100% - 1.2rem);
    background: url("/images/bitmap.png") no-repeat center;
    background-size: 99% 98%;
    .div-box {
      // width: 30%;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
    }
  }
  .GasFlow-diagram {
    width: 100%;
    height: calc(100% - 1.2rem);
    .div-box {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
      margin-bottom: 0.4rem;
    }
    .div-diagram {
      width: 100%;
      // height: calc(100% - 1rem);
    }
  }
}
.showFullScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: #253553;
}
.ModelHeader-head-right {
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  margin-top: 0.15rem;

  .radio-box {
    font-size: 0.1rem;
    margin-right: 20px;
    background-color: transparent;
    .radio-box-label {
      text-align: center;
      padding: 0.05rem 0.1rem;
      border: 0.01rem solid rgba(105, 255, 249, 1);
      color: rgba(0, 43, 41, 1);
      cursor: pointer;
    }
    .radio-box-label:first-child {
      border-radius: 0.05rem 0 0 0.05rem;
    }
    .radio-box-label:last-child {
      border-radius: 0 0.05rem 0.05rem 0;
    }
    .active {
      background-color: rgba(105, 255, 249, 1) !important;
      color: rgba(0, 43, 41, 1) !important;
    }
    .blur {
      background-color: transparent !important;
      color: rgba(105, 255, 249, 1) !important;
    }
  }
  .fullScreen {
    width: 0.3rem;
    height: 0.3rem;
    background: rgba(241, 241, 241, 0.1);
    border-radius: 0.05rem;
    display: flex;
    align-items: center;
    .fullScreen-img {
      width: 0.18rem;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}
.suggest {
  margin-top: 0.1rem;
  font-size: 0.19rem;
  font-weight: 500;
  line-height: 0.19rem;
  .suggest-title {
    color: rgba(168, 205, 212, 1);
  }
  .suggest-content {
    color: rgba(255, 54, 111, 1);
  }
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.developing-container {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .developing-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    img {
      width: 1.13rem;
      margin: 0.2rem auto;
    }
    .developing-span {
      display: block;
      font-size: 0.2rem;
      // font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(105, 255, 249, 1);
      line-height: 0.22rem;
    }
  }
}
</style>
