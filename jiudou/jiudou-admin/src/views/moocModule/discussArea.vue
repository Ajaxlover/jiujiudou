<template>
  <div class="discussArea">
    <el-radio-group v-model="typeValue" @change="loadDiscussList">
      <el-radio-button
        v-for="item in discussTypeList"
        :key="item.id"
        :label="item.id"
        >{{ item.name }}</el-radio-button
      >
    </el-radio-group>
    <el-table
      :data="discussList"
      :show-header="false"
      max-height="500"
      style="width: 100%;border: 1px solid #BECBD9;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="margin-top:10px;margin-left:20px">
            <p>{{ props.row.content }}</p>
            <el-button
              type="text"
              v-if="props.row.contentUrl"
              size="small"
              @click="previewPic(props.row)"
              icon="el-icon-picture"
              style="font-size:30px;padding: 0px 0px"
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" show-overflow-tooltip="" label="评论标题">
        <template slot-scope="scope">
          <div style="padding:5px 20px;font-size:18px;font-weight:600">
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="memberName"
        show-overflow-tooltip=""
        width="150"
        label="评论人"
      >
      </el-table-column>
      <el-table-column align="center" label="评论时间" width="160">
        <template slot-scope="scope">{{
          formatTime(scope.row.createTime)
        }}</template>
      </el-table-column>
      <!-- <el-table-column
      align="center"
        label="评论条数"
        width="80">
        <template slot-scope="scope"><span v-if="scope.row.replyNum">{{scope.row.replyNum}}</span></template>
      </el-table-column> -->
      <!-- <el-table-column label="状态" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if='scope.row.status==1'>显示</el-tag>
          <el-tag type="danger" size="small" v-if='scope.row.isRead!=1'>未读</el-tag>
          <el-tag type="success" size="small" v-else>已读</el-tag>          </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" v-if='scope.row.isRead!=1' @click="isRead(scope.row)">已读</el-button>
        <el-button type="text" size="small" @click="verifyDiscuss(scope.row)">{{scope.row.status==1?'隐藏':"显示"}}</el-button> -->
          <el-button
            type="text"
            size="small"
            v-if="ifSortOne(scope) != 1"
            @click="sortDiscuss(scope.row)"
            >置顶</el-button
          >
          <el-button type="text" size="small" @click="replyDiscuss(scope.row)"
            >回复</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="lookDiscussList(scope.row)"
            >查看评论</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteDiscuss(scope.row, 'two')"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="tabelFooter">
      <div v-if="discussList.length" class="right-footer-first">
        从{{ (discussPage.page - 1) * discussPage.pageSize + 1 }}到{{
          (discussPage.page - 1) * discussPage.pageSize + discussList.length
        }}记录，共{{ discussPage.total }}条
      </div>
      <div v-else class="right-footer-first" ref="footerCount">
        从0到0条记录，共0条
      </div>
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
              <!-- <span style="color:#999999">{{formatTime(item.createTime)}} <span style="color: blue">{{item.memberName}}</span>回复<span style="color:blue">{{item.replyMemberName}}</span>：</span><span>{{item.content}}</span>
              <span style="display:inline-block;float:right;"><el-link type="danger" style="font-size:12px" @click="replyDiscuss(item,props.row)">回复</el-link>
              <el-link type="danger" style="display:inline-block;font-size:12px" @click="deleteDiscuss(item,props.row)"> 删除</el-link></span> -->
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
    <el-image-viewer
      v-if="showViewer"
      :zIndex="zIndex"
      :on-close="closeViewer"
      :url-list="arryImg"
    />
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {
    ElImageViewer
  },
  data() {
    return {
      currentCourseId: "",
      discussTypeList: [],
      discussList: [],
      typeValue: 1,
      discussPage: {
        page: 1,
        pageSize: 8,
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
      zIndex: 2008
    };
  },
  methods: {
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
    loadDiscussLType(id) {
      this.currentCourseId = id;
      axios
        .request({
          method: "post",
          url: "openccourse/openDiscussType/list",
          data: {
            courseId: this.currentCourseId,
            pageNo: 1,
            pageSize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.discussTypeList = ret.data.records;
            this.typeValue = this.discussTypeList[0].id;
            this.loadDiscussList();
          }
        });
    },
    loadDiscussList() {
      axios
        .request({
          method: "post",
          url: "/openccourse/openDiscuss/listDiscuss",
          data: {
            courseId: this.currentCourseId,
            typeId: this.typeValue,
            pageNo: this.discussPage.page,
            pageSize: this.discussPage.pageSize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.discussList = ret.data.records;
            this.discussPage.total = ret.data.total;
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
          url: "/v1/discuss/read",
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
    deleteDiscuss(row, rowTop) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/openDiscuss/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (rowTop == "one") {
                  this.lookDiscussList(this.zhutiRow);
                } else if (rowTop == "two") {
                  this.loadDiscussList();
                } else {
                  this.loadDiscussTwoList(rowTop);
                }
                this.$message({
                  type: "success",
                  message: "删除成功"
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
  beforeDestroy() {},
  mounted() {}
};
</script>
<style lang="scss">
.discussArea {
  background: #ffffff;
  min-height: 680px;
  padding: 30px 50px;
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
