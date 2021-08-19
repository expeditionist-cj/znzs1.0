<template>
  <div class="indicator">
    <Block>
      <div slot="title" class="title">
        <div class="title-wrap">
          <div>关键指标看板</div>
          <div class="unit" >
            <div v-for="(item,index) in unitList" :key="index" :class="{stop:!Number(item.status)}" @click="onUnit(index,item.deviceName)">
              <img v-show="active == index" src="../../../../assets/dashboard/trangle.png" alt="">
              <span>{{item.deviceName.split("机组")[0]}}</span>
            </div>
          </div>
          <div class="icon">
            <div>
              <svg-icon icon-class="curve" class-name="custom-curve" />
            </div>
            <div>
              <svg-icon icon-class="menu" class-name="custom-menu" />
            </div>
          </div>
        </div>
      </div>
      <div slot="content" class="content clearfix">
        <Quota v-for="item in unitData" :key = "item.code" :data="item" :status="status"/>
      </div>
    </Block>
  </div>
</template>

<script>
import Block from "../Block";
import Quota from "./Quota"
import { selectUnitCode,selectImportantIndicator } from "@/api/dashboard";
import { mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      active:0,
      unitData:[],
      status:'',
    };
  },
  components: { Block,Quota },
  computed: {
    ...mapState({
      plantCode: state => state.user.plantCode,
      unitList: state => state.dashboard.unitList,
      msg:state=>state.socket.message,
    })
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    msg(value) {
      if (value) {
        value = JSON.parse(value);
        // 更新机组状态
        if (value.type == "webImportantIndicator") {
          this.data = value.data;
        }
      }
    },
    plantCode(val){
      this.init();
      this.active = 0;
    }
  },
  methods: {
    async init() {
      // 获取机组信息
      await this.$store.dispatch("dashboard/getUnitList", this.plantCode);
      // 获取关键指标信息
      // selectImportantIndicator({plant: this.plantCode}).then(res=>{
      //   let unitStatus = res.data.unitStatus[0]; 
      //   this.unitData = res.data['#1机组'];
      //   this.data = res.data; // 保存数据
      //   this.status = res.data['unitStatus'][0]['#1机组'];
      //   let copy = JSON.parse(JSON.stringify(this.unitList)); 
      //   copy.forEach(item=>{
      //     item.status = unitStatus[item.deviceName]
      //   }); 
      //   this.$store.commit('dashboard/SET_UNITLIST',copy); 
      // })
    },
    // 选择机组
    onUnit(index,deviceName){
      this.active = index;
      this.status = this.data['unitStatus'][0][deviceName];
      this.unitData = this.data[deviceName];
    }
  }
};
</script>

<style scoped lang="scss">
.indicator {
  width: 100%;
  height: 3.14rem;
  // height: 33%;
  margin-top:0.1rem;
  .block {
    // height: 3.14rem;
    height: 100%;
  }
  .title {
    padding-right: 0.24rem;
    .title-wrap {
      display: flex;
      // align-items: center;
      justify-content: space-between;
    }
    .unit {
      display: flex;
      flex-direction: row;
      padding-top: .02rem;
      &>div{
        width: .36rem;
        height: .22rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius:4px;
        font-size: .16rem;
        font-weight: 500;
        color:rgba(255,255,255,1);
        background:rgba(33,211,84,1);
        margin-right: .14rem;
        cursor: pointer;
        &>img{
          width: .14rem;
          height: .1rem;
          position: absolute;
          top: -0.1rem;
        }
      }

    }
    .run{
      background:rgba(33,211,84,1);
    }
    .stop{
      background:rgba(247,88,88,1)!important;
    }
    .icon{
      display: flex;
      // align-items: center;
      // padding-top: .08rem;
      &>div{
        width: 0.24rem;
        height: 0.24rem;
        background:rgba(53,72,112,1);
        border-radius: .04rem;
        text-align: center;
        line-height: 0.24rem;
      }
      &>div:first-child{
        margin-right: .10rem;
      }
      .custom-curve{
        width: .16rem;
        height: .16rem;
        
        position: relative;
        top: -0.02rem;
      }
      .custom-menu{
        width: .16rem;
        height: .16rem;
      }
      
    }
  }
  .content{
    padding-top: .32rem;
    padding-left: .72rem;
    padding-right: .22rem;
    &>.quota:nth-child(2n){
      padding-left: .6rem;
    }
    .quota{
      width: 50%;
      float: left;
      margin-bottom: .2rem;
    }
  }
}
</style>
