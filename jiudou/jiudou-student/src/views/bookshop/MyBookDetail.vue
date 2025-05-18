<template>
  <div class="my-book-detail">
    <div class="course-search-content w">
      <div class="book-info">
        <div class="basic-info">基本信息</div>
        <div class="basic-content">
          <div class="basic-content-left">
            <img :src="bookInfo.cover_pic" alt="" />
          </div>
          <div class="basic-content-right">
            <div class="book-name">{{ bookInfo.tname }}</div>
            <div class="book-publish">出版社：{{ bookInfo.pubName }}</div>
            <div class="book-author">作者：{{ bookInfo.author }}</div>
            <div class="book-num">ISBN：{{ bookInfo.tb_num }}</div>
          </div>
        </div>
        <div class="basic-show">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="简介" name="first">
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
            </el-tab-pane> -->
            <el-tab-pane
              :key="index"
              @click="onClick(item)"
              v-for="(item, index) in bookInfo.catalogInfo"
              :label="item.catelogContent"
              :name="String(index)"
            >
              <div>
                <div
                  v-if="resourceList.length == 0"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    margin: 0 330px;
                  "
                >
                  <img src="../../assets/img/empty.png" alt="" />
                  <p>暂无资源~</p>
                </div>
                <div v-else class="resource">
                  <div
                    v-for="(item, index) in resourceList"
                    :key="index"
                    @click="toViewRes(item)"
                    class="resource-item"
                  >
                    <div class="resource-img">
                      <img
                        v-if="item.design_pic"
                        :src="item.design_pic"
                        alt=""
                      />
                      <img
                        v-else
                        src="../../assets/img/ccoursePlacehoder.png"
                        alt=""
                      />
                    </div>
                    <div class="resource-name">
                      <span :title="item.matchPicName">{{
                        item.matchPicName
                      }}</span>
                    </div>
                    <div class="resource-page">
                      <div>第{{ item.res_page }}页</div>
                      <div>
                        <i class="el-icon-view"></i>
                        <span>{{ item.read_num }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 预览资源 -->
      <el-dialog
        top="8vh"
        :visible.sync="isViewResShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :fullscreen="isFull"
        :close-on-click-modal="false"
        :before-close="handleCloseViewDialog"
        width="800px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>资源预览</div>
            <button
              v-if="currentRes.res_type !== 3"
              @click="isFull = !isFull"
              class="fullBtn"
            >
              <i class="el-icon-full-screen"></i>
            </button>
          </div>
        </template>
        <viewRes
          :isFull="isFull"
          :data="currentRes"
          :style="currentRes.res_type == 2 ? 'height:350px' : ''"
        ></viewRes>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
import viewRes from "@/components/Stu-ViewRes.vue";

export default {
  name: "myBook-detail",
  components: {
    viewRes,
  },
  data() {
    return {
      isFull: false,
      isViewResShow: false,
      currentRes: {},
      textbookId: this.$route.params.textbookId,
      bookInfo: {
        cover_pic: "",
        pubName: "",
        tname: "",
        author: "",
        tb_num: "",
        catalogInfo: [],
      },
      currentCid: "",
      currentBook: null,
      activeName: "0",
      resourcePage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      resourceList: [],
      scrollTop: 0,
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, event) {
      let index = tab.name;
      this.currentCid = this.bookInfo.catalogInfo[index].catalogId;
      this.getBookResourceList();
      // console.log(tab, event);
    },
    // 获取教材资源
    getBookResourceList() {
      axios
        .request({
          method: "post",
          url: `/resource/resource/resourcesV2`,
          data: {
            textbookId: this.textbookId,
            page: this.resourcePage.page,
            pageSize: this.resourcePage.pageSize,
            c_id: this.currentCid,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.resourcePage.total = ret.data.total;
            this.resourceList = ret.data;
          }
        });
    },
    toViewRes(item) {
      let { resourceId, res_type } = item;
      if (res_type === 9) {
        // 查看pdf资源
        axios
          .request({
            method: "post",
            responseType: "blob",
            url: `/resource/v4/commonRL/detailById`,
            data: {
              rlrResourceId: resourceId,
            },
          })
          .then((res) => {
            console.log(res);
            let blob = new Blob([res.data]);
            let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
            window.open("../pdf/web/viewer.html?file=" + fileURL);
          });
        return;
      }
      this.currentRes = item;
      this.isViewResShow = true;

      // 处理滚动穿透
      let m = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", m, { passive: false }); //禁止页面滑动
    },
    handleCloseViewDialog() {
      this.currentRes = {};
      this.isViewResShow = false;
      this.isFull = false;

      // 恢复滚动
      let m = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", m, { passive: true });
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
  },
  mounted() {
    window.addEventListener("scroll", this.getHeight);
    this.currentBook = this.$store.state.book.book;
    this.bookInfo.cover_pic = this.currentBook.cover_pic;
    this.bookInfo.tname = this.currentBook.tname;
    this.bookInfo.author = this.currentBook.author;
    this.bookInfo.tb_num = this.currentBook.tb_num;
    this.bookInfo.catalogInfo = this.currentBook.catalogInfo;
    this.bookInfo.pubName = this.currentBook.publishHouse.pubName;
    this.currentCid = this.bookInfo.catalogInfo[0].catalogId;
    this.getBookResourceList();
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
  background-color: #fff;
}
.prevent_touch_move_box {
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}
.my-book-detail {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;

  .fullBtn {
    position: absolute;
    top: 20px;
    right: 60px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .course-search-content {
    /deep/ .el-dialog__wrapper {
      z-index: 99999 !important;
    }
    margin-top: 100px;
    margin-bottom: 10px;
    min-height: 500px;
    padding-left: 50px;
    padding-top: 20px;
    padding-right: 50px;
    .book-info {
      border-bottom: 1px solid #dcdfe6;
      .basic-info {
        font-size: 27px;
        font-weight: bold;
        border-left: 4px solid #049efb;
        padding-left: 10px;
        line-height: 32px;
        margin-bottom: 30px;
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
        border-top: 1px solid #dcdfe6;
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
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          .resource {
            width: 1320px;
            min-height: 600px;
            overflow: hidden;

            .resource-item {
              box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
              border-radius: 10px;
              float: left;
              width: 310px;
              height: 260px;
              background-color: #f7f7f7;
              margin-right: 20px;
              margin-bottom: 20px;
              display: flex;
              flex-direction: column;
              &:hover {
                cursor: pointer;
              }
              .resource-img {
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: center;
                height: 160px;

                img {
                  width: 290px;
                  height: 160px;
                  vertical-align: -webkit-baseline-middle;
                }
              }
              .resource-name {
                width: 100%;
                min-height: 50px;
                padding: 5px 10px;
                color: #333;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; /* 这里是超出几行省略 */
                overflow: hidden;
                span {
                  font-size: 16px;
                }
              }
              .resource-page {
                border-top: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                align-items: center;
                height: 40px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
