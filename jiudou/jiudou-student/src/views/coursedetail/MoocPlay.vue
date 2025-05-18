/* eslint-disable prettier/prettier */
<template>
  <div class="course-play">
    <div class="course-play-content w">
      <div class="top-part">
        <div class="video-box"></div>
        <div class="video-list">
          <StuMoocVideoList
            :isEnroll="String(moocInfo.isMasterhead)"
            :currentVideo="currentVideo"
            @switchVideo="switchVideo"
            :data="moocCatalogList"
            :courseTotalNum="moocInfo.totalNum"
          ></StuMoocVideoList>
        </div>
      </div>
      <div class="middle-part">
        <div class="course-name">{{ moocInfo.name }}</div>
        <span class="ke-tag">
          <span style="visibility: hidden">1111</span>
          <span
            class="tag-item"
            v-for="(k, idx) in moocInfo.tagList"
            :key="idx"
            >{{ k }}</span
          >
          <el-button @click="addCourse" v-if="moocInfo.isMasterhead == 0"
            >报名参加</el-button
          >
        </span>
        <div class="course-brief">
          <span class="course-teacher">老师：{{ moocInfo.teacherName }}</span>

          <span class="course-interest-num"
            >{{ moocInfo.interestedNum }}人感兴趣</span
          >
        </div>
        <div class="price-bar">
          <span class="price"
            >课程时间：{{ formatToDateTime(moocInfo.createTime) }}至{{
              formatToDateTime(moocInfo.endTime)
            }}</span
          >
          <span class="has-course" v-if="moocInfo.status == 4">开课中</span>
          <span class="has-end" v-if="moocInfo.status == 2">已结课</span>
          <span class="has-course" v-if="moocInfo.status == 0">未发布</span>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="bottom-part">
        <div class="search-tabs-container">
          <el-tabs @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="课程简介" name="first">
              <div class="course-intro">
                <div v-html="moocInfo.introText"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
import dayjs from "dayjs";
// import StuMoocVideoList from '@/components/Stu-MoocVideoList.vue'
import StuMoocVideoList from "@/components/Stu-MoocVideoList_1.vue";

