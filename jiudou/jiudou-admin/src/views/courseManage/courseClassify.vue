<template>
  <div class="lessonClassify">
    <el-header style="height:50px">课程分类</el-header>
    <el-card>
      <div class="headItems">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="课程分类">
            <el-input
              size="small"
              v-model="formInline.sname"
              placeholder="课程分类"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="onSubmit"
              size="small"
            ></el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleAdd"
              >新建课程分类</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="data"
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
          label="课程分类"
          align="center"
          width="100px"
          prop="sname"
        ></el-table-column>
        <el-table-column
          label="云端分类名"
          prop="servername"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          label="vod分类ID"
          prop="serverid"
          align="center"
        ></el-table-column> -->
        <el-table-column label="更新时间" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{ format(scope.row.updated, "YYYY-MM-DD H:mm:ss") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="data.length" class="right-footer-first">
          从{{ (page - 1) * pageSize + 1 }}到{{
            (page - 1) * pageSize + data.length
          }}记录，共{{ total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev,sizes,pager,next,jumper"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="page"
          :page-sizes="[5, 10, 15]"
          background
        ></el-pagination>
      </div>
    </el-card>
    <!-- 新增 -->
    <el-dialog
      :visible.sync="isAddShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建课程分类</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        :rules="rules"
        ref="addForm"
        :model="addForm"
        style="margin:20px 70px;"
      >
        <el-form-item label="课程分类" prop="sname">
          <el-input
            size="small"
            v-model="addForm.sname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="云端分类名称" prop="servername">
          <el-input
            size="small"
            v-model="addForm.servername"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('addForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="doAdd('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      :visible.sync="isEditShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>编辑课程分类</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        :rules="rules"
        ref="editForm"
        :model="editForm"
        style="margin:20px 70px;"
      >
        <el-form-item label="课程分类" prop="sname">
          <el-input
            size="small"
            v-model="editForm.sname"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="云端分类名称" prop="servername">
          <el-input
            size="small"
            v-model="editForm.servername"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isEditShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doEdit('editForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import moment from "moment";
export default {
  data() {
    return {
      formInline: {
        sname: ""
      },
      addForm: {
        sname: "",
        servername: ""
      },
      editForm: {
        subjectId: 0,
        sname: "",
        servername: ""
      },
      data: [],
      page: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      isAddShow: false,
      isEditShow: false,
      rules: {
        sname: [
          { required: true, message: "课程分类不能为空", trigger: "blur" }
        ],
        servername: [
          { required: true, message: "云端分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    onSubmit() {
      this.loadData();
    },
    loadData() {
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/subject/subject/listWithCount",
          data: {
            sname: this.formInline.sname,
            page: this.page,
            pagesize: this.pageSize
          }
        })
        .then(res => {
          this.loading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.data = ret.data.data;
            this.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 新增
    handleAdd() {
      this.isAddShow = true;
      this.addForm.sname = "";
      this.addForm.servername = "";
    },
    doAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/subject/insert",
              data: {
                sname: this.addForm.sname,
                servername: this.addForm.servername
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `新建成功`
                });
                this.isAddShow = false;
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: `${ret.msg}`
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.isAddShow = false;
      this.$refs[formName].resetFields();
    },
    // 编辑
    handleEdit(index, row) {
      this.isEditShow = true;
      this.editForm.subjectId = row.id;
      this.editForm.sname = row.sname;
      this.editForm.servername = row.servername;
    },
    doEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { subjectId, sname, servername } = this.editForm;
          axios
            .request({
              method: "post",
              url: "/subject/subject/update",
              data: {
                id: subjectId,
                sname,
                servername
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `更新成功`
                });
                this.isEditShow = false;
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: `${ret.msg}`
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/subject/subject/delete",
            data: {
              subjectId: row.id
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: `${ret.msg}`
              });
              this.loadData();
            }
          });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.loadData();
    },
    // 格式化时间
    format(time, format) {
      if (time) {
        let iDate = parseInt(time);
        return moment(iDate).format(format);
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.lessonClassify {
  width: 100%;
  .el-header {
    padding-left: 52px;
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .el-card {
    .headItems {
      display: flex;
      align-items: center;
    }
  }
}
</style>
