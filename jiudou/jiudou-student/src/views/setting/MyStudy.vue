<template>
  <div class="my-study">
    <div class="course-search-content w">
      <div class="ke-tabs">
        <!-- <div class="course-info">
          <div class="course-info-left">
            <img v-if="moocInfo.cover" :src="moocInfo.cover" alt="课程封面" />
            <img v-else src="../../assets/img/ccoursePlacehoder.png" alt="" />
          </div>
          <div class="course-info-right">
            <div class="course-info-right-container">
              <span class="course-name">{{ moocInfo.name }}</span>
              <span class="course-teacher"
                >老师：{{ moocInfo.teacherName }}</span
              >
              <div class="course-tags">
                <span
                  style="
                    color: #10c4ee;
                    padding: 0 2px;
                    margin-right: 10px;
                    border: 1px solid #10c4ee;
                    border-radius: 2px;
                  "
                  v-for="(k, idx) in moocInfo.tagList"
                  :key="idx"
                  >{{ k }}</span
                >
              </div>
              <div class="interest-num">
                {{ moocInfo.interestedNum }}人感兴趣
              </div>
              <el-button v-if="moocInfo.isMasterhead == 0">立即参加</el-button>
            </div>
          </div>
        </div> -->
        <div class="search-tabs-container">
          <el-tabs @tab-click="handleClick" v-model="activeName">
            <el-tab-pane label="我的云课" name="first">
              <div class="course-intro">
                <div v-if="cCourseList.length == 0" class="no-data">
                  <img src="../../assets/img/empty.png" alt="" />
                  <span>暂无云课~</span>
                </div>
                <div v-else class="course-list">
                  <div
                    @click="toDetail(item)"
                    class="course-item"
                    :key="index"
                    v-for="(item, index) in cCourseList"
                  >
                    <div>
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
                    <div class="course-info">
                      <div class="c-name">{{ item.ccourseName }}</div>
                      <div class="c-teacher">
                        老师:{{ item.ccourseTeacherName }}
                      </div>
                      <div class="pro">
                        <progress max="100" :value="item.pro"></progress>
                        <span class="percent">{{ item.pro }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`我的慕课`" name="second">
              <div class="course-chapter">
                <div v-if="moocList.length == 0" class="no-data">
                  <img src="../../assets/img/empty.png" alt="" />
                  <span>暂无慕课~</span>
                </div>
                <div v-else class="course-list">
                  <div
                    @click="toMoocDetail(item)"
                    class="course-item"
                    :key="index"
                    v-for="(item, index) in moocList"
                  >
                    <div>
                      <img v-if="item.cover" :src="item.cover" alt="" />
                      <img
                        v-else
                        src="../../assets/img/ccoursePlacehoder.png"
                        alt=""
                      />
                    </div>
                    <div class="course-info">
                      <div>{{ item.name }}</div>
                      <div>老师:{{ item.teacherName }}</div>
                      <div class="pro">
                        <progress max="100" :value="item.pro"></progress>
                        <span class="percent">{{ item.pro }}%</span>
                      </div>
                    </div>
                  </div>
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
import axios from "@/libs/api.request"
// import StuMoocCatalog from "@/components/Stu-MoocCatalog.vue";

export default {
  name: "my-study",
  components: {
    // StuMoocCatalog,
  },
  data() {
    return {
      recommendList: [],
      activeName: "first",
      scrollTop: 0,
      moocList: [],
      cCourseList: [],
      cCoursePage: {
        page: 1,
        pageSize: 999,
        total: 0,
      },
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, event) {
      if (tab.name == "second") {
        this.getMyMoocList()
      }
    },
    toDetail(item) {
      this.$store.commit("setClassId", "")
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      })
    },
    toMoocDetail(item) {
      this.$router.push({
        path: "/mooc-detail",
        query: {
          moocId: item.id,
        },
      })
    },
    getMyCCourseList() {
      axios
        .request({
          method: "post",
          url: `/member/ccourse`,
          data: {
            pageNo: 1,
            pageSize: 999,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.cCourseList = ret.data.cCourse
            this.cCourseList.forEach((item) => {
              item.pro = Math.floor(
                (item.cUserDoneNum / item.ccourseTotalNum) * 100
              )
            })
          }
        })
    },
    getMyMoocList() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openCcourseDone/myDone`,
          data: {
            pageNo: 1,
            pageSize: 999,
          },
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.moocList = ret.data.moc
            this.moocList.forEach((item) => {
              item.pro = isNaN(
                Math.floor((item.studyTime / item.totalNum) * 100)
              )
                ? 0
                : Math.floor((item.studyTime / item.totalNum) * 100)
            })
          }
        })
    },
    getRecommendList() {
      axios
        .request({
          method: "post",
          url: `/cloudCourse/recommend`,
        })
        .then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.recommendList = ret.data.selected
          }
        })
    },
  },
  mounted() {
    document.documentElement.scrollTop = document.body.scrollTop = 0
    this.getMyCCourseList()
    this.getRecommendList()
  },
}
</script>
<style lang="less" scoped>
.w {
  width: 1420px;
  margin: 0 auto;
  background-color: #fff;
}

progress {
  width: 160px;
  height: 7px;
  border-radius: 3px;
  background-color: #10c4ee;
}
progress::-webkit-progress-bar {
  background-color: #ddd;
}
progress::-webkit-progress-value {
  background-color: #10c4ee;
}

.my-study {
  min-height: 657px;
  overflow: hidden;
  background-color: #f7f7f7;

  .course-search-content {
    margin-top: 100px;
    min-height: 1224px;
    background-color: #f7f7f7;
    overflow: hidden;
    .ke-tabs {
      width: 1100px;
      min-height: 800px;
      background-color: #fff;
      padding: 20px;
      float: left;
      .course-info {
        width: 100%;
        height: 200px;
        background-color: #fff;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .course-info-left {
          border: 1px solid #ddd;
          width: 280px;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            vertical-align: middle;
          }
        }
        .course-info-right {
          flex: 1;
          height: 100%;
          padding: 24px 20px;
          // background-color: red;
          .course-info-right-container {
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .course-name {
              font-size: 25px;
              font-weight: bold;
            }
            .course-teacher {
              color: #666;
              font-size: 18px;
            }
            .course-tags {
            }
            .interest-num {
              color: #666;
              font-size: 18px;
            }
            .el-button {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 118px;
              height: 48px;
              border-radius: 30px;
              background: linear-gradient(-45deg, #03d3f2, #0491fd);
              color: #fff;
            }
          }
        }
      }
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
          // background: transparent;
          background: #10c4ee;
        }
        /deep/ .el-tabs__content {
          display: flex;
          .course-list {
            overflow: hidden;
            .course-item {
              float: left;
              width: 290px;
              height: 260px;
              background-color: #f7f7f7;
              margin-right: 60px;
              margin-bottom: 60px;
              display: flex;
              flex-direction: column;
              &:hover {
                cursor: pointer;
              }
              img {
                width: 290px;
                height: 158px;
              }
              .course-info {
                padding: 2px;
                background-color: #f7f7f7;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                .c-name {
                  color: #333;
                  font-weight: bold;
                }
                .c-teacher {
                  color: #666;
                  font-size: 14px;
                }
                .pro {
                  font-size: 14px;
                  display: flex;
                  align-items: center;
                  .percent {
                    margin-left: 5px;
                  }
                }
              }
            }
          }
          // #pane-second {
          //   width: 100%;
          // }
          // .course-chapter {
          //   width: 100%;
          // }
          .no-data {
            width: 1100px;
            height: 580px;
            display: flex;
            flex-direction: column;
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
                width: 260px;
                height: 140px;
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
  .course-name {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .but-pay {
    background: #03d3f2;
    width: 50%;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0;
  }
  .pay-type {
    margin-bottom: 20px;
    ul li {
      width: 160px;
      height: 60px;
      line-height: 60px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      //   transition: .1s;
      span {
        width: 26px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
      .pay-type-icon1 {
        background: url("../../assets/img/zfb.png") no-repeat #fff;
        background-size: 100%;
      }
      .pay-type-icon2 {
        background: url("../../assets/img/wx.png") no-repeat #fff;
        background-size: 100%;
      }
    }
    .active {
      border: 2px #03d3f2 solid;
    }
  }
  .money-pay-num {
    color: #f0742b;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  .money-pay-text {
    color: #666;
    font-size: 12px;
    // margin-top: 10px;
    text-align: center;
    .pay-text {
      display: inline-block;
      text-align: left;
      vertical-align: middle;
    }
    img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
    }
  }
  .but-pay {
    background: #03d3f2;
    width: 50%;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 0;
  }
  .qrcode {
    display: flex;
    flex-direction: column;
    border: 1px #d1d1d1 solid;
    padding-bottom: 10px;
    margin-top: 5px;
    position: relative;
    .zfb-img {
      position: absolute;
      right: -161px;
      top: -70px;
    }
  }
  .qrcode-t {
    color: #333;
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
