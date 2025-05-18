<template>
  <el-main>
    <el-form :model="userInfo" ref="userForm" label-width="100px">
      <el-form-item label="昵称" prop="username">
        <el-input v-model="userInfo.username"></el-input>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-input v-model="userInfo.school"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="number">
        <el-input v-model="userInfo.number"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="userInfo.realName"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="userInfo.mobile" :disabled="true"></el-input>
      </el-form-item>
      <div style="text-align: center;">
        <el-button type="primary" @click="updateProfile">保存信息</el-button>
      </div>
    </el-form>
  </el-main>
</template>

<script>
import axios from "@/libs/api.request";
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    loadData() {
      axios
        .request({
          method: "post",
          url: "/v1/user/fullInfo"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.userInfo = ret.data;
          } else {
            this.$message({
              type: "info",
              center: true,
              message: ret.msg
            });
          }
        });
    },
    updateProfile() {
      axios
        .request({
          method: "post",
          url: "/v1/user/updateInfo",
          data: this.userInfo
        })
        .then(res => {
          let ret = res.data;
          this.$message({
            type: "success",
            center: true,
            message: ret.msg
          });
        });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
