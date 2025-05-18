<template>
  <label class="my-file-input">
    <input
      type="file"
      name="file"
      ref="fileVal"
      @change="fileChange"
      :accept="accept"
      :multiple="multiple"
    />
    <span class="my-file-container" data-title="选择">
      <span class="my-file-name" :data-title="result">
        <i class="my-icon el-icon-upload"></i>
      </span>
    </span>
    <a class="remove" href="#" v-if="showClose" @click="clearFile">
      <i class="my-icon el-icon-close"></i>
    </a>
  </label>
</template>

<script>
export default {
  name: "fileModal",
  props: {
    accept: {
      type: String,
      default: "*/*"
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      result: "请选择文件",
      showClose: false
    };
  },
  methods: {
    fileChange: function() {
      console.log(this.$refs.fileVal.files);
      let url = this.$refs.fileVal.value.split("\\");
      // this.result = url[url.length - 1];
      let arr = [];
      this.$refs.fileVal.files.forEach(element => {
        arr.push(element.name);
      });
      this.result = arr.join(",");
      if (url) {
        this.showClose = true;
        if (this.multiple) {
          this.$emit("fileChange", this.$refs.fileVal.files);
        } else {
          this.$emit("fileChange", this.$refs.fileVal.files[0]);
        }
      }
    },
    clearFile: function() {
      this.$refs.fileVal.value = "";
      this.result = "请选择文件";
      this.showClose = false;
      this.$emit("fileChange", null);
    }
  }
};
</script>

<style lang="scss">
.my-file-input {
  display: block;
  font-size: inherit;
  position: relative;
  height: 30px;
  label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }
}
.my-file-input input[type="file"] {
  position: absolute;
  z-index: -999;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 1;
  filter: alpha(opacity=0);
  display: block;
}
.my-file-input .my-file-container {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background-color: #fff;
  border: 1px solid #d5d5d5;
  cursor: pointer;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-transition: all 0.15s;
  -o-transition: all 0.15s;
  transition: all 0.15s;
  border-radius: 5px;
}
.my-file-input .my-file-container:before {
  display: inline-block;
  content: attr(data-title);
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  line-height: 24px;
  text-align: center;
  padding: 0 8px;
  background-color: #6fb3e0;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid #fff;
  border-left-width: 4px;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  border-radius: 5px;
}
.my-file-input .my-file-container .my-icon {
  display: inline-block;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  line-height: 24px;
  width: 26px;
  text-align: center;
  font-family: FontAwesome;
  font-size: 18px;
  border: 2px solid #fff;
  color: #fff;
  -webkit-transition: all 0.1s;
  -o-transition: all 0.1s;
  transition: all 0.1s;
  background-color: #d1d1d1;
}
.my-file-input .my-file-container .my-file-name {
  display: inline-block;
  height: 28px;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  line-height: 28px;
  color: #888;
  font-size: 13px;
  vertical-align: top;
  position: static;
  padding-left: 30px;
}
.my-file-input .remove {
  position: absolute;
  right: -22px;
  top: 6px;
  width: 17px;
  text-align: center;
  height: 17px;
  line-height: 15px;
  font-size: 11px;
  font-weight: 400;
  background-color: #fb7142;
  border-radius: 100%;
  color: #fff;
  text-decoration: none;
  .el-icon-close {
    height: 17px;
    display: inline-block;
    width: 17px;
    line-height: 17px;
    text-align: center;
  }
}
.my-file-input .my-file-container .my-file-name:after {
  display: inline-block;
  content: attr(data-title);
}
</style>
