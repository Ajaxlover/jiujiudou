<template>
  <div class="page-home">
    <!-- <div class="home-title">
      <span>书城</span>
    </div> -->
    <!-- <van-search v-model="searchValue" placeholder="书名、作者" @search="onSearch"> </van-search> -->
    <van-search v-model="searchValue" show-action placeholder="书名、作者" @search="onSearch">
      <template #action>
        <van-popover
          v-model="showPopover"
          theme="dark"
          trigger="click"
          placement="bottom-end"
          :actions="scanPopoverActions"
          @select="scanPopoverSelect"
        >
          <template #reference>
            <van-button class="button-none-border" icon="scan"> </van-button>
          </template>
        </van-popover>
      </template>
    </van-search>
    <div class="type-box">
      <span
        v-for="(bookType, index) in bookTypeList"
        :key="index"
        :class="bookType.type == selectedBookType ? 'book-type-selected' : 'book-type'"
        @click="selectBookType(bookType)"
        >{{ bookType.title }}</span
      >
    </div>
    <div class="list-box">
      <div class="left-list">
        <van-list finished>
          <van-cell v-for="(subject, index) in subjectList" :key="index" @click="selectSubject(subject)">
            <span v-if="selectedSubject.id == subject.id" class="left-list-item-block"> </span>
            <span class="left-list-item-name">{{ subject.sname }}</span>
          </van-cell>
        </van-list>
      </div>
      <div class="right-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item, index) in list" :key="index" class="book-item" @click="bookInfoHandler(item)">
              <van-image class="book-img" :src="item.coverPic">
                <template v-slot:loading>
                  <img src="../../assets/image/img_book_ph.png" />
                </template>
                <template v-slot:error>
                  <img src="../../assets/image/img_book_ph.png" />
                </template>
                <span class="book-type" :class="getBookTypeClass(item)">
                  {{ getBookTypeStr(item) }}
                </span>
              </van-image>
              <span class="book-info">
                <div class="book-title">{{ item.tname }}</div>
                <div class="book-author">作者：{{ item.author }}</div>
                <div>
                  <div class="book-price">{{ getBookPrice(item) }}</div>
                  <div class="book-sub-price">{{ getBookSubPrice(item) }}</div>
                </div>
                <div v-if="item.isVerified" class="book-mark">已获取</div>
              </span>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import { subject_subject_listAll, book_bookApp_getRecoBooks, book_bookVerify_bookVerifyV2, book_textbook_resumeBook } from '@/api/bookStore'
import wx from 'jweixin-1.6.0'
import { Toast } from 'vant'

