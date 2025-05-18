<template>
  <el-container class="myResource">
    <el-header style="height: 50px">
      成员管理
    </el-header>
    <el-main>
      <div class="title">机构名称 : {{pubInfo.pubName}}</div>
      <div class="manager">机构管理员: {{pubInfo.managerName}} ({{pubInfo.managerMobile}})</div>
      <div class="label" style="overflow: hidden">
        <span class="icon"></span>
        <span class="text">机构成员管理</span>
        <el-button type="primary" size="small" @click="showAdd()" style="float: right">添加</el-button>
      </div>
      <jscroll ref="myScroll" :on-pull="onPull" style="height: 500px">
        <div slot="scrollList">
          <el-table :data="memberData" v-loading="isLoadingData" :show-header="false" :row-style="{height:'80px'}">
            <el-table-column align="center" width="150">
              <div slot-scope="scope" class="members">
                <div class="pic">
                  <img v-if="scope.row.userpic" :src="scope.row.userpic" alt="">
                  <img v-else src="@/assets/images/userPic.png" alt="">
                </div>
              </div>
            </el-table-column>
            <el-table-column prop="username" width="200"></el-table-column>
            <el-table-column prop="mobile" width="200"></el-table-column>
            <el-table-column align="center" prop="roleIds" :formatter="formatMemberRole"></el-table-column>
            <el-table-column prop="addTime" :formatter="formatDate"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="scope.row.mobile != pubInfo.managerMobile" @click="handleEditMember(scope.row)">修改</el-button>
                <el-button type="text" size="small" v-if="scope.row.mobile != pubInfo.managerMobile" @click="handleDelMember(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </jscroll>
    </el-main>
    <el-dialog title="添加成员" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :close-on-click-modal=false>
      <el-form :model="userForm" :rules="userRules" ref="userForm" @submit.native.prevent>
        <el-form-item prop="mobile" style="margin:0 20%;">
          <span>请输入需添加九斗用户手机号</span>
          <el-input v-model="userForm.mobile" style="width:250px;" size="small" type="tel" :change="checkMobile()" autocomplete="off" @keyup.enter.native="userInfo"
            :maxlength=11>
          </el-input>
          <el-button type="primary" size="small" icon="el-icon-search" @click="userInfo"></el-button>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSelect">
        <div v-if="userResult.uid">
          <div class="info">
            <img v-if="userResult.pic" :src="userResult.pic">
            <img v-else src="@/assets/images/userPic.png">
            <div class="username">{{userResult.username}}</div>
            <div>{{userResult.mobile}}</div>
          </div>
          <el-form ref="form">
            <el-form-item label="角色" style="margin:20px 20% 0;">
              <el-checkbox-group v-model="memberRole">
                <el-checkbox label="26">编辑</el-checkbox>
                <el-checkbox label="37">发行</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div v-else style="text-align:center;">该用户不存在，请先注册九斗账号</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addMember" :disabled="disBtn">提交</el-button>
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改成员" :visible.sync="dialogEdit" :modal-append-to-body="false" :close-on-click-modal=false>
      <div class="result">
        <div class="info">
          <img v-if="currentRole.userpic" :src="currentRole.userpic">
          <img v-else src="@/assets/images/userPic.png">
          <div class="username">{{currentRole.username}}</div>
          <div>{{currentRole.mobile}}</div>
        </div>
        <el-form ref="form">
          <el-form-item label="角色" style="margin:20px 20% 0;">
            <el-checkbox-group v-model="editMemberRole">
              <el-checkbox label="26">编辑</el-checkbox>
              <el-checkbox label="37">发行</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="doSureEdit">确定</el-button>
        <el-button size="small" @click="dialogEdit = false">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request"
