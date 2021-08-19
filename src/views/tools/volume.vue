<template>
  <div class="volume">
    <div class="top clearfix">
      <div class="fl" style="margin-right: 0.08rem">
        <div class="title">封头形式</div>
        <div class="content">
          <div class="clearfix">
            <div
              class="fl img-box"
              :class="{ active: index == activeItem }"
              v-for="(item, index) in imgs"
              :key="item.name"
              @click="onItem(item, index)"
            >
              <img :src="item.url" alt="" />
              <div>{{ item.name }}</div>
            </div>
          </div>
          <!-- 计算 -->
          <div>
            <div class="math-box">
              <span class="math-title">设备内径（D）</span
              ><span style="color: red">*</span>
              <span class="math-ipt">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  onkeyup="value=value.replace(/[^\d^.]/g,'')"
                  v-model="mathData.nj"
                  clearable
                >
                </el-input>
              </span>
              <span class="math-unit">m</span>
            </div>
            <div class="math-box">
              <span class="math-title">筒体长度（L）</span
              ><span style="color: red">*</span>
              <span class="math-ipt">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  v-model="mathData.len"
                  clearable
                >
                </el-input>
              </span>
              <span class="math-unit">m</span>
            </div>
            <div class="math-box">
              <span class="math-title">液面高度（h）</span
              ><span style="color: red">*</span>
              <span class="math-ipt">
                <el-input
                  size="small"
                  placeholder="请输入内容"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  v-model="mathData.height"
                  clearable
                >
                </el-input>
              </span>
              <span class="math-unit">m</span>
            </div>
            <div class="math-box">
              <span class="math-title">封头高度（B）</span
              ><span style="color: red">*</span>
              <span class="math-ipt">
                <el-input
                  :disabled="disabled_ft"
                  size="small"
                  placeholder="请输入内容"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  v-model="mathData.ft"
                  clearable
                >
                </el-input>
              </span>
              <span class="math-unit">m</span>
            </div>
            <div class="math-box">
              <span class="math-title"></span>
              <span class="math-ipt">
                <el-button
                  @click="mathVolum"
                  style="width: 178px"
                  size="small"
                  type="primary"
                  >计算</el-button
                >
              </span>
              <span class="math-unit" style="opacity: 0">m</span>
            </div>
            <div class="math-box">
              <span class="math-title">计算值</span>
              <span class="math-ipt">
                <el-input
                  readonly
                  size="small"
                  placeholder="请输入内容"
                  v-model="mathData.result"
                  clearable
                >
                </el-input>
              </span>
              <span class="math-unit">m³</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fl right-content">
        <div class="title">制作标高容量表</div>
        <div class="right-content-box">
          <div class="img-right-box">
            <div style="padding-top: 0.2rem">
              <img :src="imgs_big[activeItem]" alt="" />
            </div>
          </div>
          <div class="math-right-box">
            <div class="mark">液面高度（m）</div>
            <div class="ipt-box-1">
              <span>从</span>
              <el-input
                size="small"
                placeholder="请输入内容"
                v-model="from"
                clearable
                style="width: 140px"
              >
              </el-input>
              <span>到</span>
              <el-input
                size="small"
                placeholder="请输入内容"
                v-model="to"
                clearable
                style="width: 140px"
              >
              </el-input>
            </div>
          </div>
          <div class="math-right-box">
            <div class="mark">
              <span style="margin-right: 0.1rem">液位间隔</span>
              <el-input
                size="small"
                placeholder="请输入内容"
                v-model="interval"
                clearable
                style="width: 140px"
              >
              </el-input>
            </div>
          </div>
          <div style="text-align: left; padding-left: 0.2rem">
            <el-button @click="onExcel" size="small" type="primary"
              >生成Excel表</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>说明：</div>
      <div>
        1、标准引用《卧式容器容积标定算表[J ]1 化工设备设计 ,刘俊林 ,李春生1
        1996 ,33 (5) :532591》
      </div>
      <div>
        2、已通过实践进行了多方验证，请放心使用。对于椭圆形封头和碟形封头，筒体长度为两封头切线之间的距离（包括了两边封头的直边高度，详情查看图纸或实测）。
      </div>
    </div>
    <!-- 导出excel模板 -->
    <div class="table" style="display: none">
      <table border="1" class="html-tabel">
        <tr>
          <th style="font-size: 20px; font-weight: 800" colspan="3">
            储罐容量表
          </th>
        </tr>
        <tr style="font-size: 16px">
          <td colspan="3">
            <div>封头型式:{{ activeItem == 0 ? "椭圆封头" : "球型封头" }}</div>
            <div>设备内径： {{ mathData.nj }} m</div>
            <div>筒体长度(包括直边):{{ mathData.len }} m</div>
            <div>封头直边是{{ mathData.ft }} m</div>
          </td>
        </tr>
        <tr style="font-size: 16px">
          <td style="background: green">液面高度（标高）</td>
          <td style="background: green">体积（立方米）</td>
          <td style="background: green">备注</td>
        </tr>
        <tr
          style="font-size: 16px"
          :key="index"
          v-for="(item, index) in templateArry"
        >
          <td>{{ item.h }}</td>
          <td>{{ item.v }}</td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import pft from "@/assets/images/pft.png";
