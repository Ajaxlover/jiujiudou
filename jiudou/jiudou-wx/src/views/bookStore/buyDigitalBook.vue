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
        <p class="author">老师：{{ bookInfo.author }}</p>
      </div>
    </div>
    <div class="page-line"></div>
    <div class="price-box">
      <div class="price-left">数字教材价格</div>
      <div class="price-right">{{ getBookPrice(bookInfo) }}</div>
      <div class="price-right-sub">{{ getBookSubPrice(bookInfo) }}</div>
    </div>
    <!-- <div class="buy-box">
      <div class="buy-title">支付方式</div>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="支付宝" clickable @click="radio = '1'">
            <template #right-icon>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell title="微信" clickable @click="radio = '2'">
            <template #right-icon>
              <van-radio name="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div> -->
    <div class="tip-box">
      <div class="tip-title">温馨提示</div>
      <div class="tip-sub-title">1、本数字教材为付费产品，自购买之日起永久有效；</div>
      <div class="tip-sub-title">2、数字教材为虚拟商品，一经购买成功概不退款，也不支持退换或转让，请您理解；</div>
    </div>
    <div class="bottom">
      <van-button :disabled="buyDisabled" class="buttom-default" @click="buyDigitalBook">立即支付</van-button>
    </div>
  </div>
</template>

<script>
import { ebook_digitalBook_index_detail, ebook_dTbookUser_bookPay } from '@/api/bookStore'
import wx from 'jweixin-1.6.0'
import { Toast } from 'vant'
import authUtils from '@/utils/auth.js'
// import Nav from '@/components/Nav'
// import ResourceTeaEmail from '@/components/ResourceTeaEmail'
// import store from '@/store'

export default {
  name: 'BuyDigitalBook',
  components: {
    // Nav,
    // ResourceTeaEmail
  },
  data() {
    return {
      id: this.$route.query.id,
      bookType: Number(this.$route.query.bookType),
      bookInfo: {},
      buyDisabled: false,
      radio: '1'
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
      if (book.discountPrice === 0) {
        return '免费'
      } else {
        const discountPrice = book.discountPrice / 100
        // const price = book.price / 100
        return '¥' + discountPrice.toFixed(2)
      }
    },
    getBookSubPrice(book) {
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
    },
    buyDigitalBook() {
      const user = authUtils.getUserInfo()
      const userInfo = JSON.parse(user)
      const openid = userInfo?.openid
      const that = this
      ebook_dTbookUser_bookPay({ dtbookId: this.id, chargeType: 2, chargeMethod: 3, os: 'PC', openid: openid })
        .then(res => {
          if (res.data.payBody) {
            const payBody = JSON.parse(res.data.payBody)
            // console.log(res.data.payBody)
            // console.log(payBody.timeStamp)
            // console.log(payBody.nonceStr)
            // console.log(payBody.package)
            // console.log(payBody.signType)
            // console.log(payBody.paySign)
            wx.chooseWXPay({
              appId: payBody.appId,
              timestamp: payBody.timeStamp,
              nonceStr: payBody.nonceStr,
              package: payBody.package,
              signType: payBody.signType,
              paySign: payBody.paySign,
              success: function (res) {
                // 支付成功后的回调函数
                // console.log('支付成功')
                Toast({
                  message: '支付成功',
                  position: 'middle',
                  onClose: () => {
                    that.$router.back()
                  }
                })
              },
              cancel: function (res) {
                // 用户取消支付后的回调函数
                // console.log('用户取消支付')
                // that.buyDigitalBook2(payBody)
                Toast({
                  message: '支付取消',
                  position: 'middle'
                })
              },
              fail: function (res) {
                // 支付失败后的回调函数
                // console.log('支付失败')
                // that.buyDigitalBook2(payBody)
                Toast({
                  message: '支付失败',
                  position: 'middle'
                })
              }
            })
          } else {
            Toast({
              message: '支付失败',
              position: 'middle'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
    // buyDigitalBook2(payBody) {
    //   // 调用统一下单接口
    //   if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
    //     console.log('WeixinJSBridge')
    //     WeixinJSBridge.invoke(
    //       'getBrandWCPayRequest',
    //       {
    //         appId: payBody.appId, //公众号名称，由商户传入
    //         timeStamp: payBody.timeStamp, //时间戳，自1970年以来的秒数
    //         nonceStr: payBody.nonceStr, //随机串
    //         package: payBody.package,
    //         signType: payBody.signType, //微信签名方式：
    //         paySign: payBody.paySign //微信签名
    //       },
    //       function (res) {
    //         if (res.err_msg == 'get_brand_wcpay_request:ok') {
    //           // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
    //           Toast({
    //             message: '支付成功',
    //             position: 'middle'
    //           })
    //         } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
    //           console.log('支付取消2')
    //           Toast({
    //             message: '支付取消',
    //             position: 'middle'
    //           })
    //         } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
    //           console.log('支付失败2')
    //           Toast({
    //             message: '支付失败',
    //             position: 'middle'
    //           })
    //         } else {
    //           console.log('支付发生未知错误')
    //           Toast({
    //             message: '支付发生未知错误',
    //             position: 'middle'
    //           })
    //         }
    //       }
    //     )
    //   } else {
    //     Toast({
    //       message: '请在微信内打开链接',
    //       position: 'middle'
    //     })
    //   }
    // }
    // goBack() {
    //   this.$router.replace({
    //     path: '/bookInfo',
    //     query: {}
    //   })
    // }
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
    // background: rgba(102, 102, 102, 0.65);
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
        color: #333;
        font-size: 26px;
      }

      .author {
        color: #666;
        font-size: 26px;
        margin: 30px 0;
        position: absolute;
        bottom: 20px;
        /* '#FFC000';
                // discountPriceP.style.fontSize = '16px';
                // discountPriceP.style.position = 'absolute'; */
      }
    }
  }

  .page-line {
    margin: 0 30px;
    border-top: 1px solid #f4f4f4;
  }

  .buy-box {
    border-top: 20px solid #f4f4f4;
    padding: 0 30px;
    .buy-title {
      font-size: 24px;
      font-weight: 800;
      margin: 30px 0;
    }
  }

  .price-box {
    padding: 30px;
    // border: 1px solid #666;
    .price-left {
      font-size: 24px;
      color: #333;
      display: inline-block;
    }
    .price-right {
      float: right;
      color: #ffb64d;
      font-size: 26px;
      // display: inline-block;
      height: 30px;
      line-height: 30px;
    }

    .price-right-sub {
      float: right;
      color: #666666;
      font-size: 26px;
      text-decoration: line-through;
      // display: inline-block;
      padding-left: 10px;
    }
  }

  .tip-box {
    background: #f4f4f4;
    padding: 30px 30px 0;
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
      background: #ffb64d;
      height: 100px;
    }
  }
}
</style>