export default {
  name: 'BookStore',
  data() {
    return {
      showPopover: false,
      scanPopoverActions: [
        { text: '扫一扫', icon: 'scan' },
        { text: '验证码', icon: 'qr' }
      ],
      searchValue: '',
      bookTypeList: [
        { title: '全部', type: '' },
        { title: '纸质教材', type: '1' },
        // { title: '电子书', type: '2' },
        { title: '数字教材', type: '3' }
      ],
      selectedBookType: '',
      subjectList: [],
      selectedSubject: { id: 0 },
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 0
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getSubjectInfo()
  },
  methods: {
    scanPopoverSelect(action) {
      if (action.text === '扫一扫') {
        this.scanHandler()
      } else if (action.text === '验证码') {
        this.$router.push({
          path: '/activateBook'
        })
      }
    },
    getSubjectInfo() {
      subject_subject_listAll({})
        .then(res => {
          this.subjectList = res.data
          var tmp = {}
          tmp.sname = '全部'
          tmp.id = 0
          tmp.servername = '全部'
          this.subjectList.unshift(tmp)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getBookList() {
      var data = {
        page: this.page,
        pagesize: 20,
        bookType: this.selectedBookType
      }
      if (this.selectedSubject.id !== 0) {
        data.subjectId = this.selectedSubject.id
      }
      if (this.searchValue) {
        data.keyWord = this.searchValue
      }
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      book_bookApp_getRecoBooks(data)
        .then(res => {
          setTimeout(() => {
            this.list = this.list.concat(res.data)
            if (res.data.length >= 20) {
              this.loading = false
            } else {
              this.loading = false
              this.finished = true
            }
            Toast.clear()
          }, 500)
        })
        .catch(err => {
          console.error(err)
          Toast.clear()
        })
    },
    selectBookType(bookType) {
      this.selectedBookType = bookType.type
      this.onRefresh()
    },
    onLoad() {
      this.page++
      this.getBookList()
    },
    onRefresh() {
      // 清空列表数据 重新加载数据  将 loading 设置为 true，表示处于加载状态
      this.finished = false
      this.loading = true
      this.list = []
      if (this.refreshing) {
        this.refreshing = false
      }
      this.page = 1
      this.getBookList()
    },
    getBookTypeClass(book) {
      let str = 'book-type-defaul'
      if (book.bookType === 1) {
        str = 'book-type-default'
      } else if (book.bookType === 2) {
        str = 'book-type-dianzishu'
      } else if (book.bookType === 3) {
        str = 'book-type-shuzijiaocai'
      }
      return str
    },
    getBookTypeStr(book) {
      let str = ''
      if (book.bookType === 1) {
        str = '纸质教材'
      } else if (book.bookType === 2) {
        str = '电子书'
      } else if (book.bookType === 3) {
        str = '数字教材'
      }
      return str
    },
    getBookPrice(book) {
      if (book.bookType === 2 || book.bookType === 3) {
        if (book.discountPrice > 0) {
          const discountPrice = book.discountPrice / 100
          // const price = book.price / 100
          return '¥' + discountPrice.toFixed(2)
        } else if (book.discountPrice === 0) {
          return '免费'
        }
      }
      return ''
    },
    getBookSubPrice(book) {
      if (book.bookType === 2 || book.bookType === 3) {
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
      if (verifyType === 2) {
        this.$router.push({
          path: '/bookInfo',
          query: {
            id: id,
            bookType: 3
          }
        })
      } else {
        this.$router.push({
          path: '/activatedBook',
          query: {
            id: id
          }
        })
      }
    },
    onSearch() {
      this.onRefresh()
    },
    selectSubject(subject) {
      this.selectedSubject = subject
      this.onRefresh()
    },
    bookInfoHandler(book) {
      this.$router.push({
        path: '/bookInfo',
        query: {
          id: book.textbookId.replace('DTBOOK-', ''),
          bookType: book.bookType
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  height: 100%;
  width: 100%;
  background-color: #fff;

  .home-title {
    text-align: center;
    height: 90px;
    line-height: 90px;
    font-size: 34px;
    font-weight: 600;
    color: #333333;
  }

  .type-box {
    padding: 10px 20px 30px;
    overflow-x: scroll;
    white-space: nowrap;

    .book-type {
      border: 1px solid #10c4ee;
      border-radius: 10px;
      color: #333;
      font-size: 24px;
      margin: 0 15px;
      padding: 10px;
    }

    .book-type-selected {
      background: #10c4ee;
      border-radius: 10px;
      font-size: 24px;
      color: #fff;
      margin: 0 15px;
      padding: 10px;
    }
  }

  .list-box {
    display: flex;
    background: #f4f4f4;
    border-top: 5px solid #f4f4f4;
    height: 80vh; // 限制列表高度，避免load加载
    .left-list {
      width: 200px;
      background: white;
      .left-list-item-block {
        position: absolute;
        width: 5px;
        height: 50px;
        background: #10c4ee;
      }
      .left-list-item-name {
        margin-left: 20px;
        font-size: 26px;
        color: #333333;
      }
    }
    .right-list {
      margin: 0 0 0 10px;
      background: white;
      flex: 1;
      .book-item {
        // display: inline-block;
      }
      .book-img {
        width: 155px;
        height: 211px;
      }
      .book-type {
        position: absolute;
        display: inline-block;
        right: 0;
        top: 0;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
        padding: 5px 5px;
        background: #5fd7f3;
      }
      .book-type-default {
        background: #5fd7f3;
      }
      .book-type-dianzishu {
        background: #10c4ee;
      }
      .book-type-shuzijiaocai {
        background: #a2ef4d;
      }
      .book-info {
        position: absolute;
        // width: 100%;
        height: 211px;
        margin-left: 20px;

        .book-title {
          font-size: 28px;
          color: #333333;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          word-break: break-all;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-author {
          font-size: 24px;
          color: #666666;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          word-break: break-all;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-price {
          color: #ffb64d;
          font-size: 26px;
          display: inline-block;
          height: 30px;
          line-height: 30px;
        }

        .book-sub-price {
          color: #666666;
          font-size: 26px;
          text-decoration: line-through;
          display: inline-block;
          padding-left: 10px;
        }

        .book-mark {
          color: #ffb64d;
          font-size: 22px;
          border: 1px solid #ffb64d;
          border-radius: 12px;
          padding: 3px 6px;
          display: inline;
        }

        .book-publisher {
          font-size: 24px;
          color: #666666;
        }

        .book-functions {
          position: absolute;
          bottom: 0;
          .book-function-name {
            font-size: 24px;
            color: #333333;
            margin-right: 10px;
          }
          .book-function-dot {
            width: 10px;
            height: 10px;
            background-color: #10c4ee;
            border-radius: 50%;
            display: inline-block;
            margin: 5px;
          }
        }
      }
    }
  }
  .button-none-border {
    padding: 20px 30px 0px;
    border: none;
    float: right;
  }
}
</style>
