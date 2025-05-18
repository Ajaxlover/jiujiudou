<template>
  <div class="teaReport">
    <el-container class="container">
      <el-aside width="200px">
        <div class="title">签到</div>
        <div class="summery">
          <span>次&nbsp;&nbsp;&nbsp;&nbsp;数</span>：<span class="number">{{
            clazzSignSummary.totalTimes
          }}</span
          ><span class="unit">次</span>
        </div>
        <div class="summery">
          <span>签到率</span>：<span class="number">{{
            clazzSignSummary.totalRate
          }}</span>
          <!-- <span class="unit">%</span> -->
        </div>
      </el-aside>
      <img style="width:10px;" src="@/assets/images/img_line.png" />
      <el-container>
        <el-header>
          <el-button
            size="small"
            type="primary"
            @click="exportDetailSign"
            style="margin-left:10px"
            :disabled="!signList.length"
            >导出明细</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="exportClazzSign"
            :disabled="!signList.length"
            >导出</el-button
          >
        </el-header>
        <el-main>
          <el-table
            :data="signList"
            height="300"
            v-el-table-infinite-scroll="loadSignList"
            stripe
            border
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column label="标题" align="center" prop="name">
              <template slot-scope="scope"
                >{{ format(scope.row.createTime, "M月D") }}签到</template
              >
            </el-table-column>
            <el-table-column label="时间" align="center">
              <template slot-scope="scope">{{
                format(scope.row.createTime, "MM-DD H:mm")
              }}</template>
            </el-table-column>
            <el-table-column
              label="签到率"
              align="center"
              prop="signedRate"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="signDetail(scope.row)"
                  >详情</el-button
                >
                <el-button type="text" @click="deleteSign(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <!-- <template slot="append">
              <infinite-loading :identifier="signIdentifier" @infinite="loadSignList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
                <loading>拼命加载中...</loading>
                <span slot="no-more"></span>
                <span slot="no-results"></span>
                <span slot="error"></span>
              </infinite-loading>
            </template> -->
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-container class="container">
      <el-aside width="200px">
        <div class="title">应答</div>
        <div class="summery">
          <span>次&nbsp;&nbsp;&nbsp;&nbsp;数</span>：<span class="number">{{
            clazzReplySummary.totalTimes
          }}</span
          ><span class="unit">次</span>
        </div>
        <div class="summery">
          <span>提交率</span>：<span class="number">{{
            clazzReplySummary.totalSubmitRate
          }}</span>
          <!-- <span class="unit">%</span> -->
        </div>
        <div class="summery">
          <span>正确率</span>：<span class="number">{{
            clazzReplySummary.totalCorrectRate
          }}</span>
          <!-- <span class="unit">%</span> -->
        </div>
      </el-aside>
      <img style="width:10px;" src="@/assets/images/img_line.png" />
      <el-container>
        <el-header>
          <el-button
            size="small"
            type="primary"
            @click="exportAnswerSummary"
            style="margin-left:10px"
            :disabled="!replyList.length"
            >导出明细</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="exportClazzReply"
            :disabled="!replyList.length"
            >导出</el-button
          >
        </el-header>
        <el-main>
          <el-table
            :data="replyList"
            height="300"
            v-el-table-infinite-scroll="loadReplyList"
            stripe
            border
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column label="标题" align="center">
              <template slot-scope="scope"
                >{{ format(scope.row.createTime, "M月D") }}应答</template
              >
            </el-table-column>
            <el-table-column label="时间" align="center">
              <template slot-scope="scope">{{
                format(scope.row.createTime, "MM-DD H:mm")
              }}</template>
            </el-table-column>
            <el-table-column
              label="提交率"
              align="center"
              prop="submitRate"
            ></el-table-column>
            <el-table-column
              label="正确率"
              align="center"
              prop="correctRate"
            ></el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="subjectDetail(scope.row)"
                  >查看题目</el-button
                >
                <el-button type="text" @click="replyDetail(scope.row)"
                  >详情</el-button
                >
                <el-button type="text" @click="deleteReply(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <!-- <template slot="append">
              <infinite-loading :identifier="replyIdentifier" @infinite="loadReplyList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
                <loading></loading>
                <span slot="no-more"></span>
                <span slot="no-results"></span>
                <span slot="error"></span>
              </infinite-loading>
            </template> -->
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-container class="container">
      <el-aside width="200px">
        <div class="title">作业</div>
        <div class="summery">
          <span>次&nbsp;&nbsp;&nbsp;&nbsp;数</span>：<span class="number">{{
            clazzTaskSummary.totalTimes
          }}</span
          ><span class="unit">次</span>
        </div>
        <div class="summery">
          <span>提交率</span>：<span class="number">{{
            clazzTaskSummary.totalSubmitRate
          }}</span>
          <!-- <span class="unit">%</span> -->
        </div>
        <!-- <div class="summery">
          <span>平均分</span>：<span class="number">{{
            clazzTaskSummary.totalAverageScore
          }}</span
          ><span class="unit">分</span>
        </div> -->
      </el-aside>
      <img style="width:10px;" src="@/assets/images/img_line.png" />
      <el-container>
        <el-header>
          <el-button
            size="small"
            type="primary"
            @click="exportDetailExercise"
            style="margin-left:10px"
            :disabled="!homeworkList.length"
            >导出明细</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="exportClazzExercises"
            :disabled="!homeworkList.length"
            >导出</el-button
          >
          <!-- <el-button size="small" type="primary">发布作业</el-button> -->
        </el-header>
        <el-main>
          <el-table
            :data="homeworkList"
            height="300"
            v-el-table-infinite-scroll="loadHomeworkList"
            stripe
            border
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              label="作业"
              align="center"
              prop="exerciseName"
            ></el-table-column>
            <el-table-column label="时间" align="center" min-width="120">
              <template slot-scope="scope">
                {{ format(scope.row.startTime, "MM-DD H:mm") }}到{{
                  format(scope.row.endTime, "MM-DD H:mm")
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="提交率"
              align="center"
              prop="submitRate"
            ></el-table-column>
            <el-table-column
              label="平均分"
              align="center"
              prop="averageScore"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="goSee(scope.row)"
                  >查看题目</el-button
                >
                <!-- <el-button type="text" @click="stuCountDetail(scope.row)"
                  >学生统计</el-button
                > -->
                <el-button type="text" @click="toStuStatistics(scope.row)"
                  >批阅作业</el-button
                >
                <el-button type="text" @click="homeworkDetail(scope.row)"
                  >详情</el-button
                >
                <el-button type="text" @click="deleteHomework(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <!-- <template slot="append">
              <infinite-loading :identifier="taskIdentifier" @infinite="loadHomeworkList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
                <loading></loading>
                <span slot="no-more"></span>
                <span slot="no-results"></span>
                <span slot="error"></span>
              </infinite-loading>
            </template> -->
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <jdialog
      title="签到详情"
      :noFooter="true"
      :visible.sync="showDialog.signDetail"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">
              {{ format(currentSign.createTime, "M月DD") }}签到</span
            >
            <span style="color:#666;font-size:14px;margin-left:17px;">
              {{ format(currentSign.createTime, "MM-DD H:mm") }}
            </span>
          </div>
          <el-button
            size="small"
            type="primary"
            @click="exportSign"
            :disabled="!signStuList.length"
            >导出</el-button
          >
        </div>
        <div class="dialogSummery">
          <span class="summary">签到率：{{ signSummary.signedRate }}</span>
          <span>已签到：{{ signSummary.signedStuQuantity }}</span>
          <span>迟到：{{ signSummary.lateStuQuantity }}</span>
          <span>病假：{{ signSummary.sickStuQuantity }}</span>
          <span>事假：{{ signSummary.personalStuQuantity }}</span>
          <span>缺勤：{{ signSummary.absenceStuQuantity }}</span>
        </div>
        <el-table
          class="dialogTable"
          :data="signStuList"
          v-el-table-infinite-scroll="loadSignStuList"
          height="300"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="学号"
            align="center"
            prop="stuNum"
          ></el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            prop="stuName"
          ></el-table-column>
          <el-table-column label="签到时间" align="center" prop="signTime">
            <div slot-scope="scope">
              {{
                scope.row.signType == 2 || scope.row.signType == 0
                  ? "未签到"
                  : format(scope.row.signTime, "MM-DD HH:mm")
              }}
            </div>
          </el-table-column>
          <el-table-column label="签到情况" align="center" prop="signType">
            <div slot-scope="scope">{{ signType(scope.row.signType) }}</div>
          </el-table-column>
          <el-table-column label="签到距离" align="center" prop="distance">
            <div slot-scope="scope">
              {{ scope.row.distance ? scope.row.distance + "米" : "" }}
            </div>
          </el-table-column>
          <!-- <template slot="append" v-if="showSignDetail">
            <infinite-loading @infinite="loadSignStuList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
              <loading></loading>
              <span slot="no-more"></span>
              <span slot="no-results"></span>
              <span slot="error"></span>
            </infinite-loading>
          </template> -->
        </el-table>
      </template>
    </jdialog>
    <jdialog
      title="应答详情"
      :noFooter="true"
      :visible.sync="showDialog.replyDetail"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">
              {{ format(currentReply.createTime, "M月DD") }}应答
            </span>
            <span style="color:#666;font-size:14px;margin-left:17px;">
              {{ format(currentReply.createTime, "MM-DD H:mm") }}
            </span>
          </div>
          <el-button
            size="small"
            type="primary"
            @click="exportReply"
            :disabled="!replyStuList.length"
            >导出</el-button
          >
        </div>
        <div class="dialogSummery">
          <span class="summary">
            <span>提交率：{{ replySummary.totalSubmitRate }}</span>
            <span style="padding: 0 10px 0 45px"
              >正确率：{{ replySummary.totalCorrectRate }}</span
            >
          </span>
        </div>
        <el-table
          class="dialogTable"
          :data="replyStuList"
          v-el-table-infinite-scroll="loadReplyStuList"
          height="300"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="学号"
            align="center"
            prop="stuNum"
          ></el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            prop="stuName"
          ></el-table-column>
          <el-table-column label="提交时间" align="center">
            <div slot-scope="scope">
              {{
                scope.row.submitTime
                  ? format(scope.row.submitTime, "MM-DD HH:mm")
                  : "未提交"
              }}
            </div>
          </el-table-column>
          <el-table-column label="答案" align="center" prop="isCorrect">
            <div slot-scope="scope">{{ replyResult(scope.row) }}</div>
          </el-table-column>
          <!-- <template slot="append" v-if="showReplyDetail">
            <infinite-loading @infinite="loadReplyStuList" spinner="spiral" forceUseInfiniteWrapper=".el-table__body-wrapper">
              <loading></loading>
              <span slot="no-more"></span>
              <span slot="no-results"></span>
              <span slot="error"></span>
            </infinite-loading>
          </template> -->
        </el-table>
      </template>
    </jdialog>
    <jdialog
      title="学生统计"
      :noFooter="true"
      :visible.sync="showDialog.stuCount"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">{{
              currentHomework.exerciseName
            }}</span>
            <span style="color:#666;font-size:14px;margin-left:17px;">
              {{ format(currentHomework.startTime, "MM-DD HH:mm") }}到{{
                format(currentHomework.endTime, "MM-DD HH:mm")
              }}
            </span>
          </div>
          <!-- <el-button
            size="small"
            type="primary"
            @click="exportHomework"
            :disabled="!homeworkStuList.length"
            >导出</el-button
          > -->
        </div>
        <div>
          <span>已提交{{ alSwer }}人</span>
          <span>未提交{{ unSwer }}人</span>
        </div>
        <div class="dialogSummery">
          <span class="summary">
            <span>提交率：{{ homeworkSummary.totalSubmitRate }}</span>
            <span style="padding:0 10px 0 45px;"
              >平均分：{{ homeworkSummary.totalAverageScore }}</span
            >
          </span>
        </div>
        <el-table
          class="dialogTable"
          :data="stuCountList"
          v-el-table-infinite-scroll="loadHomeworkStuList"
          height="300"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="学号"
            align="center"
            prop="stuNum"
          ></el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            prop="stuName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="提交时间" align="center">
            <template slot-scope="scope">
              {{
                scope.row.submitTime
                  ? format(scope.row.submitTime, "MM-DD HH:mm")
                  : "未提交"
              }}
            </template>
          </el-table-column>
          <el-table-column label="得分" align="center" prop="score">
            <template slot-scope="scope">
              {{ scope.row.status == 1 ? "待批阅" : scope.row.score }}
            </template>
          </el-table-column>
          <el-table-column label="批阅人" align="center" prop="teacherName">
          </el-table-column>
          <el-table-column
            label="答对题数"
            align="center"
            prop="correctQuantity"
          ></el-table-column>
          <el-table-column
            label="答错题数"
            align="center"
            prop="wrongQuantity"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goStuHomeWorkDetail(scope.row)"
                size="small"
                >详情</el-button
              >
              <el-button type="text" size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </jdialog>
    <jdialog
      title="作业详情"
      :noFooter="true"
      :visible.sync="showDialog.homeworkDetail"
      width="800px"
    >
      <template slot="body">
        <div class="dialogHeader">
          <div>
            <span style="color:#333;font-size:16px;">{{
              currentHomework.exerciseName
            }}</span>
            <span style="color:#666;font-size:14px;margin-left:17px;">
              {{ format(currentHomework.startTime, "MM-DD HH:mm") }}到{{
                format(currentHomework.endTime, "MM-DD HH:mm")
              }}
            </span>
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="exportAllHomework"
              :disabled="!homeworkStuList.length"
              >下载作业</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="exportHomework"
              :disabled="!homeworkStuList.length"
              >导出</el-button
            >
          </div>
        </div>
        <div class="dialogSummery">
          <span class="summary">
            <span>提交率：{{ homeworkSummary.totalSubmitRate }}</span>
            <span style="padding:0 10px 0 45px;"
              >平均分：{{ homeworkSummary.totalAverageScore }}</span
            >
          </span>
        </div>
        <el-table
          class="dialogTable"
          :data="homeworkStuList"
          v-el-table-infinite-scroll="loadHomeworkStuList"
          height="300"
          stripe
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            label="学号"
            align="center"
            prop="stuNum"
          ></el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            prop="stuName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="提交时间" align="center">
            <template slot-scope="scope">
              {{
                scope.row.status == 0
                  ? "未提交"
                  : format(scope.row.submitTime, "MM-DD HH:mm")
              }}
            </template>
          </el-table-column>
          <el-table-column label="得分" align="center" prop="score">
            <template slot-scope="scope">
              {{ scope.row.status == 1 ? "待批阅" : scope.row.score }}
            </template>
          </el-table-column>
          <el-table-column
            label="答对题数"
            align="center"
            prop="correctQuantity"
          ></el-table-column>
          <el-table-column
            label="答错题数"
            align="center"
            prop="wrongQuantity"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="printHomewok(scope.row)"
                v-if="scope.row.status !== 0"
                >打印作业</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="tabelFooter">
          <div v-if="homeworkStuList.length" class="right-footer-first">
            从{{ 0 }}到{{ 0 }}记录，共{{ 0 }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="30"
            :page-size="5"
            :current-page.sync="page.homeworkDetail"
            background
          ></el-pagination>
        </div> -->
        <!-- <div>当前仅支持九斗APP批阅作业</div> -->
      </template>
    </jdialog>
    <jdialog
      title="题目预览"
      :noFooter="true"
      :visible.sync="showDialog.subjectDetail"
    >
      <div class="replyInfo" slot="body" v-loading="replyInfoLoading">
        <div v-if="replyInfo">
          <div class="head">
            <span class="type">{{ formatType(replyInfo.answerType) }}</span>
            <div class="title">{{ replyInfo.answerTitle }}</div>
            <img
              v-if="replyInfo.answerPicture"
              class="picture"
              :src="replyInfo.answerPicture"
            />
          </div>
          <div class="bm">
            <div class="tp">【答案】{{ replyInfo.answerRight }}</div>
          </div>
        </div>
        <div v-else-if="subject">
          <div class="head">
            <span class="type">{{ formatType(subject.tSubject) }}</span>
            <div><jmath class="title" :data="subject.title"></jmath></div>
          </div>
          <div v-if="subject.answers.length" class="options">
            <div
              class="option"
              v-for="(option, index) in subject.answers"
              :key="index"
            >
              <div class="aOption">{{ option.option }}</div>
              <jmath class="aText" :data="option.text"></jmath>
            </div>
          </div>
          <div class="bm">
            <div class="tp">【答案】{{ getAnswer(subject.answers) }}</div>
            <div class="tp">
              【解析】<jmath :data="subject.analyse"></jmath>
            </div>
          </div>
        </div>
      </div>
    </jdialog>
    <jdialog
      title="作业打印"
      :noFooter="true"
      :visible.sync="showDialog.printHomewok"
      width="1000px"
    >
      <div slot="body">
        <el-scrollbar style="height:600px;">
          <div id="printCons" class="contentPrint" style="font-size: 15px">
            <div style="text-align:center">
              <p>
                <strong style="font-size:24px">{{
                  printHomewokData.exercisename
                }}</strong>
              </p>
              <p>
                {{ format(printHomewokData.exercisetime, "YYYY-MM-DD H:mm") }}
              </p>
              <p>
                <span>班级：{{ printHomewokData.classname }}</span
                ><span style="margin:0 30px"
                  >学号：{{ printHomewokData.stuNumber }}</span
                ><span>姓名：{{ printHomewokData.stuName }}</span>
              </p>
            </div>
            <el-divider></el-divider>
            <div
              v-for="(item, index) in printHomewokData.subjects"
              :key="index"
            >
              <div>
                <span style="line-height: 60px;"
                  ><el-tag size="small">{{ formatType(item.tSubject) }}</el-tag
                  ><strong> {{ index + 1 }}.</strong></span
                >
                <jmath
                  class="title"
                  style="line-height: 60px;"
                  :data="item.title"
                ></jmath>
              </div>
              <div style="margin-left:20px">
                <div
                  v-for="(itemAnswers, indextwo) in item.answers"
                  :key="indextwo"
                >
                  <div
                    :style="{
                      color: itemAnswers.isCorrect == 2 ? 'green' : '#333'
                    }"
                  >
                    <span>{{ itemAnswers.option }}.</span>
                    <jmath
                      class="title"
                      style="line-height: 60px;"
                      :data="itemAnswers.text"
                    ></jmath>
                  </div>
                </div>
                <div
                  v-if="
                    item.tSubject == 1 ||
                      item.tSubject == 2 ||
                      item.tSubject == 3
                  "
                >
                  <div>
                    <span style="color:red">学生答案：</span>
                    <jmath
                      class="title"
                      style="line-height: 60px;"
                      :data="item.stuAnswer"
                    ></jmath>
                  </div>
                  <div>
                    <span style="color:red">批改结果：</span>
                    <span>{{ item.status == 2 ? "正确" : "错误" }}</span>
                  </div>
                </div>
                <div v-else>
                  <div style="margin-bottom:10px">
                    <span style="color:red">学生答案：</span>
                    <el-image
                      v-if="item.stuAnswer"
                      style="width: 100px; height: 100px"
                      :src="item.stuAnswer"
                      :preview-src-list="previewSrcList(item.stuAnswer)"
                    >
                    </el-image>
                    <span v-else>暂无</span>
                  </div>
                  <div>
                    <span style="color:red;">批改结果：</span>
                    <el-image
                      v-if="item.answerRemark"
                      style="width: 100px; height: 100px"
                      :src="item.answerRemark"
                      :preview-src-list="previewSrcList(item.answerRemark)"
                    >
                    </el-image>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </div>
              <el-divider></el-divider>
            </div>
          </div>
        </el-scrollbar>
        <!-- <iframe src="" id="printiframe" v-show="true" frameborder="0" width="100%"></iframe>   -->
        <div style="text-align: right">
          <el-button
            type="text"
            @click="printCheckoutDetail"
            style="margin-right: 20px"
            icon="el-icon-printer"
            >打印作业</el-button
          >
        </div>
      </div>
    </jdialog>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
