<template>
  <el-tabs class="paperOperation" v-model="current">
    <el-tab-pane label="下载次数" name="first">
      <div style="margin: 50px">
        下载次数配置  
        <span style="margin:0 5px 0 20px;font-size:20px" v-if="!visible">{{limit}}次</span>   
        <el-button size="mini" type="primary" v-if="!visible" @click="visible = !visible">修改</el-button>
        <el-input v-if="visible" v-model="editLoadNum"  @input="editLoadNum = editLoadNum.replace(/[^0-9]/g, '');" 
          size="mini" @keyup.enter.native="doEditSure" style="width:100px;margin-left:20px"></el-input>
        <el-button v-if="visible" type="primary" size="mini" @click="doEditSure">确定</el-button>
        <el-button v-if="visible" type="primary" size="mini" @click="visible = !visible" style="margin-left:0">取消</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="下载白名单" name="second">
      <el-form :inline="true" class="demo-form-inline" size="small" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="mobile" placeholder="请输入完整手机号" style="width: 150px" size="small" 
           @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search" size="small"></el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button @click="handleAdd" size="small">添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" v-loading="loading.tableLoading" border
      :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
        <el-table-column label="昵称" prop="pwlUsername" align="center"></el-table-column>
        <el-table-column label="手机号" prop="pwlMobile" align="center"></el-table-column>
        <el-table-column label="学校" prop="pwlSchool" align="center"></el-table-column>
        <el-table-column label="添加时间" prop="pwlModifyTime" align="center" :formatter="formatDate"></el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDel(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div  class="right-footer-first">
          从 {{(page.currentPage - 1) * page.pagesize + 1}} 到 {{(page.currentPage - 1) * page.pagesize + dataList.length}} 记录，共 {{page.total}} 条
        </div>
        <el-pagination layout="prev, pager, next, jumper" background :total="page.total" :current-page.sync="page.currentPage" :page-size="page.pagesize" @current-change="loadData"></el-pagination>
      </div>
    </el-tab-pane>
    <el-dialog title="添加成员" :visible.sync="isMemberShow" :modal-append-to-body="false" width="600px">
      <el-form :model="userForm" :rules="userRules" ref="userForm" @submit.native.prevent>
        <el-form-item prop="mobile" style="margin:0 20%;">
          <span>请输入需添加九斗用户手机号</span>
          <el-input v-model="userForm.mobile" style="width:250px;" @input="userForm.mobile = userForm.mobile.replace(/[^0-9]/g, '');"
          size="small" type="tel" autocomplete="off" @keyup.enter.native="handleSearchUser" :maxlength=11>
          </el-input>
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearchUser"></el-button>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSelect">
        <div v-if="userResult.uid">
          <div class="info">
            <img v-if="userResult.pic" :src="userResult.pic">
            <img v-else src="@/assets/images/userPic.png" >
            <div class="username">{{userResult.username}}</div>
            <div>{{userResult.mobile}}</div>
          </div>
        </div>
        <div v-else style="text-align:center;">该用户不存在，请先注册九斗账号</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddMember" :disabled="disBtn">提交</el-button>
        <el-button @click="isMemberShow = false">取消</el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>

<style lang="scss">
.paperOperation {
  .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    background: none;
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
  }
  .el-tabs__content {
    background: white;
    margin: 22px 23px;
    padding: 10px 20px;
    min-height: 700px;
    border-radius: 5px;
  }
  .result {
    height: 80px;
    margin-top: 30px;
    .info {
      height: 80px;
      line-height: 80px;
      width: 60%;
      margin: 0 auto;
      overflow: hidden;
      img {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        float: left;
        vertical-align: middle;
      }
      .username {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div {
        float: left;
        height: 80px;
        margin-left: 15px;
      }
    }
    .name {
      float: left;
      margin-left: 15px;
      padding-top: 20px;
    }
    .no-result {
      margin: 0 auto;
      text-align: center;
      padding-top: 30px;
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import { format } from "@/utils/datetime";
export default {
  components: {},
  data() {
    return {
      current: "first",
      visible: false,
      limit: 3, //显示下载次数
      editLoadNum: 3, // 修改下载次数
      dataList: [],
      loading: {
        tableLoading: false,
      },
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      mobile: "",
      isMemberShow: false,
      userForm: {
        mobile: ""
      },
      userResult: {},
      disBtn: true,
      userRules: {
        mobile: [
          { required: true, message: "请输入正确手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      },
      isSelect: false
    };
  },
  mounted() {
    this.loadData()
    this.loadNum();
  },
  methods: {
    //确定修改此处
    doEditSure() {
      axios
        .request({
          method: "post",
          url: "/tiku/v4/paper/setLimit",
          data: {
           limit: this.editLoadNum
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.visible = !this.visible;
            this.limit = this.editLoadNum;
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        })
        .catch(() => {
         this.$message({
              type: 'warning',
              message: "服务器请求错误,请稍后重试"
            })
        });
    },
    // 时间
    formatDate(row) {
      if (row.pwlModifyTime) {
        return format(row.pwlModifyTime);
      }
    },
    //获取下载次数
    loadNum() {
      axios
        .request({
          method: "post",
          url: "/tiku/v4/paper/getLimit"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.limit = ret.data.limit;
            this.editLoadNum = ret.data.limit
          }
        })
        .catch(() => {
          this.limit = 3;
        });
    },
    //加载table数据
    loadData() {
      this.loading.tableLoading = true
      let data = {}
      data.page = this.page.currentPage
      data.pageSize = this.page.pagesize
      data.mobile = this.mobile
       axios.request({
         method: 'post',
         url: '/tiku/v4/paperWhiteList/findByPage',
         data: data
       }).then(data => {
         this.loading.tableLoading = false
         let res = data.data;
         if (res.code == 200) {
           this.dataList = res.data.data
           this.page.total = res.data.total
         }else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
       })
    },
    search() {
      this.page.currentPage = 1;
      this.loadData()
    },
    //添加
    handleAdd() {
      this.userForm.mobile = ''
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
      this.userResult = {}
      this.isSelect = false
      this.disBtn = true
      this.isMemberShow = true
    },
    // 查找用户
    handleSearchUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/user/userInfoByMobile",
              data: {
                mobile: this.userForm.mobile
              }
            })
            .then(res => {
              let ret = res.data;
              this.isSelect = true;
              if (ret.code === 200) {
                this.disBtn = false;
                this.userResult = ret.data;
              } else {
                this.disBtn = true;
                this.userResult = {};
              }
            })
            .catch(() => {
              this.disBtn = true;
              this.$message({
                type: "warning",
                message: "添加服务不可用!"
              });
            });
        } else {
          this.disBtn = true;
          this.isSelect = false;
        }
      });
    },
    //确定添加用户
    doAddMember() {
      if (this.userResult.uid) {
        axios
          .request({
            method: "post",
            url: "/tiku/v4/paperWhiteList/add",
            data: {
              userId: this.userResult.uid,
              mobile: this.userResult.mobile,
              username: this.userResult.username,
              school: this.userResult.school
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.page.currentPage = 1;
              this.loadData(true)
              this.isMemberShow = false;
            } else {
              this.$message({
                type: "info",
                message: ret.msg
              });
            }
          });
      } else {
        this.$message({
          type: "warning",
          center: true,
          message: "请先查找用户"
        });
      }
    },
    //移除白名单
    handleDel(row) {
      this.$confirm('此操作将移除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/tiku/v4/paperWhiteList/remove',
          data: {
            pwlId: row.pwlId
          }
        }).then((res) => {
          let ret = res.data
          if (ret.code === 200) {
            this.$message({
              type: 'success',
              message: ret.msg
            });
            this.loadData()
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '该服务不可用'
        })
      })
    }
  }
};
</script>
