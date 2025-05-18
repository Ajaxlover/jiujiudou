<template>
  <div class="page-home">
    <!-- <Nav title="图书详情" @go-back="goBack"></Nav> -->
    <div class="tp">
      <van-image class="book" :src="getBookCover(bookInfo)">
        <template v-slot:loading>
          <img src="../../assets/image/img_book_ph.png" />
        </template>
        <template v-slot:error>
          <img src="../../assets/image/img_book_ph.png" />
        </template>
      </van-image>
      <div class="tpContent">
        <p class="tname">{{ bookInfo.tname }}</p>
        <p class="author">作者：{{ bookInfo.author }}</p>
        <div>
          <div class="price">{{ getBookPrice(bookInfo) }}</div>
          <div class="sub-price">{{ getBookSubPrice(bookInfo) }}</div>
        </div>
      </div>
    </div>
    <div v-if="bookType == 3 && !bookInfo.hasBuy" class="tp-open">
      <van-button class="tp-open-button" @click="openDigitalBookHandler">开始试读</van-button>
    </div>
    <div v-if="bookType == 3" class="nav">
      <div class="active-nav" :class="activeNav == 0 ? 'active-nav-highlighted' : ''" @click="nav0Handler">
        简介
        <div class="active-nav-bar" :class="activeNav == 0 ? 'active-nav-bar-highlighted' : ''"></div>
      </div>
      <div class="active-nav" :class="activeNav == 1 ? 'active-nav-highlighted' : ''" @click="nav1Handler">
        目录
        <div class="active-nav-bar" :class="activeNav == 1 ? 'active-nav-bar-highlighted' : ''"></div>
      </div>
    </div>
    <div v-if="bookType == 1" class="nav">
      <div class="active-nav1" :class="activeNav == 0 ? 'active-nav-highlighted' : ''" @click="nav0Handler">
        简介
        <div class="active-nav-bar" :class="activeNav == 0 ? 'active-nav1-bar-highlighted' : ''"></div>
      </div>
      <div class="active-nav1" :class="activeNav == 1 ? 'active-nav-highlighted' : ''" @click="nav1Handler">
        目录
        <div class="active-nav-bar" :class="activeNav == 1 ? 'active-nav1-bar-highlighted' : ''"></div>
      </div>
      <div class="active-nav1" :class="activeNav == 2 ? 'active-nav-highlighted' : ''" @click="nav2Handler">
        资源
        <div class="active-nav-bar" :class="activeNav == 2 ? 'active-nav1-bar-highlighted' : ''"></div>
      </div>
    </div>
    <div class="page">
      <div v-show="activeNav == 0" class="page0">
        <div class="book-intro">
          <span v-if="!bookInfo.bookIntro">无</span>
          <div v-html="bookInfo.bookIntro"></div>
        </div>
        <div v-show="bookType === 1">
          <div v-show="resourceChartShow" class="resourceCount">
            <p>数字资源</p>
            <p>
              <span class="totalResCount">{{ bookInfo.total }}</span
              >个
            </p>
            <div id="resourceChart"></div>
            <ul>
              <li v-for="(item, index) in bookInfo.label" :key="index">#{{ item }}</li>
            </ul>
          </div>
          <div class="pubInfo">
            <p>版权信息</p>
            <ul>
              <li>
                <span>出版社</span><span class="publishName">{{ bookInfo.publishName }}</span>
              </li>
              <li>
                <span>出版时间</span><span class="pubTime">{{ bookInfo.pubDate }}</span>
              </li>
              <li>
                <span>ISBN</span><span class="tbNum">{{ bookInfo.tbNum }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-show="activeNav == 1" class="page1">
        <div class="book-catalog">
          <div v-show="bookType === 1" v-html="bookInfo.bookCatalogIntro"></div>
          <van-collapse v-show="bookType === 3" v-model="activeNames" accordion>
            <van-collapse-item v-for="(item, index) in bookInfo.chapterList" :key="index" :title="item.title" :name="index">
              <div v-for="(item2, index2) in item.chapterList" :key="index2" class="catalog-content">
                <img src="../../assets/image/icon_cloud_catalog_pdf_blue.png" alt="" />
                {{ item2.title }}
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
      <div v-show="activeNav == 2" class="page2">
        <div class="book-catalog">
          <van-collapse v-model="activeNames1" accordion>
            <van-collapse-item v-for="(item, index) in bookInfo.chapterList" :key="index" :title="item.catelogContent" :name="index">
                <div v-for="(item2, index2) in item.resourceList" :key="index2" class="catalog-content" @click="openResource(item2)">
                  *
                  <img v-if="bookInfo.isVerified == 0 && item2.isPreview != 1" src="../../assets/image/lock.png" alt="" />
                  {{ item2.res_name ? item2.res_name : item2.matchPicName }}
                </div>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-button v-if="bookType == 1" class="buttom-default" @click="buyBookHandler">去购买</van-button>
      <van-button v-if="bookType == 3 && !bookInfo.hasBuy" class="buttom-left" @click="activateDBookHandler">验证码获取</van-button>
      <van-button v-if="bookType == 3 && !bookInfo.hasBuy" class="buttom-right" @click="buyDigitalBookHandler">{{
        getBuyTitle(bookInfo)
      }}</van-button>
      <van-button v-if="bookType == 3 && bookInfo.hasBuy" class="buttom-default" @click="openDigitalBookHandler">去阅读</van-button>
    </div>

    <van-button v-if="teaVerifyStatus == 1 && hasTeaRes" class="resource_tea_email" :icon="iconUrl" @click="resourceTeaEmailShow = true"></van-button>
    <resource-tea-email :resource-tea-email-show.sync="resourceTeaEmailShow" @sendEmail="sendEmailHandler"></resource-tea-email>
  </div>
</template>

<script>
import {
  ebook_digitalBook_index_detail,
  book_lucene_bookDetail,
  resource_tbMatchPic_getResEmail,
  book_bookApp_hasTeaRes,
  ebook_dTbookUser_bookPay
} from '@/api/bookStore'
// import Nav from '@/components/Nav'
import ResourceTeaEmail from '@/components/ResourceTeaEmail'
import { Dialog, Toast } from 'vant'
import echarts from 'echarts'
import { queryTeacherVerifyStatus, book_catalog_catalogList, resource_resource_resourcesV2 } from '@/api/home'
import authUtils from '@/utils/auth.js'
import store from '@/store'

export default {
  name: 'BookInfo',
  components: {
    // Nav,
    ResourceTeaEmail
  },
  data() {
    return {
      resourceChartShow: true,
      resourceLabel: '',
      resourceChart: null,
      id: this.$route.query.id,
      bookType: Number(this.$route.query.bookType),
      teaVerifyStatus: 0,
      bookInfo: {},
      iconUrl: require('../../assets/image/resource_tea_email.png'),
      activeNav: 0,
      activeNames: '1',
      activeNames1: '1',
      hasTeaRes: false,
      resourceTeaEmailShow: false
    }
  },
  computed: {},
  created() {},
  mounted() {
    if (this.bookType === 3) {
      this.getDBBookInfo()
    } else {
      this.getBookInfo()
    }
  },
  methods: {
    openResource(item) {
      const isVerified = this.bookInfo.isVerified
      const isPreview = item.isPreview
      if (Number(isVerified) === 0 && Number(isPreview) !== 1) {
        Dialog.confirm({
          title: '提示',
          message: '是否激活书籍',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$router.push({
            path: '/activateBook'
          })
        }).catch(() => {
        })
      } else {
        // 3 AR
        const type = Number(item.res_type)
        if (type === 3) {
          this.gotoAppUrl()
          return
        }
        const url = item.res_url
        if (url && url.length > 0) {
          window.location.href = url
        } else {
          this.gotoAppUrl()
        }
      }
    },
    getBookCatalogResource(item) {
      resource_resource_resourcesV2({ textbookId: this.id, c_id: item.catalogId, pagesize: 999999, page: 1, sysModel: 2, checkVerify: false })
      .then(res => {
        item.resourceList = res.data
      })
      .catch(err => {
        console.error(err)
      })
    },
    getBookCatalog(callback) {
    // 查询目录-资源
      book_catalog_catalogList({ textbookId: this.id })
      .then(res => {
        this.bookInfo.chapterList = res.data
        this.bookInfo.chapterList.forEach(element => {
          this.getBookCatalogResource(element)
        })
        callback(res)
      })
      .catch(err => {
        console.error(err)
        callback(err)
      })
    },
    checkTeaRes(callback) {
      book_bookApp_hasTeaRes({ textBookId: this.id })
        .then(res => {
          this.hasTeaRes = res.data.hasTeaRes
          if (this.hasTeaRes) {
            const user = authUtils.getUserInfo()
            const userInfo = JSON.parse(user)
            const teaVerifyStatus = userInfo?.teaVerifyStatus || '0'
            this.teaVerifyStatus = Number(teaVerifyStatus)
            if (this.teaVerifyStatus !== 1) {
              this.queryTeacherVerifyStatus()
            }
          }
          callback(res)
        })
        .catch(err => {
          console.error(err)
          callback(err)
        })
    },
    queryTeacherVerifyStatus() {
      queryTeacherVerifyStatus()
        .then(res => {
          if (res.code === 200) {
            const teaVerifyStatus = res.data.teaVerifyStatus || '0'
            this.teaVerifyStatus = Number(teaVerifyStatus)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    initResourceChart() {
      this.resourceChart = echarts.init(document.getElementById('resourceChart'))
      var option = {
        grid: {
          left: '0',
          right: '0',
          top: '20',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#d6dce0',
                width: '2'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#222222',
                fontSize: 12
              },
              interval: 0
            },
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#999999',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#d6dce0',
                width: '2'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#e6eaec'],
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            label: {
              normal: {
                textStyle: {
                  color: '#004fc2',
                  fontSize: 15,
                  fontWeight: 600
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#227bf3'
                  },
                  {
                    offset: 1,
                    color: '#3cc2f5'
                  }
                ])
              }
            },
            barWidth: '20',
            data: []
          }
        ]
      }
      this.resourceChart.setOption(option)
    },
    reloadResourceChart(ret) {
      var data = []
      var legend = []
      for (var i = 0; i < ret.length; i++) {
        var tmp = ret[i]
        var d = Object()
        d.name = tmp.name
        d.value = tmp.number
        data.push(d)
        legend.push(tmp.name)
      }
      var option = {
        xAxis: [
          {
            data: legend
          }
        ],
        series: [
          {
            data: data
          }
        ]
      }
      this.resourceChart.setOption(option)
    },
    getBookInfo() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      book_lucene_bookDetail({ bookId: this.id })
        .then(res => {
          if (res.code === 200) {
            this.bookInfo = res.data
            this.initResourceChart()
            if (this.bookInfo.report) {
              this.reloadResourceChart(this.bookInfo.report)
            } else {
              this.resourceChartShow = false
            }
            if (!this.bookInfo.label) {
              this.resourceChartShow = false
            }
          }
          if (this.bookType === 1) {
            this.checkTeaRes((resData) => {
              this.getBookCatalog((resData) => {
                Toast.clear()
              })
            })
          } else {
            Toast.clear()
          }
        })
        .catch(err => {
          console.error(err)
          Toast.clear()
        })
    },
    getDBBookInfo() {
      ebook_digitalBook_index_detail({ dtbookId: this.id })
        .then(res => {
          this.bookInfo = res.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    getBookCover(book) {
      if (book.coverPic) {
        return book.coverPic
      }
      if (book.bookCover) {
        return book.bookCover
      }
    },
    getBookPrice(book) {
      if (this.bookType === 2 || this.bookType === 3) {
        if (book.discountPrice === 0) {
          return '免费'
        } else {
          const discountPrice = book.discountPrice / 100
          // const price = book.price / 100
          return '¥' + discountPrice.toFixed(2)
        }
      }
      return ''
    },
    getBookSubPrice(book) {
      if (this.bookType === 2 || this.bookType === 3) {
        if (book.discountPrice === 0) {
          return ''
        } else {
          // const discountPrice = book.discountPrice / 100
          const price = book.price / 100
          if (book.discountPrice < book.price) {
            return '¥' + price.toFixed(2)
          }
          return ''
        }
      }
      return ''
    },
    sendEmailHandler(save, email) {
      resource_tbMatchPic_getResEmail({ isUpdateEmail: save, email: email, textbookId: this.id, type: 4 })
        .then(res => {
          if (res.code === 200) {
            Toast({
              message: '发送成功',
              position: 'middle'
            })
            this.resourceTeaEmailShow = false
          } else {
            Toast({
              message: res.msg,
              position: 'middle'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    goBack() {
      this.$router.replace({
        path: '/bookStore',
        query: {}
      })
    },
    nav0Handler() {
      this.activeNav = 0
    },
    nav1Handler() {
      this.activeNav = 1
    },
    nav2Handler() {
      this.activeNav = 2
    },
    activateDBookHandler() {
      this.$router.push({
        path: '/activateDigitalBook',
        query: { id: this.id }
      })
    },
    openDigitalBookHandler() {
      // window.location.href = process.env.VUE_APP_DB_BASE_API + '?uid=' + '661626' + '&dtbookId=' + this.id
      window.location.href = process.env.VUE_APP_DB_BASE_API + '?uid=' + store.getters.userId + '&dtbookId=' + this.id
    },
    buyBookHandler() {
      if (this.bookInfo.bookStoreUrl) {
        window.location.href = this.bookInfo.bookStoreUrl
      }
    },
    getBuyTitle(book) {
      if (book.discountPrice === 0) {
        return '免费获取'
      } else {
        return '去购买'
      }
    },
    buyDigitalBookHandler() {
      if (this.bookInfo.discountPrice === 0) {
        const user = authUtils.getUserInfo()
        const userInfo = JSON.parse(user)
        const openid = userInfo?.openid
        ebook_dTbookUser_bookPay({ dtbookId: this.id, chargeType: 2, chargeMethod: 3, os: 'PC', openid: openid })
          .then(res => {
            Toast({
              message: '获取成功',
              position: 'middle',
              onClose: () => {
                this.getDBBookInfo()
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.$router.push({
          path: '/buyDigitalBook',
          query: { id: this.id }
        })
      }
    },
    gotoAppUrl() {
      window.location.href = 'https://www.guangyiedu.com/app/'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  // height: 100%;
  width: 100%;
  background-color: #fff;
  .tp {
    width: 100%;
    height: 280px;
    overflow: hidden;
    position: relative;
    background: rgba(102, 102, 102, 0.65);
    padding: 30px 40px;
    .book {
      width: 155px;
      height: 211px;
      float: left;
      box-shadow: 0 0 15px 4px rgba(81, 81, 81, 0.2);
    }

    .tpContent {
      margin: 10px 0 0 180px;
      .tname {
        color: #ffffff;
        font-size: 30px;
      }

      .author {
        color: #ffffff;
        font-size: 26px;
        margin: 30px 0;
        /* '#FFC000';
                // discountPriceP.style.fontSize = '16px';
                // discountPriceP.style.position = 'absolute'; */
      }

      .price {
        color: #ffb64d;
        font-size: 26px;
        display: inline-block;
        height: 30px;
        line-height: 30px;
      }

      .sub-price {
        color: #666666;
        font-size: 26px;
        text-decoration: line-through;
        display: inline-block;
        padding-left: 10px;
      }
    }
  }
  .tp-open {
    width: 100%;
    background: rgba(102, 102, 102, 0.65);
    height: 80px;
    .tp-open-button {
      background: #a4adb3;
      color: #fff;
      font-size: 22px;
      height: 50px;
      margin: auto;
      display: block;
      width: 70%;
      border: none;
      border-radius: 25px;
    }
  }
  .nav {
    border-bottom: 1px solid #eeeeee;
    background: #ffffff;
    height: 70px;
    font-size: 30px;
    .active-nav {
      display: inline-block;
      width: 50%;
      text-align: center;
      line-height: 60px;
      font-size: 30px;
      position: relative;
    }
    .active-nav1 {
      display: inline-block;
      width: 33%;
      text-align: center;
      line-height: 60px;
      font-size: 30px;
      position: relative;
    }

    .active-nav-highlighted {
      color: #10c4ee;
    }

    .active-nav-bar {
      display: none;
    }

    .active-nav-bar-highlighted {
      display: inline-block;
      position: absolute;
      bottom: -5px;
      width: 200px;
      left: calc(50% - 100px);
      height: 5px;
      background: #10c4ee;
    }

    .active-nav1-bar-highlighted {
      display: inline-block;
      position: absolute;
      bottom: -5px;
      width: 140px;
      left: calc(50% - 70px);
      height: 5px;
      background: #10c4ee;
    }
  }
  .page {
    margin-bottom: 100px;
    .page0 {
      background: #f3f4f5;
      .book-intro {
        background: #ffffff;
        width: 100%;
        padding: 20px;
      }
      .resourceCount {
        padding: 28px 30px 38px;
        background: #ffffff;
        margin-top: 16px;
        overflow: hidden;
      }
      .resourceCount p:first-child {
        font-size: 30px;
        font-weight: bold;
        float: left;
      }
      .resourceCount p:nth-child(2) {
        float: right;
        font-size: 26px;
      }

      #resourceChart {
        width: 100%;
        padding: 66px 18px 38px;
        height: 550px;
        border-bottom: 1px dashed #dddddd;
      }
      .resourceCount ul {
        overflow: hidden;
        padding: 38px 0 0;
      }
      .resourceCount ul li {
        float: left;
        font-size: 24px;
        background: rgba(16, 196, 238, 0.1);
        border-radius: 5px;
        padding: 11px 20px;
        margin-bottom: 22px;
        margin-right: 34px;
      }

      .pubInfo {
        margin-top: 16px;
        padding: 28px 30px 180px;
        background: #ffffff;
      }
      .pubInfo p {
        font-size: 30px;
        font-weight: bold;
      }
      .pubInfo ul {
        background: #f8f8f8;
        margin-top: 48px;
        border-radius: 4px;
        padding: 30px 40px;
        font-size: 0;
      }
      .pubInfo ul li span {
        display: inline-block;
        line-height: 60px;
      }
      .pubInfo ul li span:first-child {
        width: 130px;
        font-size: 28px;
        color: #999999;
      }
      .pubInfo ul li span:last-child {
        font-size: 26px;
        margin-left: 74px;
      }
    }
    .page1 {
      .book-catalog {
        padding: 0 20px;
        /deep/ .van-collapse-item__content {
          padding: 15px 0px;
        }
        .catalog-content {
          padding: 15px 60px;
          font-size: 24px;
          > img {
            top: 3px;
            position: relative;
          }
        }
      }
    }
    .page2 {
      .book-catalog {
        padding: 0 20px;
        /deep/ .van-collapse-item__content {
          padding: 15px 0px;
        }
        .catalog-content {
          padding: 15px 60px;
          font-size: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          > img {
            top: 3px;
            position: relative;
          }
        }
      }
    }
  }
  .resource_tea_email {
    font-size: 180px;
    position: fixed;
    right: 0px;
    bottom: 100px;
    display: block;
    background-color: transparent;
    border: 0;
  }
  .bottom {
    position: fixed;
    bottom: 0;
    height: 100px;
    width: 100%;
    display: flex;
    .buttom-default {
      flex: 1;
      color: #fff;
      background: #10c4ee;
      height: 100px;
    }
    .buttom-left {
      flex: 1;
      color: #fff;
      background: #81b337;
      border-right: 1px solid white;
      // line-height: 100px;
      height: 100%;
    }
    .buttom-right {
      flex: 1;
      color: #fff;
      background: #10c4ee;
      // line-height: 100px;
      height: 100%;
    }
  }
}
</style>
