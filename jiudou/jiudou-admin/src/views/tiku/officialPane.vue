<template>
  <el-container class="official-pane">
    <div class="left-container">
      <div class="left-header">
        <span>机构题库列表</span>
        <img
          v-if="roleId == 25"
          src="@/assets/images/plus.png"
          @click="addBank"
        />
        <i
          style="cursor:pointer;margin-left:6px"
          @click="isShowSearchInput = !isShowSearchInput"
          class="el-icon-search"
        ></i>
      </div>
      <div v-show="isShowSearchInput">
        <!-- <el-input
          size="small"
          v-model="searchForm.resType"
          placeholder="请输入教材名称"
        ></el-input> -->
        <el-input
          size="small"
          placeholder="机构题库名称"
          v-model="resLibName"
          class="input-with-select"
        >
          <el-button
            @click="searchOfficalLLib"
            style="padding-left:10px;padding-right:10px"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
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
          <span v-if="roleId == 25">
            <edit-popover
              :noAdd="data.level >= 3"
              v-on:onSelected="popoverClick"
              :bank="data"
            ></edit-popover>
          </span>
        </span>
      </el-tree>
    </div>
    <el-main class="right-container">
      <div v-if="banks && banks.length">
        <div class="right-header">
          <el-form v-model="form" :inline="true" size="small">
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
            <el-form-item label="难度系数">
              <el-select
                v-model="form.diff"
                style="width:100px"
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
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSearch"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <div>
            <i class="right-header-buttons">
              <el-button
                v-if="selectedSubjects.length"
                size="small"
                @click="handleTransfer"
                >转让</el-button
              >
              <el-button
                v-if="selectedSubjects.length"
                size="small"
                @click="moveSubjectsClick"
                >移动</el-button
              >
              <el-button
                v-if="selectedSubjects.length"
                size="small"
                @click="deleteSubjects"
                >删除</el-button
              >
            </i>
            <el-button
              v-if="roleId == 25"
              size="small"
              type="primary"
              style="border-radius:5px"
              @click="showUploadFileDialog"
              >批量上传</el-button
            >
            <!-- <el-button
              size="small"
              type="primary"
              style="border-radius:5px"
              @click="addSubject"
              >单题录入</el-button
            > -->
            <!-- 新单题录入 -->
            <el-button
              v-if="roleId == 25"
              size="small"
              type="primary"
              @click="singleAdd"
              >单题录入</el-button
            >
          </div>
        </div>
        <div class="currentChildrenResLib">
          <el-row v-for="item in currentSbl.children" :key="item.id">
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
            type="selection"
            align="center"
            :selectable="isDeletable"
          ></el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            align="center"
            width="70px"
          ></el-table-column>
          <el-table-column
            label="标签"
            prop="uniqueId"
            align="center"
            width="130px"
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
          <el-table-column label="题目内容" align="center">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between">
                <!-- <div class="subject-title">{{subjects[scope.$index].briefTitle}}</div> -->
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
            label="状态"
            prop="status"
            align="center"
            width="70px"
            :formatter="formatStatus"
          ></el-table-column>
          <el-table-column
            label="日期"
            prop="getTime"
            align="center"
            width="100px"
            :formatter="formatDate"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150px"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- <el-button
                v-if="scope.row.sonSubList && scope.row.sonSubList.length > 0"
                size="mini"
                type="text"
                @click="showSubList(scope.$index, scope.row)"
                >附属题目</el-button
              > -->
              <el-button
                v-if="isEditable(scope.row)"
                size="mini"
                type="text"
                @click="newEditSubject(scope.row)"
                >编辑</el-button
              >
              <!-- <el-button
                v-if="isEditable(scope.row)"
                size="mini"
                type="text"
                @click="editSubject(scope.$index, scope.row)"
                >编辑</el-button
              > -->
              <el-button
                v-if="isReport(scope.row)"
                size="mini"
                type="text"
                @click="report(scope.$index, scope.row)"
                >纠错</el-button
              >
              <el-dropdown
                @visible-change="dropdownVisible"
                v-if="isStatusChangeable(scope.row) || isDeletable(scope.row)"
                trigger="hover"
                :hide-on-click="false"
              >
                <span
                  class="el-dropdown-link"
                  style="color:#2D66A0;font-size:12px;margin-left:0;cursor: pointer;"
                >
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="isStatusChangeable(scope.row)">
                    启用<el-switch
                      :disabled="loading.changeStatus"
                      :value="scope.row.status != 0"
                      style="margin-left:30px;"
                      @change="changeStatus(scope.row)"
                    ></el-switch>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.uid === uid || roleId == 25"
                    @click.native="handleTransfer(scope.row)"
                    >转让</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="isDeletable(scope.row)"
                    @click.native="deleteSubject(scope.row)"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
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
            layout="sizes, prev, pager, next, jumper"
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
    <jd-dialog
      :loading="loading.addBank"
      :title="bankForm.id.length == 0 ? '新建题库' : '修改题库'"
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
      <preview slot="body" :data="previewSubject"></preview>
    </jd-dialog>
    <jd-dialog
      :title="subjectForm.slsId > 0 ? '编辑题目' : '添加题目'"
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
        >
          <el-form-item label="标签" class="add-subject-form-item">
            <el-input
              placeholder="例:DXWL12345678"
              style="width:58%"
              v-model="subjectForm.uniqueId"
            ></el-input>
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
              node-key="sblId"
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
      title="纠错与举报"
      :loading="loading.feedback"
      :visible.sync="showReportDialog"
      @sure="reportSure"
    >
      <template slot="body">
        <div style="margin:0 5%">
          <div style="margin-bottom:10px;color:#333;font-size:15px">
            你觉得这个题目有什么问题？
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
    <!-- 转让 -->
    <el-dialog
      :visible.sync="isTransferShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>转让</div>
        </div>
      </template>
      <span style="padding-left:75px">选择成员：</span>
      <div style="margin-top: 20px">
        <el-radio-group
          size="small"
          v-model="selectedMember"
          style="text-align:center;display: inherit;"
        >
          <el-radio
            border
            :label="item.uid"
            v-for="item in member"
            :key="item.uid"
            style="margin-right:10px;margin-left:0;margin-bottom:15px;text-align:left;min-width:400px;"
          >
            {{ item.username }}({{ item.mobile }})</el-radio
          >
        </el-radio-group>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doTransfer"
          >确定</el-button
        >
        <el-button size="small" @click="isTransferShow = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<style lang="scss">
