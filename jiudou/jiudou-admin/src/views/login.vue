<template>
  <div class="login">
    <nav class="login-boxtitle">
      <div class="bx"><img src="@/assets/images/jiudouLogo.png" /></div>
    </nav>
    <div class="login-bx">
      <div v-if="!isRegister" class="login-box">
        <div class="login_form">
          <p class="tp">九斗用户登录</p>
          <el-tabs
            v-model="activeName"
            stretch
            class="tabBox"
            @tab-click="handleTabClick"
          >
            <el-tab-pane label="扫码登录" name="first">
              <div class="qrcode" style="display: block;">
                <div id="code">
                  <vue-qr
                    :text="qrCode"
                    colorDark="#000"
                    colorLight="#fff"
                    :margin="0"
                    :size="200"
                  ></vue-qr>
                </div>
                <div id="mask" ref="mask">
                  <div class="refreshMask">
                    <p>二维码已失效</p>
                    <a href="javascript:;" @click="refreshCode">
                      <i class="el-icon-refresh"></i> 点击刷新
                    </a>
                  </div>
                </div>
                <div>
                  <el-link
                    @click="isRegister = true"
                    :underline="false"
                    type="primary"
                    >无账号，去注册？</el-link
                  >
                </div>
                <div id="codeMsg" ref="codeMsg"></div>
                <p>使用<span>九斗APP</span>扫描登录</p>
                <p style="font-size: 12px; color: red; margin-top: 7px">
                  (如果扫码登录不了,请重新登录手机APP)
                </p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="账号登录" name="second">
              <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                class="demo-ruleForm"
              >
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="ruleForm.username"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入用户名"
                    autocomplete="on"
                    class="userName"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    placeholder="请输入密码"
                    v-model="ruleForm.password"
                    show-password
                    autocomplete="on"
                    type="password"
                    class="password"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="captchCode">
                  <el-row>
                    <el-col :span="13"
                      ><el-input
                        @input="
                          v =>
                            (ruleForm.captchCode = v.replace(
                              /[^\a-\z\A-\Z0-9]/g,
                              ''
                            ))
                        "
                        v-model="ruleForm.captchCode"
                        placeholder="验证码"
                        autocomplete="off"
                        type="text"
                        class="password"
                      ></el-input
                    ></el-col>
                    <el-col :span="11">
                      <img
                        @click.stop="getCaptchCodeImg"
                        style="border:1px solid #DCDFE6;cursor: pointer;margin-left:15px"
                        :src="captchCodeImg"
                        alt=""
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                <p class="setTs">可前往九斗APP-我的-设置，设置密码</p>
                <p class="setTs">
                  <el-link
                    @click="isRegister = true"
                    :underline="false"
                    type="primary"
                    >无账号，去注册？</el-link
                  >
                </p>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click.native.prevent="submitForm"
                    round
                    @keyup.enter.native="submitForm"
                    :loading="isBtnLoading"
                    size="medium"
                    class="loginBtn"
                    >{{ isBtnLoading ? "登录中..." : "登录" }}</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="短信登录" name="third">
              <el-form
                :model="msgRuleForm"
                :rules="msgRules"
                ref="msgRuleForm"
                class="demo-ruleForm"
              >
                <el-form-item prop="phoneNum">
                  <el-input
                    v-model="msgRuleForm.phoneNum"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入手机号码"
                    autocomplete="off"
                    type="text"
                    class="userName"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="msgCode">
                  <el-row>
                    <el-col :span="13"
                      ><el-input
                        v-model="msgRuleForm.msgCode"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        placeholder="短信验证码"
                        autocomplete="off"
                        type="text"
                        class="password"
                      ></el-input
                    ></el-col>
                    <el-col :span="10" :offset="1">
                      <el-button
                        :disabled="delay != 0"
                        @click="getMsgCode"
                        plain
                        >{{
                          delay == 0 ? "获取验证码" : `${delay}s后获取`
                        }}</el-button
                      >
                    </el-col>
                  </el-row>
                </el-form-item>
                <div style="margin-bottom:20px">
                  <el-link
                    @click="isRegister = true"
                    :underline="false"
                    type="primary"
                    >无账号，去注册？</el-link
                  >
                </div>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click.native.prevent="submitMsgForm"
                    round
                    @keyup.enter.native="submitMsgForm"
                    :loading="isBtnLoading"
                    size="medium"
                    class="loginBtn"
                    >{{ isMsgBtnLoading ? "登录中..." : "登录" }}</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div v-if="isRegister" class="login-box">
        <div class="login_form">
          <p class="tp">九斗用户注册</p>
          <el-tabs v-model="registerActive" stretch class="tabBox1">
            <el-tab-pane label="" name="first">
              <el-form
                :model="registerForm"
                :rules="registerRules"
                ref="registerForm"
                class="demo-ruleForm"
              >
                <el-form-item prop="phoneNum">
                  <el-input
                    v-model="registerForm.phoneNum"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入手机号码"
                    autocomplete="off"
                    type="text"
                    class="userName"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="msgCode">
                  <el-row>
                    <el-col :span="13"
                      ><el-input
                        v-model="registerForm.msgCode"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        placeholder="短信验证码"
                        autocomplete="new-password"
                        type="text"
                      ></el-input
                    ></el-col>
                    <el-col :span="10" :offset="1">
                      <el-button
                        :disabled="regDelay != 0"
                        @click="getRegMsgCode"
                        plain
                        >{{
                          regDelay == 0 ? "获取验证码" : `${regDelay}s后获取`
                        }}</el-button
                      >
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="registerForm.password"
                    placeholder="请设置登录密码"
                    autocomplete="new-password"
                    type="text"
                    class="password"
                  ></el-input>
                </el-form-item>
                <p class="setTs">
                  <el-link
                    @click="isRegister = false"
                    :underline="false"
                    type="primary"
                    >已有账号，去登录？</el-link
                  >
                </p>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click.native.prevent="submitRegisterForm"
                    round
                    @keyup.enter.native="submitRegisterForm"
                    size="medium"
                    class="loginBtn"
                    >注册</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <div style="text-align:left;padding-left:42px">
            <el-checkbox v-model="checked">
              <el-link
                :underline="false"
                href="https://static.guangyiedu.com/xieyi/JDxieyi/index.html"
                target="_blank"
                type="primary"
                >用户隐私协议</el-link
              >
              <span style="color:#409eff;">和</span>
              <el-link
                @click="isRegister = false"
                :underline="false"
                href="https://static.guangyiedu.com/xieyi/JDUserxieyi/index.html"
                target="_blank"
                type="primary"
                >服务协议</el-link
              >
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <span style="color:#6D6C6C;font-size:14px;">三文教育集团</span>
        <el-divider></el-divider>
      </div>
      <div style="color: #6D6C6C;font-size: 14px;">
        <span
          >Copyright © <span class="year">{{ currentYear }}</span> 三文教育集团
          版权所有 All rights reserved</span
        >

        <a
          target="_blank"
          style="color: rgb(109, 108, 108);"
          href="https://beian.miit.gov.cn"
          >湘ICP备19015249号-4</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/libs/api.request";
