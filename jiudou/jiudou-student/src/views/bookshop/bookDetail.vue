<template>
  <div class="cloud-book">
    <div class="cloud-book-content w">
      <div class="content-left">
        <div class="book-info">
          <div class="basic-info">基本信息</div>
          <div class="basic-content">
            <div class="basic-content-left">
              <img :src="bookInfo.cover_pic" alt="" />
            </div>
            <div class="basic-content-right">
              <div class="book-name">{{ bookInfo.tname }}</div>
              <div class="book-publish">出版社：{{ bookInfo.pubName }}</div>
              <div class="book-publish">出版时间：{{ bookInfo.pub_date }}</div>
              <div class="book-author">作者：{{ bookInfo.author }}</div>
              <div class="book-num">ISBN：{{ bookInfo.tb_num }}</div>
              <div class="book-price">定价：￥{{ bookInfo.price }}</div>
              <el-button @click="goBuy(bookInfo.bookStoreUrl)">购买</el-button>
            </div>
          </div>
          <div class="basic-show">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="简介" name="first">
                <div
                  v-if="bookInfo.book_intro"
                  v-html="bookInfo.book_intro"
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
        <div class="content-right-title">教材推荐</div>
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
              <div class="item-right-intro">
                {{ item.verifiedCount }}人已验证
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边二维码区域 -->
    <StuSideAd />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
// import * as echarts from "echarts";
import StuSideAd from "@/components/Stu-SideAd.vue";

export default {
  name: "book-detail",
  components: {
    StuSideAd,
  },
  data() {
    return {
      textBookId: this.$route.query.textbookId,
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
    };
  },
  methods: {
    init() {
      var chartDom = document.getElementById("main");
      // eslint-disable-next-line no-undef
      var myChart = echarts.init(chartDom);
      myChart.setOption(this.option);
    },
    toBookDetail(item) {
      let { textbookId } = item;
      this.$router.push({
        path: "/cloudBook-detail",
        query: {
          textbookId,
        },
      });
      window.location.reload();
    },
    getBookDetail() {
      axios
        .request({
          method: "post",
          url: `/book/bookApp/detail`,
          data: {
            textBookId: this.textBookId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookInfo = ret.data;
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
            this.cloudBookList = Object.freeze(ret.data.books);
            this.bookPage.total = ret.data.total;
          }
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    goBuy(url) {
      window.open(url, "_blank");
    },
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.getBookList();

    this.getBookDetail();
    // this.init();

    console.log(process.env.NODE_ENV);
  },
};
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #f7f7f7;
}
.cloud-book {
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
            .el-button {
              position: absolute;
              right: 0;
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
}
</style>
