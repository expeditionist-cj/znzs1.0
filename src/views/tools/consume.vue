<template>
  <div class="consume">
    <div class="consume-box">
      <div class="title">采集/手填</div>
      <div class="content">
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            1、烟气流量[标态，干基，6%O₂] （用净烟气流量）
          </div>
          <div class="item-right">
            <span class="name">V<sub>RG</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.vrg"
            ></el-input>
            <span>&nbsp;&nbsp;m³/h</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            2、原烟气中SO₂含量[标态，干基，6%O₂]
          </div>
          <div class="item-right">
            <span class="name">C<sub>SO₂rawags</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              @input="onRawagsChange"
              v-model="data.rawags"
            ></el-input>
            <span>&nbsp;&nbsp;mg/m³</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            3、净烟气中SO₂含量[标态，干基，6%O₂]
          </div>
          <div class="item-right">
            <span class="name">C<sub>SO₂cleangas</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              @input="onCleangasChange"
              v-model="data.cleangas"
            ></el-input>
            <span>&nbsp;&nbsp;mg/m³</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            4、脱硫效率（自动计算）
          </div>
          <div class="item-right">
            <span class="name">n<sub>SO₂</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              disabled
              size="small"
              v-model="data.nso2"
            ></el-input>
            <span>&nbsp;&nbsp;%</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            5、石灰石浆液含固量
          </div>
          <div class="item-right">
            <span class="name"></span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.solidContent"
            ></el-input>
            <span>&nbsp;&nbsp;%</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            6、石灰石浆液密度
          </div>
          <div class="item-right">
            <span class="name"></span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.density"
            ></el-input>
            <span>&nbsp;&nbsp;kg/m³</span>
          </div>
        </div>
      </div>
    </div>
    <div class="consume-box">
      <div class="title">常量</div>
      <div class="content">
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            1、CaCO₃ 的摩尔量
          </div>
          <div class="item-right">
            <span class="name">M<sub>CaCO₃</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.caco3Mol"
            ></el-input>
            <span>&nbsp;&nbsp;kg/kmol</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            2、SO₂的摩尔量
          </div>
          <div class="item-right">
            <span class="name">M<sub>SO₂</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.so2Mol"
            ></el-input>
            <span>&nbsp;&nbsp;kg/kmol</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            3、石灰石纯度
          </div>
          <div class="item-right">
            <span class="name">F<sub>R</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.purity"
            ></el-input>
            <span>&nbsp;&nbsp;%</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">
            <span class="item-left-red">*</span>
            4、钙硫比（Ca/S摩尔比）
          </div>
          <div class="item-right">
            <span class="name">S<sub>T</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              v-model="data.CaS"
            ></el-input>
            <div style="text-align: right; width: 2rem">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="openInnerDrawer"
                >高级计算</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="consume-box">
      <div class="title">计算结果</div>
      <div class="content">
        <div class="item">
          <div class="item-left">结果1：石灰石消耗量</div>
          <div class="item-right">
            <span class="name">M<sub>CaCO₃</sub>&nbsp;=&nbsp;</span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              disabled
              v-model="caco3Consumption"
            ></el-input>
            <span>&nbsp;&nbsp;kg/h</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left">结果2：石灰石浆液消耗量</div>
          <div class="item-right">
            <span class="name"> </span>
            <el-input
              class="ipt"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              size="small"
              disabled
              v-model="slurryConsumption"
            ></el-input>
            <span>&nbsp;&nbsp;m³/h</span>
          </div>
        </div>
        <div class="item">
          <div class="item-left"></div>
          <div class="item-right">
            <span class="name"> </span>
            <div class="ipt" onkeyup="value=value.replace(/[^\d.]/g,'')"></div>
            <div style="text-align: right; width: 2rem">
              <el-button type="primary" size="mini" @click="onMath"
                >开始计算</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div class="consume-box" style="width: 49.5%">
        <div class="title">石灰石耗量计算公式</div>
        <div class="content-img">
          <img src="../../assets/images/gs1.png" alt="" />
        </div>
      </div>
      <div class="consume-box" style="width: 49.5%">
        <div class="title">石灰石浆液耗量计算公式( m³/h)</div>
        <div class="content-img">
          <img src="../../assets/images/gs2.png" alt="" />
        </div>
      </div>
    </div>
    <!-- 高级计算 -->
    <el-drawer
      title="高级计算"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="innerDrawer"
      size="45%"
    >
      <div style="padding: 0 0.3rem">
        <div class="consume-box">
          <div class="title">常量</div>
          <div class="content">
            <div class="item">
              <div class="item-left">CaCO₃ 的摩尔量</div>
              <div class="item-right">
                <span class="name">M<sub>CaCO₃</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  v-model="constantData.mol1"
                  disabled
                ></el-input>
                <span>&nbsp;&nbsp;kg/kmol</span>
              </div>
            </div>
            <div class="item">
              <div class="item-left">CaSO₄·H₂O的摩尔量</div>
              <div class="item-right">
                <span class="name">M<sub>CaCO₄·H₂O</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  disabled
                  v-model="constantData.mol2"
                ></el-input>
                <span>&nbsp;&nbsp;kg/kmol</span>
              </div>
            </div>
            <div class="item">
              <div class="item-left">CaCO₃·0.5H₂O的摩尔量</div>
              <div class="item-right">
                <span class="name">M<sub>CaSO₃·0.5H₂O</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  disabled
                  v-model="constantData.mol3"
                ></el-input>
                <span>&nbsp;&nbsp;kg/kmol</span>
              </div>
            </div>
          </div>
        </div>
        <div class="consume-box">
          <div class="title">输入参数</div>
          <div class="content">
            <div class="item">
              <div class="item-left">
                <span class="item-left-red">*</span>
                石膏中CaCO₃ 的含量
              </div>
              <div class="item-right">
                <span class="name">X<sub>CaCO₃</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  v-model="inputData.content1"
                ></el-input>
                <span>&nbsp;&nbsp;%</span>
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="item-left-red">*</span>
                石膏中CaSO₄·2H₂O的含量
              </div>
              <div class="item-right">
                <span class="name">X<sub>CaSO₄·2H₂O</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  v-model="inputData.content2"
                ></el-input>
                <span>&nbsp;&nbsp;%</span>
              </div>
            </div>
            <div class="item">
              <div class="item-left">
                <span class="item-left-red">*</span>
                石膏中CaSO₃·0.5H₂O的含量
              </div>
              <div class="item-right">
                <span class="name">X<sub>CaSO₃·0.5H₂O</sub>&nbsp;=&nbsp;</span>
                <el-input
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  size="small"
                  v-model="inputData.content3"
                ></el-input>
                <span>&nbsp;&nbsp;%</span>
              </div>
            </div>
            <div class="item">
              <div class="item-left"></div>
              <div class="item-right">
                <span class="name"> </span>
                <div
                  class="ipt"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                ></div>
                <div style="text-align: right; width: 2rem">
                  <el-button type="primary" size="mini" @click="superMath"
                    >开始计算</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="consume-box" style="width: 100%">
          <div class="title">计算公式</div>
          <div class="content-img" style="height: 3rem">
            <img style="width: 50%" src="../../assets/images/gs3.png" alt="" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        vrg: "",
        rawags: "",
        cleangas: "",
        nso2: "",
        solidContent: "",
        density: "",
        caco3Mol: "",
        so2Mol: "",
        purity: "",
        CaS: "",
      },
      constantData: {
        mol1: 100.09,
        mol2: 172.18,
        mol3: 129.15,
      },
      inputData: {
        content1: "",
        content2: "",
        content3: "",
      },
      caco3Consumption: "",
      slurryConsumption: "",
      status: false,
      innerDrawer: false,
    };
  },
  methods: {
    onRawagsChange(value) {
      if (value === "" && this.data.cleangas === "") {
        this.data.nso2 = "";
      } else if (value === "" || isNaN(Number(value))) {
        return;
      } else {
        this.data.nso2 = ((value - this.data.cleangas) * 100) / value;
      }
    },
    onCleangasChange(value) {
      if (value === "" && this.data.rawags === "") {
        this.data.nso2 = "";
      } else if (value === "") {
        return;
      } else {
        this.data.nso2 = ((this.data.rawags - value) * 100) / this.data.rawags;
      }
    },
    onMath() {
      let data = JSON.parse(JSON.stringify(this.data));
      Object.keys(data).map((k) => {
        if (data[k] === "") {
          this.status = true;
          return;
        } else {
          data[k] = parseFloat(data[k]);
        }
      });
      if (this.status) {
        this.status = false;
        return this.$message.error("请输入完整参数！");
      } else {
        let res1 =
          ((((data.vrg * (data.rawags - data.cleangas)) / 1000 / 1000) *
            data.caco3Mol) /
            data.so2Mol /
            data.purity) *
          data.CaS * 100;
        this.caco3Consumption = isNaN(res1) ? "" : res1;
        let res2 = this.caco3Consumption / (data.density * data.solidContent);
        this.slurryConsumption = isNaN(res2) ? "" : res2;
      }
    },
    openInnerDrawer() {
      this.innerDrawer = true;
    },
    superMath() {
      let { content1, content2, content3 } = this.inputData;
      let { mol1, mol2, mol3 } = this.constantData;
      if (content1 === "" || content2 === "" || content3 === "") {
        return this.$message.error("请填写完整参数");
      } else {
        this.data.CaS = content1 / mol1 / (content2 / mol2 + content3 / mol3);
        this.innerDrawer = false;
      }
    },
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss">
.consume {
  padding: 0 0.3rem;
}
.consume-box {
  border: 0.01rem solid rgba(105, 255, 249, 0.5);
  border-radius: 0.05rem;
  font-weight: 400;
  font-size: 0.16rem;
  line-height: 0.2rem;
  text-align: left;
  margin-bottom: 0.1rem;
  color: #a8cdd4;
  .title {
    padding: 0.05rem 0.1rem;
    border-bottom: 0.01rem solid rgba(105, 255, 249, 0.1);
    background-color: rgba(105, 255, 249, 0.1);
  }
  .content {
    .item {
      display: flex;
      align-items: center;
      padding: 0.1rem 0.2rem;
      height: 0.4rem;
      .item-left {
        text-align: left;
        width: 50%;
        .item-left-red {
          color: red;
        }
      }
      .item-right {
        width: 50%;
        text-align: left;
        display: flex;
        align-items: center;
        .name {
          display: inline-block;
          width: 1.2rem;
          text-align: right;
        }
        .ipt {
          width: 2rem;
        }
      }
    }
  }
  .content-img {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5rem;
    img {
      width: 80%;
    }
  }
}
.el-drawer__header {
  text-align: center;
}
</style>
