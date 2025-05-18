<template>
  <el-container class="officialRes">
    <!-- 资源库列表 -->
    <el-aside width="182px">
      <div class="listHeader-official">
        机构资源库
        <img
          v-if="roleId == 25"
          src="@/assets/images/plus.png"
          alt=""
          @click="newRes"
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
          placeholder="机构资源库名称"
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
      <div style="height:638px;overflow-y:auto">
        <el-tree
          :data="resListData"
          :props="defaultProps"
          :expand-on-click-node="false"
          highlight-current
          node-key="rlId"
          ref="vuetree"
          icon-class="el-icon-arrow-right"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandTreeArr"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :title="node.label">{{ node.label }}</span>
            <span v-if="uid == data.rlUid || roleId == 25">
              <!-- 如果是机构管理员或者作者可以拥有操作权限 -->
              <editPopover
                :noAdd="data.level >= 3"
                v-on:onSelected="popoverClick"
                :bank="data"
              ></editPopover>
            </span>
          </span>
        </el-tree>
      </div>
    </el-aside>
    <!-- 资源列表 -->
    <el-main>
      <div class="tabelHeader">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="类型">
            <el-select
              v-model="searchForm.resType"
              placeholder="资源类型"
              size="small"
              style="width:100px;"
              @change="onSubmit"
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
            <el-input
              v-model.trim="searchForm.resName"
              placeholder="搜索资源"
              size="small"
              style="width:150px;"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="onSubmit"
              size="small"
            ></el-button>
          </el-form-item>
        </el-form>
        <el-row class="operateBtn">
          <el-button
            size="small"
            v-if="showButtons"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleTransfer()"
            >转让</el-button
          >
          <el-button
            size="small"
            v-if="showButtons"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleMove()"
            >移动</el-button
          >
          <el-button
            size="small"
            v-if="showButtons"
            style="border-color:#2BA1F4;color:#2BA1F4;"
            @click="handleDel()"
            >删除</el-button
          >
          <!-- <el-button type="primary" size="small" @click="uploadRes"
            >+富文本H5</el-button
          > -->
          <el-button
            v-if="roleId == 25"
            type="primary"
            size="small"
            @click="uploadRes"
            >上传</el-button
          >
        </el-row>
      </div>
      <div class="currentChildrenResLib">
        <el-row v-for="item in currentResLib.sonResLib" :key="item.rlId">
          <el-col
            :span="24"
            @click.native="invertClick(item, currentResLib.rlId)"
            >{{ item.rlName }}
            <i class="el-icon-arrow-right"></i>
            <span>{{ formatDate(item.rlCreateTime) }}</span>
          </el-col>
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
          <el-table-column
            type="selection"
            align="center"
            :selectable="isSelectable"
          >
          </el-table-column>
          <el-table-column align="center" min-width="700">
            <div slot-scope="scope" class="info">
              <div class="left">
                <img
                  v-if="scope.row.resType === 1"
                  src="@/assets/images/audio.png"
                  @click="handleViewRes(scope.row)"
                />
                <div
                  v-else-if="scope.row.resType === 2"
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
                  v-else-if="scope.row.resType === 3"
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
                  v-else-if="scope.row.resType === 4"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/excel.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 5"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/h5.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 6"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/ppt.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 7"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/word.png"
                  alt=""
                />
                <img
                  v-else-if="scope.row.resType === 9"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/pdf.png"
                  alt=""
                />
                <div
                  v-else-if="scope.row.resType === 10"
                  @click="handleViewRes(scope.row)"
                  style="width:100px;height:60px;"
                >
                  <img
                    v-if="scope.row.designPic"
                    :src="scope.row.designPic"
                    alt=""
                    style="height:60px;width:auto;max-width:100px;"
                  />
                  <img v-else src="@/assets/images/img.png" />
                </div>
                <img
                  v-else-if="scope.row.resType === 11"
                  style="cursor: pointer;"
                  src="@/assets/images/fileFolder.png"
                  alt=""
                  @click="toFolder(scope.row)"
                />
                <img
                  v-else-if="scope.row.resType === 12"
                  @click="handleViewRes(scope.row)"
                  src="@/assets/images/yypc.png"
                  alt=""
                />
                <img
                  v-else
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
                <div class="uniqueId">
                  <span>{{ scope.row.uniqueId }}</span
                  ><span>{{ scope.row.tipsText }}</span>
                </div>
              </div>
              <div class="right">
                <div class="updateTime">
                  {{ formatDate(scope.row.updated) }}
                </div>
                <div class="resSize" v-if="scope.row.resModel === 1">
                  {{ formatResSize(scope.row.resSize) }}
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" width="100">
            <div slot-scope="scope">
              <div :span="3" v-if="scope.row.resStatus === 0">
                <span class="startRes">启用</span>
              </div>
              <div :span="3" v-if="scope.row.resStatus === 1">
                <span class="stopRes">停用</span>
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" width="150">
            <div slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)"
                v-if="
                  scope.row.review != 1 &&
                    (scope.row.memberId === uid || roleId == 25) &&
                    scope.row.resPubId == pubId
                "
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)"
                v-else
                >编辑</el-button
              >
              <el-dropdown trigger="click">
                <span
                  class="el-dropdown-link"
                  style="color:#409EFF;font-size:12px;cursor: pointer;"
                >
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.memberId === uid && scope.row.resType === 2"
                    @click.native="showSnapshot(scope.row)"
                    >视频封面</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.memberId === uid && scope.row.resType === 3"
                    @click.native="showMatchpic(scope.row)"
                    >对比图片</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="
                      scope.row.memberId === uid && scope.row.resType === 12
                    "
                    @click.native="showVoice(scope.row)"
                    >添加语音</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.rlrCommitUid === uid"
                    @click.native="handleMove(scope.row)"
                    >移动</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.memberId != uid"
                    @click.native="showError(scope.row)"
                    >报错</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="showTrace(scope.row)"
                    >追踪</el-dropdown-item
                  >
                  <el-dropdown-item v-if="hasButton('changeOrgResStatus')">
                    启用<el-switch
                      :value="scope.row.resStatus == 0"
                      style="margin-left:30px;"
                      @change="changeStatus(scope.row)"
                    ></el-switch>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.rlrCommitUid === uid || roleId == 25"
                    @click.native="handleTransfer(scope.row)"
                    >转让</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.rlrCommitUid === uid || roleId == 25"
                    @click.native="handleDel(scope.row)"
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
          从{{ (page.currentPage - 1) * page.pagesize + 1 }}到{{
            (page.currentPage - 1) * page.pagesize + resList.length
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
          :current-page.sync="page.currentPage"
          background
          @current-change="loadResList"
        ></el-pagination>
      </div>
    </el-main>
    <!-- 新建/编辑资源库 -->
    <el-dialog
      :visible.sync="isNewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>
            {{ ruleResForm.rlId.length == 0 ? "新建资源库" : "修改资源库" }}
          </div>
        </div>
      </template>
      <el-form
        :model="ruleResForm"
        :rules="newResRules"
        ref="ruleResForm"
        label-width="90px"
        class="demo-ruleForm"
        style="margin:0 20px;"
        @submit.native.prevent
      >
        <el-form-item label="资源库名" prop="rlName">
          <el-input
            v-model.trim="ruleResForm.rlName"
            maxlength="80"
            show-word-limit
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="newResSure"
          >确定</el-button
        >
        <el-button size="small" @click="isNewResShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 预览资源 -->
    <el-dialog
      top="6vh"
      :visible.sync="isViewResShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :fullscreen="isFull"
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
        :style="viewResObj.resType == 2 ? 'height:400px' : ''"
      ></viewRes>
    </el-dialog>
    <!-- 移动资源 -->
    <el-dialog
      :visible.sync="isMoveResShow"
      :modal-append-to-body="false"
      class="moveModal"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>移动资源</div>
        </div>
      </template>
      <ul>
        <li>
          移动到库:<span>{{ moveToLib }}</span>
        </li>
        <li>
          <el-tree
            accordion
            ref="libTree"
            :data="resListData"
            :props="defaultProps"
            :highlight-current="highlightMoveLib"
            :expand-on-click-node="false"
            node-key="rlId"
            icon-class="el-icon-arrow-right"
            @current-change="moveSelected"
            @node-click="highlightMoveLib = true"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </li>
      </ul>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doMove">确定</el-button>
        <el-button size="small" @click="isMoveResShow = false">取消</el-button>
      </span>
    </el-dialog>
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
        <el-button size="small" @click="isShowSnapshot = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 显示对比图片 -->
    <el-dialog
      :visible.sync="isShowMatchpic"
      :modal-append-to-body="false"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>对比图片</div>
        </div>
      </template>
      <div>
        <el-form
          :model="matchpicForm"
          :rules="matchpicFormRules"
          ref="matchpicForm"
          label-width="100px"
          style="margin:0 40px;"
        >
          <el-form-item label="选择文件" prop="name" style="width:400px;">
            <fileModal
              ref="matchpicFileModal"
              v-on:fileChange="matchpicFileChange"
            ></fileModal>
          </el-form-item>
          <el-form-item label="主场景" prop="mainScene" style="width:400px;">
            <el-input
              size="small"
              v-model="matchpicForm.mainScene"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left:245px;">
            <el-button
              size="mini"
              type="primary"
              @click="uploadMatchPic"
              :loading="loading.loadingMatchPic"
              >上传</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="matchpic"
          border
          :header-cell-style="{
            'background-image':
              'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
            color: '#333333',
            height: '40px',
            padding: '0'
          }"
        >
          <el-table-column prop="matchPicUrl" label="对比图片" align="center">
            <template slot-scope="scope">
              <img
                :src="scope.row.matchPicUrl"
                style="width: 60px;height:60px;"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="mainScene"
            label="场景"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="updated"
            label="添加时间"
            :formatter="formatTableDate"
            align="center"
          ></el-table-column>
          <el-table-column align="center">
            <div slot-scope="scope">
              <el-button size="mini" type="text" @click="delMatchPic(scope.row)"
                >删除</el-button
              >
            </div>
          </el-table-column>
        </el-table>
      </div>
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
              type="textarea"
              size="small"
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
    <!-- 追踪 -->
    <el-dialog
      :visible.sync="isShowTrace"
      :modal-append-to-body="false"
      width="800px"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div>
          <div></div>
          <div>资源追踪</div>
        </div>
      </template>
      <div>
        <div>
          <span>资源类型：{{ traceResType }}</span
          ><span style="margin-left:30px;">资源名称：{{ traceResName }}</span>
          <el-table
            :data="trace"
            border
            empty-text="当前资源无绑定教材"
            style="margin-top:20px;"
            :header-cell-style="{
              'background-image':
                'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
              color: '#333333',
              height: '40px',
              padding: '0'
            }"
          >
            <el-table-column
              prop="tname"
              label="书名"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="tb_num"
              label="书号"
              width="180"
            ></el-table-column>
            <el-table-column prop="resChapter" label="章节"></el-table-column>
            <el-table-column prop="resPage" label="页码"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column
              prop="bundTime"
              label="绑定时间"
              :formatter="formatTableDate"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 报错 -->
    <el-dialog :visible.sync="isShowError" :modal-append-to-body="false">
      <template slot="title">
        <div>
          <div></div>
          <div>纠错与举报</div>
        </div>
      </template>
      <div style="margin:0 5%">
        <div style="margin-bottom:10px;color:#333;font-size:15px">
          你觉得这个资源有什么问题？
        </div>
        <el-radio-group
          v-model="reportType"
          style="margin-top:10px;margin-bottom:20px;color:#333;font-size:13px;"
        >
          <el-radio style="margin-bottom:10px" label="0">内容有误</el-radio>
          <el-radio style="margin-bottom:10px" label="1">违法违禁</el-radio>
          <el-radio style="margin-bottom:10px" label="2">抄袭我的资源</el-radio>
          <el-radio style="margin-bottom:10px" label="3">有其他问题</el-radio>
        </el-radio-group>
        <div style="color:#2BA1F4;font-size:13px;">
          为了帮助审核人员更快处理，请详细描述问题*
        </div>
        <textarea
          placeholder=""
          v-model="reportDes"
          style="margin-top:10px;width:100%;border-radius:5px;border-color:#ccc;height:100px;padding:5px 15px;"
        ></textarea>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="resErrorSure"
          >确定</el-button
        >
        <el-button size="small" @click="isShowError = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 上传 -->
    <el-dialog
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
              class="common-res"
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
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="commonResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="标签" prop="uniqueId">
                <el-input
                  v-model="commonResForm.uniqueId"
                  maxlength="50"
                  show-word-limit
                  size="small"
                ></el-input>
              </el-form-item>
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
              class="demo-ruleForm"
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
              <el-form-item label="标签" prop="uniqueId">
                <el-input
                  v-model="folderResForm.uniqueId"
                  maxlength="50"
                  show-word-limit
                  size="small"
                ></el-input>
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
              class="demo-ruleForm"
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
              <el-form-item label="标签" prop="uniqueId">
                <el-input
                  v-model="arResForm.uniqueId"
                  maxlength="50"
                  show-word-limit
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
              class="demo-ruleForm"
              style="margin:0 90px;"
            >
              <el-form-item label="资源名" prop="resName">
                <el-input
                  v-model.trim="voiceResForm.resName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="标签" prop="uniqueId">
                <el-input
                  v-model="voiceResForm.uniqueId"
                  maxlength="50"
                  show-word-limit
                  size="small"
                ></el-input>
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
              <el-form-item label="标签" prop="uniqueId">
                <el-input
                  v-model="richTextResForm.uniqueId"
                  size="small"
                ></el-input>
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
        <el-form-item label="标签" prop="uniqueId">
          <el-input v-model="richTextResForm.uniqueId" size="small"></el-input>
          <!-- <el-tree-select
            @input="tkTipSelectChange"
            :styles="tkTipTreeStyle"
            :value="tkTips"
            size="small"
            :selectParams="tkSelectParams"
            :treeParams="tkTreeParams"
            @searchFun="tkTipSearch"
            ref="tkTreeSelect"
          /> -->
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
        class="demo-ruleForm"
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
        <el-form-item label="资源名" prop="resName">
          <el-input
            v-model.trim="commonResForm.resName"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="uniqueId">
          <el-input
            v-model="commonResForm.uniqueId"
            maxlength="50"
            show-word-limit
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
        class="demo-ruleForm"
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
        <el-form-item label="标签" prop="uniqueId">
          <el-input
            v-model="folderResForm.uniqueId"
            maxlength="50"
            show-word-limit
            size="small"
          ></el-input>
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
        class="demo-ruleForm"
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
        <el-form-item label="标签" prop="uniqueId">
          <el-input
            v-model="arResForm.uniqueId"
            maxlength="50"
            show-word-limit
            size="small"
          ></el-input>
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
        class="demo-ruleForm"
        style="margin:20px 90px;"
      >
        <el-form-item label="资源名" prop="resName">
          <el-input v-model.trim="voiceResForm.resName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="uniqueId">
          <el-input
            v-model="voiceResForm.uniqueId"
            maxlength="50"
            show-word-limit
            size="small"
          ></el-input>
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
  </el-container>
