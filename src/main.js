import "babel-polyfill";
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import moment from "moment";
import '@/styles/index.scss' // global css
import '@/styles/changeElement.scss'
import 'animate.css'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 引入vue-echarts
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/radar';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/radar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import "echarts/map/js/china.js";

// 引入websocket
import VueNativeSock from 'vue-native-websocket'

import { install } from "@/utils/downLoadExcel";
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import axios from 'axios'
Vue.use(Avue,axios);
// import AEditor from 'aeditor';
// Vue.use(AEditor)
install(Vue)
    //注册全局容器
Vue.component('v-chart', ECharts);

// 引入websocket
Vue.use(VueNativeSock, 'ws://localhost:6005', {
    connectManually: true,
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionAttempts: 5,
})


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV) {
    const { mockXHR } = require('../mock')
    mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);



// Vue.use(animated)
Vue.config.productionTip = false

Vue.prototype.moment = moment;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
