<template>
  <div class="home">
    <!-- <div class="stu-header">
      <StuHeader></StuHeader>
    </div> -->
    <div class="box">
      <div class="lun-bo w">
        <div class="block">
          <el-carousel height="200px">
            <el-carousel-item v-for="(item, idx) in picList" :key="idx">
              <img @click="clickImg(item)" :src="item.bannerCover" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="yun-ke w">
        <div class="ke-title">
          <div>
            <span id="yuk" class="ke-border">云课 </span>
          </div>
          <div>
            <el-checkbox-group @change="onChange" v-model="checkList">
              <!-- <el-checkbox label="最新"></el-checkbox> -->
              <!-- <el-checkbox label="免费"></el-checkbox> -->
              <el-checkbox :value="1" label="1">个人提升</el-checkbox>
              <el-checkbox :value="3" label="3">校园金课</el-checkbox>
              <el-checkbox :value="2" label="2">实战课</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="yun-ke-list">
          <div
            class="yun-ke-item"
            :key="index"
            @click="goCloudCourseDetail(item)"
            v-for="(item, index) in cloudCourseList"
          >
            <div>
              <img v-if="item.ccourseCover" :src="item.ccourseCover" alt="" />
              <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
            </div>
            <div class="yun-ke-item-info">
              <span class="ke-name">{{ item.ccourseName }}</span>
              <span class="ke-teacher">老师:{{ item.ccourseTeacherName }}</span>
              <span class="ke-tag">
                <span
                  style="
                    color: #10c4ee;
                    padding: 0 2px;
                    margin-right: 10px;
                    border: 1px solid #10c4ee;
                    border-radius: 2px;
                  "
                  v-for="(k, idx) in item.tagList"
                  :key="idx"
                  >{{ k }}</span
                >
              </span>
              <div class="yun-ke-item-price">
                <span class="interest"
                  >{{ item.ccourseInterestedNum }}人感兴趣</span
                >
                <span class="price" v-if="item.ccourseFeeType == 0">免费</span>
                <span class="price" v-else>¥{{ item.ccoursePrice / 100 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="yun-ke-pager">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="cloudPage.pageSize"
            :current-page.sync="cloudPage.page"
            @current-change="getCloudCourseList(checkList.join(','))"
            :total="cloudPage.total"
          >
          </el-pagination>
        </div>
        <!-- <div  class="yun-ke-noData"></div> -->
      </div>
      <div class="mu-ke w">
        <div class="ke-title">
          <div>
            <span id="mk" class="ke-border">慕课 </span>
          </div>
          <div @click="goMore" class="more">
            更多<i class="el-icon-d-arrow-right"></i>
          </div>
        </div>
        <div class="mu-ke-list">
          <div
            @click="goMoocDetail(item)"
            class="mu-ke-item"
            :key="index"
            v-for="(item, index) in moocList"
          >
            <div>
              <img v-if="item.cover" :src="item.cover" alt="" />
              <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
            </div>
            <div class="mu-ke-item-info">
              <span class="ke-name">{{ item.name }}</span>
              <span class="ke-teacher">老师:{{ item.teacherName }}</span>
              <span class="ke-tag">
                <span
                  style="
                    color: #10c4ee;
                    padding: 0 2px;
                    margin-right: 10px;
                    border: 1px solid #10c4ee;
                    border-radius: 2px;
                  "
                  v-for="(k, idx) in item.tagList"
                  :key="idx"
                  >{{ k }}</span
                >
              </span>
              <el-divider></el-divider>
              <div class="mu-ke-item-price">
                <span class="interest"
                  >{{ item.interestedNum ? item.interestedNum : 0 }}人参加</span
                >
                <span class="price" v-if="item.status == 4">开课中</span>
                <span class="price" v-if="item.status == 2">已结课</span>
                <!-- <span class="price" v-else>¥{{ item.ccoursePrice / 100 }}</span> -->
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="mu-ke-noData"></div> -->
      </div>
    </div>
    <div class="cloud-books w">
      <div class="cloud-title">
        <div>
          <span id="sc" class="cloud-border">精选书城 </span>
        </div>
      </div>
      <div class="cloud-book-list">
        <div
          @click="goCloudBookDetail(item)"
          v-for="(item, index) in cloudBookList"
          :key="index"
          class="cloud-book-item"
        >
          <div class="book-pic">
            <img v-if="item.coverPic" :src="item.coverPic" alt="" />
            <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
          </div>
          <div class="book-info">
            <div class="book-content">
              <span class="book-name">{{ item.tname }}</span>
              <span class="book-author">作者:{{ item.author }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="yun-ke-pager">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="bookPage.pageSize"
          :current-page.sync="bookPage.page"
          @current-change="getBookList"
          :total="bookPage.total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="cloud-books w">
      <div class="cloud-title">
        <div>
          <span id="digital" class="cloud-border">数字教材 </span>
        </div>
      </div>
      <div class="cloud-book-list">
        <div
          @click="goDigitalBookDetail(item)"
          v-for="(item, index) in digitalBookList"
          :key="index"
          class="cloud-book-item"
        >
          <div class="book-pic">
            <img v-if="item.coverPic" :src="item.coverPic" alt="" />
            <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
          </div>
          <div class="book-info">
            <div class="book-content">
              <span class="book-name">{{ item.tname }}</span>
              <div style="display: flex; justify-content: space-between">
                <span class="book-author">作者:{{ item.author }}</span>
                <span
                  v-if="item.price > 0"
                  class="book-author"
                  style="color: #fea21e; font-size: 16px"
                  >￥{{ item.price / 100 }}</span
                >
                <span
                  v-if="item.price == 0"
                  class="book-author"
                  style="color: #fea21e; font-size: 16px"
                  >免费</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="yun-ke-pager">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="digitalPage.pageSize"
          :current-page.sync="digitalPage.page"
          @current-change="getDigitalBookList"
          :total="digitalPage.total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 侧边二维码区域 -->
    <StuSideAd />

    <!-- <StuFooter></StuFooter> -->
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */

// @ is an alias to /src
import axios from "@/libs/api.request"
import StuSideAd from "@/components/Stu-SideAd.vue"
import { getStuToken } from "@/libs/cookieUtil"

export default {
  name: "HomeView",
  components: {
    StuSideAd,
  },
  data() {
    return {
      picList: [],
      checkList: [],
      cloudCourseList: [],
      moocList: [],
      cloudBookList: [],
      digitalBookList: [],
      cloudPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      bookPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      digitalPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    }
  },
  methods: {
    isUrl(url) {
      return /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(
        url
      )
    },
    clickImg(item) {
      if (this.isUrl(item.bannerUrl)) {
        window.open(item.bannerUrl, "_blank")
      } else {
        this.$router.push({
          name: "cloudDetail",
          params: {
            cCourseId: item.bannerUrl,
          },
        })
      }
    },
    onChange(val) {
      this.cloudPage.page = 1
      this.getCloudCourseList(val.join(","))
    },
    // 获取轮播图
    getPicList() {
      axios
        .request({
          method: "post",
          url: `/platform/indexStudent`,
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.picList = ret.data
          }
        })
    },
    // 云课
    getCloudCourseList(type) {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/listStudent`,
          data: {
            type,
            page: this.cloudPage.page,
            pageSize: this.cloudPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.cloudCourseList = ret.data.ccourses
            this.cloudPage.total = ret.data.total
            // 课程标签
            this.cloudCourseList.forEach((item) => {
              item.tagList = item.ccourseTags ? item.ccourseTags.split(",") : []
            })
          }
        })
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
          let ret = res.data
          if (ret.code === 200) {
            this.moocList = ret.data.records
            // 课程标签
            this.moocList.forEach((item) => {
              item.tagList = item.tags ? item.tags.split(",") : []
            })
          }
        })
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
          let ret = res.data
          if (ret.code === 200) {
            this.cloudBookList = ret.data.books
            this.bookPage.total = ret.data.total
          }
        })
    },
    getDigitalBookList() {
      // ${process.env.VUE_APP_BASE_LIU}
      axios
        .request({
          method: "post",
          url: `/ebook/digitalBook/index/queryPage`,
          data: {
            pageNo: this.digitalPage.page,
            pageSize: this.digitalPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.digitalBookList = ret.data.records
            this.digitalPage.total = ret.data.total
          }
        })
    },
    goCloudBookDetail(item) {
      let { textbookId } = item
      this.$router.push({
        path: "/cloudBook-detail",
        query: {
          textbookId,
        },
      })
    },
    goDigitalBookDetail(item) {
      let { id } = item
      this.$router.push({
        path: "/digitalBook-detail",
        query: {
          id,
        },
      })
    },
    goCloudCourseDetail(item) {
      this.$store.commit("setClassId", "")
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      })
    },
    goMoocDetail(item) {
      this.$router.push({
        path: "/mooc-detail",
        query: {
          moocId: item.id,
        },
      })
    },
    goMore() {
      this.$router.push({
        path: "/mooc-list",
      })
    },
  },
  mounted() {
    this.getPicList()
    this.getCloudCourseList("")
    this.getMoocList()
    this.getBookList()
    this.getDigitalBookList()
    let token = getStuToken()
    this.$store.commit("setStuToken", token)

    // let key = Math.random().toString().substr(2, 8);
  },
}
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
}
.home {
  background-color: #f7f7f7;
  position: relative;
  overflow: hidden;
  .stu-header {
    width: 100%;
    position: fixed;
    z-index: 99999;
  }
  .box {
    margin-top: 100px;
    width: 100%;
    .lun-bo {
      padding: 0 10px;
      height: 200px;
      width: 100vw;
      max-width: 1420px;
      margin-bottom: 30px;

      .el-carousel__item {
        overflow: hidden;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        justify-content: center;
      }
      .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        // background: url("../../assets/img/lunbo.png") no-repeat;
      }

      .el-carousel__item:nth-child(2n + 1) {
        // background-color: #d3dce6;
        // background: url("../../assets/img/lunbo.png") no-repeat;
      }
    }
    .yun-ke {
      // box-shadow: 0 2px 4px #00000014;
      // height: 400px;
      width: 100vw;
      max-width: 1420px;
      // background-color: blue;
      .ke-title {
        padding: 0 10px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        .ke-border {
          font-size: 22px;
          font-weight: bold;
          color: #333333;
          border-left: 3px solid #049efb;

          padding-left: 10px;
          font-weight: bold;
        }
      }
      .yun-ke-list {
        overflow: hidden;
        padding: 0 10px;
        .yun-ke-item:nth-child(5n) {
          margin-right: 0;
        }
        .yun-ke-item {
          &:hover {
            cursor: pointer;
            box-shadow: 5px 5px 5px #cdcfcf;
            transform: translateY(-10px);
          }
          width: 250px;
          height: 290px;
          float: left;
          margin-right: 36px;
          background-color: #fff;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
          img {
            width: 100%;
            height: 136px;
          }
          .yun-ke-item-info {
            padding: 0 10px 10px 10px;
            display: flex;
            flex-direction: column;
            span {
              margin-bottom: 6px;
            }
            .ke-name {
              font-size: 18px;
              color: #333;
              font-weight: bold;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              height: 48px;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2; /* 这里是超出几行省略 */
              overflow: hidden;
            }
            .ke-teacher {
              font-size: 14px;
              color: #666;
            }
            .ke-tag {
              height: 20px;
              font-size: 14px;
            }
            .yun-ke-item-price {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-top: 1px solid #dcdfe6;
              font-size: 14px;
              .interest {
                color: #333;
              }
              .price {
                font-family: STHeitiSC-Light;
                font-size: 16px;
                color: #fea21e;
              }
            }
          }
        }
      }
      .yun-ke-pager {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
      .yun-ke-noData {
        height: 400px;
      }
    }
    .mu-ke {
      // height: 400px;
      width: 100vw;
      max-width: 1420px;
      // background-color: blue;
      .ke-title {
        padding: 0 10px;

        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        .ke-border {
          font-size: 22px;
          font-weight: bold;
          color: #333333;
          border-left: 3px solid #049efb;

          padding-left: 10px;
          font-weight: bold;
        }
        .more {
          &:hover {
            cursor: pointer;
            color: #049efb;
          }
        }
      }
      .mu-ke-list {
        overflow: hidden;

        padding: 0 10px;

        .mu-ke-item:nth-last-child(1) {
          margin-right: 0;
        }
        .mu-ke-item {
          float: left;
          margin-right: 37px;

          &:hover {
            cursor: pointer;
            box-shadow: 5px 5px 5px #cdcfcf;
            transform: translateY(-10px);
          }
          width: 250px;
          height: 290px;
          background-color: #fff;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
          img {
            width: 100%;
            &:hover {
              transform: scale(1.1);
              overflow: hidden;
            }
          }
          .mu-ke-item-info {
            padding: 0 10px 10px 10px;
            display: flex;
            flex-direction: column;
            span {
              margin-bottom: 6px;
            }
            .ke-name {
              font-size: 18px;
              color: #333;
              font-weight: bold;

              word-break: break-all;

              text-overflow: ellipsis;

              display: -webkit-box;
              height: 48px;

              -webkit-box-orient: vertical;

              -webkit-line-clamp: 2; /* 这里是超出几行省略 */

              overflow: hidden;
            }
            .ke-teacher {
              font-size: 14px;
              color: #666;
            }
            .ke-tag {
              font-size: 14px;
            }
            .el-divider--horizontal {
              margin: 4px 0;
            }
            .mu-ke-item-price {
              display: flex;
              align-items: center;
              justify-content: space-between;
              // border-top: 1px solid #ddd;
              font-size: 14px;
              .interest {
                color: #333;
              }
              .price {
                border-radius: 4px;
                padding: 2px 4px;
                font-family: STHeitiSC-Light;
                font-size: 14px;
                background-color: #10c4ee;
                color: #fff;
              }
            }
          }
        }
      }
      .mu-ke-noData {
        height: 400px;
      }
    }
  }

  // 云端书籍
  .cloud-books {
    width: 100vw;
    max-width: 1420px;
    // background-color: blue;
    .cloud-title {
      padding: 0 10px;

      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      .cloud-border {
        font-size: 22px;
        font-weight: bold;
        color: #333333;
        border-left: 3px solid #049efb;

        padding-left: 10px;
        font-weight: bold;
      }
    }
    .cloud-book-list {
      overflow: hidden;

      padding: 0 10px;

      .cloud-book-item:nth-child(5n) {
        margin-right: 0;
      }
      .cloud-book-item {
        float: left;
        margin-right: 50px;
        width: 240px;
        height: 281px;
        background-color: #fff;
        // box-shadow: 5px 5px 5px #cdcfcf;
        border-radius: 10px;

        overflow: hidden;
        margin-bottom: 24px;
        &:hover {
          cursor: pointer;
          box-shadow: 5px 5px 5px #cdcfcf;
          transform: translateY(-10px);
        }
        .book-pic {
          display: flex;
          justify-content: center;
          height: 200px;
          border-bottom: 1px solid #ddd;
        }
        .book-info {
          .book-content {
            width: 204px;
            margin: 0 auto;
            // background-color: red;
            display: flex;
            flex-direction: column;
            .book-name {
              font-size: 18px;
              font-weight: bold;
              word-break: break-all;

              text-overflow: ellipsis;

              display: block;
              height: 50px;

              -webkit-box-orient: vertical;

              -webkit-line-clamp: 2; /* 这里是超出几行省略 */

              overflow: hidden;
            }
            .book-author {
              font-size: 14px;
            }
          }
        }
      }
    }
    .yun-ke-pager {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
  }
}
</style>
