<template>
  <div class="stu-setting">
    <div class="stu-setting-content w">
      <div class="stu-form">
        <div class="img-container">
          <el-avatar :size="70" :src="avatarUrl"></el-avatar>
          <el-upload
            :multiple="false"
            :with-credentials="true"
            action=""
            :auto-upload="true"
            list-type="text"
            :show-file-list="false"
            :http-request="uploadSectionFile"
          >
            <el-button type="primary">更换头像</el-button>
          </el-upload>
        </div>
        <div class="form-container">
          <div class="stu-info">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="昵称">
                <el-input
                  placeholder="请输入昵称"
                  v-model="form.nickName"
                ></el-input>
              </el-form-item>
              <el-form-item label="学校">
                <el-input
                  placeholder="请输入学校名称"
                  v-model="form.school"
                ></el-input>
              </el-form-item>
              <el-form-item label="学号">
                <el-input
                  placeholder="请输入学号"
                  v-model="form.stuNum"
                ></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  placeholder="请输入姓名"
                  v-model="form.realName"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  placeholder="请输入邮箱地址"
                  v-model="form.email"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button @click="saveInfo" type="primary">保存</el-button>
            <el-button @click="toTeacher" type="primary">教师认证</el-button>
          </div>
        </div>
      </div>

      <el-dialog
        top="20vh"
        v-if="isShow"
        :visible.sync="isShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCloseViewDialog"
        width="800px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>上传认证资料</div>
          </div>
        </template>
        <div>
          <div
            style="display: flex; justify-content: center; margin-bottom: 20px"
          >
            <el-input
              style="width: 300px"
              v-model.trim="teacherName"
              placeholder="请填写真实姓名"
            ></el-input>
          </div>
          <div
            style="display: flex; justify-content: center; margin-bottom: 20px"
          >
            <el-select
              style="width: 300px"
              v-model="schoolName"
              filterable
              clearable
              placeholder="请选择学校"
            >
              <el-option
                v-for="item in schoolList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </div>
          <div class="teacher-info">
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="true"
              :http-request="uploadSectionFile1"
              action=""
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 10px">
            请上传教师资格证正面照(图片大小不超过5M)
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="submitInfo" type="primary"
            >提交</el-button
          >
          <el-button size="small" @click="handleCloseViewDialog"
            >取消</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
import { setStuInfo } from "@/libs/cookieUtil";

// import StuHeader from "@/components/Stu-Header.vue";

// import StuFooter from "@/components/Stu-Footer.vue";

