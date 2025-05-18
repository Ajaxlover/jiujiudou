<template>
  <div class="mooc-detail">
    <div class="course-search-content w">
      <div class="ke-tabs">
        <div class="course-info">
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
              <el-button @click="addCourse" v-if="moocInfo.isMasterhead == 0"
                >立即参加</el-button
              >
            </div>
          </div>
        </div>
        <div class="search-tabs-container">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="`课程目录`" name="second">
              <div class="course-chapter">
                <StuMoocCatalog
                  :isEnroll="String(moocInfo.isMasterhead)"
                  :courseId="moocCourseId"
                  :data="moocCatalogList"
                ></StuMoocCatalog>
              </div>
            </el-tab-pane>
            <el-tab-pane label="课程简介" name="first">
              <div class="course-intro">
                <div v-html="moocInfo.introText"></div>
                <!-- <iframe
                  style="width: 1060px; min-height: 3650px"
                  frameborder="0"
                  scrolling="no"
                  :src="courseInfo.ccourseIntro"
                ></iframe> -->
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`讨论区`" name="third">
              <div class="mooc-discuss-area">
                <section class="pay-type">
                  <ul>
                    <li
                      :key="index"
                      v-for="(item, index) in discussTypeList"
                      :class="discussType == item.id ? 'active' : ''"
                      @click="changeDiscussType(item)"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                  <img
                    @click="toCreate"
                    src="../../assets/add_img.png"
                    alt=""
                  />
                </section>
                <div v-if="discussList.length === 0" class="no-data">
                  <img src="../../assets/img/empty.png" alt="" />
                  <span>暂无话题~</span>
                </div>
                <div class="discuss-list">
                  <div
                    @click="goDiscussDetail(item)"
                    :key="index"
                    v-for="(item, index) in discussList"
                    class="discuss-item"
                  >
                    <div class="discuss-item-top">
                      <el-avatar
                        :size="40"
                        :src="
                          item.memberPic
                            ? item.memberPic
                            : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                        "
                      ></el-avatar>
                      <div class="discuss-item-top-r">
                        <div>{{ item.memberName }}</div>
                        <div>{{ formatToDateTime(item.createTime) }}</div>
                      </div>
                    </div>
                    <div class="discuss-content">
                      <div class="discuss-title">{{ item.title }}</div>
                      <div class="discuss-words">{{ item.content }}</div>
                      <div class="img-box">
                        <img
                          v-for="(i, index) in item.imgList"
                          :key="index"
                          v-image-preview
                          @click="preview"
                          :src="i"
                          alt=""
                        />
                      </div>
                    </div>
                    <div class="discuss-option">
                      <div @click.stop="toPrise(item)" class="zan">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          style="width: 16px"
                          class="icon like-icon"
                        >
                          <g fill="none" fill-rule="evenodd">
                            <path d="M0 0h20v20H0z" />
                            <path
                              :stroke="item.isLike == 1 ? '#10c4ee' : '#8A93A0'"
                              stroke-linejoin="round"
                              :fill="item.isLike == 1 ? '#10c4ee' : 'none'"
                              d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                            />
                          </g>
                        </svg>
                        <span style="color: #666" class="action-title">{{
                          item.likeNum
                        }}</span>
                      </div>
                      <div @click.stop="toDiscuss(item)" class="comment">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          style="width: 16px"
                        >
                          <g fill="none" fill-rule="evenodd">
                            <path d="M0 0h20v20H0z" />
                            <path
                              stroke="#8A93A0"
                              stroke-linejoin="round"
                              d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                            />
                          </g>
                        </svg>
                        <span style="color: #666" class="action-title"
                          >讨论</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style="
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                  "
                >
                  <el-pagination
                    background
                    :hide-on-single-page="true"
                    layout="prev, pager, next"
                    :page-size="discussPage.pageSize"
                    :current-page.sync="discussPage.page"
                    @current-change="getDisscussList"
                    :total="discussPage.total"
                  >
                  </el-pagination>
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

    <stuRemark
      v-if="isShow"
      :replyName="replyName"
      :remarkType="remarkType"
      @submit="submit"
      @close="handleClose"
      :isShow="isShow"
    ></stuRemark>

    <!-- 慕课讨论列表 -->
    <el-dialog
      v-if="isCommentShow"
      title="全部讨论"
      :visible.sync="isCommentShow"
      :before-close="closeComment"
      :close-on-click-modal="false"
      width="60%"
    >
      <div v-if="commentList.length === 0" class="no-data1">
        <img src="../../assets/img/empty.png" alt="" />
        <span>暂无讨论~</span>
      </div>
      <div v-else>
        <el-scrollbar wrap-style="overflow-x:hidden;">
          <div style="height: 65vh" class="comment-list">
            <div
              :key="index"
              v-for="(item, index) in commentList"
              class="discuss-item"
            >
              <div class="discuss-item-top">
                <el-avatar
                  :size="40"
                  :src="
                    item.memberPic
                      ? item.memberPic
                      : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                  "
                ></el-avatar>
                <div class="discuss-item-top-r">
                  <div>{{ item.memberName }}</div>
                  <div>{{ formatToDateTime(item.createTime) }}</div>
                </div>
              </div>
              <div class="discuss-content">
                <!-- <div class="discuss-title">{{ item.title }}</div> -->
                <div class="discuss-words">
                  <span style="color: #10c4ee" v-if="item.level >= 3"
                    >回复({{ item.replyMemberName }}):</span
                  >{{ item.content }}
                </div>
                <div class="img-box">
                  <img
                    v-for="(i, index) in item.imgList"
                    :key="index"
                    v-image-preview
                    @click="preview"
                    :src="i"
                    alt=""
                  />
                </div>
              </div>
              <div class="discuss-option">
                <div @click="toPriseComment(item)" class="zan">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    style="width: 16px"
                    class="icon like-icon"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path d="M0 0h20v20H0z" />
                      <path
                        :stroke="item.isLike == 1 ? '#10c4ee' : '#8A93A0'"
                        stroke-linejoin="round"
                        :fill="item.isLike == 1 ? '#10c4ee' : 'none'"
                        d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                      />
                    </g>
                  </svg>
                  <span style="color: #666" class="action-title">{{
                    item.likeNum
                  }}</span>
                </div>
                <div @click.stop="toReply(item)" class="comment">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    style="width: 16px"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path d="M0 0h20v20H0z" />
                      <path
                        stroke="#8A93A0"
                        stroke-linejoin="round"
                        d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                      />
                    </g>
                  </svg>
                  <span style="color: #666" class="action-title">回复</span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div style="display: flex; justify-content: center; margin-top: 10px">
        <el-pagination
          background
          :hide-on-single-page="true"
          layout="prev, pager, next"
          :page-size="commentPage.pageSize"
          :current-page.sync="commentPage.page"
          @current-change="getCommentList"
          :total="commentPage.total"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "@/libs/api.request";
