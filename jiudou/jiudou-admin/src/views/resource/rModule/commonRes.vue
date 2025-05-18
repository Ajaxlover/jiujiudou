<template>
  <el-container class="commonRes">
    <!-- 资源库列表 -->
    <el-aside width="182px">
      <div class="listHeader">
        <span>公共资源库列表</span>
        <img src="@/assets/images/plus.png" @click="addBank" />
      </div>
      <div style="height:638px;overflow-y:auto">
        <el-menu :default-active="String(defaultActive)">
          <el-submenu
            v-for="subject in resListData"
            :key="subject.subjectId"
            :index="String(subject.subjectId)"
          >
            <template slot="title">
              <div style="padding-left:15px;" :title="subject.rlName">
                {{ subject.rlName }}
              </div>
            </template>
            <el-menu-item
              class="customMenuItem"
              v-for="rl in subject.children"
              :key="rl.rlId"
              :index="String(rl.rlId)"
              :title="rl.rlName"
              @click="selectRl(rl)"
            >
              <span class="customItemName">{{ rl.rlName }}</span>
              <span
                ><edit-popover
                  v-on:onSelected="popoverClick"
                  :bank="rl"
                ></edit-popover
              ></span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <!-- 资源列表 -->
    <el-main>
      <div class="tableContent">
        <div class="tabelHeader">
          <el-form
            :inline="true"
            :model="searchForm"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item label="类型">
              <el-select
                v-model="searchForm.resType"
                placeholder="资源类型"
                size="small"
                style="width:100px;"
                @change="comResTypeChange"
              >
                <el-option
                  v-for="type in types"
                  :key="type.type"
                  :label="type.name"
                  :value="type.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tree-select
                :styles="tipTreeStyle"
                v-model="searchForm.tips"
                :selectParams="selectParams"
                :treeParams="treeParams"
                @searchFun="tipSearch"
                ref="treeSelect"
                @input="tipChange"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.keyWord"
                @keyup.enter.native="comResTypeChange"
                placeholder="搜索资源"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="comResTypeChange"
                class="el-icon-search"
              ></el-button>
            </el-form-item>
          </el-form>
          <el-row class="operateBtn">
            <el-button
              size="small"
              v-if="selectedRes.length"
              style="border-color:#2BA1F4;color:#2BA1F4;"
              @click="handleMove()"
              >移动</el-button
            >
            <el-button
              size="small"
              v-if="selectedRes.length"
              style="border-color:#2BA1F4;color:#2BA1F4;"
              @click="handleDel()"
              >删除</el-button
            >
            <!-- <el-button type="primary" size="small" @click="handleShowUpload"
              >+富文本H5</el-button
            > -->
            <el-button type="primary" size="small" @click="handleShowUpload"
              >上传</el-button
            >
          </el-row>
        </div>
        <div class="resPath">
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="isShowBreadcrumb"
          >
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumb"
              :key="`b-${item.rlrNo}`"
            >
              <span
                @click="toFolder(item, index)"
                :class="index === breadcrumb.length - 1 ? 'current' : 'path'"
                >{{ item.name }}</span
              >
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="resList">
          <el-table
            :data="resList"
            border
            :row-style="{ height: '100px' }"
            v-loading="loading.loadingRes"
            :show-header="false"
            @selection-change="changeSelect"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column align="center" min-width="700">
              <div slot-scope="scope" class="info">
                <div class="left">
                  <img
                    v-if="scope.row.resType === 1"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/audio.png"
                    alt=""
                  />
                  <div
                    v-if="scope.row.resType === 2"
                    @click="handleViewRes(scope.row)"
                    style="position:relative;width:100px;height:60px;"
                  >
                    <div
                      v-if="scope.row.designPic"
                      style="position:relative;background:rgba(0,0,0,0.5);height:60px;border-radius: 4px;"
                    >
                      <img
                        :src="scope.row.designPic"
                        alt=""
                        style="height:60px;width:auto;max-width:100px;"
                      />
                      <img
                        src="@/assets/images/shipin.png"
                        alt=""
                        style="position:absolute;right:0;top:0;width:27px;height:17px;"
                      />
                    </div>
                    <img v-else src="@/assets/images/video.png" alt="" />
                  </div>
                  <div
                    v-if="scope.row.resType === 3"
                    @click="handleViewRes(scope.row)"
                    style="position:relative"
                  >
                    <!-- <img :src="scope.row.designPic" alt="" style="border-radius: 4px;"> -->
                    <img
                      v-if="scope.row.designPic"
                      :src="scope.row.designPic"
                      alt=""
                      style="border-radius: 4px;"
                    />
                    <img
                      v-else
                      src="@/assets/images/other.png"
                      alt=""
                      style="border-radius: 4px;"
                    />
                    <img
                      src="@/assets/images/arIcon.png"
                      alt=""
                      style="position:absolute;right:0;top:0;width:27px;height:17px;"
                    />
                  </div>
                  <img
                    v-if="scope.row.resType === 4"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/excel.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 5"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/h5.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType == 15"
                    src="@/assets/images/other.png"
                    alt=""
                    @click="handleViewRes(scope.row)"
                  />
                  <img
                    v-if="scope.row.resType === 6"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/ppt.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 7"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/word.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 9"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/pdf.png"
                    alt=""
                  />
                  <div
                    v-if="scope.row.resType === 10"
                    @click="handleViewRes(scope.row)"
                    style="background:rgba(0,0,0,0.5);width:100px;height:60px;border-radius: 4px;"
                  >
                    <img
                      v-if="scope.row.resUrlWeb"
                      :src="scope.row.resUrlWeb"
                      alt=""
                      style="height:60px;width:auto;max-width:100px;"
                    />
                    <img v-else src="@/assets/images/img.png" />
                  </div>
                  <img
                    v-if="scope.row.resType === 11"
                    src="@/assets/images/fileFolder.png"
                    alt=""
                    @click="toFolder(scope.row)"
                  />
                  <img
                    v-if="scope.row.resType === 12"
                    @click="handleViewRes(scope.row)"
                    src="@/assets/images/yypc.png"
                    alt=""
                  />
                  <img
                    v-if="scope.row.resType === 0"
                    src="@/assets/images/other.png"
                    alt=""
                    @click="handleViewRes(scope.row)"
                  />
                </div>
                <div class="middle">
                  <div
                    class="name"
                    style="cursor:pointer;"
                    @click="handleViewRes(scope.row)"
                  >
                    {{ scope.row.resName }}
                  </div>
                  <div class="resourceId">
                    资源ID: {{ scope.row.rlrResourceId }}
                  </div>
                  <div class="tipsText">
                    <span
                      v-for="(item, index) in formatShowTip(scope.row.tipsText)"
                      :key="index"
                      >{{ item }}</span
                    >
                  </div>
                </div>
                <div class="right">
                  <div class="resSize">{{ formatResSize(scope.row.size) }}</div>
                  <div class="updateTime">
                    {{ formatDate(scope.row.updated) }}
                  </div>
                </div>
              </div>
            </el-table-column>
            <el-table-column align="center" width="120">
              <div slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <!-- <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.row)"
                  >编辑1</el-button
                > -->
                <el-dropdown trigger="click">
                  <span
                    class="el-dropdown-link"
                    style="color:#409EFF;font-size:12px;cursor: pointer;"
                  >
                    更多
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="scope.row.resType === 2"
                      @click.native="showSnapshot(scope.row)"
                      >视频封面</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="scope.row.resType === 3"
                      @click.native="showMatchpic(scope.row)"
                      >对比图片</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="scope.row.resType === 12"
                      @click.native="showVoice(scope.row)"
                      >添加语音</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="handleMove(scope.row)"
                      >移动</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="showTrace(scope.row)"
                      >追踪</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="handleDel(scope.row)"
                      >删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabelFooter">
          <div v-if="resList.length" class="right-footer-first">
            从{{ (page.page - 1) * page.pagesize + 1 }}到{{
              (page.page - 1) * page.pagesize + resList.length
            }}记录，共{{ page.total }}条
          </div>
          <div v-else class="right-footer-first" ref="footerCount">
            从0到0条记录，共0条
          </div>
          <el-pagination
            layout="prev, pager, next, jumper"
            :page-sizes="[10, 30, 50]"
            :total="page.total"
            :page-size="page.pagesize"
            @size-change="handleSizeChange"
            :current-page.sync="page.page"
            background
            @current-change="loadResList"
          ></el-pagination>
        </div>
      </div>
    </el-main>
    <jdialog
      :title="addBankForm.rlId > 0 ? '修改库' : '新建库'"
      :loading="loading.addBank"
      :visible.sync="showAddBankDialog"
      width="600px"
      @sure="addSureClick"
    >
      <el-form
        slot="body"
        ref="addBank"
        size="small"
        label-width="80px"
        :model="addBankForm"
        :rules="addBankFormRules"
        style="padding-right:40px;"
      >
        <el-form-item label="课程" prop="subject">
          <el-cascader
            ref="mycascader"
            v-model="addBankForm.subject"
            style="width:100%"
            :options="subjectList"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="库名" prop="rlName">
          <el-input
            type="text"
            v-model="addBankForm.rlName"
            maxlength="80"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </jdialog>
    <!-- 预览资源 -->
    <el-dialog
      top="6vh"
      :visible.sync="isViewResShow"
      :lock-scroll="false"
      :modal-append-to-body="false"
      :fullscreen="isFull"
      :close-on-click-modal="false"
      :before-close="handleCloseViewDialog"
      width="800px"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源预览</div>
          <button
            v-if="viewResObj.resType !== 3"
            @click="isFull = !isFull"
            class="fullBtn"
          >
            <i class="el-icon-full-screen"></i>
          </button>
        </div>
      </template>
      <viewRes
        :isFull="isFull"
        :data="viewResObj"
        :style="viewResObj.resType == 2 ? 'height:350px' : ''"
      ></viewRes>
    </el-dialog>
    <!-- 上传 -->
    <el-dialog
      v-if="isUploadResShow"
      :visible.sync="isUploadResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
      :before-close="handleCloseUploadModalBefore"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>上传资源</div>
        </div>
      </template>
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="常规资源"
            name="first"
            :disabled="disableTabPane.elTabPane1"
          >
            <el-form
              :model="commonResForm"
              :rules="commonResRules"
              ref="commonResForm"
              label-width="90px"
              size="small"
              style="margin:0 90px;"
            >
              <el-form-item label="资源文件" style="margin-bottom:5px;">
                <fileModal
                  ref="fileModal"
                  v-on:fileChange="comResFileChange"
                ></fileModal>
                <div class="inputTips">文件大小不得超过500M</div>
                <div v-if="commonResForm.showProgress" style="margin-top:10px">
                  {{ commonResForm.originalName }}
                </div>
                <el-progress
                  :percentage="commonResForm.percentage"
                  v-if="commonResForm.showProgress"
                  class="progress"
                ></el-progress>
              </el-form-item>
              <el-form-item label="资源类型" v-if="commonResForm.resType">
                <span>{{ formatResTypeName(commonResForm.resType) }}</span>
              </el-form-item>
              <el-form-item label="知识点">
                <el-tree-select
                  @input="tkTipSelectChange"
                  :styles="tkTipTreeStyle"
                  :value="tkTips"
                  size="small"
                  :selectParams="selectParams"
                  :treeParams="tkTreeParams"
                  @searchFun="tkTipSearch1"
                  ref="tkTreeSelect1"
                />
                <!-- <el-tree-select
                  :styles="tipTreeStyle"
                  v-model="searchForm.tips"
                  :selectParams="selectParams"
                  :treeParams="treeParams"
                  @searchFun="tipSearch"
                  ref="tkTreeSelect"
                  @input="tipChange"
                /> -->
              </el-form-item>
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="commonResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="标签" prop="uniqueId">
                <el-input v-model="commonResForm.uniqueId" maxlength="16" show-word-limit size="small"></el-input>
              </el-form-item> -->
            </el-form>
            <div class="btn">
              <el-button
                size="small"
                type="primary"
                :loading="loading.loadingComResSure"
                @click="doUploadComRes"
                >确定</el-button
              >
              <el-button size="small" @click="doCancelUploadComRes">{{
                loading.loadingComResSure ? "取消上传" : "取消"
              }}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="文件夹"
            name="second"
            :disabled="disableTabPane.elTabPane2"
          >
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
              <el-form-item label="知识点">
                <el-tree-select
                  @input="tkTipSelectChange"
                  :styles="tkTipTreeStyle"
                  :value="tkTips"
                  size="small"
                  :selectParams="tkSelectParams"
                  :treeParams="tkTreeParams"
                  @searchFun="tkTipSearch2"
                  ref="tkTreeSelect2"
                />
              </el-form-item>
            </el-form>
            <div class="btn">
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
          </el-tab-pane>
          <el-tab-pane
            label="AR"
            name="third"
            :disabled="disableTabPane.elTabPane3"
          >
            <el-form
              :model="arResForm"
              :rules="arResRules"
              ref="arResForm"
              label-width="90px"
              size="small"
              style="margin:0 90px;"
            >
              <el-form-item label="Android">
                <fileModal
                  ref="androidFileModal"
                  v-on:fileChange="androidFileChange"
                ></fileModal>
                <div
                  v-if="arResForm.android.showProgress"
                  style="margin-top:10px"
                >
                  {{ this.arResForm.android.originalName }}
                </div>
                <el-progress
                  :percentage="arResForm.android.percentage"
                  v-if="arResForm.android.showProgress"
                ></el-progress>
              </el-form-item>
              <el-form-item label="iOS">
                <fileModal
                  ref="iosFileModal"
                  v-on:fileChange="iosFileChange"
                ></fileModal>
                <div v-if="arResForm.ios.showProgress" style="margin-top:10px">
                  {{ this.arResForm.ios.originalName }}
                </div>
                <el-progress
                  :percentage="arResForm.ios.percentage"
                  v-if="arResForm.ios.showProgress"
                ></el-progress>
              </el-form-item>
              <el-form-item label="web">
                <input
                  title="点击选择文件夹"
                  ref="webFileModal"
                  multiple="multiple"
                  webkitdirectory=""
                  accept="*/*"
                  type="file"
                  @change="webFileChange"
                />
                <div class="inputTips">文件大小不得超过500M</div>
                <div
                  v-if="arResForm.showProgress"
                  style="max-height: 100px; margin-top: 19px; overflow-y: scroll"
                >
                  <div v-for="(value, index) in arResForm.files" :key="index">
                    <div style="margin-top:2px">{{ value.originName }}</div>
                    <el-progress
                      :percentage="value.percentage"
                      style="margin-bottom: 3px;"
                    ></el-progress>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="app版本" prop="appVersion">
                <el-select
                  size="small"
                  v-model="arResForm.appVersion"
                  placeholder="请选择APP版本"
                >
                  <el-option
                    v-for="item in apk"
                    :key="item.id"
                    :label="item.versionname"
                    :value="item.versionname"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="知识点">
                <el-tree-select
                  @input="tkTipSelectChange"
                  :styles="tkTipTreeStyle"
                  :value="tkTips"
                  size="small"
                  :selectParams="tkSelectParams"
                  :treeParams="tkTreeParams"
                  @searchFun="tkTipSearch3"
                  ref="tkTreeSelect3"
                />
              </el-form-item>
              <el-form-item label="封面" prop="designPic">
                <fileModal
                  ref="designFileModal"
                  v-on:fileChange="designFileChange"
                  accept="image/*"
                ></fileModal>
                <el-progress
                  :percentage="arResForm.design.percentage"
                  v-if="arResForm.design.showProgress"
                ></el-progress>
              </el-form-item>
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="arResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="btn">
              <el-button
                size="small"
                type="primary"
                @click="doUploadArRes"
                :loading="loading.loadingArSure"
                >确定</el-button
              >
              <el-button size="small" @click="doCancelUploadAR(0)"
                >取消</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="语音评测"
            name="fourth"
            :disabled="disableTabPane.elTabPane4"
          >
            <el-form
              :model="voiceResForm"
              :rules="voiceResRules"
              ref="voiceResForm"
              label-width="90px"
              size="small"
              style="margin:0 90px;"
            >
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="voiceResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="知识点">
                <el-tree-select
                  @input="tkTipSelectChange"
                  :styles="tkTipTreeStyle"
                  :value="tkTips"
                  size="small"
                  :selectParams="tkSelectParams"
                  :treeParams="tkTreeParams"
                  @searchFun="tkTipSearch4"
                  ref="tkTreeSelect4"
                />
              </el-form-item>
            </el-form>
            <div class="btn">
              <el-button
                size="small"
                type="primary"
                :loading="loading.loadingYypcSure"
                @click="doUploadVoiceRes"
                >确定</el-button
              >
              <el-button size="small" @click="isUploadResShow = false"
                >取消</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="富文本"
            name="fifth"
            :disabled="disableTabPane.elTabPane5"
          >
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
              <el-form-item label="知识点">
                <el-tree-select
                  @input="richTipSelectChange"
                  :styles="tkTipTreeStyle"
                  :value="richTextResForm.tips"
                  size="small"
                  :selectParams="tkSelectParams"
                  :treeParams="tkTreeParams"
                  @searchFun="tkTipSearch5"
                  ref="tkTreeSelect5"
                />
              </el-form-item>
              <el-form-item label="内容" prop="resContent">
                <Ueditor
                  v-model.trim="richTextResForm.resContent"
                  :initialFrameHeight="initialFrameHeight"
                />
              </el-form-item>
            </el-form>
            <div class="btn">
              <el-button
                size="small"
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
      </template>
    </el-dialog>
    <!-- 编辑常规资源 -->
    <el-dialog
      :visible.sync="isEditComResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
      :before-close="handleCloseEditComResBefore"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改资源</div>
        </div>
      </template>
      <el-form
        :model="commonResForm"
        :rules="commonResRules"
        ref="commonResForm"
        label-width="90px"
        size="small"
        style="margin:20px 90px;"
      >
        <el-form-item label="资源文件" style="margin-bottom:5px;">
          <fileModal
            ref="editFileModal"
            v-on:fileChange="comResFileChange"
          ></fileModal>
          <div class="inputTips">文件大小不得超过500M</div>
          <div v-if="commonResForm.showProgress" style="margin-top:10px">
            {{ commonResForm.originalName }}
          </div>
          <el-progress
            :percentage="commonResForm.percentage"
            v-if="commonResForm.showProgress"
          ></el-progress>
        </el-form-item>
        <el-form-item label="资源类型" v-if="commonResForm.resType">
          <span>{{ formatResTypeName(commonResForm.resType) }}</span>
        </el-form-item>
        <el-form-item label="知识点">
          <el-tree-select
            @input="tkTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="tkTips"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          />
        </el-form-item>
        <el-form-item label="资源名" prop="resName">
          <el-input
            v-model.trim="commonResForm.resName"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadindEditComRes"
          @click="doEditComRes"
          >确定</el-button
        >
        <el-button size="small" @click="doCancelEditComRes">{{
          loading.loadindEditComRes ? "取消上传" : "取消"
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 编辑文件夹资源 -->
    <el-dialog
      :visible.sync="isEditFolderResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改文件夹</div>
        </div>
      </template>
      <el-form
        :model="folderResForm"
        :rules="folderResRules"
        ref="folderResForm"
        label-width="90px"
        size="small"
        style="margin:20px 90px;"
      >
        <el-form-item label="ID" prop="resourceId">
          <span>{{ folderResForm.resourceId }}</span>
        </el-form-item>
        <el-form-item label="文件夹名" prop="resName">
          <el-input
            v-model.trim="folderResForm.resName"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="知识点">
          <el-tree-select
            @input="tkTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="tkTips"
            size="small"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadingEditFolder"
          @click="doEditFolder"
          >确定</el-button
        >
        <el-button size="small" @click="isEditFolderResShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑AR资源 -->
    <el-dialog
      :visible.sync="isEditArResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
      :before-close="handleCloseEditArBefore"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改资源</div>
        </div>
      </template>
      <el-form
        :model="arResForm"
        :rules="arResRules"
        ref="arResForm"
        label-width="90px"
        size="small"
        style="margin:0 90px;"
      >
        <el-form-item label="Android">
          <fileModal
            ref="androidEditFileModal"
            v-on:fileChange="androidFileChange"
          ></fileModal>
          <div v-if="arResForm.android.showProgress" style="margin-top:10px">
            {{ this.arResForm.android.originalName }}
          </div>
          <el-progress
            :percentage="arResForm.android.percentage"
            v-if="arResForm.android.showProgress"
          ></el-progress>
        </el-form-item>
        <el-form-item label="iOS">
          <fileModal
            ref="iosEditFileModal"
            v-on:fileChange="iosFileChange"
          ></fileModal>
          <div v-if="arResForm.ios.showProgress" style="margin-top:10px">
            {{ this.arResForm.ios.originalName }}
          </div>
          <el-progress
            :percentage="arResForm.ios.percentage"
            v-if="arResForm.ios.showProgress"
          ></el-progress>
        </el-form-item>
        <el-form-item label="web">
          <input
            title="点击选择文件夹"
            multiple="multiple"
            webkitdirectory=""
            accept="*/*"
            type="file"
            @change="webFileChange"
          />
          <div class="inputTips">文件大小不得超过500M</div>
          <div
            v-if="arResForm.showProgress"
            style="max-height: 100px; margin-top: 19px; overflow-y: scroll"
          >
            <div v-for="(value, index) in arResForm.files" :key="index">
              <div style="margin-top:2px">{{ value.originName }}</div>
              <el-progress
                :percentage="value.percentage"
                style="margin-bottom: 3px;"
              ></el-progress>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="app版本" prop="appVersion">
          <el-select
            size="small"
            v-model="arResForm.appVersion"
            placeholder="请选择APP版本"
          >
            <el-option
              v-for="item in apk"
              :key="item.id"
              :label="item.versionname"
              :value="item.versionname"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="designPic">
          <fileModal
            ref="designEditFileModal"
            v-on:fileChange="designFileChange"
            accept="image/*"
          ></fileModal>
        </el-form-item>
        <el-form-item label="资源名" prop="resName">
          <el-input v-model.trim="arResForm.resName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="知识点">
          <el-tree-select
            @input="tkTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="tkTips"
            size="small"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadingEditAr"
          @click="doUploadArRes"
          >确定</el-button
        >
        <el-button size="small" @click="doCancelUploadAR(1)">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑语音评测资源 -->
    <el-dialog
      :visible.sync="isEditVoiceResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改资源</div>
        </div>
      </template>
      <el-form
        :model="voiceResForm"
        :rules="voiceResRules"
        ref="voiceResForm"
        label-width="90px"
        size="small"
        style="margin:20px 90px;"
      >
        <el-form-item label="资源名" prop="resName">
          <el-input v-model.trim="voiceResForm.resName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="知识点">
          <el-tree-select
            @input="tkTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="tkTips"
            size="small"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="doEditVoiceRes"
          >确定</el-button
        >
        <el-button size="small" @click="isEditVoiceResShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑富文本资源 -->
    <el-dialog
      :visible.sync="isEditRichTextResShow"
      :modal-append-to-body="false"
      class="uploadModal"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>修改资源</div>
        </div>
      </template>
      <el-form
        :model="richTextResForm"
        :rules="richTextResRules"
        ref="richTextResEditForm"
        label-width="90px"
        size="small"
        style="margin:20px 90px;"
      >
        <el-form-item label="资源名" prop="resName">
          <el-input
            v-model.trim="richTextResForm.resName"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="知识点">
          <el-tree-select
            @input="richTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="richTextResForm.tips"
            size="small"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          />
        </el-form-item>
        <el-form-item label="内容" prop="resContent">
          <Ueditor
            v-model.trim="richTextResForm.resContent"
            :initialFrameHeight="initialFrameHeight"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="doEditRichTextRes"
          >确定</el-button
        >
        <el-button size="small" @click="isEditRichTextResShow = false"
          >取消</el-button
        >
      </span>
    </el-dialog>

    <!-- 语音评测对话框 -->
    <jdialog
      title="语音评测"
      :visible.sync="isShowVoice"
      :noFooter="true"
      width="80%"
    >
      <div slot="body">
        <div style="margin-bottom: 10px; height: 40px">
          <el-button
            size="small"
            type="primary"
            @click="showSubVoice"
            style="float: right"
            >添加语音评测</el-button
          >
        </div>
        <div>
          <el-table
            :data="voice"
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
              prop="voiceText"
              label="语音文本"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="voiceChinese"
              label="汉语翻译"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="voiceVideo"
              label="语音"
              align="center"
              width="300"
            >
              <template slot-scope="scope">
                <audio
                  :src="scope.row.voiceVideo"
                  controls
                  style="width:100%"
                ></audio>
              </template>
            </el-table-column>
            <el-table-column
              prop="voiceCreateTime"
              label="添加时间"
              align="center"
              :formatter="formatTableDate"
            ></el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  @click="editVoice(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  @click="deleteVoice(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </jdialog>
    <jdialog
      title="语音评测"
      :visible.sync="isShowSubVoice"
      @sure="uploadVoice"
      :loading="loading.loadingYy"
    >
      <div slot="body">
        <el-form
          :model="voiceForm"
          :rules="voiceFormRules"
          ref="voiceForm"
          label-width="80px"
          style="margin:0 60px"
        >
          <el-form-item label="语音文本" prop="voiceText">
            <el-input
              size="small"
              type="textarea"
              v-model="voiceForm.voiceText"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="汉语翻译" prop="voiceChinese">
            <el-input
              type="textarea"
              size="small"
              v-model.trim="voiceForm.voiceChinese"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="语音文件" v-if="isVoiceNew">
            <fileModal
              ref="voiceFileModal"
              v-on:fileChange="voiceFileChange"
              accept="audio/*"
            ></fileModal>
            <div style="font-size:12px;color:#999999;">仅支持音频格式</div>
            <el-progress
              :percentage="voiceForm.percentage"
              v-if="voiceForm.showProgress"
              class="progress"
            ></el-progress>
          </el-form-item>
        </el-form>
      </div>
    </jdialog>
    <!-- 移动 -->
    <el-dialog
      :visible.sync="isMoveShow"
      width="800px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>移动到</div>
        </div>
      </template>
      <el-table
        class="moveTable"
        ref="moveTable"
        :data="rlMoveList()"
        stripe
        border
        @selection-change="moveSelectChange"
        @current-change="moveCurrentChange"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="库名"
          align="center"
          prop="rlName"
        ></el-table-column>
        <el-table-column
          label="关联课程"
          align="center"
          prop="rlSubjectName"
        ></el-table-column>
        <el-table-column label="创建时间" align="center" prop="">
          <span slot-scope="scope">{{
            formatDate(scope.row.rlCreateTime)
          }}</span>
        </el-table-column>
      </el-table>
      <div class="tabelFooter">
        <div v-if="rlList.length" class="right-footer-first">
          从{{ (rlPage.page - 1) * rlPage.pagesize + 1 }}到{{
            (rlPage.page - 1) * rlPage.pagesize + rlMoveList().length
          }}记录，共{{ rlList.length }}条
        </div>
        <div v-else class="right-footer-first" ref="footerCount">
          从0到0条记录，共0条
        </div>
        <el-pagination
          layout="prev, pager, next, jumper"
          :total="rlList.length"
          :current-page.sync="rlPage.page"
          background
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadingMove"
          @click="moveSure"
          >确定</el-button
        >
        <el-button size="small" @click="isMoveShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 视频封面 -->
    <el-dialog
      :visible.sync="isSnapShow"
      width="850px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>视频封面</div>
        </div>
      </template>
      <div style="display:flex;flex-wrap:wrap;height:400px;overflow-y: auto">
        <div
          v-for="(img, index) in snapList"
          :key="index"
          style="margin:10px 16px;"
        >
          <img
            :src="img"
            style="width:220px;height:220px;display:block;margin-bottom:10px"
          />
          <el-radio v-model="videoCover" :label="img">请选择</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="loading.loadingSetCover"
          @click="setCover"
          >设为封面</el-button
        >
        <el-button size="small" @click="isSnapShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 比对图片 -->
    <el-dialog
      :visible.sync="isMatchPicShow"
      width="800px"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>对比图片管理</div>
        </div>
      </template>
      <el-form
        :model="matchPicForm"
        ref="matchPicForm"
        size="small"
        :inline="true"
        :rules="uploadMatchPicRuls"
      >
        <el-form-item>
          <fileModal
            style="width:200px;"
            ref="matchPicFileModal"
            @fileChange="matchPicFileChange"
          ></fileModal>
        </el-form-item>
        <el-form-item label="主场景" label-width="70px" prop="mainScene">
          <el-input v-model="matchPicForm.mainScene"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading.uploadMatchPic"
            type="primary"
            @click="uploadMatchPic"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="matchPicList"
        stripe
        border
        v-loading="loading.loadingMatchPicList"
        :header-cell-style="{
          'background-image':
            'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
          color: '#333333',
          height: '40px',
          padding: '0'
        }"
      >
        <el-table-column label="对比图片" align="center" prop="">
          <img
            slot-scope="scope"
            :src="scope.row.matchPicUrl"
            style="width: 60px;height:60px;"
          />
        </el-table-column>
        <el-table-column
          label="场景"
          align="center"
          prop="mainScene"
        ></el-table-column>
        <el-table-column label="创建时间" align="center" prop="created">
          <span slot-scope="scope">{{ formatDate(scope.row.created) }}</span>
        </el-table-column>
        <el-table-column align="center">
          <div slot-scope="scope">
            <el-button size="mini" type="text" @click="delMatchPic(scope.row)"
              >删除</el-button
            >
          </div>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 资源追踪 -->
    <el-dialog
      :visible.sync="isResTraceShow"
      width="1000px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源追踪</div>
        </div>
      </template>
      <div>
        <span>资源类型：{{ formatResTypeName(currentResRow.resType) }}</span
        ><span style="margin-left:40px"
          >资源名称：{{ currentResRow.resName }}</span
        >
        <el-table
          style="margin-top:20px;"
          :data="traceList"
          stripe
          border
          v-loading="loading.loadingTraceList"
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column align="center" type="index"></el-table-column>
          <el-table-column
            align="center"
            label="书名"
            prop="tname"
          ></el-table-column>
          <el-table-column
            align="center"
            label="书号"
            prop="tb_num"
          ></el-table-column>
          <el-table-column
            align="center"
            label="章节"
            prop="resChapter"
          ></el-table-column>
          <el-table-column
            align="center"
            label="页码"
            prop="resPage"
          ></el-table-column>
          <el-table-column
            align="center"
            label="作者"
            prop="author"
          ></el-table-column>
          <el-table-column align="center" label="绑定时间">
            <span slot-scope="scope">{{ formatDate(scope.row.bundTime) }}</span>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
import fileModal from "@/components/fileModal";
import { format, dateStr } from "@/utils/datetime";
import common from "@/utils/common";
import ElTreeSelect from "@/components/el-tree-select/src/ElTreeSelect";
import viewRes from "@/components/viewRes";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import editPopover from "../../publication/popver";
import Ueditor from "@/components/ueditor";

export default {
  name: "commonRes",
  components: {
    fileModal,
    jdialog,
    ElTreeSelect,
    viewRes,
    editPopover,
    Ueditor
  },
  data() {
    return {
      isFull: false, // 弹窗是否全屏
      initialFrameHeight: 200,
      showAddBankDialog: false,
      addBankForm: {
        subject: [],
        rlName: ""
      },
      addBankFormRules: {
        subject: [
          { required: true, message: "请选择所属学科", trigger: "change" }
        ],
        rlName: [{ required: true, message: "请输入库名", trigger: "blur" }]
      },
      // 学科
      subjectList: [],
      rlList: [],
      types: common.resTypes,
      selectedRes: [],
      resList: [],
      page: {
        total: 0,
        page: 1,
        pagesize: 10
      },
      // 资源库 tree
      defaultActive: 0,
      currentResLib: {},
      resListData: [],
      // 搜索表单
      searchForm: {
        keyWord: "",
        tips: "",
        resType: ""
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
      tipTreeStyle: {
        width: "200px"
      },
      // 资源路径
      isShowBreadcrumb: false,
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      currentResRow: {},
      apk: [],
      loading: {
        loadingRes: false,
        loadingComResSure: false,
        loadingFolderSure: false,
        loadingArSure: false,
        loadingYypcSure: false,
        loadindEditComRes: false,
        loadingEditFolder: false,
        loadingYy: false,
        loadingMatchPic: false,
        loadingTraceList: false,
        loadingMatchPicList: false,
        uploadMatchPic: false,
        loadingSnap: false,
        loadingSetCover: false,
        loadingMove: false,
        addBank: false
      },
      // 移动
      isMoveShow: false,
      rlrIds: "",
      rlPage: {
        page: 1,
        pagesize: 10
      },
      // 视频封面
      isSnapShow: false,
      snapList: [],
      videoCover: "",
      // 比对图片
      isMatchPicShow: false,
      matchPicList: [],
      matchPicForm: {
        file: "",
        mainScene: ""
      },
      uploadMatchPicRuls: {
        mainScene: [
          { required: true, message: "请输入主场景名", trigger: "blur" }
        ]
      },
      // 资源追踪
      isResTraceShow: false,
      traceList: [],
      // 上传
      isUploadResShow: false,
      activeName: "first",
      // 禁止切换tabpane  status
      disableTabPane: {
        elTabPane1: false,
        elTabPane2: false,
        elTabPane3: false,
        elTabPane4: false,
        elTabPane5: false
      },
      //上传弹框中的知识点
      tkTipTreeStyle: {
        width: "340px"
      },
      tkSelectParams: {
        multiple: true,
        clearable: false,
        placeholder: "请选择知识点"
      },
      tkTreeParams: {
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
      recordTip: [], // 记录当前库的知识点数据
      tkTips: "",
      tkTipsText: "",
      // 常规资源表单
      isEditComResShow: false,
      commonResForm: {
        showProgress: false,
        file: null,
        percentage: 0,
        resType: "",
        resName: "",
        resSize: "",
        uniqueId: ""
      },
      commonResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      // 文件夹资源表单
      isEditFolderResShow: false,
      folderResForm: {
        showProgress: false,
        percentage: 0,
        isSuccess: true,
        resourceId: "",
        resName: "",
        uniqueId: "",
        total: 0,
        done: 0,
        files: []
      },
      folderResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      // AR资源表单
      isEditArResShow: false,
      arResForm: {
        showProgress: false,
        isSuccess: true,
        resourceId: "",
        resName: "",
        uniqueId: "",
        appVersion: "",
        design: {
          showProgress: false,
          percentage: 0
        },
        android: {
          showProgress: false,
          percentage: 0
        },
        ios: {
          showProgress: false,
          percentage: 0
        },
        files: []
      },
      arResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      // 语音评测资源表单
      isEditVoiceResShow: false,
      isEditRichTextResShow: false,
      voiceResForm: {
        resourceId: "",
        resName: "",
        uniqueId: ""
      },
      voiceResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      richTextResForm: {
        resName: "",
        uniqueId: "",
        resContent: "",
        tips: [],
        tipsText: []
      },
      richTextResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ],
        resContent: [
          { required: true, message: "请输入资源内容", trigger: "click" }
        ]
      },
      // 添加语音
      isShowVoice: false,
      isShowSubVoice: false,
      isVoiceNew: true,
      voice: [],
      voiceForm: {
        showProgress: false,
        isSuccess: true,
        percentage: 0,
        resourceId: "",
        file: null,
        voiceId: 0,
        voiceChinese: "",
        voiceText: "",
        voiceDuration: 0
      },
      voiceFormRules: {
        voiceText: [
          { required: true, message: "请输入语音文本", trigger: "click" }
        ],
        voiceChinese: [
          { required: false, message: "请输入汉语翻译", trigger: "click" }
        ]
      },
      // 腾讯云 上传
      vod: null,
      cos: null,
      imgCos: null,
      taskList: [], // 常规资源任务列表
      uploader: null, // 视频音频上传存储对象
      cosConfig: {
        topDomain: "",
        region: ""
      }
    };
  },
  mounted() {
    this.loadSubjects();
    this.loadCommonResLibrary();
    this.initCosV5();
    this.initVod();
  },
  methods: {
    // 加载学科分类
    loadSubjects() {
      axios
        .request({
          method: "post",
          url: "/subject/subject/listWithCourse"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.subjectList = ret.data
              .sort((a, b) => a.subjectId - b.subjectId)
              .map(item => ({
                value: item.subjectId,
                label: item.sname,
                children: item.courses.map(item => ({
                  value: item.courseId,
                  label: item.courseName
                }))
              }));
          }
        });
    },
    // 新增库
    addBank() {
      this.loading.addBank = false;
      this.addBankForm.rlId = 0;
      this.addBankForm.subject = [];
      this.addBankForm.rlName = "";
      this.showAddBankDialog = true;
      if (this.$refs.addBank) {
        this.$refs.addBank.clearValidate();
      }
    },
    addSureClick() {
      this.$refs["addBank"].validate(valid => {
        if (valid) {
          let node = this.$refs.mycascader.getCheckedNodes()[0];
          let data = {
            courseId: node.value,
            courseName: node.label,
            subjectId: node.parent.value,
            subjectName: node.parent.label,
            rlName: this.addBankForm.rlName
          };
          this.loading.addBank = true;
          var url = "resource/v4/commonRL/create";
          if (this.addBankForm.rlId > 0) {
            url = "resource/v4/commonRL/update";
            data.rlId = this.addBankForm.rlId;
          }
          axios
            .request({
              method: "post",
              url: url,
              data: data
            })
            .then(res => {
              this.loading.addBank = false;
              var ret = res.data;
              if (ret.code == 200) {
                this.showAddBankDialog = false;
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                if (!this.addBankForm.rlId) {
                  this.defaultActive = ret.data.rlId;
                } else {
                  this.defaultActive = this.addBankForm.rlId;
                }
                this.loadCommonResLibrary();
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
    popoverClick(index, rl) {
      if (index == "1") {
        this.addBankForm.rlId = rl.rlId;
        this.addBankForm.subject = [
          parseInt(rl.rlRow.rlSubjectId),
          parseInt(rl.rlRow.rlCourseId)
        ];
        this.addBankForm.rlName = rl.rlName;
        this.loading.addBank = false;
        this.showAddBankDialog = true;
        if (this.$refs.addBank) {
          this.$refs.addBank.clearValidate();
        }
      } else if (index == "2") {
        this.deleteBank(rl);
      }
    },
    // 删库
    deleteBank(rl) {
      this.$confirm(
        "<div>你确定要删除资源库【" +
          rl.rlName +
          "】吗？</div>删除后，资源库中的资源将同时删除且不可恢复",
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
              url: "resource/v4/commonRL/remove",
              data: { rlId: rl.rlId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.$message({
                  message: ret.msg,
                  type: "success"
                });
                this.defaultActive = "";
                this.loadCommonResLibrary();
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
    // 加载资源库列表
    loadCommonResLibrary() {
      axios
        .request({
          method: "post",
          url: "/resource/resourceLibrary/commonList",
          data: {
            rlIsOfficial: 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.rlList = ret.data;
            let resListData = [];
            let resMap = new Map();
            let subjectMap = new Map();
            if (ret.data.length > 0) {
              ret.data.forEach(element => {
                if (element.rlId == this.defaultActive) {
                  this.currentResLib = {
                    rlId: element.rlId,
                    rlName: element.rlName,
                    rlRow: element,
                    forceRefresh: true
                  };
                }
                if (resMap.has(element.rlSubjectId)) {
                  resMap.get(element.rlSubjectId).push({
                    rlName: element.rlName,
                    rlId: element.rlId,
                    rlRow: element
                  });
                } else {
                  resMap.set(element.rlSubjectId, [
                    {
                      rlName: element.rlName,
                      rlId: element.rlId,
                      rlRow: element
                    }
                  ]);
                }
                if (!subjectMap.has(element.rlSubjectId)) {
                  subjectMap.set(element.rlSubjectId, {
                    rlName: element.rlSubjectName,
                    subjectId: element.rlSubjectId,
                    children: []
                  });
                }
              });
              subjectMap.forEach((value, key, map) => {
                value.children = resMap.get(key);
                resListData.push(value);
              });
              this.resListData = resListData;
              this.resListData.sort((a, b) => a.subjectId - b.subjectId);
              if (this.currentResLib.rlId) {
                this.selectRl(this.currentResLib);
              } else {
                this.selectRl({
                  rlId: ret.data[0].rlId,
                  rlName: ret.data[0].rlName,
                  rlRow: ret.data[0]
                });
              }
            }
          }
        });
    },
    // 点击资源库item
    selectRl(bank) {
      this.$nextTick(() => {
        document.querySelector(".el-tabs__content").scrollTop = 0;
      });
      if (
        bank.rlId !== this.currentResLib.rlId ||
        this.currentResLib.forceRefresh
      ) {
        this.currentResLib = bank;
        this.page.currentPage = 1;
        this.searchForm.resType = "";
        this.searchForm.resName = "";
        this.searchForm.tips = "";
        this.loadResList();
        this.loadTips();
      }
      this.defaultActive = this.currentResLib.rlId;
    },
    //查看资源
    handleViewRes(row) {
      let { rlrResourceId, resType } = row;
      if (resType === 9) {
        // 查看pdf资源
        axios
          .request({
            method: "post",
            responseType: "arraybuffer",
            url: `/resource/v4/commonRL/detailById`,
            data: {
              rlrResourceId
            }
          })
          .then(res => {
            console.log(res);
            let blob = new Blob([res.data]);
            let fileURL = window.URL.createObjectURL(blob); //创建下载的链接
            window.open("/static/pdf/web/viewer.html?file=" + fileURL);
          });
        return;
      }
      if (resType === 3) {
        // AR
        if (!row.resUrlWeb) {
          this.$message({
            type: "warning",
            message: "资源地址不存在，请检查"
          });
          return;
        }
      }
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
      this.isFull = false;
    },
    // 获取资源列表
    loadResList() {
      delete this.currentResLib.forceRefresh;
      let data = { page: this.page.page, pagesize: this.page.pagesize };
      data.resType = this.searchForm.resType;
      data.rlrRlId = this.currentResLib.rlId;
      data.resName = this.searchForm.keyWord;
      if (this.searchForm.tips.length) {
        data.tips = this.searchForm.tips.join(",");
      }
      if (this.searchForm.rlrParentNo) {
        data.rlrParentNo = this.searchForm.rlrParentNo;
      } else {
        data.rlrParentNo = "0";
      }
      this.loading.loadingRes = true;
      axios
        .request({
          method: "post",
          url: "/resource/v4/commonRL/itemsWithCount",
          data: data
        })
        .then(data => {
          this.loading.loadingRes = false;
          let res = data.data;
          if (res.code == 200) {
            this.page.total = res.data.total;
            this.resList = res.data.data;
          }
        });
    },
    //获取知识点
    loadTips() {
      axios
        .request({
          method: "post",
          url: "/subject/chapterTip/treeList",
          data: { courseId: this.currentResLib.rlRow.rlCourseId }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.treeParams.data = res.data;
              this.recordTip = res.data;
              if (res.data.length >= 0) {
                if (this.$refs.treeSelect) {
                  this.$refs.treeSelect.treeDataUpdateFun(res.data);
                }
              }
            }
          }.bind(this)
        );
    },
    // 知识点搜索
    tipSearch(value) {
      this.$refs.treeSelect.filterFun(value);
    },
    //知识点查询资源
    tipChange(tips) {
      this.searchForm.tips = tips;
      this.loadResList();
    },
    //资源类型查询资源
    comResTypeChange() {
      this.page.currentPage = 1;
      this.loadResList();
    },
    // 查询
    onSubmit() {
      this.defaultActive = 0;
      this.page.currentPage = 1;
      // this.searchForm.resType = ''
      this.loading = true;
      this.loadResList();
    },
    //选择资源每页显示数据条数切换事件
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.loadResList();
    },
    // 进入文件夹
    toFolder(row, index) {
      this.searchForm.rlrParentNo = row.rlrNo;
      if (index === undefined) {
        console.log("进入");
        let current = {
          name: row.resName,
          rlrNo: row.rlrNo
        };
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = true;
        }
        this.breadcrumb.push(current);
        this.page.page = 1;
      } else {
        console.log("返回");
        this.breadcrumb.splice(index + 1);
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = false;
        }
      }
      // this.searchForm.resType = "";
      this.loadResList();
    },
    // 资源列表选择事件
    changeSelect(selection) {
      this.selectedRes = selection;
    },
    // 移动
    handleMove(row) {
      this.isMoveShow = true;
      this.loading.loadingMove = false;
      if (row) {
        this.rlrIds = row.rlrId;
      } else {
        let array = [];
        this.selectedRes.forEach(res => {
          array.push(res.rlrId);
        });
        this.rlrIds = array.join(",");
      }
    },
    rlMoveList() {
      let start = (this.rlPage.page - 1) * this.rlPage.pagesize;
      let end = this.rlPage.page * this.rlPage.pagesize;
      return this.rlList.slice(start, end);
    },
    moveSelectChange(val) {
      if (val.length > 1) {
        this.$refs.moveTable.clearSelection();
        this.$refs.moveTable.toggleRowSelection(val.pop());
      }
    },
    moveCurrentChange(val) {
      this.$refs.moveTable.toggleRowSelection(val);
    },
    moveSure() {
      let array = this.$refs.moveTable.selection;
      if (array.length) {
        this.loading.loadingMove = true;
        axios
          .request({
            method: "post",
            url: "resource/resLibResource/moveTo",
            data: {
              rlrIds: this.rlrIds,
              rlId: array[0].rlId
            }
          })
          .then(res => {
            this.loading.loadingMove = false;
            let ret = res.data;
            if (ret.code == 200) {
              this.$message({
                type: "success",
                message: ret.msg
              });
              this.isMoveShow = false;
              this.loadResList();
            } else {
              this.$message({
                type: "warning",
                message: ret.msg
              });
            }
          })
          .catch(() => {
            this.loading.loadingMove = false;
            this.$message({
              type: "warning",
              message: "服务异常"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择目标库"
        });
      }
    },
    // 视频封面
    showSnapshot(row) {
      this.currentResRow = row;
      this.isSnapShow = true;
      this.loading.loadingSnap = true;
      this.videoCover = row.designPic;
      axios
        .request({
          method: "post",
          url: "/v1/upload/snapshotShow",
          data: {
            fileId: row.cloudId
          }
        })
        .then(res => {
          this.loading.loadingSnap = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.snapList = ret.data;
          }
        })
        .catch(() => {
          this.loading.loadingSnap = false;
        });
    },
    // 设置视频封面
    setCover() {
      this.loading.loadingSetCover = true;
      axios
        .request({
          method: "post",
          url: "/resource/v1/resource/updResPic",
          data: {
            resourceid: this.currentResRow.rlrResourceId,
            designPic: this.videoCover
          }
        })
        .then(res => {
          this.loading.loadingSetCover = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.isSnapShow = false;
            this.$message({
              type: "success",
              message: ret.msg
            });
            this.loadResList();
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        })
        .catch(() => {
          this.loading.loadingSetCover = false;
          this.$message({
            type: "warning",
            message: "服务异常"
          });
        });
    },
    // 比对图片
    showMatchpic(row) {
      this.currentResRow = row;
      this.isMatchPicShow = true;
      this.loading.loadingMatchPicList = true;
      this.loadMatchPics();
    },
    loadMatchPics() {
      axios
        .request({
          method: "post",
          url: "/resource/tspMatchPic/listAll",
          data: {
            resourceId: this.currentResRow.rlrResourceId
          }
        })
        .then(res => {
          this.loading.loadingMatchPicList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.matchPicList = ret.data;
          }
        })
        .catch(() => {
          this.loading.loadingMatchPicList = false;
        });
    },
    matchPicFileChange(file) {
      this.matchPicForm.file = file;
    },
    uploadMatchPic() {
      this.$refs.matchPicForm.validate(valid => {
        if (valid) {
          if (this.matchPicForm.file) {
            this.loading.uploadMatchPic = true;
            let fd = new FormData();
            fd.append("resourceId", this.currentResRow.rlrResourceId);
            fd.append("picFile", this.matchPicForm.file);
            fd.append("mainScene", this.matchPicForm.mainScene);
            // fd.append('matchPicName', this.matchPicForm.mainScene)
            axios
              .request({
                method: "post",
                url: "/v1/matchPic/createMatchPic",
                data: fd
              })
              .then(res => {
                this.loading.uploadMatchPic = false;
                let ret = res.data;
                if (ret.code == 200) {
                  this.loadMatchPics();
                }
              })
              .catch(() => {
                this.loading.uploadMatchPic = false;
              });
          } else {
            this.$message({
              type: "warning",
              message: "请选择图片"
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除对比图片
    delMatchPic(row) {
      this.$confirm("确认要删除对比图片吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/v1/matchPic/removeMatchPic",
              data: {
                matchPicId: row.matchPicId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadMatchPics();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 追踪
    showTrace(row) {
      this.currentResRow = row;
      this.isResTraceShow = true;
      this.loading.loadingTraceList = true;
      axios
        .request({
          method: "post",
          url: "resource/resource/resPositionTrack",
          data: {
            resourceId: row.rlrResourceId
          }
        })
        .then(res => {
          this.loading.loadingTraceList = false;
          let ret = res.data;
          if (ret.code == 200) {
            this.traceList = ret.data;
          }
        })
        .catch(() => {
          this.loading.loadingTraceList = false;
        });
    },
    //-----------------------------上传-----------------------------------------------
    // 上传弹框中知识点变化事件
    tkTipSelectChange(ids, labels) {
      this.tkTips = ids;
      this.tkTipsText = labels;
    },
    richTipSelectChange(ids, labels) {
      this.richTextResForm.tips = ids;
      this.richTextResForm.tipsText = labels;
    },
    // 弹框中知识点搜索
    tkTipSearch(value) {
      this.$refs.tkTreeSelect.filterFun(value);
    },
    tkTipSearch1(value) {
      this.$refs.tkTreeSelect1.filterFun(value);
    },
    tkTipSearch2(value) {
      this.$refs.tkTreeSelect2.filterFun(value);
    },
    tkTipSearch3(value) {
      this.$refs.tkTreeSelect3.filterFun(value);
    },
    tkTipSearch4(value) {
      this.$refs.tkTreeSelect4.filterFun(value);
    },
    tkTipSearch5(value) {
      this.$refs.tkTreeSelect5.filterFun(value);
    },
    //显示上传弹框
    handleShowUpload() {
      if (this.resListData.length > 0) {
        this.$nextTick(() => {
          this.tkTreeParams.data = this.recordTip;
        });
        this.tkTips = "";
        this.tkTipsText = "";
        // 清空 常规资源表单
        this.commonResForm.resourceId = null;
        this.commonResForm.resName = "";
        this.commonResForm.uniqueId = "";
        this.commonResForm.resType = "";
        this.commonResForm.showProgress = false;
        this.commonResForm.percentage = 0;
        this.commonResForm.cloudId = "";
        this.$nextTick(res => {
          if (this.$refs.fileModal) {
            this.$refs.fileModal.clearFile();
          }
        });
        // 清空 AR资源表单
        if (this.arResForm.isSuccess) {
          this.arResForm.resourceId = null;
          this.arResForm.resName = "";
          this.arResForm.uniqueId = "";
          this.arResForm.appVersion = "";
          this.arResForm.designPic = "";
          this.arResForm.android = {
            showProgress: false,
            percentage: 0
          };
          this.arResForm.ios = {
            showProgress: false,
            percentage: 0
          };
          this.arResForm.design = {
            showProgress: false,
            percentage: 0
          };
          this.arResForm.showProgress = false;
          this.arResForm.files = [];
          this.$nextTick(() => {
            if (this.$refs.iosFileModal) {
              this.$refs.iosFileModal.clearFile();
            }
            if (this.$refs.androidFileModal) {
              this.$refs.androidFileModal.clearFile();
            }
            if (this.$refs.designFileModal) {
              this.$refs.designFileModal.clearFile();
            }
            if (this.$refs.webFileModal) {
              this.$refs.webFileModal.value = "";
            }
          });
        }
        // 清空 文件夹资源表单
        if (this.folderResForm.isSuccess) {
          this.folderResForm.resourceId = null;
          this.folderResForm.resName = "";
          this.folderResForm.uniqueId = "";
          this.folderResForm.files = [];
          this.folderResForm.showProgress = false;
          this.folderResForm.percentage = 0;
          this.$nextTick(res => {
            if (this.$refs.folderFile) {
              this.$refs.folderFile.value = "";
            }
          });
        }
        // 清空 语音评测资源表单
        this.voiceResForm.resourceId = null;
        this.voiceResForm.resName = "";
        this.voiceResForm.uniqueId = "";

        // 清空富文本资源表单
        this.richTextResForm.resourceId = null;
        this.richTextResForm.resName = "";
        this.richTextResForm.uniqueId = "";
        this.richTextResForm.resContent = "";
        this.richTextResForm.tips = [];
        this.richTextResForm.tipsText = [];

        this.$nextTick(() => {
          this.$refs.commonResForm.clearValidate();
          this.$refs.arResForm.clearValidate();
          this.$refs.voiceResForm.clearValidate();
          this.$refs.folderResForm.clearValidate();
          this.$refs.richTextResForm.clearValidate();
        });

        this.isUploadResShow = true;
        if (this.recordTip.length >= 0) {
          if (this.$refs.tkTreeSelect) {
            this.$nextTick(() => {
              this.$refs.tkTreeSelect.treeDataUpdateFun(this.recordTip);
            });
          }
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先创建公共资源库"
        });
      }
    },
    //确定上传常规资源
    doUploadComRes() {
      this.$refs["commonResForm"].validate(valid => {
        if (valid) {
          if (this.commonResForm.file) {
            // 不支持的文件类型不能上传
            if (
              this.commonResForm.resType == 0 ||
              this.commonResForm.resType == 3 ||
              this.commonResForm.resType == 12
            ) {
              this.$message({
                type: "warning",
                message: "不支持该文件类型"
              });
              return;
            }
            // 超过500M的文件不能上传
            if (this.commonResForm.resSize / 1024 / 1024 > 500) {
              this.$message({
                type: "warning",
                message: "大小不能超过500M"
              });
              return;
            }
            this.commonResForm.showProgress = true;
            this.loading.loadingComResSure = true;
            this.commonResForm.cloudId = "";
            this.disableTabPane.elTabPane2 = true;
            this.disableTabPane.elTabPane3 = true;
            this.disableTabPane.elTabPane4 = true;
            if (
              this.commonResForm.resType === "1" ||
              this.commonResForm.resType === "2"
            ) {
              // 音频和视频 用VOD上传
              this.uploader = this.vod.upload({
                mediaFile: this.commonResForm.file // file是js的文件引用
              });
              this.uploader.on("media_progress", info => {
                let p = Number(info.percent) * 100;
                this.commonResForm.percentage = parseFloat(p.toFixed(2));
              });
              this.uploader
                .done()
                .then(info => {
                  this.uploader = null;
                  this.commonResForm.resUrl = info.video.url;
                  this.commonResForm.cloudId = info.fileId;
                  this.comResSubmit();
                })
                .catch(() => {
                  this.loading.loadingComResSure = false;
                  this.commonResForm.showProgress = false;
                  this.commonResForm.percentage = 0;
                  this.commonResForm.cloudId = "";
                  this.disableTabPane.elTabPane2 = false;
                  this.disableTabPane.elTabPane3 = false;
                  this.disableTabPane.elTabPane4 = false;
                  this.$message({
                    type: "warning",
                    message: "不支持的音视频类型"
                  });
                });
            } else {
              // 其他的 用COS上传
              let path =
                dateStr("YYYYMM") +
                "/" +
                this.$store.state.user.userId +
                new Date().valueOf() +
                common.getFileType(this.commonResForm.file.name);
              this.cos.putObject(
                {
                  Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
                  Region: this.cosConfig.region,
                  Key: path,
                  StorageClass: "STANDARD",
                  Body: this.commonResForm.file,
                  onProgress: curr => {
                    let p = Number(curr.percent) * 100;
                    this.commonResForm.percentage = parseFloat(p.toFixed(2));
                  }
                },
                (err, result) => {
                  this.taskList = [];
                  if (!err) {
                    this.commonResForm.resUrl = encodeURI(
                      `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                    );
                    this.comResSubmit();
                  } else {
                    console.log(err);
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
    //上传的常规资源提交到数据库
    comResSubmit() {
      axios
        .request({
          method: "post",
          url: "/v1/resourceLibrary/addConvenResource",
          data: {
            rlId: this.currentResLib.rlId,
            resUrl: this.commonResForm.resUrl,
            resSize: this.commonResForm.resSize,
            resType: this.commonResForm.resType,
            resName: this.commonResForm.resName,
            originalName: this.commonResForm.originalName,
            uniqueId: this.commonResForm.uniqueId,
            cloudId: this.commonResForm.cloudId,
            tips: this.tkTips,
            tipsText: this.tkTipsText
          }
        })
        .then(res => {
          let ret = res.data;
          this.isUploadResShow = false;
          setTimeout(() => {
            this.loading.loadingComResSure = false;
          }, this.global.btnResumeTime);
          if (ret.code == 200) {
            this.loadResList();
          }
        })
        .catch(() => {
          this.loading.loadingComResSure = false;
          this.$message({
            type: "warning",
            message: "该服务不可用"
          });
        });
      this.disableTabPane.elTabPane2 = false;
      this.disableTabPane.elTabPane3 = false;
      this.disableTabPane.elTabPane4 = false;
    },
    //关闭上传弹框之前判断有没有上传任务
    handleCloseUploadModalBefore() {
      if (
        this.loading.loadingComResSure == false &&
        this.loading.loadingFolderSure == false &&
        this.loading.loadingArSure == false
      ) {
        this.isUploadResShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    // 取消上传常规资源
    doCancelUploadComRes() {
      if (this.loading.loadingComResSure) {
        if (this.uploader && this.commonResForm.cloudId) {
          this.uploader.cancel();
        }
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.commonResForm.showProgress = false;
        this.commonResForm.percentage = 0;
        this.loading.loadingComResSure = false;
        this.disableTabPane.elTabPane2 = false;
        this.disableTabPane.elTabPane3 = false;
        this.disableTabPane.elTabPane4 = false;
      } else {
        this.isUploadResShow = false;
      }
    },
    // 常规资源filechange
    comResFileChange(file) {
      if (file) {
        this.commonResForm.file = file;
        this.commonResForm.resSize = file.size;
        this.commonResForm.originalName = file.name;
        this.commonResForm.resType = `${this.toResType(file.type)}`;
        if (!this.commonResForm.resourceId) {
          let name = file.name.substring(0, file.name.lastIndexOf("."));
          this.commonResForm.resName = name;
        }
      } else {
        this.commonResForm.file = null;
        this.commonResForm.resSize = "";
        this.commonResForm.originalName = "";
        this.commonResForm.resType = "";
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
              this.disableTabPane.elTabPane1 = true;
              this.disableTabPane.elTabPane3 = true;
              this.disableTabPane.elTabPane4 = true;
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
        this.folderResForm.files.forEach(element => {
          element.tips = String(this.tkTips);
          element.tipsText = String(this.tkTipsText);
        });
        axios
          .request({
            method: "post",
            url: "/v1/resourceLibrary/addFolderResource",
            data: {
              rlId: this.currentResLib.rlId,
              resName: this.folderResForm.resName,
              folderTips: this.tkTips,
              folderTipsText: this.tkTipsText,
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
              this.loadResList();
            }
          });
      }
      this.disableTabPane.elTabPane1 = false;
      this.disableTabPane.elTabPane3 = false;
      this.disableTabPane.elTabPane4 = false;
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
    // 确定上传AR
    doUploadArRes() {
      this.$refs["arResForm"].validate(valid => {
        if (valid) {
          if (this.arResForm.isSuccess) {
            let isValidWeb = false;
            if (
              this.arResForm.files &&
              ((this.arResForm.files.length > 0 &&
                this.arResForm.hasIndexHtml) ||
                this.arResForm.files.length === 0)
            ) {
              isValidWeb = true;
            }
            if (isValidWeb) {
              this.arResForm.isSuccess = false;
              this.loading.loadingArSure = true;
              this.loading.loadingEditAr = true;
              this.arResForm.total = 0;
              this.arResForm.done = 0;
              this.disableTabPane.elTabPane1 = true;
              this.disableTabPane.elTabPane2 = true;
              this.disableTabPane.elTabPane4 = true;
              if (this.arResForm.android.file) {
                this.arResForm.total++;
              }
              if (this.arResForm.ios.file) {
                this.arResForm.total++;
              }
              if (this.arResForm.design.file) {
                this.arResForm.total++;
              }
              if (this.arResForm.files.length > 0) {
                this.arResForm.total += this.arResForm.files.length;
              }
              if (this.arResForm.total > 0) {
                if (this.arResForm.design.file) {
                  let path = `${dateStr("YYYYMM")}/resource/${
                    this.arResForm.design.originalName
                  }`;
                  this.imgCos.putObject(
                    {
                      Bucket:
                        this.cosConfig.imgBucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.arResForm.design.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.arResForm.design.percentage = parseFloat(
                          p.toFixed(2)
                        );
                      }
                    },
                    (err, result) => {
                      if (!err) {
                        this.arResForm.design.url = encodeURI(
                          `https://${this.cosConfig.imgBucket}.guangyiedu.com/${path}`
                        );
                        if (this.arResForm.resourceId) {
                          this.editArSubmit();
                        } else {
                          this.arSubmit();
                        }
                      } else {
                        console.log("imgerr", err);
                      }
                    }
                  );
                }
                if (this.arResForm.android.file) {
                  // 上传android
                  this.arResForm.android.showProgress = true;
                  let path = `${dateStr("YYYYMM")}/${
                    this.arResForm.android.originalName
                  }`;
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.arResForm.android.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.arResForm.android.percentage = parseFloat(
                          p.toFixed(2)
                        );
                      }
                    },
                    (err, result) => {
                      if (!err) {
                        this.arResForm.android.url = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        if (this.arResForm.resourceId) {
                          this.editArSubmit();
                        } else {
                          this.arSubmit();
                        }
                      } else {
                        console.log("android", err);
                      }
                    }
                  );
                }
                if (this.arResForm.ios.file) {
                  // 上传 ios
                  this.arResForm.ios.showProgress = true;
                  let path = `${dateStr("YYYYMM")}/ios/${
                    this.arResForm.ios.originalName
                  }`;
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.arResForm.ios.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.arResForm.ios.percentage = parseFloat(
                          p.toFixed(2)
                        );
                      }
                    },
                    (err, result) => {
                      if (!err) {
                        this.arResForm.ios.url = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        if (this.arResForm.resourceId) {
                          this.editArSubmit();
                        } else {
                          this.arSubmit();
                        }
                      } else {
                        console.log("ios", err);
                      }
                    }
                  );
                }
                if (this.arResForm.files && this.arResForm.files.length > 0) {
                  this.arResForm.showProgress = true;
                  this.arResForm.files.forEach((value, index, files) => {
                    if (value.type === 1 || value.type === 2) {
                      // 音频和视频 用VOD上传
                      let uploader = this.vod.upload({
                        mediaFile: value.file // file是js的文件引用
                      });
                      uploader.on("media_progress", info => {
                        let p = Number(info.percent) * 100;
                        value.percentage = parseFloat(p.toFixed(2));
                      });
                      uploader.done().then(info => {
                        value.url = info.video.url;
                        value.cloudId = info.fileId;
                        if (this.arResForm.resourceId) {
                          this.editArSubmit();
                        } else {
                          this.arSubmit();
                        }
                      });
                    } else {
                      // 其他的 用COS上传
                      let path = `${dateStr("YYYYMM")}/web/${
                        value.originalName
                      }`;
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
                            value.percentage = parseFloat(p.toFixed(2));
                          }
                        },
                        (err, result) => {
                          if (!err) {
                            value.url = encodeURI(
                              `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                            );
                            if (value.file.name === "index.html") {
                              this.arResForm.webUrl = value.url;
                            }
                            if (this.arResForm.resourceId) {
                              this.editArSubmit();
                            } else {
                              this.arSubmit();
                            }
                          } else {
                            console.log(err);
                          }
                        }
                      );
                    }
                  });
                }
              } else {
                if (this.arResForm.resourceId) {
                  this.editArSubmit(true);
                } else {
                  this.arSubmit(true);
                }
              }
            } else {
              this.$message({
                type: "warning",
                message: "web资源下必须有index.html"
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: "请等待上传完成"
            });
          }
        }
      });
    },
    // Ar上传提交到数据库
    arSubmit(isIncre) {
      if (!isIncre) {
        this.arResForm.done++;
      }
      if (this.arResForm.total === this.arResForm.done) {
        let params = {};
        params.rlId = this.currentResLib.rlId;
        params.resName = this.arResForm.resName;
        params.tips = String(this.tkTips);
        params.tipsText = String(this.tkTipsText);
        if (this.arResForm.uniqueId) {
          params.uniqueId = this.arResForm.uniqueId;
        }
        if (this.arResForm.design.url) {
          params.designPic = this.arResForm.design.url;
        }
        if (this.arResForm.android.url) {
          params.resUrl = this.arResForm.android.url;
        }
        if (this.arResForm.ios.url) {
          params.resUrlIos = this.arResForm.ios.url;
        }
        if (this.arResForm.webUrl) {
          params.resUrlWeb = this.arResForm.webUrl;
        }
        if (this.arResForm.appVersion) {
          params.appVersion = this.arResForm.appVersion;
        }
        axios
          .request({
            method: "post",
            url: "/v1/resourceLibrary/addArResource",
            data: params
          })
          .then(res => {
            let ret = res.data;
            this.arResForm.isSuccess = true;
            this.isUploadResShow = false;
            setTimeout(() => {
              this.loading.loadingArSure = false;
              this.loading.loadingEditAr = false;
            }, this.global.btnResumeTime);
            if (ret.code == 200) {
              this.loadResList();
            }
          });
      }
      this.disableTabPane.elTabPane1 = false;
      this.disableTabPane.elTabPane2 = false;
      this.disableTabPane.elTabPane4 = false;
    },
    // 关闭上传AR弹框
    doCancelUploadAR(editAr) {
      if (this.loading.loadingArSure && this.loading.loadingEditAr) {
        this.$message({
          type: "warning",
          message: "当前正在上传文件夹，上传完成才可关闭弹窗!"
        });
      } else {
        if (editAr == 1) {
          this.isEditArResShow = false;
        } else {
          this.isUploadResShow = false;
        }
      }
    },
    // android 文件修改事件
    androidFileChange(file) {
      if (file) {
        this.arResForm.android.file = file;
        this.arResForm.android.resSize = file.size;
        this.arResForm.android.originalName = file.name;
        this.arResForm.android.resType = this.toResType(file.type) + "";
        this.arResForm.android.percentage = 0;
      } else {
        this.arResForm.android.file = null;
        this.arResForm.android.resSize = "";
        this.arResForm.android.originalName = "";
        this.arResForm.android.resType = "";
        this.arResForm.android.percentage = 0;
      }
    },
    // ios 文件修改事件
    iosFileChange(file) {
      if (file) {
        this.arResForm.ios.file = file;
        this.arResForm.ios.resSize = file.size;
        this.arResForm.ios.originalName = file.name;
        this.arResForm.ios.resType = this.toResType(file.type) + "";
        this.arResForm.ios.percentage = 0;
      } else {
        this.arResForm.ios.file = null;
        this.arResForm.ios.resSize = "";
        this.arResForm.ios.originalName = "";
        this.arResForm.ios.resType = "";
        this.arResForm.ios.percentage = 0;
      }
    },
    // web 文件夹修改事件
    webFileChange(event) {
      let array = [];
      let files = event.target.files;
      let hasIndexHtml = false;
      for (let i = 0; i < files.length; i++) {
        let tmp = {};
        tmp.file = files[i];
        tmp.type = this.toResType(tmp.file.type);
        tmp.size = tmp.file.size;
        tmp.originalName = tmp.file.webkitRelativePath;
        tmp.percentage = 0;
        array.push(tmp);
        if (tmp.originalName.indexOf("index.html") != -1) {
          hasIndexHtml = true;
        }
      }
      this.arResForm.files = array;
      this.arResForm.hasIndexHtml = hasIndexHtml;
    },
    // 上传语音评测
    doUploadVoiceRes() {
      this.$refs["voiceResForm"].validate(valid => {
        if (valid) {
          this.loading.loadingYypcSure = true;
          this.disableTabPane.elTabPane1 = true;
          this.disableTabPane.elTabPane2 = true;
          this.disableTabPane.elTabPane3 = true;
          let params = {};
          params.rlId = this.currentResLib.rlId;
          params.resName = this.voiceResForm.resName;
          params.uniqueId = this.voiceResForm.uniqueId;
          params.tips = String(this.tkTips);
          params.tipsText = String(this.tkTipsText);
          axios
            .request({
              method: "post",
              url: "/v1/resourceLibrary/addVoiceResource",
              data: params
            })
            .then(res => {
              let ret = res.data;
              this.loading.loadingYypcSure = false;
              this.isUploadResShow = false;
              if (ret.code == 200) {
                this.loadResList();
              }
            });
        }
      });
      this.disableTabPane.elTabPane1 = false;
      this.disableTabPane.elTabPane2 = false;
      this.disableTabPane.elTabPane3 = false;
    },
    doUploadRichTextRes() {
      this.$refs["richTextResForm"].validate(valid => {
        if (valid) {
          // this.loading.loadingYypcSure = true;
          // this.disableTabPane.elTabPane1 = true;
          // this.disableTabPane.elTabPane2 = true;
          // this.disableTabPane.elTabPane3 = true;
          let params = {};
          params.rlId = this.currentResLib.rlId;
          params.resName = this.richTextResForm.resName;
          params.uniqueId = this.richTextResForm.uniqueId;
          params.tips = this.richTextResForm.tips.join(",");
          params.tipsText = this.richTextResForm.tipsText.join(",");
          params.resUrl = "111111111";
          params.resType = 15;
          params.resDesc = this.richTextResForm.resContent;
          axios
            .request({
              method: "post",
              url: "/v1/resourceLibrary/addResource",
              data: params
            })
            .then(res => {
              let ret = res.data;
              // this.loading.loadingYypcSure = false;
              this.isUploadResShow = false;
              if (ret.code == 200) {
                this.loadResList();
              }
            });
        }
      });
      // this.disableTabPane.elTabPane1 = false;
      // this.disableTabPane.elTabPane2 = false;
      // this.disableTabPane.elTabPane3 = false;
    },
    // 显示添加语音
    showVoice(row) {
      this.isShowVoice = true;
      this.voiceForm.resourceId = row.rlrResourceId;
      this.loadVoice();
    },
    showSubVoice() {
      if (this.voiceForm.isSuccess) {
        this.voiceForm.voiceChinese = "";
        this.voiceForm.voiceText = "";
        this.voiceForm.showProgress = false;
        this.voiceForm.percentage = 0;
      }
      this.isVoiceNew = true;
      this.isShowSubVoice = true;
      this.$nextTick(() => {
        this.$refs.voiceFileModal.clearFile();
      });
      this.voiceForm.file = null;
    },
    loadVoice() {
      axios
        .request({
          method: "post",
          url: "/resource/voice/listWithCount",
          data: {
            resourceId: this.voiceForm.resourceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.voice = ret.data.data;
          }
        });
    },
    voiceFileChange(file) {
      if (file) {
        this.voiceForm.file = file;
      }
    },
    uploadVoice() {
      if (this.isVoiceNew) {
        this.$refs["voiceForm"].validate(valid => {
          if (valid) {
            if (this.voiceForm.file) {
              this.loading.loadingYy = true;
              if (this.voiceForm.file.type.indexOf("audio") != -1) {
                let fileUrl = URL.createObjectURL(this.voiceForm.file);
                let audioElement = new Audio(fileUrl);
                audioElement.addEventListener("loadedmetadata", _event => {
                  let duration = parseInt(audioElement.duration);
                  this.voiceForm.voiceDuration = duration;
                  let path =
                    dateStr("YYYYMM") + "/voice/" + this.voiceForm.file.name;
                  this.voiceForm.showProgress = true;
                  this.voiceForm.isSuccess = false;
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.voiceForm.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.voiceForm.percentage = p;
                      }
                    },
                    (err, result) => {
                      this.voiceForm.isSuccess = true;
                      if (!err) {
                        this.voiceForm.voiceVideo = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        axios
                          .request({
                            method: "post",
                            url: "/resource/voice/insert",
                            data: {
                              resourceId: this.voiceForm.resourceId,
                              voiceText: this.voiceForm.voiceText,
                              voiceChinese: this.voiceForm.voiceChinese,
                              voiceVideo: this.voiceForm.voiceVideo,
                              voiceDuration: this.voiceForm.voiceDuration
                            }
                          })
                          .then(res => {
                            let ret = res.data;
                            setTimeout(() => {
                              this.loading.loadingYy = false;
                            }, this.global.btnResumeTime);
                            if (ret.code == 200) {
                              this.isShowSubVoice = false;
                              this.loadVoice();
                            }
                          });
                      } else {
                        console.log(err);
                      }
                    }
                  );
                });
              } else {
                this.$message({
                  type: "warning",
                  message: "请上传正确的音频文件"
                });
              }
            } else {
              this.$message({
                type: "warning",
                message: "请选择上传音频文件"
              });
            }
          }
        });
      } else {
        axios
          .request({
            method: "post",
            url: "/resource/voice/update",
            data: {
              resourceId: this.voiceForm.resourceId,
              voiceId: this.voiceForm.voiceId,
              voiceText: this.voiceForm.voiceText,
              voiceChinese: this.voiceForm.voiceChinese
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code == 200) {
              this.isShowSubVoice = false;
              this.loadVoice();
            }
          });
      }
    },
    editVoice(row) {
      if (this.voiceForm.isSuccess) {
        this.isVoiceNew = false;
        this.isShowSubVoice = true;
        this.voiceForm.voiceId = row.voiceId;
        this.voiceForm.voiceChinese = row.voiceChinese;
        this.voiceForm.voiceText = row.voiceText;
      } else {
        this.$message({
          type: "warning",
          message: "正在上传, 请稍等"
        });
      }
    },
    deleteVoice(row) {
      axios
        .request({
          method: "post",
          url: "/resource/voice/delete",
          data: {
            voiceId: row.voiceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.loadVoice();
          }
        });
    },
    //-----------------------------编辑上传-----------------------------------------------
    handleEdit(row) {
      if (row.tips) {
        //去掉tips前后的逗号
        if (row.tips.substring(row.tips.length - 1) == ",") {
          row.tips = row.tips.substring(0, row.tips.length - 1);
        }
        if (row.tips.substring(0, 1) == ",") {
          row.tips = row.tips.substring(1, row.tips.length);
        }
      }
      this.tkTreeParams.data = this.recordTip;
      this.tkTips = row.tips ? row.tips.split(",") : "";
      this.tkTipsText = row.tipsText;
      if (row.resModel === 1) {
        if (row.resType == 15) {
          // 富文本编辑
          this.richTextResForm.resourceId = row.rlrResourceId;
          this.richTextResForm.resName = row.resName;
          this.richTextResForm.uniqueId = row.uniqueId;
          this.richTextResForm.resContent = row.resDesc;
          this.richTextResForm.tips = row.tips ? row.tips.split(",") : [];
          this.richTextResForm.tipsText = row.tipsText
            ? row.tipsText.split(",")
            : [];
          this.isEditRichTextResShow = true;
          if (this.$refs.richTextResForm) {
            this.$nextTick(res => {
              this.$refs.richTextResForm.clearValidate();
            });
          }
          if (this.recordTip.length >= 0) {
            if (this.$refs.tkTreeSelect) {
              this.$nextTick(() => {
                this.$refs.tkTreeSelect.treeDataUpdateFun(this.recordTip);
              });
            }
          }
          return;
        }
        // 常规资源编辑
        this.commonResForm.resourceId = row.rlrResourceId;
        this.commonResForm.resName = row.resName;
        this.commonResForm.resUrl = "";
        this.commonResForm.resType = `${row.resType}`;
        this.commonResForm.showProgress = false;
        this.isEditComResShow = true;
        this.$nextTick(res => {
          if (this.$refs.editFileModal) {
            this.$refs.editFileModal.clearFile();
          }
        });
        if (this.$refs.commonResForm) {
          this.$refs.commonResForm.clearValidate();
        }
      } else if (row.resModel === 2) {
        // AR资源编辑
        this.arResForm.resourceId = row.rlrResourceId;
        this.arResForm.resName = row.resName;
        this.arResForm.uniqueId = row.uniqueId;
        this.arResForm.appVersion = row.appVersion;
        this.arResForm.designPic = row.designPic;
        this.arResForm.android.showProgress = false;
        this.arResForm.android.percentage = 0;
        this.arResForm.ios.showProgress = false;
        this.arResForm.ios.percentage = 0;
        this.arResForm.design.showProgress = false;
        this.arResForm.design.percentage = 0;
        this.arResForm.showProgress = false;
        this.arResForm.files = [];
        this.isEditArResShow = true;
        this.$nextTick(res => {
          if (this.$refs.iosEditFileModal) {
            this.$refs.iosEditFileModal.clearFile();
          }
          if (this.$refs.androidEditFileModal) {
            this.$refs.androidEditFileModal.clearFile();
          }
          if (this.$refs.designEditFileModal) {
            this.$refs.designEditFileModal.clearFile();
          }
          if (this.$refs.webEditFileModal) {
            this.$refs.webEditFileModal.value = "";
          }
          if (this.$refs.arResForm) {
            this.$refs.arResForm.clearValidate();
          }
        });
      } else if (row.resModel === 3) {
        // 文件夹编辑
        this.folderResForm.resourceId = row.rlrResourceId;
        this.folderResForm.resName = row.resName;
        this.isEditFolderResShow = true;
        this.$nextTick(res => {
          if (this.$refs.folderEditFile) {
            this.$refs.folderEditFile.values = "";
          }
          if (this.$refs.folderResForm) {
            this.$refs.folderResForm.clearValidate();
          }
        });
      } else if (row.resModel === 4) {
        // 语音评测编辑
        this.voiceResForm.resourceId = row.rlrResourceId;
        this.voiceResForm.resName = row.resName;
        this.voiceResForm.uniqueId = row.uniqueId;
        this.isEditVoiceResShow = true;
        if (this.$refs.voiceResForm) {
          this.$nextTick(res => {
            this.$refs.voiceResForm.clearValidate();
          });
        }
      }
    },
    // 确定编辑常规资源
    doEditComRes() {
      this.$refs["commonResForm"].validate(valid => {
        if (valid) {
          this.loading.loadindEditComRes = true;
          if (this.commonResForm.file) {
            // 不支持的文件类型不能上传
            if (
              this.commonResForm.resType == 0 ||
              this.commonResForm.resType == 3 ||
              this.commonResForm.resType == 12
            ) {
              this.$message({
                type: "warning",
                message: "不支持该文件类型"
              });
              return;
            }
            // 超过500M的文件不能上传
            if (this.commonResForm.resSize / 1024 / 1024 > 500) {
              this.$message({
                type: "warning",
                message: "大小不能超过500M"
              });
              return;
            }
            this.commonResForm.showProgress = true;
            this.commonResForm.showEditProgress = true;
            this.commonResForm.cloudId = "";
            if (
              this.commonResForm.resType == 1 ||
              this.commonResForm.resType == 2
            ) {
              // 音频和视频 用VOD上传
              this.uploader = this.vod.upload({
                mediaFile: this.commonResForm.file // file是js的文件引用
              });
              this.uploader.on("media_progress", info => {
                let p = Number(info.percent) * 100;
                this.commonResForm.percentage = parseFloat(p.toFixed(2));
              });
              this.uploader
                .done()
                .then(info => {
                  this.uploader = null;
                  this.commonResForm.resUrl = info.video.url;
                  this.commonResForm.cloudId = info.fileId;
                  this.editComResSubmit();
                })
                .catch(() => {
                  this.loading.loadindEditComRes = false;
                  this.commonResForm.showProgress = false;
                  this.commonResForm.percentage = 0;
                  this.commonResForm.cloudId = "";
                  this.$message({
                    type: "warning",
                    message: "不支持的音视频类型"
                  });
                });
            } else {
              // 其他的 用COS上传
              let path =
                dateStr("YYYYMM") +
                "/" +
                this.$store.state.user.userId +
                new Date().valueOf() +
                common.getFileType(this.commonResForm.file.name);
              this.cos.putObject(
                {
                  Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
                  Region: this.cosConfig.region,
                  Key: path,
                  StorageClass: "STANDARD",
                  Body: this.commonResForm.file,
                  onProgress: curr => {
                    let p = Number(curr.percent) * 100;
                    this.commonResForm.percentage = parseFloat(p.toFixed(2));
                  }
                },
                (err, result) => {
                  this.taskList = [];
                  if (!err) {
                    this.commonResForm.resUrl = encodeURI(
                      `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                    );
                    this.editComResSubmit();
                  } else {
                    console.log(err);
                  }
                }
              );
              this.taskList = this.cos.getTaskList();
            }
          } else {
            this.commonResForm.cloudId = "";
            this.editComResSubmit();
          }
        }
      });
    },
    //编辑上传的常规资源提交到数据库
    editComResSubmit() {
      let params = {};
      params.resourceId = this.commonResForm.resourceId;
      params.resName = this.commonResForm.resName;
      params.resType = this.commonResForm.resType;
      params.resSize = this.commonResForm.resSize;
      params.originalName = this.commonResForm.originalName;
      if (this.commonResForm.cloudId) {
        params.cloudId = this.commonResForm.cloudId;
      }
      if (this.commonResForm.resUrl) {
        params.resUrl = this.commonResForm.resUrl;
        params.resUrlIos = this.commonResForm.resUrl;
        params.resUrlWeb = this.commonResForm.resUrl;
      }
      params.tips = this.tkTips;
      params.tipsText = this.tkTipsText;
      axios
        .request({
          method: "post",
          url: "/v1/resource/modify",
          data: params
        })
        .then(res => {
          let ret = res.data;
          this.isEditComResShow = false;
          setTimeout(() => {
            this.loading.loadindEditComRes = false;
          }, this.global.btnResumeTime);
          this.commonResForm.showProgress = false;
          if (ret.code == 200) {
            this.loadResList();
          }
        });
    },
    // 取消编辑常规资源
    doCancelEditComRes() {
      if (this.loading.loadindEditComRes) {
        if (this.uploader && this.commonResForm.cloudId) {
          this.uploader.cancel();
        }
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.commonResForm.showProgress = false;
        this.commonResForm.percentage = 0;
        this.loading.loadindEditComRes = false;
      } else {
        this.isEditComResShow = false;
      }
    },
    //关闭编辑常规资源弹框之前判断有没有上传任务
    handleCloseEditComResBefore(done) {
      if (this.loading.loadindEditComRes == false) {
        done();
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    // 修改文件夹
    doEditFolder() {
      this.loading.loadingEditFolder = true;
      axios
        .request({
          method: "post",
          url: "/v1/resource/modify",
          data: {
            resourceId: this.folderResForm.resourceId,
            resName: this.folderResForm.resName,
            tips: this.tkTips,
            tipsText: this.tkTipsText
          }
        })
        .then(res => {
          let ret = res.data;
          this.isEditFolderResShow = false;
          this.loading.loadingEditFolder = false;
          if (ret.code == 200) {
            this.loadResList();
          }
        });
    },
    // 修改AR上传提交到数据库
    editArSubmit(isIncre) {
      this.loading.loadingEditAr = true;
      if (!isIncre) {
        this.arResForm.done++;
      }
      if (this.arResForm.total === this.arResForm.done) {
        let params = {};
        params.resourceId = this.arResForm.resourceId;
        params.resName = this.arResForm.resName;
        params.tips = this.tkTips;
        params.tipsText = this.tkTipsText;
        if (this.arResForm.appVersion) {
          params.appVersion = this.arResForm.appVersion;
        }
        if (this.arResForm.design.url) {
          params.designPic = this.arResForm.design.url;
        }
        if (this.arResForm.android.url) {
          params.resUrl = this.arResForm.android.url;
        }
        if (this.arResForm.ios.url) {
          params.resUrlIos = this.arResForm.ios.url;
        }
        if (this.arResForm.webUrl) {
          params.resUrlWeb = this.arResForm.webUrl;
        }
        axios
          .request({
            method: "post",
            url: "/v1/resource/modify",
            data: params
          })
          .then(res => {
            let ret = res.data;
            this.arResForm.isSuccess = true;
            this.isEditArResShow = false;
            this.loading.loadingArSure = false;
            this.loading.loadingEditAr = false;
            if (ret.code == 200) {
              this.loadResList();
            }
          });
      }
      this.disableTabPane.elTabPane1 = false;
      this.disableTabPane.elTabPane2 = false;
      this.disableTabPane.elTabPane4 = false;
    },
    //关闭编辑AR弹框之前判断有没有上传任务
    handleCloseEditArBefore(done) {
      if (this.loading.loadingArSure == false) {
        done();
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    // 封面修改事件
    designFileChange(file) {
      if (file) {
        this.arResForm.design.file = file;
        this.arResForm.design.resSize = file.size;
        this.arResForm.design.originalName = file.name;
        this.arResForm.design.resType = this.toResType(file.type) + "";
        this.arResForm.design.percentage = 0;
      }
    },
    // 修改语音评测
    doEditVoiceRes() {
      this.$refs["voiceResForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/resource/modify",
              data: {
                resourceId: this.voiceResForm.resourceId,
                resName: this.voiceResForm.resName,
                tips: this.tkTips,
                tipsText: this.tkTipsText
              }
            })
            .then(res => {
              let ret = res.data;
              this.isEditVoiceResShow = false;
              if (ret.code == 200) {
                this.loadResList();
              }
            });
        }
      });
    },
    // 修改富文本资源
    doEditRichTextRes() {
      this.$refs["richTextResEditForm"].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: "/v1/resource/modify",
              data: {
                resourceId: this.richTextResForm.resourceId,
                resName: this.richTextResForm.resName,
                resDesc: this.richTextResForm.resContent,
                tips: this.richTextResForm.tips.join(","),
                tipsText: this.richTextResForm.tipsText.join(",")
              }
            })
            .then(res => {
              let ret = res.data;
              this.isEditRichTextResShow = false;
              if (ret.code == 200) {
                this.$message({
                  type: "success",
                  message: ret.msg
                });
                this.loadResList();
              }
            });
        }
      });
    },
    // 删除资源
    handleDel(row) {
      let rlrId = "";
      if (row) {
        rlrId = row.rlrId;
      } else {
        this.selectedRes.forEach(element => {
          rlrId += `${element.rlrId},`;
        });
      }
      this.$confirm("确认要删除所选资源吗？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/resource/resLibResource/delete",
              data: {
                rlrId: rlrId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  (this.resList.length == 1 ||
                    this.resList.length == this.selectedRes.length)
                ) {
                  this.page.currentPage--;
                }
                this.loadResList();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    //资源大小
    formatResSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "";
    },
    // 时间
    formatTableDate(row, column, cellValue, index) {
      return format(cellValue);
    },
    formatDate(time) {
      return format(time);
    },
    formatResTypeName(resType) {
      if (resType) {
        return common.resTypeFormat(resType);
      }
    },
    formatShowTip(tipsText) {
      if (tipsText) {
        if (tipsText.substring(tipsText.length - 1) == ",") {
          tipsText = tipsText.substring(0, tipsText.length - 1);
        }
        if (tipsText.substring(0, 1) == ",") {
          tipsText = tipsText.substring(1, tipsText.length);
        }
        if (tipsText) {
          return tipsText.split(",");
        } else {
          return [];
        }
      }
    },
    /**
     * 根据文件类型 转换成 资源类型
     */
    toResType(fileType) {
      // file.name.endsWith(".flv") 判断字符串以什么结尾 true
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
    // 加载APK列表
    loadApk() {
      axios
        .request({
          method: "post",
          url: "/platform/apk/listAll"
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.apk = ret.data;
          }
        });
    },
    // 初始化COS
    initCosV5() {
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
            this.imgCos = new COS({
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
    initVod() {
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
    }
  }
};
</script>
<style lang="scss">
.commonRes {
  width: 100%;
  .fullBtn {
    position: absolute;
    top: 20px;
    right: 60px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .el-aside {
    background: #ffffff;
    border-radius: 4px;
    margin-right: 15px;
    width: 100%;
    .listHeader {
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
      img {
        width: 16px;
        cursor: pointer;
      }
    }
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
        padding-right: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
      height: 46px !important;
      line-height: 46px !important;
      border-bottom: 1px solid #eaeaea;
    }
    .el-submenu .el-menu-item {
      min-width: 160px;
    }
    .el-menu-item {
      padding: 0 8px 0 35px !important;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .el-main {
    min-height: 638px;
    padding: 0;
    .allSearch {
      margin-bottom: 13px;
    }
    .tableContent {
      border-radius: 4px;
      padding: 13px 13px;
      background: #ffffff;
      .tabelHeader {
        overflow: hidden;
        .el-form {
          float: left;
          .el-form-item {
            margin-bottom: 0;
            .el-form-item__content {
              line-height: 32px;
            }
          }
        }
        .operateBtn {
          float: right;
        }
      }
    }
  }
  .moveTable {
    thead {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
  //上传弹框
  .uploadModal .el-dialog {
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
  // 常规资源表单
  .common-res {
    .progress {
      margin-top: 5px;
      margin-bottom: 10px;
    }
  }
  // 获取弹框
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
  .resPath {
    margin-top: 15px;
    margin-bottom: 15px;
    .path {
      cursor: pointer;
      font-weight: bold;
    }
  }
  .resList {
    .el-table td,
    .el-table th {
      padding: 0;
    }
    .info {
      overflow: hidden;
      padding: 0;
      .left {
        float: left;
        margin-top: 20px;
        margin-left: 24px;
        cursor: pointer;
        img {
          width: 100px;
          height: 60px;
        }
      }
      .middle {
        float: left;
        margin: 0;
        padding: 0;
        margin-top: 12px;
        margin-left: 20px;
        text-align: left;
        max-width: 58%;
        .name {
          font-size: 14px;
          color: #333333;
        }
        .resourceId {
          font-size: 14px;
          color: #666666;
          margin-top: 5px;
          margin-bottom: 5px;
        }
        .tipsText {
          span {
            display: inline-block;
            padding: 0 12px;
            background: #edf1f7;
            border-radius: 12px;
            color: #0d4376;
            font-size: 12px;
            opacity: 0.7;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
      .right {
        float: right;
        .resSize,
        .updateTime {
          float: right;
          font-size: 12px;
          color: #999999;
          height: 100%;
          line-height: 100px;
          margin-right: 20px;
        }
      }
    }
  }
}
// .el-tree-select-popper{
//   left: 550px !important;
// }
</style>