</template>
<script>
import axios from "@/libs/api.request";
import jdialog from "@/components/jdialog";
import editPopover from "../../tiku/editPopover";
import { mapGetters } from "vuex";
import fileModal from "@/components/fileModal";
import { format, dateStr } from "@/utils/datetime";
import common from "@/utils/common";
import viewRes from "@/components/viewRes";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import Ueditor from "@/components/ueditor";

export default {
  name: "officialRes",
  components: {
    editPopover,
    fileModal,
    jdialog,
    viewRes,
    Ueditor
  },
  data() {
    return {
      isFull: false,
      resLibName: "",
      isShowSearchInput: false,
      initialFrameHeight: 200,
      highlightMoveLib: true,
      types: common.resTypes,
      resType: common.resType,
      uid: this.$store.state.user.userId,
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      pubId: this.$store.state.user.currentRole.pubId, //用户的机构ID
      // 是否显示批量按钮
      showButtons: false,
      apk: [],
      // 新建资源库名称
      defaultProps: {
        label: "rlName",
        children: "sonResLib"
      },
      expandTreeArr: [],
      resList: [],
      isNewResShow: false,
      ruleResForm: {
        rlId: "",
        rlName: "",
        rlParentId: ""
      },
      newResRules: {
        rlName: [
          { required: true, message: "请输入资源库名称", trigger: "click" },
          {
            min: 1,
            max: 80,
            message: "长度在 1 到 80 个字符",
            trigger: "click"
          }
        ]
      },
      currentResLib: {},
      searchForm: {
        resType: "",
        resName: ""
      },
      loading: {
        loadingRes: false,
        loadingComResSure: false,
        loadingFolderSure: false,
        loadingArSure: false,
        loadingYypcSure: false,
        loadindEditComRes: false,
        loadingEditFolder: false,
        loadingYy: false,
        loadingMatchPic: false
      },
      isShowBreadcrumb: false,
      breadcrumb: [
        {
          name: "返回上一级",
          rlrNo: "0"
        }
      ],
      resListData: [],
      selectedRes: [],
      page: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      isShowError: false,
      reportDes: "",
      reportType: "",
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      // 移动资源
      isMoveResShow: false,
      currentResRow: {},
      // 移动资源到库的库名
      moveToLib: "",
      // 视频封面
      isShowSnapshot: false,
      snapshotForm: {
        selectedSnapshot: "",
        resourceId: "",
        tsInfo: ""
      },
      snapshotShow: [],
      // 对比图片
      isShowMatchpic: false,
      matchpic: [],
      matchpicForm: {
        mainScene: "",
        file: null
      },
      matchpicFormRules: {
        mainScene: [
          { required: true, message: "请输入主场景", trigger: "blur" }
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
      // 显示追踪
      isShowTrace: false,
      traceResType: "",
      traceResName: "",
      trace: [],
      // 转让
      isTransferShow: false,
      member: [], // 转让成员的列表
      selectedMember: 0, // 转让成员的ID
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
      isEditRichTextResShow: false,
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
  watch: {
    selectedRes() {
      if (this.selectedRes.length > 0) {
        this.showButtons = true;
      } else {
        this.showButtons = false;
      }
    }
  },
  computed: {
    ...mapGetters(["hasButton"])
  },
  mounted() {
    this.loadMyResLibrary();
    this.initCosV5();
    this.initVod();
    this.bus.$on(
      "refreshResList",
      function(id) {
        if (this.currentResLib.rlId == id) {
          this.loadResList();
        }
      }.bind(this)
    );
  },
  beforeDestroy() {
    this.bus.$off("refreshResList");
  },
  methods: {
    searchOfficalLLib() {
      // 搜索机构资源库
      this.loadMyResLibrary();
    },
    changeStatus(row) {
      let status = "";
      if (row.resStatus === 0) {
        status = 1;
      } else {
        status = 0;
      }
      axios
        .request({
          method: "post",
          url: "/v1/resource/enabled",
          data: {
            resourceId: row.rlrResourceId,
            status: status
          }
        })
        .then(data => {
          let res = data.data;
          if (res.code === 200) {
            if (row.resStatus === 1) {
              row.resStatus = 0;
            } else {
              row.resStatus = 1;
            }
            this.$message({
              type: "success",
              message: res.msg
            });
          }
        });
    },
    // 时间
    formatTableDate(row, column, cellValue, index) {
      return format(cellValue);
    },
    formatDate(time) {
      return format(time);
    },
    formatResSize(size) {
      if (size) {
        if (size < 1024 * 1024) {
          return (size / 1024).toFixed(1) + "KB";
        } else {
          return (size / (1024 * 1024)).toFixed(1) + "MB";
        }
      }
      return "0KB";
    },
    formatResTypeName(resType) {
      if (resType) {
        return common.resTypeFormat(resType);
      }
    },
    //新建资源库弹框事件
    newRes() {
      this.ruleResForm.rlId = "";
      this.ruleResForm.rlName = "";
      this.ruleResForm.rlParentId = "";
      this.isNewResShow = true;
    },
    popoverClick(index, bank) {
      if (index == "1") {
        this.ruleResForm.rlId = "";
        this.ruleResForm.rlName = "";
        this.ruleResForm.rlParentId = "" + bank.rlId;
        this.$nextTick(() => {
          this.$refs.ruleResForm.clearValidate();
        });
        this.isNewResShow = true;
      } else if (index == "2") {
        this.ruleResForm.rlId = "" + bank.rlId;
        this.ruleResForm.rlName = bank.rlName;
        this.ruleResForm.rlParentId = "" + bank.rlParentId;
        this.$nextTick(() => {
          this.$refs.ruleResForm.clearValidate();
        });
        this.isNewResShow = true;
      } else if (index == "4") {
        this.ruleResForm.rlId = bank.rlId;
        this.delResSure();
      }
    },
    //确定新建资源库事件
    newResSure() {
      this.$refs["ruleResForm"].validate(valid => {
        if (valid) {
          let url = "/v1/orgResourceLibrary/buildResLib";
          if (this.ruleResForm.rlId.length > 0) {
            url = "/v1/orgResourceLibrary/alterLibInfo";
          }
          axios
            .request({
              method: "post",
              url: process.env.BASE_URL + url,
              data: this.ruleResForm
            })
            .then(
              function(data) {
                let res = data.data;
                if (res.code == 200) {
                  this.isNewResShow = false;
                  this.loadMyResLibrary();
                }
              }.bind(this)
            );
        }
      });
    },
    // 删除资源库
    delResSure() {
      this.$confirm(
        "<div>确认要删除所选资源库吗？</div>删除后，资源库中的资源将同时删除且不可恢复",
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
              url: "/v1/resourceLibrary/delete",
              data: { rlId: this.ruleResForm.rlId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadMyResLibrary();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    // 加载资源库列表
    loadMyResLibrary() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/v1/orgResourceLibrary/resLibList",
          data: {
            uid: this.$store.state.user.userId,
            name: this.resLibName.trim()
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.resListData = res.data;
              this.setLevel(this.resListData, 1);
              if (res.data.length > 0) {
                var first = res.data[0];
                this.currentResLib = first;
                this.$nextTick(() => {
                  this.$refs.vuetree.setCurrentKey(this.currentResLib.rlId);
                });
                this.loadResList();
              } else {
                this.resList = [];
              }
            }
          }.bind(this)
        );
    },
    // 设置资源库列表等级
    setLevel(data, level) {
      data.forEach(element => {
        element.level = level;
        if (element.sonResLib.length > 0) {
          this.setLevel(element.sonResLib, level + 1);
        }
      });
    },
    // 点击资源库item
    handleNodeClick(bank) {
      this.$nextTick(() => {
        document.querySelector(".el-tabs__content").scrollTop = 0;
      });
      if (bank.rlId !== this.currentResLib.rlId) {
        this.currentResLib = bank;
        this.searchForm.resType = "";
        this.searchForm.resName = "";
        this.searchForm.rlrParentNo = "0";
        this.page.currentPage = 1;
        this.loadResList();
        this.breadcrumb.splice(1);
        this.isShowBreadcrumb = false;
      }
    },
    //反选tree
    invertClick(data, expendId) {
      this.handleNodeClick(data);
      this.$nextTick(() => {
        this.$refs.vuetree.setCurrentKey(data.rlId);
        this.expandTreeArr.push(expendId);
      });
    },
    // 获取资源列表
    loadResList() {
      if (this.currentResLib.rlId) {
        let data = {
          rlrRlId: this.currentResLib.rlId,
          page: this.page.currentPage,
          pagesize: this.page.pagesize
        };
        data.resType = this.searchForm.resType;
        data.resName = this.searchForm.resName;
        if (this.searchForm.rlrParentNo) {
          data.rlrParentNo = this.searchForm.rlrParentNo;
        } else {
          data.rlrParentNo = "0";
        }
        this.loading.loadingRes = true;
        axios
          .request({
            method: "post",
            url: "/v1/orgResourceLibrary/resource",
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
      }
    },
    // 查询
    onSubmit() {
      this.page.currentPage = 1;
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
        let current = {
          name: row.resName,
          rlrNo: row.rlrNo
        };
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = true;
        }
        this.breadcrumb.push(current);
      } else {
        this.breadcrumb.splice(index + 1);
        if (this.breadcrumb.length === 1) {
          this.isShowBreadcrumb = false;
        }
      }
      this.searchForm.resName = "";
      this.searchForm.resType = "";
      this.page.currentPage = 1;
      this.loadResList();
    },
    isSelectable(row) {
      if (row && (row.rlrCommitUid == this.uid || this.roleId == 25)) {
        return true;
      }
      return false;
    },
    // 资源列表选择事件
    changeSelect(selection) {
      this.selectedRes = selection;
    },
    //查看资源
    handleViewRes(row) {
      let { rlrResourceId, resType } = row;
      if (resType === 9) {
        // 查看pdf资源
        axios
          .request({
            method: "post",
            responseType: "blob",
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
    //删除资源
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
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //纠错弹框显示
    showError(row) {
      this.reportType = "";
      this.reportDes = "";
      this.currentResRow = row;
      this.isShowError = true;
    },
    //确定纠错事件
    resErrorSure() {
      if (this.reportType.length == 0) {
        return;
      }
      axios
        .request({
          method: "post",
          url: "/v1/resource/feedback",
          data: {
            resourceId: this.currentResRow.rlrResourceId,
            subType: this.reportType,
            content: `${this.reportDes}(${this.currentResRow.rlrResourceId})`
          }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.isShowError = false;
              let res = data.data;
              this.$message({
                type: "success",
                message: res.msg
              });
            }
          }.bind(this)
        );
    },
    //移动资源显示弹框
    handleMove(row) {
      if (row) {
        this.currentResRow = row;
      } else {
        this.currentResRow = {};
      }
      this.highlightMoveLib = false;
      this.moveToLib = "";
      this.isMoveResShow = true;
    },
    //确定移动资源事件
    doMove() {
      let id = this.$refs.libTree.getCurrentKey();
      if (id) {
        if (id != this.currentResLib.rlId) {
          let rlrIds = "";
          if (this.currentResRow.rlrId) {
            rlrIds = this.currentResRow.rlrId;
          } else {
            this.selectedRes.forEach(element => {
              rlrIds += `${element.rlrId},`;
            });
          }
          axios
            .request({
              method: "post",
              url: "/resource/resLibResource/moveTo",
              data: {
                rlrIds: rlrIds,
                rlId: id
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
                this.isMoveResShow = false;
                this.loadResList();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "移动资源服务不可用"
              });
            });
        } else {
          this.$message({
            type: "warning",
            message: "该资源已在当前选中库"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选目标库"
        });
      }
    },
    //移动资源的节点变化事件
    moveSelected(row) {
      this.moveToLib = row.rlName;
    },
    // 转让
    handleTransfer(row) {
      if (row) {
        this.currentResRow = row;
      } else {
        this.currentResRow = {};
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
      let resIds = "";
      if (this.currentResRow.rlrId) {
        resIds = this.currentResRow.rlrId;
      } else {
        this.selectedRes.forEach(element => {
          resIds += `${element.rlrId},`;
        });
      }
      if (this.selectedMember > 0) {
        axios
          .request({
            method: "post",
            url: "/v1/resource/transferEditPermission",
            data: {
              relaIdSStr: resIds,
              userId: this.selectedMember
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.isTransferShow = false;
              this.loadResList();
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
    // 视频封面
    showSnapshot(row) {
      this.snapshotShow = [];
      this.isShowSnapshot = true;
      this.snapshotForm.resourceId = row.rlrResourceId;
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
            this.loadResList();
          }
        });
    },
    // 显示对比图片
    showMatchpic(row) {
      this.isShowMatchpic = true;
      this.$nextTick(res => {
        if (this.$refs.matchpicFileModal) {
          this.$refs.matchpicFileModal.clearFile();
        }
      });
      this.matchpicForm.resourceId = row.rlrResourceId;
      this.matchpicForm.mainScene = "";
      this.loadMatchpic();
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
                this.loadMatchpic();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    loadMatchpic() {
      axios
        .request({
          method: "post",
          url: "/resource/tspMatchPic/listAll",
          data: {
            resourceId: this.matchpicForm.resourceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.matchpic = ret.data;
          }
        });
    },
    matchpicFileChange(file) {
      this.matchpicForm.file = file;
    },
    uploadMatchPic() {
      this.$refs["matchpicForm"].validate(valid => {
        if (valid) {
          if (!this.matchpicForm.file) {
            this.$message({
              type: "warning",
              message: "请先选择文件"
            });
            return;
          }
          this.loading.loadingMatchPic = true;
          var fd = new FormData();
          fd.append("resourceId", this.matchpicForm.resourceId);
          fd.append("picFile", this.matchpicForm.file);
          fd.append("mainScene", this.matchpicForm.mainScene);
          axios
            .request({
              method: "post",
              url: "/v1/matchPic/createMatchPic",
              data: fd
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                setTimeout(() => {
                  this.loading.loadingMatchPic = false;
                }, this.global.btnResumeTime);
                this.loadMatchpic();
                this.$nextTick(res => {
                  if (this.$refs.matchpicFileModal) {
                    this.$refs.matchpicFileModal.clearFile();
                  }
                });
                this.matchpicForm.mainScene = "";
                this.matchpicForm.file = null;
              } else {
                this.$message({
                  type: "warning",
                  message: ret.msg
                });
              }
            })
            .catch(() => {
              this.loading.loadingMatchPic = false;
              this.$message({
                type: "warning",
                message: "该服务不可用"
              });
            });
        }
      });
    },
    // 显示追踪
    showTrace(row) {
      this.traceResType = common.resTypeFormat(row.resType);
      this.traceResName = row.resName;
      this.isShowTrace = true;
      axios
        .request({
          method: "post",
          url: "/resource/resource/resPositionTrack",
          data: {
            resourceId: row.rlrResourceId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.trace = ret.data;
          }
        });
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
          // ???
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
    //-----------------------------上传-----------------------------------------------
    //显示上传对话框
    uploadRes() {
      if (this.resListData.length > 0) {
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
          this.$nextTick(res => {
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
      } else {
        this.$message({
          type: "warning",
          message: "请先创建机构资源库"
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
            cloudId: this.commonResForm.cloudId
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
        axios
          .request({
            method: "post",
            url: "/v1/resourceLibrary/addFolderResource",
            data: {
              rlId: this.currentResLib.rlId,
              resName: this.folderResForm.resName,
              uniqueId: this.folderResForm.uniqueId,
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
                        console.log("err", err);
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
          if (this.voiceResForm.uniqueId) {
            params.uniqueId = this.voiceResForm.uniqueId;
          }
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
    //--------------------------编辑上传--------------------------------------------------
    // 显示编辑对话框
    handleEdit(row) {
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
          return;
        }
        // 常规资源编辑
        this.commonResForm.resourceId = row.rlrResourceId;
        this.commonResForm.resName = row.resName;
        this.commonResForm.uniqueId = row.uniqueId;
        this.commonResForm.resType = `${row.resType}`;
        this.commonResForm.showProgress = false;
        this.isEditComResShow = true;
        this.$nextTick(res => {
          if (this.$refs.editFileModal) {
            this.$refs.editFileModal.clearFile();
          }
          this.$refs.commonResForm.clearValidate();
        });
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
          this.$refs.arResForm.clearValidate();
        });
      } else if (row.resModel === 3) {
        // 文件夹编辑
        this.folderResForm.resourceId = row.rlrResourceId;
        this.folderResForm.resName = row.resName;
        this.folderResForm.uniqueId = row.uniqueId;
        this.isEditFolderResShow = true;
        this.$nextTick(res => {
          if (this.$refs.folderEditFile) {
            this.$refs.folderEditFile.values = "";
          }
          this.$refs.folderResForm.clearValidate();
        });
      } else if (row.resModel === 4) {
        // 语音评测编辑
        this.voiceResForm.resourceId = row.rlrResourceId;
        this.voiceResForm.resName = row.resName;
        this.voiceResForm.uniqueId = row.uniqueId;
        this.isEditVoiceResShow = true;
        this.$nextTick(res => {
          this.$refs.voiceResForm.clearValidate();
        });
      }
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
                tipsText: this.richTextResForm.tipsText.join(","),
                uniqueId: this.richTextResForm.uniqueId
              }
            })
            .then(res => {
              let ret = res.data;
              this.isEditRichTextResShow = false;
              if (ret.code == 200) {
                this.loadResList();
              }
            });
        }
      });
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
      params.uniqueId = this.commonResForm.uniqueId;
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
        params.uniqueId = this.arResForm.uniqueId;
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
            uniqueId: this.folderResForm.uniqueId
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
                uniqueId: this.voiceResForm.uniqueId
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
.officialRes {
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
    max-height: 700px;
    .listHeader-official {
      height: 46px;
      line-height: 46px;
      background-color: #2ba1f4;
      color: #ffffff;
      font-size: 16px;
      padding-left: 20px;
      letter-spacing: 1px;
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
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tree
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__children
      > .el-tree-node
      > .el-tree-node__content
      > .custom-tree-node
      > span:first-child {
      display: inline-block;
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    background: #ffffff;
    border-radius: 4px;
    min-height: 638px;
    padding: 13px;
    .tabelHeader {
      overflow: hidden;
      .el-form {
        float: left;
        .el-form-item {
          margin-bottom: 13px;
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
        .uniqueId {
          span:nth-child(1) {
            margin-right: 15px;
          }
          span {
            display: inline-block;
            padding: 0 12px;
            background: #edf1f7;
            border-radius: 12px;
            color: #0d4376;
            font-size: 12px;
            opacity: 0.7;
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
    .startRes {
      color: #666666;
      text-align: center;
      font-size: 14px;
    }
    .stopRes {
      background: #afc5d5;
      color: #ffffff;
      border-radius: 5px;
      padding: 5px 13px;
      text-align: center;
      font-size: 14px;
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
  // 视频封面
  .snapshot {
    .el-col {
      margin-bottom: 30px;
      text-align: center;
      box-shadow: 0px 15px 10px -15px #ccc;
      img {
        margin-bottom: 5px;
      }
      .el-radio {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
