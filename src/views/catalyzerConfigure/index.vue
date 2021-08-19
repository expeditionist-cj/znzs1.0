<template>
  <div class="catalyzerConfig">
    <div class="nav">
      <div v-if="showTable" class="ipt">
        <span class="text">项目：</span>
        <el-select
          v-model="plant"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
          @change="changePlant"
        >
          <el-option
            v-for="(item, index) in plants"
            :key="index"
            :label="item.name"
            :value="item.deptCode"
          />
        </el-select>
        <span class="text">机组：</span>
        <el-select
          v-model="unit"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
          @change="changeUnit"
        >
          <el-option
            v-for="item in unitList"
            :key="item.deviceCode"
            :label="item.deviceName"
            :value="item.deviceCode"
          />
        </el-select>
        <span class="text">设备：</span>
        <el-select
          v-model="side"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
        >
          <el-option
            v-for="item in scaOption"
            :key="item.side"
            :label="item.name"
            :value="item.side"
          />
        </el-select>
      </div>
      <div v-if="isAdd" class="ipt">
        <span class="text">项目：</span>
        <el-select
          v-model="rowData.plant"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
          @change="changeAddPlant"
        >
          <el-option
            v-for="(item, index) in plants"
            :key="index"
            :label="item.name"
            :value="item.deptCode"
          />
        </el-select>
        <span class="text">机组：</span>
        <el-select
          v-model="rowData.unit"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
          @change="changeAddUnit"
        >
          <el-option
            v-for="item in unitList"
            :key="item.deviceCode"
            :label="item.deviceName"
            :value="item.deviceCode"
          />
        </el-select>
        <span class="text">设备：</span>
        <el-select
          v-model="rowData.reactor"
          :popper-append-to-body="false"
          size="small"
          clearable
          placeholder="请选择"
          style="width: 1.5rem"
          @change="getAddInfo"
        >
          <el-option
            v-for="item in scaOption"
            :key="item.side"
            :label="item.name"
            :value="item.side"
          />
        </el-select>
      </div>
      <div v-if="showTable" class="ipt">
        <span class="text">时间段：</span>

        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        />

        <el-button
          type="primary"
          size="small"
          style="margin-left: 0.1rem"
          @click="init"
        >查询</el-button>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 0.1rem"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <div v-if="!showTable && !isAdd" class="info">
      <span class="text">项目：{{ rowData.plantCn }}</span>
      <span class="text">机组：{{ "#" + rowData.unit.slice(0, 1) }}</span>
      <span class="text">设备：{{ rowData.reactor }}</span>
    </div>
    <div class="table">
      <el-table
        v-if="showTable"
        :data="tableData"
        height="6rem"
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="plantCn" label="项目" align="center" />
        <el-table-column prop="unit" label="机组" align="center" />
        <el-table-column prop="reactor" label="设备" align="center" />
        <el-table-column label="记录状态" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.delFlag ? "异常" : "正常" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最新安装时间" min-width="140" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.optTime ? moment(scope.row.optTime).format("YYYY-MM-DD") : '--' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="填写时间" min-width="140" align="center">
          <template slot-scope="scope">
            <div>
              {{ moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="200" align="center">
          <template slot-scope="scope">
            <div>
              模型数据无效时段：{{
                scope.row.algInvalidSdt + " 至 " + scope.row.algInvalidEdt
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="onWatch(scope.row)"
            >查看</el-button>
            <el-button
              v-if="!scope.row.delFlag"
              type="text"
              size="small"
              @click="onEdit(scope.row)"
            >修正</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑页面 -->
      <div v-else class="edit-page">
        <div class="top">
          <div class="top-div">
            <span class="top-div-span">设计效率%</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.designEff"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">每层模块数</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.blockNum"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">每模块根数</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.barNum"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">设计最低喷氨温度℃</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.dsgLowNh3Tmpr"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">设计反应器喷氨量kg/h</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.dsgReactorNh3Mnt"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">催化剂的比表面积m2/m3</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.ssa"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <span class="top-div-span">设计面速度 m/h</span>
            <div
              class="top-div-ipt"
              :style="{ width: 3 * rowData.floorParam.length + 0.2 + 'rem' }"
            >
              <el-input
                v-model="rowData.surfaceVelocity"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span" />
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
              style="margin: 0.05rem 0"
            >
              第{{ index + 1 }}层
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">生产厂家</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-input
                v-model="item.brand"
                size="small"
                :disabled="isDisable"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">规格(孔)</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-input
                v-model="item.specs"
                size="small"
                :disabled="isDisable"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">体积m3</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-input
                v-model="item.volume"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">初始活性Nm/h</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-input
                v-model="item.initialActivity"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">催化剂设计寿命h</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-input
                v-model="item.designLife"
                size="small"
                :disabled="isDisable"
                onkeyup="var p2 = parseFloat(value).toFixed(2);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$|[^\d]*$/,'')"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">初装日期</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-date-picker
                v-model="item.installTime"
                size="small"
                type="date"
                placeholder="选择日期"
                :disabled="isDisable"
                :picker-options="pickerOptions"
              />
            </div>
          </div>
          <div class="top-div">
            <div class="top-div-span">更换日期</div>
            <div
              v-for="(item, index) in rowData.floorParam"
              :key="index"
              class="top-div-ipt"
            >
              <el-date-picker
                v-model="item.changeTime"
                size="small"
                type="date"
                placeholder="选择日期"
                :disabled="isDisable"
              />
            </div>
          </div>
        </div>
        <div class="bottom">
          <el-button
            v-if="!isDisable"
            type="primary"
            size="small"
            @click="savaData"
          >保存</el-button>
          <el-button type="info" size="small" @click="onCancel">返回</el-button>
        </div>
      </div>
    </div>
    <div v-if="showTable" class="page">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import {
  getAllPlants,
  selectUnitCode,
  getCtlstByPage,
  getCtlstParamById,
  getCtlstParam,
  addCtlstParam,
  mdfCtlstParam
} from '@/api/catalyzerConfigure.js'
import { getBaseInfo } from '@/api/catalyzer.js'
import moment from 'moment'
export default {
  data() {
    return {
      baseInfo: {},
      catalyst_floor_size: 3,
      rowData: {
        plant: '',
        reactor: '',
        unit: '',
        floorParam: [{}, {}, {}]
      },
      showTable: true,
      isAdd: false,
      tableData: [],
      time: [],
      plant: '',
      plants: [],
      unitList: [],
      unit: '',
      side: '',
      scaOption: [],
      currentPage: 1,
      totalNum: 0,
      stime: '',
      etime: '',
      isDisable: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  watch: {
    time(value) {
      if (value) {
        this.stime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        this.etime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.stime = ''
        this.etime = ''
      }
    }
  },
  mounted() {
    this.getAllPlantsInfo()
    this.init()
  },
  destroyed() {},
  methods: {
    //   查询电厂
    getAllPlantsInfo() {
      getAllPlants().then((res) => {
        const data = res.data
        data.unshift({
          name: '所有项目',
          deptCode: ''
        })
        this.plants = data
      })
    },
    // 根据电厂查询机组
    getUnitList(value) {
      if (!value) {
        this.unitList = []
        return
      }
      selectUnitCode({
        plant: value
      }).then((res) => {
        this.unitList = res.data
      })
    },
    // 切换电厂查询机组
    changePlant(value) {
      this.unit = ''
      this.side = ''
      this.unitList = []
      this.scaOption = []
      this.getUnitList(value)
    },
    // 切换电厂查询机组
    changeAddPlant(value) {
      this.getUnitList(value)
    },
    // 切换机组查询反应器
    changeUnit(value) {
      this.side = ''
      this.scaOption = []
      this.getSideInfo(value)
    },
    changeAddUnit(value) {
      this.getAddSideInfo(value)
    },
    // 根据机组查询反应器
    getSideInfo(value) {
      getBaseInfo({
        plant: this.plant,
        unit: value
      }).then((res) => {
        // this.baseInfo = res.data.reactors;
        const baseInfo = res.data.reactors
        const arr = []
        Object.keys(baseInfo).map((k) => {
          arr.push({
            side: k,
            name: k + '侧'
          })
        })
        this.scaOption = arr
      })
    },
    getAddSideInfo(value) {
      getBaseInfo({
        plant: this.rowData.plant,
        unit: value
      }).then((res) => {
        this.baseInfo = res.data.reactors
        const baseInfo = res.data.reactors
        const arr = []
        Object.keys(baseInfo).map((k) => {
          arr.push({
            side: k,
            name: k + '侧'
          })
        })
        this.scaOption = arr
      })
    },
    // 分页查询表格数据
    init() {
      getCtlstByPage({
        pn: this.currentPage,
        ps: 10,
        plant: this.plant,
        unit: this.unit,
        reactor: this.side,
        stime: this.stime,
        etime: this.etime
      }).then((res) => {
        const { totalNum, items } = res.data
        this.tableData = items
        this.totalNum = totalNum
      })
    },
    // 新增记录
    add() {
      this.showTable = false
      this.isDisable = false
      this.isAdd = true
      this.rowData = {
        plant: '',
        reactor: '',
        unit: '',
        floorParam: [{}, {}, {}]
      }
    },
    // 根据反应器查询历史最新记录
    getAddInfo(value) {
      getCtlstParam({
        plant: this.rowData.plant,
        unit: this.rowData.unit,
        rctCode: value
      }).then((res) => {
        const floorParam = []
        for (let i = 0; i < this.baseInfo[value].catalyst_floor_size; i++) {
          floorParam.push({})
        }
        if (res.data) {
          for (let j = 0; j < floorParam.length; j++) {
            floorParam[j] = res.data.floorParam[j] || {}
          }
          res.data.floorParam = floorParam
        }
        this.rowData = res.data || {
          plant: this.rowData.plant,
          unit: this.rowData.unit,
          reactor: value,
          floorParam: floorParam
        }
      })
    },
    // 查看记录
    onWatch(row) {
      this.showTable = false
      this.isDisable = true
      this.isAdd = false
      getCtlstParamById({
        id: row.id
      }).then((res) => {
        const data = res.data
        data.plantCn = row.plantCn
        this.rowData = data
      })
    },
    // 修改记录
    onEdit(row) {
      this.showTable = false
      this.isDisable = false
      this.isAdd = false
      getCtlstParamById({
        id: row.id
      }).then((res) => {
        const data = res.data
        data.plantCn = row.plantCn
        this.rowData = data
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.init()
    },
    savaData() {
      this.$confirm('此操作会影响催化剂活性准确性，请谨慎操作！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.isAdd) {
            if (!this.rowData.reactor) {
              return this.$message.error('请先选择反应器')
            }
            // 新增
            const data = JSON.parse(JSON.stringify(this.rowData))
            delete data.id
            delete data.createTime
            let num = 0
            let no0 = 0
            data.floorParam.forEach((ele, index) => {
              delete ele.id
              ele.installTime = moment(ele.installTime).format('YYYY-MM-DD')
              ele.floor = index + 1
              if (ele.installTime > ele.changeTime) {
                num++
              }
              if (ele.installTime === 'Invalid date') {
                no0++
              }
            })
            if (no0 > 0) {
              return this.$message.error('初装日期不能为空！')
            }
            if (num > 0) {
              return this.$message.error('更换日期不得小于初装日期！')
            }

            // data.optTime = moment(data.optTime).format("YYYY-MM-DD");
            data.nextChangeTime = moment(data.nextChangeTime).format(
              'YYYY-MM-DD'
            )
            data.checkTime = moment(data.checkTime).format('YYYY-MM-DD')
            addCtlstParam(data)
              .then((res) => {
                const { code, msg } = res
                if (code == 0) {
                  this.$message.success('保存成功')
                  this.onCancel()
                } else {
                  this.$message.error(msg)
                  this.onCancel()
                }
              })
              .catch((e) => {
                console.log(e.message)
              })
          } else {
            // 修改
            mdfCtlstParam(this.rowData)
              .then((res) => {
                const { code, msg } = res
                if (code == 0) {
                  this.$message.success('保存成功')
                  this.onCancel()
                } else {
                  this.$message.error(msg)
                  this.onCancel()
                }
              })
              .catch((e) => {
                console.log(e.message)
              })
          }
        })
        .catch(() => {})
    },
    onCancel() {
      this.showTable = true
      this.isAdd = false
      this.rowData = {
        plant: '',
        reactor: '',
        unit: '',
        floorParam: [{}, {}, {}]
      }
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.catalyzerConfig {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  .nav {
    display: flex;
    align-items: center;
    .ipt {
      height: 0.6rem;
      display: flex;
      align-items: center;
      flex-direction: row;
      border-bottom: 1px solid rgba(241, 241, 241, 0.1);
      padding-bottom: 0.24rem;
    }
  }

  .info {
    display: flex;
    .text {
      width: 2rem;
      text-align: right;
    }
  }
  .table {
    padding-top: 0.22rem;
    flex: 1;
    .edit-page {
      height: 6rem;
      overflow-y: auto;
      .top {
        display: flex;
        flex-wrap: wrap;

        .top-div {
          display: flex;
          align-items: center;
          width: 14rem;
          margin-bottom: 0.05rem;
          .top-div-span {
            width: 2rem;
            text-align: right;
            display: inline-block;
            margin-right: 0.1rem;
          }
          .top-div-ipt {
            width: 3rem;
            text-align: center;
            margin-right: 0.1rem;
          }
        }
      }
      .bottom {
        padding: 0.1rem 1.5rem;
      }
    }
    .edit-page::-webkit-scrollbar {
      display: none;
    }
  }
  .page {
    height: 0.5rem;
    line-height: 0.6rem;
    text-align: right;
  }
}
</style>

