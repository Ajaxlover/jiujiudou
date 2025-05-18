<template>
  <div class="classInfo">
    <el-header height="50px">
      <span class="myClass" @click="backMyClass">我的班级</span
      ><i class="el-icon-arrow-right"></i><span>班级设置</span>
    </el-header>
    <div class="main">
      <div
        style="display:flex;align-items:center;margin-bottom:18px;justify-content: space-between;"
      >
        <div>
          <span style="color:#333;font-size:16px;margin-right:27px;"
            >班级信息</span
          >
          <el-button size="mini" type="primary" @click="classSetting"
            >修改</el-button
          >
        </div>
        <el-button size="mini" @click="backMyClass">返回</el-button>
      </div>
      <div style="display:flex;">
        <div>
          <div class="info">
            <span>班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</span>：<span
              style="color:#333"
              >{{ cls.classname }}</span
            >
          </div>
          <div class="info">
            <span>课&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;程</span>：<span
              style="color:#333"
              >{{ cls.coursename }}</span
            >
          </div>
          <div class="info">
            <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科</span>：<span
              style="color:#333"
              >{{ cls.classSubjectName }}</span
            >
          </div>
          <div class="info">
            <span>云&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课</span>：<span
              style="color:#333"
              >{{ cls.cCourseName }}</span
            >
          </div>
          <div class="info">
            <span>教&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;材</span>：<span
              style="color:#333"
              >{{ cls.bundBook }}</span
            >
          </div>
        </div>
        <div
          style="background:#EEEEEE;margin:0px 27px 10px 100px;width:1px;"
        ></div>
        <div
          style="background:#F1F0F5;padding:12px 16px 12px 36px;margin-bottom:10px;display:flex;"
        >
          <div style="margin-right:50px;">
            <div style="font-size:16px;color:#333">班级邀请码</div>
            <div
              style="font-size:20px;font-weight:bold;color:#0E4378;margin-top:10px;margin-bottom:10px;"
            >
              {{ cls.invitationCode }}
            </div>
            <el-button size="mini" type="primary" @click="inviteStudents"
              >邀请学生加入班级</el-button
            >
          </div>
          <qrcode :value="cls.number" :options="{ width: 100 }"></qrcode>
        </div>
      </div>
      <el-header>
        <span style="color:#333;font-size:16px;">学生列表</span>
        <div>
          <el-button size="small" type="primary" @click="removeClick"
            >移出班级</el-button
          >
          <!-- <el-dropdown trigger="click">
            <span class="el-dropdown-link">导入学生</span>
            <el-dropdown-menu slot="dropdown" ref="dropdown">
              <el-dropdown-item @click.native="downloadExcel">下载模板</el-dropdown-item>
              <el-dropdown-item @click.native="uploadStuClick">导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button
            size="small"
            type="primary"
            :disabled="stuList.length == 0"
            @click="exportStus"
            >导出</el-button
          >
        </div>
      </el-header>
      <el-table
        :data="stuList"
        height="500px"
        stripe
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'stuNum', order: 'ascending' }"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="学号"
          prop="stuNum"
          align="center"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
        >
          <template slot-scope="scope">
            <el-input
              type="text"
              size="small"
              v-model="scope.row.stuNum"
              v-show="scope.row.isEdit"
            />
            <span v-show="!scope.row.isEdit">{{ scope.row.stuNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="stuName" align="center">
          <template slot-scope="scope">
            <el-input
              size="small"
              type="text"
              v-model="scope.row.stuName"
              v-show="scope.row.isEdit"
            />
            <span v-show="!scope.row.isEdit">{{ scope.row.stuName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="stuPhone"
          align="center"
        ></el-table-column>
        <el-table-column
          label="加入时间"
          prop="addTime"
          align="center"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
        >
          <span slot-scope="scope">{{ formatTime(scope.row.addTime) }}</span>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="!scope.row.isEdit"
              size="small"
              @click="editStu(scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.isEdit"
              size="small"
              @click="saveStu(scope.row)"
              >保存</el-button
            >
            <el-button type="text" size="small" @click="removeStu(scope.row)"
              >移出班级</el-button
            >
          </template>
        </el-table-column>
        <template slot="append">
          <!-- spinner可选：default | spiral | circles | bubbles | waveDots -->
          <infinite-loading
            :identifier="infiniteId"
            @infinite="loadStuList"
            spinner="spiral"
            forceUseInfiniteWrapper=".el-table__body-wrapper"
          >
            <loading></loading>
            <span slot="no-more"></span>
            <span slot="no-results"></span>
            <span slot="error"></span>
          </infinite-loading>
        </template>
      </el-table>
    </div>
    <jdialog
      title="导入学生"
      :visible.sync="uploadStuDialogShow"
      :loading="uploadFileLoading"
      @sure="uploadFileSure"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form label-width="70px">
            <el-form-item label="选择文件">
              <jd-upload
                ref="uploadFile"
                @fileChange="uploadFileChange"
              ></jd-upload>
              <div class="el-upload__tip" style="line-height:17px">
                当前仅支持后缀名为.xlsx的Excel文档;
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </jdialog>
    <el-dialog
      :visible.sync="uploadStuSuccess"
      :modal-append-to-body="false"
      :close_on_click_modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>提示</div>
        </div>
      </template>
      <div style="color:#333;font-size:16px;padding:0 40px">
        <div style="padding-bottom:17px">
          <i
            class="el-icon-success"
            style="color:#67C23A;margin-right:10px"
          ></i>
          <span>{{ msg_title }}</span>
        </div>
        <div v-html="msg_content" style="color:#666;font-size:14px"></div>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="uploadStuSuccess = false"
          >我知道了</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.classInfo {
  .el-header {
    background: #fff;
    line-height: 50px;
    padding: 0 43px;
    .myClass {
      cursor: pointer;
      color: #2d66a0;
    }
  }
  .main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    padding: 32px;
    .info {
      color: #999;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .el-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #eaeaea;
      padding-left: 0px;
      padding-right: 0px;
    }
    .el-dropdown-link {
      font-size: 12px;
      border-radius: 3px;
      padding: 9px 15px;
      display: inline-block;
      line-height: 1;
      text-align: center;
      color: #fff;
      background-color: #409eff;
      border: 1px solid #409eff;
      cursor: pointer;
    }
    .el-dropdown-link:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
    .el-table {
      position: unset !important;
    }
  }
}
</style>

<script>
import jdialog from "@/components/jdialog";
import InfiniteLoading from "vue-infinite-loading";
import classSetting from "./classSetting";
import axios from "@/libs/api.request";
import fileModal from "@/components/fileModal";
import { format } from "@/utils/datetime.js";
export default {
  components: {
    "infinite-loading": InfiniteLoading,
    classSetting,
    jdialog,
    "jd-upload": fileModal
  },
  data() {
    return {
      cls: {},
      stuList: [],
      page: 1,
      // 1学号 2加入时间
      sortGist: 1,
      // 1升序 2降序
      sortRule: 1,
      selectStus: [],
      uploadStuDialogShow: false,
      uploadFile: null,
      uploadFileLoading: false,
      infiniteId: +new Date(),
      uploadStuSuccess: false,
      msg_title: "",
      msg_content: ""
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
  },
  methods: {
    backMyClass() {
      this.$router.push({
        path: "/class/myClass"
      });
    },
    classSetting() {
      this.$router.push({
        path: "/class/classSetting"
      });
    },
    // 邀请学生
    inviteStudents() {
      this.$router.push({
        path: "/class/classInvitation",
        query: {
          classId: this.cls.classId,
          className: this.cls.classname
        }
      });
    },
    // 学生列表
    loadStuList($state) {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selStus",
          data: {
            clazzId: this.cls.classId,
            sortGist: this.sortGist,
            sortRule: this.sortRule,
            pageNum: this.page,
            pagesize: 20
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.length) {
              this.page++;
              ret.data.forEach(item => {
                item.isEdit = false;
              });
              this.stuList.push(...ret.data);
              $state.loaded();
            } else {
              $state.complete();
            }
          } else {
            $state.complete();
          }
        })
        .catch(() => {
          $state.error();
        });
    },
    sortChange(val) {
      if (val.prop == "stuNum") {
        this.sortGist = 1;
      } else if (val.prop == "addTime") {
        this.sortGist = 2;
      }
      if (val.order == "descending") {
        this.sortRule = 2;
      } else {
        this.sortRule = 1;
      }
      this.resetInfinite();
    },
    handleSelectionChange(val) {
      this.selectStus = val;
    },
    // 移除学生
    removeStu(row) {
      this.removeStus([row]);
    },
    editStu(row) {
      row.isEdit = true;
    },
    saveStu(row) {
      let { relationId, stuNum, stuName } = row;
      axios
        .request({
          method: "post",
          url: "/v1/clazz/updStus",
          data: {
            relationId,
            stuNum,
            stuName
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            row.isEdit = false;
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
    },
    removeClick() {
      if (this.selectStus.length) {
        this.removeStus(this.selectStus);
      } else {
        this.$message({
          type: "warning",
          message: "请勾选要删除的学生"
        });
      }
    },
    removeStus(stus) {
      let array = [];
      stus.forEach(element => {
        array.push(element.relationId);
      });
      this.$confirm("是否确认删除学生", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "v1/clazz/delStus",
            data: { relationIds: array.join(",") }
          })
          .then(
            function(data) {
              let ret = data.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.resetInfinite();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            }.bind(this)
          );
      });
    },
    // 下载模板
    downloadExcel() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportXlsxTemplateOfImportStu?token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出学生
    exportStus() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportStuXlsx?clazzId=" +
        this.cls.classId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导入学生
    uploadStuClick() {
      this.uploadFileLoading = false;
      this.uploadStuDialogShow = true;
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.clearFile();
      }
    },
    uploadFileChange(file) {
      this.uploadFile = file;
    },
    uploadFileSure() {
      if (this.uploadFile) {
        this.uploadFileLoading = true;
        let fd = new FormData();
        fd.append("xlsxFile", this.uploadFile);
        fd.append("clazzId", this.cls.classId);
        axios
          .request({
            method: "post",
            url: "v1/clazz/importStuXlsx",
            data: fd
          })
          .then(res => {
            this.uploadStuDialogShow = false;
            this.uploadFileLoading = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.uploadStuSuccess = true;
              let msg = "";
              if (ret.data) {
                if (ret.data.badPhoneRowNums) {
                  msg += '<div style="padding-bottom:10px">手机号错误：';
                  // for (const phone in ret.data.badPhoneMap) {
                  //   msg += phone + '&nbsp;&nbsp;'
                  // }
                  msg += ret.data.badPhoneRowNums + "行&nbsp;&nbsp;";
                  msg += "</div>";
                }
                if (ret.data.existPhoneRowNums) {
                  msg += "<div>手机号重复：";
                  msg += ret.data.existPhoneRowNums + "行&nbsp;&nbsp;";
                  // ret.data.existPhones.forEach(phone => {
                  //   msg += phone + '&nbsp;&nbsp;'
                  // });
                  msg += "</div>";
                }
              }
              if (ret.data.failQuantity == 0) {
                this.msg_title = "导入成功";
              } else {
                this.msg_title =
                  "成功导入" +
                  ret.data.successQuantity +
                  "个学生，有" +
                  ret.data.failQuantity +
                  "个学生导入失败";
              }
              this.msg_content = msg;
              this.resetInfinite();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          })
          .catch(() => {
            this.uploadFileLoading = false;
            this.$message({
              type: "warning",
              message: "导入失败,请稍后重试"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要上传的文件"
        });
      }
    },
    // 时间格式化
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    // 重置加载列表
    resetInfinite() {
      this.page = 1;
      this.stuList = [];
      this.infiniteId += 1;
    }
  }
};
</script>
