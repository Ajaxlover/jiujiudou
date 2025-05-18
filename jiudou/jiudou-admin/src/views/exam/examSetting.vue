<template
  ><div>
    <el-container>
      <el-main>
        <div>
          <el-header>
            <span style="margin-right:20px">人数设置</span>
            <el-input
              style="width:150px"
              size="small"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model.trim="stuNum"
              placeholder="请输入人数"
            ></el-input>
            <el-input
              style="width:150px"
              size="small"
              v-model.trim="price"
              placeholder="请输入金额"
            ></el-input>
            <el-button size="small" @click="addRule" type="primary"
              >新增</el-button
            >
          </el-header>
          <div class="rule-list">
            <el-tag
              v-for="(tag, index) in configList"
              @close="closeTag(tag)"
              :key="index"
              closable
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <div class="class-setting">
            <span>班级设置</span>
            <div>
              <el-input
                size="small"
                v-model.trim="className"
                placeholder="请输入班级名称"
                style="width: 250px"
                @keyup.enter.native="searchClass"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-search"
                @click="searchClass"
              ></el-button>
            </div>
          </div>

          <div class="class-list">
            <el-table
              :data="classList"
              border
              :header-cell-style="{
                'background-image':
                  'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                color: '#333333',
                height: '40px',
                padding: '0'
              }"
              :row-style="{ height: '60px' }"
              v-loading="loading.tableLoading"
            >
              <el-table-column
                prop="className"
                label="班级名称"
                align="center"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                prop="teacherName"
                label="创建人"
                align="center"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                prop="stuNum"
                label="班级人数"
                align="center"
                min-width="200"
              >
              </el-table-column>
              <el-table-column label="是否收费" align="center" width="auto">
                <template slot-scope="scope">
                  <el-switch
                    @change="payChange(scope.row)"
                    v-model="scope.row.switchStatus"
                  ></el-switch>
                </template>
              </el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div class="right-footer-first">
                从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
                {{
                  (this.page.currentPage - 1) * this.page.pagesize +
                    this.classList.length
                }}
                记录，共 {{ page.total }} 条
              </div>
              <el-pagination
                layout="prev, pager, next, jumper"
                background
                :total="page.total"
                :current-page.sync="page.currentPage"
                :page-size="page.pagesize"
                @current-change="getClassList"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";

export default {
  data() {
    return {
      isOn: false,
      className: "",
      stuNum: "",
      price: "",
      configList: [],
      classList: [],
      loading: {
        tableLoading: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      }
    };
  },
  methods: {
    payChange(row) {
      let { classId } = row;
      axios
        .request({
          method: "post",
          url: "/exam/exam/config/updateClassChargeStatus",
          data: {
            classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.getClassList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    addRule() {
      if (!this.stuNum || !this.price) {
        this.$message({
          type: "warning",
          message: "请输入人数或金额"
        });
        return;
      }

      axios
        .request({
          method: "post",
          url: "/exam/exam/config/addConfig",
          data: {
            examCount: this.stuNum,
            price: this.price
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.stuNum = "";
            this.price = "";
            this.getConfigList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    closeTag(tag) {
      let { configId } = tag;
      this.$confirm("是否删除?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/config/delConfig",
              data: {
                configId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getConfigList();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    searchClass() {
      this.page.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      this.loading.tableLoading = true;
      let data = {};
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.className) {
        data.searchWord = this.className;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/config/getClassConfigList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.classList = ret.data.records;
            this.classList.forEach(item => {
              item.switchStatus = item.status == 1;
            });
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getConfigList() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/config/getChargeConfigList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.configList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    }
  },
  mounted() {
    this.getConfigList();
    this.getClassList();
  }
};
</script>

<style lang="scss" scoped>
.el-main {
  margin: 20px;
  background: #ffffff;
  border-radius: 4px;
  min-height: 700px;
  padding-top: 12px;
  padding-left: 18px;
  padding-right: 18px;
  padding-bottom: 12px;
  .el-header {
    line-height: 60px;
  }
  .rule-list {
    width: 100%;
    // background-color: red;
    padding-left: 20px;
    margin-bottom: 20px;
    .el-tag {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .class-setting {
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .class-list {
    padding-left: 20px;
  }
  .top {
    overflow: hidden;
    .left-form {
      float: left;
    }
    .operateBtn {
      float: right;
    }
  }
  .main {
    margin-top: 13px;
    .el-header {
      line-height: 60px;
    }

    .info {
      padding: 0px 10px;
      overflow: hidden;
      text-align: left;
      .left {
        float: left;
        img {
          width: 157.4px;
          height: 86px;
          display: block;
        }
      }
      .middle {
        margin-left: 18px;
        float: left;
        .name {
          font-weight: bold;
          font-size: 14px;
          color: #333333;
          span:first-child {
            // border:1px solid #2BA1F4;
            // color:#2BA1F4;
            // font-weight:normal;
            // padding: 2px 5px;
            // font-size: 12px;
            // border-radius: 10px;
            // margin-right: 10px;
            cursor: pointer;
          }
          // span:nth-child(2){
          //   cursor: pointer;
          // }
        }
        .cloudId {
          margin-top: 5px;
          font-size: 14px;
          color: #666666;
        }
        .price {
          color: #ff783d;
          margin-top: 6px;
          font-weight: 600;
        }
      }
      .courseTime {
        float: right;
        font-size: 14px;
        margin-right: 20px;
        color: #999999;
        line-height: 86px;
      }
      .right {
        float: right;
        line-height: 86px;
        margin-right: 50px;
        color: #2ba1f4;
      }
    }
    tbody tr td:nth-child(3) {
      font-size: 12px;
      color: #999999;
    }
    tbody tr td:nth-child(2) {
      color: #666666;
    }
  }
}
</style>
