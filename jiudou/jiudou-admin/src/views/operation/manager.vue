<template>
  <el-container class="manager">
    <el-main>
      <div class="top">
        <el-select
          v-model="ccStatus"
          size="small"
          style="width:100px;"
          @change="courseSerch"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="审核中" value="1"></el-option>
          <el-option label="已通过" value="2"></el-option>
          <el-option label="未通过" value="3"></el-option>
        </el-select>
        <el-input
          size="small"
          v-model="keyWord"
          placeholder="云课名称、ID、作者"
          style="width: 200px"
          @keyup.enter.native="courseSerch"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="courseSerch"
        ></el-button>
      </div>
      <div class="main">
        <el-table
          :data="courseListData"
          border
          :row-style="{ height: '120px' }"
          :show-header="false"
          v-loading="loading.tableLoading"
        >
          <el-table-column
            prop="tname"
            label="书名"
            align="center"
            min-width="900"
          >
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  style="cursor: pointer;"
                  v-if="scope.row.ccourseCover"
                  :src="scope.row.ccourseCover"
                  class="userPic"
                  @click="bigImg(scope.row)"
                />
                <img v-else src="@/assets/images/ccoursePlacehoder.png" />
              </div>
              <div class="middle">
                <div class="name">
                  <span>{{ formatCourseType(scope.row.ccourseType) }}</span>
                  <span
                    v-if="scope.row.ccourseSort == 2"
                    style="border: 1px solid #2ba1f4;color: #2ba1f4;font-weight: normal;padding: 2px 5px;font-size: 12px;border-radius: 10px;margin-right: 8px;"
                    >习题全解</span
                  >
                  <span @click="verifyAndLook(scope.row)">{{
                    scope.row.ccourseName
                  }}</span>
                  <span>{{ formatPrice(scope.row) }}</span>
                </div>
                <div class="cloudId">
                  云课ID: {{ scope.row.ccourseUuid }}
                  <span>老师: {{ scope.row.ccourseTeacherName }}</span>
                </div>
                <div class="createName">
                  开课用户: {{ scope.row.creatorName }}
                </div>
              </div>
              <div class="right">
                <div>
                  <span
                    v-if="scope.row.sort"
                    style="display:inline-block;margin-right:100px"
                    >置顶级别：{{ scope.row.sort }}</span
                  >{{ courseStatus(scope.row) }}
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="verifyAndLook(scope.row)"
                >{{ scope.row.ccourseStatus == 1 ? "审核" : "查看" }}</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="countCourse(scope.row)"
                style="margin-left:0"
                >统计</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="mobileView(scope.row)"
                style="margin-left:0"
                >手机预览</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="toTransCourse(scope.row)"
                style="margin-left:0"
                >转让</el-button
              >
              <el-button
                size="mini"
                type="text"
                v-if="
                  scope.row.ccourseIsOn == 1 && scope.row.ccourseStatus == 2
                "
                @click="setTop(scope.row)"
                >置顶级别</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="courseIsOn(scope.row)"
                v-if="scope.row.ccourseStatus == 2"
                style="margin-left:0"
                >{{ isCourseOn(scope.row) }}</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="toSetCourseSort(scope.row)"
                style="margin-left:0"
                >设置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
            {{
              (this.page.currentPage - 1) * this.page.pagesize +
                this.courseListData.length
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
    <!-- 云课封面大图 -->
    <el-dialog
      :visible.sync="isBigImageShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面</div>
        </div>
      </template>
      <img :src="currentCourse.ccourseCover" alt="" style="width:560px;" />
    </el-dialog>
    <!-- 手机端预览弹框 -->
    <el-dialog
      :visible.sync="isMobielShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>手机预览</div>
        </div>
      </template>
      <div style="text-align:center">
        <div>打开九斗APP扫一扫，预览云课</div>
        <qrcode :value="qrcode" :options="{ width: 200 }"></qrcode>
      </div>
    </el-dialog>

    <el-dialog
      title="云课转让"
      :visible.sync="isMemberShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="userForm"
        @submit.native.prevent
      >
        <el-form-item prop="mobile" style="margin:0 20%;">
          <span>请输入转让目标九斗用户手机号</span>
          <el-input
            v-model="userForm.mobile"
            style="width:250px;margin: 10px 0"
            @input="userForm.mobile = userForm.mobile.replace(/[^0-9]/g, '')"
            size="medium"
            type="tel"
            autocomplete="off"
            @keyup.enter.native="handleSearchUser"
            :maxlength="11"
          >
          </el-input>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="handleSearchUser"
          ></el-button>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSelect" style="text-align:center;">
        <div v-if="userResult.uid">
          <div class="info">
            <img
              v-if="userResult.pic"
              :src="userResult.pic"
              style="width:100px;border-radius:50%;"
            />
            <img
              v-else
              src="@/assets/images/userPic.png"
              style="width:100px;border-radius:50%;"
            />
            <div class="username">{{ userResult.username }}</div>
            <div>{{ userResult.mobile }}</div>
          </div>
        </div>
        <div v-else style="text-align:center;">
          该用户不存在，请先注册九斗账号
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddMember" :disabled="disBtn"
          >转让</el-button
        >
        <el-button @click="isMemberShow = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="设置"
      :visible.sync="isSetShow"
      :modal-append-to-body="false"
      width="600px"
    >
      <el-form :model="setForm" ref="setForm" @submit.native.prevent>
        <el-form-item label="类型" prop="courseSort" style="margin:0 20%;">
          <el-select
            size="small"
            v-model="setForm.courseSort"
            placeholder="请选择类型"
          >
            <el-option label="云课" value="1"></el-option>
            <el-option label="习题全解" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="mobile" style="margin:0 20%;">
         
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setCourseSort">确定</el-button>
        <el-button @click="isSetShow = false">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format } from "@/utils/datetime";
import store from "@/store";

export default {
  data() {
    return {
      isSetShow: false,
      userResult: {},
      isMemberShow: false,
      userForm: {
        mobile: ""
      },
      setForm: {
        courseSort: "1"
      },
      userRules: {
        mobile: [
          { required: true, message: "请输入正确手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      },
      disBtn: true,
      isSelect: false,
      uid: this.$store.state.user.userId,
      isBigImageShow: false,
      isMobielShow: false,
      qrcode: "",
      ccStatus: "",
      keyWord: "",
      courseListData: [],
      loading: {
        tableLoading: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      currentCourse: {},
      roleName: store.state.user.currentRole.roleName
    };
  },
  methods: {
    setCourseSort() {
      let { ccourseId } = this.currentCourse;
      let { courseSort } = this.setForm;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/updateCC/cCSort",
          data: {
            cCId: ccourseId,
            cCourseSort: courseSort
          }
        })
        .then(res => {
          console.log(res);
          let ret = res.data;
          if (ret.code === 200) {
            this.isSetShow = false;
            this.$message({
              type: "success",
              message: "设置成功"
            });
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    toSetCourseSort(row) {
      this.isSetShow = true;
      this.currentCourse = row;
      this.setForm.courseSort = String(row.ccourseSort);
    },
    toTransCourse(row) {
      this.isMemberShow = true;
      this.currentCourse = row;
    },
    //确定添加用户
    doAddMember() {
      // let { mobile } = this.userForm;
      let { ccourseId } = this.currentCourse;
      let { uid } = this.userResult;
      axios
        .request({
          method: "post",
          url: "/v1/cCourse/transferEditPermission",
          data: {
            ccourseId,
            currentUid: uid
          }
        })
        .then(res => {
          console.log(res);
          let ret = res.data;
          if (ret.code === 200) {
            this.isMemberShow = false;
            this.$message({
              type: "success",
              message: "转让成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 查找用户
    handleSearchUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/user/userInfoByMobile",
              data: {
                mobile: this.userForm.mobile
              }
            })
            .then(res => {
              let ret = res.data;
              this.isSelect = true;
              if (ret.code === 200) {
                this.disBtn = false;
                this.userResult = ret.data;
              } else {
                this.disBtn = true;
                this.userResult = {};
              }
            })
            .catch(() => {
              this.disBtn = true;
              this.$message({
                type: "warning",
                message: "添加服务不可用!"
              });
            });
        } else {
          this.disBtn = true;
          this.isSelect = false;
        }
      });
    },
    loadData() {
      this.loading.tableLoading = true;
      let data = {};
      data.pageNum = this.page.currentPage;
      data.pagesize = this.page.pagesize;
      if (this.keyWord) {
        data.searchWord = this.keyWord;
      }
      data.cCStatus = this.ccStatus;
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selectCCList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.courseListData = ret.data.data;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    courseSerch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    bigImg(row) {
      this.isBigImageShow = true;
      this.currentCourse = row;
    },
    // 云课类型
    formatCourseType(ccourseType) {
      return common.mathCourseType(ccourseType);
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.ccourseFeeType == 0) {
          return "免费";
        } else {
          return "￥" + row.ccoursePrice / 100;
        }
      }
    },
    //更新时间
    dateFormat: function(row) {
      return format(row);
    },
    //云课状态
    courseStatus(row) {
      if (row.ccourseStatus == 2) {
        if (row.ccourseIsOn == 0) {
          return "已通过";
        }
        if (row.ccourseIsOn == 1) {
          return "已上架";
        }
        if (row.ccourseIsOn == 2) {
          return "已下架";
        }
      } else {
        return common.mathCourseStatus(row.ccourseStatus);
      }
    },
    //统计
    countCourse(row) {
      this.$router.push({
        path: "/cloudCourse/countCourse",
        query: {
          ccourseId: row.ccourseId,
          courseName: row.ccourseName,
          ccourseUuid: row.ccourseUuid,
          type: 2
        }
      });
    },
    //手机端预览
    mobileView(row) {
      this.qrcode = "ccourse" + row.ccourseId;
      this.isMobielShow = true;
    },
    //审核或查看
    verifyAndLook(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.ccourseId,
          //2是审核  3是查看
          type: row.ccourseStatus == 1 ? 2 : 3
        }
      });
    },
    //上下架显示
    isCourseOn(row) {
      if (row.ccourseIsOn == 1) {
        return "下架";
      } else {
        return "上架";
      }
    },
    //上下架云课
    courseIsOn(row) {
      let returnInfo = "";
      let isOn = 0;
      if (row.ccourseIsOn == 1) {
        isOn = 2;
        returnInfo =
          "<div>是否确定下架云课：《" +
          row.ccourseName +
          "》？</div>云课下架后，未购买用户将不能查询、购买云课，已购买用户可以正常学习";
      } else {
        isOn = 1;
        returnInfo =
          "<div>是否确定上架云课：《" +
          row.ccourseName +
          "》？</div>云课上架后，用户可查询、试看、购买、学习云课";
      }
      this.$confirm("" + returnInfo + "", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: row.ccourseId,
                isOn: isOn,
                roleName: this.roleName
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 置顶级别
    setTop(row) {
      this.$prompt("", "置顶级别", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.sort,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "请输入非负整数"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: row.ccourseId,
                sort: value
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "置顶更新成功"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss">
.manager {
  .el-main {
    margin: 22px 20px;
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
        padding: 0px 10px;
        overflow: hidden;
        text-align: left;
        .left {
          float: left;
          img {
            width: 157.4px;
            height: 86px;
            display: block;
          }
        }
        .middle {
          margin-left: 18px;
          float: left;
          .name {
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            span:first-child {
              border: 1px solid #2ba1f4;
              color: #2ba1f4;
              font-weight: normal;
              padding: 2px 5px;
              font-size: 12px;
              border-radius: 10px;
              margin-right: 10px;
            }
            span:nth-child(2) {
              cursor: pointer;
            }
            span:nth-child(3) {
              color: #2ba1f4;
              margin-left: 30px;
            }
          }
          .cloudId {
            margin-top: 5px;
            font-size: 14px;
            color: #666666;
            span {
              margin-left: 20px;
            }
          }
          .createName {
            margin-top: 5px;
            font-size: 12px;
            color: #999999;
          }
        }
        .right {
          float: right;
          line-height: 86px;
          margin-right: 50px;
          color: #2ba1f4;
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
  .el-date-editor .el-range-separator {
    width: auto;
  }
}
</style>
