<template>
  <div class="sdtConfig">
    <div class="nav">
      <div class="ipt">
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
        >
          <el-option
            v-for="item in unitList"
            :key="item.deviceCode"
            :label="item.deviceName"
            :value="item.deviceCode"
          />
        </el-select>
        <span class="text">点名：</span>
        <el-input
          v-model="sdtName"
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
        >查询</el-button>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 0.1rem"
          @click="add"
        >新增测点</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload2"
          style="margin-left: 0.1rem"
          @click="importExcelDialogVisible = true"
        >导入</el-button>
        <el-button
          :loading="downloadLoading"
          type="primary"
          size="small"
          icon="el-icon-download"
          @click="downloadExcel"
        >模板下载</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" height="6rem" style="width: 100%" border>
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="plantName" label="项目" align="center" />
        <el-table-column prop="unitName" label="机组" align="center" />
        <el-table-column prop="an" label="别名" align="center" />
        <el-table-column prop="sdtName" label="标准点名" align="center" />
        <el-table-column prop="sdtCode" label="标准码" align="center" />
        <el-table-column prop="oldName" label="原始点名" align="center" />
        <el-table-column prop="oldCode" label="原始码" align="center" />
        <el-table-column label="点类型" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.sdtType == "calc"
                  ? "计算点"
                  : scope.row.sdtType == "bind"
                    ? "绑定点"
                    : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="计算绑定类型" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.pointValType == "ist"
                  ? "瞬时值"
                  : scope.row.pointValType == "cml"
                    ? "累计值"
                    : ""
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onWatch(scope.row)">
              <svg-icon icon-class="watch" class-name="custom-class" />
            </el-button>
            <el-button type="text" size="small" @click="onEdit(scope.row)">
              <svg-icon icon-class="edit" class-name="custom-class" />
            </el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row)">
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
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 导入excel弹框提示 -->
    <MyUpload
      ref="myUpload"
      :submit-loading="submitLoading"
      :import-excel-dialog-visible="importExcelDialogVisible"
      @submitUpload="submitUpload"
      @changeImportExcelDialogVisible="changeImportExcelDialogVisible"
    />
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
      <div slot="content" class="dialog-content clearfix">
        <div class="content-nav">
          <div class="text">
            <span class="title">项目</span><span class="redFont">*</span>
          </div>
          <el-select
            v-if="showCancel"
            v-model="rowData.plant"
            size="small"
            :disabled="isDisable"
            placeholder="请选择"
            @change="changeDialogPlant"
          >
            <el-option
              v-for="(item, index) in dialogPlants"
              :key="index"
              :label="item.name"
              :value="item.deptCode"
            />
          </el-select>
          <el-input
            v-if="!showCancel"
            v-model="rowData.plantName"
            style="width: 1.5rem"
            size="small"
            :disabled="isDisable"
          />
          <div class="text">
            <span class="title">机组</span><span class="redFont" />
          </div>
          <el-select
            v-if="showCancel"
            v-model="rowData.unit"
            size="small"
            :disabled="isDisable"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in dialogUnitList"
              :key="index"
              :label="item.deviceName"
              :value="item.deviceCode"
            />
          </el-select>
          <el-input
            v-if="!showCancel"
            v-model="rowData.unitName"
            style="width: 1.5rem"
            size="small"
            :disabled="isDisable"
          />
          <div class="text">
            <span class="title">点类型</span><span class="redFont">*</span>
          </div>
          <el-select
            v-model="rowData.sdtType"
            size="small"
            placeholder="请选择"
            :disabled="isDisable"
            @change="changeSdtType"
          >
            <el-option
              v-for="item in sdtTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div v-if="sdtType == 'calc'" class="content-nav">
          <div class="text">
            <span class="title">公式</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.cptExp"
            class="text-area"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            :disabled="isDisable"
          />
        </div>
        <div class="content-nav">
          <div class="text">
            <span class="title">标准名称</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.sdtName"
            class="ipt"
            :disabled="isDisable"
            size="small"
          />
          <div class="text">
            <span class="title">标准编码</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.sdtCode"
            :disabled="isDisable"
            size="small"
          />
        </div>
        <div v-if="sdtType == 'bind'" class="content-nav">
          <div class="text">
            <span class="title">原始点名</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.oldName"
            class="ipt"
            :disabled="isDisable"
            size="small"
          />
          <div class="text">
            <span class="title">原始码</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.oldCode"
            :disabled="isDisable"
            size="small"
          />
        </div>
        <div class="content-nav">
          <div class="text">
            <span class="title">量纲</span><span class="redFont">*</span>
          </div>
          <el-input
            v-model="rowData.dimension"
            class="ipt"
            :disabled="isDisable"
            size="small"
          />
          <div class="text">
            <span class="title">缩放</span><span class="redFont" />
          </div>
          <el-input
            v-model="rowData.scaling"
            :disabled="isDisable"
            size="small"
          />
        </div>
        <div class="content-nav">
          <div class="text">
            <span class="title">上限</span><span class="redFont" />
          </div>
          <el-input
            v-model="rowData.upLimit"
            class="ipt"
            :disabled="isDisable"
            size="small"
          />
          <div class="text">
            <span class="title">下限</span><span class="redFont" />
          </div>
          <el-input
            v-model="rowData.lowLimit"
            :disabled="isDisable"
            size="small"
          />
        </div>
        <div class="content-nav">
          <div class="text">
            <span class="title">值类型</span><span class="redFont">*</span>
          </div>
          <el-select
            v-model="rowData.pointValType"
            size="small"
            class="select-width"
            placeholder="请选择"
            :disabled="isDisable"
          >
            <el-option
              v-for="item in pointValTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="text">
            <span class="title">统计方式</span><span class="redFont">*</span>
          </div>
          <el-select
            v-model="rowData.cptType"
            size="small"
            class="select-width"
            :disabled="isDisable"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cptTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </MyDialog>
    <!-- 遮罩层 -->
    <div v-if="dialogShow" class="mask" />
  </div>