export default {
  name: "mooc-play",
  components: {
    StuMoocVideoList,
  },
  data() {
    return {
      isShow: true,
      moocInfo: {
        cover: "",
        name: "",
        teacherName: "",
        status: 0,
        interestedNum: 0,
        introText: "",
        isMasterhead: 0,
        tagList: [],
      },
      moocCatalogList: [],
      moocCourseId: this.$route.params.moocId,
      ccourseUuid: "",
      currentVideo: null,
      videoObject: {
        container: ".video-box",
        seek: "cookie",
        cookie: "abcdefg",
        timeScheduleAdjust: 1,
        video: "", //视频地址
      },
      activeName: "first",
      scrollTop: 0,
      player: null,
      currentPlayer: null,
    };
  },
  methods: {
    // 报名
    addCourse() {
      axios
        .request({
          method: "post",
          url: `/openccourse/ccourseUser/insert`,
          data: {
            courseId: this.moocCourseId,
            memberId: this.$store.state.user.userId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$notify({
              title: "",
              message: "报名成功",
              type: "success",
              offset: 100,
              duration: 3000,
            });
            this.getMoocInfo();
            this.getMoocCatalog();
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            });
          }
        });
    },
    getMoocInfo() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openCcourse/getDetail`,
          data: {
            courseId: this.moocCourseId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            let {
              cover,
              name,
              teacherName,
              status,
              interestedNum,
              introText,
              isMasterhead,
              tags,
              createTime,
              endTime,
            } = ret.data;
            this.moocInfo.cover = cover;
            this.moocInfo.name = name;
            this.moocInfo.teacherName = teacherName;
            this.moocInfo.status = status;
            this.moocInfo.interestedNum = interestedNum;
            this.moocInfo.introText = introText;
            this.moocInfo.isMasterhead = isMasterhead;
            this.moocInfo.tagList = tags ? tags.split(",") : [];
            this.moocInfo.createTime = createTime;
            this.moocInfo.endTime = endTime;
          }
        });
    },
    getMoocCatalog() {
      axios
        .request({
          method: "post",
          url: `/openccourse/ccourseCatalog/listCatalog`,
          data: {
            courseId: this.moocCourseId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.moocCatalogList = ret.data;
          }
        });
    },
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, e) {
      if (tab.name == "second") {
        console.log(this.ccourseUuid);
      }
    },
    switchVideo(data) {
      this.currentVideo = data;
      this.videoObject.video = data.leafObj;
      // eslint-disable-next-line no-undef
      this.currentPlayer = new ckplayer(this.videoObject);
      this.currentPlayer.ended(function () {
        console.log("end11");
      });
    },
    formatToDateTime(date = undefined, format = "YYYY-MM-DD") {
      return dayjs(date).format(format);
    },
  },
  async mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.currentVideo = this.$store.state.video.moocVideo;
    this.videoObject.video = this.currentVideo.leafObj;
    // eslint-disable-next-line no-undef
    this.player = new ckplayer(this.videoObject);
    this.player.ended(function () {
      console.log("end");
    });
    // eslint-disable-next-line no-undef
    // new ckplayer(this.videoObject);
    this.getMoocInfo();
    this.getMoocCatalog();
  },
};
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #fff;
}
.course-play {
  min-height: 657px;
  overflow: hidden;
  background-color: #f5f8fa;
  .course-play-content {
    margin-top: 100px;
    min-height: 800px;
    .top-part {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .video-box {
        width: 1000px;
        height: 600px;
      }
      .video-list {
        padding-left: 10px;
        width: 400px;
        height: 600px;
        // border: 1px solid #000;
        border-left: 2px solid #ddd;
      }
    }
    .middle-part {
      padding: 10px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .course-name {
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .ke-tag {
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tag-item {
          visibility: hidden;
          height: 20px;
          color: #10c4ee;
          padding: 0 2px;
          margin-right: 10px;
          border: 1px solid #10c4ee;
          border-radius: 2px;
        }
        .el-button {
          width: 90px;
          height: 40px;
          border-radius: 30px;
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          color: #fff;
        }
      }
      .course-brief {
        display: flex;
        justify-content: space-between;
        font-size: 17px;
        color: #666;
        .course-teacher {
        }
        .course-interest-num {
        }
      }
      .price-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .price {
          color: #666;
          font-size: 18px;
        }
        .has-course {
          font-size: 16px;
          color: #f0742b;
          border: 1px solid #f0742b;
          border-radius: 4px;
          padding: 2px 4px;
        }
        .has-end {
          font-size: 16px;
          color: #666;
          border: 1px solid #666;
          border-radius: 4px;
          padding: 2px 4px;
        }
      }
    }
    .el-divider--horizontal {
      margin: 0;
    }
    .bottom-part {
      min-height: 400px;
      padding: 10px;
      .search-tabs-container {
        /deep/ .el-tabs__item {
          font-size: 24px;
          font-weight: bold;
        }
        /deep/ .el-tabs__item:hover {
          color: #10c4ee;
        }
        /deep/ .el-tabs__item.is-active {
          color: #10c4ee;
        }
        /deep/ .el-tabs__nav-wrap::after {
          width: 0;
        }
        /deep/ .el-tabs__active-bar {
          // background: transparent;
          background: #10c4ee;
        }
        /deep/ .el-tabs__content {
          display: flex;
          #pane-second {
            width: 100%;
            padding-bottom: 200px;
          }
          .course-intro {
            min-height: 600px;
          }
          .course-chapter {
            width: 100%;
          }
          .no-data {
            width: 1100px;
            height: 580px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .course-name {
    font-size: 18px;
    margin-bottom: 20px;
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
  .pay-type {
    ul li {
      width: 180px;
      height: 60px;
      line-height: 60px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      //   transition: .1s;
      span {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      .pay-type-icon1 {
        background: url("../../assets/img/zfb.png") no-repeat #fff;
        background-size: 100%;
      }
      .pay-type-icon2 {
        background: url("../../assets/img/wx.png") no-repeat #fff;
        background-size: 100%;
      }
    }
    .active {
      border: 2px #03d3f2 solid;
    }
  }
  .money-pay-num {
    color: #f0742b;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .money-pay-text {
    color: #666;
    font-size: 12px;
    // margin-top: 10px;
    text-align: center;
    .pay-text {
      display: inline-block;
      text-align: left;
      vertical-align: middle;
    }
    img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
    }
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
  .qrcode {
    display: flex;
    flex-direction: column;
    border: 1px #d1d1d1 solid;
    padding-bottom: 10px;
    margin-top: 5px;
    position: relative;
    .zfb-img {
      position: absolute;
      right: -161px;
      top: -70px;
    }
  }
  .qrcode-t {
    color: #333;
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
