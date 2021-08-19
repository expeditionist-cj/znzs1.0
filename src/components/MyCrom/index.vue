<template>
  <div class="MyCrom">
    <div class="img-box" :style="imgStyle">
      <img :src="initAvatar" v-if="!avatar">
      <img v-else :src="avatar" />
    </div>
    <cropImg
      field="img"
      @crop-success="cropSuccess"
      v-model="show"
      img-format="png"
      :noRotate="false"
    ></cropImg>
    <div class="btn-box" :style="btnClass" v-show="showUploadBtn">
      <el-button @click="show = true" type="primary" size="small">上传图片</el-button>
    </div>
  </div>
</template>

<script>
import cropImg from "vue-image-crop-upload";
export default {
  props: {
    showUploadBtn: {
      type: Boolean,
      default: true
    },
    initAvatar: {
      type: String,
      default: require("../../assets/role.png")
    },
    imgStyle: {
      type: String,
      default: "width:3rem;height:3rem"
    },
    btnClass: {
      type: String,
      default: "text-align:center"
    }
  },
  data() {
    return {
      show: false,
      avatar: ""
    };
  },
  components: { cropImg },
  computed: {},
  created() {},
  mounted() {
    if(this.initAvatar){
      this.avatar = this.initAvatar;
    }else{
      this.avatar = require('../../assets/role.png')
    }
    
  },
  computed() {},
  watch: {
    initAvatar(value) {
      this.avatar = value ||  require('../../assets/role.png')
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    //剪切成功后的回调函数
    cropSuccess(imgDataUrl) {
      //  imgDataUrl其实就是图片的base64data码
      this.avatar = imgDataUrl;
      let formData = new FormData();
      let file = this.dataURLtoFile(imgDataUrl, "xxx.png"); 
      formData.append("file", file);
      this.$emit("cropSuccess", formData, file);
    },
    // blob转file
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  }
};
</script>

<style scoped lang="scss">
.MyCrom {
  height: 100%;
  .img-box {
    width: 3rem;
    height: 3rem;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .btn-box {
    margin-top: 0.2rem;
    text-align: center;
  }
}
</style>
