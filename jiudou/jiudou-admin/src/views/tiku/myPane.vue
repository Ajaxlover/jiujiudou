<template>
  <el-container class="my-pane">
    <div class="left-container">
      <div
        @click="showMyLib = !showMyLib"
        class="left-header"
        style="cursor: pointer;"
      >
        <div>
          <i
            :class="showMyLib ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
          ></i>
          <span style="user-select: none;">自建题库</span>
        </div>
        <img src="@/assets/images/plus.png" @click.stop="addBank" />
      </div>
      <el-collapse-transition>
        <div>
          <div
            style="height:220px;overflow-y:auto;overflow-x:hidden"
            v-show="showMyLib"
          >
            <el-tree
              v-loading="loading.tkList"
              ref="tree"
              :data="banks"
              :props="treeMap"
              node-key="id"
              highlight-current
              :expand-on-click-node="false"
              :default-expanded-keys="expandKeys"
              :auto-expand-parent="true"
              @node-click="selectBank"
              icon-class="el-icon-arrow-right"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="custom-tree-name" :title="node.label">{{
                  node.label
                }}</span>
                <span
                  ><edit-popover
                    :noShare="true"
                    v-on:onSelected="popoverClick"
                    :bank="data"
                    :hasShare="true"
                  ></edit-popover
                ></span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-collapse-transition>
      <!-- <div style="height:200px;overflow-y:auto;overflow-x:hidden">
        <el-tree
          v-loading="loading.tkList"
          ref="tree"
          :data="banks"
          :props="treeMap"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :default-expanded-keys="expandKeys"
          :auto-expand-parent="true"
          @node-click="selectBank"
          icon-class="el-icon-arrow-right"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-name" :title="node.label">{{
              node.label
            }}</span>
            <span
              ><edit-popover
                :noShare="true"
                v-on:onSelected="popoverClick"
                :bank="data"
                :hasShare="true"
              ></edit-popover
            ></span>
          </span>
        </el-tree>
      </div> -->
      <div class="left-header" style="margin-top:3px">
        <span style="user-select: none;">所购题库</span>
        <!-- <img src="@/assets/images/plus.png" @click="addBank" /> -->
      </div>
      <div
        style="overflow-y:auto;overflow-x:hidden"
        :style="showMyLib ? 'height:320px;' : 'height:530px;'"
      >
        <el-menu v-loading="loading.buyList" ref="buyMenu">
          <el-submenu
            v-for="subject in buyBanksMenu"
            :key="subject.subjectId"
            :index="String(subject.subjectId)"
          >
            <template slot="title">
              <div :title="subject.name">{{ subject.name }}</div>
            </template>
            <el-menu-item
              class="customMenuItem"
              v-for="sbl in subject.children"
              :key="sbl.sblId"
              :index="String(sbl.sblId)"
              @click="selectBuyBank(sbl)"
              :title="sbl.bank.tryFlag ? sbl.name + '(试用)' : sbl.name"
            >
              <span class="customItemName">{{
                sbl.bank.tryFlag ? sbl.name + "(试用)" : sbl.name
              }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

        <!-- <el-tree
          v-loading="loading.buyList"
          ref="buyTree"
          :data="buyBanks"
          :props="treeMap"
          node-key="sblId"
          highlight-current
          :expand-on-click-node="false"
          :auto-expand-parent="true"
          @node-click="selectBuyBank"
          icon-class="el-icon-arrow-right"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span
              class="custom-tree-name"
              :title="data.tryFlag ? node.label + '(试用)' : node.label"
              >{{ data.tryFlag ? node.label + "(试用)" : node.label }}</span
            >
          </span>
        </el-tree> -->
      </div>
    </div>
    <el-main v-show="isPersonal == 1" class="right-container">
      <div v-if="banks && banks.length">
        <div class="tabelHeader">
          <el-form v-model="form" :inline="true" size="small">
            <el-form-item style="width:200px">
              <el-select
                v-model="form.tip"
                filterable
                clearable
                placeholder="请选择知识点"
                size="small"
                @change="paramChange"
              >
                <el-option
                  v-for="item in testLibTip"
                  :key="item.tipText"
                  :label="item.tipText + '(' + item.resAmount + ')'"
                  :value="item.tipText"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题型">
              <el-select
                v-model="form.type"
                style="width:100px"
                placeholder="题型"
                @change="paramChange"
              >
                <el-option
                  v-for="type in allTypes"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="难度">
              <el-select
                v-model="form.difficultLevel"
                style="width:100px"
                placeholder="难度"
                @change="paramChange"
              >
                <el-option
                  v-for="diff in allDiffLevel"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="难度系数">
              <el-select
                style="width:140px"
                v-model="form.diff"
                placeholder="难度系数"
                @change="paramChange"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索题目"
                v-model="form.keywords"
                @keyup.enter.native="onSearch"
                style="width:240px"
              >
              </el-input>
              <el-button
                type="primary"
                @click="onSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
            <!-- <el-form-item> </el-form-item> -->
          </el-form>
          <div>
            <el-button
              v-if="selectedSubjects.length"
              style="border-color:#2BA1F4;color:#2BA1F4;"
              size="small"
              @click="handleMove()"
              >移动</el-button
            >
            <el-button
              v-if="selectedSubjects.length"
              style="border-color:#2BA1F4;color:#2BA1F4;"
              size="small"
              @click="deleteSubjects"
              >删除</el-button
            >

            <el-button
              style="margin-left:10px"
              size="small"
              type="primary"
              @click="showUploadFileDialog"
              >批量上传</el-button
            >

            <!-- 新单题录入 -->
            <el-button size="small" type="primary" @click="singleAdd"
              >单题录入</el-button
            >
          </div>
        </div>
        <!-- <el-row class="operateBtn"> </el-row> -->
        <div class="childrenResLib">
          <el-row v-for="item in currentLib.children" :key="item.id">
            <el-col :span="24" @click.native="invertClick(item)"
              >{{ item.sblName }}
              <i class="el-icon-arrow-right"></i>
              <span>{{ formatTime(item.sblCreateTime) }}</span>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="loading.subjectsList"
          ref="subjectsTable"
          :data="subjects"
          stripe
          border
          row-key="id"
          @selection-change="selectChange"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            :reserve-selection="true"
            type="selection"
            align="center"
          ></el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            align="center"
            width="70px"
          ></el-table-column>
          <el-table-column
            label="题型"
            prop="tSubject"
            align="center"
            width="90px"
            :formatter="formatType"
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
          <el-table-column
            label="知识点"
            prop="learnPort"
            align="center"
            width="160px"
          ></el-table-column>
          <el-table-column label="题目内容" align="center">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div class="subject-title" v-html="scope.row.briefTitle"></div>
                <el-button
                  size="mini"
                  type="text"
                  @click="preview(subjects[scope.$index])"
                  >预览</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="截止日期"
            prop="deadlineStr"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150px"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- <el-button
                v-if="scope.row.uid === uid"
                size="mini"
                type="text"
                @click="editSubject(scope.row)"
                >编辑1</el-button
              > -->
              <!-- scope.row.review == 2 -->
              <el-button
                v-if="scope.row.uid === uid"
                size="mini"
                type="text"
                @click="newEditSubject(scope.row)"
                >编辑</el-button
              >
              <!-- <el-button
                size="mini"
                type="text"
                v-if="scope.row.sonSubList && scope.row.sonSubList.length > 0"
                @click.native="showSubList(scope.row)"
                >子题目</el-button
              > -->
              <el-button
                size="mini"
                type="text"
                @click.native="handleMove(scope.row)"
                >移动</el-button
              >
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.review != 2"
                @click.native="handleReportError(scope.row)"
                >纠错</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click.native="handleDel(scope.row)"
                >删除</el-button
              >
              <!-- <el-dropdown trigger="click">
                <span
                  class="el-dropdown-link"
                  style="color:#409EFF;font-size:12px;cursor: pointer;"
                  >更多</span
                >
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="
                      scope.row.sonSubList && scope.row.sonSubList.length > 0
                    "
                    @click.native="showSubList(scope.row)"
                    >附属题目</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="handleMove(scope.row)"
                    >移动</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.review != 2"
                    @click.native="handleReportError(scope.row)"
                    >纠错</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="handleDel(scope.row)"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="subjects.length" class="right-footer-first">
            从{{ (page - 1) * pageSize + 1 }}到{{
              (page - 1) * pageSize + subjects.length
            }}记录，共{{ total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="page"
            @size-change="handleSizeChange"
            background
            @current-change="loadSubjects"
          ></el-pagination>
        </div>
      </div>
      <div
        v-else
        style="height:600px;display:flex;align-items:center;justify-content:center;flex-direction:column"
      >
        <div style="margin-bottom:50px">
          <img src="@/assets/images/empty.png" />
        </div>
        <el-button
          type="primary"
          @click="addBank"
          style="width:274px;height:40px;background:#11BCE4;border:none;"
          >添加题库</el-button
        >
      </div>
    </el-main>
    <el-main v-show="isPersonal == 2" class="right-container">
      <div>
        <div class="tabelHeader">
          <el-form v-model="buyForm" :inline="true" size="small">
            <el-form-item style="width:200px">
              <el-tree-select
                @input="tipSelectChange"
                :styles="tipTreeStyle1"
                :value="buyForm.tips"
                :selectParams="selectParams1"
                :treeParams="treeParams1"
                @searchFun="tipSearch"
                ref="buyTreeSelect"
              />
              <!-- <el-select
                v-model="form.tip"
                filterable
                clearable
                placeholder="请选择知识点"
                size="small"
                @change="paramChange"
              >
                <el-option
                  v-for="item in testLibTip"
                  :key="item.tipText"
                  :label="item.tipText + '(' + item.resAmount + ')'"
                  :value="item.tipText"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="题型">
              <el-select
                v-model="buyForm.type"
                style="width:100px"
                placeholder="题型"
                @change="buyParamChange"
              >
                <el-option
                  v-for="type in allTypes"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度系数">
              <el-select
                style="width:140px"
                v-model="buyForm.diff"
                placeholder="难度系数"
                @change="buyParamChange"
              >
                <el-option
                  v-for="diff in allDiffs"
                  :key="diff.type"
                  :label="diff.name"
                  :value="diff.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索题目"
                v-model="buyForm.keywords"
                @keyup.enter.native="onBuySearch"
                style="width:240px"
              >
              </el-input>
              <el-button
                type="primary"
                @click="onBuySearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
            <!-- <el-form-item> </el-form-item> -->
          </el-form>
          <div v-if="currentBuyLib.status == 0">
            <span v-if="currentBuyLib.expireFlag"
              >截止日期:<span style="color:red">已过期</span></span
            >
            <span v-else>截止日期:{{ currentBuyLib.deadlineStr }}</span>
            <el-button
              v-if="currentBuyLib.canBuyFlag"
              style="border-color:#2BA1F4;color:#2BA1F4;margin-left:20px"
              size="small"
              @click="toBuy"
              >续费</el-button
            >
            <el-button
              v-if="selectedBuySubjects.length"
              style="border-color:#2BA1F4;color:#2BA1F4;margin-left:20px"
              size="small"
              @click="handleGet()"
              >获取</el-button
            >
          </div>
          <div v-if="currentBuyLib.status == 1">
            <span style="color:red">已禁用</span>
            <el-button
              v-if="selectedBuySubjects.length"
              style="border-color:#2BA1F4;color:#2BA1F4;margin-left:20px"
              size="small"
              @click="handleGet()"
              >获取</el-button
            >
          </div>
        </div>
        <!-- <el-row class="operateBtn"> </el-row> -->
        <!-- <div class="childrenResLib">
          <el-row v-for="item in currentLib.children" :key="item.id">
            <el-col :span="24" @click.native="invertClick(item)"
              >{{ item.sblName }}
              <i class="el-icon-arrow-right"></i>
              <span>{{ formatTime(item.sblCreateTime) }}</span>
            </el-col>
          </el-row>
        </div> -->

        <el-table
          ref="buySubjectsTable"
          :data="buySubjects"
          stripe
          border
          row-key="id"
          v-loading="loading.buySubjectsList"
          @selection-change="buySelectChange"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column
            :reserve-selection="true"
            :selectable="checkBuySelectable"
            type="selection"
            align="center"
          ></el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            align="center"
            width="70px"
          ></el-table-column>
          <el-table-column
            label="题型"
            prop="tSubject"
            align="center"
            width="90px"
            :formatter="formatType"
          ></el-table-column>

          <el-table-column
            label="难度系数"
            prop="accuracyRate"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column
            label="知识点"
            prop="learnPort"
            align="center"
            width="160px"
          ></el-table-column>
          <el-table-column label="题目内容" align="center">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <div class="subject-title" v-html="scope.row.briefTitle"></div>
                <el-button
                  size="mini"
                  type="text"
                  @click="preview(buySubjects[scope.$index])"
                  >预览</el-button
                >
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="日期"
            prop="createTime"
            align="center"
            width="100px"
            :formatter="formatDate"
          ></el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            width="150px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :disabled="!scope.row.useAbleFlag"
                @click.native="handleGet(scope.row)"
                >获取</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click.native="handleReportError(scope.row)"
                >纠错</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="buySubjects.length" class="right-footer-first">
            从{{ (buyPage.page - 1) * buyPage.pageSize + 1 }}到{{
              (buyPage.page - 1) * buyPage.pageSize + buySubjects.length
            }}记录，共{{ buyPage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="buyPage.total"
            :page-size="buyPage.pageSize"
            :current-page.sync="buyPage.page"
            @size-change="handleSizeChange"
            background
            @current-change="loadBuySubjects"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <jd-dialog
      :loading="loading.addBank"
      :title="bankForm.sblId.length == 0 ? '新建题库' : '修改题库'"
      :visible.sync="showAddBankDialog"
      @sure="bankEditSure"
    >
      <template slot="body">
        <el-form
          :model="bankForm"
          ref="addBankForm"
          style="margin: 0 20px;"
          label-width="65px"
          :rules="addBankRules"
          @submit.native.prevent
        >
          <el-form-item label="题库名" prop="sblName">
            <el-input
              v-model.trim="bankForm.sblName"
              class="add-bank-input"
              size="small"
              maxlength="80"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <jd-dialog
      title="题目预览"
      width="800px"
      :noFooter="true"
      :visible.sync="showPreviewDialog"
    >
      <preview
        slot="body"
        :data="previewSubject"
        style="height:400px;overflow-y: auto"
      ></preview>
      <el-button
        v-if="isPersonal == 1"
        slot="my-footer"
        size="small"
        type="primary"
        @click="handleMove(previewSubject)"
        >移动</el-button
      >
      <el-button
        slot="my-footer"
        v-if="isPersonal == 2"
        size="small"
        type="primary"
        :disabled="!previewSubject.useAbleFlag"
        @click="handleGet(previewSubject)"
        >获取</el-button
      >
    </jd-dialog>
    <jd-dialog
      :title="subjectForm.sbId > 0 ? '编辑题目' : '添加题目'"
      width="800px"
      :loading="loading.addSubject"
      :visible.sync="showAddSubjectDialog"
      :close_on_click_modal="false"
      @sure="addSubjectSure"
    >
      <template slot="body">
        <el-form
          :model="subjectForm"
          size="small"
          label-width="70px"
          :inline="true"
          ref="addSubject"
          :rules="subjectFormRules"
          style="height:400px;overflow-y: auto"
        >
          <el-form-item label="知识点" class="tipTag">
            <el-tag
              :key="index"
              v-for="(tag, index) in tipTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <div v-if="tagInputVisible">
              <el-input
                class="input-new-tag"
                v-model="tagInputValue"
                style="width:320px;margin-bottom:5px"
                maxlength="50"
                show-word-limit
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
              >
                <el-popover placement="bottom" trigger="click" slot="append">
                  <el-select
                    v-model="courseId"
                    placeholder="请选择"
                    size="small"
                    @change="loadCourseTip()"
                    clearable
                  >
                    <el-option
                      v-for="item in courseData"
                      :key="item.courseId"
                      :label="item.courseName"
                      :value="item.courseId"
                    ></el-option>
                  </el-select>
                  <el-tree
                    :data="courseTip"
                    :props="defaultTipProps"
                    node-key="tipId"
                    style="max-height:300px;overflow-y:auto;margin-top:12px;"
                    icon-class="el-icon-arrow-right"
                    @node-click="handleTipNodeClick"
                    :default-expanded-keys="expandTipArr"
                  >
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <span :title="node.label">{{ node.label }}</span>
                    </span>
                  </el-tree>
                  <el-button
                    slot="reference"
                    style="color:#2BA1F4;"
                    @click="selectCourse"
                    >选择</el-button
                  >
                </el-popover>
              </el-input>
              <el-button
                v-if="tagInputVisible"
                size="mini"
                @click="handleInputConfirm"
                style="padding: 7px 6px;margin-bottom:5px"
                >确定</el-button
              >
            </div>
            <i
              v-else
              class="button-new-tag el-icon-plus"
              @click="handleShowTagInput"
            ></i>
          </el-form-item>
          <el-form-item label="题型">
            <el-select
              v-model="subjectForm.tSubject"
              style="width:100px"
              @change="typeChange"
            >
              <el-option
                v-for="type in types"
                :key="type.type"
                :label="type.name"
                :value="type.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <el-select
              v-model="subjectForm.difficultyLevel"
              style="width:100px"
            >
              <el-option
                v-for="diff in diffs"
                :key="diff.type"
                :label="diff.name"
                :value="diff.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目" prop="title" class="add-subject-form-item">
            <textarea id="titleEditor"></textarea>
          </el-form-item>
          <div
            v-if="
              subjectForm.tSubject == 1 ||
                subjectForm.tSubject == 2 ||
                subjectForm.tSubject == 3
            "
          >
            <el-form-item prop="answerList">
              <div>
                选项与正确答案(在正确答案前打钩)<span
                  class="addOption"
                  @click="addOption"
                  >添加选项</span
                >
              </div>
            </el-form-item>
            <el-checkbox-group v-model="checked">
              <div
                class="add-subject-form-options"
                v-for="(option, index) in subjectForm.answerList"
                :key="index"
              >
                <el-row v-if="option.sDelFlag == 1">
                  <el-col :span="2">
                    <el-checkbox :label="option.aOption"></el-checkbox>
                  </el-col>
                  <el-col :span="20" style="font-size:14px">
                    <textarea :id="index + 'Editor'"></textarea>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      class="option-button el-icon-delete"
                      @click="deleteOption(option)"
                    ></el-button>
                  </el-col>
                  <el-form-item
                    style="height:0px;margin-bottom:0px;"
                    :prop="'answerList.' + index + '.aText'"
                    :rules="{
                      required: true,
                      message: '选项内容不能为空',
                      trigger: 'blur'
                    }"
                  >
                    <el-input v-model="option.aText"></el-input>
                  </el-form-item>
                </el-row>
              </div>
            </el-checkbox-group>
          </div>
          <el-form-item v-else label="答案" class="add-subject-form-item">
            <textarea id="answer"></textarea>
          </el-form-item>
          <el-form-item label="解析" class="add-subject-form-item">
            <textarea id="analysisEditor"></textarea>
          </el-form-item>
        </el-form>
      </template>
    </jd-dialog>
    <jd-dialog
      title="导入题目"
      top="15vh"
      :loading="loading.uploadFile"
      :visible.sync="showUploadSubjectsDialog"
      @sure="uploadFiles"
    >
      <template slot="body">
        <div style="padding: 0 100px">
          <el-form label-width="70px">
            <el-form-item label="选择文件">
              <jd-upload
                ref="subjectsFile"
                @fileChange="uploadFileChange"
              ></jd-upload>
              <div class="el-upload__tip" style="line-height:17px">
                1、当前仅支持后缀名为.docx的Word文档;
              </div>
              <div class="el-upload__tip" style="line-height:17px">
                2、Word文档大小不超过1M
              </div>
            </el-form-item>
          </el-form>
          <span>试题模板点击下载：</span
          ><el-button
            type="primary"
            size="mini"
            style="background:#11BCE4;border:none"
            @click="downloadFormwork"
            >试题要求与模板.docx</el-button
          >
        </div>
      </template>
    </jd-dialog>
    <jd-dialog
      title="移动题目"
      :loading="loading.moveSubjects"
      :visible.sync="showMoveSubjectsDialog"
      @sure="moveSubjects"
      class="moveModal"
    >
      <template slot="body">
        <ul>
          <li>
            移动到库:<span>{{ moveToLib }}</span>
          </li>
          <li>
            <el-tree
              ref="moveSubjectsTree"
              :data="banks"
              :props="treeMap"
              :highlight-current="highlightMoveLib"
              node-key="libId"
              :expand-on-click-node="false"
              :default-expand-all="true"
              icon-class="el-icon-arrow-right"
              @node-click="selectDestinationItem"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span class="custom-tree-name">{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
        </ul>
      </template>
    </jd-dialog>
    <jd-dialog
      title="获取题目"
      :loading="loading.getSubjects"
      :visible.sync="showGetSubjectsDialog"
      @sure="getSubjectsToLib"
      class="moveModal"
    >
      <template slot="body">
        <ul>
          <li>
            获取到库:<span>{{ getToLib }}</span>
          </li>
          <li>
            <el-tree
              ref="getSubjectsTree"
              :data="banks"
              :props="treeMap"
              :highlight-current="highlightGetLib"
              node-key="libId"
              :expand-on-click-node="false"
              :default-expand-all="true"
              icon-class="el-icon-arrow-right"
              @node-click="selectGetDestinationItem"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span class="custom-tree-name">{{ node.label }}</span>
              </span>
            </el-tree>
          </li>
        </ul>
      </template>
    </jd-dialog>
    <jd-dialog
      title="纠错与举报"
      :loading="loading.feedback"
      :visible.sync="showReportDialog"
      @sure="reportSure"
    >
      <template slot="body">
        <div style="margin:0 5%">
          <div style="margin-bottom:10px;color:#333;font-size:15px">
            你觉得这个资源有什么问题？
          </div>
          <el-radio-group
            v-model="reportType"
            style="margin-top:10px;margin-bottom:20px;color:#333;font-size:13px;"
          >
            <el-radio style="margin-bottom:10px" label="6">内容有误</el-radio>
            <el-radio style="margin-bottom:10px" label="7">违法违禁</el-radio>
            <el-radio style="margin-bottom:10px" label="8"
              >抄袭我的资源</el-radio
            >
            <el-radio style="margin-bottom:10px" label="5">有其他问题</el-radio>
          </el-radio-group>
          <div style="color:#2BA1F4;font-size:13px;">
            为了帮助审核人员更快处理，请详细描述问题*
          </div>
          <div class="jc-pic">
            <el-input
              :rows="6"
              resize="none"
              type="textarea"
              v-model="reportDes"
            ></el-input>
            <el-upload
              :multiple="false"
              :with-credentials="true"
              class="avatar-uploader"
              :auto-upload="false"
              :on-change="onChange"
              action=""
              :show-file-list="false"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
      </template>
    </jd-dialog>
    <!-- 分享 -->
    <el-dialog
      :visible.sync="isShareShow"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>分享</div>
        </div>
      </template>
      <el-alert
        title="其他老师用电脑浏览器打开链接，即可获取分享内容，请谨慎操作。"
        type="warning"
        :closable="false"
      ></el-alert>
      <div style="font-size:18px;margin-top:30px;" v-if="!shareModal2">
        <span style="color:#999;margin-right:15px;">分享内容</span>
        <span>{{ currentShareBank.sblName }}</span>
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
        <el-button @click="isShareShow = false" v-if="!shareModal2"
          >取消</el-button
        >
        <el-button type="primary" @click="toCreateShareLink" v-if="!shareModal2"
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

    <!-- 题库支付 -->
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
          <div>题库续费</div>
        </div>
      </template>
      <div>
        <el-row>
          <div class="course-name">题库名称:{{ currentBuyLib.sblName }}</div>
        </el-row>
        <el-row>
          <div class="course-name">学科:{{ currentBuyLib.subjectName }}</div>
        </el-row>
        <el-row
          ><div class="course-name">
            题库价格:
            <span
              v-for="(item, idx) in sblPriceList"
              :key="item.uuid"
              :class="idx == sblPriceListIndex ? 'price-item-active' : ''"
              class="price-item"
              @click="choosePrice(idx)"
              >¥{{ item.price }}{{ item.priceUnit }}/{{ item.time
              }}{{ item.timeUnit }}</span
            >
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
            <el-button
              @click="goPay"
              :loading="loading.payLoading"
              class="but-pay"
              >去付款</el-button
            >
            <!-- <el-button @click="handlePayClose" class="but-pay">取消</el-button> -->
          </div>
        </section>
      </div>
    </el-dialog>

    <!-- 题库扫码支付 -->
    <el-dialog
      :title="`题库名称：${currentBuyLib.sblName}`"
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
        <section class="money-pay-num">￥{{ currentPrice.price }}</section>
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
  </el-container>
</template>

<style lang="scss">
.my-pane {
  margin: 22px 23px;
  .course-name {
    font-size: 18px;
    margin-bottom: 20px;
    .price-item {
      width: 130px;
      height: 45px;
      line-height: 45px;
      border-radius: 6px;
      text-align: center;
      font-size: 18px;
      border: 1px solid #d8dae2;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
    .price-item-active {
      border: 2px solid #409eff;
      color: #409eff;
    }
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

  .jc-pic {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding-left: 2px;
    margin-top: 10px;
    .el-textarea__inner {
      border: none;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .left-container {
    min-width: 182px;
    max-width: 182px;
    min-height: 638px;
    background: #ffffff;
    border-radius: 4px;
    .customMenuItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .customItemName {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-submenu__title {
      height: 46px !important;
      line-height: 46px !important;
      padding-left: 40px;
      border-bottom: 1px solid #eaeaea !important;
      border-bottom-color: #eaeaea !important;
      .el-submenu__icon-arrow {
        left: 15px;
        right: 155px;
      }
      div {
        padding: 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-submenu .el-menu-item {
      min-width: 100%;
      padding-right: 8px;
    }
    /*菜单关闭*/
    .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotateZ(-90deg);
      color: #c0c4cc;
    }
    /*菜单展开*/
    .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      -webkit-transform: rotateZ(0deg);
      -ms-transform: rotate(0deg);
      transform: rotateZ(0deg);
    }
    .el-menu-item {
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #eaeaea;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .custom-tree-name {
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .el-tree-node__children .custom-tree-name {
      max-width: 96px;
    }
    .el-tree-node__children .el-tree-node__children .custom-tree-name {
      max-width: 78px;
    }
  }
  .left-header {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #2ba1f4;
    height: 46px;
    line-height: 46px;
    padding-left: 20px;
    padding-right: 13px;
    color: white;
    font-size: 16px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    img {
      width: 16px;
      cursor: pointer;
    }
  }
  .el-tree {
    font-size: 14px;
  }
  .el-tree-node__expand-icon {
    margin-left: 10px;
  }
  .el-tree-node__content {
    height: 46px;
    border-bottom: 1px solid #eaeaea;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: transparent;
    color: #2ba1f4;
  }
  .right-container {
    padding: 12px;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 15px;
  }
  .tabelHeader {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form {
      float: left;
      .el-form-item {
        margin-bottom: 10px;
        .el-form-item__content {
          line-height: 32px;
        }
      }
    }
  }
  .operateBtn {
    // float: right;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .el-table .el-button {
    padding: 3px;
    margin: 0;
  }
  .childrenResLib {
    // height: 38px;
    .el-row {
      background-color: #edf1f7;
      margin-bottom: 5px;
      border: 1px solid #becbd9;
      height: 38px;
      .el-col {
        font-size: 14px;
        color: #333;
        padding: 0 20px;
        line-height: 38px;
        cursor: pointer;
        span {
          margin-left: 10px;
          font-size: 12px;
          color: #999999;
          float: right;
          margin-right: 10px;
        }
        i {
          float: right;
          margin-top: 12px;
          color: #aaaaaa;
        }
      }
    }
  }
  .subject-title {
    text-align: left;
    padding-right: 15px;
    max-height: 23px;
    overflow: hidden;
  }
  .add-bank-input .el-input__suffix {
    height: 30px;
    line-height: 30px;
    top: 1px;
  }
  .add-subject-form-item {
    width: 100%;
    margin-right: 0;
    .el-form-item__content {
      width: 87%;
    }
  }
  .add-subject-form-options {
    width: 100%;
    padding-right: 0;
    padding-left: 24px;
    .el-row {
      margin-bottom: 18px;
    }
    .el-form-item__content {
      width: 100%;
      line-height: 0px !important;
      .el-input--small .el-input__inner {
        height: 0px;
        line-height: 0px;
        border: none;
      }
    }
  }
  .cke_editable {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    p {
      margin: 0;
    }
  }
  .cke_editable:hover {
    border-color: #c0c4cc;
  }
  .cke_editable:focus {
    border-color: #409eff;
    outline: #fff auto 0;
  }
  div[contenteditable] {
    height: 120px;
    overflow-y: scroll;
    padding: 9px;
  }
  .el-checkbox-group div[contenteditable] {
    height: 60px;
    overflow-y: scroll;
    padding: 9px;
  }
  .option-button {
    border: none;
  }
  .option-button:hover {
    background: none;
  }
  .addOption {
    cursor: pointer;
    color: #2ba1f4;
    margin-left: 27px;
  }
  .tipTag {
    display: block;
    .el-form-item__content {
      width: 660px;
    }
    .el-tag {
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
      vertical-align: bottom;
    }
  }
  // 移动弹框
  .moveModal {
    ul {
      list-style: none;
      padding: 0 80px;
      li:first-child {
        font-size: 16px;
        color: #333;
        span {
          color: #2ba1f4;
          margin-left: 5px;
        }
      }
      li:last-child {
        border: 1px solid #cccccc;
        border-radius: 5px;
        margin-top: 14px;
        height: 320px;
        padding: 0 26px;
        overflow: auto;
        .el-tree-node__content {
          height: 46px;
          border-bottom: 1px solid #eaeaea;
        }
        .el-tree--highlight-current
          .el-tree-node.is-current
          > .el-tree-node__content {
          background-color: transparent;
          color: #2ba1f4;
        }
        .el-tree-node .el-tree-node__children {
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format, formatYMD } from "@/utils/datetime";
// import editPopover from "../publication/popver";
import editPopover from "./editPopover.vue";
import jdialog from "@/components/jdialog";
import math from "@/components/jmath";
import ckeditorConfig from "@/config/ckeditor_config.js";
import fileModal from "@/components/fileModal";
import COS from "cos-js-sdk-v5";
import preview from "./previewSubject";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import vueQr from "vue-qr";

export default {
  name: "MyPane",
  components: {
    "edit-popover": editPopover,
    "jd-dialog": jdialog,
    "jd-math": math,
    "jd-upload": fileModal,
    preview,
    ElTreeSelect,
    vueQr
  },
  data() {
    var validateOptions = (rule, value, callback) => {
      if (
        !this.subjectForm.answerList ||
        this.subjectForm.answerList.length == 0
      ) {
        return callback(new Error("请添加选项"));
      } else {
        callback();
      }
    };
    return {
      qrcode: "5555",
      orderCode: "",
      timerId: "",
      isQRcode: false,
      payType: 2,
      isPayShow: false,
      sblPriceList: [],
      sblPriceListIndex: 0,
      currentPrice: {},
      // ----------------------
      isPersonal: 1, // 1--个人题库  2--已购题库
      // ------------------------------
      showMyLib: false,
      //知识点查询参数
      selectParams1: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tipTreeStyle1: {
        width: "200px"
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
      // -------------------------------------
      isSearchType: false,
      file: null,
      imgUrl: "",
      // 题目查重
      uniqueSelectForm: {
        uniqueSelectTip: "",
        uniqueSelectTsubject: ""
      },
      returnLibId: this.$route.query.belongId, // 从导入预览页面返回Id
      uid: this.$store.state.user.userId,
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      // 批量按钮是否可用
      // btnsUseable: false,
      // 默认展开的题库节点
      expandKeys: [],
      // 预览
      previewSubject: "",
      // 新建题库名称
      bankForm: {
        sblId: "",
        sblName: "",
        parentId: 0
      },
      // 新建题库约束条件
      addBankRules: {
        sblName: [
          { required: true, message: "请输入题库名称", trigger: "blur" }
        ]
      },
      // 个人题库列表
      banks: [],
      // banks绑定到el-tree上的数据映射关系
      treeMap: {
        children: "children",
        label: "sblName"
      },
      // 所购题库
      buyBanks: [],
      buyBanksMenu: [],
      //知识点
      testLibTip: [],
      courseTip: [],
      tipTags: [],
      tagInputVisible: false,
      tagInputValue: "",
      //课程列表参数
      courseId: "",
      courseData: [],
      defaultTipProps: {
        label: "name",
        children: "children"
      },
      expandTipArr: [],
      // 题目列表
      subjects: [],
      // 题型
      types: common.types,
      allTypes: common.allTypes,
      // 难点
      diffs: common.diffs,
      allDiffLevel: common.allDiffs,
      allDiffs: common.allRateLevel,
      currentLib: {}, // 当前选中题库
      // 表单
      form: {
        tip: "",
        type: "",
        diff: "", // 难度系数
        keywords: "",
        difficultLevel: "" // 难度
      },
      // 所购题库表单
      currentBuyLib: {},
      selectedBuySubjects: [],
      buyForm: {
        tips: "",
        comTipText: "",
        type: "",
        diff: "", // 难度系数
        keywords: "",
        difficultLevel: "" // 难度
      },
      buyPage: {
        total: 0,
        page: 1,
        pageSize: 10
      },
      buySubjects: [],
      // 题目总数
      total: 0,
      page: 1,
      pageSize: 10,
      // 所选中的题目
      selectedSubjects: [],
      // 题目表单
      subjectForm: {
        id: 0,
        sbId: 0,
        tSubject: "2",
        difficultyLevel: "2",
        title: "",
        analyse: "",
        answer: "",
        answerList: [
          { aOption: "A", aText: "", sDelFlag: 1 },
          { aOption: "B", aText: "", sDelFlag: 1 },
          { aOption: "C", aText: "", sDelFlag: 1 },
          { aOption: "D", aText: "", sDelFlag: 1 }
        ]
      },
      // 题目表单验证规则
      subjectFormRules: {
        // title: [
        //   {validator: validateTitle, required: true, trigger: 'blur'},
        // ],
        answerList: [
          { validator: validateOptions, required: true, trigger: "blur" }
        ]
      },
      // 正确答案选项
      checked: [],
      // 待上传的文件
      uploadFile: null,
      // 目标题库
      destinationBank: {},
      destinationGetBank: {},
      // 预览弹窗
      showPreviewDialog: false,
      // 添加题目弹窗
      showAddSubjectDialog: false,
      // 导入弹窗
      showUploadSubjectsDialog: false,
      // 移动题目弹窗
      showMoveSubjectsDialog: false,
      showGetSubjectsDialog: false,
      // 移动资源到库的库名
      moveToLib: "",
      getToLib: "",
      highlightMoveLib: true,
      highlightGetLib: true,
      // 创建题库弹窗
      showAddBankDialog: false,
      isShareShow: false, // 分享弹框
      shareModal2: false, // 是否展示分享弹框的第二部分
      currentShareBank: {},
      shareLink: "",
      tsCode: "",
      // loading
      loading: {
        buySubjectsList: false,
        buyList: false,
        tkList: false,
        addBank: false,
        subjectsList: false,
        addSubject: false,
        uploadFile: false,
        moveSubjects: false,
        getSubjects: false,
        feedback: false,
        payLoading: false
      },
      // 题目报错
      showReportDialog: false,
      // 错误类型
      reportType: "",
      // 错误描述
      reportDes: "",
      // 报错题目
      reportSubject: {},
      currentRow: {}, //当前操作的列 记录
      // 腾讯云
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      }
    };
  },
  mounted() {
    this.loadBanks();
    this.loadBuyBanks();
    // this.loadCourse();
    this.bus.$on("myReload", () => {
      this.loadBuyBanks();
    });
    this.bus.$on(
      "botainSuccess",
      function(sblId) {
        if (sblId == this.currentLib.id) {
          this.page = 1;
          this.loadSubjects();
          this.loadLibTip();
        }
      }.bind(this)
    );
    // 初始化COS
    this.initCOS();
  },
  beforeDestroy() {
    this.bus.$off("botainSuccess");
  },
  methods: {
    checkBuySelectable(row, index) {
      let flag = true;
      for (let i = 0; i < this.buySubjects.length; i++) {
        if (row.useAbleFlag) {
          flag = true;
          break;
        } else {
          flag = false;
        }
      }
      return flag;
    },
    // 续费
    toBuy() {
      this.sblPriceList = this.currentBuyLib.priceList;
      this.sblPriceListIndex = 0;
      this.currentPrice = this.currentBuyLib.priceList[0];
      this.isPayShow = true;
    },
    choosePrice(idx) {
      this.sblPriceListIndex = idx;
      this.currentPrice = this.sblPriceList[idx];
    },
    // 获取所购题库知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentBuyLib.courseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams1.data = res.data;
              if (res.data.length >= 0) {
                this.$refs.buyTreeSelect.treeDataUpdateFun(res.data);
              }
              this.loadBuySubjects();
            }
          }.bind(this)
        );
    },
    // 知识点筛选发生变化
    tipSelectChange(ids, labels) {
      this.buyForm.tips = ids;
      if (labels) {
        this.buyForm.comTipText = labels.join(",");
      } else {
        this.buyForm.comTipText = "";
      }
      // 查询已购题库题目
      this.buyPage.page = 1;
      this.loadBuySubjects();
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.buyTreeSelect.filterFun(value);
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
        this.imgUrl = event.target.result;
      };
      reader.readAsDataURL(file.raw);
      this.file = file.raw;
      console.log(file, fileList);
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    // 反向选中目录
    invertClick(data) {
      this.selectBank(data);
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentLib.id);
      });
      this.expandKeys = [this.currentLib.id];
    },
    // 题目查重
    uniqueChange() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/subjectdDuplicateCheck",
          data: {
            libId: this.currentLib.id,
            tSubject: this.uniqueSelectForm.uniqueSelectTsubject,
            tip: this.uniqueSelectForm.uniqueSelectTip
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.total = ret.data.total;
            this.subjects = ret.data.data;
          }
        });
    },
    //从公共库找题 按钮
    handleFromComFindBtn() {
      this.$emit("changeTab");
    },
    // 从导入预览页面返回当前页面 从哪个库道题返回哪一个库 - 循环设置
    setImporSelected(banks) {
      let flag = false;
      banks.forEach(element => {
        if (element.id == this.returnLibId) {
          flag = true;
          this.selectBank(element);
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.returnLibId);
            this.expandKeys = [this.returnLibId];
          });
          return false;
        }
      });
      if (!flag) {
        this.returnLibId = "";
        this.loadBanks();
      }
    },
    // 获取已购题库
    loadBuyBanks() {
      this.loading.buyList = true;
      axios
        .request({
          method: "post",
          url: "/subject/libraryMall/queryMyBuyList",
          data: {
            hideUnUseFlag: false
          }
        })
        .then(res => {
          this.loading.buyList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.buyBanks = ret.data;
            this.buyBanksMenu = [];
            ret.data.forEach(element => {
              let flag = 0;
              for (let i = 0; i < this.buyBanksMenu.length; i++) {
                let temp = this.buyBanksMenu[i];
                if (temp.subjectId == element.subjectId) {
                  temp.children.push({
                    sblId: element.id,
                    name: element.sblName,
                    bank: element
                  });
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                this.buyBanksMenu.push({
                  subjectId: element.subjectId,
                  name: element.subjectName,
                  children: [
                    {
                      sblId: element.id,
                      name: element.sblName,
                      bank: element
                    }
                  ]
                });
              }
            });
            this.buyBanksMenu.sort((a, b) => a.subjectId - b.subjectId);
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading.buyList = false;
          // this.$message({
          //   message: "题库列表请求失败，请稍后重试",
          //   type: "warning"
          // });
        });
    },
    // 获取我的题库列表
    loadBanks() {
      this.loading.tkList = true;
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/list",
          data: {
            hideUnUseFlag: false
          }
        })
        .then(res => {
          this.loading.tkList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.banks = ret.data;
            if (this.returnLibId) {
              this.setImporSelected(this.banks);
              this.currentLib.id = this.returnLibId;
              // this.loadLibTip()
              // this.loadSubjects()
            } else {
              if (ret.data && ret.data.length > 0) {
                // let currentBank = JSON.parse(
                //   localStorage.getItem("currentBank")
                // );
                // this.currentLib = currentBank || ret.data[0];
                this.currentLib = ret.data[0];
                this.loadLibTip();
                this.$nextTick(() => {
                  if (this.$refs.tree) {
                    this.$refs.tree.setCurrentKey(this.currentLib.id);
                  }
                });
                this.loadSubjects();
              }
            }
          } else {
            this.$message({
              message: ret.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading.tkList = false;
          // this.$message({
          //   message: "题库列表请求失败，请稍后重试",
          //   type: "warning"
          // });
        });
    },
    // 点击题库item
    selectBank(bank) {
      this.isPersonal = 1;
      // this.$nextTick(() => {
      //   if (this.$refs.buyTree) {
      //     this.$refs.buyTree.setCurrentKey(null);
      //   }
      // });
      this.$refs.buyMenu.activeIndex = null;
      this.$refs.subjectsTable.clearSelection();
      localStorage.setItem("currentBank", JSON.stringify(bank));
      this.currentLib = bank;
      this.form.type = "";
      this.form.diff = "";
      this.form.keywords = "";
      this.selectedSubjects = [];
      this.page = 1;
      this.loadLibTip();
      // if (bank.id !== this.currentLib.id) {
      //   this.currentLib = bank;
      //   this.form.type = "";
      //   this.form.diff = "";
      //   this.form.keywords = "";
      //   this.selectedSubjects = [];
      //   this.page = 1;
      //   this.loadLibTip();
      // }
    },
    // 点击已购题库item
    selectBuyBank(data) {
      this.currentBuyLib = data.bank;
      this.isPersonal = 2;
      console.log(data);
      this.buyForm.type = "";
      this.buyForm.diff = "";
      this.buyForm.keywords = "";
      this.selectedBuySubjects = [];
      this.buyPage.page = 1;
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCurrentKey(null);
        }
      });
      this.loadTips();

      this.$refs.buySubjectsTable.clearSelection();

      // localStorage.setItem("currentBank", JSON.stringify(bank));
      // if (data.sblId !== this.currentBuyLib.sblId) {
      //   this.currentBuyLib = data;
      //   this.buyForm.type = "";
      //   this.buyForm.diff = "";
      //   this.buyForm.keywords = "";
      //   this.selectedBuySubjects = [];
      //   this.buyPage.page = 1;
      //   this.loadTips();
      // }
    },
    // changeSearchType(val) {
    //   this.page = 1;
    //   this.loadSubjects();
    // },
    // 获取题目列表
    loadSubjects() {
      this.loading.subjectsList = true;
      let data = {
        libId: this.currentLib.id,
        page: this.page,
        pagesize: this.pageSize,
        searchType: "1"
      };
      data.tSubject = this.form.type;
      data.difficultLevel = this.form.difficultLevel;
      data.difficultRateLevel = this.form.diff;
      data.keyWord = this.form.keywords;
      data.tip = this.form.tip;
      data.hideUnUseFlag = false;
      axios
        .request({
          method: "post",
          url: "/subject/personalSubjectBankLibrary/itemsWithCount",
          data: data
        })
        .then(res => {
          this.loading.subjectsList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.total = ret.data.total;
            this.subjects = ret.data.data;
          } else {
            this.$message({
              message: `${ret.msg}`,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading.subjectsList = false;
          // this.$message({
          //   message: "题目列表请求失败，请稍后重试",
          //   type: "warning"
          // });
        });
    },
    // 获取已购题库题目列表
    loadBuySubjects() {
      this.loading.buySubjectsList = true;
      let data = {
        libId: this.currentBuyLib.sblId,
        page: this.buyPage.page,
        pagesize: this.buyPage.pageSize,
        searchType: "1"
      };
      data.tSubject = this.buyForm.type;
      data.difficultLevel = this.buyForm.difficultLevel;
      data.difficultRateLevel = this.buyForm.diff;
      data.keyWord = this.buyForm.keywords;
      data.tip = this.buyForm.comTipText;
      data.hideUnUseFlag = false;
      data.isShowStop = 1;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/itemsWithCount",
          data: data
        })
        .then(res => {
          this.loading.buySubjectsList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.buyPage.total = ret.data.total;
            this.buySubjects = ret.data.data;
          } else {
            this.$message({
              message: `${ret.msg}`,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading.buySubjectsList = false;
        });
    },
    // 新建题库
    addBank() {
      this.bankForm.sblId = "";
      this.bankForm.sblName = "";
      this.bankForm.parentId = 0;
      this.loading.addBank = false;
      this.showAddBankDialog = true;
      if (this.$refs.addBankForm) {
        this.$refs.addBankForm.clearValidate();
      }
    },
    popoverClick(index, bank) {
      console.log(index, bank);
      if (index == "1") {
        // 新建子库
        this.bankForm.id = "";
        this.bankForm.sblId = "";
        this.bankForm.sblName = "";
        this.bankForm.parentId = bank.id;
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBankForm) {
          this.$refs.addBankForm.clearValidate();
        }
      } else if (index == "2") {
        this.bankForm.sblId = bank.id;
        this.bankForm.sblName = bank.sblName;
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBankForm) {
          this.$refs.addBankForm.clearValidate();
        }
      } else if (index == "4") {
        this.deleteBank(bank);
      } else if (index == "3") {
        this.currentShareBank = bank;
        this.shareModal2 = false;
        this.isShareShow = true;
      }
    },
    // 新增/编辑题库
    bankEditSure() {
      this.$refs["addBankForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.libName = this.bankForm.sblName;
          data.parentId = this.bankForm.parentId;
          let url = "/subject/personalSubjectBankLibrary/create";
          if (this.bankForm.sblId > 0) {
            url = "/subject/personalSubjectBankLibrary/update";
            data.libId = this.bankForm.sblId;
          }
          this.loading.addBank = true;
          axios
            .request({
              method: "post",
              url: url,
              data: data
            })
            .then(
              function(v) {
                let res = v.data;
                if (res.code == 200) {
                  if (!this.bankForm.sblId) {
                    var CountEvent =
                      window.JAnalyticsInterface.Event.CountEvent;
                    var cEvent = new CountEvent("create_personal_tiku");
                    window.JAnalyticsInterface.onEvent(cEvent);
                  }
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.showAddBankDialog = false;
                  this.loadBanks();
                } else {
                  this.loading.addBank = false;
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              }.bind(this)
            )
            .catch(() => {
              this.loading.addBank = false;
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        }
      });
    },
    // 去创建分享链接
    toCreateShareLink() {
      this.tsCode = "";
      axios
        .request({
          method: "post",
          url: "/tiku/v4/share/create",
          data: {
            sblId: this.currentShareBank.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.tsCode = ret.data.tsCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=2&shareCode=" + this.tsCode;
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
    // 重置链接
    resetLink() {
      axios
        .request({
          method: "post",
          url: "/tiku/v4/share/reset",
          data: {
            code: this.tsCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.tsCode = ret.data.tsCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=2&shareCode=" + this.tsCode;
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
    // 删除题库
    deleteBank(bank) {
      this.$confirm(
        "<div>你确定要删除题库" +
          bank.sblName +
          "吗？</div>删除后，题库中的题目将同时删除且不可恢复",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/subject/personalSubjectBankLibrary/remove",
              data: { libId: bank.id }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (this.returnLibId && bank.id == this.returnLibId) {
                  this.returnLibId = "";
                }
                this.$message({
                  message: ret.msg,
                  type: "success"
                });
                this.loadBanks();
              } else {
                this.$message({
                  message: ret.msg,
                  type: "warning"
                });
              }
            })
            .catch(() => {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        })
        .catch(() => {});
    },
    // 加载当前题库知识点
    loadLibTip() {
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/tips",
          data: { libId: this.currentLib.id }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.form.tip = "";
            this.testLibTip = ret.data;
            this.loadSubjects();
          }
        });
    },
    // 加载原有课程体系
    loadCourse() {
      axios
        .request({
          method: "post",
          url: "/subject/course/listAll"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.courseData = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 选择课程 本地存储上次使用知识点
    selectCourse() {
      if (localStorage.getItem("selectedTkCourseId")) {
        this.courseId = parseInt(localStorage.getItem("selectedTkCourseId"));
        this.loadCourseTip();
      }
    },
    // 加载原有课程体系知识点
    loadCourseTip() {
      if (this.courseId) {
        localStorage.setItem("selectedTkCourseId", this.courseId);
        axios
          .request({
            method: "post",
            url: "/subject/chapterTip/treeList",
            data: { courseId: this.courseId }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.courseTip = ret.data;
              if (ret.data.length > 0) {
                this.expandTipArr = [ret.data[0].tipId];
              }
            }
          });
      } else {
        this.courseTip = [];
        this.expandTipArr = [];
      }
    },
    //点击知识点tree  item
    handleTipNodeClick(row) {
      if (row.parentId != 0) {
        this.tagInputValue = row.name;
        this.handleInputConfirm();
      }
    },
    //课程标签的三个方法
    handleClose(tag) {
      this.tipTags.splice(this.tipTags.indexOf(tag), 1);
    },
    handleShowTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      // if(this.tipTags.length < 5) {
      //   this.tagInputVisible = true;
      //   this.$nextTick(_ => {
      //     this.$refs.saveTagInput.$refs.input.focus()
      //   });
      // }else{
      //   this.$message({
      //     type: 'warning',
      //     message: '标签最多5个'
      //   })
      // }
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if (tagInputValue.split(" ").join("").length == 0) {
        this.tagInputVisible = false;
        return;
      }
      if (tagInputValue) {
        let flag = false;
        for (let i = 0; i < this.tipTags.length; i++) {
          if (this.tipTags[i] == tagInputValue) {
            flag = true;
            this.tagInputVisible = false;
            this.tagInputValue = "";
            return;
          }
        }
        if (!flag) {
          this.tipTags.push(tagInputValue);
        }
      }
      this.tagInputVisible = false;
      this.tagInputValue = "";
    },
    /// MARK - 题目操作
    // 点击导入题目
    showUploadFileDialog() {
      this.loading.uploadFile = false;
      this.showUploadSubjectsDialog = true;
      this.$nextTick(function() {
        this.$refs.subjectsFile.clearFile();
      });
    },
    // 上传文件发生变化
    uploadFileChange(file) {
      this.uploadFile = file;
    },
    // 上传
    uploadFiles() {
      if (this.uploadFile) {
        if (
          this.uploadFile.type.indexOf("application/msword") == -1 &&
          this.uploadFile.type.indexOf(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) == -1
        ) {
          this.$message({
            type: "warning",
            message: "导入的模板文档格式错误"
          });
          return;
        }
        if (this.uploadFile.size > 1024 * 1024) {
          this.$message({
            message: "文件过大",
            type: "warning"
          });
          return;
        }
        this.loading.uploadFile = true;
        let fd = new FormData();
        fd.append("docxFile", this.uploadFile);
        fd.append("libId", this.currentLib.id);
        fd.append("sblType", 0);
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/previewWord",
            data: fd
          })
          .then(
            function(data) {
              let res = data.data;
              this.loading.uploadFile = false;
              if (res.code == 200) {
                this.$store.commit("setTestList", res.data);
                this.$router.push({
                  path: "/tiku/importPreTem",
                  query: {
                    belongId: this.currentLib.id,
                    belongType: 4 //1机构题库 2教材题 3教材自测题 4我的题库
                  }
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          )
          .catch(() => {
            this.loading.uploadFile = false;
            this.$message({
              message: "服务器异常",
              type: "warning"
            });
          });
      } else {
        this.$message({
          message: "请选择文件",
          type: "warning"
        });
      }
    },
    singleAdd() {
      this.$router.push({
        path: "/tiku/singleQuestionIn",
        query: {
          libId: this.currentLib.id
        }
      });
    },
    // 点击添加题目
    addSubject() {
      // this.$router.push({
      //   path: "/tiku/singleQuestionIn"
      // });
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.subjectForm.id = 0;
      this.subjectForm.sbId = 0;
      this.subjectForm.tSubject = 2 + "";
      this.subjectForm.difficultyLevel = 2 + "";
      this.subjectForm.title = "";
      this.subjectForm.analyse = "";
      this.subjectForm.answer = "";
      this.tipTags = [];
      this.subjectForm.answerList = [
        { aOption: "A", aText: "", sDelFlag: 1 },
        { aOption: "B", aText: "", sDelFlag: 1 },
        { aOption: "C", aText: "", sDelFlag: 1 },
        { aOption: "D", aText: "", sDelFlag: 1 }
      ];
      this.checked = [];
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      this.renderCKEditor();
    },
    // 点击编辑题目
    editSubject(row) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.subjectForm.id = row.id;
      this.subjectForm.sbId = row.sbId;
      this.subjectForm.tSubject = row.tSubject + "";
      this.subjectForm.difficultyLevel = row.difficultyLevel + "";
      this.subjectForm.title = row.title;
      this.subjectForm.answerList = row.answerList;
      this.subjectForm.analyse = row.analyse;
      this.subjectForm.answer = row.answer;
      this.tipTags = row.learnPort ? row.learnPort.split(",") : [];
      this.checked = [];
      row.answerList.forEach(element => {
        if (element.isCorrect === 2) {
          this.checked.push(element.aOption);
        }
      });
      this.tagInputVisible = false;
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      this.renderCKEditor();
    },
    newEditSubject(row) {
      localStorage.setItem("rowData", JSON.stringify(row));
      this.$router.push({
        path: "/tiku/singleQuestionIn"
      });
    },
    // 添加/编辑题目
    addSubjectSure() {
      this.$refs["addSubject"].validate(valid => {
        if (window.CKEDITOR.instances["titleEditor"]) {
          // eslint-disable-next-line standard/computed-property-even-spacing
          this.subjectForm.title = window.CKEDITOR.instances[
            "titleEditor"
          ].getData();
        }
        if (window.CKEDITOR.instances["analysisEditor"]) {
          // eslint-disable-next-line standard/computed-property-even-spacing
          this.subjectForm.analyse = window.CKEDITOR.instances[
            "analysisEditor"
          ].getData();
        }
        if (window.CKEDITOR.instances["answer"]) {
          // eslint-disable-next-line standard/computed-property-even-spacing
          this.subjectForm.answer = window.CKEDITOR.instances[
            "answer"
          ].getData();
        }
        if (!this.subjectForm.title) {
          this.$message({
            message: "请输入题目",
            type: "warning"
          });
          return;
        }
        let flag = 0;
        for (let i = 0; i < this.subjectForm.answerList.length; i++) {
          let option = this.subjectForm.answerList[i];
          let id = i + "Editor";
          if (option.sDelFlag == 1) {
            if (window.CKEDITOR.instances[id]) {
              option.aText = window.CKEDITOR.instances[id].getData();
            }
            if (!option.aText || option.aText.length == 0) {
              flag = 1;
              break;
            }
            if (this.checked.indexOf(option.aOption) >= 0) {
              option.isCorrect = 2;
            } else {
              option.isCorrect = 1;
            }
          }
        }
        if (flag == 1) {
          return;
        }
        if (this.subjectForm.answerList.length && this.checked.length == 0) {
          this.$message({
            message: "请选择正确答案",
            type: "warning"
          });
          return;
        }
        this.handleInputConfirm();
        let jsonStr = {};
        let data = {};
        jsonStr.title = this.subjectForm.title;
        jsonStr.analyse = this.subjectForm.analyse;
        jsonStr.answer = this.subjectForm.answer;
        jsonStr.tipsText = this.tipTags.join(",");
        jsonStr.learnPort = this.tipTags.join(",");
        jsonStr.tSubject = this.subjectForm.tSubject;
        jsonStr.difficultyLevel = this.subjectForm.difficultyLevel;
        jsonStr.answerList = this.subjectForm.answerList;
        let url = "";
        if (this.subjectForm.id > 0) {
          // 编辑
          jsonStr.id = this.subjectForm.id;
          url = "/subject/subjectBank/update";
        } else {
          // 新增
          data.libId = this.currentLib.id;
          url = "/subject/subjectBankLibrary/saveItemBatch";
        }
        let arr = [];
        arr.push(jsonStr);
        data.jsonStr = JSON.stringify(arr);
        this.loading.addSubject = true;
        axios
          .request({
            method: "post",
            url: url,
            data: data
          })
          .then(
            function(data) {
              let res = data.data;
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.showAddSubjectDialog = false;
                if (data.id > 0) {
                  this.page = 1;
                }
                this.loadLibTip();
              } else {
                this.loading.addSubject = false;
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          )
          .catch(() => {
            this.loading.addSubject = false;
            this.$message({
              message: "服务器异常",
              type: "warning"
            });
          });
      });
    },
    // 添加题目 - 渲染CKEditor
    renderCKEditor() {
      for (const name in window.CKEDITOR.instances) {
        window.CKEDITOR.instances[name].destroy();
      }
      this.$nextTick(function() {
        var vm = this;
        // title
        window.CKEDITOR.inline(
          "titleEditor",
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances["titleEditor"].setData(
          this.process2ckeditor(this.subjectForm.title)
        );
        window.CKEDITOR.instances["titleEditor"].on("change", function(event) {
          vm.subjectForm.title = this.getData();
        });
        // answer
        if (
          this.subjectForm.tSubject != 1 &&
          this.subjectForm.tSubject != 2 &&
          this.subjectForm.tSubject != 3
        ) {
          window.CKEDITOR.inline(
            "answer",
            Object.assign(ckeditorConfig, {
              height: "100%"
            })
          );
          window.CKEDITOR.instances["answer"].setData(
            this.process2ckeditor(this.subjectForm.answer)
          );
          window.CKEDITOR.instances["answer"].on("change", function(event) {
            vm.subjectForm.answer = this.getData();
          });
        }
        // analyse
        window.CKEDITOR.inline(
          "analysisEditor",
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances["analysisEditor"].setData(
          this.process2ckeditor(this.subjectForm.analyse)
        );
        window.CKEDITOR.instances["analysisEditor"].on("change", function(
          event
        ) {
          vm.subjectForm.analyse = this.getData();
        });
        // options
        for (let i = 0; i < this.subjectForm.answerList.length; i++) {
          let id = i + "Editor";
          let option = this.subjectForm.answerList[i];
          if (option.sDelFlag == 1) {
            window.CKEDITOR.inline(
              id,
              Object.assign(ckeditorConfig, {
                height: "100%"
              })
            );
            window.CKEDITOR.instances[id].setData(
              this.process2ckeditor(option.aText)
            );
            window.CKEDITOR.instances[id].on("change", function(event) {
              option.aText = this.getData();
            });
          }
        }
      });
    },
    // 添加题目 - 类型切换
    typeChange(value) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      if (this.subjectForm.id == 0) {
        if (value == 1) {
          this.subjectForm.answerList = [
            { aOption: "A", aText: "", sDelFlag: 1 },
            { aOption: "B", aText: "", sDelFlag: 1 }
          ];
        } else if (value == 2 || value == 3) {
          this.subjectForm.answerList = [
            { aOption: "A", aText: "", sDelFlag: 1 },
            { aOption: "B", aText: "", sDelFlag: 1 },
            { aOption: "C", aText: "", sDelFlag: 1 },
            { aOption: "D", aText: "", sDelFlag: 1 }
          ];
        } else {
          this.subjectForm.answerList = [];
        }
        this.renderCKEditor();
      }
    },
    // 删除选项
    deleteOption(option) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      if (option.sbaId > 0) {
        option.sDelFlag = 2;
      } else {
        this.subjectForm.answerList.splice(
          this.subjectForm.answerList.indexOf(option),
          1
        );
      }
      let num = 65; // 'A'
      for (let i = 0; i < this.subjectForm.answerList.length; i++) {
        let option = this.subjectForm.answerList[i];
        if (option.sDelFlag === 1) {
          let op = String.fromCharCode(num++);
          option.aOption = op;
        }
      }
    },
    // 添加选项
    addOption() {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      let num = 65;
      for (let i = 0; i < this.subjectForm.answerList.length; i++) {
        let option = this.subjectForm.answerList[i];
        if (option.sDelFlag === 1) {
          num++;
        }
      }
      let op = String.fromCharCode(num++);
      let option = {
        aOption: op,
        aText: "",
        sDelFlag: 1,
        isCorrect: 1
      };
      this.subjectForm.answerList.push(option);
      let id = this.subjectForm.answerList.length - 1 + "Editor";
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy();
      }
      this.$nextTick(() => {
        window.CKEDITOR.inline(
          id,
          Object.assign(ckeditorConfig, {
            height: "100%"
          })
        );
        window.CKEDITOR.instances[id].on("change", function(event) {
          option.aText = this.getData();
        });
      });
    },
    // 点击预览题目
    preview(subject) {
      this.previewSubject = subject;
      this.showPreviewDialog = true;
    },
    // 选中题目发生变化
    selectChange(select) {
      this.selectedSubjects = select;
    },
    // 所购题目选中
    buySelectChange(select) {
      this.selectedBuySubjects = select;
    },
    // 批量移动
    handleMove(row) {
      if (row) {
        this.currentRow = row;
      } else {
        this.currentRow = {};
      }
      this.moveToLib = "";
      this.highlightMoveLib = false;
      this.loading.moveSubjects = false;
      this.showMoveSubjectsDialog = true;
    },
    // 批量获取
    handleGet(row) {
      if (row) {
        this.currentRow = row;
      } else {
        this.currentRow = {};
      }
      this.getToLib = "";
      this.highlightGetLib = false;
      this.loading.getSubjects = false;
      this.showGetSubjectsDialog = true;
    },
    // 选择目标题库
    selectDestinationItem(bank) {
      this.highlightMoveLib = true;
      this.moveToLib = bank.sblName;
      this.destinationBank = bank;
    },
    // 选择获取题目的目标题库
    selectGetDestinationItem(bank) {
      this.highlightGetLib = true;
      this.getToLib = bank.sblName;
      this.destinationGetBank = bank;
    },
    // 获取题目
    getSubjectsToLib() {
      let id = this.destinationGetBank.id;
      if (id) {
        //获取到我的题库
        let slsIds = "";
        if (this.currentRow.slsId) {
          slsIds = this.currentRow.slsId;
        } else {
          this.selectedBuySubjects.forEach(element => {
            slsIds += `${element.slsId},`;
          });
        }
        this.loading.getSubjects = true;
        axios
          .request({
            method: "post",
            url: "/subject/subjectBankLibrary/copyTo",
            data: {
              slsIds,
              libId: id,
              sourceLibId:
                this.currentRow.slsSblId || this.selectedBuySubjects[0].slsSblId
            }
          })
          .then(res => {
            let ret = res.data;
            this.loading.getSubjects = false;
            this.showGetSubjectsDialog = false;
            this.$refs.buySubjectsTable.clearSelection();
            this.$message({
              type: "success",
              message: ret.msg
            });
          });
      } else {
        this.$message({
          message: "请选择目标题库",
          type: "warning"
        });
      }
    },
    // 移动题目
    moveSubjects() {
      if (this.destinationBank.id) {
        if (this.destinationBank.id != this.currentLib.id) {
          let slsIds = "";
          if (this.currentRow.slsId) {
            slsIds = this.currentRow.slsId;
          } else {
            this.selectedSubjects.forEach(element => {
              slsIds += `${element.slsId},`;
            });
          }
          this.loading.moveSubjects = true;
          axios
            .request({
              method: "post",
              url: "/subject/personalSubjectBankLibrary/moveTo",
              data: {
                slsIds: slsIds,
                libId: this.destinationBank.id,
                sourceLibId: this.currentLib.id
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
                  this.showMoveSubjectsDialog = false;
                  if (
                    this.page != 1 &&
                    (this.subjects.length == 1 ||
                      this.selectedSubjects.length == this.subjects.length)
                  ) {
                    this.page--;
                  }
                  this.loadSubjects();
                  this.loadLibTip();
                } else {
                  this.loading.moveSubjects = false;
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              }.bind(this)
            )
            .catch(() => {
              this.loading.moveSubjects = false;
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "该题目已在当前选中库"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选目标库"
        });
      }
    },
    // 删除单一题目
    handleDel(row) {
      this.deleteSure(row.id, row.slsId);
    },
    // 批量删除
    deleteSubjects() {
      let relationids = [];
      let sbIds = [];
      this.selectedSubjects.forEach(element => {
        relationids.push(element.slsId);
        sbIds.push(element.id);
      });
      this.deleteSure(sbIds.join(","), relationids.join(","));
    },
    deleteSure(sbId, relationid) {
      this.$confirm("题目删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/subject/personalSubjectBankLibrary/removeItemBatch",
              data: {
                libId: this.currentLib.id,
                sbId: sbId,
                slsIds: relationid
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
                  if (
                    this.page != 1 &&
                    (this.subjects.length == 1 ||
                      this.selectedSubjects.length == this.subjects.length)
                  ) {
                    this.page--;
                  }
                  this.loadSubjects();
                  this.loadLibTip();
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
        })
        .catch(() => {});
    },
    // 查看附属题目
    showSubList(row) {
      const { href } = this.$router.resolve({
        path: "/tiku/sonList",
        query: {
          id: row.id
        }
      });
      window.open(href, "_blank");
    },
    // 下载模板
    downloadFormwork() {
      this.cos.getObjectUrl(
        {
          Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
          Region: this.cosConfig.region,
          Key: "download/题库模板.docx",
          Sign: true
        },
        function(err, data) {
          if (!err) {
            var url =
              data.Url +
              (data.Url.indexOf("?") > -1 ? "&" : "?") +
              "response-content-disposition=attachment"; // 补充强制下载的参数
            // window.open(downloadUrl); // 这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
            let elemIF = window.document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            window.document.body.appendChild(elemIF);
          }
        }
      );
    },
    /// MARK - Private
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 难点
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
    },
    // 时间
    formatDate(row) {
      return formatYMD(row.createTime);
    },
    // 状态
    formatStatus(row) {
      if (row.status == 0) {
        return "已停用";
      } else if (row.status == 1) {
        return "纠错中";
      } else {
        return "启用中";
      }
    },
    // 所购题库搜索
    buyParamChange() {
      this.buyPage.page = 1;
      this.loadBuySubjects();
    },
    onBuySearch() {
      this.buyParamChange();
    },
    // 搜索
    onSearch() {
      this.paramChange();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.loadSubjects();
    },
    paramChange() {
      this.page = 1;
      this.loadSubjects();
    },
    //纠错
    handleReportError(row) {
      this.reportSubject = row;
      this.reportType = "";
      this.reportDes = "";
      this.file = null;
      this.imgUrl = "";
      this.loading.feedback = false;
      this.showReportDialog = true;
    },
    // 题目纠错
    reportSure() {
      if (this.reportType.length == 0) {
        this.$message({
          message: "请选择错误类型",
          type: "warning"
        });
        return;
      }
      this.loading.feedback = true;
      let formData = new FormData();
      formData.append("type", 12);
      formData.append("content", `${this.reportDes}(${this.reportSubject.id})`);
      formData.append("sbId", this.reportSubject.id);
      formData.append("subTypes", this.reportType);
      if (this.file) {
        formData.append("file", this.file);
      }
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/feedbackTKExercise",
          data: formData
        })
        .then(
          function(data) {
            this.loading.feedback = false;
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.reportSubject.status = 1;
              this.showReportDialog = false;
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.feedback = false;
          this.$message({
            message: "服务器异常",
            type: "warning"
          });
        });
    },
    process2ckeditor(content) {
      if (content === undefined) return "";
      var imgReg = /<img.*?class=('|")lazy('|").*?(?:>|\/>)/gi;
      var srcReg = /data-original=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = content.match(imgReg);
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          if (src.length >= 2) {
            content = content.replace(arr[i], "<img src='" + src[1] + "' />");
          }
        }
      }
      content = content.replace("&/g", "&amp;");
      if (content.indexOf("math-tex") == -1) {
        content = content.replace(/(\$.*?\$)/g, function(match, p1) {
          return '<span class="math-tex">' + p1 + "</span>";
        });
      }
      return content;
    },
    process2save(content) {
      if (content === undefined) return "";
      var imgReg = /<img.*?(?:>|\/>)/gi;
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      var arr = content.match(imgReg);
      if (arr) {
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          if (src.length >= 2) {
            content = content.replace(
              arr[i],
              "<img class='lazy' data-original='" + src[1] + "' />"
            );
          }
        }
      }
      return content;
    },
    initCOS() {
      // 初始化COS
      axios
        .request({
          method: "post",
          url: "/v1/upload/jsInitInfo"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            var info = ret.data;
            this.cosConfig.bucket = info.bucket;
            this.cosConfig.imgBucket = info.imgBucket;
            this.cosConfig.appId = info.appId;
            if (info.domain) {
              this.cosConfig.topDomain = info.domain;
            }
            if (info.region) {
              this.cosConfig.region = info.region;
            }
            this.cos = new COS({
              // 必选参数
              getAuthorization: function(options, callback) {
                axios
                  .request({
                    method: "post",
                    url: "/v1/upload/cosSignatureV5",
                    data: {
                      bucket: options.Bucket,
                      region: options.Region
                    }
                  })
                  .then(res => {
                    let ret = res.data;
                    if (ret.code === 200) {
                      let obj = {
                        TmpSecretId: ret.data.tmpSecretId,
                        TmpSecretKey: ret.data.tmpSecretKey,
                        XCosSecurityToken: ret.data.xCosSecurityToken,
                        ExpiredTime: ret.data.expiredTime
                      };
                      callback(obj);
                    }
                  });
              }
            });
          }
        });
    },
    goPay() {
      this.loading.payLoading = true;
      axios
        .request({
          method: "post",
          url: `/subject/libraryMall/pay`,
          data: {
            chargeType: this.payType,
            chargeMethod: 2,
            os: "PC",
            sblId: this.currentBuyLib.sblId,
            uuid: this.sblPriceList[this.sblPriceListIndex].uuid // 价格uuid
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.payLoading = false;
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
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("lib_rebuy");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.$message({
              title: "提示",
              message: `续费成功`,
              type: "success",
              offset: 80
            });
            this.isQRcode = false;
            this.loadBuyBanks();
            let data = this.buyBanks.find(item => {
              return this.currentBuyLib.sblId == item.sblId;
            });
            this.currentBuyLib = data;
          } else {
            this.timerId = setTimeout(() => {
              this.queryPayStatus();
            }, 1000);
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
    }
  }
};
</script>
