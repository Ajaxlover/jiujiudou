<template>
  <div class="cropper-wrapper">
    <div class="img-box">
      <img
        class="cropper-image"
        id="image"
        :src="url"
        alt=""
        :aspectRatio="aspectRatio"
      />
    </div>
    <div class="right-con">
      <div class="preview-box previewImg"></div>
      <div class="button-box">
        <slot>
          <el-upload
            class="avatar-uploader"
            :action="action"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="fileChange"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.cropper-wrapper {
  .img-box {
    height: 340px;
    width: 430px;
    border: 1px solid #ebebeb;
    display: inline-block;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
    // img{
    //   max-width: 100%;
    //   display: block;
    // }
  }
  .right-con {
    display: inline-block;
    width: 170px;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 10px;
    .preview-box {
      // height: 212px !important;
      width: 200px !important;
      overflow: hidden;
      border: 1px solid #ebebeb;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
      img {
        width: 100%;
      }
    }
    .button-box {
      padding: 10px 0 0;
    }
  }
}
</style>
<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
export default {
  name: "cropper",
  props: {
    aspectRatio: {
      type: Number,
      default: ""
    }
  },
  data() {
    return {
      cropper: "",
      croppable: false,
      panel: false,
      url: "",
      fileName: "",
      action: ""
    };
  },
  methods: {
    fileChange(file, fileList) {
      let fileName = file.name;
      this.fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.url = URL.createObjectURL(file.raw);
      } else {
        this.$message.error("请选择图片文件");
      }
      this.panel = true;
      //每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      this.panel = true;
    },
    crop() {
      this.panel = false;
      if (!this.croppable) {
        this.$message({
          type: "warning",
          message: "请选择图片"
        });
        let file = null;
        this.$emit("on-crop", file);
        return;
      }
      this.compressImage(1);
    },
    compressImage(quality) {
      let dataURL = this.cropper
        .getCroppedCanvas()
        .toDataURL("image/jpeg", quality);
      let file = this.blobToFile(this.dataURLtoBlob(dataURL), this.fileName);
      if (file.size > 1024 * 1024) {
        quality = quality - 0.1;
        this.compressImage(quality);
      } else {
        this.$emit("on-crop", file);
      }
    },
    clear() {
      if (this.cropper) {
        this.cropper.destroy();
        this.croppable = false;
        this.initCrop();
      }
    },
    //将base64转换为blob对象 解决低版本浏览器兼容问题
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(",");
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var mime = arr[0].match(/:(.*?);/)[1];
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    //将blob转换成file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },
    initCrop() {
      this.$nextTick(() => {
        //初始化这个裁剪框
        var self = this;
        var image = document.getElementById("image");
        this.cropper = new Cropper(image, {
          preview: ".previewImg",
          aspectRatio: this.aspectRatio,
          resizable: false,
          zoomable: false,
          dragCrop: false,
          movable: false,
          viewMode: 1,
          ready: function() {
            self.croppable = true;
          }
        });
        document.querySelector(".preview-box").style.height =
          200 / this.aspectRatio + "px";
      });
    }
  },
  mounted() {
    this.initCrop();
  }
};
</script>
