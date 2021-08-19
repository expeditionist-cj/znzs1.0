<template>
  <div class="security-wrap">
    <div class="left">
      <Sercurity :num="data.yearCnt"/>
    </div>
    <div class="right">
      <Sercurity :num="data.allCnt" text="累计安全"/>
    </div>
  </div>
</template>

<script>
import Sercurity from "./Security";
import {selectSafeRunDay} from "@/api/dashboard";
import {  mapState } from "vuex";
export default {
  props: {},
  data() {
    return {
      data:{}
    };
  },
  components: {Sercurity},
  computed: {
     ...mapState({
      plantCode: state => state.user.plantCode,
    }),
  },
  created() {},
  mounted() {
    this.init()
  },
  watch: {
    plantCode(val){
      this.init()
    }
  },
  methods: {
    init(){
      selectSafeRunDay({
        plant:this.plantCode
      }).then(res=>{
        let data = res.data;
        this.data = data[0];
      })
    }
  }
};
</script>

<style scoped lang="scss">
.security-wrap {
  display: flex;
  justify-content: space-between; 
  .left {
    width: calc((100% - 0.12rem) / 2);
    // height: 8%;
    height: 0.74rem;
  }
  .right {
    width: calc((100% - 0.12rem) / 2);
   height: 0.74rem;
  }
}
</style>