import InfiniteLoading from "vue-infinite-loading";
import moment from "moment";
import common from "@/utils/common";
import jmath from "@/components/jmath";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import printJS from "print-js";
export default {
  name: "teaReport",
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  components: {
    jdialog,
    jmath,
    InfiniteLoading
  },
  data() {
    return {
      alSwer: 0, // 已提交人数
      unSwer: 0, // 未提交人数
      cls: {},
      showDialog: {
        signDetail: false,
        replyDetail: false,
        homeworkDetail: false,
        stuCount: false,
        subjectDetail: false,
        printHomewok: false
      },
      page: {
        signList: 1,
        replyList: 1,
        taskList: 1,
        signDetail: 1,
        replyDetail: 1,
        homeworkDetail: 1
      },
      signList: [],
      replyList: [],
      homeworkList: [],
      stuCountList: [], //学生统计表格
      signStuList: [],
      replyStuList: [],
      homeworkStuList: [],
      clazzSignSummary: {
        totalTimes: 0,
        totalRate: "0%"
      },
      clazzReplySummary: {
        totalTimes: 0,
        totalSubmitRate: "0%",
        totalCorrectRate: "0%"
      },
      clazzTaskSummary: {
        totalTimes: 0,
        totalSubmitRate: "0%",
        totalAverageScore: 0
      },
      signSummary: {
        signedRate: "0%",
        signedStuQuantity: 0,
        lateStuQuantity: 0,
        sickStuQuantity: 0,
        personalStuQuantity: 0,
        absenceStuQuantity: 0
      },
      currentSign: "",
      currentReply: "",
      currentHomework: "",
      replySummary: {
        totalSubmitRate: "0%",
        totalCorrectRate: "0%"
      },
      homeworkSummary: {
        totalSubmitRate: "0%",
        totalAverageScore: 0
      },
      signIdentifier: +new Date(),
      replyIdentifier: +new Date(),
      taskIdentifier: +new Date(),
      replyInfoLoading: false,
      replyInfo: null,
      subject: null,
      showSignDetail: false,
      showReplyDetail: false,
      showTaskDetail: false,
      printHomewokData: {}
    };
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    this.loadClazzSignSummary();
    this.loadClazzReplySummary();
    this.loadClazzHomeworkSummary();
  },
  methods: {
    // 签到汇总
    loadClazzSignSummary() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignsSummary",
          data: {
            clazzId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.clazzSignSummary = ret.data;
          }
        });
    },
    // 签到列表
    loadSignList() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSigns",
          data: {
            clazzId: this.cls.classId,
            pageNum: this.page.signList,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data.length) {
              this.page.signList++;
              this.signList.push(...ret.data.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出班级签到
    exportClazzSign() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportSignXlsx?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级签到明细
    exportDetailSign() {
      let url =
        process.env.BASE_URL +
        "/clazz/teacher/exportDetailSign?classId=" +
        this.cls.classId +
        "&uid=" +
        this.$store.state.user.userId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 删除签到
    deleteSign(row) {
      this.$confirm(
        "你是否确定要删除本次签到？删除签到数据后不可恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/clazz/delSign",
              data: {
                signNo: row.signNo
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.loadClazzSignSummary();
                  this.page.signList = 1;
                  this.signList = [];
                  this.signIdentifier++;
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    // 签到详情
    signDetail(row) {
      this.currentSign = row;
      this.page.signDetail = 1;
      this.signStuList = [];
      this.showDialog.signDetail = true;
      this.loadSignSummary();
    },
    // 单次签到汇总
    loadSignSummary() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignDetailSummary",
          data: {
            signNo: this.currentSign.signNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.signSummary = ret.data;
          }
        });
    },
    // 单次签到学生列表
    loadSignStuList() {
      axios
        .request({
          method: "post",
          url: "v1/clazz/selSignDetail",
          data: {
            signNo: this.currentSign.signNo,
            pageNum: this.page.signDetail,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.length) {
              this.page.signDetail++;
              this.signStuList.push(...ret.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出单次签到详情
    exportSign() {
      let url =
        process.env.BASE_URL +
        "/v1/clazz/exportSignDetail?signNo=" +
        this.currentSign.signNo +
        "&startTime=" +
        this.currentSign.createTime +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    signType(type) {
      let array = ["缺勤", "已签到", "缺勤", "病假", "事假", "迟到"];
      if (type < array.length) {
        return array[type];
      }
      return "缺勤";
    },
    // 应答汇总
    loadClazzReplySummary() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswersSummaryByClazzId",
          data: {
            clazzId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.clazzReplySummary = ret.data;
          }
        });
    },
    // 应答列表
    loadReplyList() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswersByClazzId",
          data: {
            clazzId: this.cls.classId,
            pageNum: this.page.replyList,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data.length) {
              this.page.replyList++;
              this.replyList.push(...ret.data.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出班级应答
    exportClazzReply() {
      let url =
        process.env.BASE_URL +
        "/clazz/f1/answer/exportAnswerXlsx?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级应答明细
    exportAnswerSummary() {
      let url =
        process.env.BASE_URL +
        "/clazz/teacher/exportAnswerSummary?classId=" +
        this.cls.classId +
        "&uid=" +
        this.$store.state.user.userId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 删除应答
    deleteReply(row) {
      this.$confirm(
        "你是否确定要删除本次应答？删除应答数据后不可恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "clazz/v4/answer/delAnswerByAnswerNo",
              data: {
                answerNo: row.answerNo
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.loadClazzReplySummary();
                  this.page.replyList = 1;
                  this.replyList = [];
                  this.replyIdentifier++;
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    // 应答题目详情
    subjectDetail(row) {
      this.currentReply = row;
      this.loadReplyInfo();
      this.showDialog.subjectDetail = true;
    },
    // 应答
    loadReplyInfo() {
      this.replyInfoLoading = true;
      this.replyInfo = null;
      this.subject = null;
      axios
        .request({
          method: "post",
          url: "clazz/v4/answer/selInfoByAnswerNo",
          data: {
            answerNo: this.currentReply.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.answerFrom == 1) {
              this.loadSubject(ret.data.answerBankId);
            } else {
              this.replyInfoLoading = false;
              this.replyInfo = ret.data;
            }
          } else {
            this.replyInfoLoading = false;
          }
        });
    },
    loadSubject(bankId) {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBank/info2",
          data: {
            classId: this.cls.classId,
            answerNo: this.currentReply.answerNo,
            answerFrom: 1,
            bankId: bankId
          }
        })
        .then(res => {
          this.replyInfoLoading = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.subject = ret.data;
          }
        });
    },
    // 应答详情
    replyDetail(row) {
      this.currentReply = row;
      this.replyStuList = [];
      this.page.replyDetail = 1;
      this.loadReplySummary();
      // this.loadReplyStuList()
      this.showDialog.replyDetail = true;
    },
    // 单次应答汇总
    loadReplySummary() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswerDetailSummary",
          data: {
            answerNo: this.currentReply.answerNo
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.replySummary = ret.data;
          }
        });
    },
    // 单次应答学生列表
    loadReplyStuList() {
      axios
        .request({
          method: "post",
          url: "clazz/f1/answer/selAnswerDetail",
          data: {
            answerNo: this.currentReply.answerNo,
            pageNum: this.page.replyDetail,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.length) {
              this.page.replyDetail++;
              this.replyStuList.push(...ret.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出单次应答详情
    exportReply() {
      let url =
        process.env.BASE_URL +
        "/clazz/f1/answer/exportAnswerDetailXlsx?answerNo=" +
        this.currentReply.answerNo +
        "&createTime=" +
        this.currentReply.createTime +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    replyResult(row) {
      if (row.submitTime) {
        if (row.isCorrect == 2) {
          return "正确";
        }
        return "错误";
      } else {
        return "--";
      }
    },
    // 班级作业汇总
    loadClazzHomeworkSummary() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExercisesSummaryByClazzId",
          data: {
            clazzId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.clazzTaskSummary = ret.data;
          }
        });
    },
    // 作业列表
    loadHomeworkList() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExercisesByClazzId",
          data: {
            clazzId: this.cls.classId,
            pageNum: this.page.taskList,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.data.length) {
              this.page.taskList++;
              this.homeworkList.push(...ret.data.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    // 导出班级作业
    exportClazzExercises() {
      let url =
        process.env.BASE_URL +
        "/clazz/v4/exercise/exportExercisesXlsxByClazzId?clazzId=" +
        this.cls.classId +
        "&clazzName=" +
        this.cls.classname +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出班级作业明细
    exportDetailExercise() {
      let url =
        process.env.BASE_URL +
        "/clazz/teacher/exportDetailExercise?classId=" +
        this.cls.classId +
        "&uid=" +
        this.$store.state.user.userId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 删除作业
    deleteHomework(row) {
      this.$confirm(
        "你是否确定要删除本次作业？删除作业数据后不可恢复",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "clazz/v4/exercise/delExerciseByExerciseIdAndCreatorId",
              data: {
                exerciseId: row.exerciseId
              }
            })
            .then(
              function(data) {
                let ret = data.data;
                if (ret.code === 200) {
                  this.$message({
                    type: "success",
                    message: ret.msg
                  });
                  this.loadClazzHomeworkSummary();
                  this.page.taskList = 1;
                  this.homeworkList = [];
                  this.taskIdentifier++;
                  this.loadHomeworkList();
                } else {
                  this.$message({
                    type: "error",
                    message: ret.msg
                  });
                }
              }.bind(this)
            );
        })
        .catch(() => {});
    },
    // 学生统计
    stuCountDetail(row) {
      this.currentHomework = row;
      this.page.homeworkDetail = 1;
      this.homeworkStuList = [];
      this.loadStuCountList();
      this.showDialog.stuCount = true;
    },
    toStuStatistics(row) {
      this.currentHomework = row;
      this.$router.push({
        path: "/topic/stuStatistics",
        query: {
          exercisesId: this.currentHomework.exerciseId,
          classId: this.cls.classId,
          startTime: this.currentHomework.startTime,
          endTime: this.currentHomework.endTime
        }
      });
    },
    // 学生统计列表
    loadStuCountList() {
      axios
        .request({
          method: "post",
          url: "/clazz/v4/exercise/selPendNamesByExercisesId",
          data: {
            exercisesId: this.currentHomework.exerciseId,
            classId: this.cls.classId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.stuCountList = ret.data.exerciseDetailVOList;
            this.alSwer = ret.data.alSwer || 0;
            this.unSwer = ret.data.unSwer || 0;
          }
        });
    },
    // 作业详情
    homeworkDetail(row) {
      this.currentHomework = row;
      this.page.homeworkDetail = 1;
      this.homeworkStuList = [];
      this.loadHomeworkSummary();
      this.showDialog.homeworkDetail = true;
    },
    // 单次作业汇总
    loadHomeworkSummary() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExerciseDetaiSummaryByExerciseId",
          data: {
            exerciseId: this.currentHomework.exerciseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.homeworkSummary = ret.data;
          }
        });
    },
    loadHomeworkStuList() {
      axios
        .request({
          method: "post",
          url: "clazz/v4/exercise/selExerciseDetailByExerciseId",
          data: {
            exerciseId: this.currentHomework.exerciseId,
            pageNum: this.page.homeworkDetail,
            pagesize: 10
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            if (ret.data.length) {
              this.page.homeworkDetail++;
              this.homeworkStuList.push(...ret.data);
            } else {
            }
          } else {
          }
        })
        .catch(() => {});
    },
    exportAllHomework() {
      let url =
        process.env.BASE_URL +
        "/tiku/exerciseStu/exportExerciseStuZip?exerciseId=" +
        this.currentHomework.exerciseId +
        "&exerciseName=" +
        this.currentHomework.exerciseName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 导出作业详情
    exportHomework() {
      let url =
        process.env.BASE_URL +
        "/clazz/v4/exercise/exportExerciseDetaiXlsxByExerciseId?exerciseId=" +
        this.currentHomework.exerciseId +
        "&exerciseName=" +
        this.currentHomework.exerciseName +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 打印作业
    printHomewok(row) {
      // axios.request({
      //   method: 'post',
      //   url: '/tiku/exerciseStu/exerciseInfoStuPC',
      //   data: {
      //     exerciseId: this.currentHomework.exerciseId,
      //     uid: this.$store.state.user.userId,
      //     sUid: row.stuId
      //   }
      // }).then(res => {
      //   // let ret = res.data
      //   this.printHomewokData = res.data.data
      //   console.log(this.printHomewokData)
      //   this.showDialog.printHomewok = true
      // }).catch(() => {
      // })
      let newUrl = this.$router.resolve({
        path: "/class/printHomework",
        query: {
          exerciseId: this.currentHomework.exerciseId,
          sUid: row.stuId
        }
      });
      window.open(newUrl.href, "_blank");
    },
    //格式化图片大图预览
    previewSrcList(item) {
      console.log(item);
      let imgSrc = [];
      if (item) {
        imgSrc.push(item);
      }
      return imgSrc;
    },
    // 格式化时间
    format(time, format) {
      if (time) {
        let iDate = parseInt(time);
        return moment(iDate).format(format);
      }
      return "";
    },
    // 格式化题目类型
    formatType(type) {
      return common.typeFormat(type);
    },
    getAnswer(answerList) {
      let answer = "无";
      let list = [];
      if (answerList) {
        answerList.forEach(element => {
          if (element.isCorrect == 2) {
            list.push(element.option);
          }
        });
        if (list.length) {
          answer = list.join(",");
        }
      }
      return answer;
    },
    print(obj) {
      var newWindow = window.open("打印窗口", "_blank");
      var docStr = obj.innerHTML;
      newWindow.document.write(
        "<lin" +
          "k hr" +
          'ef="//frontend.mofangchuxing.com/element-ui/index.css?print" re' +
          'l="stylesheet">'
      );
      newWindow.document.write(
        "<lin" + "k hr" + 'ef="ent.css?print" re' + 'l="stylesheet">'
      );
      newWindow.document.write(docStr);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    },
    printCheckoutDetail() {
      // var f = document.getElementById('printiframe')
      let subOutputRankPrint = document.getElementById("printCons"); // 要打印区域的元素id
      console.log(subOutputRankPrint.innerHTML);
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      document.body.innerHTML = oldContent;
      window.location.reload();
      return false;
    },
    goPrint() {
      console.log("打印");
      const style =
        "@page { size:auto;margin: 0cm 1cm 0cm 1cm; } " +
        "@media print { body { font-size: 40px } }";
      printJS({
        printable: "printCons",
        type: "html",
        targetStyles: ["*"],
        ignoreElements: ["no-print", "bc", "gb"],
        style: style //去除页眉页脚
      });
    },
    goSee(row) {
      let { exerciseId, exerciseName } = row;
      this.$router.push({
        path: "/topic/topicDetail",
        query: {
          exerciseId,
          exerciseName,
          classId: this.cls.classId
        }
      });
    },
    goStuHomeWorkDetail(row) {
      if (!row.submitTime) {
        // 未提交
        this.$message({
          message: "该学生未提交作业",
          type: "warning"
        });
        return;
      }
      // 跳转作业详情
      this.$router.push({
        path: "/topic/stuHomeWorkDetail",
        query: {
          exerciseId: this.currentHomework.exerciseId,
          classId: this.cls.classId,
          suid: row.stuId
        }
      });
    }
  }
};
</script>
<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0cm 2cm;
}
body {
  font-size: 14px;
}
</style>

<style lang="scss">
.teaReport {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .container {
    height: 440px;
    border: 1px solid rgba(190, 203, 217, 1);
    padding: 32px 30px 35px 35px;
    margin-top: 17px;
    margin-bottom: 37px;
    max-width: 1270px;
  }
  .el-table td {
    padding: 8px;
  }
  .el-aside {
    color: #333;
    padding-top: 21px;
    .title {
      color: #333;
      font-size: 18px;
      font-weight: bold;
    }
    .summery {
      margin-top: 30px;
      margin-bottom: 18px;
      color: #333;
      font-size: 16px;
      .number {
        color: #0d4376;
        font-size: 24px;
        font-weight: bold;
      }
      .unit {
        color: #0d4376;
        font-size: 16px;
      }
    }
  }
  .el-header {
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding-right: 0;
  }
  .el-main {
    padding-top: 0;
    padding-right: 0px;
    padding-left: 29px;
    padding-bottom: 9px;
  }
  .dialogHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialogSummery {
    margin-top: 26px;
    background: #fbf8eb;
    color: #ac7427;
    font-size: 16px;
    border: 1px solid #e6d3b7;
    border-radius: 4px;
    .summary {
      background: #fbe265;
      padding-left: 31px;
      padding-right: 21px;
    }
  }
  .dialogSummery > span {
    padding: 13px 9px 18px 28px;
    display: inline-block;
  }
  .dialogTable {
    border-radius: 4px;
    border: 1px solid rgba(13, 67, 118, 0.2);
    margin-top: 22px;
  }
  .replyInfo {
    min-height: 500px;
    font-weight: 400;
    padding: 0 20px;
    line-height: 1.5;
    .head {
      background: #ffffff;
      margin-bottom: 10px;
      .type {
        display: inline-block;
        background: #10c4ee;
        color: #ffffff;
        border-radius: 5px;
        padding: 5px 10px;
        margin-bottom: 15px;
      }
      .title {
        text-align: justify;
        font-size: 16px;
        word-break: break-all;
        font-weight: 600;
      }
      .picture {
        display: block;
        margin-top: 15px;
        width: 60%;
      }
    }
    .options {
      font-size: 16px;
      background: #ffffff;
      margin-bottom: 10px;
      .option {
        overflow: hidden;
        margin: 15px 0;
        display: flex;
        .aOption {
          margin-right: 10px;
        }
      }
    }
    .bm {
      font-size: 16px;
      overflow: hidden;
      background: #ffffff;
      .tp {
        margin-bottom: 15px;
        line-height: 25px;
      }
    }
  }
}
</style>
