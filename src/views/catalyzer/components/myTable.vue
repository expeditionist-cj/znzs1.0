<template>
  <div class="my-table-container">
    <table
      class="my-table"
      :class="{ width100: tableData.length > 0 }"
      border="1"
      cellspacing="0"
      cellpadding="5px"
    >
      <thead>
        <tr>
          <th
            class="head-center"
            rowspan="2"
            width="200px"
          >项目</th>
          <th
            class="head-center"
            rowspan="2"
            width="200px"
          >属性</th>
          <th
            class="head-center"
            rowspan="2"
            width="150px"
          >单位</th>
          <th
            v-for="(item, index) in tableData"
            :key="index"
            class="head-center"
            :colspan="item.floorParam.length"
          >
            {{ item.reactor }}侧
          </th>
        </tr>
        <tr>
          <template v-for="itm in tableData">
            <td
              v-for="(item, index) in itm.floorParam"
              :key="itm.id+ '_'+index"
              class="head-center"
            >
              第{{ index + 1 }}层
            </td>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td :rowspan="8">催化剂基础信息</td>
          <td>生产厂家</td>
          <td>-</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.brand }}
            </td>
          </template>
        </tr>
        <tr>
          <td>规格</td>
          <td>孔</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.specs }}
            </td>
          </template>
        </tr>
        <tr>
          <td>体积</td>
          <td>m³</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.volume }}
            </td>
          </template>
        </tr>
        <tr>
          <td>初始活性</td>
          <td>Nm/h</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.initialActivity }}
            </td>
          </template>
        </tr>
        <tr>
          <td>初装日期</td>
          <td>-</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.installTime ? moment(item.installTime).format("YYYY-MM-DD") : '--' }}
            </td>
          </template>
        </tr>
        <tr>
          <td>设计寿命</td>
          <td>h</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.designLife }}
            </td>
          </template>
        </tr>
        <tr>
          <td>每层模块数</td>
          <td>组</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item.blockNum }}
          </td>
        </tr>
        <tr>
          <td>每模块根数</td>
          <td>根</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item.barNum }}
          </td>
        </tr>

        <tr>
          <td :rowspan="7">催化剂使用信息</td>
          <td>更换日期</td>
          <td>-</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.changeTime }}
            </td>
          </template>
        </tr>
        <tr>
          <td>累计使用时间</td>
          <td>h</td>
          <template v-for="(itm, idx) in tableData">
            <td
              v-for="item in tableData[idx].floorParam"
              :key="itm.id + '_' + item.id"
            >
              {{ item.usageTime }}
            </td>
          </template>
        </tr>
        <tr>
          <td>实际活性</td>
          <td>Nm/h</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"]
                ? item["attRtData"].activity
                  ? item["attRtData"].activity.toFixed(2) || "-"
                  : "-"
                : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>活性偏差</td>
          <td>%</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].activifyDiff || "-" : "-"
            }}
          </td>
        </tr>
        <!-- <tr>
          <td>年检时间</td>
          <td>-</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item.checkTime
            }}
          </td>
        </tr> -->
        <tr>
          <td>催化剂预测使用寿命</td>
          <td>h</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item["attRtData"] ? item["attRtData"].lifeTime || "-" : "-" }}
          </td>
        </tr>
        <tr>
          <td>催化剂差压</td>
          <td>Pa</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].pressureDiff || "-" : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>建议</td>
          <td>-</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item["attRtData"] ? item["attRtData"].suggestion || "-" : "-" }}
          </td>
        </tr>
        <tr>
          <td :rowspan="3">反应器设计信息</td>
          <td>设计效率</td>
          <td>%</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item.designEff }}
          </td>
        </tr>

        <tr>
          <td>设计最低喷氨温度</td>
          <td>℃</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item.dsgLowNh3Tmpr }}
          </td>
        </tr>
        <tr>
          <td>设计反应器喷氨量</td>
          <td>kg/h</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item.dsgReactorNh3Mnt }}
          </td>
        </tr>
        <tr>
          <td :rowspan="7">反应器使用信息</td>
          <td>入口NOX浓度</td>
          <td>mg/Nm³</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].inNox.toFixed(2) || "-" : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>出口NOX浓度</td>
          <td>mg/Nm³</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].outNox.toFixed(2) || "-" : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>入口烟气流量</td>
          <td>KNm³/h</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].smkFlow.toFixed(2) || "-" : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>实际喷氨量</td>
          <td>Kg/h</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"]
                ? item["attRtData"].nh3Mnt
                  ? item["attRtData"].nh3Mnt.toFixed(2) || "-"
                  : "-"
                : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>喷氨量偏差</td>
          <td>%</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{ item["attRtData"] ? item["attRtData"].nh3Diff || "-" : "-" }}
          </td>
        </tr>
        <tr>
          <td>实际氨氮摩尔比</td>
          <td>-</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"] ? item["attRtData"].rlNh3NMolRate || "-" : "-"
            }}
          </td>
        </tr>
        <tr>
          <td>反应器潜能</td>
          <td>-</td>
          <td
            v-for="(item, index) in tableData"
            :key="index"
            :colspan="item.floorParam.length"
          >
            {{
              item["attRtData"]
                ? item["attRtData"].potential
                  ? item["attRtData"].potential.toFixed(2) || "-"
                  : "-"
                : "-"
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.my-table-container {
  height: 7rem;
  overflow-y: scroll;

  .my-table {
    // width: 100%;
    height: 100%;
    thead tr > th {
      position: sticky;
      top: 0;
      z-index: 2;
    }
    thead tr > td {
      position: sticky;
      top: 0.3rem;
      z-index: 2;
    }

    .head-center {
      text-align: center;
      background-color: #1e7a9a;
    }
  }
  .width100 {
    width: 100%;
  }
}
</style>