.official-pane {
  margin: 22px 23px;
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
  .right-header {
    display: flex;
    justify-content: space-between;
    .right-header-buttons {
      margin-right: 10px;
      .el-button {
        border-radius: 5px;
        border: solid 1px #2ba1f4;
        color: #2ba1f4;
      }
      .el-button.is-disabled {
        color: #8cc5ff;
        border-color: #d9ecff;
      }
    }
  }
  .el-table .el-button {
    padding: 3px;
    margin: 0;
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
  .currentChildrenResLib {
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
import editPopover from "./editPopover";
import jdialog from "@/components/jdialog";
import math from "@/components/jmath";
import { mapGetters } from "vuex";
import ckeditorConfig from "@/config/ckeditor_config.js";
import fileModal from "@/components/fileModal";
import COS from "cos-js-sdk-v5";
import preview from "./previewSubject";
export default {
  name: "OfficialBank",
  components: {
    "edit-popover": editPopover,
    "jd-dialog": jdialog,
    "jd-math": math,
    "jd-upload": fileModal,
    preview
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
      file: null,
      imgUrl: "",
      resLibName: "",
      isShowSearchInput: false,
      returnSblId: this.$route.query.belongId, // 从导入预览页面返回Id
      uid: this.$store.state.user.userId,
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      pubId: this.$store.state.user.currentRole.pubId, //用户的机构ID
      // 批量按钮是否可用
      // btnsUseable: false,
      // 默认展开的题库节点
      expandKeys: [],
      // 预览
      previewSubject: "",
      // 新建题库名称
      bankForm: {
        id: "",
        sblId: "",
        sblName: "",
        sblParentId: 0
      },
      // 新建题库约束条件
      addBankRules: {
        sblName: [
          { required: true, message: "请输入题库名称", trigger: "blur" }
        ]
      },
      // 题库列表
      banks: [],
      // banks绑定到el-tree上的数据映射关系
      treeMap: {
        children: "children",
        label: "sblName"
      },
      // 题目列表
      subjects: [],
      // 题型
      types: common.types,
      allTypes: common.allTypes,
      // 难点
      diffs: common.diffs,
      allDiffs: common.allRateLevel,
      // 当前选中题库
      currentSbl: {},
      // 表单
      form: {
        tip: "",
        type: "",
        diff: "",
        keywords: ""
      },
      // 题目总数
      total: 0,
      page: 1,
      pageSize: 10,
      // 所选中的题目
      selectedSubjects: [],
      // 题目表单
      subjectForm: {
        id: 0,
        slsId: 0,
        uniqueId: "",
        tSubject: "2",
        difficultyLevel: "2",
        title: "",
        answer: "",
        analyse: "",
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
      // 预览弹窗
      showPreviewDialog: false,
      // 添加题目弹窗
      showAddSubjectDialog: false,
      // 导入弹窗
      showUploadSubjectsDialog: false,
      // 移动题目弹窗
      showMoveSubjectsDialog: false,
      // 移动资源到库的库名
      moveToLib: "",
      highlightMoveLib: true,
      // 创建题库弹窗
      showAddBankDialog: false,
      // loading
      loading: {
        tkList: false,
        addBank: false,
        subjectsList: false,
        addSubject: false,
        feedback: false,
        uploadFile: false,
        changeStatus: false,
        moveSubjects: false
      },
      currentRow: {}, //当前操作的列 记录
      // 转让
      isTransferShow: false,
      member: [], // 转让成员的列表
      selectedMember: 0, // 转让成员的ID
      // 题目报错
      showReportDialog: false,
      // 错误类型
      reportType: "",
      // 错误描述
      reportDes: "",
      // 报错题目
      reportSubject: {},
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
    this.bus.$on(
      "botainSuccess",
      function(sblId) {
        if (sblId == this.currentSbl.id) {
          this.page = 1;
          this.loadSubjects();
        }
      }.bind(this)
    );
    // 初始化COS
    this.initCOS();
  },
  beforeDestroy() {
    this.bus.$off("botainSuccess");
  },
  computed: {
    ...mapGetters(["hasButton"])
  },
  methods: {
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
    },
    searchOfficalLLib() {
      // 搜索机构资题库
      this.loadBanks();
    },
    newEditSubject(row) {
      this.$set(row, "slsSblId", this.currentSbl.id);
      localStorage.setItem("rowData", JSON.stringify(row));
      this.$router.push({
        path: "/tiku/officialSingleQuestionIn",
        query: {
          // courseId: this.currentSbl.bank.sblCourseId
        }
      });
    },
    singleAdd() {
      this.$router.push({
        path: "/tiku/officialSingleQuestionIn",
        query: {
          libId: this.currentSbl.id
          // courseId: this.currentSbl.bank.sblCourseId
        }
      });
    },
    // 从导入预览页面返回当前页面 从哪个库导题返回选中一个库 - 循环设置
    setImporSelected(banks) {
      banks.forEach(element => {
        if (element.sblId == this.returnSblId) {
          this.selectBank(element);
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.returnSblId);
            this.expandKeys = [this.returnSblId];
          });
          return false;
        } else {
          if (element.children.length > 0) {
            this.setImporSelected(element.children);
          }
        }
      });
    },
    // MARK - 题库
    // 获取题库列表
    loadBanks() {
      this.loading.tkList = true;
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/getTKSubjectList",
          data: {
            name: this.resLibName.trim()
          }
        })
        .then(data => {
          this.loading.tkList = false;
          let res = data.data;
          if (res.code == 200) {
            this.banks = res.data;
            if (this.returnSblId) {
              this.setImporSelected(this.banks);
              this.currentSbl.id = this.returnSblId;
              this.loadSubjects();
            } else {
              if (res.data && res.data.length > 0) {
                this.currentSbl = res.data[0];
                this.setBankLevel(res.data, 1);
                this.$nextTick(() => {
                  this.$refs.tree.setCurrentKey(this.currentSbl.id);
                });
                this.loadSubjects();
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading.tkList = false;
          this.$message({
            message: "题库列表请求失败，请稍后重试",
            type: "warning"
          });
        });
    },
    // 点击题库item
    selectBank(bank) {
      if (bank.id !== this.currentSbl.id) {
        this.currentSbl = bank;
        this.form.type = "";
        this.form.diff = "";
        this.form.keywords = "";
        this.selectedSubjects = [];
        this.page = 1;
        this.loadSubjects();
      }
    },
    // 设置题库层级
    setBankLevel(data, level) {
      if (data && data.length > 0) {
        data.forEach(element => {
          element.level = level;
          if (element.children.length > 0) {
            this.setBankLevel(element.children, level + 1);
          }
        });
      }
    },
    // 获取题目列表
    loadSubjects() {
      this.loading.subjectsList = true;
      let data = {
        sblId: this.currentSbl.id,
        page: this.page,
        pagesize: this.pageSize
      };
      data.tSubject = this.form.type;
      // data.difficultyLevel = this.form.diff;
      data.difficultRateLevel = this.form.diff;
      data.title = this.form.keywords;
      axios
        .request({
          method: "post",
          url: "/v1/subjectBank/getTKExercisesByPage",
          data: data
        })
        .then(
          function(data) {
            this.loading.subjectsList = false;
            let res = data.data;
            if (res.code == 200) {
              this.total = res.data.total;
              this.subjects = res.data.data;
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.subjectsList = false;
          this.$message({
            message: "题目列表请求失败，请稍后重试",
            type: "warning"
          });
        });
    },
    // 新建一级题库
    addBank() {
      this.bankForm.id = "";
      this.bankForm.sblId = "";
      this.bankForm.sblName = "";
      this.bankForm.sblParentId = 0;
      this.loading.addBank = false;
      this.showAddBankDialog = true;
      if (this.$refs.addBankForm) {
        this.$refs.addBankForm.clearValidate();
      }
    },
    popoverClick(index, bank) {
      if (index == "1") {
        this.bankForm.id = "";
        this.bankForm.sblId = "";
        this.bankForm.sblName = "";
        this.bankForm.sblParentId = bank.id;
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBankForm) {
          this.$refs.addBankForm.clearValidate();
        }
      } else if (index == "2") {
        this.bankForm.id = bank.id;
        this.bankForm.sblId = bank.id;
        this.bankForm.sblName = bank.sblName;
        this.bankForm.sblParentId = bank.sblParentId;
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBankForm) {
          this.$refs.addBankForm.clearValidate();
        }
      } else if (index == "4") {
        this.bankForm.id = bank.id;
        this.bankForm.sblId = bank.id;
        this.deleteBank();
      }
    },
    // 新增/编辑题库
    bankEditSure() {
      this.$refs["addBankForm"].validate(valid => {
        if (valid) {
          let url = "/v1/subjectBankLibrary/addTKSubjectList";
          if (this.bankForm.sblId.toString().length > 0) {
            url = "/v1/subjectBankLibrary/updateTKSubjectList";
          }
          this.loading.addBank = true;
          axios
            .request({
              method: "post",
              url: url,
              data: this.bankForm
            })
            .then(
              function(data) {
                let res = data.data;
                if (res.code == 200) {
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
    // 删除题库
    deleteBank() {
      this.$confirm(
        "删除题库后，题库中的题目将同时删除且不可恢复, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        axios
          .request({
            method: "post",
            url: "/v1/subjectBankLibrary/deleteTKSubjectList",
            data: { sblId: this.bankForm.sblId }
          })
          .then(
            function(data) {
              let res = data.data;
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.loadBanks();
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
      });
    },
    // 反向选中目录
    invertClick(data) {
      this.selectBank(data);
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentSbl.id);
      });
      this.expandKeys = [this.currentSbl.id];
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
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/previewUploadSBs",
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
                    belongId: this.currentSbl.id,
                    belongType: 1 //1题库 2教材题 3教材自测题
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
    // 点击添加题目
    addSubject() {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.subjectForm.id = 0;
      this.subjectForm.slsId = 0;
      this.subjectForm.uniqueId = "";
      this.subjectForm.tSubject = 2 + "";
      this.subjectForm.difficultyLevel = 2 + "";
      this.subjectForm.title = "";
      this.subjectForm.analyse = "";
      this.subjectForm.answer = "";
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
    editSubject(index, row) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.subjectForm.id = row.id;
      this.subjectForm.slsId = row.slsId;
      this.subjectForm.uniqueId = row.uniqueId;
      this.subjectForm.tSubject = row.tSubject + "";
      this.subjectForm.difficultyLevel = row.difficultyLevel + "";
      this.subjectForm.title = row.title;
      this.subjectForm.answerList = row.answerList;
      this.subjectForm.analyse = row.analyse;
      this.subjectForm.answer = row.answer;
      this.checked = [];
      row.answerList.forEach(element => {
        if (element.isCorrect === 2) {
          this.checked.push(element.aOption);
        }
      });
      this.loading.addSubject = false;
      this.showAddSubjectDialog = true;
      this.renderCKEditor();
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
        let data = {};
        data.title = this.subjectForm.title;
        data.analyse = this.subjectForm.analyse;
        data.answer = this.subjectForm.answer;
        data.slsId = this.subjectForm.slsId;
        data.uniqueId = this.subjectForm.uniqueId
          ? this.subjectForm.uniqueId
          : "";
        data.tSubject = this.subjectForm.tSubject;
        data.difficultyLevel = this.subjectForm.difficultyLevel;
        data.options = this.subjectForm.answerList;
        data.options = JSON.stringify(data.options);
        var url;
        if (this.subjectForm.id > 0) {
          data.id = this.subjectForm.id;
          url = "/v1/subjectBank/updateTKExercise";
        } else {
          data.sblId = this.currentSbl.id;
          url = "/v1/subjectBank/addTKExercises";
        }
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
                this.loadSubjects();
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
    // 批量移动
    moveSubjectsClick() {
      this.moveToLib = "";
      this.highlightMoveLib = false;
      this.loading.moveSubjects = false;
      this.showMoveSubjectsDialog = true;
    },
    // 选择目标题库
    selectDestinationItem(bank) {
      this.highlightMoveLib = true;
      this.moveToLib = bank.sblName;
      this.destinationBank = bank;
    },
    // 移动题目
    moveSubjects() {
      if (this.destinationBank.id) {
        if (this.destinationBank.id != this.currentSbl.id) {
          let slsIds = [];
          this.selectedSubjects.forEach(element => {
            slsIds.push(element.slsId);
          });
          this.loading.moveSubjects = true;
          axios
            .request({
              method: "post",
              url: "/v1/subjectBank/moveExerciseToAimTK",
              data: {
                slsIds: slsIds.join(","),
                sblId: this.destinationBank.id
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
    deleteSubject(row) {
      this.deleteSure(row.slsId);
    },
    // 批量删除
    deleteSubjects() {
      let slsIds = [];
      this.selectedSubjects.forEach(element => {
        slsIds.push(element.slsId);
      });
      this.deleteSure(slsIds.join(","));
    },
    deleteSure(ids) {
      this.$confirm("题目删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/deleteTKExercises",
            data: { sbSlIds: ids }
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
      });
    },
    // 转让
    handleTransfer(row) {
      if (row) {
        this.currentRow = row;
      }
      this.selectedMember = 0;
      axios
        .request({
          method: "post",
          url: "/v1/pubMember/listWithCount",
          data: {
            page: 1,
            pagesize: 30
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.member = ret.data.data;
            this.isTransferShow = true;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //确定转让事件
    doTransfer() {
      let sbIds = "";
      if (this.selectedSubjects.length > 0) {
        this.selectedSubjects.forEach(element => {
          sbIds += `${element.slsId},`;
        });
      } else {
        sbIds = this.currentRow.slsId;
      }
      if (this.selectedMember > 0) {
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/transferEditPermission",
            data: {
              sbSlIds: sbIds,
              userId: this.selectedMember
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isTransferShow = false;
              this.loadSubjects();
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
      } else {
        this.$message({
          type: "warning",
          message: "请选择转让成员"
        });
      }
    },
    // 查看附属题目
    showSubList(index, row) {
      const { href } = this.$router.resolve({
        path: "/tiku/sonList",
        query: {
          id: row.id
        }
      });
      window.open(href, "_blank");
    },
    // 点击题目报错
    report(index, row) {
      this.loading.feedback = false;
      this.reportSubject = row;
      this.file = null;
      this.imgUrl = "";
      this.reportType = "";
      this.reportDes = "";
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
                message: data.msg,
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
    dropdownVisible(show) {
      this.loading.changeStatus = false;
    },
    // 修改状态
    changeStatus(row) {
      let status;
      if (row.status == 0) {
        status = 2;
      } else {
        status = 0;
      }
      this.loading.changeStatus = true;
      axios
        .request({
          method: "post",
          url: "/subject/subjectBank/updateStatus",
          data: { id: row.id, status }
        })
        .then(
          function(data) {
            this.loading.changeStatus = false;
            let res = data.data;
            if (res.code == 200) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              row.status = status;
            } else {
              this.$message({
                message: "服务器异常",
                type: "warning"
              });
            }
          }.bind(this)
        )
        .catch(() => {
          this.loading.changeStatus = false;
          this.$message({
            message: "服务器异常",
            type: "warning"
          });
        });
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
      return formatYMD(row.getTime);
    },
    // 状态
    formatStatus(row) {
      if (row.status == 0) {
        return "已停用";
      } else if (row.status == 1) {
        return "纠错中";
      } else {
        return "已启用";
      }
    },
    // 时间
    formatTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    // 搜索
    onSearch() {
      this.paramChange();
    },
    //选择每页显示数据条数切换事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadSubjects();
    },
    paramChange() {
      this.page = 1;
      this.loadSubjects();
    },
    // 是否显示删除按钮
    isDeletable(row) {
      let uid = this.$store.state.user.userId;
      if (
        row &&
        (row.uid == uid || this.roleId == 25) &&
        (row.pubId == this.pubId || row.pubId === 0)
      ) {
        return true;
      }
      return false;
    },
    // 是否可编辑题目
    isEditable(row) {
      let uid = this.$store.state.user.userId;
      if (
        (row.uid === uid || this.roleId == 25) &&
        (row.pubId == this.pubId || row.pubId === 0)
      ) {
        return true;
      }
      return false;
    },
    isReport(row) {
      let uid = this.$store.state.user.userId;
      if (row.uid != uid) {
        return true;
      }
      return false;
    },
    // 是否可修改题目状态
    isStatusChangeable(row) {
      if (row.review == 1) {
        return false;
      }
      let role = this.$store.state.user.currentRole;
      if (role.roleId == 25 && role.pubId == row.pubId) {
        return true;
      }
      let uid = this.$store.state.user.userId;
      if (uid == row.uid) {
        return true;
      }
      return false;
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
    }
  }
};
</script>
