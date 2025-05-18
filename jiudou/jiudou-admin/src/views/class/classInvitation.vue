<template>
  <div class="classInvitation">
    <el-button
      class="backBtn"
      type="text"
      icon="el-icon-back"
      @click="backClick"
      >返回九斗</el-button
    >
    <div class="className">{{ className }}：{{ cls.stuNum }}人</div>
    <div class="tip">
      学生需要使用“九斗”APP扫描二维码或在加入班级时输入邀请码
    </div>
    <div style="display:flex;justify-content:center;">
      <div style="margin-right:100px;">
        <div class="container">
          <img class="icon" src="@/assets/images/180.png" />
          <div style="font-size:70px;">九斗</div>
        </div>
        <el-button type="primary" @click="copy()">复制九斗下载链接</el-button>
      </div>
      <div>
        <div class="container">
          <div class="qrCode">
            <qrcode :value="cls.number" :options="{ width: 385 }"></qrcode>
          </div>
          <div>
            <span style="font-size:30px;">班级邀请码：</span>
            <span style="font-size:35px;font-weight:bold;">{{
              cls.invitationCode
            }}</span>
          </div>
        </div>
        <el-button type="primary" @click="copy(2)">复制班级邀请链接</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.classInvitation {
  background: #0e4378;
  color: white;
  font-weight: 400;
  text-align: center;
  padding-top: 139px;
  padding-bottom: 119px;
  .backBtn {
    position: absolute;
    left: 40px;
    top: 20px;
    color: white;
    font-size: 20px;
  }
  .className {
    font-weight: bold;
    font-size: 50px;
  }
  .tip {
    font-size: 30px;
    margin-top: 39px;
    margin-bottom: 44px;
  }
  .icon {
    width: 147px;
    border-radius: 20px;
    margin-top: 150px;
    margin-bottom: 30px;
  }
  .qrCode {
    background: url("~@/assets/images/img_qrcode_line.png");
    width: 439px;
    height: 441px;
    margin-top: 21px;
    margin-bottom: 30px;
    margin-left: 24px;
    padding: 29px 27px 0px 27px;
  }
  .container {
    width: 487px;
    height: 564px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    margin-bottom: 30px;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
export default {
  data() {
    return {
      cls: {},
      timer: null,
      className: this.$route.query.className
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.timer = setInterval(() => {
      this.loadInfo();
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    backClick() {
      this.$router.push("/class/myClass");
    },
    loadInfo() {
      axios
        .request({
          method: "post",
          url: "clazz/clazz/info",
          data: {
            uid: this.$store.state.user.userId,
            classId: this.$route.query.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.cls = ret.data;
          }
        });
    },
    copy(type) {
      let Url2 = "https://www.guangyiedu.com/app/index.html"; //每一行的某个值，如选中的当前行的url
      if (type == 2) {
        let uid = this.$store.state.user.userId;
        Url2 =
          "https://static.guangyiedu.com/classCodeShare/index.html?uid=" +
          uid +
          "&classId=" +
          this.cls.classId;
      }
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = Url2; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    }
  }
};
</script>
