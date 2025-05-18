<template>
  <el-container class="ebPressRecommend">
    <el-header>样书申请</el-header>
    <el-main>
      <el-input
        size="small"
        v-model="phone"
        placeholder="申请人手机号码"
        style="width: 250px;margin-bottom:10px;"
        @keyup.enter.native="loadList"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="loadList"
      ></el-button>
      <el-button
        size="small"
        v-if="selectedRecords.length"
        @click="editClick()"
        style="border-color:#2BA1F4;color:#2BA1F4;float:right;margin-bottom:10px;"
        >批量处理</el-button
      >
      <el-button
        size="small"
        v-if="selectedRecords.length"
        @click="deleteAd()"
        style="border-color:#2BA1F4;color:#2BA1F4;float:right;margin-bottom:10px;"
        >批量删除</el-button
      >
      <el-table
        @selection-change="changeSelect"
        :data="list"
        v-loading="loading.list"
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
        <!-- <el-table-column label="封面" align="center" prop="adCover" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.coverPic" style="width:60px;cursor:pointer" />
          </template>
        </el-table-column> -->
        <el-table-column type="selection" align="center"></el-table-column>

        <el-table-column
          label="样书名称"
          align="center"
          prop="bookName"
        ></el-table-column>
        <el-table-column
          label="申请人"
          align="center"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="手机号"
          align="center"
          prop="phone"
        ></el-table-column>
        <el-table-column
          label="地址"
          align="center"
          prop="address"
        ></el-table-column>
        <el-table-column
          label="书号"
          align="center"
          prop="textbook.tb_num"
        ></el-table-column>
        <el-table-column
          label="出版社"
          align="center"
          prop="textbook.pubName"
        ></el-table-column>
        <el-table-column
          label="学校"
          align="center"
          prop="school"
        ></el-table-column>
        <el-table-column
          label="院系"
          align="center"
          prop="department"
        ></el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
        ></el-table-column>
        <el-table-column label="发布状态" align="center" width="120">
          <template slot-scope="scope">
            <el-tag type="warning" size="medium" v-if="scope.row.status === 0"
              >待处理</el-tag
            >
            <el-tag v-else type="success" size="medium">已处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
          <template slot-scope="scope">{{
            formatTime(scope.row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status == 0"
              size="small"
              @click="editClick(scope.row)"
              >处理</el-button
            >
            <el-button type="text" size="small" @click="deleteAd(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="list.length" class="right-footer-first">
          从{{ (listPage.page - 1) * listPage.pageSize + 1 }}到{{
            (listPage.page - 1) * listPage.pageSize + list.length
          }}记录，共{{ listPage.total }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="listPage.total"
          :page-size="listPage.pageSize"
          :current-page.sync="listPage.page"
          background
          @current-change="loadList"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.ebPressRecommend {
  .el-header {
    height: 50px;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
    background: #ffffff;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 700px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;
  }
  .cover {
    background: #f3f4f5;
    width: 224px;
    height: 350px;
    line-height: 350px;
    font-size: 30px;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid #ccc;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import cropper from "@/components/cropper";
export default {
  components: {
    "jd-dialog": jdialog,
    cropper
  },
  data() {
    return {
      selectedRecords: [],
      list: [],
      loading: {
        list: false,
        sureCropLoading: false,
        editSureLoading: false
      },
      listPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      form: {
        id: 0,
        name: "",
        publishName: "",
        bookStoreUrl: "",
        coverPic: "",
        status: "0"
      },
      rules: {
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        bookStoreUrl: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        coverPic: [
          { required: true, message: "请添加封面", trigger: "change" }
        ],
        publishName: [
          { required: true, message: "请输入出版社名称", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      dialogVisible: {
        addNew: false,
        showCropper: false
      },
      file: null,
      phone: ""
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    changeSelect(val) {
      this.selectedRecords = val;
    },
    loadList() {
      this.loading.list = true;
      axios
        .request({
          method: "post",
          url: "book/styleBook/list",
          data: {
            phone: this.phone,
            pageNo: this.listPage.page,
            pageSize: this.listPage.pageSize
          }
        })
        .then(res => {
          this.loading.list = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.list = ret.data.data;
            this.listPage.total = ret.data.total;
          }
        })
        .catch(() => {
          this.loading.list = false;
        });
    },
    // 新增
    addNew() {
      this.file = null;
      this.form.id = null;
      this.form.name = "";
      this.form.coverPic = "";
      this.form.bookStoreUrl = "";
      this.form.status = "0";
      this.form.publishName = "";
      this.dialogVisible.addNew = true;
      this.loading.editSureLoading = false;
      if (this.$refs.editBanner) {
        this.$refs.editBanner.clearValidate();
      }
    },
    // 处理
    editClick(row) {
      let ids = "";
      if (row) {
        ids = row.id;
      } else {
        this.selectedRecords.forEach(element => {
          ids += `${element.id},`;
        });
      }
      axios
        .request({
          method: "post",
          url: "book/styleBook/update",
          data: {
            ids
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadList();
            this.$message({
              type: "success",
              message: "操作成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 删除
    deleteAd(row) {
      let ids = "";
      if (row) {
        ids = row.id;
      } else {
        this.selectedRecords.forEach(element => {
          ids += `${element.id},`;
        });
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "book/styleBook/delete",
              data: {
                ids
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadList();
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "服务器异常，请稍后重试"
              });
            });
        })
        .catch(() => {});
    },
    cropperClick() {
      this.dialogVisible.showCropper = true;
      this.$nextTick(() => {
        this.$refs.cropper.clear();
      });
    },
    //父组件调用子组件裁剪方法
    toCropper() {
      this.loading.sureCropLoading = true;
      setTimeout(() => {
        if (this.$refs.cropper) {
          this.$refs.cropper.crop();
        }
      }, 100);
    },
    handleCroped(file) {
      if (file) {
        this.file = file;
        this.form.coverPic = URL.createObjectURL(this.file);
        this.loading.sureCropLoading = false;
        this.dialogVisible.showCropper = false;
      } else {
        this.loading.sureCropLoading = false;
      }
    },
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    }
  }
};
</script>
