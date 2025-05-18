<template>
  <div class="bookResource">
    <el-container class="bookResourceTop">
      <el-aside width="182px">
        <div :class="[isCatalog ? 'listHeader1' : 'listHeader']">
          <span @click="clickBook">教材目录</span>
          <img
            v-if="isCatalog"
            src="@/assets/images/plus1.png"
            alt=""
            @click="addCatalog"
          />
          <img
            v-else
            src="@/assets/images/plus.png"
            alt=""
            @click="addCatalog"
          />
        </div>
        <el-tree
          :data="catalog"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="highlightCurrent"
          node-key="catalogId"
          ref="vueCatalogTree"
          icon-class="el-icon-arrow-right"
          @node-click="handleNodeClick"
          :allow-drop="allowDrop"
          @node-drop="onDragEnd"
          draggable
        >
          <!-- draggable -->

          <span
            class="custom-tree-node"
            ref="popover"
            slot-scope="{ node, data }"
          >
            <span :title="node.label">{{ node.label }}</span>
            <span>
              <popver v-on:onSelected="popoverClick" :bank="data"></popver>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <div class="main-resource">
          <el-tabs
            ref="resourceTab"
            v-model="resActiveName"
            class="sub-tabs"
            @tab-click="tabClick"
          >
            <el-tab-pane label="扫码资源" name="first">
              <div class="tabelHeader">
                <el-select
                  v-model="resType"
                  placeholder="资源类型"
                  size="small"
                  style="width:100px;"
                  @change="resTypeChange"
                >
                  <el-option
                    v-for="type in resTypes"
                    :key="type.type"
                    :label="type.name"
                    :value="type.type"
                  ></el-option>
                </el-select>
                <el-row class="operateBtn">
                  <el-button size="small" @click="resQrcode">资源码</el-button>
                  <el-button
                    size="small"
                    v-if="isCatalog === false"
                    @click="exportExcel"
                    >导出</el-button
                  >
                  <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="handleSearchRes"
                    >找资源</el-button
                  >
                  <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="uploadRes"
                    >上传资源</el-button
                  >
                </el-row>
              </div>
              <el-table
                :data="bookResData"
                border
                v-loading="loading.bookResLoading"
                :header-cell-style="{
                  'background-image':
                    'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                  color: '#333333',
                  height: '40px',
                  padding: '0'
                }"
              >
                <el-table-column label="文件类型" prop="resType" align="center">
                  <template slot-scope="scope">
                    <span>{{ formatResType(scope.row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="资源" prop="resName" align="center">
                  <template slot-scope="scope">
                    <span
                      @click="handleViewRes(scope.row)"
                      style="cursor:pointer"
                      >{{ scope.row.resName }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="matchPicUrl"
                  label="资源码"
                  align="center"
                  width="180"
                >
                  <div
                    slot-scope="scope"
                    v-if="scope.row.resType == 3 && scope.row.matchPicUrl"
                  >
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click"
                    >
                      <img
                        :src="scope.row.matchPicUrl"
                        alt=""
                        style="width:500px;"
                      />
                      <i
                        slot="reference"
                        class="el-icon-picture"
                        style="font-size:30px;cursor: pointer;"
                      ></i>
                    </el-popover>
                  </div>
                  <div slot-scope="scope" v-else-if="scope.row.qrcode">
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click"
                    >
                      <div style="text-align:center;">
                        {{ textbook.tb_num }}-{{ scope.row.qrcodeNickname }}
                      </div>
                      <qrcode
                        :value="
                          `${baseUrlV3}/resource/resource/r/${scope.row.qrcode}`
                        "
                        :options="{ width: 200 }"
                      ></qrcode>
                      <i
                        slot="reference"
                        class="el-icon-picture"
                        style="font-size:30px; cursor: pointer;"
                      ></i>
                    </el-popover>
                  </div>
                </el-table-column>
                <el-table-column
                  label="资源展示名"
                  prop="matchpicname"
                  align="center"
                >
                  <template slot="header">
                    资源展示名
                    <el-tooltip
                      class="item"
                      effect="dark"
                      placement="top"
                      style="color:#333333;font-size:16px;cursor:pointer"
                    >
                      <div slot="content">资源在APP的教材资源里的名称</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </template>
                  <template slot-scope="scope">
                    {{ scope.row.matchpicname }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="页码"
                  prop="resPage"
                  align="center"
                ></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="editBookRes(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      v-if="
                        scope.row.memberId === uid && scope.row.resType === 2
                      "
                      @click.native="showSnapshot(scope.row)"
                      >视频封面</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      @click="delBookRes(scope.row)"
                      >解绑</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="bookResData.length" class="right-footer-first">
                  从{{ (resPage.page - 1) * resPage.pagesize + 1 }}到{{
                    (resPage.page - 1) * resPage.pagesize + bookResData.length
                  }}记录，共{{ resPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="resPage.total"
                  :page-size="resPage.pagesize"
                  :current-page.sync="resPage.page"
                  background
                  @current-change="loadBookRes"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="自测训练" name="second">
              <div class="tabelHeader">
                <el-row class="operateBtn">
                  <el-popover
                    v-if="currentCatalog.catalogId"
                    placement="left-start"
                    title=""
                    trigger="click"
                  >
                    <qrcode
                      :value="currentCatalog.catalogId"
                      :options="{ width: 200 }"
                    ></qrcode>
                    <el-button slot="reference" size="small">二维码</el-button>
                  </el-popover>

                  <el-button
                    size="small"
                    :disabled="deleteTests.length == 0"
                    @click="deleteTestsClick"
                    >批量删除</el-button
                  >
                  <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="handleSearchTest(2)"
                    >找题</el-button
                  >
                  <!-- <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="uploadTestsClick"
                    >批量上传</el-button
                  >
                  <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="addSubject"
                    >单题录入</el-button
                  > -->
                </el-row>
              </div>
              <el-table
                :data="testList"
                border
                v-loading="loading.bookTestLoading"
                @selection-change="deleteTestsSelected"
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
                ></el-table-column>
                <el-table-column
                  label="标签"
                  align="center"
                  prop="uniqueId"
                  width="140px"
                ></el-table-column>
                <el-table-column
                  label="题目类型"
                  align="center"
                  prop="tSubject"
                  :formatter="formatType"
                  width="100px"
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
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between">
                      <div
                        class="subject-title"
                        v-html="scope.row.briefTitle"
                      ></div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="preview(scope.$index, testList[scope.$index])"
                        >预览</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="题序"
                  prop="sort"
                  align="center"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      type="text"
                      v-model="scope.row.sort"
                      v-show="scope.row.isEdit"
                      oninput="value=value.replace(/[^0-9]/g,'')"
                    />
                    <span v-show="!scope.row.isEdit">{{ scope.row.sort }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="日期" align="center" width="100px">
                  <template slot-scope="scope">
                    {{ formatTestDate(scope.row.getTime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <!-- <el-button
                      v-if="
                        scope.row.tSubject == 10 || scope.row.tSubject == 11
                      "
                      size="mini"
                      type="text"
                      @click="showSubList(scope.$index, scope.row)"
                      >附属题目</el-button
                    > -->
                    <el-button
                      v-if="isEditable(scope.row)"
                      size="mini"
                      type="text"
                      @click="editSubject(scope.$index, scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      v-if="!scope.row.isEdit"
                      @click="editRow(scope.row)"
                      size="mini"
                      type="text"
                      >排序</el-button
                    >
                    <el-button
                      v-if="scope.row.isEdit"
                      @click="saveRow(scope.row)"
                      size="mini"
                      type="text"
                      >保存</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="deleteTest(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="testList.length" class="right-footer-first">
                  从{{ (testPage.page - 1) * testPage.pageSize + 1 }}到{{
                    (testPage.page - 1) * testPage.pageSize + testList.length
                  }}记录，共{{ testPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="testPage.total"
                  :page-size="testPage.pageSize"
                  :current-page.sync="testPage.page"
                  background
                  @current-change="loadTests"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="教材习题" name="third">
              <span slot="label"
                >教材习题
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="right"
                  style="color:#333333;font-size:16px;cursor:pointer"
                >
                  <div slot="content">教师专用</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <div class="tabelHeader">
                <el-row class="operateBtn">
                  <el-button
                    size="small"
                    :disabled="deleteSubjects.length == 0"
                    @click="deleteTestsClick"
                    >批量删除</el-button
                  >
                  <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="handleSearchTest(3)"
                    >找题</el-button
                  >
                  <!-- <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="uploadTestsClick"
                    >批量上传</el-button
                  > -->
                  <!-- <el-button
                    size="small"
                    v-if="isCatalog === true"
                    @click="addSubject"
                    >单题录入</el-button
                  > -->
                </el-row>
              </div>
              <el-table
                :data="subjectList"
                border
                v-loading="loading.subjectsLoading"
                @selection-change="deleteSubjectsSelected"
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
                ></el-table-column>
                <el-table-column
                  label="标签"
                  align="center"
                  prop="uniqueId"
                  width="140px"
                ></el-table-column>
                <el-table-column
                  label="题目类型"
                  align="center"
                  prop="tSubject"
                  :formatter="formatType"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  label="难度"
                  prop="difficultyLevel"
                  align="center"
                  width="60px"
                  :formatter="formatDiff"
                ></el-table-column>
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between">
                      <div
                        class="subject-title"
                        v-html="scope.row.briefTitle"
                      ></div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="
                          preview(scope.$index, subjectList[scope.$index])
                        "
                        >预览</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="题序"
                  prop="sort"
                  align="center"
                  width="100px"
                >
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      type="text"
                      v-model="scope.row.sort"
                      v-show="scope.row.isEdit"
                      oninput="value=value.replace(/[^0-9]/g,'')"
                    />
                    <span v-show="!scope.row.isEdit">{{ scope.row.sort }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="日期" align="center" width="100px">
                  <template slot-scope="scope">
                    {{ formatTestDate(scope.row.getTime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <!-- <el-button
                      v-if="
                        scope.row.tSubject == 10 || scope.row.tSubject == 11
                      "
                      size="mini"
                      type="text"
                      @click="showSubList(scope.$index, scope.row)"
                      >附属题目</el-button
                    > -->
                    <!-- <el-button
                      v-if="isEditable(scope.row)"
                      size="mini"
                      type="text"
                      @click="editSubject(scope.$index, scope.row)"
                      >编辑</el-button
                    > -->
                    <el-button
                      v-if="!scope.row.isEdit"
                      @click="editRow(scope.row)"
                      size="mini"
                      type="text"
                      >排序</el-button
                    >
                    <el-button
                      v-if="scope.row.isEdit"
                      @click="saveRow(scope.row)"
                      size="mini"
                      type="text"
                      >保存</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      @click="deleteTest(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="subjectList.length" class="right-footer-first">
                  从{{
                    (subjectsPage.page - 1) * subjectsPage.pageSize + 1
                  }}到{{
                    (subjectsPage.page - 1) * subjectsPage.pageSize +
                      subjectList.length
                  }}记录，共{{ subjectsPage.total }}条
                </div>
                <div v-else class="right-footer-first" ref="footerCount">
                  从0到0条记录，共0条
                </div>
                <el-pagination
                  layout="prev, pager, next, jumper"
                  :total="subjectsPage.total"
                  :page-size="subjectsPage.pageSize"
                  :current-page.sync="subjectsPage.page"
                  background
                  @current-change="loadBookSubjects"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="测评系统" name="fourth">
              <div class="empty1" v-if="!tikuBindCode">
                <img src="@/assets/images/empty1.png" alt="" />
                <!-- <el-button size="small" @click="handleBindTiku" type="primary"
                  >去绑定题库</el-button
                > -->
                <el-button
                  size="small"
                  @click="handleBindTikuNew"
                  type="primary"
                  >去绑定题库</el-button
                >
              </div>
              <div v-else>
                <div class="tabelHeader">
                  <el-row class="operateBtn">
                    <el-popover placement="left-start" title="" trigger="click">
                      <qrcode
                        :value="tikuBindCode"
                        :options="{ width: 200 }"
                      ></qrcode>
                      <el-button slot="reference" size="small"
                        >二维码</el-button
                      >
                    </el-popover>

                    <el-button size="small" @click="handleBindTikuNew"
                      >绑定题库</el-button
                    >
                  </el-row>
                </div>
                <el-table
                  :data="onlineList"
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
                    label="已绑题库"
                    align="center"
                    prop="sblName"
                  ></el-table-column>
                  <el-table-column
                    label="题量"
                    align="center"
                    prop="bankNum"
                  ></el-table-column>
                  <el-table-column label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        @click="delBindTikuNew(scope.row)"
                        >解绑</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <div class="tabelFooter">
                  <div v-if="onlineList.length > 0" class="right-footer-first">
                    从{{ (onlinePage.page - 1) * onlinePage.pageSize + 1 }}到{{
                      (onlinePage.page - 1) * onlinePage.pageSize +
                        onlineList.length
                    }}记录，共{{ onlinePage.total }}条
                  </div>
                  <div v-else class="right-footer-first" ref="footerCount">
                    从0到0条记录，共0条
                  </div>
                  <el-pagination
                    layout="prev, pager, next, jumper"
                    :total="onlinePage.total"
                    :page-size="onlinePage.pageSize"
                    :current-page.sync="onlinePage.page"
                    background
                    @current-change="getOnlineList"
                  ></el-pagination>
                </div>

                <!-- <div class="exam-sys-code"> -->
                <!-- <vue-qr
                    :text="tikuBindCode"
                    colorDark="#000"
                    colorLight="#fff"
                    :margin="0"
                    :size="220"
                  ></vue-qr>
                  <el-button
                    style="margin-top:20px"
                    @click="handleBindTiku"
                    size="small"
                    type="primary"
                    >更换绑定</el-button
                  > -->
                <!-- <el-button
                    size="small"
                    @click="handleBindTikuNew"
                    type="primary"
                    >新绑定题库</el-button
                  > -->
                <!-- </div> -->
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
      <!-- 新建/编辑章 -->
      <el-dialog
        :visible.sync="isCatalogShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>
              {{ ruleCatalogForm.catalogId.length == 0 ? "新建章" : "修改章" }}
            </div>
          </div>
        </template>
        <el-form
          :model="ruleCatalogForm"
          :rules="newCatalogRules"
          ref="ruleCatalogForm"
          label-width="90px"
          class="demo-ruleForm"
          style="margin:0 90px;"
          @submit.native.prevent
        >
          <el-form-item label="章名称" prop="catelogContent">
            <el-input
              v-model="ruleCatalogForm.catelogContent"
              maxlength="50"
              show-word-limit
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="primary" @click="addCatalogSure"
            >确定</el-button
          >
          <el-button size="small" @click="isCatalogShow = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 删除章 -->
      <el-dialog
        :visible.sync="isDelCatalogShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>删除章</div>
          </div>
        </template>
        <div
          style="text-align:center;font-size:16px;color:#333333;margin-bottom:10px;"
        >
          <img
            src="@/assets/images/warning.png"
            alt=""
            style="width:22px;height:22px;vertical-align: bottom;margin-right:13px;"
          />
          确认要删除所选章？
        </div>
        <div style="text-align:center;font-size:14px;color:#666666;">
          删除此章后，章中的资源将同时删除且不可恢复
        </div>
        <span slot="footer">
          <el-button size="small" type="primary" @click="delCatalogSure"
            >确定</el-button
          >
          <el-button size="small" @click="isDelCatalogShow = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 上传资源 -->
      <el-dialog
        :visible.sync="isUploadResShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCloseUploadModalBefore"
        class="uploadRich"
      >
        <!-- width="600px" -->

        <template slot="title">
          <div>
            <div></div>
            <div>上传资源</div>
          </div>
        </template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="常规资源" name="first">
            <el-form
              :model="uploadResForm"
              :rules="uploadResRules"
              ref="uploadResForm"
              label-width="110px"
              class="common-res"
              style="margin:0 60px;"
            >
              <el-form-item label="资源文件" style="margin-bottom:5px;">
                <fileModal
                  ref="uploadResfileModal"
                  v-on:fileChange="uoloadFileChange"
                ></fileModal>
                <div class="inputTips">
                  AR、文件夹、语音评测等资源类型请先上传到资源库里
                </div>
                <div class="inputTips">文件大小不得超过500M</div>
                <div v-if="uploadResForm.showProgress" style="margin-top:10px">
                  {{ uploadResForm.originalName }}
                </div>
                <el-progress
                  :percentage="uploadResForm.percentage"
                  v-if="uploadResForm.showProgress"
                  class="progress"
                ></el-progress>
              </el-form-item>
              <el-form-item label="资源类型" v-if="uploadResForm.resType">
                <span>{{ formatResTypeName(uploadResForm.resType) }}</span>
              </el-form-item>
              <el-form-item label="资源展示名" prop="matchpicname">
                <el-input
                  v-model.trim="uploadResForm.matchpicname"
                  size="small"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="图例" prop="resNum">
                <el-input
                  v-model="uploadResForm.resNum"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="位置页码" prop="resPage">
                <el-input
                  v-model="uploadResForm.resPage"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="选择二维码">
                <el-select
                  v-model="uploadResForm.id"
                  style="display:block;"
                  @change="changeQrcode"
                  size="small"
                >
                  <el-option
                    v-for="item in qrcodeSelectList"
                    :key="item.id"
                    :label="item.qrcodeNickname"
                    :value="item.id"
                    :class="[item.bindFlag === 1 ? 'c-grey' : '']"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <!-- slot="footer" -->
            <div style="text-align:center">
              <el-button
                size="small"
                type="primary"
                @click="uploadResSure"
                :loading="loading.uploadResFileLoading"
                >确定</el-button
              >
              <el-button size="small" @click="doCancelUploadRes">{{
                loading.uploadResFileLoading ? "取消上传" : "取消"
              }}</el-button>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="文件夹" name="second">
            <el-form
              :model="folderResForm"
              :rules="folderResRules"
              ref="folderResForm"
              label-width="100px"
              size="small"
              style="margin:0 90px;"
            >
              <el-form-item label="资源文件" style="margin-bottom:5px;">
                <input
                  title="点击选择文件夹"
                  ref="folderFile"
                  multiple="multiple"
                  webkitdirectory=""
                  accept="*/*"
                  type="file"
                  @change="folderFileChange"
                />
                <div class="inputTips">文件大小不得超过500M</div>
                <div
                  v-if="folderResForm.showProgress"
                  style="max-height: 100px; margin-top: 5px; overflow-y: scroll"
                >
                  <div
                    v-for="(value, index) in folderResForm.files"
                    :key="index"
                  >
                    <div style="margin-top:2px">{{ value.originName }}</div>
                    <el-progress
                      :percentage="value.percentage"
                      style="margin-bottom: 3px;"
                    ></el-progress>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="文件夹名" prop="resName">
                <el-input
                  v-model.trim="folderResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="图例" prop="resNum">
                <el-input
                  v-model="folderResForm.resNum"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="位置页码" prop="resPage">
                <el-input
                  v-model="folderResForm.resPage"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="选择二维码">
                <el-select
                  v-model="folderResForm.id"
                  style="display:block;"
                  @change="changeFolderQrcode"
                  size="small"
                >
                  <el-option
                    v-for="item in qrcodeSelectList"
                    :key="item.id"
                    :label="item.qrcodeNickname"
                    :value="item.id"
                    :class="[item.bindFlag === 1 ? 'c-grey' : '']"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <div style="text-align: center;">
              <el-button
                size="small"
                type="primary"
                @click="doUploadFolder"
                :loading="loading.loadingFolderSure"
                >确定</el-button
              >
              <el-button size="small" @click="doCancelUploadFolder"
                >取消</el-button
              >
            </div>
          </el-tab-pane> -->
          <el-tab-pane label="富文本" name="third">
            <el-form
              :model="richTextResForm"
              :rules="richTextResRules"
              ref="richTextResForm"
              label-width="90px"
              size="small"
              style="margin:0 90px;"
            >
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="richTextResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="resContent">
                <Ueditor
                  v-model.trim="richTextResForm.resContent"
                  :initialFrameHeight="initialFrameHeight"
                />
              </el-form-item>
              <!-- <el-form-item label="资源展示名" prop="matchpicname">
                <el-input
                  v-model.trim="uploadResForm.matchpicname"
                  size="small"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item> -->
              <el-form-item label="图例" prop="resNum">
                <el-input
                  v-model="richTextResForm.resNum"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="位置页码" prop="resPage">
                <el-input
                  v-model="richTextResForm.resPage"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="选择二维码">
                <el-select
                  v-model="richTextResForm.id"
                  style="display:block;"
                  @change="changeQrcodeRichText"
                  size="small"
                >
                  <el-option
                    v-for="item in qrcodeSelectList"
                    :key="item.id"
                    :label="item.qrcodeNickname"
                    :value="item.id"
                    :class="[item.bindFlag === 1 ? 'c-grey' : '']"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div style="text-align: center;">
              <el-button
                size="small"
                :loading="loading.uploadRichTextLoading"
                type="primary"
                @click="doUploadRichTextRes"
                >确定</el-button
              >
              <el-button size="small" @click="isUploadResShow = false"
                >取消</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <!-- 视频封面 -->
      <el-dialog
        :visible.sync="isShowSnapshot"
        :modal-append-to-body="false"
        width="900px"
        :close-on-click-modal="false"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>视频封面</div>
          </div>
        </template>
        <div class="move-main" style="height:400px;overflow-y: auto">
          <span>{{ snapshotForm.tsInfo }}</span>
          <el-row class="snapshot" :gutter="20">
            <el-col
              :span="6"
              v-for="(item, index) in snapshotShow"
              :label="item"
              :key="`img-${index}`"
            >
              <img :src="item" style="width:100%" />
              <el-radio :label="item" v-model="snapshotForm.selectedSnapshot"
                >&nbsp;</el-radio
              >
            </el-col>
          </el-row>
        </div>
        <span slot="footer">
          <el-button size="small" type="primary" @click="selectSnapshot"
            >确定</el-button
          >
          <el-button size="small" @click="isShowSnapshot = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 资源码 -->
      <el-dialog
        :visible.sync="isResQrcodeShow"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="850px"
        :close-on-click-modal="false"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>资源码管理</div>
          </div>
        </template>
        <el-form
          :inline="true"
          :model="ruleResQrcodeForm"
          :rules="resQrcodeRules"
          ref="ruleResQrcodeForm"
          size="small"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item label="数量" prop="num" label-width="60px">
            <el-input v-model.number="ruleResQrcodeForm.num"></el-input>
          </el-form-item>
          <!-- <el-form-item label="类型" prop="type" label-width="60px">
            <el-select v-model="ruleResQrcodeForm.type" style="width:100px">
              <el-option value="" label="公开"></el-option>
              <el-option value="1" label="不公开"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="creatQrcode">生成</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-bottom:5px;">
            <el-button
              type="success"
              @click="handleExportQrcode"
              size="small"
              v-if="qrcodeData.length > 0"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="qrcodeData"
          v-loading="loading.qrcodeLoading"
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column label="编号" align="center" width="200">
            <div slot-scope="scope" class="info">
              {{ textbook.tb_num + "-" + scope.row.qrcodeNickname }}
            </div>
          </el-table-column>
          <el-table-column
            prop="matchPicUrl"
            label="资源码"
            align="center"
            width="100"
          >
            <div slot-scope="scope">
              <el-popover placement="top-start" title="资源码" trigger="click">
                <div style="text-align:center;">
                  {{ textbook.tb_num }}-{{ scope.row.qrcodeNickname }}
                </div>
                <qrcode
                  :value="
                    `${baseUrlV3}/resource/resource/r/${scope.row.qrcode}`
                  "
                  :options="{ width: 200 }"
                ></qrcode>
                <i
                  slot="reference"
                  class="el-icon-picture"
                  style="font-size:30px; cursor: pointer;"
                ></i>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column
            label="所属资源"
            prop="resName"
            align="center"
            show-overflow-tooltip=""
          ></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="!scope.row.resName"
                @click="delQrcode(scope.row.id, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="tabelFooter">
          <div v-if="qrcodeData.length" class="right-footer-first">
            从{{ (qrcodePage.page - 1) * qrcodePage.pagesize + 1 }}到{{
              (qrcodePage.page - 1) * qrcodePage.pagesize + qrcodeData.length
            }}记录，共{{ qrcodePage.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="qrcodePage.total"
            :page-size="qrcodePage.pagesize"
            :current-page.sync="qrcodePage.page"
            background
            @current-change="loadQrCode"
          ></el-pagination>
        </div>
      </el-dialog>
      <!-- 修改资源 -->
      <el-dialog
        :visible.sync="isBookResShow"
        :modal-append-to-body="false"
        class="editModal"
        :close-on-click-modal="false"
        width="700px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>修改资源</div>
          </div>
        </template>
        <el-form
          size="small"
          :model="editResForm"
          style="margin:0 30px;"
          label-width="120px"
        >
          <el-form-item label="ID">{{ editResForm.resourceId }}</el-form-item>
          <el-form-item label="标签">{{ editResForm.uniqueId }}</el-form-item>
          <el-form-item label="资源">{{ editResForm.resName }}</el-form-item>
          <el-form-item label="资源码" v-if="editResForm.resType == 3">
            <el-collapse>
              <el-collapse-item title="点击下拉查看图片" name="1">
                <ul>
                  <li v-for="item in matchPicSelectList" :key="item.matchPicId">
                    <img :src="item.matchPicUrl" alt="" />
                    <div>
                      <el-radio
                        :label="item.matchPicId"
                        v-model="resRadio"
                        @change="matchPicRadio(item.matchPicId)"
                        >&nbsp;</el-radio
                      >
                      <div>{{ item.matchPicName }}</div>
                    </div>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="资源展示名" prop="matchpicname">
            <span slot="label"
              >资源展示名
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
                style="color:#333333;font-size:16px;cursor:pointer"
              >
                <div slot="content">资源在APP的教材资源里的名称</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <el-input
              v-model="editResForm.matchpicname"
              size="small"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="图序" prop="resName">
            <el-input v-model="editResForm.resNum" size="small"></el-input>
          </el-form-item>
          <el-form-item label="位置页码" prop="resName">
            <el-input v-model="editResForm.resPage" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资源码" v-if="editResForm.resType != 3">
            <el-select v-model="editResForm.tmpId" style="display:block;">
              <el-option
                v-for="item in qrcodeSelectList"
                :key="`edit-${item.id}`"
                :label="item.qrcodeNickname"
                :value="item.id"
                :class="[item.bindFlag === 1 ? 'c-grey' : '']"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="small" type="primary" @click="editBookResSure"
            >确定</el-button
          >
          <el-button size="small" @click="isBookResShow = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 编辑自测题 -->
      <jd-dialog
        :title="subjectForm.slsId > 0 ? '编辑题目' : '添加题目'"
        width="800px"
        :loading="loading.addSubject"
        :visible.sync="isEditTestShow"
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
                v-if="resActiveName == 'second'"
              >
                <el-option label="判断题" value="1"></el-option>
                <el-option label="单选题" value="2"></el-option>
                <el-option label="多选题" value="3"></el-option>
              </el-select>
              <el-select
                v-model="subjectForm.tSubject"
                style="width:100px"
                @change="typeChange"
                v-if="resActiveName == 'third'"
              >
                <el-option
                  v-for="type in types"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度系数">
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
            <el-form-item
              label="题目"
              prop="title"
              class="add-subject-form-item"
            >
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
                  class="add-subject-form-options options"
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
      <!-- 上传题目 -->
      <jd-dialog
        title="导入题目"
        :loading="loading.uploadWord"
        :visible.sync="isUploadSubjectsShow"
        @sure="uploadSubjectsSure"
      >
        <template slot="body">
          <div style="padding: 0 100px">
            <el-form label-width="70px">
              <el-form-item label="选择文件">
                <fileModal
                  ref="uploadWord"
                  @fileChange="uploadSubjectsChange"
                ></fileModal>
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
      <!-- 预览题目 -->
      <jd-dialog
        title="题目预览"
        :noFooter="true"
        :visible.sync="isPreviewShow"
      >
        <preview
          slot="body"
          :data="previewSubject"
          style="height:400px;overflow-y: auto"
        ></preview>
      </jd-dialog>
      <!-- 预览资源 -->
      <el-dialog
        :visible.sync="isViewResShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="handleCloseViewDialog"
        width="800px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>资源预览</div>
          </div>
        </template>
        <viewRes
          :data="viewResObj"
          :style="viewResObj.resType == 2 ? 'height:350px' : ''"
        ></viewRes>
      </el-dialog>
      <!-- 绑定题库 -->
      <el-dialog
        :visible.sync="isBindTikuShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>绑定题库</div>
          </div>
        </template>
        <!-- <span style="padding-left:75px">选择题库：</span> -->
        <div style="margin-top: 20px;text-align: center;">
          <el-radio v-model="tikuType" label="0">公共题库</el-radio>
          <el-radio v-model="tikuType" label="1">机构题库</el-radio>
          <!-- <el-select size="small" v-model="tikuType" @change="tikuTypeChange">
            <el-option label="公共题库" value="0"></el-option>
            <el-option label="机构题库" value="1"></el-option>
          </el-select> -->
        </div>
        <div style="margin-top: 20px;text-align: center;">
          <!-- @change="officialTikuChange" -->
          <el-cascader
            style="width:215px"
            size="small"
            v-if="tikuType == 1"
            placeholder="请选择机构题库"
            :key="isResourceShow"
            :options="officialTikuList"
            :props="officialProps"
            v-model="selectedOfficialTiku"
            clearable
          ></el-cascader>
          <el-cascader
            v-else
            style="width:215px"
            size="small"
            :clearable="true"
            placeholder="请选择公共题库"
            v-model="selectedTiku"
            :props="props"
            :options="tikuList"
            @change="handleChange"
          ></el-cascader>
        </div>
        <div
          v-if="tikuBindCode"
          style="margin-top: 20px;display:flex;justify-content:center"
        >
          <vue-qr
            :text="tikuBindCode"
            colorDark="#000"
            colorLight="#fff"
            :margin="0"
            :size="120"
          ></vue-qr>
        </div>
        <span slot="footer">
          <el-button
            :disabled="isDisable"
            size="small"
            type="primary"
            @click="doBindTiku"
            >绑定</el-button
          >
          <el-button
            :disabled="isDelBindDisable"
            size="small"
            @click="delBindTiku"
            >解绑</el-button
          >
        </span>
      </el-dialog>

      <!-- 绑定题库 -->
      <el-dialog
        v-if="isBindTikuShowNew"
        :visible.sync="isBindTikuShowNew"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        width="900px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>绑定题库</div>
          </div>
        </template>
        <div class="bind-container">
          <div class="bind-container-l">
            <div style="font-size:18px">公共题库:</div>
            <el-tree
              v-if="isBindTikuShowNew"
              ref="commonTree"
              :data="tikuList"
              show-checkbox
              node-key="sblId"
              @check-change="getCommonChecked"
              @check="handleCommonNode"
              :props="treeProps"
              :default-checked-keys="commonDefaultKeys"
              default-expand-all
            ></el-tree>
          </div>
          <div class="bind-container-r">
            <div style="font-size:18px">机构题库:</div>
            <el-tree
              ref="officialTree"
              :data="officialTikuList"
              show-checkbox
              node-key="sblId"
              @check="handleOfficialNode"
              :default-checked-keys="officialDefaultKeys"
              :props="officialTreeProps"
              check-strictly
              default-expand-all
            ></el-tree>
          </div>
          <!-- <div class="bind-container-r">
            <div style="font-size:18px">教材题库:</div>
            <el-tree
              ref="textBookTree"
              :data="textBookList"
              show-checkbox
              node-key="textbookId"
              @check="handleBookNode"
              :default-checked-keys="bookDefaultKeys"
              :props="bookTreeProps"
              default-expand-all
            ></el-tree>
          </div> -->
        </div>
        <span slot="footer">
          <el-button
            size="small"
            type="primary"
            :disabled="isDisableNew"
            :loading="loading.bindLoading"
            @click="doBindTikuMultiple"
            >绑定</el-button
          >
          <el-button size="small" @click="isBindTikuShowNew = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
    </el-container>
    <el-container class="chapterInfoBtm">
      <div class="chapterInfoBtm-box">
        <el-row>
          <el-col :span="12">
            <div class="materialTitle">
              教师资源包
              <el-button
                type="primary"
                style="margin-left:4px"
                @click="handleUploadMaterial(0)"
                class="el-icon-plus"
                size="mini"
                ><span style="margin-left:6px">上传</span></el-button
              >
              <div>此类资源包是提供教师下载的内容</div>
            </div>
            <div class="materialBody">
              <div
                v-for="item in teaResZipList"
                :key="item.id"
                style="font-size:14px"
              >
                <span>{{ item.resName }}</span>
                <span style="margin-left:15px">{{
                  materialSize(item.resSize)
                }}</span>
                <span style="margin:0 20px;">{{
                  materialTime(item.created)
                }}</span>
                <i
                  class="el-icon-close"
                  style="cursor:pointer"
                  @click="deleteMaterial(0, item.id)"
                ></i>
              </div>
              <div v-if="teaResZipList.length == 0">
                <span style="color:#666666;margin-left:15px;font-size:12px;"
                  >您还没有上传教师资源包</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="1">
            <div
              style="width:1px;background-color: #333;height:90%;margin-left:50%;margin-top:10px;"
            ></div>
          </el-col>
          <el-col :span="11">
            <div class="materialTitle">
              学习素材包
              <el-button
                type="primary"
                v-if="!stuCourseWare.id"
                style="margin-left:4px"
                @click="handleUploadMaterial(1)"
                class="el-icon-plus"
                size="mini"
                ><span style="margin-left:6px">上传</span></el-button
              >
              <div>素材包是提供教师，学生下载的内容</div>
            </div>
            <div class="materialBody">
              <div v-if="stuCourseWare.id" style="font-size:14px">
                <span>{{ stuCourseWare.resName }}</span>
                <span style="margin-left:15px">{{
                  materialSize(stuCourseWare.resSize)
                }}</span>
                <span style="margin:0 20px;">{{
                  materialTime(stuCourseWare.created)
                }}</span>
                <i
                  class="el-icon-close"
                  style="cursor:pointer"
                  @click="deleteMaterial(1, stuCourseWare.id)"
                ></i>
              </div>
              <div v-else>
                <span style="color:#666666;margin-left:15px;font-size:12px;"
                  >您还没有上传学习素材包</span
                >
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="1">
            <div
              style="width:1px;background-color: #333;height:90%;margin-left:50%;margin-top:10px;"
            ></div>
          </el-col> -->
          <!-- <el-col :span="7">
            <div class="materialTitle">
              教师资源包<el-button
                style="margin-left:4px"
                type="primary"
                @click="handleUploadMaterial(2)"
                class="el-icon-plus"
                size="mini"
                ><span style="margin-left:6px">上传</span></el-button
              >
              <div>资源包是提供教师下载的内容</div>
            </div>
            <div class="materialBody">
              <div
                v-for="item in teaResZipList"
                :key="item.id"
                style="font-size:14px"
              >
                <span>{{ item.resName }}</span>
                <span style="margin-left:15px">{{
                  materialSize(item.resSize)
                }}</span>
                <span style="margin:0 20px;">{{
                  materialTime(item.created)
                }}</span>
                <i
                  class="el-icon-close"
                  style="cursor:pointer"
                  @click="deleteMaterial(2, item.id)"
                ></i>
              </div>
              <div v-if="teaResZipList.length == 0">
                <span style="color:#666666;margin-left:15px;font-size:12px;"
                  >您还没有上传学习素材包</span
                >
              </div>
            </div>
          </el-col> -->
        </el-row>
      </div>
      <!-- 上传课程配套素材 -->
      <el-dialog
        :visible.sync="isMaterialShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="closeMaterial"
        v-if="isMaterialShow"
      >
        <template slot="title">
          <div>
            <div></div>
            <div v-if="isTeaAndStu == 0">教师资源包</div>
            <div v-if="isTeaAndStu == 1">学习素材包</div>
            <!-- <div v-if="isTeaAndStu == 2">教师资源包</div> -->
          </div>
        </template>
        <el-form label-width="70px" style="padding: 0 100px">
          <el-form-item label="选择文件">
            <fileModal
              ref="materialFile"
              @fileChange="materialFileChange"
              accept=".rar,.zip"
              :multiple="isTeaAndStu == 0"
            ></fileModal>
            <div v-if="materialForm.showProgress" style="margin-top:10px">
              {{ materialForm.name }}
            </div>
            <el-progress
              v-if="materialForm.showProgress"
              style="margin-top:10px"
              :percentage="materialForm.percentage"
            ></el-progress>
            <div class="el-upload__tip">
              建议上传压缩文件，单个文件大小不得超过500M
            </div>
            <div
              v-if="isTeaAndStu == 0 && !loading.materialLoading"
              class="el-upload__tip"
            >
              按住Ctrl键选中多个文件批量上传
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            size="small"
            type="primary"
            @click="doUploadMaterial"
            :loading="loading.materialLoading"
            >{{ loading.materialLoading ? "上传中" : "确定" }}</el-button
          >
          <el-button size="small" @click="doCancelMaterial">{{
            loading.materialLoading ? "取消上传" : "取消"
          }}</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format, dateStr, formatYMD } from "@/utils/datetime";
import jdialog from "@/components/jdialog";
import ckeditorConfig from "@/config/ckeditor_config.js";
import math from "@/components/jmath";
import fileModal from "@/components/fileModal";
import popver from "./popver";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import preview from "../tiku/previewSubject";
import viewRes from "@/components/viewRes";
import vueQr from "vue-qr";
import Ueditor from "@/components/ueditor";

export default {
  components: {
    popver,
    "jd-dialog": jdialog,
    "jd-math": math,
    fileModal,
    preview,
    viewRes,
    vueQr,
    Ueditor
  },
  props: {
    textbookId: "",
    newCount: 1
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
      teaResZipList: [], // 教师资源包列表
      folderResForm: {
        showProgress: false,
        percentage: 0,
        isSuccess: true,
        resourceId: "",
        resName: "",
        uniqueId: "",
        total: 0,
        done: 0,
        files: [],
        resNum: "",
        resPage: "",
        id: "",
        qrcode: ""
      },
      folderResRules: {
        resName: [
          { required: true, message: "请输入文件夹名称", trigger: "click" }
        ]
      },
      richTextResForm: {
        resName: "",
        resContent: "",
        resNum: "",
        resPage: "",
        id: "",
        qrcode: ""
      },
      richTextResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        resContent: [
          { required: true, message: "请输入资源内容", trigger: "click" }
        ]
      },
      initialFrameHeight: 160,
      textBookList: [], // 教材题库列表
      onlineList: [],
      onlinePage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      commonDefaultKeys: [],
      officialDefaultKeys: [],
      bookDefaultKeys: [],
      selectCommonNode: [],
      selectOfficialNode: [],
      selectBookNode: [],
      treeProps: {
        children: "sblTree",
        label: "name"
      },
      officialTreeProps: {
        children: "children",
        label: "name"
      },
      bookTreeProps: {
        children: "children",
        label: "textbookName"
      },
      isResourceShow: 0,
      tikuType: "0",
      selectedTiku: [],
      selectedOfficialTiku: 0,
      isBindTikuShow: false,
      isBindTikuShowNew: false,
      commonList: [],
      tikuList: [],
      officialTikuList: [],
      libId: 0,
      sblCourseId: 0,
      props: {
        value: "sblId",
        label: "name"
      },
      officialProps: {
        value: "sblId",
        label: "name",
        checkStrictly: true,
        emitPath: false
      },
      tikuBindCode: "",
      returnType: this.$route.query.returnType, //找体找资源返回的参数
      returnImportType: this.$route.query.belongType, //导题预览返回的类型
      uid: this.$store.state.user.userId,
      textbook: {},
      resRadio: "",
      highlightCurrent: true,
      resActiveName: "first",
      activeName: "first",
      isCatalogShow: false,
      isDelCatalogShow: false,
      isCatalog: false,
      isResQrcodeShow: false,
      isBookResShow: false,
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      loading: {
        bookResLoading: false,
        qrcodeLoading: false,
        bookTestLoading: false,
        addSubject: false,
        testSelectLoading: false,
        subjectsLoading: false,
        materialLoading: false,
        loadingFolderSure: false,
        uploadWord: false,
        uploadResFileLoading: false,
        uploadRichTextLoading: false,
        bindLoading: false // 在线刷题绑定题库
      },
      catalog: [],
      currentCatalog: {},
      defaultProps: {
        children: "catalog",
        label: "catelogContent"
      },
      ruleCatalogForm: {
        id: 1,
        catelogContent: "",
        pId: 1,
        catalogId: ""
      },
      newCatalogRules: {
        catelogContent: [
          { required: true, message: "请输入章名称", trigger: "blur" }
        ]
      },
      ruleResQrcodeForm: {
        num: "",
        type: ""
      },
      resQrcodeRules: {
        num: [
          { required: true, message: "请输入生成二维码数量", trigger: "click" },
          { type: "number", message: "请输入整数", trigger: "click" }
        ]
      },
      qrcodePage: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      resType: "",
      bookResData: [],
      resPage: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      //视频封面
      isShowSnapshot: false,
      snapshotForm: {
        selectedSnapshot: "",
        resourceId: "",
        tsInfo: ""
      },
      snapshotShow: [],
      resTypes: common.resTypes,
      uploadResType: common.resType,
      qrcodeSelectList: [],
      matchPicSelectList: [],
      qrcodeData: [],
      editResForm: {
        resType: "",
        resName: "",
        matchpicname: "",
        resChapter: "",
        resourceId: "",
        uniqueId: "",
        resNum: "",
        resPage: "",
        id: "",
        oldId: "",
        tmpId: ""
      },
      /*******************************************/
      /****************** 自测题 ******************/
      /*******************************************/
      testList: [],
      testPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      isEditTestShow: false,
      diffs: common.allRateLevel,
      types: common.types,
      previewSubject: {},
      isPreviewShow: false,
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
      // 选中删除的题目
      deleteTests: [],
      // 上传题目
      uploadWord: null,
      isUploadSubjectsShow: false,
      /*******************************************/
      /****************** 教材题库 ****************/
      /*******************************************/
      subjectsPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      subjectsSelectPage: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      deleteSubjects: [],
      subjectList: [],
      isEditSubjectShow: false,
      checked: [],
      /*******************************************/
      /****************** 教材资源 ****************/
      /*******************************************/
      // 腾讯云 上传
      vod: null,
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      taskList: [], // 常规资源任务列表
      uploader: null, // 视频音频上传存储对象
      materialForm: {
        showProgress: false,
        percentage: 0,
        file: null,
        resUrl: "",
        fileList: null, // 多文件上传列表
        name: ""
      },
      isMaterialShow: false,
      isTeaAndStu: 0, //是教师课件包0还是学生素材包1
      teaCourseWare: {}, //教师课件
      stuCourseWare: {}, //学习素材
      /*******************************************/
      /****************** 上传资源 ****************/
      /*******************************************/
      isUploadResShow: false,
      uploadResForm: {
        showProgress: false,
        percentage: 0,
        file: null,
        resType: "",
        resName: "",
        matchpicname: "",
        resNum: "",
        resPage: "",
        id: "",
        qrcode: ""
      },
      uploadResRules: {
        matchpicname: [
          { required: true, message: "请输入资源展示名", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    officialTikuList(val) {
      if (val.length == 0) {
        ++this.isResourceShow;
      }
    },
    textbookId: {
      handler(newName) {
        if (newName) {
          this.loadCatalog(newName);
          this.loadBookRes();
        }
      },
      immediate: true
    }
  },
  computed: {
    pubId() {
      return this.$store.state.user.currentRole.pubId;
    },
    roleId() {
      return this.$store.state.user.currentRole.roleId;
    },
    isDisable() {
      if (this.tikuType == 0) {
        return !this.selectedTiku[1];
      } else {
        return this.selectedOfficialTiku === 0;
      }
    },
    isDisableNew() {
      return (
        this.selectCommonNode.length === 0 &&
        this.selectOfficialNode.length === 0 &&
        this.selectBookNode.length === 0
      );
    },
    isDelBindDisable() {
      if (!this.libId && !this.selectedTiku[1]) {
        return true;
      } else {
        return false;
      }
    },
    baseUrlV2() {
      return process.env.BASE_URL_V2;
    },
    baseUrlV3() {
      return process.env.BASE_URL_V3;
    }
  },
  methods: {
    // 防止节点成为子节点
    allowDrop(draggingNode, dropNode, type) {
      return type != "inner";
    },
    onDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log(draggingNode, dropNode, dropType, ev);
      axios
        .request({
          method: "post",
          url: "/book/catalog/sort",
          data: {
            catalogListJson: JSON.stringify(this.catalog)
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 关闭文件夹上传
    doCancelUploadFolder() {
      if (this.loading.loadingFolderSure) {
        this.$message({
          type: "warning",
          message: "当前正在上传文件夹，上传完成才可关闭弹窗!"
        });
      } else {
        this.isUploadResShow = false;
      }
    },
    // 确定上传文件夹
    doUploadFolder() {
      this.$refs["folderResForm"].validate(valid => {
        if (valid) {
          if (this.folderResForm.isSuccess) {
            if (this.folderResForm.files.length > 0) {
              this.loading.loadingFolderSure = true;
              this.folderResForm.total = this.folderResForm.files.length;
              this.folderResForm.done = 0;
              this.folderResForm.showProgress = true;
              this.folderResForm.isSuccess = false;
              this.folderResForm.files.forEach((value, index, files) => {
                if (value.type === 1 || value.type === 2) {
                  // 音频和视频 用VOD上传
                  let uploader = this.vod.upload({
                    mediaFile: value.file // file是js的文件引用
                  });
                  uploader.on("media_progress", info => {
                    let p = Number(info.percent) * 100;
                    value.percentage = p;
                  });
                  uploader.done().then(info => {
                    value.url = info.video.url;
                    value.cloudId = info.fileId;
                    this.folderFileSubmit();
                  });
                } else {
                  // 其他的 用COS上传
                  let path = `${dateStr("YYYYMM")}/${value.originName}`;
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: value.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        value.percentage = p;
                      }
                    },
                    (err, result) => {
                      if (!err) {
                        value.url = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        this.folderFileSubmit();
                      } else {
                        console.log(err);
                      }
                    }
                  );
                }
              });
            } else {
              this.$message({
                type: "warning",
                message: "该文件夹为空"
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: "请先等待上传完成"
            });
          }
        }
      });
    },
    // 上传的文件夹提交到数据库
    folderFileSubmit() {
      this.folderResForm.done++;
      if (this.folderResForm.total === this.folderResForm.done) {
        axios
          .request({
            method: "post",
            // url: "/v1/resourceLibrary/addFolderResource",  ？？？？
            data: {
              // rlId: this.currentResLib.rlId,
              resName: this.folderResForm.resName,
              files: JSON.stringify(this.folderResForm.files)
            }
          })
          .then(res => {
            let ret = res.data;
            this.folderResForm.isSuccess = true;
            setTimeout(() => {
              this.loading.loadingFolderSure = false;
            }, this.global.btnResumeTime);
            this.isUploadResShow = false;
            if (ret.code == 200) {
              this.loadBookRes();
            }
          });
      }
      // this.disableTabPane.elTabPane1 = false;
      // this.disableTabPane.elTabPane3 = false;
      // this.disableTabPane.elTabPane4 = false;
    },
    // 文件夹改变
    folderFileChange(event) {
      let array = [];
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        let tmp = {};
        tmp.file = files[i];
        tmp.type = this.toResType(tmp.file.type);
        tmp.size = tmp.file.size;
        tmp.originName = tmp.file.webkitRelativePath;
        tmp.percentage = 0;
        array.push(tmp);
      }
      this.folderResForm.files = array;
    },
    editRow(row) {
      row.isEdit = true;
    },
    saveRow(row) {
      let { catSbId, sort } = row;
      axios
        .request({
          method: "post",
          url: "/tiku/v1/catSb/editSort",
          data: {
            catSbId,
            sort
          }
        })
        .then(data => {
          let ret = data.data;
          if (ret.code === 200) {
            row.isEdit = false;
            this.$message({
              type: "success",
              message: "保存成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 上传富文本
    doUploadRichTextRes() {
      this.$refs["richTextResForm"].validate(valid => {
        if (valid) {
          this.loading.uploadRichTextLoading = true;
          axios
            .request({
              method: "post",
              url: "/v1/resource/addRes",
              data: {
                id: this.richTextResForm.id,
                qrcode: this.richTextResForm.qrcode,
                resDesc: this.richTextResForm.resContent,
                resType: 15,
                resName: this.richTextResForm.resName,
                matchpicname: this.richTextResForm.resName,
                resNum: this.richTextResForm.resNum,
                resPage: this.richTextResForm.resPage,
                tbId: this.textbookId,
                resChapter: this.currentCatalog.catalogId
              }
            })
            .then(res => {
              let ret = res.data;
              this.isUploadResShow = false;
              this.loading.uploadRichTextLoading = false;
              if (ret.code == 200) {
                this.loadBookRes();
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
            });
        }
      });
    },
    // 获取题库列表
    getAllTikuList() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/queryBindTreeList",
          data: {
            bookId: this.textbookId
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            this.tikuList = res.data.common;
            this.officialTikuList = res.data.org;
          } else {
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
        });
    },
    // 获取教材列表
    getBookList() {
      axios
        .request({
          method: "post",
          url: "/book/v4/textbook/verifiedSubjectList",
          data: {
            keyWord: "",
            pubId: this.roleId === 25 && this.pubId ? this.pubId : "",
            isEditor: this.roleId === 26 ? 1 : ""
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code == 200) {
            res.data.forEach(item => {
              item.children = [];
            });
            this.textBookList = res.data;
          }
        });
    },
    // 获取在线刷题已绑题库列表
    getOnlineList() {
      let data = {
        page: this.onlinePage.page,
        pageSize: this.onlinePage.pageSize,
        bookId: this.textbookId
      };
      axios
        .request({
          method: "post",
          url: "/book/bookSubjectLibrary/queryBindInfoPage",
          data
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data.code) {
              this.tikuBindCode = ret.data.code;
            } else {
              this.tikuBindCode = "";
            }
            this.onlineList = ret.data.dataList ? ret.data.dataList : [];
            this.onlinePage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    handleCommonNode(data, node) {
      let { checkedNodes } = node;
      let arr = [];
      checkedNodes.forEach(item => {
        if (item.sblId) {
          arr.push(item);
        }
      });
      this.selectCommonNode = arr;
    },
    getCommonChecked(data, status) {
      // console.log(data, status);
    },
    handleOfficialNode(data, node) {
      let { checkedNodes } = node;
      this.selectOfficialNode = checkedNodes;
    },
    handleBookNode(data, node) {
      let { checkedNodes } = node;
      this.selectBookNode = checkedNodes;
    },
    officialTikuChange(val) {
      console.log(val);
    },
    tikuTypeChange(val) {
      console.log(val);
    },
    //绑定题库
    async handleBindTiku() {
      await this.getTikuBindDialog();
      this.isBindTikuShow = true;
    },
    //绑定题库
    async handleBindTikuNew() {
      await this.getTikuBindDialogMultiple();
      // this.isBindTikuShowNew = true;
    },
    handleChange(value) {
      this.sblCourseId = this.getSblSubjectId(value[1]);
    },
    getSblSubjectId(sblId) {
      for (let i = 0; i < this.commonList.length; i++) {
        let item = this.commonList[i];
        console.log(this.selectedTiku[1]);
        if (item.id == sblId) {
          return item.sblCourseId;
        }
      }
      return undefined;
    },
    // 在线刷题解绑题库
    delBindTikuNew(row) {
      this.$confirm("确定要解绑所选题库吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/book/bookSubjectLibrary/unBind",
              data: {
                bookId: this.textbookId,
                bindId: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.getOnlineList();
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
    // 解除绑定
    delBindTiku() {
      if (this.libId == -1 || this.libId == -2) {
        this.$message({
          type: "warning",
          message: "当前教材未绑定题库"
        });
        return;
      }
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/delBingLibrary",
          data: {
            bookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isBindTikuShow = false;
            this.getTikuBind();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 在线刷题绑定题库(多个)
    doBindTikuMultiple() {
      let bindCommonJsonArr = [];
      let bindOrgArr = [];
      this.selectCommonNode.forEach(item => {
        bindCommonJsonArr.push({
          sblId: item.sblId,
          courseId: item.sblCourseId
        });
      });
      this.selectOfficialNode.forEach(item => {
        bindOrgArr.push({
          sblId: item.sblId
        });
      });
      this.loading.bindLoading = true;
      axios
        .request({
          method: "post",
          url: "/book/bookSubjectLibrary/bind",
          data: {
            bookId: this.textbookId,
            bindCommonJson: JSON.stringify(bindCommonJsonArr),
            bindOrgJson: JSON.stringify(bindOrgArr)
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            var CountEvent = window.JAnalyticsInterface.Event.CountEvent;
            var cEvent = new CountEvent("bind_lib");
            window.JAnalyticsInterface.onEvent(cEvent);
            this.loading.bindLoading = false;
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isBindTikuShowNew = false;
            this.getOnlineList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    doBindTiku() {
      if (this.tikuType == 0) {
        if (!this.selectedTiku[1]) {
          this.$message({
            type: "warning",
            message: "请选择将要绑定的公共题库"
          });
          return;
        }
      } else {
        if (this.selectedOfficialTiku === 0) {
          this.$message({
            type: "warning",
            message: "请选择将要绑定的机构题库"
          });
          return;
        }
      }

      // status=1 绑定公共题库   status=2 绑定机构题库
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/bookBingLibrary",
          data: {
            bookId: this.textbookId,
            sblId:
              this.tikuType == 0
                ? this.selectedTiku[1]
                : this.selectedOfficialTiku,
            courseId: this.tikuType == 0 ? this.sblCourseId : 0,
            status: this.tikuType == 0 ? 1 : 2
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.isBindTikuShow = false;
            this.getTikuBind();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getOfficialTikuList() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/getTKSubjectList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.officialTikuList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTikuList() {
      this.tikuList = [];
      axios
        .request({
          method: "post",
          url: "/subject/subjectBankLibrary/commonList"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.commonList = ret.data;
            let banks = [];
            ret.data.forEach(element => {
              let flag = 0;
              for (let i = 0; i < banks.length; i++) {
                let temp = banks[i];
                if (temp.subjectId == element.sblSubjectId) {
                  temp.children.push({
                    sblId: element.id,
                    name: element.sblName,
                    courseId: element.sblCourseId
                  });
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                banks.push({
                  subjectId: element.sblSubjectId,
                  name: element.sblSubjectName,
                  children: [
                    {
                      sblId: element.id,
                      name: element.sblName,
                      courseId: element.sblCourseId
                    }
                  ]
                });
              }
            });
            banks.sort((a, b) => a.subjectId - b.subjectId);
            this.tikuList = banks;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTikuBindDialogMultiple() {
      axios
        .request({
          method: "post",
          url: "/v1/subjectBankLibrary/queryBindTreeList",
          data: {
            bookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.isBindTikuShowNew = true;
            if (ret.data.bindList.length > 0) {
              let commonArr = [];
              let officialArr = [];
              ret.data.bindList.forEach(item => {
                if (item.status === 1) {
                  commonArr.push(item);
                } else {
                  officialArr.push(item);
                }
              });
              // 公共题库
              let commonDefaultKeysArr = [];
              let selectCommonNodeArr = [];
              commonArr.forEach(i => {
                commonDefaultKeysArr.push(i.sblId);
                selectCommonNodeArr.push({
                  sblId: i.sblId,
                  sblCourseId: i.courseId
                });
              });
              this.commonDefaultKeys = commonDefaultKeysArr;
              this.selectCommonNode = selectCommonNodeArr;

              // 机构题库
              let officialDefaultKeysArr = [];
              let selectOfficialNodeArr = [];
              officialArr.forEach(i => {
                officialDefaultKeysArr.push(i.sblId);
                selectOfficialNodeArr.push({
                  sblId: i.sblId
                });
              });
              this.officialDefaultKeys = officialDefaultKeysArr;
              this.selectOfficialNode = selectOfficialNodeArr;
            } else {
              this.selectCommonNode = [];
              this.selectOfficialNode = [];
              //   this.selectBookNode = [];
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTikuBindDialog() {
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/getBingLibrary",
          data: {
            bookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data.length > 0) {
              if (ret.data[0].status === 1) {
                // 公共题库
                this.tikuType = "0";
                this.selectedTiku = [undefined, ret.data[0].sblId];

                this.tikuBindCode = ret.data[0].code;
                this.libId = 0;
                this.libId = ret.data[0].sblId ? ret.data[0].sblId : -2;
                if (ret.data[0].sblId) {
                  this.sblCourseId = this.getSblSubjectId(ret.data[0].sblId);
                }
              } else {
                // 机构题库
                this.tikuType = "1";
                this.selectedOfficialTiku = ret.data[0].sblId;
                this.tikuBindCode = ret.data[0].code;
                this.libId = 0;
                this.libId = ret.data[0].sblId ? ret.data[0].sblId : -2;
              }
            } else {
              this.selectedTiku = [];
              this.tikuBindCode = "";
              this.libId = -1;
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    getTikuBind() {
      axios
        .request({
          method: "post",
          url: "/book/v1/textbook/getBingLibrary",
          data: {
            bookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (ret.data.length > 0) {
              this.tikuBindCode = ret.data[0].code;
            } else {
              this.tikuBindCode = "";
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 从找题或者找资源返回当前页执行方法
    isTestOrRes(catalog) {
      if (this.returnType == 1) {
        this.$refs.resourceTab.currentName = "first";
      }
      if (this.returnType == 2) {
        this.$refs.resourceTab.currentName = "second";
      }
      if (this.returnType == 3) {
        this.$refs.resourceTab.currentName = "third";
      }
      if (this.$route.query.returnCatalogId) {
        catalog.forEach(element => {
          if (element.catalogId == this.$route.query.returnCatalogId) {
            this.handleNodeClick(element);
            this.$nextTick(() => {
              this.$refs.vueCatalogTree.setCurrentKey(
                this.$route.query.returnCatalogId
              );
            });
          }
        });
      }
    },
    // 从导入题目返回当前页执行方法
    isImportReturn(catalog) {
      if (this.returnImportType == 3) {
        this.$refs.resourceTab.currentName = "second";
      }
      if (this.returnImportType == 2) {
        this.$refs.resourceTab.currentName = "third";
      }
      if (this.$route.query.belongId) {
        catalog.forEach(element => {
          if (element.catalogId == this.$route.query.belongId) {
            this.handleNodeClick(element);
            this.$nextTick(() => {
              this.$refs.vueCatalogTree.setCurrentKey(
                this.$route.query.belongId
              );
            });
          }
        });
      }
    },
    // 加载目录信息
    loadCatalog() {
      axios
        .request({
          method: "post",
          url: "/book/textbook/detail",
          data: {
            id: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.catalog = ret.data.catalog;
            this.textbook = ret.data;
            if (this.isCatalog) {
              this.$nextTick(() => {
                this.$refs.vueCatalogTree.setCurrentKey(
                  this.currentCatalog.catalogId
                );
              });
            }
            if (ret.data.catalog) {
              for (var i = 0; i < ret.data.catalog.length; i++) {
                if (
                  Number(this.ruleCatalogForm.id) <
                  Number(ret.data.catalog[i].id)
                ) {
                  this.ruleCatalogForm.id = ret.data.catalog[i].id;
                }
              }
            }
            if (this.returnType) {
              this.isTestOrRes(this.catalog); // 从找题或者找资源返回当前页执行方法
            }
            if (this.returnImportType) {
              this.isImportReturn(this.catalog); // 从导题预览返回
            }
          }
        });
    },
    //切换tab
    tabClick(item) {
      if (item.name === "second") {
        if (this.testList.length == 0) {
          this.loadTests();
        }
      } else if (item.name === "third") {
        if (this.subjectList.length == 0) {
          this.loadBookSubjects();
        }
      } else if (item.name === "fourth") {
        // this.getTikuBind();
        this.getOnlineList();
        this.getAllTikuList();
        // this.getTikuList();
        // this.getOfficialTikuList();
        // this.getBookList();
      }
    },
    //新建章
    addCatalog() {
      this.ruleCatalogForm.catelogContent = "";
      this.ruleCatalogForm.catalogId = "";
      this.isCatalogShow = true;
      this.$nextTick(() => {
        this.$refs.ruleCatalogForm.clearValidate();
      });
    },
    //确定新建/编辑章
    addCatalogSure() {
      this.$refs["ruleCatalogForm"].validate(valid => {
        if (valid) {
          if (
            this.ruleCatalogForm.catelogContent.split(" ").join("").length == 0
          ) {
            this.$message({
              type: "warning",
              message: "请输入章名称"
            });
            return;
          }
          this.ruleCatalogForm.id++;
          let data = {};
          let url = "";
          if (this.ruleCatalogForm.catalogId.length > 0) {
            url = "/book/catalog/update";
            data.catalogId = this.ruleCatalogForm.catalogId;
            data.catelogContent = this.ruleCatalogForm.catelogContent;
          } else {
            url = "/book/catalog/insert";
            data.id = this.ruleCatalogForm.id;
            data.catelogContent = this.ruleCatalogForm.catelogContent;
            data.pId = this.ruleCatalogForm.pId;
            data.textbookId = this.textbookId;
          }
          axios
            .request({
              method: "post",
              url: process.env.BASE_URL + url,
              data: data
            })
            .then(
              function(data) {
                let res = data.data;
                if (res.code == 200) {
                  this.isCatalogShow = false;
                  this.loadCatalog();
                }
              }.bind(this)
            );
        }
      });
    },
    popoverClick(index, bank) {
      if (index == "1") {
        this.ruleCatalogForm.catelogContent = bank.catelogContent;
        this.ruleCatalogForm.catalogId = bank.catalogId;
        this.ruleCatalogForm.id = bank.id;
        this.isCatalogShow = true;
        this.$nextTick(() => {
          this.$refs.ruleCatalogForm.clearValidate();
        });
      } else if (index == "2") {
        this.ruleCatalogForm.catalogId = bank.catalogId;
        this.isDelCatalogShow = true;
      }
    },
    //确定删除章
    delCatalogSure() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/book/catalog/delete",
          data: { catalogId: this.ruleCatalogForm.catalogId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.isDelCatalogShow = false;
              this.loadCatalog();
              if (
                this.ruleCatalogForm.catalogId == this.currentCatalog.catalogId
              ) {
                if (this.currentCatalog.catalogId) {
                  this.currentCatalog = {};
                  this.resType = "";
                  this.isCatalog = false;
                  this.highlightCurrent = false;
                  this.resPage.page = 1;
                  this.loadBookRes();
                  this.testPage.page = 1;
                  this.loadTests();
                  this.subjectsPage.page = 1;
                  this.loadBookSubjects();
                }
              }
            }
          }.bind(this)
        );
    },
    //资源码 按钮
    resQrcode() {
      this.ruleResQrcodeForm.num = "";
      this.qrcodePage.page = 1;
      this.qrcodeData = [];
      this.loadQrCode();
      this.isResQrcodeShow = true;
    },
    //加载二维码列表
    loadQrCode() {
      this.loading.qrcodeLoading = true;
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/qrCodeInfoListWithCount",
          data: {
            textbookId: this.textbookId,
            page: this.qrcodePage.page,
            pagesize: this.qrcodePage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.qrcodeLoading = false;
          if (ret.code === 200) {
            this.qrcodeData = ret.data.data;
            this.qrcodePage.total = ret.data.total;
          }
        });
    },
    //生成资源二维码
    creatQrcode() {
      this.$refs.ruleResQrcodeForm.validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/resource/tbMatchPic/createQrCodeBatch",
              data: {
                textbookId: this.textbookId,
                num: this.ruleResQrcodeForm.num
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.qrcodeData = [];
                this.qrcodePage.page = 1;
                this.loadQrCode();
              }
            });
        } else {
          return false;
        }
      });
    },
    //导出二维码
    handleExportQrcode() {
      let url =
        process.env.BASE_URL +
        "/resource/tbMatchPic/downloadTextbookAndResZip?textbookId=" +
        this.textbookId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    //删除二维码
    delQrcode(rowId, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/resource/tbMatchPic/delete",
              data: {
                id: rowId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                if (this.qrcodePage.page != 1 && this.qrcodeData.length == 1) {
                  this.qrcodePage.page--;
                }
                this.loadQrCode();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 导出excel
    exportExcel() {
      let url =
        process.env.BASE_URL +
        "/resource/tbMatchPic/exportExcel?textbookId=" +
        this.textbookId +
        "&token=" +
        this.$store.state.user.token;
      let elemIF = window.document.createElement("iframe");
      elemIF.src = url;
      elemIF.style.display = "none";
      window.document.body.appendChild(elemIF);
    },
    // 加载教材资源列表
    loadBookRes() {
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/infoListWithCount",
          data: {
            textbookId: this.textbookId,
            resType: this.resType,
            chapterId: this.currentCatalog.catalogId
              ? this.currentCatalog.catalogId
              : "",
            page: this.resPage.page,
            pagesize: this.resPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookResData = ret.data.data;
            this.resPage.total = ret.data.total;
          }
        });
    },
    //查看资源
    handleViewRes(row) {
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    //修改资源
    editBookRes(row) {
      if (row.resType == 3) {
        this.loadMatchPic(row.resourceid);
      } else {
        this.loadUnusedQrcode(row);
      }
      this.editResForm.resName = row.resName;
      this.editResForm.resType = row.resType;
      this.editResForm.matchpicname = row.matchpicname
        ? row.matchpicname
        : row.resName;
      this.editResForm.resNum = row.resNum;
      this.editResForm.resPage = row.resPage;
      this.editResForm.resChapter = row.resChapter;
      this.editResForm.resourceId = row.resourceid;
      this.editResForm.uniqueId = row.uniqueId;
      this.editResForm.id = row.id;
      this.editResForm.oldId = row.id;
      this.isBookResShow = true;
    },
    //确定修改资源事件
    editBookResSure() {
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/update",
          data: {
            textbookId: this.textbookId,
            id: this.editResForm.tmpId
              ? this.editResForm.tmpId
              : this.editResForm.id,
            oldId: this.editResForm.oldId,
            resChapter: this.editResForm.resChapter,
            resourceId: this.editResForm.resourceId,
            matchPicId: this.editResForm.matchPicId
              ? this.editResForm.matchPicId
              : "",
            matchPicName: this.editResForm.matchpicname,
            resName: this.editResForm.resName,
            resNum: this.editResForm.resNum ? this.editResForm.resNum : "",
            resPage: this.editResForm.resPage ? this.editResForm.resPage : ""
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loadBookRes();
            this.isBookResShow = false;
          }
        });
    },
    //删除资源事件
    delBookRes(row) {
      this.$confirm("此操作将解绑该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/resource/tbMatchPic/removeResource",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                if (this.resPage.page != 1 && this.bookResData.length == 1) {
                  this.resPage.page--;
                }
                this.loadBookRes();
                this.$message({
                  type: "success",
                  message: "解绑成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //table资源类型
    formatResType(row) {
      return common.resTypeFormat(row.resType);
    },
    resTypeChange() {
      this.resPage.page = 1;
      this.loadBookRes();
    },
    // 点击章节item
    handleNodeClick(bank) {
      this.isCatalog = true;
      this.highlightCurrent = true;
      if (bank.catalogId === this.currentCatalog.catalogId) {
        return;
      }
      this.currentCatalog = bank;
      let current = this.$refs.resourceTab.currentName;
      if (current === "first") {
        this.resType = "";
        this.resPage.page = 1;
        this.loadBookRes();
      } else if (current === "second") {
        this.testPage.page = 1;
        this.loadTests();
      } else if (current === "third") {
        this.subjectsPage.page = 1;
        this.loadBookSubjects();
      }
    },
    // 点击图书名
    clickBook() {
      if (this.currentCatalog.catalogId) {
        this.currentCatalog = {};
        this.resType = "";
        this.isCatalog = false;
        this.highlightCurrent = false;
        let current = this.$refs.resourceTab.currentName;
        if (current === "first") {
          this.resType = "";
          this.resPage.page = 1;
          this.loadBookRes();
        } else if (current === "second") {
          this.testPage.page = 1;
          this.loadTests();
        } else if (current === "third") {
          this.subjectsPage.page = 1;
          this.loadBookSubjects();
        }
      }
    },
    //上传资源
    uploadRes() {
      // 清空文件夹表单
      this.folderResForm.showProgress = false;
      this.folderResForm.percentage = 0;
      this.folderResForm.isSuccess = true;
      this.folderResForm.resourceId = "";
      this.folderResForm.resName = "";
      this.folderResForm.uniqueId = "";
      this.folderResForm.total = 0;
      this.folderResForm.done = 0;
      this.folderResForm.files = [];
      this.folderResForm.resNum = "";
      this.folderResForm.resPage = "";
      this.folderResForm.id = "";
      this.folderResForm.qrcode = "";
      // 清空 常规资源表单
      if (
        this.uploadResForm.percentage >= 100 ||
        this.uploadResForm.percentage <= 0
      ) {
        this.uploadResForm.resName = "";
        this.uploadResForm.matchpicname = "";
        this.uploadResForm.resType = "";
        this.uploadResForm.id = "";
        this.uploadResForm.resNum = "";
        this.uploadResForm.resPage = "";
        this.uploadResForm.showProgress = false;
        this.uploadResForm.percentage = 0;
        this.richTextResForm.resName = "";
        this.richTextResForm.resContent = "";
        this.richTextResForm.resNum = "";
        this.richTextResForm.resPage = "";
        this.richTextResForm.id = "";
        this.richTextResForm.qrcode = "";
        this.$nextTick(() => {
          if (this.$refs.uploadResfileModal) {
            this.$refs.uploadResfileModal.clearFile();
          }
        });
      }
      this.loadUnusedQrcode();
      this.isUploadResShow = true;
      this.$nextTick(() => {
        this.$refs.uploadResForm.clearValidate();
        this.$refs.folderResForm.clearValidate();

        this.$refs.richTextResForm.clearValidate();
      });
    },
    //上传文件的类型
    formatResTypeName(resType) {
      return common.resTypeFormat(resType);
    },
    uoloadFileChange(file) {
      if (file) {
        this.uploadResForm.resName = file.name.substring(
          0,
          file.name.lastIndexOf(".")
        );
        this.uploadResForm.file = file;
        this.uploadResForm.resSize = file.size;
        this.uploadResForm.originalName = file.name;
        this.uploadResForm.resType = `${this.toResType(file.type)}`;
        //上传文件名就是资源展示名
        this.uploadResForm.matchpicname = file.name.substring(
          0,
          file.name.lastIndexOf(".")
        );
      } else {
        this.uploadResForm.resName = "";
        this.uploadResForm.file = null;
        this.uploadResForm.resSize = "";
        this.uploadResForm.originalName = "";
        this.uploadResForm.resType = "";
      }
    },
    uploadResSure() {
      this.$refs["uploadResForm"].validate(valid => {
        if (valid) {
          if (this.uploadResForm.file) {
            this.uploadResForm.showProgress = true;
            this.loading.uploadResFileLoading = true;
            this.uploadResForm.cloudId = "";
            if (
              this.uploadResForm.resType === "1" ||
              this.uploadResForm.resType === "2"
            ) {
              // 音频和视频 用VOD上传
              this.uploader = this.vod.upload({
                mediaFile: this.uploadResForm.file // file是js的文件引用
              });
              this.uploader.on("media_progress", info => {
                let p = Number(info.percent) * 100;
                this.uploadResForm.percentage = parseFloat(p.toFixed(2));
              });
              this.uploader
                .done()
                .then(info => {
                  this.uploader = null;
                  this.uploadResForm.resUrl = info.video.url;
                  this.uploadResForm.cloudId = info.fileId;
                  this.uploadResFile();
                })
                .catch(() => {
                  this.loading.uploadResFileLoading = false;
                  this.uploadResForm.showProgress = false;
                  this.uploadResForm.percentage = 0;
                  this.uploadResForm.cloudId = "";
                  this.$message({
                    type: "warning",
                    message: "不支持的音视频类型"
                  });
                });
            } else {
              // 其他的 用COS上传
              // let path = dateStr("YYYYMM") + "/" + this.uploadResForm.file.name
              let path =
                dateStr("YYYYMM") +
                "/" +
                this.$store.state.user.userId +
                new Date().valueOf() +
                common.getFileType(this.uploadResForm.file.name);
              this.cos.putObject(
                {
                  Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
                  Region: this.cosConfig.region,
                  Key: path,
                  StorageClass: "STANDARD",
                  Body: this.uploadResForm.file,
                  onProgress: curr => {
                    let p = Number(curr.percent) * 100;
                    this.uploadResForm.percentage = p;
                  }
                },
                (err, result) => {
                  this.taskList = [];
                  if (!err) {
                    this.uploadResForm.resUrl = encodeURI(
                      `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                    );
                    this.uploadResFile();
                  } else {
                  }
                }
              );
              this.taskList = this.cos.getTaskList();
            }
          } else {
            this.$message({
              type: "warning",
              message: "请选择上传文件"
            });
          }
        }
      });
    },
    // 取消上传资源
    doCancelUploadRes() {
      if (this.loading.uploadResFileLoading) {
        if (this.uploader && this.uploadResForm.cloudId) {
          this.uploader.cancel();
        }
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.uploadResForm.showProgress = false;
        this.uploadResForm.percentage = 0;
        this.loading.uploadResFileLoading = false;
      } else {
        this.isUploadResShow = false;
      }
    },
    // 关闭上传资源弹框之前执行
    handleCloseUploadModalBefore() {
      if (this.loading.uploadResFileLoading == false) {
        this.isUploadResShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    //显示视频封面
    showSnapshot(row) {
      this.isShowSnapshot = true;
      this.snapshotForm.resourceId = row.resourceid;
      axios
        .request({
          method: "post",
          url: "/v1/upload/snapshotShow",
          data: {
            fileId: row.cloudId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.snapshotShow = ret.data;
            this.snapshotForm.tsInfo = "";
          } else {
            this.snapshotForm.tsInfo = "暂无封面信息，正在转码中，请稍后...";
          }
        });
    },
    //确定上传视频封面
    selectSnapshot() {
      axios
        .request({
          method: "post",
          url: "/v1/resource/modify",
          data: {
            resourceId: this.snapshotForm.resourceId,
            designPic: this.snapshotForm.selectedSnapshot
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.isShowSnapshot = false;
            this.loadBookRes();
          }
        });
    },
    // 常规资源保存到数据库
    uploadResFile() {
      axios
        .request({
          method: "post",
          url: "/v1/resource/addRes",
          data: {
            id: this.uploadResForm.id,
            qrcode: this.uploadResForm.qrcode,
            resUrl: this.uploadResForm.resUrl,
            resSize: this.uploadResForm.resSize,
            resType: this.uploadResForm.resType,
            resName: this.uploadResForm.resName,
            matchpicname: this.uploadResForm.matchpicname,
            resNum: this.uploadResForm.resNum,
            resPage: this.uploadResForm.resPage,
            cloudId: this.uploadResForm.cloudId,
            tbId: this.textbookId,
            resChapter: this.currentCatalog.catalogId
          }
        })
        .then(res => {
          let ret = res.data;
          this.isUploadResShow = false;
          this.loading.uploadResFileLoading = false;
          if (ret.code == 200) {
            this.loadBookRes();
          }
        });
    },
    /**
     * 根据文件类型 转换成 资源类型
     */
    toResType(fileType) {
      let type = 0;
      if (fileType.indexOf("image") === 0) {
        type = 10;
      } else if (fileType.indexOf("video") === 0) {
        type = 2;
      } else if (fileType.indexOf("audio") === 0) {
        type = 1;
      } else if (fileType.indexOf("application/pdf") === 0) {
        type = 9;
      } else if (
        fileType.indexOf("application/msword") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) === 0
      ) {
        type = 7;
      } else if (
        fileType.indexOf("application/mssheet") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) === 0
      ) {
        type = 4;
      } else if (fileType.indexOf("text/html") === 0) {
        type = 5;
      } else if (
        fileType.indexOf("application/vnd.ms-powerpoint") === 0 ||
        fileType.indexOf(
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) === 0
      ) {
        type = 6;
      }
      return type;
    },
    //找资源
    handleSearchRes() {
      this.$router.push({
        path: "/publication/searchRes",
        query: {
          textbookId: this.textbookId,
          bookNum: this.textbook.tb_num,
          catalogId: this.currentCatalog.catalogId
        }
      });
    },
    //加载未使用的二维码
    loadUnusedQrcode(row) {
      this.editResForm.tmpId = "";
      axios
        .request({
          method: "post",
          url: "/resource/tbMatchPic/getUnusedQrCode",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            ret.data.forEach(element => {
              element.qrcodeNickname = `${this.textbook.tb_num}-${element.qrcodeNickname}`;
            });
            if (row && row.qrcodeNickname) {
              ret.data.unshift({
                id: row.id,
                qrcodeNickname: `${this.textbook.tb_num}-${row.qrcodeNickname}`
              });
              this.editResForm.tmpId = row.id;
            }
            this.qrcodeSelectList = ret.data;
          }
        });
    },
    //加载比对图片
    loadMatchPic(resourceId) {
      axios
        .request({
          method: "post",
          url: "/resource/tspMatchPic/listAll",
          data: {
            resourceId: resourceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.matchPicSelectList = ret.data;
          }
        });
    },
    //比对图片radio保存数据
    matchPicRadio(matchPicId) {
      this.editResForm.matchPicId = matchPicId;
    },
    /*******************************************/
    /****************** 自测题 ******************/
    /*******************************************/
    // 加载自测题
    loadTests() {
      this.loading.bookTestLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/selfTest/listWithCount",
          data: {
            textbookId: this.textbookId,
            chapterId: this.currentCatalog.catalogId
              ? this.currentCatalog.catalogId
              : "",
            page: this.testPage.page,
            pagesize: this.testPage.pageSize
          }
        })
        .then(
          function(data) {
            this.loading.bookTestLoading = false;
            let res = data.data;
            if (res.code == 200) {
              res.data.data.forEach(item => {
                item.isEdit = false;
              });
              this.testList = res.data.data;
              this.testPage.total = res.data.total;
              this.deleteTests = [];
            }
          }.bind(this)
        );
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
      this.isEditTestShow = true;
      this.renderCKEditor();
    },
    // 点击编辑题目
    editSubject(index, row) {
      if (this.$refs.addSubject) {
        this.$refs.addSubject.clearValidate();
      }
      this.subjectForm.id = row.sbId;
      this.subjectForm.slsId = row.catSbId;
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
      this.isEditTestShow = true;
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
        let form = {};
        form.title = this.subjectForm.title;
        form.analyse = this.subjectForm.analyse;
        form.answer = this.subjectForm.answer;
        form.slsId = this.subjectForm.slsId;
        form.uniqueId = this.subjectForm.uniqueId;
        form.tSubject = this.subjectForm.tSubject;
        form.difficultRateLevel = this.subjectForm.difficultyLevel;
        form.options = this.subjectForm.answerList;
        form.options = JSON.stringify(form.options);
        var url;
        let current = this.$refs.resourceTab.currentName;
        if (this.subjectForm.id > 0) {
          form.id = this.subjectForm.id;
          url = "/v1/subjectBank/updateTKExercise";
        } else {
          url = "/v1/bookSbLib/addTbOrTestExercise";
          form.catId = this.currentCatalog.catalogId;
          form.tbId = this.textbookId;
          if (current === "third") {
            form.type = 0;
          } else {
            form.type = 1;
          }
        }
        this.loading.addSubject = true;
        axios
          .request({
            method: "post",
            url: url,
            data: form
          })
          .then(
            function(data) {
              this.loading.addSubject = false;
              let res = data.data;
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                this.isEditTestShow = false;
                if (current === "third") {
                  if (form.id == 0) {
                    this.subjectsPage.page = 1;
                  }
                  this.loadBookSubjects();
                } else {
                  if (form.id == 0) {
                    this.testPage.page = 1;
                  }
                  this.loadTests();
                }
              } else {
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
    // 预览
    preview(index, row) {
      this.previewSubject = row;
      this.isPreviewShow = true;
    },
    deleteTestsSelected(select) {
      this.deleteTests = select;
    },
    // 批量删除自测题
    deleteTestsClick() {
      let ids = [];
      let current = this.$refs.resourceTab.currentName;
      if (current === "third") {
        this.deleteSubjects.forEach(element => {
          ids.push(element.catSbId);
        });
      } else {
        this.deleteTests.forEach(element => {
          ids.push(element.catSbId);
        });
      }
      this.deleteTestSure(ids.join(","));
    },
    // 删除单一自测题
    deleteTest(index, row) {
      this.deleteTestSure(row.catSbId);
    },
    deleteTestSure(ids) {
      this.$confirm("题目删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let current = this.$refs.resourceTab.currentName;
          let url = "/v1/selfTest/batchDelete";
          if (current === "third") {
            url = "/v1/bookSbLib/batchDelete";
          }
          axios
            .request({
              method: "post",
              url: url,
              data: {
                ids: ids
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                if (current === "third") {
                  if (
                    this.subjectsPage.page != 1 &&
                    (this.subjectList.length == 1 ||
                      this.deleteSubjects.length == this.subjectList.length)
                  ) {
                    this.subjectsPage.page--;
                  }
                  this.loadBookSubjects();
                } else {
                  if (
                    this.testPage.page != 1 &&
                    (this.testList.length == 1 ||
                      this.deleteTests.length == this.testList.length)
                  ) {
                    this.testPage.page--;
                  }
                  this.loadTests();
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 找题
    handleSearchTest(turnType) {
      this.$router.push({
        path: "/publication/searchTest",
        query: {
          textbookId: this.textbookId,
          catalogId: this.currentCatalog.catalogId,
          turnType: turnType
        }
      });
    },
    // 上传自测题
    uploadTestsClick() {
      this.uploadWord = null;
      this.loading.uploadWord = false;
      if (this.$refs.uploadWord) {
        this.$nextTick(function() {
          this.$refs.uploadWord.clearFile();
        });
      }
      this.isUploadSubjectsShow = true;
    },
    uploadSubjectsChange(file) {
      this.uploadWord = file;
    },
    //确定导入自测题或教材
    uploadSubjectsSure() {
      if (this.uploadWord) {
        if (this.uploadWord.size > 1024 * 1024) {
          this.$message({
            message: "文件过大",
            type: "warning"
          });
          return;
        }
        let current = this.$refs.resourceTab.currentName;
        let belongType = 3;
        if (current == "second") {
          belongType = 3;
        } else if (current == "third") {
          belongType = 2;
        }
        this.loading.uploadWord = true;
        let fd = new FormData();
        fd.append("docxFile", this.uploadWord);
        axios
          .request({
            method: "post",
            url: "/v1/subjectBank/previewWord",
            data: fd
          })
          .then(
            function(data) {
              let res = data.data;
              if (res.code == 200) {
                this.$store.commit("setTestList", res.data);
                this.$router.push({
                  path: "/tiku/importPreTem",
                  query: {
                    belongId: this.currentCatalog.catalogId,
                    belongType: belongType, //1题库 2教材题 3自测题
                    textbookId: this.textbookId
                  }
                });
              } else {
                this.loading.uploadWord = false;
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            }.bind(this)
          )
          .catch(() => {
            this.loading.uploadWord = false;
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
    // 是否显示删除按钮
    isDeletable(row) {
      let uid = this.$store.state.user.userId;
      if (row && row.commitUid == uid) {
        return true;
      }
      return false;
    },
    // 是否可编辑题目
    isEditable(row) {
      let uid = this.$store.state.user.userId;
      // row.review != 1 && row.uid === uid
      if (row.uid === uid) {
        return true;
      }
      return false;
    },
    // 查看附属题目
    showSubList(index, row) {
      console.log(row);
      const { href } = this.$router.resolve({
        path: "/tiku/sonList",
        query: {
          id: row.sbId
        }
      });
      window.open(href, "_blank");
    },
    /*******************************************/
    /****************** 教材题库 ****************/
    /*******************************************/
    // 加载教材题目
    loadBookSubjects() {
      this.loading.subjectsLoading = true;
      axios
        .request({
          method: "post",
          url: "/v1/bookSbLib/listWithCount",
          data: {
            textbookId: this.textbookId,
            chapterId: this.currentCatalog.catalogId
              ? this.currentCatalog.catalogId
              : "",
            page: this.subjectsPage.page,
            pagesize: this.subjectsPage.pageSize
          }
        })
        .then(
          function(data) {
            this.loading.subjectsLoading = false;
            let res = data.data;
            if (res.code == 200) {
              res.data.data.forEach(item => {
                item.isEdit = false;
              });
              this.subjectList = res.data.data;
              this.subjectsPage.total = res.data.total;
              this.deleteSubjects = [];
            }
          }.bind(this)
        );
    },
    deleteSubjectsSelected(select) {
      this.deleteSubjects = select;
    },
    // 类型
    formatType(row) {
      return common.typeFormat(row.tSubject);
    },
    // 日期
    formatTestDate(time) {
      return formatYMD(time);
    },
    // 难度
    formatDiff(row) {
      return common.diffFormat(row.difficultyLevel);
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
    /*******************************************/
    /****************** 课件资源 ****************/
    /*******************************************/
    //加载教师课件包
    loadTeaMaterial() {
      axios
        .request({
          method: "post",
          url: "/v1/tbMatchPic/teacherSpecific",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.teaCourseWare = ret.data;
            this.teaResZipList = ret.data;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载学习课件包
    loadStuMaterial() {
      axios
        .request({
          method: "post",
          url: "/v1/tbMatchPic/bookSpecific",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.stuCourseWare = ret.data;
          }
        });
    },
    //加载教师资源包
    loadTeaResZip() {
      axios
        .request({
          method: "post",
          url: "/v1/tbMatchPic/queryTeacherSpecificResList",
          data: {
            textbookId: this.textbookId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.teaResZipList = ret.data;
          } else if (ret.code == 201) {
            this.teaResZipList = [];
          }
        });
    },
    // 显示上传素材弹框
    handleUploadMaterial(flag) {
      this.isTeaAndStu = flag;
      this.materialForm.showProgress = false;
      this.materialForm.file = null;
      this.materialForm.fileList = null;
      this.materialForm.name = "";
      this.materialForm.resUrl = "";
      this.materialForm.percentage = 0;
      this.isMaterialShow = true;
      if (this.$refs.materialFile) {
        this.$nextTick(function() {
          this.$refs.materialFile.clearFile();
        });
      }
    },
    materialFileChange(file) {
      console.log(file);
      if (this.isTeaAndStu == 0) {
        this.materialForm.fileList = file;
      } else {
        this.materialForm.file = file;
      }
    },
    //上传素材
    doUploadMaterial() {
      if (this.isTeaAndStu == 0) {
        if (this.materialForm.fileList.length > 0) {
          this.materialForm.showProgress = true;
          this.loading.materialLoading = true;
          const files = this.materialForm.fileList;

          // const uploadFileList = [...files].map(file => {
          //   const path = dateStr("YYYYMM") + "/resource/" + file.name;
          //   return {
          //     Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
          //     Region: this.cosConfig.region,
          //     StorageClass: "STANDARD",
          //     Key: path,
          //     Body: file
          //   };
          // });
          // console.log("uploadFileList", uploadFileList);
          // 用COS批量上传
          let p = new Promise((resolve, reject) => {
            for (let i = 0; i < files.length; i++) {
              console.log(files[i]);
              const path = dateStr("YYYYMM") + "/resource/" + files[i].name;

              this.cos.putObject(
                {
                  Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
                  Region: this.cosConfig.region,
                  Key: path,
                  SliceSize: 1024 * 1024 * 10,
                  StorageClass: "STANDARD",
                  Body: files[i],
                  onProgress: curr => {
                    this.materialForm.name = files[i].name;
                    let p = Number(curr.percent) * 100;
                    this.materialForm.percentage = parseFloat(p.toFixed(2));
                  }
                },
                (err, result) => {
                  if (err) {
                    this.$message({
                      type: "warning",
                      message: `${files[i].name}-上传失败`
                    });
                    return;
                  }
                  resolve();
                }
              );
            }
          });
          p.then(() => {
            this.taskList = [];
            let resLisJson = [];
            for (let i = 0; i < files.length; i++) {
              let resPath = dateStr("YYYYMM") + "/resource/" + files[i].name;
              resLisJson.push({
                resUrl: `https://${this.cosConfig.bucket}.guangyiedu.com/${resPath}`,
                resSize: files[i].size,
                resName: files[i].name,
                businessType: 2 // 课件包
              });
            }
            axios
              .request({
                method: "post",
                url: "/v1/tbMatchPic/batchAddTeacherSpecific",
                data: {
                  textbookId: this.textbookId,
                  resLisJson: JSON.stringify(resLisJson)
                }
              })
              .then(res => {
                this.loading.materialLoading = false;
                let ret = res.data;
                if (ret.code == 200) {
                  this.$message({
                    type: "success",
                    message: `添加成功`
                  });
                  this.isMaterialShow = false;
                  // 获取教师资源包
                  this.loadTeaMaterial();
                }
              });
          });
          this.taskList = this.cos.getTaskList();
          // for (let i = 0; i < files.length; i++) {
          //   console.log(files[i]);
          //   const path = dateStr("YYYYMM") + "/resource/" + files[i].name;

          //   this.cos.putObject(
          //     {
          //       Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
          //       Region: this.cosConfig.region,
          //       Key: path,
          //       StorageClass: "STANDARD",
          //       Body: files[i],
          //       onProgress: curr => {
          //         let p = Number(curr.percent) * 100;
          //         this.materialForm.percentage = parseFloat(p.toFixed(2));
          //       }
          //     },
          //     (err, result) => {
          //       if (err) {
          //         this.$message({
          //           type: "warning",
          //           message: `${files[i].name}-上传失败`
          //         });
          //         return;
          //       }
          //       successNum++;
          //       if (successNum == files.length) {
          //         let resLisJson = [];
          //         for (let i = 0; i < files.length; i++) {
          //           let resPath =
          //             dateStr("YYYYMM") + "/resource/" + files[i].name;
          //           resLisJson.push({
          //             resUrl: `https://${this.cosConfig.bucket}.guangyiedu.com/${resPath}`,
          //             resSize: files[i].size,
          //             resName: files[i].name
          //           });
          //         }
          //         axios
          //           .request({
          //             method: "post",
          //             url: "/v1/tbMatchPic/batchAddTeacherSpecific",
          //             data: {
          //               textbookId: this.textbookId,
          //               resLisJson: JSON.stringify(resLisJson)
          //             }
          //           })
          //           .then(res => {
          //             this.loading.materialLoading = false;
          //             let ret = res.data;
          //             if (ret.code == 200) {
          //               this.isMaterialShow = false;
          //               // 获取教师资源包
          //               this.loadTeaResZip();
          //             }
          //           });
          //       }
          //     }
          //   );
          // }

          // this.cos.uploadFiles(
          //   {
          //     files: uploadFileList,
          //     SliceSize: 1024 * 1024 * 5 /* 设置大于5MB采用分块上传 */,
          //     onProgress: curr => {
          //       console.log(curr);
          //       let p = Number(curr.percent) * 100;
          //       this.materialForm.percentage = parseFloat(p.toFixed(2));
          //     },
          //     onFileFinish: function(err, data, options) {
          //       console.log(options.Key + "上传" + (err ? "失败" : "完成"));
          //     }
          //   },
          //   (err, data) => {
          //     debugger;
          //     if (err) {
          //       this.$message({
          //         type: "warning",
          //         message: "上传失败"
          //       });
          //       return;
          //     }
          //     this.taskList = [];
          //     if (!err) {
          //       // this.materialForm.resUrl = encodeURI(
          //       //   `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
          //       // );
          //       let url = "/v1/tbMatchPic/addTeacherSpecific";
          //       if (this.isTeaAndStu == 1) {
          //         url = "/v1/tbMatchPic/addBookSpecific";
          //       }
          //       axios
          //         .request({
          //           method: "post",
          //           url: url,
          //           data: {
          //             textbookId: this.textbookId,
          //             resUrl: this.materialForm.resUrl,
          //             resName: this.materialForm.file.name,
          //             resSize: this.materialForm.file.size
          //           }
          //         })
          //         .then(res => {
          //           this.loading.materialLoading = false;
          //           let ret = res.data;
          //           if (ret.code == 200) {
          //             this.isMaterialShow = false;
          //             // 获取教师资源包
          //             // this.loadTeaResZip();
          //           }
          //         });
          //     } else {
          //       this.loading.materialLoading = false;
          //     }
          //   }
          // );
          // this.taskList = this.cos.getTaskList();
        } else {
          this.$message({
            type: "warning",
            message: "请选择上传文件"
          });
        }
      } else {
        if (this.materialForm.file) {
          this.materialForm.showProgress = true;
          this.loading.materialLoading = true;
          // 其他的 用COS上传
          let path =
            dateStr("YYYYMM") + "/resource/" + this.materialForm.file.name;
          this.cos.putObject(
            {
              Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
              Region: this.cosConfig.region,
              Key: path,
              SliceSize: 1024 * 1024 * 10,
              StorageClass: "STANDARD",
              Body: this.materialForm.file,
              onProgress: curr => {
                this.materialForm.name = this.materialForm.file.name;
                let p = Number(curr.percent) * 100;
                this.materialForm.percentage = parseFloat(p.toFixed(2));
              }
            },
            (err, result) => {
              this.taskList = [];
              if (!err) {
                this.materialForm.resUrl = encodeURI(
                  `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                );
                let url = "/v1/tbMatchPic/addTeacherSpecific";
                if (this.isTeaAndStu == 1) {
                  url = "/v1/tbMatchPic/addBookSpecific";
                }
                axios
                  .request({
                    method: "post",
                    url: url,
                    data: {
                      textbookId: this.textbookId,
                      resUrl: this.materialForm.resUrl,
                      resName: this.materialForm.file.name,
                      resSize: this.materialForm.file.size
                    }
                  })
                  .then(res => {
                    this.loading.materialLoading = false;
                    let ret = res.data;
                    if (ret.code == 200) {
                      this.isMaterialShow = false;
                      if (this.isTeaAndStu == 0) {
                        this.loadTeaMaterial();
                      } else {
                        this.loadStuMaterial();
                      }
                    }
                  });
              } else {
                this.loading.materialLoading = false;
              }
            }
          );
          this.taskList = this.cos.getTaskList();
        } else {
          this.$message({
            type: "warning",
            message: "请选择上传文件"
          });
        }
      }
    },
    //取消上传素材
    doCancelMaterial() {
      if (this.loading.materialLoading) {
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.materialForm.showProgress = false;
        this.materialForm.percentage = 0;
        this.loading.materialLoading = false;
      } else {
        this.isMaterialShow = false;
      }
    },
    closeMaterial() {
      if (this.loading.materialLoading == false) {
        this.isMaterialShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    materialTime(time) {
      if (time) {
        return format(time);
      }
      return "";
    },
    materialSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    deleteMaterial(flag, id) {
      this.$confirm("删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/v1/tbMatchPic/remove",
              data: {
                id: id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                if (flag == 0) {
                  // this.teaCourseWare = {};
                  this.loadTeaMaterial();
                } else if (flag == 2) {
                  // this.loadTeaResZip();
                } else {
                  this.stuCourseWare = {};
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
    /**
     * 公共部分
     */
    // 初始化COS
    initCOS() {
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
    // 初始化VOD
    intVOD() {
      axios
        .request({
          method: "post",
          url: "/v1/upload/vodSignature"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.vod = new Vod({
              getSignature: () => ret.data.signature
            });
          }
        });
    },
    changeQrcode(item) {
      console.log(item);
      for (let i of this.qrcodeSelectList) {
        if (i.id === item) {
          this.uploadResForm.qrcode = i.qrcode;
        }
      }
    },
    changeFolderQrcode(item) {
      console.log(item);
      for (let i of this.qrcodeSelectList) {
        if (i.id === item) {
          this.folderResForm.qrcode = i.qrcode;
        }
      }
    },
    changeQrcodeRichText(item) {
      console.log(item);
      for (let i of this.qrcodeSelectList) {
        if (i.id === item) {
          this.richTextResForm.qrcode = i.qrcode;
        }
      }
    }
  },
  mounted() {
    this.initCOS();
    this.intVOD();
    this.loadTeaMaterial();
    this.loadStuMaterial();
    // this.loadTeaResZip();
  }
};
</script>

<style lang="scss">
.c-grey {
  color: red;
}
.bookResource {
  //上传资源(含富文本)
  .uploadRich .el-dialog {
    width: 850px;
    .el-dialog__body {
      // height: auto;
      padding: 10px 20px 30px;
      .el-tabs {
        .el-tabs__content {
          min-height: 0;
        }
      }
      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }
  }
  .empty1 {
    display: flex;
    height: 500px;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 396px;
      height: 238px;
    }
  }
  .exam-sys {
    margin: 0 auto;
    width: 100%;
    height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    .exam-sys-code {
      display: flex;
      flex-direction: column;
    }
  }
  .bookResourceTop {
    padding-left: 13px;
    .bind-container {
      height: 500px;
      overflow: hidden;
      overflow-y: auto;
      display: flex;
      .bind-container-l {
        width: 50%;
      }
      .bind-container-r {
        width: 50%;
      }
    }
    // /deep/ .el-dialog__body {
    //   height: 75vh;
    //   overflow: hidden;
    //   overflow-y: auto;
    // }
    .el-aside {
      background: #ffffff;
      border-radius: 4px;
      margin-right: 15px;
      min-height: 500px;
      .listHeader {
        height: 46px;
        line-height: 46px;
        background-color: #2ba1f4;
        color: #ffffff;
        font-size: 14px;
        padding-left: 20px;
        letter-spacing: 1px;
        span {
          display: inline-block;
          max-width: 120px;
          min-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        img {
          float: right;
          width: 16px;
          height: 16px;
          margin: 15px 20px 0 0;
          cursor: pointer;
        }
      }
      .listHeader1 {
        height: 46px;
        line-height: 46px;
        background-color: #ffffff;
        color: #606266;
        font-size: 14px;
        padding-left: 20px;
        letter-spacing: 1px;
        border-bottom: 1px solid #eaeaea;
        span {
          display: inline-block;
          max-width: 120px;
          min-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        img {
          float: right;
          width: 16px;
          height: 16px;
          margin: 15px 20px 0 0;
          cursor: pointer;
        }
      }
      .el-tree {
        font-size: 14px;
      }
      .el-tree
        > .el-tree-node
        > .el-tree-node__content
        > .custom-tree-node
        > span:first-child {
        display: inline-block;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-tree-node__content {
        padding-left: 20px !important;
      }
      .el-tree-node__expand-icon {
        display: none;
      }
      .el-tree-node__content {
        height: 46px;
        border-bottom: 1px solid #eaeaea;
        .el-tree-node__expand-icon {
          margin-left: 12px;
        }
      }
      .el-tree--highlight-current
        .el-tree-node.is-current
        > .el-tree-node__content {
        color: #2ba1f4;
        background-color: transparent;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .el-main {
      margin: 0;
      margin-left: 14px;
      .main-resource {
        background: #ffffff;
        border-radius: 4px;
        min-height: 500px;
        .tabelHeader {
          overflow: hidden;
          margin-bottom: 13px;
          .operateBtn {
            float: right;
            .el-button {
              border-color: #2ba1f4;
              color: #2ba1f4;
            }
            .el-button.is-disabled {
              color: #8cc5ff;
              border-color: #d9ecff;
            }
          }
        }
        .el-tabs__content {
          padding: 0 20px 20px;
          min-height: 500px;
        }
      }
    }
    .subject-title {
      text-align: left;
      padding-right: 15px;
      max-height: 23px;
      overflow: hidden;
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
  }
  .chapterInfoBtm {
    padding-left: 13px;
    border-radius: 4px;
    .chapterInfoBtm-box {
      background: #ffffff;
      width: 100%;
      margin: 0;
      padding: 0;
      margin-top: 20px;
      padding-left: 20px;
      line-height: 20px;
      // height: 110px !important;
      min-height: 110px;
      text-align: center;
      .el-row {
        .el-col {
          .materialTitle {
            margin: 20px 0 3px;
            div {
              font-size: 12px;
              color: #999999;
              margin-left: 15px;
            }
          }
        }
      }
    }
    .el-main {
      background: #ffffff;
      margin: 0;
      border-top: 1px solid #eaeaea;
      height: 80px;
      line-height: 80px;
      padding-left: 20px;
      overflow: hidden;
    }
  }
}
.editModal .el-collapse {
  ul {
    list-style: none;
    padding-left: 0;
    li {
      overflow: hidden;
      img {
        width: 180px;
        float: left;
      }
      div {
        padding: 0 10px;
        text-align: center;
        width: 220px;
        float: left;
        .el-radio {
          margin-right: 0;
        }
        div {
          margin-top: 5px;
        }
      }
    }
  }
}
.editBindInfo .el-collapse {
  ul {
    list-style: none;
    padding-left: 0;
    li {
      overflow: hidden;
      img {
        width: 180px;
        float: left;
      }
      div {
        padding: 0 10px;
        text-align: center;
        width: 220px;
        float: left;
        .el-radio {
          margin-right: 0;
        }
        div {
          margin-top: 5px;
        }
      }
    }
  }
}
.el-icon-my-more {
  background: url(~@/assets/images/moreBtn.png) center no-repeat;
  background-size: cover;
}
</style>
