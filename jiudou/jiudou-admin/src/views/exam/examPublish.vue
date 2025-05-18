<template
  ><div class="exam-publish">
    <el-container>
      <el-header style="height: 50px">
        <span @click="toExamManage" style="cursor:pointer;color:#2BA1F4;"
          >考试列表</span
        >
        <i class="el-icon-arrow-right"></i>
        <span>发布考试</span>
      </el-header>
      <el-main>
        <div class="top-part">
          <div class="top-part-l">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="考试名称">
                <el-input
                  style="width:400px"
                  placeholder="请输入考试名称"
                  size="small"
                  v-model="form.name"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="考试时间">
                <!-- type="daterange" -->
                <el-date-picker
                  size="small"
                  v-model="form.eaxmTime"
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

              <el-form-item label="答卷时长">
                <el-radio-group
                  size="small"
                  @change="changePaperTimeType"
                  v-model="form.paperTimeType"
                >
                  <el-radio label="1"
                    ><el-input
                      style="width:60px"
                      placeholder="时长"
                      size="small"
                      v-model="form.paperTime"
                    ></el-input
                    ><span style="color:#333">分钟</span></el-radio
                  >
                  <el-radio label="0">不限时长</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="答卷次数">
                <el-radio-group
                  @change="changeAnswerTimesType"
                  size="small"
                  v-model="form.answerTimesType"
                >
                  <el-radio label="0">无限次</el-radio>
                  <el-radio label="1"
                    >有限次<el-input
                      style="width:60px"
                      placeholder="次数"
                      size="small"
                      v-model="form.answerTimes"
                    ></el-input
                  ></el-radio>
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      1.学生可有多次作答机会，超过设定次数后，学生无法再参与作答；<br />2.系统将以学生最后一次提交的卷面为准；<br />3.答卷次数设置超过1次时，考试迟到设置将自动失效
                    </div>
                    <img
                      style="width:15px;"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="及格分数">
                <el-input
                  style="width:90px"
                  placeholder="及格分数"
                  size="small"
                  v-model="form.standardScore"
                ></el-input>
              </el-form-item>
              <el-form-item label="选择班级">
                <el-select
                  :disabled="payStatus == 3"
                  :popper-append-to-body="false"
                  popper-class="popper-select"
                  size="small"
                  v-model="form.className"
                  @change="selectClassChange"
                  placeholder="请选择考试班级"
                >
                  <el-option
                    :key="index"
                    v-for="(item, index) in classList"
                    :label="item.classname"
                    :value="item.classId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="top-part-r">
            <div class="top-part-r-t">
              <div class="top-part-r-t-title">
                <div class="exam-name">{{ examInfo.examName }}</div>
                <div class="exam-btn">
                  <el-button @click="toViewExam" type="text"
                    >预览试卷</el-button
                  >
                  <el-button @click="toEditExam" type="text"
                    >编辑试卷</el-button
                  >
                </div>
              </div>
              <div class="top-part-r-t-content">
                <span>总分:{{ score }}</span>
                <span>试题数量:{{ chooseNum }}</span>
              </div>
              <div class="top-part-r-t-title">
                <div>考试说明</div>
              </div>
              <div class="top-part-r-t-textarea">
                <el-input
                  :rows="8"
                  type="textarea"
                  placeholder="请填写考试说明"
                  maxlength="200"
                  resize="none"
                  v-model.trim="form.examRemark"
                  show-word-limit
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-part">
          <div class="bottom-part-l">
            <div class="flag-title">考试信息</div>
            <div class="bottom-f">
              <el-form>
                <el-form-item label="考试迟到限时">
                  <el-switch
                    @change="changeLate"
                    v-model="form.isLateMinute"
                  ></el-switch>
                  <span
                    >学生可迟到<el-input
                      style="width:60px"
                      placeholder="时长"
                      size="small"
                      v-model="form.delayMinutes"
                    ></el-input
                    >分钟</span
                  >
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      1.开启：待考试开始，学生必须在设定时间范围内进入答题，否则将无法参与考试；<br />2.考试迟到功能仅在“答卷次数为1”时有效
                    </div>
                    <img
                      style="width:15px;margin-left:20px"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-form-item>

                <el-form-item label="考试人数">
                  <el-input
                    style="width:60px"
                    placeholder="人数"
                    size="small"
                    v-model="form.stuNum"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="bottom-part-r">
            <div class="flag-title">题目设置</div>
            <div class="bottom-f">
              <el-form ref="form" :model="form">
                <el-form-item label="题目是否随机">
                  <el-switch v-model="form.isSubjectRandom"></el-switch>
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      开启后，各学生卷面题目顺序将随机打乱
                    </div>
                    <img
                      style="width:15px;margin-left:20px"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="选项是否随机">
                  <el-switch v-model="form.isOptionRandom"></el-switch>
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      开启后，各学生卷面题目的选项顺序将随机打乱
                    </div>
                    <img
                      style="width:15px;margin-left:20px"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="试卷随机抽取">
                  <el-switch
                    @change="changeExtractRandom"
                    v-model="form.extractRandom"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="">
                  <div :key="index" v-for="(item, index) in form.extraOptions">
                    <span style="color:#333">{{ subjectType(item) }}抽取</span>
                    <el-input
                      style="width:60px"
                      size="small"
                      v-model.trim="item.num"
                    ></el-input>
                    <span style="color:#333">题，每题</span>
                    <el-input
                      style="width:60px"
                      size="small"
                      v-model.trim="item.score"
                    ></el-input>
                    <span style="color:#333">分</span>
                    <span style="color:#333"
                      >(最多抽取{{ item.bankNum }}题)</span
                    >
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="more-setting">
          <!-- <span>更多设置</span> -->
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="更多设置" name="1">
              <div class="bottom-part">
                <div class="bottom-part-l">
                  <div class="f-title">考试防作弊</div>
                  <div class="bottom-f">
                    <el-form>
                      <el-form-item label="切屏强制交卷">
                        <el-switch
                          @change="changeForceSubmit"
                          v-model="form.forceSubmit"
                        ></el-switch>
                        <span style="color:#333">切换页面超过</span>
                        <el-input
                          style="width:60px"
                          size="small"
                          v-model="form.switchTimes"
                        ></el-input>
                        <span style="color:#333">次后，将强制交卷</span>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            1.防止学生在答题过程中利用浏览器、聊天工具(微信、QQ)等获取答案。在作答页面时，每切换1次页面就算切屏1次，超过设定次数，系统将自动收卷；<br />2.设置可切屏次数为0时,学生切屏会直接交卷；<br />3.设置可切屏次数大于0时,学生切屏系统会警告提醒。
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="闯关模式">
                        <el-switch
                          @change="changeIsChallenge"
                          v-model="form.isChallenge"
                        ></el-switch>
                        <span style="color:#333">只允许错</span>
                        <el-input
                          style="width:60px"
                          size="small"
                          v-model="form.errorBankTimes"
                        ></el-input>
                        <span style="color:#333">题，超过之后将强制交卷</span>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            考试过程中不允许切换题目
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="反截屏/录屏">
                        <el-switch
                          v-model="form.preventMonitorScreenFlag"
                        ></el-switch>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            考试过程中不允许截屏或录屏
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="摄像头开启抓拍">
                        <el-switch disabled v-model="form.isCamera"></el-switch>
                        <span style="color:#333">间隔</span>
                        <el-input
                          disabled
                          style="width:60px"
                          size="small"
                          v-model="form.gapTime"
                        ></el-input>
                        <span style="color:#333">分钟</span>
                      </el-form-item>
                      <el-form-item label="人脸识别">
                        <el-switch disabled v-model="form.isFace"></el-switch>
                        <span>核验成功后才能进入考试参与答题</span>
                      </el-form-item>
                      <el-form-item label="限时答题">
                        <el-switch
                          disabled
                          v-model="form.isTimeLimited"
                        ></el-switch>
                        <span style="color:#333">答题时长</span
                        ><el-input
                          disabled
                          style="width:60px"
                          size="small"
                          v-model="form.subjectAnswerTime"
                        ></el-input>
                        <span style="color:#333">分钟</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>

                <div class="bottom-part-r">
                  <div class="f-title">成绩设置</div>
                  <div class="bottom-f">
                    <el-form ref="form" :model="form">
                      <el-form-item label="显示成绩">
                        <el-switch v-model="form.isShowScore"></el-switch>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            开启后，待考试结束及批改结束后，学生能查看自己的得分
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="显示名次">
                        <el-switch v-model="form.isShowRanking"></el-switch>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            开启后，待考试结束及批改结束后，学生能查看自己的排名
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="允许查看试卷">
                        <el-switch v-model="form.isShowPaper"></el-switch>
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            开启后，待考试结束及批改结束后，学生能查看自己的卷面
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-form-item>
                      <el-form-item label="">
                        <el-radio-group size="small" v-model="form.showAnswer">
                          <el-radio :disabled="!isAnswerAble" label="2"
                            >显示答案解析</el-radio
                          >
                          <el-radio :disabled="!isAnswerAble" label="3"
                            >不显示答案解析</el-radio
                          >
                          <el-tooltip effect="dark" placement="right">
                            <div slot="content">
                              学生查看卷面时，是否显示标准答案
                            </div>
                            <img
                              style="width:15px;"
                              src="@/assets/images/icon_help.png"
                            />
                          </el-tooltip>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!-- <div class="bottom-part">
          <div class="bottom-part-l">
            <div class="flag-title">考试防作弊</div>
            <div class="bottom-f">
              <el-form>
                <el-form-item label="切屏强制交卷">
                  <el-switch v-model="form.forceSubmit"></el-switch>
                </el-form-item>
                <el-form-item label="摄像头开启抓拍">
                  <el-switch v-model="form.isCamera"></el-switch>
                </el-form-item>
                <el-form-item label="人脸识别">
                  <el-switch v-model="form.isFace"></el-switch>
                </el-form-item>
                <el-form-item label="限时答题">
                  <el-switch v-model="form.isTimeLimited"></el-switch>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="bottom-part-r">
            <div class="flag-title">成绩设置</div>
            <div class="bottom-f">
              <el-form ref="form" :model="form">
                <el-form-item label="显示成绩">
                  <el-switch v-model="form.isShowScore"></el-switch>
                </el-form-item>
                <el-form-item label="显示名次">
                  <el-switch v-model="form.isShowRanking"></el-switch>
                </el-form-item>
                <el-form-item label="允许查看试卷">
                  <el-switch v-model="form.isShowPaper"></el-switch>
                </el-form-item>
                <el-form-item label="">
                  <el-radio-group size="small" v-model="form.resource">
                    <el-radio label="">显示答案解析</el-radio>
                    <el-radio label="">不显示答案解析</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div> -->
        <div class="save-btn">
          <div>
            <el-button size="small" @click="doSaveExam" type="primary"
              >保存</el-button
            >
            <el-button size="small" @click="doPublish" type="primary"
              >发布考试</el-button
            >
          </div>
        </div>
      </el-main>

      <!-- 考试弹窗 -->
      <el-dialog
        title=""
        :visible.sync="isPayShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleClose"
        width="45%"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>考试支付</div>
          </div>
        </template>
        <div>
          <el-row>
            <div class="course-name">考试名称:{{ examInfo.examName }}</div>
          </el-row>
          <el-row
            ><div class="course-name">
              考试价格:
              <span style="color: #f0742b">￥{{ examInfo.price }}</span>
            </div></el-row
          >
          <el-row>
            <div class="course-name">支付方式:</div>
          </el-row>
          <section class="pay-type">
            <ul>
              <li :class="payType == 2 ? 'active' : ''" @click="payType = 2">
                <span class="pay-type-icon2"></span>微信支付
              </li>
              <li :class="payType == 1 ? 'active' : ''" @click="payType = 1">
                <span class="pay-type-icon1"></span>支付宝
              </li>
            </ul>
          </section>
          <section>
            <div style="display:flex">
              <el-button @click="goPay" class="but-pay">去付款</el-button>
              <el-button @click="handleClose" class="but-pay">取消</el-button>
            </div>
          </section>
        </div>
      </el-dialog>

      <!-- 考试扫码支付 -->
      <el-dialog
        :title="`考试名称：${examInfo.examName}`"
        :visible.sync="isQRcode"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCode"
        width="40%"
      >
        <section style="width: 150px; margin: 0 auto">
          <section style="text-align: center; margin-bottom: 6px">
            扫一扫付款 (元)
          </section>
          <section class="money-pay-num">{{ examInfo.price }}</section>
          <section class="qrcode">
            <vue-qr
              :text="qrcode"
              colorDark="#000"
              colorLight="#fff"
              :margin="5"
              :size="100"
            ></vue-qr>
            <img src="../../assets/img/zfb1.png" class="zfb-img" width="100%" />
            <section class="money-pay-text">
              <img src="../../assets/img/qrcode.png" width="100%" />
              <div class="pay-text">
                <p>打开手机支付</p>
                <p>扫一扫付款</p>
              </div>
            </section>
          </section>
          <section v-if="payType == 2" class="qrcode-t">微信扫码支付</section>
          <section v-if="payType == 1" class="qrcode-t">支付宝扫码支付</section>
        </section>
        <section style="text-align: center; margin: 20px 0">
          <span slot="footer" class="dialog-footer">
            <!-- <el-button class="but-pay" @click="handleCode">取消</el-button> -->
          </span>
        </section>
      </el-dialog>

      <!-- 发送考试通知 -->
      <el-dialog
        :title="`考试名称：${examInfo.examName}`"
        :visible.sync="isNotify"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCode"
        width="40%"
      >
        <section style="width: 150px;font-size:18px">
          <!-- <div>开始时间：{{ dateFormat(form.examTime[0]) }}</div> -->
          <!-- <div>结束时间：{{ dateFormat(form.examTime[1]) }}</div> -->
          <div>考试时长：{{ form.paperTime }}分钟</div>
          <!-- <div>
            <el-form ref="smallForm" :model="smallForm" label-width="120px">
              <el-form-item label="考试通知方式">
                <el-checkbox disabled v-model="smallForm.checked"
                  >短信</el-checkbox
                >
              </el-form-item>
              <el-form-item label="通知时间">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div> -->
          <div style="display:flex;width:300px">
            <span>考试通知方式</span>
            <el-checkbox disabled v-model="checked">短信</el-checkbox>
          </div>
        </section>
        <section style="text-align: center; margin: 20px 0">
          <span slot="footer" class="dialog-footer">
            <el-button class="but-pay">确定</el-button>
          </span>
        </section>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { formatSS } from "@/utils/datetime";

