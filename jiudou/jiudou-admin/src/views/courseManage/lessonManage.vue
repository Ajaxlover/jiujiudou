<template>
  <div class="lessonManage">
    <el-header style="height:50px">课程管理</el-header>
    <el-card>
      <div class="headItems">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="课程分类">
            <el-select
              size="small"
              clearable
              @change="onSelect"
              v-model="formInline.subjectId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in list"
                :label="item.sname"
                :key="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAdd"
              >新建课程</el-button
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
          label="课程名称"
          align="center"
          width="300px"
          prop="courseName"
        ></el-table-column>
        <el-table-column
          label="课程分类"
          align="center"
          width="100px"
          prop="subjectName"
        ></el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            <span>{{ format(scope.row.addTime, "YYYY-MM-DD H:mm:ss") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="500px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="handleTips(scope.row)"
              >知识点管理</el-button
            >
            <el-button size="mini" type="text" @click="handleDelete(scope.row)"
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
          :page-sizes="[10, 20, 30]"
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
          <div>新建课程</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        :rules="rules"
        ref="addForm"
        :model="addForm"
        style="margin:20px 70px;"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            size="small"
            v-model="addForm.courseName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="subjectId">
          <el-select
            size="small"
            v-model="addForm.subjectId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in list"
              :label="item.sname"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
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
          <div>编辑课程</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        :rules="rules"
        ref="editForm"
        :model="editForm"
        style="margin:20px 70px;"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            size="small"
            v-model="editForm.courseName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="subjectId">
          <el-select
            size="small"
            v-model="editForm.subjectId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in list"
              :label="item.sname"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
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
        subjectId: ""
      },
      addForm: {
        courseName: "",
        subjectId: 0
      },
      editForm: {
        subjectId: 0,
        courseName: "",
        courseId: ""
      },
      list: [],
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      isAddShow: false,
      isEditShow: false,
      rules: {
        courseName: [
          { required: true, message: "课程名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadList();
    this.loadData();
  },
  methods: {
    onSelect(val) {
      this.formInline.subjectId = val;
      this.page = 1;
      this.loadData();
    },
    // 获取分类列表
    loadList() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listAll"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.list = ret.data;
            this.addForm.subjectId = this.list[0].id;
          }
        });
    },
    // 获取表格
    loadData() {
      this.loading = true;
      axios
        .request({
          method: "post",
          url: "/subject/course/listWithCount",
          data: {
            subjectId: this.formInline.subjectId,
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
      this.addForm.courseName = "";
    },
    doAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/course/insert",
              data: {
                courseName: this.addForm.courseName,
                subjectId: this.addForm.subjectId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `新建成功`
                });
                this.page = 1;
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
    handleEdit(row) {
      this.isEditShow = true;
      this.editForm.subjectId = row.subjectId;
      this.editForm.courseName = row.courseName;
      this.editForm.courseId = row.courseId;
    },
    doEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let { subjectId, courseName, courseId } = this.editForm;
          axios
            .request({
              method: "post",
              url: "/subject/course/update",
              data: {
                subjectId,
                courseName,
                courseId
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
    handleDelete(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/subject/course/delete",
            data: {
              courseId: row.courseId
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
    handleTips(row) {
      window.open(
        `tips?courseId=${row.courseId}&subjectId=${row.subjectId}&courseName=${row.courseName}`,
        "newwindow",
        "height=800, width=1000, top=100,left=400, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
      );
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
.lessonManage {
  width: 100%;
  .el-header {
    padding-left: 52px;
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 10px;
    .el-card {
      .headItems {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