import { format } from '@/utils/datetime'
import jscroll from '@/components/jscroll'
export default {
  components: {
    jscroll
  },
  data () {
    return {
      pubInfo: {},
      isLoadingData: false,
      memberData: [],
      isSelect: false,
      page: {
        total: 0,
        pagesize: 7,
        currentPage: 1,
        hasNext: true
      },
      dialogFormVisible: false,
      userForm: {
        mobile: ''
      },
      userResult: {},
      memberRole: [],
      disBtn: true,
      userRules: {
        mobile: [
          { required: true, message: '请输入正确手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确手机号码', trigger: 'blur' }
        ]
      },
      dialogEdit: false,
      currentRole: {},
      editMemberRole: [],
    }
  },
  methods: {
    // 时间
    formatDate(row) {
      if(row.addTime) {
        return format(row.addTime)
      }
    },
    loadPubInfo() {
      axios.request({
        method: 'post',
        url: '/v1/publishing/info'
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.pubInfo = ret.data
        } else {
          this.$message({
            type: 'info',
            center: true,
            message: ret.msg
          })
        }
      })
    },
    loadData(isReload) {
      if (!this.isLoadingData) {
        this.isLoadingData = true
        axios.request({
          method: 'post',
          url: '/v1/pubMember/listWithCount',
          data: {
            page: this.page.currentPage,
            pagesize: this.page.pagesize
          }
        }).then(res => {
          let ret = res.data
          if (ret.code === 200) {
            if (isReload) {
              this.memberData = ret.data.data
            } else {
              this.memberData = this.memberData.concat(ret.data.data)
            }
            if (ret.data.data.length < this.page.pagesize) {
              this.page.hasNext = false
            } else {
              this.page.currentPage++
              this.page.hasNext = true
            }
          } else {
            this.$message({
              type: 'info',
              center: true,
              message: ret.msg
            })
          }
          this.isLoadingData = false
        })
      }
    },
    showAdd() {
      this.userForm.mobile = ''
      this.isSelect = false
      this.disBtn = true
      this.userResult = {}
      this.memberRole = []
      this.dialogFormVisible = true
    },
    addMember() {
      if (this.userResult.uid) {
        if(this.userResult.mobile == this.pubInfo.managerMobile) {
          this.$message({
            type: 'warning',
            center: true,
            message: '该用户已经存在'
          })
          return
        }
        if(this.memberRole.length == 0) {
          this.$message({
            type: 'warning',
            center: true,
            message: '请选择成员角色'
          })
          return
        }
        axios.request({
          method: 'post',
          url: '/v1/pubMember/addMember',
          data: {
            userId: this.userResult.uid,
            mobile: this.userResult.mobile,
            username: this.userResult.username,
            pic: this.userResult.pic,
            roleIds: this.memberRole.join(',')
          }
        }).then(res => {
          let ret = res.data
          if (ret.code === 200) {
            this.page.currentPage = 1
            this.loadData(true)
            this.dialogFormVisible = false
          } else {
            this.$message({
              type: 'warning',
              center: true,
              message: ret.msg
            })
          }
        })
      } else {
        this.$message({
          type: 'warning',
          center: true,
          message: '请先查找用户'
        })
      }
    },
    userInfo() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          axios.request({
            method: 'post',
            url: '/v1/user/userInfoByMobile',
            data: {
              mobile: this.userForm.mobile
            }
          }).then(res => {
            let ret = res.data
            this.isSelect = true
            if (ret.code === 200) {
              this.disBtn = false
              this.userResult = ret.data
            }else{
              this.disBtn = true
              this.userResult = {}
            }
          }).catch(() => {
            this.disBtn = true
            this.$message({
              type: 'warning',
              message: '添加服务不可用!'
            });
          })
        }else{
          this.disBtn = true
          this.isSelect = false
        }
      })
    },
    // 成员角色
    formatMemberRole(row) {
      let str = row.roleIds
      if(row.roleIds) {
        str = str.replace("25", "机构管理员").replace("26", "编辑").replace("37", "发行")
        return str
      }else{
        return '暂未设置'
      }
    },
    //编辑成员
    handleEditMember(row) {
      this.currentRole = row
      this.editMemberRole = this.currentRole.roleIds.split(",")
      this.dialogEdit = true
    },
    //确定修改成员身份
    doSureEdit() {
      if(this.editMemberRole.length == 0) {
        this.$message({
          type: 'warning',
          center: true,
          message: '请选择成员角色'
        })
        return
      }
      let url = ''
      let data = {}
      if(this.currentRole.roleIds.split(",").length == 2 && this.editMemberRole.length == 2) {
        this.dialogEdit = false
        return
      }
      if(this.currentRole.roleIds.split(",").length == 2 && this.editMemberRole.length == 1) {
        url = '/book/v4/memberRole/delMemberRoleByPubIdUidAndRoleId'
        this.currentRole.roleIds.split(",").forEach(element => {
          if(element != this.editMemberRole.join(',')) {
            data.oldRoleId = element
            data.orgUid = this.currentRole.uid
          }
        })
      }
      if(this.currentRole.roleIds.split(",").length == 1 && this.editMemberRole.length == 1) {
        url = '/book/v4/memberRole/updMemberRoleByPubIdUidAndRoleId'
        if(this.currentRole.roleIds == this.editMemberRole[0]) {
          this.dialogEdit = false
          return
        }else{
          data.orgUid = this.currentRole.uid
          data.oldRoleId = this.currentRole.roleIds
          data.newRoleId = this.editMemberRole[0]
        }
      }
      if(this.currentRole.roleIds.split(",").length == 1 && this.editMemberRole.length == 2) {
        url = '/book/v4/memberRole/insMemberRoleByPubIdUidAndRoleId'
        data.orgUid = this.currentRole.uid
        this.editMemberRole.forEach(element => {
          if(element != this.currentRole.roleIds) {
            data.roleId = element
          }
        })
      }
      axios.request({
        method: 'post',
        url: url,
        data: data
      }).then(res => {
        let ret = res.data
        if(ret.code == 200) {
          this.$message({
            type: 'success',
            message: ret.msg
          })
          this.page.currentPage = 1
          this.loadData(true)
          this.dialogEdit = false
        }else{
          this.$message({
            type: 'warning',
            message: ret.msg
          })
        }
      })
    },
    //删除成员
    handleDelMember(row) {
      this.$confirm('删除成员后，该成员上传的数据会保留。该成员将无法访问机构里的相关数据。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/v1/pubMember/removeMember',
          data: {
            userId: row.uid
          }
        }).then(res => {
          this.$message({
            type: 'success',
            center: true,
            message: '删除成功!'
          })
          this.page.currentPage = 1
          this.loadData(true)
        })
      }).catch(() => {
      })
    },
    onPull() { //加载回调
      if (this.page.hasNext) {
        this.loadData()
      } else {
      }
    },
    checkMobile() {
      this.userForm.mobile = this.userForm.mobile.replace(/[^0-9]/g, '');
    }
  },
  mounted() {
    this.loadPubInfo()
    this.loadData()
  }
}
</script>

