<template>
  <div class="startStopView">
    <div class="title">机组启停状态</div>
    <el-table
      :data="tableData"
      height="6rem"
      style="width: 100%"
      size="mini"
      border
    >
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="plant_cn" label="项目" align="center">
      </el-table-column>
      <el-table-column prop="unit_cn" label="机组" align="center">
      </el-table-column>
      <el-table-column label="启停状态" align="center">
        <template slot-scope="scope">
          <div
            :style="{ color: !Number(scope.row.status) ? 'red' : '#2cf37d' }"
          >
            {{ Number(scope.row.status) ? "启" : "停" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button @click="onWatch(scope.row)" type="text" size="small">
            <svg-icon icon-class="watch" class-name="custom-class"></svg-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗框 -->
    <MyDialog
      :title="dialogTitle"
      v-show="dialogShow"
      @closeSettings="dialogShow = false" 
      class="my-dialog"
      :showCancel="showCancel"
      @onConfirm="onConfirm"
    >
      <div slot="content" class="dialog-content clearfix">
        <div class="dialog-text">
          <span>项目：{{ rowData.plant_cn }}</span>

          <span>机组：{{ rowData.unit_cn }}</span>
        </div>
        <el-table :data="rowTableData" size="mini" border>
          <el-table-column type="index" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="stime" label="启机时间" align="center">
          </el-table-column>
          <el-table-column prop="etime" label="停机时间" align="center">
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalNum"
          >
          </el-pagination>
        </div>
      </div>
    </MyDialog>
    <!-- 遮罩层 -->
    <div class="mask" v-if="dialogShow"></div>
  </div>
</template>
<script>
import MyUpload from "@/components/myUpload";
import MyDialog from "@/components/MyDialog";
import { getStartStopData, getStartStopRecord } from "@/api/startStopView.js";
export default {
  data() {
    return {
      dialogShow: false,
      showCancel: true,
      dialogTitle: "启停记录",
      tableData: [],
      rowTableData: [],
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      rowData: {},
    };
  },
  components: { MyUpload, MyDialog },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    // 初始化查询
    init() {
      // 查询表格数据
      getStartStopData().then((res) => {
        this.tableData = res.data;
      });
    },
    // 查看记录
    onWatch(row) {
      this.rowData = row;
      this.dialogShow = true;
      getStartStopRecord({
        plantCode: this.rowData.plant_code,
        unitCode: this.rowData.unit_code,
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        this.rowTableData = res.data.records;
        this.totalNum = res.data.total;
        this.currentPage = res.data.current;
      });
    },
    // 点击确定
    onConfirm() {
      this.dialogShow = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      getStartStopRecord({
        plantCode: this.rowData.plant_code,
        unitCode: this.rowData.unit_code,
        current: this.currentPage,
        size: this.pageSize,
      }).then((res) => {
        this.rowTableData = res.data.records;
        this.totalNum = res.data.total;
        this.currentPage = res.data.current;
      });
    },
  },
  destroyed() {},
};
</script>
<style lang="scss" scoped>
.startStopView {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  .title {
    padding: 0 0 0.2rem 0.2rem;
    font-size: 0.2rem;
    color: #52ebee;
  }

  .my-dialog {
    height: 6rem;
    .dialog-text {
      padding: 0 0 0.2rem 0.2rem;
      font-size: 0.16rem;
      color: #52ebee;
      span {
        display: inline-block;
        margin-right: 0.3rem;
      }
    }
     
    .dialog-content {
      padding: 0.2rem 0.5rem;
      height: 75%;
      .page {
        height: 0.5rem;
        line-height: 0.6rem;
        text-align: right;
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
 