<template>
  <el-container class="myRes">
    <!-- 资源库列表 -->
    <el-aside width="182px">
      <div class="listHeader">
        我的资源库
        <img src="@/assets/images/plus.png" alt="" @click="handleNewResLib" />
      </div>
      <div style="height:638px;overflow-y:auto">
        <el-tree
          :data="resListData"
          :props="defaultProps"
          v-loading="loading.resList"
          :expand-on-click-node="false"
          highlight-current
          node-key="libId"
          ref="vuetree"
          icon-class="el-icon-arrow-right"
          @node-click="handleNodeClick"
          :default-expanded-keys="expandTreeArr"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :title="node.label">{{ node.label }}</span>
            <span
              ><editPopover
                v-on:onSelected="popoverClick"
                :bank="data"
                :hasShare="true"
              ></editPopover
            ></span>
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
          <el-form-item style="width:200px">
            <el-select
              v-model="searchForm.tip"
              filterable
              clearable
              placeholder="请选择知识点"
              size="small"
              @change="onSubmit"
            >
              <el-option
                v-for="item in resLibTip"
                :key="item.tipText"
                :label="item.tipText + '(' + item.resAmount + ')'"
                :value="item.tipText"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="searchForm.resName"
              placeholder="请输入资源名称"
              size="small"
              style="width:150px;"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
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
          <el-button type="primary" size="small" @click="handleFromComFindBtn"
            >从公共库找资源</el-button
          >
          <!-- <el-button type="primary" size="small" @click="handleUploadH5"
            >+富文本H5</el-button
          > -->
          <el-button type="primary" size="small" @click="handleUpload()"
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
          <el-table-column type="selection" align="center"> </el-table-column>
          <el-table-column align="center" min-width="850">
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
                  style="background:rgba(0,0,0,0.5);width:100px;height:60px;border-radius: 4px;"
                >
                  <img
                    v-if="scope.row.resUrl"
                    :src="scope.row.resUrl"
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
                <!-- <div class="tipsText"><span>{{formatShowTip(scope.row.tipsText)}}</span></div> -->
                <div class="tipsText">
                  <span
                    v-for="(item, index) in formatShowTip(scope.row.tipsText)"
                    :key="index"
                    >{{ item }}</span
                  >
                </div>
              </div>
              <div class="right">
                <div class="updateTime">
                  {{ formatDate(scope.row.updated) }}
                </div>
                <div class="resSize">
                  {{ formatResSize(scope.row.resSize) }}
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" width="150">
            <div slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleUpload(scope.row)"
                v-if="scope.row.review != 1 && scope.row.memberId === uid"
                >编辑</el-button
              >
              <el-dropdown trigger="click">
                <span
                  class="el-dropdown-link"
                  style="color:#409EFF;font-size:12px;cursor: pointer;"
                  >更多</span
                >
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="
                      scope.row.review != 1 &&
                        scope.row.memberId === uid &&
                        scope.row.resType === 2
                    "
                    @click.native="showSnapshot(scope.row)"
                    >视频封面</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="handleMove(scope.row)"
                    >移动</el-dropdown-item
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
            {{ ruleResForm.libId.length == 0 ? "新建资源库" : "修改资源库" }}
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
        <el-form-item label="资源库名" prop="libName">
          <el-input
            v-model.trim="ruleResForm.libName"
            maxlength="80"
            show-word-limit
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="doNewResLibSure"
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
            node-key="libId"
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
          <div>{{ commonResForm.rlrResourceId ? "修改资源" : "上传资源" }}</div>
        </div>
      </template>
      <template>
        <el-form
          :model="commonResForm"
          :rules="commonResRules"
          ref="commonResForm"
          label-width="90px"
          class="common-res"
          style="margin:20px 70px;"
        >
          <el-form-item label="资源文件" style="margin-bottom:5px;">
            <fileModal
              ref="fileModal"
              v-on:fileChange="comResFileChange"
            ></fileModal>
            <div class="inputTips" style="line-height: 20px;">
              请上传小于500M的文件，支持的文件类型有：
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
                style="color:#2BA1F4;cursor:pointer"
              >
                <div slot="content" style="line-height:24px">
                  支持视频格式：mp4、avi、flv、wmv、asf、mpeg、mov、webm；<br />
                  支持音频格式：mp3、m4a
                </div>
                <span>视频、音频</span> </el-tooltip
              >、PDF、Word、PPT、Excel,zip压缩包等
            </div>
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
      </template>
    </el-dialog>
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
        <span>{{ currentShareBank.libName }}</span>
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
  </el-container>