<style scoped lang="scss">
.el-header{
  background: #ffffff;
  line-height: 50px;
  padding-left: 52px;
  padding-right: 52px;
}
.el-main{
  margin: 20px;
  background: #ffffff;
  border-radius: 4px;
  min-height: 638px;
  padding-top: 31px;
  padding-left: 41px; 
  padding-right: 41px;
  .title{
    font-family: PingFangSC-Medium;
    font-size: 28px;
    color: #333333;
  }
  .manager{
    margin-top: 15px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
  }
  .label{
    margin-top: 38px;
    margin-bottom: 18px;
    .icon{
      float: left;
      margin-right: 11px;
      background: #2BA1F4;
      width: 3px;
      height: 18px;
      font-size: 18px;
      color: #333;
      margin-top: 4px;
    }
    .text{
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #333333;
    }
  }
  .my-scroll{
    border: 1px solid #becfd9;
  }
  .members{
    .pic{
      img{
        height: 56px !important;
        width: 56px !important;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    .name{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      
    }
    .mobile{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      overflow: hidden;
    }
    .time{
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      overflow: hidden;
    }
    .operate{
      overflow: hidden;
      padding-top: 25.5px;
      padding-right: 135px;
      .el-button{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #2D66A0;
        float: right;
      }
    }
    .item:last-child {
      border-bottom: 1px solid #BECBD9;
    }
  }
  .tabelHeader{
    overflow: hidden;
    margin-bottom: 13px;
    .operateBtn{
      float: right;
    }
  }
}
.result{
  // height: 80px;
  margin-top: 30px;
  .info{
    height: 80px;
    line-height: 80px;
    width: 60%;
    margin: 0 auto;
    overflow: hidden;
    img{
      height: 80px;
      width: 80px;
      border-radius: 50%;
      float: left;
      vertical-align: middle;
    }
    .username{
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    div{
      float: left;
      height: 80px;
      margin-left: 15px;
    }
  }
  .name{
    float: left;
    margin-left: 15px;
    padding-top: 20px;
  }
  .no-result{
    margin: 0 auto;
    text-align: center;
    padding-top: 30px;
  }
}
</style>
