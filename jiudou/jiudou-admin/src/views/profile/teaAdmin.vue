<template>
  <div>
    <el-tabs class="message" @tab-click="handleClick" v-model="current">
      <el-tab-pane class="system container" label="授权通知" name="first">
        <div class="top">
          <el-input
            size="small"
            v-model="sysPhone"
            placeholder="请输入手机号"
            style="width: 300px"
            @keyup.enter.native="handleSearch"
          ></el-input>
          <el-button
            type="primary"
            @click="handleSearch"
            class="el-icon-search"
            size="small"
          ></el-button>
          <div class="operateBtn">
            <el-button
              size="small"
              @click="toApplyAdmin"
              type="primary"
              icon="el-icon-plus"
              >申请</el-button
            >
          </div>
        </div>
        <el-table
          :data="applyList"
          v-loading="loading.sysMessage"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="昵称"
            align="center"
            width="100px"
            prop="username"
          ></el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            align="center"
          ></el-table-column>
          <el-table-column
            label="学校"
            prop="school"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            prop="createTime"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.state === 1"
                size="small"
                @click="passMsg(scope.row)"
                >授权</el-button
              >
              <el-tag type="success" size="medium" v-if="scope.row.state === 2"
                >已授权</el-tag
              >

              <el-button
                v-if="scope.row.state === 1"
                type="text"
                size="small"
                @click="refuseMsg(scope.row)"
                >拒绝</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="applyList.length" class="right-footer-first">
            从{{ (sysPage.page - 1) * sysPage.pageSize + 1 }}到{{
              (sysPage.page - 1) * sysPage.pageSize + applyList.length
            }}记录，共{{ sysPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="sysPage.total"
            :page-size="sysPage.pageSize"
            :current-page.sync="sysPage.page"
            background
            @current-change="loadSysMessages"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="teaPage.total != -1"
        class="system container"
        label="教师管理"
        name="second"
      >
        <div class="top">
          <el-input
            size="small"
            v-model="teaPhone"
            placeholder="请输入手机号"
            @keyup.enter.native="handleTeaSearch"
            style="width: 300px"
          ></el-input>
          <el-button
            type="primary"
            class="el-icon-search"
            size="small"
            @click="handleTeaSearch"
          ></el-button>
          <div class="operateBtn">
            <el-button
              v-if="teaPage.total != -1"
              size="small"
              @click="toAddTea"
              type="primary"
              icon="el-icon-plus"
              >新增下属</el-button
            >
          </div>
        </div>
        <el-table
          :data="teaList"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="昵称"
            prop="username"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            align="center"
          ></el-table-column>
          <el-table-column
            label="学校"
            prop="school"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            prop="createTime"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="refuseAttestation(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="teaList.length" class="right-footer-first">
            从{{ (sysPage.page - 1) * sysPage.pageSize + 1 }}到{{
              (sysPage.page - 1) * sysPage.pageSize + teaList.length
            }}记录，共{{ teaPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="teaPage.total"
            :page-size="teaPage.pageSize"
            :current-page.sync="teaPage.page"
            background
            @current-change="loadTeaList"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 申请成为管理员 -->
    <el-dialog
      :visible.sync="isApplyShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>申请校级管理员</div>
        </div>
      </template>
      <el-form
        :model="applyForm"
        label-width="90px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <!-- <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="applyForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="applyForm.phone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="id">
          <el-input v-model.trim="applyForm.id" size="small"></el-input>
        </el-form-item> -->
        <el-form-item label="学校" prop="school">
          <el-input v-model.trim="applyForm.school" size="small"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model.trim="applyForm.college" size="small"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="number">
          <el-input v-model.trim="applyForm.number" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doApply">确定</el-button>
        <el-button size="small" type="default" @click="isApplyShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增下属教师 -->
    <el-dialog
      :visible.sync="isAddShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新增下属</div>
        </div>
      </template>
      <el-form
        :model="teaForm"
        label-width="90px"
        style="margin:20px 70px;"
        @submit.native.prevent
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="teaForm.phone" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doAdd">确定</el-button>
        <el-button size="small" type="default" @click="isAddShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.message {
  .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    background: none;
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
  }
  .container {
    background: white;
    margin: 22px 23px;
    padding: 10px 20px;
    .top {
      overflow: hidden;
      margin-bottom: 20px;
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      isApplyShow: false,
      isAddShow: false,
      current: "first",
      sysMessageList: [],
      applyList: [],
      teaList: [],
      teaPhone: "",
      sysPhone: "",
      teaForm: {
        phone: ""
      },
      applyForm: {
        name: "",
        phone: "",
        id: "",
        college: "",
        school: "",
        number: ""
      },
      sysPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      teaPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loading: {
        sysMessage: false
      }
    };
  },
  mounted() {
    this.loadSysMessages();
    this.loadTeaList();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSearch() {
      // 手机号搜索
      this.loadSysMessages();
    },
    handleTeaSearch() {
      this.loadTeaList();
    },
    toApplyAdmin() {
      this.applyForm.college = "";
      this.applyForm.school = "";
      this.applyForm.number = "";
      this.isApplyShow = true;
    },
    doApply() {
      let { name, phone, college, school, number } = this.applyForm;
      // 确定申请
      axios
        .request({
          method: "post",
          url: "clazz/clazzManager/insert",
          data: {
            name,
            phone,
            college,
            school,
            number
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: `申请成功`
            });
          } else {
            this.$message({
              type: "warning",
              message: `${ret.msg}`
            });
          }
        });
    },
    toAddTea() {
      this.$prompt("请输入下属教师手机号", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
        inputErrorMessage: "手机号格式不正确"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "clazz/clazzManager/addsubordinate",
              data: {
                phone: value,
                type: 1,
                managerUid: this.$store.state.user.userId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadTeaList();
                this.$message({
                  type: "success",
                  message: "已成功发送邀请，等待对方授权！"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        })
        .catch(() => {});
      // this.teaForm.phone = "";
      // this.isAddShow = true;
    },
    doAdd() {
      // 新增下属
    },
    loadTeaList() {
      axios
        .request({
          method: "post",
          url: "clazz/clazzManager/listMember",
          data: {
            page: this.teaPage.page,
            pagesize: this.teaPage.pageSize,
            phone: this.teaPhone
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.teaList = ret.data.data;
            this.teaPage.total = ret.data.total;
          } else if (ret.code == 201) {
            this.teaPage.total = -1;
          }
        })
        .catch(() => {});
    },
    loadSysMessages() {
      this.loading.sysMessage = true;
      axios
        .request({
          method: "post",
          url: "clazz/clazzManager/selectManager",
          data: {
            page: this.sysPage.page,
            pagesize: this.sysPage.pageSize,
            phone: this.sysPhone
          }
        })
        .then(res => {
          this.loading.sysMessage = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.applyList = ret.data.data;
            this.sysPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.sysMessage = false;
        });
    },
    passMsg(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/update",
          data: {
            id: row.uid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadSysMessages();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    refuseMsg(row) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazzManager/delete",
          data: {
            id: row.uid
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadSysMessages();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    refuseAttestation(row) {
      this.$confirm("是否确定删除?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/clazz/clazzManager/delete",
              data: {
                id: row.uid
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadTeaList();
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        })
        .catch(() => {});
    },
    // 类型
    formatType(row) {
      if (row.msgType == 12) {
        return "云课";
      } else {
        return "系统通知";
      }
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    }
  }
};
</script>
