<template>
  <div class="chapterInfoBox">
    <el-container class="chapterInfo">
      <el-aside width="350px">
        <div :class="[isCatalog ? 'listHeader1' : 'listHeader']">
          <span :title="courseName" @click="clickCourse">{{ courseName }}</span>
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
          :data="catalogList"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="highlightCurrent"
          node-key="id"
          ref="vueChapterTree"
          icon-class="el-icon-arrow-right"
          :defaultExpandedKeys="expendArr"
          @node-click="handleNodeClick"
          :draggable="draggable"
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
        >
          <span
            class="custom-tree-node"
            ref="popover"
            slot-scope="{ node, data }"
          >
            <el-input
              v-if="data.isEdit"
              v-model="data.name"
              size="mini"
              autofocus
              @blur="suerUpdataCatalog(data)"
              @keyup.enter.native="$event.target.blur"
            ></el-input>
            <span v-else :title="node.label">{{ node.label }}</span>
            <span>
              <i
                style="color:#2BA1F4"
                class="el-icon-plus"
                title="添加子目录"
                v-if="node.level == 1"
                @click.stop="appendNode(node, data)"
              ></i>
              <i
                style="color:#2BA1F4"
                class="el-icon-s-promotion"
                title="移动"
                v-if="node.level == 2"
                @click.stop="ev => moveCatalogTwo(node, data, ev)"
              ></i>
              <i
                style="color:#2BA1F4"
                class="el-icon-edit-outline"
                title="重命名"
                @click.stop="ev => editNode(node, data, ev)"
              ></i>
              <i
                style="color:#2BA1F4"
                class="el-icon-delete"
                title="删除"
                @click.stop="removeNode(node, data)"
              ></i>
            </span>
          </span>
        </el-tree>
        <el-row v-show="addCatalogFlag" style="margin-top:10px;">
          <el-col :span="13">
            <el-input
              size="mini"
              autofocus
              v-model="inputCatalogName"
              placeholder="请输入章名称"
              @keyup.enter.native="addCatalogSure"
            ></el-input>
          </el-col>
          <el-col :span="11">
            <el-button
              size="mini"
              style="margin-left:7px;"
              @click.stop="addCatalogSure"
              :loading="loading.sureAddCatalogLoading"
              >确定</el-button
            >
            <el-button
              size="mini"
              style="margin-left:7px;"
              @click.stop="addCatalogCancel"
              >取消</el-button
            >
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <div class="chapterContent">
          <span>{{ rightTitle }}</span>
          <span class="addBtn1" @click="handleAddTestTask">添加测试任务</span>
          <span class="addBtn2" @click="handleBatchAdd">添加授课内容</span>
          <el-popover placement="bottom-end" trigger="hover">
            <div>授课内容：线上讲课内容的音频、视频或PDF文件</div>
            <div>测试任务：布置给学生的测试习题</div>
            <i
              class="el-icon-question"
              slot="reference"
              style="cursor:pointer;font-size:20px;margin-top:12.5px;margin-right:10px;float: right;"
            ></i>
          </el-popover>
        </div>
        <div class="empty" v-if="emptyImg">
          <img src="@/assets/images/empty1.png" alt="" />
          <div style="font-size:14px;color:#666666;margin-bottom:15px;">
            当前目录下暂无课程内容
          </div>
        </div>
        <div class="contentList" v-show="!emptyImg">
          <el-table
            :data="contentList"
            v-loading="loading.contentLoading"
            height="400"
          >
            <el-table-column label="课程内容列表" :render-header="renderHeader">
              <div slot-scope="scope">
                <span v-if="scope.row.subType == 3">{{ scope.row.name }} </span>
                <span
                  v-else
                  style="cursor:pointer"
                  @click="handleViewRes(scope.row)"
                  >{{ scope.row.name }}</span
                >
              </div>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <div slot-scope="scope">
                <el-button
                  size="small"
                  type="text"
                  v-if="scope.row.subType != 3"
                  @click="editContent(scope.row)"
                  >修改</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  v-if="scope.row.subType == 3"
                  @click="againSeletTest(scope.row)"
                  style="margin-left:0;"
                  >重新选题</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  @click="moveContent(scope.row)"
                  >移动到</el-button
                >
                <el-button
                  size="small"
                  type="text"
                  @click="deleteContent(scope.row, scope.$index)"
                  >删除</el-button
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <!-- 添加资源弹框 -->
      <el-dialog
        :visible.sync="isResShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        class="addModal"
        width="1000px"
        :before-close="closeAddModal"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ currentResId ? "修改课程文件" : "添加课程文件" }}</div>
          </div>
        </template>
        <div>
          <el-form
            :model="addResForm"
            :rules="addResFormRules"
            ref="addResForm"
            label-width="90px"
            class="demo-ruleForm"
            style="margin:0 90px;"
            @submit.native.prevent
          >
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="addResForm.title"
                autocomplete="off"
                size="small"
              ></el-input>
              <div class="inputTips">
                章节编号直接输在标题内，如：第1章 反函数与反三角函数
              </div>
            </el-form-item>
            <el-form-item label="学习内容">
              <div class="inputTips">
                大小不能超过500M，支持文件类型：视频、音频和PDF
              </div>
              <el-upload
                class="uploadBtn"
                :before-upload="fileChange"
                :show-file-list="false"
                action="#"
              >
                <el-button size="small" :type="addResForm.primary1"
                  >本地上传</el-button
                >
              </el-upload>
              <el-button
                size="small"
                :type="addResForm.primary2"
                @click="fromResLibBtn"
                >资源库获取</el-button
              >
              <el-button
                size="small"
                :type="addResForm.primary3"
                @click="fromOtherCloudBtn"
                v-if="newCourseType == 1"
                >云课导入</el-button
              >
            </el-form-item>
            <el-form-item label="">
              <span
                >{{ addResForm.showResName }}
                <i
                  class="el-icon-close cancelSelectBtn"
                  v-if="addResForm.showResName"
                  @click="cancelSelectBtn"
                ></i
              ></span>
            </el-form-item>
            <el-form-item
              label=""
              style="margin-bottom:5px;"
              v-if="addResForm.type == 1"
            >
              <el-progress
                :percentage="addResForm.percentage"
                v-if="addResForm.showProgress"
                class="progress"
              ></el-progress>
            </el-form-item>
          </el-form>
          <div v-if="addResForm.type == 2">
            <el-form :inline="true" size="small" :model="resForm">
              <el-form-item>
                <el-select
                  v-model="resForm.libType"
                  size="small"
                  style="width:100px;"
                  @change="resLibChange"
                >
                  <el-option label="公共" value="0"></el-option>
                  <!-- <el-option label="个人" value="1"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="resForm.libType == 1"
                label="资源库"
                style="margin-left:15px;"
              >
                <!-- <el-tree-select 
                v-model="resForm.myLib" 
                :selectParams="myParams"  
                size="small"
                :treeParams="myResTreeParams" 
                @searchFun="orgResSearch" 
                ref="orgResSelect"
                @input='resSearch'/> -->
              </el-form-item>
              <el-form-item
                v-if="resForm.libType == 0"
                label="资源库"
                style="margin-left:15px;"
              >
                <el-select
                  v-model="resForm.comLib"
                  size="small"
                  style="width:120px;"
                  @change="resSearch"
                >
                  <el-option
                    v-for="item in resForm.comLibList"
                    :key="item.rlId"
                    :label="item.rlName"
                    :value="item.rlId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" style="margin-left:15px;">
                <el-input
                  v-model="resForm.resName"
                  style="width:140px;"
                  placeholder="请输入资源名称"
                  @keyup.enter.native="resSearch"
                ></el-input>
              </el-form-item>
              <el-form-item label="资源类型" style="margin-left:15px;">
                <el-select
                  v-model="resForm.resType"
                  placeholder="类型"
                  size="small"
                  style="width:100px;"
                  @change="resSearch"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="音频" :value="1"></el-option>
                  <el-option label="视频" :value="2"></el-option>
                  <el-option label="PDF" :value="9"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="resSearch"
                  class="el-icon-search"
                ></el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="resForm.resData"
              stripe
              border
              v-loading="loading.resLoading"
              key="table2"
              :header-cell-style="{
                'background-image':
                  'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)',
                color: '#333333',
                height: '40px',
                padding: '0'
              }"
            >
              <el-table-column label="选择" align="center" width="60px">
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.row.resourceid"
                    v-model="resForm.resRadio"
                    @change="resRadioData(scope.row)"
                    >&nbsp;</el-radio
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="资源类型"
                prop="resType"
                align="center"
                :formatter="formatResType"
              ></el-table-column>
              <el-table-column label="资源名称" prop="resName" align="center">
                <template slot-scope="scope">
                  <div style="display:flex;justify-content:space-between">
                    <div
                      style="text-align: left;padding-right: 15px;cursor:pointer;"
                      @click="handleViewRes2(scope.row)"
                    >
                      {{ scope.row.resName }}
                    </div>
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleViewRes2(scope.row)"
                      >预览</el-button
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="资源大小"
                prop="resSize"
                align="center"
                :formatter="formatResSize"
              ></el-table-column>
              <el-table-column
                label="更新时间"
                prop="updated"
                align="center"
                :formatter="formatDate"
              ></el-table-column>
            </el-table>
            <div class="tabelFooter">
              <div v-if="resForm.resData.length" class="right-footer-first">
                从{{ (resPage.page - 1) * resPage.pagesize + 1 }}到{{
                  (resPage.page - 1) * resPage.pagesize +
                    resForm.resData.length
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
                @current-change="loadResList"
              ></el-pagination>
            </div>
          </div>
          <div v-if="addResForm.type == 3">
            <el-form :inline="true" size="small" :model="cloudForm">
              <el-form-item>
                <el-select
                  v-model="cloudForm.libType"
                  size="small"
                  style="width:100px;"
                  @change="cloudResChange"
                >
                  <el-option label="公共" value="0"></el-option>
                  <el-option label="个人" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="margin-left:15px;"
                v-if="cloudForm.libType == 0"
              >
                <el-select
                  v-model="cloudForm.ccourseId"
                  size="small"
                  style="width:220px;"
                  @change="cloudResSearch"
                >
                  <el-option
                    v-for="item in cloudForm.comCloudList"
                    :key="item.ccourseId"
                    :label="item.ccourseName"
                    :value="item.ccourseId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                style="margin-left:15px;"
                v-if="cloudForm.libType == 1"
              >
                <el-select
                  v-model="cloudForm.mcourseId"
                  size="small"
                  style="width:220px;"
                  @change="cloudResSearch"
                >
                  <el-option
                    v-for="item in cloudForm.myCloudList"
                    :key="item.claCId"
                    :label="item.claCName"
                    :value="item.claCId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="文件类型" style="margin-left:15px;">
                <el-select
                  v-model="cloudForm.resType"
                  placeholder="类型"
                  size="small"
                  style="width:100px;"
                  @change="cloudResSearch"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="音频" :value="1"></el-option>
                  <el-option label="视频" :value="2"></el-option>
                  <el-option label="PDF" :value="9"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:15px;">
                <el-input
                  v-model="cloudForm.keyWord"
                  style="width:140px;"
                  placeholder="搜索资源"
                  @keyup.enter.native="cloudResSearch"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="cloudResSearch"
                  class="el-icon-search"
                ></el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="cloudForm.cloudResList"
              border
              :row-style="{ height: '60px' }"
              style="max-height:300px;overflow-y: scroll"
              :show-header="false"
              key="table3"
              class="cloudTable"
            >
              <el-table-column label="选择" align="center" width="60px">
                <template slot-scope="scope">
                  <el-radio
                    :label="scope.row.catalogId"
                    v-model="cloudForm.resRadio"
                    @change="cloudResRadioData(scope.row)"
                    >&nbsp;</el-radio
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" min-width="850">
                <div slot-scope="scope" class="info">
                  <div class="left">
                    <img
                      v-if="scope.row.catalogSubType === 1"
                      src="@/assets/images/audio.png"
                      @click="handleViewRes(scope.row)"
                    />
                    <img
                      v-else-if="scope.row.catalogSubType === 2"
                      src="@/assets/images/video.png"
                      @click="handleViewRes(scope.row)"
                    />
                    <img
                      v-else-if="scope.row.catalogSubType === 9"
                      @click="handleViewRes(scope.row)"
                      src="@/assets/images/pdf.png"
                      alt=""
                    />
                  </div>
                  <div class="middle">
                    <div
                      class="name"
                      style="cursor:pointer;"
                      @click="handleViewRes(scope.row)"
                    >
                      {{ scope.row.catalogName }}
                    </div>
                    <div class="resourceId">
                      {{ scope.row.catalogParentsPath }}
                    </div>
                  </div>
                  <div class="right">
                    <div class="updateTime">{{ formatDate(scope.row) }}</div>
                  </div>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer">
          <el-button
            size="small"
            type="primary"
            @click="addResSure"
            :loading="loading.sureResLoading"
            >确定</el-button
          >
          <!-- <el-button size="small" @click="isResShow=false">取消</el-button> -->
          <el-button size="small" @click="canaelUpload">{{
            loading.sureResLoading ? "取消上传" : "取消"
          }}</el-button>
        </span>
      </el-dialog>
      <!-- 批量添加 -->
      <el-drawer
        title="添加授课内容"
        :destroy-on-close="true"
        :visible.sync="drawer1"
        direction="ltr"
        size="90%"
        :modal-append-to-body="false"
        :before-close="handleCloseDrawer1"
      >
        <batchAdd
          v-if="drawer1"
          :catalogCourseId="currentCourseId"
          :catalogParentId="batchAddCatalogParentId"
          v-on:toCloseDrawer1="toCloseDrawer1"
          v-on:toCloseDrawer1LoadContent="toCloseDrawer1LoadContent"
        ></batchAdd>
      </el-drawer>
      <!-- 批量添加 -->
      <el-drawer
        title="添加测试任务"
        :visible.sync="drawer2"
        direction="ltr"
        size="90%"
        :modal-append-to-body="false"
        :before-close="handleCloseDrawer2"
      >
        <addTestTask
          v-if="drawer2"
          :catalogCourseId="currentCourseId"
          :catalogParentId="batchAddCatalogParentId"
          :currentTestTaskId="currentTestTaskId"
          :currentTestTaskTitle="currentTestTaskTitle"
          v-on:toCloseDrawer2="toCloseDrawer2"
          v-on:toCloseDrawer2LoadContent="toCloseDrawer2LoadContent"
        ></addTestTask>
      </el-drawer>
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
          :style="viewResObj.resType == 2 ? 'height:400px' : ''"
        ></viewRes>
      </el-dialog>
      <!-- 移动课程内容 -->
      <el-dialog
        :visible.sync="isMoveShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        class="moveDialog"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ moveTitle == "node" ? "移动到章节" : "移动课程内容" }}</div>
          </div>
        </template>
        <div style="font-size: 16px;color: #333;margin-bottom:15px">
          请选择移动到的章节：<span style="color:#2BA1F4;margin-left: 5px;">{{
            moveToCatalog
          }}</span>
        </div>
        <div class="moveTreeBox">
          <div
            style="padding:21px 21px 0 21px;color:#333;cursor:pointer"
            @click="clickMoveCourse"
          >
            {{ courseName }}
          </div>
          <el-tree
            :data="catalogList"
            :props="moveTitle == 'node' ? defaultPropsTwo : defaultProps"
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            ref="moveChapterTree"
            icon-class="el-icon-arrow-right"
            @current-change="getMoveSelected"
          >
            <span class="custom-tree-node" ref="popover" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <span slot="footer">
          <el-button
            size="small"
            type="primary"
            v-if="moveTitle == 'node'"
            @click="doMoveCatalog"
            :loading="loading.moveLoading"
            >确定</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-else
            @click="doMoveContent"
            :loading="loading.moveLoading"
            >确定</el-button
          >
          <el-button size="small" @click="isMoveShow = false">取消</el-button>
        </span>
      </el-dialog>
    </el-container>
    <el-container class="chapterInfoBtm" style="display:none">
      <el-header>
        <div class="materialTitle">
          课程配套素材<span>素材是提供给用户下载的内容</span>
        </div>
        <div class="materialBody" v-loading="loading.courseMatchLoading">
          <div v-if="materialData.ccSupportMaterialUrl" style="font-size:14px">
            <span>{{ materialData.ccSupportMaterialName }}</span>
            <span style="margin-left:15px">{{
              materialSize(materialData.ccSupportMaterialSize)
            }}</span>
            <span style="margin:0 20px;">{{
              materialTime(materialData.ccSupportMaterialTime)
            }}</span>
            <i
              class="el-icon-close"
              style="cursor:pointer"
              @click="deleteMaterial(materialData.id)"
            ></i>
          </div>
          <div v-else>
            <span style="color:#666666;margin-left:15px;font-size:12px;"
              >您还没有上传课程配套素材</span
            >
            <el-button
              type="primary"
              @click="uploadMaterialBtn"
              class="el-icon-plus"
              size="mini"
              ><span style="margin-left:6px">上传</span></el-button
            >
          </div>
        </div>
      </el-header>
      <el-main>
        <el-checkbox v-if="newCourseType != 1" v-model="isAdd"
          >同步上架</el-checkbox
        >
        <el-button
          v-if="newCourseType != 1"
          type="primary"
          size="small"
          @click="submitVerify"
          >提交审核</el-button
        >
        <el-button size="small" style="margin-left:30px;" @click="shortSave">{{
          newCourseType == 1 ? "保存班课" : "暂存"
        }}</el-button>
        <el-button size="small" @click="mobileView">手机预览</el-button>
      </el-main>
      <!-- 上传课程配套素材 -->
      <el-dialog
        :visible.sync="materialForm.isMaterialShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="closeMaterial"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>上传课程配套素材</div>
          </div>
        </template>
        <el-form label-width="70px" style="padding: 0 100px">
          <el-form-item label="选择文件">
            <fileModal
              ref="materialFile"
              @fileChange="materialFileChange"
              accept=".rar,.zip"
            ></fileModal>
            <div v-if="materialForm.showProgress" style="margin-top:10px">
              {{ materialForm.file.name }}
            </div>
            <el-progress
              v-if="materialForm.showProgress"
              style="margin-top:10px"
              :percentage="materialForm.percentage"
            ></el-progress>
            <div class="el-upload__tip">
              建议上传压缩文件，文件大小不得超过500M
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            size="small"
            type="primary"
            @click="uploadMaterialSure"
            :loading="loading.materialLoading"
            >确定</el-button
          >
          <el-button size="small" @click="materialCancel">{{
            loading.materialLoading ? "取消上传" : "取消"
          }}</el-button>
        </span>
      </el-dialog>
      <!-- 手机端预览弹框 -->
      <el-dialog
        :visible.sync="isMobielShow"
        :modal-append-to-body="false"
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>手机预览</div>
          </div>
        </template>
        <div style="text-align:center">
          <div>打开九斗APP扫一扫，预览云课</div>
          <qrcode :value="qrcode" :options="{ width: 200 }"></qrcode>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<style lang="scss">
.chapterInfoBox {
  .chapterInfo {
    padding-left: 13px;
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
          max-width: 250px;
          min-width: 250px;
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
          max-width: 250px;
          min-width: 250px;
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
        max-height: 400px;
        overflow-y: auto;
      }
      .el-tree::-webkit-scrollbar {
        width: 3px;
        height: 2px;
        // background:#ccc;
        border-radius: 5px;
      }
      .el-tree::-webkit-scrollbar-thumb {
        display: block;
        width: 3px;
        margin: 0 auto;
        border-radius: 5px;
        background: rgba(43, 161, 244, 0.6);
      }
      .el-tree
        > .el-tree-node
        > .el-tree-node__content
        > .custom-tree-node
        > span:first-child {
        display: inline-block;
        max-width: 250px;
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
        max-width: 210px;
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
      margin: 0;
      margin-left: 14px;
      .chapterContent {
        height: 46px;
        line-height: 46px;
        padding: 0 15px;
        border-bottom: 1px solid #ebeef5;
        .addBtn1 {
          color: #2ba1f4;
          float: right;
          font-size: 14px;
          cursor: pointer;
        }
        .addBtn2 {
          color: #2ba1f4;
          float: right;
          font-size: 14px;
          cursor: pointer;
          margin-right: 15px;
        }
        .el-popover {
          float: right;
        }
      }
      .empty {
        text-align: center;
        padding-top: 30px;
      }
      .contentList {
        padding: 10px 30px;
        .el-table td,
        .el-table th.is-leaf {
          border-bottom: none !important;
        }
        .isView {
          border: 1px solid #2ba1f4;
          color: #2ba1f4;
          font-weight: normal;
          padding: 2px 10px;
          font-size: 12px;
          border-radius: 10px;
          margin-left: 10px;
        }
        .el-table__body-wrapper::-webkit-scrollbar {
          width: 3px;
          height: 2px;
          // background:#ccc;
          border-radius: 5px;
        }
        .el-table__body-wrapper::-webkit-scrollbar-thumb {
          display: block;
          width: 3px;
          margin: 0 auto;
          border-radius: 5px;
          background: rgba(43, 161, 244, 0.6);
        }
      }
    }
    .addModal {
      .uploadBtn {
        display: inline-block;
        margin-right: 15px;
      }
      .el-radio__label {
        padding-left: 0;
      }
      .cancelSelectBtn {
        color: #2ba1f4;
        font-size: 20px;
        margin-left: 15px;
        cursor: pointer;
      }
      .subject-title {
        text-align: left;
        padding-right: 15px;
        max-height: 23px;
        overflow: hidden;
      }
      .cloudTable::before {
        z-index: inherit;
      }
      .info {
        overflow: hidden;
        padding: 0;
        .left {
          float: left;
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
          // margin-top: 12px;
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
            line-height: 60px;
            margin-right: 20px;
          }
        }
      }
    }
    :focus {
      outline: 0;
    }
    .el-drawer__header {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 15px;
    }
    .el-drawer__body {
      overflow-y: scroll;
      padding-bottom: 150px;
    }
    .el-drawer__body::-webkit-scrollbar {
      width: 8px;
      height: 2px;
      // background:#ccc;
      border-radius: 5px;
    }
    .el-drawer__body::-webkit-scrollbar-thumb {
      display: block;
      width: 8px;
      margin: 0 auto;
      border-radius: 5px;
      background: rgba(43, 161, 244, 0.6);
    }
  }
  .chapterInfoBtm {
    padding-left: 13px;
    border-radius: 4px;
    .el-header {
      background: #ffffff;
      margin: 0;
      padding: 0;
      margin-top: 20px;
      padding-left: 20px;
      height: 110px !important;
      .materialTitle {
        span {
          font-size: 12px;
          color: #666666;
          margin-left: 15px;
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
  .moveDialog {
    .moveTreeBox {
      border: 1px solid rgba(13, 67, 118, 0.2);
    }
    .el-tree {
      font-size: 16px;
      padding: 10px 21px 21px;
      border-radius: 4px;
    }
    .el-tree-node__content {
      height: 46px;
      border-bottom: 1px solid #eaeaea;
      .el-tree-node__expand-icon {
        margin-left: 12px;
      }
    }
    .el-tree-node__children {
      .el-tree-node__content {
        border-bottom: none;
      }
    }
  }
}
.el-drawer__header {
  margin-bottom: 12px;
}
</style>

<script>
import axios from "@/libs/api.request";
import common from "@/utils/common";
import { format, dateStr } from "@/utils/datetime";
// import ckeditorConfig from '@/config/ckeditor_config.js'
import math from "@/components/jmath";
import fileModal from "@/components/fileModal";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import viewRes from "@/components/viewRes";
import Sortable from "sortablejs";
import batchAdd from "./batchAdd";
import addTestTask from "./addTestTask";
export default {
  components: {
    "jd-math": math,
    fileModal,
    viewRes,
    batchAdd,
    addTestTask
  },
  props: {
    ccourseId: ""
  },
  watch: {
    ccourseId: {
      handler(value) {
        if (value) {
          this.currentCourseId = value;
          this.loadCourseDetail();
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$route.query.newCourseType) {
      this.newCourseType = this.$route.query.newCourseType;
    }
    this.bus.$on(
      "coursename",
      function(coursename) {
        this.courseName = coursename;
      }.bind(this)
    );
    // this.initComResLib()
    // this.initVod()
    // this.initCos()
    // this.loadCloudList()
    // this.loadMyCloudList()
    if (this.$route.query.coursename) {
      this.courseName = this.$route.query.coursename;
    }
    this.rowDrop();
  },
  data() {
    return {
      batchAddCatalogParentId: 0,
      newCourseType: "", // 地址栏拿到是属于班课的还是云课
      currentCourseId: "",
      expendArr: [],
      courseName: "慕课目录",
      isCatalog: false, //是否是章节
      catalogList: [],
      addCatalogFlag: false,
      inputCatalogName: "",
      oldEditCatalogCatalogName: "", // 修改章节名字成功之前的name
      currentCatalog: {},
      highlightCurrent: true,
      emptyImg: false,
      defaultProps: {
        children: "cataList",
        label: "name"
      },
      defaultPropsTwo: {
        children: "",
        label: "name"
      },
      draggable: true,
      isMoveShow: false, // 移动课程内容弹框
      moveToCatalog: "", // 移动到的目录名字
      moveToCatalogId: "",
      currentMoveId: "", // 移动的内容的id
      contentList: [], //内容列表
      loading: {
        sureResLoading: false,
        resLoading: false,
        materialLoading: false,
        contentLoading: false,
        sureAddCatalogLoading: false,
        moveLoading: false
      },
      rightTitle: "",
      isResShow: false,
      addResForm: {
        title: "",
        type: "",
        showResName: "",
        showProgress: false,
        percentage: 0,
        file: null,
        resType: "",
        resSize: "",
        resName: "",
        primary1: "",
        primary2: ""
      },
      addResFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      },
      resForm: {
        libType: "0",
        resType: "",
        resName: "",
        comLib: "",
        comLibList: [],
        resData: [],
        resRadio: ""
      },
      resPage: {
        total: 10,
        page: 1,
        pagesize: 10
      },
      currentResRow: {}, //当前选中资源row
      currentResId: "", //当前资源课程文件ID
      currentResData: {}, //当前资源课程信息
      isViewResShow: false, //预览资源show
      viewResObj: {}, //预览资源传入的数据
      cloudForm: {
        libType: "0",
        ccourseId: "",
        mcourseId: "",
        comCloudList: [],
        myCloudList: [],
        resType: "",
        resRadio: "",
        cloudResList: [],
        keyWord: ""
      },
      //批量添加
      drawer1: false,
      drawer2: false,
      //当前的测试任务的ID
      currentTestTaskId: "",
      currentTestTaskTitle: "",
      //课程返回数组
      materialData: {
        ccSupportMaterialUrl: "",
        ccSupportMaterialName: "",
        ccSupportMaterialSize: 0,
        ccSupportMaterialTime: 0
      },
      materialForm: {
        isMaterialShow: false,
        showProgress: false,
        percentage: 0,
        file: null
      },
      isAdd: true,
      isMobielShow: false,
      qrcode: "",
      // 腾讯云 上传
      vod: null,
      cos: null,
      cosConfig: {
        topDomain: "",
        region: ""
      },
      uploader: null,
      taskList: [],
      moveTitle: ""
    };
  },
  beforeDestroy() {
    // alert(1)
  },
  methods: {
    //判断节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level !== dropNode.level) {
        if (draggingNode.level > dropNode.level) {
          return true;
        } else {
          return false;
        }
      } else {
        return type !== "inner";
      }
    },
    //拖拽成功时
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode);
      console.log(dropNode.parent);
      console.log(ev);
      let dataList = [];
      let dataContent = [];
      if (!dropNode.parent.id || dropNode.parent.id == 0) {
        dataList = this.catalogList;
        for (let i in dataList) {
          let item = { id: dataList[i].id, sort: i };
          dataContent.push(item);
        }
      } else {
        dataList = dropNode.parent.childNodes;
        for (let i in dataList) {
          let item = { id: dataList[i].data.id, sort: i };
          dataContent.push(item);
        }
      }
      console.log(dataContent);
      axios
        .request({
          method: "post",
          url: "/openccourse/ccourseCatalog/sortCatalog",
          data: {
            sortJson: JSON.stringify(dataContent)
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: ret.msg
            });
          }
        });
    },
    // 课程内容拖拽的总事件
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const saveThis = this;
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex);
          console.log(oldIndex);
          const currRow = saveThis.contentList.splice(oldIndex, 1)[0];
          saveThis.contentList.splice(newIndex, 0, currRow);
          var newArray = saveThis.contentList.slice(0);
          saveThis.contentList = [];
          // saveThis.contentList = newArray;
          // console.log("====")
          saveThis.$nextTick(function() {
            saveThis.contentList = newArray;
            console.log("====");
            console.log(saveThis.contentList);
            let dataContent = [];
            for (let i in saveThis.contentList) {
              let item = { id: saveThis.contentList[i].id, sort: i };
              dataContent.push(item);
            }
            console.log(dataContent);
            axios
              .request({
                method: "post",
                url: "/openccourse/ccourseCatalog/sortCatalog",
                data: {
                  sortJson: JSON.stringify(dataContent)
                }
              })
              .then(res => {
                let ret = res.data;
                if (ret.code === 200) {
                  saveThis.$message({
                    type: "success",
                    message: ret.msg
                  });
                }
              });
          });
        }
      });
    },
    // 加载云课目录信息和基本信息
    loadCourseDetail() {
      axios
        .request({
          method: "post",
          url: "openccourse/ccourseCatalog/list",
          data: {
            courseId: this.currentCourseId,
            subType: 0
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.currentCourseId = ret.data.ccourseId
            // this.materialData.ccSupportMaterialUrl = ret.data.ccSupportMaterialUrl
            // this.materialData.ccSupportMaterialName = ret.data.ccSupportMaterialName
            // this.materialData.ccSupportMaterialSize = ret.data.ccSupportMaterialSize
            // this.materialData.ccSupportMaterialTime = ret.data.ccSupportMaterialTime
            // this.courseName = ret.data.ccourseNamei
            // this.rightTitle = ret.data.ccourseName
            this.setIsEdit(ret.data.records);
            this.catalogList = ret.data.records;
            // this.qrcode = "ccourse" + ret.data.ccourseId
            //加载课程内容列表
            this.loadContentList();
          }
        });
    },
    // 循环章节目录加isEdit
    setIsEdit(data) {
      data.forEach(element => {
        element.isEdit = false;
        if (element.cataList.length > 0) {
          this.setIsEdit(element.cataList);
        }
      });
    },
    // 点击课程名
    clickCourse() {
      if (this.currentCatalog.id) {
        this.currentCatalog = {};
        this.isCatalog = false;
        this.highlightCurrent = false;
        this.rightTitle = this.courseName;
        this.loadContentList();
      }
    },
    // 点击目录item
    handleNodeClick(bank) {
      console.log("*******");
      console.log(bank);
      this.isCatalog = true;
      this.highlightCurrent = true;
      this.rightTitle = bank.name;
      if (bank.id === this.currentCatalog.id) {
        return;
      }
      this.currentCatalog = bank;
      this.loadCatalogList();
    },
    //添加章
    addCatalog() {
      this.inputCatalogName = "";
      this.addCatalogFlag = true;
    },
    //确定新建章
    addCatalogSure() {
      this.loading.sureAddCatalogLoading = true;
      let catalogParentId = 0;
      if (this.inputCatalogName.split(" ").join("").length == 0) {
        this.$message({
          type: "warning",
          message: "请输入章名称"
        });
        this.loading.sureAddCatalogLoading = false;
        return;
      }
      this.addCatalogCommon(this.inputCatalogName, catalogParentId);
    },
    //添加章节的axios公共部分
    addCatalogCommon(catalogName, catalogParentId, parentCatalog) {
      axios
        .request({
          method: "post",
          url: "/openccourse/ccourseCatalog/insert",
          data: {
            courseId: this.currentCourseId,
            parentId: catalogParentId,
            name: catalogName,
            type: 0,
            subType: 0,
            sourceType: 0
          }
        })
        .then(res => {
          let ret = res.data;
          this.loading.sureAddCatalogLoading = false;
          if (ret.code === 200) {
            if (catalogParentId == 0) {
              this.catalogList.push({
                id: ret.data.id,
                name: catalogName,
                cataList: [],
                isEdit: false,
                courseId: this.currentCourseId
              });
            } else {
              parentCatalog.cataList.push({
                id: ret.data.id,
                name: catalogName,
                cataList: [],
                isEdit: false,
                courseId: this.currentCourseId
              });
            }
            this.addCatalogFlag = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //取消新建章
    addCatalogCancel() {
      this.addCatalogFlag = false;
      this.inputCatalogName = "新建章节";
    },
    //添加章节
    appendNode(node, data) {
      this.expendArr = [data.id];
      let catalogName = "新建章节";
      let catalogParentId = data.id;
      this.addCatalogCommon(catalogName, catalogParentId, data);
    },
    //修改章节
    editNode(node, data, ev) {
      this.oldEditCatalogCatalogName = data.name;
      data.isEdit = true;
      this.$nextTick(() => {
        let inpt =
          ev.target.parentNode.parentNode.firstElementChild.firstElementChild;
        inpt.focus();
      });
      this.draggable = false;
    },
    //确定修改章节的名字
    suerUpdataCatalog(data) {
      axios
        .request({
          method: "post",
          url: "/openccourse/ccourseCatalog/update",
          data: {
            id: data.id,
            courseId: data.courseId,
            name: data.name,
            type: 0,
            subType: 0,
            sourceType: 0
          }
        })
        .then(res => {
          let ret = res.data;
          this.draggable = true;
          if (ret.code === 200) {
            //如果修改的章节是选中的章节  右侧名字变化
            if (data.catalogId == this.currentCatalog.catalogId) {
              this.rightTitle = data.catalogName;
            }
            this.$message({
              type: "success",
              message: ret.msg
            });
          } else {
            data.catalogName = this.oldEditCatalogCatalogName;
          }
          data.isEdit = false;
        });
    },
    //删除章节
    removeNode(node, data) {
      this.$confirm(
        "<div>您确定要删除目录" +
          data.name +
          "？</div>删除后，该目录下的子目录和课程内容将同步删除。请谨慎操作。",
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      ).then(() => {
        axios
          .request({
            method: "post",
            url: "/openccourse/ccourseCatalog/delete",
            data: {
              id: data.id
            }
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              const parent = node.parent;
              const children = parent.data.cataList || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              //如果删除的章节是最后一个章节或者是选中的章节  跳转到云课
              if (
                this.cataList.length == 0 ||
                data.id == this.currentCatalog.id
              ) {
                this.clickCourse();
              }
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
      });
    },
    //加载课程内容列表
    loadContentList() {
      this.loading.contentLoading = true;
      axios
        .request({
          method: "post",
          url: "openccourse/ccourseCatalog/list",
          data: {
            courseId: this.currentCourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.contentLoading = false;
            this.contentList = ret.data.records;
            if (this.contentList.length == 0) {
              this.emptyImg = true;
            } else {
              this.emptyImg = false;
            }
          }
        });
    },
    //加载章节内容列表
    loadCatalogList() {
      this.loading.contentLoading = true;
      axios
        .request({
          method: "post",
          url: "openccourse/ccourseCatalog/list",
          data: {
            courseId: this.currentCourseId,
            parentId: this.currentCatalog.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.loading.contentLoading = false;
            this.contentList = ret.data.records;
            if (this.contentList.length == 0) {
              this.emptyImg = true;
            } else {
              this.emptyImg = false;
            }
          }
        });
    },
    renderHeader(h, { column }) {
      // h即为cerateElement的简写，具体可看vue官方文档
      return h("div", [
        h("span", column.label),
        h(
          "span",
          {
            style: "color:red;margin-left:5px;font-size:12px"
          },
          "(点击标题可预览内容,拖拽标题可调整顺序)"
        )
      ]);
    },
    //内容列表中查看资源
    handleViewRes(row) {
      let arr = {};
      arr.resUrlWeb = row.leafObj;
      arr.resType = row.subType;
      arr.resName = row.name;
      this.viewResObj = arr;
      this.isViewResShow = true;
    },
    //添加资源中预览资源
    handleViewRes2(row) {
      this.viewResObj = row;
      this.isViewResShow = true;
    },
    //关闭预览资源弹框清空数据
    handleCloseViewDialog() {
      this.viewResObj = {};
      this.isViewResShow = false;
    },
    //是否试看
    tryView(row) {
      let isView = "";
      if (row.catalogIsFree == 1) {
        isView = 0;
      } else {
        isView = 1;
      }
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/cCourseCatalog/modifyCatalog",
          data: {
            catalogId: row.catalogId,
            catalogName: row.catalogName,
            catalogIsFree: isView,
            catalogSubType: row.catalogSubType,
            catalogLeafObj: row.catalogLeafObj
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (row.catalogIsFree == 1) {
              row.catalogIsFree = 0;
            } else {
              row.catalogIsFree = 1;
            }
          }
        });
    },
    //从本地上传
    fileChange(file) {
      this.addResForm.primary1 = "primary";
      this.addResForm.primary2 = "";
      this.addResForm.primary3 = "";
      if (file) {
        this.addResForm.file = file;
        this.addResForm.resSize = file.size;
        this.addResForm.originalName = file.name;
        this.addResForm.resType = `${this.toResType(file.type)}`;
        this.addResForm.type = 1;
        this.addResForm.showResName = file.name;
      }
      return false;
    },
    //清空课程文件表单
    clearFile() {
      this.addResForm.file = null;
      this.addResForm.resSize = "";
      this.addResForm.originalName = "";
      this.addResForm.resType = "";
      this.addResForm.showResName = "";
      this.addResForm.primary1 = "";
      this.addResForm.primary2 = "";
      this.addResForm.primary3 = "";
      this.addResForm.type = "";
      this.resForm.resRadio = "";
      this.currentResRow = {};
      this.addResForm.showResName = "";
      this.resForm.comLib = "";
      this.resForm.resName = "";
      this.resForm.resType = "";
      this.resPage.page = 1;
      this.addResForm.showProgress = false;
      this.addResForm.percentage = 0;
      this.loading.sureResLoading = false;
      this.cloudForm.resType = "";
      this.cloudForm.keyWord = "";
      this.cloudForm.libType = "0";
      this.cloudForm.resRadio = "";
      this.$nextTick(res => {
        this.$refs.addResForm.clearValidate();
        if (this.$refs.resfileModal) {
          this.$refs.resfileModal.clearFile();
        }
      });
    },
    //从资源库搜索
    fromResLibBtn() {
      this.clearFile();
      this.addResForm.primary2 = "primary";
      this.addResForm.type = 2;
      this.loadResList();
    },
    //清空上传资源
    cancelSelectBtn() {
      this.clearFile();
    },
    //从其他云课导入
    fromOtherCloudBtn() {
      this.clearFile();
      this.addResForm.primary3 = "primary";
      this.addResForm.type = 3;
      this.loadCloudResList();
    },
    //切换公共云课和个人云课
    cloudResChange() {
      // if(this.cloudForm.libType == 0) {
      //   this.cloudForm.ccourseId = this.cloudForm.comCloudList[0].ccourseId
      // }else{
      //   this.cloudForm.mcourseId = this.cloudForm.myCloudList[0].claCId
      // }
      this.cloudForm.resType = "";
      this.cloudForm.keyWord = "";
      this.cloudResSearch();
    },
    // 云课搜索内容
    cloudResSearch() {
      this.loadCloudResList();
    },
    //加载公共云课列表
    loadCloudList() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selCCListNotInThisReco",
          data: {
            recoType: 3
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.cloudForm.comCloudList = ret.data;
            this.cloudForm.ccourseId = this.cloudForm.comCloudList[0].ccourseId;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载我的云课列表
    loadMyCloudList() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/selClaCList",
          data: {
            pageNum: 1,
            pagesize: 200
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // this.cloudForm.myCloudList = ret.data.data
            this.cloudForm.myCloudList = ret.data.data.filter((item, i) => {
              return item.claCId != this.currentCourseId;
            });
            this.cloudForm.mcourseId = this.cloudForm.myCloudList[0].claCId;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //加载云课内容列表
    loadCloudResList() {
      axios
        .request({
          method: "post",
          url: "ccourse/v4/cCourseCatalog/leafList",
          data: {
            cCourseId:
              this.cloudForm.libType == 0
                ? this.cloudForm.ccourseId
                : this.cloudForm.mcourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            if (this.cloudForm.resType == "" && this.cloudForm.keyWord == "") {
              this.cloudForm.cloudResList = ret.data;
            } else if (
              this.cloudForm.resType == "" &&
              this.cloudForm.keyWord != ""
            ) {
              this.cloudForm.cloudResList = ret.data.filter((item, i) => {
                return item.catalogName.indexOf(this.cloudForm.keyWord) > -1;
              });
            } else if (
              this.cloudForm.resType != "" &&
              this.cloudForm.keyWord == ""
            ) {
              this.cloudForm.cloudResList = ret.data.filter((item, i) => {
                return item.catalogSubType == this.cloudForm.resType;
              });
            } else {
              this.cloudForm.cloudResList = ret.data.filter((item, i) => {
                return (
                  item.catalogSubType == this.cloudForm.resType &&
                  item.catalogName.indexOf(this.cloudForm.keyWord) > -1
                );
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    // 常规资源保存到数据库
    uploadResFile() {
      let data = {
        catalogParentId: this.isCatalog ? this.currentCatalog.catalogId : 0,
        catalogCourseId: this.currentCourseId,
        catalogName: this.addResForm.title,
        catalogType: 1
      };
      if (this.addResForm.cloudId) {
        data.cloudId = this.addResForm.cloudId;
      }
      if (this.addResForm.type == 1) {
        //从本地上传
        data.catalogSubType = this.addResForm.resType;
        data.catalogLeafObj = this.addResForm.resUrl;
        data.catalogLeafSize = this.addResForm.resSize;
        data.catalogLeafSourceType = 1;
      } else if (this.addResForm.type == 2) {
        //从资源库搜索
        data.catalogSubType = this.currentResRow.resType;
        data.catalogLeafObj = this.currentResRow.resUrlWeb;
        data.catalogLeafSourceResId = this.currentResRow.resourceid;
        data.catalogLeafSourceType = 2;
      } else {
        //从云课中直接添加
        data.catalogSubType = this.currentResRow.catalogSubType;
        data.catalogLeafObj = this.currentResRow.catalogLeafObj;
        data.catalogLeafSourceResId = this.currentResRow.catalogId;
        data.catalogLeafSourceType = 3;
      }
      axios
        .request({
          method: "post",
          url: "/ccourse/v4/cCourseCatalog/createCatalog",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.isResShow = false;
          this.loading.sureResLoading = false;
          if (ret.code == 200) {
            if (this.isCatalog) {
              this.loadCatalogList();
            } else {
              this.loadContentList();
            }
          }
        });
    },
    // 修改常规资源保存到数据库
    editComonUploadResFile() {
      let data = {};
      data.id = this.currentResId;
      data.name = this.addResForm.title;
      data.subType = this.currentResData.subType;
      // data.needDel = 1
      //修改  重新上传
      if (this.addResForm.resUrl) {
        data.leafObj = this.addResForm.resUrl;
        data.cloudId = this.addResForm.cloudId;
        data.leafSize = this.addResForm.resSize;
        data.sourceType = 1;
        data.subType = this.addResForm.resType;
      }
      //修改  资源库加资源
      if (this.currentResRow.resourceid) {
        data.leafObj = this.currentResRow.resUrlWeb;
        data.subType = this.currentResRow.resType;
        data.sourceType = 2;
        data.leafSourceResId = this.currentResRow.resourceid;
      }
      //修改 从云课中加资源
      if (this.currentResRow.catalogId) {
        data.leafObj = this.currentResRow.catalogLeafObj;
        data.sourceType = 3;
        data.subType = this.currentResRow.catalogSubType;
        data.leafSourceResId = this.currentResRow.catalogId;
      }
      axios
        .request({
          method: "post",
          url: "/openccourse/ccourseCatalog/update",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.isResShow = false;
          this.loading.sureResLoading = false;
          if (ret.code == 200) {
            if (this.isCatalog) {
              this.loadCatalogList();
            } else {
              this.loadContentList();
            }
          }
        });
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
    //确定添加课程文件
    addResSure() {
      this.$refs["addResForm"].validate(valid => {
        if (valid) {
          if (this.addResForm.title.split(" ").join("").length == 0) {
            this.$message({
              type: "warning",
              message: "请输入标题,标题不能为空"
            });
            return;
          }
          if (this.currentResId) {
            // 修改
            if (this.addResForm.type) {
              if (this.addResForm.file) {
                if (this.addResForm.resType == 0) {
                  this.$message({
                    type: "warning",
                    message: "支持文件类型：视频、音频和PDF"
                  });
                  return;
                }
                if (this.addResForm.resSize / 1024 / 1024 > 500) {
                  this.$message({
                    type: "warning",
                    message: "大小不能超过500M"
                  });
                  return;
                }
                this.addResForm.showProgress = true;
                this.loading.sureResLoading = true;
                this.addResForm.cloudId = "";
                if (
                  this.addResForm.resType === "1" ||
                  this.addResForm.resType === "2"
                ) {
                  // 音频和视频 用VOD上传
                  this.uploader = this.vod.upload({
                    mediaFile: this.addResForm.file // file是js的文件引用
                  });
                  this.uploader.on("media_progress", info => {
                    let p = Number(info.percent) * 100;
                    this.addResForm.percentage = parseFloat(p.toFixed(2));
                  });
                  this.uploader
                    .done()
                    .then(info => {
                      this.uploader = null;
                      this.addResForm.resUrl = info.video.url;
                      this.addResForm.cloudId = info.fileId;
                      this.editComonUploadResFile();
                    })
                    .catch(() => {
                      this.loading.sureResLoading = false;
                      this.clearFile();
                      this.$message({
                        type: "warning",
                        message: "不支持的音视频类型"
                      });
                    });
                } else {
                  // 其他的 用COS上传
                  // let path = dateStr("YYYYMM") + "/" + this.addResForm.file.name
                  let path =
                    dateStr("YYYYMM") +
                    "/" +
                    this.$store.state.user.userId +
                    new Date().valueOf() +
                    common.getFileType(this.addResForm.file.name);
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.addResForm.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.addResForm.percentage = parseFloat(p.toFixed(2));
                      }
                    },
                    (err, result) => {
                      this.taskList = [];
                      if (!err) {
                        this.addResForm.resUrl = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        this.editComonUploadResFile();
                      } else {
                        console.log(err);
                      }
                    }
                  );
                  this.taskList = this.cos.getTaskList();
                }
              } else {
                this.editComonUploadResFile();
              }
            } else {
              // 只修改名字
              this.addResForm.resUrl = "";
              this.editComonUploadResFile();
            }
          } else {
            // 新添加
            if (!this.addResForm.type) {
              this.$message({
                type: "warning",
                message: "请选择学习内容类型"
              });
              return;
            }
            if (this.addResForm.type == 1) {
              //从本地上传
              if (this.addResForm.file) {
                if (this.addResForm.resType == 0) {
                  this.$message({
                    type: "warning",
                    message: "支持文件类型：视频、音频和PDF"
                  });
                  return;
                }
                if (this.addResForm.resSize / 1024 / 1024 > 500) {
                  this.$message({
                    type: "warning",
                    message: "大小不能超过500M"
                  });
                  return;
                }
                this.addResForm.showProgress = true;
                this.loading.sureResLoading = true;
                this.addResForm.cloudId = "";
                if (
                  this.addResForm.resType === "1" ||
                  this.addResForm.resType === "2"
                ) {
                  // 音频和视频 用VOD上传
                  this.uploader = this.vod.upload({
                    mediaFile: this.addResForm.file // file是js的文件引用
                  });
                  this.uploader.on("media_progress", info => {
                    let p = Number(info.percent) * 100;
                    this.addResForm.percentage = parseFloat(p.toFixed(2));
                  });
                  this.uploader
                    .done()
                    .then(info => {
                      this.uploader = null;
                      this.addResForm.resUrl = info.video.url;
                      this.addResForm.cloudId = info.fileId;
                      this.uploadResFile();
                    })
                    .catch(() => {
                      this.loading.sureResLoading = false;
                      this.clearFile();
                      this.$message({
                        type: "warning",
                        message: "不支持的音视频类型"
                      });
                    });
                } else {
                  // 其他的 用COS上传
                  // let path = dateStr("YYYYMM") + "/" + this.addResForm.file.name
                  let path =
                    dateStr("YYYYMM") +
                    "/" +
                    this.$store.state.user.userId +
                    new Date().valueOf() +
                    common.getFileType(this.addResForm.file.name);
                  this.cos.putObject(
                    {
                      Bucket:
                        this.cosConfig.bucket + "-" + this.cosConfig.appId,
                      Region: this.cosConfig.region,
                      Key: path,
                      StorageClass: "STANDARD",
                      Body: this.addResForm.file,
                      onProgress: curr => {
                        let p = Number(curr.percent) * 100;
                        this.addResForm.percentage = parseFloat(p.toFixed(2));
                      }
                    },
                    (err, result) => {
                      this.taskList = [];
                      if (!err) {
                        this.addResForm.resUrl = encodeURI(
                          `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
                        );
                        this.uploadResFile();
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
            } else {
              //从资源库搜索 从云课中直接添加
              if (
                !this.currentResRow.resourceid &&
                !this.currentResRow.catalogId
              ) {
                this.$message({
                  type: "warning",
                  message: "请选择资源"
                });
              } else {
                this.uploadResFile();
              }
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: "请输入标题!"
          });
        }
      });
    },
    // 取消上传
    canaelUpload() {
      if (this.loading.sureResLoading) {
        if (this.uploader && this.addResForm.cloudId) {
          this.uploader.cancel();
        }
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.addResForm.showProgress = false;
        this.addResForm.percentage = 0;
        this.loading.sureResLoading = false;
      } else {
        this.isResShow = false;
      }
    },
    closeAddModal() {
      if (this.loading.sureResLoading == false) {
        this.isResShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    //修改课程内容的资源
    editContent(row) {
      this.currentResId = "";
      this.addResForm.title = row.name;
      this.clearFile();
      this.currentResId = row.id;
      this.currentResData = row;
      this.isResShow = true;
    },
    //切换公共资源库和我的资源库
    resLibChange() {
      this.resForm.comLib = "";
      // this.resForm.orgLib = ''
      this.resForm.resName = "";
      this.resForm.resType = "";
      this.resSearch();
    },
    //加载资源列表
    loadResList() {
      this.loading.resLoading = true;
      let url = "v1/resource/selectResFromPCRlPage";
      let data = {
        page: this.resPage.page,
        pagesize: this.resPage.pagesize,
        keywords: this.resForm.resName,
        resType: this.resForm.resType
      };
      if (this.resForm.libType == 1) {
        url = "/v1/orgResourceLibrary/resource";
        data.resLibType = 0;
        // data.resLib = this.resForm.resType
      } else {
        data.resLibType = 1;
        data.resLib = this.resForm.comLib;
      }
      axios
        .request({
          method: "post",
          url: url,
          data: data
        })
        .then(
          function(data) {
            this.loading.resLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.resForm.resData = res.data.data;
              this.resPage.total = res.data.total;
            }
          }.bind(this)
        );
    },
    //搜索资源
    resSearch() {
      this.resPage.page = 1;
      this.loadResList();
    },
    //radio change选中行数据
    resRadioData(row) {
      this.currentResRow = row;
      this.addResForm.showResName = row.resName;
    },
    cloudResRadioData(row) {
      this.currentResRow = row;
      this.addResForm.showResName = row.catalogName;
    },
    // 时间
    formatDate(row) {
      if (row.updated) {
        return format(row.updated);
      }
      if (row.modifiedTime) {
        return format(row.modifiedTime);
      }
      if (row.catalogCreateTime) {
        return format(row.catalogCreateTime);
      }
    },
    //table资源类型
    formatResType(row) {
      return common.resTypeFormat(row.resType);
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
    /**
     **********************************************************************
     **********************************************************************
     **************************批量添加*************************************
     **********************************************************************
     **********************************************************************
     **********************************************************************
     */
    //批量添加课程内容
    handleBatchAdd() {
      this.batchAddCatalogParentId = this.isCatalog
        ? this.currentCatalog.id
        : 0;
      this.drawer1 = true;
    },
    handleCloseDrawer1() {
      this.drawer1 = false;
    },
    toCloseDrawer1() {
      this.handleCloseDrawer1();
    },
    toCloseDrawer1LoadContent() {
      this.drawer1 = false;
      if (this.isCatalog) {
        this.loadCatalogList();
      } else {
        this.loadContentList();
      }
    },
    //添加测试任务
    handleAddTestTask() {
      this.batchAddCatalogParentId = this.isCatalog
        ? this.currentCatalog.id
        : 0;
      this.drawer2 = true;
    },
    handleCloseDrawer2() {
      this.currentTestTaskTitle = "";
      this.currentTestTaskId = "";
      this.drawer2 = false;
    },
    toCloseDrawer2() {
      this.handleCloseDrawer2();
    },
    toCloseDrawer2LoadContent() {
      this.drawer2 = false;
      if (this.isCatalog) {
        this.loadCatalogList();
      } else {
        this.loadContentList();
      }
    },
    //修改测试任务 重新选题
    againSeletTest(row) {
      this.currentTestTaskTitle = row.name;
      this.currentTestTaskId = row.id;
      this.drawer2 = true;
    },
    //删除课程内容
    deleteContent(row, index) {
      this.$confirm("确定删除该内容吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/openccourse/ccourseCatalog/delete",
              data: {
                id: row.id
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.contentList.splice(index, 1);
                if (this.contentList.length == 0) {
                  this.emptyImg = true;
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
    // 移动二级目录
    moveCatalogTwo(node, data, ev) {
      console.log(node);
      console.log(data);
      this.topCatalogId = data.parentId;
      this.moveToCatalog = "";
      this.moveToCatalogId = "";
      this.moveTitle = "node";
      this.currentMoveId = data.id;
      this.isMoveShow = true;
    },
    /**
     * 移动课程内容
     */
    moveContent(row) {
      this.moveToCatalog = "";
      this.moveToCatalogId = "";
      this.moveTitle = "";
      this.currentMoveId = row.id;
      this.isMoveShow = true;
    },
    getMoveSelected(el) {
      this.moveToCatalog = el.name;
      this.moveToCatalogId = this.$refs.moveChapterTree.getCurrentKey();
    },
    // 点击移动弹框里面的课程名
    clickMoveCourse() {
      this.moveToCatalog = this.courseName;
      this.moveToCatalogId = 0;
      this.$refs.moveChapterTree.setCurrentKey();
    },
    // 确定移动章节
    doMoveCatalog() {
      if (this.moveToCatalogId || this.moveToCatalogId === 0) {
        if (this.moveToCatalogId != this.topCatalogId) {
          this.loading.moveLoading = true;
          axios
            .request({
              method: "post",
              url: "/openccourse/ccourseCatalog/moveCatalog",
              data: {
                id: this.currentMoveId,
                parentId: this.moveToCatalogId
              }
            })
            .then(res => {
              let ret = res.data;
              this.loading.moveLoading = false;
              if (ret.code === 200) {
                this.isMoveShow = false;
                this.loadCourseDetail();
                this.$message({
                  type: "success",
                  message: "成功将内容移动到目录"
                });
              }
            });
        } else {
          this.$message({
            type: "warning",
            message: "已经在当前目录下"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先选择该内容移动到章节"
        });
      }
    },
    // 确定移动课程内容
    doMoveContent() {
      if (this.moveToCatalogId || this.moveToCatalogId === 0) {
        if (this.isCatalog) {
          if (this.moveToCatalogId != this.currentCatalog.id) {
            this.loading.moveLoading = true;
            axios
              .request({
                method: "post",
                url: "/openccourse/ccourseCatalog/moveCatalog",
                data: {
                  id: this.currentMoveId,
                  parentId: this.moveToCatalogId
                }
              })
              .then(res => {
                let ret = res.data;
                this.loading.moveLoading = false;
                if (ret.code === 200) {
                  this.isMoveShow = false;
                  this.loadCatalogList();
                  this.$message({
                    type: "success",
                    message: "成功将内容移动到目录"
                  });
                }
              });
          } else {
            this.$message({
              type: "warning",
              message: "已经在当前目录下"
            });
          }
        } else {
          if (this.moveToCatalogId != this.currentCourseId) {
            this.loading.moveLoading = true;
            axios
              .request({
                method: "post",
                url: "/openccourse/ccourseCatalog/moveCatalog",
                data: {
                  id: this.currentMoveId,
                  parentId: this.moveToCatalogId
                }
              })
              .then(res => {
                let ret = res.data;
                this.loading.moveLoading = false;
                if (ret.code === 200) {
                  this.isMoveShow = false;
                  this.loadContentList();
                  this.$message({
                    type: "success",
                    message: "成功将内容移动到目录"
                  });
                }
              });
          } else {
            this.$message({
              type: "warning",
              message: "已经在当前目录下"
            });
          }
        }
      } else {
        this.$message({
          type: "warning",
          message: "请先选择该内容移动到章节"
        });
      }
    },
    /**
     * 课程配套素材
     */
    //课程配套素材资源大小
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
    //课程配套素材资源时间
    materialTime(time) {
      return format(time);
    },
    //删除课程配套素材
    deleteMaterial(id) {
      this.$confirm("删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: {
                cCId: this.currentCourseId,
                delMaterial: 1
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.materialData.ccSupportMaterialUrl = "";
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    },
    //上传课程配套素材
    uploadMaterialBtn() {
      this.materialForm.showProgress = false;
      this.materialForm.percentage = 0;
      this.materialForm.file = null;
      this.$nextTick(res => {
        if (this.$refs.materialFile) {
          this.$refs.materialFile.clearFile();
        }
      });
      this.loading.materialLoading = false;
      this.materialForm.isMaterialShow = true;
    },
    materialFileChange(file) {
      if (file) {
        this.materialForm.file = file;
      }
    },
    uploadMaterialSure() {
      if (this.materialForm.file) {
        this.materialForm.showProgress = true;
        this.loading.materialLoading = true;
        // 其他的 用COS上传
        let path =
          dateStr("YYYYMM") + "/ccourse/" + this.materialForm.file.name;
        this.cos.putObject(
          {
            Bucket: this.cosConfig.bucket + "-" + this.cosConfig.appId,
            Region: this.cosConfig.region,
            Key: path,
            StorageClass: "STANDARD",
            Body: this.materialForm.file,
            onProgress: curr => {
              let p = Number(curr.percent) * 100;
              this.materialForm.percentage = parseFloat(p.toFixed(2));
            }
          },
          (err, result) => {
            this.taskList = [];
            if (!err) {
              this.materialForm.ccSupportMaterialUrl = encodeURI(
                `https://${this.cosConfig.bucket}.guangyiedu.com/${path}`
              );
              axios
                .request({
                  method: "post",
                  url: "v1/cCourse/uploadCCMaterialFile",
                  data: {
                    ccourseId: this.currentCourseId,
                    cCMaterialUrl: this.materialForm.ccSupportMaterialUrl,
                    cCMaterialName: this.materialForm.file.name,
                    cCMaterialSize: this.materialForm.file.size
                  }
                })
                .then(res => {
                  this.loading.materialLoading = false;
                  let ret = res.data;
                  if (ret.code == 200) {
                    //上传成功之后获取素材的信息
                    this.loadMaterialInfo();
                    this.materialForm.isMaterialShow = false;
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
    },
    materialCancel() {
      if (this.loading.materialLoading) {
        this.taskList.forEach(element => {
          this.cos.cancelTask(element.id);
        });
        this.materialForm.showProgress = false;
        this.materialForm.percentage = 0;
        this.loading.materialLoading = false;
      } else {
        this.materialForm.isMaterialShow = false;
      }
    },
    closeMaterial() {
      if (this.loading.materialLoading == false) {
        this.materialForm.isMaterialShow = false;
      } else {
        this.$message({
          type: "warning",
          message: "当前正在上传文件，上传完成或取消上传才可关闭弹窗!"
        });
      }
    },
    //上传成功之后加载配套信息
    loadMaterialInfo() {
      axios
        .request({
          method: "post",
          url: "v1/cCourse/cCDetailOfSeparateLeafAndCat",
          data: {
            ccId: this.currentCourseId
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.materialData.ccSupportMaterialUrl =
              ret.data.ccSupportMaterialUrl;
            this.materialData.ccSupportMaterialName =
              ret.data.ccSupportMaterialName;
            this.materialData.ccSupportMaterialSize =
              ret.data.ccSupportMaterialSize;
            this.materialData.ccSupportMaterialTime =
              ret.data.ccSupportMaterialTime;
          }
        });
    },
    //提交审核 成功之后跳到列表页
    submitVerify() {
      let data = {};
      data.cCId = this.ccourseId;
      if (this.isAdd) {
        data.isOn = 1;
      }
      data.ccStatus = 1;
      this.$confirm(
        '<div style="text-align:center">是否确认提交审核本云课？</div><div style="font-size:12px;color:#666666;text-align:center">提交审核后，云课将提交到平台进行审核，提交后不能再修改</div>',
        "提交审核",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          axios
            .request({
              method: "post",
              url: "v1/cCourse/updateCC/cCIntro",
              data: data
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                this.$message({
                  type: "success",
                  message: "成功!"
                });
                this.$router.push({
                  name: "cloudCourse"
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
    //暂存
    shortSave() {
      if (this.newCourseType == 1) {
        let el = "0";
        this.bus.$emit("canSave", el);
      } else {
        this.$confirm(
          '<div style="text-align:center">是否保存此次云课修改？</div><div style="font-size:12px;color:#666666;text-align:center">保存修改不会更新线上云课内容，如需更新线上云课内容请点击提交审核</div>',
          "温馨提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true
          }
        )
          .then(() => {
            let el = "0";
            this.bus.$emit("canSave", el);
          })
          .catch(() => {});
      }
    },
    //手机端预览
    mobileView() {
      this.isMobielShow = true;
    },
    // 初始化COS
    initCos() {
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
    },
    //加载公共资源库列表
    initComResLib() {
      axios
        .request({
          method: "post",
          url: "v1/resourceLibrary/selectPCSblList",
          data: {
            resLibType: 1
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.resForm.comLibList = ret.data;
            this.resForm.comLibList.unshift({
              rlName: "全部",
              rlId: ""
            });
          }
        });
    }
  }
};
</script>
