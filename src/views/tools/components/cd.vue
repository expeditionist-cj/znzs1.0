<template>
  <div class="cd">
    <div class="cd-top">
      <div class="cd-item" v-for="item in data" :key="item.k">
        <span class="cd-span">{{ item.label }}</span>
        <el-input
          size="small"
          class="cd-input"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          v-model="item.value"
        ></el-input>
        <el-button
          size="small"
          class="cd-btn"
          type="primary"
          plain
          @click="onMath(item)"
        >
          转换
        </el-button>
      </div>
      <div class="cd-reset">
        <el-button
          size="small"
          class="cd-btn"
          type="danger"
          plain
          @click="doReset"
        >
          一键清空
        </el-button>
      </div>
    </div>
    <div class="cd-bottom">
      <div class="cd-text">
        换算公里/千米(km)、米(m)、分米(dm)、厘米(cm)、毫米(mm)、丝(dmm)、微米(um)、纳米(nm)、丈、尺、寸、分、厘、毫等长度单位数据
        <br />
        <div style="display: flex">
          <div style="width: 50%">
            1千米=1000米 <br />
            1米＝10分米 <br />
            1米＝100厘米 <br />
            1米＝1000毫米 <br />
            1米＝10^6微米 <br />
          </div>
          <div>
            1米＝10^9纳米 <br />
            1米＝0.3丈 <br />
            1米＝3尺 <br />
            1米＝30寸 <br />
          </div>
        </div>
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
          label: "千米（km）",
          value: "",
          k: "km",
        },
        {
          label: "公里（km）",
          value: "",
          k: "gl",
        },
        {
          label: "米（m）",
          value: "",
          k: "m",
        },
        {
          label: "分米（dm）",
          value: "",
          k: "dm",
        },
        {
          label: "厘米（cm）",
          value: "",
          k: "cm",
        },
        {
          label: "毫米（mm）",
          value: "",
          k: "mm",
        },
        {
          label: "丝米（dmm）",
          value: "",
          k: "dmm",
        },
        {
          label: "微米（um）",
          value: "",
          k: "um",
        },
        {
          label: "纳米（nm）",
          value: "",
          k: "nm",
        },
        {
          label: "丈",
          value: "",
          k: "z",
        },
        {
          label: "尺",
          value: "",
          k: "ch",
        },
        {
          label: "寸",
          value: "",
          k: "c",
        },
        {
          label: "分",
          value: "",
          k: "f",
        },
        {
          label: "厘",
          value: "",
          k: "l",
        },
        {
          label: "毫",
          value: "",
          k: "h",
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
          case "m":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = item.value;
                  break;
                case "km":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "mm":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "cm":
                  ele.value = accMul(item.value, 100);
                  break;
                case "dm":
                  ele.value = accMul(item.value, 10);
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "um":
                  ele.value = accMul(item.value, 1000000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 1000000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 300);
                  break;
                case "h":
                  ele.value = accMul(item.value, 30000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 30);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 10);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "km":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "km":
                  ele.value = item.value;
                  break;
                case "gl":
                  ele.value = item.value;
                  break;
                case "mm":
                  ele.value = accMul(item.value, 1000000);
                  break;
                case "cm":
                  ele.value = accMul(item.value, 100000);
                  break;
                case "dm":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 10000000);
                  break;
                case "um":
                  ele.value = accMul(item.value, 1000000000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 1000000000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3000000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 300000);
                  break;
                case "h":
                  ele.value = accMul(item.value, 30000000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 30000);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 300);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "gl":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "km":
                  ele.value = item.value;
                  break;
                case "gl":
                  ele.value = item.value;
                  break;
                case "mm":
                  ele.value = accMul(item.value, 1000000);
                  break;
                case "cm":
                  ele.value = accMul(item.value, 100000);
                  break;
                case "dm":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 10000000);
                  break;
                case "um":
                  ele.value = accMul(item.value, 1000000000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 1000000000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3000000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 300000);
                  break;
                case "h":
                  ele.value = accMul(item.value, 30000000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 30000);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 300);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "mm":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 1000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 1000000);
                  break;
                case "mm":
                  ele.value = item.value;
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 10);
                  break;
                case "um":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 1000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3);
                  break;
                case "f":
                  ele.value = accMul(item.value, 3 / 10);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3 * 10);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3 / 100);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 1000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 10000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "cm":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 100000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 100000);
                  break;
                case "mm":
                  ele.value = accMul(item.value, 10);
                  break;
                case "cm":
                  ele.value = item.value;
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 100);
                  break;
                case "um":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 10000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 30);
                  break;
                case "f":
                  ele.value = accMul(item.value, 3);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3 * 100);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3 / 10);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 100);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "dm":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "mm":
                  ele.value = accMul(item.value, 100);
                  break;
                case "cm":
                  ele.value = accMul(item.value, 10);
                  break;
                case "dm":
                  ele.value = item.value;
                  break;
                case "dmm":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "um":
                  ele.value = accMul(item.value, 100000);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 100000000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 300);
                  break;
                case "f":
                  ele.value = accMul(item.value, 30);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 10);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 100);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "dmm":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 10000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 10000000);
                  break;
                case "mm":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "dmm":
                  ele.value = item.value;
                  break;
                case "um":
                  ele.value = accMul(item.value, 100);
                  break;
                case "nm":
                  ele.value = accMul(item.value, 100000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3 / 10);
                  break;
                case "f":
                  ele.value = accMul(item.value, 3 / 100);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3 / 1000);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 10000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 100000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "um":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 1000000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 1000000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 1000000000);
                  break;
                case "mm":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 100000);
                  break;
                case "dmm":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "um":
                  ele.value = item.value;
                  break;
                case "nm":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "l":
                  ele.value = accMul(item.value, 3 / 1000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 3 / 10000);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3 / 100);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3 / 100000);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 1000000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 10000000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "nm":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 1000000000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 1000000000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 1000000000000);
                  break;
                case "mm":
                  ele.value = accDiv(item.value, 1000000);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 10000000);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 100000000);
                  break;
                case "dmm":
                  ele.value = accDiv(item.value, 100000);
                  break;
                case "um":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "nm":
                  ele.value = item.value;
                  break;
                case "l":
                  ele.value = accMul(item.value, 3 / 1000000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 3 / 10000000);
                  break;
                case "h":
                  ele.value = accMul(item.value, 3 / 100000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 3 / 100000000);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 3 / 1000000000);
                  break;
                case "z":
                  ele.value = accMul(item.value, 3 / 10000000000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "l":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 3000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 3000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 3000000);
                  break;
                case "mm":
                  ele.value = accDiv(item.value, 3);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 30);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 300);
                  break;
                case "dmm":
                  ele.value = accDiv(accMul(item.value, 10), 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 1000), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 1000000), 3);
                  break;
                case "l":
                  ele.value = item.value;
                  break;
                case "f":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "h":
                  ele.value = accMul(item.value, 10);
                  break;
                case "c":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "ch":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "z":
                  ele.value = accDiv(item.value, 10000);
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
                case "m":
                  ele.value = accDiv(item.value, 300);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 300000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 300000);
                  break;
                case "mm":
                  ele.value = accDiv(accMul(item.value, 10), 3);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 3);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 30);
                  break;
                case "dmm":
                  ele.value = accDiv(accMul(item.value, 100), 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 10000), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 10000000), 3);
                  break;
                case "l":
                  ele.value = accMul(item.value, 10);
                  break;
                case "f":
                  ele.value = item.value;
                  break;
                case "h":
                  ele.value = accMul(item.value, 100);
                  break;
                case "c":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "ch":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "z":
                  ele.value = accDiv(item.value, 1000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "h":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 30000);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 30000000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 30000000);
                  break;
                case "mm":
                  ele.value = accDiv(item.value, 30);
                  break;
                case "cm":
                  ele.value = accDiv(item.value, 300);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 3000);
                  break;
                case "dmm":
                  ele.value = accDiv(item.value, 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 100), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 100000), 3);
                  break;
                case "l":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "f":
                  ele.value = accDiv(item.value, 100);
                  break;
                case "h":
                  ele.value = item.value;
                  break;
                case "c":
                  ele.value = accDiv(item.value, 1000);
                  break;
                case "ch":
                  ele.value = accDiv(item.value, 10000);
                  break;
                case "z":
                  ele.value = accDiv(item.value, 100000);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "c":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 30);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 30000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 30000);
                  break;
                case "mm":
                  ele.value = accDiv(accMul(item.value, 100), 3);
                  break;
                case "cm":
                  ele.value = accDiv(accMul(item.value, 10), 3);
                  break;
                case "dm":
                  ele.value = accDiv(item.value, 3);
                  break;
                case "dmm":
                  ele.value = accDiv(accMul(item.value, 1000), 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 100000), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 100000000), 3);
                  break;
                case "l":
                  ele.value = accMul(item.value, 100);
                  break;
                case "f":
                  ele.value = accMul(item.value, 10);
                  break;
                case "h":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "c":
                  ele.value = item.value;
                  break;
                case "ch":
                  ele.value = accDiv(item.value, 10);
                  break;
                case "z":
                  ele.value = accDiv(item.value, 100);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "ch":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(item.value, 3);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 3000);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 3000);
                  break;
                case "mm":
                  ele.value = accDiv(accMul(item.value, 1000), 3);
                  break;
                case "cm":
                  ele.value = accDiv(accMul(item.value, 100), 3);
                  break;
                case "dm":
                  ele.value = accDiv(accMul(item.value, 10), 3);
                  break;
                case "dmm":
                  ele.value = accDiv(accMul(item.value, 10000), 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 1000000), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 1000000000), 3);
                  break;
                case "l":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 100);
                  break;
                case "h":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 10);
                  break;
                case "ch":
                  ele.value = item.value;
                  break;
                case "z":
                  ele.value = accDiv(item.value, 10);
                  break;
                default:
                  break;
              }
            });
            this.data = data;
            break;
          case "z":
            data.forEach((ele) => {
              switch (ele.k) {
                case "m":
                  ele.value = accDiv(accMul(item.value, 10), 3);
                  break;
                case "km":
                  ele.value = accDiv(item.value, 300);
                  break;
                case "gl":
                  ele.value = accDiv(item.value, 300);
                  break;
                case "mm":
                  ele.value = accDiv(accMul(item.value, 10000), 3);
                  break;
                case "cm":
                  ele.value = accDiv(accMul(item.value, 1000), 3);
                  break;
                case "dm":
                  ele.value = accDiv(accMul(item.value, 100), 3);
                  break;
                case "dmm":
                  ele.value = accDiv(accMul(item.value, 100000), 3);
                  break;
                case "um":
                  ele.value = accDiv(accMul(item.value, 10000000), 3);
                  break;
                case "nm":
                  ele.value = accDiv(accMul(item.value, 10000000000), 3);
                  break;
                case "l":
                  ele.value = accMul(item.value, 10000);
                  break;
                case "f":
                  ele.value = accMul(item.value, 1000);
                  break;
                case "h":
                  ele.value = accMul(item.value, 100000);
                  break;
                case "c":
                  ele.value = accMul(item.value, 100);
                  break;
                case "ch":
                  ele.value = accMul(item.value, 10);
                  break;
                case "z":
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
      this.data =  [
        {
          label: "千米（km）",
          value: "",
          k: "km",
        },
        {
          label: "公里（km）",
          value: "",
          k: "gl",
        },
        {
          label: "米（m）",
          value: "",
          k: "m",
        },
        {
          label: "分米（dm）",
          value: "",
          k: "dm",
        },
        {
          label: "厘米（cm）",
          value: "",
          k: "cm",
        },
        {
          label: "毫米（mm）",
          value: "",
          k: "mm",
        },
        {
          label: "丝米（dmm）",
          value: "",
          k: "dmm",
        },
        {
          label: "微米（um）",
          value: "",
          k: "um",
        },
        {
          label: "纳米（nm）",
          value: "",
          k: "nm",
        },
        {
          label: "丈",
          value: "",
          k: "z",
        },
        {
          label: "尺",
          value: "",
          k: "ch",
        },
        {
          label: "寸",
          value: "",
          k: "c",
        },
        {
          label: "分",
          value: "",
          k: "f",
        },
        {
          label: "厘",
          value: "",
          k: "l",
        },
        {
          label: "毫",
          value: "",
          k: "h",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.cd {
  padding: 0.2rem 0;
  // display: flex;
  .cd-top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .cd-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0.5rem;
      width: 50%;
      .cd-span {
        width: 3rem;
        text-align: right;
        font-size: 0.15rem;
      }
      .cd-input {
        margin: 0.2rem;
      }
      .cd-btn {
        margin: 0 0.2rem 0 0;
      }
    }
    .cd-reset {
      width: 50%;
      text-align: right;
      padding-right: 0.2rem;
      margin-top: 0.1rem;
    }
  }
  .cd-bottom {
    width: 100%;
    height: 100%;
    display: flex;
    .cd-text {
      width: 100%;
      font-size: 0.14rem;
      line-height: 0.3rem;
      text-align: left;
      padding: 0.2rem 0 0 0.5rem;
      color: #486077;
    }
  }
}
</style>