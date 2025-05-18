<template>
  <el-container class="applePayEnv">
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <el-input
              placeholder="请输入版本名称"
              style="width: 150px"
              size="medium"
              v-model="searchForm.appName"
              @keyup.enter.native="loadData"
            ></el-input>
            <el-input
              placeholder="请输入版本号"
              style="width: 150px"
              size="medium"
              v-model="searchForm.appVersion"
              @keyup.enter.native="loadData"
            ></el-input>
            <!-- <el-select
              v-model="searchForm.type"
              style="width:110px;"
              size="medium"
              @change="onChange"
            >
              <el-option value="" label="全部"></el-option>
              <el-option value="0" label="学生端"></el-option>
              <el-option value="1" label="教师端"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="loadData"
              size="medium"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="addVersion"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading.listLoading"
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
          prop="name"
          label="APK名称"
          align="center"
        ></el-table-column>
        <el-table-column
          label="文件路径"
          prop="filepath"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="版本"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="versionname"
          label="版本号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isforceupdate"
          label="是否强制更新"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="medium"
              v-if="scope.row.isforceupdate === 0"
              >强制更新</el-tag
            >
            <span v-else>非强制更新</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="versionDesc"
          label="版本描述"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="releaseTime"
          :formatter="formatDate"
          label="发布时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editVersion(scope.row)" size="small"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="tableData.length" class="right-footer-first">
          从 {{ (page.page - 1) * page.pageSize + 1 }} 到
          {{ (page.page - 1) * page.pageSize + tableData.length }} 记录，共
          {{ page.total }} 条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :total="page.total"
          :page-size="page.pageSize"
          :current-page.sync="page.page"
          @current-change="loadData"
        ></el-pagination>
      </div>
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ isEdit === 0 ? "添加" : "修改" }}</div>
          </div>
        </template>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          style="margin:0 40px;"
          size="small"
        >
          <!-- <el-form-item label="版本类型">
            <el-radio-group v-model="form.type">
              <el-radio label="0">学生端</el-radio>
              <el-radio label="1">教师端</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="APK名称" prop="appName">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item label="文件路径" prop="filePath">
            <el-input v-model="form.filePath"></el-input>
          </el-form-item>
          <el-form-item label="版本" prop="code">
            <el-input
              placeholder="请输入数字,如60"
              v-model="form.code"
            ></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="appVersion">
            <el-input
              placeholder="请输入数字和英文符号，如4.3.0"
              v-model="form.appVersion"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否强制更新">
            <el-switch
              active-color="#13ce66"
              v-model="form.isForceUpdate"
            ></el-switch>
          </el-form-item>
          <el-form-item label="版本描述">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="addSure"
            size="small"
            :loading="loading.addSureLoading"
            >确定</el-button
          >
          <el-button size="small" type="default" @click="dialogVisible = false"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<style lang="scss">
.applePayEnv {
  width: 100%;
  padding: 20px;
  .el-main {
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px;
    .tabelHeader {
      overflow: hidden;
      .operateBtn {
        // float: right;
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
      tableData: [],
      isEdit: 0,
      dialogVisible: false,
      loading: {
        listLoading: false,
        addSureLoading: false
      },
      form: {
        id: "",
        type: "0",
        appName: "",
        filePath: "",
        code: "",
        isForceUpdate: false,
        appVersion: "",
        desc: ""
      },
      searchForm: {
        appName: "",
        appVersion: "",
        type: ""
      },
      page: { page: 1, pageSize: 10, total: 0 },
      rules: {
        filePath: [{ required: true, message: "apk路径", trigger: "blur" }],
        code: [{ required: true, message: "请输入版本", trigger: "blur" }],
        appVersion: [
          { required: true, message: "请输入版本号", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    onChange() {
      this.page.page = 1;
      this.loadData();
    },
    loadData() {
      let { page, pageSize } = this.page;
      this.loading.listLoading = true;
      let params = {};
      params.page = page;
      params.pageSize = pageSize;
      params.type = this.searchForm.type;
      if (this.searchForm.appName) {
        params.name = this.searchForm.appName;
      }
      if (this.searchForm.appVersion) {
        params.versionname = this.searchForm.appVersion;
      }
      axios
        .request({
          method: "post",
          url: "/platform/apk/list",
          data: params
        })
        .then(res => {
          this.loading.listLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.tableData = ret.data.data;
            this.page.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.listLoading = false;
        });
    },
    addVersion() {
      if (this.$refs["form"]) {
        this.$refs["form"].clearValidate();
        this.form.appName = "";
        this.form.appVersion = "";
        this.form.code = "";
        this.form.filePath = "";
        this.form.id = "";
        this.form.desc = "";
        this.form.isForceUpdate = false;
        this.form.type = "0";
      }
      this.isEdit = 0;
      this.dialogVisible = true;
    },
    addSure() {
      let url = "/platform/apk/insert";
      let params = {};
      params.name = this.form.appName;
      params.filepath = this.form.filePath;
      params.versionname = this.form.appVersion;
      params.code = this.form.code;
      params.versionDesc = this.form.desc;
      params.isforceupdate = this.form.isForceUpdate === true ? 0 : 1;
      // params.type = this.form.type;

      if (this.isEdit) {
        url = "/platform/apk/update";
        params.id = this.form.id;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url,
              data: params
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.dialogVisible = false;
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "error",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    editVersion(row) {
      this.isEdit = 1;
      this.dialogVisible = true;
      let {
        code,
        filepath,
        id,
        isforceupdate,
        name,
        type,
        versionname,
        versionDesc
      } = row;
      this.form.id = id;
      this.form.type = String(type);
      this.form.appName = name;
      this.form.appVersion = versionname;
      this.form.filePath = filepath;
      this.form.desc = versionDesc;
      this.form.isForceUpdate = isforceupdate === 0;
      this.form.code = code;
    },
    formatDate(row) {
      return format(Number(row.releaseTime));
    }
  }
};
</script>