import axios from "@/libs/api.request";
import vueQr from "vue-qr";

export default {
  components: {
    vueQr
  },
  data() {
    return {
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
      form: {
        preventMonitorScreenFlag: false,
        isChallenge: false, // 闯关模式
        extraOptions: [],
        errorBankTimes: "0", // 错题次数(闯关模式)
        extractRandom: false, // 是否随机抽题
        name: "", // 考试名称
        className: "",
        eaxmTime: "", // 考试时间
        paperTimeType: "1", // 答卷时长类型
        paperTime: "", // 答卷时长(分钟)
        answerTimesType: "1", // 答卷次数类型
        answerTimes: "", // 答卷次数
        standardScore: "", // 及格分
        isLateMinute: true,
        delayMinutes: "", // 可迟到时间
        switchTimes: "", // 切屏次数
        gapTime: "",
        subjectAnswerTime: "", // 答题时长
        examRemark: "", // 考试说明
        stuNum: "", // 班级人数
        isOptionRandom: true, // 选项随机
        isSubjectRandom: true, // 题目随机
        forceSubmit: true, // 切屏强制交卷
        isCamera: false, // 摄像头抓拍
        isFace: false, // 人脸识别
        isTimeLimited: false, // 限时答题
        isShowScore: true, // 显示成绩
        isShowRanking: true, // 显示名次
        isShowPaper: false, // 允许查看试卷
        showAnswer: "2" // 2-显示答案和解析  3-不显示答案和解析
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
  computed: {
    isAnswerAble() {
      return this.form.isShowPaper;
    }
  },
  methods: {
    subjectType(item) {
      if (item.tSubject == 1) {
        return "判断题";
      } else if (item.tSubject == 2) {
        return "单选题";
      } else if (item.tSubject == 3) {
        return "多选题";
      } else if (item.tSubject == 4) {
        return "填空题";
      } else if (item.tSubject == 5) {
        return "问答题";
      } else {
        return "组合题";
      }
    },
    handleClose() {
      this.isPayShow = false;
      this.payType = 2;
    },
    handleCode() {
      this.payType = 2;
      this.isQRcode = false;
      clearTimeout(this.timerId);
    },
    changeAnswerTimesType(val) {
      if (val == 0) {
        this.form.answerTimes = 0;
      }
    },
    changeLate(val) {
      if (val == false) {
        this.form.delayMinutes = 0;
      }
    },
    getExtraOptions() {
      axios
        .request({
          method: "post",
          url: `/exam/exam/paper/getExtraOptions`,
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.form.extraOptions = ret.data;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    changeExtractRandom(val) {
      if (val) {
        this.getExtraOptions();
      }
    },
    changePaperTimeType(val) {
      if (val == 0) {
        this.form.paperTime = 0;
      }
    },
    changeIsChallenge(val) {
      if (val == false) {
        this.form.errorBankTimes = 0;
      }
    },
    changeForceSubmit(val) {
      if (val == false) {
        this.form.switchTimes = 0;
      }
    },
    goPay() {
      // 保存考试班级=>下订单
      let {
        extraOptions,
        errorBankTimes,
        extractRandom,
        name,
        className,
        eaxmTime,
        paperTimeType,
        paperTime,
        answerTimesType,
        answerTimes,
        standardScore,
        isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        stuNum,
        isOptionRandom,
        isSubjectRandom,
        forceSubmit,
        isCamera,
        isFace,
        isTimeLimited,
        isShowScore,
        isShowRanking,
        isShowPaper,
        showAnswer
      } = this.form;
      // if (!name) {
      //   this.$message({
      //     type: "warning",
      //     message: "请填写考试名称"
      //   });
      //   return;
      // }
      let data = {
        errorBankTimes,
        extractRandom: extractRandom ? 1 : 0,
        examId: this.examId,
        examName: name,
        startTime: eaxmTime ? eaxmTime[0] : "",
        endTime: eaxmTime ? eaxmTime[1] : "",
        answerTime: paperTime,
        answerTimes: answerTimes,
        passScore: standardScore,
        classId: className,
        examNotes: examRemark,
        lateTime: delayMinutes,
        subjectRandom: isSubjectRandom ? 1 : 0,
        optionRandom: isOptionRandom ? 1 : 0,
        switchScreenTimes: switchTimes,
        cameraCaptureTime: gapTime,
        faceFlag: isFace ? 1 : 0,
        answerLimitTime: subjectAnswerTime,
        isScore: isShowScore ? 1 : 0,
        isOrder: isShowRanking ? 1 : 0,
        isView: isShowPaper ? showAnswer : 0
      };
      if (extractRandom) {
        data.extraOptions = JSON.stringify(extraOptions);
      }
      let flag = true;
      if (extractRandom) {
        for (let i = 0; i < extraOptions.length; i++) {
          const element = extraOptions[i];
          if (element.num.length === 0 || element.score.length === 0) {
            this.$message({
              type: "warning",
              message: "随机抽题数为空或分数为空，请检查"
            });
            flag = false;
            break;
          }
          if (element.num > element.bankNum) {
            this.$message({
              type: "warning",
              message: "随机抽题数大于试卷当前题数，请检查"
            });
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/storage",
            data
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              axios
                .request({
                  method: "post",
                  url: `/exam/exam/pay`,
                  data: {
                    examId: this.examId,
                    chargeType: this.payType,
                    chargeMethod: 2,
                    os: "PC"
                  }
                })
                .then(res => {
                  let ret = res.data;
                  if (ret.code === 200) {
                    this.qrcode = ret.data.codeUrl;
                    this.orderCode = ret.data.orderCode;
                    this.isPayShow = false;
                    this.isQRcode = true;
                    setTimeout(() => {
                      this.queryPayStatus();
                    }, 1000);
                  } else {
                    this.$message({
                      type: "error",
                      message: `${ret.msg}`
                    });
                  }
                });
            } else {
            }
          });
      }
    },
    queryPayStatus() {
      axios
        .request({
          method: "post",
          url: `/order/queryOrderPayStatus`,
          data: {
            orderCode: this.orderCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              title: "提示",
              message: "支付成功",
              type: "success",
              offset: 80
            });
            this.isQRcode = false;
            this.getExamInfo();
          } else {
            this.timerId = setTimeout(() => {
              this.queryPayStatus();
            }, 1000);
          }
        });
    },
    getClassList() {
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClass"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.classList = ret.data;
            this.classList = this.classList.filter(item => item.status == 0);
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
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
            let {
              preventMonitorScreenFlag,
              isErrorBank,
              extraOptions,
              errorBankTimes,
              extractRandom,
              answerLimitTime,
              answerTime,
              answerTimes,
              cameraCaptureTime,
              examName,
              faceFlag,
              isOrder,
              isScore,
              isView,
              lateTime,
              optionRandom,
              passScore,
              score,
              chooseNum,
              subjectRandom,
              switchScreenTimes,
              startTime,
              endTime,
              payStatus
            } = ret.data;
            this.payStatus = payStatus;
            this.score = score; // 总分
            this.form.extraOptions = extraOptions;
            this.chooseNum = chooseNum; // 题目数量
            this.form.name = examName; // 考试名称
            this.examInfo.examName = examName; // 考试名称
            this.form.className = ret.data.classId ? ret.data.classId : "";
            if (ret.data.classId) {
              this.getClassStuNum(ret.data.classId);
            }
            this.form.standardScore = passScore; // 及格分
            this.form.paperTime = answerTime;
            this.form.paperTimeType = answerTime == 0 ? "0" : "1";
            this.form.examRemark = ret.data.examNotes ? ret.data.examNotes : "";
            this.form.answerTimes = answerTimes;
            this.form.answerTimesType = answerTimes == 0 ? "0" : "1";
            this.form.switchTimes = switchScreenTimes; // 切屏次数
            this.form.forceSubmit = switchScreenTimes != 0; // 切屏次数
            this.form.delayMinutes = lateTime; // 可迟到时间
            this.form.isLateMinute = lateTime != 0; // 可迟到时间
            this.form.extractRandom = extractRandom === 1;
            this.form.isChallenge = isErrorBank == 1;
            this.form.preventMonitorScreenFlag = preventMonitorScreenFlag == 1;
            this.form.errorBankTimes = String(errorBankTimes);
            this.form.isOptionRandom = optionRandom === 1;
            this.form.isSubjectRandom = subjectRandom === 1;
            this.form.isFace = faceFlag === 1;
            this.form.isShowRanking = isOrder === 1;
            this.form.isShowScore = isScore === 1;
            this.form.subjectAnswerTime = answerLimitTime;
            this.form.isTimeLimited = answerLimitTime != 0;
            this.form.gapTime = cameraCaptureTime;
            this.form.isCamera = cameraCaptureTime != 0;
            this.form.isShowPaper = isView != 0;
            this.form.showAnswer = String(isView);
            // 考试时间
            if (startTime != 0 && endTime != 0) {
              this.form.eaxmTime = [startTime, endTime];
            } else {
              this.form.eaxmTime = "";
            }
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
        path: "/exam/examManage"
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
    doSaveExam() {
      let {
        isChallenge,
        preventMonitorScreenFlag,
        extraOptions,
        errorBankTimes,
        extractRandom,
        name,
        className,
        eaxmTime,
        paperTimeType,
        paperTime,
        answerTimesType,
        answerTimes,
        standardScore,
        isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        stuNum,
        isOptionRandom,
        isSubjectRandom,
        forceSubmit,
        isCamera,
        isFace,
        isTimeLimited,
        isShowScore,
        isShowRanking,
        isShowPaper,
        showAnswer
      } = this.form;
      if (!name) {
        this.$message({
          type: "warning",
          message: "请填写考试名称"
        });
        return;
      }
      let data = {
        isErrorBank: isChallenge ? 1 : 0,
        preventMonitorScreenFlag: preventMonitorScreenFlag ? 1 : 0,
        errorBankTimes,
        extractRandom: extractRandom ? 1 : 0,
        examId: this.examId,
        examName: name,
        startTime: eaxmTime ? eaxmTime[0] : "",
        endTime: eaxmTime ? eaxmTime[1] : "",
        answerTime: paperTime,
        answerTimes: answerTimes,
        passScore: standardScore,
        classId: className,
        examNotes: examRemark,
        lateTime: delayMinutes,
        subjectRandom: isSubjectRandom ? 1 : 0,
        optionRandom: isOptionRandom ? 1 : 0,
        switchScreenTimes: switchTimes,
        cameraCaptureTime: gapTime,
        faceFlag: isFace ? 1 : 0,
        answerLimitTime: subjectAnswerTime,
        isScore: isShowScore ? 1 : 0,
        isOrder: isShowRanking ? 1 : 0,
        isView: isShowPaper ? showAnswer : 0
      };
      if (extractRandom) {
        data.extraOptions = JSON.stringify(extraOptions);
      }
      let flag = true;
      if (extractRandom) {
        for (let i = 0; i < extraOptions.length; i++) {
          const element = extraOptions[i];
          if (element.num.length === 0 || element.score.length === 0) {
            this.$message({
              type: "warning",
              message: "随机抽题数为空或分数为空，请检查"
            });
            flag = false;
            break;
          }
          if (element.num > element.bankNum) {
            this.$message({
              type: "warning",
              message: "随机抽题数大于试卷当前题数，请检查"
            });
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/storage",
            data
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.getExamInfo();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    doPublish() {
      let {
        isChallenge,
        preventMonitorScreenFlag,
        extraOptions,
        errorBankTimes,
        extractRandom,
        name,
        className,
        eaxmTime,
        paperTimeType,
        paperTime,
        answerTimesType,
        answerTimes,
        standardScore,
        isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        stuNum,
        isOptionRandom,
        isSubjectRandom,
        forceSubmit,
        isCamera,
        isFace,
        isTimeLimited,
        isShowScore,
        isShowRanking,
        isShowPaper,
        showAnswer
      } = this.form;
      if (!name) {
        this.$message({
          type: "warning",
          message: "请填写考试名称"
        });
        return;
      }
      if (!className) {
        this.$message({
          type: "warning",
          message: "请选择考试班级"
        });
        return;
      }
      if (eaxmTime.length == 0) {
        this.$message({
          type: "warning",
          message: "请设置考试时间"
        });
        return;
      }
      // if (this.score != 100) {
      //   this.$message({
      //     type: "warning",
      //     message: "请设置试卷总分为100分"
      //   });
      //   return;
      // }
      // 收费考试提示发送短信
      let data = {
        isErrorBank: isChallenge ? 1 : 0,
        preventMonitorScreenFlag: preventMonitorScreenFlag ? 1 : 0,
        errorBankTimes,
        extractRandom: extractRandom ? 1 : 0,
        examId: this.examId,
        examName: name,
        startTime: eaxmTime ? eaxmTime[0] : "",
        endTime: eaxmTime ? eaxmTime[1] : "",
        answerTime: paperTime,
        answerTimes: answerTimes,
        passScore: standardScore,
        classId: className,
        examNotes: examRemark,
        lateTime: delayMinutes,
        subjectRandom: isSubjectRandom ? 1 : 0,
        optionRandom: isOptionRandom ? 1 : 0,
        switchScreenTimes: switchTimes,
        cameraCaptureTime: gapTime,
        faceFlag: isFace ? 1 : 0,
        answerLimitTime: subjectAnswerTime,
        isScore: isShowScore ? 1 : 0,
        isOrder: isShowRanking ? 1 : 0,
        isView: isShowPaper ? showAnswer : 0
      };
      if (extractRandom) {
        data.extraOptions = JSON.stringify(extraOptions);
      }
      let flag = true;
      if (extractRandom) {
        for (let i = 0; i < extraOptions.length; i++) {
          const element = extraOptions[i];
          if (element.num.length === 0 || element.score.length === 0) {
            this.$message({
              type: "warning",
              message: "随机抽题数为空或分数为空，请检查"
            });
            flag = false;
            break;
          }
          if (element.num > element.bankNum) {
            this.$message({
              type: "warning",
              message: "随机抽题数大于试卷当前题数，请检查"
            });
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/publish",
            data
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
              var cEvent = new CountEvent("publish_exam");
              window.JAnalyticsInterface.onEvent(cEvent);
              this.$router.push({
                path: "/exam/examManage"
              });
            } else if (ret.code === 245) {
              // 该班级考试未支付
              this.isPayShow = true;
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    doSilentSave() {
      let {
        isChallenge,
        preventMonitorScreenFlag,
        extraOptions,
        errorBankTimes,
        extractRandom,
        name,
        className,
        eaxmTime,
        paperTimeType,
        paperTime,
        answerTimesType,
        answerTimes,
        standardScore,
        isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        stuNum,
        isOptionRandom,
        isSubjectRandom,
        forceSubmit,
        isCamera,
        isFace,
        isTimeLimited,
        isShowScore,
        isShowRanking,
        isShowPaper,
        showAnswer
      } = this.form;
      // if (!name) {
      //   this.$message({
      //     type: "warning",
      //     message: "请填写考试名称"
      //   });
      //   return;
      // }
      let data = {
        isErrorBank: isChallenge ? 1 : 0,
        preventMonitorScreenFlag: preventMonitorScreenFlag ? 1 : 0,
        errorBankTimes,
        extractRandom: extractRandom ? 1 : 0,
        examId: this.examId,
        examName: name,
        startTime: eaxmTime ? eaxmTime[0] : "",
        endTime: eaxmTime ? eaxmTime[1] : "",
        answerTime: paperTime,
        answerTimes: answerTimes,
        passScore: standardScore,
        classId: className,
        examNotes: examRemark,
        lateTime: delayMinutes,
        subjectRandom: isSubjectRandom ? 1 : 0,
        optionRandom: isOptionRandom ? 1 : 0,
        switchScreenTimes: switchTimes,
        cameraCaptureTime: gapTime,
        faceFlag: isFace ? 1 : 0,
        answerLimitTime: subjectAnswerTime,
        isScore: isShowScore ? 1 : 0,
        isOrder: isShowRanking ? 1 : 0,
        isView: isShowPaper ? showAnswer : 0
      };
      if (extractRandom) {
        data.extraOptions = JSON.stringify(extraOptions);
      }
      // if (extractRandom) {
      //   for (let i = 0; i < extraOptions.length; i++) {
      //     const element = extraOptions[i];
      //     if (element.num.length === 0 || element.score.length === 0) {
      //       this.$message({
      //         type: "warning",
      //         message: "随机抽题数为空或分数为空，请检查"
      //       });
      //       break;
      //     }
      //     if (element.num > element.bankNum) {
      //       this.$message({
      //         type: "warning",
      //         message: "随机抽题数大于试卷当前题数，请检查"
      //       });
      //       break;
      //     }
      //   }
      // }
      axios
        .request({
          method: "post",
          url: "/exam/exam/storage",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
          } else {
          }
        });
    },
    selectClassChange(classId) {
      console.log("hhhh");

      this.getClassStuNum(classId);
      // 弹窗收费
    },
    getFee(classId) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/config/getClassCharge",
          data: {
            classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.examInfo.price = ret.data.price;
            if (this.payStatus != 3) {
              this.isPayShow = true;
            }
          } else if (ret.code === 243) {
          } else if (ret.code === 244) {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getClassStuNum(classId) {
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/selInfo",
          data: {
            classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.form.stuNum = ret.data.stuNum;
            this.getFee(classId);
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    dateFormat(row) {
      return formatSS(row);
    }
  },
  mounted() {
    this.getClassList();
    this.getExamInfo();
  },
  beforeRouteLeave(to, from, next) {
    this.doSilentSave();
    next();
    // this.$confirm("防止丢失当前设置，是否保存?", "提示", {
    //   confirmButtonText: "保存",
    //   cancelButtonText: "取消",
    //   type: "warning"
    // })
    //   .then(() => {
    //     next();
    //   })
    //   .catch(() => {
    //     next();
    //   });
  }
};
</script>

<style lang="scss" scoped>
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
      background: url("../../assets/img/zfb.png") no-repeat #fff;
      background-size: 100%;
    }
    .pay-type-icon2 {
      background: url("../../assets/img/wx.png") no-repeat #fff;
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
.exam-publish {
  position: relative;
  // /deep/.el-dialog {
  //     margin: 5vh auto !important;
  //   }

  /deep/ .el-dialog__body {
    height: 43vh;
    overflow: hidden;
    overflow-y: auto;
  }

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
        margin-right: 170px;
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
