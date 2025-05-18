<template>
  <div class="addTestTask">
    <div>
      <div style="margin-bottom:8px">
        <span style="margin-right:15px">内容来源</span>
        <el-radio-group @change="labelChange" v-model="importRadio">
          <el-radio label="1" border>题库</el-radio>
          <el-radio label="2" border>教材</el-radio>
        </el-radio-group>
        <el-popover
          placement="bottom-start"
          trigger="hover"
          title="内容来源"
          width="400"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        >
          <div class="batchAdd-ts">
            题库：<span>从个人库或已购题库获取题目</span>
          </div>
          <div class="batchAdd-ts">
            教材题库：<span>从已验证的教材中获取题目</span>
          </div>
          <!-- <div class="batchAdd-ts">
            云课：<span>从公共云课、班级云课获取题目</span>
          </div> -->
          <i
            class="el-icon-question"
            slot="reference"
            style="color:#2BA1F4;cursor:pointer;font-size:20px;margin-left:20px;"
          ></i>
        </el-popover>
      </div>
      <div style="margin-bottom:8px">
        <span style="margin-right:15px">应答时长</span>
        <el-radio-group v-model="answerDur">
          <el-radio :label="180">3分钟</el-radio>
          <el-radio :label="300">5分钟</el-radio>
          <el-radio :label="600">10分钟</el-radio>
        </el-radio-group>
      </div>
      <div>
        <span style="margin-right:15px">已添内容</span>
        <span v-if="contentList.length <= 0">无</span>
        <span v-else>
          <span>已选{{ contentList.length }}题</span>
          <!-- <span
            @click="viewSelectedTest"
            style="cursor:pointer;margin-left:10px;color:#2BA1F4"
            >查看</span
          > -->
          <!-- <el-popover placement="bottom" width="200" v-model="clearVisible">
            <p>确定要清空所有已选题目吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="clearVisible = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="clearSelectedTest"
                >确定</el-button
              >
            </div>
            <span
              slot="reference"
              style="cursor:pointer;margin-left:5px;color:#e6a23c"
              >清空</span
            >
          </el-popover> -->
        </span>
        <span
          v-if="addType == 2"
          style="margin-left:30px;font-size:12px;color:#999"
          >(目前应答仅支持1个客观题。)</span
        >
      </div>
      <!-- 题库获取： -->
      <div v-show="importRadio == 1">
        <div style="margin-top:20px;padding-left:80px;padding-right:50px;">
          <el-form :inline="true" size="small" :model="testForm">
            <el-form-item>
              <el-select
                v-model="testForm.rlType"
                @change="slTypeChange"
                style="width:100px;"
              >
                <el-option label="已购" value="0"></el-option>
                <el-option label="我的" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="testForm.rlType == 0">
              <el-select
                v-model="testForm.comLib"
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
            <el-form-item v-if="testForm.rlType == 1">
              <el-cascader
                v-model="testForm.myLib"
                :options="myTKList"
                @change="testMyTkSearch"
                :props="myTkProps1"
              ></el-cascader>
            </el-form-item>
            <el-form-item v-if="testForm.rlType == 0">
              <el-tree-select
                @input="tipSelectChange"
                :styles="tipTreeStyle1"
                :value="testForm.tips"
                :selectParams="selectParams1"
                :treeParams="treeParams1"
                @searchFun="tipSearch"
                ref="comTreeSelect"
              />
            </el-form-item>
            <el-form-item style="width:200px" v-if="testForm.rlType == 1">
              <el-select
                v-model="testForm.myTip"
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
            <!-- <el-form-item>
              <el-cascader
                v-model="testForm.sblLib"
                :options="testLibOptions"
                :props="testProps"
                @change="loadLibTip"
                ref="cascader"
              ></el-cascader>
            </el-form-item>
            <el-form-item v-if="testForm.sblLib[0] == 0">
              <el-tree-select
                @input="tipSelectChange"
                :styles="tipTreeStyle"
                :value="testForm.comTip"
                :selectParams="selectParams"
                :treeParams="treeParams"
                @searchFun="tipSearch"
                ref="treeSelect"
              />
            </el-form-item>
            <el-form-item style="width:200px" v-if="testForm.sblLib[0] == 1">
              <el-select
                v-model="testForm.myTip"
                filterable
                clearable
                placeholder="请选择知识点"
                size="small"
                @change="testSearch"
              >
                <el-option
                  v-for="item in testForm.myTipArr"
                  :key="item.tipText"
                  :label="item.tipText"
                  :value="item.tipText"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="题型" style="margin-left:15px;">
              <el-select
                v-model="testForm.tSubject"
                placeholder="类型"
                size="small"
                style="width:100px;"
                @change="testSearch"
              >
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option label="单选" :value="2"></el-option>
                <el-option label="判断" :value="1"></el-option>
                <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度系数">
              <el-select
                v-model="testForm.difficultLevel"
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
            <el-form-item style="margin-left:15px;">
              <el-input
                v-model="testForm.keyWord"
                style="width:200px;"
                placeholder="请输入题目内容"
                @keyup.enter.native="testSearch"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="testSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="testForm.testData"
            stripe
            border
            height="480px"
            v-loading="loading.testLoading"
            key="table1"
            @selection-change="changeSelect1"
            :row-key="getRowKeys1"
            ref="testTable"
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
            <el-table-column label="题目内容" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;">
                  <div
                    class="subject-title"
                    v-html="scope.row.briefTitle"
                  ></div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="preview(scope.row, scope.$index)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="题型"
              prop="tSubject"
              align="center"
              width="90px"
              :formatter="formatType"
            ></el-table-column>
            <el-table-column
              label="难度系数"
              prop="difficultyRate"
              align="center"
              width="60px"
            ></el-table-column>
            <el-table-column label="知识点" align="center" width="200px">
              <template slot-scope="scope">
                <span v-html="scope.row.learnPort"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="日期"
              prop="modifiedTime"
              align="center"
              :formatter="formatDate"
              width="150"
            ></el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="testForm.testData.length" class="right-footer-first">
              从{{ (testPage.page - 1) * testPage.pagesize + 1 }}到{{
                (testPage.page - 1) * testPage.pagesize +
                  testForm.testData.length
              }}记录，共{{ testPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="testPage.total"
              :page-size="testPage.pagesize"
              @size-change="handleSizeChange1"
              :current-page.sync="testPage.page"
              background
              @current-change="loadSubjects"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 教材题库导入： -->
      <div v-show="importRadio == 2">
        <div
          v-if="bookList.length > 0"
          style="margin-top:20px;padding-left:80px;padding-right:80px;"
        >
          <el-form :inline="true" size="small" :model="bookForm">
            <el-form-item>
              <el-select
                @change="selectBookChange"
                v-model="bookForm.value"
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
            <el-form-item style="margin-left:15px;" label="题型">
              <el-select
                v-model="bookForm.tSubject"
                size="small"
                style="width:100px;"
                @change="bookTestSearch"
              >
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option label="单选" :value="2"></el-option>
                <el-option label="判断" :value="1"></el-option>
                <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="难度">
              <el-select
                v-model="bookForm.difficultLevel"
                style="width:100px"
                placeholder="难度"
                @change="bookTestSearch"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item style="margin-left:15px;">
              <el-input
                v-model="cloudForm.keyword"
                style="width:200px;"
                placeholder="请输入题目内容"
                @keyup.enter.native="bookTestSearch"
              ></el-input>
            </el-form-item> -->
            <!-- <el-form-item>
              <el-button
                type="primary"
                @click="bookTestSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item> -->
          </el-form>
          <el-table
            :data="bookForm.testData"
            stripe
            border
            height="480px"
            v-loading="loading.bookTestLoading"
            key="table2"
            @selection-change="changeSelect2"
            :row-key="getRowKeys2"
            ref="bookTestTable"
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
            <el-table-column label="题目内容" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;">
                  <div
                    class="subject-title"
                    v-html="scope.row.briefTitle"
                  ></div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="preview(scope.row, scope.$index)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="所在章节" align="center">
              <template slot-scope="scope">{{
                scope.row.catalogName
              }}</template>
            </el-table-column> -->
            <el-table-column
              label="题型"
              prop="tSubject"
              align="center"
              :formatter="formatType"
              width="100"
            ></el-table-column>
            <!-- <el-table-column
              label="难度"
              prop="sbDifficultyLevel"
              align="center"
              width="60px"
              :formatter="formatDiff"
            ></el-table-column> -->
            <el-table-column label="知识点" align="center" width="200px">
              <template slot-scope="scope">
                <span v-html="scope.row.learnPort"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="日期"
              prop="getTime"
              align="center"
              :formatter="formatDate"
              width="150"
            ></el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="bookForm.testData.length" class="right-footer-first">
              从{{ (bookTestPage.page - 1) * bookTestPage.pagesize + 1 }}到{{
                (bookTestPage.page - 1) * bookTestPage.pagesize +
                  bookForm.testData.length
              }}记录，共{{ bookTestPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              :page-sizes="[5, 10, 20]"
              :total="bookTestPage.total"
              :page-size="bookTestPage.pagesize"
              @size-change="handleSizeChange2"
              :current-page.sync="bookTestPage.page"
              background
              @current-change="loadBookTestList"
            ></el-pagination>
          </div>
        </div>
        <div
          v-else
          style="margin-top:20px;padding-left:0px;padding-right:80px;text-align: center;display: block"
        >
          <img src="@/assets/images/empty1.png" alt="" />
          <div style="font-size:14px;color:#666666;margin-bottom:15px;">
            暂无可用的已验证教材
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="loadVerifiedList"
              round
              style="width:80px;margin-bottom:10px"
              >刷新</el-button
            >
          </div>
          <el-popover
            placement="bottom-start"
            trigger="hover"
            title="验证教材"
            width="400"
            content="刮开教材封底防伪码涂层，使用‘九斗’APP扫描防伪二维码或输入防伪码数字，通过验证后，点击当前页面刷新按钮即可"
          >
            <span
              slot="reference"
              style="color:#2BA1F4;cursor:pointer;font-size:14px;"
              >如何验证教材</span
            >
          </el-popover>
        </div>
      </div>
      <!-- 其他云课导入： -->
      <div v-show="importRadio == 3">
        <div style="margin-top:20px;padding-left:80px;padding-right:80px;">
          <el-form :inline="true" size="small" :model="cloudForm">
            <el-form-item>
              <el-cascader
                v-model="cloudForm.cloudTest"
                :options="cloudTestOptions"
                :props="cloudProps"
                @change="cloudTestCascaderChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item style="margin-left:15px;" label="题型">
              <el-select
                v-model="cloudForm.tSubject"
                size="small"
                style="width:100px;"
                @change="cloudTestSearch"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="判断" :value="1"></el-option>
                <el-option label="单选" :value="2"></el-option>
                <el-option label="多选" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度系数">
              <el-select
                v-model="cloudForm.difficultLevel"
                style="width:100px"
                placeholder="难度系数"
                @change="cloudTestSearch"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:15px;">
              <el-input
                v-model="cloudForm.keyword"
                style="width:200px;"
                placeholder="请输入题目内容"
                @keyup.enter.native="cloudTestSearch"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="cloudTestSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="cloudForm.testData"
            stripe
            border
            v-loading="loading.cloudTestLoading"
            key="table3"
            @selection-change="changeSelect3"
            :row-key="getRowKeys3"
            ref="cloudTestTable"
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
            <el-table-column label="题目内容" align="center">
              <template slot-scope="scope">
                <div style="display:flex;justify-content:space-between;">
                  <div
                    class="subject-title"
                    v-html="scope.row.briefTitle"
                  ></div>
                  <el-button
                    size="mini"
                    type="text"
                    @click="preview(scope.row, scope.$index)"
                    >预览</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="所在章节" align="center">
              <template slot-scope="scope">{{
                scope.row.catalogParentsPath
              }}</template>
            </el-table-column>
            <el-table-column
              label="题型"
              prop="tSubject"
              align="center"
              :formatter="formatType"
              width="100"
            ></el-table-column>
            <!-- <el-table-column
              label="难度"
              prop="sbDifficultyLevel"
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
            <el-table-column label="知识点" align="center" width="200px">
              <template slot-scope="scope">
                <span v-html="scope.row.learnPort"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="日期"
              prop="sbModifiedTime"
              align="center"
              :formatter="formatDate"
              width="150"
            ></el-table-column>
          </el-table>
          <div class="tabelFooter">
            <div v-if="cloudForm.testData.length" class="right-footer-first">
              从{{ (cloudTestPage.page - 1) * cloudTestPage.pagesize + 1 }}到{{
                (cloudTestPage.page - 1) * cloudTestPage.pagesize +
                  cloudForm.testData.length
              }}记录，共{{ cloudTestPage.total }}条
            </div>
            <div v-else class="right-footer-first" ref="footerCount">
              从0到0条记录，共0条
            </div>
            <el-pagination
              layout="prev, pager, next, jumper"
              :page-sizes="[10, 30, 50]"
              :total="cloudTestPage.total"
              :page-size="cloudTestPage.pagesize"
              @size-change="handleSizeChange3"
              :current-page.sync="cloudTestPage.page"
              background
              @current-change="loadCloudTestList"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      :title="`查看已选题目-共${contentList.length}题`"
      :visible.sync="drawer"
      direction="ltr"
      size="80%"
      :modal-append-to-body="false"
      :before-close="handleCloseDrawer"
      :modal="false"
    >
      <ul class="timuList">
        <li
          v-for="(item, index) in contentList"
          :key="item.id"
          :id="item.id"
          class="liiiii"
          @mouseenter="handleTimuMouseenter($event)"
          @mouseleave="handleTimuMouseleave($event)"
        >
          <importPreview :data="item" :index="index + 1"></importPreview>
          <div class="timuBtn">
            <el-button
              size="mini"
              @click="handleDel(index, item)"
              type="danger"
              round
              >移除</el-button
            >
            <el-button
              size="mini"
              @click="handleBottomMove(index)"
              round
              :disabled="index == contentList.length - 1 ? true : false"
              >下移</el-button
            >
            <el-button
              size="mini"
              @click="handleTopMove(index)"
              round
              :disabled="index == 0 ? true : false"
              >上移</el-button
            >
            <el-button
              type="text"
              @click="handleReport(item)"
              style="color:red;position:absolute;right:20px;bottom:0"
              >我要纠错</el-button
            >
          </div>
        </li>
      </ul>
    </el-drawer>
    <div class="bottomBtnBox">
      <el-button size="small" @click="doSure" :loading="loading.doSureLoading"
        >确定</el-button
      >
      <!-- <el-button size="small" @click="doReturn">取消</el-button> -->
      <span class="cancelBtn" @click="doReturn">取消</span>
    </div>
    <el-dialog
      :visible.sync="shwoPreviewDialog"
      :modal="false"
      class="pub_dialog"
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
      <div>
        <!-- <el-popover
          placement="bottom"
          trigger="click"
          title="错误类型"
          v-model="reportPover1"
          width="400"
        >
          <el-checkbox-group
            v-model="reportType1"
            style="margin-top:20px;color:#333;font-size:13px;"
          >
            <el-checkbox style="margin-bottom:10px" label="0"
              >题干错误</el-checkbox
            >
            <el-checkbox style="margin-bottom:10px" label="3"
              >题型错误</el-checkbox
            >
            <el-checkbox style="margin-bottom:10px" label="1"
              >答案错误</el-checkbox
            >
            <el-checkbox style="margin-bottom:10px" label="2"
              >解析错误</el-checkbox
            >
            <el-checkbox style="margin-bottom:10px" label="4"
              >知识点错误</el-checkbox
            >
            <el-checkbox style="margin-bottom:10px" label="5"
              >其他问题</el-checkbox
            >
          </el-checkbox-group>
          <textarea
            placeholder="请输入错误描述，不大于200字"
            v-model="reportDes1"
            maxlength="200"
            show-word-limit
            style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
          ></textarea>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="reportPover1 = false"
              >取消</el-button
            >
            <el-button type="primary" size="mini" @click="doSureToReport1"
              >确定</el-button
            >
          </div>
          <el-button slot="reference" type="text" style="color:red;float:right"
            >我要纠错</el-button
          >
        </el-popover> -->
      </div>
      <importPreview
        :data="previewSubject"
        style="max-height:400px;overflow-y: auto;margin-left:20px;"
        v-loading="loading.viewLoading"
      ></importPreview>
      <span slot="footer">
        <el-button
          size="small"
          type="primary"
          @click="viewPreTimu"
          :disabled="isShowPreBtn"
          >上一题</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="viewNextTimu"
          :disabled="isShowNextBtn"
          >下一题</el-button
        >
        <el-checkbox
          size="small"
          v-model="rowChecked"
          :label="rowChecked ? '已选择' : '未选择'"
          border
          style="margin-left:30px"
          :disabled="loading.viewLoading"
          @change="rowCheckedChange"
        ></el-checkbox>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="shwoReportDialog"
      :modal="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="400px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>题目纠错</div>
        </div>
      </template>
      <div>
        <el-checkbox-group
          v-model="reportType2"
          style="margin-top:20px;color:#333;font-size:13px;"
        >
          <el-checkbox style="margin-bottom:10px" label="0"
            >题干错误</el-checkbox
          >
          <el-checkbox style="margin-bottom:10px" label="3"
            >题型错误</el-checkbox
          >
          <el-checkbox style="margin-bottom:10px" label="1"
            >答案错误</el-checkbox
          >
          <el-checkbox style="margin-bottom:10px" label="2"
            >解析错误</el-checkbox
          >
          <el-checkbox style="margin-bottom:10px" label="4"
            >知识点错误</el-checkbox
          >
          <el-checkbox style="margin-bottom:10px" label="5"
            >其他问题</el-checkbox
          >
        </el-checkbox-group>
        <textarea
          placeholder="请输入错误描述，不大于200字"
          v-model="reportDes2"
          maxlength="200"
          show-word-limit
          style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
        ></textarea>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doSureToReport2"
          >确定</el-button
        >
        <el-button size="small" type="primary" @click="shwoReportDialog = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.addTestTask {
  padding-left: 40px;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .subject-title {
    text-align: left;
    padding-right: 15px;
    max-height: 23px;
    overflow: hidden;
  }
  .bottomBtnBox {
    position: fixed;
    bottom: 0;
    right: 10%;
    left: 0;
    background: rgba(43, 161, 244, 1);
    box-shadow: 0px 2px 16px 0px rgba(13, 67, 118, 0.2);
    height: 60px;
    line-height: 75px;
    z-index: 11;
    padding-right: 50px;
    .el-button {
      width: 100px;
      float: right;
      height: 40px;
      margin-right: 15px;
      margin-top: 15px;
      border-radius: 30px;
    }
    .cancelBtn {
      width: 100px;
      float: right;
      height: 40px;
      line-height: 40px;
      margin-right: 15px;
      margin-top: 15px;
      border-radius: 30px;
      border: 1px solid #fff;
      color: #fff;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
    }
  }
  .pub_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
      margin: 0 auto !important;
      height: 60%;
      overflow: hidden;
      .el-dialog__header {
        display: block;
      }
      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
      .el-dialog__footer {
        position: absolute;
        left: 0;
        bottom: 20px;
        right: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }
  .timuList {
    list-style: none;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0;
    li {
      margin-top: 10px;
      position: relative;
      padding: 20px 10px;
      cursor: pointer;
      margin-bottom: 0;
      .timuBtn {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: 20px;
        display: none;
        .el-button {
          float: right;
          margin-left: 5px;
          // border-color: #2BA1F4;
        }
      }
    }
    .mouseLi {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }
  }
}
.batchAdd-ts {
  font-size: 14px;
  color: #333;
  line-height: 28px;
  span {
    color: #999;
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import preview from "../tiku/previewSubject";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import { format } from "@/utils/datetime";
import importPreview from "@/components/importPreview";
import AMap from "AMap";

export default {
  name: "selectAnswerTimu",
  components: {
    preview,
    importPreview,
    ElTreeSelect
  },
  props: {
    answerDuration: "", //应答时长
    fatherMethod: {
      type: Function,
      default: null
    },
    exerciseContent: String,
    catalogCourseId: "",
    catalogParentId: "",
    addType: "",
    wareId: "",
    exerciseName: "",
    exerciseId: ""
  },
  data() {
    return {
      // --------------------
      currentComTk1: {}, //选中的当前库
      comTKList: [], // 公共题库列表
      myTKList: [], // 个人题库列表
      myLibTip1: [], // 我的库知识点
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
      myTkProps1: {
        checkStrictly: true,
        value: "id",
        label: "sblName",
        emitPath: false,
        expandTrigger: "hover"
      },
      // ----------------------------
      cls: {},
      latitude: 0,
      longitude: 0, // 应答坐标
      answerDur: this.answerDuration,
      answerRight: "", // 应答正确答案
      importRadio: "1",
      contentList: [],
      testTag: [], //题库选择生成的数组
      bookTestTag: [], //教材题目选择生成的数组
      cloudTestTag: [], //云课题目选择生成的数组
      showProgress: false,
      total: 0,
      done: 0,
      loading: {
        testLoading: false,
        cloudTestLoading: false,
        bookTestLoading: false,
        viewLoading: false,
        doSureLoading: false
      },
      // 将要预览的题目
      previewSubject: {},
      // 将要预览的题目的下标
      previewIndex: 0,
      shwoPreviewDialog: false,
      types: common.types,
      allTypes: common.allTypes,
      // 难点
      diffs: common.diffs,
      allDiffs: common.allRateLevel,
      tipTreeStyle: {
        width: "130px"
      },
      selectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      treeParams: {
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
      // 题库题目列表参数
      testForm: {
        rlType: "0",
        comLib: "",
        myLib: "",
        myTip: "", // 个人题库知识点
        comTip: "", // 公共题库知识点
        tips: "",
        keyWord: "",
        tSubject: 2,
        difficultLevel: "",
        resType: "",
        sblLib: [],
        testData: [],
        myTipArr: [],
        tipsText: ""
      },
      testLibOptions: [
        {
          id: "0",
          sblName: "公共库",
          children: []
        },
        {
          id: "1",
          sblName: "个人库",
          children: []
        }
      ],
      testProps: {
        expandTrigger: "hover",
        value: "id",
        label: "sblName"
      },
      testPage: {
        total: 10,
        page: 1,
        pagesize: 10
      },
      bookForm: {
        tSubject: 2,
        difficultLevel: "",
        testData: [],
        keyword: "",
        value: ""
      },
      bookTestPage: {
        total: 10,
        page: 1,
        pagesize: 10
      },
      bookList: [], // 教材列表
      cloudForm: {
        tSubject: "",
        difficultLevel: "",
        cloudTest: [],
        testData: [],
        keyword: ""
      },
      cloudTestPage: {
        total: 10,
        page: 1,
        pagesize: 10
      },
      cloudTestOptions: [
        {
          ccourseId: "0",
          ccourseName: "公共云课",
          children: []
        },
        {
          ccourseId: "1",
          ccourseName: "个人云课",
          children: []
        }
      ],
      cloudProps: {
        expandTrigger: "hover",
        value: "ccourseId",
        label: "ccourseName"
      },
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      drawer: false,
      clearVisible: false,
      rowChecked: false,
      isShowPreBtn: false,
      isShowNextBtn: false,
      reportPover1: false,
      reportType1: [],
      reportDes1: "",
      shwoReportDialog: false,
      reportType2: [],
      reportDes2: "",
      currentReportRow: {} // 点击查看按钮抽屉中预览题目的纠错题目row
    };
  },
  computed: {
    answerTime() {
      return this.answerDuration;
    }
  },
  mounted() {
    this.cls = JSON.parse(sessionStorage.getItem("currentClass"));
    // this.getLocation();
    this.initComTkLib();
    this.initMyTestLib();
    this.loadSubjects();
  },
  methods: {
    checkLib(id) {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/hasUnUseBank",
          data: { sblId: id }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            if (res.data.unUseBankFlag) {
              this.$alert(
                "该题库中有过期的收费题目，不可使用，已为您隐藏",
                "",
                {
                  confirmButtonText: "确定",
                  center: true,
                  callback: action => {}
                }
              );
            }
          }
        });
    },
    //点击公共库查询知识点
    testComTkSearch() {
      if (this.testForm.comLib) {
        // this.checkLib(this.testForm.comLib);
        this.currentComTk1 = this.comTKList.filter((item, i) => {
          return item.id == this.testForm.comLib;
        });
        this.loadTips1();
      } else {
        this.treeParams1.data = [];
        this.$refs.comTreeSelect.treeDataUpdateFun(this.treeParams1.data);
      }
      this.testPage.page = 1;
      this.loadSubjects();
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
    slTypeChange() {
      this.testPage.page = 1;
      this.loadSubjects();
    },
    // 题目列表
    async loadSubjects() {
      this.loading.testLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {};
      if (this.testForm.tSubject) {
        data.tSubject = parseInt(this.testForm.tSubject);
      }

      if (this.testForm.difficultLevel) {
        data.difficultRateLevel = this.testForm.difficultLevel;
      }
      data.keyWord = this.testForm.keyWord;
      if (this.testForm.rlType == 1) {
        url = "/subject/personalSubjectBankLibrary/itemsWithCount";
        data.libId = this.testForm.myLib;
        data.tip = this.testForm.myTip;
        data.currentUid = this.$store.state.user.userId;
        data.hideUnUseFlag = true;
      } else {
        data.libId = this.testForm.comLib;
        data.tip = this.testForm.comTip;
        data.currentUid = this.$store.state.user.userId;
        data.hideUnUseFlag = true;
      }

      data.page = this.testPage.page;
      data.pagesize = this.testPage.pagesize;
      data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.testLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testForm.testData = res.data.data;
              this.testPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    //点击我的库查询知识点
    testMyTkSearch() {
      // this.checkLib(this.testForm.myLib);
      this.loadMyLibTip1();
      this.testPage.page = 1;
      this.testForm.myTip = "";
      this.loadSubjects();
    },
    // 加载我的库知识点
    loadMyLibTip1() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.testForm.myLib }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.myLibTip1 = ret.data;
          }
        });
    },
    // 公共库下知识点搜索
    tipSearch(value) {
      this.$refs.comTreeSelect.filterFun(value);
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.testForm.tips = ids;
      if (labels) {
        this.testForm.comTip = labels.join(",");
      } else {
        this.testForm.comTip = "";
      }
      this.testPage.page = 1;
      this.loadSubjects();
    },
    // 选择内容来源
    labelChange(val) {
      if (val == 2) {
        // 教材题库获取
        this.loadVerifiedList();
      }
    },
    //获取地理位置
    getLocation() {
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        function onComplete(data) {
          // data是具体的定位信息
          this.latitude = data.position.lat;
          this.longitude = data.position.lng;
        }
        function onError(data) {
          // 定位出错
        }
      });
    },
    // 选中教材
    selectBookChange(val) {
      this.bookForm.value = val;
      this.loadBookTestList();
    },
    // 查看已选题目
    viewSelectedTest() {
      this.drawer = true;
    },
    handleCloseDrawer() {
      this.drawer = false;
    },
    // 清空已选题目
    clearSelectedTest() {
      this.clearVisible = false;
      this.$refs.testTable.clearSelection();
      this.$refs.cloudTestTable.clearSelection();
      this.$refs.bookTestTable.clearSelection();
    },
    // 题库获取下面选择库加载当前库知识点
    loadLibTip(arr) {
      sessionStorage.setItem("reportTestCascader", JSON.stringify(arr));
      if (arr[0] == 0) {
        axios
          .request({
            method: "post",
            url: "/subject/chapterTip/treeList",
            data: {
              courseId: this.$refs["cascader"].getCheckedNodes()[0].data
                .sblCourseId
            }
          })
          .then(
            function(data) {
              let res = data.data;
              if (res.code == 200) {
                this.treeParams.data = res.data;
                if (res.data.length >= 0) {
                  this.$refs.treeSelect.treeDataUpdateFun(res.data);
                }
              }
            }.bind(this)
          );
      } else {
        axios
          .request({
            method: "post",
            url: "/subject/subjectBankLibrary/tips",
            data: { libId: arr[1] }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.testForm.myTip = "";
              this.testForm.myTipArr = ret.data;
              this.testSearch();
            }
          });
      }
      this.testSearch();
    },
    //加载题目列表
    loadTestList() {
      this.loading.testLoading = true;
      let url = "/subject/subjectBankLibrary/itemsWithCount";
      let data = {
        libId: this.testForm.sblLib[1] ? this.testForm.sblLib[1] : "",
        page: this.testPage.page,
        pagesize: this.testPage.pagesize,
        keyWord: this.testForm.keyWord,
        // difficultLevel: this.testForm.difficultLevel,
        difficultRateLevel: this.testForm.difficultLevel,
        tSubject: this.testForm.tSubject,
        isShowStop: 1
        // needObjective: 2
      };
      if (this.testForm.sblLib[0] == 1) {
        // 个人库
        url = "/subject/personalSubjectBankLibrary/itemsWithCount";
        data.tip = this.testForm.myTip;
      } else {
        // 公共库库
        url = "/subject/subjectBankLibrary/itemsWithCount";
        data.tip = this.testForm.tipsText;
      }
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.testLoading = false;
            let ret = data.data;
            if (ret.code == 200) {
              ret.data.data.forEach(element => {
                element.importType = 1;
              });
              this.testForm.testData = ret.data.data;
              this.testPage.total = ret.data.total;
              // this.previewSubject = this.testForm.testData[this.previewIndex]
            }
          }.bind(this)
        );
    },
    handleSizeChange1(val) {
      this.testPage.pagesize = val;
      this.loadTestList();
    },
    testSearch() {
      this.testPage.page = 1;
      this.loadTestList();
    },
    // 题库列表选中事件
    changeSelect1(selection) {
      if (this.addType == 2) {
        if (selection.length > 1) {
          // console.log(this.$refs.testTable);
          this.$refs.testTable.clearSelection();
          this.$refs.testTable.toggleRowSelection(selection.pop());
        }
        // this.contentList = this.$refs.testTable.selection
        if (this.$refs.testTable.selection.length > 0) {
          // this.$refs.bookTestTable.clearSelection();
          // this.$refs.cloudTestTable.clearSelection();
          this.contentList = this.$refs.testTable.selection;
        }
      } else {
        this.testTag = [];
        this.contentList = [];
        this.testTag = selection;
        this.contentList = this.contentList.concat(
          this.testTag,
          this.cloudTestTag,
          this.bookTestTag
        );
      }
    },
    getRowKeys1(row) {
      return row.slsId;
    },
    //鼠标进入每一道题显示操作按钮
    handleTimuMouseenter(e) {
      e.currentTarget.className = "mouseLi";
      e.target.lastChild.style.display = "block";
    },
    handleTimuMouseleave(e) {
      e.currentTarget.className = "";
      e.target.lastChild.style.display = "none";
    },
    //上移
    handleTopMove(index) {
      this.contentList[index] = this.contentList.splice(
        index - 1,
        1,
        this.contentList[index]
      )[0];
    },
    //下移
    handleBottomMove(index) {
      this.contentList[index] = this.contentList.splice(
        index + 1,
        1,
        this.contentList[index]
      )[0];
    },
    //移除
    handleDel(index, item) {
      this.$confirm("<div>确定删除吗？</div>", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        modal: false,
        type: "warning"
      })
        .then(() => {
          this.contentList.splice(index, 1);
          if (item.importType == 1) {
            this.$refs.testTable.toggleRowSelection(item);
          }
          if (item.importType == 3) {
            this.$refs.cloudTestTable.toggleRowSelection(item);
          }
          if (this.contentList == 0) {
            this.drawer = false;
          }
        })
        .catch(() => {});
    },
    loadBookTestList() {
      this.loading.bookTestLoading = true;
      axios
        .request({
          method: "post",
          // url: "/tiku/v4/catSb/pageList",
          url: "/v1/bookSbLib/listWithCountBook",
          data: {
            textbookId: this.bookForm.value,
            // type: 0, // 0:教材题 1:自测题
            tSubject: this.bookForm.tSubject,
            // difficultLevel: this.bookForm.difficultLevel,
            keyword: this.bookForm.keyword,
            page: this.bookTestPage.page,
            pagesize: this.bookTestPage.pagesize
          }
        })
        .then(data => {
          this.loading.bookTestLoading = false;
          let ret = data.data;
          if (ret.code === 200) {
            ret.data.data.forEach(element => {
              element.importType = 2;
            });
            this.bookForm.testData = ret.data.data;
            this.bookTestPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    bookTestCascaderChange(arr) {
      sessionStorage.setItem("reportBookTestCascader", JSON.stringify(arr));
      this.bookTestSearch();
    },
    bookTestSearch() {
      this.cloudTestPage.page = 1;
      this.loadBookTestList();
    },
    getRowKeys2(row) {
      return row.catSbId;
    },
    handleSizeChange2(val) {
      this.bookTestPage.pagesize = val;
      this.loadBookTestList();
    },
    changeSelect2(selection) {
      if (this.addType == 2) {
        if (selection.length > 1) {
          this.$refs.bookTestTable.clearSelection();
          this.$refs.bookTestTable.toggleRowSelection(selection.pop());
        }
        // this.contentList = this.$refs.bookTestTable.selection
        if (this.$refs.bookTestTable.selection.length > 0) {
          this.$refs.testTable.clearSelection();
          this.$refs.cloudTestTable.clearSelection();
          this.contentList = this.$refs.bookTestTable.selection;
        }
      } else {
        this.bookTestTag = [];
        this.contentList = [];
        this.bookTestTag = selection;
        this.contentList = this.contentList.concat(
          this.testTag,
          this.cloudTestTag,
          this.bookTestTag
        );
      }
    },
    //加载云课内容列表
    loadCloudTestList() {
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/task/listByCCourse",
          data: {
            cCourseId: this.cloudForm.cloudTest[1],
            // difficultLevel: this.cloudForm.difficultLevel,
            difficultRateLevel: this.cloudForm.difficultLevel,
            tSubject: this.cloudForm.tSubject,
            keyword: this.cloudForm.keyword,
            page: this.cloudTestPage.page,
            pageSize: this.cloudTestPage.pagesize
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            ret.data.data.forEach(element => {
              element.briefTitle = element.sbBriefTitle;
              element.title = element.sbTitle;
              element.analyse = element.sbAnalyse;
              element.uniqueId = element.sbUniqueId;
              element.importType = 3;
            });
            this.cloudForm.testData = ret.data.data;
            this.cloudTestPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    cloudTestCascaderChange(arr) {
      sessionStorage.setItem("reportCloudTestCascader", JSON.stringify(arr));
      this.cloudTestSearch();
    },
    cloudTestSearch() {
      this.cloudTestPage.page = 1;
      this.loadCloudTestList();
    },
    getRowKeys3(row) {
      return row.sbId;
    },
    handleSizeChange3(val) {
      this.cloudTestPage.pagesize = val;
      this.loadCloudTestList();
    },
    changeSelect3(selection) {
      if (this.addType == 2) {
        if (selection.length > 1) {
          this.$refs.cloudTestTable.clearSelection();
          this.$refs.cloudTestTable.toggleRowSelection(selection.pop());
        }
        // this.contentList = this.$refs.cloudTestTable.selection
        if (this.$refs.cloudTestTable.selection.length > 0) {
          this.$refs.testTable.clearSelection();
          this.$refs.bookTestTable.clearSelection();
          this.contentList = this.$refs.cloudTestTable.selection;
        }
      } else {
        this.cloudTestTag = [];
        this.contentList = [];
        this.cloudTestTag = selection;
        this.contentList = this.contentList.concat(
          this.testTag,
          this.cloudTestTag,
          this.bookTestTag
        );
      }
    },
    doReturn() {
      this.$emit("toCloseDrawer");
      this.$store.commit("setNewAddExerciseId", "");
    },
    // 数组去重
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1));
    },
    doSure() {
      if (this.contentList.length <= 0) {
        this.$message({
          message: "请选择题目",
          type: "warning"
        });
        return;
      }
      if (!this.answerDuration) {
        this.$message({
          message: "请选择应答时长",
          type: "warning"
        });
        return;
      }
      let ids = [];
      this.contentList.forEach(item => {
        ids.push(item.id);
      });

      this.loading.doSureLoading = true;
      if (this.addType == 1) {
        // 添加应答题目，确定发布应答
        axios
          .request({
            method: "post",
            url: "/clazz/Api/Answer/createAnswer",
            data: {
              classId: this.cls.classId,
              answerFrom: 1, // 题库选题
              answerBankId: ids.join(","),
              answerDuration: String(this.answerDur)
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
              var cEvent = new CountEvent("publish_normal_answer");
              window.JAnalyticsInterface.onEvent(cEvent);
              this.$message({
                message: "发起应答成功",
                type: "success"
              });
              this.$emit("answerSuccess", ret.data);
            }
          });
      }
    },
    // 预览
    preview(subject, index) {
      this.previewSubject = subject;
      this.previewIndex = index;
      this.isShowPreBtn = false;
      this.isShowNextBtn = false;
      this.reportType1 = [];
      this.reportDes1 = "";
      if (this.contentList.length && this.contentList.indexOf(subject) !== -1) {
        this.rowChecked = true;
      } else {
        this.rowChecked = false;
      }
      this.shwoPreviewDialog = true;
    },
    // 查看上一题
    viewPreTimu() {
      this.loading.viewLoading = true;
      this.isShowPreBtn = false;
      this.isShowNextBtn = false;
      this.reportType1 = [];
      this.reportDes1 = "";
      if (this.importRadio == 1) {
        if (this.previewIndex != 0) {
          this.previewIndex = this.previewIndex - 1;
        } else {
          if (this.testPage.page == 1) {
            this.isShowPreBtn = true;
            this.loading.viewLoading = false;
            return;
          } else {
            --this.testPage.page;
            this.previewIndex = this.testPage.pagesize - 1;
            this.loadTestList();
          }
        }
        setTimeout(() => {
          this.previewSubject = this.testForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
      if (this.importRadio == 2) {
        if (this.previewIndex != 0) {
          this.previewIndex = this.previewIndex - 1;
        } else {
          if (this.bookTestPage.page == 1) {
            this.isShowPreBtn = true;
            this.loading.viewLoading = false;
            return;
          } else {
            --this.bookTestPage.page;
            this.previewIndex = this.bookTestPage.pagesize - 1;
            this.loadBookTestList();
          }
        }
        setTimeout(() => {
          this.previewSubject = this.bookForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
      if (this.importRadio == 3) {
        if (this.previewIndex != 0) {
          this.previewIndex = this.previewIndex - 1;
        } else {
          if (this.cloudTestPage.page == 1) {
            this.isShowPreBtn = true;
            this.loading.viewLoading = false;
            return;
          } else {
            --this.cloudTestPage.page;
            this.previewIndex = this.cloudTestPage.pagesize - 1;
            this.loadCloudTestList();
          }
        }
        setTimeout(() => {
          this.previewSubject = this.cloudForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
    },
    // 查看下一题
    viewNextTimu() {
      this.loading.viewLoading = true;
      this.isShowPreBtn = false;
      this.isShowNextBtn = false;
      this.reportType1 = [];
      this.reportDes1 = "";
      if (this.importRadio == 1) {
        if (
          this.previewIndex +
            1 +
            (this.testPage.page - 1) * this.testPage.pagesize !=
          this.testPage.total
        ) {
          if (this.previewIndex + 1 == this.testPage.pagesize) {
            ++this.testPage.page;
            this.previewIndex = 0;
            this.loadTestList();
          } else {
            this.previewIndex = this.previewIndex + 1;
          }
        } else {
          this.isShowNextBtn = true;
          this.loading.viewLoading = false;
          return;
        }
        setTimeout(() => {
          this.previewSubject = this.testForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
      if (this.importRadio == 2) {
        if (
          this.previewIndex +
            1 +
            (this.bookTestPage.page - 1) * this.bookTestPage.pagesize !=
          this.bookTestPage.total
        ) {
          if (this.previewIndex + 1 == this.bookTestPage.pagesize) {
            ++this.bookTestPage.page;
            this.previewIndex = 0;
            this.loadBookTestList();
          } else {
            this.previewIndex = this.previewIndex + 1;
          }
        } else {
          this.isShowNextBtn = true;
          this.loading.viewLoading = false;
          return;
        }
        setTimeout(() => {
          this.previewSubject = this.bookForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
      if (this.importRadio == 3) {
        if (
          this.previewIndex +
            1 +
            (this.cloudTestPage.page - 1) * this.cloudTestPage.pagesize !=
          this.cloudTestPage.total
        ) {
          if (this.previewIndex + 1 == this.cloudTestPage.pagesize) {
            ++this.cloudTestPage.page;
            this.previewIndex = 0;
            this.loadCloudTestList();
          } else {
            this.previewIndex = this.previewIndex + 1;
          }
        } else {
          this.isShowNextBtn = true;
          this.loading.viewLoading = false;
          return;
        }
        setTimeout(() => {
          this.previewSubject = this.cloudForm.testData[this.previewIndex];
          this.loading.viewLoading = false;
          this.isRowChecked(this.previewSubject);
        }, 1000);
      }
    },
    //预览弹框里面勾选事件
    rowCheckedChange() {
      if (this.importRadio == 1) {
        this.$refs.testTable.toggleRowSelection(this.previewSubject);
      }
      if (this.importRadio == 2) {
        this.$refs.bookTestTable.toggleRowSelection(this.previewSubject);
      }
      if (this.importRadio == 3) {
        this.$refs.cloudTestTable.toggleRowSelection(this.previewSubject);
      }
    },
    isRowChecked(row) {
      if (this.contentList.length && this.contentList.indexOf(row) !== -1) {
        this.rowChecked = true;
      } else {
        this.rowChecked = false;
      }
    },
    doSureToReport1() {
      if (this.reportType1.length == 0) {
        this.$message({
          message: "请选择错误类型",
          type: "warning"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/feedbackTKExercise",
          data: {
            type: 12,
            content: `${this.reportDes1}(${
              this.previewSubject.id
                ? this.previewSubject.id
                : this.previewSubject.sbId
            })`,
            sbId: this.previewSubject.id
              ? this.previewSubject.id
              : this.previewSubject.sbId,
            subTypes: this.reportType1.join(",")
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.reportPover1 = false;
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
    },
    handleReport(row) {
      this.reportType2 = [];
      this.reportDes2 = "";
      this.currentReportRow = row;
      this.shwoReportDialog = true;
    },
    doSureToReport2() {
      if (this.reportType2.length == 0) {
        this.$message({
          message: "请选择错误类型",
          type: "warning"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/feedbackTKExercise",
          data: {
            type: 12,
            content: `${this.reportDes2}(${
              this.currentReportRow.id
                ? this.currentReportRow.id
                : this.currentReportRow.sbId
            })`,
            sbId: this.currentReportRow.id
              ? this.currentReportRow.id
              : this.currentReportRow.sbId,
            subTypes: this.reportType2.join(",")
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.shwoReportDialog = false;
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
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 难点
    formatDiff(row) {
      if (row.sbDifficultyLevel) {
        return common.diffFormat(row.sbDifficultyLevel);
      }
      if (row.difficultyLevel) {
        return common.diffFormat(row.difficultyLevel);
      }
    },
    // 时间
    formatDate(row) {
      if (row.sbModifiedTime) {
        return format(row.sbModifiedTime);
      }
      if (row.getTime) {
        return format(row.getTime);
      }
      if (row.modifiedTime) {
        return format(row.modifiedTime);
      }
    },
    //table资源类型
    formatResType(row) {
      if (row.resType) {
        return common.resTypeFormat(row.resType);
      }
      if (row.catalogSubType) {
        return common.resTypeFormat(row.catalogSubType);
      }
    },
    //table资源大小
    formatResSize(row) {
      if (row.resSize) {
        if (row.resSize < 1024 * 1024) {
          return (row.resSize / 1024).toFixed(1) + "KB";
        } else {
          return (row.resSize / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    //根据文件类型 转换成 资源类型
    toResType(fileType) {
      let type = 0;
      if (fileType.indexOf("video") === 0) {
        type = 2;
      } else if (fileType.indexOf("audio") === 0) {
        type = 1;
      } else if (fileType.indexOf("application/pdf") === 0) {
        type = 9;
      }
      return type;
    },
    //加载公共题库列表
    initComTkLib() {
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/queryMyBuyList",
          data: {
            hideUnUseFlag: true
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.comTKList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载个人题库列表
    initMyTestLib() {
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
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
    //加载已验证的教材列表
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
            this.bookForm.value = this.bookList[0].textbookId;
            this.loadBookTestList();
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
