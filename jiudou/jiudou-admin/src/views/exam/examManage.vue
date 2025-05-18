<template>
  <el-container class="cloudCourse">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="exam-list"
      ref="tabs"
    >
      <el-tab-pane label="考试列表" name="first">
        <el-main>
          <div class="top">
            <div class="left-form">
              <el-form
                :inline="true"
                class="demo-form-inline"
                @submit.native.prevent
              >
                <el-form-item>
                  <el-input
                    v-model.trim="searchForm.examName"
                    placeholder="请输入考试名称/班级"
                    style="width: 200px"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="searchForm.startTime"
                    placeholder="选择开始时间"
                    type="datetime"
                    clearabletype="date"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :style="{ width: '100%' }"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="searchForm.endTime"
                    placeholder="选择结束时间"
                    type="datetime"
                    clearabletype="date"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :style="{ width: '100%' }"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
                <!-- popper-class="popper-select" -->
                <el-form-item label="状态">
                  <el-select
                    :popper-append-to-body="false"
                    style="width: 120px"
                    size="small"
                    v-model="searchForm.status"
                    placeholder="请选择状态"
                    @change="searchExam"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                    <el-option label="进行中" value="2"></el-option>
                    <el-option label="已结束" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchExam"
                    size="small"
                  ></el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="operateBtn">
              <el-button
                @click="toCreateExam"
                size="small"
                type="primary"
                icon="el-icon-plus"
                >创建考试</el-button
              >
              <!-- <el-button
                @click="toCreateExamNew"
                size="small"
                type="primary"
                icon="el-icon-plus"
                >新创建考试</el-button
              > -->
              <el-button size="small" @click="transExam" type="primary"
                >试卷转发</el-button
              >
              <el-button size="small" @click="shareExam" type="primary"
                >试卷分享</el-button
              >
            </div>
          </div>
          <div class="main">
            <el-table
              @row-click="handleRowClick"
              :data="examList"
              border
              :header-cell-style="{
                'background-image':
                  'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                color: '#333333',
                height: '40px',
                padding: '0'
              }"
              :row-style="{ height: '60px' }"
              v-loading="loading.tableLoading"
            >
              <el-table-column align="center" label="" width="38">
                <template slot-scope="scope">
                  <el-radio
                    class="exam-radio"
                    :label="scope.row.examId"
                    v-model="radioSelect"
                    @change.native="getRow(scope.$index, scope.row)"
                  >
                    <span>&nbsp</span>
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="examName"
                label="考试名称"
                align="center"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">班级考试</span>
                  <span v-if="scope.row.type == 2">扫码考试</span>
                  <span v-if="scope.row.type == 3">名单考试</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="score"
                label="总分"
                align="center"
                min-width="50"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="className"
                label="考试班级"
                align="center"
                min-width="120"
              >
              </el-table-column> -->
              <el-table-column
                prop="password"
                label="考试码&班级"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">{{
                    scope.row.className
                  }}</span>
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    @click="showExamCode(scope.row)"
                    style="margin-left:0"
                    >{{ scope.row.password }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="开始时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.startTime == 0">未设置</span>
                  <span v-else>{{ dateFormat(scope.row.startTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="endTime"
                label="结束时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.endTime == 0">未设置</span>
                  <span v-else>{{ dateFormat(scope.row.endTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ dateFormat(scope.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  {{ statusFormat(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="auto">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status == 0"
                    type="text"
                    size="small"
                    @click="toPublishExam(scope.row)"
                    style="margin-left:0"
                    >编辑</el-button
                  >

                  <el-button
                    v-if="scope.row.status > 1"
                    type="text"
                    size="small"
                    @click="toExamCheck(scope.row)"
                    style="margin-left:0"
                    >成绩查询批改</el-button
                  >

                  <el-button
                    type="text"
                    size="small"
                    @click="toViewSetting(scope.row)"
                    style="margin-left:0"
                    >预览</el-button
                  >

                  <el-dropdown trigger="click" :hide-on-click="true">
                    <span
                      class="el-dropdown-link"
                      style="color:#409EFF;font-size:12px;cursor: pointer;"
                    >
                      更多操作<i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 1"
                          type="text"
                          size="small"
                          @click="examBack(scope.row)"
                          style="margin-left:0"
                          >撤回</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <!-- v-if="scope.row.status == 3" -->
                        <el-button
                          v-if="scope.row.status == 3"
                          type="text"
                          size="small"
                          @click="toExamAnalysis(scope.row)"
                          style="margin-left:0"
                          >统计分析</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          size="small"
                          v-if="scope.row.status == 2 || scope.row.status == 3"
                          @click="commitRecord(scope.row)"
                          style="margin-left:0"
                          >提交记录</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 3"
                          type="text"
                          size="small"
                          @click="toSetCheck(scope.row)"
                          style="margin-left:0"
                          >设置批阅</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          size="small"
                          style="margin-left:0"
                          @click="toClassifyExam(scope.row)"
                          >归档考试</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 0"
                          type="text"
                          size="small"
                          @click="deleteExam(scope.row)"
                          style="margin-left:0"
                          >删除</el-button
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div class="right-footer-first">
                从 {{ (this.page.currentPage - 1) * this.page.pagesize + 1 }} 到
                {{
                  (this.page.currentPage - 1) * this.page.pagesize +
                    this.examList.length
                }}
                记录，共 {{ page.total }} 条
              </div>
              <el-pagination
                layout="prev, pager, next, jumper"
                background
                :total="page.total"
                :current-page.sync="page.currentPage"
                :page-size="page.pagesize"
                @current-change="loadData"
              ></el-pagination>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
      <el-tab-pane label="考试归档" name="second">
        <el-main>
          <div class="top">
            <div class="left-form">
              <el-form
                :inline="true"
                class="demo-form-inline"
                @submit.native.prevent
              >
                <el-form-item>
                  <el-input
                    v-model.trim="searchForm1.examName"
                    placeholder="请输入考试名称/班级"
                    style="width: 200px"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="searchForm1.startTime"
                    placeholder="选择开始时间"
                    type="datetime"
                    clearabletype="date"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :style="{ width: '100%' }"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="searchForm1.endTime"
                    placeholder="选择结束时间"
                    type="datetime"
                    clearabletype="date"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :style="{ width: '100%' }"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select
                    :popper-append-to-body="false"
                    style="width: 120px"
                    size="small"
                    v-model="searchForm1.status"
                    placeholder="请选择状态"
                    @change="searchExam1"
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未发布" value="0"></el-option>
                    <el-option label="已发布" value="1"></el-option>
                    <el-option label="进行中" value="2"></el-option>
                    <el-option label="已结束" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchExam1"
                    size="small"
                  ></el-button>
                </el-form-item>
              </el-form>
            </div>

            <div class="operateBtn">
              <el-button
                @click="toCreateExam"
                size="small"
                type="primary"
                icon="el-icon-plus"
                >创建考试</el-button
              >

              <el-button size="small" @click="transExam" type="primary"
                >试卷转发</el-button
              >
              <el-button size="small" @click="shareExam" type="primary"
                >试卷分享</el-button
              >
            </div>
          </div>
          <div class="main">
            <el-table
              @row-click="handleRowClick"
              :data="examList1"
              border
              :header-cell-style="{
                'background-image':
                  'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                color: '#333333',
                height: '40px',
                padding: '0'
              }"
              :row-style="{ height: '60px' }"
              v-loading="loading.tableLoading1"
            >
              <el-table-column align="center" label="" width="38">
                <template slot-scope="scope">
                  <el-radio
                    class="exam-radio"
                    :label="scope.row.examId"
                    v-model="radioSelect"
                    @change.native="getRow(scope.$index, scope.row)"
                  >
                    <span>&nbsp</span>
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                prop="examName"
                label="考试名称"
                align="center"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">班级考试</span>
                  <span v-if="scope.row.type == 2">扫码考试</span>
                  <span v-if="scope.row.type == 3">名单考试</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="score"
                label="总分"
                align="center"
                min-width="50"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="className"
                label="考试班级"
                align="center"
                min-width="120"
              >
              </el-table-column> -->
              <el-table-column
                prop="password"
                label="考试码&班级"
                align="center"
                min-width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">{{
                    scope.row.className
                  }}</span>
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    @click="showExamCode(scope.row)"
                    style="margin-left:0"
                    >{{ scope.row.password }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="startTime"
                label="开始时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.startTime == 0">未设置</span>
                  <span v-else>{{ dateFormat(scope.row.startTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="endTime"
                label="结束时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.endTime == 0">未设置</span>
                  <span v-else>{{ dateFormat(scope.row.endTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
                min-width="100"
              >
                <template slot-scope="scope">
                  {{ dateFormat(scope.row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                min-width="60"
              >
                <template slot-scope="scope">
                  {{ statusFormat(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="auto">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status == 0"
                    type="text"
                    size="small"
                    @click="toPublishExam(scope.row)"
                    style="margin-left:0"
                    >编辑</el-button
                  >

                  <el-button
                    v-if="scope.row.status > 1"
                    type="text"
                    size="small"
                    @click="toExamCheck(scope.row)"
                    style="margin-left:0"
                    >成绩查询批改</el-button
                  >

                  <el-button
                    type="text"
                    size="small"
                    @click="toViewSetting(scope.row)"
                    style="margin-left:0"
                    >预览</el-button
                  >

                  <el-dropdown trigger="click" :hide-on-click="true">
                    <span
                      class="el-dropdown-link"
                      style="color:#409EFF;font-size:12px;cursor: pointer;"
                    >
                      更多操作<i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 1"
                          type="text"
                          size="small"
                          @click="examBack(scope.row)"
                          style="margin-left:0"
                          >撤回</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 3"
                          type="text"
                          size="small"
                          @click="toExamAnalysis(scope.row)"
                          style="margin-left:0"
                          >统计分析</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          size="small"
                          v-if="scope.row.status == 2 || scope.row.status == 3"
                          @click="commitRecord(scope.row)"
                          style="margin-left:0"
                          >提交记录</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 3"
                          type="text"
                          size="small"
                          @click="toSetCheck(scope.row)"
                          style="margin-left:0"
                          >设置批阅</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          type="text"
                          size="small"
                          style="margin-left:0"
                          @click="unClassifyExam(scope.row)"
                          >取消归档</el-button
                        >
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <el-button
                          v-if="scope.row.status == 0"
                          type="text"
                          size="small"
                          @click="deleteExam1(scope.row)"
                          style="margin-left:0"
                          >删除</el-button
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div class="right-footer-first">
                从
                {{ (this.page1.currentPage - 1) * this.page1.pagesize + 1 }} 到
                {{
                  (this.page1.currentPage - 1) * this.page1.pagesize +
                    this.examList1.length
                }}
                记录，共 {{ page1.total }} 条
              </div>
              <el-pagination
                layout="prev, pager, next, jumper"
                background
                :total="page1.total"
                :current-page.sync="page1.currentPage"
                :page-size="page1.pagesize"
                @current-change="loadData1"
              ></el-pagination>
            </div>
          </div>
        </el-main>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-header style="height: 50px">
      考试列表
    </el-header> -->

    <!-- 分享考试 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>考试分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取分享内容，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2">
        <span style="color:#999;margin-right:15px;">分享内容</span>
        <span>{{ radioCheck.examName }}</span>
      </div>
      <div style="font-size:18px;margin-top:30px;overflow:hidden;" v-else>
        <span style="color:#999;margin-right:15px;float:left;margin-top:5px;"
          >链接</span
        >
        <el-input v-model="shareLink" style="width:550px;float:left;">
          <el-button slot="append" @click="resetLink">重置</el-button>
        </el-input>
        <el-button
          type="primary"
          style="margin-left:20px;float:left;"
          @click="copyShareLink"
          >复制链接</el-button
        >
        <div
          style="color:#999999;float:left;width:100%;font-size:14px;margin-top:20px;"
        >
          点击重置后，原链接会失效。
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="isShareShow = false" v-if="!shareModal2"
          >取消</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="toCreateShareLink"
          v-if="!shareModal2"
          >创建分享链接</el-button
        >
        <el-button
          @click="isShareShow = false"
          v-if="shareModal2"
          style="margin-top:30px;"
          >关闭弹窗</el-button
        >
      </span>
    </el-dialog>
    <!-- 试卷转发 -->
    <el-dialog
      top="6vh"
      v-if="isTransPaperShow"
      :visible.sync="isTransPaperShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :before-close="handleCloseTransPaper"
      width="1000px"
      center
    >
      <template slot="title">
        <div>
          <div></div>
          <div>试卷转发</div>
        </div>
      </template>

      <div class="top">
        <el-input
          size="small"
          v-model.trim="classKeyWord"
          placeholder="请输入班级名称"
          @keyup.enter.native="searchClass"
          style="width: 300px"
        ></el-input>
        <el-button
          @click="searchClass"
          type="primary"
          class="el-icon-search"
          size="small"
        ></el-button>
      </div>
      <el-table
        @selection-change="handleSelectionChange"
        v-loading="loading.tableLoading"
        :data="classList"
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
        <el-table-column align="center" type="selection" width="40">
        </el-table-column>
        <!-- <el-table-column align="center" label="" width="38">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.paperId"
              v-model="radioSelect"
              @change.native="getRow(scope.$index, scope.row)"
            >
              <span>&nbsp</span>
            </el-radio>
          </template>
        </el-table-column> -->
        <el-table-column label="班级名称" prop="paperName">
          <template slot-scope="scope">
            <span>{{ scope.row.classname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="班级人数"
          prop="stuNum"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="teaName"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="addTime"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            {{ dateFormat(scope.row.addTime) }}
          </template></el-table-column
        >
      </el-table>
      <div class="tabelFooter">
        <div class="right-footer-first">
          从
          {{ (this.classPage.currentPage - 1) * this.classPage.pagesize + 1 }}
          到
          {{
            (this.classPage.currentPage - 1) * this.classPage.pagesize +
              this.classList.length
          }}
          记录，共 {{ classPage.total }} 条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          background
          :page-sizes="[10, 30, 50]"
          :total="classPage.total"
          :current-page.sync="classPage.currentPage"
          :page-size="classPage.pagesize"
          @current-change="getClassList"
        >
        </el-pagination>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="isAbleTrans"
          size="small"
          @click="doTransPaper"
          type="primary"
          >转发</el-button
        >

        <el-button size="small" @click="handleCloseTransPaper">取消</el-button>
      </span>
    </el-dialog>

    <!-- 考试二维码 -->
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
            currentExam.password
          }}</span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="downloadExamCode"
          >下载二维码</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import axios from "@/libs/api.request";
import { formatSS } from "@/utils/datetime";
import vueQr from "vue-qr";

export default {
  components: {
    // courseProtocol
    vueQr
  },
  data() {
    return {
      isExamQrCodeShow: false,
      examCode: "",
      activeName: "first",
      shareModal2: false,
      isShareShow: false,
      isTransPaperShow: false, // 转发
      shareLink: "",
      radioSelect: "",
      radioCheck: {},
      searchForm: {
        examName: "",
        startTime: null,
        endTime: null,
        status: ""
      },
      searchForm1: {
        examName: "",
        startTime: null,
        endTime: null,
        status: ""
      },
      examList: [],
      examList1: [],
      isBigImageShow: false,
      isAgreeShow: false,
      lockBook: false,
      bookAdded: false,
      keyWord: "",
      keyWord1: "",
      loading: {
        tableLoading: false,
        tableLoading1: false,
        loadingChangePrice: false
      },
      page: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      page1: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      isChangePriceShow: false,
      priceForm: {
        oldPrice: "",
        newPrice: ""
        // effectiveTime: '',
      },
      pickerOptions: {
        // 时间不让选择今天以前的
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // historyPrice: [],
      currentCourse: {},
      classList: [],
      classPage: {
        total: 0,
        pagesize: 10,
        currentPage: 1
      },
      selectedClass: [],
      classKeyWord: "", // 班级名称
      currentExam: {}
    };
  },
  computed: {
    isAbleTrans() {
      return this.selectedClass.length === 0;
    }
  },
  methods: {
    showExamCode(row) {
      this.currentExam = row;
      this.examCode = row.password;
      this.isExamQrCodeShow = true;
    },
    downloadExamCode() {
      let base64 = "";
      let img = document.getElementsByClassName("examCode");
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
      aLink.download = `${this.currentExam.examName}_${this.examCode}.jpg`; // 保存时的图片名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    },
    handleClick(tab, event) {
      if (tab.name == "second") {
        // this.getSubjectAnalysisList();
        this.loadData1();
      } else if (tab.name == "first") {
        this.loadData();
      }
    },
    // 转发试卷
    handleCloseTransPaper() {
      this.classKeyWord = "";
      this.classPage.currentPage = 1;
      this.selectedClass = [];
      this.isTransPaperShow = false;
    },
    transExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.getClassList();
    },
    handleSelectionChange(val) {
      this.selectedClass = val;
    },
    toClassifyExam(row) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/filing",
          data: {
            examId: row.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "归档成功!"
            });
            // this.loadData();
            this.activeName = "second";
            this.page1.currentPage = 1;
            this.loadData1();
          } else {
            this.$message({
              type: "info",
              message: ret.msg
            });
          }
        });
    },
    unClassifyExam(row) {
      axios
        .request({
          method: "post",
          url: "/exam/exam/unFiling",
          data: {
            examId: row.examId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "取消归档成功！"
            });
            // this.loadData();
            this.activeName = "first";
            this.page.currentPage = 1;
            this.loadData();
          } else {
            this.$message({
              type: "info",
              message: ret.msg
            });
          }
        });
    },
    // 撤回考试
    examBack(row) {
      this.$confirm("是否撤销该考试?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/withdraw",
              data: {
                examId: row.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "撤销成功!"
                });
                this.loadData();
                this.loadData1();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 确定转发考试
    doTransPaper() {
      let classIds = [];
      this.selectedClass.forEach(item => {
        classIds.push(item.classId);
      });
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/relay",
          data: {
            examId: this.radioSelect,
            classIds: classIds.join(",")
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.$message({
              type: "success",
              message: "转发成功"
            });
            this.handleCloseTransPaper();
            this.radioSelect = "";
            this.radioCheck = {};
            this.loadData();
            this.loadData1();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    shareExam() {
      if (!this.radioSelect) {
        this.$message({
          type: "warning",
          message: "请先选择考试"
        });
        return;
      }
      this.isShareShow = true;
    },
    toCreateShareLink() {
      this.tsCode = "";
      axios
        .request({
          method: "post",
          url: "/exam/exam/paper/createShareCode",
          data: {
            examId: this.radioSelect
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.tsCode = ret.data.code;
            this.shareLink =
              process.env.THIS_URI + "/index?type=5&shareCode=" + this.tsCode;
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
    },
    // 单行点击
    handleRowClick(row, column, event) {
      this.radioSelect = row.examId;
      this.radioCheck = row;
    },
    resetLink() {},
    getRow(i, row) {
      this.radioCheck = row;
    },
    //复制链接
    copyShareLink() {
      if (this.shareLink.split(" ").join("").length == 0) {
        return false;
      }
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=2&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = this.shareLink; //赋值
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    loadData() {
      this.loading.tableLoading = true;
      let data = {
        isFiling: 0
      };
      // data.uid = 661605;
      data.pageNo = this.page.currentPage;
      data.pageSize = this.page.pagesize;
      if (this.searchForm.examName) {
        data.searchWord = this.searchForm.examName;
      }
      if (this.searchForm.startTime) {
        data.createExamBeginTime = this.searchForm.startTime;
      }
      if (this.searchForm.endTime) {
        data.createExamEndTime = this.searchForm.endTime;
      }
      if (this.searchForm.status) {
        data.status = this.searchForm.status;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/getExamList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.examList = ret.data.records;
            this.page.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    loadData1() {
      this.loading.tableLoading1 = true;
      let data = {
        isFiling: 1
      };
      // data.uid = 661605;
      data.pageNo = this.page1.currentPage;
      data.pageSize = this.page1.pagesize;
      if (this.searchForm1.examName) {
        data.searchWord = this.searchForm1.examName;
      }
      if (this.searchForm1.startTime) {
        data.createExamBeginTime = this.searchForm1.startTime;
      }
      if (this.searchForm1.endTime) {
        data.createExamEndTime = this.searchForm1.endTime;
      }
      if (this.searchForm1.status) {
        data.status = this.searchForm1.status;
      }
      axios
        .request({
          method: "post",
          url: "/exam/exam/getExamList",
          data: data
        })
        .then(res => {
          this.loading.tableLoading1 = false;
          let ret = res.data;
          if (ret.code === 200) {
            this.examList1 = ret.data.records;
            this.page1.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchClass() {
      this.classPage.currentPage = 1;
      this.getClassList();
    },
    getClassList() {
      let data = {
        isMasterhead: 0
      };
      data.pageNo = this.classPage.currentPage;
      data.pageSize = this.classPage.pagesize;
      if (this.classKeyWord) {
        data.className = this.classKeyWord;
      }
      axios
        .request({
          method: "post",
          url: "/clazz/clazz/myAllClassPage",
          data: data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isTransPaperShow = true;
            this.classList = ret.data.data;
            this.classPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    searchExam() {
      this.page.currentPage = 1;
      this.loadData();
    },
    searchExam1() {
      this.page1.currentPage = 1;
      this.loadData1();
    },
    toCreateExamNew() {
      this.$router.push({
        path: "/exam/examCreateNew"
      });
    },
    toCreateExam() {
      this.$router.push({
        path: "/exam/examCreate"
      });
    },
    toExamAnalysis(row) {
      this.$router.push({
        path: "/exam/examAnalysis",
        query: {
          examId: row.examId
        }
      });
    },
    dateFormat(row) {
      return formatSS(row);
    },
    statusFormat(row) {
      let statusText = "";
      switch (row.status) {
        case 0:
          statusText = "未发布";
          break;
        case 1:
          statusText = "已发布";

          break;
        case 2:
          statusText = "进行中";

          break;
        default:
          statusText = "已结束";

          break;
      }
      return statusText;
    },
    //云课价格类型
    formatPrice(row) {
      if (row) {
        if (row.price == 0) {
          return "免费";
        } else {
          return "￥" + row.price / 100;
        }
      }
    },
    //云课详情
    courseDetail(row) {
      this.$router.push({
        path: "/cloudCourse/courseDetail",
        query: {
          ccourseId: row.ccourseId,
          type: 1
        }
      });
    },

    //上下架显示
    isCourseOn(row) {
      if (row.ccourseIsOn == 1) {
        return "下架";
      } else {
        return "上架";
      }
    },
    //编辑
    editCourse(row) {
      this.$router.push({
        path: "/moocModule/moocInfo",
        query: {
          ccourseId: row.id
        }
      });
    },

    //删除
    deleteExam(row) {
      this.$confirm("是否删除该考试?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/delete",
              data: {
                examId: row.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.loadData();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //归档删除
    deleteExam1(row) {
      this.$confirm("是否删除该考试?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/exam/exam/delete",
              data: {
                examId: row.examId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.loadData1();
              } else {
                this.$message({
                  type: "info",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    // 去发布考试
    toPublishExam(row) {
      // this.$router.push({
      //   path: "/exam/examPublish",
      //   query: {
      //     examId: row.examId
      //   }
      // });
      this.$router.push({
        path: "/exam/examCreateNew",
        query: {
          examId: row.examId
        }
      });
    },
    toSetCheck(row) {
      this.$router.push({
        path: "/exam/examSetCheck",
        query: {
          examId: row.examId
        }
      });
    },
    toViewSetting(row) {
      this.$router.push({
        path: "/exam/viewExamSetting",
        query: {
          examId: row.examId
        }
      });
    },
    commitRecord(row) {
      this.$router.push({
        path: "/exam/ExamRecord",
        query: {
          examId: row.examId
        }
      });
    },
    // 去成绩批改
    toExamCheck(row) {
      this.$router.push({
        path: "/exam/examCheck",
        query: {
          examId: row.examId
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .popper-select {
  position: absolute !important;
  top: 25px !important;
  left: 0px !important;
}
.cloudCourse {
  // 考试口令二维码
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
    .exam-password {
      font-size: 20px;
    }
  }
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
  .exam-list {
    width: 100%;
    .el-main {
      margin: 20px;
      background: #ffffff;
      border-radius: 4px;
      min-height: 700px;
      padding-top: 12px;
      padding-left: 18px;
      padding-right: 18px;
      padding-bottom: 12px;
      .top {
        .left-form {
          float: left;
        }
        .operateBtn {
          float: right;
        }
      }
      .main {
        margin-top: 13px;

        .info {
          padding: 0px 10px;
          overflow: hidden;
          text-align: left;
          .left {
            float: left;
            img {
              width: 157.4px;
              height: 86px;
              display: block;
            }
          }
          .middle {
            margin-left: 18px;
            float: left;
            .name {
              font-weight: bold;
              font-size: 14px;
              color: #333333;
              span:first-child {
                // border:1px solid #2BA1F4;
                // color:#2BA1F4;
                // font-weight:normal;
                // padding: 2px 5px;
                // font-size: 12px;
                // border-radius: 10px;
                // margin-right: 10px;
                cursor: pointer;
              }
              // span:nth-child(2){
              //   cursor: pointer;
              // }
            }
            .cloudId {
              margin-top: 5px;
              font-size: 14px;
              color: #666666;
            }
            .price {
              color: #ff783d;
              margin-top: 6px;
              font-weight: 600;
            }
          }
          .courseTime {
            float: right;
            font-size: 14px;
            margin-right: 20px;
            color: #999999;
            line-height: 86px;
          }
          .right {
            float: right;
            line-height: 86px;
            margin-right: 50px;
            color: #2ba1f4;
          }
        }
      }
    }
    .el-date-editor .el-range-separator {
      width: auto;
    }
  }
  // .el-header {
  //   background: #ffffff;
  //   line-height: 50px;
  //   padding-left: 52px;
  //   padding-right: 20px;
  //   div {
  //     float: right;
  //     font-size: 14px;
  //     color: #666666;
  //     cursor: pointer;
  //   }
  // }
}
</style>
