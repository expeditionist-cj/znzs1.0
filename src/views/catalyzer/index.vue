<template>
  <div style="height: 100%">
    <div
      class="catalyzer"
      :class="{ showFullScreen: showFullScreen }"
    >
      <div class="catalyzer-head">
        <div class="left">
          <div
            v-show="showDiagram"
            class="units"
          >
            <div class="div-btns">
              <div
                v-for="(item, index) in btnData"
                :key="index"
                class="btn"
              >
                <el-button
                  :type="item.runStatus ? 'success' : 'danger'"
                  size="small"
                  @click="changeSide(item, index)"
                >{{ item.deviceName + item.side }}侧</el-button>
                <img
                  v-show="active == index"
                  class="div-btn-img"
                  src="@/assets/trailg.png"
                  alt
                >
              </div>
            </div>
          </div>
          <div
            v-show="!showDiagram"
            class="table-head"
          >
            <span class="title">{{ plantCn }}电厂 {{ unitName }}脱硝催化剂体检报告</span>
            <el-date-picker
              v-model="time"
              style="margin-right: 0.1rem"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
              default-time="08:00:00"
              size="small"
              class="tm"
            />
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >查询</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onExport"
            >导出</el-button>
          </div>
        </div>
        <div class="right">
          <!-- 设置按钮 -->
          <!-- <div class="settings">
            <img
              class="settings-img"
              src="@/assets/images/settings.png"
              @click="openSettings"
              alt
            />
          </div> -->
          <!-- 单选框 -->
          <div class="radio-box">
            <label
              for="radio1"
              class="radio-box-label"
              :class="{
                active: radio == 'diagram',
                blur: radio == 'diagram' ? 0 : 1,
              }"
            >
              <input
                id="radio1"
                v-model="radio"
                class="radio-box-input"
                type="radio"
                style="display: none"
                name="radioPicture"
                value="diagram"
              >
              曲线
            </label>
            <label
              for="radio2"
              class="radio-box-label"
              :class="{
                active: radio == 'report',
                blur: radio == 'report' ? 0 : 1,
              }"
            >
              <input
                id="radio2"
                v-model="radio"
                class="radio-box-input"
                type="radio"
                style="display: none"
                name="radioPicture"
                value="report"
              >
              报告
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
      </div>
      <div
        v-if="hasData"
        class="catalyzer-body"
      >
        <div
          v-show="showDiagram"
          v-loading="loading"
          class="catalyzer-body-diagram"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div class="catalyzer-model">
            <div class="left">
              <div class="title">实时参数</div>
              <!-- <div class="content">
              <div class="box" v-for="(item, index) in ssData" :key="index">
                <div class="num">{{ item.value }}</div>
                <div class="cn">{{ item.cn }}</div>
              </div>
            </div> -->
              <div class="div-box">
                <MyBox
                  v-for="(item, index) in ssData"
                  :key="index"
                  :value="item.val"
                  :unit="item.cn"
                  :width="divBoxWidth"
                  :ds="item.ds"
                  :show-bg-color="false"
                />
              </div>
            </div>
            <div class="center">
              <div class="title">模型输出参数</div>
              <div class="div-box">
                <MyBox
                  v-for="(item, index) in mxData"
                  :key="index"
                  :value="item.val"
                  :unit="item.cn"
                  width="1.6rem"
                  :ds="item.ds"
                  :show-bg-color="false"
                />
              </div>
            </div>
            <div class="right">
              <div class="title">推送建议</div>

              <ul class="content">
                <li
                  v-for="(item, index) in suggestData"
                  :key="index"
                >
                  <div class="suggest">
                    {{ item.descript }}
                  </div>
                  <div class="tm">
                    {{ item.tm }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="catalyzer-diagram">
            <div class="left">
              <div class="top">
                <Tlxl
                  :title="'脱硝效率预测曲线'"
                  :options="effOption"
                />
              </div>
              <div class="bottom">
                <Tlxl
                  :title="'出口NOX预测曲线'"
                  :options="outNoxOption"
                />
              </div>
            </div>
            <div class="center">
              <Chjhx
                :title="'催化剂活性曲线'"
                :options="catalyzerOption"
              />
            </div>
            <div class="right">
              <div class="top">
                <Tlxl
                  :title="'氨氮摩尔比预测曲线'"
                  :options="nh3MolOption"
                />
              </div>
              <div class="bottom">
                <Tlxl
                  :title="'氨逃逸预测曲线'"
                  :options="escapeOption"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="!showDiagram"
          v-loading="loading"
          style="margin-top: 0.1rem"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <myTable
            v-show="showTable"
            :table-data="tableData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
import MyBox from '@/components/MyBox/index.vue'
import { selectIndicators } from '@/api/dashboard.js'
import {
  getBaseInfo,
  getTableData,
  getSuggestData,
  getDiagramData,
  excel
} from '@/api/catalyzer.js'
import Tlxl from './components/Tlxl'
import Chjhx from './components/Chjhx'
import { formateData, getOption, formateCatalyzerData } from './js/tlxl'
import myTable from './components/myTable'
import { socketUrl } from '@/global'
const catalyzerDict = {
  Escape: '氨逃逸（ppm）',
  Eff: '脱硝效率（%）',
  NH3_mol: '氨氮摩尔比',
  OutNOx: '出口NOX (mg/Nm3)'
}
export default {
  components: {
    Tlxl,
    myTable,
    MyBox,
    Chjhx
  },
  data() {
    return {
      hasData: false,
      showTable: false,
      btnData: [],
      effOption: {}, // 脱硝效率
      escapeOption: {}, // 氨逃逸
      nh3MolOption: {}, // 氨氮摩尔比
      outNoxOption: {}, // 出口Nox
      catalyzerOption: {}, // 催化剂活性
      divBoxWidth: '1.7rem',
      ssData: [],
      mxData: [],
      suggestData: [],
      showFullScreen: false,
      radio: 'diagram',
      showDiagram: true,
      unitName: '',
      updateTime: '2021-03-15 08:52:00',
      tableData: [],
      BaseInfo: {},
      websock: null,
      diagramWebsock: null,
      path: '',
      diagramPath: '',
      deviceCode: '',
      side: 'A',
      instanceId: '',
      time: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loading: false,
      cruveData: {},
      active: 0
    }
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      plantCn: (state) => state.user.plantCn,
      unitList: (state) => state.dashboard.unitList,
      insList: (state) => state.user.instanceIdList,
      activeModel: (state) => state.app.activeModel,
      dictionary: (state) => state.dashboard.dictionary
    })
  },
  watch: {
    radio(value) {
      if (value == 'diagram') {
        this.showDiagram = true
        this.init()
      } else {
        this.showDiagram = false
      }
    },
    insList(val) {
      if (val.length <= 0) {
        this.cleanData()
        if (this.$route.path == '/model/ays/chj') {
          return this.$message.error('该机组暂无此模型！')
        } else {
          return
        }
      } else {
        this.btnData = this.getUnitList(this.activeModel, val, this.unitList)

        if (this.btnData && this.btnData.length > 0) {
          this.instanceId = this.btnData[0].instanceId
          this.deviceCode = this.btnData[0].deviceCode
          this.changeSide(this.btnData[0], 0)
        } else {
          this.cleanData()
          if (this.$route.path == '/model/ays/chj') {
            return this.$message.error('该机组暂无此模型！')
          } else {
            return
          }
        }
      }
    },
    btnData(value) {
      this.active = 0
    }
  },
  mounted() {
    if (this.insList.length <= 0) {
      this.cleanData()
      if (this.$route.path == '/model/ays/chj') {
        return this.$message.error('该机组暂无此模型！')
      } else {
        return
      }
    } else {
      this.btnData = this.getUnitList(
        this.activeModel,
        this.insList,
        this.unitList
      )
      if (this.btnData && this.btnData.length > 0) {
        this.instanceId = this.btnData[0].instanceId
        this.unitName = this.btnData[0].deviceName
        this.deviceCode = this.btnData[0].deviceCode
      } else {
        this.cleanData()
        if (this.$route.path == '/model/ays/chj') {
          return this.$message.error('该机组暂无此模型！')
        } else {
          return
        }
      }
      this.changeSide(this.btnData[0], 0)
    }
  },
  destroyed() {
    this.showTable = false
    if (this.websock) {
      this.websock.close()
    } // 离开路由之后断开websocket连接
    if (this.diagramWebsock) {
      this.diagramWebsock.close()
    } // 离开路由之后断开websocket连接
  },
  methods: {
    onSearch() {
      if (!this.time) {
        this.showTable = false
        return this.$message.info('请先选择时间')
      } else {
        this.initTable()
      }
    },
    // 清空数据
    cleanData() {
      this.instanceId = ''
      this.ssData = []
      this.mxData = []
      this.effOption = {}
      this.escapeOption = {}
      this.nh3MolOption = {}
      this.outNoxOption = {}
      this.catalyzerOption = {}
      this.suggestData = []
      this.hasData = false
    },
    // 获取含instanceId的机组list
    getUnitList(activeModel, list, units) {
      const arr = []
      // 循环对比出当前模型实例下所有机组和instanceId
      list.forEach((ele) => {
        if (ele.model_code == activeModel) {
          units.forEach((item) => {
            if (
              ele.fix_code == item.deviceCode &&
              ele.plant_code == item.orgCode
            ) {
              // 对应放入机组信息中
              arr.push({
                instanceId: ele.id,
                side: ele.sub_fix_code,
                enable: ele.enable,
                deviceCode: item.deviceCode,
                deviceName: item.deviceName,
                orgCode: item.orgCode,
                plantName: item.plantName,
                runStatus: item.runStatus
              })
            }
          })
        }
      })
      return arr
    },
    // 初始化表格
    initTable() {
      this.loading = true
      // getBaseInfo({
      //   plant: this.plantCode,
      //   unit: this.deviceCode,
      // })
      //   .then((res) => {
      //     this.BaseInfo = res.data.data;
      //   })
      //   .catch((e) => {
      //     this.loading = false;
      //   });
      getTableData({
        plant: this.plantCode,
        unit: this.deviceCode,
        reportTime: moment(this.time).format('YYYY-MM-DD HH:mm:ss')
      })
        .then((response) => {
          this.loading = false
          if (response.data) {
            this.tableData = response.data
            this.showTable = true
          } else {
            this.showTable = false
            this.$message.error(response.msg)
          }
        })
        .catch(() => {
          this.showTable = false
          this.loading = false
        })
    },
    // 切换机组、AB侧
    changeSide(item, idx) {
      this.unitName = item.deviceName
      this.active = idx
      this.side = item.side
      this.deviceCode = item.deviceCode
      this.instanceId = item.instanceId
      if (item.runStatus === 0) {
        this.cleanData()
        return this.$message.error('当前机组运行状态：停机！')
      }
      this.init()
    },
    changeFullScreen() {
      this.showFullScreen = !this.showFullScreen
    },
    // 导出
    onExport() {
      excel('/ctlst_report/expCtlstReport', {
        plant: this.plantCode,
        unit: this.deviceCode,
        reportTime: moment(this.time).format('YYYY-MM-DD HH:mm:ss'),
        plantCn: this.plantCn
      }).then((res) => {
        const data = res
        const excelName = `${this.plantCn}项目${'#' + this.deviceCode
        }机组脱硝催化剂体检报告${moment(this.time).format(
          'YYYY-MM-DD HH:mm:ss'
        )}.xlsx`
        this.excel(data, excelName)
      })
    },
    // 初始化查询页面数据
    init() {
      if (!this.instanceId) {
        if (this.$route.path == '/model/ays/chj') {
          return this.$message.error('该机组暂无此模型！')
        } else {
          return
        }
      } else {
        const promise1 = new Promise((resolve, reject) => {
          // 初始化关键指标数据
          selectIndicators({
            ssCode: `model_${this.activeModel}`,
            plant: this.plantCode,
            unit: this.deviceCode,
            subFix: this.side
          })
            .then((res) => {
              const data = res.data.data
              if (data) {
                const arr = []
                if (data && data.length > 0) {
                  data.forEach((ele) => {
                    ele.val = '--'
                    ele.ds = 0
                    arr.push(ele)
                  })
                }
                this.ssData = arr
                resolve()
              } else {
                reject()
              }
            })
            .catch(() => {
              reject()
            })
        })
        const promise2 = new Promise((resolve, reject) => {
          // 获取曲线数据
          getDiagramData({
            instanceId: this.instanceId
          })
            .then((res) => {
              if (res.data) {
                const {
                  Eff,
                  Escape,
                  NH3_mol,
                  OutNOx,
                  Activities,
                  hisActivities
                } = res.data
                // 缓存曲线数据
                this.cruveData = {
                  Eff,
                  Escape,
                  NH3_mol,
                  OutNOx,
                  Activities,
                  hisActivities
                }
                this.effOption = getOption(formateData(Eff, '脱硝效率'), '%')
                this.escapeOption = getOption(formateData(Escape, '氨逃逸'))
                this.nh3MolOption = getOption(
                  formateData(NH3_mol, '氨氮摩尔比')
                )
                this.outNoxOption = getOption(formateData(OutNOx, '出口NOX'))
                this.catalyzerOption = getOption(
                  formateCatalyzerData(Activities, hisActivities)
                )
                resolve()
              } else {
                reject()
              }
            })
            .catch(() => {
              reject()
            })
        })
        const promise3 = new Promise((resolve, reject) => {
          // 初始化模型输出参数及推送建议
          getSuggestData({
            instanceId: this.instanceId
          })
            .then((res) => {
              if (res.data) {
                const { modelOutParam, suggestions } = res.data
                const mxdata = []
                Object.keys(modelOutParam).map((k) => {
                  if (k != 'time') {
                    Object.keys(catalyzerDict).map((key) => {
                      if (k == key) {
                        mxdata.push({
                          val: modelOutParam[k].value,
                          time: modelOutParam[k].value,
                          ds: 0,
                          an: '',
                          cn: catalyzerDict[key]
                        })
                      }
                    })
                  }
                })
                this.mxData = mxdata
                const suggest = []
                for (let i = 0; i < suggestions.length; i++) {
                  suggest.push({
                    tm: suggestions[i].split('推送建议:')[0],
                    descript: suggestions[i].split('推送建议:')[1]
                  })
                }
                this.suggestData = suggest
                resolve()
              } else {
                if (this.$route.path.indexOf('chj') >= 0) {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
                reject()
              }
            })
            .catch((err) => {
              if (this.$route.path.indexOf('chj') >= 0) {
                this.$message({
                  message: err.message,
                  type: 'error'
                })
              }
              this.hasData = false
              reject()
            })
        })
        this.loading = true
        Promise.all([promise1, promise2, promise3])
          .then(() => {
            this.hasData = true
            this.loading = false
            this.initWebSocket()
            this.initDiagramWebSocket()
          })
          .catch((e) => {
            // console.log(e.message)
            this.hasData = false
            // catch方法将会被执行
            this.loading = false
          })
      }
    },
    // 初始化weosocket
    initWebSocket() {
      const now = Date.now()
      this.path = `/assistant/real_time_data_websocket/model_${this.activeModel
      }/${this.plantCode}/${this.deviceCode || ''}/${this.side}/${now}`
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
      const bfSsData = JSON.parse(JSON.stringify(this.ssData))
      const data = JSON.parse(e.data)
      const redata = data.points
      bfSsData.forEach((ele) => {
        redata.forEach((k) => {
          if (ele.an == k.an) {
            ele.val = k.value
            ele.ds = k.ds || 0
          }
        })
      })
      this.ssData = bfSsData
    },
    // 数据发送
    websocketsend(Data) {
      // this.websock.send(Data);
    },
    // 关闭连接
    websocketclose(e) {
      // console.log("断开连接", e);
    },
    // 初始化曲线weosocket
    initDiagramWebSocket() {
      const now = Date.now()
      this.diagramPath = `/assistant/real_time_data_websocket/${this.activeModel
      }-outparam/${this.plantCode}/${this.deviceCode || ''}/${this.side
      }/${now}`
      if (this.diagramWebsock) {
        this.diagramWebsock.close()
      }
      const wsuri = socketUrl + this.diagramPath
      this.diagramWebsock = new WebSocket(wsuri)
      this.diagramWebsock.onmessage = this.diagramWebsocketonmessage
      this.diagramWebsock.onopen = this.diagramWebsocketonopen
      this.diagramWebsock.onerror = this.diagramWebsocketonerror
      this.diagramWebsock.onclose = this.diagramWebsocketclose
    },
    // 连接建立之后执行send方法发送数据
    diagramWebsocketonopen() {
      // let actions = { test: "12345" };
      // this.diagramWebsocketsend();
    },
    // 连接建立失败重连
    diagramWebsocketonerror() {
      this.initWebSocket(this.diagramPath)
    },
    // 数据接收
    diagramWebsocketonmessage(e) {
      const redata = JSON.parse(e.data)
      const { curveData, modelOutParam, suggestions } = redata
      const mxdata = []
      Object.keys(modelOutParam).map((k) => {
        if (k != 'time' && k != 'Activities') {
          Object.keys(catalyzerDict).map((key) => {
            if (k == key) {
              mxdata.push({
                val: modelOutParam[k].value,
                time: modelOutParam[k].value,
                ds: 0,
                an: '',
                cn: catalyzerDict[key]
              })
            }
          })
        }
      })
      this.mxData = mxdata
      const suggestData = JSON.parse(JSON.stringify(this.suggestData))
      suggestData.pop()
      suggestData.unshift({
        tm: suggestions.split('推送建议:')[0],
        descript: suggestions.split('推送建议:')[1]
      })
      this.suggestData = suggestData
      const now = moment().format('YYYY-MM-DD HH:mm:00')
      const {
        Activities,
        Eff,
        Escape,
        NH3_mol,
        OutNOx,
        hisActivities
      } = curveData
      const bfCruveData = JSON.parse(JSON.stringify(this.cruveData))
      Object.keys(bfCruveData).map((k) => {
        bfCruveData[k].shift()
      })
      // 催化剂活性
      bfCruveData.Activities.push(Activities[0])
      const arr1 = [] // 活性预测曲线历史预测数据
      bfCruveData.hisActivities.forEach((ele) => {
        if (moment(ele.time) < moment(now)) {
          arr1.push(ele)
        }
      })
      bfCruveData.hisActivities = arr1.concat(hisActivities)
      this.catalyzerOption = getOption(
        formateCatalyzerData(bfCruveData.Activities, bfCruveData.hisActivities)
      )
      // 脱硝效率
      const arr2 = [] // 脱硝效率预测曲线历史预测数据
      bfCruveData.Eff.forEach((ele) => {
        if (moment(ele.time) < moment(now)) {
          arr2.push(ele)
        }
      })
      bfCruveData.Eff = arr2.concat(Eff)
      this.effOption = getOption(formateData(bfCruveData.Eff, '脱硝效率'))
      // 氨逃逸
      const arr3 = [] // 氨逃逸预测曲线历史预测数据
      bfCruveData.Escape.forEach((ele) => {
        if (moment(ele.time) < moment(now)) {
          arr3.push(ele)
        }
      })
      bfCruveData.Escape = arr3.concat(Escape)
      this.escapeOption = getOption(formateData(bfCruveData.Escape, '氨逃逸'))
      // 氨氮摩尔比
      const arr4 = [] // 氨氮摩尔比预测曲线历史预测数据
      bfCruveData.NH3_mol.forEach((ele) => {
        if (moment(ele.time) < moment(now)) {
          arr4.push(ele)
        }
      })
      bfCruveData.NH3_mol = arr4.concat(NH3_mol)
      this.escapeOption = getOption(
        formateData(bfCruveData.NH3_mol, '氨氮摩尔比')
      )
      // 出口NOX
      const arr5 = [] // 出口NOX预测曲线历史预测数据
      bfCruveData.OutNOx.forEach((ele) => {
        if (moment(ele.time) < moment(now)) {
          arr5.push(ele)
        }
      })
      bfCruveData.OutNOx = arr5.concat(OutNOx)
      this.escapeOption = getOption(formateData(bfCruveData.OutNOx, '出口NOX'))
      // 最后把推送过来的数据组合完毕后，再存回缓存中
      this.cruveData = bfCruveData
    },
    // 数据发送
    diagramWebsocketsend(Data) {
      // this.diagramWebsock.send(Data);
    },
    // 关闭连接
    diagramWebsocketclose(e) {
      // console.log("断开连接", e);
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: url("../../assets/dashboard/bg-s.png") no-repeat center;
$bg-size: 100% 100%;
$pad: 0.2rem 0.1rem;
.catalyzer {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: $bg-size;
  padding: $pad;
  .catalyzer-head {
    height: 0.4rem;
    display: flex;
    justify-content: space-between;
    .left {
      .units {
        display: flex;
        .div-btns {
          margin-left: 0.15rem;
          display: flex;
          .btn {
            margin-right: 0.15rem;
            position: relative;
            .div-btn-img {
              width: 0.16rem;
              height: 0.12rem;
              position: absolute;
              left: 0.42rem;
              top: -0.16rem;
            }
          }
        }
      }
      .table-head {
        display: flex;
        align-items: center;
        margin-left: 0.2rem;
        .title {
          min-width: 4.5rem;
          font-size: 0.26rem;
          margin-right: 0.2rem;
        }
        .tm {
          margin-left: 0.2rem;
          color: #a8cdd4;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      margin-top: -0.15rem;
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
      .settings {
        width: 0.3rem;
        height: 0.3rem;
        background: rgba(241, 241, 241, 0.1);
        border-radius: 0.05rem;
        display: flex;
        align-items: center;
        margin-right: 0.1rem;
        .settings-img {
          width: 0.18rem;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
  .catalyzer-body {
    height: 100%;
    .catalyzer-body-diagram {
      height: 100%;
      .catalyzer-model {
        height: 30%;
        margin-top: 0.1rem;
        display: flex;
        justify-content: space-between;
        .left {
          width: 49%;
          background: $bg;
          background-size: $bg-size;
          padding: $pad;
          .title {
            font-size: 0.16rem;
            margin-bottom: 0.05rem;
          }
          .div-box {
            display: flex;
            flex-wrap: wrap;
          }
        }
        .center {
          width: 24%;
          background: $bg;
          background-size: $bg-size;
          padding: $pad;
          .title {
            font-size: 0.16rem;
            margin-bottom: 0.05rem;
          }
          .div-box {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }
        }
        .right {
          width: 25%;
          background: $bg;
          background-size: $bg-size;
          padding: $pad;
          .title {
            font-size: 0.16rem;
            margin-bottom: 0.1rem;
          }
          .content {
            list-style: none;
            margin: 0;
            padding: 0;
            height: calc(100% - 0.2rem);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .suggest {
              font-size: 0.14rem;
              color: rgba(255, 54, 111, 1);
            }
            .tm {
              font-size: 0.12rem;
              color: #a8cdd4;
            }
          }
          .content li:not(:first-child) > .suggest {
            color: rgba(206, 185, 0, 0.795);
          }
        }
      }
      .catalyzer-diagram {
        margin-top: 0.1rem;
        height: inherit;
        display: flex;
        justify-content: space-between;
        .left {
          width: 25%;
          .top {
            height: 30%;
            background: $bg;
            background-size: $bg-size;
            padding: $pad;
          }
          .bottom {
            height: 30%;
            margin-top: 2%;
            background: $bg;
            background-size: $bg-size;
            padding: $pad;
          }
        }
        .center {
          width: 48%;
          height: 61%;
          background: $bg;
          background-size: $bg-size;
          padding: $pad;
        }
        .right {
          width: 25%;
          .top {
            height: 30%;
            background: $bg;
            background-size: $bg-size;
            padding: $pad;
          }
          .bottom {
            height: 30%;
            margin-top: 2%;
            background: $bg;
            background-size: $bg-size;
            padding: $pad;
          }
        }
      }
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

.echarts {
  width: 100%;
  height: 100%;
}
</style>
 <<style lang="scss" >
 .el-table thead.is-group th {
   background: transparent;
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
      font-weight: 500;
      color: rgba(105, 255, 249, 1);
      line-height: 0.22rem;
    }
  }
}
</style>
