<template>
  <div v-loading="loading" class="course-detail">
    <div class="course-search-content w">
      <div class="ke-tabs">
        <div class="course-info">
          <div class="course-info-left">
            <img
              v-if="courseInfo.ccourseCover"
              :src="courseInfo.ccourseCover"
              alt="课程封面"
            />
            <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
          </div>
          <div class="course-info-right">
            <div class="course-info-right-container">
              <span class="course-name">{{ courseInfo.ccourseName }}</span>
              <span class="course-teacher"
                >老师：{{ courseInfo.ccourseTeacherName }}</span
              >
              <div class="course-tags">
                <span
                  style="
                    color: #10c4ee;
                    padding: 0 2px;
                    margin-right: 10px;
                    border: 1px solid #10c4ee;
                    border-radius: 2px;
                  "
                  v-for="(k, idx) in courseInfo.ccourseTagsList"
                  :key="idx"
                  >{{ k }}</span
                >
              </div>
              <div class="interest-num">
                {{ courseInfo.ccourseInterestedNum }}人感兴趣
              </div>
              <el-button
                @click="handlePay"
                v-if="
                  courseInfo.ccourseFeeType === 1 && courseInfo.isEnroll == 0
                "
                >购买</el-button
              >
              <el-button
                @click.native="getFree"
                v-if="
                  courseInfo.ccourseFeeType === 0 && courseInfo.isEnroll == 0
                "
                >免费获取</el-button
              >
              <el-button @click="goStudy" v-if="courseInfo.isEnroll == 1"
                >去学习</el-button
              >
            </div>
          </div>
        </div>
        <div class="search-tabs-container">
          <el-tabs v-model="activeName">
            <el-tab-pane
              :label="`课程目录(${courseInfo.ccourseTotalNum})`"
              name="second"
            >
              <div class="course-chapter">
                <StuCatalog
                  :isEnroll="String(courseInfo.isEnroll)"
                  :courseId="String(cCourseId)"
                  :clickType="1"
                  :data="courseInfo.catalog"
                  @switchVideo="startStudy"
                ></StuCatalog>
              </div>
            </el-tab-pane>
            <el-tab-pane label="课程简介" name="first">
              <div class="course-intro">
                <iframe
                  ref="ifr"
                  :style="ifrStyle"
                  frameborder="0"
                  scrolling="auto"
                  :src="courseInfo.ccourseIntro"
                ></iframe>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="rec-container">
        <div class="content-right">
          <div class="content-right-title">推荐云课</div>
          <div class="content-right-list">
            <div
              v-for="(item, index) in recommendList"
              :key="index"
              @click="toDetail(item)"
              class="content-right-list-item"
            >
              <div class="item-left">
                <img :src="item.ccourseCover" alt="" />
              </div>
              <div class="item-right">
                <div class="item-right-name">{{ item.ccourseName }}</div>
                <div class="info-text">
                  <div class="item-right-teacher">
                    老师:{{ item.ccourseTeacherName }}
                  </div>
                  <div class="item-right-intro">
                    {{ item.ccourseInterestedNum }}人感兴趣
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <section class="money-pay-num">￥{{ courseInfo.ccoursePrice }}</section>
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
import StuCatalog from "@/components/Stu-Catalog_1.vue"
import vueQr from "vue-qr"

// import StuHeader from "@/components/Stu-Header.vue";

// import StuFooter from "@/components/Stu-Footer.vue";