export default {
  name: "stu-setting",
  components: {
    // StuHeader,
    // StuFooter,
  },
  data() {
    return {
      schoolList: [],
      schoolName: "",
      teacherName: "",
      imgUrl: "",
      isShow: false,
      form: {
        nickName: "",
        school: "",
        stuNum: "",
        realName: "",
        email: "",
      },
      avatarUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      username: "",
      userPic: "",
      scrollTop: 0,
      checkList: [],
      cloudCourseList: [],
      moocList: [],
      cloudPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      bookPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      fileObj: null,
      teacherFile: {},
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleAvatarSuccess(res, file) {
      // console.log(file);
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    // eslint-disable-next-line no-unused-vars
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt5M = file.size / 1024 / 1024 <= 5;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt5M) {
        this.$message({
          type: "warning",
          message: "上传图片大小不能超过5M，请检查",
          offset: 80,
        });
      }
      // return isJPG && isLt2M;
      return isLt5M;
    },
    toTeacher() {
      this.isShow = true;

      this.getSchoolList();
    },
    getSchoolList() {
      axios
        .request({
          method: "post",
          url: `/ebook/school/list`,
          data: {
            pageNo: 1,
            pageSize: 9999,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.schoolList = Object.freeze(ret.data.records);
          }
        });
    },
    handleCloseViewDialog() {
      this.teacherName = "";
      this.schoolName = "";
      this.teacherFile = {};
      this.imgUrl = "";
      this.isShow = false;
    },
    getUserInfo() {
      axios
        .request({
          method: "post",
          url: `/common/feign/member/infoByUid`,
        })
        .then((res) => {
          let ret = res.data;
          if (res.status === 200) {
            this.form.nickName = ret.username;
            this.form.school = ret.school ? ret.school : "";
            this.form.stuNum = ret.number ? ret.number : "";
            this.form.realName = ret.realName ? ret.realName : "";
            this.form.email = ret.email ? ret.email : "";
            this.avatarUrl = ret.pic;

            let userInfo = {};
            userInfo.uid = ret.uid;
            userInfo.pic = ret.pic;
            userInfo.username = ret.username;
            userInfo.type = "1";
            setStuInfo(JSON.stringify(userInfo));
            this.$store.commit("setHasGetInfo", true);
            this.$store.commit("setAvatar", ret.pic);
            this.$store.commit("setUserName", ret.username);
            this.$store.commit("setUserId", ret.uid);
          }
        });
    },
    uploadSectionFile1(params) {
      this.teacherFile = params.file;
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
            this.imgUrl = ret.data;
          }
        });
    },
    uploadSectionFile(params) {
      this.fileObj = params;
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
            this.avatarUrl = ret.data;
          }
        });
    },
    submitInfo() {
      if (!this.teacherName) {
        this.$message({
          type: "warning",
          message: "请填写真实姓名",
          offset: 80,
        });
        return;
      }
      if (!this.schoolName) {
        this.$message({
          type: "warning",
          message: "请选择学校",
          offset: 80,
        });
        return;
      }
      const formData = new FormData();
      console.log(this.teacherFile);
      formData.append("teacherName", this.teacherName);
      formData.append("school", this.schoolName);
      formData.append("picFile", this.teacherFile);

      axios
        .request({
          method: "post",
          url: `/user/teacherVerify/uploadTeacherInfo`,
          data: formData,
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            let CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            let cEvent = new CountEvent("apply_teacher");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              type: "success",
              message: "提交教师认证申请成功",
              offset: 80,
            });
            this.teacherName = "";
            this.schoolName = "";
            this.teacherFile = {};
            this.isShow = false;
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`,
              offset: 80,
            });
          }
        });
    },
    doSave() {
      let formData = new FormData();
      formData.append("file", this.fileObj ? this.fileObj.file : "");
      formData.append("username", this.form.nickName);
      formData.append("school", this.form.school);
      formData.append("number", this.form.stuNum);
      formData.append("realName", this.form.realName);
      formData.append("email", this.form.email);

      axios
        .request({
          method: "post",
          url: "/common/feign/member/updateUserInfo",
          data: formData,
        })
        .then((res) => {
          let ret = res.data;
          if (ret === 1) {
            let CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            let cEvent = new CountEvent("save_stuInfo");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              type: "success",
              message: "保存成功!",
              offset: 80,
            });
            setTimeout(() => {
              this.getUserInfo();
            }, 1000);
          }
        });
    },
    // 保存
    saveInfo() {
      if (this.form.nickName.trim().length === 0) {
        this.$message({
          type: "warning",
          message: "昵称不能为空",
          offset: 80,
        });
        return;
      }
      this.$confirm("是否确认修改个人资料?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.doSave();
          // this.$message({
          //   type: "success",
          //   message: "保存成功!",
          //   offset: 80,
          // });
        })
        .catch(() => {});
    },
  },
  mounted() {
    // this.username = this.$store.state.user.userName;
    // this.form.nickName = this.$store.state.user.userName;
    // this.userPic = this.$store.state.user.avatarImgPath;
    console.log(process.env);
    this.getUserInfo();
  },
};
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #fff;
}
.stu-setting {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;
  .stu-setting-content {
    margin-top: 100px;
    min-height: 540px;
    padding-top: 22px;
    .stu-form {
      width: 800px;
      // height: 100%;
      height: 500px;
      // background-color: red;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      .img-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
        .el-avatar--circle {
          border: 1px solid #ddd;
        }
        .el-button {
          margin-top: 10px;
          width: 140px;
          height: 40px;
          border-radius: 30px;
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          color: #fff;
          font-size: 14px;
        }
      }
      .form-container {
        // background-color: red;
        margin: 0 auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .stu-info {
          width: 600px;
          /deep/ .el-input__inner {
            background-color: #f7f7f7;
          }
        }
        .el-button {
          width: 137px;
          height: 48px;
          border-radius: 30px;
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          color: #fff;
          font-size: 18px;
        }
      }
    }
  }
  .dialog-footer {
    .el-button {
      width: 120px;
      height: 40px;
      border-radius: 40px;
      background: linear-gradient(-45deg, #03d3f2, #0491fd);
      color: #fff;
      font-size: 18px;
    }
  }
  .teacher-info {
    width: 180px;
    margin: 0 auto;
    border: 1px dashed #d9d9d9;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>