</template>

<style lang="scss">
.myRes {
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
      height: 46px;
      line-height: 46px;
      background-color: #2ba1f4;
      color: #ffffff;
      font-size: 16px;
      padding-left: 20px;
      letter-spacing: 1px;
      img {
        // float: right;
        width: 16px;
        height: 16px;
        // margin: 15px 20px 0 0;
        cursor: pointer;
        font-size: 0;
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
    width: 650px;
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
  .tipTag {
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
}
.el-select-dropdown {
  max-width: 215px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script>
import axios from "@/libs/api.request";
import editPopover from "../../publication/popver";
import fileModal from "@/components/fileModal";
import { format, dateStr } from "@/utils/datetime";
import common from "@/utils/common";
import viewRes from "@/components/viewRes";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
export default {
  name: "myRes",
  components: {
    editPopover,
    fileModal,
    viewRes
  },
  data() {
    return {
      isFull: false,
      isUploadH5Show: false,
      highlightMoveLib: true,
      types: common.resTypes,
      resType: common.resType,
      uid: this.$store.state.user.userId,
      roleId: this.$store.state.user.currentRole.roleId, //用户的角色ID
      //知识点
      resLibTip: [],
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
      // 是否显示批量按钮
      showButtons: false,
      // 新建资源库名称
      defaultProps: {
        label: "libName",
        children: "sonResLib"
      },
      expandTreeArr: [],
      resList: [],
      isNewResShow: false,
      ruleResForm: {
        libId: "",
        libName: ""
      },
      newResRules: {
        libName: [
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
        resName: "",
        tip: ""
      },
      loading: {
        loadingRes: false,
        resList: false,
        loadingComResSure: false
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
        resId: "",
        tsInfo: ""
      },
      snapshotShow: [],
      // 上传
      isUploadResShow: false,
      commonResForm: {
        showProgress: false,
        file: null,
        percentage: 0,
        resType: "",
        resName: "",
        resSize: ""
      },
      commonResRules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "click" }
        ]
      },
      isShareShow: false, // 分享弹框
      shareModal2: false, // 是否展示分享弹框的第二部分
      currentShareBank: {},
      rsCode: "",
      shareLink: "",
      // 腾讯云 上传
      vod: null,
      cos: null,
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
  mounted() {
    this.loadMyResLibrary();
    this.initCosV5();
    this.initVod();
    this.bus.$on(
      "refreshResList",
      function(id) {
        if (this.currentResLib.libId == id) {
          this.loadResList();
          this.loadResLibTip();
        }
      }.bind(this)
    );
  },
  beforeDestroy() {
    this.bus.$off("refreshResList");
  },
  methods: {
    handleUploadH5() {
      this.isUploadH5Show = true;
    },
    //从公共库找资源 按钮
    handleFromComFindBtn() {
      this.$emit("changeTab");
    },
    //新建资源库显示弹框
    handleNewResLib() {
      this.ruleResForm.libId = "";
      this.ruleResForm.libName = "";
      this.isNewResShow = true;
    },
    popoverClick(index, bank) {
      if (index == "1") {
        this.ruleResForm.libId = "" + bank.libId;
        this.ruleResForm.libName = bank.libName;
        this.$nextTick(() => {
          this.$refs.ruleResForm.clearValidate();
        });
        this.isNewResShow = true;
      } else if (index == "2") {
        this.delResSure(bank);
      } else if (index == "3") {
        this.currentShareBank = bank;
        console.log(this.currentShareBank);
        this.shareModal2 = false;
        this.isShareShow = true;
      }
    },
    //确定新建资源库事件
    doNewResLibSure() {
      this.$refs["ruleResForm"].validate(valid => {
        if (valid) {
          let url = "/v1/myResource/insResLib";
          if (this.ruleResForm.libId.length > 0) {
            url = "resource/v4/resource/updPersonalLib";
          }
          axios
            .request({
              method: "post",
              url: url,
              data: this.ruleResForm
            })
            .then(
              function(v) {
                let res = v.data;
                if (res.code == 200) {
                  if (!this.ruleResForm.libId) {
                    var CountEvent =
                      window.JAnalyticsInterface.Event.CountEvent;
                    var cEvent = new CountEvent("create_resource_lib");
                    window.JAnalyticsInterface.onEvent(cEvent);
                  }
                  this.isNewResShow = false;
                  this.loadMyResLibrary();
                }
              }.bind(this)
            );
        }
      });
    },
    // 去创建分享链接
    toCreateShareLink() {
      this.rsCode = "";
      axios
        .request({
          method: "post",
          url: "/resource/v4/share/create",
          data: {
            rlId: this.currentShareBank.libId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.shareModal2 = true;
            this.rsCode = ret.data.rsCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=1&shareCode=" + this.rsCode;
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
          url: "/resource/v4/share/reset",
          data: {
            code: this.rsCode
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.rsCode = ret.data.rsCode;
            // this.shareLink = 'https://tfwww.jiudou123.com/index?type=1&shareCode=' + this.rsCode;
            // this.shareLink = 'https://pa.guangyiedu.com/index?type=1&shareCode=' + this.rsCode;
            this.shareLink =
              process.env.THIS_URI + "/index?type=1&shareCode=" + this.rsCode;
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
      //let Url2 = 'https://tfwww.jiudou123.com/index?type=1&shareCode=' + this.shareLink;  //每一行的某个值，如选中的当前行的url
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
    // 删除资源库
    delResSure(bank) {
      this.$confirm(
        "<div>你确定要删除资源库" +
          bank.libName +
          "吗？</div>删除后，资源库中的资源将同时删除且不可恢复",
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
              url: "/v1/myResource/delResLib",
              data: { libId: bank.libId }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                this.loadMyResLibrary();
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
    // 加载当前资源库知识点
    loadResLibTip() {
      axios
        .request({
          method: "post",
          url: "/resource/v4/resource/selTipTextAndResQuantityByLibId",
          data: { libId: this.currentResLib.libId }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code == 200) {
            this.resLibTip = ret.data;
          } else {
            this.resLibTip = [];
          }
          this.searchForm.tip = "";
          this.loadResList();
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
    // 加载原有课程体系知识点
    loadCourseTip() {
      if (this.courseId) {
        localStorage.setItem("selectedResCourseId", this.courseId);
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
    // 选择课程 本地存储上次使用知识点
    selectCourse() {
      if (localStorage.getItem("selectedResCourseId")) {
        this.courseId = parseInt(localStorage.getItem("selectedResCourseId"));
        this.loadCourseTip();
      }
    },
    //点击知识点tree  item
    handleTipNodeClick(row) {
      if (row.children.length == 0) {
        this.tagInputValue = row.name;
        this.handleInputConfirm();
      }
    },
    // 加载资源库列表
    loadMyResLibrary() {
      this.loading.resList = true;
      axios
        .request({
          method: "post",
          url: "resource/v4/resource/selPersonalLibList"
        })
        .then(
          function(data) {
            this.loading.resList = false;
            let res = data.data;
            if (res.code == 200) {
              if (res.data && res.data.length > 0) {
                this.resListData = res.data;
                var first = res.data[0];
                this.currentResLib = first;
                this.loadResLibTip();
                this.$nextTick(() => {
                  if (this.$refs.vuetree) {
                    this.$refs.vuetree.setCurrentKey(this.currentResLib.libId);
                  }
                });
                this.loadResList();
              }
            }
          }.bind(this)
        );
    },
    // 点击资源库item
    handleNodeClick(bank) {
      this.$nextTick(() => {
        document.querySelector(".el-tabs__content").scrollTop = 0;
      });
      if (bank.libId !== this.currentResLib.libId) {
        this.currentResLib = bank;
        this.searchForm.resType = "";
        this.searchForm.resName = "";
        this.searchForm.rlrParentNo = "0";
        this.page.currentPage = 1;
        this.loadResLibTip();
        this.breadcrumb.splice(1);
        this.isShowBreadcrumb = false;
      }
    },
    // 获取资源列表
    loadResList() {
      if (this.currentResLib.libId) {
        let data = {};
        data.pagesize = this.page.pagesize;
        data.resType = this.searchForm.resType;
        data.page = this.page.currentPage;
        data.resName = this.searchForm.resName;
        data.rlrRlId = this.currentResLib.libId;
        if (this.searchForm.rlrParentNo) {
          data.rlrParentNo = this.searchForm.rlrParentNo;
        } else {
          data.rlrParentNo = "0";
        }
        if (this.searchForm.tip) {
          data.tips = this.searchForm.tip;
        }
        this.loading.loadingRes = true;
        axios
          .request({
            method: "post",
            url: "/resource/v4/personalRL/itemsWithCount",
            data: data
          })
          .then(res => {
            this.loading.loadingRes = false;
            let ret = res.data;
            if (ret.code == 200) {
              if (ret.data) {
                this.page.total = ret.data.total;
                this.resList = ret.data.data;
              } else {
                this.page.total = 0;
                this.resList = [];
              }
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
      let resIds = "";
      let relationIds = "";
      if (row) {
        resIds = row.rlrResourceId;
        relationIds = row.rlrId;
      } else {
        this.selectedRes.forEach(element => {
          resIds += `${element.rlrResourceId},`;
        });
        this.selectedRes.forEach(element => {
          relationIds += `${element.rlrId},`;
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
              url: "/resource/v4/resource/delPersonalReses",
              data: {
                resIds: resIds,
                relationIds: relationIds,
                libId: this.currentResLib.libId
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  (this.resList.length == 1 ||
                    this.resList.length == this.selectedRes.lenght)
                ) {
                  this.page.currentPage--;
                }
                this.loadResList();
                this.loadResLibTip();
                this.$message({
                  type: "success",
                  message: ret.msg
                });
              }
            });
        })
        .catch(res => {
          console.log(res);
        });
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
      console.log(id);
      if (id) {
        if (id != this.currentResLib.libId) {
          let relationIds = "";
          if (this.currentResRow.rlrId) {
            relationIds = this.currentResRow.rlrId;
          } else {
            this.selectedRes.forEach(element => {
              relationIds += `${element.rlrId},`;
            });
          }
          axios
            .request({
              method: "post",
              url: "/resource/v4/resource/moveResesToAimLib",
              data: {
                relationIds: relationIds,
                aimLibId: id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code == 200) {
                if (
                  this.page.currentPage != 1 &&
                  (this.resList.length == 1 ||
                    this.resList.length == this.selectedRes.lenght)
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
      this.moveToLib = row.libName;
    },
    // 视频封面
    showSnapshot(row) {
      this.snapshotShow = [];
      this.isShowSnapshot = true;
      this.snapshotForm.resId = row.rlrResourceId;
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
          url: "/resource/v1/resource/updResPic",
          data: {
            resourceid: this.snapshotForm.resId,
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
    //上传弹框中知识点的三个方法
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
    //-----------------------------上传-----------------------------------------------
    //显示上传对话框
    handleUpload(row) {
      if (this.resListData.length > 0) {
        if (row && row.rlrResourceId) {
          //编辑
          this.commonResForm.resId = row.rlrResourceId;
          this.commonResForm.resName = row.resName;
          this.commonResForm.resType = `${row.resType}`;
          //去掉知识点前后的逗号
          if (row.tipsText.substring(row.tipsText.length - 1) == ",") {
            row.tipsText = row.tipsText.substring(0, row.tipsText.length - 1);
          }
          if (row.tipsText.substring(0, 1) == ",") {
            row.tipsText = row.tipsText.substring(1, row.tipsText.length);
          }
          this.tipTags = row.tipsText ? row.tipsText.split(",") : [];
          this.commonResForm.showProgress = false;
          this.tagInputVisible = false;
        } else {
          //新建
          this.commonResForm.resId = "";
          this.commonResForm.resName = "";
          this.commonResForm.resType = "";
          this.commonResForm.showProgress = false;
          this.commonResForm.percentage = 0;
          this.commonResForm.cloudId = "";
          this.tipTags = [];
        }
        this.isUploadResShow = true;
        this.loadCourse();
        this.$nextTick(res => {
          if (this.$refs.fileModal) {
            this.$refs.fileModal.clearFile();
          }
          this.$refs.commonResForm.clearValidate();
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先创建我的资源库"
        });
      }
    },
    //确定上传常规资源
    doUploadComRes() {
      this.$refs["commonResForm"].validate(valid => {
        if (valid) {
          if (this.commonResForm.resId) {
            //编辑
            if (this.commonResForm.file) {
              //重新上传
              this.uploadCommon();
            } else {
              //只修改资源名和知识点
              this.editComResSubmit();
            }
          } else {
            //新建
            if (this.commonResForm.file) {
              this.uploadCommon();
            } else {
              this.$message({
                type: "warning",
                message: "请选择上传文件"
              });
            }
          }
        }
      });
    },
    //上传资源公共部分
    uploadCommon() {
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
            if (this.commonResForm.resourceId) {
              this.editComResSubmit();
            } else {
              this.comResSubmit();
            }
          })
          .catch(() => {
            this.loading.loadingComResSure = false;
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
              if (this.commonResForm.resourceId) {
                this.editComResSubmit();
              } else {
                this.comResSubmit();
              }
            } else {
              console.log(err);
            }
          }
        );
        this.taskList = this.cos.getTaskList();
      }
    },
    //上传的常规资源提交到数据库
    comResSubmit() {
      this.handleInputConfirm();
      axios
        .request({
          method: "post",
          url: "/v1/myResource/insPersonalRes",
          data: {
            libId: this.currentResLib.libId,
            resUrl: this.commonResForm.resUrl,
            resSize: this.commonResForm.resSize,
            resType: this.commonResForm.resType,
            resName: this.commonResForm.resName,
            originalName: this.commonResForm.originalName,
            tipsText: this.tipTags.join(","),
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
            this.loadResLibTip();
          }
        })
        .catch(() => {
          this.loading.loadingComResSure = false;
          this.$message({
            type: "warning",
            message: "该服务不可用"
          });
        });
    },
    //编辑的的常规资源上传到数据库
    editComResSubmit() {
      this.handleInputConfirm();
      let data = {
        resId: this.commonResForm.resId,
        tipsText: this.tipTags.join(","),
        resName: this.commonResForm.resName
      };
      if (this.commonResForm.file) {
        data.resUrl = this.commonResForm.resUrl;
        data.resSize = this.commonResForm.resSize;
        data.resType = this.commonResForm.resType;
        data.originalName = this.commonResForm.originalName;
        data.cloudId = this.commonResForm.cloudId;
      }
      axios
        .request({
          method: "post",
          url: "/resource/v4/resource/updPersonalRes",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.isUploadResShow = false;
          setTimeout(() => {
            this.loading.loadingComResSure = false;
          }, this.global.btnResumeTime);
          if (ret.code == 200) {
            this.loadResLibTip();
          }
        })
        .catch(() => {
          this.loading.loadingComResSure = false;
          this.$message({
            type: "warning",
            message: "该服务不可用"
          });
        });
    },
    //关闭上传弹框之前判断有没有上传任务
    handleCloseUploadModalBefore() {
      if (this.loading.loadingComResSure == false) {
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
        if (!this.commonResForm.resId) {
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
      } else if (fileType.indexOf("application/x-zip-compressed") === 0) {
        type = 14;
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
