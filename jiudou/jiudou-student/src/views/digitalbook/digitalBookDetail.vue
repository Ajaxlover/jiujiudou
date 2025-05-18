<template>
  <div class="digital-book">
    <div class="cloud-book-content w">
      <div class="content-left">
        <div class="book-info">
          <div class="basic-info">基本信息</div>
          <div class="basic-content">
            <div class="basic-content-left">
              <img :src="bookInfo.coverPic" alt="" />
            </div>
            <div class="basic-content-right">
              <div class="book-name">{{ bookInfo.tname }}</div>
              <div class="book-publish">出版社：{{ bookInfo.publishname }}</div>
              <div class="book-publish">出版时间：{{ bookInfo.pubDate }}</div>
              <div class="book-author">作者：{{ bookInfo.author }}</div>
              <div class="book-num">ISBN：{{ bookInfo.tbNum }}</div>
              <div v-if="bookInfo.price > 0" class="book-price">
                定价：￥{{ bookInfo.price / 100 }}
              </div>
              <el-button
                v-if="bookInfo.price !== 0"
                class="try-btn"
                @click="tryRead"
                >试读</el-button
              >
              <el-button
                v-if="bookInfo.price == 0 || bookInfo.hasBuy"
                class="buy-btn"
                @click="goRead"
                >阅读</el-button
              >
              <el-button class="buy-btn" v-else @click="handlePay"
                >购买</el-button
              >
            </div>
          </div>
          <div class="basic-show">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="简介" name="first">
                <div
                  v-if="bookInfo.bookIntro"
                  v-html="bookInfo.bookIntro"
                ></div>

                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    margin: 0 330px;
                  "
                  v-else
                >
                  <img src="../../assets/img/empty.png" alt="" />
                  <p>暂无简介~</p>
                </div>
                <div class="chart-box" id="main"></div>
              </el-tab-pane>
              <el-tab-pane label="目录" name="second">
                <div v-html="bookInfo.bookCatalogIntro"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="content-right-title">数字教材推荐</div>
        <div class="content-right-list">
          <div
            v-for="(item, index) in cloudBookList"
            :key="index"
            @click="toBookDetail(item)"
            class="content-right-list-item"
          >
            <div class="item-left">
              <img :src="item.coverPic" alt="" />
            </div>
            <div class="item-right">
              <div class="item-right-name">{{ item.tname }}</div>
              <div class="item-right-teacher">作者:{{ item.author }}</div>
              <div class="item-right-intro">12568人已购买</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 数字教材购买 -->
    <el-dialog
      title=""
      :visible.sync="isPayShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="55%"
    >
      <div>
        <el-row>
          <div class="course-name">教材名称:{{ bookInfo.tname }}</div>
        </el-row>
        <el-row
          ><div class="course-name">
            教材价格:
            <span style="color: #f0742b">￥{{ bookInfo.price / 100 }}</span>
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
    <!-- 数字教材支付 -->
    <el-dialog
      :title="`教材名称：${bookInfo.tname}`"
      :visible.sync="isQRcode"
      :close-on-click-modal="false"
      :before-close="handleCode"
      width="40%"
    >
      <section style="width: 150px; margin: 0 auto">
        <section style="text-align: center; margin-bottom: 6px">
          扫一扫付款 (元)
        </section>
        <section class="money-pay-num">￥{{ bookInfo.price / 100 }}</section>
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
    <!-- 侧边二维码区域 -->
    <StuSideAd />
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */

// @ is an alias to /src
import axios from "@/libs/api.request"
// import * as echarts from "echarts";
import StuSideAd from "@/components/Stu-SideAd.vue"

