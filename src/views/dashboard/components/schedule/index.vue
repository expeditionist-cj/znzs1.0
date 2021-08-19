<template>
  <div class="schedule">
    <Block>
      <div slot="title">排班情况</div>
      <div class="block" slot="content">
        <div class="table-box">
          <el-table
            size="mini"
            style="width: 100%"
            :data="tableData"
            :header-cell-style="{
              background: 'rgb(65,136,150)',
              color: 'rgba(255,255,255,0.7)',
            }"
            border
            height="181px"
          >
            <el-table-column label="班次" min-width="100" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.shiftName +
                    " (" +
                    scope.row.sdt +
                    " ~ " +
                    scope.row.edt +
                    ")"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="yesterday"
              label="昨天"
              min-width="60"
              align="center"
            >
            </el-table-column>
            <el-table-column label="今天" min-width="60" align="center">
              <template slot-scope="scope">
                <div
                  style="
                    background: rgba(240, 176, 18, 0.8);
                    color: #2e2e2f;
                    border-radius: 0.02rem;
                  "
                >
                  {{ scope.row.today }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="tomorrow"
              label="明天"
              min-width="60"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </Block>
  </div>
</template>

<script>
import { getSchedule } from "@/api/dashboard";
import Block from "../Block";
import moment from "moment";
import { mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      today: moment().format("YYYY-MM-DD"),
      yesterday: moment().add(-1, "days").format("YYYY-MM-DD"),
      tomorrow: moment().add(1, "days").format("YYYY-MM-DD"),
    };
  },
  components: { Block },

  created() {},
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      plantCode: (state) => state.user.plantCode,
    }),
  },
  watch: {
    plantCode(value) {
      this.init();
    },
  },
  methods: {
    init() {
      getSchedule({
        plant: this.plantCode,
        date: this.today,
      }).then((res) => {
        let data = res.data;
        if (data) {
          data.forEach((ele) => {
            if (ele.arrang.length > 0) {
              let arr = ele.arrang;
              arr.forEach((item) => {
                if (item.day == this.yesterday) {
                  ele.yesterday = item.team;
                } else if (item.day == this.today) {
                  ele.today = item.team;
                } else if (item.day == this.tomorrow) {
                  ele.tomorrow = item.team;
                }
              });
            }
          });
          this.tableData = data;
        } else {
          this.tableData = [];
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.schedule {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
  .block {
    height: 100%;
    .img-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .table-box {
      padding: 0.2rem 0.1rem;
    }
  }
}
</style>
<style lang="scss" >
.el-table td,
.el-table th.is-leaf,
.el-table--border,
.el-table--group {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.7);
}
</style>
