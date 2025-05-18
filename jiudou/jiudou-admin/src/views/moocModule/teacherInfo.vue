<template>
  <div class="teacherInfo">
    <el-divider content-position="left">课程负责人</el-divider>
    <div v-for="item in teacherTeam" :key="item.id" v-if="item.isMajor === 1" style="margin-bottom:50px">
      <div style="width:110px;text-align:center">
        <el-avatar class="avatarImg" v-if="item.userPic" :src="item.userPic"></el-avatar>
        <el-avatar class="avatarImg" v-else icon="el-icon-user-solid"></el-avatar>
        <p class="text-ellipsis">{{item.userName}}</p>
      </div>
    </div>
    <el-divider content-position="left">老师</el-divider>
    <div v-for="item in teacherTeam" :key="item.memberId" v-if="item.isMajor === 0" class="avatar-div">
      <el-avatar class="avatarImg" :src="item.userPic"></el-avatar>
      <p class="text-ellipsis">{{item.userName}}</p>
      <el-button size="mini" type="danger" class="close-btn" @click="deleteTeacher(item)" icon="el-icon-close" circle></el-button>
    </div>
    <div style="overflow: hidden;width:110px;text-align:center;display:inline-block;cursor:pointer;" @click="handleAdd" title="添加老师">
      <el-avatar class="avatarImg" icon="el-icon-plus"></el-avatar>
      <p>&nbsp</p>
    </div>
    <el-dialog title="添加老师" :visible.sync="isMemberShow" :modal-append-to-body="false" width="600px">
      <el-form :model="userForm" :rules="userRules" ref="userForm" @submit.native.prevent>
        <el-form-item prop="mobile" style="margin:0 20%;">
          <span>请输入需添加九斗用户手机号</span>
          <el-input v-model="userForm.mobile" style="width:250px;margin: 10px 0" @input="userForm.mobile = userForm.mobile.replace(/[^0-9]/g, '');"
          size="medium" type="tel" autocomplete="off" @keyup.enter.native="handleSearchUser" :maxlength=11>
          </el-input>
          <el-button type="primary" size="medium" icon="el-icon-search" @click="handleSearchUser"></el-button>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSelect" style="text-align:center;">
        <div v-if="userResult.uid">
          <div class="info">
            <img v-if="userResult.pic" :src="userResult.pic" style="width:100px;border-radius:50%;">
            <img v-else src="@/assets/images/userPic.png" style="width:100px;border-radius:50%;">
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
  </div>
</template>
<script>
import axios from "@/libs/api.request"
export default {
  components: {
  },
  props: {
    ccourseId: '',
    nextStepSave: ''
  },
  data() {
    return {
      currentCourseId: '',
      teacherTeam: [],
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
    }
  },
  watch: {
    ccourseId(value) {
      if (value && value != this.currentCourseId) {
        this.currentCourseId = value
        this.loadCourseDetail()
      }
    }
  },
  methods: {
    loadCourseDetail(id) {
      this.currentCourseId = id
      axios.request({
        method: 'post',
        url: 'openccourse/ccourseTeacher/list',
        data: {
          courseId: this.currentCourseId,
          pageNo: 1,
          pageSize: 10,
        }
      }).then(res => {
        let ret = res.data
        if (ret.code === 200) {
          this.teacherTeam = ret.data.records
        }
      })
    },
    //添加
    handleAdd() {
      this.userForm.mobile = ''
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
      let isYou = false
      this.teacherTeam.forEach((item, index, array) => {
        if (item.uid == this.userResult.uid) {
          isYou = true
        }
      })
      console.log(this.userResult.uid)
      if(isYou) {
        this.$message({
          type: "success",
          message: "不能重复添加！"
        });
        return
      }
      if (this.userResult.uid) {
        axios
          .request({
            method: "post",
            url: "/openccourse/ccourseTeacher/insert",
            data: {
              userId: this.userResult.uid,
              courseId: this.currentCourseId,
              isMajor: 0
            }
          })
          .then(res => {
            console.log(res)
            let ret = res.data;
            if (ret.code === 200) {
              this.loadCourseDetail(this.currentCourseId)
              this.isMemberShow = false;
              this.$message({
                type: "success",
                message: "添加成功"
              });
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
    deleteTeacher(item) {
      this.$confirm('<div>是否确定删除这位老师( ' + item.userName + ' )？</div>删除后将无法恢复', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        axios.request({
          method: 'post',
          url: '/openccourse/ccourseTeacher/delete',
          data: {
            id: item.id
          }
        }).then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadCourseDetail(this.currentCourseId)
            this.$message({
                type: "success",
                message: "删除成功"
              });
          } else {
            this.$message({
              type: "info",
              message: ret.msg
            });
          }
        })
      }).catch(() => {
      })
    }
  },
  beforeDestroy() {
  },
  mounted() {
  }
}
</script>
<style lang="scss">
.teacherInfo{
  background: #ffffff;
  min-height: 680px;
  padding: 30px 80px;
  .sub-tabs {
    .el-tab-pane {
      padding-left: 100px;
      .el-form-item__content {
        padding-right: 180px;
      }
    }
  }
  .saveBookInfo{
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
  .courseTag{
    .el-tag{
      margin-right: 10px;
      margin-bottom: 5px;
    }
    .el-tag + .el-tag {
      margin-right: 10px;
    }
    .button-new-tag {
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
    }
    .input-new-tag {
      width: 190px;
      margin-top: 5px;
      vertical-align: bottom;
    }
  }
  .avatar-div{
    position:relative;
    width:110px;
    text-align:center;
    display:inline-block;
    cursor: pointer;
  }
  .avatar-div:hover .close-btn{
    display: block;
  }
  .close-btn{
    position:absolute;
    right: 0px;
    top: 0px;
    display:none;  
  }
  .avatarImg{
    width: 70px;
    height:70px;
    line-height:70px;
    font-size:30px
  }
  .text-ellipsis{
    width:110px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
