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
        <p class="author">{{ bookInfo.author }}</p>
        <!-- <div>
          <div class="price">{{ getBookPrice(bookInfo) }}</div>
          <div class="sub-price">{{ getBookSubPrice(bookInfo) }}</div>
        </div> -->
      </div>
    </div>
    <div class="home-function-box">
      <input v-model="code" type="text" placeholder="请输入此书的验证码" class="home-function-code" inputmode="decimal" />
      <van-button class="button-none-border" icon="scan" @click="scanHandler"> </van-button>
    </div>
    <div class="tip-box">
      <div class="tip-title">温馨提示</div>
      <div class="tip-sub-title">1、本数字教材为付费产品，输入验证码验证后永久有效；</div>
      <div class="tip-sub-title">2、验证码只能验证一次，之后不可使用；</div>
      <div class="tip-sub-title">3、验证后只能在本账号下阅读本书；</div>
    </div>
    <div class="bottom">
      <van-button class="buttom-default" :disabled="!code.length" @click="buttonHandler">确认</van-button>
    </div>
  </div>
</template>

<script>
import { ebook_digitalBook_index_detail, book_bookVerify_bookVerifyV2 } from '@/api/bookStore'
import wx from 'jweixin-1.6.0'

// import Nav from '@/components/Nav'
// import ResourceTeaEmail from '@/components/ResourceTeaEmail'
import { Toast } from 'vant'
// import store from '@/store'

export default {
  name: 'ActivateDigitalBook',
  components: {
    // Nav,
    // ResourceTeaEmail
  },
  data() {
    return {
      id: this.$route.query.id,
      bookType: Number(this.$route.query.bookType),
      bookInfo: {},
      code: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getDBBookInfo()
  },
  methods: {
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
    // goBack() {
    // this.$router.replace({
    //   path: '/bookInfo',
    //   query: {}
    // })
    // },
    scanHandler() {
      const that = this
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          // var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          // var qrCode = result.replace(process.env.VUE_APP_BASEURL + '/', '')
          // console.log(qrCode)
          // that.bookVerify(res.resultStr)
          that.code = res.resultStr
        }
      })
    },
    buttonHandler() {
      book_bookVerify_bookVerifyV2({ dtBookId: this.id, qrCode: this.code, sysModel: 2, showType: 1 })
        .then(res => {
          if (res.code === 200 || res.code === 240) {
            Toast({
              message: '验证成功',
              position: 'middle',
              onClose: () => {
                this.$router.back()
              }
            })
          } else {
            Toast({
              message: res.msg,
              position: 'middle'
            })
          }
        })
        .catch(err => {
          if (err.code === 200 || err.code === 240) {
            Toast({
              message: '验证成功',
              position: 'middle',
              onClose: () => {
                this.$router.back()
              }
            })
          } else {
            Toast({
              message: err.msg,
              position: 'middle'
            })
          }
        })
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
        position: absolute;
        bottom: 20px;
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

  .home-function-box {
    display: flex;
    border-top: 80px solid #f4f4f4;
  }
  .home-function-code {
    // border: 1px solid #999999;
    border: none;
    margin: 15px 0 15px 30px;
    height: 50px;
    text-indent: 10px;
    flex: 1;
  }
  .button-none-border {
    border: none;
    // top: 30px;
    margin: 0 30px 0 30px;
    // float: right;
  }

  .tip-box {
    background: #f4f4f4;
    padding: 50px 50px 0;
    .tip-title {
      font-size: 24px;
      color: #666;
    }
    .tip-sub-title {
      font-size: 20px;
      color: #999;
      padding-top: 10px;
    }
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
