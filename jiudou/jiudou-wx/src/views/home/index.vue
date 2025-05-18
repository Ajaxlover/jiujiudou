<template>
  <div class="page-home">
    <!-- <div class="home-title">
      <span>我的教材</span>
    </div> -->
    <!-- <van-search v-model="searchValue" show-action placeholder="书名、作者" @search="onSearch">
      <template #action>
        <van-button class="button-none-border" icon="scan" @click="scanHandler"> </van-button>
      </template>
    </van-search> -->
    <div class="nav">
      <div class="active-nav" :class="activeNav ? 'acitve-nav-highlighted' : ''" @click="nav1Handler">
        纸质教材
        <div class="acitve-nav-bar" :class="activeNav ? 'acitve-nav-bar-highlighted' : ''"></div>
      </div>
      <div class="active-nav" :class="!activeNav ? 'acitve-nav-highlighted' : ''" @click="nav2Handler">
        数字教材
        <div class="acitve-nav-bar" :class="!activeNav ? 'acitve-nav-bar-highlighted' : ''"></div>
      </div>
    </div>
    <div class="page">
      <div v-if="activeNav">
        <!-- <div class="horizontal-display-bar">
          <div class="theme-title">更多推荐</div>
          <div class="list-box">
            <van-image v-for="(item, index) in recommendBookList" :key="index" class="box-item" :src="item.coverPic" @click="bookInfoHandler(item)">
              <template v-slot:loading>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
              <template v-slot:error>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
            </van-image>
          </div>
        </div> -->
        <div class="vertical-display-bar">
          <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in list" :key="item" @click="bookInfoHandler(item)"> -->
          <div v-for="(item, index) in list" :key="index" class="book-cell" @click="bookInfoHandler(item)">
            <van-image class="book-img" :src="item.cover_pic">
              <template v-slot:loading>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
              <template v-slot:error>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
              <span v-if="getBookTypeStr(item)" class="book-type" :class="getBookTypeClass(item)">
                {{ getBookTypeStr(item) }}
              </span>
            </van-image>
            <span class="book-info">
              <div class="book-title">{{ item.tname }}</div>
              <div class="book-author">作者：{{ item.author }}</div>
              <div class="book-publisher">出版社：{{ item.pubName }}</div>
              <div class="book-functions">
                <span v-for="(item2, index2) in getBookFunctionList(item)" :key="index2" class="book-function-name">
                  <span class="book-function-dot"></span>
                  {{ item2.title }}
                </span>
              </div>
            </span>
          </div>
          <!-- </van-cell>
        </van-list>
      </van-pull-refresh> -->
        </div>
      </div>
      <div v-if="!activeNav">
        <!-- <div class="horizontal-display-bar">
          <div class="theme-title">最近学习</div>
          <div class="list-box">
            <van-image v-for="(item, index) in recommendBookList" :key="index" class="box-item" :src="item.coverPic" @click="bookInfoHandler(item)">
              <template v-slot:loading>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
              <template v-slot:error>
                <img src="../../assets/image/img_book_ph.png" />
              </template>
            </van-image>
          </div>
        </div> -->
        <div class="vertical-display-bar">
          <van-pull-refresh v-model="refreshing2" @refresh="onRefresh2">
            <van-list v-model="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2">
              <van-cell v-for="(item, index) in list2" :key="index" @click="bookInfoHandler2(item)">
                <!-- <div v-for="(item, index) in list" :key="index" class="book-cell" @click="bookInfoHandler(item)"> -->
                <van-image class="book-img" :src="item.coverPic">
                  <template v-slot:loading>
                    <img src="../../assets/image/img_book_ph.png" />
                  </template>
                  <template v-slot:error>
                    <img src="../../assets/image/img_book_ph.png" />
                  </template>
                  <!-- <span v-if="getBookTypeStr(item)" class="book-type" :class="getBookTypeClass(item)">
                {{ getBookTypeStr(item) }}
              </span> -->
                </van-image>
                <span class="book-info">
                  <div class="book-title">{{ item.tname }}</div>
                  <div class="book-author">{{ item.author }}</div>
                  <div class="book-publisher">{{ item.publishName }}</div>
                  <!-- <div class="book-functions">
                <span v-for="(item2, index2) in getBookFunctionList(item)" :key="index2" class="book-function-name">
                  <span class="book-function-dot"></span>
                  {{ item2.title }}
                </span>
              </div> -->
                </span>
                <!-- </div> -->
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getBanner, getContestList } from '@/api/home'
import { ebook_ebookApp_recommend, book_textbook_updateBookShelf, ebook_dTbookUser_queryBookPage } from '@/api/home'

