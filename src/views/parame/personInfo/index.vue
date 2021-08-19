<template>
  <div class="personInfo-wrap" v-loading = "loading">
    <PersonInfoRow v-for="(item,index) in formDataList" :key="index" :formData="item"></PersonInfoRow>
  </div>
</template>
<script>
import PersonInfoRow from "./personInfoRow";
import {
  queryByInstanceId
} from "@/api/modelnstanceBasicInfo";
import { mapState } from "vuex"; // 引入vuex state
export default {
  components: {PersonInfoRow},
  data() {
    return {
      formDataList: [],
      loading:false
    };
  },
  computed: {
    ...mapState({
      addInstanceId: state => state.backend.addInstanceId,
    })
  },
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      queryByInstanceId({ instanceId: this.addInstanceId }).then(res=>{
        let data = res.data;
        this.formDataList = data;
        this.timer = setTimeout(()=>{
            this.loading = false;
          },500)
      }).catch(e=>{
        this.loading = false;
      })
    }
  },
  destroyed(){
    clearTimeout(this.timer);
  }
};
</script>
<style lang="scss">
.personInfo {

}
</style>
