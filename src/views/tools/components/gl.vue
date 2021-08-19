<template>
  <div class="gl">
    <div class="gl-left">
      <div class="gl-item" v-for="item in data" :key="item.k">
        <span class="gl-span">{{ item.label }}</span>
        <el-input
          size="small"
          class="gl-input"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          v-model="item.value"
        ></el-input>
        <el-button
          size="small"
          class="gl-btn"
          type="primary"
          plain
          @click="onMath(item)"
        >
          转换
        </el-button>
      </div>
      <div class="gl-reset">
        <el-button
          size="small"
          class="gl-btn"
          type="danger"
          plain
          @click="doReset"
        >
          一键清空
        </el-button>
      </div>
    </div>
    <div class="gl-right">
      <div class="gl-text">
        任意输入一个值，点击【转换】按钮，即可转换。<br />
        可实现各种功率单位间的换算。<br />
        1000W=1KW<br />
        1000KW=1MW<br />
        1MW=0.1万kw<br />
        1000MW=1GW<br />
        1000GW=1TW<br />
        计算公式<br />
        p=w/t &nbsp;&nbsp; p=UI &nbsp;&nbsp; P=I^2*R &nbsp;&nbsp; P=Fv
        &nbsp;&nbsp; P=U^2/R
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
          label: "瓦（W）",
          value: "",
          k: "w",
        },
        {
          label: "千瓦（KW）",
          value: "",
          k: "kw",
        },
        {
          label: "兆瓦（MW）",
          value: "",
          k: "mw",
        },
        {
          label: "万千瓦（万kW）",
          value: "",
          k: "wkw",
        },
        {
          label: "吉瓦（GW）",
          value: "",
          k: "gw",
        },
        {
          label: "太瓦（TW）",
          value: "",
          k: "tw",
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
          case "w":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = item.value;
                  break;
                case "kw":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "mw":
                  ele.value = accDiv(item.value, 1000 * 1000);
                  break;
                case "wkw":
                  ele.value = accDiv(item.value, 1000 * 1000 * 10);
                  break;
                case "gw":
                  ele.value = accDiv(item.value, 1000 * 1000 * 10 * 100);
                  break;
                case "tw":
                  ele.value = accDiv(item.value, 1000 * 1000 * 10 * 100 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "kw":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "kw":
                  ele.value = item.value;
                  break;
                case "mw":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "wkw":
                  ele.value = accDiv(item.value, 1000 * 10);
                  break;
                case "gw":
                  ele.value = accDiv(item.value, 1000 * 10 * 100);
                  break;
                case "tw":
                  ele.value = accDiv(item.value, 1000 * 10 * 100 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "mw":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = accMul(item.value, 1000 * 1000);
                  break;
                case "kw":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "mw":
                  ele.value = item.value;
                  break;
                case "wkw":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "gw":
                  ele.value = accDiv(item.value, 10 * 100);
                  break;
                case "tw":
                  ele.value = accDiv(item.value, 10 * 100 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "wkw":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = accMul(item.value, 10 * 1000 * 1000);
                  break;
                case "kw":
                  ele.value = accMul(item.value, 10 * 1000);
                  break;
                case "mw":
                  ele.value = accMul(item.value, 10);
                  break;
                case "wkw":
                  ele.value = item.value;
                  break;
                case "gw":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "tw":
                  ele.value = accDiv(item.value, 100 * 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "gw":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = accMul(item.value, 100 * 10 * 1000 * 1000);
                  break;
                case "kw":
                  ele.value = accMul(item.value, 100 * 10 * 1000);
                  break;
                case "mw":
                  ele.value = accMul(item.value, 100 * 10);
                  break;
                case "wkw":
                  ele.value = accMul(item.value, 100);
                  break;
                case "gw":
                  ele.value = item.value;
                  break;
                case "tw":
                  ele.value = accDiv(item.value, 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "tw":
            data.forEach((ele) => {
              switch (ele.k) {
                case "w":
                  ele.value = accMul(item.value, 1000 * 100 * 10 * 1000 * 1000);
                  break;
                case "kw":
                  ele.value = accMul(item.value, 1000 * 100 * 10 * 1000);
                  break;
                case "mw":
                  ele.value = accMul(item.value, 1000 * 100 * 10);
                  break;
                case "wkw":
                  ele.value = accMul(item.value, 1000 * 100);
                  break;
                case "gw":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "tw":
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
          label: "瓦（W）",
          value: "",
          k: "w",
        },
        {
          label: "千瓦（KW）",
          value: "",
          k: "kw",
        },
        {
          label: "兆瓦（MW）",
          value: "",
          k: "mw",
        },
        {
          label: "万千瓦（万kW）",
          value: "",
          k: "wkw",
        },
        {
          label: "吉瓦（GW）",
          value: "",
          k: "gw",
        },
        {
          label: "太瓦（TW）",
          value: "",
          k: "tw",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.gl {
  padding: 0.2rem 0;
  display: flex;
  .gl-left {
    width: 50%;
    .gl-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0.5rem;

      .gl-span {
        width: 3rem;
        text-align: right;
        font-size: 0.15rem;
      }
      .gl-input {
        margin: 0.2rem;
      }
      .gl-btn {
        margin: 0 0.2rem 0 0;
      }
    }
    .gl-reset {
      text-align: right;
      padding-right: 0.2rem;
      margin-top: 0.1rem;
    }
  }
  .gl-right {
    width: 50%;
    height: 100%;
    .gl-text {
      font-size: 0.14rem;
      line-height: 0.3rem;
      text-align: left;
      padding: 0.2rem 0.5rem;
      color: #486077;
    }
  }
}
</style>