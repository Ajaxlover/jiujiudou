<template>
  <div class="bookDetail">
    <el-header height="50px">
      <span class="book" @click="toBook">电子书管理</span>
      <i class="el-icon-arrow-right"></i> <span>电子书详情</span>
    </el-header>
    <div class="contentBox">
      <div class="topInfo">
        <div class="header">
          <img v-if="bookInfo.cover" class="cover" :src="bookInfo.cover" />
          <div
            v-else
            class="cover"
            style="background:#F0F1F5;text-align:center"
          >
            <img
              src="@/assets/images/logo.png"
              style="width:20px;height:30px;margin-top:62px;"
            />
          </div>
          <div style="padding-left:18px;">
            <div class="bookName">{{ bookInfo.textbookName }}</div>
            <div class="author">作者：{{ bookInfo.author }}</div>
            <div class="creator">
              创建者：{{ bookInfo.creatorName }}({{ bookInfo.creatorMobile }})
            </div>
            <div class="time">
              最近更新时间：{{ formatDate(bookInfo.updated) }}
            </div>
          </div>
        </div>
        <el-button
          v-if="bookInfo.uid == uid && bookInfo.locked == 0"
          class="editbook"
          size="mini"
          type="primary"
          @click="editBook"
          >编辑教材</el-button
        >
      </div>
      <el-tabs class="info" v-model="currentIdx">
        <el-tab-pane label="教材信息" name="first">
          <div class="title">基本信息</div>
          <div class="content1">
            <el-row :gutter="20">
              <el-col :span="10"
                ><div>书名：{{ bookInfo.textbookName }}</div></el-col
              >
              <el-col :span="8"
                ><div>书号：{{ bookInfo.textbookNum }}</div></el-col
              >
              <el-col :span="6"
                ><div>出版时间：{{ bookInfo.pubDate }}</div></el-col
              >
              <el-col :span="10"
                ><div>作者：{{ bookInfo.author }}</div></el-col
              >
              <el-col :span="8"
                ><div>出版社：{{ bookInfo.pubName }}</div></el-col
              >
              <el-col :span="6"
                ><div>学科：{{ bookInfo.subjectName }}</div></el-col
              >
            </el-row>
          </div>
          <div class="title">上架补充信息</div>
          <div style="font-size:12px;">
            <div class="subtitle">
              <span>购买链接：</span>
              <a
                style="text-decoration:none;color:#2BA1F4;"
                :href="getURL(bookInfo.bookStoreUrl)"
                target="_blank"
                >{{ bookInfo.bookStoreUrl }}</a
              >
            </div>
            <div class="subtitle">教材简介</div>
            <div v-html="bookInfo.bookIntro ? bookInfo.bookIntro : '无'"></div>
            <div class="subtitle" style="margin-bottom:10px;">教材目录</div>
            <div
              class="content2 catalog"
              v-html="
                bookInfo.bookCatalogIntro ? bookInfo.bookCatalogIntro : '无'
              "
            ></div>
            <div class="subtitle" style="margin-top:15px;">作者简介</div>
            <div
              v-html="bookInfo.authorIntro ? bookInfo.authorIntro : '无'"
              style="margin-bottom:32px;"
            ></div>
          </div>
          <div class="title">其他出版信息</div>
          <div class="content3">
            <el-row :gutter="20">
              <el-col :span="6"
                ><div>面数：{{ bookInfo.pages }}</div></el-col
              >
              <el-col :span="6"
                ><div>版次：{{ bookInfo.edition }}</div></el-col
              >
              <el-col :span="6"
                ><div>印张：{{ bookInfo.printSheets }}</div></el-col
              >
              <el-col :span="6"
                ><div>字数：{{ bookInfo.words }}</div></el-col
              >
              <el-col :span="6"
                ><div>成品尺寸：{{ bookInfo.format }}</div></el-col
              >
              <el-col :span="6"
                ><div>CIP核字：{{ bookInfo.cip }}</div></el-col
              >
              <el-col :span="6"
                ><div>定价：{{ bookInfo.price }}</div></el-col
              >
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="教材资源" name="second">
          <div class="title">资源统计</div>
          <ul class="resSummery">
            <li><div id="pieChart"></div></li>
            <li></li>
            <li>
              <div class="labels">
                <div v-for="(label, index) in bookInfo.label" :key="index">
                  {{ "#" + label }}
                </div>
              </div>
            </li>
          </ul>
          <div class="title">资源详情</div>
          <el-tabs class="resTabs" v-model="resCurrent">
            <el-tab-pane label="扫码资源" name="first">
              <el-table
                :data="bookResData"
                border
                v-loading="loading.bookResLoading"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
              >
                <el-table-column label="章节" align="center" width="150px">
                  <template slot-scope="scope">
                    {{ catalog.get(scope.row.resChapter) }}
                  </template>
                </el-table-column>
                <el-table-column label="资源类型" prop="resType" align="center">
                  <template slot-scope="scope">
                    <span>{{ formatResType(scope.row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="资源名" prop="resName" align="center">
                  <template slot-scope="scope">
                    <span
                      @click="handleViewRes(scope.row)"
                      style="cursor:pointer"
                      >{{ scope.row.resName }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="matchPicUrl"
                  label="二维码/比对图"
                  align="center"
                  width="180"
                >
                  <div slot-scope="scope" v-if="scope.row.matchPicUrl">
                    <el-popover
                      placement="top-start"
                      title="比对图"
                      trigger="click"
                    >
                      <img
                        :src="scope.row.matchPicUrl"
                        alt=""
                        style="width:200px;"
                      />
                      <i
                        slot="reference"
                        class="el-icon-picture"
                        style="font-size:30px;cursor: pointer;"
                      ></i>
                    </el-popover>
                  </div>
                  <div slot-scope="scope" v-else-if="scope.row.qrcode">
                    <el-popover
                      placement="top-start"
                      title="二维码"
                      trigger="click"
                    >
                      <div style="text-align:center;">
                        {{ bookInfo.textbookNum }}-{{
                          scope.row.qrcodeNickname
                        }}
                      </div>
                      <qrcode
                        :value="scope.row.qrcode"
                        :options="{ width: 200 }"
                      ></qrcode>
                      <i
                        slot="reference"
                        class="el-icon-picture"
                        style="font-size:30px; cursor: pointer;"
                      ></i>
                    </el-popover>
                  </div>
                </el-table-column>
                <el-table-column
                  label="资源展示名"
                  prop="matchpicname"
                  align="center"
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.matchpicname
                        ? scope.row.matchpicname
                        : scope.row.resName
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="页码"
                  prop="resPage"
                  align="center"
                ></el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="bookResData.length" class="right-footer-first">
                  从{{ (resPage.page - 1) * resPage.pagesize + 1 }}到{{
                    (resPage.page - 1) * resPage.pagesize + bookResData.length
                  }}记录，共{{ resPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="resPage.total"
                  :page-size="resPage.pagesize"
                  :current-page.sync="resPage.page"
                  background
                  @current-change="loadBookRes"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="自测训练" name="second">
              <el-table
                :data="testList"
                border
                v-loading="loading.bookTestLoading"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
              >
                <el-table-column label="章节" align="center" width="150px">
                  <template slot-scope="scope">
                    {{ catalog.get(scope.row.catalogId) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="题目类型"
                  align="center"
                  prop="tSubject"
                  :formatter="formatType"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  label="难度"
                  prop="difficultyLevel"
                  align="center"
                  width="60px"
                  :formatter="formatDiff"
                ></el-table-column>
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between;">
                      <div class="subject-title">
                        {{ testList[scope.$index].briefTitle }}
                      </div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="preview(scope.$index, testList[scope.$index])"
                        >预览</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="获取时间" align="center" width="160px">
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.getTime) }}
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="testList.length" class="right-footer-first">
                  从{{ (testPage.page - 1) * testPage.pageSize + 1 }}到{{
                    (testPage.page - 1) * testPage.pageSize + testList.length
                  }}记录，共{{ testPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="testPage.total"
                  :page-size="testPage.pageSize"
                  :current-page.sync="testPage.page"
                  background
                  @current-change="loadTests"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="教材习题" name="third">
              <el-table
                :data="subjectList"
                border
                v-loading="loading.subjectsLoading"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
              >
                <el-table-column label="章节" align="center" width="150px">
                  <template slot-scope="scope">
                    {{ catalog.get(scope.row.catalogId) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="题目类型"
                  align="center"
                  prop="tSubject"
                  :formatter="formatType"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  label="难度"
                  prop="difficultyLevel"
                  align="center"
                  width="60px"
                  :formatter="formatDiff"
                ></el-table-column>
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between;">
                      <div class="subject-title">
                        {{ subjectList[scope.$index].briefTitle }}
                      </div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="
                          preview(scope.$index, subjectList[scope.$index])
                        "
                        >预览</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="获取时间" align="center" width="160px">
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.getTime) }}
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="subjectList.length" class="right-footer-first">
                  从{{
                    (subjectsPage.page - 1) * subjectsPage.pageSize + 1
                  }}到{{
                    (subjectsPage.page - 1) * subjectsPage.pageSize +
                      subjectList.length
                  }}记录，共{{ subjectsPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="subjectsPage.total"
                  :page-size="subjectsPage.pageSize"
                  :current-page.sync="subjectsPage.page"
                  background
                  @current-change="loadBookSubjects"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="教师课件包" name="forth">
              <div
                style="width:700px;margin:130px 0"
                v-loading="loading.teaResLoading"
              >
                <div v-if="teaRes.id" style="text-align:center">
                  <img
                    style="width:90px;"
                    src="@/assets/images/ic_res_tea.png"
                  />
                  <div
                    style="color:#333;font-size:24px;margin-top:13px;margin-bottom:20px;"
                  >
                    教师专用课件
                  </div>
                  <div
                    style="display:flex;flex:1;justify-content:space-between;font-size:16px;padding:16px 30px;background:#F0F1F5;border-radius:5px;"
                  >
                    <span>{{ teaRes.resName }}</span>
                    <span>
                      <span style="font-size:13px;">{{
                        formatBookResSize(teaRes.resSize)
                      }}</span>
                      <span style="font-size:13px;margin:0 20px;">{{
                        formatDate(teaRes.created)
                      }}</span>
                    </span>
                  </div>
                </div>
                <div v-else style="text-align:center">
                  <img
                    style="width:90px;opacity:0.3;"
                    src="@/assets/images/ic_res_tea.png"
                  />
                  <div
                    style="color:#999;font-size:16px;margin-top:13px;margin-bottom:20px;"
                  >
                    您还没有上传教师课件包
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="学习素材包" name="fifth">
              <div
                style="width:700px;margin:130px 0;"
                v-loading="loading.stuResLoading"
              >
                <div v-if="stuRes.id" style="text-align:center">
                  <img
                    style="width:90px;"
                    src="@/assets/images/ic_res_stu.png"
                  />
                  <div
                    style="color:#333;font-size:24px;margin-top:13px;margin-bottom:20px;"
                  >
                    教师配套资源
                  </div>
                  <div
                    style="display:flex;flex:1;justify-content:space-between;font-size:16px;padding:16px 30px;background:#F0F1F5;border-radius:5px;"
                  >
                    <span>{{ stuRes.resName }}</span>
                    <span>
                      <span style="font-size:13px;">{{
                        formatBookResSize(stuRes.resSize)
                      }}</span>
                      <span style="font-size:13px;margin:0 20px;">{{
                        formatDate(stuRes.created)
                      }}</span>
                    </span>
                  </div>
                </div>
                <div v-else style="text-align:center">
                  <img
                    style="width:90px;opacity:0.3;"
                    src="@/assets/images/ic_res_stu.png"
                  />
                  <div
                    style="color:#999;font-size:16px;margin-top:13px;margin-bottom:20px;"
                  >
                    您还没有上传学习素材包
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
    <jd-dialog title="题目预览" :noFooter="true" :visible.sync="isPreviewShow">
      <preview slot="body" :data="previewSubject"></preview>
    </jd-dialog>
    <!-- 预览资源 -->
    <el-dialog
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
        </div>
      </template>
      <viewRes :data="viewResObj"></viewRes>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.bookDetail {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .book {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .contentBox {
    background: white;
    margin: 23px;
    padding: 30px;
    border-radius: 4px;
    .topInfo {
      display: flex;
      justify-content: space-between;
      .header {
        display: flex;
        .cover {
          width: 109px;
          height: 154px;
        }
        .bookName {
          color: #333;
          font-size: 20px;
        }
        .author {
          color: #333;
          font-size: 16px;
          margin-top: 21px;
          margin-bottom: 13px;
        }
        .creator {
          color: #333;
          font-size: 16px;
          margin-bottom: 19px;
        }
        .time {
          color: #999;
          font-size: 14px;
        }
      }
      .editbook {
        width: 150px;
        height: 40px;
        background: #2ba1f4;
        border: none;
        font-size: 16px;
      }
    }
  }
  .info {
    margin-top: 54px;
    .el-tabs__header .el-tabs__item {
      font-size: 18px;
    }
    .title {
      color: #333;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 16px;
    }
    .content1 {
      width: 69%;
      background: rgba(13, 67, 118, 0.03);
      border: 1px solid rgba(13, 67, 118, 0.16);
      border-radius: 4px;
      padding: 10px 20px;
      color: rgba(51, 51, 51, 0.7);
      font-size: 12px;
      margin-bottom: 42px;
      .el-col {
        line-height: 30px;
      }
    }
    .content2 {
      background: rgba(13, 67, 118, 0.03);
      border: 1px solid rgba(13, 67, 118, 0.16);
      border-radius: 4px;
      padding: 15px;
      color: rgba(51, 51, 51, 0.7);
      font-size: 12px;
    }
    .content3 {
      background: rgba(13, 67, 118, 0.03);
      border: 1px solid rgba(13, 67, 118, 0.16);
      border-radius: 4px;
      padding: 10px 20px;
      color: rgba(51, 51, 51, 0.7);
      font-size: 12px;
      .el-col {
        line-height: 30px;
      }
    }
    .catalog {
      height: 330px;
      overflow-y: auto;
    }
    .subtitle {
      font-size: 14px;
      padding: 4px 0;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .resSummery {
      border: 1px solid rgba(13, 67, 118, 0.16);
      border-radius: 4px;
      list-style: none;
      overflow: hidden;
      height: 211px;
      padding-left: 0;
      width: 80%;
      min-width: 811px;
      li:first-child {
        float: left;
        width: 60%;
        min-width: 500px;
        #pieChart {
          height: 210px;
          width: 500px;
          margin: 0 auto;
        }
      }
      li:nth-child(2) {
        width: 1px;
        background: #ddd;
        float: left;
        height: 124px;
        margin-top: 43px;
      }
      li:last-child {
        width: 39%;
        float: left;
        min-width: 300px;
        height: 100%;
        .labels {
          font-size: 12px;
          margin-top: 30px;
          div {
            padding: 4px 15px;
            color: #333333;
            background: rgba(13, 67, 118, 0.1);
            border-radius: 4px;
            margin: 8px auto;
            width: 150px;
          }
        }
      }
    }
    .subject-title {
      // white-space: nowrap;
      // width: 90%;
      // overflow: hidden;
      // text-overflow: ellipsis;
      text-align: left;
      padding-right: 15px;
      max-height: 23px;
      overflow: hidden;
    }
    .resTabs {
      min-height: 682px;
      .el-tabs__item {
        border: 1px solid #c1c7d5;
        margin-right: 8px;
        font-size: 14px !important;
        color: #333;
        font-weight: 400;
        height: 28px;
        line-height: 28px;
      }
      .el-tabs__item.is-active {
        background: #2ba1f4;
        color: white;
        border: none;
      }
      .el-tabs__item:nth-child(2) {
        padding-left: 20px !important;
      }
      .el-tabs__item:last-child {
        padding-right: 20px !important;
      }
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import common from "@/utils/common";
// import echarts from 'echarts'
import jdialog from "@/components/jdialog";
import preview from "@/views/tiku/previewSubject";
import viewRes from "@/components/viewRes";
let echarts = require("echarts/lib/echarts");
// 按需引入需要的组件模块
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");
export default {
  components: {
    "jd-dialog": jdialog,
    preview,
    viewRes
  },
  data() {
    return {
      uid: this.$store.state.user.userId,
      id: this.$route.query.id,
      currentIdx: "first",
      bookInfo: {},
      pieChart: "",
      loading: {
        bookResLoading: false,
        bookTestLoading: false,
        subjectsLoading: false,
        teaResLoading: false,
        stuResLoading: false
      },
      resCurrent: "first",
      previewSubject: "",
      isPreviewShow: false,
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      // 资源
      bookResData: [],
      resPage: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      resTypes: common.resTypes,
      // 自测题
      testList: [],
      testPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      // 教材题库
      subjectList: [],
      subjectsPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      teaRes: {},
      stuRes: {},
      catalog: new Map()
    };
  },
  mounted() {
    this.loadInfo();
    this.pieChart = echarts.init(document.getElementById("pieChart"));
    this.loadTeaRes();
    this.loadStuRes();
    this.loadCatalog();
  },
  methods: {
    //加载目录信息
    loadCatalog() {
      axios
        .request({
          method: "post",
          url: "/ebook/ebook/detail",
          data: {
            id: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.catalog.forEach(element => {
              this.catalog.set(element.catalogId, element.catelogContent);
            });
            this.loadBookRes();
            this.loadTests();
            this.loadBookSubjects();
          }
        });
    },
    toBook() {
      this.$router.push({
        name: "ebooks"
      });
    },
    getURL(url) {
      let strURL = "";
      if (url) {
        if (
          url.substr(0, 7).toLowerCase() == "http://" ||
          url.substr(0, 8).toLowerCase() == "https://"
        ) {
          strURL = url;
        } else {
          strURL = "http://" + url;
        }
      }
      return strURL;
    },
    // 编辑教材
    editBook() {
      this.$router.push({
        path: "/publication/bookInfo",
        query: {
          textbookId: this.textbookId
        }
      });
    },
    // 加载基本信息
    loadInfo() {
      axios
        .request({
          method: "post",
          url: "/v1/textbook/bookDetail",
          data: { textbookId: this.textbookId }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.bookInfo = res.data;
            this.drawPie();
          }
        })
        .catch(() => {});
    },
    // 绘制饼状图
    drawPie() {
      let names = [];
      let datas = [];
      for (let i = 0; i < this.bookInfo.report.length; i++) {
        let r = this.bookInfo.report[i];
        let name = r.name + "：" + r.number;
        names.push(name);
        datas.push({
          name: name,
          value: r.number,
          type: r.type
        });
      }
      this.pieChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "70%",
          y: "middle",
          data: names
        },
        series: [
          {
            name: "资源统计",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              }
              // emphasis: {
              //   show: true,
              //   textStyle: {
              //     fontSize: '30',
              //     fontWeight: 'bold'
              //   }
              // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: datas
          }
        ],
        itemStyle: {
          color: function(params) {
            let type = params.data.type;
            if (type == 1) {
              return "#B1E163";
            } else if (type == 2) {
              return "#39BCF9";
            } else if (type == 3) {
              return "#697CCB";
            } else if (type == 4) {
              return "#5B99FD";
            } else if (type == 5) {
              return "#D5A6DD";
            } else if (type == 6) {
              return "#23DAD2";
            } else if (type == 7) {
              return "#F9D082";
            } else if (type == 9) {
              return "#FCB673";
            } else if (type == 10) {
              return "#F38585";
            } else if (type == 12) {
              return "#8F9AE6";
            } else {
              return "#999";
            }
          }
        }
      });
    },
    // 加载教材资源列表
    loadBookRes() {
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/infoListWithCount",
          data: {
            textbookId: this.textbookId,
            page: this.resPage.page,
            pagesize: this.resPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookResData = ret.data.data;
            this.resPage.total = ret.data.total;
          }
        });
    },
    // 加载自测题
    loadTests() {
      this.loading.bookTestLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/selfTest/listWithCount",
          data: {
            textbookId: this.textbookId,
            page: this.testPage.page,
            pagesize: this.testPage.pageSize
          }
        })
        .then(
          function(data) {
            this.loading.bookTestLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testList = res.data.data;
              this.testPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    // 加载教材题目
    loadBookSubjects() {
      this.loading.subjectsLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/bookSbLib/listWithCount",
          data: {
            textbookId: this.textbookId,
            page: this.subjectsPage.page,
            pagesize: this.subjectsPage.pageSize
          }
        })
        .then(
          function(data) {
            this.loading.subjectsLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.subjectList = res.data.data;
              this.subjectsPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    loadTeaRes() {
      this.loading.teaResLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/tbMatchPic/teacherSpecific",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.teaResLoading = false;
          if (ret.code === 200) {
            this.teaRes = ret.data;
          }
        })
        .catch(() => {
          this.loading.teaResLoading = false;
        });
    },
    loadStuRes() {
      this.loading.stuResLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/tbMatchPic/bookSpecific",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.stuResLoading = false;
          if (ret.code === 200) {
            this.stuRes = ret.data;
          }
        })
        .catch(() => {
          this.loading.stuResLoading = false;
        });
    },
    // 预览
    preview(index, row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    formatResType(row) {
      return common.resTypeFormat(row.resType);
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 日期
    formatDate(time) {
      return format(time);
    },
    // 难度
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    // 状态
    formatStatus(row) {
      if (row.status == 0) {
        return "已停用";
      } else if (row.status == 1) {
        return "纠错中";
      } else {
        return "启用中";
      }
    },
    formatBookResSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    //查看资源
    handleViewRes(row) {
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    }
  }
};
</script>
