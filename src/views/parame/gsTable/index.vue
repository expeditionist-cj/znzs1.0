<template>
  <div>
    <div class="content">
      <el-table
        max-height="50vh"
        :data="tableData"
        height="400"
        border
        style="width: 100%; overflow: auto"
      >
        <el-table-column
          align="center"
          prop="name"
          label="公式名称"
          min-width="180"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{ scope.row.crName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="aliasName"
          label="公式配置"
          min-width="400"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{
              scope.row.cptExpress
                ? scope.row.crCode + "=" + scope.row.cptExpress
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="区间统计方法"
          min-width="80"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{
              staticOpt[scope.row.cptType]
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="aliasName"
          label="计算维度"
          min-width="80"
        >
          <template slot-scope="scope">
            <span style="cursor: pointer">{{
              mathOpt[scope.row.cptMethod]
            }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
import { getSelSdtPoints, getIstEps } from "@/api/alg";
import { mapState } from "vuex"; // 引入vuex state
export default {
  data() {
    return {
      tableData: [],
      mathOpt: {
        tm_over: "整体",
        tm_hr: "小时",
      },
      staticOpt: {
        sum: "和值",
        avg: "均值",
      },
    };
  },
  computed: {
    ...mapState({
      addInstanceId: (state) => state.backend.addInstanceId,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 查询公式
      getIstEps(this.addInstanceId).then((res) => {
        let data = res.data.data || [];
        let arry = [];
        data.forEach((item) => {
          arry.push(item);
          if (item.children != null && item.children.length > 0) {
            item.children.forEach((ele) => {
              arry.push(ele);
            });
          }
        });
        console.log(arry);
        this.tableData = arry;
      });
    },
  },
};
</script>