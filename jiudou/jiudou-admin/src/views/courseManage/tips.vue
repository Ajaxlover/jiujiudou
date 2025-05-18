<template>
  <div class="tips">
    <el-container>
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{ courseName }}</el-breadcrumb-item>
          <el-breadcrumb-item>知识点管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-container>
        <div class="left-container">
          <div class="left-header">
            <span>一级知识点列表</span>
            <i class="el-icon-plus" @click="handleAddOne"></i>
          </div>
          <el-tree
            icon-class="el-icon-arrow-right"
            :data="list"
            :props="defaultProps"
            node-key="tipId"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            accordion
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                style="max-width: 110px;overflow: hidden;text-overflow: ellipsis;"
                >{{ node.label }}</span
              >
              <span>
                <editPopover
                  @onSelected="popoverClick"
                  :bank="data"
                  :hasShare="false"
                ></editPopover>
              </span>
            </span>
          </el-tree>
        </div>
        <el-main>
          <el-card class="first-card">
            <div class="headItems">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
              >
                <el-form-item label="">
                  <el-input
                    size="small"
                    v-model="formInline.keywords"
                    placeholder="请输入二级知识点关键字"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-search"
                    @click="onSubmit"
                  ></el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="handleAddTwo"
                    >新建二级知识点</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <el-card>
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
                label="二级知识点"
                align="center"
                width="200px"
                prop="name"
              ></el-table-column>
              <el-table-column label="更新时间" align="center">
                <template slot-scope="scope">
                  <span>{{
                    format(scope.row.addTime, "YYYY-MM-DD H:mm:ss")
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="200px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleEditTwo(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(scope.row)"
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
        </el-main>
      </el-container>
    </el-container>
    <!-- 新增1级知识点 -->
    <el-dialog
      :visible.sync="isAddShow.isAddShowOne"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建一级知识点</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        ref="addFormOne"
        :rules="rules"
        :model="addFormOne"
        style="margin:20px 70px;"
      >
        <el-form-item label="一级知识点" prop="name">
          <el-input
            size="small"
            v-model="addFormOne.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelOne('addFormOne')"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="doAddOne('addFormOne')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 新增2级 -->
    <el-dialog
      :visible.sync="isAddShow.isAddShowTwo"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>新建二级知识点</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        ref="addFormTwo"
        :rules="rules2"
        :model="addFormTwo"
        style="margin:20px 70px;"
      >
        <el-form-item label="一级知识点">
          <el-select
            size="small"
            v-model="addFormTwo.parentId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in list"
              :label="item.label"
              :key="item.tipId"
              :value="item.tipId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级知识点" prop="name">
          <el-input
            size="small"
            v-model="addFormTwo.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelTwo('addFormTwo')"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="doAddTwo('addFormTwo')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑1级 -->
    <el-dialog
      :visible.sync="isEditShow.isEditShowOne"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>编辑一级知识点</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        :rules="rules"
        ref="editFormOne"
        :model="editFormOne"
        style="margin:20px 70px;"
      >
        <el-form-item label="一级知识点" prop="name">
          <el-input
            size="small"
            v-model="editFormOne.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isEditShow.isEditShowOne = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="doEditOne('editFormOne')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑2级 -->
    <el-dialog
      :visible.sync="isEditShow.isEditShowTwo"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>编辑二级知识点</div>
        </div>
      </template>
      <el-form
        label-width="120px"
        ref="editFormTwo"
        :rules="rules2"
        :model="editFormTwo"
        style="margin:20px 70px;"
      >
        <el-form-item label="一级知识点">
          <el-select
            size="small"
            v-model="editFormTwo.parentId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in list"
              :label="item.label"
              :key="item.tipId"
              :value="item.tipId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级知识点" prop="name">
          <el-input
            size="small"
            v-model="editFormTwo.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isEditShow.isEditShowTwo = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="doEditTwo('editFormTwo')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import editPopover from "../publication/popver.vue";
import moment from "moment";
export default {
  components: {
    editPopover
  },
  data() {
    return {
      currentEditRow: {},
      formInline: {
        keywords: ""
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      list: [],
      page: 1,
      pageSize: 5,
      total: 0,
      data: [],
      parentId: "",
      isAddShow: {
        isAddShowOne: false,
        isAddShowTwo: false
      },
      addFormOne: {
        name: ""
      },
      addFormTwo: {
        parentId: "",
        name: ""
      },
      isEditShow: {
        isEditShowOne: false,
        isEditShowTwo: false
      },
      editFormOne: {
        name: ""
      },
      editFormTwo: {
        parentId: "",
        name: "",
        tipId: ""
      },
      rules: {
        name: [
          { required: true, message: "一级知识点不能为空", trigger: "blur" }
        ]
      },
      rules2: {
        name: [
          { required: true, message: "二级知识点不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.loadList();
  },
  computed: {
    courseName() {
      return this.$route.query.courseName;
    }
  },
  methods: {
    // 编辑2级知识点
    handleEditTwo(row) {
      this.isEditShow.isEditShowTwo = true;
      this.editFormTwo.name = row.name;
      this.editFormTwo.parentId = row.parentId;
      this.editFormTwo.tipId = row.tipId;
    },
    doEditTwo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/chapterTip/update",
              data: {
                courseId: this.$route.query.courseId,
                subjectId: this.$route.query.subjectId,
                name: this.editFormTwo.name,
                parentId: this.editFormTwo.parentId,
                id: this.editFormTwo.tipId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `更新成功`
                });
                this.isEditShow.isEditShowTwo = false;
                this.loadList();
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
    // 编辑1级知识点
    handleEditOne(row) {
      this.currentEditRow = row;
      this.isEditShow.isEditShowOne = true;
      this.editFormOne.name = row.label;
    },
    doEditOne(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/chapterTip/update",
              data: {
                courseId: this.$route.query.courseId,
                subjectId: this.$route.query.subjectId,
                name: this.editFormOne.name,
                id: this.currentEditRow.tipId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `更新成功`
                });
                this.isEditShow.isEditShowOne = false;
                this.loadList();
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
    // 新增一级知识点
    handleAddOne() {
      this.isAddShow.isAddShowOne = true;
      this.addFormOne.name = "";
    },
    doAddOne(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/chapterTip/insert",
              data: {
                courseId: this.$route.query.courseId,
                subjectId: this.$route.query.subjectId,
                name: this.addFormOne.name
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `新建成功`
                });
                this.isAddShow.isAddShowOne = false;
                this.loadList();
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
    cancelOne(formName) {
      this.isAddShow.isAddShowOne = false;
      this.$refs[formName].resetFields();
    },
    // 新增二级知识点
    handleAddTwo() {
      if (this.list.length == 0) {
        this.$message({
          type: "warning",
          message: `请先创建一级知识点`
        });
        return;
      }
      this.isAddShow.isAddShowTwo = true;
      this.addFormTwo.parentId = this.list[0].tipId;
      this.addFormTwo.name = "";
    },
    doAddTwo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/subject/chapterTip/insert",
              data: {
                courseId: this.$route.query.courseId,
                subjectId: this.$route.query.subjectId,
                name: this.addFormTwo.name,
                parentId: this.addFormTwo.parentId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: `新建二级知识点成功`
                });
                this.isAddShow.isAddShowTwo = false;
                this.loadList();
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
    cancelTwo(formName) {
      this.isAddShow.isAddShowTwo = false;
      this.$refs[formName].resetFields();
    },
    handleNodeClick(data) {
      this.parentId = data.tipId;
      this.loadData();
    },
    // 获取一级知识点列表
    loadList() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/listWithCount",
          data: {
            parentId: 0,
            courseId: this.$route.query.courseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data.length > 0) {
              this.parentId = ret.data.data[0].tipId;
              let middleArr = [];
              ret.data.data.forEach(item => {
                middleArr.push({
                  tipId: item.tipId,
                  label: item.name,
                  children: []
                });
              });
              this.list = middleArr;
              this.loadData();
            }
          }
        });
    },
    // 获取表格数据
    loadData() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/listWithCount",
          data: {
            parentId: this.parentId,
            courseId: this.$route.query.courseId,
            page: this.page,
            pagesize: this.pageSize,
            name: this.formInline.keywords
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.data = ret.data.data;
            this.total = ret.data.total;
          }
        });
    },
    // 搜索
    onSubmit() {
      this.loadData();
    },
    popoverClick(index, bank) {
      if (index == "1") {
        this.handleEditOne(bank);
      } else {
        this.handleDelete(bank);
      }
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
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除知识点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/subject/chapterTip/delete",
            data: {
              tipId: row.tipId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: `${ret.msg}`
              });
              this.loadList();
            }
          });
      });
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tips {
  background-color: #fff;
  .el-header {
    background-color: #fff;
    color: #333;
    height: 48px;
    display: flex;
    align-items: center;
  }

  .left-container {
    padding-left: 10px;
    max-width: 182px;
    min-width: 182px;
    border-radius: 4px;
    min-height: 638px;
    background: #ffffff;
    overflow: hidden;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .custom-tree-name {
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-tree-node__children .custom-tree-name {
      max-width: 96px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-tree-node__children .el-tree-node__children .custom-tree-name {
      max-width: 78px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-tree-node__content {
      height: 46px;
      border-bottom: 1px solid #eaeaea !important;
    }
    .left-header {
      background: #2ba1f4;
      height: 46px;
      line-height: 46px;
      padding-left: 10px;
      padding-right: 10px;
      color: white;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      i {
        display: flex;
        align-items: center;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .el-submenu__title {
      height: 46px !important;
      line-height: 46px !important;
      padding-left: 40px;
      border-bottom: 1px solid #eaeaea !important;
      border-bottom-color: #eaeaea !important;
      .el-submenu__icon-arrow {
        left: 15px;
        right: 155px;
      }
      div {
        padding: 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-submenu .el-menu-item {
      min-width: 100%;
      padding-right: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /*菜单关闭*/
    .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotateZ(-90deg);
      color: #c0c4cc;
    }
    /*菜单展开*/
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(0deg);
      -ms-transform: rotate(0deg);
      transform: rotateZ(0deg);
    }
    .el-menu-item {
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #eaeaea;
    }
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    height: 638px;
    margin-left: 10px;
    .first-card {
      margin-bottom: 10px;
      .el-card__body {
        padding: 20px 20px 0 20px;
      }
    }
  }
}
</style>
