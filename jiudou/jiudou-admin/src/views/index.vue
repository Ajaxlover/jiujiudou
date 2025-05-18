<template>
  <div class="indexHtml">
    <div class="bgImg">
      <img src="@/assets/images/bitmap.png" alt="" />
    </div>
    <!-- 接受分享弹框 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div style="background:transparent"></div>
          <div></div>
        </div>
      </template>
      <div class="shareInfo">
        <div class="info1">
          <img
            v-if="shareInfoData.pic"
            :src="shareInfoData.pic"
            alt=""
            class="userPic"
          />
          <img
            v-else
            src="@/assets/images/userPic.png"
            alt=""
            class="userPic"
          />
          <span
            >{{ shareInfoData.username }}老师给你分享了
            <span v-if="shareInfo.type == 1">资源库</span>
            <span v-if="shareInfo.type == 2">题库</span>
            <span v-if="shareInfo.type == 3">课件</span>
            <span v-if="shareInfo.type == 4">班级云课</span>
            <span v-if="shareInfo.type == 5">考试</span>
            <span v-if="shareInfo.type == 6">作业</span>
            <span v-if="shareInfo.type == 7">班级协助邀请</span>
          </span>
        </div>
        <div class="info2" v-if="isShowContent">{{ shareInfoData.name }}</div>
        <div class="info2" v-if="!isShowContent">{{ showContent }}</div>
        <div class="info3" v-if="isShowContent">
          <!-- <el-button v-if="shareInfo.type == 3">预览课件</el-button> -->
          <el-button type="primary" @click="toSave">保存</el-button>
          <span v-if="shareInfo.type == 1">资源库将保存到我的资源库列表</span>
          <span v-if="shareInfo.type == 2">题库将保存到我的题库列表</span>
          <span v-if="shareInfo.type == 3">课件将保存到课件库</span>
          <span v-if="shareInfo.type == 4">云课将保存到班级云课</span>
          <span v-if="shareInfo.type == 5">考试将保存到考试列表</span>
          <span v-if="shareInfo.type == 6">作业将保存到作业库</span>
          <span v-if="shareInfo.type == 7"
            >班级将被保存到协助的班级并获得该班级的管理权限</span
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.indexHtml {
  .bgImg {
    text-align: center;
    height: 100%;
    img {
      margin-top: 150px;
    }
  }
  .shareInfo {
    .info1 {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      .userPic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        float: left;
      }
      span {
        font-size: 18px;
        margin-left: 30px;
        span {
          margin-left: 0;
        }
      }
    }
    .info2 {
      font-size: 20px;
      margin-left: 90px;
      font-weight: bold;
    }
    .info3 {
      padding-left: 90px;
      padding-top: 40px;
      span {
        color: #999;
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";

// import { setStuToken, setStuInfo } from "@/libs/cookieUtil";

export default {
  name: "index",
  components: {},
  data() {
    return {
      isShareShow: false,
      shareCode: this.$route.query.shareCode ? this.$route.query.shareCode : "",
      type: this.$route.query.type ? this.$route.query.type : "",
      shareInfo: {},
      shareInfoData: {},
      isShowContent: false,
      showContent: ""
    };
  },
  mounted() {
    // let stuToken = this.$store.state.user.token
    // setStuToken(stuToken)
    // let stuInfo = {}
    // stuInfo.uid
    if (this.shareCode) {
      let obj = {
        type: this.type,
        shareCode: this.shareCode
      };
      sessionStorage.setItem("shareInfo", JSON.stringify(obj));
    }
    this.shareInfo =
      JSON.parse(sessionStorage.getItem("shareInfo")) == null
        ? {}
        : JSON.parse(sessionStorage.getItem("shareInfo"));
    if (
      this.shareInfo.shareCode &&
      this.$store.state.user.currentRole.roleId == 24
    ) {
      let url = "";
      if (this.shareInfo.type == 1) {
        url = "/resource/v4/share/shareInfo";
      } else if (this.shareInfo.type == 2) {
        url = "/tiku/v4/share/shareInfo";
      } else if (this.shareInfo.type == 4) {
        // 获取班级云课
        url = "/ccourse/v4/courseShare/shareInfo";
      } else if (this.shareInfo.type == 5) {
        // 获取被分享的考试
        url = "/exam/exam/paper/getShareInfo";
      } else if (this.shareInfo.type == 6) {
        // 获取被分享的作业
        url = "/tiku/exerciseShare/queryInfo";
      } else if (this.shareInfo.type == 7) {
        // 获取被分享的班级
        url = "/clazz/classAssistant/queryShareCodeInfo";
      } else {
        url = "/clazz/v4/wareShare/shareInfo";
      }
      axios
        .request({
          method: "post",
          url: url,
          data: {
            code: this.shareInfo.shareCode
          }
        })
        .then(data => {
          let ret = data.data;
          this.isShareShow = true;
          if (ret.code == 200) {
            this.isShowContent = true;
            this.shareInfoData = ret.data;
          } else {
            this.showContent = ret.msg;
          }
        });
    } else {
      this.isShareShow = false;
    }
  },
  beforeDestroy() {},
  methods: {
    toSave() {
      let url = "";
      if (this.shareInfo.type == 1) {
        url = "/resource/v4/share/getShare";
      } else if (this.shareInfo.type == 2) {
        url = "/tiku/v4/share/getShare";
      } else if (this.shareInfo.type == 4) {
        // 获取班级云课
        url = "/ccourse/v4/courseShare/getShare";
      } else if (this.shareInfo.type == 5) {
        url = "/exam/exam/paper/acceptShare";
      } else if (this.shareInfo.type == 6) {
        url = "/tiku/exerciseShare/getShare";
      } else if (this.shareInfo.type == 7) {
        url = "/clazz/classAssistant/acceptShare";
      } else {
        url = "/clazz/v4/wareShare/getShare";
      }
      axios
        .request({
          method: "post",
          url: url,
          data: {
            code: this.shareInfo.shareCode
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code == 200) {
            let shareType = JSON.parse(sessionStorage.getItem("shareInfo"))
              .type;
            if (shareType == 1) {
              this.$router.push({
                path: "/resource/resource",
                query: {}
              });
            } else if (shareType == 2) {
              this.$router.push({
                path: "/tiku/tiku",
                query: {}
              });
            } else if (shareType == 4) {
              // 去班级云课
              this.$router.push({
                path: "/coursewareLib/myCoursewareLib",
                query: {}
              });
            } else if (shareType == 5) {
              this.$router.push({
                path: "/exam/examManage"
              });
            } else if (shareType == 6) {
              this.$router.push({
                path: "/coursewareLib/myCoursewareLib",
                query: {}
              });
            } else {
              this.$router.push({
                path: "/coursewareLib/myCoursewareLib",
                query: {}
              });
            }
            sessionStorage.removeItem("shareInfo");
            this.shareInfoData = "";
            this.isShareShow = false;
            this.$message({
              message: ret.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    }
  }
};
</script>
