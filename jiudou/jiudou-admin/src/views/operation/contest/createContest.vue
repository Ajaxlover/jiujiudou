<template
  ><div class="contest-create">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >竞赛列表</span
        >
        <i class="el-icon-arrow-right"></i>
        <span>创建竞赛</span>
      </el-header>
      <el-main>
        <div class="bottom-part">
          <div class="bottom-part-l">
            <div class="flag-title">竞赛信息</div>
            <div class="bottom-f">
              <el-form
                ref="contestForm"
                class="demo-ruleForm"
                label-width="100px"
                :model="form"
                :rules="formRules"
              >
                <el-form-item label="竞赛名称" prop="name">
                  <el-input
                    style="width:400px"
                    placeholder="请输入竞赛名称"
                    size="small"
                    v-model.trim="form.name"
                  ></el-input>
                </el-form-item>
                <!-- :on-change="onChange" -->

                <el-form-item label="竞赛首页图片">
                  <el-upload
                    :multiple="false"
                    :with-credentials="true"
                    class="avatar-uploader"
                    action=""
                    :auto-upload="true"
                    :http-request="uploadSectionFile"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list="false"
                  >
                    <img
                      v-if="form.coverPFile"
                      :src="form.coverPFile"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button
                    @click="viewImg(form.coverPFile)"
                    v-if="form.coverPFile"
                    type="text"
                    size="small"
                    >预览</el-button
                  >
                  <!-- <img
                    v-if="form.coverPFile"
                    :src="form.coverPFile"
                    alt=""
                    class="userPic"
                    style="width:130px;height:71px;cursor: pointer;"
                    @click="cropperClick"
                  />
                  <img
                    v-else
                    src="@/assets/images/mukeCover.png"
                    alt=""
                    class="userPic"
                    style="width:130px;height:71px;cursor: pointer;"
                    @click="cropperClick"
                  /> -->
                  <!-- <div class="inputTips">大小不超过1M</div> -->
                </el-form-item>
                <el-form-item label="竞赛介绍">
                  <el-input
                    style="width:400px"
                    placeholder="请输入竞赛介绍链接地址"
                    size="small"
                    v-model="form.introUrl"
                  ></el-input>
                </el-form-item>
                <el-form-item label="报名时间">
                  <el-date-picker
                    size="small"
                    v-model="form.examTime"
                    type="datetimerange"
                    style="width: 400px;"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="报名须知" prop="contestReadingContent">
                  <el-button
                    @click="openReading"
                    type="text"
                    size="small"
                    style="margin-left:30px"
                    >编辑</el-button
                  >
                </el-form-item>
                <el-form-item label="考生守则">
                  <el-button
                    type="text"
                    @click="openAnswer"
                    size="small"
                    style="margin-left:30px"
                    >编辑</el-button
                  >
                </el-form-item>
                <el-form-item label="报名确认说明">
                  <el-button
                    type="text"
                    size="small"
                    @click="openSure"
                    style="margin-left:30px"
                    >编辑</el-button
                  >
                </el-form-item>
                <el-form-item label="是否收费">
                  <el-switch
                    @change="changeForceSubmit"
                    v-model="form.isNotFree"
                  ></el-switch>
                  <el-input
                    style="width:60px"
                    placeholder="金额"
                    size="small"
                    v-model="form.price"
                  ></el-input
                  >元
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="bottom-part-r">
            <div class="flag-title">竞赛设置</div>
            <div class="bottom-f">
              <el-form ref="form" :model="form">
                <el-form-item label="竞赛轮数">
                  <el-button
                    type="text"
                    size="small"
                    @click="addCompete"
                    style="margin-left:15px"
                    >新增</el-button
                  >
                </el-form-item>
                <!-- <el-form-item label="赛前模拟">
                  <el-button
                    type="primary"
                    size="small"
                    @click="openBeginTeacher"
                    style="margin-left:15px"
                    >{{
                      form.beginUid ? form.beginPhone : "请添加指定教师账号"
                    }}</el-button
                  >
                </el-form-item> -->
                <el-form-item
                  v-for="(i, idx) in form.competeList"
                  :key="idx"
                  label=""
                >
                  <el-input
                    style="width:140px"
                    placeholder="请输入赛事名称"
                    v-model="i.competeName"
                    size="small"
                    :disabled="idx == 0"
                  ></el-input>
                  <el-button
                    type="primary"
                    size="small"
                    @click="openSelectTeacher(idx)"
                    style="margin-left:0px"
                    >{{ i.uid ? i.phone : "请添加指定教师账号" }}</el-button
                  >
                  <!-- v-show="idx != 0" -->
                  <el-date-picker
                    size="small"
                    v-model="i.time"
                    type="datetimerange"
                    style="width: 360px;"
                    range-separator="至"
                    start-placeholder="考试开始时间"
                    end-placeholder="考试结束时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                  <el-tooltip v-show="idx != 0" effect="dark" placement="top">
                    <div slot="content">
                      竞赛开始时间和结束时间
                    </div>
                    <img
                      style="width:15px;"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                  <el-button
                    type="primary"
                    v-if="idx != 0 && idx != 1"
                    size="small"
                    icon="el-icon-close"
                    style="margin-left:px"
                    @click="deleteCompete(idx)"
                  ></el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <div class="save-btn" style="margin-top:80px">
          <div>
            <el-button
              size="small"
              :loading="isCreateBtnLoading"
              @click="doCreateContest"
              type="primary"
              >创建</el-button
            >
            <el-button
              :loading="isPublishBtnLoading"
              size="small"
              @click="doPublish"
              type="primary"
              >发布竞赛</el-button
            >
          </div>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      :visible.sync="showCropper"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>封面裁图</div>
        </div>
      </template>
      <cropper
        :src="exampleImageSrc"
        ref="cropper"
        @on-crop="handleCroped"
        :aspectRatio="16 / 9"
      ></cropper>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="toCropper"
          :loading="sureCropLoading"
          >确定</el-button
        >
        <el-button size="small" @click="showCropper = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="isReadingShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>报名须知</div>
        </div>
      </template>
      <template>
        <el-form
          :model="form"
          ref="richTextResForm"
          label-width="90px"
          size="small"
          style="margin:0 90px;"
        >
          <!-- <el-form-item label="标题" prop="contestReadingTitle">
            <el-input
              v-model.trim="form.contestReadingTitle"
              size="small"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="内容" prop="contestReadingContent">
            <Ueditor
              v-model.trim="form.contestReadingContent"
              :initialFrameHeight="initialFrameHeight"
            />
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button size="small" @click="isReadingShow = false" type="primary"
            >确定</el-button
          >
          <el-button size="small" @click="isReadingShow = false"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="isAnswerShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>考生守则</div>
        </div>
      </template>
      <template>
        <el-form
          :model="form"
          ref="richTextResForm"
          label-width="90px"
          size="small"
          style="margin:0 90px;"
        >
          <!-- <el-form-item label="标题" prop="contestAnswerTitle">
            <el-input
              v-model.trim="form.contestAnswerTitle"
              size="small"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="内容" prop="contestAnswerContent">
            <Ueditor
              v-model.trim="form.contestAnswerContent"
              :initialFrameHeight="initialFrameHeight"
            />
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button size="small" @click="isAnswerShow = false" type="primary"
            >确定</el-button
          >
          <el-button size="small" @click="isAnswerShow = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="isSureShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>报名确认说明</div>
        </div>
      </template>
      <template>
        <el-form
          :model="form"
          ref="richTextResForm"
          label-width="90px"
          size="small"
          style="margin:0 90px;"
        >
          <!-- <el-form-item label="标题" prop="contestSureTitle">
            <el-input
              v-model.trim="form.contestSureTitle"
              size="small"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="内容" prop="contestSureContent">
            <Ueditor
              v-model.trim="form.contestSureContent"
              :initialFrameHeight="initialFrameHeight"
            />
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button size="small" @click="isSureShow = false" type="primary"
            >确定</el-button
          >
          <el-button size="small" @click="isSureShow = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="指定教师账号"
      v-if="isMemberShow"
      :visible.sync="isMemberShow"
      :modal-append-to-body="false"
      :before-close="handleClose"
      width="600px"
    >
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="userForm"
        @submit.native.prevent
      >
        <el-form-item prop="mobile" style="margin:0 20%;">
          <span>请输入指定教师用户手机号</span>
          <el-input
            v-model="userForm.mobile"
            style="width:250px;margin: 10px 0"
            @input="userForm.mobile = userForm.mobile.replace(/[^0-9]/g, '')"
            size="medium"
            type="tel"
            autocomplete="off"
            @keyup.enter.native="handleSearchUser"
            :maxlength="11"
          >
          </el-input>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="handleSearchUser"
          ></el-button>
        </el-form-item>
      </el-form>
      <div class="result" v-if="isSelect" style="text-align:center;">
        <div v-if="userResult.uid">
          <div class="info">
            <img
              v-if="userResult.pic"
              :src="userResult.pic"
              style="width:100px;border-radius:50%;"
            />
            <img
              v-else
              src="@/assets/images/userPic.png"
              style="width:100px;border-radius:50%;"
            />
            <div class="username">{{ userResult.username }}</div>
            <div>{{ userResult.mobile }}</div>
          </div>
        </div>
        <div v-else style="text-align:center;">
          该用户不存在，请先注册九斗账号
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doAddMember" :disabled="disBtn"
          >确定</el-button
        >
        <el-button @click="isMemberShow = false">取消</el-button>
      </div>
    </el-dialog>

    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false;
        }
      "
      :url-list="imgList"
    />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { formatSS } from "@/utils/datetime";
