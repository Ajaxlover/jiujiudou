<template>
  <el-container class="myResource">
    <el-main>
      <div class="tabelHeader">
        <el-select
          v-model="delFlag"
          size="small"
          style="width: 120px"
          placeholder="请选择"
          @change="loadData"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          style="width: 200px"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="loadData()"
        ></el-button>
        <el-row class="operateBtn">
          <el-button type="primary" size="small" @click="addRole()"
            >添加</el-button
          >
        </el-row>
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
        <!-- <el-table-column prop="id" label="折扣ID" align="center"></el-table-column> -->
        <el-table-column
          prop="name"
          label="折扣名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ratio"
          label="折扣比例"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="bindEbook(scope.row)"
              >绑定</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="bindEbookList(scope.row)"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="statusChange(scope.row)"
              >{{ scope.row.status === 0 ? "启用" : "禁用" }}</el-button
            >
            <el-button type="text" size="small" @click="deleteApi(scope.row)">{{
              scope.row.delFlag === 0 ? "删除" : "恢复"
            }}</el-button>
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
            <div>{{ roleForm.id === 0 ? "添加折扣" : "编辑折扣" }}</div>
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
          <el-form-item label="折扣名称" prop="name">
            <el-input v-model="roleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="折扣比例" prop="ratio">
            <el-input
              type="number"
              v-model="roleForm.ratio"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="折扣期限" prop="time">
            <el-date-picker
              v-model="roleForm.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="timestamp"
              :picker-options="pickerOptions"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            type="primary"
            @click="submitForm('roleForm')"
            >{{ roleForm.id === 0 ? "立即创建" : "立即编辑" }}</el-button
          >
          <el-button size="small" @click="dialogFormVisible = false"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <!-- 绑定电子书 -->
      <el-dialog
        :visible.sync="bindEbookVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="820px"
        :destroy-on-close="true"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ isbindEbook ? "" : "已" }}绑定电子书</div>
          </div>
        </template>
        <div class="top" style="margin-bottom: 10px;margin-top:-15px">
          <el-input
            size="small"
            v-model="searchForm.keyWord"
            placeholder="搜索书名、作者、书号"
            style="width: 320px"
            @keyup.enter.native="ebookList"
          ></el-input>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="ebookList"
          ></el-button>
        </div>
        <div class="main">
          <el-table
            :data="textbookData"
            border
            :row-style="{ height: '50px' }"
            v-loading="loading"
            max-height="400"
            @selection-change="handleSelectionChange"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column type="selection" v-if="isbindEbook" width="40">
            </el-table-column>
            <el-table-column
              prop="tname"
              label="书名"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="tbNum"
              label="书号"
              align="center"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              align="center"
              width="120"
            >
            </el-table-column>
            <!-- <el-table-column prop="uid" label="创建者" align="center" width="170">
              <template slot-scope="scope" v-if="scope.row.uid">
                {{scope.row.created}}({{scope.row.creatorMobile}})
              </template>
            </el-table-column> -->
            <el-table-column
              prop="pubDate"
              label="更新时间"
              align="center"
              width="150"
              :formatter="dateFormat"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <div slot-scope="scope" v-if="!isbindEbook">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteBindEbook(scope.row)"
                  >删除</el-button
                >
              </div>
            </el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div class="right-footer-first">
              从
              {{
                (this.ebookPage.currentPage - 1) * this.ebookPage.pagesize + 1
              }}
              到
              {{
                (this.ebookPage.currentPage - 1) * this.ebookPage.pagesize +
                  this.textbookData.length
              }}
              记录，共 {{ ebookPage.total }} 条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              background
              :total="ebookPage.total"
              :current-page.sync="ebookPage.currentPage"
              :page-size="ebookPage.pagesize"
              @current-change="loadData"
            ></el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="small"
            v-if="isbindEbook"
            type="primary"
            @click="bindForm()"
            >绑定</el-button
          >
          <el-button size="small" @click="bindEbookVisible = false"
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
        name: "",
        ratio: "",
        time: []
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
          label: "禁用",
          value: 0
        },
        {
          label: "启用",
          value: 1
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        ratio: [{ required: true, message: "请输入折扣比例", trigger: "blur" }],
        time: [{ required: true, message: "请输入折扣时间", trigger: "blur" }]
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
      status: 1,
      bindEbookVisible: false,
      loading: false,
      searchForm: {
        keyWord: ""
      },
      textbookData: [],
      handleSelection: [],
      isbindEbook: true
    };
  },
  computed: {
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    }
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property];
      return format(date);
    },
    loadData() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/ebook/ebRule/list",
          data: {
            name: this.keyWord,
            delFlag: this.delFlag,
            status: this.status,
            pageNo: this.page.currentPage,
            pageSize: this.page.pagesize,
            pubId: this.pubId
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
          let url = "/ebook/ebRule/insert";
          params.pubId = this.$store.state.user.currentRole.pubId;
          if (this.roleForm.id !== 0) {
            url = "/v1/role/modify";
            params.id = this.roleForm.id;
          }
          params.name = this.roleForm.name;
          params.ratio = this.roleForm.ratio;
          params.startTime = this.roleForm.time[0];
          params.endTime = this.roleForm.time[1];
          console.log(params);
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
    addRole() {
      this.roleForm.id = 0;
      this.roleForm.name = "";
      this.roleForm.time = [];
      this.roleForm.ratio = "";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    editRole(row) {
      this.roleForm.id = row.id;
      this.roleForm.name = row.name;
      this.roleForm.ratio = row.ratio;
      this.roleForm.time = [];
      this.roleForm.time.push(row.startTime);
      this.roleForm.time.push(row.endTime);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    deleteApi(row) {
      this.$confirm("此操作将删除该规则, 是否继续?", "提示", {
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
    },
    // 绑定电子书
    bindEbook(row) {
      this.textbookData = [];
      this.isbindEbook = true;
      this.roleForm.id = row.id;
      this.bindEbookVisible = true;
      this.ebookList();
    },
    // 查看电子书
    bindEbookList(row) {
      this.textbookData = [];
      this.isbindEbook = false;
      this.roleForm.id = row.id;
      this.bindEbookVisible = true;
      this.ebookList();
    },
    ebookList(value) {
      this.loading = true;
      let params = {};
      params.pageNo = this.ebookPage.currentPage;
      params.pageSize = this.ebookPage.pagesize;
      params.keyword = this.searchForm.keyWord;
      let url = "";
      if (this.isbindEbook) {
        // url = "/ebook/ebook/list";
        url = "/ebook/ebRule/queryCanBindBookPage";
        params.pubId = this.$store.state.user.currentRole.pubId;
      } else {
        url = "/ebook/ebRule/bindBooklist";
        params.id = this.roleForm.id;
      }
      axios
        .request({
          method: "post",
          url: url,
          data: params
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.textbookData = ret.data.records;
            this.ebookPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    handleSelectionChange(val) {
      this.handleSelection = val;
    },
    bindForm() {
      let params = {};
      params.id = this.roleForm.id;
      params.bindJsonStr = [];
      for (let item of this.handleSelection) {
        params.bindJsonStr.push({
          bookId: item.id,
          bookType: item.type
        });
      }
      console.log(params);
      axios
        .request({
          method: "post",
          url: "/ebook/ebRule/ebookBingRule",
          data: params
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              center: true,
              message: ret.msg
            });
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    deleteBindEbook(row) {
      axios
        .request({
          method: "post",
          url: "/ebook/ebRule/delBingRule",
          data: {
            ebRuleRelativeId: row.ebRuleRelativeId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              center: true,
              message: ret.msg
            });
            this.ebookList();
          } else {
            this.$message({
              type: "warning",
              center: true,
              message: ret.msg
            });
          }
        });
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
      overflow: hidden;
      margin-bottom: 13px;
      .operateBtn {
        float: right;
      }
    }
  }
}
</style>
