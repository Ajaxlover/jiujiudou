<template>
  <div class="my-book">
    <!-- <div class="search-bar">
      <div class="search-bar-container">
        <el-input
          v-model="hotWords"
          placeholder="请输入搜索关键字"
          class="input-with-select"
        >
        </el-input>
        <el-button icon="el-icon-search"></el-button>
      </div>
    </div> -->
    <div class="course-search-content w">
      <div class="ke-tabs">
        <div class="search-tabs-container">
          <span class="tag-txt">我的教材</span>
          <div class="search-container">
            <el-input
              placeholder="请输入书名/作者/书号"
              v-model.trim="bookName"
              @keyup.enter.native="searchMyBook"
              class="input-with-select"
            >
            </el-input>
            <el-button
              @click.enter="searchMyBook"
              icon="el-icon-search"
            ></el-button>
          </div>
        </div>
        <div class="my-book-list">
          <div v-if="myBookList.length === 0" class="no-data">
            <img src="../../assets/img/empty.png" alt="" />
            <span>还没有验证教材哦~</span>
          </div>
          <div
            v-else
            class="my-book-item"
            :key="index"
            @click="goMyBookDetail(item)"
            v-for="(item, index) in myBookList"
          >
            <div class="book-item-container">
              <div class="book-cover">
                <img :src="item.cover_pic" alt="" />
              </div>
              <div class="book-name">
                <span>{{ item.tname }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="myBookList.length != 0" class="my-book-pager">
          <el-pagination
            background
            :hide-on-single-page="true"
            layout="prev, pager, next"
            :page-size="bookPage.pageSize"
            @current-change="getBookList"
            :current-page.sync="bookPage.page"
            :total="bookPage.total"
          >
          </el-pagination>
        </div>
      </div>
      <div class="rec-container">
        <div class="content-right">
          <div class="content-right-title">教材推荐</div>
          <div class="content-right-list">
            <div
              @click="toBookDetail(item)"
              v-for="(item, index) in recommendList"
              :key="index"
              class="content-right-list-item"
            >
              <div class="item-left">
                <img :src="item.coverPic" alt="" />
              </div>
              <div class="item-right">
                <div class="item-right-name">{{ item.tname }}</div>
                <div class="item-right-teacher">作者:{{ item.author }}</div>
                <div class="item-right-intro">
                  {{ item.verifiedCount }}人已验证
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="content-right">
          <div class="content-right-title">推荐云课</div>
          <div class="content-right-list">
            <div
              v-for="(item, index) in 5"
              :key="index"
              class="content-right-list-item"
            >
              <div class="item-left">
                <img
                  src="https://test.guangyiedu.com/cCourse/cover/661094-1638921501010.jpeg"
                  alt=""
                />
              </div>
              <div class="item-right">
                <div class="item-right-name">大学物理学</div>
                <div class="info-text">
                  <div class="item-right-teacher">老师:dhAKHJK</div>
                  <div class="item-right-intro">3000人感兴趣</div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
// @ is an alias to /src
import axios from "@/libs/api.request"

export default {
  name: "my-book",
  components: {},
  data() {
    return {
      recommendList: [],
      myBookList: [],
      bookName: "",
      scrollTop: 0,
      bookPage: {
        page: 1,
        pageSize: 6,
        total: 0,
      },
      recommendPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
    }
  },
  methods: {
    toBookDetail(item) {
      let { textbookId } = item
      this.$router.push({
        path: "/cloudBook-detail",
        query: {
          textbookId,
        },
      })
    },
    // eslint-disable-next-line no-unused-vars
    goMyBookDetail(item) {
      this.$store.commit("setBook", item)
      this.$router.push({
        name: "myBookDetail",
        params: {
          textbookId: item.textbookId,
        },
      })
    },
    // 搜索已认证教材
    searchMyBook() {
      this.getBookList()
    },
    getRecommendList() {
      axios
        .request({
          method: "post",
          url: `/book/bookApp/getBooks`,
          data: {
            page: this.recommendPage.page,
            pagesize: this.recommendPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.recommendList = ret.data.books
            this.recommendPage.total = ret.data.count
          }
        })
    },
    getBookList() {
      axios
        .request({
          method: "post",
          url: `/book/v1/textbook/getMyBookList`,
          data: {
            keyWord: this.bookName,
            page: this.bookPage.page,
            pageSize: this.bookPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.myBookList = ret.data.bookUpdate
            this.bookPage.total = ret.data.bookUpdateCount
          }
        })
    },
    getHeight() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.scrollTop = scrollTop
    },
    goTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    },
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    window.addEventListener("scroll", this.getHeight)
    this.getBookList()
    this.getRecommendList()
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
  background-color: #f7f7f7;
}
.my-book {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;
  .search-bar {
    width: 100%;
    height: 130px;
    background-color: #fff;
    margin-top: 72px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px #00000014;

    // position: fixed;
    .search-bar-container {
      position: relative;
      border-radius: 20px;
      border: 2px solid #03d3f2;
      width: 700px;
      margin: 0 auto;

      .input-with-select {
        width: 320px;
        /deep/.el-input__inner {
          border-radius: 20px;
          border: none;
          width: 610px;
          height: 54px;
          font-size: 18px;
        }
      }
      .el-button {
        position: absolute;
        right: 0;
        height: 54px;
        width: 85px;
        border-radius: 20px;
        background: linear-gradient(-45deg, #03d3f2, #0491fd);
        color: #fff;
      }
    }
  }
  .course-search-content {
    margin-top: 100px;
    min-height: 800px;
    overflow: hidden;
    .ke-tabs {
      width: 1100px;
      min-height: 820px;
      background-color: #fff;
      padding: 35px;
      float: left;
      box-shadow: 4px 4px 10px #00000014;

      .search-tabs-container {
        margin-bottom: 50px;
        display: flex;
        justify-content: space-between;
        .tag-txt {
          font-size: 27px;
          font-weight: bold;
          border-left: 4px solid #049efb;
          padding-left: 10px;
        }
        .search-container {
          width: 300px;
          position: relative;
          border-radius: 30px;
          border: 1px solid #03d3f2;
          .input-with-select {
            /deep/.el-input__inner {
              border-radius: 30px;
              border: none;
              width: 240px;
            }
          }
          .el-button {
            position: absolute;
            right: 0;
            border-radius: 30px;
            background: linear-gradient(-45deg, #03d3f2, #0491fd);
            color: #fff;
          }
        }
      }
      .my-book-list {
        background-color: #f7f7f7;
        margin-bottom: 30px;
        height: 600px;
        padding: 0 10px;
        overflow: hidden;

        .no-data {
          text-align: center;
          margin-top: 200px;
          img {
            display: block;
            margin: 0 auto;
          }
        }
        .my-book-item {
          width: 33.3%;
          float: left;
          height: 300px;
          padding: 0 60px;
          background-color: #f7f7f7;

          .book-item-container {
            background-color: #f7f7f7;
            cursor: pointer;
            padding: 0 10px;

            .book-cover {
              display: flex;
              justify-content: center;
              border-bottom: 1px solid #ddd;

              img {
                width: 180px;
                height: 240px;
                vertical-align: -webkit-baseline-middle;
              }
            }
            .book-name {
              text-align: center;
            }
          }
        }
      }
      .my-book-pager {
        display: flex;
        justify-content: center;
      }
    }
    .rec-container {
      min-height: 1000px;
      float: right;
      box-shadow: 4px 4px 10px #00000014;

      .content-right {
        width: 300px;
        border-radius: 10px;
        margin-left: 10px;
        min-height: 980px;
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
  }
}
</style>