import cropper from "@/components/cropper";
import Ueditor from "@/components/ueditor";

import axios from "@/libs/api.request";
import vueQr from "vue-qr";

export default {
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
    vueQr,
    cropper,
    Ueditor
  },
  data() {
    return {
      isCreateBtnLoading: false,
      isPublishBtnLoading: false,
      showViewer: false,
      imgList: [],
      currentIdx: 0,
      userResult: {},
      isMemberShow: false,
      userForm: {
        mobile: ""
      },
      userRules: {
        mobile: [
          { required: true, message: "请输入正确手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号码", trigger: "blur" }
        ]
      },
      disBtn: true,
      isSelect: false,
      isReadingShow: false, // 报名须知
      isAnswerShow: false, // 诚信书
      isSureShow: false, // 确认说明
      initialFrameHeight: 200,
      file: "",
      sureCropLoading: false,
      exampleImageSrc: "",
      showCropper: false,
      smallForm: {
        checked: true
      },
      checked: true,
      isNotify: false,
      qrcode: "",
      orderCode: "",
      timerId: "",
      examInfo: {
        examName: ""
      },
      isPayShow: false,
      isQRcode: false,
      payType: 2,
      activeNames: [],
      examId: this.$route.query.examId,
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      score: 0, // 总分
      chooseNum: 0, // 题目数量
      payStatus: 0,
      isBeginContest: 0,
      form: {
        beginUid: "", // 指定赛前模拟老师Uid
        beginPhone: "", // 指定赛前模拟老师手机号
        competeList: [
          {
            competeName: "赛前模拟",
            phone: "",
            uid: "",
            time: "",
            isMock: 1
          },
          {
            competeName: "",
            phone: "",
            uid: "",
            time: "",
            isMock: 0
          }
        ],
        price: "0",
        isNotFree: false,
        contestReadingTitle: "", // 报名须知标题
        contestReadingContent: "", // 报名须知正文
        contestAnswerTitle: "", // 诚信承若书标题
        contestAnswerContent: "", // 诚信承若书正文
        contestSureTitle: "", // 报名确认说明
        contestSureContent: "", // 报名确认正文
        coverPFile: "", // 竞赛首页图片
        coverPFileObj: null,
        introUrl: "", // 竞赛介绍链接地址
        name: "", // 竞赛名称
        examTime: "" // 竞赛报名时间
      },
      formRules: {
        name: { required: true, message: "请输入竞赛名称", trigger: "blur" }
        // contestReadingContent: {
        //   required: true,
        //   message: "请填写报名须知",
        //   trigger: "blur"
        // }
      },
      classList: [],
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  computed: {},
  methods: {
    beforeAvatarUpload(file) {
      let isPic = file.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }

      return isPic;
    },
    // 上传图片
    uploadSectionFile(params) {
      this.form.coverPFile = params;
      axios
        .request({
          method: "post",
          url: `/exam/masterHead/getUploadCosPath`
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            let { cosPath, dev } = ret.data;
            const form = new FormData();
            // 文件对象
            form.append("file", params.file);
            form.append("cosPath", cosPath);
            form.append("dev", dev);
            axios
              .request({
                method: "post",
                url: `${process.env.BASE_URL_V3}/common/feign/upload/uploadImg`,
                data: form
              })
              .then(res => {
                if (res.status === 200) {
                  let { accessUrl } = res.data;
                  this.form.coverPFile = accessUrl;
                } else {
                  this.$message({
                    type: "warning",
                    message: "图片上传失败"
                  });
                }
              });
          }
        });
    },
    viewImg(url) {
      this.imgList = [url];
      this.showViewer = true;
    },
    onChange(file, fileList) {
      let isPic = file.raw.type.includes("image");
      if (!isPic) {
        this.$message({
          type: "warning",
          message: "只支持上传图片"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        console.log(event);
        this.form.coverPFile = event.target.result;
      };
      reader.readAsDataURL(file.raw);
      this.form.coverPFileObj = file.raw;
    },
    handleClose() {
      this.userForm.mobile = "";
      this.userResult = {};
      this.disBtn = true;
      this.isSelect = false;
      this.isMemberShow = false;
    },
    openBeginTeacher() {
      this.isMemberShow = true;
      this.isBeginContest = 0;
    },
    openSelectTeacher(idx) {
      this.currentIdx = idx; // 当前竞赛下标
      this.isMemberShow = true;
      this.isBeginContest = 1;
    },
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
                message: "服务器错误!"
              });
            });
        } else {
          this.disBtn = true;
          this.isSelect = false;
        }
      });
    },
    doAddMember() {
      let { uid, mobile } = this.userResult;
      if (this.isBeginContest == 0) {
        this.form.beginUid = uid;
        this.form.beginPhone = mobile;
      } else {
        this.form.competeList[this.currentIdx].uid = uid;
        this.form.competeList[this.currentIdx].phone = mobile;
      }

      this.isMemberShow = false;
    },
    deleteCompete(idx) {
      this.form.competeList.splice(idx, 1);
    },
    addCompete() {
      this.form.competeList.push({
        competeName: "",
        phone: "",
        uid: "",
        time: "",
        isMock: 0
      });
    },
    openReading() {
      this.isReadingShow = true;
    },
    openAnswer() {
      this.isAnswerShow = true;
    },
    openSure() {
      this.isSureShow = true;
    },
    cropperClick() {
      this.showCropper = true;
      this.$nextTick(() => {
        this.$refs.cropper.clear();
      });
    },
    toCropper() {
      this.sureCropLoading = true;
      setTimeout(() => {
        this.$refs.cropper.crop();
      }, 100);
    },
    handleCroped(file) {
      if (file) {
        console.log(file);
        this.file = file;
        this.form.coverPFile = URL.createObjectURL(this.file);
        this.sureCropLoading = false;
        this.showCropper = false;
      } else {
        this.sureCropLoading = false;
      }
    },
    changePaperTimeType(val) {
      if (val == 0) {
        this.form.paperTime = 0;
      }
    },
    changeForceSubmit(val) {
      if (val == false) {
        this.form.price = "0";
      }
    },

    getExamInfo() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/getExamInfo",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleChange(val) {
      console.log(val);
    },
    toExamManage() {
      this.$router.push({
        path: "/operation/contestManage"
      });
    },
    toEditExam() {
      this.$router.push({
        path: "/exam/examTimu",
        query: {
          examId: this.examId
        }
      });
    },
    toViewExam() {
      this.$router.push({
        path: "/exam/viewExamTimu",
        query: {
          examId: this.examId
        }
      });
    },
    doCreateContest() {
      let {
        beginUid,
        beginPhone,
        competeList,
        price,
        isNotFree,
        contestReadingContent, // 报名须知正文
        contestAnswerContent, // 诚信承若书正文
        contestSureContent, // 报名确认正文
        coverPFile, // 竞赛首页图片
        coverPFileObj,
        introUrl, // 竞赛介绍链接地址
        name, // 竞赛名称
        examTime // 竞赛报名时间
      } = this.form;
      if (examTime.length == 0) {
        this.$message({
          type: "warning",
          message: "请填写竞赛报名时间"
        });
        return;
      }
      let fd = new FormData();
      fd.append("name", name);
      fd.append("coverUrl", coverPFile);
      fd.append("notes", contestReadingContent);
      fd.append("introduction", introUrl);
      fd.append("credible", contestAnswerContent);
      fd.append("content", contestSureContent);
      let startTime = examTime ? examTime[0] : "";
      let endTime = examTime ? examTime[1] : "";
      fd.append("startTime", startTime);
      fd.append("endTime", endTime);
      let isFee = isNotFree ? 1 : 0;
      fd.append("isFee", isFee);
      fd.append("price", price);
      // fd.append("appointUid", beginUid);
      // fd.append("appointMobile", beginPhone);
      fd.append("status", 0); // 未发布
      let competes = [];
      this.form.competeList.forEach(i => {
        competes.push({
          name: i.competeName,
          appointMobile: i.phone,
          appointUid: i.uid,
          startTime: i.time ? i.time[0] : "",
          endTime: i.time ? i.time[1] : "",
          isMock: i.isMock
        });
      });
      fd.append("competes", JSON.stringify(competes));
      this.$refs["contestForm"].validate(valid => {
        if (valid) {
          // 创建竞赛 status=0
          if (!coverPFile) {
            this.$message({
              type: "warning",
              message: "请上传竞赛首页图片"
            });
            return;
          }
          for (let index = 0; index < this.form.competeList.length; index++) {
            const element = this.form.competeList[index];
            if (index == 0) {
              if (!element.phone) {
                this.$message({
                  type: "warning",
                  message: "未指定赛前模拟教师账号"
                });
                return;
              }
            } else {
              if (!element.competeName || !element.phone || !element.time) {
                this.$message({
                  type: "warning",
                  message: "请检查竞赛设置"
                });
                // break;
                return;
              }
            }
          }
          this.isCreateBtnLoading = true;
          axios
            .request({
              method: "post",
              url: "/exam/masterHead/add",
              data: fd
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isCreateBtnLoading = true;

                this.$message({
                  type: "success",
                  message: "竞赛创建成功"
                });
                this.$router.push({
                  path: "/operation/contestManage"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: "服务器错误!"
                });
              }
            });
        } else {
        }
      });
    },
    doPublish() {
      let {
        beginUid,
        beginPhone,
        competeList,
        price,
        isNotFree,
        contestReadingContent, // 报名须知正文
        contestAnswerContent, // 诚信承若书正文
        contestSureContent, // 报名确认正文
        coverPFile, // 竞赛首页图片
        coverPFileObj,
        introUrl, // 竞赛介绍链接地址
        name, // 竞赛名称
        examTime // 竞赛报名时间
      } = this.form;
      if (examTime.length == 0) {
        this.$message({
          type: "warning",
          message: "请填写竞赛报名时间"
        });
        return;
      }
      let fd = new FormData();
      fd.append("name", name);
      fd.append("coverUrl", coverPFile);
      fd.append("notes", contestReadingContent);
      fd.append("introduction", introUrl);
      fd.append("credible", contestAnswerContent);
      fd.append("content", contestSureContent);
      let startTime = examTime ? examTime[0] : "";
      let endTime = examTime ? examTime[1] : "";
      fd.append("startTime", startTime);
      fd.append("endTime", endTime);
      let isFee = isNotFree ? 1 : 0;
      fd.append("isFee", isFee);
      fd.append("price", price);
      // fd.append("appointUid", beginUid);
      // fd.append("appointMobile", beginPhone);
      fd.append("status", 1); // 已发布
      let competes = [];

      this.form.competeList.forEach(i => {
        competes.push({
          name: i.competeName,
          appointMobile: i.phone,
          appointUid: i.uid,
          startTime: i.time ? i.time[0] : "",
          endTime: i.time ? i.time[1] : "",
          isMock: i.isMock
        });
      });
      fd.append("competes", JSON.stringify(competes));
      this.$refs["contestForm"].validate(valid => {
        if (valid) {
          if (!coverPFile) {
            this.$message({
              type: "warning",
              message: "请上传竞赛首页图片"
            });
            return;
          }
          for (let index = 0; index < this.form.competeList.length; index++) {
            const element = this.form.competeList[index];
            if (index == 0) {
              if (!element.phone) {
                this.$message({
                  type: "warning",
                  message: "未指定赛前模拟教师账号"
                });
                return;
              }
            } else {
              if (!element.competeName || !element.phone || !element.time) {
                this.$message({
                  type: "warning",
                  message: "请检查竞赛设置"
                });
                // break;
                return;
              }
            }
          }
          this.isPublishBtnLoading = true;
          axios
            .request({
              method: "post",
              url: "/exam/masterHead/add",
              data: fd
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.isPublishBtnLoading = false;
                var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
                var cEvent = new CountEvent("publish_contest");
                window.JAnalyticsInterface.onEvent(cEvent);
                this.$message({
                  type: "success",
                  message: "竞赛发布成功"
                });
                this.$router.push({
                  path: "/operation/contestManage"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: "服务器错误!"
                });
              }
            });
        } else {
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    // this.getExamInfo();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
/deep/ .avatar {
  width: 240px;
  height: 100%;
  display: block;
}
/deep/.uploadModal .el-dialog {
  width: 850px;
  .el-dialog__body {
    padding: 10px 20px 30px;
    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
  .btn {
    text-align: center;
  }
}
.course-name {
  font-size: 18px;
  margin-bottom: 20px;
}
.but-pay {
  background-color: #409eff;
  border-color: #409eff;
  // width: 50%;
  width: 30%;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 0;
}
.pay-type {
  ul li {
    width: 180px;
    height: 60px;
    line-height: 60px;
    border-radius: 6px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #d8dae2;
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    //   transition: .1s;
    span {
      width: 26px;
      height: 26px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
    .pay-type-icon1 {
      // background: url("../../assets/img/zfb.png") no-repeat #fff;
      background-size: 100%;
    }
    .pay-type-icon2 {
      // background: url("../../assets/img/wx.png") no-repeat #fff;
      background-size: 100%;
    }
  }
  .active {
    border: 2px solid #409eff;
  }
}
.money-pay-num {
  color: #f0742b;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
.money-pay-text {
  color: #666;
  font-size: 12px;
  // margin-top: 10px;
  text-align: center;
  .pay-text {
    display: inline-block;
    text-align: left;
    vertical-align: middle;
  }
  img {
    width: 36px;
    height: 36px;
    vertical-align: middle;
  }
}
.but-pay {
  background-color: #409eff;
  border-color: #409eff;
  width: 30%;
  display: block;
  margin: 0 auto;
  margin-top: 40px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 0;
}
.qrcode {
  display: flex;
  flex-direction: column;
  border: 1px #d1d1d1 solid;
  padding-bottom: 10px;
  margin-top: 5px;
  position: relative;
  .zfb-img {
    position: absolute;
    right: -161px;
    top: -70px;
  }
}
.qrcode-t {
  color: #333;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

/deep/ .popper-select {
  position: absolute !important;
  top: 30px !important;
  left: 0px !important;
}
.contest-create {
  position: relative;
  // /deep/.el-dialog {
  //     margin: 5vh auto !important;
  //   }

  // /deep/ .el-dialog__body {
  //   height: 43vh;
  //   overflow: hidden;
  //   overflow-y: auto;
  // }

  .el-header {
    width: 100%;
    background: #ffffff;
    line-height: 50px;
    padding-left: 52px;
    padding-right: 20px;
  }
  .el-main {
    margin: 20px;
    background: #ffffff;
    border-radius: 4px;
    min-height: 720px;
    padding-top: 12px;
    padding-left: 18px;
    padding-right: 18px;
    padding-bottom: 12px;

    .top-part {
      width: 100%;
      // background-color: red;
      margin-bottom: 40px;
      display: flex;
      // justify-content: space-between;
      .top-part-l {
        // width: 700px;
        flex: 1;
        // margin-right: 80px;
        // height: 100%;
        // border: 1px solid #ddd;
        // display: flex;
        // justify-content: center;
        // align-items: center;
      }
      .top-part-r {
        width: 800px;
        // background-color: red;
        // height: 100%;
        // border: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        // align-items: center;
        .top-part-r-t {
          width: 600px;
          border: 1px solid #ddd;
          height: 360px;
          margin-bottom: 20px;
          .top-part-r-t-title {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            background-image: linear-gradient(
              -180deg,
              #f2f3f7 0%,
              #dee5ed 100%
            );
          }
          .top-part-r-t-content {
            padding-left: 10px;
            height: 60px;
            line-height: 60px;
            span {
              margin-right: 50px;
            }
          }
          .top-part-r-t-textarea {
            padding: 10px;
            /deep/ .el-textarea {
              .el-textarea__inner {
                border: none;
              }
            }
          }
        }
      }
    }
    .bottom-part {
      display: flex;
      .flag-title {
        font-size: 24px;
        font-weight: 400;
        border-left: 4px solid #2ba1f4;
        padding: 0 0 2px 6px;
      }
      .bottom-f {
        padding: 8px 0 0 10px;
      }
      .bottom-part-l {
        width: 700px;
        // margin-right: 170px;
        .f-title {
          font-size: 24px;
          font-weight: 400;
          border-left: 4px solid #2ba1f4;
          padding: 0 0 2px 6px;
          height: 36px;
          line-height: 36px;
        }
      }
      .bottom-part-r {
        flex: 1;
        .f-title {
          font-size: 24px;
          font-weight: 400;
          border-left: 4px solid #2ba1f4;
          padding: 0 0 2px 6px;
          height: 36px;
          line-height: 36px;
        }
      }
    }
    .more-setting {
      margin-bottom: 20px;
      /deep/ .el-collapse-item__header {
        font-size: 18px;
        font-weight: 400;
      }
    }
    .save-btn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