import { setStuToken, setStuInfo } from "@/libs/cookieUtil";
import { devStuIndex, tfStuIndex, proStuIndex } from "@/router/config";

import vueQr from "vue-qr";
export default {
  components: {
    vueQr
  },
  data() {
    var checkPhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }
      const reg = /^(?:(?:\+|00)86)?1\d{10}$/;
      if (reg.test(value) != true) {
        return callback(new Error("手机号码格式不对，请重新输入"));
      }
      callback();
    };
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请设置密码"));
      }
      const reg = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F])[\da-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]{8,}$/;
      if (reg.test(value) != true) {
        return callback(
          new Error("不少于8位，须包含字母大小写、数字、特殊字符")
        );
      }
      callback();
    };

    var checkCaptcha = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error("验证码不能为空"));
      // }
      axios
        .request({
          method: "post",
          url: "/v1/checkCaptcha",
          data: {
            captcha: this.ruleForm.captchCode,
            checkKey: this.captchCodeKey
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            callback();
          } else {
            this.getCaptchCodeImg();
            return callback(new Error(`${ret.msg}`));
          }
        });
    };

    return {
      checked: false,
      isRegister: false,
      preMsg: "",
      uuid: "",
      isBtnLoading: false,
      isMsgBtnLoading: false,
      activeName: "first",
      registerActive: "first",
      ruleForm: {
        username: "",
        password: "",
        captchCode: ""
      },
      registerForm: {
        phoneNum: "",
        msgCode: "",
        password: ""
      },
      registerRules: {
        phoneNum: [{ validator: checkPhoneNum, trigger: "blur" }],
        msgCode: [
          { required: true, message: "短信验证码不能为空", trigger: "blur" }
        ],
        password: [{ validator: checkPassword, trigger: "blur" }]
      },
      msgRuleForm: {
        phoneNum: "",
        msgCode: ""
      },
      captchCodeKey: "",
      captchCodeImg:
        "data:image/png;base64,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",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" }
        ],
        captchCode: [
          {
            required: true,
            message: "请输入验证码"
          },
          { validator: checkCaptcha, trigger: "blur" }
        ]
      },
      msgRules: {
        phoneNum: [{ validator: checkPhoneNum, trigger: "blur" }],
        msgCode: [
          { required: true, message: "短信验证码不能为空", trigger: "blur" }
        ]
      },
      currentYear: "",
      qrCode: "",
      ws: null,
      delay: 0, // 倒计时时间
      regDelay: 0
    };
  },
  computed: {
    btnText() {
      if (this.isBtnLoading) return "登录中...";
      return "登录";
    }
  },
  methods: {
    // 注册获取验证码
    getRegMsgCode() {
      this.$refs["registerForm"].validateField("phoneNum", valid => {
        if (!valid) {
          if (this.regDelay == 0) {
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/sms/preSmsMsg`
              })
              .then(res => {
                let ret = res.data;
                if (ret.code === 200) {
                  this.preMsg = ret.data;
                  let smsCode = this.$md5(this.preMsg.substring(4, 22));
                  axios
                    .request({
                      method: "post",
                      url: `${process.env.BASE_URL_V3}/sms/register`,
                      data: {
                        mobile: this.registerForm.phoneNum,
                        preMsg: this.preMsg,
                        smsCode
                      }
                    })
                    .then(res => {
                      let ret = res.data;
                      if (ret.code === 200) {
                        this.$message({
                          type: "success",
                          message: "验证码发送成功"
                        });
                        this.regDelay = 60;
                        const interId = setInterval(() => {
                          this.regDelay--;
                          if (this.regDelay == 0) {
                            clearInterval(interId);
                          }
                        }, 1000);
                      } else {
                        this.$message({
                          type: "error",
                          message: `${ret.msg}`
                        });
                      }
                    });
                }
              });
          }
        }
      });
    },
    // 获取短信验证码
    getMsgCode() {
      this.$refs["msgRuleForm"].validateField("phoneNum", valid => {
        if (!valid) {
          if (this.delay == 0) {
            this.delay = 60;
            const interId = setInterval(() => {
              this.delay--;
              if (this.delay == 0) {
                clearInterval(interId);
              }
            }, 1000);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/sms/preSmsMsg`
              })
              .then(res => {
                let ret = res.data;
                if (ret.code === 200) {
                  this.preMsg = ret.data;
                  let smsCode = this.$md5(this.preMsg.substring(4, 22));
                  axios
                    .request({
                      method: "post",
                      url: `${process.env.BASE_URL_V3}/sms/join`,
                      data: {
                        mobile: this.msgRuleForm.phoneNum,
                        preMsg: this.preMsg,
                        smsCode
                      }
                    })
                    .then(res => {
                      let ret = res.data;
                      if (ret.code === 200) {
                        this.$message({
                          type: "success",
                          message: "验证码发送成功"
                        });
                      } else {
                        this.$message({
                          type: "error",
                          message: `${ret.msg}`
                        });
                      }
                    });
                }
              });
          }
        }
      });
    },
    getCaptchCodeImg() {
      let key = Math.random()
        .toString()
        .substr(2, 8);
      this.captchCodeKey = key;
      axios
        .request({
          method: "get",
          url: `/v1/randomImage?key=${key}`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.captchCodeImg = ret.data;
          }
        });
    },
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.isBtnLoading = true;
          axios
            .request({
              method: "post",
              url: "/v1/login",
              data: {
                username: this.ruleForm.username,
                password: this.ruleForm.password
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                document.onkeydown = undefined;
                let data = ret.data;
                if (data.user && data.user.type === 1) {
                  setStuToken(data.token);
                  setStuInfo(data.user);
                  let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
                  let lEvent = new LoginEvent("stu_account_login", true);
                  window.JAnalyticsInterface.onEvent(lEvent);
                  if (process.env.NODE_ENV == "alpha") {
                    if (window.location.href.startsWith("https")) {
                      // window.location.replace(tfStuIndex);
                      window.location.replace(tfStuIndex);
                    } else {
                      window.location.replace(devStuIndex);
                    }
                  } else if (process.env.NODE_ENV == "production") {
                    window.location.replace(proStuIndex);
                  }
                } else {
                  let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
                  let lEvent = new LoginEvent("teacher_account_login", true);
                  window.JAnalyticsInterface.onEvent(lEvent);
                  setStuToken(data.token);
                  setStuInfo(data.user);
                  this.$store.commit("setToken", data.token); // 存储token
                  this.$router.push({
                    name: "index"
                  });
                }
              } else {
                this.$message({
                  type: "error",
                  message: ret.msg
                });
              }
              this.isBtnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    submitRegisterForm() {
      if (!this.checked) {
        this.$message({
          type: "warning",
          message: `请先勾选相关协议`
        });
        return;
      }

      // this.$confirm("您已经注册成功,是否前往上传资料进行教师认证吗?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   closeOnClickModal: false
      // })
      //   .then(() => {
      //     console.log("111");
      //   })
      //   .catch(() => {});

      this.$refs["registerForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: `${process.env.BASE_URL_V3}/login/register`,
              data: {
                mobile: this.registerForm.phoneNum,
                code: this.registerForm.msgCode,
                password: this.registerForm.password
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: `注册成功`
                });
                var RegisterEvent =
                  window.JAnalyticsInterface.Event.RegisterEvent;
                var rEvent = new RegisterEvent("pc_register", true);
                window.JAnalyticsInterface.onEvent(rEvent);
                this.registerForm.phoneNum = "";
                this.registerForm.msgCode = "";
                this.registerForm.password = "";
                this.isRegister = false;
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    submitMsgForm() {
      this.$refs["msgRuleForm"].validate(valid => {
        if (valid) {
          this.isMsgBtnLoading = true;
          axios
            .request({
              method: "post",
              url: "/v1/loginBySms",
              data: {
                mobile: this.msgRuleForm.phoneNum,
                code: this.msgRuleForm.msgCode
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                document.onkeydown = undefined;
                let data = ret.data;

                if (data.info && data.info.type === 1) {
                  setStuToken(data.token);
                  setStuInfo(data.info);
                  let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
                  let lEvent = new LoginEvent("stu_msg_login", true);
                  window.JAnalyticsInterface.onEvent(lEvent);
                  if (process.env.NODE_ENV == "alpha") {
                    if (window.location.href.startsWith("https")) {
                      // window.location.replace(tfStuIndex);
                      window.location.replace(tfStuIndex);
                    } else {
                      window.location.replace(devStuIndex);
                    }
                  } else if (process.env.NODE_ENV == "production") {
                    window.location.replace(proStuIndex);
                  }
                } else {
                  let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
                  let lEvent = new LoginEvent("teacher_msg_login", true);
                  window.JAnalyticsInterface.onEvent(lEvent);
                  setStuToken(data.token);
                  setStuInfo(data.info);
                  this.$store.commit("setToken", data.token); // 存储token
                  this.$router.push({
                    name: "index"
                  });
                }
              } else {
                this.$message({
                  type: "error",
                  message: `${ret.msg}`
                });
              }
              this.isMsgBtnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleTabClick(tab, e) {
      if (tab.name == "first") {
        this.openConnect();
      }
    },
    async getUuid() {
      let { data } = await axios.request({
        method: "get",
        url: `${process.env.BASE_URL_V3}/login/getLoginQr`
      });
      return data;
    },
    // 建立ws连接
    async openConnect() {
      let URL = `${process.env.BASE_URL_V3}`.split("//")[1];
      this.uuid = await this.getUuid();
      var ws = new WebSocket(`wss://${URL}/websocket/${this.uuid}`);
      this.ws = ws;
      ws.onopen = evt => {
        //绑定连接事件
        console.log("Connection open ...");
        ws.send(this.uuid);
      };

      ws.onmessage = evt => {
        //绑定收到消息事件
        // eslint-disable-next-line no-eval
        let ret = eval("(" + evt.data + ")");
        let { time, qrcode, status } = ret;
        // if (code === 201) {
        //   this.$message({
        //     message: "没有权限登录，请检查当前用户",
        //     type: "error"
        //   });
        //   return;
        // }
        switch (status) {
          case 0:
            // 画出二维码
            this.qrCode = qrcode;
            window.setTimeout(() => {
              this.$refs.mask.style.display = "block";
            }, Number(time) * 1000);
            break;
          case 1:
            this.$refs.codeMsg.innerText = "已经在手机上扫码,请确认登录";
            break;
          case 2:
            if (ret.info && ret.info.type === 1) {
              setStuToken(ret.token);
              setStuInfo(ret.info);
              let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
              let lEvent = new LoginEvent("stu_qr_login", true);
              window.JAnalyticsInterface.onEvent(lEvent);
              if (process.env.NODE_ENV == "alpha") {
                if (window.location.href.startsWith("https")) {
                  window.location.replace(tfStuIndex);
                } else {
                  window.location.replace(devStuIndex);
                }
              } else if (process.env.NODE_ENV == "production") {
                window.location.replace(proStuIndex);
              }
            } else {
              let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
              let lEvent = new LoginEvent("teacher_qr_login", true);
              window.JAnalyticsInterface.onEvent(lEvent);
              setStuToken(ret.token);
              setStuInfo(ret.info);
              this.$store.commit("setToken", ret.token); // 存储token
              this.$router.push({
                name: "index"
              });
            }

            // 得到token 跳转首页
            // this.$store.commit("setToken", ret.token); // 存储token
            // this.$router.push({
            //   name: "index"
            // });
            break;
          case 3:
            this.$message({
              message: "您已放弃此次登录！",
              type: "warning"
            });
            break;
          case 5:
            this.$refs.mask.style.display = "block";
            break;
        }
      };

      ws.onclose = evt => {
        //绑定关闭或断开连接事件
        console.log("Connection closed.");
      };
    },
    // 刷新二维码
    refreshCode() {
      this.$refs.mask.style.display = "none";
      if (this.ws.readyState == 1) {
        this.ws.send(this.uuid);
        this.openConnect();
      } else {
        this.openConnect();
      }
    },
    // iframe auto login
    iframeAutoLogin() {
      const that = this;
      axios
        .request({
          method: "post",
          url: "/v1/login",
          data: {
            username: that.ruleForm.username,
            password: that.ruleForm.password
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            document.onkeydown = undefined;
            let data = ret.data;
            if (data.user && data.user.type === 1) {
              setStuToken(data.token);
              setStuInfo(data.user);
              let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
              let lEvent = new LoginEvent("stu_account_login", true);
              window.JAnalyticsInterface.onEvent(lEvent);
              if (process.env.NODE_ENV == "alpha") {
                if (window.location.href.startsWith("https")) {
                  // window.location.replace(tfStuIndex);
                  window.location.replace(tfStuIndex);
                } else {
                  window.location.replace(devStuIndex);
                }
              } else if (process.env.NODE_ENV == "production") {
                window.location.replace(proStuIndex);
              }
            } else {
              let LoginEvent = window.JAnalyticsInterface.Event.LoginEvent;
              let lEvent = new LoginEvent("teacher_account_login", true);
              window.JAnalyticsInterface.onEvent(lEvent);
              that.$store.commit("setToken", data.token); // 存储token
              that.$router.push({
                name: "index"
              });
            }
          } else {
            that.$message({
              type: "error",
              message: ret.msg
            });
          }
        });
    }
  },
  mounted() {
    var _self = this;
    window.addEventListener("message", function(event) {
      const params = event.data.data;
      if (params) {
        if (params.username) {
          sessionStorage.setItem("iframeSrc", true);
          _self.ruleForm.username = params.username;
          _self.ruleForm.password = params.password;
          _self.iframeAutoLogin();
        }
        if (params.path) {
          _self.$router.push(params.path);
        }
      }
    });
    console.log(process.env.NODE_ENV);
    this.openConnect();
    this.getCaptchCodeImg();
    var key = "";
    document.onkeydown = function(e) {
      if (window.event == undefined) {
        key = e.keyCode;
      } else {
        key = window.event.keyCode;
      }
      if (key == 13) {
        _self.submitForm("loginData");
      }
    };
    let nowDate = new Date();
    this.currentYear = nowDate.getFullYear();
    // this.openConnect();
  }
};
</script>
<style lang="scss">
.registerForm {
  .el-input__inner {
    width: 85%;
  }
}

.login {
  .login-boxtitle .bx {
    height: 86px;
    width: 1100px;
    margin: 0 auto;
  }

  .login-boxtitle img {
    margin: 13px 0;
  }

  .bx {
    width: 980px;
    margin: 0 auto;
  }

  .login-bx {
    background: url("../assets/images/bg.png") no-repeat;
    // background: url('../assets/images/bgCourse.png') no-repeat;
    background-size: cover;
    background-position: center;
    height: 554px;
    width: 100%;
  }

  .login-box {
    width: 980px;
    margin: 0 auto;
  }

  .login_form {
    float: right;
    margin-top: 56px;
    width: 353px;
    height: 448px;
    background: #fff;
    border-radius: 4px;
    text-align: center;
  }

  .tp {
    background: #10c4ee;
    color: #ffffff;
    font-size: 16px;
    height: 52px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    line-height: 52px;
    text-align: center;
    margin: 0;
  }

  .login_form .tabBox1 {
    padding: 15px 42px 0;

    #tab-first {
      display: none;
    }

    .qrcode {
      margin-left: 18px;
      position: relative;

      #code {
        // display: none;
        // background-color: red;
        width: 230px;
        height: 230px;
      }

      #mask {
        top: 0;
        left: 14px;
        position: absolute;
        width: 202px;
        height: 202px;
        text-align: center;
        background: rgba(240, 240, 240, 0.9);
        display: none;

        .refreshMask {
          display: flex;
          flex-direction: column;
          margin-top: 50px;

          a {
            text-decoration: none;
            display: block;
            color: #fff;
            width: 104px;
            margin: 0 auto;
            padding: 8px 0;
            background-color: #10c4ee;
          }
        }
      }
    }
  }

  .login_form .tabBox {
    padding: 15px 42px 0;

    .qrcode {
      margin-left: 18px;
      position: relative;

      #code {
        // display: none;
        // background-color: red;
        width: 230px;
        height: 230px;
      }

      #mask {
        top: 0;
        left: 14px;
        position: absolute;
        width: 202px;
        height: 202px;
        text-align: center;
        background: rgba(240, 240, 240, 0.9);
        display: none;

        .refreshMask {
          display: flex;
          flex-direction: column;
          margin-top: 50px;

          a {
            text-decoration: none;
            display: block;
            color: #fff;
            width: 104px;
            margin: 0 auto;
            padding: 8px 0;
            background-color: #10c4ee;
          }
        }
      }
    }
  }

  .userName {
    margin-top: 20px;
  }

  .password {
    margin-top: 0px;
  }

  .setTs {
    // color: #10c4ee;
    color: red;
    font-size: 12px;
  }

  .loginBtn {
    width: 100%;
    margin-top: 5px;
  }

  .footer {
    width: 1200px;
    margin: 0 auto;
    padding-top: 25px;

    .el-divider--horizontal {
      margin: 10px 0;
    }
  }
}
</style>
