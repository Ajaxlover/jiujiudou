<template>
  <el-container class="book">
    <el-header style="height: 50px">
      教师来稿分配
      <!-- <div @click="bookHelp">电子书管理帮助</div> -->
    </el-header>
    <el-main>
      <div class="top">
        <el-input
          size="small"
          v-model="searchForm.keyWord"
          placeholder="搜索书名、作者、书号"
          style="width: 320px"
          @keyup.enter.native="enterKeyUp"
        ></el-input>
        <span style="color:#666;font-size:14px">状态</span>
        <el-select
          v-model="searchForm.pubPlan"
          size="small"
          @change="enterKeyUp"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="待分配" value="1"></el-option>
          <el-option label="已分配" value="2"></el-option>
        </el-select>
        <!-- <span style="color:#666;font-size:14px">参与方式</span>
        <el-select
          v-model="searchForm.pubType"
          size="small"
          @change="enterKeyUp"
          style="width:100px;"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="总编辑" value="1"></el-option>
          <el-option label="辅助编辑" value="2"></el-option>
        </el-select> -->
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="loadData"
        ></el-button>
        <div class="operateBtn">
          <!-- <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newBook"
            >新建</el-button
          > -->
          <!-- <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="newDigitalBook"
            >新建</el-button
          > -->
        </div>
      </div>
      <div class="main">
        <el-table
          :data="textbookData"
          border
          :row-style="{ height: '140px' }"
          v-loading="loading"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="300"
          >
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  style="cursor: pointer;"
                  v-if="scope.row.coverPic"
                  :src="scope.row.coverPic"
                  class="userPic"
                />
                <div v-else class="userPicPlachoder" style="cursor: pointer;">
                  <img src="@/assets/images/logoPlacehoder.png" />
                </div>
              </div>
              <div class="right">
                <div class="name">
                  {{ scope.row.tname }}
                  <!-- <span v-if="scope.row.bookAdded == 0">上架</span> -->
                </div>
                <!-- <div class="num">
                  书号: {{ scope.row.tbNum }} {{ scope.row.publishname }}
                </div> -->
                <div class="author">作者: {{ scope.row.author }}</div>
                <!-- <div class="otherRes">
                  <span v-for="item in scope.row.label" :key="item">{{
                    item
                  }}</span>
                </div> -->
              </div>
            </div>
          </el-table-column>
          <el-table-column label="提交编辑" align="center">
            <div slot-scope="scope">
              {{ scope.row.submitUserName }}({{ scope.row.submitUserMobile }})
            </div>
          </el-table-column>
          <!-- <el-table-column prop="uid" label="创建者" align="center" width="300">
            <div slot-scope="scope" v-if="scope.row.uid">
              {{ scope.row.creatName }}({{ scope.row.mobile }})
            </div>
          </el-table-column> -->
          <el-table-column label="投稿时间" align="center">
            <template slot-scope="scope">
              <div>{{ timeFormat(scope.row.submitTime) }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="出版规划" align="center">
            <div slot-scope="scope">
              <span v-if="scope.row.planType == 1">校本资源</span>
              <span v-else>出版教材</span>
            </div>
          </el-table-column> -->
          <el-table-column label="编辑方式" align="center">
            <div slot-scope="scope">
              <span v-if="scope.row.editType == 1">传统Epub编辑</span>
              <span v-else>新型数字教材编辑</span>
            </div>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <div slot-scope="scope">
              <span v-if="scope.row.status == 1">待分配</span>
              <span v-else>已分配</span>
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="bookDetail(scope.row)"
                >详情</el-button
              > -->
              <el-button type="text" size="small" style="margin-left:0"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.status > 1"
                @click="handleTransfer(scope.row)"
                style="margin-left:0"
                >分配</el-button
              >
              <!-- <el-button type="text" size="small" @click="recommendBook(scope.row)" style="margin-left:0">推荐</el-button> -->
              <!-- <el-dropdown trigger="hover" :hide-on-click='false'> -->
              <!-- <el-dropdown trigger="hover" :hide-on-click="true">
                <span
                  class="el-dropdown-link"
                  style="color:#409EFF;font-size:12px;cursor: pointer;"
                >
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    锁定<el-switch
                      :value="scope.row.locked == 1"
                      style="margin-left:30px;"
                      @change="changeLockBook(scope.row)"
                    ></el-switch>
                    <div class="inputTips" style="line-height:20px;">
                      锁定后不能再编辑
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    上架<el-switch
                      :value="scope.row.bookAdded == 0"
                      style="margin-left:30px;"
                      @change="changeBookAdded(scope.row)"
                    ></el-switch>
                    <div class="inputTips" style="line-height:20px;">
                      上架后在云端书架可见
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleTransfer(scope.row)">转让</el-dropdown-item>
                  <el-dropdown-item
                    @click.native="deleteBook(scope.row)"
                    v-if="scope.row.uid == uid"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.textbookData.length
            }}
            记录，共 {{ page.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :total="page.total"
            :current-page.sync="page.currentPage"
            :page-size="page.pagesize"
            @current-change="loadData"
          ></el-pagination>
        </div>
      </div>
    </el-main>

    <!-- 新建教材 -->
    <el-dialog
      :visible.sync="isAddShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="add-digital-book"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建数字教材</div>
        </div>
      </template>
      <div>
        <el-form
          :model="addForm"
          ref="addForm"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="封面" prop="cover">
            <div style="display:flex">
              <el-upload
                :multiple="false"
                :with-credentials="true"
                class="cover-uploader"
                action=""
                :auto-upload="true"
                :http-request="uploadSectionFile"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
              >
                <img
                  v-if="addForm.cover"
                  :src="addForm.cover"
                  class="tiku-cover"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div
                style="display:flex;flex-direction:column;justify-content:flex-end;margin-left:10px"
              >
                <el-button
                  @click="viewImg(addForm.cover)"
                  v-if="addForm.cover"
                  type="text"
                  size="small"
                  >预览</el-button
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="学科">
            <el-select
              v-model="addForm.subjectType"
              style="width:140px;"
              size="small"
            >
              <el-option
                v-for="item in editTypeList"
                :key="item.id"
                :label="item.sname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="书名">
            <el-input
              style="width:300px"
              v-model.trim="addForm.name"
              size="small"
              placeholder="请输入书名"
            ></el-input>
          </el-form-item>
          <el-form-item label="书号">
            <el-input
              style="width:300px"
              v-model.trim="addForm.num"
              size="small"
              placeholder="请输入书号"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input
              style="width:300px"
              v-model.trim="addForm.author"
              size="small"
              placeholder="请输入作者"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input
              style="width:300px"
              v-model.trim="addForm.pubName"
              size="small"
              placeholder="请输入出版社"
            ></el-input>
            <span v-if="savePubName">
              <span style="color:#999999;margin-left:5px"
                >上次输入：{{ savePubName }}</span
              >
              <el-button
                type="primary"
                style="margin-left:15px;"
                size="small"
                @click="usSavePubName"
                >使用</el-button
              >
            </span>
          </el-form-item>

          <el-form-item label="出版规划" prop="title">
            <el-select
              v-model="addForm.pubPlan"
              size="small"
              style="width:200px;"
            >
              <el-option label="校本资源" value="1"></el-option>
              <el-option label="出版教材" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编辑方式" prop="title">
            <el-select
              v-model="addForm.editType"
              size="small"
              style="width:200px;"
            >
              <el-option label="新型数字教材编辑" value="1"></el-option>
              <el-option label="传统Epub编辑方式" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer">
        <el-button size="small" type="primary">创建</el-button>
        <el-button size="small" @click="isAddShow = false">取消</el-button>
      </span>
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false;
        }
      "
      :url-list="imgList"
    />
    <!-- 分配 -->
    <el-dialog
      :visible.sync="isTransferShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="1000px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>分配</div>
        </div>
      </template>
      <span style="padding-left:75px;font-size:16px">选择成员：</span>
      <div style="margin-top: 20px">
        <el-radio-group
          size="small"
          v-model="selectedMember"
          style="text-align:center;display: inherit;"
        >
          <el-radio
            border
            :label="item.uid"
            v-for="item in member"
            :key="item.uid"
            style="margin-right:10px;margin-left:0;margin-bottom:15px;text-align:left;min-width:400px;"
          >
            {{ item.username }}({{ item.mobile }})</el-radio
          >
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          :disabled="selectedMember == 0"
          type="primary"
          @click="doTransfer"
          >确定</el-button
        >
        <el-button size="small" @click="isTransferShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { format, formatSS } from "@/utils/datetime";
export default {
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer")
  },
  data() {
    return {
      currentDtBook: {},
      savePubName: localStorage.getItem("savePubName"),
      editTypeList: [],
      showViewer: false,
      imgList: [],
      isAddShow: false,
      addForm: {
        name: "",
        num: "",
        author: "",
        pubName: "",
        subjectType: 16,
        pubPlan: "1",
        editType: "2",
        cover: "",
        coverObj: null
      },
      uid: this.$store.state.user.userId,
      isTransferShow: false,
      lockBook: false,
      bookAdded: false,
      searchForm: {
        keyWord: "",
        pubPlan: "",
        pubType: ""
      },
      loading: false,
      textbookData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      member: [],
      selectedMember: 0,
      currentTextbookId: ""
    };
  },
  computed: {
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  methods: {
    getCourseTypeList() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listWithCount",
          data: {
            page: 1,
            pagesize: 50
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let temp = [];
            temp = ret.data.data.sort((a, b) => a.id - b.id);
            this.editTypeList = [...temp];
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    // 上传图片
    uploadSectionFile(params) {
      this.addForm.cover = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.addForm.cover = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "图片上传失败"
                  });
                }
              });
          }
        });
    },
    viewImg(url) {
      this.imgList = [url];
      this.showViewer = true;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return format(date);
    },
    timeFormat(row) {
      return formatSS(row);
    },
    usSavePubName() {
      this.addForm.pubName = localStorage.getItem("savePubName");
    },
    loadData() {
      this.loading = true;
      let params = {};
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pagesize;
      params.pubId = this.pubId;
      if (this.searchForm.keyWord) {
        params.keyWord = this.searchForm.keyWord;
      }
      if (this.searchForm.pubPlan) {
        params.assignStatus = this.searchForm.pubPlan;
      }
      // if (this.searchForm.pubType) {
      //   params.joinType = this.searchForm.pubType;
      // }
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/progress/queryContributionPage",
          data: params
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.textbookData = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    bookHelp() {
      this.$router.push({
        path: "/publication/bookHelp"
      });
    },
    bookDetail(row) {
      this.$router.push({
        path: "/publication/epubBookDetail",
        query: {
          id: row.id
        }
      });
    },
    delBook(row) {
      this.$confirm("数字教材将会被删除,是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/delete",
              data: {
                dtbookId: row.id
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                if (this.page.currentPage != 1 && this.resList.length == 1) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    editBook(row) {
      this.$router.push({
        path: "/publication/chapterInfo",
        query: {}
      });
      // if (row.type == 1) {
      //   this.$router.push({
      //     path: "/publication/epubBookInfo",
      //     query: {
      //       id: row.id
      //     }
      //   });
      // } else {
      //   this.$router.push({
      //     path: "/publication/chapterInfo",
      //     query: {}
      //   });
      // }
    },
    recommendBook(row) {
      this.$router.push({
        path: "/publication/ebookInfo",
        query: {
          id: row.id,
          activeName: "three"
        }
      });
    },
    newBook(row) {
      this.$router.push({
        name: "epubBookInfo"
      });
    },
    newDigitalBook() {
      this.isAddShow = true;
    },
    changeLockBook(row) {
      // let locked = "";
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/lock",
          data: {
            id: row.id
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code === 200) {
            // if (row.locked === 1) {
            //   row.locked = 0;
            // } else {
            //   row.locked = 1;
            // }
            this.loadData();
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        });
    },
    changeBookAdded(row) {
      axios
        .request({
          method: "post",
          url: "/ebook/digitalBook/upTop",
          data: {
            id: row.id
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code === 200) {
            // if (row.bookAdded === 1) {
            //   row.bookAdded = 0;
            // } else {
            //   row.bookAdded = 1;
            // }
            this.loadData();

            this.$message({
              type: "success",
              message: res.msg
            });
          }
        });
    },
    deleteBook(row) {
      this.$confirm("图书将会被删除,不会在APP上展示,是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/digitalBook/delete",
              data: {
                id: row.id
                // delFlag: 1
              }
            })
            .then(data => {
              let ret = data.data;
              if (ret.code === 200) {
                if (this.page.currentPage != 1 && this.resList.length == 1) {
                  this.page.currentPage--;
                }
                this.loadData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    enterKeyUp() {
      this.loadData();
    },
    //分配
    handleTransfer(row) {
      this.selectedMember = 0;
      this.currentTextbookId = row.textbookId;
      this.currentDtBook = row;
      axios
        .request({
          method: "post",
          url: "/v1/pubMember/listWithCount",
          data: {
            page: 1,
            pagesize: 30
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.member = ret.data.data;
            this.isTransferShow = true;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //确定分配
    doTransfer() {
      if (this.selectedMember > 0) {
        // @todo
        axios
          .request({
            method: "post",
            url: "/ebook/digitalBook/progress/assignContribution",
            data: {
              progressId: this.currentDtBook.progressId,
              editorUid: this.selectedMember
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isTransferShow = false;
              this.loadData();
              this.$message({
                type: "success",
                message: ret.msg
              });
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择分配的成员"
        });
      }
    }
  },
  mounted() {
    this.getCourseTypeList();
    this.loadData();
  }
};
</script>

<style lang="scss">
.add-digital-book {
  .el-form-item {
    margin-bottom: 10px;
  }
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .tiku-cover {
    width: 140px;
    height: 140px;
    display: block;
  }
}

.book {
  .el-header {
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    div {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
    .top {
      overflow: hidden;
      .operateBtn {
        float: right;
      }
    }
    .main {
      margin-top: 13px;
      .info {
        padding: 5px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 75px;
            height: 106px;
          }
          .userPicPlachoder {
            width: 75px;
            height: 106px;
            background: #f0f1f5;
            border-radius: 4px;
            text-align: center;
            img {
              width: 24px;
              height: 36px;
              margin-top: 29px;
            }
          }
        }
        .right {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            cursor: pointer;
            span {
              border: 1px solid #2ba1f4;
              color: #2ba1f4;
              font-weight: normal;
              padding: 2px 5px;
              font-size: 12px;
              border-radius: 10px;
              margin-left: 10px;
            }
          }
          .num {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
          }
          .author {
            margin-top: 5px;
            font-size: 12px;
            color: #999999;
          }
          .otherRes {
            margin-top: 5px;
            span {
              margin-right: 2px;
              display: inline-block;
              padding: 0 12px;
              background: #edf1f7;
              border-radius: 12px;
              color: #0d4376;
              font-size: 12px;
              height: 24px;
              line-height: 24px;
              opacity: 0.7;
            }
          }
        }
      }
      tbody tr td:nth-child(3) {
        font-size: 12px;
        color: #999999;
      }
      tbody tr td:nth-child(2) {
        color: #666666;
      }
    }
  }
}
</style>
