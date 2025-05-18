<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="searchForm.mobile"
              placeholder="请输入完整手机号"
              style="width: 150px"
              size="small"
              @keyup.enter.native="loadData"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadData"
              size="small"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column prop="uid" label="ID" align="center"></el-table-column>
        <el-table-column prop="username" label="昵称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.delFlag == 0">{{ scope.row.username }}</span>
            <span v-else style="color:#000;font-weight:900">用户已注销</span>
            <!-- {{ scope.row.delFlag == 0 ? scope.row.username : '用户已注销'}} -->
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? scope.row.mobile : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="school" label="学校" align="center">
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? scope.row.school : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="attrCity" label="城市" align="center">
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? scope.row.attrCity : "" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间"
          align="center"
          :formatter="dateFormat"
        >
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? dateFormat(scope.row.addTime) : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="appVersion" label="APP版本" align="center">
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? scope.row.appVersion : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="platformType" label="平台类型" align="center">
          <template slot-scope="scope">
            {{
              scope.row.delFlag == 0
                ? scope.row.platformType == 1
                  ? "iOS"
                  : "安卓"
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="allocRole(scope.row)"
              >分配角色</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="memberOff(scope.row)"
              v-if="scope.row.delFlag == 0"
              >注销</el-button
            >
            <span v-else style="color:#000;font-size:12px;font-weight:900"
              >已注销</span
            >
            <el-popover
              placement="bottom"
              trigger="click"
              @show="showBalance(scope.row)"
            >
              <div
                v-loading="loadingBalance"
                element-loading-background="rgb(255,255,255)"
              >
                <div>
                  iOS：{{
                    parseFloat(scope.row.ios ? scope.row.ios / 100 : 0).toFixed(
                      2
                    )
                  }}
                </div>
                <div>
                  安卓：{{
                    parseFloat(
                      scope.row.android ? scope.row.android / 100 : 0
                    ).toFixed(2)
                  }}
                </div>
              </div>
              <el-button slot="reference" type="text" size="small"
                >查看余额</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="tableData.length" class="right-footer-first">
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + tableData.length
          }}记录，共{{ page.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="page.total"
          :page-size="page.pagesize"
          :current-page.sync="page.currentPage"
          background
          @current-change="loadData"
        ></el-pagination>
      </div>
      <!-- 分配角色弹框 -->
      <el-dialog
        :visible.sync="dialogAllocRole"
        :modal-append-to-body="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>分配角色</div>
          </div>
        </template>
        <span>角色名称: </span>
        <el-select v-model="allocForm.id" placeholder="请选择角色" size="small">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          :disabled="!isDisabled"
          size="mini"
          @click="addRoleForUser"
          >添加</el-button
        >
        <el-table
          :data="roleData"
          border
          style="margin-top:15px;"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            prop="roleName"
            label="角色名称"
            align="center"
          ></el-table-column>
          <el-table-column prop="addTime" label="认证时间" align="center">
            <template slot-scope="scope">
              {{ dateFormat(scope.row.addTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="removeRoleRow(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  data() {
    return {
      searchForm: {
        mobile: ""
      },
      tableData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      //  分配角色相关
      dialogAllocRole: false,
      roleData: [],
      allocForm: {
        userId: 0
      },
      roles: [],
      loadingBalance: false
    };
  },
  computed: {
    isDisabled() {
      return !!this.allocForm.id;
    }
  },
  methods: {
    //时间格式化
    dateFormat(row) {
      return format(row);
    },
    // table  userlist
    loadData() {
      let params = {};
      params.page = this.page.currentPage;
      params.pagesize = this.page.pagesize;
      if (this.searchForm.mobile) {
        params.mobile = this.searchForm.mobile;
      }
      axios
        .request({
          method: "post",
          url: "/v1/user/listWithCount",
          data: params
        })
        .then(res => {
          this.tableData = res.data.data.data;
          this.page.total = res.data.data.total;
        });
    },
    allocRole(row) {
      this.allocForm.userId = row.uid;
      this.loadRoleData();
      this.dialogAllocRole = true;
    },
    memberOff(row) {
      this.$confirm(
        "是否注销该账号，注销后不能恢复。请与用户联系确认后再操作。",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/oauth/v4/user/unregister",
              data: {
                uid: this.$store.state.user.userId,
                targetUid: row.uid
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    addRoleForUser() {
      axios
        .request({
          method: "post",
          url: "/v1/role/addRoleForUser",
          data: {
            userId: this.allocForm.userId,
            roleId: this.allocForm.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "添加角色成功"
            });
            this.loadRoleData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    removeRoleRow(row) {
      axios
        .request({
          method: "post",
          url: "/v1/role/delRoleForUser",
          data: {
            userId: this.allocForm.userId,
            roleId: row.roleId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadRoleData();
          } else {
            this.$message({
              type: "error",
              message: ret.msg
            });
          }
        });
    },
    loadRoleData() {
      axios
        .request({
          method: "post",
          url: "/v1/role/userRoles",
          data: {
            userId: this.allocForm.userId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.roleData = ret.data;
          } else {
            this.$message({
              type: "error",
              message: ret.msg
            });
          }
        });
    },
    //返回所有可分配的角色
    loadAllRoles() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/v1/role/listWithCount",
          data: {
            page: 1,
            pagesize: 30
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.roles = ret.data.data;
          }
        });
    },
    showBalance(row) {
      this.loadingBalance = true;
      axios
        .request({
          method: "post",
          url: "user/v4/memberExtra/info",
          data: { targetUid: row.uid }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadingBalance = false;
            row.ios = ret.data.userVirtualMoneyIOS;
            row.android = ret.data.userVirtualMoney;
          }
        });
    }
  },
  mounted() {
    this.loadAllRoles();
    this.loadData();
  }
};
</script>

<style scoped lang="scss">
.myResource {
  width: 100%;
  padding: 20px;
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px;
    .tabelHeader {
      .el-form {
        float: left;
        .el-form-item {
          margin-bottom: 13px;
          .el-form-item__content {
            line-height: 32px;
          }
        }
      }
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>
