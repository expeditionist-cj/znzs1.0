<template>
  <div class="mj">
    <div class="mj-left">
      <div class="mj-item" v-for="item in data" :key="item.k">
        <span class="mj-span">{{ item.label }}</span>
        <el-input
          size="small"
          class="mj-input"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          v-model="item.value"
        ></el-input>
        <el-button
          size="small"
          class="mj-btn"
          type="primary"
          plain
          @click="onMath(item)"
        >
          转换
        </el-button>
      </div>
      <div class="mj-reset">
        <el-button
          size="small"
          class="mj-btn"
          type="danger"
          plain
          @click="doReset"
        >
          一键清空
        </el-button>
      </div>
    </div>
    <div class="mj-right">
      <div class="mj-text">
        1平方公里=1平方千米 <br />
        1平方千米 =1000000平方米 <br />
        1平方米＝10000平方厘米 <br />
        1平方厘米＝100平方毫米 <br />
        1公倾＝10000平方米 <br />
        1平方公里＝100公顷 <br />
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd, subtr, accMul, accDiv } from "../calc.js";
export default {
  data() {
    return {
      data: [
        {
          label: "平方千米（km²）",
          value: "",
          k: "km1",
        },
        {
          label: "平方公里（km²）",
          value: "",
          k: "km2",
        },

        {
          label: "平方米（m²）",
          value: "",
          k: "m2",
        },
        {
          label: "平方分米（dm²）",
          value: "",
          k: "dm2",
        },
        {
          label: "平方厘米（cm²）",
          value: "",
          k: "cm2",
        },
        {
          label: "平方毫米（mm²）",
          value: "",
          k: "mm2",
        },
        {
          label: "公顷（ha）",
          value: "",
          k: "ha",
        },
        {
          label: "亩",
          value: "",
          k: "m",
        },
        {
          label: "分",
          value: "",
          k: "f",
        },
      ],
    };
  },
  methods: {
    onMath(item) {
      let data = JSON.parse(JSON.stringify(this.data));
      let key = item.k; //当前选择的要转换的初始值的标识
      if (isNaN(Number(item.value))) {
        return;
      } else {
        switch (key) {
          case "m2":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = item.value;
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 1000 * 1000);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 1000 * 1000);
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 1000 * 1000);
                  break;
                case "cm2":
                  ele.value = accMul(item.value, 1000 * 10);
                  break;
                case "dm2":
                  ele.value = accMul(item.value, 100);
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "m":
                  ele.value = accMul(item.value, 15 / 10000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 15 / 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "km1":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accMul(item.value, 1000 * 1000);
                  break;
                case "km1":
                  ele.value = item.value;
                  break;
                case "km2":
                  ele.value = item.value;
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 1000 * 1000);
                  break;
                case "cm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 1000 * 10);
                  break;
                case "dm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 100);
                  break;
                case "ha":
                  ele.value = accMul(item.value, 100);
                  break;
                case "m":
                  ele.value = accMul(item.value, 1500);
                  break;
                case "f":
                  ele.value = accMul(item.value, 15 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "km2":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accMul(item.value, 1000 * 1000);
                  break;
                case "km1":
                  ele.value = item.value;
                  break;
                case "km2":
                  ele.value = item.value;
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 1000 * 1000);
                  break;
                case "cm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 1000 * 10);
                  break;
                case "dm2":
                  ele.value = accMul(item.value, 1000 * 1000 * 100);
                  break;
                case "ha":
                  ele.value = accMul(item.value, 100);
                  break;
                case "m":
                  ele.value = accMul(item.value, 1500);
                  break;
                case "f":
                  ele.value = accMul(item.value, 15 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "mm2":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accDiv(item.value, 1000 * 1000);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 1000 * 1000 * 1000 * 1000);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 1000 * 1000 * 1000 * 1000);
                  break;
                case "mm2":
                  ele.value = item.value;
                  break;
                case "cm2":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "dm2":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 1000 * 1000 * 10000);
                  break;
                case "m":
                  ele.value = accDiv(
                    accMul(item.value, 15),
                    1000 * 1000 * 10000
                  );
                  break;
                case "f":
                  ele.value = accDiv(
                    accMul(item.value, 15),
                    1000 * 1000 * 1000
                  );
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "cm2":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accDiv(item.value, 1000 * 10);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 1000 * 1000 * 1000 * 10);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 1000 * 1000 * 1000 * 10);
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 100);
                  break;
                case "cm2":
                  ele.value = item.value;
                  break;
                case "dm2":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 1000 * 1000 * 100);
                  break;
                case "m":
                  ele.value = accDiv(accMul(item.value, 15), 1000 * 1000 * 10);
                  break;
                case "f":
                  ele.value = accDiv(accMul(item.value, 15), 1000 * 1000);
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "dm2":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 1000 * 1000 * 100);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 1000 * 1000 * 100);
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 10 * 1000);
                  break;
                case "cm2":
                  ele.value = accMul(item.value, 100);
                  break;
                case "dm2":
                  ele.value = item.value;
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 100 * 10000);
                  break;
                case "m":
                  ele.value = accDiv(accMul(item.value, 15), 100 * 10000);
                  break;
                case "f":
                  ele.value = accDiv(accMul(item.value, 15), 100 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "ha":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "mm2":
                  ele.value = accMul(item.value, 10000 * 1000 * 1000);
                  break;
                case "cm2":
                  ele.value = accMul(item.value, 100 * 1000 * 1000);
                  break;
                case "dm2":
                  ele.value = accMul(item.value, 10000 * 100);
                  break;
                case "ha":
                  ele.value = item.value;
                  break;
                case "m":
                  ele.value = accMul(item.value, 15);
                  break;
                case "f":
                  ele.value = accMul(item.value, 10 * 15);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "m":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accDiv(accMul(item.value, 10000), 15);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 15 * 100);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 15 * 100);
                  break;
                case "mm2":
                  ele.value = accDiv(
                    accMul(item.value, 10000 * 1000 * 1000),
                    15
                  );
                  break;
                case "cm2":
                  ele.value = accDiv(accMul(item.value, 100 * 1000 * 1000), 15);
                  break;
                case "dm2":
                  ele.value = accDiv(accMul(item.value, 10000 * 100), 15);
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 15);
                  break;
                case "m":
                  ele.value = item.value;
                  break;
                case "f":
                  ele.value = accMul(item.value, 10);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;

          case "f":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m2":
                  ele.value = accDiv(accMul(item.value, 1000), 15);
                  break;
                case "km1":
                  ele.value = accDiv(item.value, 15 * 1000);
                  break;
                case "km2":
                  ele.value = accDiv(item.value, 15 * 1000);
                  break;
                case "mm2":
                  ele.value = accDiv(
                    accMul(item.value, 1000 * 1000 * 1000),
                    15
                  );
                  break;
                case "cm2":
                  ele.value = accDiv(accMul(item.value, 10 * 1000 * 1000), 15);
                  break;
                case "dm2":
                  ele.value = accDiv(accMul(item.value, 1000 * 100), 15);
                  break;
                case "ha":
                  ele.value = accDiv(item.value, 15 * 10);
                  break;
                case "m":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "f":
                  ele.value = item.value;
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;

          default:
            break;
        }
      }
    },
    doReset() {
      this.data = [
        {
          label: "平方千米（km²）",
          value: "",
          k: "km1",
        },
        {
          label: "平方公里（km²）",
          value: "",
          k: "km2",
        },

        {
          label: "平方米（m²）",
          value: "",
          k: "m2",
        },
        {
          label: "平方分米（dm²）",
          value: "",
          k: "dm2",
        },
        {
          label: "平方厘米（cm²）",
          value: "",
          k: "cm2",
        },
        {
          label: "平方毫米（mm²）",
          value: "",
          k: "mm2",
        },
        {
          label: "公顷（ha）",
          value: "",
          k: "ha",
        },
        {
          label: "亩",
          value: "",
          k: "m",
        },
        {
          label: "分",
          value: "",
          k: "f",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.mj {
  padding: 0.2rem 0;
  display: flex;
  .mj-left {
    width: 50%;
    .mj-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0.5rem;

      .mj-span {
        width: 3rem;
        text-align: right;
        font-size: 0.15rem;
      }
      .mj-input {
        margin: 0.2rem;
      }
      .mj-btn {
        margin: 0 0.2rem 0 0;
      }
    }
    .mj-reset {
      text-align: right;
      padding-right: 0.2rem;
      margin-top: 0.1rem;
    }
  }
  .mj-right {
    width: 50%;
    height: 100%;
    .mj-text {
      font-size: 0.14rem;
      line-height: 0.3rem;
      text-align: left;
      padding: 0.2rem 0 0 0.5rem;
      color: #486077;
    }
  }
}
</style>