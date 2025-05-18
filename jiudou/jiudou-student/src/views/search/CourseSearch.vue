<template>
  <div class="course-search">
    <div class="search-bar">
      <div class="search-bar-container">
        <el-input
          v-model="hotWords"
          placeholder="请输入搜索关键字"
          class="input-with-select"
          @keyup.enter.native="toSearch"
        >
        </el-input>
        <el-button @click="toSearch" icon="el-icon-search"></el-button>
      </div>
    </div>
    <div class="course-search-content w">
      <div class="ke-tabs">
        <div class="search-tabs-container">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              :label="`全部云课(${resultCount.cloudCounts})`"
              name="first"
              ><div v-if="cloudCourseList.length === 0" class="no-data">
                <img src="../../assets/img/empty.png" alt="" />
              </div>
              <div v-else class="res-list">
                <div
                  @click="toDetail(item)"
                  class="yun-item"
                  v-for="(item, index) in cloudCourseList"
                  :key="index"
                >
                  <div class="yun-img">
                    <img
                      v-if="item.ccourseCover"
                      :src="item.ccourseCover"
                      alt=""
                    />
                    <img
                      v-else
                      src="../../assets/img/ccoursePlacehoder.png"
                      alt=""
                    />
                  </div>
                  <div class="yun-text">
                    <span class="yun-name">{{ item.ccourseName }}</span>
                    <span class="yun-teacher"
                      >老师:{{ item.ccourseTeacherName }}</span
                    >
                    <span class="yun-intro">{{ item.ccourseIntro }}</span>
                    <div class="yun-num">
                      <span class="inter-num"
                        >{{ item.ccourseInterestedNum }}人感兴趣</span
                      >
                      <span class="price" v-if="item.ccourseFeeType == 0"
                        >免费</span
                      >
                      <span class="price" v-else
                        >¥{{ item.ccoursePrice / 100 }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="ke-pager">
                  <el-pagination
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="cloudPage.pageSize"
                    :current-page.sync="cloudPage.page"
                    @current-change="searchAll"
                    :total="cloudPage.total"
                  ></el-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`全部慕课(${resultCount.moocCounts})`"
              name="second"
            >
              <div v-if="moocList.length === 0" class="no-data">
                <img src="../../assets/img/empty.png" alt="" />
              </div>
              <div v-else class="res-list">
                <div
                  @click="goMoocDetail(item)"
                  class="mooc-item"
                  v-for="(item, index) in moocList"
                  :key="index"
                >
                  <div class="yun-img">
                    <img v-if="item.cover" :src="item.cover" alt="" />
                    <img
                      v-else
                      src="../../assets/img/ccoursePlacehoder.png"
                      alt=""
                    />
                    <!-- <img
                      src="https://test.guangyiedu.com/cCourse/cover/661094-1638934074319.jpeg"
                      alt=""
                    /> -->
                  </div>
                  <div class="yun-text">
                    <span class="yun-name">{{ item.name }}</span>
                    <span class="yun-teacher">老师:{{ item.teacherName }}</span>
                    <span class="yun-intro">{{ item.totalNum }}人已参加</span>

                    <div class="yun-num">
                      <span class="inter-num"
                        >{{ item.interestedNum }}人感兴趣</span
                      >
                      <!-- <span class="price">进行中</span> -->
                      <span class="price" v-if="item.status == 4">进行中</span>
                      <span class="price" v-if="item.status == 0">未发布</span>
                      <span class="price" v-if="item.status == 2">已结课</span>
                    </div>
                  </div>
                </div>
                <div class="ke-pager">
                  <el-pagination
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="cloudPage.pageSize"
                    :current-page.sync="cloudPage.page"
                    @current-change="searchAll"
                    :total="moocPage.total"
                  ></el-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="`全部教材(${resultCount.bookCounts})`"
              name="third"
            >
              <div v-if="bookList.length === 0" class="no-data">
                <img src="../../assets/img/empty.png" alt="" />
              </div>
              <div v-else class="res-list">
                <div
                  @click="toBookDetail(item)"
                  class="book-item"
                  v-for="(item, index) in bookList"
                  :key="index"
                >
                  <div class="yun-img">
                    <!-- <img
                      src="http://img-1253402545.file.myqcloud.com/textbookcover/20170720/1500537237443-%E7%94%BB%E6%B3%95%E5%87%A0%E4%BD%95%E5%8F%8A%E6%9C%BA%E6%A2%B0%E5%88%B6%E5%9B%BE-%E6%9D%A8%E8%A3%95%E6%A0%B9.jpg"
                      alt=""
                    /> -->
                    <img v-if="item.cover" :src="item.cover" alt="" />
                    <img
                      v-else
                      src="https://via.placeholder.com/170x240.png"
                      alt=""
                    />
                  </div>
                  <div class="yun-text">
                    <span class="yun-name">{{ item.textbookName }}</span>
                    <span class="yun-teacher">作者:{{ item.author }}</span>
                    <span class="yun-intro">出版社:{{ item.pubName }}</span>
                    <div class="yun-num">
                      <!-- <span class="inter-num"
                        >{{ item.verifiedCount }}人已验证</span
                      > -->
                      <span class="inter-num">书号:{{ item.textbookNum }}</span>
                      <!-- <span v-if="item.isVerified === 0" class="price"
                        >已验证</span
                      > -->
                    </div>
                  </div>
                </div>
                <div class="ke-pager">
                  <el-pagination
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="cloudPage.pageSize"
                    :current-page.sync="cloudPage.page"
                    @current-change="searchAll"
                    :total="bookPage.total"
                  ></el-pagination>
                </div>
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
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";

// import StuHeader from "@/components/Stu-Header.vue";

// import StuFooter from "@/components/Stu-Footer.vue";

export default {
  name: "course-search",
  components: {
    // StuHeader,
    // StuFooter,
  },
  data() {
    return {
      resultCount: {
        cloudCounts: 0,
        moocCounts: 0,
        bookCounts: 0,
      },
      recommendList: [],
      activeName: "first",
      hotWords: "",
      scrollTop: 0,
      checkList: [],
      cloudCourseList: [],
      moocList: [],
      bookList: [],
      cloudPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
      moocPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
      bookPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
    };
  },
  methods: {
    toDetail(item) {
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      });
    },
    getRecommendList() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/recommend`,
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.recommendList = ret.data.selected;
          }
        });
    },
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, event) {
      // console.log(tab, event);
      this.cloudPage.page = 1;
      this.searchAll();
    },
    // 云课
    getCloudCourseList() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/listStudent`,
          data: {
            page: this.cloudPage.page,
            pageSize: this.cloudPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.cloudCourseList = ret.data.ccourses;
            this.cloudPage.total = ret.data.total;
            // 课程标签
            this.cloudCourseList.forEach((item) => {
              item.tagList = item.ccourseTags
                ? item.ccourseTags.split(",")
                : [];
            });
          }
        });
    },
    // 慕课
    getMoocList() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openCcourse/listCcourse`,
          data: {
            type: 1,
            pageNo: 1,
            pageSize: 5,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.moocList = ret.data.records;
            // this.cloudCourseList = ret.data;
            // 课程标签
            this.moocList.forEach((item) => {
              item.tagList = item.tags ? item.tags.split(",") : [];
            });
          }
        });
    },
    getBookList() {
      axios
        .request({
          method: "post",
          url: `/book/bookApp/getBooks`,
          data: {
            page: this.bookPage.page,
            pagesize: this.bookPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookList = ret.data.books;
            this.bookPage.total = ret.data.total;
          }
        });
    },
    toBookDetail(item) {
      let { textbookId } = item;
      this.$router.push({
        path: "/cloudBook-detail",
        query: {
          textbookId,
        },
      });
    },
    goMoocDetail(item) {
      this.$router.push({
        path: "/mooc-detail",
        query: {
          moocId: item.id,
        },
      });
    },
    getHeight() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
    },
    goTop() {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    toSearch() {
      this.searchAll();
    },
    searchAll() {
      axios
        .request({
          method: "post",
          url: `/searchAll`,
          data: {
            keyword: this.hotWords,
            page: this.cloudPage.page,
            pageSize: this.cloudPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            console.log(ret);
            // 云课
            this.cloudCourseList = ret.data.ccourses;
            this.cloudPage.total = ret.data.ccoursesTotal;
            this.resultCount.cloudCounts = ret.data.ccoursesTotal;
            // 课程标签
            this.cloudCourseList.forEach((item) => {
              item.tagList = item.ccourseTags
                ? item.ccourseTags.split(",")
                : [];
            });

            // 教材
            this.bookList = ret.data.book;
            // this.bookPage.total = ret.data.bookTotal;
            this.resultCount.bookCounts = ret.data.bookTotal;
            this.bookPage.total = ret.data.bookTotal;

            // 慕课
            this.moocList = ret.data.openCcourse;
            this.resultCount.moocCounts = ret.data.openCcourseTotal;
            this.moocPage.total = ret.data.openCcourseTotal;
          }
        });
    },
  },
  mounted() {
    this.hotWords = this.$store.state.user.keywords;
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    window.addEventListener("scroll", this.getHeight);
    this.getRecommendList();
    if (this.$route.query.hotWords) {
      this.hotWords = this.$route.query.hotWords;
      this.searchAll();
    } else {
      this.searchAll();
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.getHeight);
  },
};
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #f7f7f7;
}
.course-search {
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
    margin-top: 60px;
    min-height: 800px;
    overflow: hidden;
    .ke-tabs {
      width: 1100px;
      min-height: 1218px;
      background-color: #fff;
      padding: 35px;
      float: left;
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
          background: transparent;
        }
        /deep/ .el-tabs__content {
          // min-height: 400px;
          display: flex;
          // align-items: center;
          // justify-content: center;
          .res-list {
            // background-color: red;
            .yun-item {
              width: 1000px;
              height: 200px;
              cursor: pointer;
              border-top: 1px solid #ddd;
              padding: 30px 10px;
              display: flex;
              &:hover {
                color: #049efb;
              }
              .yun-img {
                margin-right: 20px;
                img {
                  width: 250px;
                  height: 140px;
                }
              }
              .yun-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .yun-name {
                  font-size: 20px;
                  font-weight: bold;
                }
                .yun-teacher {
                  color: #666;
                  font-size: 14px;
                }
                .yun-intro {
                  color: #666;
                  font-size: 14px;
                }
                .yun-num {
                  display: flex;
                  justify-content: space-between;
                  .inter-num {
                    color: #666;
                    font-size: 14px;
                  }
                  .price {
                    font-size: 20px;
                    color: #fea21e;
                  }
                }
              }
            }
            .mooc-item {
              width: 1000px;
              height: 200px;
              cursor: pointer;
              border-top: 1px solid #ddd;
              padding: 30px 10px;
              display: flex;
              &:hover {
                color: #049efb;
              }
              .yun-img {
                margin-right: 20px;
                img {
                  width: 250px;
                  height: 140px;
                }
              }
              .yun-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .yun-name {
                  font-size: 20px;
                  font-weight: bold;
                }
                .yun-teacher {
                  color: #666;
                  font-size: 14px;
                }
                .yun-intro {
                  color: #666;
                  font-size: 14px;
                }
                .yun-num {
                  display: flex;
                  justify-content: space-between;
                  .inter-num {
                    color: #666;
                    font-size: 14px;
                  }
                  .price {
                    border-radius: 4px;
                    padding: 2px 4px;
                    font-family: STHeitiSC-Light;
                    font-size: 16px;
                    background-color: #10c4ee;
                    color: #fff;
                  }
                }
              }
            }
            .book-item {
              width: 1000px;
              height: 300px;
              cursor: pointer;
              border-top: 1px solid #ddd;
              padding: 30px 10px;
              display: flex;
              &:hover {
                color: #049efb;
              }
              .yun-img {
                border: 1px solid #ddd;
                margin-right: 30px;
                img {
                  width: 160px;
                  height: 237px;
                }
              }
              .yun-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .yun-name {
                  font-size: 20px;
                  font-weight: bold;
                }
                .yun-teacher {
                  color: #666;
                  font-size: 16px;
                }
                .yun-intro {
                  color: #666;
                  font-size: 16px;
                }
                .yun-num {
                  display: flex;
                  justify-content: space-between;
                  .inter-num {
                    color: #666;
                    font-size: 16px;
                  }
                  .price {
                    border-radius: 4px;
                    padding: 2px 4px;
                    font-family: STHeitiSC-Light;
                    font-size: 16px;
                    border: 1px solid #fea21e;
                    color: #fea21e;
                  }
                }
              }
            }
            .ke-pager {
              display: flex;
              justify-content: center;
            }
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
                height: 140px;
                width: 260px;
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
}
</style>
