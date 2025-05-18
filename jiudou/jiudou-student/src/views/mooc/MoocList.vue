<template>
  <div class="my-course">
    <div class="my-course-content w">
      <div class="ke-tabs">
        <div class="search-tabs-container">
          <div class="my_course">
            <div class="my_course_top">
              <span class="title">所有慕课</span>
              <div class="search-container">
                <el-input
                  placeholder="请输入慕课名称"
                  class="input-with-select"
                  @keyup.enter.native="searchMooc"
                  v-model.trim="keyWord"
                >
                </el-input>
                <el-button
                  icon="el-icon-search"
                  @click="searchMooc"
                ></el-button>
              </div>
            </div>
            <div v-if="moocList.length === 0" class="no-data">
              <img src="../../assets/img/empty.png" alt="" />
              <span>暂无慕课~</span>
            </div>
            <div v-else class="my_course-list">
              <!-- <div
                @click="toDetail(item)"
                class="yun-item"
                v-for="(item, index) in myCourseList"
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
                  </div>
                </div>
              </div> -->
              <div
                class="mooc-item"
                @click="goMoocDetail(item)"
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
                </div>
                <div class="yun-text">
                  <span class="yun-name">{{ item.name }}</span>
                  <span class="yun-teacher">老师:{{ item.teacherName }}</span>
                  <span class="yun-intro">{{ item.totalNum }}人已参加</span>
                  <div class="yun-num">
                    <span class="inter-num"
                      >{{ item.interestedNum }}人感兴趣</span
                    >
                    <span class="price" v-if="item.status == 4">开课中</span>
                    <span class="price" v-if="item.status == 0">未发布</span>
                    <span class="price" v-if="item.status == 2">已结课</span>
                  </div>
                </div>
              </div>
              <div class="ke-pager">
                <el-pagination
                  background
                  :hide-on-single-page="true"
                  layout="prev, pager, next"
                  :page-size="moocPage.pageSize"
                  :current-page.sync="moocPage.page"
                  @current-change="getMoocList"
                  :total="moocPage.total"
                ></el-pagination>
              </div>
            </div>
          </div>
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

export default {
  name: "mooc-list",
  components: {},
  data() {
    return {
      scrollTop: 0,
      moocList: [],
      recommendList: [],
      keyWord: "",
      moocPage: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  methods: {
    searchMooc() {
      this.moocPage.page = 1;
      this.getMoocList();
    },
    goMoocDetail(item) {
      this.$router.push({
        path: "/mooc-detail",
        query: {
          moocId: item.id,
        },
      });
    },
    toDetail(item) {
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      });
    },
    // 慕课
    getMoocList() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openCcourse/listCcourse`,
          data: {
            keyword: this.keyWord,
            type: 1,
            pageNo: this.moocPage.page,
            pageSize: this.moocPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.moocList = ret.data.records;
            this.moocPage.total = ret.data.total;
            // 课程标签
            this.moocList.forEach((item) => {
              item.tagList = item.tags ? item.tags.split(",") : [];
            });
          }
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
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.getMoocList();
    this.getRecommendList();
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
.my-course {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;

  .my-course-content {
    margin-top: 100px;
    min-height: 500px;
    overflow: hidden;
    background-color: #f7f7f7;

    .ke-tabs {
      width: 1100px;
      min-height: 800px;
      background-color: #fff;
      padding: 35px;
      float: left;
      .search-tabs-container {
        .my_course {
          .my_course_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 8px;
            .title {
              font-size: 27px;
              font-weight: bold;
              border-left: 4px solid #049efb;
              padding-left: 10px;
              line-height: 32px;
              margin-bottom: 20px;
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

          .no-data {
            width: 1100px;
            height: 580px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .my_course-list {
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
                width: 250px;
                margin-right: 20px;
                img {
                  width: 100%;
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
            .ke-pager {
              display: flex;
              justify-content: center;
            }
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