</template>
<script>
import { getAllPlants, selectUnitCode } from '@/api/catalyzerConfigure.js'
import MyUpload from '@/components/myUpload'
import MyDialog from '@/components/MyDialog'
import { addSdt, delSdt, getSdtData, mdfSdt, uploadSdt } from '@/api/sdtConfig.js'
export default {
  components: { MyUpload, MyDialog },
  data() {
    return {
      pointValTypes: [
        {
          value: 'ist',
          label: '瞬时值'
        },
        {
          value: 'cml',
          label: '累计值'
        }
      ],
      cptTypes: [
        {
          value: 'sum',
          label: '小时累计'
        },
        {
          value: 'avg',
          label: '小时平均'
        }
      ],
      sdtTypes: [
        {
          value: 'calc',
          label: '计算点'
        },
        {
          value: 'bind',
          label: '绑定点'
        }
      ],
      sdtType: 'calc',
      dialogShow: false,
      showCancel: true,
      dialogTitle: '新增',
      downloadLoading: false,
      importExcelDialogVisible: false,
      submitLoading: false,
      sdtName: '',
      rowData: {},
      tableData: [],
      plant: '',
      plants: [],
      dialogPlants: [],
      unitList: [],
      unit: '',
      dialogUnitList: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      isDisable: false
    }
  },
  watch: {},
  mounted() {
    this.getAllPlantsInfo()
    this.init()
  },
  destroyed() {},
  methods: {
    submitUpload(formData) {
      this.submitLoading = true
      this.$refs.myUpload.clearFils() // 清空已上传的文件
      uploadSdt(formData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('上传成功！')
            this.submitLoading = false
            this.importExcelDialogVisible = false
            this.$refs.myUpload.clearFils() // 清空已上传的文件
            this.init()
          } else {
            this.submitLoading = false
            this.$message.error(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.submitLoading = false
          this.$message.error('上传失败')
        })
    },
    changeImportExcelDialogVisible(value) {
      this.importExcelDialogVisible = value
    },
    downloadExcel() {
      window.location.href = '/template/标准化点配置表模板.xlsx'
    },
    //   查询电厂
    getAllPlantsInfo() {
      getAllPlants().then((res) => {
        const data = res.data
        this.dialogPlants = data
        const plants = JSON.parse(JSON.stringify(res.data))
        plants.unshift({
          name: '所有项目',
          deptCode: ''
        })
        this.plants = plants
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
    // 弹框中根据电厂查询机组
    getDialogUnitList(value) {
      if (!value) {
        this.dialogUnitList = []
        return
      }
      selectUnitCode({
        plant: value
      }).then((res) => {
        this.dialogUnitList = res.data
      })
    },
    // 切换电厂查询机组
    changePlant(value) {
      this.unit = ''
      this.unitList = []
      this.getUnitList(value)
    },
    // 弹框中切换电厂查询机组
    changeDialogPlant(value) {
      this.dialogUnitList = []
      this.getDialogUnitList(value)
    },
    // 初始化查询
    init() {
      // 分页查询表格数据
      getSdtData({
        pn: this.currentPage,
        ps: this.pageSize,
        plant: this.plant,
        unit: this.unit,
        sdtName: this.sdtName
      }).then((res) => {
        const { size, total, current, records } = res.data
        this.tableData = records
        this.pageSize = size
        this.totalNum = total
        this.currentPage = current
      })
    },
    // 弹框中切换点类型
    changeSdtType(value) {
      this.sdtType = value
    },
    // 新增记录
    add() {
      this.dialogTitle = '新增'
      this.dialogShow = true
      this.isDisable = false
      this.showCancel = true
      this.rowData = {}
    },
    // 点击保存
    saveSettings() {
      const rowData = JSON.parse(JSON.stringify(this.rowData))
      if (this.dialogTitle == '新增') {
        addSdt(rowData).then((res) => {
          if (res.code == '0') {
            this.$message.success('新增成功!')
            this.dialogShow = false
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.dialogTitle == '修改') {
        mdfSdt(rowData).then((res) => {
          if (res.code == '0') {
            this.$message.success('修改成功!')
            this.init()
            this.dialogShow = false
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 查看记录
    onWatch(row) {
      this.dialogTitle = '查看'
      this.dialogShow = true
      this.rowData = row
      this.isDisable = true
      this.showCancel = false
    },
    // 修改记录
    onEdit(row) {
      console.log(row, 1212)
      this.dialogTitle = '修改'
      this.dialogShow = true
      this.rowData = row
      this.isDisable = false
      this.showCancel = true
      this.getDialogUnitList(row.plant)
    },
    onDelete(row) {
      delSdt(row.id).then((res) => {
        if (res.code == '0') {
          this.$message.success('删除成功!')
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点击确定
    onConfirm() {
      this.dialogShow = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.sdtConfig {
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
  .table {
    padding-top: 0.22rem;
  }
  .page {
    height: 0.5rem;
    line-height: 0.6rem;
    text-align: right;
  }
  .my-dialog {
    height: 6rem;
    .dialog-content {
      margin-top: 0.3rem !important;
      padding-left: 1rem;
      height: 75%;
      .content-nav {
        width: 80%;
        padding-right: 1rem;
        display: flex;
        align-items: center;
        margin-bottom: 0.2rem;
        .text {
          display: flex;
          margin-right: 0.02rem;
          .title {
            width: 0.8rem;
            display: inline-block;
            text-align: right;
          }
          .redFont {
            width: 0.1rem;
            color: red;
            display: inline-block;
          }
        }
        .el-select {
          margin-right: 0;
        }
        .select-width {
          width: 2.8rem;
        }
      }
    }
  }
}
.dialog {
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
<style lang="scss" >
.el-textarea__inner {
  text-indent: 0;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: #122344 !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}
</style>

