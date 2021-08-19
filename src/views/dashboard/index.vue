<template>
  <div class="dashboard clearfix">
    <div ref="left" class="fl left clearfix" @scroll="Scroll">
      <div class="unit-wrap" style="width: 99%">
        <div class="unit-wrap-lt">
          <div
            v-for="item in unitList"
            :key="item.deviceCode"
            class="title"
            :style="
              'background-color:' +
                (item.runStatus> 0 ? 'rgba(33, 211, 84, 1);' : 'red')
            "
          >
            {{ item.deviceName.slice(0, 2) }}
          </div>
        </div>
        <div class="unit-wrap-rt">
          <div v-for="(itm, index) in indicators" :key="index" class="unit">
            <MyBox
              v-for="item in itm.list"
              :key="item.an"
              :value="item.value"
              :unit="item.cn"
              :width="divBoxWidth"
              :ds="item.ds"
              :show-bg-color="false"
              :index-bg-color="true"
            />
          </div>
        </div>
      </div>
      <BgWrap
        v-for="(item, index) in optionList"
        :key="index"
        custorm-class="bg-wrap"
        style="width: 49%; margin-right: 0.1rem"
      >
        <div class="div-diagram" :style="{ height: '3rem' }">
          <v-chart autoresize :options="item.option" />
        </div>
      </BgWrap>
      <div v-for="item in modelList" :key="item.title" class="model-box">
        <Block>
          <div slot="title">{{ item.title }}</div>
          <div slot="content" class="block">
            <div class="model-content">
              <div class="lt">
                <img class="image" :src="item.imgUrl" alt="">
              </div>
              <div class="rt">
                <span>{{ item.text }}</span>
              </div>
            </div>
            <div class="bottom-btn">
              <el-button
                type="primary"
                size="mini"
                @click="toModel(item)"
              >立即查看</el-button>
            </div>
          </div>
        </Block>
      </div>
    </div>
    <div class="fl middel">
      <div
        v-for="(item, index) in num"
        :key="item"
        :style="{
          background:
            activeNum == index
              ? 'rgba(105,255,249,1)'
              : 'rgba(241,241,241,0.4)',
        }"
      />
    </div>
    <div class="fl right">
      <Security />
      <Remind />
      <Schedule />
      <Tools />
    </div>
  </div>
</template>

