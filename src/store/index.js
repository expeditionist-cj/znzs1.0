import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import vuejsStorage from "vuejs-storage";
Vue.use(Vuex)
    // https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})
const store = new Vuex.Store({
    modules,
    getters,
    plugins: [
        vuejsStorage({
            keys: ['app.activeMenu',
                'app.activeModel',
                'app.activeSysSetting',
                'user.token',
                'user.name',
                'user.plantCode',
                'user.plantCn',
                'dashboard.unitList',
                'user.uid',
                'user.instanceIdList',
                'user.roleId',
                'user.plants',
                'user.showPlants',
                'backend.which_to_show',
                'backend.addInstanceId',
                'backend.modelCode',
                'backend.addFirst',
                'backend.addSecend',
                'backend.addThird',
                'backend.plantCode',
                'backend.unitCode',
                'backend.add_eng_sub_consume',
            ],
            namespace: 'vuexStorage',
            driver: vuejsStorage.drivers.sessionStorage //keep in sessionStorage
        })
    ]
})

export default store