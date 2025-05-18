<template>
  <div class="new-exam-create">
    <el-tabs class="exam-create-new" v-model="current" @tab-click="handleClick">
      <el-tab-pane class="system container" label="考试信息" name="first">
        <div class="exam-basic-info">
          <div class="top-part-l">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="考试名称">
                <el-input
                  :disabled="true"
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
                  :disabled="true"
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
                  :disabled="true"
                  @change="changePaperTimeType"
                  v-model="form.paperTimeType"
                >
                  <el-radio label="1"
                    ><el-input
                      style="width:60px"
                      placeholder="时长"
                      size="small"
                      :disabled="true"
                      v-model="form.paperTime"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    ></el-input
                    ><span style="color:#333">分钟</span></el-radio
                  >
                  <el-radio label="0">不限时长</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="考试迟到限时">
                <el-switch
                  @change="changeLate"
                  v-model="form.isLateMinute"
                  :disabled="true"
                ></el-switch>
                <span
                  >学生可迟到<el-input
                    style="width:60px"
                    placeholder="时长"
                    size="small"
                    v-model="form.delayMinutes"
                    :disabled="true"
                    oninput="value=value.replace(/[^0-9]/g,'')"
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
              <el-form-item label="答卷次数">
                <el-radio-group
                  @change="changeAnswerTimesType"
                  size="small"
                  :disabled="true"
                  v-model="form.answerTimesType"
                >
                  <el-radio label="0">无限次</el-radio>
                  <el-radio label="1"
                    >有限次<el-input
                      style="width:60px"
                      placeholder="次数"
                      size="small"
                      :disabled="true"
                      v-model="form.answerTimes"
                      oninput="value=value.replace(/[^0-9]/g,'')"
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
                <el-radio-group
                  size="small"
                  :disabled="true"
                  @change="changeStandardScoreType"
                  v-model="form.standardScoreType"
                >
                  <el-radio label="1"
                    ><el-input
                      style="width:90px"
                      placeholder="及格分数"
                      size="small"
                      :disabled="true"
                      v-model="form.standardScore"
                      oninput="value=value.replace(/[^0-9.]/g,'')"
                    ></el-input
                    ><span style="color:#333">分</span></el-radio
                  >
                  <el-radio label="0">不设置及格分数</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="考试方式">
                <el-radio-group
                  size="small"
                  :disabled="true"
                  @input="changeExamType"
                  v-model="form.examType"
                >
                  <!-- <el-radio label="1">班级考试</el-radio>
                <el-radio label="2">扫码考试</el-radio>
                <el-radio label="3">按名单考试</el-radio>
                <el-radio label="4">PC端考试</el-radio> -->
                  <ul style="padding-top:5px">
                    <li style="margin-bottom: 20px;">
                      <el-radio label="1"
                        >班级考试
                        <el-select
                          v-if="form.examType == 1"
                          :disabled="true"
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
                        <span
                          v-if="form.examType == 1"
                          style="margin-left:10px"
                        >
                          <span style="color:#000">考试人数</span
                          ><el-input
                            style="width:60px"
                            placeholder="人数"
                            size="small"
                            v-model="form.stuNum"
                            disabled
                          ></el-input>
                        </span>
                      </el-radio>
                    </li>
                    <li style="margin-bottom: 20px;">
                      <el-radio label="2"
                        >扫码考试
                        <el-input
                          v-if="form.examType == 2"
                          style="width:150px"
                          placeholder="请输入考试人数"
                          size="small"
                          v-model="form.examNum"
                          :disabled="true"
                          oninput="value=value.replace(/[^0-9]/g,'')"
                        ></el-input>
                        <!-- <el-button
                          size="small"
                          :disabled="form.examType != 2"
                          type="text"
                          >生成二维码</el-button
                        > -->
                        <el-button
                          v-if="form.examType == 2"
                          size="small"
                          :disabled="form.examType != 2"
                          type="text"
                          @click="showQrCode"
                          >查看二维码</el-button
                        >
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            学生扫码后可进入考试，扫码人数超过设置的考试人数将无法进入考试
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-radio>
                    </li>
                    <li style="margin-bottom: 20px;">
                      <el-radio label="3"
                        >按名单考试
                        <!-- <el-button
                          size="small"
                          :disabled="form.examType != 3"
                          type="text"
                          @click="toPartIn"
                          >导入名单</el-button
                        > -->
                        <el-button
                          v-if="form.examType == 3"
                          size="small"
                          :disabled="form.examType != 3"
                          type="text"
                          style="margin-left:30px"
                          @click="showNameList"
                          >查看名单</el-button
                        >
                        <el-tooltip effect="dark" placement="right">
                          <div slot="content">
                            请导入正确名单，凡验证通过且注册过九斗的学生都可参加考试，若没有注册无法参加考试
                          </div>
                          <img
                            style="width:15px;margin-left:20px"
                            src="@/assets/images/icon_help.png"
                          />
                        </el-tooltip>
                      </el-radio>
                    </li>
                    <!-- <li>
                      <el-radio label="4">PC端考试</el-radio>
                    </li> -->
                  </ul>
                </el-radio-group>
                <!-- <el-select
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
              </el-select> -->
              </el-form-item>
            </el-form>
          </div>
          <div class="top-part-r">
            <div class="top-part-r-t">
              <div class="top-part-r-t-title">
                <div>考试说明</div>
              </div>
              <div class="exam-instruction-textarea">
                <el-input
                  :disabled="true"
                  :rows="10"
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
        <div style="display:flex;justify-content:center;margin-top:100px">
          <div>
            <!-- <el-button size="small" type="primary" @click="doSaveExam"
              >保存</el-button
            > -->
            <el-button size="medium" type="primary" @click="nextStep"
              >下一步</el-button
            >
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="试卷设置" name="second">
        <div style="height:820px" v-loading="paperLoading.loading">
          <el-container>
            <el-aside width="310px">
              <div class="loadWord-btn">
                <el-button
                  size="small"
                  :disabled="true"
                  @click="handleEmptyTimu"
                  v-if="timuListData.length > 0"
                  >清空试题</el-button
                >
                <el-button
                  size="small"
                  :disabled="true"
                  type="primary"
                  @click="addFixTimu"
                  >+固定题</el-button
                >
                <el-button
                  size="small"
                  :disabled="true"
                  type="primary"
                  @click="addRandomRule"
                  >+随机策略</el-button
                >
              </div>

              <div class="countTitle">
                试题统计
                <div>{{ examInfo.subjectNum }}题</div>
              </div>
              <div class="setScore">
                <!-- 分数：{{
                  Number.isInteger(timuTotalScore)
                    ? Number(timuTotalScore)
                    : Number(timuTotalScore).toFixed(2)
                }} -->
                分数：{{ examInfo.score }}
                <el-button
                  type="text"
                  v-if="timuListData.length > 0"
                  @click="handleSetScore"
                  :disabled="true"
                  >设置分数</el-button
                >
              </div>
              <div class="timuNumList" v-if="subjectStructure.length > 0">
                <div v-for="(item, k) in subjectStructure" :key="k">
                  <span
                    >{{ convert(k + 1) }}、{{ formatType(item.tsubject) }}</span
                  >

                  <div v-for="(ele, j) in item.subjectExtract" :key="j">
                    <span v-if="ele.extractType == 1">
                      <el-button type="text" @click="showRandomContent(ele)">{{
                        ele.randomName
                      }}</el-button>
                      <el-tooltip effect="dark" placement="right">
                        <div slot="content">
                          这里只显示随机抽中的一份题目,每个学生抽到的题目不一样
                        </div>
                        <img
                          style="width:15px;"
                          src="@/assets/images/icon_help.png"
                        />
                      </el-tooltip>
                      <!-- <i
                        class="el-icon-edit-outline"
                        style="cursor: pointer;"
                        @click="toUpdateModeName(ele)"
                      ></i> -->
                    </span>
                    <ul>
                      <li
                        :class="[ele.extractType == 1 ? 'bg-is-random' : '']"
                        v-for="i in ele.subjectIndex"
                        :key="i.bankId"
                        @click="toTimuPosition(i.bankId)"
                      >
                        {{ i.order }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="paperBtn">
                <div>
                  <i
                    class="el-icon-question"
                    style="color:#2BA1F4;font-size:16px"
                  ></i
                  >鼠标悬浮于右侧的题目上可调整题目顺序
                </div>
                <el-button type="primary" style="width:220px" @click="goPublish"
                  >下一步</el-button
                >
              </div>
            </el-aside>
            <el-main class="timuBox">
              <img
                src="@/assets/images/paperInfoImg.png"
                alt=""
                class="paperInfoImg"
                v-if="loadWordForm.radio3 == 1"
              />
              <div class="paperName">
                <div>
                  {{ examInfo.examName }}
                </div>
              </div>
              <div style="text-align:center;font-size:12px;color:#666666;">
                （满分{{
                  Number.isInteger(examInfo.score)
                    ? Number(examInfo.score)
                    : Number(examInfo.score).toFixed(2)
                }}分）
              </div>
              <div class="paperNumTableBox" v-if="loadWordForm.radio3 == 1">
                <div class="paperNumTable">
                  <div class="firstDiv">
                    <div>题号</div>
                    <div>得分</div>
                  </div>
                  <div
                    class="firstDiv"
                    v-for="item in timuListData"
                    :key="item.index"
                  >
                    <div>{{ convert(item.index + 1) }}</div>
                    <div></div>
                  </div>
                  <div class="firstDiv">
                    <div>总分</div>
                    <div></div>
                  </div>
                </div>
              </div>

              <div class="caution" v-if="loadWordForm.radio3 == 1">
                注意事项：答题前填写好自己的姓名、班级、学号等信息。保持卷面整洁。
              </div>
              <ul class="timuList">
                <li v-for="(item, idx) in timuListData" :key="idx">
                  <span class="timuType"
                    >{{ convert(idx + 1) }}、{{
                      formatType(item.tSubject)
                    }}
                    （共{{ item.bankNum }} 小题，共{{
                      Number.isInteger(item.score)
                        ? Number(item.score)
                        : Number(item.score).toFixed(2)
                    }}
                    分）</span
                  >
                  <ul v-if="item.bankList.length > 0">
                    <li
                      v-for="(i, index) in item.bankList"
                      :key="index"
                      :id="i.bankId"
                      @mouseenter="handleTimuMouseenter($event)"
                      @mouseleave="handleTimuMouseleave($event)"
                    >
                      <timu
                        :showSetScore="0"
                        :data="i"
                        :type="showResovleType"
                      ></timu>
                      <div class="timuBtn">
                        <!-- <el-button size="mini" @click="handleDel(i)"
                          >删除</el-button
                        >
                        <el-button
                          size="mini"
                          @click="handleBottomMove(i, index, item.bankList)"
                          >下移</el-button
                        >
                        <el-button
                          size="mini"
                          @click="handleTopMove(i, index, item.bankList)"
                          >上移</el-button
                        > -->
                        <!-- <el-button
                          size="mini"
                          @click="handleChange(i)"
                          :loading="changeLoading"
                          >换题</el-button
                        > -->
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div
                class="paperEmpty"
                v-if="!(timuListData.length > 0)"
                v-loading="dataLaoding"
              >
                <img src="@/assets/images/empty.png" alt="" />
                <!-- <p>暂无题目，请点击“添加试题”进行选题</p> -->
                <div>
                  <el-button
                    size="small"
                    :disabled="true"
                    type="primary"
                    @click="addFixTimu"
                    >添加固定题</el-button
                  >
                  <el-button
                    size="small"
                    :disabled="true"
                    type="primary"
                    @click="addRandomRule"
                    >添加随机题</el-button
                  >
                </div>
              </div>
              <el-backtop target=".timuBox"></el-backtop>
            </el-main>
          </el-container>
        </div>
      </el-tab-pane>
      <el-tab-pane class="system container" label="考试设置" name="third">
        <div class="bottom-part-setting">
          <div class="bottom-part-l">
            <div class="flag-title">题目设置</div>
            <div class="bottom-f">
              <el-form ref="form" :model="form">
                <el-form-item label="题目是否随机">
                  <el-switch
                    :disabled="true"
                    v-model="form.isSubjectRandom"
                  ></el-switch>
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
                  <el-switch
                    :disabled="true"
                    v-model="form.isOptionRandom"
                  ></el-switch>
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
              </el-form>
            </div>
            <div class="f-title">成绩设置</div>
            <div class="bottom-f">
              <el-form ref="form" :model="form">
                <el-form-item label="显示成绩">
                  <el-switch
                    :disabled="true"
                    v-model="form.isShowScore"
                  ></el-switch>
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
                  <el-switch
                    :disabled="true"
                    v-model="form.isShowRanking"
                  ></el-switch>
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
                  <el-switch
                    :disabled="true"
                    v-model="form.isShowPaper"
                  ></el-switch>
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
                  <el-radio-group
                    size="small"
                    :disabled="true"
                    v-model="form.showAnswer"
                  >
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
          <div class="bottom-part-r">
            <div class="f-title">考试防作弊</div>
            <div class="bottom-f">
              <el-form>
                <el-form-item label="切屏强制交卷">
                  <el-switch
                    :disabled="true"
                    @change="changeForceSubmit"
                    v-model="form.forceSubmit"
                  ></el-switch>
                  <span style="color:#333">切换页面超过</span>
                  <el-input
                    style="width:60px"
                    size="small"
                    :disabled="true"
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
                    :disabled="true"
                    @change="changeIsChallenge"
                    v-model="form.isChallenge"
                  ></el-switch>
                  <span style="color:#333">只允许错</span>
                  <el-input
                    :disabled="true"
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
                    :disabled="true"
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
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      此功能仅限PC端考试
                    </div>
                    <img
                      style="width:15px;margin-left:20px"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="人脸识别">
                  <el-switch disabled v-model="form.isFace"></el-switch>
                  <span>核验成功后才能进入考试参与答题</span>
                  <el-tooltip effect="dark" placement="right">
                    <div slot="content">
                      此功能仅限PC端考试
                    </div>
                    <img
                      style="width:15px;margin-left:20px"
                      src="@/assets/images/icon_help.png"
                    />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="限时答题">
                  <el-switch disabled v-model="form.isTimeLimited"></el-switch>
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
        </div>
        <div style="display:flex;justify-content:center;margin-top:100px">
          <div>
            <!-- <el-button size="small" type="primary" @click="doSaveExam"
              >保存</el-button
            >
            <el-button size="small" type="primary" @click="doPublish"
              >发布考试</el-button
            > -->
          </div>
        </div>
      </el-tab-pane>
      <!-- 策略修改 -->
      <el-dialog
        :visible.sync="isEditModeShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>修改策略名称</div>
          </div>
        </template>
        <el-form
          :model="modeForm"
          :rules="modeFormRules"
          ref="modeForm"
          label-width="90px"
          style="margin:20px 70px;"
          @submit.native.prevent
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="modeForm.name" size="small"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="primary" @click="editModeFormSure"
            >确定</el-button
          >
          <el-button size="small" @click="isEditModeShow = false" type="primary"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="isAddModeShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>新增随机策略</div>
          </div>
        </template>
        <el-form
          :model="modeAddForm"
          :rules="modeAddFormRules"
          ref="modeAddForm"
          label-width="90px"
          style="margin:20px 70px;"
          @submit.native.prevent
        >
          <el-form-item label="策略名称" prop="name">
            <el-input v-model.trim="modeAddForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="题型" prop="tSubject">
            <el-select
              v-model="modeAddForm.tSubject"
              style="width:100px"
              label="题型"
              size="small"
            >
              <el-option label="单选题" value="2"></el-option>
              <el-option label="判断题" value="1"></el-option>
              <el-option label="多选题" value="3"></el-option>
              <el-option label="填空题" value="4"></el-option>
              <el-option label="问答题" value="5"></el-option>
              <el-option label="组合题" value="11"></el-option>
            </el-select>
            <!-- <el-input v-model.trim="modeAddForm.tSubject" size="small"></el-input> -->
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="primary" @click="addRandomSure"
            >确定</el-button
          >
          <el-button size="small" @click="isAddModeShow = false" type="primary"
            >取消</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        top="6vh"
        v-if="isFixShow"
        :visible.sync="isFixShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>添加固定题</div>
          </div>
        </template>

        <div class="top">
          <!-- <el-input
            size="small"
            v-model.trim="keyWord"
            placeholder="请输入试卷名称"
            style="width: 300px"
            @keyup.enter.native="searchPaper"
          ></el-input> -->
          <el-button
            type="primary"
            :disabled="true"
            size="small"
            @click="handSelect"
            >手动选题</el-button
          >
          <el-button
            type="primary"
            :disabled="true"
            size="small"
            @click="openTip"
            >知识点抽题</el-button
          >
        </div>
        <el-table
          :data="fixSubjectList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="题目" align="center" prop="briefTitle">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div
                  style="text-align: left;max-height: 18px;overflow: hidden;"
                  v-html="scope.row.briefTitle"
                ></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="知识点" align="center" width="250px">
            <template slot-scope="scope">
              <span v-html="scope.row.learnPort"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="难度系数"
            prop="difficultyRate"
            align="center"
            width="100px"
          ></el-table-column>

          <el-table-column
            label="题型"
            align="center"
            prop="tSubject"
            :formatter="formatType1"
            width="90px"
          ></el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="preview(scope.row)"
                >预览</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="delFixSubject(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{ (this.fixPage.currentPage - 1) * this.fixPage.pagesize + 1 }}
            到
            {{
              (this.fixPage.currentPage - 1) * this.fixPage.pagesize +
                this.fixSubjectList.length
            }}
            记录，共 {{ fixPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :page-sizes="[10, 30, 50]"
            :total="fixPage.total"
            :current-page.sync="fixPage.currentPage"
            @current-change="getFixSubject"
            :page-size="fixPage.pagesize"
          >
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="isFixShow = false"
            >确定</el-button
          >

          <el-button size="small" @click="isFixShow = false">取消</el-button>
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 随机策略查看编辑 -->
      <el-dialog
        top="6vh"
        v-if="isRandomContentShow"
        :visible.sync="isRandomContentShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ randomForm.randomName }}</div>
          </div>
        </template>

        <div class="top">
          <!-- <el-input
            size="small"
            v-model.trim="keyWord"
            placeholder="请输入试卷名称"
            style="width: 300px"
            @keyup.enter.native="searchPaper"
          ></el-input> -->
          <span style="margin-right:30px"
            >题型：{{ formatType(randomForm.tSubject) }}</span
          >
          <el-button
            type="primary"
            :disabled="true"
            size="small"
            @click="handSelect"
            >手动选题</el-button
          >
          <el-button
            type="primary"
            :disabled="true"
            size="small"
            @click="openTip"
            >知识点抽题</el-button
          >
          <span style="margin-left:30px">抽题数量</span>
          <el-input
            v-model="randomForm.bankNum"
            style="width:60px"
            size="small"
            placeholder=""
            :disabled="true"
          ></el-input>
          <span>/{{ randomForm.totalNum }}道</span>
          <span style="margin-left:30px">每题分数</span>
          <el-input
            v-model="randomForm.score"
            style="width:60px"
            size="small"
            placeholder=""
            :disabled="true"
          ></el-input>
        </div>
        <el-table
          :data="randomSubjectList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="题目" align="center" prop="briefTitle">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div
                  style="text-align: left;max-height: 18px;overflow: hidden;"
                  v-html="scope.row.briefTitle"
                ></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="知识点" align="center" width="250px">
            <template slot-scope="scope">
              <span v-html="scope.row.learnPort"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="难度系数"
            prop="difficultyRate"
            align="center"
            width="100px"
          ></el-table-column>

          <el-table-column
            label="题型"
            align="center"
            prop="tSubject"
            :formatter="formatType1"
            width="90px"
          ></el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="preview(scope.row)"
                >预览</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="delRandomSubject(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{
              (this.randomPage.currentPage - 1) * this.randomPage.pagesize + 1
            }}
            到
            {{
              (this.randomPage.currentPage - 1) * this.randomPage.pagesize +
                this.randomSubjectList.length
            }}
            记录，共 {{ randomPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :page-sizes="[10, 30, 50]"
            :total="randomPage.total"
            :current-page.sync="randomPage.currentPage"
            @current-change="getRandomSubject"
            :page-size="randomPage.pagesize"
          >
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            :disabled="true"
            type="primary"
            @click="editRandomScore"
            >确定</el-button
          >

          <el-button
            size="small"
            :disabled="true"
            type="primary"
            @click="delRandomRule"
            >删除策略</el-button
          >
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 随机策略添加题目 -->
      <el-dialog
        top="6vh"
        v-if="isRandomShow"
        :visible.sync="isRandomShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ randomForm.randomName }}</div>
          </div>
        </template>

        <div class="top">
          <!-- <el-input
            size="small"
            v-model.trim="keyWord"
            placeholder="请输入试卷名称"
            style="width: 300px"
            @keyup.enter.native="searchPaper"
          ></el-input> -->
          <span style="margin-right:30px"
            >题型：{{ formatType(randomForm.tSubject) }}</span
          >
          <el-button type="primary" size="small" @click="handSelect"
            >手动选题</el-button
          >
          <el-button type="primary" size="small" @click="openTip"
            >知识点抽题</el-button
          >
          <span style="margin-left:30px">抽题数量</span>
          <el-input
            v-model="randomForm.bankNum"
            style="width:60px"
            size="small"
            placeholder=""
          ></el-input>
          <span>/{{ randomForm.totalNum }}道</span>
          <span style="margin-left:30px">每题分数</span>
          <el-input
            v-model="randomForm.score"
            style="width:60px"
            size="small"
            placeholder=""
          ></el-input>
        </div>
        <el-table
          :data="randomSubjectList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="题目" align="center" prop="briefTitle">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div
                  style="text-align: left;max-height: 18px;overflow: hidden;"
                  v-html="scope.row.briefTitle"
                ></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="知识点" align="center" width="250px">
            <template slot-scope="scope">
              <span v-html="scope.row.learnPort"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="难度系数"
            prop="difficultyRate"
            align="center"
            width="100px"
          ></el-table-column>

          <el-table-column
            label="题型"
            align="center"
            prop="tSubject"
            :formatter="formatType1"
            width="90px"
          ></el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="preview(scope.row)"
                >预览</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="delRandomSubject(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{
              (this.randomPage.currentPage - 1) * this.randomPage.pagesize + 1
            }}
            到
            {{
              (this.randomPage.currentPage - 1) * this.randomPage.pagesize +
                this.randomSubjectList.length
            }}
            记录，共 {{ randomPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :page-sizes="[10, 30, 50]"
            :total="randomPage.total"
            :current-page.sync="randomPage.currentPage"
            @current-change="getRandomSubject"
            :page-size="randomPage.pagesize"
          >
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="editRandomScore"
            >确定</el-button
          >

          <el-button size="small" @click="isRandomShow = false">取消</el-button>
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 考试口令二维码 -->
      <el-dialog
        top="6vh"
        v-if="isExamQrCodeShow"
        :visible.sync="isExamQrCodeShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>考试码</div>
          </div>
        </template>

        <div style="display:flex;flex-direction:column;align-items:center">
          <div class="examCode-container">
            <vue-qr
              class="examCode"
              :text="examCode"
              colorDark="#000"
              colorLight="#fff"
              :margin="5"
              :size="200"
            ></vue-qr>
          </div>
          <div class="exam-password">
            考试口令：<span style="font-size:30px">{{
              examInfo.password
            }}</span>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="downloadExamCode"
            >下载二维码</el-button
          >

          <!-- <el-button size="small" @click="isFixShow = false"
            >复制口令</el-button
          > -->
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 手动选题弹窗 -->
      <el-dialog
        top="6vh"
        v-if="isHandChooseShow"
        :visible.sync="isHandChooseShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        class="selectTip"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>手动选题(已选{{ selectedTest.length }}题)</div>
          </div>
        </template>

        <div>
          <!-- <el-form style="margin-top:20px" v-if="selectedTest.length > 0">
            <el-form-item>
              <span>选择题目-已选{{ selectedTest.length }}题</span>
            </el-form-item>
          </el-form> -->
          <el-form :inline="true" v-model="testSelectForm1" size="small">
            <el-form-item label="题库">
              <el-select
                v-model="testSelectForm1.rlType"
                @change="slTypeChange"
                style="width:100px;margin-left:28px;"
              >
                <el-option label="公共" value="0"></el-option>
                <el-option label="我的" value="1"></el-option>
                <el-option label="使用记录" value="2"></el-option>
                <el-option label="教材" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="testSelectForm1.rlType == 0"
              style="width:200px;"
            >
              <el-select
                v-model="testSelectForm1.comLib"
                @change="testComTkSearch"
                size="small"
              >
                <el-option
                  v-for="item in comTKList"
                  :key="item.id"
                  :label="item.sblName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="testSelectForm1.rlType == 1"
              style="width:200px;"
            >
              <el-cascader
                v-model="testSelectForm1.myLib"
                :options="myTKList"
                @change="testMyTkSearch"
                :props="myTkProps1"
              ></el-cascader>
              <!-- <el-select
            v-model="testSelectForm.myLib"
            @change="testMyTkSearch"
            size="small"
          >
            <el-option
              v-for="item in myTKList"
              :key="item.id"
              :label="item.sblName"
              :value="item.id"
            ></el-option>
          </el-select> -->
            </el-form-item>
            <el-form-item v-if="testSelectForm1.rlType == 0">
              <el-tree-select
                @input="tipSelectChange"
                :styles="tipTreeStyle1"
                :value="testSelectForm1.tips"
                :selectParams="selectParams1"
                :treeParams="treeParams1"
                @searchFun="tipSearch"
                ref="comTreeSelect"
              />
            </el-form-item>
            <el-form-item
              style="width:200px"
              v-if="testSelectForm1.rlType == 1"
            >
              <el-select
                v-model="testSelectForm1.tipText"
                filterable
                clearable
                placeholder="请选择知识点"
                size="small"
                @change="slTypeChange"
              >
                <el-option
                  v-for="item in myLibTip1"
                  :key="item.tipText"
                  :label="item.tipText"
                  :value="item.tipText"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              style="width:200px"
              v-if="testSelectForm1.rlType == 3"
            >
              <el-select
                @change="selectBookChange"
                v-model="bookId"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in bookList"
                  :key="index"
                  :label="item.textbookName"
                  :value="item.textbookId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题型" style="margin-left:15px;">
              <el-select
                v-model="testSelectForm1.type"
                style="width:100px"
                placeholder="题型"
                :disabled="randomForm.randomId.length > 0"
                @change="testSearch"
              >
                <el-option
                  v-for="type in allTypes"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="testSelectForm1.rlType != 3"
              label="难度系数"
              style="margin-left:15px;"
            >
              <el-select
                v-model="testSelectForm1.diff"
                style="width:100px"
                placeholder="难度系数"
                @change="testSearch"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目内容" style="display:block">
              <el-input
                placeholder="搜索题目"
                v-model="testSelectForm1.keywords"
                @keyup.enter.native="testSearch"
                style="width:auto"
              ></el-input>
              <el-button
                type="primary"
                @click="testSearch"
                class="el-icon-search"
                style="margin-left:15px;"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="testSelectListTable"
            :data="testSelectList1"
            stripe
            border
            v-loading="loading.testSelectLoading"
            @selection-change="changeSelect"
            :row-key="getRowKeys"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
            ></el-table-column>
            <el-table-column
              label="ID"
              align="center"
              prop="id"
              width="90px"
            ></el-table-column>
            <el-table-column
              label="标签"
              prop="uniqueId"
              align="center"
              width="150px"
              v-if="roleId != 24"
            ></el-table-column>
            <!-- <el-table-column
          label="难度"
          prop="difficultyLevel"
          align="center"
          width="60px"
          :formatter="formatDiff"
        ></el-table-column> -->
            <el-table-column
              label="难度系数"
              prop="accuracyRate"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column label="知识点" align="center" width="250px">
              <template slot-scope="scope">
                <span v-html="scope.row.learnPort"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="题型"
              align="center"
              prop="tSubject"
              :formatter="formatType1"
              width="90px"
            ></el-table-column>
            <el-table-column label="题目" align="center" prop="briefTitle">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between">
                  <div
                    style="text-align: left;max-height: 18px;overflow: hidden;"
                    v-html="scope.row.briefTitle"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="testSelectForm1.rlType == 2"
              label="使用次数"
              align="center"
              prop="answerCounts"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="70px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="preview(scope.row)"
                  >预览</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="testSelectList1.length" class="right-footer-first">
              从{{
                (testSelectPage1.page - 1) * testSelectPage1.pagesize + 1
              }}到{{
                (testSelectPage1.page - 1) * testSelectPage1.pagesize +
                  testSelectList1.length
              }}记录，共{{ testSelectPage1.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              v-if="testSelectForm1.rlType == 3"
              layout="prev, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="testSelectPage1.total"
              @size-change="handleSizeChange"
              :page-size="testSelectPage1.pagesize"
              :current-page.sync="testSelectPage1.page"
              background
              @current-change="loadBookTestList"
            >
            </el-pagination>
            <el-pagination
              v-else
              layout="prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="testSelectPage1.total"
              @size-change="handleSizeChange"
              :page-size="testSelectPage1.pagesize"
              :current-page.sync="testSelectPage1.page"
              background
              @current-change="loadSubjects"
            >
            </el-pagination>
          </div>
        </div>

        <!-- <viewPaper
          :examInfo="paperInfo"
          :timuListData="timuListData"
          :timuTotalScore="timuTotalScore"
        ></viewPaper> -->

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handChooseSure"
            >确认</el-button
          >
          <el-button size="small" @click="isHandChooseShow = false"
            >取消</el-button
          >
        </span>
      </el-dialog>

      <!-- 预览 -->
      <el-dialog
        :visible.sync="isPreviewShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="800px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>题目预览</div>
          </div>
        </template>
        <preview
          :data="previewSubject"
          style="height:400px;overflow-y: auto"
        ></preview>
      </el-dialog>

      <!-- 知识点抽题弹窗 -->
      <el-dialog
        top="6vh"
        v-if="isTipShow"
        :visible.sync="isTipShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        class="selectTip"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>知识点抽题</div>
          </div>
        </template>

        <el-container>
          <el-aside width="310px">
            <el-form v-model="selectForm" size="small">
              <el-form-item label="题库">
                <el-select v-model="selectForm.libType" @change="handleChange">
                  <el-option label="公共题库" value="0"></el-option>
                  <el-option label="我的题库" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="selectForm.libType == 0"
                style="margin-left:40px"
              >
                <el-select
                  v-model="selectForm.comLib"
                  @change="comTkSearch"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in comTKList"
                    :key="item.id"
                    :label="item.sblName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="selectForm.libType == 1"
                style="margin-left:40px"
              >
                <el-cascader
                  style="width:215px"
                  v-model="selectForm.myLib"
                  :options="myTKList"
                  @change="myTkSearch"
                  :props="myTkProps"
                  clearable
                ></el-cascader>
                <!-- <el-select
              v-model="selectForm.myLib"
              @change="myTkSearch"
              size="small"
              clearable
            >
              <el-option
                v-for="item in myTKList"
                :key="item.sblId"
                :label="item.sblName"
                :value="item.id"
              ></el-option>
            </el-select> -->
              </el-form-item>
            </el-form>
            <div v-if="comTkTips.length > 0">
              <el-input
                size="small"
                placeholder="输入关键字进行过滤"
                v-model="filterText"
              ></el-input>
              <el-tree
                ref="tipTree"
                :data="comTkTips"
                show-checkbox
                node-key="tipId"
                @check-change="getChecked"
                :props="treeProps"
                default-expand-all
                :filter-node-method="filterNode"
                @check="handleClickNode"
              ></el-tree>
            </div>
            <div v-if="myTkTips.length > 0">
              <el-input
                size="small"
                placeholder="输入关键字进行过滤"
                v-model="myTipFilterText"
              ></el-input>
              <el-tree
                ref="myTipTree"
                :data="myTkTips"
                show-checkbox
                node-key="tipText"
                @check-change="myTipGetChecked"
                :props="myLibTreeProps"
                default-expand-all
                :filter-node-method="myTipfilterNode"
                @check="handleClickNode"
              ></el-tree>
            </div>
          </el-aside>
          <el-main>
            <div class="lisTitle">
              <span class="verLine"></span>
              <span>已选知识点</span>
              <el-button size="medium" type="text" @click="handleEmptyTips"
                >清空</el-button
              >
            </div>
            <div class="emptyTipTs" v-if="tipTags.length == 0">
              请从左侧选择题库和知识点
            </div>
            <el-tag
              v-for="(tag, index) in tipTags"
              @close="handleClose(tag)"
              :key="index"
              closable
            >
              {{ tag.name }}
            </el-tag>
            <div class="lisTitle" style="margin-top:20px">
              <span class="verLine"></span>
              <span>选题设置</span>
              <!-- <span>(注：总题数不能超过50题)</span> -->
              <!-- <span
                >已选题数： {{ totalNum }} 题
                <span style="margin-left:15px"
                  >总分： {{ totalSore }} 分</span
                ></span
              > -->
            </div>
            <el-table
              :data="tableData"
              stripe
              border
              v-if="tableData.length > 0"
              :header-cell-style="{
                'background-image':
                  'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                color: '#333333',
                height: '40px',
                padding: '0'
              }"
            >
              <el-table-column
                label="题型"
                align="center"
                prop="name"
                :formatter="formatTypeTable"
              ></el-table-column>
              <el-table-column
                label="可选题数"
                align="center"
                prop="number"
              ></el-table-column>
              <el-table-column label="选取题数" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.selectNum"
                    :min="0"
                    controls-position="right"
                    size="mini"
                    :max="scope.row.number"
                    @change="handleSelectNum(scope.row)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <!-- <el-table-column label="单题分值" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.score"
                    :min="1"
                    controls-position="right"
                    size="mini"
                    @change="handleSelectScore(scope.row)"
                  ></el-input-number>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="btmBtn">
              <div class="ts">
                先从左侧选择题库和知识点，再按题型设置抽题数
              </div>
              <el-button
                type="primary"
                @click="doCreatPaper"
                :disabled="totalNum > 0 ? false : true"
                :loading="creatLoading"
                >抽取题目</el-button
              >
            </div>
          </el-main>
        </el-container>

        <!-- <viewPaper
          :examInfo="paperInfo"
          :timuListData="timuListData"
          :timuTotalScore="timuTotalScore"
        ></viewPaper>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="copyPaper" type="primary"
            >复制试卷</el-button
          >
          <el-button size="small" @click="isViewPaperShow = false"
            >取消</el-button
          >
        </span> -->
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 考试弹窗 -->
      <el-dialog
        title=""
        :visible.sync="isPayShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handlePayClose"
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
              <el-button @click="handlePayClose" class="but-pay"
                >取消</el-button
              >
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

      <!-- 导入 -->
      <jd-dialog
        title="导入考试名单"
        top="15vh"
        :visible.sync="showImport"
        @sure="doImportSure"
      >
        <template slot="body">
          <div style="padding: 0 100px">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="70px"
            >
              <!-- <el-form-item label="学校" prop="partInSchool">
                <el-autocomplete
                  size="small"
                  v-model.trim="ruleForm.partInSchool"
                  :fetch-suggestions="querySearch"
                  placeholder="请选择学校"
                  @select="handleSelectSchool"
                  style="width:290px"
                ></el-autocomplete>
              </el-form-item> -->
              <el-form-item label="选择文件">
                <fileModal
                  ref="subjectsFile"
                  @fileChange="handleFileChange"
                ></fileModal>
                <div class="el-upload__tip" style="line-height:17px">
                  当前仅支持后缀名为.xls的Excel文档;
                </div>
              </el-form-item>
            </el-form>
            <span>考试名单导入模板点击下载：</span
            ><el-button
              type="primary"
              size="mini"
              style="background:#11BCE4;border:none"
              @click="downloadFormwork"
              >考试名单导入模板.xls</el-button
            >
          </div>
        </template>
      </jd-dialog>

      <!-- 预览名单 -->
      <el-dialog
        top="6vh"
        v-if="isNameListShow"
        :visible.sync="isNameListShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1000px"
        center
        class="name-list"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>考试名单预览</div>
          </div>
        </template>

        <!-- <div class="top">
        <el-input
          size="small"
          v-model.trim="keyWord"
          placeholder="请输入试卷名称"
          style="width: 300px"
          @keyup.enter.native="searchPaper"
        ></el-input>
        <el-button
          type="primary"
          @click="searchPaper"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div> -->
        <div>注：<span style="color:red">红色</span>标记为考试已有重复名单</div>
        <el-table
          v-loading="loading.nameListLoading"
          :data="nameList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="学校" prop="school" align="center">
            <template slot-scope="scope">
              <!-- style="color:#2BA1F4;" -->
              <span
                :style="scope.row.duplicateFlag == true ? 'color:red' : ''"
                >{{ scope.row.school }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="学院" prop="department" align="center">
            <template slot-scope="scope">
              <span
                :style="scope.row.duplicateFlag == true ? 'color:red' : ''"
                >{{ scope.row.department }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="学号" prop="number" align="center">
            <template slot-scope="scope">
              <!-- style="color:#2BA1F4;" -->
              <span
                :style="scope.row.duplicateFlag == true ? 'color:red' : ''"
                >{{ scope.row.number }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name" align="center">
            <template slot-scope="scope">
              <!-- style="color:#2BA1F4;" -->
              <span
                :style="scope.row.duplicateFlag == true ? 'color:red' : ''"
                >{{ scope.row.name }}</span
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.paperPage.currentPage - 1) * this.paperPage.pagesize + 1 }}
          到
          {{
            (this.paperPage.currentPage - 1) * this.paperPage.pagesize +
              this.nameList.length
          }}
          记录，共 {{ paperPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="paperPage.total"
          :current-page.sync="paperPage.currentPage"
          :page-size="paperPage.pagesize"
          @current-change="getNameList"
        >
        </el-pagination>
      </div> -->

        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            :disabled="duplicateFlag"
            type="primary"
            :loading="isBtnLoading"
            @click="showNamePay"
            >确定</el-button
          >

          <el-button size="small" @click="isNameListShow = false"
            >取消</el-button
          >
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 查看考试名单 -->
      <el-dialog
        top="6vh"
        v-if="isStuShow"
        :visible.sync="isStuShow"
        :lock-scroll="false"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="1200px"
        center
      >
        <template slot="title">
          <div>
            <div></div>
            <div>查看考试名单</div>
          </div>
        </template>

        <div class="top" style="display:flex;justify-content:flex-end">
          <!-- <el-input
            size="small"
            v-model.trim="keyWord"
            placeholder="请输入试卷名称"
            style="width: 300px"
            @keyup.enter.native="searchPaper"
          ></el-input> -->
          <!-- <el-button type="primary" size="small" @click="rePartIn"
            >再次导入</el-button
          > -->
        </div>
        <el-table
          :data="examStuList"
          border
          style="margin-top:15px"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="学号" prop="sNumber" align="center">
          </el-table-column>
          <el-table-column label="姓名" prop="sName" align="center">
          </el-table-column>
          <!-- <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="delExamStu(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <div class="tabelFooter">
          <div class="right-footer-first">
            从
            {{
              (this.examStuPage.currentPage - 1) * this.examStuPage.pagesize + 1
            }}
            到
            {{
              (this.examStuPage.currentPage - 1) * this.examStuPage.pagesize +
                this.examStuList.length
            }}
            记录，共 {{ examStuPage.total }} 条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            background
            :page-sizes="[10, 30, 50]"
            :total="examStuPage.total"
            :current-page.sync="examStuPage.currentPage"
            @current-change="getExamStuList"
            :page-size="examStuPage.pagesize"
          >
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="showQrCode"
            >查看二维码</el-button
          >

          <el-button size="small" @click="isStuShow = false">取消</el-button>
        </span>
        <!-- <el-scrollbar height="300px"> </el-scrollbar> -->
      </el-dialog>

      <!-- 设置分值 -->
      <el-dialog
        :visible.sync="isSetScoreShow"
        v-if="isSetScoreShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="700px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>
              设置分值（<span
                style="border-left:17px solid #ffa340;padding-left:1px"
                >随机题目</span
              >）
            </div>
          </div>
        </template>
        <div class="scoreSet" style="height:400px;overflow-y: auto">
          <div
            v-for="(item, idx) in scoreListData"
            class="score-container"
            :key="idx"
          >
            <span
              >{{ convert(idx + 1) }}、{{ formatType(item.tsubject) }} （{{
                Number.isInteger(item.score)
                  ? Number(item.score)
                  : Number(item.score).toFixed(2)
              }}
              分）
              <el-input
                size="mini"
                v-model="item.typeSetScoreInput"
                @input="handleScoreChangeAll(item)"
                style="width:100px;margin-left:20px"
              ></el-input>
            </span>
            <div
              v-for="(ele, j) in item.subjectExtract"
              class="score-item-box"
              :key="j"
            >
              <span v-if="ele.extractType == 1">
                <span style="color: #409EFF">{{ ele.randomName }}</span>
              </span>
              <ul>
                <li v-for="(i, idx) in ele.subjectIndex" :key="idx">
                  <div
                    :class="[ele.extractType == 1 ? 'bg-is-random' : '']"
                    class="tihao"
                  >
                    {{ i.order }}
                  </div>
                  <el-input
                    :disabled="ele.extractType == 1"
                    size="mini"
                    @input="handleScoreChange(i, item)"
                    v-model="i.score"
                  ></el-input>
                </li>
              </ul>
            </div>

            <!-- <ul>
              <li v-for="(i, idx) in item.bankList" :key="idx">
                <div class="tihao">{{ i.timuNum + 1 }}</div>
                <el-input
                  size="mini"
                  v-model="i.score"
                  @input="handleScoreChange(item, i)"
                ></el-input>
              </li>
            </ul> -->
          </div>
        </div>
        <span slot="footer">
          <el-button size="small" type="primary" @click="doSetScoreSure"
            >确定</el-button
          >
          <el-button size="small" @click="isSetScoreShow = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 换题 -->
      <!-- <el-dialog
      :visible.sync="isChangeTimuShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="700px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>替换试题 ———— 第{{ currentTimu.timuNum + 1 }}题</div>
        </div>
      </template>
      <el-tabs type="border-card" v-model="activeId">
        <el-tab-pane
          :label="String(index + 1)"
          v-for="(item, index) in changeTimuData"
          :key="index"
          :name="String(item.id)"
        >
          <timu
            :data="item"
            :type="1"
            style="height:300px;overflow-y: auto"
          ></timu>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button size="mini" type="primary" @click="handleChange()"
          >换一批</el-button
        >
        <el-button size="small" type="primary" @click="doChangeTimuSure"
          >确定</el-button
        >
        <el-button size="small" @click="isChangeTimuShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog> -->
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.new-exam-create {
  /deep/ .el-tabs__header {
    background: white;
    padding: 0 52px;
    height: 50px;
    line-height: 50px;
    margin: 0;
    .el-tabs__item {
      font-size: 16px;
    }
  }
  .exam-create-new {
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

    .examCode-container {
      background: url("~@/assets/images/img_qrcode_line.png");
      background-color: #0e4378;
      border: 1px solid rgba(255, 255, 255, 0.3);
      width: 300px;
      height: 300px;
      margin-top: 21px;
      margin-bottom: 30px;
      margin-left: 24px;
      padding: 46px 27px 0px 27px;
      text-align: center;
      background-size: 100%;
      .examCode {
      }
      .exam-password {
        font-size: 20px;
      }
    }
    .selectTip {
      /deep/ .el-dialog__body {
        height: 80vh;
        overflow: hidden;
        overflow-y: auto;
        .el-container {
          padding: 0;
          .el-aside {
            overflow-y: auto;
            .el-tree {
              background: #fbfbfb;
              padding: 10px 0;
            }
            .el-tree-node__label {
              display: inline-block;
              max-width: 180px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .el-main {
            background: #ffffff;
            border-radius: 4px;
            min-height: 638px;
            padding: 20px 20px 0 20px;
            position: relative;
            .lisTitle {
              overflow: hidden;
              height: 36px;
              line-height: 36px;
              margin-bottom: 10px;
              .verLine {
                float: left;
                width: 3px;
                height: 16px;
                background: #2ba1f4;
                margin-top: 10px;
                margin-right: 8px;
              }
              .el-button {
                float: right;
              }
              span:nth-child(3) {
                color: #999999;
                font-size: 12px;
              }
              span:nth-child(4) {
                color: #999999;
                float: right;
              }
            }
            .emptyTipTs {
              margin-top: 15px;
              margin-left: 12px;
              font-size: 16px;
              color: #999999;
            }
            .el-tag {
              margin-right: 10px;
              margin-bottom: 5px;
            }
            .el-tag + .el-tag {
              margin-right: 10px;
            }
            .btmBtn {
              text-align: center;
              margin-top: 30px;
              .ts {
                font-size: 12px;
                color: #999999;
                margin-bottom: 20px;
              }
            }
          }
        }
      }
    }

    .scoreSet {
      padding: 15px 25px;
      .score-container {
        .score-item-box {
          ul {
            list-style: none;
            overflow: hidden;
            padding-left: 0;
            margin: 0;
            margin-top: 14px;
            li {
              float: left;
              width: 36px;
              text-align: center;
              margin-right: 15px;
              margin-bottom: 15px;
              .bg-is-random {
                background-color: #ffa340;
                color: #fff;
              }
              .tihao {
                height: 36px;
                line-height: 36px;
                border: 1px solid #e4e4e4;
                // border-radius: 5px;
                margin-bottom: 5px;
              }
              // .el-input-number {
              //   width: 36px;

              //   input {
              //     text-align: center;
              //     color: #2ba1f4;
              //     padding: 0;
              //     font-weight: 600;
              //   }
              // }
              .el-input {
                width: 36px;

                /deep/ .el-input__inner {
                  text-align: center;
                  color: #2ba1f4;
                  padding: 0;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
      // div {
      //   color: #666666;
      //   font-size: 14px;
      // }
    }

    .el-container {
      padding: 20px 20px 0;
      height: 100%;
      // overflow: auto;
      .el-aside {
        background: #ffffff;
        border-radius: 4px;
        margin-right: 15px;
        width: 100%;
        max-height: 100%;
        overflow-y: hidden;
        padding-bottom: 167px;
        position: relative;
        .loadWord-btn {
          width: 90%;
          margin-left: 20px;
          margin-top: 30px;
        }
        .paperSetTitle {
          background-color: #e4e4e4;
          padding-left: 30px;
          height: 45px;
          line-height: 45px;
          width: 100%;
          color: #666666;
          font-size: 16px;
          margin-top: 30px;
        }
        .paperSetBody {
          height: 62px;
          line-height: 62px;
          padding-left: 30px;
          .banshi {
            margin-right: 15px;
            font-size: 14px;
          }
        }
        .countTitle {
          margin-top: 30px;
          background-color: #e4e4e4;
          padding: 0 30px;
          height: 45px;
          line-height: 45px;
          color: #666666;
          font-size: 16px;
          div {
            float: right;
          }
        }
        .setScore {
          padding: 0 30px;
          font-size: 15px;
          height: 52px;
          line-height: 52px;
          color: #393939;
          .el-button {
            float: right;
            height: 52px;
          }
        }
        .timuNumList {
          padding: 15px 25px;
          // max-height: 300px;
          overflow-y: auto;
          height: 482px;
          // border-bottom: 1px solid #E4E4E4;
          border-top: 1px solid #e4e4e4;
          div {
            color: #666666;
            font-size: 14px;
            ul {
              list-style: none;
              overflow: hidden;
              padding-left: 0;
              margin: 0;
              margin-top: 14px;
              li {
                float: left;
                width: 36px;
                height: 36px;
                line-height: 36px;
                border: 1px solid #e4e4e4;
                text-align: center;
                margin-right: 15px;
                margin-bottom: 15px;
                border-radius: 5px;
                cursor: pointer;
              }
              .bg-is-random {
                background-color: #ffa340;
                color: #fff;
              }
            }
          }
        }
        // .timuNumList::-webkit-scrollbar{
        //   width:3px;
        //   height:2px;
        //   background:#ccc;
        //   border-radius:5px;
        // }
        // .timuNumList::-webkit-scrollbar-thumb{
        //   display:block;
        //   width:2px;
        //   margin:0 auto;
        //   border-radius: 5px;
        //   background:rgba(43,161,244,0.6);
        // }
        .paperBtn {
          width: 305px;
          padding: 20px 0 20px 0;
          position: fixed;
          bottom: 20px;
          border-radius: 4px;
          background: #ffffff;
          border-top: 1px solid #e4e4e4;
          text-align: center;
          div {
            font-size: 12px;
            text-align: center;
            color: #999999;
          }
          .el-button {
            margin-top: 15px;
          }
        }
      }
      .el-aside::-webkit-scrollbar {
        width: 3px;
        height: 2px;
        // background:#ccc;
        border-radius: 5px;
      }
      .el-aside::-webkit-scrollbar-thumb {
        display: block;
        width: 2px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(43, 161, 244, 0.6);
      }
      .el-main {
        background: #ffffff;
        border-radius: 4px;
        height: 100%;
        overflow-y: auto;
        padding: 13px 13px 13px 50px;
        position: relative;
        .paperInfoImg {
          position: absolute;
          top: 30px;
          left: 10px;
          height: 700px;
          width: 40px;
        }
        .paperName {
          font-size: 24px;
          color: #000000;
          text-align: center;
          margin-bottom: 15px;
          margin-top: 20px;
          i {
            color: #2ba1f4;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .paperNumTableBox {
          text-align: center;
          font-size: 12px;
          margin-top: 20px;
          .paperNumTable {
            overflow: hidden;
            margin: 0 auto;
            display: inline-block;
            .firstDiv {
              float: left;
              div {
                width: 60px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border: 1px solid #333333;
                border-right: none;
              }
              div:first-child {
                border-bottom: none;
              }
            }
            .firstDiv:last-child {
              div {
                border-right: 1px solid #333333;
              }
            }
          }
        }
        .papaerSimpleInfo {
          text-align: center;
          font-size: 18px;
          margin-bottom: 15px;
          margin-top: 20px;
          span {
            display: inline-block;
            width: 120px;
            border-bottom: 1px solid #8f8f8f;
            margin-right: 10px;
          }
        }
        .caution {
          font-size: 12px;
          color: #999999;
          margin: 20px 0 0 20px;
        }
        .timuList {
          list-style: none;
          padding-left: 0;
          margin-left: 20px;
          li {
            margin-bottom: 20px;
            .timuType {
              font-size: 16px;
              color: #222222;
              font-weight: 600;
            }
          }
          ul {
            list-style: none;
            padding-left: 10px;
            padding-right: 10px;
            li {
              margin-top: 10px;
              position: relative;
              padding: 20px;
              cursor: pointer;
              margin-bottom: 0;
              .timuBtn {
                position: absolute;
                top: 0;
                right: 0;
                // width: 100%;
                // height: 100%;
                // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                // background-color: red;
                border-radius: 5px;
                padding: 20px 20px;
                display: none;
                .el-button {
                  float: right;
                  margin-left: 5px;
                  border-color: #2ba1f4;
                }
              }
            }
          }
        }
        .paperEmpty {
          margin-top: 80px;
          text-align: center;
        }
      }
      .el-main::-webkit-scrollbar {
        width: 8px;
        height: 2px;
        // background:#ccc;
        border-radius: 5px;
      }
      .el-main::-webkit-scrollbar-thumb {
        display: block;
        width: 8px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(43, 161, 244, 0.6);
      }
    }

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
    .container {
      background: white;
      margin: 22px 23px;
      padding: 10px 20px;
      height: 750px;
      overflow: auto;
      .exam-basic-info {
        width: 100%;
        margin-bottom: 40px;
        display: flex;
        .top-part-l {
          flex: 1;
        }
        .top-part-r {
          width: 800px;
          display: flex;
          flex-direction: column;
          // align-items: center;
          .top-part-r-t {
            width: 600px;
            border: 1px solid #ddd;
            height: 264px;
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

            .exam-instruction-textarea {
              // padding: 10px;
              .el-textarea {
                /deep/ .el-textarea__inner {
                  border: none;
                }
              }
            }
          }
        }
      }
      .bottom-part-setting {
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
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import timu from "./timu";
import vueQr from "vue-qr";
import jdialog from "@/components/jdialog";
import fileModal from "@/components/fileModal";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import preview from "../tiku/previewSubject";

// import { format } from "@/utils/datetime";
export default {
  components: {
    timu: timu,
    vueQr,
    "jd-dialog": jdialog,
    fileModal,
    ElTreeSelect,
    preview
  },
  data() {
    return {
      paperLoading: {
        loading: false
      },
      // 手动抽题
      myTkProps1: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      bookList: [],
      bookId: 0,
      roleId: this.$store.state.user.currentRole.roleId,
      comTKList1: [], // 公共库列表
      currentComTk1: {}, //选中的当前库
      myTKList1: [], // 我的库列表
      myLibTip1: [], // 我的库知识点
      allTypes: common.allTypes,
      allDiffs: common.allRateLevel,
      // 题目列表
      testSelectList1: [],
      testSelectForm1: {
        rlType: "0",
        myLib: "",
        comLib: "",
        type: "",
        diff: "",
        keywords: "",
        tips: "",
        tipText: "",
        comTipText: ""
      },
      testSelectPage1: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      //知识点查询参数
      selectParams1: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tipTreeStyle1: {
        width: "130px"
      },
      treeParams1: {
        clickParent: false,
        filterable: true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "name",
          value: "tipId"
        }
      },
      // 选中添加的题目
      selectedTest: [],
      isPreviewShow: false,
      previewSubject: {},
      // 手动选题结束

      duplicateFlag: false, // 是否有重复名单
      isBtnLoading: false,
      loading: {
        nameListLoading: false
      },
      ruleForm: {
        partInSchool: ""
      },
      rules: {},
      isNameListShow: false,
      nameList: [], // 预览名单
      showImport: false,
      uploadFile: null,
      qrcode: "",
      orderCode: "",
      timerId: "",
      examInfo: {
        examName: ""
      },
      isQRcode: false,
      payType: 2,
      isPayShow: false,
      myTkProps: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      paperId: this.$route.query.paperId,
      comTKList: [], // 公共库列表
      currentComTk: {}, // 选中的当前公共库  查找其courseId
      comTkTips: [], // 选中的当前公共库  查找其courseId
      myTKList: [], // 我的库列表
      myTkTips: [], //我的库知识点
      selectForm: {
        libType: "0",
        myLib: "",
        comLib: "",
        type: "",
        diff: "",
        keywords: "",
        tips: "",
        tipText: ""
      },
      treeProps: {
        children: "children",
        label: "name"
      },
      myLibTreeProps: {
        children: "children",
        label: "tipText"
      },
      filterText: "",
      myTipFilterText: "",
      tipTags: [],
      // table数据
      tableData: [],
      totalNum: 0,
      totalSore: 0,
      creatLoading: false,

      isHandChooseShow: false,
      isTipShow: false,
      isFixShow: false,
      isRandomShow: false,
      fixSubjectList: [],
      randomSubjectList: [],
      fixPage: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      randomPage: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      },
      // current: this.$store.state.classRoom.checkTaskTab
      isEditModeShow: false,
      modeForm: {
        name: ""
      },
      modeFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "click" }]
      },
      isAddModeShow: false,
      modeAddForm: {
        name: "",
        tSubject: "2"
      },
      modeAddFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "click" }]
      },
      current: "first",
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
        standardScoreType: "1", // 及格分
        examType: "1", // 考试方式
        examNum: "", // 考试人数
        isLateMinute: false,
        delayMinutes: "", // 可迟到时间
        switchTimes: "0", // 切屏次数
        gapTime: "0",
        subjectAnswerTime: "0", // 答题时长
        examRemark: "", // 考试说明
        stuNum: "", // 班级人数
        isOptionRandom: false, // 选项随机
        isSubjectRandom: false, // 题目随机
        forceSubmit: false, // 切屏强制交卷
        isCamera: false, // 摄像头抓拍
        isFace: false, // 人脸识别
        isTimeLimited: false, // 限时答题
        isShowScore: false, // 显示成绩
        isShowRanking: false, // 显示名次
        isShowPaper: false, // 允许查看试卷
        showAnswer: "2" // 2-显示答案和解析  3-不显示答案和解析
      },
      classList: [],
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },

      examId: this.$route.query.examId,
      // examInfo: {}, //试卷信息
      // paperNameVisible: false, //修改试卷名字是先隐藏显示
      editPaperName: "",
      timuListData: [], //题目列表原数据
      subjectStructure: [],
      scoreListData: [], //题目列表要修改分数的数据
      typeNum: 0, //总题型数
      timuNum: 0, //总题目数
      timuTotalScore: 0, //题目总分数
      loadWordForm: {
        radio1: 0,
        radio2: 0,
        radio3: 0
      },
      isShowResovle: true, // 是否显示答案和解析
      showResovleType: 1,
      //设置分值
      isSetScoreShow: false,
      //换题
      changeLoading: false,
      currentTimu: {},
      changeTimuData: [],
      changeTimu: {}, // 要替换的新题目
      activeId: "",
      isChangeTimuShow: false,
      dataLaoding: false,
      uploadLoding: false,
      nameListClass: "",
      currentRandomId: "",
      isExamQrCodeShow: false,
      examCode: "",
      isRandomContentShow: false,
      randomForm: {
        randomId: "",
        randomName: "",
        tSubject: "",
        bankNum: "",
        score: "",
        totalNum: ""
      },
      isStuShow: false,
      examStuList: [],
      examStuPage: {
        currentPage: 1,
        pagesize: 10,
        total: 0
      }
    };
  },
  mounted() {
    this.initComTkLib();
    this.initMyTkLib();
    this.getExamInfo();
    // this.loadData();
    this.getClassList();
    this.loadVerifiedList();
    if (this.randomForm.randomId) {
      this.testSelectForm1.type = String(this.randomForm.tSubject);
    }
    // this.loadSubjects();
  },
  watch: {
    filterText(val) {
      this.$refs.tipTree.filter(val);
    },
    myTipFilterText(val) {
      this.$refs.myTipTree.filter(val);
    }
  },
  computed: {
    isAnswerAble() {
      return this.form.isShowPaper;
    }
  },
  methods: {
    // 查看名单导入考试名单
    showNameList() {
      this.isStuShow = true;
      this.getExamStuList();
    },
    getExamStuList() {
      axios
        .request({
          method: "post",
          url: `/clazz/clazz/member/queryStuPage`,
          data: {
            classId: this.nameListClass,
            pageNum: this.examStuPage.currentPage,
            pageSize: this.examStuPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.examStuList = ret.data.records;
            this.examStuPage.total = ret.data.total;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
    },
    // 手动添加固定题确认
    handChooseSure() {
      if (this.selectedTest.length == 0) {
        this.$message({
          message: "请选择题目",
          type: "warning"
        });
        return;
      }
      let ids = [];
      this.selectedTest.forEach(element => {
        let obj = {};
        obj.bankId = String(element.id);
        obj.parentId = 0;
        obj.tSubject = element.tSubject;
        ids.push(obj);
        if (element.sonSubList && element.sonSubList.length > 0) {
          element.sonSubList.forEach(item => {
            let objSon = {};
            objSon.bankId = String(item.id);
            objSon.parentId = String(element.id);
            objSon.tSubject = element.tSubject;
            ids.push(objSon);
          });
        }
      });
      if (this.randomForm.randomId) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/addRandomSubject",
            data: {
              content: JSON.stringify(ids),
              examId: this.examId,
              randomId: this.randomForm.randomId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isHandChooseShow = false;
              this.loadData();
              this.randomPage.currentPage = 1;
              this.getRandomSubject();
              this.queryRandom();
            } else {
              this.$message({
                message: ret.msg,
                type: "warning"
              });
            }
          });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/addFixedSubject",
            data: {
              content: JSON.stringify(ids),
              examId: this.examId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isHandChooseShow = false;
              this.loadData();
              this.fixPage.currentPage = 1;
              this.getFixSubject();
            } else {
              this.$message({
                message: ret.msg,
                type: "warning"
              });
            }
          });
      }
    },
    editRandomScore() {
      let data = {
        examId: this.examId,
        randomId: this.randomForm.randomId,
        num: this.randomForm.bankNum,
        score: this.randomForm.score
      };
      axios
        .request({
          method: "post",
          url: "/exam/exam/extractOption/updateExtractRandom",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.isRandomShow = false;
            this.isRandomContentShow = false;
            this.loadData();
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    delRandomRule() {
      let data = {
        examId: this.examId,
        randomId: this.randomForm.randomId,
        num: this.randomForm.bankNum,
        score: this.randomForm.score
      };
      axios
        .request({
          method: "post",
          url: "/exam/exam/extractOption/removeExtractRandom",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.isRandomShow = false;
            this.isRandomContentShow = false;
            this.loadData();
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        });
    },
    downloadExamCode() {
      let base64 = "";
      let img = document.getElementsByClassName("examCode");
      console.log(img);
      base64 = img[0].getAttribute("src");
      var byteCharacters = atob(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
      );
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], {
        type: undefined
      });
      var aLink = document.createElement("a");
      aLink.download = `${this.examInfo.examName}_${this.examInfo.password}.jpg`; //这里写保存时的图片名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    },
    showQrCode() {
      this.isExamQrCodeShow = true;
    },
    createExamCode() {
      if (!this.form.examNum) {
        this.$message({
          type: "warning",
          message: "请先输入考试人数"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/createClass",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.nameListClass = ret.data.classId;
          }
        });
    },
    changeExamType(val) {
      // 名单考试创建班级
      if (val == 3) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/createClass",
            data: {
              examId: this.examId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.nameListClass = ret.data.classId;
            }
          });
      }
    },
    //跳转到指定题目位置
    toTimuPosition(pitemId) {
      let dom = document.getElementById(pitemId);
      dom.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
      // let arr = document.getElementsByClassName("timuBtn");
      // for (let index = 0; index < arr.length; index++) {
      //   const element = arr[index];
      //   element.style.display = "none";
      // }
      // document.getElementById(pitemId).lastElementChild.style.display = "block";
      this.$nextTick(() => {
        document.getElementById(pitemId).scrollIntoView();
      });
    },
    //点击我的库查询知识点
    testMyTkSearch() {
      this.loadMyLibTip1();
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 加载我的库知识点
    loadMyLibTip1() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.testSelectForm1.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myLibTip1 = ret.data;
          }
        });
    },
    loadVerifiedList() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              if (element) {
                this.bookList.push(element);
              }
            });
            this.bookId = this.bookList[0].textbookId;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 预览
    preview(row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    delRandomSubject(row) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/delSubject",
          data: {
            examId: this.examId,
            bankId: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.getRandomSubject();
            this.queryRandom();
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    delFixSubject(row) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/delSubject",
          data: {
            examId: this.examId,
            bankId: row.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.getFixSubject();
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
      // this.$confirm("<div>确定删除吗？</div>", "提示", {
      //   cancelButtonText: "取消",
      //   confirmButtonText: "确定",
      //   dangerouslyUseHTMLString: true,
      //   type: "warning"
      // })
      //   .then(() => {

      //   })
      //   .catch(() => {});
    },
    getRowKeys(row) {
      return row.id;
    },
    //点击公共库查询知识点
    testComTkSearch() {
      if (this.testSelectForm1.comLib) {
        this.currentComTk1 = this.comTKList.filter((item, i) => {
          return item.id == this.testSelectForm1.comLib;
        });
        this.loadTips1();
      } else {
        this.treeParams1.data = [];
        this.$refs.comTreeSelect.treeDataUpdateFun(this.treeParams1.data);
      }
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.testSelectForm1.tips = ids;
      if (labels) {
        this.testSelectForm1.comTipText = labels.join(",");
      } else {
        this.testSelectForm1.comTipText = "";
      }
      this.testSelectPage1.page = 1;
      this.loadSubjects();
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.comTreeSelect.filterFun(value);
    },
    //选择题目每页显示数据条数切换事件
    handleSizeChange(val) {
      this.testSelectPage1.pagesize = val;
      this.loadSubjects();
    },
    slTypeChange() {
      this.testSelectPage1.page = 1;
      if (this.testSelectForm1.rlType == 3) {
        this.loadBookTestList();
      } else {
        this.loadSubjects();
      }
    },
    async loadBookTestList() {
      let data = {
        textbookId: this.bookId,
        tSubject: this.testSelectForm1.type,
        keyWord: this.testSelectForm1.keywords,
        page: this.testSelectPage1.page,
        pagesize: 10
      };
      // await this.getSubjectIds().then(() => {
      //   if (this.subjectIds.length > 0) {
      //     data.selectSubjectIds = this.subjectIds.join(",");
      //   }
      // });
      axios
        .request({
          method: "post",
          url: "/v1/bookSbLib/listWithCountBook",
          data
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            this.testSelectList1 = ret.data.data;
            this.testSelectPage1.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 题目列表选中事件
    changeSelect(select) {
      this.selectedTest = select;
    },
    //题目查询
    testSearch() {
      this.testSelectPage1.page = 1;
      if (this.testSelectForm1.rlType == 3) {
        this.loadBookTestList();
      } else {
        this.loadSubjects();
      }
    },
    selectBookChange(val) {
      this.bookId = val;
      this.loadBookTestList();
    },
    // 手动选题题目列表
    async loadSubjects() {
      // this.loading.testSelectLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {};
      if (this.testSelectForm1.type) {
        data.tSubject = parseInt(this.testSelectForm1.type);
      }
      if (this.randomForm.randomId) {
        data.tSubject = this.randomForm.tSubject;
      }
      if (this.testSelectForm1.diff) {
        // data.difficultLevel = parseInt(this.testSelectForm.diff);
        data.difficultRateLevel = this.testSelectForm1.diff;
      }
      data.keyWord = this.testSelectForm1.keywords;
      if (this.testSelectForm1.rlType == 1) {
        url = "/subject/personalSubjectBankLibrary/itemsWithCount";
        data.libId = this.testSelectForm1.myLib;
        data.tip = this.testSelectForm1.tipText;
      } else if (this.testSelectForm1.rlType == 2) {
        // 使用记录
        url = "/subject/subjectBankLibrary/getSlsInfoWithSb4";
      } else {
        data.libId = this.testSelectForm1.comLib;
        data.tip = this.testSelectForm1.comTipText;
      }
      // await this.getSubjectIds().then(() => {
      //   if (this.subjectIds.length > 0) {
      //     data.selectSubjectIds = this.subjectIds.join(",");
      //   }
      // });
      data.page = this.testSelectPage1.page;
      data.pagesize = this.testSelectPage1.pagesize;
      // data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            // this.loading.testSelectLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testSelectList1 = res.data.data;
              this.testSelectPage1.total = res.data.total;
            }
          }.bind(this)
        );
    },
    handleFileChange(file) {
      this.uploadFile = file;
    },
    toPartIn() {
      this.showImport = true;
      this.$nextTick(function() {
        // this.$refs["ruleForm"].resetFields();
        this.$refs.subjectsFile.clearFile();
      });
    },
    downloadFormwork() {
      // 导出模板
      let url =
        "https://find-1253402545.cos.ap-beijing.myqcloud.com/%E7%AB%9E%E8%B5%9B%E9%9B%86%E4%BD%93%E6%8A%A5%E5%90%8D%E6%A8%A1%E6%9D%BF.xls";
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    doImportSure() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.uploadFile);
          if (!this.uploadFile) {
            this.$message({
              message: "请导入名单",
              type: "warning"
            });
          }
          if (this.uploadFile.type != "application/vnd.ms-excel") {
            this.$message({
              message: "名单文件不是Excel格式，请检查",
              type: "warning"
            });
          }
          this.isNameListShow = true;
          let fd = new FormData();
          fd.append("file", this.uploadFile);
          // fd.append("mhId", this.id);
          // fd.append("school", this.ruleForm.partInSchool);
          this.loading.nameListLoading = true;
          axios
            .request({
              method: "post",
              url: "/exam/importStu/parseExcelData",
              data: fd
            })
            .then(
              function(data) {
                let res = data.data;
                this.loading.nameListLoading = false;

                if (res.code == 200) {
                  this.nameList = res.data.dataList;
                  this.duplicateFlag = res.data.duplicateFlag;
                  this.school = res.data.school;
                  this.isNameListShow = true;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              }.bind(this)
            )
            .catch(() => {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        } else {
          return false;
        }
      });
    },
    selectClassChange(classId) {
      console.log("hhhh");

      this.getClassStuNum(classId);
      // 弹窗收费
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
    getClassStuNum2(classId) {
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
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handlePayClose() {
      this.isPayShow = false;
      this.payType = 2;
    },
    handleCode() {
      this.payType = 2;
      this.isQRcode = false;
      clearTimeout(this.timerId);
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
            // if (this.payStatus != 3) {
            //   this.isPayShow = true;
            // }
          } else if (ret.code === 243) {
          } else if (ret.code === 244) {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
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
        // paperTimeType,
        paperTime,
        // answerTimesType,
        answerTimes,
        standardScore,
        // isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        // stuNum,
        isOptionRandom,
        isSubjectRandom,
        // forceSubmit,
        // isCamera,
        isFace,
        // isTimeLimited,
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
    doSaveExam() {
      let {
        examNum,
        examType, //考试方式
        isChallenge,
        preventMonitorScreenFlag,
        errorBankTimes,
        name,
        className,
        eaxmTime,
        // paperTimeType,
        paperTime,
        // answerTimesType,
        answerTimes,
        standardScore,
        // isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        // stuNum,
        isOptionRandom,
        isSubjectRandom,
        // forceSubmit,
        // isCamera,
        isFace,
        // isTimeLimited,
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
        examType,
        isErrorBank: isChallenge ? 1 : 0,
        preventMonitorScreenFlag: preventMonitorScreenFlag ? 1 : 0,
        errorBankTimes,
        // extractRandom: extractRandom ? 1 : 0,
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
      if (examType == 2) {
        data.examNumber = examNum;
        if (examNum <= 0 || examNum == "") {
          this.$message({
            type: "warning",
            message: "请输入考试人数"
          });
          return;
        }
      }
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
    },
    doPublish() {
      let {
        examNum,
        examType, //考试方式
        isChallenge,
        preventMonitorScreenFlag,
        // extraOptions,
        errorBankTimes,
        // extractRandom,
        name,
        className,
        eaxmTime,
        // paperTimeType,
        paperTime,
        // answerTimesType,
        answerTimes,
        standardScore,
        // isLateMinute,
        delayMinutes,
        switchTimes,
        gapTime,
        subjectAnswerTime,
        examRemark,
        // stuNum,
        isOptionRandom,
        isSubjectRandom,
        // forceSubmit,
        // isCamera,
        isFace,
        // isTimeLimited,
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
      if (examType == 1 && !className) {
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

      // 收费考试提示发送短信
      let data = {
        examType,
        isErrorBank: isChallenge ? 1 : 0,
        preventMonitorScreenFlag: preventMonitorScreenFlag ? 1 : 0,
        errorBankTimes,
        // extractRandom: extractRandom ? 1 : 0,
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
      if (examType == 2) {
        data.examNumber = examNum;
        if (examNum <= 0 || examNum == "") {
          this.$message({
            type: "warning",
            message: "请输入考试人数"
          });
          return;
        }
      }

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
    },
    handSelect() {
      this.testSelectPage1.page = 1;
      this.testSelectForm1.rlType = "0";
      this.testSelectForm1.myLib = "";
      this.testSelectForm1.comLib = "";
      this.testSelectForm1.diff = "";
      this.testSelectForm1.keywords = "";
      this.testSelectForm1.tips = "";
      this.testSelectForm1.tipText = "";
      this.testSelectForm1.comTipText = "";
      this.treeParams1.data = [];
      this.selectedTest = [];
      if (this.randomForm.randomId) {
        this.testSelectForm1.type = String(this.randomForm.tSubject);
      } else {
        this.testSelectForm1.type = "";
      }
      this.isHandChooseShow = true;
      this.loadSubjects();
    },
    openTip() {
      // this.handleEmptyTips();
      this.selectForm.libType = "0";
      this.selectForm.myLib = "";
      this.selectForm.comLib = "";
      this.selectForm.type = "";
      this.selectForm.diff = "";
      this.selectForm.keywords = "";
      this.selectForm.tips = "";
      this.selectForm.tipText = "";
      this.comTkTips = [];
      this.myTkTips = [];
      this.tipTags = [];
      this.tableData = [];

      this.isTipShow = true;
    },
    addFixTimu() {
      this.randomForm.randomId = "";
      this.randomForm.randomName = "";
      this.randomForm.tSubject = "";
      this.randomForm.totalNum = "";
      this.randomForm.bankNum = "";
      this.randomForm.score = "";
      this.isFixShow = true;
      this.getFixSubject();
    },
    getFixSubject() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/findSubjectFromPaperPage",
          data: {
            examId: this.examId,
            pageNo: this.fixPage.currentPage,
            pageSize: this.fixPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.fixSubjectList = ret.data.records;
            this.fixPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getRandomSubject() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/findSubjectFromPaperPage",
          data: {
            examId: this.examId,
            randomId: this.randomForm.randomId,
            pageNo: this.randomPage.currentPage,
            pageSize: this.randomPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.randomSubjectList = ret.data.records;
            this.randomPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    editModeFormSure() {
      this.$refs["modeForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/exam/exam/extractOption/updateExtractRandom",
              data: {
                examId: this.examId,
                randomId: this.currentRandomId,
                randomName: this.modeForm.name
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.isEditModeShow = false;
                this.loadData();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    addRandomSure() {
      this.$refs["modeAddForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/exam/exam/extractOption/createExtractRandom",
              data: {
                examId: this.examId,
                randomName: this.modeAddForm.name,
                tSubject: this.modeAddForm.tSubject
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.isAddModeShow = false;
                this.randomForm.randomId = ret.data.randomId;
                this.randomForm.randomName = ret.data.randomName;
                this.randomForm.tSubject = ret.data.tSubject;
                this.randomForm.bankNum = ret.data.bankNum;
                this.randomForm.totalNum = ret.data.totalNum;
                this.randomForm.score = ret.data.score;
                this.isRandomShow = true;
                this.getRandomSubject();
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        }
      });
    },
    addRandomRule() {
      this.isAddModeShow = true;
      this.modeAddForm.name = "";
      this.$nextTick(() => {
        this.$refs.modeAddForm.clearValidate();
      });
    },
    toUpdateModeName(ele) {
      this.currentRandomId = ele.randomId;
      this.modeForm.name = ele.randomName;
      this.isEditModeShow = true;
    },
    showRandomContent(ele) {
      this.randomForm.randomId = ele.randomId;
      this.randomForm.randomName = ele.randomName;
      this.isRandomContentShow = true;
      this.getRandomSubject();
      this.queryRandom();
    },
    queryRandom() {
      axios
        .request({
          method: "post",
          url: "/exam/exam/extractOption/queryExtractRandom",
          data: {
            examId: this.examId,
            randomId: this.randomForm.randomId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.randomForm.tSubject = ret.data.tSubject;
            this.randomForm.bankNum = ret.data.num;
            this.randomForm.score = ret.data.score;
            this.randomForm.totalNum = ret.data.bankNum;
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
              type,
              examNumber,
              preventMonitorScreenFlag,
              isErrorBank,
              extraOptions,
              errorBankTimes,
              // extractRandom,
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
            this.examCode = ret.data.password;
            this.examInfo.password = ret.data.password;
            this.payStatus = payStatus;
            this.score = score; // 总分
            this.form.extraOptions = extraOptions;
            this.chooseNum = chooseNum; // 题目数量
            this.form.name = examName; // 考试名称
            this.examInfo.examName = examName; // 考试名称
            if (type == 3) {
              this.nameListClass = ret.data.classId ? ret.data.classId : "";
            } else if (type == 1) {
              this.form.className = ret.data.classId ? ret.data.classId : "";
            }
            if (ret.data.classId) {
              this.getClassStuNum2(ret.data.classId);
            }
            this.form.standardScore = passScore; // 及格分
            if (passScore <= 0) {
              this.form.standardScoreType = "0";
            } else {
              this.form.standardScoreType = "1";
            }
            this.form.paperTime = answerTime;
            this.form.paperTimeType = answerTime == 0 ? "0" : "1";
            this.form.examRemark = ret.data.examNotes ? ret.data.examNotes : "";
            this.form.answerTimes = answerTimes;
            this.form.answerTimesType = answerTimes == 0 ? "0" : "1";
            this.form.switchTimes = switchScreenTimes; // 切屏次数
            this.form.forceSubmit = switchScreenTimes != 0; // 切屏次数
            this.form.delayMinutes = lateTime; // 可迟到时间
            this.form.isLateMinute = lateTime != 0; // 可迟到时间
            // this.form.extractRandom = extractRandom === 1;
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

            this.form.examType = String(type);
            if (type == 2) {
              this.form.examNum = examNumber || "";
            } else {
              this.form.examNum = "";
            }
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
    //加载试题列表
    loadData() {
      this.paperLoading.loading = true;
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/getOnePaperDetail",
          data: {
            examId: this.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.paperLoading.loading = false;

            this.examInfo = {
              examId: ret.data.examId,
              examName: ret.data.examName,
              score: ret.data.score,
              subjectNum: ret.data.subjectNum
            };
            this.timuListData = ret.data.paperSubjectContent;
            this.subjectStructure = ret.data.subjectStructure;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    nextStep() {
      this.current = "second";
      this.loadData();
    },
    goPublish() {
      this.current = "third";
    },
    getClassList() {
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClass",
          data: {
            isMasterhead: 0,
            isQueryAssistant: 1
          }
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
    //清空考试试题
    handleEmptyTimu() {
      this.$confirm("<div>确定清空试题吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/paper/cleanSubject",
              data: {
                examId: this.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
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
    changePaperTimeType(val) {
      if (val == 0) {
        this.form.paperTime = 0;
      }
    },
    changeStandardScoreType(val) {
      if (val == 0) {
        this.form.standardScore = 0;
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
    handleClick(tab, event) {
      if (tab.name == "first") {
      }
      if (tab.name == "second") {
        // this.$store.commit("setCheckTaskTabName", tab.name);
        this.loadData();
      }
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.target.lastChild.style.display = "block";
      e.target.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)";
    },
    handleTimuMouseleave(e) {
      e.target.lastChild.style.display = "none";
      e.target.style.boxShadow = "none";
    },
    // 类型
    formatType1(row) {
      return common.typeFormat(row.tSubject);
    },
    //题型
    formatType(type) {
      return common.typeFormat(type);
    },
    //题型
    formatTypeTable(row) {
      return common.typeFormat(row.name);
    },
    //小写转换为大写
    convert(num) {
      var nums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var unit = [
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万亿"
      ];
      var result = "";
      for (var i = 0; i < num.toString().length; i++) {
        var c = num.toString()[i];
        if (c != 0) {
          result += nums[c] + unit[num.toString().length - i - 1];
        } else {
          result += nums[c];
        }
      }
      return result;
    },
    // 加载公共题库列表
    initComTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/commonList"
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTKList = res.data;
            }
          }.bind(this)
        );
    },
    // 加载我的题库
    initMyTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTKList = this.removeEmptyChildren(ret.data);
          }
        });
    },
    removeEmptyChildren(data) {
      if (Array.isArray(data)) {
        // 判断是否是数组
        return data.map(item => {
          if (item.children && item.children.length > 0) {
            item.children = this.removeEmptyChildren(item.children); // 递归遍历
          } else {
            delete item.children; // 删除空的children字段
          }
          return item;
        });
      } else if (typeof data === "object") {
        // 判断是否是对象
        if (data.children && data.children.length > 0) {
          data.children = this.removeEmptyChildren(data.children); // 递归遍历
        } else {
          delete data.children; // 删除空的children字段
        }
        return data;
      }
    },
    handleChange() {
      this.selectForm1.comLib = "";
      this.selectForm1.myLib = "";
      this.comTkTips1 = [];
      this.myTkTips1 = [];
    },
    //点击公共库查询知识点
    comTkSearch() {
      if (this.selectForm.comLib) {
        this.currentComTk = this.comTKList.filter((item, i) => {
          return item.id == this.selectForm.comLib;
        });
        this.loadTips();
      } else {
        this.comTkTips = [];
      }
    },
    // 获取公共库知识点
    loadTips1() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentComTk1[0].sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams1.data = res.data;
              if (res.data.length >= 0) {
                this.$refs.comTreeSelect.treeDataUpdateFun(res.data);
              }
            }
          }.bind(this)
        );
    },
    // 获取公共库知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentComTk[0].sblCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.comTkTips = res.data;
              this.$nextTick(() => {
                // 刷新数据时重新选中node
                if (this.$refs.tipTree) {
                  this.$refs.tipTree.setCheckedNodes(this.tipTags);
                }
              });
            }
          }.bind(this)
        );
    },
    //知识点筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 我的知识点筛选
    myTipfilterNode(value, data) {
      if (!value) return true;
      return data.tipText.indexOf(value) !== -1;
    },
    //公共知识点节点选中状态发生变化时的回调
    getChecked(data, status) {
      this.totalSore = 0;
      this.totalNum = 0;
      if (data.parentId != 0) {
        if (status == true) {
          let flag = false;
          for (let index = 0; index < this.tipTags.length; index++) {
            const element = this.tipTags[index];
            if (element.tipId == data.tipId) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            data.sblId = this.selectForm.comLib;
            data.type = 0;
            this.tipTags.push(data);
          }
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      } else {
        if (status == true) {
          data.sblId = this.selectForm.comLib;
          this.tipTags.push(data);
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      }
    },
    //我的知识点节点选中状态发生变化时的回调
    myTipGetChecked(data, status) {
      this.totalSore = 0;
      this.totalNum = 0;
      if (data.parentId != 0) {
        if (status == true) {
          let flag = false;
          for (let index = 0; index < this.tipTags.length; index++) {
            const element = this.tipTags[index];
            if (element.name == data.tipText) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            data.sblId = this.selectForm.myLib;
            data.type = 1;
            data.name = data.tipText;
            this.tipTags.push(data);
          }
        } else {
          this.tipTags.forEach((i, index) => {
            if (i.name == data.tipText) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      } else {
        if (status == true) {
          data.sblId = this.selectForm.myLib;
          this.tipTags.push(data);
        } else {
          this.tipTags.forEach((i, index) => {
            if (data.tipId == i.tipId) {
              this.tipTags.splice(index, 1);
            }
          });
        }
      }
    },
    //选中节点时去请求该知识点的题目
    handleClickNode() {
      let tipIdsArr = [];
      if (this.tipTags.length == 0) {
        this.tableData = [];
      }
      this.tipTags.forEach(element => {
        let obj = {};
        obj.tipId = element.tipId;
        obj.sblId = element.sblId;
        obj.tipName = element.name;
        tipIdsArr.push(obj);
      });
      let QuestionFiveNum = 0; // 所有问答题目数
      let tableDataArr = []; // 处理后的表格数据
      let data = {
        tips: JSON.stringify(tipIdsArr)
      };
      if (this.randomForm.randomId) {
        data.tSubjects = this.randomForm.tSubject;
      }
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tSubjectReport2",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            ret.data.forEach(item => {
              if (Number(item.name) >= 5 && Number(item.name) < 11) {
                QuestionFiveNum = QuestionFiveNum + item.number;
              } else {
                tableDataArr.push(item);
              }
            });
            tableDataArr.push({
              name: "5",
              number: QuestionFiveNum
            });
            if (ret.data.length === 0) {
              this.tableData = [];
              return;
            }
            this.tableData = tableDataArr;
          } else {
            this.$message({
              type: "error",
              message: `${ret.msg}`
            });
          }
        });
    },
    //删掉右侧知识点
    handleClose(tag) {
      this.tipTags.splice(this.tipTags.indexOf(tag), 1);
      this.totalSore = 0;
      this.totalNum = 0;
      if (this.selectForm.libType == 0) {
        this.$refs.tipTree.setCheckedNodes(this.tipTags);
      } else {
        this.$refs.myTipTree.setCheckedNodes(this.tipTags);
      }
      this.handleClickNode();
    },
    //右上角清空知识点
    handleEmptyTips() {
      this.tipTags = [];
      if (this.selectForm.libType == 0) {
        this.$refs.tipTree.setCheckedNodes([]);
      } else {
        this.$refs.myTipTree.setCheckedNodes([]);
      }
      this.tableData = [];
    },
    myTkSearch() {
      this.loadMyLibTip();
    },
    // 加载我的库知识点
    loadMyLibTip() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.selectForm.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myTkTips = ret.data;
            this.$nextTick(() => {
              // 刷新数据时重新选中node
              if (this.$refs.myTipTree) {
                this.$refs.myTipTree.setCheckedNodes(this.tipTags);
              }
            });
          }
        });
    },
    //删除
    handleDel(i) {
      this.$confirm("<div>确定删除吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/paper/delSubject",
              data: {
                examId: this.examId,
                bankId: i.bankId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadData();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //上移
    handleTopMove(i, index, children) {
      if (index == 0) {
        this.$message({
          type: "warning",
          message: "已经是当前题型下第一道题"
        });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/exchangeSubject",
            data: {
              examId: this.examId,
              bankId: i.bankId,
              exchangeBankId: children[index - 1].bankId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "上移成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    //下移
    handleBottomMove(i, index, children) {
      if (index == children.length - 1) {
        this.$message({
          type: "warning",
          message: "已经是当前题型下最后一道题"
        });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/exchangeSubject",
            data: {
              examId: this.examId,
              bankId: i.bankId,
              exchangeBankId: children[index + 1].bankId
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: "下移成功"
              });
              this.loadData();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          });
      }
    },
    // 选题的输入框变化事件
    handleSelectNum(row) {
      this.totalNum = 0;
      this.totalSore = 0;
      this.tableData.forEach(element => {
        if (element.selectNum) {
          this.totalNum += element.selectNum;
          if (element.score) {
            this.totalSore += element.selectNum * element.score;
          }
        }
      });
      if (this.totalNum > 50) {
        this.$message({
          message: "总题数不能超过50题",
          type: "warning"
        });
        row.selectNum = 50 - (this.totalNum - row.selectNum);
        this.totalNum = 50;
      }
    },
    // 设置分数的输入框变化事件
    handleSelectScore(row) {
      this.totalSore = 0;
      this.tableData.forEach(element => {
        if (element.selectNum > 0 && element.score) {
          this.totalSore += element.selectNum * element.score;
        }
      });
    },
    //知识点抽题(固定题)
    doCreatPaper() {
      if (this.totalNum <= 0) {
        this.$message({
          message: "请输入选取题数",
          type: "warning"
        });
        return;
      }
      this.creatLoading = true;
      let tipIdsArr = [];
      let setting = [];
      this.tipTags.forEach(element => {
        let obj = {};
        obj.sblId = element.sblId;
        obj.tipName = element.name;
        obj.tipIds = element.tipId;
        tipIdsArr.push(obj);
      });
      this.tableData.forEach(element => {
        let obj = {};
        if (element.selectNum) {
          obj.tSubject = element.name;
          obj.num = element.selectNum;
          setting.push(obj);
        }
      });

      if (this.randomForm.randomId) {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/addExtractSubjectByTip", // 自动生成
            data: {
              examId: this.examId,
              setting: JSON.stringify(setting),
              tips: JSON.stringify(tipIdsArr),
              randomId: this.randomForm.randomId
            }
          })
          .then(res => {
            this.creatLoading = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.totalNum = 0;
              this.isTipShow = false;
              this.loadData();
              this.randomPage.currentPage = 1;
              this.getRandomSubject();
              this.queryRandom();
            } else {
              this.$message({
                message: ret.msg,
                type: "warning"
              });
            }
          });
      } else {
        axios
          .request({
            method: "post",
            url: "/exam/exam/paper/addExtractSubjectByTip", // 自动生成
            data: {
              examId: this.examId,
              setting: JSON.stringify(setting),
              tips: JSON.stringify(tipIdsArr)
            }
          })
          .then(res => {
            this.creatLoading = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.totalNum = 0;
              this.isTipShow = false;
              this.loadData();
              this.fixPage.currentPage = 1;
              this.getFixSubject();
            } else {
              this.$message({
                message: ret.msg,
                type: "warning"
              });
            }
          });
      }
    },
    //设置分数
    handleSetScore() {
      this.scoreListData = this.subjectStructure; //把数据拷贝一份给修改分数 保存原始数据
      this.isSetScoreShow = true;
    },
    //修改每一题的分数
    handleScoreChange(i, item) {
      i.score = i.score.replace(/[^0-9]/g, "");
      let score = 0;
      let arr = [];
      item.subjectExtract.forEach(element => {
        element.subjectIndex.forEach(j => {
          arr.push(j);
        });
      });
      arr.forEach(k => {
        score += Number(k.score);
      });
      item.typeSetScoreInput = "";
      item.score = score;
    },
    //修改每一题型的分数
    handleScoreChangeAll(row) {
      row.typeSetScoreInput = row.typeSetScoreInput.replace(/[^0-9]/g, "");
      row.subjectExtract.forEach(element => {
        if (element.extractType == 0) {
          element.subjectIndex.forEach(i => {
            i.score = Number(row.typeSetScoreInput);
          });
        }
      });
      let arr = [];
      let score = 0;
      row.subjectExtract.forEach(element => {
        element.subjectIndex.forEach(i => {
          arr.push(i);
        });
      });
      arr.forEach(k => {
        score += Number(k.score);
      });
      row.score = score;
    },
    //确定设置分数
    doSetScoreSure() {
      let arr = [];
      this.scoreListData.forEach(element => {
        element.subjectExtract.forEach(e => {
          if (e.extractType == 0) {
            e.subjectIndex.forEach(i => {
              arr.push({
                bankId: i.bankId,
                score: i.score == "" ? 0 : i.score
              });
            });
          }
        });
      });
      let data = {
        examId: this.examId,
        content: JSON.stringify(arr)
      };
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/setSubjectScoreV2",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isSetScoreShow = false;
            this.loadData();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    }
  }
};
</script>