import tyft from "@/assets/images/tyft.png";
import dxft from "@/assets/images/dxft.png";
import qxft from "@/assets/images/qxft.png";
import ty_b from "@/assets/tyft.png";
import qx_b from "@/assets/qxft.png";
import { downLoadCustomExcel } from "@/utils/commonUtil";
export default {
  data() {
    return {
      imgs: [
        {
          url: tyft,
          name: "椭圆封头",
        },
        {
          url: qxft,
          name: "球形封头",
        },
      ],
      imgs_big: [ty_b, qx_b],
      activeItem: 0,
      mathData: {
        nj: undefined,
        len: undefined,
        height: undefined,
        ft: undefined,
        result: undefined,
      },
      disabled_ft: false,
      from: undefined,
      to: undefined,
      interval: undefined,
      templateArry: [],
    };
  },
  mounted() {
    window.tool = this;
  },
  methods: {
    onItem(item, index) {
      this.activeItem = index;
      this.mathData = {
        nj: undefined,
        len: undefined,
        height: undefined,
        ft: undefined,
        result: undefined,
      };
      this.from = undefined;
      this.to = undefined;
      this.interval = undefined;
      this.templateArry = [];
      if (index == 1) {
        this.disabled_ft = true;
      } else {
        this.disabled_ft = false;
      }
    },
    // 下载excel
    onExcel() {
      if (
        isNaN(Number(this.from)) ||
        isNaN(Number(this.to)) ||
        isNaN(Number(this.interval))
      ) {
        return this.$message.error("请输入正确的数值");
      }
      let num = 0;
      Object.keys(this.mathData).forEach((k) => {
        if (this.activeItem == 0) {
          if (
            !this.mathData[k] &&
            this.mathData[k] !== 0 &&
            this.mathData[k] !== "0"
          ) {
            num++;
          }
        } else {
          if (k == "ft") {
            return;
          } else if (
            !this.mathData[k] &&
            this.mathData[k] !== 0 &&
            this.mathData[k] !== "0"
          ) {
            num++;
          }
        }
      });
      if (
        (!this.from && this.from !== 0 && this.from !== "0") ||
        (!this.to && this.to !== 0 && this.to !== "0") ||
        (!this.interval && this.interval !== 0 && this.interval !== "0")
      ) {
        num++;
      }
      if (num > 0) {
        return this.$message.error("请输入完整参数计算");
      } else {
        this.templateArry = [];
        let interalArry = this.getInteralArry(this.interval, this.to);
        interalArry = interalArry.filter((item) => {
          return item >= Number(this.from);
        });
        if (this.activeItem == 0) {
          // 生产椭圆封头数据
          interalArry.forEach((item) => {
            let obj = {
              h: `H=${item} m`,
              v: `V=${isNaN(this.mathTy(item)) ? "-" : this.mathTy(item)} m³`,
            };
            console.log(obj, 1998);
            this.templateArry.push(obj);
          });
        } else {
          // 生成球型封头数据
          interalArry.forEach((item) => {
            let obj = {
              h: `H=${item} mm`,
              v: `V=${isNaN(this.mathQx(item)) ? "-" : this.mathQx(item)}`,
            };
            this.templateArry.push(obj);
          });
        }
        this.$nextTick(() => {
          // var tabelStr = document.querySelector(".html-tabel").outerHTML;
          let temp = () => {
            let str = ``;
            this.templateArry.forEach((item) => {
              str += `
              <tr style="font-size: 16px;">
                <td>${item.h}</td>
                <td>${item.v}</td>
                <td></td>
              </tr>
              `;
            });
            return str;
          };
          let tabelStr =
            `<table border="1" class="html-tabel">
            <tr>
              <th colspan="3" style="font-size: 20px; font-weight: 800;">
                储罐容量表
              </th>
            </tr> 
            <tr style="font-size: 16px;">
              <td colspan="3">
                <div>封头型式:${
                  this.activeItem == 0 ? "椭圆封头" : "球型封头"
                }</div> 
                <div>设备内径：  ${this.mathData.nj}m</div> 
                <div>筒体长度(包括直边): ${this.mathData.len}m</div> 
                <div>封头直边是: ${this.mathData.ft}m</div>
              </td>
            </tr> 
            <tr style="font-size: 16px;">
              <td style="background: green;">液面高度（标高）</td> 
              <td style="background: green;">体积（立方米）</td> 
              <td style="background: green;">备注</td>
            </tr>  
         ` +
            temp() +
            `</table>`;
          //Worksheet名
          downLoadCustomExcel("储罐容量表", tabelStr);
        });
      }
    },
    // 计算体积
    mathVolum() {
      if (this.activeItem == 0) {
        if (
          this.mathData.nj === "" ||
          this.mathData.len === "" ||
          this.mathData.height === "" ||
          this.mathData.ft === ""
        ) {
          return this.$message.error("请输入完整参数计算");
        } else {
          this.mathData.result = isNaN(this.mathTy()) ? "-" : this.mathTy();
        }
      } else {
        if (
          this.mathData.nj === "" ||
          this.mathData.len === "" ||
          this.mathData.height === ""
        ) {
          return this.$message.error("请输入完整参数计算");
        } else {
          this.mathData.result = isNaN(this.mathQx()) ? "-" : this.mathQx();
        }
      }
    },
    // 计算椭圆体积
    mathTy(h) {
      let D = Number(this.mathData.nj);
      let L = Number(this.mathData.len);
      let H = Number(h ? h : this.mathData.height);
      let b = Number(this.mathData.ft);
      if (isNaN(D) || isNaN(L) || isNaN(H) || isNaN(b)) {
        return this.$message.error("请输入正确的数值");
      }

      let k = (H / D).toFixed(4); 
      let v_h1 =
        (1 / 4) *
        D *
        D *
        L *
        (2 * (2 * k - 1) * Math.sqrt(k * (1 - k)) +
          Math.asin(2 * k - 1) +
          Math.PI / 2);
      let v_h2 =
        (2 / 3) * Math.PI * (D / 2) * (D / 2) * b * (3 - 2 * k) * k * k;
      return (2 * v_h2 + v_h1).toFixed(5);
    },
    // 计算球型
    mathQx(h) {
      let D = Number(this.mathData.nj);
      let L = Number(this.mathData.len);
      let H = Number(h ? h : this.mathData.height);
      if (isNaN(D) || isNaN(L) || isNaN(H)) {
        return this.$message.error("请输入正确的数值");
      }
      let k = (H / D).toFixed(4);
      let v_h1 =
        (1 / 4) *
        D *
        D *
        L *
        (2 * k * Math.sqrt(k * (1 - k)) + Math.asin(2 * k - 1) + Math.PI / 2);
      let v_h2 = ((Math.PI / 12) * D * D * D * (3 - 2 * k) * k * k).toFixed(5);
      return (2 * v_h2 + v_h1).toFixed(5);
    },

    // 计算中间圆柱体体积

    // 获取液面间隔数组
    getInteralArry(interal, total) {
      let num = Math.floor(total / interal);
      let arr = [];
      for (let i = 1; i <= num; i++) {
        arr.push(this.mul(interal, i));
      }
      if (arr[arr.length - 1] < total) {
        arr.push(total);
      }
      return arr;
    },
    mul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    },
  },
};
</script>