export default {
  name: 'Home',
  data() {
    return {
      activeNav: true,
      // searchValue: '',
      // recommendBookList: [],
      list: [],
      pageNo: 1,
      list2: [],
      loading: false,
      finished: false,
      refreshing: false,
      loading2: false,
      finished2: false,
      refreshing2: false
    }
  },
  computed: {},
  created() {},
  mounted() {
    // eslint-disable-next-line no-unused-vars
    // const bs = new BetterScroll('.wrap-home', {
    //   scrollY: true
    // })

    // 监听IOS下物理返回键
    if (window.history && window.history.pushState) {
      window.history.pushState(null, null, document.URL)
      window.addEventListener(
        'popstate',
        () => {
          // 重定向你要的地址即可
          // wx.closeWindow()
          window.location.reload()
        },
        false
      )
    }
    // 监听 popstate 事件
    // window.history.replaceState({}, '', process.env.VUE_APP_BASEURL)
    // this.getRecommendBookList()
    this.getBookList()
  },
  methods: {
    // getRecommendBookList() {
    //   ebook_ebookApp_recommend({
    //     isTeacher: 1
    //   })
    //     .then(res => {
    //       this.recommendBookList = res.data
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // },
    getBookList() {
      book_textbook_updateBookShelf({
        updated: 0
      })
        .then(res => {
          this.list = res.data.bookUpdate.slice().reverse().filter(function (item) {
            return !item.delFlag // 移除已删除的
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    getDBBookList() {
      ebook_dTbookUser_queryBookPage({
        pageNo: this.pageNo,
        pageSize: 10
      })
        .then(res => {
          this.list2 = this.list2.concat(res.data.records)
          if (res.data.records.length >= 10) {
            this.loading2 = false
          } else {
            this.loading2 = false
            this.finished2 = true
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getBookFunctionList(book) {
      var arr = []
      if (book.isSubjectBank) {
        arr.push({ title: '在线刷题', type: 1 })
      }
      if (book.isCourseware) {
        arr.push({ title: '课件包', type: 2 })
      }
      if (book.isAr) {
        arr.push({ title: 'AR', type: 3 })
      }
      return arr
    },
    getBookTypeClass(book) {
      let str = 'book-type-defaul'
      // if (book.bookType === 1) {
      //   str = 'book-type-default'
      // } else if (book.bookType === 2) {
      //   str = 'book-type-dianzishu'
      // } else if (book.bookType === 3) {
      //   str = 'book-type-shuzijiaocai'
      // }
      const tmp = book.textbookId
      if (!tmp.includes('-')) {
        str = 'book-type-dianzishu'
      }
      return str
    },
    getBookTypeStr(book) {
      let str = ''
      const tmp = book.textbookId
      if (!tmp.includes('-')) {
        str = '电子书'
      }
      // if (book.bookType === 1) {
      //   str = '纸质教材'
      // } else if (book.bookType === 2) {
      //   str = '电子书'
      // } else if (book.bookType === 3) {
      //   str = '数字教材'
      // }
      return str
    },
    // onLoad() {
    //   setTimeout(() => {
    //     if (this.refreshing) {
    //       this.list = []
    //       this.refreshing = false
    //     }

    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }
    //     this.loading = false

    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 1000)
    // },
    // onRefresh() {
    //   // 清空列表数据
    //   this.finished = false

    //   // 重新加载数据
    //   // 将 loading 设置为 true，表示处于加载状态
    //   this.loading = true
    //   this.onLoad()
    // },
    // onSearch() {},
        onLoad2() {
      this.pageNo++
      this.getDBBookList()
    },
    onRefresh2() {
      // 清空列表数据 重新加载数据  将 loading 设置为 true，表示处于加载状态
      this.finished2 = false
      this.loading2 = true
      this.list2 = []
      if (this.refreshing2) {
        this.refreshing2 = false
      }
      this.pageNo = 1
      this.getDBBookList()
    },
    scanHandler() {},
    bookInfoHandler(book) {
      const tmp = book.textbookId
      if (tmp) {
        if (!tmp.includes('-')) {
          // 电子书已无
          this.gotoAppUrl()
          return
        }
      } else {
        if (book.bookStoreUrl) {
          window.location.href = book.bookStoreUrl
        }
        return
      }
      this.$router.push({
        path: '/activatedBook',
        query: {
          id: tmp
        }
      })
      // this.$router.push({
      //   path: '/activateBook',
      //   query: {
      //     id: tmp
      //   }
      // })
    },
    bookInfoHandler2(book) {
      this.$router.replace({
        path: '/bookInfo',
        query: {
          id: book.dtbookId,
          bookType: 3
        }
      })
    },
    gotoAppUrl() {
      window.location.href = 'https://www.guangyiedu.com/app/'
    },
    nav1Handler() {
      this.activeNav = true
      // this.getRecommendBookList()
      this.getBookList()
    },
    nav2Handler() {
      this.activeNav = false
      this.onRefresh2()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  // position: relative;
  height: 100%;
  width: 100%;
  background-color: #fff;
  // padding-bottom: 160px;
  // bottom: 100px;
  .nav {
    border-bottom: 1px solid #eeeeee;
    background: #ffffff;
    height: 90px;
    font-size: 30px;
    .active-nav {
      display: inline-block;
      width: 50%;
      text-align: center;
      line-height: 80px;
      font-size: 30px;
      position: relative;
    }

    .active-nav-highlighted {
      color: #10c4ee;
    }

    .acitve-nav-bar {
      display: none;
    }

    .acitve-nav-bar-highlighted {
      display: inline-block;
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 200px;
      margin-left: -100px;
      height: 5px;
      background: #10c4ee;
    }
  }
  .page {
    .home-title {
      text-align: center;
      height: 90px;
      line-height: 90px;
      font-size: 34px;
      font-weight: 600;
      color: #333333;
    }

    .horizontal-display-bar {
      padding: 10px 22px;
      .theme-title {
        font-size: 30px;
        color: #333333;
      }

      .list-box {
        padding: 20px 0;
        overflow-x: scroll;
        white-space: nowrap;

        .box-item {
          width: 155px;
          height: 211px;
        }

        .box-item:not(:last-child) {
          display: inline-block;
          margin: 0 20px 0 0;
        }
      }
    }

    .vertical-display-bar {
      padding: 10px 0 0 0;

      .book-cell {
        padding: 10px 30px;
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
        // width: 70%;
        width: calc(750px - 220px);
        height: 211px;
        margin-left: 20px;

        .book-title {
          font-size: 26px;
          color: #333333;
        }

        .book-author {
          margin-top: 10px;
          font-size: 24px;
          color: #666666;
        }

        .book-publisher {
          margin-top: 10px;
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

    .button-none-border {
      border: none;
      float: right;
    }
  }
}
</style>