<script>
import Block from './components/Block.vue'
import { mapState } from 'vuex'
import MyBox from '@/components/MyBox/index.vue'
import BgWrap from './components/BgWrap'
import Security from './components/security/index'
import Remind from './components/remind/index'
import Schedule from './components/schedule/index'
import Tools from './components/tools/index'
import { getComprehensiveOption } from './option/comprehensive.js'
import { getInstantOption } from './option/instant.js'
import { getPowerConsumOption } from './option/powerConsum.js'
import { getMaterialPowerOption } from './option/materialPower.js'
import { selectIndicators } from '@/api/dashboard'
import { socketUrl } from '@/global'
import {
  getComprehensivePnc,
  getInstantPnc,
  getPowerConsumPnc,
  getMaterialPowerPnc
} from '@/api/dashboard'
export default {
  name: 'Dashboard',
  components: {
    BgWrap,
    Schedule,
    Tools,
    Security,
    Remind,
    MyBox,
    Block
  },
  computed: {
    ...mapState({
      menu: (state) => state.user.menu,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList
    })
  },
  watch: {
    plantCode(value) {
      this.init()
      this.initWebSocket()
    }
  },
  data() {
    return {
      num: 0,
      activeNum: 0,
      modelList: [
        {
          title: '烟气流量智能分析',
          imgUrl: '/images/gasFlow.png',
          text:
            '为烟气流量准确性判断和设备标校操作提供支撑，有效保障环保数据精准。',
          path: '/model/ays/dust',
          refCode: 'smk-analysis'
        },
        {
          title: '催化剂寿命预测',
          imgUrl: '/images/catalyze.png',
          text:
            '引用脱硝实时参数，建立催化剂活性预测模型，加强对催化剂寿命的管理。',
          path: '/model/ays/chj',
          refCode: 'catalyst-life'
        },
        {
          title: '出口SO2智能预测',
          imgUrl: '/images/outSO2.png',
          text:
            '提供准确的超限、超排预警，给出合理化建议，促进排放物超限、超排管控。',
          path: '/model/ays/pre',
          refCode: 'out-idx'
        },
        {
          title: '循环泵优化模型',
          imgUrl: '/images/pump.png',
          text:
            '通过智能模型对循环泵历史运行数据寻优，提供最优能耗运行方案，指导实时运行。',
          path: '/model/pot/slu',
          refCode: 'slurry-pump'
        }
      ],
      divBoxWidth: '1.8rem',
      indicators: [],
      bfIndicators: [],
      options: {},
      optionList: [
        {
          option: {},
          name: '瞬时指标'
        },
        {
          option: {},
          name: '循环泵耗电'
        },
        {
          option: {},
          name: '综合指标'
        },
        {
          option: {},
          name: '原材料耗量'
        }
      ]
    }
  },
  mounted() {
    // 先给页面注册滚动事件
    // document.addEventListener("scroll", this.Scroll, true);
    this.judge()
    this.init()
    this.initWebSocket()
  },
  destroyed() {
    clearTimeout(this.timer)
    document.removeEventListener('scroll', this.Scroll, false)
    if (this.websock) {
      this.websock.close()
    } // 离开路由之后断开websocket连接
  },
  methods: {
    init() {
      const promise0 = new Promise((resolve, reject) => {
        selectIndicators({
          ssCode: 'home_index',
          plant: this.plantCode
        })
          .then((res) => {
            const data = res.data.data
            this.indicators = data
            this.bfIndicators = data
            resolve()
          })
          .catch((err) => {
            reject()
          })
      })
      const promise1 = new Promise((resolve, reject) => {
        getComprehensivePnc({
          plant: this.plantCode
        })
          .then((res) => {
            const data = res.data
            this.optionList.forEach((ele) => {
              if (ele.name == '综合指标') {
                ele.option = getComprehensiveOption(data)
              }
            })
            resolve()
          })
          .catch((err) => {
            reject()
          })
      })
      const promise2 = new Promise((resolve, reject) => {
        getInstantPnc({
          plant: this.plantCode
        })
          .then((res) => {
            const data = res.data
            this.optionList.forEach((ele) => {
              if (ele.name == '瞬时指标') {
                ele.option = getInstantOption(data)
              }
            })
            resolve()
          })
          .catch((err) => {
            reject()
          })
      })
      const promise3 = new Promise((resolve, reject) => {
        getPowerConsumPnc({
          plant: this.plantCode
        })
          .then((res) => {
            const data = res.data
            this.optionList.forEach((ele) => {
              if (ele.name == '循环泵耗电') {
                ele.option = getPowerConsumOption(data)
              }
            })
            resolve()
          })
          .catch((err) => {
            reject()
          })
      })
      const promise4 = new Promise((resolve, reject) => {
        getMaterialPowerPnc({
          plant: this.plantCode
        })
          .then((res) => {
            const data = res.data
            this.optionList.forEach((ele) => {
              if (ele.name == '原材料耗量') {
                ele.option = getMaterialPowerOption(data)
              }
            })
            resolve()
          })
          .catch((err) => {
            reject()
          })
      })
      Promise.all([promise0, promise1, promise2, promise3, promise4])
    },
    toModel(item) {
      this.$router.push({ path: item.path })
      this.$store.commit('app/SET_ACTIVEMODEL', item.refCode)
    },
    // 滚动事件,绑定到元素div块
    // 如果不绑定到元素上，则只能监听页面滚动
    Scroll() {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.isScrollEnd, 100)
      this.t1 = this.$refs.left.scrollTop
    },
    // 判断滚动条停止
    isScrollEnd() {
      this.t2 = this.$refs.left.scrollTop
      if (this.t2 == this.t1) {
        const top = this.$refs.left.scrollTop
        const height = this.$refs.left.offsetHeight
        const num = Math.round(top / height)
        this.activeNum = num
      }
    },
    // 判断有几个点
    judge() {
      let arry = []
      let len = null
      let modelList = this.menu.filter((item) => {
        return item.mname == '智能模型'
      })
      modelList = modelList[0].children
      modelList.forEach((item) => {
        arry.push(...item.children)
      })
      arry = [...arry]
      len = arry.length
      this.num = Math.ceil(len / 6)
    },
    // 初始化weosocket
    initWebSocket() {
      const now = Date.now()
      this.path = `/assistant/real_time_data_websocket/home_index/${this.plantCode}///${now}`
      if (this.websock) {
        this.websock.close()
      }
      const wsuri = socketUrl + this.path
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
      console.log('连接成功')
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {},
    // 连接建立失败重连
    websocketonerror() {
      console.log('连接失败，正在重连。。。')
      this.initWebSocket()
    },
    // 数据接收
    websocketonmessage(e) {
      const hisData = JSON.parse(JSON.stringify(this.bfIndicators))
      const data = JSON.parse(e.data)
      const redata = data.points
      hisData.forEach((ele) => {
        ele.list.forEach((item) => {
          redata.forEach((itm) => {
            if (item.an == itm.an) {
              item.value = itm.value
            }
          })
        })
      })
      this.bfData = hisData
      this.indicators = hisData
    },
    // 数据发送
    websocketsend(Data) {
      // this.websock.send(Data);
    },
    // 关闭连接
    websocketclose(e) {
      // console.log("断开连接", e);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  .left {
    width: 64%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    font-size: 0.2rem;
    .bg-wrap {
      height: 3.05rem;
      margin-bottom: 0.1rem;
      padding: 0.16rem;
    }
    .unit-wrap {
      background-image: url("../../assets/dashboard/bg-s.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-bottom: 0.1rem;
      padding: 0.16rem;
      display: flex;
      align-items: center;
      .unit-wrap-lt {
        width: 0.5rem;
        display: inline-block;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0.1rem;

        .title {
          padding: 0.18rem 0.05rem;
          margin-right: 0.2rem;
          margin-bottom: 0.05rem;
          color: black;
          border-radius: 0.05rem;
        }
      }
      .unit-wrap-rt {
        display: inline-block;
        .unit {
          display: flex;
          align-items: center;
          padding: 0.1rem 0;
        }
        .unit:first-child {
          border-bottom: 0.01rem solid #395f78;
        }
      }
    }
  }
  .model-box {
    width: 24%;
    margin-right: 0.11rem;
    .model-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 1rem;
      .lt {
        width: 25%;
        .image {
          width: 100%;
        }
      }
      .rt {
        width: 60%;
        font-size: 0.12rem;
        line-height: 0.18rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .bottom-btn {
      text-align: right;
      padding-right: 0.2rem;
    }
  }
  .middel {
    width: 0.4rem;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    & > div {
      width: 0.15rem;
      height: 0.15rem;
      background: rgba(241, 241, 241, 0.2);
      border-radius: 50%;
      margin-bottom: 0.16rem;
    }
  }
  .right {
    width: calc(36% - 0.4rem);
    height: 100%;
    @media screen and (max-height: 960px) {
      overflow: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
    @media screen and (min-height: 960px) {
    }
  }
}
</style>
<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
