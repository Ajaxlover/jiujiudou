<template>
  <div class="discussArea">
    <el-header height="40px">
      <el-button
        type="primary"
        size="small"
        @click="createDiscuss"
        style="float:right"
        >新建讨论</el-button
      >
    </el-header>

    <div class="empty1" v-if="discussList.length === 0">
      <img src="@/assets/images/empty1.png" alt="" />
    </div>

    <el-collapse v-else>
      <el-collapse-item v-for="(item, index) in discussList" :key="index">
        <template slot="title">
          {{ item.title }}----{{ formatTime(item.createTime) }}
          <i
            v-if="item.sort === 0"
            @click="setTop(item)"
            style="margin-left:60px"
            class="iconfont icon-zhiding"
          ></i>
          <i
            @click="deleteDiscuss(item)"
            style="margin-left:60px"
            class="iconfont icon-shanchu"
          ></i>
        </template>
        <div>
          <span>话题内容：<span v-html="item.content"></span></span>
        </div>
        <div class="discussPic" v-if="item.contentImgs.length">
          <ul>
            <li v-for="(i, idx) in item.contentImgs" :key="idx">
              <el-image
                style="width: 100px; height: 100px"
                :src="i"
                :preview-src-list="item.contentImgs"
              >
              </el-image>
            </li>
          </ul>
        </div>
        <!-- v-if="item.childrenList.length" -->
        <div v-for="(j, key) in item.childrenList" :key="key" class="reDiscuss">
          <div class="left">
            <el-avatar
              v-if="j.memberPic"
              size="medium"
              :src="j.memberPic"
            ></el-avatar>

            <el-avatar
              v-else
              size="medium"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
          <div class="right">
            <span>{{ j.memberName }}:</span>
            <span>{{ j.content }}</span>
            <div class="discussPic" v-if="j.contentImgs.length">
              <ul>
                <li v-for="(k, s) in j.contentImgs" :key="s">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="k"
                    :preview-src-list="j.contentImgs"
                  >
                  </el-image>
                </li>
              </ul>
            </div>
            <div>
              <span style="margin-right:30px">{{
                formatTime(j.createTime)
              }}</span>
              <span
                v-if="j.isLike === 0"
                @click="setIsLike(j)"
                class="iconfont icon-31dianzan"
              ></span>
              <span
                @click="setIsLike(j)"
                v-if="j.isLike === 1"
                class="iconfont icon-yidianzan"
              ></span>
              <i
                @click="deleteDiscuss(j)"
                style="margin-left:60px"
                class="iconfont icon-shanchu"
              ></i>
            </div>
          </div>

          <!-- <ul>
            <li v-for="(i, idx) in item.contentImgs" :key="idx">
              <el-image
                style="width: 100px; height: 100px"
                :src="i"
                :preview-src-list="item.contentImgs"
              >
              </el-image>
            </li>
          </ul> -->
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-if="discussList.length > 0" style="margin-top:20px">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="discussPage.total"
        :page-size="discussPage.pageSize"
        :current-page.sync="discussPage.page"
        background
        @current-change="loadDiscussList"
      ></el-pagination>
    </div>
    <el-drawer
      title="评论列表"
      :visible.sync="drawer"
      :append-to-body="true"
      class="drawer-table"
      size="50%"
      direction="rtl"
    >
      <el-table
        v-if="drawer"
        :data="discussListTwo"
        :show-header="false"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="expandChange"
        :row-class-name="getRowClass"
        height="100%"
        style="width: 100%"
      >
        <el-table-column type="expand" width="30px">
          <template slot-scope="props">
            <div
              v-for="item in props.row.secondContent"
              :key="item.id"
              style="margin-top:20px"
            >
              <img
                v-if="item.memberPic"
                :src="item.memberPic"
                style="width:55px;float:left;border-radius:50%;"
                alt=""
              />
              <img
                v-else
                src="@/assets/images/userPic.png"
                style="width:55px;float:left;"
                alt=""
              />
              <div style="display: inline-block;">
                <span style="color:#999999">{{ item.memberName }}</span>
                <div style="line-height:25px;color:#999999">
                  {{ formatTime(item.createTime) }}
                </div>
                <div style="width:100%;color:black">
                  <span v-if="item.replyMemberName" style="color:blue"
                    >@{{ item.replyMemberName }}：</span
                  >
                  <span style="color: black">{{ item.content }}</span>
                </div>
              </div>
              <div style="float:right">
                <span style="display:inline-block;float:right;"
                  ><el-link
                    type="danger"
                    style="font-size:12px"
                    @click="replyDiscuss(item, props.row)"
                    >回复</el-link
                  >
                  <el-link
                    type="danger"
                    style="display:inline-block;font-size:12px"
                    @click="deleteDiscuss(item, props.row)"
                  >
                    删除</el-link
                  ></span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip="" label="评论内容">
          <template slot-scope="scope">
            <img
              v-if="scope.row.memberPic"
              :src="scope.row.memberPic"
              style="width:55px;float:left;border-radius:50%;"
              alt=""
            />
            <img
              v-else
              src="@/assets/images/userPic.png"
              style="width:55px;float:left"
              alt=""
            />
            <div style="display: inline-block;">
              <span style="color:#999999">{{ scope.row.memberName }}</span>
              <div style="line-height:25px;color:#999999">
                {{ formatTime(scope.row.createTime) }}
              </div>
              <div style="width:100%;color:black">{{ scope.row.content }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.contentUrl"
              size="small"
              @click="previewPicDrawer(scope.row)"
              icon="el-icon-picture"
              style="font-size:20px;padding: 0px 0px"
            ></el-button>
            <el-button
              type="text"
              size="small"
              @click="replyDiscuss(scope.row, scope.row)"
              >回复</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteDiscuss(scope.row, 'one')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-image-viewer
        v-if="showViewerDrawer"
        :zIndex="zIndex"
        :on-close="closeViewer"
        :url-list="arryImg"
      />
    </el-drawer>
    <el-dialog
      :visible.sync="isApplyShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新增讨论</div>
        </div>
      </template>
      <el-form
        :model="discussForm"
        label-width="90px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="discussForm.title" size="small"></el-input>
        </el-form-item>
        <el-form-item label="正文内容" prop="content">
          <Ueditor
            v-model.trim="discussForm.content"
            :initialFrameHeight="initialFrameHeight"
            :toolbars="toolbars"
          />
        </el-form-item>
        <el-form-item label="图片" prop="imgUrls">
          <!-- :on-preview="handlePictureCardPreview" -->

          <el-upload
            :with-credentials="true"
            action=""
            :limit="9"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture-card"
            :on-change="handleChange"
            :http-request="uploadSectionFile"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :modal="false" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <!-- <el-input
            type="textarea"
            v-model.trim="discussForm.content"
            size="small"
          ></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doDiscuss"
          >确定</el-button
        >
        <el-button size="small" type="default" @click="isApplyShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import Ueditor from "@/components/ueditor";

export default {
  components: {
    ElImageViewer,
    Ueditor
  },
  data() {
    return {
      initialFrameHeight: 50,
      toolbars: [
        [
          "fullscreen",
          "source",
          "|",
          "undo",
          "redo",
          "|",
          "emotion",
          "rowspacingtop",
          "rowspacingbottom",
          "lineheight",
          "|",
          "directionalityltr",
          "directionalityrtl",
          "indent",
          "|",
          "justifyleft",
          "justifycenter",
          "justifyright",
          "justifyjustify"
        ]
      ],
      isApplyShow: false,
      dialogImageUrl: "",
      fileList: [],
      imgUrls: [],
      dialogVisible: false,
      currentCourseId: "",
      discussTypeList: [],
      discussList: [],
      discussForm: {
        title: "",
        content: ""
      },
      typeValue: 1,
      discussPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      rowData: {},
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      discussListTwo: [],
      drawer: false,
      zhutiRow: {},
      showViewer: false,
      showViewerDrawer: false,
      arryImg: [],
      zIndex: 2008,
      cls: {},
      imgNum: 0
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadDiscussList();
  },
  methods: {
    setTop(item) {
      axios
        .request({
          method: "post",
          url: "clazz/discuss/stickyPost",
          data: {
            id: item.id,
            classId: item.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.$message({
            //   type: "warning",
            //   message: `${ret.msg}`
            // });
            this.loadDiscussList();
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    setIsLike(j) {
      axios
        .request({
          method: "post",
          url: "clazz/behaviour/praise",
          data: {
            discussId: j.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadDiscussList();
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    uploadSectionFile(params) {
      console.log(params);
      const form = new FormData();
      // 文件对象
      form.append("file", params);
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/uploadImage",
          data: form
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.imgNum++;
            this.imgUrls.push(ret.data);
            if (this.fileList.length != this.imgNum) {
              this.uploadSectionFile(this.fileList[this.imgNum].raw);
            } else {
              this.sendDiscuss();
            }
          }
        });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    createDiscuss() {
      // 新建讨论
      this.discussForm.title = "";
      this.discussForm.content = "";
      this.fileList = [];
      this.imgUrls = [];
      this.imgNum = 0;
      this.isApplyShow = true;
    },
    doDiscuss() {
      if (this.fileList.length) {
        this.uploadSectionFile(this.fileList[0].raw);
      } else {
        this.sendDiscuss();
      }
    },
    sendDiscuss() {
      axios
        .request({
          method: "post",
          url: "clazz/discuss/insert",
          data: {
            classId: this.cls.classId,
            level: 1,
            // memberPic:
            //   "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            // memberName: "111",
            // replyId: 346,
            // replyUid: 469829,
            content: this.discussForm.content,
            title: this.discussForm.title,
            contentUrl: this.imgUrls.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isApplyShow = false;
            this.$message({
              type: "success",
              message: "发表成功!"
            });
            this.loadDiscussList();
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    ifSortOne(scope) {
      return (
        (this.discussPage.page - 1) * this.discussPage.pageSize +
        scope.$index +
        1
      );
    },
    previewPic(row) {
      this.arryImg = [];
      this.arryImg = row.contentUrl.split(",");
      this.showViewer = true;
    },
    previewPicDrawer(row) {
      this.arryImg = [];
      this.arryImg = row.contentUrl.split(",");
      this.showViewerDrawer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
      this.showViewerDrawer = false;
    },
    loadDiscussList() {
      axios
        .request({
          method: "post",
          url: "clazz/discuss/detail",
          data: {
            // courseId: this.currentCourseId,
            // typeId: this.typeValue,
            classId: this.cls.classId,
            page: this.discussPage.page,
            pageSize: this.discussPage.pageSize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data.data) {
              ret.data.data.forEach(item => {
                item.contentImgs = item.contentUrl.split(",")[0]
                  ? item.contentUrl.split(",")
                  : [];
                item.childrenList.forEach(i => {
                  i.contentImgs = i.contentUrl.split(",")[0]
                    ? i.contentUrl.split(",")
                    : [];
                });
              });
              this.discussList = ret.data.data;
              this.discussPage.total = ret.data.total;
            }
          }
        });
    },
    loadDiscussTwoList(row) {
      console.log(row);
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/listSecondDiscuss",
          data: {
            courseId: this.currentCourseId,
            memberId: this.$store.state.user.userId,
            typeId: this.typeValue,
            pageNo: 1,
            pageSize: 10,
            replyId: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          console.log(res.data);
          if (ret.code === 200) {
            row.secondContent = ret.data.records;
          }
        });
    },
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    messageList(row) {
      this.rowData = row;
      this.loadDiscussList();
      this.dialogVisible.message = true;
    },
    replyDiscuss(row, rowTop) {
      this.$prompt("回复内容", "", {
        confirmButtonText: "回复",
        cancelButtonText: "取消",
        inputPattern: /\s*\S+?/,
        inputErrorMessage: "回复内容不能为空"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "/openccourse/openDiscuss/insert",
              data: {
                content: value,
                courseId: this.currentCourseId,
                replyId: row.id,
                memberId: this.$store.state.user.userId,
                typeId: this.typeValue,
                replyUid: row.uid
                // title: this.rowData.contentExt.extTitle
              }
            })
            .then(res => {
              let ret = res.data;
              console.log(ret);
              if (row.replyId == 0) {
                this.loadDiscussList();
              } else {
                this.loadDiscussTwoList(rowTop);
              }
              this.$message({
                type: "success",
                message: "回复成功"
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器异常，请稍后重试"
              });
            });
        })
        .catch(() => {});
    },
    // 审核评论
    verifyDiscuss(row) {
      let status = 1;
      let text = "显示";
      if (row.status == 1) {
        status = 0;
        text = "隐藏";
      }
      this.$confirm("是否" + text + "该评论", "提示", {
        confirmButtonText: text,
        cancelButtonText: "取消"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/discuss/audit",
              data: {
                discussId: row.discussId,
                status: status
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                // row.status = status
                this.loadDiscussList();
                this.$message({
                  type: "success",
                  message: text + "成功"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器异常，请稍后重试"
              });
            });
        })
        .catch(() => {});
    },
    // 已读
    isRead(row) {
      axios
        .request({
          method: "post",
          url: "v1/discuss/read",
          data: {
            discussId: row.discussId,
            status: 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadDiscussList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "服务器异常，请稍后重试"
          });
        });
    },
    // 置顶
    sortDiscuss(row) {
      this.$confirm("是否置顶?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/openDiscuss/sort",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadDiscussList();
                this.$message({
                  type: "success",
                  message: "置顶成功"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器异常，请稍后重试"
              });
            });
        })
        .catch(() => {});
    },
    // 删除评论
    deleteDiscuss(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "clazz/discuss/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.loadDiscussList();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器异常，请稍后重试"
              });
            });
        })
        .catch(() => {});
    },
    expandChange(row, expanded) {
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/listSecondDiscuss",
          data: {
            courseId: this.currentCourseId,
            memberId: this.$store.state.user.userId,
            typeId: this.typeValue,
            pageNo: 1,
            pageSize: 10,
            replyId: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            row.secondContent = ret.data.records;
            // this.discussPage.total = ret.data.total
            // console.log(this.discussPage)
          }
        });
    },
    lookDiscussList(row) {
      this.zhutiRow = row;
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/listDiscuss",
          data: {
            courseId: this.currentCourseId,
            typeId: this.typeValue,
            pageNo: 1,
            pageSize: 10,
            replyId: this.zhutiRow.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.discussListTwo = ret.data.records;
            this.drawer = true;
            // this.discussPage.total = ret.data.total
            // console.log(this.discussPage)
          }
        });
    },
    getRowClass(row, rowIndex) {
      console.log(row);
      if (row.row.replyNum == 0) {
        //判断当前行是否有子数据或者根据实际情况设置
        return "row-expand-cover";
      }
    }
  },
  beforeDestroy() {}
};
</script>
<style lang="scss">
.discussArea {
  background: #ffffff;
  min-height: 680px;
  // padding: 30px 50px;
  .el-header {
    padding: 0;
  }
  .empty1 {
    display: flex;
    height: 500px;
    width: 100%;
    justify-content: center;
    align-items: center;
    img {
      width: 396px;
      height: 238px;
    }
  }
  .discussPic {
    ul {
      list-style: none;
      display: flex;
      li {
        margin-right: 10px;
        border: 1px solid #ebeef5;
      }
    }
  }

  .reDiscuss {
    margin-left: 40px;
    margin-top: 10px;
    display: flex;
    border-top: 1px solid #ebebeb;

    .left {
      margin-right: 5px;
    }
    .right {
      display: flex;
      flex-direction: column;
    }
  }

  .el-radio-button {
    margin: 0 50px 30px 0;
    .el-radio-button__inner {
      border-left: 2px solid #409eff;
    }
  }
}
.el-table .cell {
  padding-left: 2px !important;
  padding-right: 2px !important;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 10px 15px 20px 60px;
}
.el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}
</style>
