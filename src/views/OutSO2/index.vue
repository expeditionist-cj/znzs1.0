<template>
  <div style="height: 100%">
    <div
      v-if="hasModel"
      class="outso2"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="outso2-head">
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
        class="outso2-model"
      >
        <div ref="divContainer" class="div-container">
          <div class="div-box">
            <MyBox
              v-for="(item, idx) in list"
              :key="idx"
              :value="item.val"
              :unit="item.cn"
              :ds="item.ds"
            />
          </div>
        </div>
        <div class="div-ring">
          <div v-for="(item, idx) in ringList" :key="idx">
            <MyRing :ring-data="item" />
          </div>
        </div>
      </div>
      <!-- 组件内容-曲线图 -->
      <div
        v-show="!showModel"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="outso2-diagram"
      >
        <div ref="div_box" class="div-diagram-data">
          <div ref="divContainer2" class="div-container">
            <div class="div-box">
              <MyBox
                v-for="(item, idx) in list"
                :key="idx"
                :value="item.val"
                :unit="item.cn"
                :ds="item.ds"
              />
            </div>
          </div>
          <div class="div-ring">
            <div v-for="(item, idx) in ringList" :key="idx">
              <MyRing :ring-data="item" />
            </div>
          </div>
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
import MyRing from '@/components/MyRing/index.vue'
import ModelHeader from '@/components/ModelHeader/index.vue'
import { socketUrl } from '@/global'
import {
  getOption,
  formatterCurveData,
  addNewSockData,
  getOutSData
} from '@/js/outSO2.js'
import {
  getPumpDict
} from '@/api/pulpSupply.js'
import { getSO2, getSO2Diagram } from '@/api/outSO2.js'
import { selectIndicators } from '@/api/dashboard.js'
import moment from 'moment'
export default {
  data() {
    return {
      dict: {},
      websock: null,
      path: '',
      hasModel: true,
      sysTime: '',
      loading: false,
      list: [],
      ringList: [],
      units: [],
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
      enable: 0
    }
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel
      // dict: (state) => state.dashboard.dictionary
    })
  },
  watch: {
    msg(value) {
      if (value) {
        const val = JSON.parse(value)
        // 更新机组状态
        if (
          val.type == 'exportInteligentForecast' &&
          val.unitType == this.deviceCode
        ) {
          const data = val.data
          const key = Object.keys(data)[0]
          this.sysTime = data[key] ? data[key].date : ''
          this.suggestion = data[key] ? data[key].sg || '无' : '无'
          const obj = addNewSockData(this.diagramDataObj, data)
          this.options = getOption(obj)
          // let obj1 = getCustomData(data[key], this.dict);
          // this.list = obj1.list;
          // this.ringList = obj1.ringList;
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
    // 监听电厂是否改变，电厂改变则instanceId集合改变
    insList(val) {
      if (val.length <= 0) {
        this.list = []
        this.ringList = []
        this.units = []
        this.suggestion = ''
        this.hasModel = false
        if (this.websock) {
          this.websock.close()
        }
        if (this.$route.path == '/model/ays/pre') {
          return this.$message.error('该电厂暂无此模型')
        } else {
          return
        }
      } else {
        this.hasModel = true
        // 放入机组信息一起
        this.units = this.getUnitList(
          this.activeModel,
          this.insList,
          this.unitList
        )
        console.log(this.unitList, 1009)
        // 初始化instanceId为默认第一个机组的instanceId
        this.instanceId = this.units[0].instanceId
        this.enable = this.units[0].enable
        if (!this.instanceId) {
          this.list = []
          this.ringList = []
          this.suggestion = '无'
          this.options = {}
          if (this.websock) {
            this.websock.close()
          }
          if (this.$route.path == '/model/ays/pre') {
            return this.$message.error('该机组暂无此模型！')
          } else {
            return
          }
        } else if (!this.enable) {
          this.list = []
          this.ringList = []
          this.suggestion = '无'
          this.options = {}
          if (this.websock) {
            this.websock.close()
          }
          if (this.$route.path == '/model/ays/pre') {
            return this.$message.error('该机组此模型未启用！')
          } else {
            return
          }
        } else {
          this.checkUnit(this.units[0])
        }
      }
    },
    list(value) {
      if (value.length > 0) {
        this.$refs['divContainer'].style.width = `${0.95 * value.length}rem`
        this.$refs['divContainer2'].style.width = `${0.95 * value.length}rem`
      }
    }
  },
  created() {},
  mounted() {
    if (this.insList.length <= 0) {
      this.list = []
      this.electricity = []
      this.units = []
      this.hasModel = false
      if (this.websock) {
        this.websock.close()
      }
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
        this.ringList = []
        this.suggestion = '无'
        this.options = {}
        if (this.websock) {
          this.websock.close()
        }
        return this.$message.error('该机组暂无此模型！')
      } else if (!this.enable) {
        this.list = []
        this.ringList = []
        this.suggestion = '无'
        this.options = {}
        if (this.websock) {
          this.websock.close()
        }
        return this.$message.error('该机组此模型未启用！')
      } else {
        this.checkUnit(this.units[0])
      }
    }
  },
  updated() {
    try {
      this.canvasHeight =
        'calc(100% - ' + (this.$refs.div_box.offsetHeight / 100 + 0.8) + 'rem)'
    } catch (err) {}
  },
  components: {
    MyBox,
    ModelHeader,
    MyRing
  },
  destroyed() {
    if (this.websock) {
      this.websock.close()
    } // 离开路由之后断开websocket连接
  },
  methods: {
    // 初始化查询页面数据
    init() {
      getPumpDict({ instanceId: this.instanceId }).then(res => {
        this.dict = res.data
      })
      this.loading = true
      getSO2({ instanceId: this.instanceId }).then((res) => {
        this.loading = false
        if (res.data) {
          const { sg } = res.data
          this.sysTime = res.data.date
          this.getIndiData()
          this.initWebSocket()
          this.suggestion = sg || '无'
        } else {
          this.list = []
          this.ringList = []
          this.sysTime = ''
          this.suggestion = '无'
          this.options = {}
          return
        }
      })
    },
    getIndiData() {
      // 初始化关键指标数据
      selectIndicators({
        ssCode: `model_${this.activeModel}`,
        plant: this.plantCode,
        unit: this.deviceCode
      }).then((res) => {
        const data = res.data.data
        data.forEach((ele) => {
          ele.val = '---'
          ele.ds = 0
        })
        const { list, ringList } = getOutSData(data)
        this.list = list
        this.ringList = ringList
        // let list1 = [];
        // let arr = [];
        // data.forEach((ele) => {
        //   if (ele.list) {
        //     let arry = ele.list;
        //     arry.forEach((k) => {
        //       k.val = "---";
        //       k.ds = 0;
        //     });
        //     arr = arry;
        //   } else {
        //     ele.val = "---";
        //     ele.ds = 0;
        //     list1.push(ele);
        //   }
        // });
      })
    },
    // 获取含instanceId的机组list
    getUnitList(activeModel, list, unit) {
      const units = JSON.parse(JSON.stringify(unit))

      // 循环对比出当前模型实例下所有机组和instanceId
      list.forEach((ele) => {
        if (ele.model_code === activeModel) {
          units.forEach((item) => {
            if (
              ele.fix_code === item.deviceCode &&
              ele.plant_code === item.orgCode
            ) {
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
      if (value.runStatus <= 0) {
        this.list = []
        this.ringList = []
        this.suggestion = '无'
        this.options = {}
        if (this.websock) {
          this.websock.close()
        }
        if (this.$route.path == '/model/ays/pre') {
          return this.$message.error('当前机组运行状态：停机！')
        } else {
          return
        }
      } else if (!this.instanceId) {
        this.list = []
        this.ringList = []
        this.suggestion = '无'
        this.options = {}
        if (this.websock) {
          this.websock.close()
        }
        if (this.$route.path == '/model/ays/pre') {
          return this.$message.error('该机组暂无此模型！')
        } else {
          return
        }
      } else if (!this.enable) {
        this.list = []
        this.ringList = []
        this.suggestion = '无'
        this.options = {}
        if (this.websock) {
          this.websock.close()
        }
        if (this.$route.path == '/model/ays/pre') {
          return this.$message.error('该机组此模型未启用！')
        } else {
          return
        }
      } else {
        this.init()
        this.getSO2DiagramData()
      }
    },
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen
    },
    // 获取曲线数据
    async getSO2DiagramData() {
      try {
        await getSO2Diagram({
          ...this.query,
          instanceId: this.instanceId
        }).then((res) => {
          if (res.data) {
            const diagramDataObj = formatterCurveData(res.data, this.dict)
            this.diagramDataObj = diagramDataObj
            this.options = getOption(this.diagramDataObj)
          } else {
            this.options = {}
          }
        })
      } catch (error) {
        this.options = {}
      }
    },
    // 初始化weosocket
    initWebSocket() {
      const now = Date.now()
      this.path = `/assistant/real_time_data_websocket/model_${
        this.activeModel
      }/${this.plantCode}/${this.deviceCode || ''}//${now}`
      if (this.websock) {
        this.websock.close()
      }
      const wsuri = socketUrl + this.path
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {
      // let actions = { test: "12345" };
      // this.websocketsend();
    },
    // 连接建立失败重连
    websocketonerror() {
      this.initWebSocket(this.path)
    },
    // 数据接收
    websocketonmessage(e) {
      const data = JSON.parse(e.data)
      const unitState = data.unitStatus
      this.units.forEach((ele) => {
        Object.keys(unitState).map((k) => {
          if (ele.deviceCode == k) {
            ele.runStatus = unitState[k]
          }
        })
      })
      const bfList = JSON.parse(JSON.stringify(this.list))
      const bfRingList = JSON.parse(JSON.stringify(this.ringList))
      const redata = data.points
      redata.forEach((ele) => {
        bfList.forEach((k) => {
          if (ele.an == k.an) {
            k.val = ele.value
            k.ds = ele.ds
          }
        })
        bfRingList.forEach((m) => {
          if (ele.an == m.an) {
            m.value = ele.value
            m.ds = ele.ds
          }
        })
      })
      this.list = bfList
      this.ringList = bfRingList
      // bfList1.forEach((ele) => {
      //   redata.forEach((k) => {
      //     if (ele.an == k.an) {
      //       ele.val = k.value;
      //       ele.ds = k.ds || 0;
      //     }
      //   });
      // });
      // bfElectricity.forEach((ele) => {
      //   redata.forEach((k) => {
      //     if (ele.an == k.an) {
      //       ele.val = k.value;
      //       ele.ds = k.ds || 0;
      //     }
      //   });
      // });
      // this.list1 = bfList1;
      // this.electricity = bfElectricity;
      // let list = [];
      // let electricity = [];
      // redata.forEach((ele) => {
      //   if (ele.cn.indexOf("电流") > -1) {
      //     electricity.push({
      //       ds: ele.ds,
      //       params: ele.gn,
      //       unit: ele.cn,
      //       value: ele.value.toFixed(2),
      //     });
      //   } else {
      //     list.push({
      //       ds: ele.ds,
      //       params: ele.gn,
      //       unit: ele.cn,
      //       value: ele.value.toFixed(2),
      //     });
      //   }
      // });
      // let arr = JSON.parse(JSON.stringify(this.list1));
      // arr.forEach((ele) => {
      //   if (ele.params == "CaCo3SlryDst") {
      //     list.push(ele);
      //   }
      // });
      // this.list1 = list;
      // this.electricity = electricity;
      // // 处理曲线数据
      // let curveData = redata.curveData;
      // let length = curveData.length;
      // this.initialLineData = this.initialLineData.map((item) => {
      //   for (var i = 0; i < length; i++) {
      //     if (curveData[i].cnName == item.cnName) {
      //       item.dataList.shift();
      //       item.dataList.push(curveData[i].dataList[0]);
      //     } else {
      //       continue;
      //     }
      //   }
      //   return item;
      // });
      // let obj = formatterCurveData(this.initialLineData);
      // this.options = getOption(obj);
      // //处理参数数据
      // let data = redata.currentInfo;
      // if (data) {
      //   this.list = this.transData(data).arr2;
      //   this.electricity = this.transData(data).arr1;
      // } else {
      //   this.list = [];
      //   this.suggestion = "无";
      //   return;
      // }
    },
    // 数据发送
    websocketsend(Data) {
      // this.websock.send(Data);
    },
    // 关闭连接
    websocketclose(e) {
      // console.log("断开连接", e);
    }
  }
}
</script>
<style lang="scss" scoped>
.outso2 {
  // font-family: PingFang-SC-Medium;
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  .outso2-head {
    height: 1.2rem;
  }
  .outso2-model {
    height: calc(100% - 1.2rem);
    background: url("../../assets/images/outso2.png") no-repeat center;
    background-size: 99% 98%;
    display: flex;
    // flex-direction: row;
    .div-container {
      // width: 6rem;
      height: 1.3rem;
      display: flex;
      .div-box {
        width: 1.8rem;
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: wrap;
        position: relative;
        left: 0.2rem;
        top: 0.2rem;
        margin-right: 0.05rem;
      }
    }
    .div-ring {
      // width: 6rem;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      left: 0.2rem;
      top: 0.2rem;
    }
  }
  .outso2-diagram {
    width: 100%;
    height: calc(100% - 1.2rem);
    .div-diagram-data {
      display: flex;
      flex-direction: row;
      margin-bottom: 0.4rem;
      .div-container {
        // width: 6rem;
        height: 1.3rem;
        display: flex;
        .div-box {
          width: 1.8rem;
          display: flex;
          flex-direction: column-reverse;
          flex-wrap: wrap;
          position: relative;
          left: 0.2rem;
          top: 0.2rem;
          margin-right: 0.05rem;
        }
      }
      .div-ring {
        // width: 6rem;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        left: 0.2rem;
        top: 0.2rem;
      }
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
