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
              size="medium"
              @keyup.enter.native="loadData"
            ></el-input>
            <el-input
              v-model="searchForm.teacherName"
              placeholder="请输入教师姓名"
              style="width: 150px"
              size="medium"
              @keyup.enter.native="loadData"
            ></el-input>
            <el-input
              v-model.trim="searchForm.school"
              placeholder="请输入学校名称"
              style="width: 150px"
              size="medium"
              @keyup.enter.native="loadData"
            ></el-input>
            <el-select
              style="width:110px;"
              v-model="searchForm.status"
              size="medium"
              @change="loadData"
            >
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="未审核"></el-option>
              <el-option value="1" label="已通过"></el-option>
              <el-option value="2" label="未通过"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadData"
              size="medium"
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
        <el-table-column
          prop="teacherName"
          label="教师姓名"
          align="center"
        ></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="school" label="学校" align="center">
        </el-table-column>
        <el-table-column label="附件" align="center" width="80">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.img" type="text" class="el-icon-picture" style="font-size:24px;" @click="showFile(scope.row)"></el-button>
            <span v-else>无</span> -->
            <el-image
              v-if="scope.row.teacherVerifyPic"
              style="width: 50px; height: 50px"
              :src="scope.row.teacherVerifyPic"
              :preview-src-list="arryWay(scope.row.teacherVerifyPic)"
            >
            </el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="提交时间"
          align="center"
          :formatter="dateFormat"
        >
          <template slot-scope="scope">
            {{ scope.row.delFlag == 0 ? dateFormat(scope.row.addTime) : "" }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              v-if="scope.row.status === 0"
              @click="passAttestation(scope.row)"
              >通过</el-button
            >
            <el-button
              type="text"
              size="medium"
              v-if="scope.row.status === 0"
              @click="refuseAttestation(scope.row)"
              >拒绝</el-button
            >
            <el-tag type="success" size="medium" v-if="scope.row.status === 1"
              >已通过</el-tag
            >
            <el-tag type="danger" size="medium" v-if="scope.row.status === 2"
              >未通过</el-tag
            >
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
        mobile: "",
        teacherName: "",
        status: "",
        school: ""
      },
      tableData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  computed: {},
  methods: {
    arryWay(string) {
      let arry = [];
      arry.push(string);
      return arry;
    },
    //时间格式化
    dateFormat(row) {
      return format(row);
    },
    // table  userlist
    loadData() {
      let params = {};
      params.page = this.page.currentPage;
      params.pagesize = this.page.pagesize;
      params.teacherName = this.searchForm.teacherName;
      params.status = this.searchForm.status;
      if (this.searchForm.mobile) {
        params.mobile = this.searchForm.mobile;
      }
      if (this.searchForm.school) {
        params.school = this.searchForm.school;
      }
      axios
        .request({
          method: "post",
          url: "v1/teacherVerify/listWithCount",
          data: params
        })
        .then(res => {
          this.tableData = res.data.data.data;
          this.page.total = res.data.data.total;
        });
    },
    passAttestation(row) {
      this.$confirm("是否通过该教师的认证，通过后不能恢复。。", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/v1/teacherVerify/access",
              data: {
                uid: this.$store.state.user.userId,
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "通过认证成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    refuseAttestation(row) {
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          axios
            .request({
              method: "post",
              url: "/v1/teacherVerify/reject",
              data: {
                uid: this.$store.state.user.userId,
                id: row.id,
                reason: value
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: "拒绝认证成功!"
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
