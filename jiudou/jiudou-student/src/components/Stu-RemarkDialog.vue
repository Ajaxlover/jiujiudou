<template>
  <div>
    <el-dialog
      v-if="isShow"
      :title="titleText"
      :visible="isShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="55%"
      center
      append-to-body
    >
      <div>
        <el-form
          :model="form"
          label-width="90px"
          style="margin: 20px 70px"
          @submit.native.prevent
        >
          <el-form-item v-if="remarkType == 1" label="标题" prop="title">
            <el-input v-model.trim="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input
              :placeholder="`${replyName}`"
              type="textarea"
              v-model.trim="form.content"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="imgUrls">
            <el-upload
              action=""
              :limit="9"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :auto-upload="true"
              :http-request="uploadSectionFile"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <img
              v-show="dialogVisible"
              width="100%"
              :src="dialogImageUrl"
              alt=""
            />
            <el-dialog
              custom-class="img-log"
              :modal="false"
              :visible.sync="dialogVisible"
            >
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
        </el-form>
        <section>
          <el-button @click="doDiscuss" class="but-pay">{{
            remarkType == "3" ? "回复" : "发布"
          }}</el-button>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "@/libs/api.request";

export default {
  name: "stu-remark",
  props: {
    isShow: Boolean,
    remarkType: String,
    replyName: {
      type: String,
      default: () => {
        return "请输入内容...";
      },
    },
  },
  data() {
    return {
      form: {
        title: "",
        content: "",
        contentUrl: "",
      },
      imgUrls: [],
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  computed: {
    titleText() {
      if (this.remarkType == 1) {
        return "创建话题";
      } else if (this.remarkType == 2) {
        return "讨论";
      } else {
        return "回复";
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    uploadSectionFile(params) {
      console.log(params);
      const form = new FormData();
      // 文件对象
      form.append("file", params.file);
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/uploadImage",
          data: form,
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.imgUrls.push({
              picUid: params.file.uid,
              url: ret.data,
            });
          }
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let index = this.imgUrls.findIndex((item) => item.picUid == file.uid);
      this.imgUrls.splice(index, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    doDiscuss() {
      this.$emit("submit", {
        title: this.form.title,
        content: this.form.content,
        contentUrl: this.imgUrls,
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .img-log {
  // background-color: transparent;
}
.but-pay {
  background: #03d3f2;
  width: 50%;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 0;
}
</style>