<style lang="scss" scope>
.volume {
  height: 100vh;
  padding: 0.1rem 0.25rem;
  .top {
    & > div {
      width: calc(calc(100% - 0.08rem) / 2);
      height: 6.2rem;

      border-radius: 8px;
      border: 1px solid #263c6a;
    }
    .title {
      height: 0.4rem;
      line-height: 0.4rem;
      padding-left: 0.2rem;
      background: #263c6a;
      font-size: 0.18rem;
      color: #a8cdd4;
      text-align: left;
    }
    .content {
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      .active {
        border-radius: 3px;
        border: 1px solid #69fff9;
      }
      .img-box {
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: center;
        width: 25%;
        height: 1.2rem;
        padding: 0.2rem;

        font-size: 0.14rem;
        img {
          height: 0.5rem;
        }
        div {
          height: 0.3rem;
          line-height: 0rem;
        }
      }
      .math-box {
        display: flex;
        justify-content: space-around;
        padding: 0 15%;
        .math-title {
          font-size: 0.18rem;
          font-weight: 500;
          color: #a8cdd4;
          display: block;
          width: 1.4rem;
          text-align: right;
          // padding:0 0.1rem;
        }
        .math-unit {
          font-size: 0.18rem;
          font-weight: 500;
          color: #a8cdd4;
        }
      }
    }
    .right-content-box {
      .math-right-box {
        padding: 0 0.2rem;
        .mark {
          font-size: 0.18rem;
          font-weight: 500;
          color: #a8cdd4;
          text-align: left;
          margin-bottom: -0.2rem;
        }
        .ipt-box-1 {
          display: flex;
          padding-right: 15%;
          justify-content: space-around;
          & > span {
            font-weight: 500;
            color: #a8cdd4;
            font-size: 0.18rem;
          }
        }
      }
    }
  }
  .bottom {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #486077;
    & > div {
      text-align: left;
    }
  }
}
</style>
<style lang="scss" >
.volume {
  height: 100vh;
}
</style>
