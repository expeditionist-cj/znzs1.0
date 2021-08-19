<template>
  <div class="job-log">
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :option="tableOption"
      @on-load="getList"
      @refresh-change="refreshChange"
      @search-change="handleFilter"
      @search-reset="handleSearchReset"
    >
      <template slot-scope="scope" slot="jobLogStatus">
        <div v-if="scope.row.jobLogStatus == 0">
          <el-tag type="success">{{
            getDicNameJobExecuteStatus(scope.row.jobLogStatus)
          }}</el-tag>
        </div>
        <div v-else>
          <el-tag type="danger">{{
            getDicNameJobExecuteStatus(scope.row.jobLogStatus)
          }}</el-tag>
        </div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { fetchList } from "@/api/quartz.js";
import { tableOption } from "./util";

export default {
  name: "job-log",
  data() {
    return {
      queryParams: [], //全局检索条件
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
      },
      tableOption: tableOption,
      JobExecuteStatusDicCache: [],
    };
  },
  created() {},
  mounted: function () {
    this.getDicNameCache(); //获取定时任务运行时状态
  },
  computed: {},
  methods: {
    getList(page) {
      fetchList(
        Object.assign(
          {
            descs: "create_time",
            current: page.currentPage,
            size: page.pageSize,
          },
          this.queryParams
        )
      ).then((response) => {
        this.tableData = response.data.records;
        this.page.pageSize = response.data.pageSize;
        this.page.total = response.data.total;
      });
    },
    /**
     * 清除全局检索条件
     */
    handleSearchReset() {
      this.queryParams = [];
    },
    /**
     * 检索查询
     */
    handleFilter(params) {
      console.log(params,1999);
      // this.queryParams = this.filterForm(params);
      this.getList(this.page);
    },
    /**
     * 刷新回调
     */
    refreshChange() {
      this.getList(this.page);
    },
    /**
     * 获取字典显示名称并缓存
     */
    getDicNameCache(type) {
      // remote(type).then((response) => {
      //   let code = response.data.code;
      //   if (code == 0) {
      //     let _data = response.data.data;
      //     this.JobExecuteStatusDicCache = _data;
      //   }
      // });
      let dict = [
        {
          value: "0",
          label: "正常",
        },
        {
          value: "1",
          label: "异常",
        },
      ];
      this.JobExecuteStatusDicCache = dict;
    },
    /**
     * 获取字典显示名称并缓存
     */
    getDicNameJobExecuteStatus(value) {
      let re = "";  
      this.JobExecuteStatusDicCache.forEach((obj) => {
        if (obj.value == value) {
          re = obj.label; 
        }
      });  
      return re;
    },
  },
};
</script>

<style lang="scss" >
.job-log {
  height: 100%;
  background: url("../../assets/images/border.png") no-repeat center;
  background-size: 100% 100%;
  padding: 0.3rem;
}
.avue-crud__menu,
.avue-crud .el-table th,
.el-table th,
.el-table tr {
  background: transparent;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: transparent;
}
.avue-crud .el-table th {
  color: #ffffff;
}
.avue-form__menu {
  width: auto;
}
.el-collapse-item__wrap,
.el-collapse {
  background: transparent;
  border: 0;
  border-color: transparent;
}
.avue-form__group,
.el-collapse-item__content {
  display: flex;
  align-items: center;
}
</style>
