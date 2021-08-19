<template>
  <div class="catalyzerConfig">
    <div class="nav">
      <div class="ipt">
        <span class="text">页面位置：</span>
        <el-select
          v-model="ssCode"
          :popper-append-to-body="false"
          size="small"
          placeholder="请选择"
          style="width: 2rem"
          clearable
        >
          <el-option
            v-for="item in places"
            :key="item.code"
            :label="item.val"
            :value="item.code"
          />
        </el-select>
        <span class="text">项目：</span>
        <el-select
          v-model="plant"
          :popper-append-to-body="false"
          size="small"
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
          placeholder="请选择"
          style="width: 1.5rem"
          clearable
        >
          <el-option
            v-for="item in unitList"
            :key="item.deviceCode"
            :label="item.deviceName"
            :value="item.deviceCode"
          />
        </el-select>
        <span class="text">设备：</span>
        <el-input
          v-model="subFix"
          size="small"
          type="text"
          style="width: 2rem"
        />
      </div>
      <div class="ipt">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 0.1rem"
          @click="init"
        >
          查询
        </el-button>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 0.1rem"
          @click="add"
        >
          新增
        </el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        height="6rem"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="plantName"
          label="项目"
          align="center"
        />
        <el-table-column
          prop="unitName"
          label="机组"
          align="center"
        />
        <el-table-column
          prop="ssCodeName"
          label="页面位置"
          align="center"
        />
        <el-table-column
          prop="subFix"
          label="设备/定位"
          align="center"
        />
        <el-table-column
          label="使用状态"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.isUse == 1
                  ? "启用"
                  : scope.row.isUse == 0
                    ? "停用"
                    : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="reactor"
          label="显示状态"
          align="center"
        />
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              title="查看"
              type="text"
              size="small"
              @click="onWatch(scope.row)"
            >
              <svg-icon
                icon-class="watch"
                class-name="custom-class"
              />
            </el-button>
            <el-button
              title="修改"
              type="text"
              size="small"
              @click="onEdit(scope.row)"
            >
              <svg-icon
                icon-class="edit"
                class-name="custom-class"
              />
            </el-button>
            <el-button
              type="text"
              :title="!scope.row.isUse ? '启用' : '停用'"
              size="small"
              @click="onChangeState(scope.row)"
            >
              <svg-icon
                :icon-class="!scope.row.isUse ? 'on' : 'off'"
                class-name="custom-class"
              />
            </el-button>

            <el-button
              title="删除"
              type="text"
              size="small"
              @click="onDelete(scope.row)"
            >
              <svg-icon
                icon-class="delete"
                class-name="custom-class"
              />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
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
    <!-- 弹窗框 -->
    <MyDialog
      v-show="dialogShow"
      :title="dialogTitle"
      class="my-dialog"
      :show-cancel="showCancel"
      @closeSettings="dialogShow = false"
      @saveSettings="saveSettings"
      @onConfirm="onConfirm"
    >
      <div
        slot="content"
        class="dialog-content clearfix"
      >
        <div class="nav">
          <span class="text">页面位置：</span>
          <el-input
            v-if="dialogTitle == '查看'"
            size="mini"
            disabled
            :value="rowData.ssCodeName"
            style="width: 2rem; margin-right: 0.1rem"
          />
          <el-select
            v-else
            v-model="rowData.ssCode"
            :popper-append-to-body="false"
            size="small"
            placeholder="请选择"
            style="width: 2rem"
            clearable
          >
            <el-option
              v-for="item in places"
              :key="item.code"
              :label="item.val"
              :value="item.code"
            />
          </el-select>
          <span class="text">项目：</span>
          <el-input
            v-if="dialogTitle == '查看'"
            size="mini"
            disabled
            :value="rowData.plantName"
            style="width: 1.5rem; margin-right: 0.1rem"
          />
          <el-select
            v-else
            v-model="rowData.plant"
            :popper-append-to-body="false"
            size="small"
            placeholder="请选择"
            style="width: 1.5rem"
            @change="changeDialogPlant"
          >
            <el-option
              v-for="(item, index) in dialogPlants"
              :key="index"
              :label="item.name"
              :value="item.deptCode"
            />
          </el-select>
          <span class="text">机组：</span>
          <el-input
            v-if="dialogTitle == '查看'"
            size="mini"
            disabled
            :value="rowData.unitName"
            style="width: 1.5rem; margin-right: 0.1rem"
          />
          <el-select
            v-else
            v-model="rowData.unit"
            :popper-append-to-body="false"
            size="small"
            placeholder="请选择"
            style="width: 1.5rem"
            clearable
          >
            <el-option
              v-for="item in dialogUnitList"
              :key="item.deviceCode"
              :label="item.deviceName"
              :value="item.deviceCode"
            />
          </el-select>
          <span class="text">设备：</span>
          <el-input
            v-if="dialogTitle == '查看'"
            size="mini"
            disabled
            :value="rowData.subFix"
            style="width: 1.5rem; margin-right: 0.1rem"
          />
          <el-input
            v-else
            v-model="rowData.subFix"
            size="mini"
            style="width: 1.5rem; margin-right: 0.1rem"
          />
        </div>
        <div class="btn">
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="mini"
            :disabled="dialogTitle == '查看'"
            @click="addGroup"
          >
            分组
          </el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="mini"
            :disabled="dialogTitle == '查看'"
            @click="addPoint"
          >
            绑点
          </el-button>
        </div>
        <div class="tree-content">
          <div class="tree-content-left">
            <div
              v-for="(ele, idx) in treeData"
              :key="idx"
              class="tree-content-box"
            >
              <div
                v-if="ele.list"
                class="group"
              >
                <div class="group-head">
                  <div class="od">
                    <el-input
                      v-model="ele.od"
                      placeholder="顺序"
                      size="mini"
                      :disabled="dialogTitle == '查看'"
                    />
                  </div>
                  <div class="name">
                    分组名
                  </div>
                  <div class="ipt">
                    <el-input
                      v-model="ele.cn"
                      :disabled="dialogTitle == '查看'"
                      size="mini"
                    />
                  </div>
                  <div class="group-btn">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-plus"
                      :disabled="dialogTitle == '查看'"
                      @click="addGroupPoint(ele.list)"
                    >
                      绑点
                    </el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-circle-close"
                      size="mini"
                      :disabled="dialogTitle == '查看'"
                      @click="deleteGroup(idx)"
                    />
                  </div>
                </div>
                <ul
                  v-if="ele.list.length > 0"
                  class="group-ul"
                >
                  <li
                    v-for="(item, index) in ele.list"
                    :key="index"
                    class="li-div"
                  >
                    <div class="od">
                      <el-input
                        v-model="item.od"
                        placeholder="顺序"
                        size="mini"
                        :disabled="dialogTitle == '查看'"
                      />
                    </div>
                    <div class="name">
                      {{ item.an }}
                    </div>
                    <div class="ob">
                      <el-input
                        v-model="item.cn"
                        placeholder="显示名称"
                        size="mini"
                        :disabled="dialogTitle == '查看'"
                      />
                    </div>
                    <div class="op">
                      <el-button
                        type="danger"
                        icon="el-icon-circle-close"
                        size="mini"
                        :disabled="dialogTitle == '查看'"
                        @click="deleteChildrenPoint(ele.list, index)"
                      />
                    </div>
                  </li>
                </ul>
              </div>
              <div
                v-else
                class="point"
              >
                <div class="li-div">
                  <div class="od">
                    <el-input
                      v-model="ele.od"
                      placeholder="顺序"
                      size="mini"
                      :disabled="dialogTitle == '查看'"
                    />
                  </div>
                  <div class="name">
                    {{ ele.an }}
                  </div>
                  <div class="ob">
                    <el-input
                      v-model="ele.cn"
                      placeholder="显示名称"
                      size="mini"
                      :disabled="dialogTitle == '查看'"
                    />
                  </div>
                  <div class="op">
                    <el-button
                      type="danger"
                      icon="el-icon-circle-close"
                      size="mini"
                      :disabled="dialogTitle == '查看'"
                      @click="deleteGroup(idx)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="dialogTitle != '查看'"
            class="tree-content-right"
          >
            <div class="checkAll">
              <el-input
                v-model="mh"
                style="width: 2rem; margin-right: 0.1rem"
                placeholder="模糊查询"
                type="text"
                size="mini"
              />
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="mhSearch"
                />
              </div>
            </div>
            <div class="checkboxs">
              <div
                v-for="(item, index) in points"
                :key="item.id"
                class="checkboxs-item"
                @dblclick="onCheckPoints(item, index)"
              >
                {{ item.sdtName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MyDialog>
    <!-- 遮罩层 -->
    <div
      v-if="dialogShow"
      class="mask"
    />
  </div>
</template>
<script>
import { getAllPlants, selectUnitCode } from '@/api/catalyzerConfigure.js'
import {
  addPoints,
  delPoints,
  editPoints,
  getPlace,
  getSubscribe,
  sdtPoints
} from '@/api/wsConfig.js'
import MyDialog from '@/components/MyDialog'
import { getSdtData } from '@/api/sdtConfig.js'
export default {
  components: { MyDialog },
  data() {
    return {
      dialogTitle: '新增',
      dialogShow: false,
      showCancel: true,
      subFix: '',
      ssCode: '',
      treeData: [],
      mh: '',
      checkedPoints: [],
      checkAll: false,
      points: [],
      showCheckboxs: false,
      cities: [],
      isIndeterminate: true,
      rowData: {},
      tableData: [],
      plant: '',
      plants: [],
      dialogPlants: [],
      unitList: [],
      dialogUnitList: [],
      unit: '',
      places: [],
      currentPage: 1,
      totalNum: 0,
      currentChildren: [],
      subFixs: ''
    }
  },
  watch: {},
  mounted() {
    this.getAllPlantsInfo()
    this.init()
    this.getPlaceData()
  },
  destroyed() { },
  methods: {
    //   查询电厂
    getAllPlantsInfo() {
      getAllPlants().then((res) => {
        const data = res.data
        this.dialogPlants = JSON.parse(JSON.stringify(data))
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
        this.dialogUnitList = []
        return
      }
      selectUnitCode({
        plant: value
      }).then((res) => {
        this.unitList = res.data
        this.dialogUnitList = res.data
      })
    },
    // 切换电厂查询机组
    changePlant(value) {
      this.unit = ''
      this.unitList = []
      this.getUnitList(value)
    },
    // 切换弹窗里的电厂查询机组
    changeDialogPlant(value) {
      this.dialogUnitList = []
      this.getUnitList(value)
    },
    // 分页查询表格数据
    init() {
      getSubscribe({
        pn: this.currentPage,
        ps: 10,
        plant: this.plant,
        unit: this.unit,
        ssCode: this.ssCode,
        subFix: this.subFix
      }).then((res) => {
        const { current, total, records } = res.data
        this.tableData = records
        this.currentPage = current
        this.totalNum = total
      })
    },
    // 查询所有点
    getAllPoints() {
      getSdtData({
        pn: 1,
        ps: 500,
        plant: this.rowData.plant,
        unit: this.rowData.unit
      }).then((res) => {
        this.points = res.data.records
      })
    },
    // 模糊查询
    mhSearch() {
      if (!this.rowData.plant) {
        return this.$message.info('请先选择电厂')
      } else if (!this.rowData.ssCode) {
        return this.$message.info('请先选择页面位置')
      }
      getSdtData({
        pn: 1,
        ps: 500,
        plant: this.rowData.plant,
        unit: this.rowData.unit,
        keyWords: this.mh
      }).then((res) => {
        this.points = res.data.records
      })
    },
    // 获取页面展示位置的列表
    getPlaceData() {
      getPlace('subscribe_ss').then((res) => {
        this.places = res.data
      })
    },
    // 添加分组
    addGroup() {
      if (!this.rowData.plant) {
        return this.$message.info('请先选择电厂')
      } else if (!this.rowData.ssCode) {
        return this.$message.info('请先选择页面位置')
      }
      const idx = this.treeData.length + 1
      this.treeData.push({
        cn: '',
        list: [],
        od: idx
      })
    },
    // 直接绑定点
    addPoint() {
      if (!this.rowData.plant) {
        return this.$message.info('请先选择电厂')
      } else if (!this.rowData.ssCode) {
        return this.$message.info('请先选择页面位置')
      }
      this.showCheckboxs = true
      this.currentChildren = this.treeData
      this.getAllPoints()
    },
    // 在分组下绑定点
    addGroupPoint(list) {
      this.currentChildren = list
      this.showCheckboxs = true
      this.getAllPoints()
    },
    // 删除分组或者直接绑定的点
    deleteGroup(idx) {
      this.treeData.splice(idx, 1)
    },
    // 删除分组下的绑定点
    deleteChildrenPoint(list, index) {
      list.splice(index, 1)
    },
    // 双击选中绑定点
    onCheckPoints(item, index) {
      this.points.splice(index, 1)
      const idx = this.currentChildren.length + 1
      const obj = {
        od: idx,
        an: item.an,
        gn: item.sdtCode,
        cn: item.sdtName,
        exps: item.cptExp
      }
      this.currentChildren.push(obj)
    },
    // 启用、停用
    onChangeState(row) {
      sdtPoints(row.id, Number(!row.isUse)).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.init()
    },
    // 点击新增按钮
    add() {
      this.dialogShow = true
      this.showCancel = true
      this.dialogTitle = '新增'
      this.treeData = []
      this.rowData = {}
    },
    // 查看记录
    onWatch(row) {
      this.dialogShow = true
      this.dialogTitle = '查看'
      this.showCancel = false
      this.treeData = row.points
      this.rowData = row
    },
    // 修改记录
    onEdit(row) {
      this.dialogShow = true
      this.dialogTitle = '修改'
      this.showCancel = true
      this.treeData = row.points
      this.rowData = row
      this.getUnitList(row.plant)
    },
    // 删除记录
    onDelete(row) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delPoints(row.id).then((res) => {
            if (res.code == 0) {
              this.$message.success('删除成功')
              this.init()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => { })
    },
    // 点击保存
    saveSettings() {
      if (!this.rowData.plant) {
        return this.$message.info('请先选择电厂')
      } else if (!this.rowData.ssCode) {
        return this.$message.info('请先选择页面位置')
      }
      if (this.dialogTitle == '新增') {
        addPoints({
          ssCode: this.rowData.ssCode,
          plant: this.rowData.plant,
          unit: this.rowData.unit,
          subFix: this.rowData.subFix,
          points: this.treeData
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('新增成功')
            this.dialogShow = false
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.dialogTitle == '修改') {
        editPoints({
          id: this.rowData.id,
          ssCode: this.rowData.ssCode,
          plant: this.rowData.plant,
          unit: this.rowData.unit,
          subFix: this.rowData.subFix,
          points: this.treeData
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('修改成功')
            this.dialogShow = false
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 点击确定
    onConfirm() {
      this.dialogShow = false
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
.my-dialog {
  .dialog-content {
    padding: 0.2rem 0.5rem;
    .nav {
      display: flex;
      margin-bottom: 0.1rem;
    }
    .btn {
      margin-bottom: 0.1rem;
    }
    .tree-content {
      height: 53vh;
      display: flex;
      justify-content: space-between;
      .tree-content-left {
        width: 49%;
        overflow: auto;
        border: 0.02rem dotted #55617c;
        border-radius: 0.1rem;
        padding: 0.1rem;
        .tree-content-box {
          .point {
            border-bottom: 0.01rem solid #55617c;
            margin-bottom: 0.1rem;
          }
          .group {
            border-bottom: 0.01rem solid #55617c;
            margin-bottom: 0.1rem;
            .group-head {
              display: flex;
              align-items: center;
              margin-bottom: 0.1rem;
              .od {
                width: 10%;
              }
              .name {
                width: 20%;
                text-align: center;
              }
              .group-btn {
                padding-left: 0.2rem;
              }
            }
            .group-ul {
              list-style: none;
            }
          }
          .li-div {
            display: flex;
            align-items: center;
            margin-bottom: 0.1rem;
            .od {
              width: 10%;
            }
            .name {
              width: 20%;
              text-align: center;
            }
            .ob {
              width: 50%;
              display: flex;
              align-items: center;
            }
            .op {
              width: 20%;
              text-align: center;
            }
          }
        }
      }
      .tree-content-right {
        width: 49%;
        border: 0.02rem dotted #55617c;
        border-radius: 0.1rem;
        padding: 0.1rem;
        .checkAll {
          width: 100%;
          margin-bottom: 0.2rem;
          display: flex;
          padding-left: 0.1rem;
        }
        .checkboxs {
          overflow: auto;
          height: calc(100% - 0.5rem);
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: space-between;
          .checkboxs-item {
            height: fit-content;
            margin: 0 0.1rem 0.1rem 0;
            border: 0.01rem solid #55617c;
            border-radius: 0.1rem;
            padding: 0.05rem;
            width: 46%;
            display: inline-block;
            font-size: 0.13rem;
            text-align: center;
            color: #4a9daa;
          }
          .checkboxs-item:hover {
            border: 0.01rem solid #63ecea;
            color: #ffffff;
          }
        }
        .checkboxs::-webkit-scrollbar {
          display: none;
        }
      }
      .tree-content-left::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
.dialog {
  width: 80%;
  height: 80%;
  margin-top: 5%;
  position: fixed;
  top: 0;
  left: 10%;
  z-index: 2000;
  background-color: #263553;
}

.custom-class {
  width: 0.16rem;
  height: 0.16rem;
  margin-right: 0.08rem;
}
.mask {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 7, 50, 0.7);
}
</style>
<style lang="scss">
.el-checkbox {
  color: #96979a;
}
.el-checkbox.is-bordered.is-checked {
  border-color: #63ecea;
}
.el-checkbox.is-checked .el-checkbox__label {
  color: #63ecea;
}
.el-checkbox:last-of-type {
  margin-right: 0.3rem;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
</style>