export default {
  name: "clould-detail",
  components: {
    StuCatalog,
    vueQr,
  },
  data() {
    return {
      ifrStyle: {
        width: "1060px",
        height: "",
      },
      loading: true,
      orderCode: "", //订单号
      qrcode: "",
      payType: 2,
      isPayShow: false,
      isQRcode: false,
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
      recommendList: [],
      activeName: "second",
      scrollTop: 0,
      cCourseId: this.$route.params.cCourseId,
      timerId: null,
    }
  },
  methods: {
    startStudy(data) {
      console.log(data)
      // axios
      //   .request({
      //     method: "post",
      //     url: `/cloudCourse/startStudy`,
      //     data: {
      //       cCourseUuid: this.courseInfo.ccourseUuid,
      //       catalogUuid: data.catalogUuid,
      //     },
      //   })
      //   .then((res) => {
      //     let ret = res.data;
      //     if (ret.code === 201) {
      //       console.log("111");
      //     }
      //   });
    },
    goStudy() {
      if (this.courseInfo.catalog.length > 0) {
        this.$store.commit("setVideoUrl", this.courseInfo.catalog[0].catalog[0])
      }
      this.$router.push({
        name: "cloudPlay",
        params: {
          courseId: this.courseId,
        },
      })
    },
    toDetail(item) {
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      })
      window.location.reload()
    },
    getRecommendList() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/recommend`,
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.recommendList = ret.data.selected
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
            this.loading = false

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
            let CountEvent = window.JAnalyticsInterface.Event.CountEvent
            let cEvent = new CountEvent("cloudCourse_free_get")
            window.JAnalyticsInterface.onEvent(cEvent)
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
            let CountEvent = window.JAnalyticsInterface.Event.CountEvent
            let cEvent = new CountEvent("buy_cloudCourse")
            window.JAnalyticsInterface.onEvent(cEvent)
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
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.getRecommendList()
    window.addEventListener("scroll", this.getHeight)
    this.getCloudCourseDetail()
    this.$refs.ifr.onload = () => {
      this.ifrStyle.height = "1000px"
    }
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

.course-detail {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;

  .course-search-content {
    margin-top: 100px;
    min-height: 1224px;
    background-color: #f7f7f7;
    overflow: hidden;
    .ke-tabs {
      width: 1100px;
      min-height: 800px;
      background-color: #fff;
      padding: 20px;
      float: left;
      .course-info {
        width: 100%;
        height: 200px;
        background-color: #fff;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .course-info-left {
          border: 1px solid #ddd;
          width: 280px;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            vertical-align: middle;
          }
        }
        .course-info-right {
          flex: 1;
          height: 100%;
          padding: 24px 20px;
          // background-color: red;
          .course-info-right-container {
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .course-name {
              font-size: 25px;
              font-weight: bold;
            }
            .course-teacher {
              color: #666;
              font-size: 18px;
            }
            .course-tags {
            }
            .interest-num {
              color: #666;
              font-size: 18px;
            }
            .el-button {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 118px;
              height: 48px;
              border-radius: 30px;
              background: linear-gradient(-45deg, #03d3f2, #0491fd);
              color: #fff;
            }
          }
        }
      }
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
    .rec-container {
      min-height: 1168px;
      float: right;
      .content-right {
        width: 300px;
        border-radius: 10px;
        margin-left: 10px;
        min-height: 1100px;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 4px 4px 10px #00000014;
        .content-right-title {
          background: linear-gradient(-45deg, #03d3f2, #0491fd);
          height: 60px;
          color: #fff;
          line-height: 60px;
          padding-left: 20px;
        }
        .content-right-list {
          // height: 100%;
          // background-color: red;

          .content-right-list-item {
            padding-left: 20px;
            padding-top: 10px;
            padding-right: 20px;
            cursor: pointer;
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            .item-left {
              overflow: hidden;
              border-radius: 10px;
              img {
                width: 260px;
                height: 140px;
              }
            }
            .item-right {
              word-break: break-all;
              margin-left: 10px;
              .item-right-name {
                margin-bottom: 10px;
              }
              .info-text {
                display: flex;
                justify-content: space-between;
                .item-right-teacher {
                  margin-bottom: 10px;
                  color: #999;
                  font-size: 12px;
                }
                .item-right-intro {
                  color: #999;
                  font-size: 12px;
                }
              }
            }
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
