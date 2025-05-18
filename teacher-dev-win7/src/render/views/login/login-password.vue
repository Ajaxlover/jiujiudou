<template>
  <div class="login-password-container">
    <h3 class="login-title">教师登录</h3>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item prop="userName" style="margin-bottom: 30px">
        <el-input placeholder="请输入账号" clearable v-model="ruleForm.userName" autocomplete="off">
          <template #prefix>
            <img :src="usernameIcon" class="username-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pass" style="margin-bottom: 30px">
        <el-input placeholder="请输入密码" clearable v-model="ruleForm.pass" type="password" autocomplete="off">
          <template #prefix>
            <img :src="passwordIcon" class="password-icon" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="login-pre-action">
          <div class="login-pre-action_left">
            <div class="action-box" @click="handleSetLogin('autoLogin')">
              <img :src="autoLogin?selecttrue:selectfalse">
              <span>自动登录</span>
            </div>
            <div class="action-box"  @click="handleSetLogin('rememberPassword')">
              <img :src="rememberPassword?selecttrue:selectfalse">
              <span>记住密码</span>
            </div>
          </div>
          <div class="login-pre-action_right" @click="handleOpenReset">
              <span>重置密码</span>
          </div>
        </div> -->
    <div class="submit-btn" @click="onSubmit">登 录</div>
    <!-- <div class="submit-btn" @click="onSubmit" v-else>下 线</div> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
// 引入本地图片方法
import { imgLocalUrl } from "@/render/utils/imgLocalUrl";
// 引入store
import { useLoginStore } from "@/render/store/modules/login";
import { useAppStore } from "@/render/store/modules/app";
import { useCache } from "@/render/hooks/useCache";
const { wsCache } = useCache("localStorage");

import { useRouter } from "vue-router";
const router = useRouter();
// 引入icon
// const usernameIcon = imgLocalUrl("@/assets/login/username.png");
const usernameIcon = new URL(
  "./../../assets/login/username.png",
  import.meta.url
).href;
// const passwordIcon = imgLocalUrl("@/assets/login/password.png");
const passwordIcon = new URL(
  "./../../assets/login/password.png",
  import.meta.url
).href;

const selecttrue = imgLocalUrl("@/assets/login/selecttrue.png");
const selectfalse = imgLocalUrl("@/assets/login/selectfalse.png");
import { loginApi } from "@/render/api/login";

// 使用store
const loginStore = useLoginStore();
const appStore = useAppStore();
// 引入store登陆设置
const autoLogin = computed(() => {
  return loginStore.loginSetting.autoLogin;
});
const rememberPassword = computed(() => {
  return loginStore.loginSetting.rememberPassword;
});

const ruleFormRef = ref<FormInstance>();
// 设置记住密码、自动登录等
const handleSetLogin = (e: String) => {
  loginStore.setLoginSetting(e);
};
// 表单提交
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const validateUserName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else if (value.length > 15) {
    callback(new Error("超出最大15个字符长度"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  userName: "",
  pass: "",
});

const rules = reactive({
  userName: [{ validator: validateUserName, trigger: "blur" }],
  pass: [{ validator: validatePass, trigger: "blur" }],
});

const isLogin = ref(true);
const onSubmit = () => {
  // window.electronAPI.openRestPassword(isLogin.value);
  // isLogin.value = !isLogin.value;
  // ElMessage.success(isLogin ? "登录成功" : "退出登录");
  // handleToLogin();

  // router.push({
  //   path: "/",
  //   query: {
  //     username: ruleForm.userName,
  //     pw: ruleForm.pass,
  //   },
  // });
  // return;
  const loading = ElLoading.service({
    lock: true,
    text: "登录中，请稍等",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const result: any = loginApi({
    username: ruleForm.userName,
    password: ruleForm.pass,
    client: 4,
    token: false,
    uid: "",
  });
  result.then((res: any) => {
    console.log(res);
    if (res.code === 200 && res.data) {
      appStore.setUserInfor(res.data);
      // handleOpenReset();
      const user_type = res.data.user.type;
      if (user_type === 0) {
        setTimeout(() => {
          router.push({
            path: "/",
            query: {
              username: ruleForm.userName,
              pw: ruleForm.pass,
            },
          });
        }, 300);
        setTimeout(() => {
          loading.close();
        }, 1500);
      } else {
        setTimeout(() => {
          loading.close();
          ElMessage.error("您的登陆身份不正确");
        }, 1000);
      }
    } else {
      loading.close();
      ElMessage.error("考试未开始");
    }
  }).catch(() => {
    loading.close();
  });
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      handleToLogin();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleToLogin = () => {
  wsCache.set("login", true, { exp: 100 });
  window.electronAPI.setLogin("登陆成功");
};
// 打开重置密码
const handleOpenReset = () => {
  window.electronAPI.openRestPassword();
};

onMounted(() => {
  window.electronAPI.queryLocalIP().then((res: any) => {
    const _ip = "http://" + res + ":35872";
    sessionStorage.setItem("ipLocal", _ip)
  })
})
</script>

<style lang="scss" scoped>
.login-password-container {
  padding: 50px;
  background: #ffffff;
  border-radius: 13px;
  box-shadow: 2px 3px 4px 5px #eee;

  .login-title {
    margin: 0 0 30px 0;
  }

  :deep(.el-form-item__error) {
    color: red;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  :deep(.el-input) {
    width: 360px;
    height: 44px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 0;
  }

  .username-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
  }

  .password-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
  }

  .submit-btn {
    cursor: pointer;
    text-align: center;
    width: 360px;
    height: 44px;
    line-height: 44px;
    // background: linear-gradient(180deg, #FFDE00 0%, #FEAB1A 100%);
    // box-shadow: 2px 3px 6px 0px #EA2437;
    background: #3678ca;
    border-radius: 2px;
    font-size: 14px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
  }

  .submit-btn:hover {
    opacity: 0.8;
  }

  .login-pre-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;

    .login-pre-action_left {
      display: flex;
      align-items: center;

      .action-box {
        display: flex;
        align-items: center;
        margin-right: 28px;
        cursor: pointer;

        img {
          width: 16px;
          height: 16px;
          display: block;
          margin-right: 8px;
        }

        span {
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }

    .login-pre-action_right {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
    }

    .login-pre-action_right:hover {
      opacity: 0.8;
    }
  }
}
</style>