export default {
  name: "digital-detail",
  components: {
    StuSideAd,
  },
  data() {
    return {
      orderCode: "", //订单号
      qrcode: "",
      payType: 2,
      isPayShow: false,
      isQRcode: false,
      timerId: null,
      id: this.$route.query.id,
      bookInfo: {},
      activeName: "first",
      scrollTop: 0,
      checkList: [],
      cloudBookList: [],
      bookPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
      option: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      },
    }
  },
  methods: {
    goRead() {
      var fileUrl = this.bookInfo.tbookResources[0].resUrl
      //配置站点时把http://localhost去掉
      window.open(
        "/reader/#/manager/home?file=" +
          encodeURIComponent(fileUrl) +
          "&dtbookid=" +
          this.id +
          "&uid=" +
          this.bookInfo.uid
      )
      // alert("跳转阅读界面")
    },
    tryRead() {
      var fileUrl = this.bookInfo.tbookResources[0].probationUrl
      //配置站点时把http://localhost去掉
      window.open(
        "/reader/#/manager/home?file=" +
          encodeURIComponent(fileUrl) +
          "&dtbookid=" +
          this.id +
          "&uid=" +
          this.bookInfo.uid
      )
    },
    init() {
      var chartDom = document.getElementById("main")
      // eslint-disable-next-line no-undef
      var myChart = echarts.init(chartDom)
      myChart.setOption(this.option)
    },
    toBookDetail(item) {
      let { id } = item
      this.$router.push({
        path: "/digitalBook-detail",
        query: {
          id,
        },
      })
      window.location.reload()
    },
    getBookDetail() {
      axios
        .request({
          method: "post",
          url: `/ebook/digitalBook/index/detail`,
          data: {
            dtbookId: this.id,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.bookInfo = ret.data
          }
        })
    },
    getBookList() {
      axios
        .request({
          method: "post",
          url: `/ebook/digitalBook/index/queryPage`,
          data: {
            pageNo: 1,
            pageSize: 5,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.cloudBookList = Object.freeze(ret.data.records)
            this.bookPage.total = ret.data.total
          }
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
    goPay() {
      // let { ccourseUuid: cCourseUuid } = this.courseInfo;
      axios
        .request({
          method: "post",
          url: `/ebook/dTbookUser/bookPay`,
          data: {
            dtbookId: this.id,
            chargeType: this.payType,
            chargeMethod: 2,
            os: "PC",
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
            let cEvent = new CountEvent("buy_digital_book")
            window.JAnalyticsInterface.onEvent(cEvent)
            this.$message({
              title: "提示",
              message: "购买成功",
              type: "success",
              offset: 80,
            })
            this.isQRcode = false
            this.getBookDetail()
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
    this.getBookList()

    this.getBookDetail()
    // this.init();

    console.log(process.env.NODE_ENV)
  },
}
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #f7f7f7;
}
.digital-book {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;
  .cloud-book-content {
    margin-bottom: 10px;
    margin-top: 100px;
    overflow: hidden;
    // box-shadow: 4px 4px 10px #00000014;
    .content-left {
      float: left;
      padding: 20px 20px;
      width: 1100px;
      background-color: #fff;
      min-height: 550px;
      box-shadow: 4px 4px 10px #00000014;
      .book-info {
        .basic-info {
          font-size: 27px;
          font-weight: bold;
          border-left: 4px solid #049efb;
          padding-left: 10px;
          line-height: 32px;
          margin-bottom: 40px;
        }
        .basic-content {
          width: 100%;
          height: 290px;
          display: flex;
          align-items: center;
          .basic-content-left {
            border: 1px solid #ccc;
            img {
              width: 200px;
              height: 270px;
              vertical-align: -webkit-baseline-middle;
            }
          }
          .basic-content-right {
            font-family: Microsoft YaHei;
            font-weight: bold;

            margin-left: 50px;
            flex: 1;
            // background-color: red;
            height: 100%;
            position: relative;
            .book-name {
              font-size: 26px;
              margin-bottom: 30px;
            }
            .book-publish {
              font-size: 20px;
              margin-bottom: 23px;
            }
            .book-author {
              font-size: 20px;
              margin-bottom: 23px;
            }
            .book-num {
              font-size: 20px;
              margin-bottom: 24px;
            }
            .book-price {
              font-size: 20px;
            }
            .buy-btn {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 121px;
              height: 51px;
              border-radius: 30px;
              background: linear-gradient(-45deg, #03d3f2, #0491fd);
              color: #fff;
            }
            .try-btn {
              position: absolute;
              right: 130px;
              bottom: 0;
              width: 121px;
              height: 51px;
              border-radius: 30px;
              background: linear-gradient(-45deg, #03d3f2, #0491fd);
              color: #fff;
            }
          }
        }
        .basic-show {
          width: 100%;
          margin-top: 40px;
          min-height: 300px;
          /deep/ .el-tabs__item {
            font-size: 24px;
            font-weight: bold;
          }
          /deep/ .el-tabs__item.is-active {
            color: #333;
          }
          /deep/ .el-tabs__nav-wrap::after {
            width: 0;
          }
          /deep/ .el-tabs__content {
            // min-height: 400px;
            display: flex;
            align-items: center;
            // justify-content: center;
          }
          .chart-box {
            // height: 400px;
          }
        }
      }
    }
    .content-right {
      float: right;
      width: 300px;
      border-radius: 10px;
      margin-left: 10px;
      min-height: 550px;
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
        padding-left: 20px;
        padding-top: 10px;
        padding-right: 20px;
        height: 100%;
        // background-color: red;
        .content-right-list-item {
          cursor: pointer;
          margin-top: 10px;
          display: flex;
          .item-left {
            border: 1px solid #ccc;
            img {
              width: 130px;
              height: 160px;
            }
          }
          .item-right {
            word-break: break-all;
            margin-left: 10px;
            .item-right-name {
              margin-bottom: 10px;
            }
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