// import StuMoocCatalog from "@/components/Stu-MoocCatalog.vue";
import StuMoocCatalog from "@/components/Stu-MoocCatalog_1.vue";
import dayjs from "dayjs";
import stuRemark from "@/components/Stu-RemarkDialog.vue";

export default {
  name: "mooc-detail",
  components: {
    StuMoocCatalog,
    stuRemark,
  },
  data() {
    return {
      replyName: "请输入内容...",
      remarkType: "1",
      isCommentShow: false, // 讨论列表弹窗
      isShow: false,
      moocInfo: {
        cover: "",
        name: "",
        teacherName: "",
        status: 0,
        interestedNum: 0,
        introText: "",
        isMasterhead: 0,
        tagList: [],
      },
      moocCatalogList: [],
      moocCourseId: this.$route.query.moocId,
      recommendList: [],
      activeName: "second",
      scrollTop: 0,
      discussType: "1",
      discussTypeList: [],
      commentList: [],
      discussList: [],
      discussPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
      commentPage: {
        page: 1,
        pageSize: 5,
        total: 0,
      },
      currentDiscuss: null,
      discussLevel2: null,
      discussLevel3: null,
    };
  },
  methods: {
    toCreate() {
      this.remarkType = "1";
      this.isShow = true;
    },
    // 发起讨论
    toDiscuss(item) {
      this.discussLevel2 = item;
      this.remarkType = "2";
      this.isShow = true;
    },
    toReply(item) {
      this.discussLevel3 = item;
      this.remarkType = "3";
      this.isCommentShow = false;
      // this.replyName = `@${item.memberName}`;
      this.isShow = true;
    },
    preview(e) {
      e.stopPropagation();
    },
    getCommentList() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscuss/listDiscussAllReply`,
          data: {
            courseId: this.moocCourseId,
            replyId: this.currentDiscuss.id,
            pageNo: this.commentPage.page,
            pageSize: this.commentPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            console.log(ret);
            this.commentList = ret.data.records;
            this.commentPage.total = ret.data.total;
            this.commentList.forEach((item) => {
              item.imgList = item.contentUrl ? item.contentUrl.split(",") : [];
            });
          }
        });
    },
    goDiscussDetail(item) {
      this.currentDiscuss = item;
      this.commentPage.page = 1;
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscuss/listDiscussAllReply`,
          data: {
            courseId: this.moocCourseId,
            replyId: item.id,
            pageNo: this.commentPage.page,
            pageSize: this.commentPage.pageSize,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            console.log(ret);
            this.commentList = ret.data.records;
            this.commentPage.total = ret.data.total;
            this.commentList.forEach((item) => {
              item.imgList = item.contentUrl ? item.contentUrl.split(",") : [];
            });
            this.isCommentShow = true;
          }
        });
    },
    submit(data) {
      console.log(data);
      let imgUrls = [];
      data.contentUrl.forEach((item) => {
        imgUrls.push(item.url);
      });
      if (this.remarkType == 1) {
        axios
          .request({
            method: "post",
            url: `/openccourse/openDiscuss/insert`,
            data: {
              title: data.title,
              courseId: this.moocCourseId,
              content: data.content,
              contentUrl: imgUrls.join(","),
              memberId: this.$store.state.user.userId,
              typeId: this.discussType,
              level: "1",
            },
          })
          .then((res) => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isShow = false;
              this.discussPage.page = 1;
              this.getDisscussList();
            }
          });
      } else if (this.remarkType == 2) {
        axios
          .request({
            method: "post",
            url: `/openccourse/openDiscuss/insert`,
            data: {
              courseId: this.moocCourseId,
              content: data.content,
              contentUrl: imgUrls.join(","),
              memberId: this.$store.state.user.userId,
              replyUid: this.discussLevel2.uid,
              replyId: this.discussLevel2.id,
              typeId: this.discussType,
              level: "2",
            },
          })
          .then((res) => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isShow = false;
              this.$notify({
                title: "",
                message: "发布讨论成功",
                type: "success",
                offset: 100,
                duration: 3000,
              });
            }
          });
      } else {
        axios
          .request({
            method: "post",
            url: `/openccourse/openDiscuss/insert`,
            data: {
              courseId: this.moocCourseId,
              content: data.content,
              contentUrl: imgUrls.join(","),
              memberId: this.$store.state.user.userId,
              replyUid: this.discussLevel3.uid,
              replyId: this.discussLevel3.id,
              typeId: this.discussType,
              level: "3",
            },
          })
          .then((res) => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isShow = false;
              this.$notify({
                title: "",
                message: "回复成功",
                type: "success",
                offset: 100,
                duration: 3000,
              });
            }
          });
      }
    },
    closeComment() {
      this.isCommentShow = false;
    },
    handleClose() {
      this.isShow = false;
    },
    changeDiscussType(item) {
      this.discussPage.page = 1;
      this.discussType = item.id;
      this.getDisscussList();
    },
    getMoocInfo() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openCcourse/getDetail`,
          data: {
            courseId: this.moocCourseId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            let {
              cover,
              name,
              teacherName,
              status,
              interestedNum,
              introText,
              isMasterhead,
              tags,
            } = ret.data;
            this.moocInfo.cover = cover;
            this.moocInfo.name = name;
            this.moocInfo.teacherName = teacherName;
            this.moocInfo.status = status;
            this.moocInfo.interestedNum = interestedNum;
            this.moocInfo.introText = introText;
            this.moocInfo.isMasterhead = isMasterhead;
            this.moocInfo.tagList = tags ? tags.split(",") : [];
          }
        });
    },
    getMoocCatalog() {
      axios
        .request({
          method: "post",
          url: `/openccourse/ccourseCatalog/listCatalog`,
          data: {
            courseId: this.moocCourseId,
            // subType: 2,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.moocCatalogList = ret.data;
          }
        });
    },
    getDisscussList() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscuss/listDiscuss`,
          data: {
            courseId: this.moocCourseId,
            pageNo: this.discussPage.page,
            pageSize: this.discussPage.pageSize,
            typeId: this.discussType,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.discussList = ret.data.records;
            this.discussPage.total = ret.data.total;
            this.discussList.forEach((item) => {
              item.imgList = item.contentUrl ? item.contentUrl.split(",") : [];
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            });
          }
        });
    },
    toPriseComment(item) {
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscuss/praise`,
          data: {
            discussId: item.id,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.getCommentList();
          } else if (ret.code == 201) {
            this.getCommentList();
          }
        });
    },
    toPrise(item) {
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscuss/praise`,
          data: {
            discussId: item.id,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.getDisscussList();
          } else if (ret.code == 201) {
            this.getDisscussList();
          }
        });
    },
    formatToDateTime(date = undefined, format = "YYYY-MM-DD HH:mm:ss") {
      return dayjs(date).format(format);
    },
    goStudy() {
      // if (this.courseInfo.catalog.length > 0) {
      //   this.$store.commit(
      //     "setVideoUrl",
      //     this.courseInfo.catalog[0].catalog[0]
      //   );
      // }
      // this.$router.push({
      //   name: "cloudPlay",
      //   params: {
      //     courseId: this.courseId,
      //   },
      // });
    },
    toDetail(item) {
      this.$router.push({
        name: "cloudDetail",
        params: {
          cCourseId: item.ccourseId,
        },
      });
      window.location.reload();
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
    addCourse() {
      axios
        .request({
          method: "post",
          url: `/openccourse/ccourseUser/insert`,
          data: {
            courseId: this.moocCourseId,
            memberId: this.$store.state.user.userId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$notify({
              title: "",
              message: "报名成功",
              type: "success",
              offset: 100,
              duration: 3000,
            });
            this.getMoocInfo();
            this.getMoocCatalog();
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            });
          }
        });
    },
    getDisscussType() {
      axios
        .request({
          method: "post",
          url: `/openccourse/openDiscussType/list`,
          data: {
            courseId: this.moocCourseId,
          },
        })
        .then((res) => {
          let ret = res.data;
          if (ret.code === 200) {
            this.discussTypeList = ret.data.records;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`,
            });
          }
        });
    },
  },
  mounted() {
    this.getMoocInfo();
    this.getMoocCatalog();
    document.documentElement.scrollTop = document.body.scrollTop = 0;
    this.getRecommendList();
    window.addEventListener("scroll", this.getHeight);
    this.getDisscussType();
    this.getDisscussList();
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

.comment-list {
  .discuss-item {
    border-top: 1px solid #d8dae2;
    padding: 5px 0;
    // background-color: #f7f7f7;
    margin-bottom: 10px;
    &:hover {
      // cursor: pointer;
      background-color: #f7f7f7;
    }
    .discuss-item-top {
      display: flex;
      align-items: center;
      .discuss-item-top-r {
        margin-left: 10px;
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    .discuss-content {
      padding-top: 10px;
      padding-left: 20px;
      .discuss-title {
      }
      .discuss-words {
      }
      .img-box {
        img {
          width: 100px;
          height: 100px;
          margin-right: 8px;
        }
      }
    }
    .discuss-option {
      margin-top: 10px;
      overflow: hidden;
      display: flex;
      justify-content: flex-end;
      padding-right: 50px;
      .zan {
        display: flex;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
      }
      .comment {
        display: flex;
        align-items: center;
        margin-left: 20px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}

.no-data1 {
  width: 100%;
  height: 580px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mooc-detail {
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
          #pane-second {
            width: 100%;
          }
          #pane-third {
            width: 100%;
          }
          .course-chapter {
            width: 100%;
          }
          .mooc-discuss-area {
            .no-data {
              width: 1100px;
              height: 580px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .discuss-list {
              .discuss-item {
                padding: 5px 0;
                border-top: 1px solid #ddd;
                margin-bottom: 10px;
                &:hover {
                  cursor: pointer;
                }
                .discuss-item-top {
                  display: flex;
                  align-items: center;
                  .discuss-item-top-r {
                    margin-left: 10px;
                    height: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                  }
                }
                .discuss-content {
                  padding-top: 10px;
                  padding-left: 20px;
                  .discuss-title {
                  }
                  .discuss-words {
                  }
                  .img-box {
                    img {
                      width: 100px;
                      height: 100px;
                      margin-right: 8px;
                    }
                  }
                }
                .discuss-option {
                  margin-top: 10px;
                  overflow: hidden;
                  display: flex;
                  justify-content: flex-end;
                  padding-right: 50px;
                  .zan {
                    display: flex;
                    align-items: center;
                    &:hover {
                      cursor: pointer;
                    }
                  }
                  .comment {
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    &:hover {
                      cursor: pointer;
                    }
                  }
                }
              }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    img {
      width: 40px;
      &:hover {
        cursor: pointer;
      }
    }
    ul li {
      width: 160px;
      height: 40px;
      line-height: 40px;
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
