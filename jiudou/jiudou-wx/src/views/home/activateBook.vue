<template>
  <div class="page-home">
    <!-- <Nav title="激活教材" @go-back="goBack"></Nav> -->
    <div class="home-function-title">输入激活码</div>
    <div class="home-function-box">
      <input v-model="code" type="text" placeholder="激活码" class="home-function-code" />
      <van-button class="home-function-scan" icon="scan" @click="scanHandler"> </van-button>
    </div>
    <!-- <van-field v-model="code" class="home-function-code" type="number" placeholder="激活码" /> -->
    <div class="home-function-button-box">
      <van-button :disabled="!code.length" class="home-function-button" size="large" @click="buttonHandler">确定</van-button>
    </div>
    <!-- <div class="home-function-tip">如果您未购买该书籍，请先购买正版书籍</div> -->
  </div>
</template>

<script>
import { book_bookVerify_bookVerifyV2, book_textbook_resumeBook } from '@/api/bookStore'
import wx from 'jweixin-1.6.0'
import { Toast } from 'vant'
// import Nav from '@/components/Nav'

export default {
  name: 'ActivateBook',
  components: {
    // Nav
  },
  data() {
    return {
      code: ''
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // goBack() {
    //   this.$router.goBack()
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
          that.bookVerify(res.resultStr)
        }
      })
    },
    bookVerify(qrCode) {
      book_bookVerify_bookVerifyV2({ qrCode: qrCode, sysModel: 2, showType: 1 })
        .then(res => {
          if (res.code === 200 || res.code === 240) {
            Toast({
              message: '验证成功',
              position: 'middle',
              onClose: () => {
                this.openBookHandler(res.data.textbookId, res.data.verifyType)
              }
            })
          } else if (res.code === 239) {
            this.resumeBook(res.data.book_cod, res.data.verifyTypee)
          } else {
            Toast({
              message: res.msg,
              position: 'middle'
            })
          }
        })
        .catch(err => {
          console.error(err)
          if (err.code === 200 || err.code === 240) {
            Toast({
              message: '验证成功',
              position: 'middle',
              onClose: () => {
                this.openBookHandler(err.data.textbookId, err.data.verifyType)
              }
            })
          } else if (err.code === 239) {
            this.resumeBook(err.data.book_code, err.data.verifyType)
          } else {
            Toast({
              message: err.msg,
              position: 'middle'
            })
          }
        })
    },
    resumeBook(book_code, verifyType) {
      var type = 1
      if (book_code.includes('-')) {
        type = 2
      }
      var books = [{ id: book_code, type: type }]
      var str = JSON.stringify(books)
      console.error('resumeBook 111' + str)
      book_textbook_resumeBook({
        books: str
      })
        .then(res => {
          console.error('resumeBook 222' + res)
          Toast({
              message: '恢复成功',
              position: 'middle',
              onClose: () => {
                this.openBookHandler(book_code, verifyType)
              }
            })
        })
        .catch(err => {
          console.error('resumeBook 333' + err)
        })
    },
    openBookHandler(id, verifyType) {
      // this.$router.replace({
      //   path: '/home',
      //   query: {}
      // })
      if (verifyType === 2) {
        this.$router.replace({
          path: '/bookInfo',
          query: {
            id: id,
            bookType: 3
          }
        })
      } else {
        this.$router.replace({
          path: '/activatedBook',
          query: {
            id: id
          }
        })
      }
    },
    buttonHandler() {
      this.bookVerify(this.code)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  .home-function-title {
    font-size: 40px;
    color: #10c4ee;
    padding: 60px 0 0 30px;
  }
  .home-function-box {
    display: flex;
  }
  .home-function-code {
    border: 0px;
    border-bottom: 1px solid #999999;
    margin: 40px 0 10px 30px;
    // height: 50px;
    text-indent: 10px;
    flex: 1;
  }
  .home-function-scan {
    border: none;
    // top: 30px;
    margin: 30px 50px 0 70px;
    font-size: 50px;
    // float: right;
  }
  .home-function-button-box {
    margin: 80px 30px 0 30px;
  }
  .home-function-button {
    background: #10c4ee;
    color: #fff;
    font-size: 40px;
  }
  .home-function-tip {
    margin: 50px 0 0 0;
    text-align: center;
    color: #999999;
    font-size: 30px;
  }
}
</style>
