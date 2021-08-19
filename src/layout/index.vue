<template>
  <div class="layout">
    <!-- 顶部菜单 -->
    <Navbar />
    <!-- 中间内容 -->
    <AppMain />
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
import AppFooter from './components/AppFooter.vue'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { socketUrl } from '@/global'
import { selectImportantIndicator, selectInstanceId } from '@/api/dashboard'
import { getDict } from '@/api/pulpSupply.js'
export default {
  name: 'Layout',
  components: {
    Navbar,
    AppFooter,
    AppMain
  },
  data() {
    return {
      websock: null,
      path: ''
    }
  },
  computed: {
    ...mapState({
      msg: (state) => state.socket.message,
      plantCode: (state) => state.user.plantCode,
      unitList: (state) => state.dashboard.unitList,
      initalData: (state) => state.dashboard.initalData,
      plants: (state) => state.user.plants,
      activeModel: (state) => state.app.activeModel
    })
  },
  watch: {
    msg(value) {
      // if (value) {
      //   value = JSON.parse(value);
      //   // 更新机组状态
      //   if (value.type == "webImportantIndicator") {
      //     let copy = JSON.parse(JSON.stringify(this.unitList));
      //     copy.forEach((item) => {
      //       item.status = value.data.unitStatus[0][item.deviceName];
      //     });
      //     this.$store.commit("dashboard/SET_UNITLIST", copy);
      //   }
      // }
    },
    plantCode(val) {
      this.init()
      this.openSocket()
    }
  },
  async created() {
    await this.init()
    // 建立socket连接
    this.openSocket()
  },
  mounted() {},
  destroyed() {
    // 断开监听器
    delete this.$options.sockets.onmessage
    // 断开socket连接
    this.$disconnect()
    if (this.websock) {
      this.websock.close()
    } // 离开路由之后断开websocket连接

    // this.$connect(
    //   `${socketUrl}/websocket/${this.plantCode}/${new Date().valueOf()}/1/2/${
    //     this.plantCode
    //   }`,
    //   { format: "json" }
    // );
    // // 注册监听器
    // this.$options.sockets.onmessage = (data) => {
    //   let mid = data.data;
    //   let msg = decodeURIComponent(mid);
    //   msg = msg.replace(/\+/g, " ");
    //   msg = decodeURIComponent(msg.replace(/\+/g, "%20"));
    //   msg = JSON.parse(msg);
    //   msg.time = new Date().valueOf(); // 给推送值加时间戳
    //   msg = JSON.stringify(msg);
    //   this.$store.commit("socket/SET_MESSAGE", msg);
    // };
  },
  methods: {
    init() {
      // 获取机组信息
      this.$store.dispatch('dashboard/getUnitList', this.plantCode).then(() => {
        // 获取机组启停状态
        this.initWebSocket()
        // selectImportantIndicator({ plant: this.plantCode }).then((res) => {

        //   let unitStatus = res.data.unitStatus[0];
        //   this.data = res.data;
        //   let copy = JSON.parse(JSON.stringify(this.unitList));
        //   copy.forEach((item) => {
        //     item.status = unitStatus[item.deviceName];
        //   });
        // this.$store.commit("dashboard/SET_UNITLIST", copy);
        const plantCn = this.getPlantCn(this.plants, this.plantCode)
        // 分页查询当前电厂的所有instanceId
        selectInstanceId({
          pn: 1,
          ps: 500,
          plantCn
        }).then((res) => {
          const data = res.data.records
          this.$store.commit('user/SET_INSTANCEIDLIST', data)
        })
        // 查询模型字典并存放在vuex中
        // getDict().then((res) => {
        //   const dict = res.data
        //   this.$store.commit('dashboard/SET_DICTIONARY', dict)
        // })
      })
      // });
    },
    // 获取当前选中电厂的中文名
    getPlantCn(plants, code) {
      let name = ''
      plants.forEach((ele) => {
        if (ele.deptCode == code) {
          name = ele.deptName
        }
      })
      return name
    },
    // 建立socket连接
    openSocket() {
      // 断开监听器
      delete this.$options.sockets.onmessage
      // 断开socket连接
      this.$disconnect()
      // 重新建立连接
      this.$connect(
        `${socketUrl}/assistant/websocket/${
          this.plantCode
        }/${new Date().valueOf()}/1/2/${this.plantCode}`,
        { format: 'json' }
      )
      // 注册监听器
      this.$options.sockets.onmessage = (data) => {
        const mid = data.data
        let msg = decodeURIComponent(mid)
        msg = msg.replace(/\+/g, ' ')
        msg = decodeURIComponent(msg.replace(/\+/g, '%20'))
        msg = JSON.parse(msg)
        msg.time = new Date().valueOf() // 给推送值加时间戳
        msg = JSON.stringify(msg)
        this.$store.commit('socket/SET_MESSAGE', msg)
      }
    },
    // 初始化模型实时数据weosocket
    initWebSocket() {
      const now = Date.now()
      this.path = `/assistant/unit_status/${this.plantCode}/${now}`
      if (this.websock) {
        this.websock.close()
      }
      const wsuri = socketUrl + this.path
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {
      // let actions = { test: "12345" };
      // this.websocketsend();
    },
    // 连接建立失败重连
    websocketonerror() {
      this.initWebSocket(this.path)
    },
    // 数据接收
    websocketonmessage(e) {
      const data = JSON.parse(e.data)
      const copy = JSON.parse(JSON.stringify(this.unitList))
      Object.keys(data).map((k) => {
        copy.forEach((ele) => {
          if (ele.deviceCode == k) {
            ele.runStatus = data[k]
          }
        })
      })
      this.$store.commit('dashboard/SET_UNITLIST', copy)
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
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.layout {
  height: 100%;
  background: #{$layoutBgColor};
  color: whitesmoke;
}
</style>
