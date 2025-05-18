<template>
  <div class="epub-Resource">
    <el-container class="bookResourceTop">
      <!-- <el-aside width="182px">
        <div :class="[isCatalog ? 'listHeader1' : 'listHeader']">
          <span @click="clickBook">目录</span>
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
          node-key="catalogid"
          ref="vueCatalogTree"
          icon-class="el-icon-arrow-right"
          @node-click="handleNodeClick"
        >
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
      </el-aside> -->
      <el-main>
        <div class="main-resource">
          <el-tabs
            ref="resourceTab"
            v-model="resActiveName"
            class="sub-tabs"
            @tab-click="tabClick"
          >
            <!-- <el-tab-pane label="内容" name="zero">
              <el-scrollbar style="height:700px;">
                <div class="demo-image__preview">
                  <viewer :images="srcList" style="height: 670px;">
                    <div
                      v-for="item in srcList"
                      :key="item.index"
                      class="image_div"
                    >
                      <img :src="item.resUrl" :key="item.index" height="212" />
                      <div class="mask_div">
                        <el-button type="text" @click="goEbookRes(item)"
                          >资源</el-button
                        >
                        <el-button type="text" @click="deleImage(item)"
                          >删除</el-button
                        >
                      </div>
                      <div class="mask_page">
                        {{ item.page }}
                      </div>
                    </div>
                  </viewer>
                </div>
              </el-scrollbar>
            </el-tab-pane> -->
            <el-tab-pane label="资源" name="five">
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
                  <!-- <el-button size="small" @click="resQrcode" v-if="isCatalog===true">资源码</el-button> -->
                  <el-button size="small" @click="handleSearchRes"
                    >找资源</el-button
                  >
                  <!-- <el-button size="small" @click="lookBookRes"
                    >查看实体书资源</el-button
                  > -->
                  <!-- <el-button size="small" @click="exportExcel">导出</el-button> -->
                  <!-- <el-button size="small" v-if="isCatalog===true" @click="uploadRes">上传资源</el-button> -->
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
                <!-- <el-table-column prop="matchPicUrl" label="资源码" align="center" width="180">
                  <div slot-scope="scope" v-if="scope.row.resType == 3 && scope.row.matchPicUrl">
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click">
                      <img :src="scope.row.matchPicUrl" alt="" style="width:500px;">
                      <i slot="reference" class="el-icon-picture" style="font-size:30px;cursor: pointer;"></i>
                    </el-popover>
                  </div>
                  <div slot-scope="scope" v-else-if="scope.row.qrcode">
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click">
                      <div style="text-align:center;">{{textbook.tb_num}}-{{scope.row.qrcodeNickname}}</div> 
                      <qrcode :value="`${baseUrlV2}/Resource/r/${scope.row.qrcode}`" :options="{ width: 200 }"></qrcode>
                      <i slot="reference" class="el-icon-picture" style="font-size:30px; cursor: pointer;"></i>
                    </el-popover>
                  </div>
                </el-table-column> -->
                <el-table-column
                  label="资源展示名"
                  prop="matchPicName"
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
                    {{
                      scope.row.matchPicName
                        ? scope.row.matchPicName
                        : scope.row.resName
                    }}
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  label="页码"
                  prop="resPage"
                  align="center"
                ></el-table-column> -->
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
                      >删除</el-button
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
            <!-- <el-tab-pane label="扫码资源" name="first">
              <div class="tabelHeader">
                <el-select v-model="resType" placeholder="资源类型" size="small" style="width:100px;" @change="resTypeChange">
                    <el-option v-for="type in resTypes" :key="type.type" :label="type.name" :value="type.type"></el-option>
                </el-select>
                <el-row class="operateBtn">
                  <el-button size="small" @click="resQrcode">资源码</el-button>
                  <el-button size="small" v-if="isCatalog===false" @click="exportExcel">导出</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="handleSearchRes">找资源</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="uploadRes">上传资源</el-button>
                </el-row>
              </div>
              <el-table :data="bookResData" border v-loading="loading.bookResLoading" 
                :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
                <el-table-column label="文件类型" prop="resType" align="center">
                  <template slot-scope="scope">
                    <span>{{formatResType(scope.row)}}</span>
                  </template>   
                </el-table-column>
                <el-table-column label="资源" prop="resName" align="center">
                  <template slot-scope="scope">
                    <span @click="handleViewRes(scope.row)" style="cursor:pointer">{{scope.row.resName}}</span>
                  </template>   
                </el-table-column>
                <el-table-column prop="matchPicUrl" label="资源码" align="center" width="180">
                  <div slot-scope="scope" v-if="scope.row.resType == 3 && scope.row.matchPicUrl">
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click">
                      <img :src="scope.row.matchPicUrl" alt="" style="width:500px;">
                      <i slot="reference" class="el-icon-picture" style="font-size:30px;cursor: pointer;"></i>
                    </el-popover>
                  </div>
                  <div slot-scope="scope" v-else-if="scope.row.qrcode">
                    <el-popover
                      placement="top-start"
                      title="资源码"
                      trigger="click">
                      <div style="text-align:center;">{{textbook.tb_num}}-{{scope.row.qrcodeNickname}}</div> 
                      <qrcode :value="`${baseUrlV2}/Resource/r/${scope.row.qrcode}`" :options="{ width: 200 }"></qrcode>
                      <i slot="reference" class="el-icon-picture" style="font-size:30px; cursor: pointer;"></i>
                    </el-popover>
                  </div>
                </el-table-column>
                <el-table-column label="资源展示名" prop="matchpicname" align="center">
                  <template slot="header">
                    资源展示名
                    <el-tooltip class="item" effect="dark" placement="top" style="color:#333333;font-size:16px;cursor:pointer">
                      <div slot="content">资源在APP的教材资源里的名称</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </template>  
                  <template slot-scope="scope">
                    {{scope.row.matchpicname}}
                  </template>
                </el-table-column>
                <el-table-column label="页码" prop="resPage" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editBookRes(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" v-if="scope.row.memberId === uid && scope.row.resType === 2" @click.native="showSnapshot(scope.row)">视频封面</el-button>
                    <el-button type="text" size="small" @click="delBookRes(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="bookResData.length" class="right-footer-first">
                  从{{(resPage.page-1)*resPage.pagesize+1}}到{{(resPage.page-1)*resPage.pagesize+bookResData.length}}记录，共{{resPage.total}}条
                </div>
                <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
                <el-pagination layout="prev, pager, next, jumper" :total="resPage.total" :page-size="resPage.pagesize" :current-page.sync="resPage.page" background @current-change="loadBookRes"></el-pagination>
              </div>
            </el-tab-pane> -->
            <el-tab-pane label="习题" name="second">
              <div class="tabelHeader">
                <el-row class="operateBtn">
                  <!-- <el-button size="small" :disabled="deleteTests.length==0" @click="deleteTestsClick">批量删除</el-button> -->
                  <el-button size="small" @click="handleSearchTest(2)"
                    >找题</el-button
                  >
                  <!-- <el-button size="small" v-if="isCatalog===true" @click="uploadTestsClick">批量上传</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="addSubject">单题录入</el-button> -->
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
                <!-- <el-table-column type="selection" align="center"></el-table-column> -->
                <el-table-column label="标签" align="center" width="140px">
                  <template slot-scope="scope">
                    {{ scope.row.subjectBankInfo.uniqueId }}
                  </template>
                </el-table-column>
                <el-table-column label="题目类型" align="center" width="100px">
                  <template slot-scope="scope">
                    {{ formatType(scope.row.subjectBankInfo) }}
                  </template>
                </el-table-column>
                <el-table-column label="难度" align="center" width="60px">
                  <template slot-scope="scope">
                    {{ formatDiff(scope.row.subjectBankInfo) }}
                  </template>
                </el-table-column>
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between">
                      <div
                        class="subject-title"
                        v-html="scope.row.subjectBankInfo.briefTitle"
                      ></div>
                      <el-button
                        size="mini"
                        type="text"
                        @click="
                          preview(
                            scope.$index,
                            testList[scope.$index].subjectBankInfo
                          )
                        "
                        >预览</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  label="页码"
                  prop="page"
                  align="center"
                  width="60px"
                ></el-table-column> -->
                <el-table-column label="日期" align="center" width="100px">
                  <template slot-scope="scope">
                    {{ formatTestDate(scope.row.createtime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <!-- <el-button
                      v-if="scope.row.tSubject==10 || scope.row.tSubject==11" 
                      size="mini" 
                      type="text"
                      @click="showSubList(scope.$index, scope.row)">附属题目</el-button> -->
                    <!-- <el-button
                      size="mini"
                      type="text"
                      @click="editQuestion(scope.$index, scope.row)">编辑</el-button> -->
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
            <!-- <el-tab-pane label="教材习题" name="third">
              <span slot="label">教材习题
                <el-tooltip class="item" effect="dark" placement="right" style="color:#333333;font-size:16px;cursor:pointer">
                  <div slot="content">教师专用</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <div class="tabelHeader">
                <el-row class="operateBtn">
                  <el-button size="small" :disabled="deleteSubjects.length==0" @click="deleteTestsClick">批量删除</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="handleSearchTest(3)">找题</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="uploadTestsClick">批量上传</el-button>
                  <el-button size="small" v-if="isCatalog===true" @click="addSubject">单题录入</el-button>
                </el-row>
              </div>
              <el-table :data="subjectList" border v-loading="loading.subjectsLoading" @selection-change="deleteSubjectsSelected"
              :header-cell-style="{'background-image':'linear-gradient(-180deg, #F2F3F7 0%, #DEE5ED 100%)','color':'#333333','height':'40px','padding':'0'}">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="标签" align="center" prop="uniqueId" width="140px"></el-table-column>
                <el-table-column label="题目类型" align="center" prop="tSubject" :formatter="formatType" width="100px"></el-table-column>
                <el-table-column label="难度" prop="difficultyLevel" align="center" width="60px" :formatter="formatDiff"></el-table-column>
                <el-table-column label="题目" align="center">
                  <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between">
                      <div class="subject-title" v-html="scope.row.briefTitle"></div>
                      <el-button size="mini" type="text" @click="preview(scope.$index ,subjectList[scope.$index])">预览</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="日期" align="center" width="100px">
                  <template slot-scope="scope">
                    {{formatTestDate(scope.row.getTime)}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.tSubject==10 || scope.row.tSubject==11" 
                      size="mini" 
                      type="text"
                      @click="showSubList(scope.$index, scope.row)">附属题目</el-button>
                    <el-button
                      v-if="isEditable(scope.row)"
                      size="mini"
                      type="text"
                      @click="editSubject(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="deleteTest(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tabelFooter">
                <div v-if="subjectList.length" class="right-footer-first">
                  从{{(subjectsPage.page-1)*subjectsPage.pageSize+1}}到{{(subjectsPage.page-1)*subjectsPage.pageSize+subjectList.length}}记录，共{{subjectsPage.total}}条
                </div>
                <div v-else class="right-footer-first"  ref="footerCount">从0到0条记录，共0条</div>
                <el-pagination layout="prev, pager, next, jumper" :total="subjectsPage.total" :page-size="subjectsPage.pageSize" :current-page.sync="subjectsPage.page" background @current-change="loadBookSubjects"></el-pagination>
              </div>
            </el-tab-pane> -->
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
              {{
                ruleCatalogForm.catalogid.length == 0 ? "新建节点" : "修改节点"
              }}
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
          <el-form-item label="节点名称" prop="catelogcontent">
            <el-input
              v-model="ruleCatalogForm.catelogcontent"
              maxlength="200"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :model="ruleCatalogForm"
          :rules="newCatalogRules"
          ref="ruleCatalogForm"
          label-width="90px"
          class="demo-ruleForm"
          style="margin:0 90px;"
          @submit.native.prevent
        >
          <el-form-item label="页码" prop="page">
            <el-input
              type="number"
              v-model.number="ruleCatalogForm.page"
              maxlength="10"
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
        width="600px"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>上传资源</div>
          </div>
        </template>
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
          <el-form-item label="资源展示名" prop="matchPicName">
            <el-input
              v-model.trim="uploadResForm.matchPicName"
              size="small"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="图例" prop="resNum">
            <el-input v-model="uploadResForm.resNum" size="small"></el-input>
          </el-form-item>
          <el-form-item label="位置页码" prop="resPage">
            <el-input v-model="uploadResForm.resPage" size="small"></el-input>
          </el-form-item>
          <el-form-item label="选择二维码">
            <el-select v-model="uploadResForm.id" style="display:block;">
              <el-option
                v-for="item in qrcodeSelectList"
                :key="item.id"
                :label="item.qrcodeNickname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
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
          <el-form-item>
            <el-button type="primary" @click="creatQrcode">生成</el-button>
          </el-form-item>
        </el-form>
        <el-button
          type="success"
          @click="handleExportQrcode"
          size="small"
          v-if="qrcodeData.length > 0"
          style="float:right;margin-bottom:5px;"
          >导出</el-button
        >
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
          <el-table-column label="编号" align="center">
            <div slot-scope="scope" class="info">
              {{ textbook.tb_num + "-" + scope.row.qrcodeNickname }}
            </div>
          </el-table-column>
          <el-table-column prop="matchPicUrl" label="资源码" align="center">
            <div slot-scope="scope">
              <el-popover placement="top-start" title="资源码" trigger="click">
                <div style="text-align:center;">
                  {{ textbook.tb_num }}-{{ scope.row.qrcodeNickname }}
                </div>
                <qrcode
                  :value="`${baseUrlV2}/Resource/r/${scope.row.qrcode}`"
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
          ></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
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
          <!-- <el-form-item label="ID">{{editResForm.resourceId}}</el-form-item>
          <el-form-item label="标签">{{editResForm.uniqueId}}</el-form-item> -->
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
          <el-form-item label="资源展示名" prop="matchPicName">
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
              v-model="editResForm.matchPicName"
              size="small"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="图序" prop="resName">
            <el-input v-model="editResForm.resNum" size="small"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="位置页码" prop="resName">
            <el-input v-model="editResForm.resPage" size="small"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="资源码" v-if="editResForm.resType != 3">
            <el-select v-model="editResForm.tmpId" style="display:block;">
              <el-option v-for="item in qrcodeSelectList" :key="`edit-${item.id}`" :label="item.qrcodeNickname" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
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
    </el-container>
    <el-container class="chapterInfoBtm">
      <el-header style="display:none">
        <el-row>
          <el-col :span="11">
            <div class="materialTitle">
              教师课件包
              <div>课件包是提供教师下载的内容</div>
            </div>
            <div class="materialBody">
              <div v-if="teaCourseWare.id" style="font-size:14px">
                <span>{{ teaCourseWare.resName }}</span>
                <span style="margin-left:15px">{{
                  materialSize(teaCourseWare.resSize)
                }}</span>
                <span style="margin:0 20px;">{{
                  materialTime(teaCourseWare.created)
                }}</span>
                <i
                  class="el-icon-close"
                  style="cursor:pointer"
                  @click="deleteMaterial(0, teaCourseWare.id)"
                ></i>
              </div>
              <div v-else>
                <span style="color:#666666;margin-left:15px;font-size:12px;"
                  >您还没有上传教师课件包</span
                >
                <el-button
                  type="primary"
                  @click="handleUploadMaterial(0)"
                  class="el-icon-plus"
                  size="mini"
                  ><span style="margin-left:6px">上传</span></el-button
                >
              </div>
            </div>
          </el-col>
          <el-col :span="2">
            <div
              style="width:1px;background-color: #333;height:90px;margin-left:50%;margin-top:10px;"
            ></div>
          </el-col>
          <el-col :span="11">
            <div class="materialTitle">
              学习素材包
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
                <el-button
                  type="primary"
                  @click="handleUploadMaterial(1)"
                  class="el-icon-plus"
                  size="mini"
                  ><span style="margin-left:6px">上传</span></el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- 上传课程配套素材 -->
      <el-dialog
        :visible.sync="isMaterialShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :before-close="closeMaterial"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>{{ isTeaAndStu == 0 ? "教师课件包" : "学习素材包" }}</div>
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
            @click="doUploadMaterial"
            :loading="loading.materialLoading"
            >确定</el-button
          >
          <el-button size="small" @click="doCancelMaterial">{{
            loading.materialLoading ? "取消上传" : "取消"
          }}</el-button>
        </span>
      </el-dialog>

      <!-- 上传电子书内容图片 -->
      <el-dialog
        :visible.sync="isUploadShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
      >
        <template slot="title">
          <div>
            <div></div>
            <div>电子书上传</div>
          </div>
        </template>
        <el-scrollbar style="height:400px;">
          <el-upload
            ref="uploadFiles"
            action="#"
            :auto-upload="false"
            accept="image/png, image/jpeg"
            :file-list="fileList"
            :on-change="fileChange"
            :multiple="true"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="clearUploadedImage"
              >清空</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过10M
            </div>
          </el-upload>
        </el-scrollbar>
        <span slot="footer">
          <el-button size="small" type="primary" @click="uploadPhoto"
            >确定上传</el-button
          >
          <el-button size="small" @click="isUploadShow = false">取消</el-button>
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
import popver from "./epopver";
import COS from "cos-js-sdk-v5";
import Vod from "vod-js-sdk-v6";
import preview from "@/views/tiku/previewSubject";
import viewRes from "@/components/viewRes";
import $ from "jquery";
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {
    popver,
    "jd-dialog": jdialog,
    "jd-math": math,
    fileModal,
    preview,
    viewRes,
    ElImageViewer
  },
  props: {
    id: "",
    newCount: 1,
    activeName: ""
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
      returnType: this.$route.query.returnType, //找体找资源返回的参数
      returnImportType: this.$route.query.belongType, //导题预览返回的类型
      uid: this.$store.state.user.userId,
      textbook: {},
      resRadio: "",
      highlightCurrent: true,
      resActiveName: "five",
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
        uploadWord: false,
        uploadResFileLoading: false
      },
      catalog: [],
      currentCatalog: {},
      defaultProps: {
        children: "cataList",
        label: "catelogcontent"
      },
      ruleCatalogForm: {
        id: 1,
        catelogcontent: "",
        pId: 0,
        catalogid: 0,
        catalogParentId: 0,
        page: 1
      },
      newCatalogRules: {
        catelogcontent: [
          { required: true, message: "请输入章名称", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        page: [{ required: true, message: "请输入页码", trigger: "blur" }]
      },
      ruleResQrcodeForm: {
        num: ""
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
        matchPicName: "",
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
      diffs: common.diffs,
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
        resUrl: ""
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
        matchPicName: "",
        resNum: "",
        resPage: "",
        id: ""
      },
      uploadResRules: {
        matchPicName: [
          { required: true, message: "请输入资源展示名", trigger: "blur" }
        ]
      },
      isUploadShow: false,
      fileList: [],
      srcList: [],
      showViewer: false,
      getImgItem: {},
      ebookPage: ""
    };
  },
  watch: {
    // id: {
    //   handler(newName) {
    //     if (newName) {
    //       this.loadCatalog(newName)
    //       this.loadBookRes()
    //     }
    //   },
    //   immediate: true
    // },
    activeName: function(val) {
      if (val === "second") {
        this.initCOS();
        this.intVOD();
        // this.loadTeaMaterial()
        // this.loadStuMaterial()
        this.getEbookImg();
        this.loadCatalog();
        // this.loadBookRes();
      }
    }
  },
  mounted() {
    this.loadBookRes();
    // if (this.activeName === "second") {
    //   this.initCOS();
    //   this.intVOD();
    //   this.loadTeaMaterial()
    //   this.loadStuMaterial()
    //   this.getEbookImg();
    //   this.loadCatalog();
    // }
  },
  computed: {
    baseUrlV2() {
      return process.env.BASE_URL_V2;
    }
  },
  methods: {
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    onPreview() {
      // this.showViewer = true
    },
    getImgList(index) {
      let arr = [];
      for (let i = 0; i < this.srcList.length; i++) {
        arr.push(this.srcList[i + index].resUrl);
        if (i + index >= this.srcList.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr;
    },
    // 从找题或者找资源返回当前页执行方法
    isTestOrRes(catalog) {
      if (this.returnType == 1) {
        this.$refs.resourceTab.currentName = "five";
      }
      if (this.returnType == 2) {
        this.$refs.resourceTab.currentName = "second";
        this.loadTests();
      }
      if (this.returnType == 3) {
        this.$refs.resourceTab.currentName = "third";
      }
      if (this.$route.query.returnCatalogId) {
        catalog.forEach(element => {
          if (element.catalogid == this.$route.query.returnCatalogId) {
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
          if (element.catalogid == this.$route.query.belongId) {
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
          url: "/ebook/ebCataLog/list",
          data: {
            bookId: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.catalog = ret.data;
            // this.textbook = ret.data
            if (this.isCatalog) {
              this.$nextTick(() => {
                this.$refs.vueCatalogTree.setCurrentKey(
                  this.currentCatalog.catalogid
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
        this.loadTests();
      } else if (item.name === "third") {
        if (this.subjectList.length == 0) {
          this.loadBookSubjects();
        }
      } else if (item.name === "five") {
        this.loadBookRes();
      } else if (item.name === "zero") {
        this.getEbookImg();
      }
    },
    //新建章
    addCatalog() {
      this.ruleCatalogForm.catelogcontent = "";
      this.ruleCatalogForm.catalogid = 0;
      this.ruleCatalogForm.catalogParentId = 0;
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
            this.ruleCatalogForm.catelogcontent.split(" ").join("").length == 0
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
          if (this.ruleCatalogForm.catalogid > 0) {
            url = "/ebook/ebCataLog/update";
            data.catalogid = this.ruleCatalogForm.catalogid;
            data.id = this.ruleCatalogForm.id;
            data.catelogcontent = this.ruleCatalogForm.catelogcontent;
            data.pid = this.ruleCatalogForm.pId;
            data.bookId = this.id;
            data.catalogParentId = this.ruleCatalogForm.catalogParentId;
            data.page = this.ruleCatalogForm.page;
          } else {
            url = "/ebook/ebCataLog/insert";
            data.id = this.ruleCatalogForm.id;
            data.catelogcontent = this.ruleCatalogForm.catelogcontent;
            data.pid = this.ruleCatalogForm.pId;
            data.bookId = this.id;
            data.catalogParentId = this.ruleCatalogForm.catalogParentId;
            data.page = this.ruleCatalogForm.page;
            data.catalogid = this.ruleCatalogForm.catalogid;
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
        this.ruleCatalogForm.catelogcontent = bank.catelogcontent;
        this.ruleCatalogForm.catalogid = bank.catalogid;
        this.ruleCatalogForm.pId = bank.pid;
        this.ruleCatalogForm.catalogParentId = bank.catalogParentId;
        this.ruleCatalogForm.page = bank.page;
        this.isCatalogShow = true;
        // this.$nextTick(() => {
        //   this.$refs.ruleCatalogForm.clearValidate()
        // })
      } else if (index == "2") {
        this.ruleCatalogForm.catalogid = bank.catalogid;
        this.isDelCatalogShow = true;
      } else if (index == "4") {
        this.ruleCatalogForm.catelogcontent = "";
        this.ruleCatalogForm.catalogid = 0;
        this.ruleCatalogForm.pId = 0;
        this.ruleCatalogForm.catalogParentId = bank.catalogid;
        this.ruleCatalogForm.page = 0;
        this.isCatalogShow = true;
      } else if (index == "5") {
        this.ruleCatalogForm.catalogid = bank.catalogid;
        this.isUploadShow = true;
      }
    },
    //确定删除章
    delCatalogSure() {
      axios
        .request({
          method: "post",
          url: process.env.BASE_URL + "/ebook/ebCataLog/delete",
          data: { catalogid: this.ruleCatalogForm.catalogid }
        })
        .then(
          function(data) {
            let res = data.data;
            if (res.code == 200) {
              this.isDelCatalogShow = false;
              this.loadCatalog();
              if (
                this.ruleCatalogForm.catalogid == this.currentCatalog.catalogid
              ) {
                if (this.currentCatalog.catalogid) {
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
            id: this.id,
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
                id: this.id,
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
        "/resource/tbMatchPic/downloadTextbookAndResZip?id=" +
        this.id +
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
        "/resource/tbMatchPic/exportExcel?id=" +
        this.id +
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
          // url: "/ebook/ebMatchPic/list",
          url: "/ebook/dTbookMatchpic/list",
          data: {
            dtbookId: this.id,
            // resPage: this.ebookPage,
            // resChapter: this.currentCatalog.catalogid
            //   ? this.currentCatalog.catalogid
            //   : "",
            // businessType: this.resType,
            pageNo: this.resPage.page,
            pageSize: this.resPage.pagesize
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.bookResData = ret.data.records;
            this.resPage.total = ret.data.total;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
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
      this.editResForm.matchPicName = row.matchPicName
        ? row.matchPicName
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
          url: "/ebook/dTbookMatchpic/update",
          data: {
            dtbookId: this.id,
            id: this.editResForm.tmpId
              ? this.editResForm.tmpId
              : this.editResForm.id,
            // oldId: this.editResForm.oldId,
            // resChapter: this.editResForm.resChapter,
            // resourceId: this.editResForm.resourceId,
            // matchPicId: this.editResForm.matchPicId
            //   ? this.editResForm.matchPicId
            //   : "",
            matchPicName: this.editResForm.matchPicName,
            resName: this.editResForm.resName,
            resNum: this.editResForm.resNum ? this.editResForm.resNum : "",
            resPage: this.editResForm.resPage ? this.editResForm.resPage : ""
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.loadBookRes();
            this.isBookResShow = false;
          } else {
            this.$message({
              type: "warning",
              message: ret.msg
            });
          }
        });
    },
    //删除资源事件
    delBookRes(row) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .request({
              method: "post",
              url: "/ebook/dTbookMatchpic/delete",
              data: {
                id: row.id
                // bookId: this.id
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
    //table资源类型
    formatResType(row) {
      return common.resTypeFormat(row.businessType);
    },
    resTypeChange() {
      this.resPage.page = 1;
      this.loadBookRes();
    },
    // 点击章节item
    handleNodeClick(bank) {
      this.isCatalog = true;
      this.highlightCurrent = true;
      this.ebookPage = "";
      if (bank.catalogid === this.currentCatalog.catalogid) {
        return;
      }
      this.currentCatalog = bank;
      let current = this.$refs.resourceTab.currentName;
      if (current === "five") {
        this.resType = "";
        this.resPage.page = 1;
        this.loadBookRes();
      } else if (current === "second") {
        this.testPage.page = 1;
        this.loadTests();
      } else if (current === "third") {
        this.subjectsPage.page = 1;
        this.loadBookSubjects();
      } else if (current === "zero") {
        this.getEbookImg(bank);
      }
    },
    // 点击图书名
    clickBook() {
      if (this.currentCatalog.catalogid) {
        this.currentCatalog = {};
        this.resType = "";
        this.isCatalog = false;
        this.highlightCurrent = false;
        let current = this.$refs.resourceTab.currentName;
        if (current === "five") {
          this.resType = "";
          this.resPage.page = 1;
          this.loadBookRes();
        } else if (current === "second") {
          this.testPage.page = 1;
          this.loadTests();
        } else if (current === "third") {
          this.subjectsPage.page = 1;
          this.loadBookSubjects();
        } else if (current === "zero") {
          this.getEbookImg();
        }
      }
    },
    //上传资源
    uploadRes() {
      // 清空 常规资源表单
      if (
        this.uploadResForm.percentage >= 100 ||
        this.uploadResForm.percentage <= 0
      ) {
        this.uploadResForm.resName = "";
        this.uploadResForm.matchPicName = "";
        this.uploadResForm.resType = "";
        this.uploadResForm.id = "";
        this.uploadResForm.resNum = "";
        this.uploadResForm.resPage = "";
        this.uploadResForm.showProgress = false;
        this.uploadResForm.percentage = 0;
        this.$nextTick(res => {
          if (this.$refs.uploadResfileModal) {
            this.$refs.uploadResfileModal.clearFile();
          }
        });
      }
      this.loadUnusedQrcode();
      this.isUploadResShow = true;
      this.$nextTick(() => {
        this.$refs.uploadResForm.clearValidate();
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
        this.uploadResForm.matchPicName = file.name.substring(
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
            resUrl: this.uploadResForm.resUrl,
            resSize: this.uploadResForm.resSize,
            resType: this.uploadResForm.resType,
            resName: this.uploadResForm.resName,
            matchPicName: this.uploadResForm.matchPicName,
            resNum: this.uploadResForm.resNum,
            resPage: this.uploadResForm.resPage,
            cloudId: this.uploadResForm.cloudId,
            tbId: this.id,
            resChapter: this.currentCatalog.catalogid
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
      console.log(this.currentCatalog.catalogid);
      this.$router.push({
        path: "/epub-publication/epubSearchRes",
        query: {
          id: this.id,
          catalogId: this.currentCatalog.catalogid
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
            id: this.id
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
          url: "/ebook/dTbookSubjectBank/list",
          data: {
            dtbookId: this.id,
            type: 1, // 0:试卷1:习题
            // page:"", // 资源在书籍中的页码
            // page: 1,
            pageNo: this.testPage.page,
            pageSize: this.testPage.pageSize
          }
        })
        .then(
          function(data) {
            this.loading.bookTestLoading = false;
            let res = data.data;
            if (res.code == 200) {
              this.testList = res.data.records;
              this.testPage.total = res.data.total;
              this.deleteTests = [];
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
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
    editQuestion(index, row) {
      console.log("暂不能编辑");
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
        form.difficultyLevel = this.subjectForm.difficultyLevel;
        form.options = this.subjectForm.answerList;
        form.options = JSON.stringify(form.options);
        var url;
        let current = this.$refs.resourceTab.currentName;
        if (this.subjectForm.id > 0) {
          form.id = this.subjectForm.id;
          url = "/v1/subjectBank/updateTKExercise";
        } else {
          url = "/v1/bookSbLib/addTbOrTestExercise";
          form.catId = this.currentCatalog.catalogid;
          form.tbId = this.id;
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
      this.deleteTestSure(row.id);
    },
    deleteTestSure(ids) {
      this.$confirm("题目删除后不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/ebook/dTbookSubjectBank/delete";

          axios
            .request({
              method: "post",
              url: url,
              data: {
                id: ids
              }
            })
            .then(res => {
              let ret = res.data;
              if (ret.code === 200) {
                if (
                  this.testPage.page != 1 &&
                  (this.testList.length == 1 ||
                    this.deleteTests.length == this.testList.length)
                ) {
                  this.testPage.page--;
                }
                this.loadTests();
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
    // 找题
    handleSearchTest(turnType) {
      this.$router.push({
        path: "/epub-publication/epubSearchTest",
        query: {
          id: this.id,
          catalogid: this.currentCatalog.catalogid,
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
                    belongId: this.currentCatalog.catalogid,
                    belongType: belongType, //1题库 2教材题 3自测题
                    id: this.id
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
      if (row.review != 1 && row.uid === uid) {
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
            id: this.id,
            chapterId: this.currentCatalog.catalogid
              ? this.currentCatalog.catalogid
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
            id: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.teaCourseWare = ret.data;
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
            id: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            this.stuCourseWare = ret.data;
          }
        });
    },
    // 显示上传素材弹框
    handleUploadMaterial(flag) {
      this.isTeaAndStu = flag;
      this.materialForm.showProgress = false;
      this.materialForm.file = null;
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
      this.materialForm.file = file;
    },
    //上传素材
    doUploadMaterial() {
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
                    id: this.id,
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
                  this.teaCourseWare = {};
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
    clearUploadedImage() {
      this.$refs.uploadFiles.clearFiles();
    },
    // 选择电子书
    fileChange(file, fileList) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 < 1024 < 10;
      if (!isJPG) {
        this.$message.error("选择单张图片只能是 JPG 或者 png 格式!");
        fileList.pop();
      }
      if (!isLt2M) {
        this.$message.error("选择单张图片大小不能超过 10M!");
        fileList.pop();
      }
    },
    // 上传电子书
    uploadPhoto() {
      this.fileList = this.$refs.uploadFiles.uploadFiles;
      for (let i of this.fileList) {
        let arr = i.name.match(/\d+(\.\d+)?/g);
        if (isNaN(arr[arr.length - 1])) {
          this.$message.error(
            '"' + i.name + '"' + "文件名称不符合规范请重新上传"
          );
          return;
        }
      }
      // let submitNum = 0;
      for (let i = 0; i < this.fileList.length; i++) {
        let json = this.fileList[i];
        let arr = json.name.match(/\d+(\.\d+)?/g);
        let data = new FormData();
        data.append("page", arr[arr.length - 1]);
        data.append("bookId", this.id);
        data.append("nodeId", this.ruleCatalogForm.catalogid);
        data.append("file", json.raw);
        axios
          .request({
            method: "post",
            url: "/ebook/ebookImg/insert",
            data: data
          })
          .then(res => {
            let ret = res.data;
            if (ret.code === 200) {
              this.getEbookImg(this.getImgItem);
              this.clearUploadedImage();
              // this.isUploadShow = false
            } else {
              this.$message.warning(ret.msg);
            }
            // submitNum = submitNum + 1
            // console.log(i)
            // if(i === this.fileList.length) {
            //   if(this.fileList.length === submitNum) {
            //     this.$message.success('全部文件上传成功');
            //     this.getEbookImg(this.getImgItem)
            //     this.isUploadShow = false
            //   }else {
            //     this.$message.info('上传成功' + submitNum + "张, 失败" + (this.fileList.length - submitNum) + "张");
            //     this.getEbookImg(this.getImgItem)
            //   }
            // }
            // this.$refs.uploadFiles.uploadFiles.splice(i, 1);
          });
      }
    },
    // 根据节点获取电子书
    getEbookImg(bank = {}) {
      this.getImgItem = bank;
      let data = {};
      if (JSON.stringify(bank) == "{}") {
        data.nodeId = this.currentCatalog.catalogid
          ? this.currentCatalog.catalogid
          : "";
        data.bookId = this.id;
      } else {
        data.nodeId = bank.catalogid;
        data.bookId = bank.bookId;
      }
      data.pageSize = 100;
      data.pageNo = 1;
      axios
        .request({
          method: "post",
          url: "/ebook/ebookImg/list",
          data: data
        })
        .then(res => {
          let ret = res.data;
          this.srcList = ret.data.records;
          this.$nextTick(() => {
            $(".image_div")
              .mouseenter(function() {
                $(this)
                  .find(".mask_div")
                  .show();
              })
              .mouseleave(function() {
                $(this)
                  .find(".mask_div")
                  .hide();
              });
          });
        });
    },
    // 删除电子书
    deleImage(item) {
      axios
        .request({
          method: "post",
          url: "/ebook/ebookImg/delete",
          data: { id: item.id }
        })
        .then(res => {
          this.$message.success("删除成功");
          this.getEbookImg(this.getImgItem);
        });
    },
    // 资源
    goEbookRes(item) {
      this.ebookPage = item.page;
      this.loadBookRes();
      this.resActiveName = "five";
    },
    // 查看实体书资源
    lookBookRes() {
      axios
        .request({
          method: "post",
          url: "/ebook/ebook/detail",
          data: {
            id: this.id
          }
        })
        .then(res => {
          let ret = res.data;
          if (ret.code === 200) {
            // if (ret.data.textbookId !== "") {
            //   this.$router.push({
            //     path: "/publication/bookInfo",
            //     query: {
            //       textbookId: ret.data.textbookId
            //     }
            //   });
            // } else {
            //   this.$message.warning("请先关联实体书");
            // }
          }
        });
    }
  }
};

// $(".image_div").mouseover(function() {
//   console
//   // $(".mask_div").show()
// });
// window.onload = function() {
//     var image_div = document.getElementsByClassName('image_div');
//     console.log(image_div)
//     // var div1 = document.getElementById('div1');
//     // input1.onmouseover = function() {
//     //     div1.style.display = 'block';
//     // }
//     // input1.onmouseout = function() {
//     //     div1.style.display = 'none';
//     // }
// }
</script>

<style lang="scss">
.epub-Resource {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 75px;
    height: 106px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-upload-list__item .el-icon-close {
    right: 20px;
  }
  .el-image-viewer__mask {
    opacity: 0.05;
  }
  .image_div {
    margin: 5px;
    display: inline-block;
    position: relative;
    border: 1px solid #999999;
    cursor: pointer;
  }
  .mask_page {
    position: absolute;
    width: 40px;
    height: 25px;
    left: 0;
    bottom: 0;
    z-index: 999;
    background: #999999;
    opacity: 1;
    text-align: center;
    color: #fff;
    line-height: 25px;
  }
  .mask_div {
    display: none;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    top: 0;
    z-index: 999;
    background: #999999;
    opacity: 0.8;
    text-align: center;
    padding: 0 20px;
    .el-button {
      color: #ffffff;
    }
  }
  .bookResourceTop {
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
      .el-tree .custom-tree-node > span {
        display: inline-block;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-tree
        > .el-tree-node
        > .el-tree-node__content
        > .custom-tree-node
        > span:first-child {
        display: inline-block;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
        font-weight: bold;
      }
      // .el-tree-node__content{
      //   padding-left: 12px !important;
      // }
      // .el-tree-node__expand-icon{
      //   display: none;
      // }
      .el-tree-node__content {
        height: 46px;
        border-bottom: 1px solid #eaeaea;
        .el-tree-node__expand-icon {
          margin-left: 2px;
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
        .el-tabs__header {
          padding-left: 10px;
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
    .el-header {
      background: #ffffff;
      margin: 0;
      padding: 0;
      margin-top: 20px;
      padding-left: 20px;
      line-height: 20px;
      height: 110px !important;
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
