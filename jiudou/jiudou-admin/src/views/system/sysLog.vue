<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item label="请求IP">
            <el-input
              v-model="searchForm.ipText"
              placeholder="请输入IP地址"
              style="width: 150px"
              size="small"
              @keyup.enter.native="loadData"
            ></el-input>
          </el-form-item>
          <el-form-item label="日志内容">
            <el-input
              v-model="searchForm.content"
              placeholder="请输入日志内容"
              style="width: 600px"
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
        <el-table-column
          prop="id"
          label="日志ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ip"
          label="请求IP"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="username" label="昵称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.delFlag == 0">{{ scope.row.username }}</span>
            <span v-else style="color:#000;font-weight:900">用户已注销</span>
            {{ scope.row.delFlag == 0 ? scope.row.username : '用户已注销'}}
          </template>
        </el-table-column> -->
        <el-table-column prop="requestUrl" label="请求地址" align="center">
        </el-table-column>
        <el-table-column prop="requestParam" label="请求参数" align="center">
        </el-table-column>
        <el-table-column
          width="800"
          prop="logContent"
          label="日志内容"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.createTime) }}
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
import { formatSS } from "@/utils/datetime";
export default {
  data() {
    return {
      searchForm: {
        ipText: "",
        content: ""
      },
      tableData: [],
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  computed: {
    isDisabled() {
      return !!this.allocForm.id;
    }
  },
  methods: {
    loadData() {
      let params = {};
      params.pageNo = this.page.currentPage;
      params.pagesize = this.page.pagesize;
      if (this.searchForm.ipText) {
        params.ip = this.searchForm.ipText;
      }
      if (this.searchForm.content) {
        params.logContent = this.searchForm.content;
      }
      axios
        .request({
          method: "post",
          url: "/log/findAllLog",
          data: params
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.tableData = ret.data.data;
            this.page.total = ret.data.total;
          }
        });
    },
    //时间格式化
    dateFormat(row) {
      return formatSS(row);
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
