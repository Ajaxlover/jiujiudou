<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <!-- <el-select v-model="delFlag" size="small" style="width: 120px" placeholder="请选择" @change="loadData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-select
          v-model="status"
          size="small"
          style="width: 120px"
          placeholder="请选择"
          @change="loadData"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="keyWord"
          size="small"
          autocomplete="off"
          @keyup.enter.native="loadData"
          placeholder="书名"
          style="width: 200px"
        ></el-input>
        <!-- <el-input v-model="mobile" size="small" autocomplete="off" @keyup.enter.native="loadData" placeholder="手机号" style="width: 200px"></el-input> -->
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="loadData()"
        ></el-button>
        <!-- <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addRole()">添加</el-button>
        </el-row> -->
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
        <!-- <el-table-column prop="id" label="ID" align="center"></el-table-column> -->
        <el-table-column
          prop="tname"
          label="书名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="page"
          label="书名/页码"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="反馈内容"
          align="center"
        ></el-table-column>
        <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.correctUrl"
              :preview-src-list="[scope.row.correctUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="反馈时间"
          align="center"
          width="150"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" size="small" v-if="scope.row.status === 0"
              >未处理</el-tag
            >
            <el-tag type="success" size="small" v-else>已处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.status === 0"
              @click="addRole(scope.row)"
              >处理</el-button
            >
            <el-button
              type="text"
              size="small"
              v-else
              @click="editRole(scope.row)"
              >查看处理</el-button
            >
            <!-- <el-button type="text" size="small" @click="deleteApi(scope.row)">删除</el-button> -->
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
      <el-dialog
        :visible.sync="dialogFormVisible"
        :modal-append-to-body="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ roleForm.id === 0 ? "查看处理" : "处理处理" }}</div>
          </div>
        </template>
        <el-form
          :model="roleForm"
          :rules="rules"
          ref="roleForm"
          label-width="100px"
          size="small"
          style="margin:0 30px"
        >
          <el-form-item label="附件：" prop="name">
            <el-image
              style="width: 60px; height: 60px;boder:1px solid red"
              :src="roleForm.correctUrl"
              :preview-src-list="[roleForm.correctUrl]"
            >
            </el-image>
          </el-form-item>
          <el-form-item label="反馈内容：">
            {{ roleForm.content }}
          </el-form-item>
          <el-form-item label="反馈时间：">
            {{ creatFormat(roleForm.createTime) }}
          </el-form-item>
          <el-form-item label="处理内容：" prop="dealContent">
            <strong v-if="roleForm.id === 0">{{ roleForm.dealContent }}</strong>
            <el-input
              v-else
              type="textarea"
              v-model="roleForm.dealContent"
              rows="5"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            type="primary"
            @click="submitForm('roleForm')"
            v-if="roleForm.id !== 0"
            >确定</el-button
          >
          <el-button size="small" @click="dialogFormVisible = false"
            >关 闭</el-button
          >
        </div>
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
      tableData: [],
      dialogFormVisible: false,
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      ebookPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      roleForm: {
        id: 0,
        correctUrl: "",
        content: "",
        createTime: [],
        dealContent: ""
      },
      options: [
        {
          label: "有效",
          value: 0
        },
        {
          label: "无效",
          value: 1
        }
      ],
      statusOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "已处理",
          value: 1
        },
        {
          label: "未处理",
          value: 0
        }
      ],
      rules: {
        dealContent: [
          { required: true, message: "请输入处理内容", trigger: "blur" }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      keyWord: "",
      delFlag: 0,
      status: "",
      mobile: ""
    };
  },
  methods: {
    creatFormat(date) {
      return format(date);
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return format(date);
    },
    loadData() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/ebook/ebCorrect/list",
          data: {
            keyword: this.keyWord,
            status: this.status,
            mobile: this.mobile,
            pageNo: this.page.currentPage,
            pageSize: this.page.pagesize
          }
        })
        .then(res => {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          let url = "/ebook/ebCorrect/revert";
          params.id = this.roleForm.id;
          params.revertContent = this.roleForm.dealContent;
          axios
            .request({
              method: "post",
              url: url,
              data: params
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.dialogFormVisible = false;
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.loadData();
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        } else {
          return false;
        }
      });
    },
    addRole(row) {
      this.roleForm.id = row.id;
      this.roleForm.correctUrl = row.correctUrl;
      this.roleForm.content = row.content;
      this.roleForm.createTime = row.createTime;
      this.roleForm.dealContent = "";
      this.dialogFormVisible = true;
    },
    editRole(row) {
      this.roleForm.id = 0;
      this.roleForm.correctUrl = row.correctUrl;
      this.roleForm.content = row.content;
      this.roleForm.createTime = row.createTime;
      this.roleForm.dealContent = row.revertContent;
      this.dialogFormVisible = true;
    },
    deleteApi(row) {
      this.$confirm("此操作将删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/ebRule/delete",
              data: {
                id: row.id
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    center: true,
                    message: ret.msg
                  });
                  this.loadData();
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {
          console.log("已取消删除");
        });
    },
    // 启用禁用
    statusChange(row) {
      let text = "启用";
      if (row.status === 1) {
        text = "禁用";
      }
      this.$confirm("此操作将" + text + "该规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/ebRule/isValid",
              data: {
                id: row.id
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    center: true,
                    message: ret.msg
                  });
                  this.loadData();
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {
          console.log("已取消");
        });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style lang="scss">
.el-table td,
.el-table th {
  padding: 3px 0;
}
</style>
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
      overflow: hidden;
      margin-bottom: 13px;
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>
