<template>
  <div class="course-play">
    <div class="course-play-content w">
      <div class="top-part">
        <div class="video-box"></div>
        <div class="video-list">
          <StuVideoList
            :isEnroll="String(courseInfo.isEnroll)"
            :currentVideo="currentVideo"
            @switchVideo="switchVideo"
            :data="courseInfo.catalog"
            :courseTotalNum="courseInfo.ccourseTotalNum"
          ></StuVideoList>
        </div>
      </div>
      <div class="middle-part">
        <div class="course-name">{{ courseInfo.ccourseName }}</div>
        <div class="course-brief">
          <span class="course-teacher"
            >老师：{{ courseInfo.ccourseTeacherName }}</span
          >
          <span class="course-interest-num"
            >{{ courseInfo.ccourseInterestedNum }}人感兴趣</span
          >
        </div>
        <div class="price-bar">
          <span v-if="courseInfo.ccourseFeeType === 0" class="price">免费</span>
          <span v-else class="price">￥{{ courseInfo.ccoursePrice }}</span>
          <span class="has-course" v-if="courseInfo.isEnroll == 1">已报名</span>
          <el-button
            @click="handlePay"
            v-if="courseInfo.ccourseFeeType === 1 && courseInfo.isEnroll == 0"
            >购买</el-button
          >
          <el-button
            @click.native="getFree"
            v-if="courseInfo.ccourseFeeType === 0 && courseInfo.isEnroll == 0"
            >免费获取</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div class="bottom-part">
        <div class="search-tabs-container">
          <el-tabs @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="课程简介" name="first">
              <div class="course-intro">
                <iframe
                  style="width: 1400px; height: 1000px"
                  frameborder="0"
                  scrolling="auto"
                  :src="courseInfo.ccourseIntro"
                ></iframe>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="isShow" :label="`课程讨论`" name="second">
              <Comment
                v-model="data"
                :user="currentUser"
                :before-submit="submit"
                :before-like="like"
                :before-delete="deleteComment"
                :upload-img="uploadImg"
                :props="props"
              />
              <div
                style="
                  display: flex;
                  justify-content: center;
                  margin-bottom: 20px;
                "
              >
                <el-pagination
                  background
                  :hide-on-single-page="true"
                  layout="prev, pager, next"
                  :page-size="commentPage.pageSize"
                  :current-page.sync="commentPage.page"
                  @current-change="getCommentList"
                  :total="commentPage.total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 云课购买 -->
    <el-dialog
      title=""
      :visible.sync="isPayShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="55%"
    >
      <div>
        <el-row>
          <div class="course-name">云课名称:{{ courseInfo.ccourseName }}</div>
        </el-row>
        <el-row
          ><div class="course-name">
            云课价格:
            <span style="color: #f0742b">￥{{ courseInfo.ccoursePrice }}</span>
          </div></el-row
        >
        <el-row>
          <div class="course-name">支付方式:</div>
        </el-row>
        <section class="pay-type">
          <ul>
            <li :class="payType == 2 ? 'active' : ''" @click="payType = 2">
              <span class="pay-type-icon2"></span>微信支付
            </li>
            <li :class="payType == 1 ? 'active' : ''" @click="payType = 1">
              <span class="pay-type-icon1"></span>支付宝
            </li>
          </ul>
        </section>
        <section>
          <el-button @click="goPay" class="but-pay">去付款</el-button>
        </section>
      </div>
    </el-dialog>
    <!-- 云课支付 -->
    <el-dialog
      :title="`云课名称：${courseInfo.ccourseName}`"
      :visible.sync="isQRcode"
      :close-on-click-modal="false"
      :before-close="handleCode"
      width="40%"
    >
      <section style="width: 150px; margin: 0 auto">
        <section style="text-align: center; margin-bottom: 6px">
          扫一扫付款 (元)
        </section>
        <section class="money-pay-num">{{ courseInfo.ccoursePrice }}</section>
        <section class="qrcode">
          <vue-qr
            :text="qrcode"
            colorDark="#000"
            colorLight="#fff"
            :margin="5"
            :size="100"
          ></vue-qr>
          <img src="../../assets/img/zfb1.png" class="zfb-img" width="100%" />
          <section class="money-pay-text">
            <img src="../../assets/img/qrcode.png" width="100%" />
            <div class="pay-text">
              <p>打开手机支付</p>
              <p>扫一扫付款</p>
            </div>
          </section>
        </section>
        <section v-if="payType == 2" class="qrcode-t">微信扫码支付</section>
        <section v-if="payType == 1" class="qrcode-t">支付宝扫码支付</section>
      </section>
      <section style="text-align: center; margin: 20px 0">
        <span slot="footer" class="dialog-footer">
          <!-- <el-button class="but-pay" @click="isQRcode = false">确 定</el-button> -->
        </span>
      </section>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */

// @ is an alias to /src
import axios from "@/libs/api.request"
// import StuVideoList from "@/components/Stu-VideoList.vue";
import StuVideoList from "@/components/Stu-VideoList_1.vue"
import vueQr from "vue-qr"
import Comment from "@/components/Comment"

export default {
  name: "clould-play",
  components: {
    StuVideoList,
    vueQr,
    Comment,
  },
  data() {
    const users = [
      {
        name: "Up&Up",
        avatar: require("../../assets/image/avatar1.jpg"),
        author: true,
      },
    ]
    return {
      isShow: true,
      courseInfo: {
        catalog: [],
        ccourseCover: "",
        ccourseFeeType: 0,
        ccourseId: 0,
        ccourseInterestedNum: 0,
        ccourseIntro: "",
        ccourseName: "",
        ccourseOldPrice: 0,
        ccoursePrice: 0,
        ccourseTags: "",
        ccourseTagsList: [],
        ccourseTeacherName: "",
        ccourseTotalNum: 0,
        ccourseUuid: "",
        isEnroll: 0,
      },
      cCourseId: this.$route.params.cCourseId,
      ccourseUuid: "",
      currentVideo: null,
      videoObject: {
        container: ".video-box", //“#”代表容器的ID，“.”或“”代表容器的class
        seek: "cookie", //指定跳转到cookie记录的时间，使用该属性必需配置属性cookie
        cookie: "abcdefg", //cookie名称,请在同一域中保持唯一
        timeScheduleAdjust: 5,
        video: "", //视频地址
      },
      orderCode: "", //订单号
      qrcode: "",
      payType: 2,
      isPayShow: false,
      isQRcode: false,
      timerId: null,
      activeName: "first",
      scrollTop: 0,
      player: null,
      currentPlayer: null,
      props: {
        id: "discussId",
        content: "discussContent",
        children: "reply",
        likes: "likeNum",
        liked: "isLike",
        reply: "reply2",
        createAt: "createTime",
        user: "visitor",
      },
      currentUser: {
        name: this.$store.state.user.userName,
        avatar: this.$store.state.user.avatarImgPath,
        author: true,
      },
      classId: this.$store.state.user.classId,
      users,
      wrapStyle: "",
      data: [],
      commentPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, e) {
      if (tab.name == "second") {
        console.log(this.ccourseUuid)
        this.getCommentList()
      }
    },
    switchVideo(data) {
      this.currentVideo = data
      this.videoObject.video = data.catalogUrl
      // eslint-disable-next-line no-undef
      this.currentPlayer = new ckplayer(this.videoObject)
      this.currentPlayer.ended(() => {
        console.log("end11")
        if (this.classId) {
          this.commitStudyRecord()
        }
      })
      this.commentPage.page = 1
      this.getCommentList()
    },
    commitStudyRecord() {
      axios
        .request({
          method: "post",
          url: `/classCourse/study`,
          data: {
            cCourseUuid: this.ccourseUuid,
            catalogUuid: this.currentVideo.catalogUuid,
            classId: this.classId,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            console.log("记录")
          }
        })
    },
    getCloudCourseDetail() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/detail`,
          data: {
            cCourseId: this.cCourseId,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            let {
              catalog,
              ccourseCover,
              ccourseFeeType,
              ccourseId,
              ccourseInterestedNum,
              ccourseIntro,
              ccourseName,
              ccoursePrice,
              ccourseTags,
              ccourseTeacherName,
              ccourseTotalNum,
              ccourseUuid,
              isEnroll,
            } = ret.data
            this.courseInfo.catalog = catalog
            this.courseInfo.ccourseCover = ccourseCover
            this.courseInfo.ccourseFeeType = ccourseFeeType
            this.courseInfo.ccourseId = ccourseId
            this.courseInfo.ccourseInterestedNum = ccourseInterestedNum
            this.courseInfo.ccourseIntro = ccourseIntro
            this.courseInfo.ccourseName = ccourseName
            this.courseInfo.ccoursePrice = Number(
              Number(ccoursePrice / 100).toFixed(2)
            )
            this.courseInfo.ccourseTags = ccourseTags
            this.courseInfo.ccourseTeacherName = ccourseTeacherName
            this.courseInfo.ccourseTotalNum = ccourseTotalNum
            this.courseInfo.ccourseUuid = ccourseUuid
            this.ccourseUuid = ccourseUuid
            this.courseInfo.isEnroll = isEnroll
            this.courseInfo.ccourseTagsList = ccourseTags
              ? ccourseTags.split(",")
              : []
          }
        })
    },
    handlePay() {
      this.isPayShow = true
    },
    handleClose() {
      this.isPayShow = false
      this.payType = 2
    },
    handleCode() {
      this.payType = 2
      this.isQRcode = false
      clearTimeout(this.timerId)
    },
    getFree() {
      let { ccourseUuid: cCourseUuid } = this.courseInfo
      axios
        .request({
          method: "post",
          url: `/nOrder/buyCCourse`,
          data: {
            cCourseUuid,
            os: "PC",
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.$notify({
              title: "提示",
              message: "免费获取成功",
              type: "success",
              offset: 100,
              duration: 3000,
            })
            this.getCloudCourseDetail()
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            })
          }
        })
    },
    goPay() {
      let { ccourseUuid: cCourseUuid } = this.courseInfo
      axios
        .request({
          method: "post",
          url: `/cloudCourse/codePay`,
          data: {
            cCourseUuid,
            chargeType: this.payType,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.qrcode = ret.data.codeUrl
            this.orderCode = ret.data.orderCode
            this.isPayShow = false
            this.isQRcode = true
            setTimeout(() => {
              this.queryPayStatus()
            }, 1000)
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            })
          }
        })
    },
    queryPayStatus() {
      axios
        .request({
          method: "post",
          url: `/order/queryOrderPayStatus`,
          data: {
            orderCode: this.orderCode,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.$message({
              title: "提示",
              message: "支付成功",
              type: "success",
              offset: 80,
            })
            this.isQRcode = false
            this.getCloudCourseDetail()
          } else {
            this.timerId = setTimeout(() => {
              this.queryPayStatus()
            }, 1000)
          }
        })
    },
    // 获取讨论
    getCommentList() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/discuss/listWithReplyByPage`,
          data: {
            catalogUuid: this.currentVideo.catalogUuid,
            cCourseUuid: this.ccourseUuid,
            page: this.commentPage.page,
            pageSize: this.commentPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.commentPage.total = ret.data.total
            let commentList = []
            ret.data.data.forEach((element) => {
              let temp = {}
              temp.name = element.userName
              temp.avatar = element.userPic
              element.visitor = temp
              if (element.reply.length > 0) {
                element.reply.forEach((i) => {
                  let temp1 = {}
                  let temp2 = {}
                  temp1.name = i.userName
                  temp1.avatar = i.userPic
                  temp2.name = i.replyName
                  i.visitor = temp1
                  i.reply2 = temp2
                })
              }
              commentList.push(element)
            })
            console.log(commentList)
            this.data = []
            this.data.push(...commentList)
            // this.data = new Array(1).fill(commentList).flat(Infinity);
          }
        })
    },
    // eslint-disable-next-line no-unused-vars
    async submit(newComment, parent, add) {
      // 发布评论
      if (!parent) {
        axios
          .request({
            method: "post",
            url: `/cloudCourse/discuss/release`,
            data: {
              catalogUuid: this.currentVideo.catalogUuid,
              cCourseUuid: this.ccourseUuid,
              content: newComment.discussContent,
            },
          })
          .then((res) => {
            let ret = res.data
            if (ret.code === 200) {
              this.isShow = false
              this.$nextTick(() => {
                this.isShow = true
              })
              this.getCommentList()
            }
          })
      } else {
        // 回复
        axios
          .request({
            method: "post",
            url: `cloudCourse/discuss/reply`,
            data: {
              replyId: parent.id,
              content: newComment.discussContent,
            },
          })
          .then((res) => {
            let ret = res.data
            if (ret.code === 200) {
              this.isShow = false
              this.$nextTick(() => {
                this.isShow = true
              })
              this.getCommentList()
            }
          })
      }
    },

    async like(comment) {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/discuss/like`,
          data: {
            discussId: comment.discussId,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            console.log("点赞成功")
            this.getCommentList()
          }
        })
    },

    async uploadImg({ file, callback }) {
      const res = await new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {
          resolve(reader.result)
        }

        reader.onerror = () => {
          reject(reader.error)
        }
      })

      callback(res)
      console.log("uploadImg： ", res)
    },

    // eslint-disable-next-line no-unused-vars
    async deleteComment(comment, parent) {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/discuss/remove`,
          data: {
            discussId: comment.discussId,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功",
              offset: 80,
            })
            this.getCommentList()
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            })
          }
        })
    },
  },
  async mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.currentVideo = this.$store.state.video.videoUrl
    this.videoObject.video = this.currentVideo.catalogUrl
    // eslint-disable-next-line no-undef
    this.player = new ckplayer(this.videoObject)
    this.player.ended(() => {
      console.log("end")
      if (this.classId) {
        this.commitStudyRecord()
      }
    })
    // eslint-disable-next-line no-undef
    // new ckplayer(this.videoObject);
    window.addEventListener("scroll", this.getHeight)
    await this.getCloudCourseDetail()
  },
  destroyed() {
    window.removeEventListener("scroll", this.getHeight)
  },
}
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
      }
      .course-brief {
        display: flex;
        justify-content: space-between;
        font-size: 18px;
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
          color: #f0742b;
          font-size: 25px;
        }
        .has-course {
          font-size: 20px;
          color: #0491fd;
          border: 1px solid #0491fd;
          border-radius: 4px;
          padding: 2px 4px;
        }
        .el-button {
          width: 118px;
          height: 48px;
          border-radius: 30px;
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          color: #fff;
        }
      }
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
