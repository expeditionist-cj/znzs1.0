<template>
  <div class="ll">
    <div class="ll-top">
      <div class="ll-top-box">
        <div class="ll-top-box-div">
          <div class="text">工作压力（Mpa）<span style="color:red">*</span>&nbsp;</div>  
          <el-input
            size="small"
            class="ipt"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            v-model="data.press"
          ></el-input>
          <div class="ll-zhanwei"></div>
        </div>
        <div class="ll-top-box-div">
          <div class="text">工作温度（℃）<span style="color:red">*</span>&nbsp;</div> 
          <el-input
            size="small"
            class="ipt"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            v-model="data.temp"
          ></el-input>
          <div class="ll-zhanwei"></div>
        </div>
        <div class="ll-top-box-div">
          <div class="text">实际大气压（Kpa）<span style="color:red">*</span>&nbsp;</div>
          <el-input
            size="small"
            class="ipt"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            v-model="data.atmos"
          ></el-input>
          <div class="ll-zhanwei"></div>
        </div>
      </div>
      <div class="ll-top-math">
        <div class="ll-top-math-div">
          <div class="ll-left">
            <span class="text">工况流量（m³/h）</span>
            <el-input
              size="small"
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="workCondition1"
            ></el-input>
            <div class="ll-zhanwei"></div>
          </div>
          <div class="ll-mid">
            <el-button class="btn" size="small" type="primary" @click="onMath1"
              >计算<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </div>
          <div class="ll-right">
            <span class="text">标况流量（m³/h）</span>
            <el-input
              size="small"
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="standardFlow1"
              disabled
            ></el-input>
          </div>
        </div>
        <div class="ll-top-math-div">
          <div class="ll-left">
            <span class="text">标况流量（m³/h）</span>
            <el-input
              size="small"
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="standardFlow2"
            ></el-input>
            <div class="ll-zhanwei"></div>
          </div>
          <div class="ll-mid">
            <el-button class="btn" size="small" type="primary" @click="onMath2"
              >计算<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </div>
          <div class="ll-right">
            <span class="text">工况流量（m³/h）</span>
            <el-input
              size="small"
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="workCondition2"
              disabled
            ></el-input>
          </div>
        </div>
      </div>
      <div class="ll-reset">
        <el-button
          size="small"
          class="ll-btn"
          type="danger"
          plain
          @click="doReset"
        >
          一键清空
        </el-button>
      </div>
    </div>
    <div class="ll-bottom">
      <div class="ll-text">
        工况与标况换算关系式:P1×V1/T1=P2×V2/T2 <br />
        P1：标况压力，单位Pa，以标准大气压取值=101325Pa <br />
        V1：标况流量，单位Nm3 /h <br />
        T1：标况温度，单位开尔文K，取值273.15K <br />
        P2：工况压力=工作压力+实际大气压，单位Pa，现场实际大气压默认值为标准大气压101325Pa
        <br />
        V2：工况流量，单位m3 /h <br />
        T2：工况温度=工作温度℃+273.15，单位开尔文K <br />
      </div>
      <div class="ll-text">
        <img class="ll-img" src="../../../assets/images/bkgs.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        press: "",
        temp: "",
        atmos: "",
      },
      workCondition1: "",
      standardFlow1: "",
      workCondition2: "",
      standardFlow2: "",
    };
  },
  methods: {
    onMath1() {
      let result = this.isNull();
      let { press, temp, atmos } = this.data;
      if (!result || this.workCondition1 === "") {
        return this.$message.error("请填写完整参数！");
      } else if (!this.onCheck() || isNaN(Number(this.workCondition1))) {
        return;
      } else {
        this.standardFlow1 =
          (this.workCondition1 *
            (Number(press) * 1000 + Number(atmos)) *
            273.15) /
          (101.325 * (Number(temp) + 273.15));
      }
    },
    onCheck() {
      let data = this.data;
      let result = true;
      Object.keys(data).map((k) => {
        if (isNaN(Number(data[k]))) {
          result = false;
        }
      });
      return result;
    },
    onMath2() {
      let result = this.isNull();
      let { press, temp, atmos } = this.data;
      if (!result || this.standardFlow2 === "") {
        return this.$message.error("请填写完整参数！");
      } else if (!this.onCheck() || isNaN(Number(this.standardFlow2))) {
        return;
      } else {
        this.workCondition2 =
          (this.standardFlow2 * 101.325 * (Number(temp) + 273.15)) /
          273.15 /
          (Number(press) * 1000 + Number(atmos));
      }
    },
    isNull() {
      let data = this.data;
      let result = true;
      Object.keys(data).map((k) => {
        if (data[k] === "") {
          result = false;
        }
      });
      return result;
    },
    doReset() {
      this.data = {
        press: "",
        temp: "",
        atmos: "",
      };
      this.workCondition1 = "";
      this.standardFlow1 = "";
      this.workCondition2 = "";
      this.standardFlow2 = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.ll {
  padding: 0.2rem 0;
  .ll-top {
    .ll-top-box {
      width: 50%;
      .ll-top-box-div {
        height: 0.5rem;
        display: flex;
        .text {
          width: 3rem;
          text-align: right;
          font-size: 0.15rem;
          display: inline-block;
        }
        .ipt {
          width: 4rem;
        }
        .ll-zhanwei {
          width: 1rem;
        }
      }
    }
    .ll-top-math {
      width: 100%;
      margin-top: 0.1rem;
      .ll-top-math-div {
        height: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ll-left {
          width: 50%;
          display: flex;
          align-items: center;
          .text {
            width: 3rem;
            text-align: right;
            font-size: 0.15rem;
          }
          .ipt {
            width: 4rem;
          }
          .ll-zhanwei {
            width: 1rem;
          }
        }
        .ll-mid {
          display: flex;
          align-items: center;
          .text {
            width: 3rem;
            text-align: right;
            font-size: 0.15rem;
          }
        }
        .ll-right {
          display: flex;
          align-items: center;
          .text {
            width: 3rem;
            text-align: right;
            font-size: 0.15rem;
          }
        }
      }
    }
    .ll-reset {
      width: 100%;
      text-align: right;
      margin-top: 0.1rem;
    }
  }
  .ll-bottom {
    width: 100%;
    height: 100%;
    display: flex;
    .ll-text {
      width: 50%;
      font-size: 0.14rem;
      line-height: 0.3rem;
      text-align: left;
      padding: 0.2rem 0 0 0.5rem;
      color: #486077;
      .ll-img {
        width: 100%;
      }
    }
  }
}
</style>